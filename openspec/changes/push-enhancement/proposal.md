## Why

当前 push 系统存在三个问题：

1. **批量全字段推送**：payload 中的 task/project 包含所有 12 个字段，connector 无法区分"未设置"和"未修改"，也无法实现 PATCH 语义合并
2. **无进度反馈**：push 是纯异步等待，用户看不到进度条或当前操作提示
3. **全有或全无回滚**：一个 connector 的部分 item 失败会导致全部回滚，已成功推送的变更也会被清除

## What Changes

三个核心变更，对应精确的类型签名：

| 变更 | 类型签名 | 连接器行为 |
|---|---|---|
| 部分字段推送 | `payload.tasks: Partial<Task>[]` | 只发送用户改过的字段，PATCH 语义合并，不假设 12 字段全在 |
| 进度回调 | `onProgress?: (p: PushProgress) => void` | 推送每个 item 前后调用 `onProgress({ current, total, message })` |
| 逐项失败追踪 | `result.failedItems?: { id, type, error }[]` | 逐项推送，失败的推入 failedItems 数组，成功的正常处理 |

改造模式：旧的批量推送一失败就全部回滚，新模式要求**逐项推送 + 累积失败列表**。

- **BREAKING**: `PushResult` 增加 `failedItems` 字段
- **BREAKING**: `push()` 签名增加可选 `onProgress` 回调参数
- `PushChangesPayload.tasks` / `projects` 改为 `Partial<Task>[]` / `Partial<Project>[]`
- store 的 `pushChanges()` 只清除实际推送成功的项目
- UI 显示实时进度条 + per-connector 成功/失败摘要

## Capabilities

### New Capabilities
- `push-partial-rollback`: 逐项推送，失败 item 保留编辑可重试，成功的正常清除
- `push-progress-feedback`: connector 可选回调进度，UI 实时显示百分比 + 当前操作信息

### Modified Capabilities
- `connector-system`: `PushResult` 扩展 `failedItems`、`push()` 签名增加 `onProgress`、payload 改为 `Partial<>`
- `local-data-store`: `pushChanges()` 清除逻辑改为 per-item 追踪

## Impact

- `packages/gantt-core/src/index.ts`: `PushResult` 扩展、`PushChangesPayload` 使用 `Partial<Task>`、`PushProgress` 新类型、`ConnectorModule.push` 签名
- `packages/gantt-ui/src/store.ts`: `pushChanges()` 重写清除逻辑 + 进度传递
- `packages/gantt-ui/src/GanttChart.tsx`: `PendingChangesPanel` 增加进度条 UI + 结果摘要
- `test-server/server.mjs`: 新增 `POST /api/push-partial?failEvery=N` 端点
- 所有现有 connector 需适配新返回结构（向后不兼容）
