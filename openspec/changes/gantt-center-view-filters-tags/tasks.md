## 1. 数据模型变更 (gantt-core)

- [x] 1.1 Project 接口增加 `tags?: string[]` 字段
- [x] 1.2 新增 `TagDefinition` 类型 `{ name: string; color: string }`
- [x] 1.3 EditsOverlay 的 projectOverrides 类型支持 tags 字段
- [x] 1.4 merge-engine 的 mergedProjects computed 支持 tags 覆盖合并

## 2. 视图位置变更 (obsidian-plugin)

- [x] 2.1 main.ts `activateView()` 将 `workspace.getRightLeaf(false)` 改为 `workspace.getLeaf(false)`
- [x] 2.2 view.tsx 确认中心标签页模式下渲染正常（无需修改组件，仅验证）

## 3. 项目标签编辑 (gantt-ui)

- [x] 3.1 ProjectDetail 组件在查看模式下显示项目 tags 为 badge
- [x] 3.2 ProjectDetail 编辑模式下增加标签输入器：输入框 + 添加按钮 + 已有 tag badge（带×删除）
- [x] 3.3 标签编辑支持重复检查，已存在的 tag 不允许重复添加
- [x] 3.4 标签输入支持自动补全（从 tag-management 数据中读取已有标签列表）
- [x] 3.5 store.persistProjectEdit 确保 tags 字段正确序列化到 edits 文件
- [x] 3.6 项目保存时自动将新 tag 创建到 tagDefinitions
- [x] 3.7 项目列表左侧栏显示项目 tags 彩色 badge

## 4. 标签管理页面 (gantt-ui + obsidian-plugin)

- [x] 4.1 store 增加 tags 数据信号和 actions：`loadTags`, `createTag`, `updateTag`, `deleteTag`
- [x] 4.2 创建 TagManagementPanel 组件：标签列表 + CRUD 表单
- [x] 4.3 标签列表每项显示：颜色色块 + 标签名 + 关联项目数
- [x] 4.4 创建标签：输入名称 + 颜色选择器（预设色板 + 自定义颜色）
- [x] 4.5 重命名标签：内联编辑或弹窗，同步更新所有引用该标签的项目
- [x] 4.6 删除标签：确认对话框（显示受影响项目数），删除后清理所有项目引用
- [x] 4.7 标签数据存储：`tags/<viewId>.json` 文件读写
- [x] 4.8 GanttChart 工具栏增加"Manage Tags"按钮，点击打开标签管理面板

## 5. 项目过滤功能 (gantt-ui + store)

- [x] 5.1 store 增加过滤信号：`filterTimeStart`, `filterTimeEnd`, `filterStatuses`, `filterTags`
- [x] 5.2 store 增加 computed：`filteredProjectGroupKeys` — 计算匹配过滤条件的 project group keys（不匹配的从项目窗格隐藏）
- [x] 5.3 store 增加 computed：`filterDimmedTaskIds` — 属于被隐藏项目的任务 ID 集合，用于人员窗格置灰
- [x] 5.4 时间范围过滤逻辑：检查项目 keyDates + 关联任务日期是否与过滤区间有交集
- [x] 5.5 状态过滤逻辑：检查项目 status 是否在 filterStatuses 集合中
- [x] 5.6 标签过滤逻辑：检查项目 tags 是否与 filterTags 集合有交集（OR 逻辑）
- [x] 5.7 组合过滤逻辑：AND 跨维度，OR 同维度内
- [x] 5.8 GanttChart 工具栏增加过滤器 UI：日期范围选择器 + 状态多选下拉 + 标签多选下拉
- [x] 5.9 GanttPane（项目窗格）仅渲染匹配过滤条件的项目组，不匹配的项目直接隐藏
- [x] 5.10 GanttPane（人员窗格）中属于被隐藏项目的任务条置灰（opacity 0.3），人员行保留不隐藏
- [x] 5.11 过滤器活跃时工具栏显示指示器（匹配项目数/总项目数）
- [x] 5.12 筛选和排序设置持久化到 `settings/<viewId>.json`，加载时恢复
- [x] 5.13 `filteredProjectGroupKeys` 区分 null（无过滤）和空 Set（有过滤无匹配）

## 6. Pending 多选与选择性推送 (gantt-ui + store)

- [x] 6.1 store 增加 `dismissChanges(selectedIds: Set<string>)` 方法
- [x] 6.2 store 修改 `pushChanges` 方法，接受可选的 selectedIds 参数
- [x] 6.3 dismissChanges 按类型处理：移除 task overrides、local tasks、deletedTasks、project overrides、deletedProjects
- [x] 6.4 PendingChangesPanel 每条 change 记录前增加 checkbox
- [x] 6.5 增加"Select All"和"Deselect All"快捷按钮
- [x] 6.6 面板头部显示选中计数："N of M selected"
- [x] 6.7 "Push (N)"按钮仅提交选中项
- [x] 6.8 "Dismiss (N)"按钮：二次确认后移除选中项对应的 edits 数据
- [x] 6.9 Push 成功后仅清除本次推送的选中项 edits
- [x] 6.10 当无选中项时 Push 按钮禁用
- [x] 6.11 工具栏移除冲突提示（conflicts indicator）

## 7. 验证与收尾

- [x] 7.1 验证中心标签页模式下甘特图完整功能正常（滚动同步、拖拽、详情面板等）
- [x] 7.2 验证标签管理 CRUD 完整流程（创建、编辑、两步确认删除）
- [x] 7.3 验证项目过滤三种维度及组合过滤正确性
- [x] 7.4 验证 pending 多选推送和取消操作正确性
- [x] 7.5 确认样式在 Obsidian 暗色/亮色主题下均正常显示
- [x] 7.6 验证筛选和排序设置持久化到 `settings/<viewId>.json`
- [x] 7.7 验证 tags 和 settings 目录自动创建
