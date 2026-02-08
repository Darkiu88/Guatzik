import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';
import { useSystem } from '@/app/context/SystemContext';

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN' | 'SUCCESS';
  message: string;
}

const LOG_MESSAGES: LogEntry[] = [
  { timestamp: '14:23:47', level: 'SUCCESS', message: 'SYSTEM_CHECK: OK' },
  { timestamp: '14:23:48', level: 'INFO', message: 'DAEMON: Conectado' },
  { timestamp: '14:23:49', level: 'INFO', message: 'KERNEL: Cargando módulos...' },
  { timestamp: '14:23:50', level: 'SUCCESS', message: 'NETWORK: Interface eth0 UP' },
  { timestamp: '14:23:51', level: 'INFO', message: 'STORAGE: NVMe detectado' },
  { timestamp: '14:23:52', level: 'SUCCESS', message: 'SECURITY: Firewall activo' },
  { timestamp: '14:23:53', level: 'INFO', message: 'CPU: Turbo boost habilitado' },
  { timestamp: '14:23:54', level: 'INFO', message: 'MEMORY: 32GB disponible' },
];

export function MatrixConsole() {
  const { state } = useSystem();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < LOG_MESSAGES.length) {
        setLogs((prev) => [...prev, LOG_MESSAGES[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return '#FF003C';
      case 'WARN':
        return '#FFA500';
      case 'SUCCESS':
        return '#00FF41';
      case 'INFO':
      default:
        return '#00F3FF';
    }
  };

  // Contextual AI message based on current mode
  const getContextualMessage = () => {
    switch (state.mode) {
      case 'dashboard':
        return 'Sistema estable. Sugiero revisión de logs. ¿Proceder?';
      case 'geosec':
        if (state.vpnActive) {
          return 'VPN conectada. Tráfico encriptado. Latencia óptima.';
        }
        return 'VPN desconectada. Recomiendo activar protocolo de seguridad.';
      case 'mediacore':
        if (state.spotifyPlaying) {
          return 'Audio reproduciéndose. Cola de descargas activa.';
        }
        return 'Reproductor en pausa. 3 descargas en proceso.';
      case 'hardwarelink':
        if (state.printerInkLow) {
          return '[ALERTA] Nivel de tinta Magenta crítico (5%). ¿Solicitar recambio?';
        }
        return 'Todos los dispositivos operacionales. Hardware Link estable.';
      default:
        return 'Sistema en espera de comandos.';
    }
  };

  const getConsoleColor = () => {
    if (state.mode === 'hardwarelink' && state.printerInkLow) {
      return '#FFA500'; // Amber warning
    }
    return '#00FF41'; // Default green
  };

  return (
    <div className="relative">
      {/* Floating log window with strong dimming layer */}
      <div className="absolute bottom-full left-0 right-0 mb-2 h-24 overflow-hidden">
        {/* Dimming layer (85% opacity black substrate) */}
        <div className="absolute inset-0 bg-black opacity-85" />
        
        <div className="relative flex flex-col-reverse h-full space-y-reverse space-y-1 px-4 py-2">
          {logs.slice(-4).reverse().map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono leading-relaxed flex items-center space-x-2"
            >
              {/* Timestamp - Gray/Dim */}
              <span
                className="opacity-50"
                style={{ color: '#808080' }}
              >
                [{log.timestamp}]
              </span>
              
              {/* Level - Colored based on type */}
              <span
                className="font-bold"
                style={{
                  color: getLevelColor(log.level),
                  textShadow: `0 0 5px ${getLevelColor(log.level)}`,
                }}
              >
                [{log.level}]
              </span>
              
              {/* Message - White/Light Gray */}
              <span style={{ color: '#E0E0E0' }}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Console bar */}
      <div
        className="relative backdrop-blur-md bg-black/90 px-6 py-4 transition-all"
        style={{
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: getConsoleColor(),
          boxShadow: `0 -4px 20px ${getConsoleColor()}33`,
        }}
      >
        {/* AI Input */}
        <div className="flex items-center space-x-3">
          <span className="font-mono text-sm" style={{ color: getConsoleColor() }}>
            {'>'}_
          </span>
          <div className="flex-1 text-sm font-mono text-gray-300">
            <span className="text-[#00F3FF]">[IA]</span> {getContextualMessage()}
          </div>
        </div>

        {/* Scanline effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${getConsoleColor()}08 2px, ${getConsoleColor()}08 4px)`,
          }}
        />
      </div>

      {/* Microphone FAB */}
      <motion.button
        className="absolute -top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: `linear-gradient(to bottom right, ${getConsoleColor()}, ${getConsoleColor()}B0)`,
          boxShadow: `0 0 20px ${getConsoleColor()}, 0 0 40px ${getConsoleColor()}80`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Mic className="w-5 h-5 text-black" />

        {/* Pulse rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: getConsoleColor(),
            }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.button>
    </div>
  );
}