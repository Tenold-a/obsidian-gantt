# obsidian-gantt

[Obsidian](https://obsidian.md) 双窗格甘特图插件。按人员和项目并排展示任务，支持拖拽编辑、连接器数据集成、本地优先的变更追踪。

<img width="1986" height="1016" alt="image" src="https://github.com/user-attachments/assets/34239ab0-616d-4211-bdf9-8dd46bdf55fc" />

## 安装与使用

### 从 Release 安装（推荐）

1. 前往 [Releases](https://github.com/Tenold-a/obsidian-gantt/releases) 页面，下载最新的 `obsidian-gantt.zip`
2. 解压得到 `obsidian-gantt` 文件夹，放入 Obsidian vault 的 `.obsidian/plugins/` 目录
3. 打开 Obsidian → 设置 → 第三方插件 → 启用「Safe mode」关闭 → 找到「Gantt Chart」→ 点击启用
4. 点击左侧边栏的 📊 图标即可打开甘特图视图

### 手动构建

```bash
git clone https://github.com/Tenold-a/obsidian-gantt.git
cd obsidian-gantt
npm install
npm run build --workspace=packages/gantt-core
npm run build --workspace=packages/gantt-ui
npm run build --workspace=packages/obsidian-plugin
```

构建产物在 `packages/obsidian-plugin/`，将 `main.js`、`styles.css`、`manifest.json` 以及 `csv-connector.js` 和示例 CSV 文件复制到 `.obsidian/plugins/obsidian-gantt/` 即可。

## 功能

### 双窗格甘特图
- **人员甘特图**（上）—— 按负责人分组展示任务
- **项目甘特图**（下）—— 按项目分组展示任务
- **可调节分割** —— 拖动分隔条调整上下窗格高度
- **水平滚动同步** —— 两个窗格共享同一水平滚动位置
- **垂直滚动独立** —— 每个窗格各自独立垂直滚动

### 拖拽交互
- **移动任务** —— 水平拖拽任务条整体平移日期（保持时长不变）
- **调整任务** —— 拖拽左/右边缘分别修改开始或结束日期
- **从项目创建任务** —— 将右侧未分配面板中的项目卡片拖到人员行上即创建新任务
- **吸附到日边界** —— 所有拖拽操作自动吸附到最近的日期刻度
- **撤销** —— Ctrl+Z / Cmd+Z 撤销最近一次拖拽

### 任务与项目管理
- **行内名称编辑** —— 点击任务标题或项目名称即可重命名
- **状态管理** —— 六种生命周期状态：待开始、进行中、已取消、待上线、已上线、已完成
- **状态级联** —— 项目完成则其下未取消的任务自动完成；项目下所有未取消的任务都完成则项目自动完成
- **删除确认** —— 任务和项目均需确认后才删除（软删除机制）
- **详情面板** —— 点击任意任务或项目查看完整信息，包括日期、状态、描述和链接

### 项目详情字段
- **描述** —— 项目的富文本备注
- **需求方** —— 干系人或部门名称
- **关键日期** —— 带名称、日期、颜色和图标的里程碑标记
- **关键链接** —— 项目关联的命名 URL
- **标签** —— 支持添加、移除标签，输入时自动补全

### 标签管理
- **标签定义** —— 每个视图独立创建、重命名、改色、删除标签
- **自动创建** —— 项目中新添加的标签自动注册到标签定义
- **彩色徽章** —— 标签在项目详情和侧栏中以定义的颜色显示
- **标签筛选** —— 按一个或多个标签筛选项目（OR 逻辑）

### 筛选系统
- **时间范围筛选** —— 仅显示关键日期或任务日期与指定范围有交集的项目
- **状态筛选** —— 多选项目状态进行筛选
- **标签筛选** —— 多选标签进行筛选
- **组合筛选** —— 跨维度 AND 逻辑，同一维度内 OR 逻辑
- **淡化非匹配任务** —— 人员窗格中被筛选掉的项目对应任务条以降低的透明度显示

### 跨视图高亮
- **点击选中** —— 点击项目、任务或人员以高亮相关条目
- **跨视图同步** —— 选中实体后两个窗格中匹配的任务条同时高亮
- **行淡化** —— 无高亮任务的行降低透明度以弱化

### 待推送变更
- **本地优先编辑** —— 所有修改先保存在本地，再推送到上游
- **变更面板** —— 查看所有未推送变更，按类型分组（新增/修改/删除）
- **多选支持** —— 可选择性地推送或丢弃部分变更
- **推送到上游** —— 连接器可实现 `push()` 方法支持双向同步
- **丢弃变更** —— 放弃不需要的本地修改而不影响上游

### 数据连接器
- **连接器脚本** —— JavaScript 模块，负责拉取、转换并可选推送数据
- **CSV 连接器** —— 内置连接器，读取 persons.csv、projects.csv、tasks.csv，支持自定义列映射、自定义数据持久化和推送
- **多连接器视图** —— 一个视图可合并多个连接器的数据
- **平台抽象** —— 连接器在 Obsidian（Vault 文件）或独立 Web 应用（localStorage）中均可运行

### 本地数据存储
- **三类文件分离** —— cache（快照，机器写入，可丢弃）、edits（用户覆盖，人工修改，需备份）、views（显示配置）
- **字段级来源追踪** —— 每个字段记录其来源是上游数据还是手动编辑
- **合并引擎** —— 将上游数据与本地编辑合并；手动编辑在刷新后保留
- **增量缓存** —— 按时间范围缓存，高效加载数据

### 独立 Web 应用
- **浏览器中运行** —— 无需 Obsidian 即可使用完整甘特图
- **localStorage 后端** —— 所有数据和配置存储在浏览器中
- **连接器上传** —— 粘贴或上传连接器脚本文件
- **静态部署** —— 可部署到任意静态托管服务

## 架构

```
obsidian-gantt/
├── packages/
│   ├── gantt-core/          # 零依赖核心：类型定义、合并引擎、日期工具、CSV 解析器
│   ├── gantt-ui/            # Preact + @preact/signals UI：组件、数据仓库、拖拽交互
│   ├── obsidian-plugin/     # Obsidian 插件：视图、平台适配器（Vault 存储、requestUrl）
│   └── web-app/             # 独立 Vite 应用：浏览器平台适配器（localStorage、fetch）
└── openspec/
    ├── specs/               # 规范文档（14 个功能领域）
    └── changes/             # 活跃和已归档的变更提案
```

### 设计原则
- **`gantt-core`** 零运行时依赖 —— 纯 TypeScript 类型和逻辑
- **`gantt-ui`** 仅依赖 `gantt-core`、Preact 和 `@preact/signals`
- 平台包（`obsidian-plugin`、`web-app`）实现 `GanttPlatform` 接口，互不引用
- UI 状态通过 signals 管理，实现细粒度 DOM 更新，无需完整组件树重新渲染
- 时间线使用 CSS `repeating-linear-gradient` 渲染网格线（不创建每根线的 DOM 元素），并采用水平虚拟化提升性能

### 数据流
```
Connector.fetch() → 原始数据 → Connector.transform() → CanonicalData
                                                              ↓
                                              cache/<connector>.json（快照）
                                                              ↓
                        edits/<view>.json ← → 合并引擎 → 甘特图 UI（运行时任务）
                        （用户覆盖）              ↓
                                           字段来源追踪
                                           （upstream vs manual）
                                                              ↓
                        Connector.push() ← 待推送变更面板
```

## 开发

### 前置要求
- Node.js 18+
- npm 9+

### 常用命令
```bash
npm install            # 安装所有依赖
npm run build          # 构建所有包
npm run build:core     # 仅构建核心包
npm run build:ui       # 仅构建 UI 包
npm run build:plugin   # 仅构建 Obsidian 插件
npm run build:web      # 仅构建 Web 应用
npm run dev:web        # 启动 Web 开发服务器（Vite 热更新）
npm test               # 运行测试（gantt-core）
npm run clean          # 清理所有构建产物
```

### 构建 Obsidian 插件
构建产物输出到 `packages/obsidian-plugin/`：
- `main.js` — 打包后的插件（esbuild）
- `main.js.map` — 源码映射
- `manifest.json` — 插件元信息
- 示例 CSV 文件和 CSV 连接器也会一并复制

将此目录复制或软链接到 vault 的 `.obsidian/plugins/obsidian-gantt/` 即可安装。

### 运行 Web 应用
```bash
npm run dev:web
```
启动带热更新的本地开发服务器，适合快速 UI 开发，无需 Obsidian 环境。

## Obsidian 插件使用

1. 在 vault 中安装插件
2. 点击甘特图功能图标或执行 "Open Gantt Chart" 命令
3. 视图默认在中央标签页区域打开
4. 在视图设置中配置连接器以加载数据
5. 可使用内置 CSV 连接器和示例数据快速上手，或编写自定义连接器

### 数据目录结构
插件在 vault 根目录下使用以下路径：
```
obsidian-gantt-data/             # 数据存储（可见，用户可手动备份 edits）
├── cache/<connector-id>.json    # 上游数据快照
├── edits/<view-id>.json         # 用户覆盖数据（重要，请备份）
├── views/<view-id>.json         # 视图配置
├── tags/<view-id>.json          # 每个视图的标签定义
└── settings/<view-id>.json      # 每个视图的筛选/排序设置

connectors/                      # 连接器脚本（vault 根目录，独立于数据目录）
└── csv-connector.js
```

## 许可证

MIT
