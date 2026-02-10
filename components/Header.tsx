
import React, { useState, useEffect } from 'react';
import { Home, Bell, Settings, Maximize2, ChevronDown, Snowflake, Siren } from 'lucide-react';

interface HeaderProps {
  currentTime: Date;
  onHomeClick?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ currentTime, onHomeClick, title = "矿井安全监测预警系统" }) => {
  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[date.getDay()];
    return `${year}.${month}.${day} ${weekday}`;
  };

  return (
    <header className="relative h-24 w-full flex items-center justify-between px-8 bg-[#030816] z-50">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

      <div className="flex items-center gap-6 z-10 min-w-[300px]">
        <div className="flex flex-col text-slate-100">
          <span className="text-3xl font-medium tracking-wider font-mono leading-none">{formatTime(currentTime)}</span>
          <span className="text-sm font-light mt-1 text-slate-300">{formatDate(currentTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400">
          <Snowflake size={32} strokeWidth={1.5} />
          <span className="text-xl font-medium">-1°C</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative h-full">
        <div className="relative mr-4 group cursor-pointer" onClick={onHomeClick}>
          <div className="w-40 h-10 bg-[#162a4d]/60 border-y border-cyan-500/40 flex items-center justify-center transition-all hover:bg-cyan-500/20" style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)', backgroundImage: 'radial-gradient(circle at center, rgba(6,182,212,0.1) 0%, transparent 70%)' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #00f2ff 1px, transparent 1px), linear-gradient(#00f2ff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <span className="text-white font-bold tracking-widest text-sm relative z-10">井上监测</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
             <div className="absolute top-0 left-[15%] right-0 h-[1px] bg-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
             <div className="absolute bottom-0 left-0 right-[15%] h-[1px] bg-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
          </div>
        </div>

        <div className="relative flex items-center justify-center h-full px-16">
          <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-b from-[#1a2b4b]/40 to-transparent border-t border-white/10" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}></div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-[2px] bg-white/20"></div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-white shadow-[0_0_15px_#fff,0_0_5px_cyan]"></div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-[0.25em] text-white z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] whitespace-nowrap">{title}</h1>
        </div>

        <div className="relative ml-4 group cursor-pointer" onClick={onHomeClick}>
          <div className="w-40 h-10 bg-[#162a4d]/60 border-y border-cyan-500/40 flex items-center justify-center transition-all hover:bg-cyan-500/20 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]" style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 15% 100%)', backgroundImage: 'radial-gradient(circle at center, rgba(6,182,212,0.1) 0%, transparent 70%)' }}>
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, #00f2ff 1px, transparent 1px), linear-gradient(#00f2ff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            <span className="text-white font-bold tracking-widest text-sm relative z-10">井下监测</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
             <div className="absolute top-0 left-0 right-[15%] h-[1px] bg-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
             <div className="absolute bottom-0 left-[15%] right-0 h-[1px] bg-cyan-400/60 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 z-10 min-w-[300px] justify-end">
        <div className="flex items-center gap-5 text-slate-200">
          <button className="hover:text-cyan-400 transition-colors drop-shadow-sm" onClick={onHomeClick}><Home size={22} strokeWidth={1.5} /></button>
          <button className="hover:text-cyan-400 transition-colors drop-shadow-sm"><Siren size={22} strokeWidth={1.5} /></button>
          <button className="hover:text-cyan-400 transition-colors drop-shadow-sm"><Settings size={22} strokeWidth={1.5} /></button>
          <button className="hover:text-cyan-400 transition-colors drop-shadow-sm"><Maximize2 size={22} strokeWidth={1.5} /></button>
          <div className="flex items-center gap-2 pl-4 cursor-pointer hover:opacity-80 transition-opacity">
            <span className="text-md font-medium text-cyan-500">admin</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
