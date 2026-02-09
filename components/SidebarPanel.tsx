
import React from 'react';

interface SidebarPanelProps {
  title: string;
  unit?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ title, unit, children }) => {
  return (
    <div className="flex flex-col mb-4 overflow-hidden">
      {/* Precision Header Design */}
      <div className="relative flex items-center h-9 px-3 bg-gradient-to-r from-[#162a4d] to-transparent border-l-2 border-cyan-500 shadow-[inset_4px_0_10px_rgba(6,182,212,0.2)]">
        <div className="flex items-center gap-3">
          {/* Diamond Icon */}
          <div className="w-3 h-3 border border-cyan-400 rotate-45 flex items-center justify-center bg-cyan-900/40 shadow-[0_0_5px_rgba(34,211,238,0.5)]">
            <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
          </div>
          <h2 className="text-[15px] font-bold tracking-widest text-white drop-shadow-sm">{title}</h2>
        </div>
        
        {/* Right Accents */}
        <div className="flex-1 flex justify-end items-center pr-2 gap-4">
          {/* Slanted Stripes Decoration */}
          <div className="flex gap-[3px] opacity-60">
            <div className="w-[3px] h-3 bg-cyan-400/80 -skew-x-[25deg]"></div>
            <div className="w-[3px] h-3 bg-cyan-400/80 -skew-x-[25deg]"></div>
            <div className="w-[3px] h-3 bg-cyan-400/80 -skew-x-[25deg]"></div>
          </div>
          {unit && (
            <span className="text-[12px] text-slate-400 font-medium">单位：{unit}</span>
          )}
        </div>
        
        {/* Underline Decoration */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gradient-to-b from-[#0a192f]/40 to-transparent p-3 border-x border-b border-white/5 rounded-b-sm">
        {children}
      </div>
    </div>
  );
};

export default SidebarPanel;
