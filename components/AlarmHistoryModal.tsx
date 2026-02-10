
import React, { useEffect, useRef } from 'react';
import { X, Siren, AlertCircle, Calendar, MapPin, Clock } from 'lucide-react';

interface AlarmHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const alarmHistory = [
  { id: 1, type: '水压过高', level: '一级', location: '探放水孔 装置1', time: '2024-03-20 14:22:10', status: '未处理' },
  { id: 2, type: '流量异常', level: '二级', location: '2号水仓明渠流量', time: '2024-03-20 12:05:45', status: '已处理' },
  { id: 3, type: '甲烷超限', level: '一级', location: '15号回风巷传感器', time: '2024-03-20 10:15:30', status: '未处理' },
  { id: 4, type: '水位预警', level: '三级', location: '中央泵房水位计', time: '2024-03-19 22:40:12', status: '已处理' },
  { id: 5, type: '通信中断', level: '三级', location: '无线基站 B-12', time: '2024-03-19 18:30:05', status: '已处理' },
  { id: 6, type: '温度过高', level: '二级', location: '21404采空区温度', time: '2024-03-19 15:10:22', status: '未处理' },
];

const AlarmHistoryModal: React.FC<AlarmHistoryModalProps> = ({ isOpen, onClose }) => {
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
        className="relative w-full max-w-4xl bg-[#0a192f] border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)] overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-red-500/50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-red-500/50"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3">
            <Siren className="text-red-500 animate-pulse" size={24} />
            <h2 className="text-xl font-bold tracking-[0.2em] text-white">报警记录中心</h2>
          </div>
          <button 
            type="button"
            onPointerDown={(e) => { e.stopPropagation(); }}
            onClick={() => {
              try { onClose(); } catch (err) { console.error(err); }
            }} 
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="关闭"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatsCard label="今日报警总数" value="12" color="text-red-500" />
            <StatsCard label="未处理报警" value="03" color="text-orange-500" />
            <StatsCard label="严重报警(一级)" value="02" color="text-red-600" />
            <StatsCard label="已恢复正常" value="09" color="text-green-500" />
          </div>

          <div className="overflow-x-auto rounded border border-white/5">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#162a4d]/50 text-slate-400 text-sm">
                <tr>
                  <th className="py-3 px-4 font-normal">报警类型</th>
                  <th className="py-3 px-4 font-normal">严重程度</th>
                  <th className="py-3 px-4 font-normal">发生位置</th>
                  <th className="py-3 px-4 font-normal">发生时间</th>
                  <th className="py-3 px-4 font-normal text-right">状态</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {alarmHistory.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-slate-200 font-medium">{item.type}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.level === '一级' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                        item.level === '二级' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                        'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                      }`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="opacity-50" />
                        {item.location}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono italic">
                       <div className="flex items-center gap-2">
                        <Clock size={14} className="opacity-50" />
                        {item.time}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={item.status === '未处理' ? 'text-red-400 font-bold' : 'text-green-400 opacity-60'}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
             <button className="px-6 py-2 bg-white/5 border border-white/10 text-slate-300 rounded hover:bg-white/10 transition-all text-sm font-medium">
               查看更多历史记录
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-[#162a4d]/30 border border-white/5 p-4 rounded-lg relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-8 h-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <AlertCircle size={32} />
    </div>
    <div className="text-slate-400 text-xs mb-1 font-medium">{label}</div>
    <div className={`text-2xl font-black font-mono ${color}`}>{value}</div>
  </div>
);

export default AlarmHistoryModal;
