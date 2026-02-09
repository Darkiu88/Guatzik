import { ReactorGauge } from '@/app/components/ReactorGauge';
import { NetworkCard } from '@/app/components/NetworkWave';
import { Activity, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';
import { useSystem } from '@/app/context/SystemContext';

export function Dashboard() {
  const { state } = useSystem();

  return (
    <div className="h-full w-full p-8 grid grid-cols-12 gap-8 font-mono overflow-y-auto">
      
      {/* --- COLUMNA IZQUIERDA: TARJETA GIGANTE DEL CPU --- */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-12 lg:col-span-5 glass-panel rounded-3xl relative overflow-hidden flex flex-col justify-center min-h-[500px]"
      >
        {/* Usamos el componente Reactor con la gráfica de montaña */}
        <ReactorGauge value={state.cpuLoad} label="CPU UTILIZATION" />

        {/* Detalles técnicos al pie de la tarjeta CPU */}
        <div className="absolute bottom-6 w-full px-8 flex justify-between text-[9px] text-gray-500 uppercase tracking-wider">
          <div>VOLTAJE: <span className="text-[#00F3FF]">1.41 V</span></div>
          <div>GOBERNADOR: <span className="text-white">PERFORMANCE</span></div>
        </div>
      </motion.div>

      {/* --- COLUMNA DERECHA: PILA DE TARJETAS (RAM, DISCO, RED) --- */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        
        {/* TARJETA 1: RAM (Diseño Original de Barra) */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
           <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-[10px] text-[#00FF41] tracking-widest font-bold uppercase">MEMORIA RAM</h3>
                <div className="text-[10px] text-gray-500">TOTAL: 32 GB</div>
              </div>
              <Activity size={18} className="text-[#00FF41]" />
           </div>
           
           <div className="text-3xl font-bold text-white mb-4">
             {state.ramUsed} <span className="text-sm text-gray-400">GB EN USO</span>
           </div>
           
           {/* Barra de Progreso Gruesa y Verde */}
           <div className="h-2 bg-gray-800 rounded-full overflow-hidden w-full">
             <motion.div 
               className="h-full bg-[#00FF41] shadow-[0_0_10px_#00FF41]"
               animate={{ width: `${state.ramPercent}%` }}
               transition={{ type: "spring", stiffness: 50 }}
             />
           </div>
           <div className="text-right text-[10px] text-[#00FF41] mt-1">{state.ramPercent}%</div>
        </div>

        {/* TARJETA 2: DISCO (Diseño Original de Barra) */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
           <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-[10px] text-[#00F3FF] tracking-widest font-bold uppercase">DISCO NVMe</h3>
                <div className="text-[10px] text-gray-500">SISTEMA (/)</div>
              </div>
              <HardDrive size={18} className="text-[#00F3FF]" />
           </div>
           
           <div className="text-3xl font-bold text-white mb-4">
             {state.diskPercent}% <span className="text-sm text-gray-400">OCUPADO</span>
           </div>
           
           {/* Barra de Progreso Gruesa y Cian */}
           <div className="h-2 bg-gray-800 rounded-full overflow-hidden w-full">
             <motion.div 
               className="h-full bg-[#00F3FF] shadow-[0_0_10px_#00F3FF]"
               animate={{ width: `${state.diskPercent}%` }}
             />
           </div>
        </div>

        {/* TARJETA 3: RED (Componente de Onda Verde) */}
        <div className="flex-1 min-h-[220px]">
             <NetworkCard speed={state.netSpeed} />
        </div>

      </div>
    </div>
  );
}