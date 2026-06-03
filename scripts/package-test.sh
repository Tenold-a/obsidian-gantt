#!/usr/bin/env bash
set -euo pipefail

# Build obsidian-gantt-test.zip for release.
# Usage: ./scripts/package-test.sh [output.zip]
# Default output: obsidian-gantt-test.zip

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="${1:-$ROOT/obsidian-gantt-test.zip}"

TMP="$(mktemp -d)"
trap "rm -rf $TMP" EXIT

PKG="$TMP/obsidian-gantt-test"
mkdir -p "$PKG"

# ── Connectors ───────────────────────────────────────────────────
cp -r "$ROOT/packages/obsidian-plugin/connectors" "$PKG/connectors"

# ── Test server ───────────────────────────────────────────────────
cp "$ROOT/test-server/server.mjs" "$PKG/test-server.mjs"

# ── Setup README ──────────────────────────────────────────────────
cat > "$PKG/README.md" << 'SETUPEOF'
# obsidian-gantt 测试数据包

## 文件结构

```
obsidian-gantt-test/
├── connectors/
│   ├── csv-connector.js       # CSV 文件连接器
│   ├── test-api-connector.js  # 测试 API 连接器
│   ├── sample-persons.csv     # 示例：人员数据
│   ├── sample-projects.csv    # 示例：项目数据
│   └── sample-tasks.csv       # 示例：任务数据
├── test-server.mjs            # 本地测试 API 服务
└── README.md
```

## 快速开始

### 方式一：CSV 连接器（最简单）

1. 将 `connectors/` 目录复制到插件目录：
   ```
   <vault>/.obsidian/plugins/obsidian-gantt/connectors/
   ```

2. 将 CSV 文件复制到 vault 数据目录：
   ```
   <vault>/obsidian-gantt-data/
   ├── persons.csv
   ├── projects.csv
   └── tasks.csv
   ```

3. 在插件设置中选择 "CSV Connector"

### 方式二：测试 API 服务（支持增删改）

1. 将 `connectors/test-api-connector.js` 复制到插件 connectors 目录

2. 启动测试服务：
   ```bash
   node test-server.mjs
   # 默认端口 3456，可通过 PORT 环境变量修改
   ```

3. 在插件设置中选择 "Test API Connector"，
   设置 URL 为 `http://localhost:3456`

## 测试 API 端点

| 方法   | 路径               | 说明           |
|--------|--------------------|----------------|
| GET    | /api/health        | 健康检查        |
| GET    | /api/data          | 获取全部数据     |
| GET    | /api/tasks         | 任务列表        |
| GET    | /api/persons       | 人员列表        |
| GET    | /api/projects      | 项目列表        |
| POST   | /api/tasks         | 批量 upsert 任务 |
| POST   | /api/projects      | 批量 upsert 项目 |
| DELETE | /api/tasks/:id     | 删除任务        |
| DELETE | /api/projects/:id  | 删除项目        |
SETUPEOF

# ── Build zip ─────────────────────────────────────────────────────
cd "$TMP"
zip -qr "$OUTPUT" "obsidian-gantt-test"

echo "  Test package: $OUTPUT"
echo "  Contents:"
unzip -l "$OUTPUT"
