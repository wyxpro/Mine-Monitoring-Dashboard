
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Activity, AlertCircle, History, Bell } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface SensorDetailModalProps {
  sensor: {
    id: string;
    name: string;
    value: string;
    type: string;
    color: string;
  } | null;
  onClose: () => void;
}

const SensorDetailModal: React.FC<SensorDetailModalProps> = ({ sensor, onClose }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'alarm'>('history');
  const [chartData, setChartData] = useState<any[]>([]);
  const [alarmData, setAlarmData] = useState<Array<{ time: string; level: 'info' | 'warning' | 'critical'; message: string; value: number }>>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Generate random mock data for the chart
  useEffect(() => {
    if (sensor) {
      const data = [];
      const baseValue = parseFloat(sensor.value) || 600;
      for (let i = 0; i < 20; i++) {
        data.push({
          time: `${14 + Math.floor(i / 4)}:${(i % 4) * 15}`,
          value: Number((baseValue + (Math.random() - 0.5) * 100).toFixed(3))
        });
      }
      setChartData(data);
      // mock alarm list
      const levels: Array<'info' | 'warning' | 'critical'> = ['info', 'warning', 'critical'];
      const msgMap = sensor.type === 'flow'
        ? { info: '流量短时波动', warning: '流量接近阈值', critical: '流量异常升高' }
        : sensor.type === 'pressure'
          ? { info: '压力波动', warning: '水压接近预警阈值', critical: '水压异常升高' } // 删除“水压稳定”
          : { info: '温度波动', warning: '温度接近上限', critical: '温度异常升高' };
      const hasWarning = Math.random() < 0.5;
      const pickLevel = (): 'info' | 'warning' | 'critical' => {
        if (!hasWarning) return 'info';
        const r = Math.random();
        return r < 0.5 ? 'info' : r < 0.85 ? 'warning' : 'critical';
      };
      const alarms: Array<{ time: string; level: 'info' | 'warning' | 'critical'; message: string; value: number }> = [];
      for (let i = 0; i < 8; i++) {
        const lvl = pickLevel();
        const msg = (msgMap as any)[lvl];
        const tH = 14 + Math.floor(Math.random() * 6);
        const tM = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        alarms.push({
          time: `${tH}:${tM}`,
          level: lvl,
          message: msg,
          value: Number((baseValue + (Math.random() - 0.5) * 120).toFixed(3))
        });
      }
      setAlarmData(alarms.sort((a,b)=> a.time.localeCompare(b.time)));
    }
  }, [sensor]);

  // Close on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!sensor) return null;

  const base = parseFloat(sensor.value) || 0;
  const metrics = {
    totalFlow: Math.max(0, Number((Math.abs(base) * 0.5 + Math.random() * 5).toFixed(2))),
    instFlow: Number((Math.abs(base) + Math.random() * 5).toFixed(2)),
    pressure: Number(((sensor.type === 'pressure' ? Math.abs(base) : 0.05) || 0.05).toFixed(3)),
    temperature: Number((18 + Math.random() * 12).toFixed(2)),
    methane: Number((Math.random() * 0.02).toFixed(4)),
    co: Number((Math.random() * 2).toFixed(3)),
    h2s: Number((Math.random() * 0.5).toFixed(3)),
  };

  const status = alarmData.some(a => a.level !== 'info') ? '有预警' : '无预警';
  const statusColor = status === '有预警' ? 'text-red-500' : 'text-green-400';
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
        className="relative w-full max-w-3xl bg-[#0a192f] border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden animate-in zoom-in-95 duration-300"
        style={{ minWidth: 0 }}
      >
        {/* Top-right floating close (matches示例样式) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-cyan-400 hover:text-white transition-colors z-50 pointer-events-auto"
          aria-label="关闭"
          title="关闭"
        >
          <X size={20} />
        </button>
        
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-cyan-500/50"></div>
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/50"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/50"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/50"></div>

        {/* Header */}
        <div className="flex items-center justify-start px-4 py-3 border-b border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
            <h2 className="text-xl font-bold tracking-[0.2em] text-white">{sensor.name}</h2>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Top section: Info */}
          <div className="flex gap-10">
            {/* Avatar block */}
            <div className="w-44 h-52 bg-[#051124] border border-cyan-500/30 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-50"></div>
              <div className="w-28 h-28 bg-blue-600/20 rounded-xl flex items-center justify-center relative">
                <User size={80} className="text-blue-500/60" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500/20 border border-cyan-500/40 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Details list */}
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-5 text-[15px]">
              <DetailItem label="本次流量" value={`${metrics.totalFlow} m³`} />
              <DetailItem label="瞬时流量" value={`${metrics.instFlow} m³/h`} />
              <DetailItem label="压力" value={`${metrics.pressure} Mpa`} />
              <DetailItem label="温度" value={`${metrics.temperature} ℃`} />
              <DetailItem label="甲烷" value={`${metrics.methane} %CH`} />
              <DetailItem label="一氧化碳" value={`${metrics.co} PPM`} />
              <DetailItem label="硫化氢" value={`${metrics.h2s} mg`} />
              <DetailItem label="状态" value={status} color={statusColor} />
            </div>
          </div>

          {/* Bottom section: Chart */}
          <div className="flex flex-col gap-3">
            {/* Tab buttons */}
            <div className="flex justify-center">
              <div className="flex bg-[#162a4d]/40 border border-white/5 p-1 rounded">
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 px-6 py-2 text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <History size={16} /> 历史曲线
                </button>
                <button 
                  onClick={() => setActiveTab('alarm')}
                  className={`flex items-center gap-2 px-6 py-2 text-sm font-bold transition-all ${activeTab === 'alarm' ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}
                >
                  <Bell size={16} /> 报警记录
                </button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-56 w-full bg-[#162a4d]/20 border border-white/5 p-4 rounded relative" style={{ minWidth: 0 }}>
              {activeTab === 'history' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="modalFlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a192f', border: '1px solid #06b6d4', borderRadius: '0' }}
                      itemStyle={{ color: '#06b6d4' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#06b6d4" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#modalFlow)" 
                      dot={{ r: 3, fill: '#06b6d4' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full overflow-auto">
                  {alarmData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 gap-2 italic">
                      <AlertCircle size={20} /> 暂无报警记录
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {alarmData.map((a, i) => (
                        <li key={i} className="flex items-center justify-between px-3 py-2 bg-black/30 border border-white/10 rounded hover:bg-cyan-500/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${a.level === 'critical' ? 'bg-red-500' : a.level === 'warning' ? 'bg-yellow-400' : 'bg-cyan-400'}`}></span>
                            <span className="text-white text-sm">{a.message}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-slate-400">{a.time}</span>
                            <span className="text-cyan-400 font-mono">值: {a.value}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-cyan-400" }) => (
  <div className="flex items-center">
    <span className="text-white w-28 font-medium">{label}:</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

export default SensorDetailModal;
