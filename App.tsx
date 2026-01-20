import React, { useState, useEffect } from 'react';
import WireSimulation from './components/WireSimulation';
import ControlPanel from './components/ControlPanel';
import FormulaDisplay from './components/FormulaDisplay';
import { SimulationState } from './types';
import { getExplanation } from './services/geminiService';
import { Lightbulb, Info } from 'lucide-react';

const App: React.FC = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    voltage: 5,
    resistance: 5,
    isPlaying: true,
  });

  const [aiExplanation, setAiExplanation] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  const handleStateChange = (newState: Partial<SimulationState>) => {
    setSimulationState((prev) => ({ ...prev, ...newState }));
  };

  const handleAskAI = async () => {
    setIsLoadingAI(true);
    setAiExplanation("");
    const explanation = await getExplanation(simulationState.voltage, simulationState.resistance);
    setAiExplanation(explanation);
    setIsLoadingAI(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
           <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-yellow-400">
             Ohm's Adventure
           </h1>
           <p className="text-slate-400 mt-2">Simulador Interactivo de Electrónica Básica</p>
        </div>
        <button 
           onClick={() => setShowWelcome(!showWelcome)}
           className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-blue-300"
        >
           <Info />
        </button>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Simulation & Formula */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[400px] w-full">
            <WireSimulation simulationState={simulationState} />
          </div>
          
          <FormulaDisplay state={simulationState} />

           {/* AI Explanation Box */}
           {(aiExplanation || isLoadingAI) && (
            <div className="bg-indigo-900/30 border border-indigo-500/30 p-6 rounded-xl animate-fade-in">
              <h3 className="text-lg font-bold text-indigo-300 mb-2 flex items-center gap-2">
                 <Lightbulb className="w-5 h-5" /> El Profesor Dice:
              </h3>
              {isLoadingAI ? (
                 <div className="flex gap-2 items-center text-slate-400">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150" />
                 </div>
              ) : (
                <p className="text-lg text-white leading-relaxed font-medium">
                  {aiExplanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-1">
          <ControlPanel 
            state={simulationState} 
            onChange={handleStateChange} 
            onAskAI={handleAskAI}
            isLoadingAI={isLoadingAI}
          />

          {showWelcome && (
            <div className="mt-8 bg-yellow-900/20 border border-yellow-500/20 p-4 rounded-xl text-sm text-yellow-200">
              <h4 className="font-bold text-yellow-400 mb-1">¡Bienvenido a la clase!</h4>
              <p className="mb-2">1. Los puntos brillantes son los <strong>Electrones</strong>.</p>
              <p className="mb-2">2. El <strong>Voltaje</strong> es qué tan fuerte los empujamos.</p>
              <p className="mb-2">3. La <strong>Resistencia</strong> es qué tan estrecha es la tubería.</p>
              <p>¡Juega con los controles para ver cómo cambia la velocidad de la corriente!</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;
