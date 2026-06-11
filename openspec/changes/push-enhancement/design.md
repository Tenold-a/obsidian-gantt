## Context

当前 push 流程位于 `store.ts` 的 `pushChanges()` 方法（约 150 行）。核心问题：
1. **all-or-nothing 清除**: `anySuccess` 为 true 时清除全部已推送项目，不区分成功/失败
2. **全量推送**: 载荷中 task 对象包含所有 12 个字段，connector 无法判断哪些字段真实变了
3. **无进度反馈**: push 是原子 Promise，UI 只能显示 "Pushing..." 然后等待结果

## Goals / Non-Goals

**Goals:**
- PushResult 支持 per-item 失败信息（`failedItems?: { id, type, error }[]`）
- Store 只清除实际推送成功的项目，失败项目保留编辑可重试
- Push 载荷只包含被修改的字段（`Partial<Task>` / `Partial<Project>`，PATCH 语义）
- Connector 逐项推送并累积失败列表，单项失败不影响其余
- Connector 可选上报进度（`onProgress?: (p: PushProgress) => void`），UI 展示进度条
- 推送完成后显示 per-connector 成功/失败摘要

**Non-Goals:**
- 不实现自动重试机制
- 不改变 connector 的 fetch/transform 合约
- 不改变 PendingChangesPanel 的其余 UI 布局

## Decisions

### Decision 1: 逐项推送 + 累积失败列表

旧的批量推送一失败就全部回滚，新模式要求 connector 逐项推送每个 task/project/delete，单项失败推入 `failedItems` 数组，其余继续：

```typescript
async function push(payload, ctx, onProgress) {
  const failedItems = [];
  let completed = 0;
  const total = payload.tasks.length + payload.projects.length
    + payload.deletedTaskIds.length + payload.deletedProjectIds.length;

  for (const task of payload.tasks) {
    try {
      await pushTask(task);
    } catch (e) {
      failedItems.push({ id: task.id, type: 'task', error: e.message });
    }
    completed++;
    onProgress?.({ current: completed, total, message: `Pushed task: ${task.id}` });
  }
  // ... 同样处理 projects、deletes ...

  return failedItems.length > 0
    ? { success: false, failedItems }
    : { success: true };
}
```

**替代方案**: 保持批量推送，仅靠 `failedItems` 报告失败。但批量推送无法区分哪个 item 导致失败，且单项失败会浪费已成功的网络请求。

### Decision 2: PushResult.failedItems 作为可选扩展

在 `PushResult` 接口添加 `failedItems?: { id: string; type: 'task' | 'project'; error: string }[]`。允许现有 connector 继续返回旧的 `{ success: bool }` 格式——成功则全成功，失败则全失败。

### Decision 3: Push 载荷改用 Partial<>（PATCH 语义）

`PushChangesPayload.tasks` 改为 `Partial<Task>[]`（必须含 `id`）。构建时从 `currentEdits.overrides[taskId]` 直接读取已有的 partial 数据，附加 `id` 即可。对 local tasks 仍然发送完整对象。

### Decision 4: onProgress 作为可选第三参数

```typescript
type PushProgress = { current: number; total: number; message: string };

push?(changes: PushChangesPayload, ctx: ConnectorContext,
      onProgress?: (p: PushProgress) => void): Promise<PushResult>;
```

UI 在调用 push 时传入回调，将进度写入 signal，由 PendingChangesPanel 渲染。每个 item 推送前后各调用一次。

### Decision 5: 清除逻辑改为 per-item 追踪

遍历每个 connector 的返回结果：
- 成功的 item → 从 overrides/deletedTasks/deletedProjects/localTasks 中移除
- 失败的 item（在 failedItems 中）→ 保留编辑，可重试
- 若 connector 返回旧格式（无 failedItems），`success: true` = 全成功，`success: false` = 全失败

## Test Approach

测试服务器新增 `POST /api/push-partial?failEvery=N` 端点用于模拟部分失败：

```bash
node test-server/server.mjs
# 每 3 个 item 失败 1 个：
# POST /api/push-partial?failEvery=3
```

验证点：
- 成功的 item 从 pending 列表清除
- 失败的 item 保留编辑，可重试
- 进度条显示百分比 + 当前操作信息
- 推送完成后显示 per-connector 成功/失败摘要

## Risks / Trade-offs

- **现有 connector 全部需要更新** → 向后不兼容，但 `failedItems` 为可选，不提供则保持旧行为
- **逐项推送增加网络请求** → 每个 item 一次请求，但换来精确的失败隔离
- **Partial push 可能造成数据半同步** → 失败的项目保留在 pending 列表中，用户可以再次尝试
- **onProgress 调用频率可能过高** → UI 使用 throttle（每 100ms 最多更新一次进度条）
