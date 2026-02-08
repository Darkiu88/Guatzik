import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface NetworkCardProps {
  speed: number; // Velocidad actual en MB/s
}

export function NetworkCard({ speed }: NetworkCardProps) {
  // Guardamos el historial de velocidad para dibujar la onda (50 puntos)
  const [history, setHistory] = useState<number[]>(new Array(50).fill(0));

  useEffect(() => {
    setHistory(prev => {
      // Agregamos el nuevo dato al final y quitamos el primero (Shift)
      const newData = [...prev.slice(1), speed];
      return newData;
    });
  }, [speed]);

  // Función para generar la línea SVG (Path)
  const generatePath = (isFill = false) => {
    const width = 100;
    const height = 100;
    const maxVal = 100; // Escala visual máxima (100 MB/s según tu diseño)
    const stepX = width / (history.length - 1);

    let d = `M 0 ${height} `; // Comenzar abajo a la izquierda

    // Dibujar cada punto
    history.forEach((val, i) => {
      const x = i * stepX;
      // Invertimos Y y escalamos. Si val > 100, lo topeamos visualmente.
      const normalizedVal = Math.min(val, maxVal); 
      const y = height - (normalizedVal / maxVal) * height;
      
      // El primer punto es un MoveTo, los demás LineTo
      if (i === 0 && !isFill) d = `M ${x} ${y}`;
      else d += `L ${x} ${y} `;
    });

    if (isFill) {
      // Si es relleno, cerramos la forma abajo derecha y abajo izquierda
      d += `L ${width} ${height} L 0 ${height} Z`;
    }

    return d;
  };

  return (
    <div className="glass-panel p-6 rounded-2xl w-full h-full relative overflow-hidden flex flex-col justify-between group min-h-[220px]">
      
      {/* --- CABECERA --- */}
      <div className="z-10 relative">
        <h3 className="text-xs text-[#00F3FF] tracking-widest font-bold uppercase mb-1">
          TRÁFICO DE RED
        </h3>
        
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white tracking-tight text-glow-white">
            {speed.toFixed(1)}
          </span>
          <span className="text-lg text-gray-400 font-mono">MB/s</span>
        </div>
        
        <div className="text-[10px] text-gray-500 font-mono tracking-wider mt-1 uppercase">
          SUBIDA Y BAJADA COMBINADA
        </div>
      </div>

      {/* --- GRÁFICA DE ONDA (FONDO) --- */}
      <div className="absolute inset-x-0 bottom-0 h-32 w-full z-0">
        
        {/* Etiquetas de Ejes (Overlay) */}
        <div className="absolute inset-0 pointer-events-none z-10 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <span className="text-[8px] text-[#00FF41]/50 font-mono">100MB/s</span>
            </div>
            <div className="flex justify-between items-end">
                <span className="text-[8px] text-[#00FF41]/50 font-mono">0MB/s</span>
                <span className="text-[8px] text-[#00FF41] font-mono tracking-widest bg-black/50 px-1 rounded">TRÁFICO EN TIEMPO REAL</span>
            </div>
        </div>

        {/* Líneas de Grid Verticales (Decoración) */}
        <div className="absolute inset-0 flex justify-evenly opacity-10 pointer-events-none">
            <div className="w-px h-full bg-[#00FF41] border-r border-dashed border-[#00FF41]" />
            <div className="w-px h-full bg-[#00FF41] border-r border-dashed border-[#00FF41]" />
            <div className="w-px h-full bg-[#00FF41] border-r border-dashed border-[#00FF41]" />
        </div>

        {/* El SVG de la Onda */}
        <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-full"
        >
            <defs>
                <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FF41" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00FF41" stopOpacity="0" />
                </linearGradient>
            </defs>
            
            {/* Relleno (Gradiente) */}
            <motion.path 
                d={generatePath(true)} 
                fill="url(#netGradient)" 
                stroke="none"
            />
            
            {/* Línea (Trazo brillante) */}
            <motion.path 
                d={generatePath(false)} 
                fill="none" 
                stroke="#00FF41" 
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 4px #00FF41)"
            />
        </svg>
      </div>
      
      {/* Borde sutil animado al recibir datos */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-[#00FF41]/50 w-full opacity-50" />
    </div>
  );
}