
import React, { useEffect, useRef } from 'react';
import { X, User, Shield, LogOut, Key, Settings, Clock, Activity } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (!contentRef.current || !contentRef.current.contains(e.target as Node)) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-md bg-[#0a192f] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-cyan-500/50"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-cyan-500/50"></div>

        {/* Profile Header */}
        <div className="p-8 flex flex-col items-center border-b border-cyan-500/10 bg-gradient-to-b from-cyan-500/5 to-transparent">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-2 border-cyan-400 p-1 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                <User size={48} className="text-cyan-400 opacity-80" />
              </div>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-[#0a192f] rounded-full shadow-lg animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-widest mb-1">admin</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <Shield size={12} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">超级管理员</span>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-4">
          <InfoRow icon={<Clock size={16} />} label="本次登录时间" value="2024-03-20 08:30:15" />
          <InfoRow icon={<Activity size={16} />} label="操作权限级别" value="Level 9 (最高)" />
          <InfoRow icon={<Settings size={16} />} label="所属部门" value="信息化调度中心" />
          
          <div className="pt-6 grid grid-cols-2 gap-3">
             <button className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded hover:bg-white/10 transition-all text-sm font-medium">
               <Key size={16} />
               修改密码
             </button>
             <button className="flex items-center justify-center gap-2 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded hover:bg-red-500/20 transition-all text-sm font-medium">
               <LogOut size={16} />
               退出系统
             </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-white/5">
    <div className="flex items-center gap-3 text-slate-400">
      <div className="text-cyan-500 opacity-60">{icon}</div>
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-sm text-slate-200 font-medium">{value}</span>
  </div>
);

export default UserProfileModal;
