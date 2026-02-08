import { motion } from 'motion/react';
import { useSystem } from '@/app/context/SystemContext';
import { Printer, Projector, Lightbulb, AlertTriangle } from 'lucide-react';

export function HardwareLink() {
  const { state } = useSystem();

  const inkLevels = [
    { color: 'Cyan', level: 67, hex: '#00F3FF' },
    { color: 'Magenta', level: 5, hex: '#FF00FF' },
    { color: 'Yellow', level: 89, hex: '#FFFF00' },
    { color: 'Black', level: 34, hex: '#000000' },
  ];

  return (
    <div className="px-8 mt-8 space-y-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-3"
      >
        <Printer className="w-8 h-8 text-[#00F3FF]" />
        <h2 className="text-2xl font-bold text-white tracking-wider">
          HARDWARE-LINK <span className="text-[#00F3FF]">//</span> INGENIERÍA FÍSICA
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Printer X-Ray */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/5 to-transparent border border-[#00F3FF]/40 rounded-2xl p-6"
          style={{
            boxShadow: '0 8px 32px rgba(0, 243, 255, 0.2)',
          }}
        >
          <div className="text-sm font-mono text-[#00F3FF] mb-6 tracking-wider flex items-center justify-between">
            <span>IMPRESORA HP</span>
            {state.printerInkLow && (
              <AlertTriangle className="w-4 h-4 text-[#FF003C]" />
            )}
          </div>

          {/* Printer Outline Schematic */}
          <div className="relative h-48 mb-6 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
              {/* Blueprint grid */}
              <defs>
                <pattern id="blueprint" width="10" height="10" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#00F3FF" strokeWidth="0.2" opacity="0.3" />
                  <line x1="0" y1="0" x2="10" y2="0" stroke="#00F3FF" strokeWidth="0.2" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#blueprint)" />

              {/* Printer outline */}
              <rect x="20" y="40" width="60" height="40" fill="none" stroke="#00F3FF" strokeWidth="0.5" />
              <rect x="25" y="30" width="50" height="10" fill="none" stroke="#00F3FF" strokeWidth="0.5" />
              <line x1="30" y1="40" x2="30" y2="30" stroke="#00F3FF" strokeWidth="0.3" />
              <line x1="70" y1="40" x2="70" y2="30" stroke="#00F3FF" strokeWidth="0.3" />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <Printer className="w-16 h-16 text-[#00F3FF]" strokeWidth={1} />
            </div>
          </div>

          {/* Ink Tanks */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-gray-400 mb-2">NIVELES DE TINTA</div>
            {inkLevels.map((ink, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-gray-400">{ink.color}</span>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{
                      color: ink.level < 20 ? '#FF003C' : '#00FF41',
                    }}
                  >
                    {ink.level}%
                  </span>
                </div>
                <div className="h-8 bg-black/60 rounded border border-gray-700 overflow-hidden relative">
                  {/* Liquid fill */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${ink.level}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="absolute bottom-0 w-full"
                    style={{
                      background: `linear-gradient(180deg, ${ink.hex} 0%, ${ink.hex}80 100%)`,
                      boxShadow: `inset 0 0 10px ${ink.hex}`,
                    }}
                  />
                  {/* Glass reflection */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 bg-[#00F3FF]/20 border border-[#00F3FF] rounded font-mono text-[#00F3FF] text-sm"
          >
            [ PRINT TEST PAGE ]
          </motion.button>
        </motion.div>

        {/* Projector Keystone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/5 to-transparent border border-[#00FF41]/40 rounded-2xl p-6"
          style={{
            boxShadow: '0 8px 32px rgba(0, 255, 65, 0.2)',
          }}
        >
          <div className="text-sm font-mono text-[#00FF41] mb-6 tracking-wider">PROYECTOR 4K</div>

          {/* Keystone Grid */}
          <div className="relative h-64 mb-6 bg-black/60 rounded border border-[#00FF41]/30 overflow-hidden">
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              {/* Horizontal lines */}
              {[20, 40, 60, 80].map((y) => (
                <line
                  key={`h-${y}`}
                  x1="10"
                  y1={y}
                  x2="90"
                  y2={y}
                  stroke="#00FF41"
                  strokeWidth="0.3"
                  opacity="0.5"
                />
              ))}
              {/* Vertical lines */}
              {[25, 50, 75].map((x) => (
                <line
                  key={`v-${x}`}
                  x1={x}
                  y1="10"
                  x2={x}
                  y2="90"
                  stroke="#00FF41"
                  strokeWidth="0.3"
                  opacity="0.5"
                />
              ))}

              {/* Corner control points */}
              {[
                { x: 10, y: 10 },
                { x: 90, y: 10 },
                { x: 90, y: 90 },
                { x: 10, y: 90 },
              ].map((point, i) => (
                <motion.circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="2"
                  fill="#00FF41"
                  whileHover={{ scale: 1.5 }}
                  style={{
                    cursor: 'pointer',
                    filter: 'drop-shadow(0 0 5px #00FF41)',
                  }}
                />
              ))}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <Projector className="w-12 h-12 text-[#00FF41] opacity-30" />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400">BRILLO</span>
              <span className="text-sm font-mono text-[#00FF41]">87%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400">CONTRASTE</span>
              <span className="text-sm font-mono text-[#00FF41]">65%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-gray-400">RESOLUCIÓN</span>
              <span className="text-sm font-mono text-[#00FF41]">3840x2160</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 bg-[#FF003C]/20 border border-[#FF003C] rounded font-mono text-[#FF003C] text-sm"
          >
            [ BLACKOUT ]
          </motion.button>
        </motion.div>

        {/* Smart Lights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-md bg-gradient-to-br from-white/5 to-transparent border border-[#00F3FF]/40 rounded-2xl p-6"
          style={{
            boxShadow: '0 8px 32px rgba(0, 243, 255, 0.2)',
          }}
        >
          <div className="text-sm font-mono text-[#00F3FF] mb-6 tracking-wider">LUCES INTELIGENTES</div>

          {/* Light Bulbs */}
          <div className="space-y-4 mb-6">
            {[
              { name: 'Escritorio', on: true, color: '#00F3FF', brightness: 80 },
              { name: 'Ambiente', on: true, color: '#FF00FF', brightness: 45 },
              { name: 'Techo', on: false, color: '#FFFFFF', brightness: 0 },
            ].map((light, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-black/40 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Lightbulb
                    className="w-6 h-6"
                    style={{
                      color: light.on ? light.color : '#666666',
                      filter: light.on ? `drop-shadow(0 0 8px ${light.color})` : 'none',
                    }}
                  />
                  <div>
                    <div className="text-sm font-mono text-white">{light.name}</div>
                    <div className="text-xs font-mono text-gray-400">
                      {light.on ? `${light.brightness}%` : 'OFF'}
                    </div>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-full border-2"
                  style={{
                    borderColor: light.on ? light.color : '#666666',
                    backgroundColor: light.on ? `${light.color}20` : 'transparent',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Preset Scenes */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-gray-400 mb-2">ESCENAS PREDEFINIDAS</div>
            {['Focus Mode', 'Relax Mode', 'Party Mode'].map((scene, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-black/60 border border-[#00F3FF]/30 rounded font-mono text-[#00F3FF] text-xs"
              >
                {scene}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
