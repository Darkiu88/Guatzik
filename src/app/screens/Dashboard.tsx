import { motion } from 'motion/react';
import { ReactorGauge } from '@/app/components/ReactorGauge';
import { GlassCard } from '@/app/components/GlassCard';
import { NetworkWave } from '@/app/components/NetworkWave';

export function Dashboard() {
  return (
    <>
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 px-8 mt-8">
        {/* Left: Reactor (40%) */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative backdrop-blur-md bg-gradient-to-br from-white/5 to-transparent border border-[#00F3FF]/40 rounded-2xl p-8 h-[500px]"
            style={{
              boxShadow: '0 8px 32px rgba(0, 243, 255, 0.2), inset 0 0 60px rgba(0, 243, 255, 0.05)',
            }}
          >
            {/* Volumetric glow behind */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'radial-gradient(circle at center, rgba(0, 243, 255, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                zIndex: -1,
              }}
            />

            <ReactorGauge
              percentage={38.4}
              voltage="1.41V"
              threads={12}
              governor="Alto Rendimiento"
            />
          </motion.div>
        </div>

        {/* Right: Resource Cards (60%) */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard
            title="MEMORIA RAM"
            value="18.0 GB"
            subtitle="de 32 GB totales"
            progress={56}
            delay={0.2}
          />

          <GlassCard
            title="DISCO NVMe"
            value="3500 MB/s"
            subtitle="LECTURA SECUENCIAL"
            progress={66}
            delay={0.4}
          />

          <GlassCard
            title="TRÁFICO DE RED"
            value="78.7 MB/s"
            subtitle="SUBIDA Y BAJADA COMBINADA"
            delay={0.6}
          >
            <NetworkWave />
          </GlassCard>
        </div>
      </div>

      {/* Additional System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-4 gap-6 px-8 mt-8"
      >
        {[
          { label: 'TEMPERATURA', value: '45°C', color: '#00FF41' },
          { label: 'FAN SPEED', value: '1850 RPM', color: '#00F3FF' },
          { label: 'UPTIME', value: '7d 14h 23m', color: '#00F3FF' },
          { label: 'PROCESOS', value: '247 activos', color: '#00FF41' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
            whileHover={{
              scale: 1.02,
              borderColor: stat.color,
            }}
            className="relative backdrop-blur-sm bg-black/40 rounded-lg p-4 text-center transition-all"
            style={{
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="text-xs font-mono text-gray-400 mb-1">{stat.label}</div>
            <div
              className="text-lg font-bold"
              style={{
                color: stat.color,
                textShadow: `0 0 10px ${stat.color}`,
              }}
            >
              {stat.value}
            </div>
            {/* Inner glass reflection */}
            <div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
