import React from 'react';
import { SimulationState } from '../types';
import { Battery, ShieldAlert, Play, Pause, Zap } from 'lucide-react';

interface ControlPanelProps {
  state: SimulationState;
  onChange: (newState: Partial<SimulationState>) => void;
  onAskAI: () => void;
  isLoadingAI: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ state, onChange, onAskAI, isLoadingAI }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 space-y-8">
      
      {/* Play/Pause Main Control */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
           <Zap className="text-yellow-400 fill-current" /> Controles
        </h2>
        <button
          onClick={() => onChange({ isPlaying: !state.isPlaying })}
          className={`p-3 rounded-full transition-colors ${
            state.isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {state.isPlaying ? <Pause className="text-white" /> : <Play className="text-white" />}
        </button>
      </div>

      {/* Voltage Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-blue-300">
          <label className="flex items-center gap-2 font-semibold">
            <Battery className="w-5 h-5" /> Voltaje (V)
          </label>
          <span className="text-2xl font-mono bg-slate-900 px-3 py-1 rounded border border-blue-500/30">
            {state.voltage} V
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={state.voltage}
          onChange={(e) => onChange({ voltage: Number(e.target.value) })}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
        />
        <p className="text-xs text-slate-400">
          Representa la "fuerza" o "presión" que empuja a los electrones.
        </p>
      </div>

      {/* Resistance Control */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-red-300">
          <label className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="w-5 h-5" /> Resistencia (Ω)
          </label>
          <span className="text-2xl font-mono bg-slate-900 px-3 py-1 rounded border border-red-500/30">
            {state.resistance} Ω
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={state.resistance}
          onChange={(e) => onChange({ resistance: Number(e.target.value) })}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-400"
        />
        <p className="text-xs text-slate-400">
          Representa la oposición al flujo. ¡Cierra la tubería!
        </p>
      </div>

      {/* AI Explanation Button */}
      <div className="pt-4">
        <button
            onClick={onAskAI}
            disabled={isLoadingAI}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-lg shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isLoadingAI ? (
                <span>Pensando...</span>
            ) : (
                <>
                    <span>🤖 Explicar situación actual</span>
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
