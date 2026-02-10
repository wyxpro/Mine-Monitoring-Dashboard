
import React, { useEffect, useRef } from 'react';
import { X, Layers, Box, Map, Grid, Crosshair } from 'lucide-react';

interface LayersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LayersModal: React.FC<LayersModalProps> = ({ isOpen, onClose }) => {
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
        {/* Decorative corner */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/50"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/50"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <Layers className="text-cyan-400" size={20} />
            <h2 className="text-lg font-bold tracking-[0.1em] text-white">图层控制</h2>
          </div>
          <button onClick={onClose} className="text-cyan-400 hover:text-white transition-colors" aria-label="关闭">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <LayerToggleItem icon={<Box size={18} />} label="巷道三维模型" defaultChecked={true} />
          <LayerToggleItem icon={<Map size={18} />} label="传感器标注图层" defaultChecked={true} />
          <LayerToggleItem icon={<Grid size={18} />} label="辅助网格底面" defaultChecked={true} />
          <LayerToggleItem icon={<Crosshair size={18} />} label="空间坐标参考" defaultChecked={false} />
          
          <div className="mt-6 pt-4 border-t border-white/5">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">预设视图</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-500/20 transition-all">顶视俯瞰</button>
              <button className="px-3 py-2 text-xs bg-white/5 border border-white/10 text-slate-400 rounded hover:bg-white/10 transition-all">全景透视</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LayerToggleItem: React.FC<{ icon: React.ReactNode, label: string, defaultChecked: boolean }> = ({ icon, label, defaultChecked }) => {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-slate-300 group-hover:text-cyan-400 transition-colors">
        <div className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded group-hover:border-cyan-500/30 transition-all">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`w-10 h-5 rounded-full relative transition-all duration-300 ${checked ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`}></div>
      </button>
    </div>
  );
};

export default LayersModal;
