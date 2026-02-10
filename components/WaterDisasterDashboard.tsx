
import React, { useState, useEffect } from 'react';
import Header from './Header';
import MineSchematic from './MineSchematic';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis
} from 'recharts';
import { Search, RotateCcw, Layers, Layout, Phone, FileText, ChevronRight } from 'lucide-react';

interface WaterDisasterDashboardProps {
  onBack: () => void;
  currentTime: Date;
}

const trendData = [
  { id: 1, location: '工业广场', value: '0.00', trend: '↓ 100' },
  { id: 2, location: '-150东轨...', value: '-64.98', trend: '↓ 6598' },
  { id: 3, location: '-150东轨...', value: '107.90', trend: '↑ 10690' },
];

const alarmDonutData = [
  { name: 'Total', value: 3, color: '#10b981' },
  { name: 'Alarm', value: 0, color: '#ef4444' },
  { name: 'Abnormal', value: 0, color: '#f59e0b' },
];

const predictionRadarData = [
  { subject: '防水措施', A: 80, fullMark: 100 },
  { subject: '水文地质类', A: 90, fullMark: 100 },
  { subject: '水文预警', A: 60, fullMark: 100 },
];

const WaterDisasterDashboard: React.FC<WaterDisasterDashboardProps> = ({ onBack, currentTime }) => {
  return (
    <div className="h-screen w-screen bg-[#030816] text-slate-200 flex flex-col overflow-hidden relative">
      <Header currentTime={currentTime} title="平台" onHomeClick={onBack} />
      
      <main className="flex-1 flex p-5 gap-6 relative z-10 overflow-hidden">
        {/* Left Side Panels */}
        <div className="w-[420px] flex flex-col gap-6 z-20">
          {/* Trend Analysis */}
          <div className="flex-1 flex flex-col cyber-border p-4 rounded-sm">
            <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3 tracking-widest">水害趋势分析</h2>
            
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="请输入安装地点进行搜索..." 
                className="w-full bg-[#0a192f] border border-cyan-500/30 py-1.5 px-4 pr-10 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500" size={16} />
            </div>

            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="text-cyan-400 border-b border-cyan-500/20">
                  <th className="py-2 px-1 text-left font-normal">序号</th>
                  <th className="py-2 px-1 text-left font-normal">安装地点</th>
                  <th className="py-2 px-1 text-right font-normal">监测值</th>
                  <th className="py-2 px-1 text-right font-normal">趋势变化</th>
                </tr>
              </thead>
              <tbody>
                {trendData.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                    <td className="py-3 px-1 text-slate-400">{row.id}</td>
                    <td className="py-3 px-1 text-white truncate max-w-[120px]">{row.location}</td>
                    <td className="py-3 px-1 text-right font-mono text-cyan-400">{row.value}</td>
                    <td className={`py-3 px-1 text-right font-mono ${row.trend.includes('↑') ? 'text-red-400' : 'text-green-400'}`}>
                      {row.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Warning Alarms */}
          <div className="flex-1 flex flex-col cyber-border p-4 rounded-sm">
            <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3 tracking-widest">水害预警报警情况</h2>
            
            <div className="flex justify-around items-center mb-6">
              {alarmDonutData.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-20 h-20 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: 100 - d.value }, { value: d.value }]}
                          innerRadius={28}
                          outerRadius={36}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          <Cell fill="rgba(255,255,255,0.05)" stroke="none" />
                          <Cell fill={d.color} stroke="none" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <span className="absolute text-xl font-black text-white">{d.value}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2">{d.name === 'Total' ? '总数' : d.name === 'Alarm' ? '报警数量' : '异常波动'}</span>
                </div>
              ))}
            </div>

            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="请输入安装地点搜索..." 
                className="w-full bg-[#0a192f] border border-cyan-500/30 py-1.5 px-4 pr-10 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500" size={16} />
            </div>

            <div className="flex-1 flex items-center justify-center text-slate-500 italic text-sm border border-white/5 bg-black/20">
              暂无数据
            </div>
          </div>
        </div>

        {/* Center Schematic */}
        <div className="flex-1 relative">
          {/* Top Navigation Overlay */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-4 z-30">
            {['灾害预测预警', '智能双重预防', '应急管理', '灾害综合评价', '生产系统综合评价'].map((tab, i) => (
              <div 
                key={i} 
                className={`px-6 py-2 border border-cyan-500/40 text-xs font-bold tracking-widest cursor-pointer transition-all hover:bg-cyan-500/20 backdrop-blur-md ${i === 3 ? 'bg-cyan-500/30 border-cyan-400' : 'bg-[#0a192f]/60'}`}
                style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="absolute inset-0 bg-[#030816]">
             <MineSchematic />
          </div>

          {/* Central Label Overlay */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center pointer-events-none z-30">
            <h1 className="text-5xl font-black text-white tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">预案智能调用</h1>
            <h2 className="text-4xl font-bold text-white mt-4 tracking-[0.3em] opacity-90">与执行跟踪</h2>
          </div>
        </div>

        {/* Right Side Panels */}
        <div className="w-[360px] flex flex-col gap-6 z-20">
          {/* Prediction Evaluation */}
          <div className="flex-1 flex flex-col cyber-border p-4 rounded-sm">
            <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3 tracking-widest">水害预测评价</h2>
            
            <div className="flex gap-2 mb-4">
              <select className="flex-1 bg-[#0a192f] border border-cyan-500/30 text-[11px] text-slate-300 py-1 px-2 focus:outline-none">
                <option>请选择...</option>
              </select>
              <button className="bg-cyan-500/20 border border-cyan-500 px-4 py-1 text-[11px] text-cyan-400 font-bold hover:bg-cyan-500/40 transition-colors">选择</button>
            </div>

            <div className="h-[220px] w-full flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={predictionRadarData}>
                    <PolarGrid stroke="rgba(0,242,255,0.2)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                      name="Prediction"
                      dataKey="A"
                      stroke="#00f2ff"
                      fill="#00f2ff"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
               </ResponsiveContainer>
               <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                 <span className="text-[10px] text-cyan-400 font-bold">水文预警</span>
               </div>
            </div>

            <div className="mt-4 flex justify-between text-xs px-2">
              <span className="text-slate-400">灾害状态: <span className="text-green-400 font-bold">安全</span></span>
              <span className="text-slate-400">灾害发生概率: <span className="text-green-400 font-bold">极低</span></span>
            </div>
          </div>

          {/* Prevention Measures */}
          <div className="flex-[1.5] flex flex-col cyber-border p-4 rounded-sm relative">
            <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-cyan-500 pl-3 tracking-widest flex items-center gap-2">
              <ChevronRight size={20} className="text-cyan-500" />
              灾害防治措施
            </h2>
            
            <div className="flex-1 bg-white/5 border border-white/10 p-4 overflow-hidden group cursor-pointer hover:border-cyan-500/50 transition-all">
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 p-8 shadow-inner overflow-y-auto">
                <div className="text-slate-800 text-[10px] leading-relaxed scale-90 origin-top">
                  <h3 className="text-sm font-bold text-center mb-4 uppercase">XXX 矿井水灾应急预案</h3>
                  <p className="mb-2">1. 监测系统必须24小时运行，确保通讯畅通...</p>
                  <p className="mb-2">2. 井下各泵房必须具备双回路供电系统...</p>
                  <p className="mb-2">3. 发现异常涌水必须立即向上级汇报并撤离人员...</p>
                  <p>4. 定期检查防水闸门，确保其在紧急时刻能够正常关闭...</p>
                  <div className="mt-8 border-t border-slate-300 pt-4 text-center italic text-slate-500 font-mono">
                    -- INTERNAL DOCUMENT --
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 bg-cyan-600/30 border border-cyan-500/50 py-2.5 text-xs text-white font-bold hover:bg-cyan-600/50 transition-all">
                <FileText size={16} />
                应急处置方案
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#0a192f] border border-cyan-500/30 py-2.5 text-xs text-slate-300 font-bold hover:bg-white/5 transition-all">
                避灾路线
              </button>
            </div>
          </div>
        </div>

        {/* Function Buttons Bottom Right */}
        <div className="absolute bottom-6 right-[420px] flex flex-col gap-4 z-40">
          {[
            { icon: <RotateCcw size={20} />, label: '复位' },
            { icon: <Layers size={20} />, label: '图层' },
            { icon: <Layout size={20} />, label: '工具' },
            { icon: <Phone size={20} />, label: '拨号' }
          ].map((btn, i) => (
            <button 
              key={i} 
              className="w-14 h-14 bg-slate-900/80 border border-cyan-500/40 rounded-full flex flex-col items-center justify-center gap-0.5 group hover:border-cyan-400 hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <span className="text-cyan-400 group-hover:scale-110 transition-transform">{btn.icon}</span>
              <span className="text-[10px] text-cyan-500/80 group-hover:text-cyan-400">{btn.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Decorative Bottom Line */}
      <div className="h-2 w-full flex gap-1 px-4 mb-2 z-10">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="flex-1 h-full bg-cyan-500/10 rounded-sm"></div>
        ))}
      </div>
    </div>
  );
};

export default WaterDisasterDashboard;
