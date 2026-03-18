import { Eye, EyeOff } from "lucide-react";

export const PhaseCard = ({ label, v, c, color, active, onToggle }) => (
  <div className={`bg-[#12151C] border rounded-2xl p-6 transition-all duration-300 ${active ? 'border-[#1E2430]' : 'opacity-40 grayscale border-transparent'}`}>
    <div className="flex justify-between items-center mb-6 h-10">
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-8 rounded-full" style={{ backgroundColor: color }}></div>
        <div>
          <h3 className="text-white font-black text-xl tracking-tight">Phase {label}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live</p>
        </div>
      </div>
      <button onClick={onToggle} className="text-slate-600 hover:text-white p-2">
        {active ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>

    <div className="grid grid-cols-2 gap-x-4 mb-6">
      <div>
        <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Voltage</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white tracking-tighter w-[90px] inline-block">{v?.toFixed(1)}</span>
          <span className="text-xs text-slate-600 font-bold">V AC</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase">Current</p>
        <div className="flex items-baseline gap-1 justify-end">
          <span className="text-3xl font-bold text-white w-[70px] inline-block">{c?.toFixed(1)}</span>
          <span className="text-xs text-slate-600 font-bold">A</span>
        </div>
      </div>
    </div>

    <div className="space-y-1.5 pt-4 border-t border-[#1E2430]">
      <div className="flex justify-between text-[10px] font-bold uppercase">
        <span className="text-slate-600">Load Intensity</span>
        <span style={{ color }}>{((c / 40) * 100).toFixed(0)}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-1000" style={{ width: `${(c / 40) * 100}%`, backgroundColor: color }}></div>
      </div>
    </div>
  </div>
);