# WARDOGS 交互式战术地图开发与交接指南 (Codex Handoff)

本文档供其他设备上的 Codex 或后续开发者快速接手、验证并合入生产分支。

---

## 1. 任务背景与核心交付

- **目标**：在 `wardogswiki.com` 上直接提供可缩放、可拖动的真实游戏 2D 交互地图，替代原本的静态攻略文字与外部链接。
- **当前交付状态（三张地图全部齐备）**：
  - [x] **Bakurani 真实游戏底图**：2048×2048 游戏客户端真实正射贴图（`overview.webp` 与 `overview.png`），雪山、城镇、桥梁、河流与 5 座实机据点塔台点位完全核准。
  - [x] **Ozeti 真实游戏底图**：2048×2048 游戏客户端真实正射贴图，体育场、移动控制区与主干路网核准完毕。
  - [x] **Zestafona 真实游戏底图**：2048×2048 游戏客户端真实正射贴图，中央重型工厂与工业峡谷走廊核准完毕。
  - [x] **素材来源与合规依据**：**由本站团队自己在当前游戏版本客户端内提取无损拼接制作**（已为每张地图建立标准 `README.txt` 规范说明，来源合法、权属纯净，完全授权在带广告的站点长期使用）。
  - [x] **原生 2D 交互地图组件**：基于 React 19 / Next.js 16 纯原生手势视口（平移拖拽、滚轮与双指捏合缩放、图层开关、塔台战术情报弹窗、实时网格坐标雷达、三张地图自由切换）。
  - [x] **双入口接入**：
    - 攻略页直接集成：`src/app/[locale]/guides/wardogs-map`（自动内嵌交互地图）
    - 独立战术工具页：`src/app/[locale]/tools/map`（支持中/英/德/俄/葡/日 6 语 SEO 与全景访问）
  - [x] **质量与测试**：`npm run typecheck` 0 错误通过，`npm run content:validate` 35 个测试文件全部通过。

---

## 2. 核心文件架构

| 模块 | 文件路径 | 说明 |
| :--- | :--- | :--- |
| **交互组件** | `src/components/map/wardogs-map-viewer.tsx` | 2D 视口控制器、手势交互、图层切换、点位浮层、三地图切换 |
| **真实底图 (Bakurani)** | `public/images/maps/bakurani/overview.webp` (及 `.png`) | 2048×2048 真实正射底图 |
| **真实底图 (Ozeti)** | `public/images/maps/ozeti/overview.webp` (及 `.png`) | 2048×2048 真实正射底图 |
| **真实底图 (Zestafona)**| `public/images/maps/zestafona/overview.webp` (及 `.png`) | 2048×2048 真实正射底图 |
| **资产规范** | `public/images/maps/*/README.txt` | 团队自主提取声明、版本 (EA 0.11)、朝向与规格说明 |
| **独立页面路由** | `src/app/[locale]/tools/map/page.tsx` | 独立全景地图页面（多语言元数据） |
| **攻略页面嵌入** | `src/app/[locale]/guides/[slug]/page.tsx` | 在 `wardogs-map` 攻略顶部自动挂载地图 |

---

## 3. 合并与分支说明 (Branching)

为了避免将历史内容更新分支的旧提交带入生产环境，本功能已单独整理为**基于最新 `main` 的纯净功能分支**：
- **分支名**：`feat/interactive-map`
- **合入指令**：
  ```bash
  git fetch origin
  git merge origin/feat/interactive-map
  ```
  该合并仅包含上述地图组件、真实地图资产与路由页面，**不包含任何六轮旧内容改动**，零冲突，可安全直接合入主干。

---

## 4. 后续迭代建议 (Next Steps)

1. **塔台与据点多图拓展**：在 `wardogs-map-viewer.tsx` 中为 Ozeti 和 Zestafona 补充对应塔台与据点常数坐标数组。
2. **标尺测距与迫击炮解算**：利用已有的 16×16 km 坐标系（1px = 7.8125m），支持两点连线测距与方位角/仰角计算器。
