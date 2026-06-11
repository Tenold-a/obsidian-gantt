## Context

当前的甘特图 UI 使用硬编码的 `LEFT_PANEL_WIDTH = 180` 常量控制左侧栏宽度。右侧详情面板已经通过 `detailPanelWidth` signal 实现了可拖拽调节。本次变更将左侧栏改造为相同的模式。

颜色选择目前使用浏览器原生 `<input type="color">`，在不同平台上表现不一致（Windows 弹出系统调色板，macOS 弹出原生颜色面板）。项目已经有了 `PRESET_COLORS` 常量，需要基于此构建统一的色卡组件。

KeyDate 数据在数组中的顺序由用户输入或 connector 决定，渲染时不做排序，导致时间线上标记顺序不符合直观期望。

## Goals / Non-Goals

**Goals:**
- 左侧栏宽度可拖拽调节，宽度持久化，与 `detailPanelWidth` 共享同一套设计模式
- 所有颜色选择场景统一使用 `ColorSwatchPicker` 组件
- 项目详情面板中可直观切换项目颜色
- KeyDate 在渲染时自动按日期排序
- 变更范围限定在 `gantt-ui` 包内，不触及 `gantt-core` 类型

**Non-Goals:**
- 不改变 connector 合约
- 不改变数据存储格式（复用现有的 settings 文件格式）
- 不改变侧边栏的垂直滚动行为（已经通过 translateY 机制工作）

## Decisions

### Decision 1: leftPanelWidth 复用 detailPanelWidth 的设计模式
在 `store.ts` 中添加 `leftPanelWidth` signal（默认值 180），在 `loadSettings` 和 `saveSettings` 中处理持久化。`TaskList` 组件接收 `width` prop 替代硬编码常量。在 `GanttPane` 中添加 resize handle 和事件处理。

**替代方案**: 使用 CSS 变量或 CSS `resize` 属性。但 CSS 方案无法持久化宽度，也不易与信号系统集成。

### Decision 2: ColorSwatchPicker 作为独立组件
在 `GanttChart.tsx` 中定义 `ColorSwatchPicker` 组件，接受 `value`, `onChange`, `colors` props。使用现有的 `PRESET_COLORS` 作为默认颜色集。组件在色卡下方提供 "Custom..." 按钮展开原生 `input[type=color]`。

**替代方案**: 引入第三方颜色选择器库。但项目体量较小，自定义组件足够，避免引入新依赖。

### Decision 3: KeyDate 排序在渲染层进行
排序发生在两个位置：`Timeline` 组件中渲染 `KeyDateMarker` 之前，以及 `ProjectDetail` 组件中显示 KeyDate 列表之前。使用 `[...keyDates].sort((a, b) => a.date.localeCompare(b.date))` 实现稳定排序。

**替代方案**: 在 store 层（mergedProjects computed）中排序。但排序是渲染层面的关注点，放在 store 中会改变数据语义。

### Decision 4: 项目颜色切换通过 persistProjectEdit
在 `ProjectDetail` 的 header 区域，点击颜色圆点弹出 `ColorSwatchPicker`，选择后调用 `store.persistProjectEdit(id, 'color', newColor)`。不改变 projectOverrides 的结构。

## Risks / Trade-offs

- **resize handle 在移动端可能难以操作** → handle 宽度保持 4px 以上，给予足够的点击区域
- **leftPanelWidth 若设置过大可能挤压时间线** → 限制最大 400px，最小 120px
- **色卡颜色数量固定** → 保留 "Custom..." 原生选择器作为后备
