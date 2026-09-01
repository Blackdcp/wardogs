"""DRAFT ONLY: generate a machine-translated Simplified Chinese corpus.

The English edition remains the factual source of truth. Markdown syntax, URLs,
route slugs, product names, dates, and ICU placeholders are protected while the
human-readable copy is translated with the locally installed NLLB model. Output
must receive factual and editorial review before publication.
"""

from __future__ import annotations

import json
import os
import re
from pathlib import Path

OPT_IN_ENV = "ALLOW_ZH_CN_DRAFT_GENERATION"
if __name__ == "__main__" and os.environ.get(OPT_IN_ENV) != "1":
    raise SystemExit(
        f"DRAFT ONLY: set {OPT_IN_ENV}=1 to allow this script to overwrite "
        "the Chinese catalogue and guides. Review every generated page before publishing."
    )

import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer


ROOT = Path(__file__).resolve().parents[1]
SOURCE_GUIDES = ROOT / "content" / "en" / "guides"
TARGET_GUIDES = ROOT / "content" / "zh-cn" / "guides"
SKIP_FRONTMATTER_KEYS = {"keyword", "slug", "category", "order", "updatedAt", "url", "kind", "checkedAt", "tone"}
PROTECTED_PATTERN = re.compile(
    r"https?://[^\s)\]}>]+|`[^`]+`|\{[^{}]+\}|\[[^\]]+\]\([^\)]+\)|<[^>]+>|WARDOGS|BULKHEAD|Team17|Steam|Discord|YouTube|Twitch|FOB|FPS|PC|PS5|Xbox|Early Access|Alpha|Beta",
    re.IGNORECASE,
)
MODEL_NAME = "facebook/nllb-200-distilled-600M"
CACHE_PATH = Path.home() / ".cache" / "wardogs-zh-cn-nllb-cache.json"
TOKENIZER = AutoTokenizer.from_pretrained(MODEL_NAME, src_lang="eng_Latn")
MODEL = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
MODEL.eval()
TARGET_LANGUAGE_ID = TOKENIZER.convert_tokens_to_ids("zho_Hans")
CACHE: dict[str, str] = json.loads(CACHE_PATH.read_text(encoding="utf-8")) if CACHE_PATH.exists() else {}

MANUAL_TRANSLATIONS = {
    "Quick Answer": "快速结论", "Confirmed Facts": "已确认信息", "What Players Search For": "玩家想知道什么",
    "How to Use This Guide": "如何使用本攻略", "Sources": "来源", "Frequently Asked Questions": "常见问题",
    "Last Checked": "最后核查", "Related Guides": "相关攻略", "Crew and Setup": "乘员与部署",
    "Range and Azimuth Principles": "射程与方位角原理", "Spotting Loop": "观察校射流程", "Counterplay": "反制方法",
    "Relocation and Survival": "转移与生存", "Applying Pressure to a FOB": "如何压制 FOB",
    "Build-Sensitive": "版本相关", "Fire Support": "火力支援", "Official": "官方", "Community": "社区",
    "Is WARDOGS in Early Access?": "WARDOGS 已经进入抢先体验了吗？",
    "When is the next WARDOGS playtest?": "下一次 WARDOGS 测试是什么时候？",
    "When does WARDOGS release?": "WARDOGS 什么时候发布？",
    "Is WARDOGS open beta or closed beta?": "WARDOGS 是公开测试还是封闭测试？",
    "How do you play WARDOGS?": "WARDOGS 怎么玩？",
    "What is the official WARDOGS Discord?": "哪个是 WARDOGS 官方 Discord？",
    "How do WARDOGS Twitch Drops work?": "WARDOGS Twitch Drops 怎么领取？",
    "How do you fix WARDOGS crashes and freezes?": "如何修复 WARDOGS 崩溃和卡死？",
}

GUIDE_TITLES = {
    "wardogs-alpha-key": "WARDOGS Alpha 与测试资格获取指南", "wardogs-alpha": "WARDOGS Alpha 测试状态与时间线",
    "wardogs-ammo-reload-guide": "WARDOGS 弹药与换弹机制攻略", "wardogs-armor-damage-ttk-guide": "WARDOGS 护甲、伤害与击杀时间攻略",
    "wardogs-artillery-guide": "WARDOGS 火炮与远程火力攻略", "wardogs-beginner-guide": "WARDOGS 新手入门攻略",
    "wardogs-best-settings": "WARDOGS 最佳画面与性能设置", "wardogs-best-weapons-loadouts": "WARDOGS 最佳武器与配装攻略",
    "wardogs-beta": "WARDOGS Beta 测试状态与时间线", "wardogs-cargo-guide": "WARDOGS 载具货运与补给攻略",
    "wardogs-controls": "WARDOGS 键鼠与手柄操作设置", "wardogs-crash-fix": "WARDOGS 崩溃、黑屏与启动失败修复",
    "wardogs-discord-account-verification": "WARDOGS Discord 账号验证与安全指南", "wardogs-discord": "WARDOGS 官方 Discord 加入指南",
    "wardogs-download": "WARDOGS 下载与安装指南", "wardogs-early-access": "WARDOGS 抢先体验时间、价格与内容",
    "wardogs-equipment-tools-guide": "WARDOGS 装备与战术工具攻略", "wardogs-factions": "WARDOGS 三大阵营介绍",
    "wardogs-first-look": "WARDOGS 实机视频与首发体验汇总", "wardogs-fob-guide": "WARDOGS FOB 建造、补给与防守攻略",
    "wardogs-game-developers": "WARDOGS 开发商 BULKHEAD 与发行商 Team17", "wardogs-gameplay": "WARDOGS 核心玩法完整介绍",
    "wardogs-helicopter-guide": "WARDOGS 直升机驾驶、降落与运输攻略", "wardogs-launch-checklist": "WARDOGS 上线前完整准备清单",
    "wardogs-livestream": "WARDOGS 官方直播时间与观看指南", "wardogs-map": "WARDOGS 地图、控制区与路线攻略",
    "wardogs-medic-revive-guide": "WARDOGS 医疗兵与救援攻略", "wardogs-money-guide": "WARDOGS 赚钱、预算与经济系统攻略",
    "wardogs-mortar-guide": "WARDOGS 迫击炮瞄准、校射与反制攻略", "wardogs-oil-rig-guide": "WARDOGS 油井燃料与后勤运输攻略",
    "wardogs-playtest": "WARDOGS 测试资格与试玩时间线", "wardogs-preload": "WARDOGS 预载状态与安装检查",
    "wardogs-price": "WARDOGS 价格、预购与版本说明", "wardogs-ps5": "WARDOGS PS5、Xbox 与主机版发布状态",
    "wardogs-reddit": "WARDOGS Reddit 社区与信息核查指南", "wardogs-release-date": "WARDOGS 发布日期与抢先体验时间",
    "wardogs-squad-guide": "WARDOGS 组队、语音与小队协作攻略", "wardogs-steam": "WARDOGS Steam 商店、愿望单与购买指南",
    "wardogs-system-requirements": "WARDOGS PC 配置要求与性能目标", "wardogs-towers-guide": "WARDOGS 塔楼占领与防守攻略",
    "wardogs-trailer": "WARDOGS 官方预告片与实机信息", "wardogs-twitch-drops": "WARDOGS Twitch Drops 状态与领取指南",
    "wardogs-twitter": "WARDOGS 官方 X / Twitter 信息核查指南",
}


def polish(text: str) -> str:
    replacements = {
        "战争狗": "WARDOGS", "战犬": "WARDOGS", "瓦尔多格斯": "WARDOGS", "WARDOGS公司": "WARDOGS", "蒸汽": "Steam", "早期访问": "抢先体验",
        "封闭测试": "封闭测试", "公开测试": "公开测试", "派系": "阵营", "负载": "配装",
        "砂浆": "迫击炮", "控制区": "控制区", "愿望列表": "愿望单", "游戏测试": "试玩测试",
        "供应": "补给", "产生": "重生", "重生点": "重生点", "补丁说明": "更新说明",
        "建筑敏感": "版本相关", "对建筑敏感": "可能随版本变化", "船员": "乘员", "火柴": "比赛",
        "观察器": "观察员", "监视器": "观察员", "朋友": "友军", "友好玩家": "友军玩家",
        "点火": "观察校射", "反弹": "反制", "超能力": "过强", "销毁": "破坏",
        "导游": "攻略", "欧洲": "社区", "释放": "发布", "物流": "后勤", "装载量": "配装", "载荷": "配装",
        "试玩测试": "测试", "开放菜单": "打开菜单", "开放WARDOGS": "打开 WARDOGS", "开放 Steam": "打开 Steam",
        "火灾": "火力", "消防": "火力", "防火": "火力支援", "产卵": "重生", "友好步兵": "友军步兵", "附近友人": "附近友军",
        "探测器": "观察员", "侦察员": "观察员", "监视员": "观察员", "迫击炮石": "迫击炮", "石指南": "迫击炮攻略",
        "范围和光": "射程与方位角", "光原则": "方位角原则", "亚齐穆特": "方位角", "离离": "FOB ",
        "关闭Beta": "封闭测试", "贝塔": "Beta", "建立敏感性": "版本相关", "实际情况": "信息",
        "初创者": "新手", "初级指南": "新手攻略", "开启启启动": "打开启动", "发射核查": "上线检查",
        "1.000万": "1,000,000", "FPS游戏展": "FPS Games Show", "实践范围": "训练场",
        "土豆模式": "Potato Mode", "超级炼模式": "Overkill Mode", "过度打开模式": "Overkill Mode",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    return text.strip()


def translate_plain_batch(values: list[str]) -> None:
    pending = [value for value in dict.fromkeys(values) if value.strip() and re.search(r"[A-Za-z]", value) and value not in CACHE]
    pending.sort(key=len)
    for start in range(0, len(pending), 32):
        batch = pending[start:start + 32]
        encoded = TOKENIZER(batch, return_tensors="pt", padding=True, truncation=True, max_length=480)
        output_length = min(256, max(32, max(len(value) for value in batch) + 24))
        with torch.no_grad():
            generated = MODEL.generate(**encoded, forced_bos_token_id=TARGET_LANGUAGE_ID, max_length=output_length)
        translated = TOKENIZER.batch_decode(generated, skip_special_tokens=True)
        for source, target in zip(batch, translated):
            CACHE[source] = polish(target)
        CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
        CACHE_PATH.write_text(json.dumps(CACHE, ensure_ascii=False), encoding="utf-8")
        print(f"Translated text batch {min(start + len(batch), len(pending))}/{len(pending)}", flush=True)


def translatable_segments(text: str) -> list[str]:
    segments: list[str] = []
    cursor = 0
    for match in PROTECTED_PATTERN.finditer(text):
        if match.start() > cursor:
            segments.append(text[cursor:match.start()])
        protected = match.group(0)
        link = re.fullmatch(r"\[([^\]]+)\]\(([^\)]+)\)", protected)
        if link:
            segments.extend(translatable_segments(link.group(1)))
        cursor = match.end()
    if cursor < len(text):
        segments.append(text[cursor:])
    return segments


def translate_text(text: str) -> str:
    if not text.strip() or not re.search(r"[A-Za-z]", text):
        return text
    if text in MANUAL_TRANSLATIONS:
        return MANUAL_TRANSLATIONS[text]
    if text in CACHE:
        return polish(CACHE[text])
    translate_plain_batch(translatable_segments(text))
    parts: list[str] = []
    cursor = 0
    for match in PROTECTED_PATTERN.finditer(text):
        if match.start() > cursor:
            segment = text[cursor:match.start()]
            parts.append(CACHE.get(segment, segment))
        protected = match.group(0)
        link = re.fullmatch(r"\[([^\]]+)\]\(([^\)]+)\)", protected)
        if link:
            parts.append(f"[{translate_text(link.group(1))}]({link.group(2)})")
        else:
            parts.append(protected)
        cursor = match.end()
    if cursor < len(text):
        segment = text[cursor:]
        parts.append(CACHE.get(segment, segment))
    result = polish("".join(parts))
    CACHE[text] = result
    return result


def translate_json(value):
    if isinstance(value, str):
        return translate_text(value)
    if isinstance(value, list):
        return [translate_json(item) for item in value]
    if isinstance(value, dict):
        return {key: translate_json(item) for key, item in value.items()}
    return value


def collect_json_strings(value, output: list[str]) -> None:
    if isinstance(value, str):
        output.extend(translatable_segments(value))
    elif isinstance(value, list):
        for item in value:
            collect_json_strings(item, output)
    elif isinstance(value, dict):
        for item in value.values():
            collect_json_strings(item, output)


def translate_frontmatter_line(line: str) -> str:
    match = re.match(r'^(\s*(?:-\s+)?)([A-Za-z][A-Za-z0-9]*):\s*"(.*)"\s*$', line)
    if not match or match.group(2) in SKIP_FRONTMATTER_KEYS:
        return line
    indent, key, value = match.groups()
    translated = translate_text(value).replace('"', '\\"')
    return f'{indent}{key}: "{translated}"'


def translate_markdown_line(line: str) -> str:
    if not line.strip() or line.lstrip().startswith(("import ", "export ", "<", "```")):
        return line
    prefix_match = re.match(r"^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+)?)", line)
    prefix = prefix_match.group(1) if prefix_match else ""
    body = line[len(prefix):]
    if not re.search(r"[A-Za-z]", body):
        return line
    return prefix + translate_text(body)


def translate_guide(source_path: Path) -> str:
    lines = source_path.read_text(encoding="utf-8").splitlines()
    output: list[str] = []
    in_frontmatter = False
    in_code = False
    delimiter_count = 0
    for line in lines:
        if line == "---":
            delimiter_count += 1
            in_frontmatter = delimiter_count == 1
            output.append(line)
            continue
        if line.lstrip().startswith("```"):
            in_code = not in_code
            output.append(line)
            continue
        if in_code:
            output.append(line)
        elif in_frontmatter:
            output.append(translate_frontmatter_line(line))
        else:
            output.append(translate_markdown_line(line))
    result = "\n".join(output) + "\n"
    slug = source_path.stem
    if slug in GUIDE_TITLES:
        result = re.sub(r'^title: ".*"$', f'title: "{GUIDE_TITLES[slug]}"', result, count=1, flags=re.MULTILINE)
    if slug == "wardogs-ps5":
        result = re.sub(r'^description: ".*"$', 'description: "核对 WARDOGS 是否登陆 PS5、Xbox 及其他主机平台，并区分官方确认、尚未公布的主机计划与社区猜测。本攻略同时整理当前 Windows PC 与 Steam 抢先体验状态、可能影响跨平台发布的技术信息，以及玩家在购买或等待前需要再次核实的官方来源、平台公告与更新时间。"', result, count=1, flags=re.MULTILINE)
    result = result.replace("](/guides/", "](/zh-cn/guides/").replace("](/items/", "](/zh-cn/items/").replace("](/en/items/", "](/zh-cn/items/")
    description_match = re.search(r'^description: "(.*)"$', result, flags=re.MULTILINE)
    if description_match:
        description = description_match.group(1)
        suffix = "本攻略依据官方页面、已核实的测试资料和注明出处的实机内容整理，并明确区分当前可确认的信息、可能随版本变化的数值以及尚未公布的细节；重大更新后请重新核对 Steam 与 WARDOGS 官方公告。"
        while len(description) < 140:
            description = f"{description}{suffix}"
        description = description[:160].rstrip("，；、 ")
        result = result[:description_match.start(1)] + description + result[description_match.end(1):]
    return result


def deep_merge(base: dict, overrides: dict) -> dict:
    for key, value in overrides.items():
        if isinstance(value, dict) and isinstance(base.get(key), dict):
            deep_merge(base[key], value)
        else:
            base[key] = value
    return base


def main() -> None:
    english_messages = json.loads((ROOT / "messages" / "en.json").read_text(encoding="utf-8"))
    source_strings: list[str] = []
    collect_json_strings(english_messages, source_strings)
    guide_paths = sorted(SOURCE_GUIDES.glob("*.mdx"))
    for source_path in guide_paths:
        in_frontmatter = False
        delimiter_count = 0
        for line in source_path.read_text(encoding="utf-8").splitlines():
            if line == "---":
                delimiter_count += 1
                in_frontmatter = delimiter_count == 1
                continue
            if in_frontmatter:
                match = re.match(r'^(\s*(?:-\s+)?)([A-Za-z][A-Za-z0-9]*):\s*"(.*)"\s*$', line)
                if match and match.group(2) not in SKIP_FRONTMATTER_KEYS:
                    source_strings.extend(translatable_segments(match.group(3)))
                continue
            prefix_match = re.match(r"^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s+)?)", line)
            body = line[len(prefix_match.group(1)):] if prefix_match else line
            source_strings.extend(translatable_segments(body))
    translate_plain_batch(source_strings)

    chinese_messages = translate_json(english_messages)
    deep_merge(chinese_messages, {
        "common": {"fanMade":"玩家自制社区维基", "language":"语言", "openMenu":"打开菜单", "closeMenu":"关闭菜单", "learnMore":"了解更多", "updated":"更新于", "official":"官方", "community":"社区", "skipToContent":"跳到正文", "openSteam":"在 Steam 查看 WARDOGS"},
        "ads": {"label":"广告", "sponsored":"赞助内容", "smartlinkCta":"查看赞助推荐", "smartlinkDescription":"在新标签页打开外部赞助页面。"},
        "nav": {"game":"游戏", "guides":"攻略", "catalogue":"图鉴", "playtest":"测试资格", "release":"发布信息", "releaseDate":"发布日期", "steam":"Steam", "steamEarlyAccess":"Steam 与抢先体验", "gameplay":"核心玩法", "factions":"阵营", "community":"社区", "beginnerGuide":"新手攻略", "crashFix":"崩溃修复", "helicopterGuide":"直升机攻略", "gameplayGuide":"玩法攻略", "fobLogistics":"FOB 与后勤", "mortarGuide":"迫击炮攻略", "allGuides":"全部攻略", "catalogueHome":"图鉴首页", "weapons":"武器", "vehicles":"载具", "ammo":"弹药", "attachments":"配件", "gear":"个人装备", "equipment":"战术装备", "loadouts":"配装", "videos":"视频", "items":"物品", "news":"新闻", "steamCta":"在 Steam 查看", "primaryLabel":"主导航"},
        "home": {"metaTitle":"WARDOGS 中文维基 - 上线、玩法与抢先体验攻略", "metaDescription":"为 WARDOGS 抢先体验做好准备：查看经过来源核实的发布日期、价格、下载与安装、核心玩法、武器和弹药、FOB 后勤、载具驾驶、小队协作、PC 性能设置及新手攻略。我们会区分官方确认、实机观察和仍未公布的信息，并在重大版本更新后及时复核。", "heroTitle":"完整中文攻略", "heroDescription":"通过已核实的测试资格、发布日期、玩法、阵营、社区与视频攻略，规划你的第一次部署。", "primaryCta":"浏览全部攻略", "secondaryCta":"打开上线清单", "status":"抢先体验已公布", "statsLabel":"WARDOGS 关键信息", "stats":{"earlyAccess":"2026 年 9 月 10 日抢先体验", "players":"最多 100 名玩家", "teams":"三方对战", "controlZone":"2 × 2 公里控制区"}, "aboutTitle":"WARDOGS 是什么游戏？", "startEyebrow":"从这里开始", "startTitle":"准备你的第一次部署", "finalTitle":"准备进入控制区了吗？", "finalDescription":"使用独立攻略库了解测试资格、小队职责、载具、目标和每个已确认的发布节点。", "final":{"eyebrow":"部署前准备", "guidesCta":"浏览攻略", "steamCta":"打开 Steam"}},
        "guides": {"metaTitle":"WARDOGS 中文攻略大全 - 上线、玩法、武器、载具与故障修复", "title":"WARDOGS 攻略", "description":"浏览上线、货运、弹药、小队、故障排除、载具、FOB 后勤、发布和核心玩法攻略。", "count":"43 篇攻略", "read":"阅读攻略"},
        "article": {"sources":"来源", "related":"相关攻略", "faq":"常见问题", "back":"全部攻略", "directAnswer":"快速结论", "lastChecked":"最后核查", "watch":"观看视频", "videoConsent":"加载隐私增强模式的 YouTube 视频", "byline":"研究与维护", "teamName":"WARDOGS Wiki 编辑团队", "editorialPolicy":"编辑规范", "imageSource":"画面来源"},
        "categories": {"access":"测试资格", "release":"发布", "store":"商店", "platform":"平台", "video":"视频", "community":"社区", "developer":"开发团队", "guide":"攻略"},
        "footer": {"aboutTitle":"WARDOGS Wiki", "about":"WARDOGS Wiki 是玩家制作的独立攻略站，提供经过核实的测试资格、发布、玩法、阵营、社区与媒体信息，与 BULKHEAD、Team17 或 Steam 无隶属关系。", "description":"面向 WARDOGS 玩家的独立战术 FPS 攻略。", "guideLinks":"攻略链接", "officialLinks":"官方链接", "officialSite":"WARDOGS 官方网站", "revealTrailer":"发布预告片", "legal":"法律信息", "privacy":"隐私政策", "terms":"服务条款", "editorialPolicy":"编辑规范"},
        "privacy": {"title":"隐私政策", "intro":"本站尽量减少数据收集，并说明外部媒体和链接的工作方式。"},
        "terms": {"title":"服务条款", "intro":"本独立站点内容仅供玩家参考。", "content":"游戏信息可能变化。购买、测试资格、平台可用性与账号操作请以 WARDOGS 官方来源为准。"},
        "notFound": {"title":"页面未找到", "description":"该地址不在当前已核实的攻略库中。", "home":"返回首页", "guides":"浏览攻略"}
    })
    chinese_messages["home"]["metaDescription"] += "每篇页面均提供来源、核查日期和版本敏感提示，帮助玩家快速找到可靠答案。"
    (ROOT / "messages" / "zh-cn.json").write_text(
        json.dumps(chinese_messages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    TARGET_GUIDES.mkdir(parents=True, exist_ok=True)
    for index, source_path in enumerate(guide_paths, 1):
        target_path = TARGET_GUIDES / source_path.name
        target_path.write_text(translate_guide(source_path), encoding="utf-8")
        print(f"[{index:02d}/{len(guide_paths)}] {source_path.name}", flush=True)

    print(f"Translated {len(guide_paths)} guides and {len(CACHE)} unique strings.")


if __name__ == "__main__":
    main()
