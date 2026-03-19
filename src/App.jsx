import React, { useState } from "react";
import { Zap, Activity, LayoutGrid, Shield, Settings } from "lucide-react";
import { useEnergyData } from "./hooks/useEnergyData";
import { PhaseCard } from "./components/PhaseCard";
import { PowerChart } from "./components/PowerChart"; // Importe o novo componente


// Tema de cores principais (Fases dos Cards e Tensão)
const VOLTAGE_THEME = { phaseA: "#3B82F6", phaseB: "#F59E0B", phaseC: "#D946EF" };

// Tema de cores alternativas para Corrente (Verde, Turquesa, Roxo)
const CURRENT_THEME = { phaseA: "#10B981", phaseB: "#06B6D4", phaseC: "#8B5CF6" };

export default function App() {
  const { data, history } = useEnergyData();
  const [activePhases, setActivePhases] = useState({ A: true, B: true, C: true });

  const togglePhase = (p) => setActivePhases(prev => ({ ...prev, [p]: !prev[p] }));

  return (
    <div className="flex min-h-screen bg-[#0A0C10] text-slate-300 p-3 md:p-6 selection:bg-blue-500/20">
      
      {/* Sidebar (Oculta em mobile) */}
      <aside className="hidden xl:flex w-20 flex-col items-center py-10 border border-[#1E2430] bg-[#0D1016] rounded-3xl mr-6">
        <Zap className="text-blue-500 mb-16" size={26} strokeWidth={2.5} />
        <div className="flex flex-col gap-10 text-slate-700">
          <LayoutGrid className="text-blue-500" size={22} />
          <Activity size={22} className="hover:text-white cursor-pointer" />
          <Shield size={22} className="hover:text-white cursor-pointer" />
          <Settings size={22} className="hover:text-white cursor-pointer" />
        </div>
      </aside>

      <main className="flex-1 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-[#1E2430] gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">ANL Web</h1>
            <p className="text-slate-600 text-sm font-medium">Embrasul - Soluções Inteligentes</p>
          </div>
          <div className="bg-[#12151C] border border-[#1E2430] px-4 py-2 rounded-full flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Live Monitoring</span>
          </div>
        </header>

        {/* Fases - Grid 3 Colunas */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PhaseCard label="A" v={data.vA} c={data.cA} color={VOLTAGE_THEME.phaseA} active={activePhases.A} onToggle={() => togglePhase('A')} />
          <PhaseCard label="B" v={data.vB} c={data.cB} color={VOLTAGE_THEME.phaseB} active={activePhases.B} onToggle={() => togglePhase('B')} />
          <PhaseCard label="C" v={data.vC} c={data.cC} color={VOLTAGE_THEME.phaseC} active={activePhases.C} onToggle={() => togglePhase('C')} />
        </section>

        {/* Área de Gráficos e Status */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Coluna dos Gráficos (Ocupa 9 de 12 colunas no desktop) */}
          <div className="xl:col-span-9 grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Gráfico 1: Tensão */}
            <PowerChart 
              title="Voltage Waveform"
              history={history}
              activePhases={activePhases}
              theme={VOLTAGE_THEME} // Tema Azul/Âmbar/Magenta
              unit="V"
              dataKeys={{ A: 'vA', B: 'vB', C: 'vC' }}
              domain={['dataMin - 0.5', 'dataMax + 0.5']} // Zoom na variação
            />

            {/* Gráfico 2: Corrente (NOVO) */}
            <PowerChart 
              title="Current Waveform"
              history={history}
              activePhases={activePhases}
              theme={CURRENT_THEME} // Tema Verde/Turquesa/Roxo
              unit="A"
              dataKeys={{ A: 'cA', B: 'cB', C: 'cC' }}
              domain={['0', 'dataMax + 2']} // Escala começando do zero
            />
          </div>


        </div>
      </main>
    </div>
  );
}