## Why

当前甘特图插件在Obsidian中仅作为右侧边栏显示，限制了用户的布局灵活性；项目缺少过滤机制导致大量项目时难以快速定位；项目无法打标签降低了分类管理能力；pending面板不支持选择性地推送或放弃变更，强制全量操作不够灵活。

## What Changes

- **视图位置**：甘特图默认以标签页形式在中间区域打开，而非右侧边栏
- **项目过滤**：支持按时间范围、状态、tag标签过滤项目，不匹配的项目在项目窗格中直接隐藏，人员窗格中属于被过滤项目的任务置灰显示
- **项目标签**：Project实体增加自定义`tags`字段，支持在项目详情中增删多个标签
- **标签管理**：新增标签管理页面，支持创建、重命名、删除、设置标签颜色
- **Pending多选**：pending面板每项增加复选框，支持仅推送选中项，取消未选中项的改动（从edits中移除）

## Capabilities

### New Capabilities

- `center-tab-view`: 甘特图视图从右侧边栏迁移至中间标签页区域，支持用户手动拖拽至任意位置，但默认激活时在中间区域打开
- `project-filtering`: 工具栏增加项目过滤器（时间范围、状态、tag标签），不匹配的项目在项目窗格隐藏，人员窗格中属于被过滤项目的任务置灰
- `project-tags`: Project实体增加`tags?: string[]`字段，项目详情面板增加标签输入/编辑器，支持设置多个标签
- `tag-management`: 系统增加标签管理页面，展示所有已用标签，支持CRUD操作和颜色设置
- `pending-multi-select`: Pending Changes面板每项增加复选框及全选/取消全选，推送仅提交选中项，取消选中项移除对应edits数据

### Modified Capabilities

- `dual-gantt-view`: 视图打开方式由`getRightLeaf`改为`getLeaf`，视图类型由侧边栏变为标签页，中间区域显示要求独立滚动和同步滚动行为不变
- `pending-changes-panel`: 推送行为由全量变更为按选中项推送；新增"取消选中"操作丢弃未推送的局部修改
- `local-data-store`: `projectOverrides`需要支持`tags`字段的持久化存储

## Impact

- [packages/obsidian-plugin/src/main.ts](packages/obsidian-plugin/src/main.ts): `activateView`方法中`getRightLeaf`改为`getLeaf`
- [packages/gantt-ui/src/store.ts](packages/gantt-ui/src/store.ts): 增加过滤信号（`filterTimeRange`、`filterStatuses`、`filterTags`），增加`dismissChanges`方法，修改`pushChanges`支持选中ID参数
- [packages/gantt-ui/src/GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx): 工具栏增加过滤器UI，PendingChangesPanel增加多选功能
- [packages/gantt-ui/src/components.tsx](packages/gantt-ui/src/components.tsx): ProjectDetail增加标签编辑，新增TagManagementPanel组件，筛选器组件
- [packages/gantt-core/src/index.ts](packages/gantt-core/src/index.ts): Project接口增加`tags`、`TagDefinition`类型
- [packages/obsidian-plugin/src/view.tsx](packages/obsidian-plugin/src/view.tsx): 可能需要适配标签页模式
