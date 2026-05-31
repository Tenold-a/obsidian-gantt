## Context

当前甘特图插件为Obsidian侧边栏视图（`getRightLeaf`），项目数据通过CSV连接器加载，支持按人员和项目分组显示。Project实体已有`status`、`keyDates`、`description`等字段，但没有`tags`。Task实体有`tags`字段但仅在详情中只读展示。Pending面板当前为全量推送/取消模式。

## Goals / Non-Goals

**Goals:**
- 视图默认在中间标签页区域打开，兼容用户手动拖拽到侧边栏
- 项目支持按时间范围、状态、标签三维过滤，不匹配项目在项目窗格隐藏，人员窗格中对应任务置灰
- Project实体增加tags字段，支持在项目详情面板增删标签
- 标签管理页面支持CRUD及颜色设置，所有标签数据集中管理
- Pending面板支持多选+选择性推送+取消选中项

**Non-Goals:**
- 不改变Task的tags字段编辑方式（Task tags暂不增加编辑UI）
- 不隐藏Person行（项目过滤在人员窗格中仅置灰相关任务，不隐藏人员行）
- 不实现标签的层级/分组
- 不改变CSV连接器的push逻辑（tags作为project字段随push一起发送）

## Decisions

### 1. 视图位置：`getLeaf()` 替代 `getRightLeaf()`

**选择：** 将`activateView()`中的`workspace.getRightLeaf(false)`改为`workspace.getLeaf(false)`。

`getLeaf(false)`在Obsidian API中默认在中间区域创建标签页。Obsidian的`WorkspaceLeaf`本身就支持用户拖拽到任意位置（侧边栏、弹出窗口等），因此改动仅限于初始打开位置，不限制用户后续调整。

**替代方案考虑：**
- 保留右侧边栏作为默认并增加设置项：增加复杂度但无实质收益，用户可以直接拖拽标签页到侧边栏
- 使用`getLeaf('tab')`明确指定类型：`getLeaf(false)`已足够，`false`参数表示不拆分当前页

### 2. 过滤机制：信号驱动的计算属性

**选择：** 在store中增加三个过滤信号，通过computed派生出过滤后的projectGroups和dimmed状态。

```
filterTimeRange: { start?: string; end?: string }  // YYYY-MM-DD
filterStatuses: Set<string>                         // 选中的status值集合
filterTags: Set<string>                             // 选中的tag集合
```

过滤逻辑：
1. 对每个ProjectGroup评估是否匹配所有活跃的过滤条件
2. 匹配的项目在项目窗格中正常显示
3. 不匹配的项目在项目窗格中直接隐藏（不渲染）
4. 人员窗格中，属于被隐藏项目的任务条置灰（opacity 0.3），人员行保留
5. 当所有过滤条件为空时，无过滤效果，所有项目正常显示

时间范围过滤基于项目的keyDates和关联任务的日期范围：项目任一keyDate或其任务的时间范围与过滤区间有交集即视为匹配。

**替代方案考虑：**
- 隐藏不匹配项而非置灰：**采用**。项目窗格直接隐藏不匹配项目，人员窗格中对应任务置灰保留上下文
- 在Timeline层面过滤：太底层，影响面大。在projectGroups层面更清晰

### 3. 项目标签：Project接口扩展+编辑UI

**选择：** 
- `Project`接口增加`tags?: string[]`字段
- `EditsOverlay.projectOverrides`支持`tags`字段
- `ProjectDetail`组件在编辑模式下显示标签输入器
- 标签以badge形式显示，点击×删除，输入框支持自动补全已有标签

**替代方案考虑：**
- 使用单独的管理表存储项目-标签关联：过度设计，tags数组已满足需求
- 仅在Project上存储标签ID引用：增加查询复杂度，直接存储标签名更简单

### 4. 标签管理：独立页面

**选择：**
- 标签数据存储在`views/<viewId>.json`的ViewDefinition中或独立文件`tags/<viewId>.json`
- 使用独立文件`tags/<viewId>.json`存储`{ tags: TagDefinition[] }`，与view绑定
- Tag管理页面作为GanttChart的一个modal/panel，从工具栏按钮打开
- 支持操作：新建（名称+颜色）、重命名、删除、改色
- 删除标签时检查关联项目，提示确认

**替代方案考虑：**
- 全局标签（跨view共享）：可能造成命名冲突，先按view隔离
- 使用Obsidian设置页：与甘特图UI割裂，不如内嵌面板直观

### 5. Pending多选：复选框+选择性操作

**选择：**
- PendingChangesPanel中每条change增加checkbox
- 增加"全选"/"取消全选"快捷按钮
- "Push Selected"仅提交勾选项（传给`pushChanges`一个ID集合参数）
- "Dismiss Selected"取消勾选项的改动（从edits中移除对应数据）
- store中增加`pushChanges(selectedIds: Set<string>)`方法，接受选中ID过滤参数
- store中增加`dismissChanges(selectedIds: Set<string>)`方法

**store改动要点：**
- `pushChanges`支持可选的`selectedIds`参数，传入时仅处理ID在集合中的项
- `dismissChanges`方法：对选中的task/project ID，移除对应的overrides、localTasks、deletedTasks/deletedProjects条目，然后持久化

**替代方案考虑：**
- 单独的"撤销"按钮逐项操作：效率低，批量操作更实用
- 在store层面拆分为更细粒度方法：当前在UI层管理选中状态更灵活

## Risks / Trade-offs

- **视图位置变更**：已有用户可能习惯了侧边栏位置，但Obsidian会记住上次的leaf位置，不会破坏已有布局
- **过滤性能**：每次过滤条件变化触发computed重算，但projectGroups数据量通常不大（数十个项目），性能无忧
- **标签一致性**：删除标签后面临关联项目的tags数组清理问题，需在删除时提示并自动清理
- **Pending dismiss**：dismiss是不可逆操作（清除本地edits），防止用户误操作需二次确认
