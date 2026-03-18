import React from "react";
import { AlertTriangle } from "lucide-react";

export const StatusCard = () => {
  return (
    <div className="bg-[#12151C] border border-[#1E2430] rounded-3xl p-7 flex flex-col justify-between">
      <div className="flex items-center gap-2 text-amber-500 mb-6">
        <AlertTriangle size={18} />
        <h4 className="text-[10px] font-black uppercase tracking-widest">System Status</h4>
      </div>
      
      <div className="space-y-4 flex-1">
         <p className="text-xs text-slate-500 leading-relaxed">All phases are operating within nominal voltage parameters (120V ± 5%). Load balance is optimal.</p>
         <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-emerald-500 text-[10px] font-bold text-center uppercase">
           No Alerts Active
         </div>
      </div>

      <div className="text-[10px] text-slate-700 pt-4 border-t border-[#1E2430] mt-6">
          Ref: IEEE Std 1159-2019
      </div>
    </div>
  );
};