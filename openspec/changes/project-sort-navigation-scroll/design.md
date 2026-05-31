## Context

项目甘特图当前仅按名称排序。`ProjectGroup` 在 [store.ts](packages/gantt-ui/src/store.ts#L282) 中固定按 `projectName` 字母排序，无切换机制。人员甘特图已有 `personSortMode` 信号和排序按钮（按名称/职位），可作为参考实现。

未分配项目面板 `UnassignedPanel` 在 [GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx#L765-L855) 仅展示可拖拽卡片。`DetailPanel` 在 [GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx#L1603-L1619) 已展示项目名称且可点击跳转，但位于面板中部，底部无项目信息。

两个时间线共享 `sharedScrollLeft` 信号实现水平滚动同步。`Timeline` 组件初始加载时自动滚动到今天的日期（[GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx#L181-L188)）。

## Goals / Non-Goals

**Goals:**
- 项目甘特图支持按时间维度排序（上线时间 → 最后任务结束时间 → 第一个任务开始时间），可切换回名称排序
- 未分配项目卡片点击打开项目详情面板
- 任务详情底部展示所属项目信息（名称、颜色、状态），点击跳转项目详情
- 跨实体跳转时甘特图自动水平滚动到目标时间条位置

**Non-Goals:**
- 不在人员甘特图增加额外排序维度（已有名称/职位）
- 不改变已有的 scroll sync 机制
- 不支持用户自定义排序多级优先级
- 不在任务详情面板中移除已有的项目行（保留原有位置）

## Decisions

### 1. 项目排序模式：新增 `projectSortMode` 信号

参照 `personSortMode` 模式，在 store 中新增 `projectSortMode` 信号（`'name' | 'time'`）。`projectGroups` 的 computed 在 `time` 模式下执行多级排序：

1. 优先按项目的「上线时间」key date 升序排列
2. 无上线时间的项目按该项目的最后任务结束时间升序排列
3. 无任务的项目排在最后，按名称字母排序

**Why not add first-task-start as a separate level?** 上线时间本身已经表达了最早的时间约束；最后任务结束时间能反映项目总体跨度。如果缺少这两个时间，使用第一个任务开始时间作为 fallback 会增加复杂度但收益有限。

**Why not a dropdown with multiple sort options?** 双模式切换按钮（名称/时间）与已有的人员排序按钮保持一致，简单直观。

### 2. 未分配项目点击：复用现有 `selectEntity`

`UnassignedPanel` 卡片的 `onClick` 直接调用 `store.selectEntity({ type: 'project', id: p.id })`。由于 `DualPane` 已经根据 `selectedEntity.type === 'project'` 条件渲染 `ProjectDetail`，无需额外布局变更。

但需注意：当项目详情打开时，`UnassignedPanel` 当前会被隐藏（[GanttChart.tsx](packages/gantt-ui/src/GanttChart.tsx#L2123) 的 `!showTaskDetail && !showProjectDetail` 条件）。从未分配项目打开详情后该面板会消失，这是正确的行为——用户查看详情时不需要重复看到未分配列表。

### 3. 任务详情底部项目信息：新增独立区块

在 `DetailPanel` 底部（source info 之前）增加一个独立的「所属项目」区块，包含：
- 项目颜色标识（彩色方块）
- 项目名称（可点击，跳转项目详情）
- 项目状态（StatusBadge）
- 「查看项目详情 →」提示文字

**Why 底部独立区块而非仅保留原有中间位置？** 底部区块更醒目，作为"相关导航"的自然位置。原有中间位置的项目行保留不变，确保信息完整性。

**Why not a full project card?** 任务详情面板宽度有限（320px），完整项目卡片（含 key dates、links 等）会占用过多空间。精简的项目摘要（名称+颜色+状态+导航链接）在有限的垂直空间内提供足够上下文。

### 4. 自动滚动：新增 `scrollTargetDate` 信号

Store 中新增 `scrollTargetDate` computed 信号，根据当前选中的实体计算目标日期：

- 选中任务 → 任务的 `startDate`
- 选中项目 → 优先「上线时间」key date，其次第一个关联任务的 `startDate`，最后 `null`
- 选中人员 / 取消选中 → `null`

`Timeline` 组件中新增 `useEffect` 监听 `scrollTargetDate`，当值变化时计算目标像素位置并设置 `scrollLeft`（通过已有的 `sharedScrollLeft` 同步机制自动传播到另一个窗格）。

**Why computed signal over imperative call?** Preact signals 的响应式模式天然适合"选中变化 → 目标日期变化 → 滚动"的链条。避免在 `selectEntity` 中混杂滚动逻辑。

**Why scroll to startDate for tasks and 上线时间/earliest task for projects?** 任务的时间条由 startDate 定位，跳到 startDate 能直接看到该任务。项目没有自身时间条，跳到上线时间（key date marker）或第一个任务能让用户立即看到项目的关键时间节点。

## Risks / Trade-offs

- **排序切换时行位置跳变**: 当用户从名称排序切换到时间排序时，项目行顺序可能大幅改变。→ 这是排序切换的固有行为，与人员排序的行为一致，用户预期如此。
- **自动滚动打断用户操作**: 如果用户在手动滚动时选中了实体，自动滚动会"抢夺"滚动位置。→ 自动滚动仅在 `selectedEntity` 变化时触发一次，不影响后续手动滚动。
- **上线时间 key date 名称硬编码**: 当前「上线时间」是中文 key date preset。如果用户使用不同名称的 key date 表示"上线"，排序会 fallback 到最后任务结束时间。→ 接受此限制；`上线时间` 是 preset 中的标准名称，覆盖了主要使用场景。
