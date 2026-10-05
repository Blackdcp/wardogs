import type {WardogsItem} from "./item-library";

type ItemProse = Pick<WardogsItem, "summary" | "description" | "role" | "strengths" | "cautions" | "confirmedFacts" | "unconfirmedFacts">;
type AuthoredProse = Omit<ItemProse, "confirmedFacts">;

const authored: Record<string, AuthoredProse> = {
  mortar: {
    summary: "用于压制屋顶、塔楼、FOB 防御与固定目标交战中密集敌人的间接火力工具。",
    description: "迫击炮是 WARDOGS 首个拥有独立详情页的武器类物品，因为记录显示玩家确实在搜索它。本页介绍使用条件、反制方法与证据，应作为战术攻略阅读，而非最终参数表。",
    role: "用迫击炮将队友报点转化为火力压力，迫使敌人离开容易预测的位置。",
    strengths: ["惩罚集中在屋顶、塔楼与明显目标路线上的玩家。", "可在步兵或载具施压前削弱 FOB 防御。", "能让善于沟通目标标记与射击修正的小队发挥优势。"],
    cautions: ["最终伤害、装填时间、弹药限制与解锁规则尚未确认。", "敌人找到发射位置后，可以对迫击炮组施压。", "情报不足会让射击变成猜测，难以可靠命中。"]
  },
  "mobile-fob": {
    summary: "可部署的前线作战基地，作为补给、重生施压、防御与热区控制的据点。",
    description: "机动 FOB 是 WARDOGS 最能体现战略层面的道具。它连结后勤、地形、补给运输、防御及目标压力，因此比内容单薄的装备短条目更值得深入介绍。",
    role: "将 FOB 放在队友能补给、防守、接收运送物资，并争夺附近战局主动权的位置。",
    strengths: ["为弹药、绷带、材料与团队推进建立前线据点。", "发售前视频显示可支援墙壁、战壕、迫击炮及防空工具等防御升级。", "让地形与配送通道成为有意义的战略决策。"],
    cautions: ["FOB 需要队友补给与维护，不会永远自行维持。", "位置不佳会暴露运输路线，并提高 FOB 防守成本。", "确切建造选单、升级费用与最终规则尚未确认。"]
  },
  littlebird: {
    summary: "用于侦察、渗透、转移及突发施压的快速直升机类载具。",
    description: "Littlebird 类型直升机的视频，让玩家在完整载具资料库就绪前就有实用的载具页面。重点在于机动性与风险，而非最终装甲或武器数据。",
    role: "地面路线太慢或受到争夺时，用来运送小队、侦察敌方压力及快速转移。",
    strengths: ["能在大范围战场中快速转移。", "适合侦察，并将队友送到交战压力点附近。", "让飞行员与地面小队都必须注意垂直方向的战况。"],
    cautions: ["最终操控、耐久、座位数及武器配置尚未确认。", "大型交战中，飞行载具很容易迅速引起注意。", "降落失误可能让原本的运输价值变成全队覆灭。"]
  },
  tank: {
    summary: "提供重型载具压力，用于突破路线、威胁密集阵地，并迫使步兵正视装甲威胁。",
    description: "战车页面应说明重装甲如何改变 WARDOGS 战局，而不捏造最终装甲值。它首先是战场定位页面，之后才是数值页面。",
    role: "用战车压制暴露的路线，并在步兵单独无法守住地面时支援目标推进。",
    strengths: ["迫使敌方步兵改走其他路线，或投入反制火力。", "可影响开阔地带的交战，并支援向争夺区域推进。", "适合与补给和步兵掩护协同运作。"],
    cautions: ["最终装甲、伤害、乘员人数与经济成本尚未确认。", "缺乏步兵支援的战车可能陷入孤立。", "地形与反载具压力可能限制安全路线。"]
  },
  "attack-helicopter": {
    summary: "空中支援载具，可让开阔地移动、屋顶交战与目标推进变得高度危险。",
    description: "在官方上市资料确认确切武器与耐久前，攻击直升机介绍应持续聚焦战场影响与反制方式。",
    role: "从上方施压、惩罚暴露的移动，迫使敌人考虑防空防御。",
    strengths: ["控制地面小队可能忽略的视线方向。", "可惩罚集体移动及暴露的载具。", "提高 FOB 周边防空规划的价值。"],
    cautions: ["最终武器系统、生命值及反制措施细节尚未确认。", "空中支援仰赖飞行员技术与战场意识。", "防空工具可能迅速改变积极飞行路线的效益。"]
  },
  "armored-transport": {
    summary: "提供受保护的移动方式，让玩家与补给通过危险路线。",
    description: "装甲运输适合作为早期载具条目，因为它把 WARDOGS 的后勤主张与实际对局需求连在一起：不依赖徒步，也能运送人员、物资并维持压力。",
    role: "将队友与补给送往争夺区域，同时减少在开阔道路上的暴露。",
    strengths: ["支援小队转移与前线增援。", "补给运输可比暴露的徒步移动更安全。", "符合 WARDOGS 偏重支援职责与后勤的特色。"],
    cautions: ["最终座位数、装甲、货物行为与价格尚未确认。", "可预测的道路行驶仍可能遭到伏击。", "只有把小队送到需要的位置，运输才有意义。"]
  },
  "a-91": {
    summary: "A-91 在 Alpha 1 是突击经验路线的步枪，使用 5.56x45mm 弹药，提供半自动与点射，整枪重 3.17 kg。",
    description: "WARDOGS 的 A-91 在 Alpha 1 突击步枪名单中属于受控点射选择。虽未记录价格，但已观察到的口径、两种射击设定、重量与突击经验路线，足以将它定位为有节奏地压制通道的型号，而不是据此推定上市时的平衡。",
    role: "用 A-91 在远处进行有节奏的半自动射击，目标穿过交火较密集的通道时改用短点射；在把它当成预设步枪前，预算仍须考虑尚未确认的购买价格。",
    strengths: ["半自动与点射让 Alpha 1 型号具备两种可控制的交战节奏。", "已观察到的 5.56x45mm 口径属于目录中型号最多的武器家族。", "已观察到的 3.17 kg 重量低于 Alpha 的 FAL 与 Galil 记录。"],
    cautions: ["未记录 Alpha 1 购买价格，因此无法进行完整的成本比较。", "观察记录未显示全自动设定；近距离施压可能需要有纪律的点射。", "STANAG 弹匣另有目录记录，但尚未确认与 A-91 这一具体型号的相容性。"],
    unconfirmedFacts: ["未记录 Alpha 1 价格；抢先体验与正式版的售价仍未确认。", "伤害、后座力、配件相容性与平衡可能在抢先体验或正式版改变。"]
  },
  ak74: {
    summary: "Alpha 1 的 AK74 是重 3 kg、走突击经验路线的步枪，使用 5.45x39mm 弹药，提供半自动与全自动射击。",
    description: "在已记录的 Alpha 1 名单中，AK74 是唯一使用 5.45x39mm 的型号。这套独立的弹药成本结构、半自动／全自动选择器，以及记录中的 3 kg 重量，共同构成它的预发布版本特色，尽管商店售价并未记录。",
    role: "用半自动控制弹药消耗，近距离推进时切换全自动；同时记住，选用 AK74 代表配装要依赖较少其他武器共用的 5.45x39mm 补给线。",
    strengths: ["半自动与全自动分别适合有节奏的单发射击与立即的近距离压制。", "Alpha 1 重量为 3 kg，比其他已记录的突击步枪更轻。", "已有 AK74 75 发弹鼓记录，可作为高容量配装规划的参考。"],
    cautions: ["Alpha 1 未记录商店价格。", "已记录武器中仅一款使用 5.45x39mm，因此弹药共用范围比 5.56x45mm 更小。", "未记录 75 发弹鼓的价格、操控代价与最终可用性。"],
    unconfirmedFacts: ["未记录 Alpha 1 价格；抢先体验与正式版的售价仍未确认。", "抢先体验或正式版的弹鼓价格、最终后座力、伤害及进度调整仍未确认。"]
  },
  "amp-9": {
    summary: "AMP-9 在 Alpha 1 是售价 $900、走医疗经验路线的冲锋枪，使用 9x19mm，提供半自动与全自动射击，观察重量为 1.4 kg。",
    description: "AMP-9 在这 14 个型号记录中具备最低的已记录枪械重量，同时有医疗经验门槛和四种已记录的弹匣容量。Alpha 1 证据指向一把机动支援武器；它的总成本取决于弹匣选择和 9x19mm 补给，不只是 $900 的基础价格。",
    role: "医疗兵需要轻型主武器作近距离自卫时可携带 AMP-9；用半自动节省 9x19mm，在救援或目标引来立即威胁时使用全自动。",
    strengths: ["Alpha 1 的 1.4 kg 重量为医疗工具和防护留下更多余裕。", "半自动与全自动让支援玩家可在节省成本和近距离输出之间选择。", "已观察到 15、20、30、50 发 AMP-9 弹匣，可配合不同容量预算。"],
    cautions: ["Alpha 1 的 $900 价格不包含弹药与替换弹匣成本。", "已观察到的 50 发弹匣售价 $180，会明显增加这把平价冲锋枪的成本。", "目录证据未记录射程表现、后座力与伤害衰减。"],
    unconfirmedFacts: ["伤害、后座力、射程表现与医疗经验要求可能在抢先体验或正式版改变。", "Alpha 1 弹匣价格与相容性尚未确认为正式版数值。"]
  },
  "amr-50": {
    summary: "AMR 50 在 Alpha 1 是售价 $8,800、走侦察经验路线的狙击步枪，以栓动、弹匣供弹系统发射 .50 Cal，重量 12.5 kg。",
    description: "AMR 50 位于已记录武器成本的极端：它是这 14 款中最昂贵、最重的型号。.50 Cal 弹药也标示为每发 $50、每盒 $250，使 Alpha 1 的每次出击都成为一项专业侦察投入。",
    role: "在预先准备的监视射击位置部署 AMR 50，确保目标确实值得承担补购成本、12.5 kg 重量和昂贵弹药，而非轻型步枪也能同样稳妥处理的目标。",
    strengths: [".50 Cal 口径让它在 Alpha 目录中具有明确的重型步枪定位。", "栓动与弹匣供弹允许有节奏地补射，不必每发都完成单发式装填循环。", "已有售价 $30 的 AMR 50 10 发弹匣记录，提供具体容量选项。"],
    cautions: ["Alpha 1 的 $8,800 购买价格会让持久资金中的大笔金额承受损失风险。", "观察重量 12.5 kg，远高于 BMR-308 和突击步枪。", "在任何最终平衡调整前，.50 Cal 以每发 $50 成为已记录单发成本最高的弹药。"],
    unconfirmedFacts: ["对步兵伤害、与护甲的交互作用、晃动及操控可能在抢先体验或正式版改变。", "$8,800 枪价与 .50 Cal 弹药成本都是 Alpha 1 观察结果，不是已确认的正式版经济数值。"]
  },
  "bmr-308": {
    summary: "BMR-308 在 Alpha 1 是售价 $6,000、走侦察经验路线的半自动精确射手步枪，使用 .308 Winchester，重量 3.9 kg。",
    description: "BMR-308 为 Alpha 1 侦察路线提供了介于笨重 AMR 50 与非常规复合弓之间的半自动选择。.308 Winchester 口径也将它与 FAL 及一份共用 20 发弹匣记录连结起来，但不能假定最终相容性。",
    role: "用 BMR-308 沿中远距离视线持续进行精确射击，保留足够购买 .308 Winchester 的资金，避免像使用突击步枪那样在近距离大量消耗弹药。",
    strengths: ["相较 AMR 50 已观察到的栓动方式，半自动射击允许更快修正射击。", "Alpha 1 的 3.9 kg 重量，相较 12.5 kg 重型狙击枪更容易负担。", "FAL 与 BMR-308 家族有售价 $150 的 20 发弹匣记录。"],
    cautions: ["Alpha 1 的 $6,000 价格使遗失步枪后的补购相当昂贵。", "已观察到 .308 Winchester 标准弹每发 $4、每盒 $40。", "瞄具适配、弹匣操控、伤害与有效射程尚未作为最终规格记录。"],
    unconfirmedFacts: ["抢先体验或正式版的瞄具相容性、后座力、伤害与射程调整仍未确认。", "已观察到的 $6,000 Alpha 价格和弹匣成本，可能与目前抢先体验版本或正式版不同。"]
  },
  "bushmaster-m17s": {
    summary: "Bushmaster M17S 在 Alpha 1 标价 $0，是重 3.17 kg、走突击经验路线的步枪，使用 5.56x45mm，提供半自动与点射。",
    description: "Bushmaster M17S 与 A-91、KH-2002 共有已记录的 5.56x45mm、半自动／点射、3.17 kg 特征，但商店记录显示 $0。这只能视为 Alpha 1 的观察结果，不能证明上市后永久免费。",
    role: "依 Alpha 证据把 M17S 当作受控点射突击选项；在后续版本确认取得方式前，显示的 $0 只可用于历史配装成本比较。",
    strengths: ["显示的 Alpha 1 $0 数值，使当时记录的基础武器成本为零。", "半自动与点射可控制射击，不必承担全自动的弹药消耗。", "5.56x45mm 属于目录中涵盖武器最多的弹药家族。"],
    cautions: ["预发布商店显示 $0，可能代表初始取得方式、占位资料或临时调整。", "观察记录不包含全自动射击。", "另列的 STANAG 弹匣记录，不能证明每种容量都适用 M17S。"],
    unconfirmedFacts: ["显示的 Alpha 1 $0 价格，尚未确认适用于抢先体验或正式版。", "取得规则、伤害、后座力和配件相容性可能在抢先体验或正式版改变。"]
  },
  "compound-bow": {
    summary: "复合弓在 Alpha 1 是售价 $800、重 1.3 kg、走侦察经验路线的武器，使用标准箭矢，以拉弓后释放的方式射击。",
    description: "复合弓是已记录型号中最轻的，也是此处唯一围绕标准箭矢与拉弓释放时机设计的武器。Alpha 1 的 $800 价格比侦察步枪便宜，但未记录箭矢伤害、回收、速度或容量。",
    role: "习惯掌握拉弓与释放时机的玩家，可将弓作为轻量侦察选择；同时携带副武器，应付传统弹匣武器更能容许失误的情况。",
    strengths: ["重 1.3 kg，是这 14 款已记录武器中最轻的。", "Alpha 1 的 $800 价格，远低于 BMR-308 与 AMR 50 这两种侦察选择。", "标准箭矢形成了枪械口径家族以外的独立补给选择。"],
    cautions: ["拉弓释放的射击方式，没有已观察到的半自动或自动替代模式。", "未记录箭矢伤害、速度、下坠、回收及携带数量。", "目录没有独立箭矢物品页，也没有已确认的配件相容表。"],
    unconfirmedFacts: ["抢先体验或正式版的箭矢伤害、速度、回收及容量仍未确认。", "Alpha 的 $800 价格和侦察经验要求，可能与目前抢先体验版本或正式版不同。"]
  },
  deagle: {
    summary: "Deagle 在 Alpha 1 是售价 $900、半自动射击的 .50 AE 副武器；重量与进度条件未被记录。",
    description: "Deagle 在 Alpha 1 副武器清单中的 $900 价格已达主武器等级，并使用少见的 .50 AE 口径。已有售价 $50 的 7 发弹匣记录，但重量与进度栏位缺失，仍留下重要的配装问题。",
    role: "当计划适合昂贵、低容量的半自动备用武器时再选 Deagle；与便宜副武器比较前，须计入 .50 AE 弹药与弹匣。",
    strengths: [".50 AE 口径在这 14 款已记录武器中独一无二。", "半自动运作避免了专业武器较慢的拉弓释放或栓动循环。", "已记录专用 Deagle 7 发弹匣，为其容量提供具体依据。"],
    cautions: ["Alpha 1 的 $900 价格在未计弹药和弹匣前就与 AMP-9 相同。", "已记录的 7 发弹匣售价 $50，容量也限制了失误空间。", "第 1 赛季已确认生涯等级 85；仅目前重量与完整携行负担仍未验证。"],
    unconfirmedFacts: ["Alpha 1 缺少重量与进度资料；第 1 赛季已确认生涯等级 85，但抢先体验或正式版重量仍未验证。", "伤害、后座力与弹匣表现可能与当前版本不同；Alpha 1 的 $900 商店价格仍未在抢先体验中验证。"]
  },
  fal: {
    summary: "FAL 在 Alpha 1 是售价 $5,500、走突击经验路线的步枪，以半自动或全自动发射 .308 Winchester，观察重量为 4.25 kg。",
    description: "FAL 是已记录突击步枪中最重、最昂贵的一把，以 .308 Winchester 与全自动能力取代常见的 5.56x45mm 成本结构。已记录的 20、30 发弹匣，也比许多小口径弹匣昂贵。",
    role: "用半自动控制 .308 Winchester 消耗，仅在短促、决定性的压制中使用全自动，因为步枪、弹药和弹匣在 Alpha 1 都具有相当高的成本。",
    strengths: ["半自动与全自动让 FAL 可在精确射击和近距离压制间切换。", ".308 Winchester 口径让它与较轻的 5.56x45mm 突击步枪有所区别。", "20、30 发弹匣观察记录提供了两个具体容量选择。"],
    cautions: ["Alpha 1 售价 $5,500，远高于已记录的 Galil 与 AMP-9。", "观察重量 4.25 kg，在 Alpha 突击步枪记录中最高。", "FAL 30 发弹匣标价 $250，.308 标准弹每发 $4。"],
    unconfirmedFacts: ["伤害、后座力、全自动控制与突击经验要求可能在抢先体验或正式版改变。", "$5,500 价格与已记录弹匣成本都是 Alpha 1 观察结果，不是已确认的正式版数值。"]
  },
  galil: {
    summary: "Galil 在 Alpha 1 是售价 $2,200、重 3.95 kg、走突击经验路线的步枪，使用 5.56x45mm，提供半自动与全自动射击。",
    description: "Galil 在 Alpha 1 担任中价位突击角色：比点射型 5.56x45mm 记录更贵、更重，但比 .308 FAL 便宜且具备全自动。专用 35、50 发弹匣记录提供了实用的容量参考。",
    role: "把 Galil 作为灵活的突击主武器，跨越开阔地时以半自动控制 5.56x45mm 射击节奏；小队拉近距离或清除防守阵地时改用全自动。",
    strengths: ["半自动与全自动兼顾节省弹药与近距离压制。", "Alpha 目录记录了专用的 Galil 35、50 发弹匣。", "Alpha 1 的 $2,200 价格远低于 FAL，同时保有自动射击。"],
    cautions: ["观察重量 3.95 kg，高于 A-91、AK74、M17S 和 KH-2002。", "Alpha 1 的 50 发弹匣在未装弹前就需 $110。", "后座力、装填时间、伤害和配件效果尚未作为最终数值记录。"],
    unconfirmedFacts: ["抢先体验或正式版的后座力、伤害、配件适配及突击经验调整仍未确认。", "Alpha 1 的步枪与弹匣价格可能与目前抢先体验版本或正式版不同。"]
  },
  "ggx-17": {
    summary: "GGX 17 在 Alpha 1 是半自动 9x19mm 副武器；价格、重量与进度条件未被记录。",
    description: "GGX 17 是已记录 GGX 副武器组合中采用常规半自动的一款。9x19mm 让它能使用观察价格最低的弹药盒，但缺少三个商店栏位，无法可靠比较总成本或携行重量。",
    role: "把 GGX 17 用作有节奏的 9x19mm 备用武器，而非 GGX 18 已观察到的全自动替代品；在后续版本确认取得价格前，预算应保留余裕。",
    strengths: ["半自动鼓励受控的备用射击并节省弹药。", "已观察到 9x19mm 标准弹每发 $1、每盒 $10。", "共用口径能简化与 AMP-9、GGX 18 配合时的补给。"],
    cautions: ["Alpha 1 记录中缺少价格、重量与进度条件。", "已记录 GGX 品牌的 33、50 发弹匣，但未证明对具体型号的相容性。", "武器记录未包含伤害、后座力、容量与操控。"],
    unconfirmedFacts: ["Alpha 1 未记录价格、重量与进度条件，抢先体验或正式版也仍未确认。", "弹匣相容性、伤害、后座力和容量可能与目前抢先体验版本或正式版不同。"]
  },
  "ggx-18": {
    summary: "GGX 18 在 Alpha 1 是具备半自动与全自动的 9x19mm 副武器；价格、重量与进度条件未被记录。",
    description: "GGX 18 以已观察到的全自动选项区别于 GGX 17，为 Alpha 1 副武器名单提供紧凑型自动火力。记录清楚显示了这项能力，但缺少价格、重量、进度及已确认的弹匣适配，现在断言上市后的价值仍过早。",
    role: "一般备用时让 GGX 18 保持半自动，只有近距离急迫威胁值得牺牲弹药控制、快速消耗 9x19mm 时才使用全自动。",
    strengths: ["半自动与全自动使它成为已记录 GGX 副武器中更灵活的选择。", "已观察到 9x19mm 标准弹成本低，每发 $1、每盒 $10。", "共用口径可配合以 AMP-9 为主的小队补给计划。"],
    cautions: ["Alpha 1 未记录价格、重量或进度条件。", "即使弹药便宜，全自动副武器仍可能很快耗尽弹匣。", "$70 的 GGX 33 发弹匣及 $110 的 50 发弹鼓记录，不能证明 GGX 18 的最终相容性。"],
    unconfirmedFacts: ["Alpha 1 未记录价格、重量与进度条件，抢先体验或正式版也仍未确认。", "全自动调整、弹匣相容性、后座力和伤害可能与目前抢先体验版本或正式版不同。"]
  },
  judge: {
    summary: "Judge 在 Alpha 1 是售价 $250 的 .45 Colt 副武器，但射击模式、重量与进度条件未被记录。",
    description: "Judge 的 $250 是已记录武器中最低的非零售价，也是唯一使用 .45 Colt 的型号。弹药目录显示每盒 $33，但缺失的射击模式、重量与进度资料，使它的实际表现不如价格那样明确。",
    role: "把 Judge 当作基础成本低、但实际战斗节奏仍需游戏内确认的副武器候选；规划补购时也要计入相对昂贵的 .45 Colt 弹药盒。",
    strengths: ["Alpha 1 的 $250 价格，是这些型号中已记录最低的非零武器购买价。", ".45 Colt 口径让它具有独立的副武器补给特色。", "已有 $33 的 .45 Colt 弹药盒观察记录，因此至少部分补购成本有据可查。"],
    cautions: ["Alpha 1 武器记录未包含射击模式、重量与进度条件。", "没有 Judge 的专用弹匣或容量记录。", "$250 基础价格并不能确立伤害、装填速度、有效射程或最终价值。"],
    unconfirmedFacts: ["Alpha 1 未记录射击模式、重量与进度条件，抢先体验或正式版也仍未确认。", "容量、装填表现、伤害和 Alpha 的 $250 价格可能与目前抢先体验版本或正式版不同。"]
  },
  "kh-2002": {
    summary: "KH-2002 在 Alpha 1 是重 3.17 kg、走突击经验路线的步枪，使用 5.56x45mm，提供半自动与点射；价格未被记录。",
    description: "KH-2002 是已记录三款 3.17 kg、5.56x45mm 点射突击步枪中的最后一款。与 M17S 显示 $0 不同，KH-2002 的 Alpha 1 价格未被记录，因此即使主要数据重合，也不能只依成本决定型号。",
    role: "用 KH-2002 进行受控突击射击，较长通道采半自动，短暂暴露机会采点射；它与其他型号在成本及操控上的差异，仍需后续版本证据确认。",
    strengths: ["半自动与点射提供两种受控的弹药使用方式。", "Alpha 1 的 3.17 kg 重量低于 Galil 和 FAL 记录。", "5.56x45mm 是已记录最广泛共用的口径，有利于规划更广泛的小队补给。"],
    cautions: ["未记录 Alpha 1 购买价格。", "观察记录未确立它的操控与 A-91 或 M17S 有何差异。", "虽然有 STANAG 容量与瞄具记录，但尚未确认 KH-2002 的相容性。"],
    unconfirmedFacts: ["未记录 Alpha 1 价格；抢先体验与正式版的售价仍未确认。", "型号特有的操控、伤害、后座力及配件适配可能在抢先体验或正式版改变。"]
  },
  "ah-6m-miniguns": {
    summary: "AH-6M Miniguns 在 Alpha 1 以 $7,000 战斗直升机的形式出现，但购买门槛无法辨读。",
    description: "AH-6M Miniguns 是 Alpha 1 商店中记录的轻型 AH-6 家族武装成员。战斗直升机标签与 $7,000 标价，将它与偏重运输的 MH-6 区分开来；但无法辨读的门槛及未记录的武器表现，使本页只能作为定位指南，而不是最终性能表。",
    role: "把 AH-6M 当作进行短暂攻击通过的轻型空中压制选项；交战之间应保全机体，因为每次补购都要承担观察到的 Alpha 经济成本。",
    strengths: ["已观察到的 Alpha 1 $7,000 价格低于 AH-6R Rockets 和 Havoc。", "战斗直升机定位将它与可直接购买的 MH-6 运输机区分开来。", "Miniguns 名称让小队在购买前，有明确理由将它与搭载火箭的 AH-6R 比较。"],
    cautions: ["Alpha 1 购买门槛无法辨读，因此不能只凭价格推定可用性。", "未记录旋转机枪的伤害、弹药、汇聚方式与有效射程。", "耐久、乘员要求、操控及反制措施仍未知。"],
    unconfirmedFacts: ["无法辨读的 Alpha 1 门槛，在抢先体验或正式版仍未确认。", "旋转机枪性能、飞行操控、耐久与 Alpha 的 $7,000 价格，可能与目前抢先体验版本或正式版不同。"]
  },
  "ah-6r-rockets": {
    summary: "AH-6R Rockets 在 Alpha 1 标示为售价 $12,500 的火箭直升机，门槛无法辨读。",
    description: "AH-6R Rockets 将轻型家族的旋转机枪特色换成火箭直升机定位，已记录价格也高得多。Alpha 1 的 $12,500 标价意味着购买时应比 AH-6M 更审慎，但火箭载量、爆炸效果、补装方式和锁定条件，都没有清楚到可视为已定案的记录。",
    role: "将 AH-6R 留给有计划的空袭时机，让小队辨识高价值目标并支援安全撤出，避免在缺乏协调时暴露昂贵直升机。",
    strengths: ["火箭直升机标签表明它与 AH-6M Miniguns 有不同的攻击定位。", "已观察到的家族命名，让 AH-6M 成为直接比较成本与定位的对象。", "Alpha 1 售价 $12,500，低于 Havoc，但仍属专用战斗飞行器。"],
    cautions: ["Alpha 1 画面中的购买门槛无法辨读。", "未记录火箭数量、范围伤害、准确度与补充方式。", "已观察到的高补购价格，增加了无支援攻击航程的风险。"],
    unconfirmedFacts: ["无法辨读的 Alpha 1 门槛，在抢先体验或正式版仍未确认。", "火箭载量、伤害、补充方式、操控与价格可能与目前抢先体验版本或正式版不同。"]
  },
  bobcat: {
    summary: "Alpha 1 载具商店中的 Bobcat 是售价 $500、可直接购买的轻型运输载具。",
    description: "Bobcat 位于已记录载具目录中价格最低的一端。轻型运输定位和已观察到的直接购买方式，使它成为 Alpha 1 基本机动能力最清楚的参考点；但记录未确立座位、货物空间、防护、速度，或上市版本是否保留同样的取得方式。",
    role: "小队更需要机动性而非武器、防护或货运容量时，可用低投入的 Bobcat 执行短距离转移及接回人员的行程。",
    strengths: ["观察价格 $500，是这 20 款已记录载具中最低的。", "Alpha 1 清楚显示可直接购买，记录没有显示等级路线。", "轻型运输标签让购买决策聚焦于移动，而非战斗装备。"],
    cautions: ["直接购买仅在 Alpha 1 被观察到，不是最终取得方式的承诺。", "未记录座位数、储存空间、速度、耐久与地形操控。", "低商店价格不代表燃料、维修或补购压力也低。"],
    unconfirmedFacts: ["直接购买与 $500 价格都是 Alpha 1 观察结果，不是已确认的抢先体验或正式版规则。", "抢先体验或正式版的容量、防护、操控、储存空间与运作成本仍未确认。"]
  },
  "dune-buggy": {
    summary: "Dune Buggy 在 Alpha 1 是售价 $1,500、要求驾驶员等级 10 的快速运输载具。",
    description: "Dune Buggy 是已记录目录中明确以速度为导向的地面运输载具。驾驶员等级 10 门槛和 Alpha 1 的 $1,500 价格，使它高于 Bobcat 的入门机动选择；但「快速」只是商店定位标签，不能证明最终极速、加速、抓地力或碰撞承受能力。",
    role: "抵达时间比防护更重要时，可选 Dune Buggy 快速侦察与改换路线；规划时避免假定尚未验证的乘员或货物容量。",
    strengths: ["快速运输是其 Alpha 1 明示定位。", "已观察到的 $1,500 价格低于较大型的 Kodiak 与 Humvee 家族。", "驾驶员等级 10 清楚标示了当时进度要求，而非无法辨读的门槛。"],
    cautions: ["未记录最终速度、加速、抓地力与翻车行为。", "第 1 赛季列出驾驶员等级 8；Alpha 1 的驾驶员等级 10 门槛属于历史资料。", "没有记录防护、座位数或货物规格。"],
    unconfirmedFacts: ["第 1 赛季列出驾驶路线解锁费 $25,000；Alpha 1 的 $1,500 载具购买价仍未在抢先体验中验证。", "速度、操控、耐久、座位与货物行为可能与目前抢先体验版本或正式版不同。"]
  },
  "flakpanzer-gepard": {
    summary: "Flakpanzer Gepard 在 Alpha 1 标示为售价 $8,000、要求战士等级 45 的防空装甲载具。",
    description: "Flakpanzer Gepard 是已记录名单中的专用防空装甲型号，具有战士进度门槛，价格低于 L2A6 与 SPH-2。目录定位支持将它理解为限制敌机活动的选择，但目标侦测、火炮运作、装甲、乘员需求与有效覆盖范围，尚未记录为最终系统规格。",
    role: "将 Gepard 部署在能保护高价值地面资产和可能空中进路的位置，并在附近保留地面支援；防空定位不代表能安全面对所有威胁。",
    strengths: ["防空装甲载具是这 20 条载具观察记录中的独特定位。", "Alpha 1 的 $8,000 标价低于另外两种战士路线重型资产。", "商店记录中的战士等级 45 提供了可辨认的进度目标。"],
    cautions: ["未记录侦测距离、弹药、火炮伤害、仰角与目标追踪。", "防空标签不能确立对坦克、火炮或步兵的防护能力。", "战士等级 45 和 $8,000 价格仅为预发布版本观察结果。"],
    unconfirmedFacts: ["抢先体验或正式版的战士等级 45 与 $8,000 价格仍未确认。", "装甲、防空侦测、武器性能、乘员需求和弹药可能与目前抢先体验版本或正式版不同。"]
  },
  havoc: {
    summary: "$18,000 的 Havoc 标价仅适用于 Alpha 记录；第 1 赛季一名飞行员的报告描述了更高的完整出击成本，以及强力的防空反制。",
    description: "Havoc 位居已观察载具价格清单顶端，定位是广义攻击直升机，而非 AH-6 那种按武器命名的标签。这使它成为 Alpha 1 快照中经济投入最大的空中选择，但配装、装甲、乘员配置与取得条件仍不足以进行最终比较。",
    role: "只有在团队能提供目标情报、空域态势掌握，以及避开密集还击的撤离路线时，才投入高价值攻击飞行器 Havoc。",
    strengths: ["Alpha 1 明确标示攻击直升机定位，与运输飞行器区分。", "$18,000 标价使它成为已观察商店中最明确的高投入飞行器选择。", "其定位可用来比较较便宜的 AH-6M 与 AH-6R 攻击型号。"],
    cautions: ["购买门槛无法辨读，取得路径未被记录。", "未记录武器、装甲、感测器、反制措施和乘员要求。", "近期飞行员提出的成本及解锁说法来自单一玩家报告，不是官方价目表。", "高价值飞行器也可能被协同防空压制；花钱前应评估航线。"],
    unconfirmedFacts: ["无法辨读的 Alpha 1 门槛，在抢先体验或正式版仍未确认。", "9 月 20 日一名第 1 赛季飞行员报告要求飞行员等级 35，完整配装出击约需 $22,000–$30,000；这是未经验证的社群观察。", "配装、装甲、乘员配置、飞行模型、反制措施与当前价格，均须在当前游戏客户端验证。"]
  },
  "humvee-m249": {
    summary: "Humvee M249 结合武装运输定位、Alpha 1 的 $3,750 售价，以及驾驶员等级 25 门槛。",
    description: "Humvee M249 在受防护的 Humvee 平台上加入具名支援武器，价格仍未达到已记录的 Minigun 型号。其驾驶员等级 25 比 Kodiak M249 晚得多，因此即使未记录武器性能与架设细节，两款 $3,750 武装运输载具也代表不同的进度决策。",
    role: "用 Humvee M249 运送小队，同时让乘客或射手担任防御火力角色；路线规划不能依赖尚未确认的枪座或车舱防护。",
    strengths: ["已观察到的武装运输定位，结合了移动能力与具名 M249 枪座。", "Alpha 1 的 $3,750 比无武装 Humvee 高 $750，低于 Minigun 型号。", "驾驶员等级 25 明确区别于要求驾驶员等级 8 的 Kodiak M249。"],
    cautions: ["未记录 M249 弹药、转向范围、防护、准确度与射手暴露程度。", "驾驶员等级 25 是 Alpha 1 观察结果，不是最终解锁要求。", "座位数、车舱防护、货物容量与维修行为仍未知。"],
    unconfirmedFacts: ["抢先体验或正式版的驾驶员等级 25 与 $3,750 价格仍未确认。", "M249 表现、防护、座位、货物容量与操控可能与目前抢先体验版本或正式版不同。"]
  },
  "humvee-minigun": {
    summary: "Humvee Minigun 在 Alpha 1 是售价 $4,500 的重型武装运输载具，但商店画面中的门槛无法辨读。",
    description: "Humvee Minigun 是已记录最昂贵的 Humvee，也是唯一标示为重型武装运输的型号。比基础型高 $1,500，使它在 Alpha 1 属于不同购买级距；但门槛无法辨读且缺少武器资料，不能断言射速、弹药供应、装甲或相较 M249 型号的价值。",
    role: "把 Humvee Minigun 视为移动重火力平台，仍需受保护的路线、协调良好的射手和脱离计划，不应把它当成性能未经验证的前线装甲车。",
    strengths: ["重型武装运输是 Humvee 家族中已观察到的独特定位。", "Minigun 名称将预期武器特色与较便宜的 M249 型号区分。", "Alpha 1 的 $4,500 价格仍低于较大型的武装 Ural Defender M249。"],
    cautions: ["Alpha 1 门槛无法辨读，取得路径未知。", "未记录旋转机枪弹药、启转行为、转向范围、伤害与射手暴露程度。", "重型武装运输只是定位标签，不能确认具备坦克等级防护。"],
    unconfirmedFacts: ["无法辨读的 Alpha 1 门槛，在抢先体验或正式版仍未确认。", "旋转机枪性能、车辆防护、容量、操控与价格可能与目前抢先体验版本或正式版不同。"]
  },
  humvee: {
    summary: "基础 Humvee 在 Alpha 1 商店中是售价 $3,000、于驾驶员等级 15 解锁的防护运输载具。",
    description: "无武装 Humvee 界定了该家族在 Alpha 1 的防护运输基准。它与偏重货运的 Kodiak Pickup 同价，低于两种武装 Humvee；但「防护」仍只是分类标签，未记录装甲门槛、座位配置、储存上限或生存能力比较。",
    role: "当车载武器的重要性低于控制购买成本时，用基础 Humvee 执行受保护的人员移动及争夺道路上的转移，将支出维持在武装型号之下。",
    strengths: ["防护运输是 Alpha 1 明示定位，不是推测的装甲能力。", "观察价格 $3,000，低于两款搭载武器的 Humvee。", "在已记录的驾驶路线上，驾驶员等级 15 介于 Dune Buggy 与 Humvee M249 之间。"],
    cautions: ["未记录装甲值、伤害模型、座位数或货物上限。", "防护运输不保证能安全应对地雷、重武器或伏击。", "驾驶员等级 15 与 $3,000 价格可能在 Alpha 1 之后改变。"],
    unconfirmedFacts: ["抢先体验或正式版的驾驶员等级 15 与 $3,000 价格仍未确认。", "防护、座位、储存空间、机动性、燃料和维修行为可能与目前抢先体验版本或正式版不同。"]
  },
  "kodiak-m249": {
    summary: "Kodiak M249 在 Alpha 1 是售价 $3,750、要求驾驶员等级 8 的武装运输载具。",
    description: "Kodiak M249 是已记录目录中，可辨认驾驶等级门槛最低的武装运输载具。它与 Humvee M249 同为 $3,750 且定位相同，却要求驾驶员等级 8 而非等级 25；因此即使尚未考虑未记录的操控、防护与枪座表现，底盘选择和进度时机也已是不同问题。",
    role: "驾驶路线初期的小队需要移动武器支援、但不想提高到受防护的 Ural Defender 家族级距时，可选 Kodiak M249；底盘性能仍须视为未确认。",
    strengths: ["驾驶员等级 8 是已观察武装地面载具中的最低等级门槛。", "武装运输定位将 Kodiak 通用家族与具名 M249 枪座结合。", "Alpha 1 的 $3,750 与门槛较晚的 Humvee M249 相同，可直接比较进度差异。"],
    cautions: ["记录未包含武器弹药、转向范围、防护或射手暴露程度。", "驾驶员等级 8 不能证明该型号会一直是早期解锁选项。", "未记录座位、货物取舍、操控、耐久及维修成本。"],
    unconfirmedFacts: ["抢先体验或正式版的驾驶员等级 8 与 $3,750 价格仍未确认。", "M249 表现、座位、货物、防护、操控与耐久可能与目前抢先体验版本或正式版不同。"]
  },
  "kodiak-pickup": {
    summary: "Kodiak Pickup 在 Alpha 1 标示为售价 $3,000、另需 $15,000 解锁的货运载具。",
    description: "Kodiak Pickup 是唯一明确标示货运定位的已记录载具。商店同时显示 $3,000 购买价与独立的 $15,000 解锁费，形成不同于等级门槛型号的两阶段 Alpha 1 成本；货物体积、装载规则，以及解锁是否永久，均未被记录。",
    role: "当补给行程更重视货运定位，而非基础 Kodiak 较低的观察价格或 M249 型号的枪座时，选用 Kodiak Pickup。",
    strengths: ["货运是已观察载具清单中的独特定位。", "Alpha 1 的 $3,000 购买价与基础 Humvee 相同，但服务于不同后勤用途。", "独立的 $15,000 解锁费可清楚辨读，因此能明确讨论已观察到的完整入门成本。"],
    cautions: ["记录未说明 $15,000 解锁是永久、可重复支付，还是绑定帐号。", "未记录货物栏位、装载互动、物品限制和损失行为。", "未记录防护、座位、速度、地形操控或燃料行为。"],
    unconfirmedFacts: ["抢先体验或正式版的 $15,000 解锁费和 $3,000 购买价仍未确认。", "解锁保留、货物规则、容量、座位、防护与操控可能与目前抢先体验版本或正式版不同。"]
  },
  kodiak: {
    summary: "基础 Kodiak 在 Alpha 1 是可直接购买、售价 $2,500 的通用运输载具。",
    description: "在已观察商店中，基础 Kodiak 介于 Bobcat 与专用 Kodiak 型号之间。通用运输分类与可直接购买的状态，使它成为该家族在 Alpha 1 的一般用途选项；但记录并未定义其具体用途，包括乘客空间、储存、拖曳或越野表现。",
    role: "当小队不需要 Pickup 明确的货运定位或 M249 型号的枪座时，可将 Kodiak 作为一般移动选项，并在当前版本确认实际容量。",
    strengths: ["Alpha 1 中观察到可直接购买，未列出驾驶员进度或金钱解锁门槛。", "标价 $2,500，低于两款专用 Kodiak 型号。", "通用运输的已观察定位，比偏重速度的 Dune Buggy 更广泛。"],
    cautions: ["可直接购买仅是 Alpha 1 的状态，之后未必仍然适用。", "通用标签未说明座位、货物、拖曳、防护或地形表现。", "除定位与价格外，未记录基础型号与 Pickup 的差异。"],
    unconfirmedFacts: ["可直接购买与 $2,500 价格尚未确认为抢先体验或正式版规则。", "座位、货物、拖曳、防护、操控、燃料及维修行为，在抢先体验或正式版中仍未确认。"]
  },
  l2a6: {
    summary: "L2A6 在 Alpha 1 目录中是售价 $14,000、要求战士等级 35 的主战坦克。",
    description: "L2A6 是清单中唯一标示为主战坦克的型号，价格也是已记录载具的第二高。战士等级 35 的门槛早于 Gepard 与 SPH-2，但 Alpha 1 记录未确定装甲分区、武器、乘员位置、弹药、机动性，或维持运作所需的支援。",
    role: "让 L2A6 在团队支援下对开阔路线施加重型火力压力，配合步兵警戒与后勤，而不是认为主战坦克的标签就能消除位置风险。",
    strengths: ["在 20 款型号的目录中，主战坦克是独有的已观察分类。", "战士等级 35 是三笔装甲与火炮记录中最早的可辨认门槛。", "Alpha 1 的 $14,000 价格，明确区隔了它与运输载具及较轻型防空装甲载具。"],
    cautions: ["未记录装甲值、弱点、武器、弹药、乘员人数或维修系统。", "主战坦克定位不能证明它不受步兵、飞行器或火炮威胁。", "战士等级 35 与 $14,000 购买价不代表最终进度或经济设定。"],
    unconfirmedFacts: ["抢先体验或正式版的战士等级 35 与 $14,000 价格仍未确认。", "装甲、武器、弹药、乘员分工、机动性、燃料及维修，可能与目前抢先体验版本或正式版不同。"]
  },
  "mh-6": {
    summary: "MH-6 在 Alpha 1 被观察为可直接购买、售价 $6,250 的轻型空中运输载具。",
    description: "MH-6 是已记录目录中最便宜的直升机，也是唯一同时具有运输定位且被观察到可直接购买的飞行器。它可作为 AH-6 家族的非战斗对照，但乘客位置、降落表现、载荷、生存能力，以及商店门槛以外是否另有飞行员要求，都未被记录。",
    role: "当运输比车载武器标签更重要时，用 MH-6 执行轻型空中渗透、接人与快速转移，保守选择降落区和返航路线。",
    strengths: ["Alpha 1 的 $6,250 价格，是已观察飞行器中的最低标价。", "商店画面可见直接购买，而非无法辨读或等级门槛。", "轻型空中运输让它在武装 AH-6 型号之外，具有不同的机动定位。"],
    cautions: ["仅在 Alpha 1 观察到可直接购买，不保证最终可用性。", "未记录座位数、乘客暴露程度、飞行操控、耐久或降落容错。", "运输标签不能证明货运能力，也不能确定最终装备配置没有武器。"],
    unconfirmedFacts: ["可直接购买与 $6,250 价格尚未确认为抢先体验或正式版规则。", "抢先体验或正式版的座位、装备配置、飞行操控、耐久、货物行为及飞行员要求仍未确认。"]
  },
  "sph-2": {
    summary: "第 1 赛季将火炮坦克类别改为生涯等级 90、解锁费 $500,000；SPH-2 商店价格与乘员操作流程仍属特定版本的观察。",
    description: "SPH-2 是已记录商店中唯一的自行火炮型号，要求战士等级 55。后来的封闭测试视频显示三个乘员位置、稳定步骤、间接射击距离设定、155 mm 弹药及手动装填流程。Alpha 画面标示购买价 $10,000，较晚的创作者攻略则显示先支付独立的 $400,000 解锁费，再以 $8,000 重复购买；这项冲突保留为版本证据，不合并成单一最终价格。",
    role: "将 SPH-2 作为需协同作业的间接火力单位，仰赖目标资讯、受保护的射击位置及后勤；当位置变得容易预测时就转移。",
    strengths: ["稳定平台可维持可用的瞄准视野，方便反复修正间接射击。", "已观察乘员位置分别负责驾驶、155 mm 主炮与顶部防护火力。", "正确完成手动装填输入顺序，可以缩短等待时间。"],
    cautions: ["驾驶无法边开车边射击；单人操作必须停车并切换座位。", "可预测的射击位置容易遭到无人机、飞行器、反炮兵火力与猎杀步兵攻击。", "第 1 赛季确认的是火炮坦克类别门槛，不是当前的 SPH-2 商店价格；价格、射程与炮弹数值都应在当前版本核对。"],
    unconfirmedFacts: ["Alpha 的 $10,000 购买价与后来 Beta 的 $8,000 重复购买价互相冲突；两者均未确认适用于抢先体验。", "一名第 1 赛季玩家回报重复购买为 $8,000、配装出击为 $11,000–$13,000；尚未在当前商店独立验证。", "官方更新记录使用火炮坦克而非 SPH-2 名称；当前型号身份与重复购买价需要在当前客户端确认。", "射程、爆炸效果、装甲与弹药经济需要在当前客户端确认。"]
  },
  "uh-1y-miniguns": {
    summary: "UH-1Y Miniguns 在 Alpha 1 是售价 $8,000 的武装通用直升机，解锁门槛无法辨读。",
    description: "UH-1Y Miniguns 为较大型的 UH-1Y 家族加入武装通用定位，比基础运输型号的已记录价格只高 $600。Alpha 1 的价差如此小，更突显无法辨读的门槛有多重要：缺少取得条件、武器、座位与载荷细节，就不能把武装型号视为各方面都更好的运输选项。",
    role: "用 UH-1Y Miniguns 执行护送渗透和撤离路线，在机载掩护火力可能派上用场时支援行动，但应优先完成运输任务，而非追求未验证的武器输出。",
    strengths: ["武装通用直升机兼具运输家族身份与具名武器配置。", "观察价格 $8,000，只比基础 UH-1Y 的标价高 $600。", "同家族配对提供清楚的武装型与运输型购买比较。"],
    cautions: ["Alpha 1 门槛无法辨读，因此不能直接与基础型号的飞行员门槛比较取得条件。", "未记录旋转机枪数量、射界、弹药、伤害或射手暴露程度。", "乘客容量、货物行为、耐久及操控差异仍然未知。"],
    unconfirmedFacts: ["无法辨读的 Alpha 1 门槛，在抢先体验或正式版中仍未确认。", "旋转机枪表现、座位、载荷、耐久、飞行操控与价格，可能与目前抢先体验版本或正式版不同。"]
  },
  "uh-1y": {
    summary: "基础 UH-1Y 在 Alpha 1 是售价 $7,400、要求飞行员等级 10 的空中运输载具。",
    description: "基础 UH-1Y 是已记录目录中受进度门槛限制的空中运输载具，价格高于可直接购买的 MH-6，略低于武装 UH-1Y Miniguns。Alpha 1 中可辨认飞行员等级 10，但未记录其座位、货物、飞行特性、防护，以及与武装型号的确切差异。",
    role: "达到已观察飞行员门槛后，用 UH-1Y 执行有计划的小队移动与重复空运后勤；降落区应以运输安全为准，而不是根据缺少武器标签作判断。",
    strengths: ["空中运输是 Alpha 1 明示定位，与轻型及武装直升机分类不同。", "飞行员等级 10 是已记录载具组中唯一可辨认的飞行员进度门槛。", "观察价格 $7,400 介于 MH-6 与 UH-1Y Miniguns 之间，可供家族型号比较。"],
    cautions: ["飞行员等级 10 与 $7,400 价格尚未确认为最终取得规则。", "未记录乘客座位、货物容量、飞行模型、耐久或反制措施。", "空中运输标签不能证明后续版本中该型号没有武器或具备防护。"],
    unconfirmedFacts: ["抢先体验或正式版的飞行员等级 10 与 $7,400 价格仍未确认。", "座位、货物、装备配置、防护、飞行操控与反制措施，可能与目前抢先体验版本或正式版不同。"]
  },
  "ural-defender-m249": {
    summary: "Ural Defender M249 在 Alpha 1 是售价 $6,750、要求驾驶员等级 40 的武装后勤载具。",
    description: "Ural Defender M249 是已记录 Ural 家族的最高阶型号：武装后勤定位、驾驶员等级 40 门槛，以及 Alpha 1 的 $6,750 价格。它在具防护定位的 Defender 上加入具名武器，但没有记录说明为装设 M249 枪座，牺牲了多少货物容量、防护或机动性。",
    role: "用 Ural Defender M249 的车载防卫能力护送高价值补给运输，优先确保路线安全与卸载，而不是缺乏支援时绕路投入战斗。",
    strengths: ["武装后勤是已观察载具型号中的独特定位。", "M249 名称将它与基础 Ural 和防护型 Defender 区隔。", "驾驶员等级 40 与 $6,750 使已记录的进度及购买步骤清楚可辨。"],
    cautions: ["未记录 M249 弹药、射界、防护、精准度或射手暴露程度。", "货物容量，以及后勤空间与武器配置的取舍仍然未知。", "驾驶员等级 40 与 $6,750 价格可能在 Alpha 1 之后改变。"],
    unconfirmedFacts: ["抢先体验或正式版的驾驶员等级 40 与 $6,750 价格仍未确认。", "武器表现、货物、防护、座位、机动性及使用成本，可能与目前抢先体验版本或正式版不同。"]
  },
  "ural-defender": {
    summary: "Ural Defender 在 Alpha 1 是售价 $6,000、要求驾驶员等级 30 的防护后勤载具。",
    description: "Ural Defender 在基础卡车与武装 M249 型号之间，加入防护后勤选项。驾驶员等级 30 与 Alpha 1 的 $6,000 价格均可辨认，但「防护」并不是量测过的装甲结论；记录也未定义货物体积、乘客座位、路线表现，或比 Ural 多了多少防护。",
    role: "当较高风险的补给路线更需要已观察的防护后勤定位，而非基础 Ural 较低的购买价或武装型号的掩护武器时，可选用 Ural Defender。",
    strengths: ["防护后勤是明确观察到的独立定位，而非泛称运输。", "Alpha 1 的 $6,000 价格，将它放在 Ural 与 Ural Defender M249 之间。", "驾驶员等级 30 为中阶 Ural 型号提供可辨认的进度门槛。"],
    cautions: ["未记录装甲评级、伤害模型、货物容量或座位数。", "防护后勤不能确认它能抵挡所有伏击或武器类型。", "驾驶员等级 30 与 $6,000 价格仍属发售前观察。"],
    unconfirmedFacts: ["抢先体验或正式版的驾驶员等级 30 与 $6,000 价格仍未确认。", "防护、货物、座位、操控、燃料、维修及损失行为，可能与目前抢先体验版本或正式版不同。"]
  },
  ural: {
    summary: "基础 Ural 在 Alpha 1 商店中是购买价 $5,000、另需 $60,000 解锁的后勤卡车。",
    description: "基础 Ural 是专用后勤家族的起点，购买价 $5,000，并有已记录载具目录中可见的最高现金解锁费。Alpha 1 额外的 $60,000 解锁费主导其入门成本，但记录未说明解锁是否保留，也未量化货物、乘客、防护、速度或补给互动。",
    role: "先计入两层已观察成本，再用 Ural 执行有计划的大宗后勤与重复补给路线，借由护送及严守路线来弥补防护资料不足。",
    strengths: ["后勤卡车是 Alpha 1 明示定位，将它与一般人员运输区隔。", "观察购买价 $5,000，低于两款 Ural Defender。", "$60,000 解锁费可辨认，明确揭示重要的第二层成本，而非将其藏在等级标签后。"],
    cautions: ["第 1 赛季列出驾驶员等级 3 及驾驶员路线解锁费 $35,000，与任何重复购买载具的费用分开。", "未记录货物容量、装载规则、补给类型、乘客座位或损失行为。", "未记录防护、操控、燃料、维修或越野规格。"],
    unconfirmedFacts: ["Alpha 1 的 $5,000 载具购买价尚未确认适用于抢先体验；Alpha 1 的 $60,000 解锁费是历史资料。", "解锁保留、货物规则、补给互动、防护、座位及操控，可能与目前抢先体验版本或正式版不同。"]
  },
  stingray: {
    summary: "Stingray 是 Beta 实机视频中出现的地面发射反载具无人机；当前价格、解锁条件与伤害仍未验证。",
    description: "Stingray 是以发射器与控制器操作的单程反载具无人机系统，不是一般可驾驶载具。封闭测试建造视频展示了发射筒与手持控制器。9 月的实机片段示范对敌方载具与火炮的攻击，但两个来源都未确定当前商店价格、解锁条件、伤害数值或必杀效果。",
    role: "发射前先确认高价值载具或固定火炮目标，让操作员处于掩体内，并安排队友监视发射位置。较早的飞行教学建议在末段控制修正，而非接近途中用光所有加速；操控应在当前版本重新测试。",
    strengths: ["远端反载具攻击可对已知的固定火炮或重生支援位置施压。", "引用的 Beta 建造视频可直接看见发射硬件与控制器。", "9 月实机片段提供较新的 Stingray 反载具操作示范。"],
    cautions: ["控制无人机时操作员可能暴露，因此应从掩体发射，而不是在开阔 FOB 发射。", "不要假定 Beta 的飞行操控、瞄准行为或伤害仍与当前版本相同。", "目前购买价、解锁要求、部署成本与伤害尚未经独立验证。"],
    unconfirmedFacts: ["没有当前商店截图或官方说明可验证价格、解锁、部署成本或伤害。", "Beta 飞行方法可能与目前操控和瞄准行为不同。"]
  },
};

const generatedSummaries: Readonly<Record<string, string>> = {
  "Assault XP rifle observed with 5.56x45mm ammunition and semi or full-auto fire in Alpha 1.": "Alpha 1 中观察到的突击经验值步枪，使用 5.56x45mm 弹药，支援半自动或全自动射击。",
  "Support XP light machine gun using 5.56x45mm; price was not captured in the observed build.": "使用 5.56x45mm 弹药的支援经验值轻机枪；观察版本中未记录价格。",
  "Support XP light machine gun observed with 7.62x54mmR ammunition and full-auto capability.": "已观察到使用 7.62x54mmR 弹药、具备全自动能力的支援经验值轻机枪。",
  "Recon XP semi-automatic marksman rifle using 7.62x39mm ammunition.": "使用 7.62x39mm 弹药的侦察经验值半自动精确射手步枪。",
  "Recon XP semi-automatic marksman rifle using 7.62x54mmR ammunition.": "使用 7.62x54mmR 弹药的侦察经验值半自动精确射手步枪。",
  "Semi-automatic .45 ACP sidearm observed in the pre-release catalogue.": "发售前目录中观察到的半自动 .45 ACP 副武器。",
  "Support XP 12 Gauge shotgun observed in the pre-release catalogue.": "发售前目录中观察到的支援经验值 12 号口径霰弹枪。",
  "Support XP break-action 12 Gauge shotgun observed as a low-cost option.": "被观察为低成本选项的支援经验值折开式 12 号口径霰弹枪。",
  "Medic XP SMG using 9x19mm ammunition with semi and full-auto fire.": "使用 9x19mm 弹药、支援半自动与全自动射击的医护经验值冲锋枪。",
  "Medic XP SMG using .45 ACP ammunition with semi and full-auto fire.": "使用 .45 ACP 弹药、支援半自动与全自动射击的医护经验值冲锋枪。",
  "Recon XP bolt-action sniper rifle using .308 Winchester ammunition.": "使用 .308 Winchester 弹药的侦察经验值栓动狙击步枪。",
  "Recon XP bolt-action sniper rifle using 7.62x54mmR ammunition.": "使用 7.62x54mmR 弹药的侦察经验值栓动狙击步枪。",
  "Recon XP light break-action rifle using 5.56x45mm ammunition.": "使用 5.56x45mm 弹药的侦察经验值轻型折开式步枪。",
  "Specialist launcher identified in Closed Beta catalogue coverage; exact ammunition, price, and unlock remain unconfirmed.": "封闭测试目录介绍中辨识出的专用发射器；确切弹药、价格与解锁条件仍未确认。",
  "84mm specialist launcher observed in pre-release catalogue coverage.": "发售前目录介绍中观察到的 84mm 专用发射器。",
  "40mm multiple grenade launcher observed in pre-release catalogue coverage.": "发售前目录介绍中观察到的 40mm 多发榴弹发射器。",
  "93mm specialist launcher observed in the Alpha catalogue.": "Alpha 目录中观察到的 93mm 专用发射器。",
  "Stationary support-system identifier observed in Closed Beta catalogue coverage; exact function and cost remain build-sensitive.": "封闭测试目录介绍中观察到的固定式支援系统识别名称；确切功能与成本仍须依版本判读。",
  "Stationary anti-air system identified in Closed Beta catalogue coverage; cost and deployment rules remain unconfirmed.": "封闭测试目录介绍中辨识出的固定式防空系统；成本与部署规则仍未确认。",
  "Stationary mortar system identified in Closed Beta catalogue coverage; range, ammunition, and cost remain unconfirmed.": "封闭测试目录介绍中辨识出的固定式迫击炮系统；射程、弹药与成本仍未确认。",
  "Stationary close-in defense system identified in Closed Beta catalogue coverage; exact behavior remains unconfirmed.": "封闭测试目录介绍中辨识出的固定式近程防御系统；确切运作方式仍未确认。",
};

const subtypeNames: Readonly<Record<string, string>> = {
  "Assault rifle": "突击步枪", LMG: "轻机枪", "Marksman rifle": "精确射手步枪",
  Sidearm: "副武器", Shotgun: "霰弹枪", SMG: "冲锋枪", "Sniper rifle": "狙击步枪",
  Launcher: "发射器", "Stationary support": "固定式支援", "Stationary anti-air": "固定式防空",
  "Stationary artillery": "固定式火炮", "Stationary defense": "固定式防御",
};

function exactTranslation(dictionary: Readonly<Record<string, string>>, source: string, context: string): string {
  if (!Object.hasOwn(dictionary, source)) {
    throw new Error(`Missing zh-cn item prose translation (${context}): ${source}`);
  }
  return dictionary[source];
}

// These are translations of catalogueRecordToItem's actual template, not replacements for authored prose.
function generatedProse(item: WardogsItem): AuthoredProse {
  const summary = exactTranslation(generatedSummaries, item.summary, `${item.slug}/summary`);
  const subtype = exactTranslation(subtypeNames, item.subtype, `${item.slug}/subtype`);
  return {
    summary,
    description: `${summary} 本记录将已观察的发售前事实与未知的抢先体验平衡设定分开；若较新的第一方资料或可直接观察的版本确认变动，便会更新。`,
    role: `只有当小队能支援弹药、替换成本及目前目标时，才依 ${item.name} 已观察到的${subtype}定位使用它。`,
    strengths: [
      `${item.name} 在发售前目录中有明确记录，其定位并非根据现实世界用途推测。`,
      `可见的${subtype}分类，让它能与相同目录筛选条件下的记录比较。`,
      "未知栏位仍会显示，避免旧测试版本的数值变成永久建议。",
    ],
    cautions: [
      "这些发售前观察，在价格、操控、伤害、可用性与解锁条件上，可能与目前抢先体验版本不同。",
      "目录中的识别名称，不能证明最终配件、弹药或进度相容性。",
      "与较新视频比较本记录前，先查看每项事实的版本标签。",
    ],
    unconfirmedFacts: [
      `${item.name} 当前的抢先体验与正式版数值，尚未从当前版本验证。`,
      "伤害、操控、价格、可用性与相容性，都可能随新版本改变。",
    ],
  };
}

const factSentences: Readonly<Record<string, string>> = {
  "Observed across creator footage: stabilize the platform before firing and use a manual reload sequence": "多段创作者视频中的观察：射击前稳定平台，并使用手动装填流程。",
  "Observed across creator footage: driver, main-gun and top-gunner positions": "多段创作者视频中的观察：有驾驶、主炮及顶部射手位置。",
  "Official Season 1 Artillery Tank category: Career level 90 and $500,000 one-time unlock; model association comes from the versioned catalogue": "官方第 1 赛季火炮坦克类别：生涯等级 90，且一次性解锁费为 $500,000；与具体型号的对应来自特定版本目录。",
  "The launch tube and handheld controller are visible in the cited Closed Beta building footage.": "引用的封闭测试建造视频中，可看见发射筒与手持控制器。",
  "The cited September gameplay clip shows Stingray use against enemy vehicles and artillery.": "引用的 9 月实机片段，展示使用 Stingray 攻击敌方载具与火炮。",
  "Evidence tier: build-capture.": "证据层级：版本实机采集。",
  "Evidence tier: corroborated-community.": "证据层级：经交叉佐证的社群资料。",
  "Official Team17 press-kit gameplay frame identifies the equipped M4 in the HUD; Alpha values remain build-sensitive and use the separate catalogue evidence set.": "官方 Team17 媒体资料包的实机画面，可从 HUD 辨识已装备的 M4；Alpha 数值仍须依版本判读，并采用独立的目录证据组。",
  "Official Team17 press-kit gameplay frame identifies the equipped Super-45 and .45 ACP ammunition in the HUD; Alpha values remain build-sensitive and use the separate catalogue evidence set.": "官方 Team17 媒体资料包的实机画面，可从 HUD 辨识已装备的 Super-45 与 .45 ACP 弹药；Alpha 数值仍须依版本判读，并采用独立的目录证据组。",
};

const factLabels: Readonly<Record<string, string>> = {
  Ammunition: "弹药", "Fire modes": "射击模式", Weight: "重量", Progression: "进度",
  "Alpha price": "Alpha 价格", Role: "定位", "Observed gate": "已观察门槛", Track: "进度路线",
};

const factValues: Readonly<Record<string, string>> = {
  "Standard Arrows": "标准箭矢", "12 Gauge": "12 号口径",
  "Semi / Burst": "半自动 / 点放", "Semi / Full Auto": "半自动 / 全自动",
  "Bolt-action / Magazine": "栓动 / 弹匣供弹", "Semi automatic": "半自动",
  "Pull and Release": "拉弦后释放", "Break-action": "折开式", "Bolt action": "栓动",
  "Assault XP": "突击经验值", "Medic XP": "医疗经验值", "Recon XP": "侦察经验值", "Support XP": "支援经验值",
  "Combat helicopter": "战斗直升机", "Rocket helicopter": "火箭武装直升机",
  "Light transport": "轻型运输", "Fast transport": "快速运输", "Anti-air armor": "防空装甲载具",
  "Attack helicopter": "攻击直升机", "Armed transport": "武装运输", "Heavy armed transport": "重武装运输",
  "Protected transport": "防护运输", "Cargo transport": "货运", "Utility transport": "通用运输",
  "Main battle tank": "主战坦克", "Light air transport": "轻型空中运输", "Self-propelled artillery": "自行火炮",
  "Armed utility helicopter": "武装通用直升机", "Air transport": "空中运输",
  "Armed logistics": "武装后勤", "Protected logistics": "防护后勤", "Logistics truck": "后勤卡车",
  "Anti-air launcher": "防空发射器", "Anti-vehicle launcher": "反载具发射器", "Grenade launcher": "榴弹发射器",
  "Stationary support": "固定式支援", "Stationary anti-air": "固定式防空",
  "Stationary artillery": "固定式火炮", "Stationary defense": "固定式防御",
  "Open purchase": "可直接购买", Driver: "驾驶员", Wardog: "战士", Pilot: "飞行员",
};

const ammunitionNames = new Set([
  "5.56x45mm", "5.45x39mm", "9x19mm", ".50 Cal", ".308 Winchester", ".50 AE", ".45 Colt",
  "7.62x54mmR", "7.62x39mm", ".45 ACP", "84mm", "40mm", "93mm",
]);

function translateFactValue(label: string, value: string): string {
  if (Object.hasOwn(factValues, value)) return factValues[value];
  if (label === "Ammunition" && ammunitionNames.has(value)) return value;
  if (label === "Alpha price" && /^\$[\d,]+$/.test(value)) return value;
  if (label === "Weight" && /^\d+(?:\.\d+)? kg$/.test(value)) return value.replace(" kg", " 公斤");
  if (label === "Observed gate") {
    const level = /^(Driver|Wardog|Pilot) Level (\d+)$/.exec(value);
    if (level) return `${exactTranslation(factValues, level[1], label)}等级 ${level[2]}`;
    const unlock = /^(\$[\d,]+) unlock$/.exec(value);
    if (unlock) return `${unlock[1]} 解锁费`;
  }
  throw new Error(`Missing zh-cn item fact value: ${label}: ${value}`);
}

function translateConfirmedFact(source: string): string {
  if (Object.hasOwn(factSentences, source)) return factSentences[source];
  const observed = /^Observed in (Alpha 1|Closed Beta - 21-23 Aug 2026): ([^:]+): (.+)$/.exec(source);
  if (observed) {
    const build = observed[1] === "Alpha 1" ? "Alpha 1" : "封闭测试（2026 年 8 月 21–23 日）";
    const label = exactTranslation(factLabels, observed[2], "confirmedFacts/label");
    return `于 ${build} 观察到：${label}：${translateFactValue(observed[2], observed[3])}`;
  }
  const capture = /^Creator gameplay capture from (Every Weapon Tested in WARDOGS|WARDOGS All Weapons Vendor|WARDOGS Beta live gameplay|WARDOGS Building 101) at (\d{2}:\d{2}(?::\d{2})?); the visible item name or model was matched before publication\. Numeric fields remain build-sensitive\.$/.exec(source);
  if (capture) {
    return `创作者实机采集来源为《${capture[1]}》的 ${capture[2]}；发布前已核对画面中的道具名称或型号。数值栏位仍须依版本判读。`;
  }
  throw new Error(`Missing zh-cn confirmed item fact: ${source}`);
}

const proseFields = ["summary", "description", "role", "strengths", "cautions", "confirmedFacts", "unconfirmedFacts"] as const;

// FNV-1a change detectors bind translations to reviewed English prose, not to mutable metadata.
// Recheck the translation before refreshing a signature when the source prose changes.
const sourceSignatures: Readonly<Record<string, number>> = {
  mortar: 946147160, "mobile-fob": 2123134905, littlebird: 3523625245, tank: 4241961917,
  "attack-helicopter": 4277438880, "armored-transport": 3559025905,
  "a-91": 3564184816, ak74: 1234932988, "amp-9": 2552907126, "amr-50": 52669468,
  "bmr-308": 1273688832, "bushmaster-m17s": 599086592, "compound-bow": 2629019334,
  deagle: 1363857278, fal: 3394191882, galil: 2821114921, "ggx-17": 1608308093,
  "ggx-18": 2790174075, judge: 3343345660, "kh-2002": 4103215550,
  "ah-6m-miniguns": 2410786903, "ah-6r-rockets": 1068931827, bobcat: 463663693,
  "dune-buggy": 1684686213, "flakpanzer-gepard": 174352401, havoc: 3507696841,
  "humvee-m249": 4122572175, "humvee-minigun": 2916947329, humvee: 453603387,
  "kodiak-m249": 1733401081, "kodiak-pickup": 531206343, kodiak: 2453781162,
  l2a6: 1845948473, "mh-6": 288104274, "sph-2": 1067568384,
  "uh-1y-miniguns": 1247177127, "uh-1y": 1754700448,
  "ural-defender-m249": 2859494211, "ural-defender": 4210406545, ural: 293740691,
  stingray: 2044688453, m4: 304614285, "t-21": 3745352468, "m249-saw": 1124045727,
  pkm: 318296949, sks: 221145148, svd: 102202700, m1911: 582237533,
  m500: 3984772442, mp43: 3508580848, mp5: 2993213293, "pp-19-vityaz": 1759296565,
  "super-45": 3313309640, mk22: 1660311515, "mosin-nagant": 1822467714,
  "scout-rifle-td": 246555364, sv98: 1150692023, "9k333-verba": 1410708828,
  maaws: 1953706362, "mgl-40": 3003904389, "rpg-7": 2147882199,
  loudspeaker: 3697840401, "talon-9k-sam": 389142351, "l81-mortar": 3741160330,
  "vanguard-ciws": 1376125690,
};

function sourceSignature(item: WardogsItem): number {
  const source = JSON.stringify([item.name, item.type, item.subtype, ...proseFields.map((field) => item[field])]);
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash = Math.imul(hash ^ source.charCodeAt(index), 16777619);
  }
  return hash >>> 0;
}

export function localizeItemProseZhCn(item: WardogsItem): ItemProse {
  if (!Object.hasOwn(sourceSignatures, item.slug)) {
    throw new Error(`Missing zh-cn item prose: ${item.type}/${item.slug}`);
  }
  if (sourceSignature(item) !== sourceSignatures[item.slug]) {
    throw new Error(`English item prose changed; review zh-cn translation: ${item.type}/${item.slug}`);
  }
  const prose = Object.hasOwn(authored, item.slug) ? authored[item.slug] : generatedProse(item);
  return {
    summary: prose.summary,
    description: prose.description,
    role: prose.role,
    strengths: [...prose.strengths],
    cautions: [...prose.cautions],
    confirmedFacts: item.confirmedFacts?.map(translateConfirmedFact),
    unconfirmedFacts: prose.unconfirmedFacts ? [...prose.unconfirmedFacts] : undefined,
  };
}
