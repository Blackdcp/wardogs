# WARDOGS 流量保护型全站究极升级设计

## 1. 目标

这次工程把 WARDOGS Wiki 从“首页不断叠加新模块”升级成一个有明确分工的游戏攻略产品：

- 首页负责判断玩家意图，并把用户送到正确的攻略、图鉴或工具。
- Guides、Catalogue、Tools 三个主题中心负责承接完整内容，不再把整站目录塞回首页。
- GA4、Google Search Console、Bing Search 与 Bing AI 已证明有价值的 URL、主题和答案受到明确保护。
- 八种正式语言拥有同等的路由、功能和语义完整性；本地化以玩家能否完成任务为标准，而不是以“文件存在”或“字数达标”为标准。
- 当前启用的广告库存不减少，同时避免广告遮挡主要任务、造成布局跳动或破坏移动端操作。
- canonical、hreflang、schema、sitemap、视频结构化数据和旧链接兼容在发布前自动验证。

“究极形态”不是增加最多的页面或组件。最终标准是：**保护现有流量入口，缩短用户路径，补齐搜索缺口，增强工具转化，保留广告收益，并让每次发布都可测、可监控、可回滚。**

## 2. 当前基线与判断边界

### 2.1 已知产品基线

- 当前首页由 Hero、LiveBetaBanner、ActionHub、GuideHub、Catalogue、底部 Search 组成。语义块数量看似有限，但未提交版本继续向 GuideHub 增加路线、工具、合集和情报，页面会重新膨胀。
- 首页底部 Search 会把完整搜索索引作为 Client Component 属性传入；Hero 已经可以打开按需加载的搜索对话框，二者功能重复。
- `/[locale]/guides` 和 `/[locale]/items` 已存在；九个工具详情页存在，但 `/[locale]/tools` 中心页不存在。
- `getHomePriorityGuides()` 已包含八语言优先规则，但当前首页展示模型没有把它作为唯一的流量保护来源。
- 日语 `/ja/items` 是已验证的重要入口，必须作为精确 URL 保留；不能只留下若干 `/ja/items/*` 分类链接。
- 当前已启用广告包括页面 display/native 库存以及全局移动 sticky、左右 rail 等策略；Smartlink、Popunder、Social Bar 的关闭状态不属于“必须恢复的库存”。

### 2.2 数据使用规则

GA4、GSC、Bing Search、Bing AI 与 Adsterra 使用不同口径，不能把数值相加、相减或互相代替：

- GA4 用于页面使用、入口点击、任务完成和站内路径。
- GSC 用于 Google 自然搜索的查询、页面、国家、设备、点击、曝光、CTR 和排名。
- Bing Search 用于 Bing 的查询、页面、点击、曝光、CTR 和抓取状态。
- Bing AI citations、Google 生成式搜索曝光、GA 中的 AI referral 是三类不同数据。
- Adsterra 后台 impression、CPM、revenue 是收益口径；页面 DOM 的 `ad_status` 只说明脚本或创意状态，不能当作计费展示。

任何发布决策必须标注数据源、完整日期窗口、维度和样本量。旧研究数据用于确定风险和种子清单；发布硬基线必须在上线前重新导出最近 28 个完整日、最近 7 个完整日和前一个可比 7 日。

### 2.3 当前必须保护的种子资产

完整保护清单由上线前导出生成；下面是最低种子集合，不能因 UI 压缩而消失、改 slug 或失去内部入口：

- 日语：`/ja/items`、`/ja/items/weapons`、`wardogs-squad-guide`、`wardogs-towers-guide`、`wardogs-cargo-guide`、`wardogs-progression-wipes-guide`、`wardogs-mortar-guide`、`wardogs-best-settings`、`wardogs-best-weapons-loadouts`、`wardogs-helicopter-guide`、`wardogs-fob-guide`。
- 英语：`/en`、`/en/items/weapons`、`wardogs-cargo-guide`、`wardogs-crash-fix`、`wardogs-controls`、`wardogs-helicopter-guide`、`wardogs-best-settings`、`wardogs-patch-notes`、`wardogs-fob-guide`、`wardogs-mortar-guide`、`wardogs-oil-rig-guide`。
- 俄语：`wardogs-mortar-guide`、`wardogs-best-settings`、`wardogs-progression-wipes-guide`、`wardogs-crash-fix`、`wardogs-squad-guide`。
- 德语：`/de/items/weapons`、`wardogs-best-weapons-loadouts`、`wardogs-best-settings`、`wardogs-progression-wipes-guide`、`wardogs-crash-fix`。
- 简体中文、繁体中文、巴西葡萄牙语和波兰语：至少保留当前 `LOCALIZED_PRIORITY_SLUGS` 的六项，并用发布前 GSC/Bing 页面表补齐实际 Top landing pages。
- AI 引用资产：现有已核对记录直接证明英语 Beta、Playtest 和 Helicopter 有当前或历史引用，应保留 URL、实体消歧、状态日期、来源和事实边界。Crash、Controls、Cargo、FOB、Mortar、Patch Notes 等是待发布前 Bing AI Pages 导出复核的候选保护页；在导出确认前不得把候选写成已证明引用。

旧路径 `/ja/guides/wardogs-squad-invite` 不得作为 canonical 200 资产；原始数据对应的是 `/ja/guides/wardogs-squad-guide`。旧路径仍须作为 legacy 308 合同保留并指向正确 slug，不能因纠正报表路径而删除 redirect。

首页改造前的八语言六项优先攻略必须先冻结；下表是当前代码基线。替换其中任何一项都要给出数据证据和它在 database/library/hub 的同层承接位置，不能由组件内 `slice()` 或“最近更新”静默改变：

| 语言 | 六项基线（均省略 `wardogs-` 前缀） |
|---|---|
| en | infantry-mode、community-servers-guide、crash-fix、season-2、mortar-guide、artillery-guide |
| ja | infantry-mode、squad-guide、mortar-guide、towers-guide、best-weapons-loadouts、cargo-guide |
| ru | infantry-mode、crash-fix、mortar-guide、best-settings、progression-wipes-guide、squad-guide |
| de | infantry-mode、best-weapons-loadouts、best-settings、progression-wipes-guide、crash-fix、season-2 |
| zh-cn | infantry-mode、map、mortar-guide、equipment-tools-guide、crash-fix、season-2 |
| zh-tw | infantry-mode、map、mortar-guide、equipment-tools-guide、crash-fix、season-2 |
| pt-br | infantry-mode、beginner-guide、squad-guide、money-guide、best-settings、mortar-guide |
| pl | infantry-mode、progression-wipes-guide、crash-fix、ammo-reload-guide、community-servers-guide、season-2 |

## 3. 最终信息架构

### 3.1 首页固定为六段

首页只允许六个带稳定 `data-home-section` 的顶层内容段。广告容器、嵌套卡片和结构化数据不算额外段。

| 顺序 | 稳定 ID | 职责 | 核心内容 | 禁止重新塞入的内容 |
|---|---|---|---|---|
| 1 | `command` | 识别任务 | H1、当前状态、搜索、Interactive Map、Artillery Calculator、Weapons Database、Server Status | 原始热词胶囊、大段介绍、完整工具目录 |
| 2 | `proven-demand` | 承接已验证流量 | 当前语言 6 个保护攻略/任务入口、display/native 广告 | 按“最近更新”随机替换保护入口 |
| 3 | `live-intel` | 回答“现在发生什么” | 当前 build、patch/season/wipe/status、最多 3 个最近验证变化 | 无验证日期的新闻流、重复攻略合集 |
| 4 | `workbench` | 提供高价值工具 | 最多 4 个代表工具、任务说明、`/[locale]/tools` 总入口 | 九个工具的完整卡片墙 |
| 5 | `database` | 进入图鉴 | 每种语言的精确 `/items`、Weapons、Vehicles、少量已发布实体预览 | 首页复制完整分类页 |
| 6 | `library` | 进入长期内容库 | Guides 三条玩家路线、合集入口、Videos/News/About 的紧凑入口 | 把 64 篇攻略逐条列出 |

首页行为约束：

- Hero 搜索始终打开对话框，不滚动到页面尾部。
- 原来的“热词”不再以来源不明的 pills 呈现。被证明有需求的主题进入 `proven-demand`，带清楚的任务标签和目标 URL。
- 底部完整 `SiteSearch` 从首页组合中移除，搜索索引继续由对话框按需加载。
- 1440×900 和 1920×1080 下，首页顶层语义段必须小于或等于 6，主内容高度不得超过 6 个 viewport。
- 390×844 下，主内容高度不得超过批准基线，允许 2% 测量容差，并硬性小于 10 个 viewport；不得横向溢出。
- 首屏必须可操作地看到搜索和至少两个主要任务入口；键盘焦点、关闭搜索后的焦点恢复和移动端触控区域必须通过测试。

### 3.2 Guides 中心

`/[locale]/guides` 承接完整攻略库和三条玩家路线：

1. New Player Route：开始游戏、组队、经济、职业进度、常见问题。
2. Combat & Operations Route：武器、弹药、设置、载具、塔楼、地图、迫击炮和火炮。
3. Logistics & Live Route：Cargo、FOB、Oil Rig、物流工具、赛季、补丁、服务器状态。

`GuideCollection` 继续负责把每篇攻略恰好归入一个内容合集；`GuideRoute` 负责把攻略和工具串成任务流程。两者必须使用不同的数据类型和文件，避免再把展示位置数组塞进 collection 配置。

### 3.3 Catalogue 中心

`/[locale]/items` 是唯一的图鉴总入口：

- 保留全部类型和已发布实体，不改变 item URL 或现有证据模型。
- 首页只显示总入口、Weapons、Vehicles 和少量已发布预览。
- 预览实体必须满足 `published + detailHref + image + imageAlt`。
- gated item 继续由 `resolveItemRouteTarget` 决定回到本语言类别或英语详情；未知/不可用详情由详情路由的 `notFound()` 生成 clean 404。不得为了减少 404 强行开放无证据详情，也不得把 clean 404 责任错误塞进 resolver。

### 3.4 Tools 中心

新增 `/{locale}/tools`，由一个工具注册表驱动导航、首页、搜索和中心页。九个现有工具保持原 URL 和计算语义：

- map
- artillery-calculator
- weapon-compare
- ammo-matcher
- loadout-budget
- cash-xp-calculator
- logistics-planner
- progression-route
- system-check

工具中心按 Combat、Economy、Logistics、Progression、Fixes 分组。每个工具定义包含稳定 ID、href、翻译键、分析任务、搜索类型、相关攻略；不在多个组件里维护重复数组。

### 3.5 全站闭环

核心任务形成可往返的链接闭环：

| 玩家任务 | Guide | Catalogue | Tool | 结果返回 |
|---|---|---|---|---|
| 武器/弹药 | loadouts、ammo reload | weapons、ammo、attachments、gear | weapon compare、ammo matcher、loadout budget | 返回可用图鉴证据和操作攻略 |
| 金钱/装备 | beginner、money、equipment | loadouts、gear | budget、cash/XP | 返回报价读取和装备选择 |
| Cargo/FOB/Oil Rig | cargo、FOB、oil rig | vehicles、mechanics、相关装备 | logistics planner | 返回任务步骤和证据页 |
| 赛季/进度/成就 | season、progression、achievements | 有证据的解锁记录 | progression route | 返回重置保留矩阵和来源 |
| 地图/迫击炮/火炮 | map、infantry、mortar、artillery | mechanics、测距设备 | map ↔ artillery calculator | 返回观察修正和攻略说明 |
| 设置/崩溃 | settings、crash、requirements | 仅在相关时链接 | system check | 返回具体问题分支 |

## 4. 数据与代码契约

### 4.1 Discovery 类型

```ts
type HomeSection =
  | "command"
  | "proven-demand"
  | "live-intel"
  | "workbench"
  | "database"
  | "library";

type DiscoveryTask =
  | "search" | "map" | "calculator" | "weapons" | "vehicles"
  | "status" | "catalogue" | "guides" | "tools" | "videos"
  | "news" | "cargo" | "squad" | "towers" | "progression"
  | "mortar" | "fob" | "controls" | "helicopter" | "settings"
  | "pcFixes" | "season2" | "patchNotes" | "money" | "firstMatch"
  | "loadout" | "logistics" | "systemCheck" | "faq" | "about";

type LegacyHomePlacement =
  | "hero" | "action-hub" | "discovery" | "intel" | "catalogue"
  | "recovery" | "routes" | "tools" | "collections" | "tactical-hub"
  | "editorial-path" | "editorial-priority";

type DiscoveryDestination = {
  id: string;
  href: string; // 不含 locale 的 canonical destination
  labelKey: string;
  task: DiscoveryTask;
};
```

`DiscoveryTask` 是唯一 task 白名单。组件不能自行发明字符串；动态 slug 放在 `target_path`，不进入低基数 task 维度。现有 `firstMatch`、`pcFixes`、`faq` 与历史 placement 在迁移期间保留原值，不能重命名后仍声称历史兼容。新六段只发 `HomeSection` placement，旧值只供尚未迁移的组件和历史报表。

### 4.2 流量保护模型

```ts
type TrafficTier = "protected" | "growth" | "support";

type TrafficAsset = DiscoveryDestination & {
  kind: "guide" | "catalogue" | "tool" | "status" | "hub";
  locales: readonly Locale[] | "all";
  tier: TrafficTier;
  evidenceKeys: readonly string[];
};

type HomeDiscoveryModel = {
  command: readonly DiscoveryDestination[];
  protectedDemand: readonly TrafficAsset[]; // 每语言恰好 6 项
  liveIntel: readonly HomeLiveIntelEntry[];
  featuredTools: readonly ToolDefinition[]; // 最多 4 项
  database: readonly DiscoveryDestination[];
  library: readonly DiscoveryDestination[];
};

type HomeLiveIntelEntry = {
  id: string;
  href: string;
  kind: "status" | "patch" | "season" | "change";
  titleKey: string;
  verifiedAt: string;
  build: string;
  current: boolean;
  sourceClass: "official" | "live-client" | "creator-current" | "community-report";
};
```

客户端 bundle 只包含路由和选择结果，不包含 GA/GSC/Bing 的内部数值。数值、窗口和研究证据保存在内部研究文档与上线基线报告中。完整 `HomeDiscoveryModel` 在 Tool Registry、Guide Routes 和 Catalogue compact model 稳定后构建；类型层不能反向依赖尚未创建的工具注册表。

`liveIntel` 只从现有 `seasonOneChanges`、`NEWS_UPDATES`、`getServiceUpdates(locale)` 和 guide metadata 解析有日期、有来源的记录。Resolver 按 `current`、`verifiedAt`、稳定 ID 排序并最多返回 3 条。只有 `current: true` 的证据可以标成当前 build；Season 1 历史证据在没有当前证明时显示为 latest verified archive。没有合格记录时显示 status/patch hub 入口，不编造变化。

### 4.3 Tool 注册表

```ts
type ToolDefinition = {
  id: ToolId;
  href: `/tools/${string}`;
  labelKey: string;
  descriptionKey: string;
  task: DiscoveryTask;
  searchType: "tool" | "map";
  group: "combat" | "economy" | "logistics" | "progression" | "fixes";
  relatedGuideSlugs: readonly string[];
};
```

注册表是导航、Tools hub、首页 workbench 和搜索索引的共同来源。新增工具必须先进入注册表和契约测试。

### 4.4 Guide 路线

```ts
type GuideRouteKey = "new-player" | "combat-operations" | "logistics-live";

type GuideRouteDefinition = {
  key: GuideRouteKey;
  titleKey: string;
  descriptionKey: string;
  guideSlugs: readonly string[];
  toolIds: readonly ToolId[];
};
```

首页只显示三条路线的短入口；完整路线、攻略和工具显示在 Guides hub。

## 5. 分析事件契约

现有 `home_task_click` 保持兼容，不改名、不重解释历史值。原有 `link_url` 参数继续发送，新代码增加 locale-free `target_path`；迁移期间 LegacyHomePlacement 仍被接受，新首页完成后不再产生旧 placement。最终事件为：

| 事件 | 触发 | 必填参数 |
|---|---|---|
| `home_task_click` | 首页可见任务入口被点击 | `task`, `placement`, `locale`, `page_path`, `target_path` |
| `home_section_view` | 六段顶部 sentinel 首次进入视口中部区域，每段每次 page view 最多一次 | `section`, `locale`, `page_path` |
| `discovery_click` | Guides/Catalogue/Tools hub 的任务入口被点击 | `hub`, `task`, `locale`, `page_path`, `target_path` |
| 现有 search/tool/map/video/ad 事件 | 按各自现有触发条件 | 保持已有参数和隐私约束 |

新六段组件的 `placement` 只允许六个 `HomeSection` 值；迁移完成前，旧组件继续接受 `LegacyHomePlacement`，旧值留在历史报表中且不批量改写。一次点击只发一次基础事件；需要保留的分任务历史事件可继续发，但必须由测试证明不会重复。段曝光使用独立顶部 sentinel，触发区为 viewport 上边 25% 到下边 75%；这样即使段落高于两个 viewport 也能被记录。客户端同文档导航产生新的 page view 时重置六段去重集合；浏览器前进/后退恢复页面时按实际新 page view 事件同步重置。

GA 管理界面需要注册 `task`、`placement`、`section`、`target_path`、`hub` 自定义维度。代码完成不代表后台维度已可报表，发布清单必须单独验证。

原始搜索 query、地图坐标、工具配置、分享 URL 和自由文本不得发送到分析平台。

## 6. 内容与八语言标准

### 6.1 重点内容范围

现有 64 篇/语言、共 512 篇是基线，不把已经完成的 24×8 批次重新当成空白工作。先生成差距矩阵，只修改未达到标准的页面：

- 运营类 7 个：crash fix、known issues、patch notes、server status、community servers、controls、equipment tools。
- 成长类 4 个：season 2、progression/wipes、money、achievements。
- 玩家任务类 13 个：beginner、squad、towers、cargo、best weapons/loadouts、helicopter、best settings、mortar、artillery、map、FOB、ammo reload、oil rig。
- 新枢纽：infantry mode，继续作为 map → artillery/mortar 的任务入口。

每个页面升级时保留 URL、主要主题、已有效排名的标题意图、已确认步骤和来源。新增答案进入最相关的现有页面，不为每个长尾词机械建页。

### 6.2 真本地化验收

每个正式语言页面必须同时满足：

1. MDX 文件和 manifest 完整，loader 缺文件时不静默借英语正文。
2. Title、description、H1、首个直接答案、FAQ、表头、按钮、错误态、来源说明和日期为本地语言。
3. 玩家术语自然，操作顺序完整，标题承诺与正文答案一致。
4. 允许品牌、武器型号、错误码和官方菜单名称保持原文。
5. `zh-tw` 使用正体和当地用语，不以简体字形转换冒充本地化。
6. 页面可见正文通过摘要去重后仍包含新增答案，避免内容存在于文件但被渲染逻辑吞掉。
7. 所有本地链接实际可达；item 详情遵守 locale availability。
8. 语言信号、字符数和“与英文不同”只作为自动化最低条件，不能代替人工语言审阅。

## 7. SEO、路由与视频

### 7.1 路由保护

- 发布前冻结：当前 sitemap URL、全部内部 href、最近 28 日 GA/GSC top landing URLs、Bing top pages、历史 legacy paths。
- 发布后每个发布前 200 的 indexable URL 仍须 200；只有批准迁移可以 308 到语义等价页面后 200。
- 直接 canonical URL 不得额外跳转；Server redirect 保留 query、无循环、无跨域。Hash 不会发送到服务器，必须用真实浏览器导航单独验证客户端最终 URL 保留 hash。
- 既有真实缺失页继续返回 clean 404 + noindex，不重定向到首页。
- 对全语言页面，八语言 alternate 必须互相对称、目标 200、canonical 自指；item detail 只对其实际 `indexLocales` 集合验证对称 alternate。不可索引 locale 不输出错误的 canonical/hreflang。

### 7.2 元数据与结构化数据

- 新 `/tools` hub 加入 metadata、sitemap、search index 和 `CollectionPage`/`ItemList` 型 JSON-LD。
- 可见 FAQ 被删除时，对应 FAQ schema 同步删除。
- 日期来自证据或内容更新，不能为了“新鲜度”机械刷新全站日期。
- 首页、Guides、Catalogue、Tools 的 schema 主实体 URL 与 canonical 一致。

### 7.3 视频

- 所有输出的 `VideoObject` 必须有 name、description、uploadDate、thumbnailUrl 和 embedUrl。
- `hasPart`/`Clip` 仅在 startOffset、endOffset、标题和视频证据完整时输出；未知结束时间不编造。
- `?t=` 或等价参数必须能恢复播放器起点。
- 视频 sitemap、页面 canonical、Article/VideoObject 主实体和可见视频信息保持一致。

## 8. 广告与收益保护

- 首页继续保留当前启用的 rectangle/display 和 native 库存，放在 `proven-demand` 段的用户任务之后，保持较早曝光又不遮挡首屏搜索。
- 全局 mobile sticky、leaderboard、right rail 等当前启用策略保持不变。
- Smartlink、Popunder、Social Bar 继续遵守当前关闭策略；关闭格式不计入“库存减少”。
- 自动化按 `页面模板 × viewport × placement × format × zone` 冻结启用库存 multiset；改版后 slot 数量不得下降。
- 广告不得覆盖任务按钮、搜索、正文、导航或关闭按钮；route 切换不得重复注入。
- DOM `ad_status` 用于诊断 loaded/creative/visible，不用于替代 Adsterra impression、CPM 或 revenue。

## 9. 发布质量闸门

一个发布只有同时满足以下条件才可以进入生产：

1. 保护 URL 新增 404 为 0，批准 redirect 全部到相关 200 页面。
2. 八语言首页、Guides、Catalogue、Tools 的主要入口可见、可点击、目标 200、事件参数正确。
3. 首页严格六段；1440/1920 主内容不超过 6 viewport；390 移动端低于 10 viewport 且不超过批准基线。
4. 当前启用广告库存数量不减少，关键任务不被遮挡。
5. `content:validate`、全量 Vitest、lint、typecheck、Webpack production build、dev E2E、production-build E2E、Pages export smoke 全部通过。
6. canonical、hreflang、sitemap、schema、视频结构化数据全量契约通过。
7. 375/390/768/1440/1920 关键页面无横向溢出、严重 accessibility 问题或未经审阅的视觉快照变化。
8. Vercel/Cloudflare 是 `www.wardogswiki.com` 的唯一权威生产和 HTTP redirect/revision 来源。GitHub Pages 只做无 production CNAME、无 IndexNow 的辅助 static export/basePath 验证，不能与生产争夺 custom domain，也不能用静态 HTML 200 冒充 Next Server 308。
9. 删除首页底部预载索引后，Search dialog 的 index 请求必须经过 basePath-aware URL helper；空 basePath 和 `/wardogs` 非空 basePath 都通过 Pages export 交互测试。

## 10. 上线监控与回滚

### 10.1 立即回滚条件

上线后 0、15 分钟、1 小时、24 小时运行生产合同。出现以下任一情况，停止 IndexNow/后续发布并回到上一已验证 artifact：

- 任一保护 URL 新增 404/5xx。
- production revision 不匹配。
- 全站或保护页出现错误 noindex、canonical、hreflang 或 sitemap 丢失。
- 首页搜索、主要任务、工具关键流程不可用。
- 启用广告 slot 数量下降或遮挡主要内容。

### 10.2 数据警戒线

- GA：首页任务 CTR 定义为 `home_task_click` 唯一会话数 ÷ 对应 `home_section_view` 唯一会话数；没有可靠段曝光时退化为首页 landing sessions 并单独标注。Engagement 固定使用 GA engagement rate，不与平均互动时长混用。比较层为 locale × landing page × device × source/medium；基线窗和观察窗都需 sessions ≥200。相对同星期基线连续 2 个完整日下降 ≥20% 时进入原因诊断；这是运营警戒线，不是显著性或因果证明。确认由本批入口/布局导致时，只回滚对应批次。
- GSC：比较层为 query × page × country × device。统计警戒要求基线窗和部署后首个完整 7 日窗均 ≥1000 impressions，平均排名绝对变化 ≤0.5、impressions 变化在 ±10% 内而 CTR 下降 ≥20%。低于 1000 impressions 的已保护查询和 URL 继续进入人工清单，不能因不触发统计警戒而消失。总点击单独下降不触发自动回滚；20% 是运营阈值，不是因果证明。
- Bing Search：使用同 page/query × country × device 的两个完整 7 日窗口；两窗均 ≥1000 impressions 且 CTR/点击下降 ≥25% 时进入诊断。低样本保护资产仍逐项人工检查。25% 是运营阈值，不是显著性检验。
- Bing AI：上线前先建立可获得的引用 URL/topic 与 GA AI referral 基线；无数据时标记“不可用”，不能宣称为 0。14/28 日比较引用资产的可抓取和证据完整性。
- Adsterra：按 zone/format/country/device 比较完整日；同 zone ≥1000 impressions 时，CPM 或每千合格 PV 收入连续 2 日下降 ≥30%进入诊断。只有当 GA 与 Adsterra 可按同一 UTC 日期、production hostname、广告页面集合和 zone 映射对齐时才计算“每千合格 PV 收入”；合格 PV 定义为 production hostname 上包含该启用 slot 的页面 view，排除测试/preview/internal traffic，共享 zone 无法可靠分摊时标记 unavailable。30% 是运营阈值，不是因果证明；只有确认与本批布局或加载有关才回滚广告批。

搜索效果比较以数据完整性为前提：day 7 只检查 GSC/Bing 数据是否已覆盖部署后完整日期及优先 URL 是否重新抓取；取得部署后首个完整 7 日窗口后才做效果对比。数据延迟或缺失必须标记 unavailable，不能填 0。每个独立发布批次记录自己的 UTC 上线时间，不能只使用总 release SHA 的时间。

回滚单位分为：首页、Hubs、内容、SEO/路由、广告。每次发布保留上一 production SHA、静态导出 artifact、旧 sitemap 和基线报告；回滚后重新验证 revision、URL、canonical、库存和交互，再提交索引差异。

## 11. 完成定义

工程只有在以下结果全部实现时才算完成：

- 首页最终六段已上线，并且不是把原来的十几屏内容改成六个超大容器。
- Guides、Catalogue、Tools 三个中心承接从首页移出的完整能力。
- 高流量资产清单有代码化合同，保护 URL 零新增 404。
- `/ja/items` 和其他已验证精确入口可直接到达。
- 六段入口和三类 hub 的点击可在稳定 taxonomy 下分析。
- 24 个重点攻略族完成差距复核，未达标内容在八语言中补齐并通过人工抽审。
- 内链形成 Guide ↔ Catalogue ↔ Tool 的任务闭环。
- canonical、hreflang、schema、sitemap、视频数据和 IndexNow 发布链经过自动化验证。
- 当前启用广告库存不减少，收益监控已建立。
- 完整测试、两种构建模式、生产 URL 检查和上线监控 runbook 可由另一名工程师按文档独立执行。
