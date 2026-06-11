## 1. Core Types — `ProjectDetail` / `TaskDetail` / `ConnectorModule` 扩展

- [x] 1.1 在 `packages/gantt-core/src/index.ts` 中添加 `ProjectDetail` 接口（`Project` 所有字段 + `description?`, `requester?`, `keyDates?`, `keyLinks?`, `tags?`, `metadata?`）
- [x] 1.2 在 `packages/gantt-core/src/index.ts` 中添加 `TaskDetail` 接口（`Task` 所有字段 + `description?` + `metadata?`）
- [x] 1.3 在 `ConnectorModule` 接口中添加可选的 `fetchDetail: (id: string, type: 'project' | 'task', ctx: ConnectorContext) => Promise<unknown>`
- [x] 1.4 在 `ConnectorModule` 接口中添加可选的 `transformDetail: (rawData: unknown, ctx: ConnectorContext) => ProjectDetail | TaskDetail`

## 2. Store — 详情缓存与按需加载

- [x] 2.1 在 `GanttStore` 中添加 `detailCache` signal（`Map<string, ProjectDetail | TaskDetail>`，键为 `${type}:${id}`）
- [x] 2.2 在 `GanttStore` 中添加 `detailLoading` signal（`Set<string>`，正在加载的详情键集合）
- [x] 2.3 实现 `fetchEntityDetail(id, type, connectorId)` 动作：检查缓存 → 检查连接器是否支持 `fetchDetail` → 调用 fetch+transform → 更新缓存 → 回退到 `CanonicalData` 字段
- [x] 2.4 在 `refreshConnector` 完成后清空该连接器的详情缓存条目
- [x] 2.5 实现 10 秒超时，超时后回退到 `CanonicalData` 基础字段

## 3. 连接器加载器 — 校验 `fetchDetail`/`transformDetail` 成对

- [x] 3.1 在 `connector-loader.ts` 中增加校验：如连接器导出 `fetchDetail` 但未导出 `transformDetail`（或反之），抛出错误

## 4. UI — 详情弹窗按需加载

- [x] 4.1 修改 `GanttChart.tsx` 中的项目/任务详情弹窗，选中实体时触发 `fetchEntityDetail`
- [x] 4.2 详情弹窗展示 loading 骨架屏（当 `detailLoading` 包含当前实体键时）
- [x] 4.3 详情弹窗使用 `ProjectDetail`/`TaskDetail` 数据渲染（含 markdown 描述等富文本字段），回退场景使用 `CanonicalData` 中的基础字段

## 5. 构建验证

- [x] 5.1 执行 `npm run build`（core → ui → plugin 顺序），确认无类型错误
- [x] 5.2 确认现有 csv-connector 和 test-api-connector 在未实现 `fetchDetail` 时仍正常工作
