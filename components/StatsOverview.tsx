
import React from 'react';

interface StatsOverviewProps {
  totalHoles: number;
  alertsCount: number;
  onlineHoles: number;
  offlineHoles: number;
  warningHoles: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalHoles,
  alertsCount,
  onlineHoles,
  offlineHoles,
  warningHoles,
}) => {
  return (
    <div className="flex gap-6 p-4 z-20 pointer-events-none">
      <div className="bg-slate-900/60 border-l-4 border-green-500 px-4 py-2 backdrop-blur-md">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">探放水孔数</p>
        <p className="text-2xl font-bold text-green-400">{totalHoles} <span className="text-xs font-normal">个</span></p>
      </div>
      <div className="bg-slate-900/60 border-l-4 border-red-500 px-4 py-2 backdrop-blur-md">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">预警数量</p>
        <p className="text-2xl font-bold text-red-500">{alertsCount} <span className="text-xs font-normal">个</span></p>
      </div>
      <div className="flex-1"></div>
      
      {/* Quick Status Bar */}
      <div className="flex items-center gap-6 px-6 bg-slate-900/40 rounded-full border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">在线探放水孔</span>
          <span className="text-sm font-bold text-cyan-400">{onlineHoles}个</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">离线探放水孔</span>
          <span className="text-sm font-bold text-cyan-400">{offlineHoles}个</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">预警探放水孔</span>
          <span className="text-sm font-bold text-cyan-400">{warningHoles}个</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
