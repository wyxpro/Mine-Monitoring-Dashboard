
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  ArrowRightLeft,
  Layers,
  Wrench,
  Settings,
  Maximize2,
  Eye,
  EyeOff
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
import Header from './components/Header';
import SidebarPanel from './components/SidebarPanel';
import MineSchematic from './components/MineSchematic';
import StatsOverview from './components/StatsOverview';
import SensorDetailModal from './components/SensorDetailModal';
import LayersModal from './components/LayersModal';
import SettingsModal from './components/SettingsModal';
import ToolsModal from './components/ToolsModal';
import AlarmHistoryModal from './components/AlarmHistoryModal';
import UserProfileModal from './components/UserProfileModal';
import HomeSummaryModal from './components/HomeSummaryModal';

const initialWaterLevelData = [
  { name: '探放水孔装置1', value: 0.825 },
  { name: '探放水孔装置2', value: 0.410 },
  { name: '探放水孔装置3', value: 0.293 },
  { name: '探放水孔装置4', value: 0.195 },
  { name: '探放水孔装置5', value: 0.582 },
];

const initialFlowData = [
  { name: '探放水孔装置1', value: 18.6 },
  { name: '探放水孔装置2', value: 207.000 },
  { name: '探放水孔装置3', value: 1084.315 },
  { name: '探放水孔装置4', value: 658.820 },
  { name: '探放水孔 装置5', value: 720.000 },
];

const initialPressureData = [
  { name: '探放水孔装置1', value: 0.262 },
  { name: '探放水孔装置2', value: 0.294 },
  { name: '探放水孔装置3', value: 1.781 },
  { name: '探放水孔装置4', value: 0.000 },
  { name: '探放水孔装置5', value: 0.025 },
  { name: '探放水孔装置6', value: 0.142 },
  { name: '探放水孔装置7', value: 0.089 },
];

const initialPipeFlowData = [
  { name: '探放水孔装置1', value: 0.000 },
  { name: '探放水孔装置2', value: 316.800 },
  { name: '探放水孔装置3', value: 0.000 },
  { name: '探放水孔装置4', value: 0.000 },
  { name: '探放水孔装置5', value: 0.000 },
  { name: '探放水孔装置6', value: 124.500 },
  { name: '探放水孔装置7', value: 45.210 },
];

const waterQualityData = [
  { label: '探放水孔装置1', val: '1.781' },
  { label: '探放水孔装置2 ', val: '0.000' },
  { label: '探放水孔装置3 ', val: '0.025' },
  { label: '探放水孔装置4 ', val: '0.036' },
  { label: '探放水孔装置5 ', val: '0.581' },
  { label: '探放水孔装置6 ', val: '0.262' },
];

const CustomXAxisLabel = ({ x, y, payload }: any) => {
  const words = payload.value.match(/.{1,4}/g) || [];
  return (
    <g transform={`translate(${x},${y})`}>
      {words.map((word: string, index: number) => (
        <text
          key={index}
          x={0}
          y={12 * (index + 1)}
          dy={0}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize={10}
          className="font-medium"
        >
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

// Auto-scrolling Table Component
const AutoScrollingTable: React.FC<{ data: { name: string; value: number }[]; unit?: string }> = ({ data, unit }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Duplicate data for seamless loop
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
        <div 
          className="animate-scroll-down"
          style={{ 
            animation: `scrollDown ${data.length * 3}s linear infinite`,
          }}
        >
          <table className="w-full text-left border-collapse">
            <tbody className="text-[15px]">
              {displayData.map((row, i) => (
                <tr key={i} className={`border-b border-white/5 transition-colors ${i % 2 === 1 ? 'bg-transparent' : 'bg-white/[0.01]'}`}>
                  <td className="py-5 px-4 text-slate-300 font-medium whitespace-pre-wrap">{row.name}</td>
                  <td className="py-5 px-4 text-right text-cyan-400 font-mono font-bold text-lg">
                    {row.value.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
      `}</style>
    </div>
  );
};

// Tech-styled Gauge Component for Water Quality
const TechGauge: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center w-full px-1 group">
      <div className="relative w-18 h-18 md:w-20 md:h-20 flex items-center justify-center mb-2">
        {/* Outer Segmented Ring */}
        <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-[2px] h-[6px] bg-cyan-400 left-1/2 top-0 origin-bottom -translate-x-1/2"
              style={{ transform: `translateX(-50%) rotate(${i * 30}deg)`, top: '2px', borderRadius: '1px' }}
            ></div>
          ))}
        </div>
        
        {/* Inner Segmented Ring */}
        <div className="absolute inset-2 border border-cyan-500/20 rounded-full"></div>
        <div className="absolute inset-4 border-2 border-dashed border-cyan-500/30 rounded-full animate-[spin_20s_linear_infinite]"></div>
        
        {/* Center Glow and Value */}
        <div className="z-10 flex items-center justify-center">
          <span className="text-[13px] md:text-[14px] font-bold text-white tracking-tighter drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] font-mono">
            {value}
          </span>
        </div>
        
        {/* Decoration Arc */}
        <div className="absolute inset-[6px] border-t-2 border-cyan-400 rounded-full opacity-60"></div>
        
        {/* Top Detail Pin */}
        <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]"></div>
            <div className="absolute w-3 h-3 border border-cyan-400/50 rounded-full"></div>
        </div>
      </div>
      
      {/* Label with improved wrapping and adequate spacing */}
      <div className="text-[10px] leading-[1.4] text-slate-300 text-center font-medium w-full min-h-[40px] px-1">
        {label}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [pressureData, setPressureData] = useState(initialPressureData);
  const [pipeFlowData, setPipeFlowData] = useState(initialPipeFlowData);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<any>(null);
  const [activePanel, setActivePanel] = useState<'layers' | 'settings' | 'tools' | 'alarm' | 'user' | 'home' | null>(null);
  const [tempA, setTempA] = useState(26.6);
  const [tempB, setTempB] = useState(22.8);
  const [holeStats, setHoleStats] = useState({
    total: 30,
    online: 18,
    offline: 8,
    warning: 4,
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Simulate real-time data fluctuations
    const dataTimer = setInterval(() => {
      setPressureData(prev => prev.map(item => ({
        ...item,
        value: item.value > 0 
          ? Number((item.value + (Math.random() - 0.5) * 0.01).toFixed(3))
          : 0
      })));

      setPipeFlowData(prev => prev.map(item => ({
        ...item,
        value: item.value > 0 
          ? Number((item.value + (Math.random() - 0.5) * 2).toFixed(3))
          : 0
      })));
      
      setTempA(prev => {
        const next = prev + (Math.random() - 0.5) * 0.3;
        const clamped = Math.min(28.5, Math.max(25.5, next));
        return Number(clamped.toFixed(1));
      });
      setTempB(prev => {
        const next = prev + (Math.random() - 0.5) * 0.25;
        const clamped = Math.min(24.5, Math.max(21.5, next));
        return Number(clamped.toFixed(1));
      });
      
      // 微变化更新探放水孔统计，保持总数不变
      setHoleStats(prev => {
        let { total, online, offline, warning } = prev;
        // 随机选择一项微调
        const r = Math.random();
        if (r < 0.33) online = Math.max(0, Math.min(total, online + (Math.random() < 0.5 ? -1 : 1)));
        else if (r < 0.66) offline = Math.max(0, Math.min(total, offline + (Math.random() < 0.5 ? -1 : 1)));
        else warning = Math.max(0, Math.min(total, warning + (Math.random() < 0.5 ? -1 : 1)));
        // 规范化，避免超过总数
        const sum = online + offline + warning;
        if (sum > total) {
          // 优先减少最大项
          const arr = [{k:'online',v:online},{k:'offline',v:offline},{k:'warning',v:warning}].sort((a,b)=>b.v-a.v);
          let excess = sum - total;
          for (const item of arr) {
            const reduce = Math.min(item.v, excess);
            if (item.k === 'online') online -= reduce;
            if (item.k === 'offline') offline -= reduce;
            if (item.k === 'warning') warning -= reduce;
            excess -= reduce;
            if (excess <= 0) break;
          }
        }
        return { total, online, offline, warning };
      });
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(dataTimer);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="h-screen w-screen bg-[#030816] text-slate-200 flex flex-col overflow-hidden select-none">
      <Header 
        currentTime={time} 
        onHomeClick={() => setActivePanel('home')}
        onAlarmClick={() => setActivePanel('alarm')}
        onSettingsClick={() => setActivePanel('settings')}
        onFullscreenClick={toggleFullscreen}
        onUserClick={() => setActivePanel('user')}
      />
      
      <main className="flex-1 flex p-4 gap-4 overflow-hidden relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#00f2ff 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

        {/* Left Panels */}
        <div className="w-[440px] flex flex-col z-10 overflow-y-auto pr-2">
          
          {/* 水压数据 Panel - AUTO SCROLLING */}
          <SidebarPanel title="水压数据" unit="Mpa">
            <AutoScrollingTable data={pressureData} />
          </SidebarPanel>

          {/* 流量数据 Panel */}
          <SidebarPanel title="流量数据" unit="m³/h">
            <div className="h-[240px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={initialFlowData} margin={{ top: 30, right: 30, left: -10, bottom: 60 }}>
                  <defs>
                    <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    interval={0} 
                    tick={<CustomXAxisLabel />}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={11} 
                    ticks={[0, 200, 400, 600, 800, 1000, 1200]}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 25, 47, 0.95)', border: '1px solid #00f2ff' }} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00f2ff" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorFlow)" 
                    dot={{ r: 5, fill: '#00f2ff', stroke: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 7, strokeWidth: 0 }}
                  >
                    <LabelList dataKey="value" position="top" fill="#fff" fontSize={11} fontWeight="bold" offset={10} />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>

          {/* 水位数据 Panel */}
          <SidebarPanel title="水位数据" unit="mm">
            <div className="h-[300px] w-full mt-[-10px]"> 
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={initialWaterLevelData} 
                  margin={{ top: 25, right: 10, left: -20, bottom: 85 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    interval={0} 
                    tick={<CustomXAxisLabel />} 
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 1]} 
                    ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={11}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickLine={false}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(6,182,212,0.05)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#barGradient)" 
                    radius={[0, 0, 0, 0]} 
                    barSize={32}
                    isAnimationActive={false}
                  >
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      fill="#ffffff" 
                      fontSize={14} 
                      fontWeight="bold" 
                      offset={10} 
                    />
                  </Bar>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f2ff" stopOpacity={1} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>
        </div>

        {/* Center Visualization */}
        <div className="flex-1 relative flex flex-col">
          <StatsOverview 
            totalHoles={holeStats.total}
            alertsCount={holeStats.warning}
            onlineHoles={holeStats.online}
            offlineHoles={holeStats.offline}
            warningHoles={holeStats.warning}
          />
          <MineSchematic 
            showLabels={showLabels} 
            onSelectSensor={(sensor) => setSelectedSensor(sensor)}
          />
          
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
            <button
              onClick={() => setShowLabels(v => !v)}
              className="w-11 h-11 flex items-center justify-center bg-slate-900/90 border border-cyan-500/50 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 text-cyan-400 transition-all"
              title={showLabels ? '隐藏标签' : '显示标签'}
            >
              {showLabels ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
            <button
              onClick={() => setActivePanel('layers')}
              className="w-11 h-11 flex items-center justify-center bg-slate-900/90 border border-cyan-500/50 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 text-cyan-400 transition-all"
              title="图层控制"
            >
               <Layers size={22} />
            </button>
            <button
              onClick={() => setActivePanel('tools')}
              className="w-11 h-11 flex items-center justify-center bg-slate-900/90 border border-cyan-500/50 rounded shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/30 text-cyan-400 transition-all"
              title="工具箱"
            >
               <Wrench size={22} />
            </button>
          </div>
        </div>

        {/* Right Panels */}
        <div className="w-[420px] flex flex-col z-10 overflow-y-auto pl-2">
          {/* 管道流量数据 Panel - AUTO SCROLLING */}
          <SidebarPanel title="管道流量数据" unit="m³/h">
             <AutoScrollingTable data={pipeFlowData} />
          </SidebarPanel>

          {/* 水质数据 Panel - ADJUSTED FOR BETTER VISIBILITY */}
          <SidebarPanel title="水质数据" unit="NTU">
            <div className="grid grid-cols-3 gap-y-4 gap-x-2 mt-2 px-1 pb-4">
              {waterQualityData.map((item, i) => (
                <TechGauge key={i} value={item.val} label={item.label} />
              ))}
            </div>
          </SidebarPanel>

          {/* 温度数据 Panel */}
          <SidebarPanel title="温度数据" unit="℃">
            <div className="flex justify-around items-center py-6">
              <div className="flex flex-col items-center group">
                <div className="relative w-28 h-28 flex items-center justify-center border-[8px] border-cyan-500/10 rounded-full transition-transform group-hover:scale-105">
                  <div className="absolute inset-0 border-t-[8px] border-cyan-500 rounded-full rotate-[120deg] shadow-[0_0_15px_rgba(6,182,212,0.4)]"></div>
                  <span className="text-cyan-400 font-black text-2xl italic">{tempA.toFixed(1)}</span>
                </div>
                <span className="text-[12px] text-slate-400 mt-4 font-semibold tracking-wide">21404采空区温度</span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="relative w-28 h-28 flex items-center justify-center border-[8px] border-blue-500/10 rounded-full transition-transform group-hover:scale-105">
                  <div className="absolute inset-0 border-t-[8px] border-blue-500 rounded-full -rotate-[45deg] shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
                  <span className="text-blue-400 font-black text-2xl italic">{tempB.toFixed(1)}</span>
                </div>
                <span className="text-[12px] text-slate-400 mt-4 font-semibold tracking-wide">中央井底水文孔</span>
              </div>
            </div>
          </SidebarPanel>
        </div>
      </main>

      <div className="bg-cyan-500/10 h-[1px] w-full"></div>

      {/* Sensor Detail Modal */}
      <SensorDetailModal 
        sensor={selectedSensor} 
        onClose={() => setSelectedSensor(null)} 
      />

      {/* Control Panels */}
      <LayersModal 
        isOpen={activePanel === 'layers'} 
        onClose={() => setActivePanel(null)} 
      />
      <SettingsModal 
        isOpen={activePanel === 'settings'} 
        onClose={() => setActivePanel(null)} 
      />
      <ToolsModal 
        isOpen={activePanel === 'tools'} 
        onClose={() => setActivePanel(null)} 
      />
      <AlarmHistoryModal 
        isOpen={activePanel === 'alarm'} 
        onClose={() => setActivePanel(null)} 
      />
      <UserProfileModal 
        isOpen={activePanel === 'user'} 
        onClose={() => setActivePanel(null)} 
      />
      <HomeSummaryModal 
        isOpen={activePanel === 'home'} 
        onClose={() => setActivePanel(null)} 
      />
    </div>
  );
};

export default App;
