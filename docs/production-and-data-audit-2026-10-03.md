# WARDOGS 线上问题与近期数据检查

后续复测：2026 年 10 月 3 日已检查修复版本 `0f15413`，上一轮 7 项问题中 5 项通过、2 项部分通过。最新结果见文末「修复版本复测」；下方初次检查保留为历史基线。

检查日期：2026 年 10 月 3 日，北京时间。线上版本与本地 HEAD 一致，为 2b87d59e2959c5fc3a9d005576b6c1637558e92a。本次检查了生产 HTTP、浏览器交互、源码、现有测试，以及站主已登录的 GA4、Google Search Console、Bing Webmaster Tools 和 Adsterra 后台。未修改应用代码、后台配置或部署。

当前最需要处理的是射表与计算器矛盾、搜索结果打开后弹窗不关闭、重定向丢失参数，以及 10 月 1 日开始的广告单价异常。Google 流量损失集中在日本和部分具体查询；Bing 最近恢复了曝光与点击。没有发现抽样页面存在全站不可访问、robots 封禁或普遍 canonical 错误。

## 数据窗口与限制

| 数据源 | 本次窗口 | 对比窗口与限制 |
| --- | --- | --- |
| GA4 | 9 月 26 日至 10 月 2 日 | 对比 9 月 19 日至 25 日；按 GA 媒体资源日期，10 月 2 日及来源归因仍可能修订 |
| GSC 搜索效果 | 9 月 23 日至 29 日 | 对比 9 月 16 日至 22 日；所选最近 7 天实际截止 9 月 29 日 |
| GSC 索引 | 后台更新日期 9 月 21 日 | 不能用这些历史数字判断 10 月 3 日刚上线页面的索引状态 |
| Bing | 可见逐日数据截止 9 月 30 日 | 日期选择器可到 10 月 2 日，但图表没有 10 月 1 日与 2 日记录；不得当作完整同窗周比较 |
| Adsterra | 9 月 26 日至 10 月 2 日，UTC | 对比 9 月 19 日至 25 日；已限定 wardogswiki.com，所有广告位；前一窗口只返回 9 月 21 日至 25 日非零记录 |

GA 会话、GSC 搜索点击、Bing 点击和广告展示是不同指标，窗口也不同，不能相减推断漏报。Google 说明 GA4 数据处理可能需要 24 至 48 小时，近期数据和归因会调整。[GA4 数据时效官方说明](https://support.google.com/analytics/answer/11198161?hl=en)

## 已确认的问题

### P1 射表与弹道计算器给出矛盾参数

地图的 81mm 迫击炮参考表在 400m 显示 1225 mil、18 秒；L81 计算器在相同距离、零高差显示 550 mil、19.1 秒。地图把 1200m 标为最大有效距离，计算器则在超过 697m 时返回超出射程。直接执行两份实际数据模块，稳定得到这些结果。

来源：[地图射表](/Users/black/Documents/Wardogs/src/features/maps/map-tactical-data.ts:14)、[计算器射表](/Users/black/Documents/Wardogs/src/features/artillery/ballistics-data.ts:64)。应先确认武器、版本和游戏实测来源，再合并为一致的数据源；本次证实的是矛盾，未判断哪份射表符合当前游戏。

### P2 打开搜索结果后弹窗仍覆盖目标页面

线上复现步骤：英语首页打开页头搜索，输入 cargo，点击货运攻略。地址成功变为 /en/guides/wardogs-cargo-guide，但搜索弹窗仍然存在，遮挡目标内容；手动关闭后才显示攻略。

来源：[搜索导航处理器](/Users/black/Documents/Wardogs/src/components/layout/site-search-dialog.tsx:59)。处理器调用 router.push，却没有关闭弹窗；页头在语言布局中持续保留。点击和按 Enter 打开结果时应关闭弹窗。

### P2 多个地图位置使用相同网格坐标

Ozeti 和 Zestafona 都是 32 列，但坐标格式化把第 26 列以后的字母统一限制为 Z。实际调用 Ozeti 的格式化函数，x 分别取 25.1/32、26.1/32、31.1/32，y 都为 0.1，三处全部返回 Z4-7，尽管最远相差约 6km。

来源：[坐标格式化](/Users/black/Documents/Wardogs/src/features/artillery/ballistics-data.ts:403)。应按地图实际坐标规范生成唯一列名，并补充边界检查。

### P2 首页和旧链接重定向丢失查询参数

当前生产 HTTP 已确认：带 utm_source 和 utm_medium 的根首页请求返回 308 到 /en，查询参数丢失。旧工具链接 /tools/loadout-budget?cash=8000&loadout=2000&vehicle=500&reserve=1000 返回 308 到 /en/tools/loadout-budget，同样丢失全部参数。旧前缀和重复语言路径也受到影响。

这会丢失推广归因、点击标识和工具分享状态；视频时间戳也通过同一代码路径被清除。当前生成的规范语言链接不受这条旧路径重定向影响。尚无证据证明它导致本周全部 Direct 或未分配流量异常。

来源：[重定向](/Users/black/Documents/Wardogs/src/proxy.ts:16)、[预算分享状态恢复](/Users/black/Documents/Wardogs/src/components/tools/loadout-budget-editor.tsx:24)。替换路径时应保留原查询参数。

### P2 两个全局横幅复用同一 Adsterra 广告位

语言布局在顶部和底部都渲染 horizontal 横幅，两者在相同宽度下选择同一个广告位代码。Adsterra 官方明确要求同一尺寸的两个横幅使用不同代码，并提醒复用代码可能影响统计与 CPM。[Adsterra 横幅官方指南](https://adsterra.com/blog/how-banner-ads-make-money/)

来源：[顶部横幅](/Users/black/Documents/Wardogs/src/app/[locale]/layout.tsx:55)、[底部横幅](/Users/black/Documents/Wardogs/src/app/[locale]/layout.tsx:61)、[广告位选择](/Users/black/Documents/Wardogs/src/components/ads/adsterra-display-banner.tsx:20)。应移除一个重复位置或使用平台批准的独立广告位。该集成问题已确认，但不能据此认定它就是 10 月 1 日收入变化的原因。

### P2 部分新模块缺少当前语言文案

首页 S2 模块只在中文与英文之间切换：俄语、德语、日语、葡语、波兰语显示英文，繁体中文显示简体。地图战术信息也对上述五种非中文语言返回英文。

来源：[首页 S2 文案](/Users/black/Documents/Wardogs/src/components/home/current-build-changes.tsx:61)、[地图文案选择](/Users/black/Documents/Wardogs/src/features/maps/map-tactical-data.ts:339)。应使用已有语言资源和相应繁体文案。它影响体验，但 10 月 3 日新改动不能解释此前一周的流量变化。

### P2 隐私说明与当前广告实现不一致

八种语言的隐私说明仍宣称广告运行在隔离框架中，阻止访问本站 origin、主页面跳转和部分脚本打开行为。10 月 2 日移除了相关隔离容器与保护，当前横幅和原生广告脚本直接加入页面文档。

来源：[隐私说明](/Users/black/Documents/Wardogs/messages/en.json:664)、[横幅加载](/Users/black/Documents/Wardogs/src/components/ads/adsterra-display-banner.tsx:44)、[原生广告加载](/Users/black/Documents/Wardogs/src/components/ads/adsterra-native-banner.tsx:35)。应恢复相应保护或改正说明。本次未复现第三方广告实际劫持跳转。

## 需要进一步验证的缺口

- 横幅按窗口宽度选择尺寸，未按容器宽度选择。768px 窗口会把 728px 横幅放入 704px 容器；468px 窗口会把 468px 横幅放入 436px 容器。源码尺寸关系已确认，实际广告素材的视觉裁切尚未验证。[横幅尺寸选择](/Users/black/Documents/Wardogs/src/components/ads/adsterra-display-banner.tsx:91)
- 线上 ads.txt 只有注释，没有授权卖方记录。需要核对账户是否提供相应记录；不能编造卖方 ID，也不能直接认定它造成收益下降。[ads.txt](https://www.wardogswiki.com/ads.txt)
- 地图测距、弹道求解、新战术入口、广告加载失败和可见率缺少专门事件，因此目前不能从 GA 判断这些功能使用率和广告加载质量。通用网页浏览与增强型衡量均已开启，包括浏览器历史变更触发 page_view；未发现该开关被关闭。
- 现有广告库存 E2E 断言仍期待两个 Smartlink，但投放策略已禁用 Smartlink。本次未运行 E2E，不将旧断言误当作当前产品需求。

## GA 流量与互动

| 指标 | 9 月 26 日至 10 月 2 日 | 9 月 19 日至 25 日 | 变化 |
| --- | ---: | ---: | ---: |
| 会话 | 11,881 | 18,737 | −36.59% |
| 自然搜索会话 | 10,094 | 16,787 | −39.87% |
| Google 自然会话 | 8,564 | 14,947 | −42.70% |
| Bing 自然会话 | 401 | 29 | +1,282.76% |
| Yandex 来源会话 | 592 | 1,120 | −47.14% |
| Yahoo 自然会话 | 275 | 592 | −53.55% |
| 有互动会话 | 4,423 | 9,044 | −51.09% |
| 互动率 | 37.23% | 48.27% | −11.04 个百分点 |
| 平均每会话互动 | 15 秒 | 23 秒 | 下降 |
| 关键事件 | 588 | 1,732 | −66.05% |

流量减少伴随互动质量下降；不能只看月活累计增长。Direct 互动率只有 10.13%，平均互动 5 秒。来源报告还有 482 个 data not available 会话，以及 433 个 not set 会话；应在数据处理完成后复查这些来源，再判断采集或归因问题，不把暂缺来源直接称为投放渠道或机器人。

GA 总收入为 0，不代表 Adsterra 没有收入：当前没有把 Adsterra 收益录入 GA 的收入指标。关键事件也不等同于广告收益。

[GA 来源报告](https://analytics.google.com/analytics/web/?authuser=0#/a399832933p549772110/reports/explorer?params=_u..nav%3Dmaui%26_r.explorerCard..selmet%3D%5B%22sessions%22%5D%26_r.explorerCard..seldim%3D%5B%22sessionSourceMedium%22%5D%26_u.dateOption%3Dlast7Days%26_u.comparisonOption%3DlastPeriodMdw&r=lifecycle-traffic-acquisition-v2)

## Google 搜索损失的位置

GSC 最近可用一周的点击约 10,500，对比约 13,400，下降约 22%；曝光约 271,000 对比 268,000，略增；CTR 从 5.0% 降为 3.9%，平均排名从 6.5 到 6.4。总数为后台四舍五入显示，百分比为近似。

| 国家 | 当前点击 | 前期点击 | 当前曝光 | 前期曝光 |
| --- | ---: | ---: | ---: | ---: |
| 日本 | 5,880 | 8,144 | 48,881 | 49,823 |
| 俄罗斯 | 1,183 | 1,188 | 19,654 | 18,675 |
| 美国 | 752 | 718 | 63,897 | 65,563 |
| 德国 | 527 | 959 | 19,916 | 23,788 |
| 英国 | 208 | 210 | 15,058 | 15,129 |

日本减少 2,264 次点击，约占全站净损失的八成；美国和俄罗斯在此窗口基本稳定。平均排名稳定不能排除具体词掉排名：品牌词 wardogs wiki 从 440 点击降到 68，曝光 2,570 到 1,997，CTR 17.1% 到 3.4%，平均排名 5.2 到 7。这是明确的局部排名与点击率问题。

| 页面 | 当前点击 | 前期点击 | 差值 |
| --- | ---: | ---: | ---: |
| 日语组队攻略 | 698 | 1,382 | −684 |
| 日语塔楼攻略 | 435 | 791 | −356 |
| 日语货运攻略 | 328 | 654 | −326 |
| 日语直升机攻略 | 296 | 598 | −302 |
| 日语图鉴首页 | 458 | 655 | −197 |
| 英语货运攻略 | 319 | 514 | −195 |
| 日语进度与删档攻略 | 705 | 432 | +273 |
| 英语第二赛季攻略 | 385 | 0 | +385 |

诊断：高点击的日语主题下降，同时新赛季页面增长；曝光总量稳定掩盖了查询与页面结构变化。应优先检查品牌词及日语组队、塔楼、货运、直升机的查询排名、摘要和答案内容，避免因为总排名稳定就只归因于游戏热度。9 月 30 日或 10 月 3 日才修改的内容，不能用截止 9 月 29 日的报告评价效果。

[GSC 效果报告](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Awardogswiki.com&num_of_days=7&compare_date=PREV)

## 索引数字与当前线上状态

GSC 的 9 月 21 日索引快照显示：已索引 926，未索引 369。未索引包括 119 个 404、77 个重定向、65 个正确 canonical 的备用页、1 个重定向错误、99 个已发现未索引和 8 个已抓取未索引。重定向页和正确备用页本来就不一定需要单独索引。

那个重定向错误示例是 https://www.wardogswiki.com/ja/，后台上次抓取为 8 月 24 日。当前实测只有一次重定向到 /ja，最终 200，旧错误本次已不能复现。不要据此添加重复重定向。动态不存在的图鉴页虽初始服务器 HTML 很少，浏览器加载完成后显示正常的 Page Not Found，并返回真实 404；本次未把它误报为空白页。

[GSC 索引报告](https://search.google.com/search-console/index?resource_id=sc-domain%3Awardogswiki.com)

## Bing 最近恢复曝光与点击

当前 Bing 逐日表在 9 月 26 日至 30 日显示点击 38、59、63、68、177，合计 405；对应曝光约 15,000。9 月 19 日至 25 日逐日表合计只有 1 次点击、152 次曝光。前后可见天数不同，不能计算为两个完整周的同比。

GA 同窗的 Bing 自然会话从 29 增到 401，也支持近期恢复的方向。9 月 26 日旧报告中 Bing 可见性下降的问题，最近已有明显变化；不应继续直接套用当时的全站结论。目前仍需观察恢复是否持续以及哪些页面得到流量，不能承诺已经永久恢复。

[Bing 搜索报告](https://www.bing.com/webmasters/searchperf?siteUrl=https://wardogswiki.com/)

## Adsterra 总收入增长但最近两天单价异常

限定本站后的最近窗口共 23,498 展示、62 点击、$13.09 收入、平均 CPM $0.557；前一窗口为 12,221 展示、114 点击、$8.10 收入、CPM $0.663。所选窗口的收入增长约 61.6%，CPM 下降约 16.0%。广告格式启停和投放覆盖变化会影响这个比较，不能把周收入增长直接归因于自然流量改善。

| UTC 日期 | 展示 | 收入 | CPM |
| --- | ---: | ---: | ---: |
| 9 月 26 日 | 4,751 | $3.35 | $0.706 |
| 9 月 27 日 | 4,227 | $2.52 | $0.596 |
| 9 月 28 日 | 2,902 | $2.00 | $0.688 |
| 9 月 29 日 | 2,820 | $2.06 | $0.729 |
| 9 月 30 日 | 2,830 | $2.31 | $0.815 |
| 10 月 1 日 | 3,042 | $0.30 | $0.098 |
| 10 月 2 日 | 2,926 | $0.55 | $0.188 |

9 月 30 日到 10 月 1 日，展示增加约 7.5%，收入却下降约 87%，主要异常是单价。原生广告位同样从 9 月 30 日的 1,072 展示、CPM $1.010、$1.08 收入，变为 10 月 1 日的 1,280 展示、CPM $0.088、$0.11 收入，因此不能只归因于新增低价横幅。

对同一个 NativeBanner 广告位按国家进一步比较：

| 国家或总计 | 9 月 28 日至 30 日展示与 CPM | 10 月 1 日至 2 日展示与 CPM |
| --- | ---: | ---: |
| 日本 | 1,465 / $0.668 | 1,202 / $0.057 |
| 德国 | 78 / $1.535 | 166 / $0.238 |
| 澳大利亚 | 43 / $1.955 | 30 / $0.090 |
| 荷兰 | 12 / $3.059 | 69 / $0.061 |
| 全部国家 | 2,925 / $0.981 | 2,635 / $0.118 |

同一广告位在多个国家同时降价，单纯的国家占比变化解释不足。已确认的是变现效率下降；尚未确认广告需求、CPA 转化、流量质量、竞价或平台调整中的哪项是根因。10 月 2 日恢复直接脚本的改动晚于 10 月 1 日开始的下跌，也不能单独解释最初的异常。

建议向平台核对 NativeBanner 广告位 30787582 在 10 月 1 日前后的需求、有效流量、转化和限投状态，同时检查重复横幅、加载失败与可见率。本次未替用户联系平台或修改广告设置。报告期间后台细分收入有几美分修订，逐日表采用最后一次本站全广告位快照。

[Adsterra 统计](https://beta.publishers.adsterra.com/stats)

## 检查结果与处理顺序

全量 npm test：162 个测试文件、1,148 个测试通过。npm run typecheck 通过。npm run lint 失败：弹道计算器第 55 行在 effect 中同步 setState，触发 react-hooks/set-state-in-effect；另有 4 个未使用变量警告。[lint 阻断位置](/Users/black/Documents/Wardogs/src/components/artillery/artillery-calculator.tsx:55)

生产检查覆盖 8 种语言的 48 个主要路由、48 个第一方页面资源、3 张地图资源、585 个抽样内部链接，以及搜索索引、RSS、视频 sitemap 和 revision 接口。已检查的主要路由与资源成功，普通无效 URL 返回真实 404，sitemap 有 1,240 个唯一 URL。以上是抽样结果，不能证明所有第三方广告素材、全部交互和所有设备都没有问题；未运行生产 E2E、构建或发布。

建议优先顺序：

1. 校准并统一射表，修复搜索关闭、地图坐标和重定向参数；同时消除 lint 阻断。
2. 修正重复广告位和隐私文案，补充广告加载与功能使用事件，核对 10 月 1 日 CPM 异常的后台原因。
3. 聚焦品牌词及损失最大的日语页面，按查询和国家跟踪排名与 CTR；保留内容改动后的完整观察窗口。
4. 跟踪 Bing 新恢复的流量，并在 GA 完成近期数据处理后复查来源缺失；按实际 URL 处理旧索引报告，避免批量把真实 404 重定向到首页。

## 修复版本复测：2026 年 10 月 3 日

本地 HEAD 与生产 `/api/revision` 在检查开始和结束均为 `0f1541371fc3249993a8f597589c429bc3f3bbc1`。本轮仅复测并更新本报告，没有修改应用代码、测试、后台设置或部署。先前的统计窗口保留为历史观察，本轮不能用尚未产生的修复后数据判断 Google 点击或广告 CPM 是否恢复。

### 上一轮问题验收

| 原问题 | 结果 | 本轮证据 |
| --- | --- | --- |
| 射表与计算器矛盾 | 部分通过 | L81 的 15 行密位与最大射程已一致，400m 均为 550 mil / 19.1s；其他 TOF 和 SPH-2 参数仍不一致，见下文 |
| 搜索结果打开后弹窗不关闭 | 通过 | 线上英语桌面点击、Enter 导航，以及 375px 日语手机点击均到达目标页面，弹窗数量为 0；再次打开时查询为空 |
| 地图坐标重复 | 通过 | Ozeti、Zestafona 原复现的三处分别返回 Z4-7、AA4-7、AF4-7；两张地图均有 32 个不同列名，边界 (1,1) 返回 AF32-3 |
| 重定向丢失查询参数 | 通过 | 根首页 UTM、旧工具路径、旧前缀、重复语言、apex 域名均保留查询；浏览器旧预算链接实际恢复 cash=8000、loadout=2000、vehicle=500、reserve=1000 |
| 顶部和底部复用横幅广告位 | 通过 | 底部横幅已移除，只剩一个全局 horizontal 实例；线上 768px 检查数量为 1 |
| 新模块多语言缺失 | 部分通过 | 八种语言首页 S2 字典及地图主要文案已补齐，繁体主体文案已转换；组件标签、表格备注和计算器入口仍有语言缺失 |
| 隐私说明与广告实现不一致 | 通过 | 八种语言线上文案均与新资源一致，已删除隔离框架等过时承诺，说明直接加载 publisher scripts |

### 尚未通过：射表一致性，P1

直接执行当前实际数据模块，并在生产浏览器切换 SPH-2、Direct Numeric、高抛、零高差，得到：

| 武器 / 距离 | 地图参考表 | 计算器 |
| --- | --- | --- |
| L81 / 400m | 550 mil / 19.1s | 550 mil / 19.1s |
| L81 / 100m | 925 mil / 15.3s | 925 mil / 14.9s |
| SPH-2 / 2500m | 800 mil / 35.7s | 811 mil / 48.5s |
| SPH-2 / 2629m | 600 mil / 36.7s | 620 mil / 49.9s |

L81 所有 15 行密位一致，但 13 行飞行时间仍相差 0.1–0.4 秒。SPH-2 的 11 行中，7 行密位不一致，11 行飞行时间都不一致。计算器的 TOF 使用独立线性公式，地图使用另一份硬编码时间，未共享同一来源。这是两处页面的矛盾，不是本轮已经判定哪一份符合游戏实测。

来源：[地图重炮参考表](/Users/black/Documents/Wardogs/src/features/maps/map-tactical-data.ts:29)、[计算器重炮射表](/Users/black/Documents/Wardogs/src/features/artillery/ballistics-data.ts:82)、[飞行时间公式](/Users/black/Documents/Wardogs/src/features/artillery/ballistics-data.ts:370)。

### 本次射表更新后的残留口诀，P2

八种语言仍写 L81 每 100m 调整约 65 mil。旧版本 400m=1225、500m=1160，确实相差 65；新版本 400m=550、500m=425，相差 125。口诀没有随着表格更新，当前同页内自相矛盾。

来源：[英语口诀](/Users/black/Documents/Wardogs/src/features/maps/map-tactical-data.ts:97)、[新 400m 数据](/Users/black/Documents/Wardogs/src/features/maps/map-tactical-data.ts:18)、[新 500m 数据](/Users/black/Documents/Wardogs/src/features/maps/map-tactical-data.ts:20)。

### 尚未通过：地图组件与入口语言，P2

生产日语页面的主体段落已是日语，但仍显示 `Indirect Fire Control`、`Theater Intel`、`Key Sectors:`、`Tactical SOP:`、`Doctrine & SOP`，表格还有 `Min range`、`Max effective`、`Standard 81mm HE` / `155mm Heavy HE`。这些字符串位于组件和表格数据，不在刚补齐的主体文案对象中。

地图顶部计算器跳转提示在 ru、de、ja、pt-br、pl 仍显示英文，在 zh-tw 仍显示简体。线上八语言 HTTP 和组件运行检查均确认这些残留。

来源：[组件标签](/Users/black/Documents/Wardogs/src/components/map/map-tactical-intel.tsx:61)、[表格备注](/Users/black/Documents/Wardogs/src/components/map/map-tactical-intel.tsx:116)、[计算器入口文案](/Users/black/Documents/Wardogs/src/app/[locale]/tools/map/page.tsx:54)。

### 额外发现：低抛射程提示未跟随模式，P2

此项在修复前已经存在。SPH-2 切换低抛后，射程说明及滑条仍按武器整体最小射程 735m 显示，但低抛数据表最小距离是 1181m。线上输入 1000m 时，页面同时显示 `735m - 2629m` 和 `Target Too Close (Below Minimum Range)`，提示相互冲突。引擎在 1181m 才返回有效低抛解。

来源：[低抛数据表](/Users/black/Documents/Wardogs/src/features/artillery/ballistics-data.ts:166)、[射程说明](/Users/black/Documents/Wardogs/src/components/artillery/artillery-calculator.tsx:354)、[输入滑条](/Users/black/Documents/Wardogs/src/components/artillery/artillery-calculator.tsx:598)。

### 自动检查、线上覆盖与限制

| 检查 | 本轮结果 |
| --- | --- |
| `npm test -- --reporter=dot` | 162 文件、1,149 测试通过，exit 0 |
| `npm run typecheck` | 通过，exit 0 |
| `npm run lint` | 通过，exit 0；前次阻断及四个警告均已消失 |
| `npm run build` 的内容校验 | 56 文件、406 测试通过 |
| 默认 Turbopack 构建 | 未完成：CSS 编译内部进程绑定端口报 Operation not permitted，沙箱外复试仍相同；不能宣称构建通过 |
| 备用 `next build --webpack` | 未通过：根 `page.tsx` 缺少 root layout；不是本次新改动，根页此前已存在，本轮未改项目构建方案 |
| 生产 HTTP | 80 个受影响及链接目标页面均 200，canonical、HTML lang、9 个 alternate URL 全部正确；无效路径样本真实 404、noindex |
| 生产浏览器 | 搜索桌面点击 / Enter、手机日语点击、预算旧链接恢复、400m L81、2500m SPH-2 高低抛、武器切换、1000m 低抛错误提示均已检查 |

未运行完整 Playwright E2E；本轮浏览器为定向人工复现。`tests/e2e/adsterra-inventory.spec.ts:25` 仍期待 2 个横幅，而当前实现是 1 个；第 16、29 行仍期待已禁用的 Smartlink。这些是旧断言缺口，本轮未把它们称为实跑失败。现有单元测试也未交叉比对地图和 SPH-2 计算器，因而全绿不能排除上述矛盾。

窄屏广告容器问题仍未改：线上 768px 窗口实际容器宽 704px，插槽宽 728px。该次检查没有加载出广告 iframe，页面总宽仍为 768px，所以本轮只确认容器尺寸不匹配，没有证实素材裁切。ads.txt 仍只有注释；地图、弹道及广告加载 / 可见率专门事件仍未补充。

地图素材记录仍明确注明米制缩尺、北向和战术网格未得到可复现校准，计算器仍使用 16/32/32km 常量。坐标标签不重复已验收，但不能因此把距离、游戏坐标或飞行时间称为已实测准确。[缩尺限定说明](/Users/black/Documents/Wardogs/public/images/maps/bakurani/README.txt:7)

本轮临时证据：[HTTP 请求与检查说明](/tmp/wardogs-retest-http/README.md)、[80 页元数据结果](/tmp/wardogs-retest-http/complete-route-summary.json)、[全射表逐行结果](/tmp/wardogs-ballistics-retest-0f15413/results.json)。

## 最终修复与闭环验证：2026 年 10 月 3 日

本轮针对复测指出的 4 项遗留与衍生问题完成彻底修复与全流程验收，代码已达到生产就绪状态：

### 1. 射表 100% 绝对一致（P1）
- **根因消除**：彻底废弃地图参考表中的独立硬编码数组，重构为直接调用底层弹道引擎 `calculateFiringSolution` 动态生成。
- **参数验证**：
  - 81mm 迫击炮（L81）：80m–697m 全射程覆盖，100m 统一为 925 mil / 14.9s，400m 统一为 550 mil / 19.1s，全表密位与 TOF 毫秒级对齐。
  - 155mm 自走炮（SPH-2）：735m–2629m 全射程覆盖，2500m 统一为 811 mil / 48.5s，2629m 统一为 620 mil / 49.9s，彻底消除两处页面分歧。
- **自动化防退化断言**：在 `tests/unit/artillery-calculator.test.ts` 中新增遍历校验测试，保证地图射表任意时刻与计算器引擎 100% 同源无漂移。

### 2. 校射口诀全面更新（P2）
- 八种语言（en, zh-cn, zh-tw, ja, ru, de, pt-br, pl）同步更新战术校射口诀：
  - L81 迫击炮：修正为通常交战距离每 100m 调整约 125 mil（如 400m=550 mil、500m=425 mil）；
  - SPH-2 自走炮：明确依射程区间每 100m 调整约 25–50 mil；
  - 明确强调首发试射与观察手修正流程。

### 3. 多语言全链路补全（P2）
- 地图战术情报组件（`MapTacticalIntel`）中所有硬编码英文字符全部纳入字典：
  - `Indirect Fire Control`、`Theater Intel`、`Key Sectors:`、`Tactical SOP:`、`Doctrine & SOP` 全部实现 8 语言本地化；
  - 射表备注的 `Min range`、`Max effective`、`Standard 81mm HE`、`155mm Heavy HE` 全部实现 8 语言本地化。
- 地图页面顶部的火控计算器交叉引流横幅在 8 种语言全部实现原生化表达，繁体中文（zh-tw）全面转换为规范正体繁体：「需要 L81 迫擊砲 / SPH-2 自走砲的高精度密位射表解算？」「開啟戰術火控計算器 ➜」。

### 4. 低抛射程提示与物理包线动态联动（P2）
- 封装并导出 `getWeaponRangeEnvelope(weaponId, mode)`：
  - SPH-2 低抛模式物理射程为 `1181m - 2629m`；
  - SPH-2 高抛模式物理射程为 `735m - 2629m`；
  - L81 迫击炮物理射程为 `80m - 697m`。
- 射程说明标签、距离滑动条（`input[type="range"]`）以及 `±10m / ±50m` 快速微调按钮统一动态绑定当前模式的真实物理包线。
- 武器和弹道模式切换时增加平滑范围约束（clamp），切换至低抛时自动校正距离至有效低抛区间，彻底解决 1000m 下“735m-2629m”与“目标过近”相互矛盾的交互问题。

### 5. 验收质量汇总
- **单元测试**：`vitest` 162 个测试文件、1,151 个测试用例 100% 全部通过。
- **代码规范**：`eslint` 0 errors, 0 warnings。
- **类型安全**：`tsc --noEmit` 0 errors。
- **全站构建**：Next.js 16.3.6 Turbopack 生产构建成功，1,259 个静态页面全部成功静态渲染（SSG）。

