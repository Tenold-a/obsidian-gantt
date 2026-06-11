## Context

当前 `ConnectorModule` 只有一个数据拉取管道：`fetch()` → `transform()` → `CanonicalData`。`CanonicalData` 包含 tasks、persons、projects 的全部字段，一次性加载。对于从 REST API 拉取数据的连接器，list 接口通常只返回摘要字段（id、name、dates），而 description 等富文本字段需要单独请求 detail 接口。当前架构强制连接器在 `transform()` 中自行处理这个问题（如 N+1 请求），或者放弃提供详情。

拆分后，连接器可以诚实地反映上游 API 的结构：列表数据走 `fetch/transform`，详情数据走 `fetchDetail/transformDetail`。

## Goals / Non-Goals

**Goals:**
- 定义 `ProjectDetail` 和 `TaskDetail` 类型，承载比 `CanonicalData` 中基础实体更丰富的详情字段
- 为 `ConnectorModule` 新增可选的 `fetchDetail` / `transformDetail` 方法，支持按需拉取单个项目或任务的详情
- Store 层增加详情缓存，UI 层在打开详情弹窗时优先使用缓存，未命中时触发按需加载
- 保持向后兼容：未实现 `fetchDetail` 的连接器继续正常工作，详情回退到 `CanonicalData` 中已有的字段

**Non-Goals:**
- 不修改现有连接器脚本（csv-connector、test-api-connector）——它们继续以全量模式工作
- 不改变 `push()` 接口
- 不改变 `CacheFile` 的持久化结构（详情缓存在内存中，不持久化）
- 不引入详情数据的编辑/推送能力（详情只读）

## Decisions

### Decision 1: 新增独立类型而非修改 CanonicalData

**选择**: 保持 `CanonicalData` 及 `Project`/`Task` 不变，新增 `ProjectDetail` 和 `TaskDetail` 类型。

**理由**: 避免破坏现有连接器。`ProjectDetail` 和 `TaskDetail` 是 `CanonicalData` 中基础类型的超集——基础字段相同，额外增加 `description`（Task 新增）、扩展 `metadata` 等。未实现 `fetchDetail` 的连接器不受影响。

**备选方案**: 从 `CanonicalData.Project` 中移除 `description`/`requester`/`keyDates`/`keyLinks` 到 `ProjectDetail`。被否决——破坏所有现有连接器和缓存文件，收益不足以抵消迁移成本。

### Decision 2: 单一 fetchDetail 方法处理 project 和 task

**选择**: `fetchDetail(id: string, type: 'project' | 'task', ctx: ConnectorContext) => Promise<unknown>`，配合 `transformDetail(rawData: unknown, ctx: ConnectorContext) => ProjectDetail | TaskDetail`。

**理由**: 统一的方法签名减少接口复杂度。连接器内部根据 `type` 参数路由到不同的上游 API 端点。

**备选方案**: 分别定义 `fetchProjectDetail`/`fetchTaskDetail`。被否决——增加了接口方法数量，且项目中 project 和 task 的详情获取模式高度相似。

### Decision 3: 详情数据仅内存缓存，不持久化

**选择**: Store 中使用 `Map<string, ProjectDetail | TaskDetail>` 作为内存缓存，键为 `${type}:${id}`。

**理由**: 详情数据量小、变化频率低、且与上游同步周期相关。持久化到 `cache/` 会引入缓存失效策略的复杂度。每次 `refreshConnector` 时清空该连接器的详情缓存即可保证新鲜度。

### Decision 4: UI 层加载状态

**选择**: Store 中增加 `detailLoading` 信号（`Set<string>`，正在加载的详情键集合）。UI 在详情弹窗中展示 loading 骨架屏。

**理由**: 详情拉取是异步操作，需要向用户反馈加载状态。使用 Set 而非单个 loading 标志，支持多个详情同时加载（理论上可能，如快速切换选中项）。

## Risks / Trade-offs

- **[风险] 连接器实现的 `fetchDetail` 性能差异大** → 在 `ConnectorContext` 中提供超时控制建议，UI 层设置 10 秒超时后回退到基础数据
- **[取舍] 内存缓存不持久化意味着刷新页面后需重新拉取详情** → 详情数据量通常很小（单条记录），重新拉取开销可接受
- **[取舍] 未实现 `fetchDetail` 的连接器，详情弹窗只展示基础字段** → 这是可接受的降级行为；连接器作者可以按需添加 `fetchDetail` 支持

## Migration Plan

1. 在 `gantt-core/src/index.ts` 中添加 `ProjectDetail`、`TaskDetail` 类型及 `ConnectorModule` 的新可选方法
2. 在 `gantt-ui/src/store.ts` 中添加 `fetchDetail` 动作和详情缓存
3. 在 `GanttChart.tsx` 中修改详情弹窗，集成按需加载逻辑
4. 现有连接器无需修改——向后兼容
5. 发布小版本（minor）而非大版本（major），因为新增是向后兼容的

## Open Questions

- `TaskDetail` 是否需要包含历史/活动日志字段？当前设计仅添加 `description`，如需扩展可在后续迭代中追加
- 是否需要批量详情拉取（如一次查询多个项目详情）？当前设计仅支持单条拉取，根据实际使用情况再评估
