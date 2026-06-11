## 1. PersonDetail 组件

- [x] 1.1 在 `GanttChart.tsx` 中新建 `PersonDetail` 组件，接受 `store` prop
- [x] 1.2 组件显示人员姓名（支持 inline 编辑）、职位、任务数量统计
- [x] 1.3 列出该人员所有关联任务，每条显示状态徽章、标题、日期范围
- [x] 1.4 点击任务跳转到任务详情（`store.selectEntity({ type: 'task', id })`）
- [x] 1.5 添加 locate 和 close 按钮
- [x] 1.6 在 `DualPane` 中当 `sel.type === 'person'` 时渲染 PersonDetail

## 2. 描述编辑功能

- [x] 2.1 在 `gantt-core/index.ts` 的 `TaskOverride` 类型中增加 `description?: string`
- [x] 2.2 在 `merge-engine.ts` 的 `EDITABLE_FIELDS` 数组中增加 `'description'`
- [x] 2.3 在 `DescriptionModal` 中增加编辑模式（editMode signal, textarea, save/cancel 按钮）
- [x] 2.4 保存时调用 `store.persistEdit(taskId, 'description', newValue)`
- [x] 2.5 在 `DetailPanel` 中为 description 字段显示编辑入口

## 3. 字段输入记忆列表

- [x] 3.1 在 `gantt-core/index.ts` 中定义 `FieldMemory` 类型
- [x] 3.2 在 `store.ts` 中添加 `fieldMemory` signal 和 `loadFieldMemory`/`saveFieldMemory` 方法
- [x] 3.3 在 `loadView` 时加载 `memory/<view-id>.json`
- [x] 3.4 为 DetailPanel 中的人员选择、项目选择、URL 输入、标签输入、依赖输入添加 `<datalist>`
- [x] 3.5 每次成功输入新值时更新 memory 并去重
