# 💻 煤矿防治水监测预警系统

一个高保真工业风格的前端演示项目，用于展示矿山防治水的监测与预警信息。包含 3D 巷道示意、实时数据面板、图表可视化与多弹窗交互，适合原型演示与前端架构学习。

---

## 📋 项目简介
- 定位：面向煤矿防治水场景的监测与预警可视化前端。
- 特点：赛博工业风 UI、3D 巷道示意（Three.js）、数据面板与弹窗模块化、交互统一（Pointer 事件）、HMR 热更新。
- 当前版本为纯前端演示，不包含真实后端接口；数据采用前端模拟。

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
│  └─ UserProfileModal.tsx        # 用户信息弹窗
├─ App.tsx                        # 顶层页面与状态编排
├─ index.tsx                      # 入口挂载
├─ index.html                     # 基础模板/字体/ImportMap
├─ index.css                      # Tailwind 引入与全局样式入口
├─ tailwind.config.js             # Tailwind 配置
├─ postcss.config.js              # PostCSS 配置
├─ vite.config.ts                 # Vite 配置（端口/别名/环境变量注入）
├─ package.json                   # 依赖与脚本
├─ tsconfig.json                  # TypeScript 配置
└─ README.md
```

---

## ⚡ 核心功能模块与工作流程
- Header（右上角入口）
  - Home → 打开“数字化矿山概览”
  - Alarm → 打开“报警记录中心”
  - Settings → 打开“系统设置”
  - Fullscreen → 切换全屏
  - User → 打开“用户信息”
- 弹窗系统（以 App 的 activePanel 集中控制）
  - 点击入口或关闭按钮 → onClose → activePanel=null → Modal 返回 null → DOM 移除
  - 键盘 Escape：各 Modal 在 isOpen 时绑定 window keydown；关闭后清理监听
  - 遮罩外部点击：onPointerDown 判断是否命中内容区；不命中则触发关闭
- 3D 场景（MineSchematic）
  - 传感器节点：支持鼠标拾取、悬停、标签显隐（CSS2DRenderer），定位图标颜色表示状态（黄/蓝/白）。
  - 标签点击：触发选中并打开 SensorDetailModal
  - 交互提示：HUD 显示缩放/旋转/平移操作说明
- 数据概览（StatsOverview）
  - 展示总孔数/预警数/在线/离线/预警孔统计；预警数量与右侧“预警探放水孔”均等于黄色定位图标数量，在线/离线分别等于蓝/白数量。
- 侧栏图表与表格
  - Recharts 图表（Area/Bar），自定义刻度与样式；流量折线、水位柱状已接入实时波动数据。
  - AutoScrollingTable：自动滚动数据列表模拟实时信息流
 - 图层控制（LayersModal）
  - 顶部新增“地图导入”按钮（支持 .json/.geojson/.kml/.kmz/.shp 文件选择，后续可接入解析与渲染）。
 - 传感器详情（SensorDetailModal）
  - 左上图片使用项目 suik.png，标题行右侧新增孔位选择下拉框（A/B/C/D）；黄色设备显示“有预警”，其它显示“无预警”。

---

## ⚙️ 启动与部署指南
### 本地开发
```bash
# 环境要求：Node.js 18+（建议）
npm install
npm run dev
# 默认访问 http://localhost:3000
```

### 生产构建与本地预览
```bash
npm run build
npm run preview
# 预览默认端口由 Vite 决定，可在 CLI 输出查看
```

### 静态部署
- 将 dist/ 目录上传至任意静态托管（如 Nginx、Netlify、Vercel）
- 注意：
  - index.html 中使用了 ImportMap 指向 ESM CDN（recharts/react/lucide-react/three），生产环境可改为本地打包依赖以获得更可控版本与离线运行
  - vite.config.ts 中 dev server 默认端口 3000，生产静态托管不受该配置影响

---

## 📦 API 接口
- 当前版本未集成后端 API，代码库内无 fetch/axios 调用，数据通过前端定时器模拟。
- 未来接入建议：
  - /api/sensors：获取传感器状态与坐标
  - /api/alerts：获取报警记录
  - /api/metrics：获取压力/流量/水位等时序数据
  - 统一采用 JSON，约定字段与单位，前端以 SWR/React Query 管理缓存与刷新

---

## 💡 常见问题（FAQ）
- Q: 右上角设置入口与界面是否受右下角改动影响？
  - A: 不受影响。右上角设置入口来自 Header，底部按钮组已移除“系统设置”但不影响 Header 的 Settings 按钮。
- Q: 弹窗关闭偶发不响应？
  - A: 已统一使用 Pointer 事件并阻止冒泡，覆盖鼠标/触屏/触控笔，避免事件时序差异带来的异常。
- Q: 3D 场景刷新后标签错位/不显示？
  - A: 使用 CSS2DRenderer 并在组件挂载时做“硬清理”，若浏览器禁用 WebGL 或设备性能较弱可能影响渲染。
- Q: 字体与 UI 边框样式不生效？
  - A: 检查 index.html 的字体引入与全局样式；Tailwind 4 采用 @import 方式引入于 index.css。
- Q: 端口占用导致 dev server 启动失败？
  - A: 修改 vite.config.ts 的 server.port 或释放占用端口。
- Q: 开发时看到 React Fast Refresh 提示 sensors 导出不兼容？
  - A: 该提示来自组件文件导出非组件常量，不影响运行；可将传感器数据迁移到独立模块导出以消除提示。

