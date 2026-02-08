import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SystemMode = 'dashboard' | 'geosec' | 'mediacore' | 'hardwarelink';

// 1. AMPLIAMOS LA INTERFAZ CON TODOS LOS DATOS REALES
interface SystemState {
  mode: SystemMode;
  vpnActive: boolean;
  spotifyPlaying: boolean;
  cpuLoad: number;
  ramPercent: number;    // Nuevo
  ramUsed: number;       // Nuevo
  diskPercent: number;   // Nuevo
  netSpeed: number;      // Nuevo (MB/s)
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
    const ws = new WebSocket('ws://localhost:8000/ws/system');

    ws.onopen = () => console.log('[GUATZIK] Enlace Neuronal Establecido.');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // 2. MAPEAMOS TODOS LOS DATOS QUE VIENEN DE PYTHON
        setState((prev) => ({
          ...prev,
          cpuLoad: data.cpu_load || 0,
          ramPercent: data.ram_percent || 0,
          ramUsed: data.ram_used_gb || 0,
          diskPercent: data.disk_percent || 0,
          netSpeed: data.net_speed_mb || 0,
        }));
      } catch (e) {
        console.error("Error al procesar datos", e);
      }
    };

    return () => ws.close();
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