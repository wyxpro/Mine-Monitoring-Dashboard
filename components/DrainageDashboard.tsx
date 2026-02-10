
import React from 'react';
import Header from './Header';
import SidebarPanel from './SidebarPanel';
import MineSchematic from './MineSchematic';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DrainageDashboardProps {
  onBack: () => void;
  currentTime: Date;
}

const pressureData = [
  { name: '10-1', value: 2.2 },
  { name: '10-2', value: 3.1 },
  { name: '10-3', value: 3.1 },
  { name: '10-4', value: 2.1 },
  { name: '10-5', value: 1.5 },
  { name: '10-6', value: 1.2 },
  { name: '10-7', value: 0.7 },
];

const temperatureData = [
  { name: '10-1', value: 50 },
  { name: '10-2', value: 25 },
  { name: '10-3', value: 65 },
  { name: '10-4', value: 25 },
  { name: '10-5', value: 35 },
  { name: '10-6', value: 35 },
  { name: '10-7', value: 85 },
];

const flowData = [
  { name: '01', v1: 5, v2: 3 }, { name: '02', v1: 3, v2: 4 }, { name: '03', v1: 5, v2: 2 },
  { name: '04', v1: 6, v2: 4 }, { name: '05', v1: 1, v2: 3 }, { name: '06', v1: 5, v2: 5 },
  { name: '07', v1: 4, v2: 2 }, { name: '08', v1: 2, v2: 6 }, { name: '09', v1: 6, v2: 5 },
  { name: '11', v1: 5, v2: 3 }, { name: '12', v1: 6, v2: 6 }, { name: '13', v1: 2, v2: 4 },
  { name: '14', v1: 8, v2: 3 }, { name: '15', v1: 6, v2: 4 }, { name: '16', v1: 4, v2: 2 },
  { name: '17', v1: 1, v2: 6 }, { name: '18', v1: 5, v2: 4 }, { name: '19', v1: 5, v2: 2 },
  { name: '20', v1: 1, v2: 4 }, { name: '21', v1: 7, v2: 6 }, { name: '22', v1: 3, v2: 2 },
  { name: '23', v1: 5, v2: 3 }, { name: '24', v1: 1, v2: 2 },
];

const waterQualityData = [
  { name: '10-1', value: 2.2 },
  { name: '10-2', value: 3.1 },
  { name: '10-3', value: 3.1 },
  { name: '10-4', value: 9.2 },
  { name: '10-5', value: 14.8 },
  { name: '10-6', value: 12.1 },
  { name: '10-7', value: 6.2 },
  { name: '10-8', value: 4.1 },
];

// High-fidelity segmented gauge logic
const TOTAL_SEGMENTS = 24;
const ACTIVE_PERCENT = 84;
const activeSegmentsCount = Math.floor((ACTIVE_PERCENT / 100) * TOTAL_SEGMENTS);
const runtimeSegments = Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => ({
  value: 1,
  active: i < activeSegmentsCount,
}));

const gasGaugeData = [
  { name: 'p1', value: 20 },
  { name: 'p2', value: 20 },
  { name: 'p3', value: 20 },
  { name: 'p4', value: 20 },
  { name: 'p5', value: 20 },
];
const GAS_COLORS = ['#00f2ff', '#06b6d4', '#0284c7', '#0369a1', '#075985'];

const GasSegmentedGauge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col items-center w-full py-2">
    <span className="text-[14px] font-bold text-cyan-400 tracking-widest mb-3 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
      {label}
    </span>
    <div className="relative w-24 h-24 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 4, bottom: 4, left: 4, right: 4 }}>
          <Pie
            data={gasGaugeData}
            cx="50%"
            cy="50%"
            innerRadius={26}
            outerRadius={38}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {gasGaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GAS_COLORS[index % GAS_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-base font-black font-mono text-white tracking-tighter drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">{value}</span>
      </div>
      <div className="absolute w-[92%] h-[92%] border border-white/5 rounded-full pointer-events-none"></div>
    </div>
  </div>
);

const BigDigitalCounter: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col items-center px-12 border-x border-white/5 first:border-l-0 last:border-r-0">
    <div className="flex items-end gap-1.5">
      {value.split('').map((char, i) => (
        <div key={i} className="w-11 h-16 bg-gradient-to-b from-[#1a2b4b] to-[#0a192f] border border-cyan-500/40 rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <span className="text-[44px] font-black font-mono text-cyan-400 drop-shadow-[0_0_12px_cyan] leading-none">{char}</span>
        </div>
      ))}
      <span className="mb-1 ml-2 text-2xl font-bold text-slate-400 italic font-mono">/L</span>
    </div>
    <span className="mt-4 text-[15px] text-slate-200 font-medium tracking-[0.4em] uppercase">{label}</span>
  </div>
);

const DrainageDashboard: React.FC<DrainageDashboardProps> = ({ onBack, currentTime }) => {
  return (
    <div className="h-screen w-screen bg-[#030816] text-slate-200 flex flex-col overflow-hidden select-none relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 242, 255, 0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <Header currentTime={currentTime} title="探放水实时监测" onHomeClick={onBack} />
      
      <main className="flex-1 flex p-5 gap-6 overflow-hidden relative z-10">
        {/* Left Column */}
        <div className="w-[440px] flex flex-col gap-5 overflow-y-auto pr-2">
          <SidebarPanel title="压力">
            <div className="h-[220px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pressureData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0a192f', borderColor: '#00f2ff', borderRadius: '4px' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>

          <SidebarPanel title="温度">
             <div className="h-[220px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={temperatureData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0a192f', borderColor: '#10b981', borderRadius: '4px' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[2, 2, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>

          <SidebarPanel title="气体监测">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0a192f]/60 border border-white/10 p-1 rounded-sm flex items-center justify-center">
                <GasSegmentedGauge label="甲烷" value="0.04" />
              </div>
              <div className="bg-[#0a192f]/60 border border-white/10 p-1 rounded-sm flex items-center justify-center">
                <GasSegmentedGauge label="硫化氢" value="0.00" />
              </div>
              <div className="bg-[#0a192f]/60 border border-white/10 p-1 rounded-sm flex items-center justify-center">
                <GasSegmentedGauge label="一氧化碳" value="0.00" />
              </div>
            </div>
          </SidebarPanel>
        </div>

        {/* Center Column */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-40 flex items-center justify-center bg-[#0a192f]/20 border-y border-white/5 backdrop-blur-sm">
            <BigDigitalCounter label="累计总排水量 (升)" value="12581189" />
            <BigDigitalCounter label="今日总排水量 (升)" value="3912410" />
          </div>

          <div className="flex-1 relative bg-black/40 rounded-sm border border-white/10 overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
            <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-black/60 border border-cyan-500/30 text-[11px] text-cyan-400 font-mono flex items-center gap-3 backdrop-blur-md">
               <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_cyan]"></div>
               <span className="tracking-[0.2em] font-bold">SPATIAL MONITORING: ACTIVE_LINK_OK</span>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
            
            <MineSchematic />
            
            <div className="absolute bottom-6 right-6 flex items-center gap-4 z-20">
              <div className="px-4 py-2 bg-black/60 border border-white/10 text-white/60 text-xs font-mono backdrop-blur-md">MAP_RENDER_V4.2</div>
              <div className="w-12 h-12 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center text-cyan-400 cursor-pointer hover:bg-cyan-500/40 transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[440px] flex flex-col gap-5 overflow-y-auto pl-2">
          <SidebarPanel title="实时流量">
            <div className="h-[220px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flowData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flowGradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="flowGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a192f', borderColor: '#10b981', borderRadius: '4px' }} />
                  <Area type="monotone" dataKey="v1" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#flowGradient1)" />
                  <Area type="monotone" dataKey="v2" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#flowGradient2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>

          <SidebarPanel title="水质">
            <div className="h-[220px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterQualityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#0a192f', borderColor: '#3b82f6', borderRadius: '4px' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SidebarPanel>

          <SidebarPanel title="运行时长">
            <div className="h-[240px] w-full flex items-center justify-center relative py-4 overflow-visible">
               {/* Background Glow */}
               <div className="absolute w-[180px] h-[180px] bg-cyan-500/5 rounded-full blur-2xl z-0"></div>

               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={runtimeSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={92}
                      startAngle={90}
                      endAngle={-270}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {runtimeSegments.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.active ? (index < 12 ? '#3b82f6' : '#06b6d4') : 'rgba(30, 41, 59, 0.4)'} 
                          className={entry.active ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' : ''}
                        />
                      ))}
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
               
               {/* Industrial Decorative Elements - rendered below text */}
               <div className="absolute w-[210px] h-[210px] border border-white/5 rounded-full pointer-events-none opacity-30 z-10"></div>
               <div className="absolute w-[128px] h-[128px] border border-cyan-500/10 rounded-full pointer-events-none shadow-[inset_0_0_30px_rgba(0,242,255,0.05)] bg-[#030816]/70 z-10"></div>

               {/* Center Text UI - Rendered on TOP (z-index 50) with crisp shadow logic */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50">
                  <div className="flex flex-col items-center">
                    <div 
                      className="text-5xl font-black text-white font-mono flex items-baseline leading-none tracking-tight"
                      style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.4)' }}
                    >
                      {ACTIVE_PERCENT}<span className="text-xl font-bold ml-1 text-cyan-400 opacity-100">%</span>
                    </div>
                    <div 
                      className="text-[11px] text-cyan-400 font-black tracking-[0.5em] mt-3 uppercase"
                      style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.6)' }}
                    >
                      Total_Life
                    </div>
                  </div>
               </div>
            </div>
          </SidebarPanel>
        </div>
      </main>
      
      <div className="h-8 bg-[#0a192f] border-t border-white/5 px-6 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-widest z-20">
         <div className="flex gap-8">
            <span>NETWORK: SECURE</span>
            <span>DATA_STREAM: STABLE</span>
            <span>UPLINK: 21.4MB/S</span>
         </div>
         <div className="flex gap-4">
            <span>COORD_X: 241.09</span>
            <span>COORD_Y: 88.32</span>
            <span>COORD_Z: -102.44</span>
         </div>
      </div>
    </div>
  );
};

export default DrainageDashboard;
