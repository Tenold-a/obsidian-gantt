## Context

当前 `GanttChart.tsx` 中的详情面板只有 `DetailPanel`（任务）和 `ProjectDetail`（项目）。人员选中后只触发高亮。需要新增 `PersonDetail` 组件，参考现有 `ProjectDetail` 的布局模式。

`DescriptionModal` 目前是纯只读弹窗（渲染 markdown + 关闭按钮）。需要增加编辑模式。

`TaskOverride` 缺少 `description` 字段，导致任务描述不可编辑。需要同步更新 core 类型和 merge-engine。

手动输入字段（person、project、url、tag、dependency）使用纯 `<input>` 或 `<select>`，没有历史记忆。需要新增 `memory/<view-id>.json` 存储文件。

## Goals / Non-Goals

**Goals:**
- PersonDetail 组件与现有的 ProjectDetail 和 DetailPanel 布局一致
- DescriptionModal 支持编辑/保存 markdown
- TaskOverride.description 支持编辑
- FieldMemory 为文本输入提供历史建议

**Non-Goals:**
- 不改变 Person 接口的数据结构
- 不改变 connector 合约
- 不实现富文本编辑器（保持 markdown textarea）

## Decisions

### Decision 1: PersonDetail 复用 ProjectDetail 的布局模式
PersonDetail 在 `DualPane` 中通过 `sel.type === 'person'` 条件渲染，与 task/project 详情互斥。组件结构：header（姓名可编辑、职位、关闭按钮）→ 任务列表（状态徽章、标题、日期）。

### Decision 2: DescriptionModal 增加 `editMode` 状态
使用已有的 `useSignal` 模式：新增 `editMode` signal，切换时在 markdown 预览和 `<textarea>` 之间切换。保存按钮调用 `store.persistEdit(id, 'description', newValue)`。

### Decision 3: description 加入 TaskOverride 和 EDITABLE_FIELDS
在 `index.ts` 的 `TaskOverride` 类型中增加 `description?: string`，在 `merge-engine.ts` 的 `EDITABLE_FIELDS` 数组中增加 `'description'`。

### Decision 4: FieldMemory 作为独立存储文件
使用 `memory/<view-id>.json` 存储（与 edits/cache/settings 同级）。结构简单：`{ persons: string[], projects: string[], urls: string[], tags: string[], dependencies: string[] }`。在 store 中提供 `fieldMemory` signal 和增删方法。

## Risks / Trade-offs

- **memory 文件可能无限增长** → 每个数组上限 50 条
- **description 字段加入 TaskOverride 后，push 载荷会包含它** → 与变更 B（只推修改字段）配合良好
