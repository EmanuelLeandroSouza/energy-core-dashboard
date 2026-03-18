import React, { useState } from "react";
import { Zap, Activity, LayoutGrid, Shield, Settings } from "lucide-react";
import { useEnergyData } from "./hooks/useEnergyData";
import { PhaseCard } from "./components/PhaseCard";
import { MainChart } from "./components/MainChart";
import { StatusCard } from "./components/StatusCard";

const THEME = { phaseA: "#3B82F6", phaseB: "#F59E0B", phaseC: "#D946EF" };

export default function App() {
  const { data, history } = useEnergyData();
  const [activePhases, setActivePhases] = useState({ A: true, B: true, C: true });

  const togglePhase = (p) => setActivePhases(prev => ({ ...prev, [p]: !prev[p] }));

  return (
    <div className="flex min-h-screen bg-[#0A0C10] text-slate-300 p-3 md:p-6">
      
      {/* Sidebar */}
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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-[#1E2430]">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Energy Core Telemetry</h1>
            <p className="text-slate-600 text-sm font-medium">Real-time 3-Phase Monitoring System</p>
          </div>
          <div className="bg-[#12151C] border border-[#1E2430] px-4 py-2 rounded-full flex items-center gap-2">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Live</span>
          </div>
        </header>

        {/* Fases */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <PhaseCard label="A" v={data.vA} c={data.cA} color={THEME.phaseA} active={activePhases.A} onToggle={() => togglePhase('A')} />
          <PhaseCard label="B" v={data.vB} c={data.cB} color={THEME.phaseB} active={activePhases.B} onToggle={() => togglePhase('B')} />
          <PhaseCard label="C" v={data.vC} c={data.cC} color={THEME.phaseC} active={activePhases.C} onToggle={() => togglePhase('C')} />
        </section>

        {/* Gráfico e Status */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <MainChart history={history} activePhases={activePhases} />
          <StatusCard />
        </div>
      </main>
    </div>
  );
}