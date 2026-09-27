# WARDOGS 交互式战术地图开发与交接指南 (Codex Handoff)

本文档供其他设备上的 Codex 或后续开发者快速接手、继续迭代 `wardogswiki.com` 交互式地图功能。

---

## 1. 任务背景与核心目标

- **目标**：在 `wardogswiki.com` 上直接提供可缩放、可拖动的真实游戏 2D 交互地图，替代原本的静态攻略文字与外部链接。
- **当前进度**：
  - [x] **Bakurani 真实游戏底图**：已下载并缝合游戏客户端导出的 2048×2048 无损正射贴图（`overview.webp` 与 `overview.png`），具备真实地形、道路、掩体与河流。
  - [x] **原生 2D 交互地图组件**：基于 React 19 / Next.js 16 纯原生手势视口（平移拖拽、滚轮与双指捏合缩放、图层开关、塔台战术情报弹窗、实时网格坐标雷达）。
  - [x] **双入口接入**：
    - 攻略页直接集成：`src/app/[locale]/guides/wardogs-map`
    - 独立战术工具页：`src/app/[locale]/tools/map`（支持中/英/德/俄/葡/日 6 语 SEO）
  - [x] **测试验证**：`npm run typecheck` 全绿，`npm run content:validate` 35 个测试文件全部通过。

---

## 2. 核心文件架构

| 模块 | 文件路径 | 说明 |
| :--- | :--- | :--- |
| **交互组件** | `src/components/map/wardogs-map-viewer.tsx` | 2D 视口控制器、手势交互、图层切换、点位浮层 |
| **真实底图资产** | `public/images/maps/bakurani/overview.webp` (及 `.png`) | 2048×2048 游戏客户端真实正射贴图 |
| **资产规范** | `public/images/maps/bakurani/README.txt` | 提取来源、游戏版本 (EA 0.11)、朝向与规格说明 |
| **提取与缝合脚本** | `scripts/fetch_and_stitch_maps.py` | 客户端切片下载与无缝缝合 Python 脚本 |
| **独立页面路由** | `src/app/[locale]/tools/map/page.tsx` | 独立全景地图页面（多语言元数据） |
| **攻略页面嵌入** | `src/app/[locale]/guides/[slug]/page.tsx` | 在 `wardogs-map` 攻略顶部自动挂载地图 |

---

## 3. 接手后的后续开发任务 (Next Steps)

Codex 在其他设备上接手后，可按以下优先级继续向下开发：

### 任务 1：增加 Ozeti 与 Zestafona 两张地图的底图
- 运行 `python3 scripts/fetch_and_stitch_maps.py`，脚本已支持自动拉取缝合 `ozeti` 与 `zestafona`；
- 生成后放置于 `public/images/maps/ozeti/` 与 `public/images/maps/zestafona/`；
- 在 `src/components/map/wardogs-map-viewer.tsx` 的地图切换下拉菜单中解禁 `ozeti` 与 `zestafona` 选项。

### 任务 2：战术路线与标点扩展（加分项）
- **自定义标记（POI）**：在地图上增加队伍集结点、FOB 推荐位、油井、重型载具刷新点；
- **标尺测距与迫击炮解算**：利用已有的 16×16 km 坐标系（1px = 3.90625m），实现两点点击测距及 L81 迫击炮方位角（Azimuth）与仰角（MIL）计算。

---

## 4. 本地验证指令

```bash
# 1. 类型检查
npm run typecheck

# 2. 内容与规则校验
npm run content:validate

# 3. 本地启动预览
npm run dev
# 访问 http://localhost:3000/zh-cn/guides/wardogs-map 或 http://localhost:3000/zh-cn/tools/map
```
