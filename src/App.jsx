import React, { useEffect, useState } from "react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { 
  Activity, Zap, Shield, Settings, LayoutGrid, 
  Eye, EyeOff, Download, AlertTriangle, Clock
} from "lucide-react";

// Definição exata de cores industriais
const THEME = {
  bg: "#0A0C10",
  card: "#12151C",
  border: "#1E2430", // Borda ligeiramente mais visível para organização
  phaseA: "#3B82F6", // Azul Vibrante
  phaseB: "#F59E0B", // Âmbar
  phaseC: "#D946EF", // Magenta
  textMuted: "#64748B",
  textMain: "#F1F5F9"
};

function useEnergyData() {
  const [data, setData] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const itv = setInterval(() => {
      const now = new Date();
      // Formato de tempo mais curto para o eixo X
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const newData = {
        time: timeStr,
        vA: 121.2 + Math.random() * 0.5,
        vB: 120.8 + Math.random() * 0.5,
        vC: 121.5 + Math.random() * 0.5,
        cA: 24.5 + Math.random() * 0.3,
        cB: 24.2 + Math.random() * 0.3,
        cC: 24.8 + Math.random() * 0.3,
      };

      setData(newData);
      // Mantém histórico menor para gráfico mais limpo
      setHistory(prev => [...prev, newData].slice(-25));
    }, 1500);
    return () => clearInterval(itv);
  }, []);
  return { data, history };
}

// --- Componente de Card de Fase PADRONIZADO (Grid Interno Fixa Tamanhos) ---
const PhaseCard = ({ label, v, c, color, active, onToggle }) => (
  // Borda padrão e transição suave
  <div className={`bg-[#12151C] border rounded-2xl p-6 transition-all duration-300 ${active ? 'border-[#1E2430]' : 'opacity-40 grayscale border-transparent'}`}>
    
    {/* Header do Card - Altura Fixa */}
    <div className="flex justify-between items-center mb-6 h-10">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-8 rounded-full" style={{ backgroundColor: color }}></div>
        <div>
          <h3 className="text-white font-black text-xl tracking-tight">Phase {label}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live</p>
        </div>
      </div>
      <button onClick={onToggle} className="text-slate-600 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50">
        {active ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>

    {/* Área de Dados - Grid 2x2 para alinhamento perfeito */}
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-6">
      {/* Voltagem */}
      <div className="col-span-1">
        <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Voltage</p>
        <div className="flex items-baseline gap-1">
          {/* w-[80px] garante que o número ocupe o mesmo espaço sempre */}
          <span className="text-4xl font-black text-white tracking-tighter inline-block w-[90px] text-left">
            {v?.toFixed(1)}
          </span>
          <span className="text-xs text-slate-600 font-bold">V AC</span>
        </div>
      </div>
      
      {/* Corrente */}
      <div className="col-span-1 text-right">
        <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Current</p>
        <div className="flex items-baseline gap-1 justify-end">
          <span className="text-3xl font-bold text-white tracking-tight inline-block w-[70px]">
            {c?.toFixed(1)}
          </span>
          <span className="text-xs text-slate-600 font-bold">A</span>
        </div>
      </div>
    </div>

    {/* Barra de Carga Padronizada (Max 40A para exemplo) */}
    <div className="space-y-1.5 pt-4 border-t border-[#1E2430]">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
        <span className="text-slate-600">Load Intensity</span>
        <span style={{ color }}>{((c / 40) * 100).toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out rounded-full" 
          style={{ width: `${(c / 40) * 100}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  </div>
);

// --- Tooltip Customizado Clean ---
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#171B24]/90 border border-[#2D3545] p-4 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2D3545]">
          <Clock size={14} className="text-slate-500" />
          <p className="text-xs font-bold text-white">{label}</p>
        </div>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs font-medium text-slate-400">{entry.name}:</span>
              </div>
              <span className="text-xs font-black text-white">{entry.value.toFixed(2)} V</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// --- Main Dashboard Component ---
export default function OrganizedDashboard() {
  const { data, history } = useEnergyData();
  
  // Estado para isolar fases no gráfico
  const [activePhases, setActivePhases] = useState({ A: true, B: true, C: true });
  const togglePhase = (p) => setActivePhases(prev => ({ ...prev, [p]: !prev[p] }));

  return (
    <div className="flex min-h-screen bg-[#0A0C10] text-slate-300 font-sans p-3 md:p-6 selection:bg-blue-500/20">
      
      {/* Sidebar Slim Organizada */}
      <aside className="hidden xl:flex w-20 flex-col items-center py-10 border border-[#1E2430] bg-[#0D1016] rounded-3xl mr-6">
        <div className="mb-16 p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20">
          <Zap className="text-blue-500" size={26} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col gap-10 text-slate-700">
          <LayoutGrid className="text-blue-500" size={22} />
          <Activity className="hover:text-white cursor-pointer transition-colors" size={22} />
          <Shield className="hover:text-white cursor-pointer transition-colors" size={22} />
          <Settings className="hover:text-white cursor-pointer transition-colors" size={22} />
        </div>
      </aside>

      <main className="flex-1 max-w-[1600px] mx-auto w-full">
        
        {/* Header Clean */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 pb-6 border-b border-[#1E2430]">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Energy Core Telemetry</h1>
            <p className="text-slate-600 text-sm font-medium">Real-time 3-Phase Monitoring System</p>
          </div>
          <div className="flex items-center gap-2 bg-[#12151C] border border-[#1E2430] px-4 py-2 rounded-full">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">System Operational</span>
          </div>
        </header>

        {/* --- SEÇÃO DE FASES: GRID 3 COLUNAS (Garante tamanho igual) --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <PhaseCard label="A" v={data.vA} c={data.cA} color={THEME.phaseA} active={activePhases.A} onToggle={() => togglePhase('A')} />
          <PhaseCard label="B" v={data.vB} c={data.cB} color={THEME.phaseB} active={activePhases.B} onToggle={() => togglePhase('B')} />
          <PhaseCard label="C" v={data.vC} c={data.cC} color={THEME.phaseC} active={activePhases.C} onToggle={() => togglePhase('C')} />
        </section>

        {/* Área do Gráfico Padronizada */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Gráfico Principal (Ocupa 3/4 da largura no desktop) */}
          <div className="xl:col-span-3 bg-[#12151C] border border-[#1E2430] rounded-3xl p-7 shadow-xl relative">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20"><Activity size={16} className="text-blue-500" /></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Voltage Waveform Timeline</h3>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-[#1A1F29] px-4 py-2 rounded-xl border border-[#2D3545] hover:bg-[#252A36] hover:text-white transition-all">
                <Download size={12} /> Export Data
              </button>
            </div>

            {/* Gráfico com Eixos Claros */}
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ left: 0, bottom: 0, top: 10, right: 10 }}>
                  <defs>
                    {['A', 'B', 'C'].map(p => (
                      <linearGradient key={p} id={`grad${p}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={THEME[`phase${p}`]} stopOpacity={0.15}/>
                        <stop offset="95%" stopColor={THEME[`phase${p}`]} stopOpacity={0}/>
                      </linearGradient>
                    ))}
                  </defs>
                  {/* Grid sutil apenas horizontal */}
                  <CartesianGrid strokeDasharray="3 3" stroke="#1B212B" vertical={false} />
                  
                  {/* Eixo X: Tempo */}
                  <XAxis 
                    dataKey="time" 
                    tick={{fontSize: 10, fill: '#475569', fontWeight: 'bold'}} 
                    axisLine={{stroke: '#1E2430'}}
                    tickLine={false}
                    interval="preserveStartEnd"
                    dy={10}
                  />
                  
                  {/* Eixo Y: Voltagem (Zoom na variação) */}
                  <YAxis 
                    domain={['dataMin - 0.5', 'dataMax + 0.5']} 
                    tick={{fontSize: 10, fill: '#475569', fontWeight: 'bold'}}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val.toFixed(1)}V`}
                    dx={-10}
                  />
                  
                  <Tooltip content={<CustomTooltip />} cursor={{stroke: '#2D3545', strokeWidth: 1, strokeDasharray: '6 6'}} />
                  
                  {/* Áreas das Ondas com IDs de gradiente corretos */}
                  {activePhases.A && <Area name="Phase A" type="monotone" dataKey="vA" stroke={THEME.phaseA} fill="url(#gradA)" strokeWidth={2.5} dot={false} animationDuration={400} />}
                  {activePhases.B && <Area name="Phase B" type="monotone" dataKey="vB" stroke={THEME.phaseB} fill="url(#gradB)" strokeWidth={2.5} dot={false} animationDuration={400} />}
                  {activePhases.C && <Area name="Phase C" type="monotone" dataKey="vC" stroke={THEME.phaseC} fill="url(#gradC)" strokeWidth={2.5} dot={false} animationDuration={400} />}
                  
                  {/* Legenda Padronizada */}
                  <Legend 
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748B' }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card Lateral de Alerta (Ocupa 1/4) */}
          <div className="bg-[#12151C] border border-[#1E2430] rounded-3xl p-7 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-amber-500 mb-6">
              <AlertTriangle size={18} />
              <h4 className="text-[10px] font-black uppercase tracking-widest">System Status</h4>
            </div>
            
            <div className="space-y-4 flex-1">
               <p className="text-xs text-slate-500 leading-relaxed">All phases are operating within nominal voltage parameters (120V ± 5%). Load balance is optimal.</p>
               <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-500 text-[10px] font-bold">
                 NO ALERTS ACTIVE
               </div>
            </div>

            <div className="text-[10px] text-slate-700 pt-4 border-t border-[#1E2430] mt-6">
                Ref: IEEE Std 1159-2019
            </div>
          </div>

        </div> {/* Fim do Grid Inferior */}
      </main>
    </div>
  );
}