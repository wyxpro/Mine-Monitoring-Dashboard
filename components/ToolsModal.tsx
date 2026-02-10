
import React, { useEffect, useRef } from 'react';
import { X, Wrench, Camera, FileDown, Ruler, Type, Maximize } from 'lucide-react';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ToolsModal: React.FC<ToolsModalProps> = ({ isOpen, onClose }) => {
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
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-md bg-[#0a192f] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden animate-in zoom-in-95 duration-300"
        style={{ minWidth: 0 }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <Wrench className="text-cyan-400" size={20} />
            <h2 className="text-lg font-bold tracking-[0.1em] text-white">辅助工具</h2>
          </div>
          <button 
            type="button"
            onMouseDown={(e) => { e.stopPropagation(); }}
            onClick={onClose} 
            className="text-cyan-400 hover:text-white transition-colors z-50 pointer-events-auto" 
            aria-label="关闭"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <ToolButton icon={<Camera className="text-cyan-400" />} label="三维截图" description="保存当前场景快照" />
          <ToolButton icon={<FileDown className="text-blue-400" />} label="导出报告" description="导出传感器历史报表" />
          <ToolButton icon={<Ruler className="text-amber-400" />} label="距离测量" description="计算巷道两点间距" />
          <ToolButton icon={<Type className="text-emerald-400" />} label="空间标注" description="在3D空间添加笔记" />
          
          <div className="col-span-2 mt-4">
            <button 
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  document.exitFullscreen();
                }
              }}
              className="w-full flex items-center justify-center gap-3 py-3 bg-[#162a4d]/60 border border-white/10 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all group"
            >
              <Maximize size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-white tracking-widest">全屏监控模式</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolButton: React.FC<{ icon: React.ReactNode, label: string, description: string }> = ({ icon, label, description }) => (
  <button className="flex flex-col items-center gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] hover:border-cyan-500/20 transition-all text-center group">
    <div className="w-12 h-12 flex items-center justify-center bg-[#162a4d]/40 rounded-full border border-white/10 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-sm font-bold text-white tracking-tight">{label}</p>
      <p className="text-[10px] text-slate-500">{description}</p>
    </div>
  </button>
);

export default ToolsModal;
