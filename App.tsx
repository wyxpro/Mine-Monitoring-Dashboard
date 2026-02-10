
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SidebarPanel from './components/SidebarPanel';
import MineSchematic from './components/MineSchematic';
import StatsOverview from './components/StatsOverview';
import HomeView from './components/HomeView';
import DrainageDashboard from './components/DrainageDashboard';
import { 
  Layers,
  Wrench,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LabelList
} from 'recharts';

// Existing data constants preserved
const initialWaterLevelData = [
  { name: '四盘区泄水巷404密闭墙液位计', value: 0.825 },
  { name: '22103辅运密闭墙液位计', value: 0.410 },
  { name: '21201主运切眼密闭墙液位计', value: 0.293 },
  { name: '四盘区泄水巷3600米密闭墙液位计', value: 0.195 },
  { name: '22103切眼密闭路面液位计', value: 0.582 },
];

const initialFlowData = [
  { name: '四盘区水仓明渠流量', value: 18.6 },
  { name: '一盘区水仓明渠流量', value: 207.000 },
  { name: '中央水仓明渠流量', value: 1084.315 },
  { name: '2号水仓明渠流量', value: 658.820 },
];

const initialPressureData = [
  { name: '4盘区主运巷末端水文监测...', value: 0.262 },
  { name: '2111水文监测孔 (水压)', value: 0.294 },
  { name: '中央风井底水文监测孔 1#...', value: 1.781 },
  { name: '四盘区水仓水文监测孔 (...', value: 0.000 },
  { name: '四盘区泄水巷水文监测孔...', value: 0.025 },
  { name: '一盘区西翼监测孔 (水压)', value: 0.142 },
  { name: '3号煤层回风巷监测点', value: 0.089 },
];

const initialPipeFlowData = [
  { name: '东翼斜巷管道流量B管', value: 0.000 },
  { name: '403主运反倔管道流量计A管', value: 316.800 },
  { name: '403主运反倔管道流量计B管', value: 0.000 },
  { name: '西翼斜巷管道流量A管', value: 0.000 },
  { name: '水仓管道流量A管', value: 0.000 },
  { name: '南翼主运辅助管路流量', value: 124.500 },
  { name: '二盘区回风巷排水流量', value: 45.210 },
];

const waterQualityData = [
  { label: '中央风井底水文监测孔1# (水压)', val: '1.781' },
  { label: '四盘区水仓水文监测孔 (水压)', val: '0.000' },
  { label: '四盘区泄水巷水文监测孔 (水压)', val: '0.025' },
  { label: '一盘区水仓水文监测孔 (水压)', val: '0.036' },
  { label: '4盘区泄水巷水文监测孔新 (水压)', val: '0.581' },
  { label: '4盘区主运巷末端水文监测孔 (水压)', val: '0.262' },
];

const CustomXAxisLabel = ({ x, y, payload }: any) => {
  const words = payload.value.match(/.{1,4}/g) || [];
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word: string, index: number) => (
        <text key={index} x={0} y={12 * (index + 1)} dy={0} textAnchor="middle" fill="#94a3b8" fontSize={10} className="font-medium">
          {word}
        </text>
      ))}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a192f]/95 border border-cyan-400 p-3 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
        <p className="text-white text-sm font-bold mb-1">{payload[0].payload.name}</p>
        <p className="text-cyan-400 text-sm">
          <span className="opacity-80">value : </span>
          <span className="font-mono">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const AutoScrollingTable: React.FC<{ data: { name: string; value: number }[]; unit?: string }> = ({ data }) => {
  const displayData = [...data, ...data];
  return (
    <div className="w-full mt-2 overflow-hidden h-[300px] relative">
      <table className="w-full text-left border-collapse sticky top-0 z-10 bg-[#030816]">
        <thead>
          <tr className="text-slate-400 text-[14px]">
            <th className="py-4 px-4 font-normal bg-[#162a4d]/30 text-slate-400">传感器名称</th>
            <th className="py-4 px-4 font-normal bg-[#162a4d]/30 text-right text-slate-400">实时数据</th>
          </tr>
        </thead>
      </table>
      <div className="overflow-hidden h-[240px]">
        <div className="animate-scroll-down" style={{ animation: `scrollDown ${data.length * 3}s linear infinite` }}>
          <table className="w-full text-left border-collapse">
            <tbody className="text-[15px]">
              {displayData.map((row, i) => (
                <tr key={i} className={`border-b border-white/5 transition-colors ${i % 2 === 1 ? 'bg-transparent' : 'bg-white/[0.01]'}`}>
                  <td className="py-5 px-4 text-slate-300 font-medium whitespace-pre-wrap">{row.name}</td>
                  <td className="py-5 px-4 text-right text-cyan-400 font-mono font-bold text-lg">{row.value.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0%); } }`}</style>
    </div>
  );
};

const TechGauge: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center w-full px-1 group">
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-3">
        <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="absolute w-[2px] h-[6px] bg-cyan-400 left-1/2 top-0 origin-bottom -translate-x-1/2" style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, top: '2px', borderRadius: '1px' }}></div>
          ))}
        </div>
        <div className="absolute inset-2 border border-cyan-500/20 rounded-full"></div>
        <div className="absolute inset-4 border-2 border-dashed border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div className="z-10 flex items-center justify-center">
          <span className="text-[14px] md:text-[15px] font-bold text-white tracking-tighter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] font-mono">{value}</span>
        </div>
        <div className="absolute inset-[6px] border-t-2 border-cyan-400 rounded-full opacity-60"></div>
        <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]"></div>
            <div className="absolute w-3 h-3 border border-cyan-400/50 rounded-full"></div>
        </div>
      </div>
      <div className="text-[11px] leading-[1.4] text-slate-300 text-center font-medium w-full min-h-[52px] px-1">{label}</div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'drainage'>('home');
  const [time, setTime] = useState(new Date());
  const [pressureData, setPressureData] = useState(initialPressureData);
  const [pipeFlowData, setPipeFlowData] = useState(initialPipeFlowData);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const dataTimer = setInterval(() => {
      setPressureData(prev => prev.map(item => ({ ...item, value: item.value > 0 ? Number((item.value + (Math.random() - 0.5) * 0.01).toFixed(3)) : 0 })));
      setPipeFlowData(prev => prev.map(item => ({ ...item, value: item.value > 0 ? Number((item.value + (Math.random() - 0.5) * 2).toFixed(3)) : 0 })));
    }, 3000);
    return () => { clearInterval(timer); clearInterval(dataTimer); };
  }, []);

  if (currentView === 'home') {
    return <HomeView onNavigate={(view) => setCurrentView(view as any)} currentTime={time} />;
  }

  if (currentView === 'drainage') {
    return <DrainageDashboard onBack={() => setCurrentView('home')} currentTime={time} />;
  }

  return (
    <div className="h-screen w-screen bg-[#030816] text-slate-200 flex flex-col overflow-hidden select-none">
      <Header currentTime={time} onHomeClick={() => setCurrentView('home')} />
      <main className="flex-1 flex p-4 gap-4 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00f2ff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
        <div className="w-[440px] flex flex-col z-10 overflow-y-auto pr-2">
          <SidebarPanel title="水位数据" unit="mm">
            <div className="h-[300px] w-full mt-[-10px]"> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={initialWaterLevelData} margin={{ top: 25, right: 10, left: -20, bottom: 85 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" interval={0} tick={<CustomXAxisLabel />} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={false} />
                  <YAxis domain={[0, 1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]} stroke="rgba(255,255,255,0.4)" fontSize={11} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,182,212,0.05)' }} />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[0, 0, 0, 0]} barSize={32} isAnimationActive={false}>
                    <LabelList dataKey="value" position="top" fill="#ffffff" fontSize={14} fontWeight="bold" offset={10} />
                  </Bar>
                  <defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00f2ff" stopOpacity={1} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} /></linearGradient></defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>
          <SidebarPanel title="流量数据" unit="m³/h">
            <div className="h-[240px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={initialFlowData} margin={{ top: 30, right: 30, left: -10, bottom: 60 }}>
                  <defs><linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f2ff" stopOpacity={0.6}/><stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" interval={0} tick={<CustomXAxisLabel />} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} ticks={[0, 200, 400, 600, 800, 1000, 1200]} axisLine={{ stroke: 'rgba(255,255,255,0.2)' }} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.95)', border: '1px solid #00f2ff' }} />
                  <Area type="monotone" dataKey="value" stroke="#00f2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" dot={{ r: 5, fill: '#00f2ff', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 7, strokeWidth: 0 }}>
                    <LabelList dataKey="value" position="top" fill="#fff" fontSize={11} fontWeight="bold" offset={10} />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>
          <SidebarPanel title="水压数据" unit="Mpa">
            <AutoScrollingTable data={pressureData} />
          </SidebarPanel>
        </div>
        <div className="flex-1 relative flex flex-col">
          <StatsOverview />
          <MineSchematic />
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
            <button className="w-11 h-11 flex items-center justify-center bg-slate-900/90 border border-cyan-500/50 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 text-cyan-400 transition-all"><Layers size={22} /></button>
            <button className="w-11 h-11 flex items-center justify-center bg-slate-900/90 border border-cyan-500/50 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 text-cyan-400 transition-all"><Settings size={22} /></button>
            <button className="w-11 h-11 flex items-center justify-center bg-slate-900/90 border border-cyan-500/50 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 text-cyan-400 transition-all"><Wrench size={22} /></button>
          </div>
        </div>
        <div className="w-[420px] flex flex-col z-10 overflow-y-auto pl-2">
          <SidebarPanel title="管道流量数据" unit="m³/h">
             <AutoScrollingTable data={pipeFlowData} />
          </SidebarPanel>
          <SidebarPanel title="水质数据" unit="NTU">
            <div className="grid grid-cols-3 gap-y-8 gap-x-2 mt-4 px-1 pb-10">
              {waterQualityData.map((item, i) => <TechGauge key={i} value={item.val} label={item.label} />)}
            </div>
          </SidebarPanel>
          <SidebarPanel title="温度数据" unit="℃">
            <div className="flex justify-around items-center py-6">
              <div className="flex flex-col items-center group">
                <div className="relative w-28 h-28 flex items-center justify-center border-[8px] border-cyan-500/10 rounded-full transition-transform group-hover:scale-105">
                  <div className="absolute inset-0 border-t-[8px] border-cyan-500 rounded-full rotate-[120deg] shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
                  <span className="text-cyan-400 font-black text-2xl italic">26.6</span>
                </div>
                <span className="text-[12px] text-slate-400 mt-4 font-semibold tracking-wide">21404采空区温度</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="relative w-28 h-28 flex items-center justify-center border-[8px] border-blue-500/10 rounded-full transition-transform group-hover:scale-105">
                  <div className="absolute inset-0 border-t-[8px] border-blue-500 rounded-full -rotate-[45deg] shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
                  <span className="text-blue-400 font-black text-2xl italic">22.8</span>
                </div>
                <span className="text-[12px] text-slate-400 mt-4 font-semibold tracking-wide">中央井底水文孔</span>
              </div>
            </div>
          </SidebarPanel>
        </div>
      </main>
      <div className="bg-cyan-500/10 h-[1px] w-full"></div>
    </div>
  );
};

export default App;
