# WARDOGS 流量保护型全站究极升级实施计划

> **For agentic workers:** Use `superpowers:executing-plans` for integration, `superpowers:subagent-driven-development` for the four owned workstreams, `superpowers:test-driven-development` for every behavior change, and `superpowers:verification-before-completion` before every completion or release claim. Do not reset or overwrite the existing shared working tree.

**Goal:** 在不损失已验证搜索流量、旧 URL、广告库存和八语言能力的前提下，把首页压缩成六段任务入口，建立 Guides/Catalogue/Tools 三个承接中心，补齐内容、本地化、内部链接、分析、SEO、视频和发布监控。

**Architecture:** 用一个强类型 Discovery/Traffic Asset 契约驱动首页、导航和分析；用 Tool Registry、Guide Routes 和 Catalogue Hub Model 驱动三个深层中心；首页只消费这些模型的精选结果。路由保护 JSON、SEO 契约和生产 smoke 共同保证流量资产不被 UI 改造破坏。

**Tech Stack:** Next.js 16.3.6 App Router、React 19.2.8、next-intl 4.13.6、MDX、TypeScript 6、Vitest 4、Playwright 1.62、GitHub Pages static export、现有 production release/IndexNow 脚本。

**Spec:** [`docs/superpowers/specs/2026-10-05-traffic-protected-ultimate-upgrade-design.md`](../specs/2026-10-05-traffic-protected-ultimate-upgrade-design.md)

## Global Constraints

- 当前工作分支是 `codex/fix-pages-video-clip-tests`；计划编写时存在未提交的首页候选改动和不相关未跟踪文件。执行者不得 `git reset --hard`、`git clean`、覆盖用户文件或把不相关资产带入提交。
- 当前未提交 `HomeGuideHub` 方案不是最终结构。保留其中有价值的链接意图，按本计划迁移到 Guides/Tools/首页六段模型后再决定删除哪些旧代码。
- 在修改任何 Next.js 代码前，执行者必须读取本仓 `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`、`04-linking-and-navigating.md`、`14-metadata-and-og-images.md`、`node_modules/next/dist/docs/01-app/02-guides/static-exports.md`；涉及 route handler、proxy 或 deployment 时再读对应本地文档。
- 保留全部 canonical URL、主要搜索主题、已确认攻略步骤、证据等级、工具计算语义和分享状态。只有明确批准的 legacy 映射可以改变 URL。
- 所有用户可见新增内容同时覆盖 `en`、`ru`、`de`、`pt-br`、`ja`、`zh-cn`、`zh-tw`、`pl`。
- 不把 GA/GSC/Bing/Adsterra 原始数值打进客户端 bundle。代码只存路由优先级和稳定 evidence key；原始导出放在 `.tmp/traffic-baseline/<release-sha>/`，不提交。
- 不把 GSC、Bing、GA、Bing AI 和广告数据混成一个指标，不从不完整日期或低样本推导因果。
- 当前启用广告库存不得减少；Smartlink、Popunder、Social Bar 的关闭状态继续保持。
- 不复制竞品文字、图片、私有数据或未验证计算。新增事实必须延续现有来源与证据边界。
- 每个任务先写失败测试，再实现最小改动，再跑聚焦测试。共享文件只由指定 owner 编辑，避免四个 agent 同时改同一文件。
- 每个提交只包含该任务列出的文件；不提交 `.workbuddy/`、zip、下载图片、临时脚本、原始后台导出或与本计划无关的未跟踪文件。
- 四个 agent 共享文件系统，但只有 Integrator 可以操作 Git index/commit、运行 Next build、Pages build、共享 Playwright server 或占用端口 3000/3001。Agent 只编辑自己的文件并运行不写 `.next/out` 的聚焦 Vitest/content tests；集成命令由 Integrator 串行执行。
- 正式环境已经在 2026-10-05 通过响应头和 `/api/revision` 核实为 Cloudflare 前置的 Vercel 部署，`x-vercel-*` 响应头存在，线上 revision 为计划起点 `e8fafbc58f6143bb19fa6009cb9e2aa36400396e`。Vercel 是唯一权威生产；GitHub Pages 是辅助静态导出兼容流水线，不得拥有 `www.wardogswiki.com`、自动提交 IndexNow 或被当作 HTTP 308 行为的权威环境。

## Review Focus

- `/ja/items`、日语 squad/towers/cargo/progression 等保护入口在真实 DOM 中可见、可点击并返回 200。
- 首页恰好六个语义段，Hero 搜索打开 dialog，不跳到底部；桌面和移动高度预算都通过。
- Guides、Catalogue、Tools 能承接从首页移走的完整能力，用户无需返回首页寻找下一步。
- 每个首页入口只产生一次稳定分析事件；六段曝光和 hub 点击可在 GA 中区分。
- 八语言页面不是英语模板换标题，新增答案在最终渲染正文中可见。
- 发布前已有 200 的保护 URL 零新增 404；clean 404 不被粗暴重定向到首页。
- canonical/hreflang/sitemap/schema/video schema 与最终路由一致。
- 启用广告 slot 数量和格式不减少，移动端不遮挡关键任务。
- GitHub Pages export、常规 production build 和线上 production contract 都覆盖新结构。

## Execution Model

### 四 Agent 所有权

| Agent | 独占范围 | 不得并行编辑 |
|---|---|---|
| A — Traffic/Home/Analytics | Discovery 类型、流量资产、首页模型与组件、`analytics.spec.ts`、`homepage-structure.spec.ts` | `messages/*.json`、Catalogue 组件、SEO/release 脚本 |
| B — Hubs/Navigation | Tool Registry、Tools/Guides/Catalogue hub、导航/搜索接入及各自 feature E2E | 首页组合、MDX、metadata/schema/sitemap、release 脚本 |
| C — Content/Localization | 重点攻略 MDX、`messages/*.json`、共享本地化 prose、内容审计 | 首页 JSX、workflow、release 脚本 |
| D — SEO/QA/Release | 路由保护配置、metadata/schema/sitemap、video、广告测试、Playwright 公共 config、CI、release/monitoring | MDX 正文、首页视觉组件 |

Integrator 负责共享边界、依赖顺序、冲突解决、Git staging/commit、build 和最终验证。若某任务需要另一个 owner 的文件，先发送接口要求，由 owner 修改，不抢文件。B 暴露 registry/model 后由 D 串行接入 metadata/schema/sitemap；A 只消费 B 的 Catalogue compact component，不编辑它。

### 依赖波次

```text
Wave 0: Task 0 生产平台、工作树、数据与视觉基线冻结（串行）
Wave 1A: Task 1 Discovery/Traffic 类型与保护资产
Wave 1B: A 完成 Task 1 | B 依次完成 Task 3 Tool Registry、Task 4 Guide Route、Task 5 Catalogue Model 接口 | C 完成 Task 8 内容差距报告 | D 先冻结 Task 14 广告 inventory fixture
Wave 1C: Agent A/B 提交完整 message key 清单，Task 10 先交八语言 UI keys
Wave 2: Task 2 兼容 analytics 库 | Task 3-5 三个 Hub | Task 9 内容修复 | Task 10 共享本地化 | Task 12-13 SEO/视频
Wave 3: Task 6 首页六段与最终 analytics E2E | Task 7 → Task 11（B 串行） | Task 14 广告
Wave 4: Task 15-17 CI、生产合同和候选验收
Wave 5: Task 18 旧组件清理与最终审阅 → 重跑 Task 17 全量验收 → Task 19 干净 release checkout 发布与后续监控
```

每个任务内部先记录预期失败，再完成实现并转绿；Wave 1 的差距报告本身必须可生成且结构合同通过，报告列出的产品缺口由 Wave 2 修复，不能把预期缺口当作测试基础设施失败。首页压缩必须等三个深层中心具备可用承接能力后才提交。

## Tasks

### Task 0：冻结基线并保护当前工作树

**Owner:** Integrator

**Create:**

- `config/traffic-protected-routes.json`
- `tests/unit/traffic-protected-routes.test.ts`
- `.tmp/traffic-baseline/.gitkeep`（仅当 `.gitignore` 需要目录说明；不得提交实际导出）

**Modify:**

- `.gitignore`

**Steps:**

1. 读取本地 Next.js 文档和本计划 Spec，记录已读路径到本次执行日志。
2. 记录 `git status --short`、当前 HEAD、当前 production revision 和当前未提交首页文件；不得清理或覆盖现有改动。开发继续在共享工作树按 owner 编辑，正式发布时从最终 release commit 创建独立 clean checkout，满足 `release:prepare`，不要求删除用户的未跟踪文件。
3. 把生产承载写入基线：Vercel/Cloudflare 为唯一权威生产；Next Server/Vercel 负责 HTTP 308、proxy 和 revision。GitHub Pages 只验证 static export，使用独立非生产 URL，不写生产 CNAME、不发送 IndexNow、不要求模拟 HTTP 308。
4. 在改代码前，用固定字体、固定广告 mock、`en/ja`、390/768/1440/1920 viewport 保存当前线上首页 `main` 高度、段落位置和截图到本地 baseline 目录。Task 17 只能与此冻结基线比较，不能用改版后截图重设高度基线；footer 和 fixed/sticky ads 不计入 `main` 高度。
5. 从以下来源生成保护 URL 合集：当前线上 sitemap、仓库全部内部 href、legacy paths、GA Landing page 的 sessions/engaged sessions、GA Pages and screens 的 views、GSC Pages 的 clicks、Bing top pages、Bing AI cited pages。各报表独立标 source，不把 GA 阅读页当 landing page；GA 另记录 hostname/environment、Singapore direct 异常和 `(not set)` 分层。每条 URL 只存 `path`、`expectedStatus`、`tier`、`sources`、`locales`，不写原始点击/收益数字。
6. JSON 分成 `canonical`（200）、`legacy`（308）和 `knownMissing`（404）。至少纳入 Spec 种子、全部当前 sitemap 和全部现有 legacy alias。只有 canonical 200 要求以受支持 locale 开头；`wardogs-squad-invite` 不得成为 canonical 200，但必须保留为指向 `wardogs-squad-guide` 的 308 合同。`/maps`、`/wardogs/ja/...` 等非 locale legacy path 合法。
7. 先写失败测试，要求：每类内部 URL 唯一、`expectedStatus` 与类别一致、`/ja/items` 和 `/de/items/weapons` 存在、308 有相关目标、404 标记 noindex 要求、同一路径不能同时属于多个类别。
8. 运行失败测试，确认失败原因是配置尚不完整，而不是测试环境错误。
9. 完成 JSON，重跑测试。

**Verify:**

```bash
npx vitest run tests/unit/traffic-protected-routes.test.ts
git diff --check -- .gitignore config/traffic-protected-routes.json tests/unit/traffic-protected-routes.test.ts
```

**Commit:** `test: freeze traffic-protected route contract`

### Task 1：建立 Discovery 与流量资产单一数据源

**Owner:** Agent A

**Create:**

- `src/features/discovery/discovery-types.ts`
- `src/features/home/home-traffic-assets.ts`
- `tests/unit/home-traffic-assets.test.ts`

**Modify:**

- `src/features/home/home-data.ts`

**Steps:**

1. 写失败测试覆盖：八语言各有且只有 6 个 `protectedDemand` 攻略/任务项；无重复 href；每个 guide slug 能从对应 locale 的 guide summaries 解析；全局 fallback 只在本地优先项缺失时使用。精确 `/items` 由 Task 5 的 database 模型独立提供，不挤掉六个攻略项。
2. 写失败测试锁定六个 `HomeSection` 值和兼容的 `DiscoveryTask` 白名单；任何未知 task 在编译或 runtime validation 中失败。`firstMatch`、`pcFixes`、`faq` 等现有 task 保留，不能在新类型上线时丢事件。
3. 实现 Spec 中的 `DiscoveryDestination` 和 `TrafficAsset`。本任务不创建依赖 `ToolDefinition` 的完整 `HomeDiscoveryModel`；该模型在 Task 6、Tool Registry 完成后实现，消除同波依赖环。
4. 把当前 `LOCALIZED_PRIORITY_SLUGS` 迁入 `home-traffic-assets.ts`，先冻结当前八语言六项，再根据有来源的保护 JSON 调整。任何替换都要在测试中写明旧入口在 database/library/hub 的同层承接位置；保留 `getHomePriorityGuides()` 兼容 wrapper，直到首页迁移完成。
5. 保护清单存 evidence key，不存点击量、曝光量、收益或 query 文本。

**Verify:**

```bash
npx vitest run tests/unit/home-data.test.ts tests/unit/home-traffic-assets.test.ts
npm run typecheck
```

**Commit:** `feat: add traffic-protected discovery model`

### Task 2：冻结分析 taxonomy 并补齐六段可观测性

**Owner:** Agent A

**Create:**

- `src/features/analytics/discovery-taxonomy.ts`
- `src/components/seo/home-section-analytics.tsx`
- `tests/unit/discovery-analytics.test.ts`

**Modify:**

- `src/lib/analytics-events.ts`
- `src/components/seo/site-analytics.tsx`
- `tests/unit/google-analytics.test.tsx`

**Steps:**

1. 写失败测试：所有 `data-home-task` 必须来自白名单；每次点击只产生一次 `home_task_click`；新 payload 在保留现有 `task`、`placement`、`locale`、`page_path`、`link_url` 的同时增加 locale-free `target_path`。
2. 明确定义 `LegacyHomeTask` 和 `LegacyHomePlacement` 兼容集合。Task 6 切换前继续接受当前 `firstMatch`、`pcFixes`、`faq`，以及 `hero/action-hub/discovery/intel/catalogue/recovery/routes/tools/collections/tactical-hub/editorial-path/editorial-priority`；新首页只发六个新 placement。旧值不重命名、不映射成另一含义。保留历史 `home_task_click_<task>` 行为时写兼容测试；不得把 hub 深层点击伪装成首页点击。
3. 新增 `discovery_click`，仅用于 Guides/Catalogue/Tools hub，参数为 `hub`、`task`、`locale`、`page_path`、`target_path`。
4. 新增 `home_section_view` 基础设施：观察每段顶部 sentinel 进入 viewport 25%–75% 中部区域，同一 page view 每段最多一次。SPA 新 page view 重置集合，back/forward 按新的 page view 事件重置；Observer 不存在时安静降级。此任务只做 unit contract，六段 DOM E2E 在 Task 6 接线后完成。
5. 测试 raw search query、地图坐标、工具配置和分享 URL 不进入任何新事件。
6. 在发布 runbook 中列出 GA 管理后台需要注册的 `task`、`placement`、`section`、`target_path`、`hub` 自定义维度；代码测试不能代替后台验证。

**Verify:**

```bash
npx vitest run tests/unit/discovery-analytics.test.ts tests/unit/google-analytics.test.tsx tests/unit/site-search-analytics.test.ts tests/unit/tool-result-analytics.test.ts
```

**Commit:** `feat: freeze discovery analytics taxonomy`

### Task 3：建立 Tool Registry 和八语言 Tools Hub

**Owner:** Agent B（翻译键由 Agent C 提供）

**Create:**

- `src/features/tools/tool-registry.ts`
- `src/components/tools/tool-hub.tsx`
- `src/app/[locale]/tools/page.tsx`
- `tests/unit/tool-registry.test.ts`
- `tests/unit/tool-hub.test.tsx`

**Modify:**

- `src/features/navigation/navigation-data.ts`
- `src/features/search/site-search-index.ts`
- `tests/unit/navigation-data.test.ts`
- `tests/unit/site-search.test.ts`
- `messages/{en,ru,de,pt-br,ja,zh-cn,zh-tw,pl}.json`（Agent C）

**Steps:**

1. 写失败测试，要求九个现有工具恰好出现一次、href 与现有路由完全一致、每个工具有 group/task/related guides/翻译键。
2. 先实现 `ToolDefinition` 注册表和完整 message key 清单并交给 Agent C；Agent C 完成八语言 keys 后，B 才实现 hub UI，避免接口与翻译互相等待。导航和搜索适配注册表时输出顺序保持行为等价。
3. 新增 `/[locale]/tools` Server Component 页面，显式实现 `generateStaticParams()` 覆盖八语言并调用 `setRequestLocale(locale)`。搜索/筛选若需要交互，只把最小交互岛做成 Client Component，不把 icon 函数或不可序列化 props 跨 Server/Client 边界。
4. 按 combat/economy/logistics/progression/fixes 分组，显示用途、证据限制、相关攻略和精确工具入口。
5. B 添加 locale metadata 和 search index 接入；D 在 Task 12 独占完成 canonical/hreflang、sitemap 和 CollectionPage/ItemList JSON-LD，避免同时编辑 SEO 文件。
6. 导航 Maps & Tools 组加入 `/tools` 总入口，同时保留 Map、Artillery Calculator 等高价值直达链接。
7. 八语言测试逐一访问 hub，确认没有英文 UI fallback。

**Verify:**

```bash
npx vitest run tests/unit/tool-registry.test.ts tests/unit/tool-hub.test.tsx tests/unit/navigation-data.test.ts tests/unit/site-search.test.ts
npx playwright test tests/e2e/navigation.spec.ts tests/e2e/site-search.spec.ts tests/e2e/tools-workflow.spec.ts
npm run typecheck
```

**Commit:** `feat: add localized tools discovery hub`

### Task 4：把完整玩家路线迁入 Guides Hub

**Owner:** Agent B（翻译键由 Agent C 提供）

**Create:**

- `src/features/guides/guide-routes.ts`
- `src/components/guides/guide-route-grid.tsx`
- `tests/unit/guide-routes.test.ts`

**Modify:**

- `src/app/[locale]/guides/page.tsx`
- `src/features/guides/guide-collections.ts`
- `src/components/guides/guide-grid.tsx`
- `tests/unit/guide-collections.test.ts`
- `tests/e2e/guide-depth.spec.ts`
- `messages/{en,ru,de,pt-br,ja,zh-cn,zh-tw,pl}.json`（Agent C）

**Steps:**

1. 写失败测试：三条 Guide Route 均能解析到存在的 guide/tool；每篇 guide 仍恰好归入一个 collection；现有 `#collection-*` anchor 不变。
2. 从 `guide-collections.ts` 拆出首页展示位置和跨工具路线逻辑，只保留 collection 分类职责。由于当前 `home-guide-hub.tsx` 在 Task 6 前仍 import `HOME_ROUTE_GROUPS` 和旧 copy 字段，本任务保留带 deprecated 注释的兼容 re-export/shim；Task 6 迁移首页 import 后再删除 shim，保证每个波次 typecheck 可通过。
3. 实现 `resolveGuideRoutes(guides, locale)`，稳定返回 New Player、Combat & Operations、Logistics & Live 三条路线；每条路线展示任务说明、顺序化攻略和相关工具。缺少某个配置 slug 时测试失败，不静默删掉路线。
4. Guides hub 先显示路线，再显示 collections；首页后续只链接路线或 hub，不复制完整卡片列表。
5. 保留现有 GuideGrid、VideoGuideStrip、广告库存和完整 64 篇/语言内容库。
6. E2E 从路线入口走到 guide，再进入相关 tool，验证 locale 不丢失。

**Verify:**

```bash
npx vitest run tests/unit/guide-routes.test.ts tests/unit/guide-collections.test.ts tests/unit/guide-index.test.ts tests/unit/guides-metadata.test.ts
npx playwright test tests/e2e/guide-depth.spec.ts
```

**Commit:** `feat: move complete player routes into guides hub`

### Task 5：整理 Catalogue Hub 并提供首页精简模型

**Owner:** Agent B

**Create:**

- `src/features/catalogue/catalogue-hub-data.ts`
- `src/components/catalogue/catalogue-hub.tsx`
- `src/components/catalogue/catalogue-preview-row.tsx`
- `tests/unit/catalogue-hub-data.test.ts`

**Modify:**

- `src/app/[locale]/items/page.tsx`
- `src/components/catalogue/catalogue-home-band.tsx`
- `tests/unit/catalogue-home-band.test.tsx`
- `tests/unit/item-route-availability.test.ts`

**Steps:**

1. 先写失败测试，锁定 category 数量、已发布 preview 条件、精确 `/items` 总入口、Weapons/Vehicles 入口和 locale route resolution。
2. 把 `categoryMedia`、preview resolver、category builder 从页面组件移入 `catalogue-hub-data.ts`，复用现有 `CatalogueRecord` 和 evidence model。固定导出 `buildCatalogueHubModel(locale)`（完整 categories/previews/featured）和 `buildCatalogueHomeModel(locale)`（精确 `/items`、Weapons、Vehicles、最多一行 published previews），让 A 只消费后者。
3. `CatalogueHub` 显示完整分类和发布实体；`CatalogueHomeBand` 只消费精简模型：总入口、Weapons、Vehicles、最多一行已发布预览。
4. 保留 evidence status、verifiedAt、change history、`resolveItemRouteTarget` 和 index locale 语义。
5. 不为 CIWS 等历史/受限记录强开详情页。

**Verify:**

```bash
npx vitest run tests/unit/catalogue-hub-data.test.ts tests/unit/catalogue-home-band.test.tsx tests/unit/catalogue-records.test.ts tests/unit/catalogue-evidence.test.ts tests/unit/item-route-availability.test.ts tests/unit/item-detail-route.test.ts
npx playwright test tests/e2e/catalogue-images.spec.ts tests/e2e/routes.spec.ts
```

**Commit:** `refactor: separate catalogue hub and home preview`

### Task 6：重构首页为最终六段

**Owner:** Agent A，依赖 Tasks 1、3、4、5

**Create:**

- `src/components/home/home-command-deck.tsx`
- `src/components/home/home-proven-demand.tsx`
- `src/components/home/home-live-intel.tsx`
- `src/components/home/home-tool-workbench.tsx`
- `src/components/home/home-library.tsx`
- `src/features/home/home-discovery-model.ts`
- `src/features/home/home-live-intel.ts`
- `tests/unit/home-six-section-model.test.tsx`
- `tests/unit/home-live-intel.test.ts`

**Modify:**

- `src/app/[locale]/page.tsx`
- `src/components/home/home-hero.tsx`
- `src/components/home/hero-search-box.tsx`
- `src/components/home/home-action-hub.tsx`
- `src/components/home/home-guide-hub.tsx`
- `src/components/layout/site-search-dialog.tsx`
- `src/lib/public-url.ts`
- `tests/unit/homepage-composition.test.ts`
- `tests/unit/home-action-hub.test.tsx`
- `tests/unit/home-guide-hub.test.tsx`
- `tests/unit/home-hero.test.tsx`
- `tests/unit/site-search-dialog-interactions.test.tsx`
- `tests/e2e/homepage-structure.spec.ts`
- `tests/e2e/growth-homepage.spec.ts`
- `tests/e2e/analytics.spec.ts`
- `tests/e2e/site-search.spec.ts`

**Steps:**

1. 先写失败测试，要求 `main > [data-home-section]` 的稳定顺序严格为：`command`、`proven-demand`、`live-intel`、`workbench`、`database`、`library`，数量恰好 6。
2. 写失败测试覆盖：首页不再 import/render 底部 `SiteSearch`，不在 page server component 构建完整搜索 index；Hero 搜索打开 dialog 并恢复焦点，不改变 scroll position。修复 dialog 的 `/api/search-index/...` 固定根路径，统一通过 basePath-aware public URL helper；失败状态不再链接已删除的 `#site-search-title`，提供 retry 和 Guides fallback。
3. command 段包含 H1、当前状态、搜索、Map、Artillery Calculator、Weapons Database、Server Status。去掉来源不明的 hot/trending pills。
4. proven-demand 段消费每语言 6 个保护资产和精确 `/items` 入口；display/native 广告放在任务入口之后。广告不是第七段。
5. 实现 `HomeLiveIntelEntry`：`id`、`href`、`kind`、`titleKey`、`verifiedAt`、`build`、`current`、`sourceClass`。Resolver 只从 `seasonOneChanges`、`NEWS_UPDATES`、`getServiceUpdates(locale)` 和对应 guide metadata 取有日期/来源的记录，按 `current`、`verifiedAt` 和稳定 ID 排序，最多 3 条。Season 1 历史值没有 current 证据时必须标“latest verified archive”，不能被函数名或排序自动称作当前 build；空数据时显示 status/patch hub 入口，不编造变化。
6. workbench 只显示最多 4 个代表工具和 `/tools` 总入口；完整九工具留在 Tools hub。
7. 在 Tool Registry 和 Catalogue/Guide 接口稳定后实现 `HomeDiscoveryModel`；database 只消费 B 提供的 Task 5 compact API，不编辑 Catalogue 组件。library 只显示三条 Guide Route、collections 总入口和 Videos/News/About 紧凑入口。
8. 当前未提交 `HomeGuideHub` 的三路线、九工具、六合集、三情报布局不直接上线；把能力迁移到对应 hub 后压缩首页。
9. 所有主要链接加稳定 `data-home-task` 和 `data-home-placement`；隐藏/不可见链接不能替代可点击验收。
10. 完成 Task 2 延后的六段 analytics E2E：代表入口单击一次、六段 sentinel 曝光一次、SPA page view 重置、旧 payload 字段仍存在。
11. E2E 在 390/768/1440/1920 验证：桌面 `main` ≤6 viewport、移动 `main` <10 viewport 且不高于 Task 0 冻结基线 +2%、`scrollWidth <= viewport + 1`；footer 和 fixed/sticky ads 不计入高度。

**Verify:**

```bash
npx vitest run tests/unit/home-six-section-model.test.tsx tests/unit/home-live-intel.test.ts tests/unit/homepage-composition.test.ts tests/unit/home-action-hub.test.tsx tests/unit/home-guide-hub.test.tsx tests/unit/home-hero.test.tsx tests/unit/catalogue-home-band.test.tsx tests/unit/site-search-dialog-interactions.test.tsx
npx playwright test tests/e2e/homepage-structure.spec.ts tests/e2e/growth-homepage.spec.ts tests/e2e/site-search.spec.ts tests/e2e/analytics.spec.ts
```

**Commit:** `feat: ship traffic-protected six-section homepage`

### Task 7：统一近期新增 UI 与全站 Hub 模板

**Owner:** Agent B，Integrator 审阅视觉；不得修改工具计算逻辑

**Create:**

- `src/components/ui/hub-header.tsx`
- `src/components/ui/section-heading.tsx`
- `src/components/ui/task-link.tsx`
- `src/components/tools/tool-page-header.tsx`
- `tests/unit/hub-ui-contract.test.tsx`

**Modify:**

- `src/app/globals.css`
- `src/components/layout/site-header.tsx`
- `src/components/layout/desktop-navigation.tsx`
- `src/components/layout/mobile-navigation-groups.tsx`
- `src/components/layout/site-footer.tsx`
- `src/app/[locale]/guides/page.tsx`
- `src/app/[locale]/items/page.tsx`
- `src/app/[locale]/news/page.tsx`
- `src/app/[locale]/videos/page.tsx`
- `src/app/[locale]/maps/page.tsx`
- `src/app/[locale]/tools/map/page.tsx`
- `src/app/[locale]/tools/artillery-calculator/page.tsx`
- `src/app/[locale]/tools/weapon-compare/page.tsx`
- `src/app/[locale]/tools/ammo-matcher/page.tsx`
- `src/app/[locale]/tools/loadout-budget/page.tsx`
- `src/app/[locale]/tools/cash-xp-calculator/page.tsx`
- `src/app/[locale]/tools/logistics-planner/page.tsx`
- `src/app/[locale]/tools/progression-route/page.tsx`
- `src/app/[locale]/tools/system-check/page.tsx`
- `tests/unit/tool-page-design.test.ts`
- `tests/e2e/navigation.spec.ts`
- `tests/e2e/responsive.spec.ts`
- `tests/e2e/visual.spec.ts`

**Steps:**

1. 写组件合同测试，统一 eyebrow、H1、description、primary/secondary actions、section spacing 和 focus style；共享 UI 只收可序列化数据和 slots。
2. 将近期新增的 home/hub/tool 标题、边框、按钮、标签、空状态迁移到同一视觉语言；保留 Oswald/Inter、颜色、证据 badge 和既有品牌识别。
3. 导航继续提供 Guides/Catalogue/Maps & Tools/News 等完整能力；二级链接必须直达真实路由，不生成 404。
4. 九个工具页只迁移 header/related navigation，不重写 calculator/map engine、URL state 或结果算法。
5. 逐个审阅 375/390/768/1440/1920 截图；不得用批量更新 snapshot 隐藏裁切、重叠、低对比或十几屏回归。
6. 键盘检查 navigation、search、dialog、hub links 和 tool forms；axe serious/critical 必须为 0。

**Verify:**

```bash
npx vitest run tests/unit/hub-ui-contract.test.tsx tests/unit/tool-page-design.test.ts tests/unit/visual-foundation.test.tsx tests/unit/navigation-data.test.ts
npx playwright test tests/e2e/navigation.spec.ts tests/e2e/responsive.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/visual.spec.ts
```

**Commit:** `refactor: align discovery hubs with site design system`

### Task 8：建立 24 个重点攻略族的差距合同

**Owner:** Agent C

**Create:**

- `tests/fixtures/priority-guide-families.ts`
- `tests/content/priority-guide-parity.test.ts`
- `docs/research/traffic-protected-content-gap-2026-10-05.md`
- `docs/research/competitive-content-scan-2026-10-05.md`

**Modify:**

- 不修改正文；本任务只建立审计合同。

**Steps:**

1. 重新扫描官方公告/Steam 更新、主要竞品攻略中心、当前 YouTube 创作者视频、Steam/Reddit 玩家问题及可用趋势工具，记录 URL、抓取日期、topic、source class、版本和可验证缺口。Similarweb/Ahrefs 等不可访问时明确标 unavailable，不补造搜索量、KD、CPC 或流量；不复制竞品内容。
2. 在 fixture 定义 24 个重点攻略族和 `wardogs-infantry-mode`，列出要求的任务答案、相关工具、证据字段和八语言路径。
3. 写失败测试覆盖：每族八语言文件存在、manifest 注册、至少一个直接答案、相关工具/目录链接可解析、FAQ/标题/描述不含未允许英语结构标题。Fixture 还必须编码高风险事实边界：WD-L014/018 仍在处理时不得称已修复；IR 停售不等于没收已有设备；Season 2 日期不等于精确重置时刻；Gold 固定汇率、隐藏成就条件和 Low-Level 门槛需要当前原始证据；地图/火炮内部一致不等于米制缩尺或 TOF 已实测；二维地图不得宣称 3D，普通玩家数页不得宣称个人 stat tracker。
4. 生成差距报告，逐个标记 `pass`、`copy-gap`、`fact-gap`、`localization-gap`、`render-gap`、`link-gap`、`competitor-workflow-gap`。测试在本任务结束时验证 fixture/manifest/report 结构并通过；报告中的产品缺口由 Task 9 转成具体失败断言。不把过去 24×8 批次自动标记为未完成。
5. 对最终渲染后的可见正文做摘要去重检查，确保新增文字不会被首段摘要逻辑吞掉。
6. 报告注明事实来源、验证日期和不能从数据推出的结论。

**Verify:**

```bash
npx vitest run tests/content/priority-guide-parity.test.ts tests/content/content-matrix.test.ts tests/content/localized-content-completeness.test.ts tests/content/manifest.test.ts
git diff --check -- tests/fixtures/priority-guide-families.ts tests/content/priority-guide-parity.test.ts docs/research/traffic-protected-content-gap-2026-10-05.md docs/research/competitive-content-scan-2026-10-05.md
```

**Commit:** `test: define priority guide content contract`

### Task 9：按差距升级重点攻略，不重写已通过页面

**Owner:** Agent C

**Modify:**

- `content/{locale}/guides/wardogs-{crash-fix,known-issues,patch-notes,server-status,community-servers-guide,controls,equipment-tools-guide}.mdx`
- `content/{locale}/guides/wardogs-{season-2,progression-wipes-guide,money-guide,achievements}.mdx`
- `content/{locale}/guides/wardogs-{beginner-guide,squad-guide,towers-guide,cargo-guide,best-weapons-loadouts,helicopter-guide,best-settings,mortar-guide,artillery-guide,map,fob-guide,ammo-reload-guide,oil-rig-guide}.mdx`
- 仅在差距报告要求时修改 `content/{locale}/guides/wardogs-infantry-mode.mdx`
- 相关内容测试文件

**Steps:**

1. 分三个独立提交处理运营 7 类、成长 4 类、玩家任务 13 类。
2. 每类先把差距报告条目变成失败断言，再修改对应 MDX；通过页面不做无意义改写。
3. 保留 URL、主要查询主题、有效标题承诺、已确认操作步骤和来源。新长尾答案合并到最相关现有页面，不按词造页。
4. 页面有实质事实或答案变化才更新 `updatedAt`；机械格式或翻译修正不伪造新鲜日期。
5. 每种语言逐页检查首个直接答案、操作步骤、FAQ、来源、日期、工具 CTA 和 rendered output。
6. 单独检查 `zh-cn`/`zh-tw` 用词、德语/俄语/葡语/波兰语/日语自然性；允许保留品牌、型号、错误码和官方菜单名。
7. 每个子批完成后跑对应内容测试和全内容 validate，避免最后一次性处理几百个失败。

**Verify per batch:**

```bash
npx vitest run tests/content/priority-guide-parity.test.ts tests/content/localized-content-completeness.test.ts tests/content/top-guides-quality.test.ts tests/content/player-demand-guides.test.ts tests/content/search-growth-content.test.ts tests/content/chinese-publishing-quality.test.ts
npm run content:validate
```

**Commits:**

- `content: close live operations guide gaps`
- `content: close progression and season guide gaps`
- `content: close player task guide gaps`

### Task 10：补齐共享 UI、图鉴和工具的真本地化

**Owner:** Agent C

**Modify:**

- `messages/{en,ru,de,pt-br,ja,zh-cn,zh-tw,pl}.json`
- `src/features/catalogue/catalogue-localization.ts`
- `src/features/catalogue/catalogue-change-localization.ts`
- `src/features/items/item-localization.ts`
- `src/features/items/item-prose.pl.ts`
- `src/features/items/item-prose.zh-tw.ts`
- `src/features/maps/interactive-map-page-copy.ts`
- `src/features/maps/map-measurement-copy.ts`
- `src/features/maps/map-viewer-copy.ts`
- `src/features/artillery/artillery-copy.ts`
- `src/features/tools/tool-copy.ts`
- `src/features/tools/workflow-copy.ts`
- `src/features/tools/equipment-compatibility-copy.ts`
- `tests/unit/localized-shared-content.test.ts`
- `tests/unit/full-locale-prose.test.ts`
- `tests/content/chinese-publishing-quality.test.ts`

**Steps:**

1. Agent A/B 先提交所需 message key 清单，Agent C 一次性维护八语言文件，避免并发冲突。
2. 写失败测试覆盖首页六段、三类 hub、工具 header/result/error/empty state、图鉴 summary/description/source/evidence/date 的八语言非空和语义 parity。
3. 对 `zh-tw` 增加正体和本地术语检查；不接受只经过 OpenCC 字形转换的段落。
4. 对 item detail 的可索引 locale 逐字段检查，不因英语 fallback 让测试误过。
5. 手工抽审每语言至少：首页、Guides hub、Tools hub、Items hub、一个攻略、一个 item、一个工具流程。

**Verify:**

```bash
npx vitest run tests/unit/messages.test.ts tests/unit/i18n.test.ts tests/unit/localized-shared-content.test.ts tests/unit/full-locale-prose.test.ts tests/unit/evidence-localization-render.test.tsx tests/content/chinese-publishing-quality.test.ts tests/content/german-content.test.ts tests/content/portuguese-content.test.ts tests/content/russian-content.test.ts
```

**Commit:** `content: complete localized discovery and tool copy`

### Task 11：完成 Guide ↔ Catalogue ↔ Tool 内链闭环

**Owner:** Agent B；内容 labels 由 Agent C 提供

**Create:**

- `src/components/tools/tool-related-guides.tsx`
- `tests/unit/discovery-link-graph.test.ts`
- `tests/e2e/discovery-journey.spec.ts`

**Modify:**

- `src/features/guides/guide-task-data.ts`
- `src/components/guides/guide-task-panel.tsx`
- `src/app/[locale]/items/[type]/[slug]/page.tsx`
- `src/app/[locale]/tools/map/page.tsx`
- `src/app/[locale]/tools/artillery-calculator/page.tsx`
- `src/app/[locale]/tools/weapon-compare/page.tsx`
- `src/app/[locale]/tools/ammo-matcher/page.tsx`
- `src/app/[locale]/tools/loadout-budget/page.tsx`
- `src/app/[locale]/tools/cash-xp-calculator/page.tsx`
- `src/app/[locale]/tools/logistics-planner/page.tsx`
- `src/app/[locale]/tools/progression-route/page.tsx`
- `src/app/[locale]/tools/system-check/page.tsx`
- `src/features/guides/related.ts`

**Steps:**

1. 先写图合同测试：Spec 中六个任务族都具备 guide → catalogue/tool 和 tool/item → guide 返回边；所有目标经过 locale route resolver 后可用。
2. 补齐 artillery 等未进入现有 taskSlugs 的真实任务映射，不给无关页面强塞图鉴链接。
3. item detail 继续用本 locale related guides；工具页通过 registry 显示 related guides 和适用 catalogue 入口。
4. 工具结果区只在有明确关系时提供下一步链接，不修改计算结果。
5. Playwright 走完武器、物流、地图/火炮、设置/崩溃四条代表路径，确认 locale、query state 和返回路径。

**Verify:**

```bash
npx vitest run tests/unit/discovery-link-graph.test.ts tests/unit/guide-task-body.test.ts tests/unit/guide-task-panel.test.tsx tests/unit/related-guides.test.ts tests/unit/item-route-availability.test.ts
npx playwright test tests/e2e/discovery-journey.spec.ts tests/e2e/tools-workflow.spec.ts tests/e2e/interactive-map.spec.ts
```

**Commit:** `feat: connect guide catalogue and tool journeys`

### Task 12：锁定 redirects、canonical、hreflang、schema 和 sitemap

**Owner:** Agent D

**Create:**

- `tests/e2e/release-route-contract.spec.ts`
- `tests/fixtures/route-contract.ts`

**Modify:**

- `src/lib/metadata.ts`
- `src/lib/structured-data.ts`
- `src/app/sitemap.ts`
- `src/i18n/legacy-paths.ts`
- `src/proxy.ts`（仅当测试证明 redirect/proxy 有缺口）
- `tests/unit/metadata.test.ts`
- `tests/unit/sitemap.test.ts`
- `tests/unit/structured-data.test.ts`
- `tests/unit/legacy-paths.test.ts`
- `tests/unit/proxy.test.ts`
- `tests/e2e/routes.spec.ts`
- `tests/e2e/production-health.spec.ts`

**Steps:**

1. 从 `config/traffic-protected-routes.json` 生成 E2E cases；先让新合同测试在 `/tools` 和完整保护集上失败。
2. 验证发布前 200 URL 仍 200；批准 308 到相关 200；known missing 为 clean 404 + noindex，无 canonical/hreflang HTTP Link 泄漏。全量 sitemap/内部链接请求池固定 6 并发、URL 去重、只对传输错误或 5xx 重试一次、收集全部失败后统一报告，suite timeout 10 分钟。
3. 每个 indexable 页面 H1 恰好一个、title/description 非空、canonical 自指。Hub/Guide 等全 locale 页面验证八语言 hreflang 对称；item detail 只验证其实际 `indexLocales` 集合和 `x-default`，不得要求不可索引 locale 返回 200。
4. 新 `/tools` 进入 sitemap，lastModified 来自真实 registry/content 证据；不机械刷新全站日期。
5. 首页、Guides、Catalogue、Tools JSON-LD 主实体 URL 与 canonical 一致。删除可见 FAQ 时同步删除 schema。
6. Vercel/Next Server 环境验证真实 HTTP 308、query 保留、无循环和无跨域；hash 不会随 HTTP 请求发送，用真实浏览器导航单独验证客户端 hash 保留。Pages static export 不要求 proxy/HTTP 308，只验证导出页面、basePath 链接和明确的静态 fallback 行为。直接 canonical URL 零跳转。
7. 将 `production-health.spec.ts` 的真实 production tag/player/第三方检查标记为 `@live`；纯路由/DOM合同可以标 `@local` 或保持无标签。默认本地 Playwright 使用 `--grep-invert @live`，确保 `routes.spec.ts` 和 `release-route-contract.spec.ts` 不会因没有 `@local` 标签而被静默跳过。

**Verify:**

```bash
npx vitest run tests/unit/metadata.test.ts tests/unit/sitemap.test.ts tests/unit/structured-data.test.ts tests/unit/legacy-paths.test.ts tests/unit/proxy.test.ts tests/unit/item-metadata.test.ts tests/unit/item-structured-data.test.ts
npx playwright test tests/e2e/release-route-contract.spec.ts tests/e2e/routes.spec.ts tests/e2e/production-health.spec.ts --grep-invert @live
```

`@live` 只在 Task 19 部署目标 revision 后运行，不能拿尚未部署的旧生产验证新路由。

**Commit:** `fix: enforce traffic-safe seo route contract`

### Task 13：全量复核视频结构化数据和视频索引

**Owner:** Agent D

**Modify only if a test fails:**

- `src/features/videos/video-structured-data.ts`
- `src/app/video-sitemap.xml/route.ts`
- `src/features/videos/video-library.ts`
- `src/features/videos/video-candidates.ts`
- `src/features/videos/video-candidate-evidence.ts`
- `src/features/videos/video-articles.pl.ts`
- `src/features/videos/video-articles.zh-tw.ts`
- `tests/unit/video-structured-data.test.ts`
- `tests/unit/video-sitemap.test.ts`
- `tests/unit/video-start-time.test.ts`
- `tests/content/video-key-moment-boundaries.test.ts`

**Steps:**

1. 把单例测试扩展为遍历所有输出视频：name、description、uploadDate、thumbnail、embed、canonical 均有效。
2. 对每个 `hasPart` 验证 `startOffset < endOffset`、标题非空、对应视频证据存在；未知 endOffset 不输出 Clip。
3. 浏览器验证 `?t=` 或播放器 start 参数恢复正确起点。
4. 视频 sitemap 与页面 canonical、Article/VideoObject 主实体一致。
5. 若现有实现全部通过，只提交加强后的测试与验证记录；不为了制造 diff 改逻辑。

**Verify:**

```bash
npx vitest run tests/unit/video-structured-data.test.ts tests/unit/video-sitemap.test.ts tests/unit/video-start-time.test.ts tests/content/video-key-moment-boundaries.test.ts
npx playwright test tests/e2e/current-video-grid.spec.ts
```

**Commit:** `test: verify all video indexing contracts`（有实现修复时改为 `fix:`）

### Task 14：冻结广告库存并验证收益位置

**Owner:** Agent D；首页 placement 由 Agent A 实现

**Create:**

- `tests/fixtures/ad-inventory-contract.ts`

**Modify:**

- `tests/unit/adsterra-page-inventory.test.ts`
- `tests/unit/adsterra-placement.test.ts`
- `tests/unit/adsterra-runtime.test.ts`
- `tests/unit/adsterra-monetization.test.ts`
- `tests/e2e/adsterra-inventory.spec.ts`
- `tests/e2e/adsterra-sandbox.spec.ts`
- `src/features/ads/ad-policy.ts`（仅当合同暴露真实配置错误）

**Steps:**

1. 根据当前启用策略冻结 `page template × viewport × placement × format × zone` multiset；Smartlink/Popunder/Social Bar 标记 disabled，不要求恢复。
2. 首页 rectangle/native 必须在 `proven-demand` 内保留，slot 数量与改版前相同；全局 sticky/rails 不受首页组件卸载影响。
3. E2E 检查广告容器不遮挡搜索、任务按钮、导航、正文或关闭按钮；route change 不重复 script/container。
4. 固定第三方素材 mock 做布局测试；生产 smoke 只验证容器、脚本策略和 contained behavior，不把 fill 当成功条件。
5. 明确 `ad_status` 与 Adsterra impression/revenue 的口径差异。

**Verify:**

```bash
npx vitest run tests/unit/adsterra-page-inventory.test.ts tests/unit/adsterra-placement.test.ts tests/unit/adsterra-runtime.test.ts tests/unit/adsterra-monetization.test.ts tests/content/adsterra-safety-disable.test.tsx
npx playwright test tests/e2e/adsterra-inventory.spec.ts tests/e2e/adsterra-sandbox.spec.ts
```

**Commit:** `test: protect enabled advertising inventory`

### Task 15：增加 production-build E2E 并补强 CI

**Owner:** Agent D

**Create:**

- `tests/production-local.playwright.config.ts`

**Modify:**

- `package.json`
- `.github/workflows/deploy-pages.yml`
- `scripts/build-pages.mjs`
- `tests/production.playwright.config.ts`
- `playwright.pages.config.ts`
- `tests/pages-e2e/pages-export.spec.ts`
- `tests/unit/pages-deployment-contract.test.ts`

**Steps:**

1. 新增 `test:e2e:build`：复用已经生成的 `.next`，以 `next start` 在独立端口 3100 启动 production build，`reuseExistingServer: false`；不得把 dev E2E 当成生产验收，也不得连接仍在 3000 端口的 dev server。
2. Pages export 测试从当前 6 语言扩展为 8 语言，覆盖 `/tools`、六段首页、protected routes，以及 `NEXT_PUBLIC_BASE_PATH=/wardogs` 的非空 basePath 搜索流程。断言 search dialog 请求无尾斜杠的 `/wardogs/api/search-index/<locale>` 并成功返回，不只测试空 basePath；Pages 页面路由可保留尾斜杠，但 API export/client contract 不得添加尾斜杠。
3. production config 纳入 `release-route-contract`、首页主要入口、广告 inventory 轻量 smoke；继续单 worker 避免生产噪音。
4. GitHub Pages workflow 在 PR/push 上作为辅助 export 验证：运行 lint、typecheck、content tests、Vitest、关键 E2E 和 `build:pages` smoke。Pages 环境显式设置 `WARDOGSWIKI_RELEASE_SHA: ${{ github.sha }}`，export 测试断言 `/api/revision` 是该 40 位 SHA；常规 Vercel 使用 `VERCEL_GIT_COMMIT_SHA`。对总耗时过高的浏览器矩阵拆 job/cache，不删除闸门。
5. 修改 `build-pages.mjs`：默认不写 `out/CNAME`。把现有 workflow 改成 PR/push 的 verify-only artifact job，移除自动 `deploy-pages` 和 `notify-indexnow` jobs；如以后需要人工 fallback，必须另建带明确输入的 workflow，目标只能是 `https://blackdcp.github.io/wardogs/` 与 basePath `/wardogs`。辅助流水线不得声明 `www.wardogswiki.com`、不得发送 IndexNow。自动生产部署和线上 revision 检查只针对 Vercel/Cloudflare。
6. Vercel deploy 后新增线上检查 job，检查 revision、protected routes、canonical/sitemap 和首页关键交互；即时技术合同通过后才运行 IndexNow。IndexNow 失败记录为待重试状态，不把 `continue-on-error` 当成索引成功。

**Verify:**

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e:build
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/wardogs NEXT_PUBLIC_SITE_URL=https://blackdcp.github.io/wardogs WARDOGSWIKI_RELEASE_SHA=0000000000000000000000000000000000000001 npm run build:pages
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/wardogs NEXT_PUBLIC_SITE_URL=https://blackdcp.github.io/wardogs WARDOGSWIKI_RELEASE_SHA=0000000000000000000000000000000000000001 npm run test:pages:built
npx vitest run tests/unit/pages-deployment-contract.test.ts
```

**Commit:** `ci: gate deploy on production and pages contracts`

### Task 16：把生产 URL 合同接入 release/IndexNow

**Owner:** Agent D

**Create:**

- `docs/operations/traffic-protected-release-runbook.md`

**Modify:**

- `scripts/deploy-production.mjs`
- `scripts/submit-indexnow.mjs`
- `tests/unit/production-smoke.test.ts`
- `tests/unit/indexnow.test.ts`

**Steps:**

1. 先写失败测试：release smoke 读取完整保护合同，而不是固定 16 个页面；旧 URL 新 404、hreflang 目标 404、启用广告位缺失、关键入口缺失、revision 错误均失败。生产请求池与 Task 12 共用 6 并发、去重、传输/5xx 单次重试、失败全集报告和 10 分钟总超时。
2. `release:prepare` 固定上一 production SHA，确认线上 revision、保存旧 sitemap 和保护 URL snapshot；工作树非 clean 时继续拒绝发布。
3. `release:finalize` 先运行完整生产合同，再运行 IndexNow；任何硬失败保留 snapshot，禁止提交 IndexNow。
4. 真实 404 继续验证 status/noindex/no canonical；旧 URL redirect 按配置验证相关目标。
5. Runbook 明确 Vercel/Cloudflare 是生产、Pages 是无 CNAME/无 IndexNow 的辅助 export，记录环境变量、artifact、回滚 SHA、IndexNow retry 和紧急回滚步骤。

**Verify:**

```bash
npx vitest run tests/unit/production-smoke.test.ts tests/unit/indexnow.test.ts tests/unit/revision-route.test.ts
npx playwright test --config tests/production.playwright.config.ts --list
```

**Commit:** `feat: gate index submission on protected routes`

### Task 17：完整功能、视觉、性能和可访问性验收

**Owner:** Integrator，四个 Agent 交叉复核

**Modify:**

- `tests/e2e/homepage-structure.spec.ts`
- `tests/e2e/responsive.spec.ts`
- `tests/e2e/accessibility.spec.ts`
- `tests/e2e/visual.spec.ts`
- `tests/e2e/visual.spec.ts-snapshots/*`（只接受人工确认后的必要变化）

**Steps:**

1. Agent A 审 B 的 hubs/导航，Agent B 审 A 的首页/analytics，Agent C 审八语言渲染，Agent D 审路由/SEO/广告/发布。
2. 使用 Task 0 在改版前冻结的字体、ad mock、locale、viewport、`main` 高度和截图作比较；验证 390/768/1440/1920。只能批准新视觉 snapshot，不能用改版后高度覆盖原始基线。
3. 对首页、Guides、Tools、Items、一个 guide、一个 item、九个工具关键流程执行桌面和移动检查。
4. 检查横向溢出、focus、dialog close/restore、长语言 label、sticky ads、CLS 敏感区域、键盘与 axe。
5. 所有视觉 snapshot 逐张审阅；不得使用无差别 `--update-snapshots`。

**Verify integration:**

```bash
npm run content:validate
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run test:e2e:build
npm run links:check
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/wardogs NEXT_PUBLIC_SITE_URL=https://blackdcp.github.io/wardogs WARDOGSWIKI_RELEASE_SHA=0000000000000000000000000000000000000001 npm run build:pages
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/wardogs NEXT_PUBLIC_SITE_URL=https://blackdcp.github.io/wardogs WARDOGSWIKI_RELEASE_SHA=0000000000000000000000000000000000000001 npm run test:pages:built
npm run test:pages
```

Integrator 必须等待 `npm run test:e2e` 的 dev webServer 完全退出，再运行 production build；build 完成后才启动端口 3100 的 `test:e2e:build`。两套测试不得共享运行中的 server、端口或被 dev 写入中的 `.next`。

**Commit:** `test: complete ultimate upgrade acceptance coverage`

### Task 18：在发布前删除无生产引用的旧首页组件并做最终审计

**Owner:** Integrator，必须在 Tasks 0–17 通过后、Task 19 创建 release checkout 前执行

**Delete only after `rg` proves no production imports:**

- `src/components/home/start-here.tsx`
- `src/components/home/priority-guides.tsx`
- `src/components/home/current-build-changes.tsx`
- `src/components/home/home-discovery-compact.tsx`
- `src/components/home/home-editorial-briefing.tsx`
- `src/components/home/video-intelligence.tsx`
- `src/components/home/beginner-tips.tsx`
- `src/components/home/about-game.tsx`
- `src/components/home/category-grid.tsx`
- `src/components/home/home-faq.tsx`
- `src/components/home/final-cta.tsx`
- `src/components/home/official-media.tsx`
- 最终六段未再使用的 `home-action-hub.tsx`、`home-guide-hub.tsx`、`site-search.tsx`

**Modify:**

- 删除只为旧实现存在的过期 mock/源码字符串测试，例如 `tests/unit/guides-metadata.test.ts` 中旧 `priority-guides` mock。
- 保留内容合同、流量合同、事件合同和用户行为测试，不以“组件不再 import”为理由删掉能力测试。

**Steps:**

1. `rg` 确认每个候选文件无生产 import、无动态引用、无仍需导出的数据。
2. 删除文件前跑全量测试并保存基线；分一批删除，立即重跑 typecheck/test/build。
3. 审查最终 diff：没有 analytics 原始数据、下载资产、无关脚本或用户未跟踪文件。
4. 使用 `superpowers:requesting-code-review` 做最终代码审阅，再用 `superpowers:verification-before-completion` 重跑 Task 17 完整验收。通过后的 commit 才是 Task 19 的 release candidate；day 14/28 监控不阻塞清理。

**Verify:**

```bash
rg -n "start-here|priority-guides|current-build-changes|home-discovery-compact|home-editorial-briefing|video-intelligence|beginner-tips|about-game|category-grid|home-faq|final-cta|official-media" src tests
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e:build
git diff --check
git status --short
```

**Commit:** `refactor: remove superseded homepage implementations`

### Task 19：建立上线数据基线、发布和回滚监控

**Owner:** Integrator + Agent D

**Requires:** Task 18 清理和最终候选验收已经完成；发布从最终 commit 创建独立 clean release checkout。

**Create locally, do not commit raw exports:**

- `.tmp/traffic-baseline/<release-sha>/ga4/`
- `.tmp/traffic-baseline/<release-sha>/gsc/`
- `.tmp/traffic-baseline/<release-sha>/bing-search/`
- `.tmp/traffic-baseline/<release-sha>/bing-ai/`
- `.tmp/traffic-baseline/<release-sha>/adsterra/`
- `.tmp/traffic-baseline/<release-sha>/baseline-manifest.json`

**Modify:**

- `docs/operations/traffic-protected-release-runbook.md`

**Steps:**

1. 上线前分别导出 GA Landing page、GA Pages and screens、GSC Pages/Queries、Bing Search、Bing AI、Adsterra 的最近 28 个完整日、最近 7 个完整日和前一个可比 7 日；记录 UTC/后台时区、完整日期、每个发布批次 SHA、locale/page/country/device/source 维度、hostname/environment、异常 direct/`(not set)` 和广告策略。
2. GA 核实 `home_task_click`、`home_section_view`、`discovery_click` 参数及后台自定义维度已注册；测试流量不发送 production hit。任务 CTR 同时保留 `unique task-click sessions / unique section-view sessions` 与 fallback `unique task-click sessions / homepage landing sessions` 两个清楚命名的指标，不能混用。
3. GSC/Bing 建立 protected URL/query baseline；Bing AI 无独立数据时标记 unavailable，不填 0。低于统计阈值的保护词仍进入人工逐项清单。
4. Adsterra 按 zone/format/country/device 记录 impression、CPM、revenue。只有能按同一 UTC 日期、production hostname、包含该 slot 的页面集合和 zone→template 映射对齐时才计算每千合格 PV 收入；排除 preview/test/internal traffic，共享 zone 不能可靠分摊时标 unavailable。GA revenue 不替代广告收益。
5. 从最终 release commit 创建 clean checkout，运行 `INDEXNOW_BASE_SHA=<previous-production-sha> npm run release:prepare`，确认 snapshot 和上一线上 revision。CI/release hardening 已在 Tasks 15–16 完成并通过，不能最后才部署闸门。
6. 默认执行一次协调后的 Vercel production deploy，独立 commits 保持可选择回滚。若运营决定分多次 deploy，每批都必须使用新的上一 production SHA 单独执行 prepare → deploy → immediate contract → finalize，不能跨批复用第一次 snapshot。
7. 部署完成即运行 `npm run test:e2e:production` 与 0 分钟技术合同；通过后立即 `release:finalize` 和 IndexNow。15 分钟、1 小时、24 小时是持续监控点，不阻塞首次 IndexNow；任一硬失败立即回滚并按回滚后的 sitemap 提交差异。
8. 监控 day 1/3 的 GA/广告技术信号。Day 7 先检查 GSC/Bing 数据完整性和重新抓取；只有取得该批上线后首个完整 7 日窗口才做效果比较，延迟/缺失标 unavailable。Day 14/28 继续趋势复核；这些后续观察有责任人和记录，但不阻塞工程交付完成。
9. 技术硬失败立即回滚上一 artifact；数据下降先按 locale/page/device/source 定位，确认因果后只回滚对应批次。

**Release evidence required:**

- 上一 production SHA、当前 release SHA、部署 artifact ID。
- 完整测试输出和 production contract 输出。
- protected routes diff、新增/移除 sitemap URL diff。
- 六段首页与三 hub 的桌面/移动截图。
- 广告 inventory diff。
- GA/GSC/Bing/Bing AI/Adsterra baseline manifest 与 day 1/7/14 检查记录。

**No commit for raw exports.** Runbook 更新单独提交：`docs: add traffic-protected release runbook`

## Final Acceptance Checklist

- [x] 保护清单覆盖 live sitemap、内部链接、GA/GSC/Bing/Bing AI 种子资产；旧 200 URL 新增 404 为 0。
- [x] 首页恰好六段，1440/1920 主内容 ≤6 viewport，390 移动端 <10 viewport 且不高于批准基线 +2%。
- [x] 搜索只打开 dialog，不自动锚点；键盘和焦点恢复正常。
- [x] `/ja/items` 和所有 locale protected-demand 入口可见、可点击、200、可测。
- [x] Guides、Catalogue、Tools 三个中心完整承接从首页移出的路线、目录和工具。
- [x] `home_task_click`、`home_section_view`、`discovery_click` taxonomy 和本地 E2E 合同稳定。
- [ ] 在最终候选发布前确认 GA 后台自定义维度注册。
- [x] 24 个重点攻略族完成差距修复；八语言 UI、MDX、item/tool copy 通过自动检查和逐语言抽审。
- [x] Guide ↔ Catalogue ↔ Tool 任务闭环通过代表性 E2E。
- [x] canonical、hreflang、schema、sitemap、video structured data 和 legacy redirects 通过本地完整合同。
- [x] 当前启用广告 slot 数量不减少，移动端无遮挡，Smartlink/Popunder/Social Bar 保持关闭。
- [x] content 431、Vitest 1,532、lint、typecheck、production build（1,355 routes）、dev E2E 184、production-local E2E 23、visual 22×2、Pages export E2E 8 和 links 139 全通过。
- [x] 唯一生产承载链、release prepare/finalize、IndexNow、上一 artifact 和回滚步骤已有实现、测试和 runbook。
- [ ] 最终 candidate SHA 确定并部署后，执行 production push、`test:e2e:production`、`release:finalize` 和 IndexNow；不得用当前旧 production revision 代替候选验收。
- [ ] 随最终候选完成 GA/GSC/Bing/Bing AI/Adsterra 上线基线，并按既定责任执行 day 1/7/14/28 监控。

## Progress

- 2026-10-05：Tasks 0–18 的实现、旧首页清理、交叉审阅和本地最终验收完成。新证据为：content 431 passed；unit 1,532 passed；full dev E2E 184 passed；production-local E2E 23 passed；visual 22 tests 连续两轮通过；Pages export E2E 8 passed；production build 生成 1,355 routes；links 139 passed。Pages artifact 已确认无 `CNAME`，API export/client contract 使用无尾斜杠的 `/api/revision` 与 `/api/search-index/<locale>`。
- 2026-10-05：Task 19 进入 release-ready 状态。尚未分配最终 candidate SHA，也未 production push；production E2E、`release:finalize` 与 IndexNow 必须等待该 SHA 部署且 `/api/revision` 精确匹配后执行。
