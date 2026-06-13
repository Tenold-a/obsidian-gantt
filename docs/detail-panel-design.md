# Detail Panel Design Requirements

> 详情弹窗（Project、Task、Person 三个看板）的字段顺序、交互规范、组件清单。
> 修改任一弹窗时必须对照本文档保持一致性。

---

## 1. 通用规范（三个弹窗均遵循）

### 1.1 容器
- CSS class: `gantt-detail-panel`
- 宽度: `store.detailPanelWidth`（默认 220px，可拖拽 180–500px）
- 定位: DualPane 右侧边栏，`borderLeft` 分隔，`overflowY: auto` 滚动
- 背景: `var(--background-secondary)`

### 1.2 字段样式常量
```
fieldStyle:  { marginBottom: '10px' }   // Task: 10px, Project/Person: 12px
labelStyle: { fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }
inputStyle: { width: '100%', fontSize: '12px', padding: '3px 6px', borderRadius: '4px', border: '1px solid var(--background-modifier-border)', background: 'var(--background-primary)', color: 'var(--text-normal)', boxSizing: 'border-box' }
```

### 1.3 编辑模式
- 所有弹窗通过 Header 中的铅笔图标进入"全编辑模式"（`editing` signal = true）
- 编辑模式下 Header 显示 Save / Cancel 按钮
- 名称/标题项同时支持独立的"内联编辑"（点击文字直接编辑，不依赖全编辑模式）
  - Enter 保存，Escape 取消，失焦时自动保存
- 全编辑模式下：所有可编辑字段切换为编辑控件，统一通过 Save 按钮持久化

### 1.4 Header 组件
- 使用共享 `DetailHeader` 组件
- Props: store, editing, title, editTitleEnabled, editTitleValue, titleInputRef, onStartEditTitle, onSaveTitle, onCancelTitle, onEdit, onSave, onCancel, onDelete?, onLocate?, onClose
- children 插槽用于左侧装饰元素（如 Project 的颜色色块）
- 按钮排列（View 模式，从左到右）: [pencil] [trash] [target] [x]
- 按钮排列（Edit 模式）: [Save] [Cancel]

### 1.5 关闭方式
- 点击 Header 的 X 按钮 → `store.selectEntity(null)`
- 按 Escape 键 → `store.selectEntity(null)`
- 点击工具栏的 "Clear Selection" 按钮

---

## 2. Task Detail（任务详情弹窗）

文件: `packages/gantt-ui/src/TaskDetail.tsx`

### 2.1 字段顺序（自上而下）

| # | 字段 | 标签 | 视图模式 | 编辑模式 | 说明 |
|---|------|------|----------|----------|------|
| 1 | **Header** | — | 标题文字 + 操作按钮 | 标题 input + Save/Cancel | 含铅笔/垃圾桶/定位/关闭按钮 |
| 2 | **Project** | Project | 色块 + 项目名（可点击跳转） | `<select>` 从 `store.projects` | 点击项目名 → 切换到项目详情弹窗 |
| 3 | **Status** | Status | `<select>` 下拉 | 同视图 | 始终可编辑（无需进全编辑模式），选项来自 `STATUS_OPTIONS` |
| 4 | **Tags** | Tags | 灰色圆角标签 | `TagsEditor` 组件 | 组件: `TagsEditor.tsx`；含 `<datalist>` 自动补全，保存时自动注册新 tag |
| 5 | **Start** | Start | 日期文本 `YYYY-MM-DD` | `<input type="date">` | 无日期显示 `—` |
| 6 | **End** | End | 日期文本 | `<input type="date">` | 无日期显示 `—` |
| 7 | **Progress** | Progress | 进度条 + 百分比 | `<input type="range">` 0–1 step 0.05 | 进度条颜色 `--interactive-accent` |
| 8 | **Person** | Person | 人名 | `<select>` 从 `store.persons` | 无分配显示 `—` |
| 9 | **Dependencies** | Dependencies | 任务 ID 列表 | Tag 风格列表 + 输入 + Add 按钮 | 每个 tag 有 × 移除按钮 |
| 10 | **Link** | Link | `LinkField` 组件（↗ + URL + 复制） | `<input type="text">` | 组件: `LinkField.tsx` |
| 11 | **Description** | Description | `DescriptionViewer`（markdown 预览 + "View full" + "Edit" 按钮） | `<textarea>` 4 rows | 加载中显示 "Loading..."；Edit 按钮通过 DescriptionModal 编辑并调用 `store.persistEdit` |
| 12 | **Source** | — | 数据来源标签 | 同视图 | 显示 Connector 名称 / "Local override" / "Manual entry"；上游已删除时标红 |

### 2.2 数据优先级（以 Description 为例）
```
manual override (store.edits.overrides[taskId].description)
  > detail fetch (taskDetail.value.description)
  > canonical upstream (task.description)
```

### 2.3 使用的共享组件
- `DetailHeader` — 标题栏
- `TagsEditor` — 标签编辑（含 `<datalist>` 自动补全）
- `LinkField` — 链接渲染（复制 + 外部打开）
- `DescriptionViewer` — 描述预览
- `DescriptionModal` — 全屏描述弹窗（通过 DescriptionViewer 的 "View full description" 按钮触发）

### 2.4 编辑保存
- `saveEditing()` 逐字段比较后调用 `store.persistEdit(taskId, fieldName, value)`
- Tags 保存时自动将新 tag 注册到 `store.tagDefinitions`
- Description 在编辑模式下直接通过 `<textarea>` 修改，Save 时持久化

---

## 3. Project Detail（项目详情弹窗）

文件: `packages/gantt-ui/src/ProjectDetail.tsx`

### 3.1 字段顺序（自上而下）

| # | 字段 | 标签 | 视图模式 | 编辑模式 | 说明 |
|---|------|------|----------|----------|------|
| 1 | **Header** | — | 颜色色块 + 项目名 + 操作按钮 | 同视图 + Save/Cancel | 色块可点击展开 `ColorSwatchPicker`；铅笔/垃圾桶/定位/关闭按钮 |
| 2 | **Drag-to-create** | — | 紫色虚线框 + drag icon "Drag to person timeline to create task" | 同视图 | `draggable=true`，drag data 含 projectId + projectName；样式: `--interactive-accent` 边框 |
| 3 | **Status** | Status | `<select>` 下拉 | 同视图 | 始终可编辑 |
| 4 | **Tags** | Tags | 灰色圆角标签 | `TagsEditor`（含 autocomplete） | 组件: `TagsEditor.tsx`；保存时自动注册新 tag |
| 5 | **Key Dates** | Key Dates | 排序列表：菱形色块 + 图标 + 日期 + 名称 | 预设按钮 + 逐行编辑（色块/图标/名称/日期 + 删除） + "+ Custom Key Date" | 组件: `KeyDateEditor.tsx`；图标选择器使用 `CURATED_ICONS`（16 个 Lucide 图标） |
| 6 | **Requester** | Requester | 文本 或 `—` | `<input>` + `<datalist>` 自动补全 | 自动补全来源于 `store.fieldMemory.requesters` |
| 7 | **Key Links** | Key Links | 链接列表：↗ + 名称 + 复制按钮 | 逐行编辑（名称/URL + 删除） + "+ Add Link" | 组件: `KeyLinkEditor.tsx`；点击调用 `platform.openExternal` |
| 8 | **Description** | Description | `DescriptionViewer`（markdown 预览 + "View full" + "Edit" 按钮） 或 `—` | `<textarea>` 4 rows | Edit 按钮通过 DescriptionModal 编辑并调用 `store.persistProjectEdit` |
| 9 | **Tasks** | Tasks (N) | 关联任务卡片列表（StatusBadge + 标题 + 日期 + 负责人 + locate） | 同视图 | 点击卡片 → 切换到任务详情；hover 高亮甘特图中的对应任务条 |
| 10 | **Source** | — | 数据来源标签 | 同视图 | 显示 Connector 名称 / "Manual entry" |

### 3.2 数据优先级（所有字段）
```
manual override (store.edits.projectOverrides[projectId])
  > detail fetch (projectDetail.value)
  > canonical upstream (project.xxx)
```

### 3.3 使用的共享组件
- `DetailHeader` — 标题栏（含 color swatch children）
- `TagsEditor` — 标签编辑
- `KeyDateEditor` — 关键日期编辑/展示
- `KeyLinkEditor` — 关键链接编辑/展示
- `DescriptionViewer` — 描述预览
- `DescriptionModal` — 全屏描述弹窗
- `ColorSwatchPicker` — 颜色选择器（Header 中的色块）
- `StatusBadge` — 关联任务卡中的状态标签（通过 `StatusBadge` 组件）

### 3.4 编辑保存
- `handleSave()` 逐字段调用 `store.persistProjectEdit(projectId, fieldName, value)`
- 自动将 requester/keyDateNames/keyLinkNames 写入 `store.fieldMemory`（上限 50 条）
- 自动将新 tag 注册到 `store.tagDefinitions`

### 3.5 `<datalist>` 自动补全元素
以下 `<datalist>` 在弹窗底部渲染，供编辑模式中的 input 引用：
- `requester-memory-list` — 来源于 `store.fieldMemory.requesters`
- `keydate-name-memory-list` — 来源于 `store.fieldMemory.keyDateNames`
- `keylink-name-memory-list` — 来源于 `store.fieldMemory.keyLinkNames`

---

## 4. Person Detail（人员详情弹窗）

文件: `packages/gantt-ui/src/PersonDetail.tsx`

### 4.1 字段顺序（自上而下）

| # | 字段 | 标签 | 视图模式 | 编辑模式 | 说明 |
|---|------|------|----------|----------|------|
| 1 | **Header** | — | 姓名 + 职位 + locate/close 按钮 | 姓名 input / 职位 input | 无全编辑模式，字段独立 inline 编辑 |
| 2 | **Avatar** | — | `<img>` 头像 | — | 仅当 `person.avatar` 存在时显示 |
| 3 | **Tasks** | Tasks | 任务数量 | — | 纯数字 |
| 4 | **Assigned Tasks** | Assigned Tasks | 任务卡片列表（StatusBadge + 标题 + 日期范围 + 项目名 + locate） | 同视图 | 点击卡片 → 切换到任务详情；hover 高亮甘特图对应任务条 |

### 4.2 使用的共享组件
- `StatusBadge` — 关联任务卡中的状态标签

---

## 5. 三弹窗统一字段分组与顺序

为保证跨弹窗的一致性，所有弹窗的字段按以下语义分组排列，同一组内字段顺序固定。

### 5.1 分组定义

| 分组 | 说明 | Task 字段 | Project 字段 | Person 字段 |
|------|------|-----------|-------------|------------|
| **标识区** | 实体名称、颜色、头像 | Header (title) | Header (name + color swatch) | Header (name + position) + Avatar |
| **归属区** | 项目归属（Task 首位） | Project | — | — |
| **工具区** | 特定交互元素 | — | Drag-to-create | — |
| **状态区** | 工作流状态 | Status | Status | — |
| **分类区** | 标签 | Tags | Tags | — |
| **时间与里程碑区** | 日期、进度、关键日期 | Start, End, Progress | Key Dates | — |
| **引用区** | 人员分配、链接、依赖、请求方 | Person, Dependencies, Link | Requester, Key Links | — |
| **内容区** | 描述 | Description | Description | — |
| **关联区** | 关联实体列表、数据来源 | Source | Tasks (associated), Source | Tasks count + Assigned Tasks |

### 5.2 统一后的字段顺序对照

```
Task Detail:         Project Detail:        Person Detail:
─────────────        ───────────────        ──────────────
1. Header            1. Header              1. Header
2. Project            2. Drag-to-create      2. Avatar
3. Status             3. Status                3. Tasks (count)
4. Tags               4. Tags              4. Assigned Tasks
5. Start          5. Key Dates
6. End            6. Requester
7. Progress           7. Key Links
8. Person              8. Description
9. Dependencies       9. Tasks (associated)
10. Link             10. Source
11. Description
12. Source
```

### 5.3 核心对齐规则

1. **Project 紧贴 Header**：Task 弹窗中 Project 字段紧跟在 Header 之后（#2），体现"任务所属项目"的首要关系。
2. **Drag-to-create 紧贴 Header**：Project 弹窗中拖拽创建区域紧跟 Header（#2），作为最常用的项目操作入口。
3. **Status → Tags 连续**：两弹窗中 Status 和 Tags 紧邻排列，形成"状态→分类"的快速筛选区。
4. **Description 在末尾内容区**：Description 统一放在时间/引用字段之后、Source/Tasks 之前，作为内容阅读的锚点。
5. **Source 统一在底部**：两弹窗的 Source 字段都在最后位置，不干扰主数据流。

---

## 6. 共用的独立组件清单

所有组件位于 `packages/gantt-ui/src/`：

| 组件文件 | 用途 | 被哪些弹窗使用 |
|----------|------|----------------|
| `DetailHeader.tsx` | 统一的标题栏（内联名称编辑 + 操作按钮） | Task, Project |
| `TagsEditor.tsx` | 标签编辑（`<datalist>` 自动补全 + 增删 + 自动注册） | Task, Project |
| `LinkField.tsx` | 链接渲染（↗ + 复制 + `openExternal`） | Task |
| `DescriptionViewer.tsx` | 描述预览（markdown 渲染 + "View full description" 按钮） | Task, Project |
| `DescriptionModal.tsx` | 全屏描述弹窗（查看/编辑 markdown + 全屏编辑） | Task, Project（通过 DescriptionViewer 触发） |
| `KeyDateEditor.tsx` | 关键日期编辑/展示（预设 + 色块/图标/名称/日期编辑） | Project |
| `KeyLinkEditor.tsx` | 关键链接编辑/展示（名称/URL + 复制 + 外部打开） | Project |
| `ColorSwatchPicker.tsx` | 颜色选择器（预设色板 + 自定义取色器） | Project（Header 色块） |
| `StatusBadge.tsx` | 状态标签（彩色圆角 pill） | Person（任务卡）, Project（任务卡） |
| `MarkdownView.tsx` | Markdown 渲染（通过平台 `renderMarkdown`） | DescriptionViewer, DescriptionModal（间接） |
| `constants.ts` | 共享常量（`STATUS_OPTIONS`, `PRESET_COLORS`, `KEY_DATE_PRESETS`, `DEFAULT_COLORS`） | 所有弹窗 |
| `FilterMultiSelect.tsx` | 多选下拉筛选器 | 工具栏（非弹窗） |
| `UnassignedPanel.tsx` | 未分配项目面板 | DualPane（非弹窗） |

---

## 7. 修改指南

### 7.1 添加新字段到 Task & Project
当两个弹窗都需要新字段时：
1. 先在 `packages/gantt-core/src/index.ts` 中确认或添加对应的数据字段（`Task`/`Project` 接口）
2. 在共享组件目录中优先考虑是否可提取共用逻辑
3. 在 `TaskDetail.tsx` 和 `ProjectDetail.tsx` 的 `<DetailHeader>` 之后、`Source`（Task）或 `Tasks`（Project）之前按字段分组插入
4. 保持字段顺序的语义分组：**状态 → 时间 → 人员/归属 → 链接 → 标签 → 描述 → 关联数据**

### 7.2 字段分组约定
严格遵守 [5.1 分组定义](#51-分组定义) 的九区模型添加新字段。修改字段顺序时同步更新 [5.2 统一后的字段顺序对照](#52-统一后的字段顺序对照)。

### 7.3 设计令牌（CSS 变量）
弹窗中使用的颜色优先使用 Obsidian 主题变量：
- `--background-primary` / `--background-secondary` — 背景
- `--text-normal` / `--text-muted` — 文字
- `--interactive-accent` — 强调色（按钮、链接、进度条）
- `--background-modifier-border` — 边框
- `--text-error` — 删除/错误操作
- `--font-monospace` — 描述编辑区字体

### 7.4 禁止行为
- 不要在弹窗内定义 `fieldStyle`/`labelStyle`/`inputStyle` / `valueStyle`——直接从调用方 props 传入或使用统一的样式常量
- 不要直接在弹窗组件内硬编码 `STATUS_OPTIONS` 等——从 `constants.ts` 导入
- 不要重复实现复制到剪贴板 / openExternal 逻辑——使用 `LinkField` 或提取新共享组件
- 不要修改字段顺序而不更新本文档

### 7.5 任务卡片 hover 联动甘特条 — 维护注意事项

详情弹窗的任务卡片通过 `store.hoveredTaskId` 信号与甘特图中的 `TaskBar` 组件联动：
- 卡片 `onMouseEnter` → `store.hoveredTaskId.value = task.id`
- 卡片 `onMouseLeave` → `store.hoveredTaskId.value = null`
- `GanttChart.tsx` 构造 `TaskBarData` 时传入 `isHovered: task.id === store.hoveredTaskId.value`
- `TaskBar` 组件根据 `data.isHovered` 应用高亮样式（scaleY + brightness + 琥珀色发光 + zIndex: 999）

**修改 `components.tsx` 中 `TaskBar` 的 style 时，以下六个属性全部依赖 `data.isHovered` 分支，缺少任一都会导致 hover 失效：**

| 属性 | hover 态值 | 非 hover 态值 |
|------|-----------|--------------|
| `class` | 追加 `hovered` | 不追加 |
| `zIndex` | `999` | `2 + laneIndex` |
| `transform` | `scaleY(1.25)` | `none` |
| `filter` | `brightness(1.15)` | `none` |
| `boxShadow` | `0 0 0 1px var(--gantt-hover-border, #FFB347), 0 0 8px rgba(255,179,71,0.45)` | 跟随 `isHighlighted` 或 `none` |
| `transition` | `transform 0.1s, box-shadow 0.1s, filter 0.1s` | `opacity 0.15s, box-shadow 0.15s` |

**原则**：hover 高亮在视觉上必须与选中态（橙色脉冲 `#FF6B35`，zIndex 1000）和关联高亮（蓝色环 `#4A90D9`）有明显区别，但在色系上保持关联（琥珀 `#FFB347` 是橙色的暖色延伸）。

---

*文档版本: 1.0 | 生成日期: 2026-06-13 | 对应代码变更: 详情弹窗组件化重构*
