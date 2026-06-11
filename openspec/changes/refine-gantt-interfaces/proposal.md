## Why

当前 `ConnectorModule` 只有一个 `fetch()` → `transform()` → `CanonicalData` 管道，一次性拉取全部数据（tasks + persons + projects 的所有字段）。这导致初始加载时必须获取 `Project` 的 `description`、`requester`、`keyDates`、`keyLinks` 等细节字段，而这些字段仅在用户点击查看详情时才需要。将数据拉取拆分为两个接口——基础渲染数据和按需详情数据——可以减少初始加载体积、加快首屏渲染速度，并允许连接器从不同的 API 端点按需获取富文本详情。

## What Changes

- **BREAKING**: 重构 `ConnectorModule` 接口，将 `fetch` + `transform` 重新定义为拉取基础甘特图渲染数据（`CanonicalData`，其中 `Project` 仅包含渲染必需的轻量字段）
- 新增 `ProjectDetail` 类型，包含项目的完整详情（`description`、`requester`、`keyDates`、`keyLinks` 等）
- 新增 `TaskDetail` 类型，包含任务的完整详情（扩展元数据、描述等）
- 新增 `ConnectorModule.fetchDetail` 和 `ConnectorModule.transformDetail` 可选方法，用于按需拉取单个项目或任务的详情
- 更新 `GanttStore` 增加 `fetchDetail(id, type)` 动作，支持详情按需加载和缓存
- 更新 `GanttChart` 组件，在用户点击项目/任务时调用详情接口展示富文本信息

## Capabilities

### New Capabilities

- `connector-detail-fetch`: 连接器详情拉取接口——定义 `fetchDetail`/`transformDetail` 方法签名及 `ProjectDetail`/`TaskDetail` 数据类型，支持按需获取项目或任务的完整详情

### Modified Capabilities

- `connector-system`: `ConnectorModule` 的 `transform` 返回值中 `Project` 的 `description`、`requester`、`keyDates`、`keyLinks` 字段变为可选（基础渲染数据不再强制包含），通过新的 `fetchDetail` 接口按需获取

## Impact

- `packages/gantt-core/src/index.ts` — 新增 `ProjectDetail`、`TaskDetail` 类型；修改 `ConnectorModule` 增加 `fetchDetail`/`transformDetail`；更新 `CanonicalData` 中 `Project` 字段约束
- `packages/gantt-ui/src/store.ts` — 新增 `fetchDetail` 动作、详情缓存状态
- `packages/gantt-ui/src/GanttChart.tsx` — 详情弹窗改用按需加载
- 现有连接器脚本（`csv-connector.js`、`test-api-connector.js`）— 适配新接口（基础 transform 继续工作，可按需添加 `fetchDetail`）
