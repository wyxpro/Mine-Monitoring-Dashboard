# 💻 煤矿防治水监测预警系统

一个高保真工业风格的前端工业项目，用于展示矿山防治水的监测与预警信息。包含 3D 巷道示意、实时数据面板、图表可视化与多弹窗交互，适合煤矿工业应用。

---

## 📋 项目简介
- 定位：面向煤矿防治水场景的监测与预警可视化面板前端。
- 特点：赛博工业风 UI、3D 巷道示意（Three.js）、数据面板与弹窗模块化、交互统一（Pointer 事件）、HMR 热更新。
<img width="1277" height="771" alt="db323ff992a2aec6ba0e03e688df6762" src="https://github.com/user-attachments/assets/3e84e984-01ef-4f02-927e-01d6be42da4e" />
<img width="1925" height="1149" alt="image" src="https://github.com/user-attachments/assets/81f45de7-bbf1-4a27-a942-d17b69f05b27" />

---

## 🛠️ 技术栈
- 框架与构建：React 19 + Vite 6 + TypeScript 5
- 样式系统：Tailwind CSS 4（PostCSS）
- 可视化：Recharts（图表）、Three.js（3D 场景）
- 图标库：lucide-react
- 运行端口：Vite DevServer 默认 3000（见 vite.config.ts）
- 依赖声明：见 package.json

---

## 🏗️ 项目架构
- 顶层页面：App 负责状态与布局组织，集中管理弹窗显隐状态 activePanel。
- 顶部导航：Header 提供 Home/Alarm/Settings/Fullscreen/User 入口，触发 App 状态；已移除“自研大数据/算法赋能”两侧装饰按钮，聚焦居中标题。
- 中心区：
  - MineSchematic：Three.js 3D 巷道示意图，支持传感器节点选中与标签展示；圆点已替换为“定位”矢量图标（黄=预警、蓝=在线、白=离线），并移除外圈脉冲环。
  - StatsOverview：数据概览条（总孔数/预警数/在线/离线/预警统计），总孔数卡片改为绿色主题。
- 左右侧边栏：SidebarPanel + 表格/图表模块（AutoScrollingTable、BarChart/AreaChart 等）。
- 弹窗模块：HomeSummaryModal、AlarmHistoryModal、LayersModal、SettingsModal、ToolsModal、UserProfileModal、SensorDetailModal。
- 事件统一：遮罩外部点击与右上角 X 关闭统一采用 Pointer 事件，避免触屏/浏览器差异导致的异常。
- 数据更新：App 内定时器模拟数据微波动（压力/流量/温度/探放水孔统计、流量折线、水位柱状、水质仪表）。

---

## 📁 目录结构
```
Mine-Monitoring-Dashboard/
├─ components/
│  ├─ AlarmHistoryModal.tsx       # 报警记录中心弹窗
│  ├─ Header.tsx                  # 顶部导航与控制入口
│  ├─ HomeSummaryModal.tsx        # 数字化矿山概览弹窗
│  ├─ LayersModal.tsx             # 图层控制弹窗
│  ├─ MineSchematic.tsx           # Three.js 3D巷道示意
│  ├─ SensorDetailModal.tsx       # 传感器详情弹窗
│  ├─ SettingsModal.tsx           # 系统设置弹窗
│  ├─ SidebarPanel.tsx            # 侧栏通用容器
│  ├─ StatsOverview.tsx           # 概览统计条
│  ├─ ToolsModal.tsx              # 工具箱弹窗
