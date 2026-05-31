## Why

项目甘特图目前只支持按名称字母排序，缺少基于时间维度的排序能力。未分配项目列表只是展示列表，无法点击查看详情。任务详情和项目详情之间已经有导航链接，但缺少自动滚动到对应时间条的功能，导致跨视图导航后用户需要在时间轴上手动寻找。

## What Changes

- 项目甘特图增加排序切换按钮，支持按"上线时间→最后任务结束时间→第一个任务开始时间"多级排序，切换顺序为：名称 → 时间 → 名称
- 未分配项目列表中的每个项目卡片变为可点击，点击打开项目详情面板
- 任务详情面板底部增加所属项目区域（含项目名称、颜色标识、状态），点击可跳转项目详情
- 任务详情↔项目详情互相跳转时，甘特图自动水平滚动到该任务/项目的时间条位置

## Capabilities

### New Capabilities
- `project-time-sort`: 项目甘特图按时间维度排序，优先按上线时间（key date），无上线时间则按最后任务结束时间，可切换回名称排序
- `cross-detail-navigation`: 未分配项目卡片和任务详情中的项目区域支持点击跳转到项目详情，任务详情底部展示所属项目信息
- `gantt-auto-scroll`: 选中实体变化时（任务↔项目），对应甘特图窗格自动水平滚动到该实体的时间条位置

### Modified Capabilities
- `dual-gantt-view`: 项目甘特图增加排序模式切换，支持名称排序和时间排序两种模式
- `cross-view-highlight`: 从任务详情跳转项目详情或反向操作时，高亮逻辑需要保持一致

## Impact

- **Store**: 新增 `projectSortMode` 信号；`projectGroups` 计算逻辑增加时间排序分支；新增 `scrollToTaskId` / `scrollToProjectId` 信号用于触发自动滚动
- **Components**: `GanttPane` 的 `TaskList` header 增加项目排序按钮；`UnassignedPanel` 卡片增加 `onClick`；`DetailPanel` 底部增加所属项目区域；`ProjectDetail` 关联任务点击行为保持不变
- **Timeline**: `Timeline` 组件增加 `scrollToDate` 响应，当选中实体变化时计算目标日期并滚动
- **无破坏性变更**: 现有排序、导航、滚动行为全部保留
