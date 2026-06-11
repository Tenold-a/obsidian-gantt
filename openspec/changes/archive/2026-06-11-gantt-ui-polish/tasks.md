## 1. 左侧栏宽度可调节

- [x] 1.1 在 `store.ts` 中添加 `leftPanelWidth` signal（默认 180），在 `loadSettings` 和 `saveSettings` 中处理读写
- [x] 1.2 修改 `TaskList` 组件，将硬编码 `LEFT_PANEL_WIDTH` 替换为动态 `width` prop
- [x] 1.3 在 `GanttPane` 的 TaskList 和 Timeline 之间添加拖拽 resize handle，实现拖拽逻辑
- [x] 1.4 确保两个 pane（person 和 project）的 TaskList 宽度一致

## 2. 颜色选择器改为色卡

- [x] 2.1 创建 `ColorSwatchPicker` 组件，展示 `PRESET_COLORS` 色块网格，支持选中状态和 `onChange` 回调
- [x] 2.2 在色卡底部添加 "Custom..." 按钮，展开原生 `<input type="color">` 作为后备
- [x] 2.3 在 KeyDate 编辑行中将 `<input type="color">` 替换为 `ColorSwatchPicker`
- [x] 2.4 在 TagManagementPanel 中将颜色输入替换为 `ColorSwatchPicker`
- [x] 2.5 在标签创建编辑流程中使用 `ColorSwatchPicker`

## 3. 项目颜色支持切换

- [x] 3.1 在 `ProjectDetail` header 中，将颜色圆点改为可点击按钮
- [x] 3.2 点击后弹出 `ColorSwatchPicker`，选择颜色后调用 `store.persistProjectEdit(id, 'color', newColor)`
- [x] 3.3 确保颜色变更即时反映到侧边栏的项目颜色标记和时间线上的任务条颜色

## 4. KeyDate 按时间自动排序

- [x] 4.1 在 `Timeline` 组件的 KeyDateMarker 渲染前，对 `project.keyDates` 按 `date` 升序排序
- [x] 4.2 在 `ProjectDetail` 组件中显示 KeyDate 列表时，按 `date` 升序排序

## 5. 项目和人员列表滚动

- [x] 5.1 验证 `TaskList` 组件的 `translateY` 滚动同步是否正常工作
- [x] 5.2 如有问题，修复以确保列表内容能随 Timeline 垂直滚动正确同步
