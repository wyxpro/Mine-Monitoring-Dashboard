
import React from 'react';

const StatsOverview: React.FC = () => {
  return (
    <div className="flex gap-4 p-4 z-20 pointer-events-none">
      <div className="bg-slate-900/60 border-l-4 border-cyan-500 px-4 py-2 backdrop-blur-md">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">传感器数量</p>
        <p className="text-2xl font-bold text-cyan-400">30 <span className="text-xs font-normal">个</span></p>
      </div>
      <div className="bg-slate-900/60 border-l-4 border-red-500 px-4 py-2 backdrop-blur-md">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">预警数量</p>
        <p className="text-2xl font-bold text-red-500">0 <span className="text-xs font-normal">个</span></p>
      </div>
      <div className="flex-1"></div>
      
      {/* Quick Status Bar */}
      <div className="flex items-center gap-6 px-6 bg-slate-900/40 rounded-full border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">水位传感器</span>
          <span className="text-sm font-bold text-cyan-400">5个</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">流量传感器</span>
          <span className="text-sm font-bold text-cyan-400">5个</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">水压传感器</span>
          <span className="text-sm font-bold text-cyan-400">7个</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">管道流量</span>
          <span className="text-sm font-bold text-cyan-400">8个</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">温度传感器</span>
          <span className="text-sm font-bold text-cyan-400">2个</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">水质传感器</span>
          <span className="text-sm font-bold text-cyan-400">3个</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
