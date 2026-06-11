## 1. 核心类型变更 (gantt-core)

- [ ] 1.1 在 `index.ts` 中扩展 `PushResult` 增加 `failedItems?: { id: string; type: 'task' | 'project'; error: string }[]`
- [ ] 1.2 新增 `PushProgress` 类型: `{ current: number; total: number; message: string }`
- [ ] 1.3 修改 `ConnectorModule.push` 签名增加可选的 `onProgress?: (p: PushProgress) => void` 第三参数
- [ ] 1.4 `PushChangesPayload.tasks` 改为 `Partial<Task>[]`、`projects` 改为 `Partial<Project>[]`（PATCH 语义，只含修改字段 + 必需 `id`）

## 2. Store push 逻辑重构 (gantt-ui)

- [ ] 2.1 修改载荷构建：从 `overrides[taskId]` 提取仅修改的字段，附加 `id` 构成 `Partial<Task>`
- [ ] 2.2 新增 `pushProgress` signal: `Signal<PushProgress | null>`，初始化 `null`
- [ ] 2.3 传递 `onProgress` 回调给 connector，将进度写入 `pushProgress` signal（throttle 100ms）
- [ ] 2.4 重写清除逻辑：解析每个 connector 返回的 `failedItems`，构建成功 ID 集合，只清除成功项
- [ ] 2.5 失败 item 保留在 overrides/deletedTasks/deletedProjects/localTasks 中，可再次推送

## 3. UI 进度显示 (GanttChart.tsx)

- [ ] 3.1 在 `PendingChangesPanel` 中添加进度条组件，读取 `pushProgress` signal
- [ ] 3.2 推送进行中：显示进度条（百分比 + `current/total` + 当前 message），隐藏独立 push 按钮
- [ ] 3.3 推送完成后：显示 per-connector 结果摘要（成功数/失败数），3 秒后自动消失
- [ ] 3.4 进度条从 `pushProgress` signal 取值，无进度回调时显示不确定的 loading 动画

## 4. Connector 适配

- [ ] 4.1 更新 `test-api-connector.js`：适配逐项推送模式，返回 `failedItems`
- [ ] 4.2 更新 `api-connector.js`：适配逐项推送模式，调用 `onProgress` 回调，返回 `failedItems`
- [ ] 4.3 在每个 item 推送前后调用 `onProgress({ current, total, message })`

## 5. 测试服务器

- [ ] 5.1 新增 `POST /api/push-partial?failEvery=N` 端点，模拟部分失败
- [ ] 5.2 `failEvery=N` 参数控制每 N 个 item 失败 1 个，其余正常处理
- [ ] 5.3 响应格式: `{ success: false, failedItems: [...] }` 或 `{ success: true }`

## 验证清单

- [ ] 成功的 item 从 pending 列表清除
- [ ] 失败的 item 保留编辑，可在下次 push 时重试
- [ ] 进度条显示百分比 + 当前操作信息（`current/total`）
- [ ] 推送完成后显示 per-connector 成功/失败摘要
- [ ] `failEvery=1`（全部失败）时无 item 被清除
- [ ] `failEvery=999`（全部成功）时所有 item 被清除
