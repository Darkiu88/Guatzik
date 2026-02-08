import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function NetworkWave() {
  const [points, setPoints] = useState<number[]>([]);

  useEffect(() => {
    const generatePoints = () => {
      const newPoints = Array.from({ length: 50 }, (_, i) => {
        const x = (i / 50) * 100;
        const wave1 = Math.sin((i / 50) * Math.PI * 4 + Date.now() / 500) * 15;
        const wave2 = Math.sin((i / 50) * Math.PI * 2 + Date.now() / 800) * 10;
        return 50 + wave1 + wave2;
      });
      setPoints(newPoints);
    };

    generatePoints();
    const interval = setInterval(generatePoints, 50);
    return () => clearInterval(interval);
  }, []);

  const pathData = points.length > 0
    ? `M 0 50 ${points.map((y, i) => `L ${(i / points.length) * 100} ${y}`).join(' ')} L 100 50 Z`
    : '';

  const lineData = points.length > 0
    ? `M 0 ${points[0]} ${points.map((y, i) => `L ${(i / points.length) * 100} ${y}`).join(' ')}`
    : '';

  return (
    <div className="relative w-full h-16 mt-4">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Reference Grid Lines (Horizontal scales) */}
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00FF41" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines for reference (0MB, 50MB, 100MB scales) */}
        {[20, 40, 60, 80].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(0, 255, 65, 0.1)"
            strokeWidth="0.3"
          />
        ))}

        {/* Vertical grid lines */}
        {[20, 40, 60, 80].map((x) => (
          <line
            key={x}
            x1={x}
            y1="0"
            x2={x}
            y2="100"
            stroke="rgba(0, 255, 65, 0.05)"
            strokeWidth="0.3"
          />
        ))}

        {/* Area fill (volumetric gradient) */}
        <motion.path
          d={pathData}
          fill="url(#waveGradient)"
        />

        {/* Waveform line (main signal) */}
        <motion.path
          d={lineData}
          fill="none"
          stroke="#00FF41"
          strokeWidth="1"
          style={{
            filter: 'drop-shadow(0 0 3px #00FF41)',
          }}
        />
      </svg>

      {/* Scale labels */}
      <div className="absolute top-0 left-0 text-[8px] font-mono text-[#00FF41] opacity-40">
        100MB/s
      </div>
      <div className="absolute bottom-0 left-0 text-[8px] font-mono text-[#00FF41] opacity-40">
        0MB/s
      </div>

      {/* Overlay stats */}
      <div className="absolute top-0 right-0 text-xs font-mono text-[#00FF41]">
        TRÁFICO EN TIEMPO REAL
      </div>
    </div>
  );
}