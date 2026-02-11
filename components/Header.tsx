
import React, { useState, useEffect } from 'react';
import { Home, Bell, Settings, Maximize2, ChevronDown, Snowflake, Siren } from 'lucide-react';

interface HeaderProps {
  currentTime: Date;
  onHomeClick: () => void;
  onAlarmClick: () => void;
  onSettingsClick: () => void;
  onFullscreenClick: () => void;
  onUserClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentTime, 
  onHomeClick, 
  onAlarmClick, 
  onSettingsClick, 
  onFullscreenClick, 
  onUserClick 
}) => {
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
      {/* Background Layer: Thin bottom line across entire header */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

      {/* Left Section: Clock and Weather */}
      <div className="flex items-center gap-6 z-10 min-w-[300px]">
        <div className="flex flex-col text-slate-100">
          <span className="text-3xl font-medium tracking-wider font-mono leading-none">
            {formatTime(currentTime)}
          </span>
          <span className="text-sm font-light mt-1 text-slate-300">
            {formatDate(currentTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400">
          <Snowflake size={32} strokeWidth={1.5} />
          <span className="text-xl font-medium">-1°C</span>
        </div>
      </div>

      {/* Center Group: Buttons and Title */}
      <div className="flex-1 flex items-center justify-center relative h-full">
        {/* Central Title Housing */}
        <div className="relative flex items-center justify-center h-full px-16">
          {/* Main Decorative Plateau */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[70%] bg-gradient-to-b from-[#1a2b4b]/40 to-transparent border-t border-white/10"
            style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
          ></div>
          
          {/* Bottom Glowing Feature */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-[2px] bg-white/20"></div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-white shadow-[0_0_15px_#fff,0_0_5px_cyan]"></div>

          <h1 className="text-4xl font-bold tracking-[0.25em] text-white z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            煤矿防治水监测预警系统
          </h1>
        </div>
      </div>

      {/* Right Section: Tools and User */}
      <div className="flex items-center gap-6 z-10 min-w-[300px] justify-end">
        <div className="flex items-center gap-5 text-slate-200">
          <button 
            onClick={onHomeClick}
            className="hover:text-cyan-400 transition-colors drop-shadow-sm p-1"
          >
            <Home size={22} strokeWidth={1.5} />
          </button>
          <button 
            onClick={onAlarmClick}
            className="hover:text-cyan-400 transition-colors drop-shadow-sm p-1"
          >
            <Siren size={22} strokeWidth={1.5} />
          </button>
          <button 
            onClick={onSettingsClick}
            className="hover:text-cyan-400 transition-colors drop-shadow-sm p-1"
          >
            <Settings size={22} strokeWidth={1.5} />
          </button>
          <button 
            onClick={onFullscreenClick}
            className="hover:text-cyan-400 transition-colors drop-shadow-sm p-1"
          >
            <Maximize2 size={22} strokeWidth={1.5} />
          </button>
          
          {/* User Profile */}
          <div 
            onClick={onUserClick}
            className="flex items-center gap-2 pl-4 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <span className="text-md font-medium text-cyan-500">admin</span>
            <ChevronDown size={14} className="text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
