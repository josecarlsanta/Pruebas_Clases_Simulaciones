import React from 'react';
import { SimulationState } from '../types';

const FormulaDisplay: React.FC<{ state: SimulationState }> = ({ state }) => {
  const current = (state.voltage / state.resistance).toFixed(2);
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-slate-800/50 p-6 rounded-xl border border-white/5 my-6">
       {/* Triangle Visualizer */}
       <div className="relative w-32 h-28">
          <div className="absolute inset-0 bg-slate-700 clip-triangle flex flex-col items-center justify-center text-white font-bold rounded-xl overflow-hidden">
             {/* Not a real clip-path implementation for simplicity, just boxes arranged */}
             <div className="w-full h-1/2 flex items-center justify-center bg-blue-600/20 border-b border-white/20 text-blue-300">
                V
             </div>
             <div className="w-full h-1/2 flex">
                <div className="w-1/2 flex items-center justify-center bg-yellow-600/20 border-r border-white/20 text-yellow-300">
                    I
                </div>
                <div className="w-1/2 flex items-center justify-center bg-red-600/20 text-red-300">
                    R
                </div>
             </div>
          </div>
       </div>

       {/* Equation */}
       <div className="flex items-center gap-4 text-3xl md:text-5xl font-bold font-mono text-white">
          <div className="flex flex-col items-center">
             <span className="text-blue-400">{state.voltage}V</span>
             <span className="text-xs text-slate-500 font-sans">Voltaje</span>
          </div>
          <span className="text-slate-500">=</span>
          <div className="flex flex-col items-center">
             <span className="text-yellow-400">{current}A</span>
             <span className="text-xs text-slate-500 font-sans">Corriente</span>
          </div>
          <span className="text-slate-500">×</span>
          <div className="flex flex-col items-center">
             <span className="text-red-400">{state.resistance}Ω</span>
             <span className="text-xs text-slate-500 font-sans">Resistencia</span>
          </div>
       </div>
    </div>
  );
};

export default FormulaDisplay;
