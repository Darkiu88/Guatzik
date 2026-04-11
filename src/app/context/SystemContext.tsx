import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SystemMode = 'dashboard' | 'geosec' | 'mediacore' | 'hardwarelink';

// Interfaz para los procesos individuales que manda Python
interface ProcessData {
  name: string;
  cpu: number;
}

// Interfaz para las descargas reales
interface DownloadData {
  name: string;
  progress: number;
  speed: string;
}

interface SystemState {
  mode: SystemMode;
  vpnActive: boolean;
  spotifyPlaying: boolean;
  cpuLoad: number;
  cpuTemp: number;
  topProcesses: ProcessData[];
  downloads: DownloadData[]; // ✅ 1. Agregado a la interfaz
  ramPercent: number;
  ramUsed: number;
  ramTotal: number;
  diskPercent: number;
  netSpeed: number;
  netUp: number;
  netDown: number;
  printerInkLow: boolean;
}

interface SystemContextType {
  state: SystemState;
  setMode: (mode: SystemMode) => void;
  toggleVPN: () => void;
  toggleSpotify: () => void;
  clearDownloads: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SystemState>({
    mode: 'dashboard',
    vpnActive: false,
    spotifyPlaying: true,
    cpuLoad: 0,
    cpuTemp: 0,
    topProcesses: [],
    downloads: [], // ✅ 2. Inicializado vacío
    ramPercent: 0,
    ramUsed: 0,
    ramTotal: 0,
    diskPercent: 0,
    netSpeed: 0,
    netUp: 0,
    netDown: 0,
    printerInkLow: false,
  });

  const clearDownloads = () => {
  setState((prev) => ({ ...prev, downloads: [] }));
};

  const setMode = (mode: SystemMode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const toggleVPN = () => {
    setState((prev) => ({ ...prev, vpnActive: !prev.vpnActive }));
  };

  const toggleSpotify = () => {
    setState((prev) => ({ ...prev, spotifyPlaying: !prev.spotifyPlaying }));
  };

  useEffect(() => {
    const ipActual = window.location.hostname;
    const wsUrl = `ws://${ipActual}:8000/ws/system`;

    console.log(`[GUATZIK] Conectando a: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        setState((prev) => ({
          ...prev,
          cpuLoad: data.cpu_load || 0,
          cpuTemp: data.cpu_temp || 0,
          topProcesses: data.top_processes || [],
          downloads: data.downloads || [], // ✅ 3. Mapeo de datos desde Python
          ramPercent: data.ram_percent || 0,
          ramUsed: data.ram_used_gb || 0,
          ramTotal: data.ram_total_gb || 0,
          diskPercent: data.disk_percent || 0,
          netUp: data.net_up_mb || 0,
          netDown: data.net_down_mb || 0,
          netSpeed: (data.net_up_mb + data.net_down_mb) || 0,
        }));
      } catch (e) {
        console.error("Error al procesar datos del servidor", e);
      }
    };

    ws.onopen = () => console.log('[GUATZIK] ✅ Online');
    ws.onerror = (e) => console.error("[GUATZIK] ❌ Error de conexión:", e);

    return () => { 
      if (ws.readyState === 1) ws.close(); 
    };
  }, []);

  return (
    <SystemContext.Provider value={{ state, setMode, toggleVPN, toggleSpotify, clearDownloads }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within SystemProvider');
  }
  return context;
}