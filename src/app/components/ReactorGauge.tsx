import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ReactorGaugeProps {
  percentage: number;
  voltage: string;
  threads: number;
  governor: string;
}

export function ReactorGauge({ percentage, voltage, threads, governor }: ReactorGaugeProps) {
  // Generate historical CPU data (mountain chart)
  const [historyData, setHistoryData] = useState<number[]>([]);

  useEffect(() => {
    // Initialize with random data simulating CPU history
    const data = Array.from({ length: 60 }, () => Math.random() * 60 + 20);
    setHistoryData(data);

    const interval = setInterval(() => {
      setHistoryData((prev) => [...prev.slice(1), Math.random() * 60 + 20]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const topProcesses = [
    { name: 'DOCKER_CONTAINER', usage: 12 },
    { name: 'PYTHON_SCRIPT_V2', usage: 8 },
    { name: 'SYSTEM_KERNEL', usage: 4 },
    { name: 'NODE_SERVER', usage: 3 },
  ];

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Historical Area Chart (Mountain) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F3FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00F3FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {historyData.length > 0 && (
          <path
            d={`M 0 100 ${historyData
              .map((value, i) => `L ${(i / historyData.length) * 100} ${100 - value}`)
              .join(' ')} L 100 100 Z`}
            fill="url(#cpuGradient)"
            stroke="#00F3FF"
            strokeWidth="0.5"
            opacity="0.6"
          />
        )}
      </svg>

      {/* Outer rotating ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border-2 border-[#00F3FF]"
        style={{
          boxShadow: '0 0 20px #00F3FF, inset 0 0 20px rgba(0, 243, 255, 0.3)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Middle glass ring */}
      <div
        className="absolute w-56 h-56 rounded-full border border-[#00F3FF]/30 backdrop-blur-sm"
        style={{
          background: 'radial-gradient(circle, rgba(0, 243, 255, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Center percentage */}
      <div className="relative z-10 text-center">
        <div
          className="text-6xl font-bold text-white"
          style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(0, 243, 255, 0.6)',
          }}
        >
          {percentage}%
        </div>
        <div className="text-xs text-[#00F3FF] mt-2 font-mono tracking-wider">
          CPU UTILIZATION
        </div>
      </div>

      {/* Top Processes List (Right Side) */}
      <div className="absolute right-4 top-1/4 space-y-1">
        <div className="text-[8px] text-[#00F3FF] font-mono tracking-wider mb-2 opacity-60">
          TOP PROCESSES
        </div>
        {topProcesses.map((process, index) => (
          <div
            key={index}
            className="text-[9px] font-mono text-gray-400 flex items-center justify-between space-x-2"
          >
            <span className="text-gray-500">{process.name}</span>
            <span className="text-[#00FF41]">{process.usage}%</span>
          </div>
        ))}
      </div>

      {/* Technical micro-typography */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-[8px] font-mono text-gray-400 pb-4 space-y-1">
        <div className="tracking-wide">VOLTAJE: {voltage} | HILOS: {threads} Activos</div>
        <div className="tracking-wide">GOBERNADOR: {governor}</div>
      </div>

      {/* Pulsing particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#00F3FF] rounded-full"
          style={{
            left: '50%',
            top: '50%',
            marginLeft: -2,
            marginTop: -2,
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI) / 4) * 140],
            y: [0, Math.sin((i * Math.PI) / 4) * 140],
            opacity: [1, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}