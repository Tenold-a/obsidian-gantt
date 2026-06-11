## Why

当前的详情面板只覆盖了任务和项目两种实体类型。点击人员列表虽然会高亮其任务，但没有详情面板来展示人员信息和任务清单。此外，需求描述弹窗（DescriptionModal）是纯只读的，用户无法在其中编辑 markdown 描述。手动输入字段（人员、项目、URL、标签、依赖）也没有记忆功能，每次输入都需要重新打字。

## What Changes

- 新建 `PersonDetail` 组件，点击人员列表时在右侧面板显示人员详情抽屉（姓名、职位、头像、已分配任务列表）
- `DescriptionModal` 增加编辑模式，支持编辑 markdown 并保存
- **BREAKING**: `TaskOverride` 类型增加 `description` 字段，`merge-engine` 的 `EDITABLE_FIELDS` 增加 `description`
- 新增字段记忆存储（`memory/<view-id>.json`），为人员、项目、URL、标签、依赖等文本输入提供 `<datalist>` 历史建议

## Capabilities

### New Capabilities
- `person-detail-drawer`: 人员详情抽屉组件，显示人员信息及关联任务
- `description-editing`: 描述弹窗支持编辑和保存
- `field-input-memory`: 手动输入字段的记忆列表与自动建议

### Modified Capabilities
- `gantt-renderer`: 新增 PersonDetail 组件、DescriptionModal 支持编辑模式
- `local-data-store`: `TaskOverride` 增加 `description` 字段、新增 memory 存储文件

## Impact

- `packages/gantt-core/src/index.ts`: `TaskOverride` 增加 `description`、新增 `FieldMemory` 类型
- `packages/gantt-core/src/merge-engine.ts`: `EDITABLE_FIELDS` 增加 `description`
- `packages/gantt-ui/src/GanttChart.tsx`: 新增 `PersonDetail` 组件、`DescriptionModal` 编辑模式、字段输入 `<datalist>` 支持
- `packages/gantt-ui/src/store.ts`: 新增 `loadFieldMemory`/`saveFieldMemory` 方法和信号
- 新增存储文件 `memory/<view-id>.json`
