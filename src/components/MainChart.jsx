import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Download, Clock } from "lucide-react";

const THEME = { phaseA: "#3B82F6", phaseB: "#F59E0B", phaseC: "#D946EF" };

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

export const MainChart = ({ history, activePhases }) => {
  return (
    <div className="xl:col-span-3 bg-[#12151C] border border-[#1E2430] rounded-3xl p-7 shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20"><Activity size={16} className="text-blue-500" /></div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Voltage Waveform Timeline</h3>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 bg-[#1A1F29] px-4 py-2 rounded-xl border border-[#2D3545] hover:text-white transition-all">
          <Download size={12} /> Export Data
        </button>
      </div>

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
            <CartesianGrid strokeDasharray="3 3" stroke="#1B212B" vertical={false} />
            <XAxis dataKey="time" tick={{fontSize: 10, fill: '#475569'}} axisLine={{stroke: '#1E2430'}} />
            <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tick={{fontSize: 10, fill: '#475569'}} axisLine={false} tickFormatter={(val) => `${val.toFixed(1)}V`} />
            <Tooltip content={<CustomTooltip />} />
            
            {activePhases.A && <Area name="Phase A" type="monotone" dataKey="vA" stroke={THEME.phaseA} fill="url(#gradA)" strokeWidth={2.5} dot={false} />}
            {activePhases.B && <Area name="Phase B" type="monotone" dataKey="vB" stroke={THEME.phaseB} fill="url(#gradB)" strokeWidth={2.5} dot={false} />}
            {activePhases.C && <Area name="Phase C" type="monotone" dataKey="vC" stroke={THEME.phaseC} fill="url(#gradC)" strokeWidth={2.5} dot={false} />}
            
            <Legend wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 'bold' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};