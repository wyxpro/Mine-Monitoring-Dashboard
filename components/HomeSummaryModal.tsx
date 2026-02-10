
import React, { useEffect, useRef } from 'react';
import { X, Home, CheckCircle2, AlertTriangle, ShieldCheck, Database, LayoutDashboard } from 'lucide-react';

interface HomeSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HomeSummaryModal: React.FC<HomeSummaryModalProps> = ({ isOpen, onClose }) => {
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
      onPointerDown={(e) => {
        if (!contentRef.current || !contentRef.current.contains(e.target as Node)) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-2xl bg-[#0a192f] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-cyan-400" size={24} />
            <h2 className="text-xl font-bold tracking-[0.2em] text-white">数字化矿山概览</h2>
          </div>
          <button
            type="button"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={() => {
              try { onClose(); } catch (err) { console.error(err); }
            }}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
             <div className="space-y-4">
                <SummaryItem icon={<CheckCircle2 className="text-green-500" />} label="系统运行状态" value="正常运行中" />
                <SummaryItem icon={<Database className="text-cyan-500" />} label="数据采集延迟" value="< 150ms" />
                <SummaryItem icon={<ShieldCheck className="text-blue-500" />} label="安全防护等级" value="等保三级" />
             </div>
             <div className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <div className="text-4xl font-black text-cyan-400 mb-2 font-mono italic">99.98%</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">系统年化在线率</div>
                <div className="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-500 w-[99.98%] shadow-[0_0_10px_#06b6d4]"></div>
                </div>
             </div>
          </div>

          <div className="p-6 bg-[#162a4d]/30 border border-cyan-500/20 rounded-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Home size={80} />
             </div>
             <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-orange-500" />
                重要通知
             </h3>
             <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-2">
                   <span className="text-cyan-500">•</span>
                   <span>计划于本周五凌晨 02:00 进行数据库例行维护，届时可能会有短时波动。</span>
                </li>
                <li className="flex gap-2">
                   <span className="text-cyan-500">•</span>
                   <span>新版防治水算法模型已上线，请各部门注意观察监测数据。</span>
                </li>
                <li className="flex gap-2">
                   <span className="text-cyan-500">•</span>
                   <span>三维模型已更新至最新的采掘工程平面图版本。</span>
                </li>
             </ul>
          </div>

          <div className="mt-8 flex justify-center gap-4">
             <button 
               onClick={onClose}
               className="px-8 py-3 bg-cyan-500 text-white font-bold rounded shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:opacity-90 transition-all flex items-center gap-2"
             >
                <Home size={18} />
                进入工作站
             </button>
             <button className="px-8 py-3 bg-white/5 border border-white/10 text-slate-300 rounded hover:bg-white/10 transition-all">
                系统说明文档
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-md">
     <div className="w-10 h-10 flex items-center justify-center bg-[#0a192f] border border-white/10 rounded-full shadow-inner">
        {icon}
     </div>
     <div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{label}</div>
        <div className="text-sm font-bold text-slate-200">{value}</div>
     </div>
  </div>
);

export default HomeSummaryModal;
