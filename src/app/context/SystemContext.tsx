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
  netUp: number;   // Subida (Celeste)
  netDown: number; // Bajada (Verde)
  printerInkLow: boolean;
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
    // 👇 1. IMPORTANTE: Inicializar en 0 para evitar errores
    netUp: 0,
    netDown: 0,
    printerInkLow: false,
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
    // DETECCIÓN AUTOMÁTICA DE IP
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

        // ESTA LÍNEA ES VITAL PARA VER QUÉ LLEGA
        console.log("DATOS RECIBIDOS:", data);

        setState((prev) => ({
          ...prev,
          cpuLoad: data.cpu_load || 0,
          cpuTemp: data.cpu_temp || 0, // <--- ESTO ES LO QUE TE FALTA
          ramPercent: data.ram_percent || 0,
          // ... resto de variables
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