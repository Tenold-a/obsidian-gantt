## Why

当前的甘特图 UI 存在多个硬编码的布局约束和原始的颜色选择器，影响用户体验和视觉一致性。左侧栏宽度固定不可调，颜色选择依赖浏览器原生 `<input type="color">`（在不同平台表现不一致），项目颜色无法直观切换，KeyDate 标记渲染顺序混乱，侧边栏列表的滚动行为不够流畅。这些修改都属于纯前端变更，不涉及 connector 合约，可以独立快速交付。

## What Changes

- 左侧任务列表宽度支持拖拽调节，参考已有的 `detailPanelWidth` 模式，宽度持久化到视图设置
- 用预设色卡组件替换所有 `<input type="color">`，统一 KeyDate 颜色、标签颜色、项目颜色的选择体验
- 项目详情面板增加颜色切换控件，点击颜色圆点即可弹出色卡选择
- KeyDate 在时间线和详情面板渲染时按日期从远及近自动排序
- 确保项目和人员侧边栏列表有正确的滚动行为

## Capabilities

### New Capabilities
- `resizable-sidebar`: 左侧栏宽度可拖拽调节，宽度持久化
- `color-swatch-picker`: 预设色卡颜色选择器组件，替代原生颜色输入

### Modified Capabilities
- `gantt-renderer`: KeyDate 标记渲染时需按日期排序；色卡组件作为新的颜色选择 UI
- `dual-gantt-view`: 左侧 TaskList 宽度由固定的 LEFT_PANEL_WIDTH 改为动态可调
- `local-data-store`: 新增 `leftPanelWidth` 信号及其持久化

## Impact

- `packages/gantt-ui/src/GanttChart.tsx`: TaskList 组件、ProjectDetail 组件、KeyDate 渲染逻辑、色卡组件
- `packages/gantt-ui/src/store.ts`: 新增 `leftPanelWidth` 信号、loadSettings/saveSettings 扩展
- `packages/gantt-ui/src/components.tsx`: KeyDateMarker 排序逻辑
- 不影响 `gantt-core` 类型定义
- 不影响任何 connector 合约
