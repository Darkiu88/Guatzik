import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SystemMode = 'dashboard' | 'geosec' | 'mediacore' | 'hardwarelink';

interface SystemState {
  mode: SystemMode;
  vpnActive: boolean;
  spotifyPlaying: boolean;
  cpuLoad: number;
  ramPercent: number;
  ramUsed: number;
  ramTotal: number;
  diskPercent: number;
  netSpeed: number;
}

interface SystemContextType {
  state: SystemState;
  setMode: (mode: SystemMode) => void;
  toggleVPN: () => void;
  toggleSpotify: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SystemState>({
    mode: 'dashboard',
    vpnActive: false,
    spotifyPlaying: true,
    cpuLoad: 0,
    ramPercent: 0,
    ramUsed: 0,
    ramTotal: 0,
    diskPercent: 0,
    netSpeed: 0,
  });

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
    // ----------------------------------------------------
    // 1. DETECCIÓN AUTOMÁTICA DE IP
    // Toma la IP que estás usando en el navegador (Wifi o Tailscale)
    const ipActual = window.location.hostname;
    const wsUrl = `ws://${ipActual}:8000/ws/system`;

    console.log(`[GUATZIK] Intentando conectar a: ${wsUrl}`);
    // ----------------------------------------------------

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[GUATZIK] ✅ Conexión establecida.');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        setState((prev) => ({
          ...prev,
          cpuLoad: data.cpu_load || 0,
          ramPercent: data.ram_percent || 0,
          ramUsed: data.ram_used_gb || 0,
          ramTotal: data.ram_total_gb || 0,
          diskPercent: data.disk_percent || 0,
          netSpeed: data.net_speed_mb || 0,
        }));
      } catch (e) {
        console.error("Error al procesar datos", e);
      }
    };

    ws.onerror = (error) => {
      console.error("[GUATZIK] ❌ Error de conexión:", error);
    };

    // Limpieza al salir de la pantalla
    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, []);
  return (
    <SystemContext.Provider value={{ state, setMode, toggleVPN, toggleSpotify }}>
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