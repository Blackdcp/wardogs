import type {WardogsItem} from "./item-library";

type ItemProse = Pick<WardogsItem, "summary" | "description" | "role" | "strengths" | "cautions" | "confirmedFacts" | "unconfirmedFacts">;
type AuthoredProse = Omit<ItemProse, "confirmedFacts">;

const authored: Record<string, AuthoredProse> = {
  mortar: {
    summary: "用於壓制屋頂、塔樓、FOB 防禦與固定目標交戰中密集敵人的間接火力工具。",
    description: "迫擊砲是 WARDOGS 首個擁有獨立詳情頁的武器類物品，因為紀錄顯示玩家確實在搜尋它。本頁介紹使用條件、反制方式與證據，應作為戰術攻略閱讀，而非最終數值表。",
    role: "用迫擊砲將隊友報點轉化為火力壓力，迫使敵人離開容易預測的位置。",
    strengths: ["懲罰集中在屋頂、塔樓與明顯目標路線上的玩家。", "可在步兵或載具施壓前削弱 FOB 防禦。", "能讓善於溝通目標標記與射擊修正的小隊發揮優勢。"],
    cautions: ["最終傷害、裝填時間、彈藥限制與解鎖規則尚未確認。", "敵人找到發射位置後，可以對迫擊砲組施壓。", "情報不足會讓射擊變成猜測，難以可靠命中。"]
  },
  "mobile-fob": {
    summary: "可部署的前線作戰基地，作為補給、重生施壓、防禦與熱區控制的據點。",
    description: "機動 FOB 是 WARDOGS 最能體現戰略層面的道具。它連結後勤、地形、補給運輸、防禦及目標壓力，因此比內容單薄的裝備短條目更值得深入介紹。",
    role: "將 FOB 放在隊友能補給、防守、接收運送物資，並爭奪附近戰局主動權的位置。",
    strengths: ["為彈藥、繃帶、材料與團隊推進建立前線據點。", "發售前影片顯示可支援牆壁、戰壕、迫擊砲及防空工具等防禦升級。", "讓地形與配送通道成為有意義的戰略決策。"],
    cautions: ["FOB 需要隊友補給與維護，不會永遠自行維持。", "位置不佳會暴露運輸路線，並提高 FOB 防守成本。", "確切建造選單、升級費用與最終規則尚未確認。"]
  },
  littlebird: {
    summary: "用於偵察、滲透、轉移及突發施壓的快速直升機類載具。",
    description: "Littlebird 類型直升機的影片，讓玩家在完整載具資料庫就緒前就有實用的載具頁面。重點在於機動性與風險，而非最終裝甲或武器數據。",
    role: "地面路線太慢或受到爭奪時，用來運送小隊、偵察敵方壓力及快速轉移。",
    strengths: ["能在大範圍戰場中快速轉移。", "適合偵察，並將隊友送到交戰壓力點附近。", "讓飛行員與地面小隊都必須注意垂直方向的戰況。"],
    cautions: ["最終操控、耐久、座位數及武器配置尚未確認。", "大型交戰中，飛行載具很容易迅速引起注意。", "降落失誤可能讓原本的運輸價值變成全隊覆滅。"]
  },
  tank: {
    summary: "提供重型載具壓力，用於突破路線、威脅密集陣地，並迫使步兵正視裝甲威脅。",
    description: "戰車頁面應說明重裝甲如何改變 WARDOGS 戰局，而不捏造最終裝甲值。它首先是戰場定位頁面，之後才是數值頁面。",
    role: "用戰車壓制暴露的路線，並在步兵單獨無法守住地面時支援目標推進。",
    strengths: ["迫使敵方步兵改走其他路線，或投入反制火力。", "可影響開闊地帶的交戰，並支援向爭奪區域推進。", "適合與補給和步兵掩護協同運作。"],
    cautions: ["最終裝甲、傷害、乘員人數與經濟成本尚未確認。", "缺乏步兵支援的戰車可能陷入孤立。", "地形與反載具壓力可能限制安全路線。"]
  },
  "attack-helicopter": {
    summary: "空中支援載具，可讓開闊地移動、屋頂交戰與目標推進變得高度危險。",
    description: "在官方上市資料確認確切武器與耐久前，攻擊直升機介紹應持續聚焦戰場影響與反制方式。",
    role: "從上方施壓、懲罰暴露的移動，迫使敵人考慮防空防禦。",
    strengths: ["控制地面小隊可能忽略的視線方向。", "可懲罰集體移動及暴露的載具。", "提高 FOB 周邊防空規劃的價值。"],
    cautions: ["最終武器系統、生命值及反制措施細節尚未確認。", "空中支援仰賴飛行員技術與戰場意識。", "防空工具可能迅速改變積極飛行路線的效益。"]
  },
  "armored-transport": {
    summary: "提供受保護的移動方式，讓玩家與補給通過危險路線。",
    description: "裝甲運輸適合作為早期載具條目，因為它把 WARDOGS 的後勤主張與實際對局需求連在一起：不依賴徒步，也能運送人員、物資並維持壓力。",
    role: "將隊友與補給送往爭奪區域，同時減少在開闊道路上的暴露。",
    strengths: ["支援小隊轉移與前線增援。", "補給運輸可比暴露的徒步移動更安全。", "符合 WARDOGS 偏重支援職責與後勤的特色。"],
    cautions: ["最終座位數、裝甲、貨物行為與價格尚未確認。", "可預測的道路行駛仍可能遭到伏擊。", "只有把小隊送到需要的位置，運輸才有意義。"]
  },
  "a-91": {
    summary: "A-91 在 Alpha 1 是突擊經驗路線的步槍，使用 5.56x45mm 彈藥，提供半自動與點射，整槍重 3.17 kg。",
    description: "WARDOGS 的 A-91 在 Alpha 1 突擊步槍名單中屬於受控點射選擇。雖未記錄價格，但已觀察到的口徑、兩種射擊設定、重量與突擊經驗路線，足以將它定位為有節奏地壓制通道的型號，而不是據此推定上市時的平衡。",
    role: "用 A-91 在遠處進行有節奏的半自動射擊，目標穿過交火較密集的通道時改用短點射；在把它當成預設步槍前，預算仍須考慮尚未確認的購買價格。",
    strengths: ["半自動與點射讓 Alpha 1 型號具備兩種可控制的交戰節奏。", "已觀察到的 5.56x45mm 口徑屬於目錄中型號最多的武器家族。", "已觀察到的 3.17 kg 重量低於 Alpha 的 FAL 與 Galil 記錄。"],
    cautions: ["未記錄 Alpha 1 購買價格，因此無法進行完整的成本比較。", "觀察記錄未顯示全自動設定；近距離施壓可能需要有紀律的點射。", "STANAG 彈匣另有目錄記錄，但尚未確認與 A-91 這一具體型號的相容性。"],
    unconfirmedFacts: ["未記錄 Alpha 1 價格；搶先體驗與正式版的售價仍未確認。", "傷害、後座力、配件相容性與平衡可能在搶先體驗或正式版改變。"]
  },
  ak74: {
    summary: "Alpha 1 的 AK74 是重 3 kg、走突擊經驗路線的步槍，使用 5.45x39mm 彈藥，提供半自動與全自動射擊。",
    description: "在已記錄的 Alpha 1 名單中，AK74 是唯一使用 5.45x39mm 的型號。這套獨立的彈藥成本結構、半自動／全自動選擇器，以及記錄中的 3 kg 重量，共同構成它的預發布版本特色，儘管商店售價並未記錄。",
    role: "用半自動控制彈藥消耗，近距離推進時切換全自動；同時記住，選用 AK74 代表配裝要依賴較少其他武器共用的 5.45x39mm 補給線。",
    strengths: ["半自動與全自動分別適合有節奏的單發射擊與立即的近距離壓制。", "Alpha 1 重量為 3 kg，比其他已記錄的突擊步槍更輕。", "已有 AK74 75 發彈鼓記錄，可作為高容量配裝規劃的參考。"],
    cautions: ["Alpha 1 未記錄商店價格。", "已記錄武器中僅一款使用 5.45x39mm，因此彈藥共用範圍比 5.56x45mm 更小。", "未記錄 75 發彈鼓的價格、操控代價與最終可用性。"],
    unconfirmedFacts: ["未記錄 Alpha 1 價格；搶先體驗與正式版的售價仍未確認。", "搶先體驗或正式版的彈鼓價格、最終後座力、傷害及進度調整仍未確認。"]
  },
  "amp-9": {
    summary: "AMP-9 在 Alpha 1 是售價 $900、走醫療經驗路線的衝鋒槍，使用 9x19mm，提供半自動與全自動射擊，觀察重量為 1.4 kg。",
    description: "AMP-9 在這 14 個型號記錄中具備最低的已記錄槍械重量，同時有醫療經驗門檻和四種已記錄的彈匣容量。Alpha 1 證據指向一把機動支援武器；它的總成本取決於彈匣選擇和 9x19mm 補給，不只是 $900 的基礎價格。",
    role: "醫療兵需要輕型主武器作近距離自衛時可攜帶 AMP-9；用半自動節省 9x19mm，在救援或目標引來立即威脅時使用全自動。",
    strengths: ["Alpha 1 的 1.4 kg 重量為醫療工具和防護留下更多餘裕。", "半自動與全自動讓支援玩家可在節省成本和近距離輸出之間選擇。", "已觀察到 15、20、30、50 發 AMP-9 彈匣，可配合不同容量預算。"],
    cautions: ["Alpha 1 的 $900 價格不包含彈藥與替換彈匣成本。", "已觀察到的 50 發彈匣售價 $180，會明顯增加這把平價衝鋒槍的成本。", "目錄證據未記錄射程表現、後座力與傷害衰減。"],
    unconfirmedFacts: ["傷害、後座力、射程表現與醫療經驗要求可能在搶先體驗或正式版改變。", "Alpha 1 彈匣價格與相容性尚未確認為正式版數值。"]
  },
  "amr-50": {
    summary: "AMR 50 在 Alpha 1 是售價 $8,800、走偵察經驗路線的狙擊步槍，以栓動、彈匣供彈系統發射 .50 Cal，重量 12.5 kg。",
    description: "AMR 50 位於已記錄武器成本的極端：它是這 14 款中最昂貴、最重的型號。.50 Cal 彈藥也標示為每發 $50、每盒 $250，使 Alpha 1 的每次出擊都成為一項專業偵察投入。",
    role: "在預先準備的監視射擊位置部署 AMR 50，確保目標確實值得承擔補購成本、12.5 kg 重量和昂貴彈藥，而非輕型步槍也能同樣穩妥處理的目標。",
    strengths: [".50 Cal 口徑讓它在 Alpha 目錄中具有明確的重型步槍定位。", "栓動與彈匣供彈允許有節奏地補射，不必每發都完成單發式裝填循環。", "已有售價 $30 的 AMR 50 10 發彈匣記錄，提供具體容量選項。"],
    cautions: ["Alpha 1 的 $8,800 購買價格會讓持久資金中的大筆金額承受損失風險。", "觀察重量 12.5 kg，遠高於 BMR-308 和突擊步槍。", "在任何最終平衡調整前，.50 Cal 以每發 $50 成為已記錄單發成本最高的彈藥。"],
    unconfirmedFacts: ["對步兵傷害、與護甲的交互作用、晃動及操控可能在搶先體驗或正式版改變。", "$8,800 槍價與 .50 Cal 彈藥成本都是 Alpha 1 觀察結果，不是已確認的正式版經濟數值。"]
  },
  "bmr-308": {
    summary: "BMR-308 在 Alpha 1 是售價 $6,000、走偵察經驗路線的半自動精確射手步槍，使用 .308 Winchester，重量 3.9 kg。",
    description: "BMR-308 為 Alpha 1 偵察路線提供了介於笨重 AMR 50 與非常規複合弓之間的半自動選擇。.308 Winchester 口徑也將它與 FAL 及一份共用 20 發彈匣記錄連結起來，但不能假定最終相容性。",
    role: "用 BMR-308 沿中遠距離視線持續進行精確射擊，保留足夠購買 .308 Winchester 的資金，避免像使用突擊步槍那樣在近距離大量消耗彈藥。",
    strengths: ["相較 AMR 50 已觀察到的栓動方式，半自動射擊允許更快修正射擊。", "Alpha 1 的 3.9 kg 重量，相較 12.5 kg 重型狙擊槍更容易負擔。", "FAL 與 BMR-308 家族有售價 $150 的 20 發彈匣記錄。"],
    cautions: ["Alpha 1 的 $6,000 價格使遺失步槍後的補購相當昂貴。", "已觀察到 .308 Winchester 標準彈每發 $4、每盒 $40。", "瞄具適配、彈匣操控、傷害與有效射程尚未作為最終規格記錄。"],
    unconfirmedFacts: ["搶先體驗或正式版的瞄具相容性、後座力、傷害與射程調整仍未確認。", "已觀察到的 $6,000 Alpha 價格和彈匣成本，可能與目前搶先體驗版本或正式版不同。"]
  },
  "bushmaster-m17s": {
    summary: "Bushmaster M17S 在 Alpha 1 標價 $0，是重 3.17 kg、走突擊經驗路線的步槍，使用 5.56x45mm，提供半自動與點射。",
    description: "Bushmaster M17S 與 A-91、KH-2002 共有已記錄的 5.56x45mm、半自動／點射、3.17 kg 特徵，但商店記錄顯示 $0。這只能視為 Alpha 1 的觀察結果，不能證明上市後永久免費。",
    role: "依 Alpha 證據把 M17S 當作受控點射突擊選項；在後續版本確認取得方式前，顯示的 $0 只可用於歷史配裝成本比較。",
    strengths: ["顯示的 Alpha 1 $0 數值，使當時記錄的基礎武器成本為零。", "半自動與點射可控制射擊，不必承擔全自動的彈藥消耗。", "5.56x45mm 屬於目錄中涵蓋武器最多的彈藥家族。"],
    cautions: ["預發布商店顯示 $0，可能代表初始取得方式、佔位資料或臨時調整。", "觀察記錄不包含全自動射擊。", "另列的 STANAG 彈匣記錄，不能證明每種容量都適用 M17S。"],
    unconfirmedFacts: ["顯示的 Alpha 1 $0 價格，尚未確認適用於搶先體驗或正式版。", "取得規則、傷害、後座力和配件相容性可能在搶先體驗或正式版改變。"]
  },
  "compound-bow": {
    summary: "複合弓在 Alpha 1 是售價 $800、重 1.3 kg、走偵察經驗路線的武器，使用標準箭矢，以拉弓後釋放的方式射擊。",
    description: "複合弓是已記錄型號中最輕的，也是此處唯一圍繞標準箭矢與拉弓釋放時機設計的武器。Alpha 1 的 $800 價格比偵察步槍便宜，但未記錄箭矢傷害、回收、速度或容量。",
    role: "習慣掌握拉弓與釋放時機的玩家，可將弓作為輕量偵察選擇；同時攜帶副武器，應付傳統彈匣武器更能容許失誤的情況。",
    strengths: ["重 1.3 kg，是這 14 款已記錄武器中最輕的。", "Alpha 1 的 $800 價格，遠低於 BMR-308 與 AMR 50 這兩種偵察選擇。", "標準箭矢形成了槍械口徑家族以外的獨立補給選擇。"],
    cautions: ["拉弓釋放的射擊方式，沒有已觀察到的半自動或自動替代模式。", "未記錄箭矢傷害、速度、下墜、回收及攜帶數量。", "目錄沒有獨立箭矢物品頁，也沒有已確認的配件相容表。"],
    unconfirmedFacts: ["搶先體驗或正式版的箭矢傷害、速度、回收及容量仍未確認。", "Alpha 的 $800 價格和偵察經驗要求，可能與目前搶先體驗版本或正式版不同。"]
  },
  deagle: {
    summary: "Deagle 在 Alpha 1 是售價 $900、半自動射擊的 .50 AE 副武器；重量與進度條件未被記錄。",
    description: "Deagle 在 Alpha 1 副武器清單中的 $900 價格已達主武器等級，並使用少見的 .50 AE 口徑。已有售價 $50 的 7 發彈匣記錄，但重量與進度欄位缺失，仍留下重要的配裝問題。",
    role: "當計畫適合昂貴、低容量的半自動備用武器時再選 Deagle；與便宜副武器比較前，須計入 .50 AE 彈藥與彈匣。",
    strengths: [".50 AE 口徑在這 14 款已記錄武器中獨一無二。", "半自動運作避免了專業武器較慢的拉弓釋放或栓動循環。", "已記錄專用 Deagle 7 發彈匣，為其容量提供具體依據。"],
    cautions: ["Alpha 1 的 $900 價格在未計彈藥和彈匣前就與 AMP-9 相同。", "已記錄的 7 發彈匣售價 $50，容量也限制了失誤空間。", "第 1 賽季已確認生涯等級 85；僅目前重量與完整攜行負擔仍未驗證。"],
    unconfirmedFacts: ["Alpha 1 缺少重量與進度資料；第 1 賽季已確認生涯等級 85，但搶先體驗或正式版重量仍未驗證。", "傷害、後座力與彈匣表現可能與目前版本不同；Alpha 1 的 $900 商店價格仍未在搶先體驗中驗證。"]
  },
  fal: {
    summary: "FAL 在 Alpha 1 是售價 $5,500、走突擊經驗路線的步槍，以半自動或全自動發射 .308 Winchester，觀察重量為 4.25 kg。",
    description: "FAL 是已記錄突擊步槍中最重、最昂貴的一把，以 .308 Winchester 與全自動能力取代常見的 5.56x45mm 成本結構。已記錄的 20、30 發彈匣，也比許多小口徑彈匣昂貴。",
    role: "用半自動控制 .308 Winchester 消耗，僅在短促、決定性的壓制中使用全自動，因為步槍、彈藥和彈匣在 Alpha 1 都具有相當高的成本。",
    strengths: ["半自動與全自動讓 FAL 可在精確射擊和近距離壓制間切換。", ".308 Winchester 口徑讓它與較輕的 5.56x45mm 突擊步槍有所區別。", "20、30 發彈匣觀察記錄提供了兩個具體容量選擇。"],
    cautions: ["Alpha 1 售價 $5,500，遠高於已記錄的 Galil 與 AMP-9。", "觀察重量 4.25 kg，在 Alpha 突擊步槍記錄中最高。", "FAL 30 發彈匣標價 $250，.308 標準彈每發 $4。"],
    unconfirmedFacts: ["傷害、後座力、全自動控制與突擊經驗要求可能在搶先體驗或正式版改變。", "$5,500 價格與已記錄彈匣成本都是 Alpha 1 觀察結果，不是已確認的正式版數值。"]
  },
  galil: {
    summary: "Galil 在 Alpha 1 是售價 $2,200、重 3.95 kg、走突擊經驗路線的步槍，使用 5.56x45mm，提供半自動與全自動射擊。",
    description: "Galil 在 Alpha 1 擔任中價位突擊角色：比點射型 5.56x45mm 記錄更貴、更重，但比 .308 FAL 便宜且具備全自動。專用 35、50 發彈匣記錄提供了實用的容量參考。",
    role: "把 Galil 作為靈活的突擊主武器，跨越開闊地時以半自動控制 5.56x45mm 射擊節奏；小隊拉近距離或清除防守陣地時改用全自動。",
    strengths: ["半自動與全自動兼顧節省彈藥與近距離壓制。", "Alpha 目錄記錄了專用的 Galil 35、50 發彈匣。", "Alpha 1 的 $2,200 價格遠低於 FAL，同時保有自動射擊。"],
    cautions: ["觀察重量 3.95 kg，高於 A-91、AK74、M17S 和 KH-2002。", "Alpha 1 的 50 發彈匣在未裝彈前就需 $110。", "後座力、裝填時間、傷害和配件效果尚未作為最終數值記錄。"],
    unconfirmedFacts: ["搶先體驗或正式版的後座力、傷害、配件適配及突擊經驗調整仍未確認。", "Alpha 1 的步槍與彈匣價格可能與目前搶先體驗版本或正式版不同。"]
  },
  "ggx-17": {
    summary: "GGX 17 在 Alpha 1 是半自動 9x19mm 副武器；價格、重量與進度條件未被記錄。",
    description: "GGX 17 是已記錄 GGX 副武器組合中採用常規半自動的一款。9x19mm 讓它能使用觀察價格最低的彈藥盒，但缺少三個商店欄位，無法可靠比較總成本或攜行重量。",
    role: "把 GGX 17 用作有節奏的 9x19mm 備用武器，而非 GGX 18 已觀察到的全自動替代品；在後續版本確認取得價格前，預算應保留餘裕。",
    strengths: ["半自動鼓勵受控的備用射擊並節省彈藥。", "已觀察到 9x19mm 標準彈每發 $1、每盒 $10。", "共用口徑能簡化與 AMP-9、GGX 18 配合時的補給。"],
    cautions: ["Alpha 1 記錄中缺少價格、重量與進度條件。", "已記錄 GGX 品牌的 33、50 發彈匣，但未證明對具體型號的相容性。", "武器記錄未包含傷害、後座力、容量與操控。"],
    unconfirmedFacts: ["Alpha 1 未記錄價格、重量與進度條件，搶先體驗或正式版也仍未確認。", "彈匣相容性、傷害、後座力和容量可能與目前搶先體驗版本或正式版不同。"]
  },
  "ggx-18": {
    summary: "GGX 18 在 Alpha 1 是具備半自動與全自動的 9x19mm 副武器；價格、重量與進度條件未被記錄。",
    description: "GGX 18 以已觀察到的全自動選項區別於 GGX 17，為 Alpha 1 副武器名單提供緊湊型自動火力。記錄清楚顯示了這項能力，但缺少價格、重量、進度及已確認的彈匣適配，現在斷言上市後的價值仍過早。",
    role: "一般備用時讓 GGX 18 保持半自動，只有近距離急迫威脅值得犧牲彈藥控制、快速消耗 9x19mm 時才使用全自動。",
    strengths: ["半自動與全自動使它成為已記錄 GGX 副武器中更靈活的選擇。", "已觀察到 9x19mm 標準彈成本低，每發 $1、每盒 $10。", "共用口徑可配合以 AMP-9 為主的小隊補給計畫。"],
    cautions: ["Alpha 1 未記錄價格、重量或進度條件。", "即使彈藥便宜，全自動副武器仍可能很快耗盡彈匣。", "$70 的 GGX 33 發彈匣及 $110 的 50 發彈鼓記錄，不能證明 GGX 18 的最終相容性。"],
    unconfirmedFacts: ["Alpha 1 未記錄價格、重量與進度條件，搶先體驗或正式版也仍未確認。", "全自動調整、彈匣相容性、後座力和傷害可能與目前搶先體驗版本或正式版不同。"]
  },
  judge: {
    summary: "Judge 在 Alpha 1 是售價 $250 的 .45 Colt 副武器，但射擊模式、重量與進度條件未被記錄。",
    description: "Judge 的 $250 是已記錄武器中最低的非零售價，也是唯一使用 .45 Colt 的型號。彈藥目錄顯示每盒 $33，但缺失的射擊模式、重量與進度資料，使它的實際表現不如價格那樣明確。",
    role: "把 Judge 當作基礎成本低、但實際戰鬥節奏仍需遊戲內確認的副武器候選；規劃補購時也要計入相對昂貴的 .45 Colt 彈藥盒。",
    strengths: ["Alpha 1 的 $250 價格，是這些型號中已記錄最低的非零武器購買價。", ".45 Colt 口徑讓它具有獨立的副武器補給特色。", "已有 $33 的 .45 Colt 彈藥盒觀察記錄，因此至少部分補購成本有據可查。"],
    cautions: ["Alpha 1 武器記錄未包含射擊模式、重量與進度條件。", "沒有 Judge 的專用彈匣或容量記錄。", "$250 基礎價格並不能確立傷害、裝填速度、有效射程或最終價值。"],
    unconfirmedFacts: ["Alpha 1 未記錄射擊模式、重量與進度條件，搶先體驗或正式版也仍未確認。", "容量、裝填表現、傷害和 Alpha 的 $250 價格可能與目前搶先體驗版本或正式版不同。"]
  },
  "kh-2002": {
    summary: "KH-2002 在 Alpha 1 是重 3.17 kg、走突擊經驗路線的步槍，使用 5.56x45mm，提供半自動與點射；價格未被記錄。",
    description: "KH-2002 是已記錄三款 3.17 kg、5.56x45mm 點射突擊步槍中的最後一款。與 M17S 顯示 $0 不同，KH-2002 的 Alpha 1 價格未被記錄，因此即使主要數據重合，也不能只依成本決定型號。",
    role: "用 KH-2002 進行受控突擊射擊，較長通道採半自動，短暫暴露機會採點射；它與其他型號在成本及操控上的差異，仍需後續版本證據確認。",
    strengths: ["半自動與點射提供兩種受控的彈藥使用方式。", "Alpha 1 的 3.17 kg 重量低於 Galil 和 FAL 記錄。", "5.56x45mm 是已記錄最廣泛共用的口徑，有利於規劃更廣泛的小隊補給。"],
    cautions: ["未記錄 Alpha 1 購買價格。", "觀察記錄未確立它的操控與 A-91 或 M17S 有何差異。", "雖然有 STANAG 容量與瞄具記錄，但尚未確認 KH-2002 的相容性。"],
    unconfirmedFacts: ["未記錄 Alpha 1 價格；搶先體驗與正式版的售價仍未確認。", "型號特有的操控、傷害、後座力及配件適配可能在搶先體驗或正式版改變。"]
  },
  "ah-6m-miniguns": {
    summary: "AH-6M Miniguns 在 Alpha 1 以 $7,000 戰鬥直升機的形式出現，但購買門檻無法辨讀。",
    description: "AH-6M Miniguns 是 Alpha 1 商店中記錄的輕型 AH-6 家族武裝成員。戰鬥直升機標籤與 $7,000 標價，將它與偏重運輸的 MH-6 區分開來；但無法辨讀的門檻及未記錄的武器表現，使本頁只能作為定位指南，而不是最終性能表。",
    role: "把 AH-6M 當作進行短暫攻擊通過的輕型空中壓制選項；交戰之間應保全機體，因為每次補購都要承擔觀察到的 Alpha 經濟成本。",
    strengths: ["已觀察到的 Alpha 1 $7,000 價格低於 AH-6R Rockets 和 Havoc。", "戰鬥直升機定位將它與可直接購買的 MH-6 運輸機區分開來。", "Miniguns 名稱讓小隊在購買前，有明確理由將它與搭載火箭的 AH-6R 比較。"],
    cautions: ["Alpha 1 購買門檻無法辨讀，因此不能只憑價格推定可用性。", "未記錄旋轉機槍的傷害、彈藥、匯聚方式與有效射程。", "耐久、乘員要求、操控及反制措施仍未知。"],
    unconfirmedFacts: ["無法辨讀的 Alpha 1 門檻，在搶先體驗或正式版仍未確認。", "旋轉機槍性能、飛行操控、耐久與 Alpha 的 $7,000 價格，可能與目前搶先體驗版本或正式版不同。"]
  },
  "ah-6r-rockets": {
    summary: "AH-6R Rockets 在 Alpha 1 標示為售價 $12,500 的火箭直升機，門檻無法辨讀。",
    description: "AH-6R Rockets 將輕型家族的旋轉機槍特色換成火箭直升機定位，已記錄價格也高得多。Alpha 1 的 $12,500 標價意味著購買時應比 AH-6M 更審慎，但火箭載量、爆炸效果、補裝方式和鎖定條件，都沒有清楚到可視為已定案的記錄。",
    role: "將 AH-6R 留給有計畫的空襲時機，讓小隊辨識高價值目標並支援安全撤出，避免在缺乏協調時暴露昂貴直升機。",
    strengths: ["火箭直升機標籤表明它與 AH-6M Miniguns 有不同的攻擊定位。", "已觀察到的家族命名，讓 AH-6M 成為直接比較成本與定位的對象。", "Alpha 1 售價 $12,500，低於 Havoc，但仍屬專用戰鬥飛行器。"],
    cautions: ["Alpha 1 畫面中的購買門檻無法辨讀。", "未記錄火箭數量、範圍傷害、準確度與補充方式。", "已觀察到的高補購價格，增加了無支援攻擊航程的風險。"],
    unconfirmedFacts: ["無法辨讀的 Alpha 1 門檻，在搶先體驗或正式版仍未確認。", "火箭載量、傷害、補充方式、操控與價格可能與目前搶先體驗版本或正式版不同。"]
  },
  bobcat: {
    summary: "Alpha 1 載具商店中的 Bobcat 是售價 $500、可直接購買的輕型運輸載具。",
    description: "Bobcat 位於已記錄載具目錄中價格最低的一端。輕型運輸定位和已觀察到的直接購買方式，使它成為 Alpha 1 基本機動能力最清楚的參考點；但記錄未確立座位、貨物空間、防護、速度，或上市版本是否保留同樣的取得方式。",
    role: "小隊更需要機動性而非武器、防護或貨運容量時，可用低投入的 Bobcat 執行短距離轉移及接回人員的行程。",
    strengths: ["觀察價格 $500，是這 20 款已記錄載具中最低的。", "Alpha 1 清楚顯示可直接購買，記錄沒有顯示等級路線。", "輕型運輸標籤讓購買決策聚焦於移動，而非戰鬥裝備。"],
    cautions: ["直接購買僅在 Alpha 1 被觀察到，不是最終取得方式的承諾。", "未記錄座位數、儲存空間、速度、耐久與地形操控。", "低商店價格不代表燃料、維修或補購壓力也低。"],
    unconfirmedFacts: ["直接購買與 $500 價格都是 Alpha 1 觀察結果，不是已確認的搶先體驗或正式版規則。", "搶先體驗或正式版的容量、防護、操控、儲存空間與運作成本仍未確認。"]
  },
  "dune-buggy": {
    summary: "Dune Buggy 在 Alpha 1 是售價 $1,500、要求駕駛員等級 10 的快速運輸載具。",
    description: "Dune Buggy 是已記錄目錄中明確以速度為導向的地面運輸載具。駕駛員等級 10 門檻和 Alpha 1 的 $1,500 價格，使它高於 Bobcat 的入門機動選擇；但「快速」只是商店定位標籤，不能證明最終極速、加速、抓地力或碰撞承受能力。",
    role: "抵達時間比防護更重要時，可選 Dune Buggy 快速偵察與改換路線；規劃時避免假定尚未驗證的乘員或貨物容量。",
    strengths: ["快速運輸是其 Alpha 1 明示定位。", "已觀察到的 $1,500 價格低於較大型的 Kodiak 與 Humvee 家族。", "駕駛員等級 10 清楚標示了當時進度要求，而非無法辨讀的門檻。"],
    cautions: ["未記錄最終速度、加速、抓地力與翻車行為。", "第 1 賽季列出駕駛員等級 8；Alpha 1 的駕駛員等級 10 門檻屬於歷史資料。", "沒有記錄防護、座位數或貨物規格。"],
    unconfirmedFacts: ["第 1 賽季列出駕駛路線解鎖費 $25,000；Alpha 1 的 $1,500 載具購買價仍未在搶先體驗中驗證。", "速度、操控、耐久、座位與貨物行為可能與目前搶先體驗版本或正式版不同。"]
  },
  "flakpanzer-gepard": {
    summary: "Flakpanzer Gepard 在 Alpha 1 標示為售價 $8,000、要求戰士等級 45 的防空裝甲載具。",
    description: "Flakpanzer Gepard 是已記錄名單中的專用防空裝甲型號，具有戰士進度門檻，價格低於 L2A6 與 SPH-2。目錄定位支持將它理解為限制敵機活動的選擇，但目標偵測、火炮運作、裝甲、乘員需求與有效覆蓋範圍，尚未記錄為最終系統規格。",
    role: "將 Gepard 部署在能保護高價值地面資產和可能空中進路的位置，並在附近保留地面支援；防空定位不代表能安全面對所有威脅。",
    strengths: ["防空裝甲載具是這 20 條載具觀察記錄中的獨特定位。", "Alpha 1 的 $8,000 標價低於另外兩種戰士路線重型資產。", "商店記錄中的戰士等級 45 提供了可辨讀的進度目標。"],
    cautions: ["未記錄偵測距離、彈藥、火炮傷害、仰角與目標追蹤。", "防空標籤不能確立對坦克、火炮或步兵的防護能力。", "戰士等級 45 和 $8,000 價格僅為預發布版本觀察結果。"],
    unconfirmedFacts: ["搶先體驗或正式版的戰士等級 45 與 $8,000 價格仍未確認。", "裝甲、防空偵測、武器性能、乘員需求和彈藥可能與目前搶先體驗版本或正式版不同。"]
  },
  havoc: {
    summary: "$18,000 的 Havoc 標價僅適用於 Alpha 記錄；第 1 賽季一名飛行員的報告描述了更高的完整出擊成本，以及強力的防空反制。",
    description: "Havoc 位居已觀察載具價格清單頂端，定位是廣義攻擊直升機，而非 AH-6 那種按武器命名的標籤。這使它成為 Alpha 1 快照中經濟投入最大的空中選擇，但配裝、裝甲、乘員配置與取得條件仍不足以進行最終比較。",
    role: "只有在團隊能提供目標情報、空域態勢掌握，以及避開密集還擊的撤離路線時，才投入高價值攻擊飛行器 Havoc。",
    strengths: ["Alpha 1 明確標示攻擊直升機定位，與運輸飛行器區分。", "$18,000 標價使它成為已觀察商店中最明確的高投入飛行器選擇。", "其定位可用來比較較便宜的 AH-6M 與 AH-6R 攻擊型號。"],
    cautions: ["購買門檻無法辨讀，取得路徑未被記錄。", "未記錄武器、裝甲、感測器、反制措施和乘員要求。", "近期飛行員提出的成本及解鎖說法來自單一玩家報告，不是官方價目表。", "高價值飛行器也可能被協同防空壓制；花錢前應評估航線。"],
    unconfirmedFacts: ["無法辨讀的 Alpha 1 門檻，在搶先體驗或正式版仍未確認。", "9 月 20 日一名第 1 賽季飛行員報告要求飛行員等級 35，完整配裝出擊約需 $22,000–$30,000；這是未經驗證的社群觀察。", "配裝、裝甲、乘員配置、飛行模型、反制措施與目前價格，均須在當前遊戲客戶端驗證。"]
  },
  "humvee-m249": {
    summary: "Humvee M249 結合武裝運輸定位、Alpha 1 的 $3,750 售價，以及駕駛員等級 25 門檻。",
    description: "Humvee M249 在受防護的 Humvee 平台上加入具名支援武器，價格仍未達到已記錄的 Minigun 型號。其駕駛員等級 25 比 Kodiak M249 晚得多，因此即使未記錄武器性能與架設細節，兩款 $3,750 武裝運輸載具也代表不同的進度決策。",
    role: "用 Humvee M249 運送小隊，同時讓乘客或射手擔任防禦火力角色；路線規劃不能依賴尚未確認的槍座或車艙防護。",
    strengths: ["已觀察到的武裝運輸定位，結合了移動能力與具名 M249 槍座。", "Alpha 1 的 $3,750 比無武裝 Humvee 高 $750，低於 Minigun 型號。", "駕駛員等級 25 明確區別於要求駕駛員等級 8 的 Kodiak M249。"],
    cautions: ["未記錄 M249 彈藥、轉向範圍、防護、準確度與射手暴露程度。", "駕駛員等級 25 是 Alpha 1 觀察結果，不是最終解鎖要求。", "座位數、車艙防護、貨物容量與維修行為仍未知。"],
    unconfirmedFacts: ["搶先體驗或正式版的駕駛員等級 25 與 $3,750 價格仍未確認。", "M249 表現、防護、座位、貨物容量與操控可能與目前搶先體驗版本或正式版不同。"]
  },
  "humvee-minigun": {
    summary: "Humvee Minigun 在 Alpha 1 是售價 $4,500 的重型武裝運輸載具，但商店畫面中的門檻無法辨讀。",
    description: "Humvee Minigun 是已記錄最昂貴的 Humvee，也是唯一標示為重型武裝運輸的型號。比基礎型高 $1,500，使它在 Alpha 1 屬於不同購買級距；但門檻無法辨讀且缺少武器資料，不能斷言射速、彈藥供應、裝甲或相較 M249 型號的價值。",
    role: "把 Humvee Minigun 視為移動重火力平台，仍需受保護的路線、協調良好的射手和脫離計畫，不應把它當成性能未經驗證的前線裝甲車。",
    strengths: ["重型武裝運輸是 Humvee 家族中已觀察到的獨特定位。", "Minigun 名稱將預期武器特色與較便宜的 M249 型號區分。", "Alpha 1 的 $4,500 價格仍低於較大型的武裝 Ural Defender M249。"],
    cautions: ["Alpha 1 門檻無法辨讀，取得路徑未知。", "未記錄旋轉機槍彈藥、啟轉行為、轉向範圍、傷害與射手暴露程度。", "重型武裝運輸只是定位標籤，不能確認具備坦克等級防護。"],
    unconfirmedFacts: ["無法辨讀的 Alpha 1 門檻，在搶先體驗或正式版仍未確認。", "旋轉機槍性能、車輛防護、容量、操控與價格可能與目前搶先體驗版本或正式版不同。"]
  },
  humvee: {
    summary: "基礎 Humvee 在 Alpha 1 商店中是售價 $3,000、於駕駛員等級 15 解鎖的防護運輸載具。",
    description: "無武裝 Humvee 界定了該家族在 Alpha 1 的防護運輸基準。它與偏重貨運的 Kodiak Pickup 同價，低於兩種武裝 Humvee；但「防護」仍只是分類標籤，未記錄裝甲門檻、座位配置、儲存上限或生存能力比較。",
    role: "當車載武器的重要性低於控制購買成本時，用基礎 Humvee 執行受保護的人員移動及爭奪道路上的轉移，將支出維持在武裝型號之下。",
    strengths: ["防護運輸是 Alpha 1 明示定位，不是推測的裝甲能力。", "觀察價格 $3,000，低於兩款搭載武器的 Humvee。", "在已記錄的駕駛路線上，駕駛員等級 15 介於 Dune Buggy 與 Humvee M249 之間。"],
    cautions: ["未記錄裝甲值、傷害模型、座位數或貨物上限。", "防護運輸不保證能安全應對地雷、重武器或伏擊。", "駕駛員等級 15 與 $3,000 價格可能在 Alpha 1 之後改變。"],
    unconfirmedFacts: ["搶先體驗或正式版的駕駛員等級 15 與 $3,000 價格仍未確認。", "防護、座位、儲存空間、機動性、燃料和維修行為可能與目前搶先體驗版本或正式版不同。"]
  },
  "kodiak-m249": {
    summary: "Kodiak M249 在 Alpha 1 是售價 $3,750、要求駕駛員等級 8 的武裝運輸載具。",
    description: "Kodiak M249 是已記錄目錄中，可辨讀駕駛等級門檻最低的武裝運輸載具。它與 Humvee M249 同為 $3,750 且定位相同，卻要求駕駛員等級 8 而非等級 25；因此即使尚未考慮未記錄的操控、防護與槍座表現，底盤選擇和進度時機也已是不同問題。",
    role: "駕駛路線初期的小隊需要移動武器支援、但不想提高到受防護的 Ural Defender 家族級距時，可選 Kodiak M249；底盤性能仍須視為未確認。",
    strengths: ["駕駛員等級 8 是已觀察武裝地面載具中的最低等級門檻。", "武裝運輸定位將 Kodiak 通用家族與具名 M249 槍座結合。", "Alpha 1 的 $3,750 與門檻較晚的 Humvee M249 相同，可直接比較進度差異。"],
    cautions: ["記錄未包含武器彈藥、轉向範圍、防護或射手暴露程度。", "駕駛員等級 8 不能證明該型號會一直是早期解鎖選項。", "未記錄座位、貨物取捨、操控、耐久及維修成本。"],
    unconfirmedFacts: ["搶先體驗或正式版的駕駛員等級 8 與 $3,750 價格仍未確認。", "M249 表現、座位、貨物、防護、操控與耐久可能與目前搶先體驗版本或正式版不同。"]
  },
  "kodiak-pickup": {
    summary: "Kodiak Pickup 在 Alpha 1 標示為售價 $3,000、另需 $15,000 解鎖的貨運載具。",
    description: "Kodiak Pickup 是唯一明確標示貨運定位的已記錄載具。商店同時顯示 $3,000 購買價與獨立的 $15,000 解鎖費，形成不同於等級門檻型號的兩階段 Alpha 1 成本；貨物體積、裝載規則，以及解鎖是否永久，均未被記錄。",
    role: "當補給行程更重視貨運定位，而非基礎 Kodiak 較低的觀察價格或 M249 型號的槍座時，選用 Kodiak Pickup。",
    strengths: ["貨運是已觀察載具清單中的獨特定位。", "Alpha 1 的 $3,000 購買價與基礎 Humvee 相同，但服務於不同後勤用途。", "獨立的 $15,000 解鎖費可清楚辨讀，因此能明確討論已觀察到的完整入門成本。"],
    cautions: ["記錄未說明 $15,000 解鎖是永久、可重複支付，還是綁定帳號。", "未記錄貨物欄位、裝載互動、物品限制和損失行為。", "未記錄防護、座位、速度、地形操控或燃料行為。"],
    unconfirmedFacts: ["搶先體驗或正式版的 $15,000 解鎖費和 $3,000 購買價仍未確認。", "解鎖保留、貨物規則、容量、座位、防護與操控可能與目前搶先體驗版本或正式版不同。"]
  },
  kodiak: {
    summary: "基礎 Kodiak 在 Alpha 1 是可直接購買、售價 $2,500 的通用運輸載具。",
    description: "在已觀察商店中，基礎 Kodiak 介於 Bobcat 與專用 Kodiak 型號之間。通用運輸分類與可直接購買的狀態，使它成為該家族在 Alpha 1 的一般用途選項；但記錄並未定義其具體用途，包括乘客空間、儲存、拖曳或越野表現。",
    role: "當小隊不需要 Pickup 明確的貨運定位或 M249 型號的槍座時，可將 Kodiak 作為一般移動選項，並在目前版本確認實際容量。",
    strengths: ["Alpha 1 中觀察到可直接購買，未列出駕駛員進度或金錢解鎖門檻。", "標價 $2,500，低於兩款專用 Kodiak 型號。", "通用運輸的已觀察定位，比偏重速度的 Dune Buggy 更廣泛。"],
    cautions: ["可直接購買僅是 Alpha 1 的狀態，之後未必仍然適用。", "通用標籤未說明座位、貨物、拖曳、防護或地形表現。", "除定位與價格外，未記錄基礎型號與 Pickup 的差異。"],
    unconfirmedFacts: ["可直接購買與 $2,500 價格尚未確認為搶先體驗或正式版規則。", "座位、貨物、拖曳、防護、操控、燃料及維修行為，在搶先體驗或正式版中仍未確認。"]
  },
  l2a6: {
    summary: "L2A6 在 Alpha 1 目錄中是售價 $14,000、要求戰士等級 35 的主力戰車。",
    description: "L2A6 是清單中唯一標示為主力戰車的型號，價格也是已記錄載具的第二高。戰士等級 35 的門檻早於 Gepard 與 SPH-2，但 Alpha 1 記錄未確定裝甲分區、武器、乘員位置、彈藥、機動性，或維持運作所需的支援。",
    role: "讓 L2A6 在團隊支援下對開闊路線施加重型火力壓力，配合步兵警戒與後勤，而不是認為主力戰車的標籤就能消除位置風險。",
    strengths: ["在 20 款型號的目錄中，主力戰車是獨有的已觀察分類。", "戰士等級 35 是三筆裝甲與火砲記錄中最早的可辨讀門檻。", "Alpha 1 的 $14,000 價格，明確區隔了它與運輸載具及較輕型防空裝甲載具。"],
    cautions: ["未記錄裝甲值、弱點、武器、彈藥、乘員人數或維修系統。", "主力戰車定位不能證明它不受步兵、飛行器或火砲威脅。", "戰士等級 35 與 $14,000 購買價不代表最終進度或經濟設定。"],
    unconfirmedFacts: ["搶先體驗或正式版的戰士等級 35 與 $14,000 價格仍未確認。", "裝甲、武器、彈藥、乘員分工、機動性、燃料及維修，可能與目前搶先體驗版本或正式版不同。"]
  },
  "mh-6": {
    summary: "MH-6 在 Alpha 1 被觀察為可直接購買、售價 $6,250 的輕型空中運輸載具。",
    description: "MH-6 是已記錄目錄中最便宜的直升機，也是唯一同時具有運輸定位且被觀察到可直接購買的飛行器。它可作為 AH-6 家族的非戰鬥對照，但乘客位置、降落表現、酬載、生存能力，以及商店門檻以外是否另有飛行員要求，都未被記錄。",
    role: "當運輸比車載武器標籤更重要時，用 MH-6 執行輕型空中滲透、接人與快速轉移，保守選擇降落區和返航路線。",
    strengths: ["Alpha 1 的 $6,250 價格，是已觀察飛行器中的最低標價。", "商店畫面可見直接購買，而非無法辨讀或等級門檻。", "輕型空中運輸讓它在武裝 AH-6 型號之外，具有不同的機動定位。"],
    cautions: ["僅在 Alpha 1 觀察到可直接購買，不保證最終可用性。", "未記錄座位數、乘客暴露程度、飛行操控、耐久或降落容錯。", "運輸標籤不能證明貨運能力，也不能確定最終配備沒有武器。"],
    unconfirmedFacts: ["可直接購買與 $6,250 價格尚未確認為搶先體驗或正式版規則。", "搶先體驗或正式版的座位、配備、飛行操控、耐久、貨物行為及飛行員要求仍未確認。"]
  },
  "sph-2": {
    summary: "第 1 賽季將火砲戰車類別改為生涯等級 90、解鎖費 $500,000；SPH-2 商店價格與乘員操作流程仍屬特定版本的觀察。",
    description: "SPH-2 是已記錄商店中唯一的自走砲型號，要求戰士等級 55。後來的封閉測試影片顯示三個乘員位置、穩定步驟、間接射擊距離設定、155 mm 彈藥及手動裝填流程。Alpha 畫面標示購買價 $10,000，較晚的創作者攻略則顯示先支付獨立的 $400,000 解鎖費，再以 $8,000 重複購買；這項衝突保留為版本證據，不合併成單一最終價格。",
    role: "將 SPH-2 作為需協同作業的間接火力單位，仰賴目標資訊、受保護的射擊位置及後勤；當位置變得容易預測時就轉移。",
    strengths: ["穩定平台可維持可用的瞄準視野，方便反覆修正間接射擊。", "已觀察乘員位置分別負責駕駛、155 mm 主砲與頂部防護火力。", "正確完成手動裝填輸入順序，可以縮短等待時間。"],
    cautions: ["駕駛無法邊開車邊射擊；單人操作必須停車並切換座位。", "可預測的射擊位置容易遭到無人機、飛行器、反砲兵火力與獵殺步兵攻擊。", "第 1 賽季確認的是火砲戰車類別門檻，不是目前的 SPH-2 商店價格；價格、射程與砲彈數值都應在目前版本核對。"],
    unconfirmedFacts: ["Alpha 的 $10,000 購買價與後來 Beta 的 $8,000 重複購買價互相衝突；兩者均未確認適用於搶先體驗。", "一名第 1 賽季玩家回報重複購買為 $8,000、配裝出擊為 $11,000–$13,000；尚未在目前商店獨立驗證。", "官方更新紀錄使用火砲戰車而非 SPH-2 名稱；目前型號身分與重複購買價需要在目前客戶端確認。", "射程、爆炸效果、裝甲與彈藥經濟需要在目前客戶端確認。"]
  },
  "uh-1y-miniguns": {
    summary: "UH-1Y Miniguns 在 Alpha 1 是售價 $8,000 的武裝通用直升機，解鎖門檻無法辨讀。",
    description: "UH-1Y Miniguns 為較大型的 UH-1Y 家族加入武裝通用定位，比基礎運輸型號的已記錄價格只高 $600。Alpha 1 的價差如此小，更突顯無法辨讀的門檻有多重要：缺少取得條件、武器、座位與酬載細節，就不能把武裝型號視為各方面都更好的運輸選項。",
    role: "用 UH-1Y Miniguns 執行護送滲透和撤離路線，在機載掩護火力可能派上用場時支援行動，但應優先完成運輸任務，而非追求未驗證的武器輸出。",
    strengths: ["武裝通用直升機兼具運輸家族身分與具名武器配置。", "觀察價格 $8,000，只比基礎 UH-1Y 的標價高 $600。", "同家族配對提供清楚的武裝型與運輸型購買比較。"],
    cautions: ["Alpha 1 門檻無法辨讀，因此不能直接與基礎型號的飛行員門檻比較取得條件。", "未記錄旋轉機槍數量、射界、彈藥、傷害或射手暴露程度。", "乘客容量、貨物行為、耐久及操控差異仍然未知。"],
    unconfirmedFacts: ["無法辨讀的 Alpha 1 門檻，在搶先體驗或正式版中仍未確認。", "旋轉機槍表現、座位、酬載、耐久、飛行操控與價格，可能與目前搶先體驗版本或正式版不同。"]
  },
  "uh-1y": {
    summary: "基礎 UH-1Y 在 Alpha 1 是售價 $7,400、要求飛行員等級 10 的空中運輸載具。",
    description: "基礎 UH-1Y 是已記錄目錄中受進度門檻限制的空中運輸載具，價格高於可直接購買的 MH-6，略低於武裝 UH-1Y Miniguns。Alpha 1 中可辨讀飛行員等級 10，但未記錄其座位、貨物、飛行特性、防護，以及與武裝型號的確切差異。",
    role: "達到已觀察飛行員門檻後，用 UH-1Y 執行有計畫的小隊移動與重複空運後勤；降落區應以運輸安全為準，而不是根據缺少武器標籤作判斷。",
    strengths: ["空中運輸是 Alpha 1 明示定位，與輕型及武裝直升機分類不同。", "飛行員等級 10 是已記錄載具組中唯一可辨讀的飛行員進度門檻。", "觀察價格 $7,400 介於 MH-6 與 UH-1Y Miniguns 之間，可供家族型號比較。"],
    cautions: ["飛行員等級 10 與 $7,400 價格尚未確認為最終取得規則。", "未記錄乘客座位、貨物容量、飛行模型、耐久或反制措施。", "空中運輸標籤不能證明後續版本中該型號沒有武器或具備防護。"],
    unconfirmedFacts: ["搶先體驗或正式版的飛行員等級 10 與 $7,400 價格仍未確認。", "座位、貨物、配備、防護、飛行操控與反制措施，可能與目前搶先體驗版本或正式版不同。"]
  },
  "ural-defender-m249": {
    summary: "Ural Defender M249 在 Alpha 1 是售價 $6,750、要求駕駛員等級 40 的武裝後勤載具。",
    description: "Ural Defender M249 是已記錄 Ural 家族的最高階型號：武裝後勤定位、駕駛員等級 40 門檻，以及 Alpha 1 的 $6,750 價格。它在具防護概念的 Defender 上加入具名武器，但沒有記錄說明為裝設 M249 槍座，犧牲了多少貨物容量、防護或機動性。",
    role: "用 Ural Defender M249 的車載防衛能力護送高價值補給運輸，優先確保路線安全與卸載，而不是缺乏支援時繞路投入戰鬥。",
    strengths: ["武裝後勤是已觀察載具型號中的獨特定位。", "M249 名稱將它與基礎 Ural 和防護型 Defender 區隔。", "駕駛員等級 40 與 $6,750 使已記錄的進度及購買步驟清楚可辨。"],
    cautions: ["未記錄 M249 彈藥、射界、防護、精準度或射手暴露程度。", "貨物容量，以及後勤空間與武器配置的取捨仍然未知。", "駕駛員等級 40 與 $6,750 價格可能在 Alpha 1 之後改變。"],
    unconfirmedFacts: ["搶先體驗或正式版的駕駛員等級 40 與 $6,750 價格仍未確認。", "武器表現、貨物、防護、座位、機動性及使用成本，可能與目前搶先體驗版本或正式版不同。"]
  },
  "ural-defender": {
    summary: "Ural Defender 在 Alpha 1 是售價 $6,000、要求駕駛員等級 30 的防護後勤載具。",
    description: "Ural Defender 在基礎卡車與武裝 M249 型號之間，加入防護後勤選項。駕駛員等級 30 與 Alpha 1 的 $6,000 價格均可辨讀，但「防護」並不是量測過的裝甲結論；記錄也未定義貨物體積、乘客座位、路線表現，或比 Ural 多了多少防護。",
    role: "當較高風險的補給路線更需要已觀察的防護後勤定位，而非基礎 Ural 較低的購買價或武裝型號的掩護武器時，可選用 Ural Defender。",
    strengths: ["防護後勤是明確觀察到的獨立定位，而非泛稱運輸。", "Alpha 1 的 $6,000 價格，將它放在 Ural 與 Ural Defender M249 之間。", "駕駛員等級 30 為中階 Ural 型號提供可辨讀的進度門檻。"],
    cautions: ["未記錄裝甲評級、傷害模型、貨物容量或座位數。", "防護後勤不能確認它能抵擋所有伏擊或武器類型。", "駕駛員等級 30 與 $6,000 價格仍屬發售前觀察。"],
    unconfirmedFacts: ["搶先體驗或正式版的駕駛員等級 30 與 $6,000 價格仍未確認。", "防護、貨物、座位、操控、燃料、維修及損失行為，可能與目前搶先體驗版本或正式版不同。"]
  },
  ural: {
    summary: "基礎 Ural 在 Alpha 1 商店中是購買價 $5,000、另需 $60,000 解鎖的後勤卡車。",
    description: "基礎 Ural 是專用後勤家族的起點，購買價 $5,000，並有已記錄載具目錄中可見的最高現金解鎖費。Alpha 1 額外的 $60,000 解鎖費主導其入門成本，但記錄未說明解鎖是否保留，也未量化貨物、乘客、防護、速度或補給互動。",
    role: "先計入兩層已觀察成本，再用 Ural 執行有計畫的大宗後勤與重複補給路線，藉由護送及嚴守路線來彌補防護資料不足。",
    strengths: ["後勤卡車是 Alpha 1 明示定位，將它與一般人員運輸區隔。", "觀察購買價 $5,000，低於兩款 Ural Defender。", "$60,000 解鎖費可辨讀，明確揭示重要的第二層成本，而非將其藏在等級標籤後。"],
    cautions: ["第 1 賽季列出駕駛員等級 3 及駕駛員路線解鎖費 $35,000，與任何重複購買載具的費用分開。", "未記錄貨物容量、裝載規則、補給類型、乘客座位或損失行為。", "未記錄防護、操控、燃料、維修或越野規格。"],
    unconfirmedFacts: ["Alpha 1 的 $5,000 載具購買價尚未確認適用於搶先體驗；Alpha 1 的 $60,000 解鎖費是歷史資料。", "解鎖保留、貨物規則、補給互動、防護、座位及操控，可能與目前搶先體驗版本或正式版不同。"]
  },
  stingray: {
    summary: "Stingray 是 Beta 實機影片中出現的地面發射反載具無人機；目前價格、解鎖條件與傷害仍未驗證。",
    description: "Stingray 是以發射器與控制器操作的單程反載具無人機系統，不是一般可駕駛載具。封閉測試建造影片展示了發射筒與手持控制器。9 月的實機片段示範對敵方載具與火砲的攻擊，但兩個來源都未確定目前商店價格、解鎖條件、傷害數值或必殺效果。",
    role: "發射前先確認高價值載具或固定火砲目標，讓操作員處於掩體內，並安排隊友監視發射位置。較早的飛行教學建議在末段控制修正，而非接近途中用光所有加速；操控應在目前版本重新測試。",
    strengths: ["遠端反載具攻擊可對已知的固定火砲或重生支援位置施壓。", "引用的 Beta 建造影片可直接看見發射硬體與控制器。", "9 月實機片段提供較新的 Stingray 反載具操作示範。"],
    cautions: ["控制無人機時操作員可能暴露，因此應從掩體發射，而不是在開闊 FOB 發射。", "不要假定 Beta 的飛行操控、瞄準行為或傷害仍與目前版本相同。", "目前購買價、解鎖要求、部署成本與傷害尚未經獨立驗證。"],
    unconfirmedFacts: ["沒有目前商店截圖或官方說明可驗證價格、解鎖、部署成本或傷害。", "Beta 飛行方法可能與目前操控和瞄準行為不同。"]
  },
};

const generatedSummaries: Readonly<Record<string, string>> = {
  "Assault XP rifle observed with 5.56x45mm ammunition and semi or full-auto fire in Alpha 1.": "Alpha 1 中觀察到的突擊經驗值步槍，使用 5.56x45mm 彈藥，支援半自動或全自動射擊。",
  "Support XP light machine gun using 5.56x45mm; price was not captured in the observed build.": "使用 5.56x45mm 彈藥的支援經驗值輕機槍；觀察版本中未記錄價格。",
  "Support XP light machine gun observed with 7.62x54mmR ammunition and full-auto capability.": "已觀察到使用 7.62x54mmR 彈藥、具備全自動能力的支援經驗值輕機槍。",
  "Recon XP semi-automatic marksman rifle using 7.62x39mm ammunition.": "使用 7.62x39mm 彈藥的偵察經驗值半自動精確射手步槍。",
  "Recon XP semi-automatic marksman rifle using 7.62x54mmR ammunition.": "使用 7.62x54mmR 彈藥的偵察經驗值半自動精確射手步槍。",
  "Semi-automatic .45 ACP sidearm observed in the pre-release catalogue.": "發售前目錄中觀察到的半自動 .45 ACP 副武器。",
  "Support XP 12 Gauge shotgun observed in the pre-release catalogue.": "發售前目錄中觀察到的支援經驗值 12 號口徑霰彈槍。",
  "Support XP break-action 12 Gauge shotgun observed as a low-cost option.": "被觀察為低成本選項的支援經驗值折開式 12 號口徑霰彈槍。",
  "Medic XP SMG using 9x19mm ammunition with semi and full-auto fire.": "使用 9x19mm 彈藥、支援半自動與全自動射擊的醫護經驗值衝鋒槍。",
  "Medic XP SMG using .45 ACP ammunition with semi and full-auto fire.": "使用 .45 ACP 彈藥、支援半自動與全自動射擊的醫護經驗值衝鋒槍。",
  "Recon XP bolt-action sniper rifle using .308 Winchester ammunition.": "使用 .308 Winchester 彈藥的偵察經驗值栓動狙擊步槍。",
  "Recon XP bolt-action sniper rifle using 7.62x54mmR ammunition.": "使用 7.62x54mmR 彈藥的偵察經驗值栓動狙擊步槍。",
  "Recon XP light break-action rifle using 5.56x45mm ammunition.": "使用 5.56x45mm 彈藥的偵察經驗值輕型折開式步槍。",
  "Specialist launcher identified in Closed Beta catalogue coverage; exact ammunition, price, and unlock remain unconfirmed.": "封閉測試目錄介紹中辨識出的專用發射器；確切彈藥、價格與解鎖條件仍未確認。",
  "84mm specialist launcher observed in pre-release catalogue coverage.": "發售前目錄介紹中觀察到的 84mm 專用發射器。",
  "40mm multiple grenade launcher observed in pre-release catalogue coverage.": "發售前目錄介紹中觀察到的 40mm 多發榴彈發射器。",
  "93mm specialist launcher observed in the Alpha catalogue.": "Alpha 目錄中觀察到的 93mm 專用發射器。",
  "Stationary support-system identifier observed in Closed Beta catalogue coverage; exact function and cost remain build-sensitive.": "封閉測試目錄介紹中觀察到的固定式支援系統識別名稱；確切功能與成本仍須依版本判讀。",
  "Stationary anti-air system identified in Closed Beta catalogue coverage; cost and deployment rules remain unconfirmed.": "封閉測試目錄介紹中辨識出的固定式防空系統；成本與部署規則仍未確認。",
  "Stationary mortar system identified in Closed Beta catalogue coverage; range, ammunition, and cost remain unconfirmed.": "封閉測試目錄介紹中辨識出的固定式迫擊砲系統；射程、彈藥與成本仍未確認。",
  "Stationary close-in defense system identified in Closed Beta catalogue coverage; exact behavior remains unconfirmed.": "封閉測試目錄介紹中辨識出的固定式近迫防禦系統；確切運作方式仍未確認。",
};

const subtypeNames: Readonly<Record<string, string>> = {
  "Assault rifle": "突擊步槍", LMG: "輕機槍", "Marksman rifle": "精確射手步槍",
  Sidearm: "副武器", Shotgun: "霰彈槍", SMG: "衝鋒槍", "Sniper rifle": "狙擊步槍",
  Launcher: "發射器", "Stationary support": "固定式支援", "Stationary anti-air": "固定式防空",
  "Stationary artillery": "固定式火砲", "Stationary defense": "固定式防禦",
};

function exactTranslation(dictionary: Readonly<Record<string, string>>, source: string, context: string): string {
  if (!Object.hasOwn(dictionary, source)) {
    throw new Error(`Missing zh-tw item prose translation (${context}): ${source}`);
  }
  return dictionary[source];
}

// These are translations of catalogueRecordToItem's actual template, not replacements for authored prose.
function generatedProse(item: WardogsItem): AuthoredProse {
  const summary = exactTranslation(generatedSummaries, item.summary, `${item.slug}/summary`);
  const subtype = exactTranslation(subtypeNames, item.subtype, `${item.slug}/subtype`);
  return {
    summary,
    description: `${summary} 本記錄將已觀察的發售前事實與未知的搶先體驗平衡設定分開；若較新的第一方資料或可直接觀察的版本確認變動，便會更新。`,
    role: `只有當小隊能支援彈藥、替換成本及目前目標時，才依 ${item.name} 已觀察到的${subtype}定位使用它。`,
    strengths: [
      `${item.name} 在發售前目錄中有明確記錄，其定位並非根據現實世界用途推測。`,
      `可見的${subtype}分類，讓它能與相同目錄篩選條件下的記錄比較。`,
      "未知欄位仍會顯示，避免舊測試版本的數值變成永久建議。",
    ],
    cautions: [
      "這些發售前觀察，在價格、操控、傷害、可用性與解鎖條件上，可能與目前搶先體驗版本不同。",
      "目錄中的識別名稱，不能證明最終配件、彈藥或進度相容性。",
      "與較新影片比較本記錄前，先查看每項事實的版本標籤。",
    ],
    unconfirmedFacts: [
      `${item.name} 目前的搶先體驗與正式版數值，尚未從目前版本驗證。`,
      "傷害、操控、價格、可用性與相容性，都可能隨新版本改變。",
    ],
  };
}

const factSentences: Readonly<Record<string, string>> = {
  "Observed across creator footage: stabilize the platform before firing and use a manual reload sequence": "多段創作者影片中的觀察：射擊前穩定平台，並使用手動裝填流程。",
  "Observed across creator footage: driver, main-gun and top-gunner positions": "多段創作者影片中的觀察：有駕駛、主砲及頂部射手位置。",
  "Official Season 1 Artillery Tank category: Career level 90 and $500,000 one-time unlock; model association comes from the versioned catalogue": "官方第 1 賽季火砲戰車類別：生涯等級 90，且一次性解鎖費為 $500,000；與具體型號的對應來自特定版本目錄。",
  "The launch tube and handheld controller are visible in the cited Closed Beta building footage.": "引用的封閉測試建造影片中，可看見發射筒與手持控制器。",
  "The cited September gameplay clip shows Stingray use against enemy vehicles and artillery.": "引用的 9 月實機片段，展示使用 Stingray 攻擊敵方載具與火砲。",
  "Evidence tier: build-capture.": "證據層級：版本實機擷取。",
  "Evidence tier: corroborated-community.": "證據層級：經交叉佐證的社群資料。",
  "Official Team17 press-kit gameplay frame identifies the equipped M4 in the HUD; Alpha values remain build-sensitive and use the separate catalogue evidence set.": "官方 Team17 媒體資料包的實機畫面，可從 HUD 辨識已裝備的 M4；Alpha 數值仍須依版本判讀，並採用獨立的目錄證據組。",
  "Official Team17 press-kit gameplay frame identifies the equipped Super-45 and .45 ACP ammunition in the HUD; Alpha values remain build-sensitive and use the separate catalogue evidence set.": "官方 Team17 媒體資料包的實機畫面，可從 HUD 辨識已裝備的 Super-45 與 .45 ACP 彈藥；Alpha 數值仍須依版本判讀，並採用獨立的目錄證據組。",
};

const factLabels: Readonly<Record<string, string>> = {
  Ammunition: "彈藥", "Fire modes": "射擊模式", Weight: "重量", Progression: "進度",
  "Alpha price": "Alpha 價格", Role: "定位", "Observed gate": "已觀察門檻", Track: "進度路線",
};

const factValues: Readonly<Record<string, string>> = {
  "Standard Arrows": "標準箭矢", "12 Gauge": "12 號口徑",
  "Semi / Burst": "半自動 / 點放", "Semi / Full Auto": "半自動 / 全自動",
  "Bolt-action / Magazine": "栓動 / 彈匣供彈", "Semi automatic": "半自動",
  "Pull and Release": "拉弦後釋放", "Break-action": "折開式", "Bolt action": "栓動",
  "Assault XP": "突擊經驗值", "Medic XP": "醫療經驗值", "Recon XP": "偵察經驗值", "Support XP": "支援經驗值",
  "Combat helicopter": "戰鬥直升機", "Rocket helicopter": "火箭武裝直升機",
  "Light transport": "輕型運輸", "Fast transport": "快速運輸", "Anti-air armor": "防空裝甲載具",
  "Attack helicopter": "攻擊直升機", "Armed transport": "武裝運輸", "Heavy armed transport": "重武裝運輸",
  "Protected transport": "防護運輸", "Cargo transport": "貨運", "Utility transport": "通用運輸",
  "Main battle tank": "主力戰車", "Light air transport": "輕型空中運輸", "Self-propelled artillery": "自走砲",
  "Armed utility helicopter": "武裝通用直升機", "Air transport": "空中運輸",
  "Armed logistics": "武裝後勤", "Protected logistics": "防護後勤", "Logistics truck": "後勤卡車",
  "Anti-air launcher": "防空發射器", "Anti-vehicle launcher": "反載具發射器", "Grenade launcher": "榴彈發射器",
  "Stationary support": "固定式支援", "Stationary anti-air": "固定式防空",
  "Stationary artillery": "固定式火砲", "Stationary defense": "固定式防禦",
  "Open purchase": "可直接購買", Driver: "駕駛員", Wardog: "戰士", Pilot: "飛行員",
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
    if (level) return `${exactTranslation(factValues, level[1], label)}等級 ${level[2]}`;
    const unlock = /^(\$[\d,]+) unlock$/.exec(value);
    if (unlock) return `${unlock[1]} 解鎖費`;
  }
  throw new Error(`Missing zh-tw item fact value: ${label}: ${value}`);
}

function translateConfirmedFact(source: string): string {
  if (Object.hasOwn(factSentences, source)) return factSentences[source];
  const observed = /^Observed in (Alpha 1|Closed Beta - 21-23 Aug 2026): ([^:]+): (.+)$/.exec(source);
  if (observed) {
    const build = observed[1] === "Alpha 1" ? "Alpha 1" : "封閉測試（2026 年 8 月 21–23 日）";
    const label = exactTranslation(factLabels, observed[2], "confirmedFacts/label");
    return `於 ${build} 觀察到：${label}：${translateFactValue(observed[2], observed[3])}`;
  }
  const capture = /^Creator gameplay capture from (Every Weapon Tested in WARDOGS|WARDOGS All Weapons Vendor|WARDOGS Beta live gameplay|WARDOGS Building 101) at (\d{2}:\d{2}(?::\d{2})?); the visible item name or model was matched before publication\. Numeric fields remain build-sensitive\.$/.exec(source);
  if (capture) {
    return `創作者實機擷取來源為《${capture[1]}》的 ${capture[2]}；發布前已核對畫面中的道具名稱或型號。數值欄位仍須依版本判讀。`;
  }
  throw new Error(`Missing zh-tw confirmed item fact: ${source}`);
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

export function localizeItemProseZhTw(item: WardogsItem): ItemProse {
  if (!Object.hasOwn(sourceSignatures, item.slug)) {
    throw new Error(`Missing zh-tw item prose: ${item.type}/${item.slug}`);
  }
  if (sourceSignature(item) !== sourceSignatures[item.slug]) {
    throw new Error(`English item prose changed; review zh-tw translation: ${item.type}/${item.slug}`);
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
