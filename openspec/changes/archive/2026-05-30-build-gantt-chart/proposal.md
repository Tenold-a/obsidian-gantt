## Why

项目管理数据分散在 Jira、Linear、飞书、本地表格等不同系统中，缺乏统一的甘特图可视化工具。现有方案要么绑定特定平台，要么交互体验粗糙。需要一个通用甘特图系统：以可扩展的连接器架构对接任意数据源，提供流畅的拖拽交互，同时支持 Obsidian 插件和独立 Web 应用两种部署形态。

## What Changes

- 新增四包 monorepo 架构：`gantt-core`（数据模型与引擎）、`gantt-ui`（Preact 甘特图组件）、`obsidian-plugin`（Obsidian 插件壳）、`web-app`（独立 Web 应用）
- 新增连接器标准接口：用户编写 JS 脚本，暴露 `fetch()` + `transform()`，输出规范化的 `CanonicalData`
- 新增三层数据架构：上游数据源 → 连接器脚本 → 本地存储（cache/edits/views 三文件分离）
- 新增字段级 source 追踪的刷新合并引擎：用户手动编辑不被上游数据覆盖
- 新增双视图甘特图布局：上方人员甘特图 + 下方项目甘特图，各自垂直独立滚动，水平滚动同步
- 新增跨视图关联高亮：选中项目/任务/人员时，两个视图同时高亮所有关联时间条
- 新增未分配项目面板：显示无任务的项目，支持拖拽到时间轴快速创建任务并分配人员
- 新增四种拖拽操作：移动时间条、调整起止日期、分配人员、从未分配面板创建任务
- 新增平台抽象层 `GanttPlatform` 接口：核心逻辑和 UI 组件对运行平台零知识

## Capabilities

### New Capabilities

- `connector-system`: 连接器系统——用户编写 JS 脚本文件，通过标准接口 `fetch()` + `transform()` 将任意上游数据源转换为规范化的 `CanonicalData`（包含 tasks、persons、projects）。projects 独立声明，支持空项目列表。
- `local-data-store`: 本地数据存储——三文件分离架构（cache/ 上游快照、edits/ 用户编辑覆盖层、views/ 视图定义）。字段级 source 追踪（manual/upstream）的刷新合并引擎。支持 localTasks（用户手动创建的无上游来源任务）。
- `gantt-renderer`: 甘特图渲染引擎——基于 Preact + @preact/signals 的高性能甘特图组件。CSS gradient 时间网格（0 DOM 节点）、水平虚拟化（仅渲染可视区域）、自定义 pointer events 拖拽系统。
- `dual-gantt-view`: 双视图甘特图布局——上下同时显示人员甘特图和项目甘特图。各自垂直独立滚动，水平滚动通过 sharedScroll signal + guard flag 同步。右侧未分配项目面板横跨全高。
- `cross-view-highlight`: 跨视图关联高亮——选中项目/任务/人员时，通过 computed signals 计算关联任务集合，两个视图同步高亮所有关联 bar。非关联行/bar 降低透明度。
- `drag-interactions`: 拖拽交互系统——四种拖拽操作：移动时间条（整体平移 + snap 到天）、调整起止（拖边缘）、分配人员（拖卡片到行）、创建任务（从未分配面板拖项目到时间轴）。
- `platform-abstraction`: 平台抽象层——`GanttPlatform` 接口定义 IStorage、IConnectorLoader、IWatcher、theme。核心和 UI 包对平台零知识。Obsidian 和 Web 各自实现该接口。
- `web-standalone`: 独立 Web 应用——不依赖 Obsidian 的完整甘特图应用。浏览器 localStorage/IndexedDB 实现存储，支持连接器脚本上传或 URL 加载。

### Modified Capabilities

<!-- No existing capabilities to modify — this is a brand new project. -->

## Impact

- 新项目：从零构建，无现有代码受影响
- 技术栈：TypeScript、Preact、@preact/signals、esbuild、CSS Modules
- 构建工具：npm workspaces 管理 monorepo，esbuild 分别构建四个包
- 部署目标：Obsidian Community Plugin 市场 + 静态 Web 站点
- 无外部运行时依赖（除 Preact 外均自行实现）
