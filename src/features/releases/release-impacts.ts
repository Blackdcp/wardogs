import type {Locale} from "@/config/site";

export type ReleaseImpactId = "weapons" | "gold" | "weather" | "armor";
export type ReleaseImpact = {
  id: ReleaseImpactId;
  status: "announced" | "explained";
  reviewedAt: string;
  sourceUrl: string;
  sourceTime: string;
  paths: readonly string[];
  relatedPaths: readonly string[];
};

// A scheduled date never promotes a developer statement to a verified live mechanic.
// Updating this record updates the same evidence across guides, markets and tools.
export const releaseImpacts: readonly ReleaseImpact[] = [
  {id: "weapons", status: "announced", reviewedAt: "2026-10-09", sourceUrl: "https://www.youtube.com/watch?v=liRK9si1Ubo&t=5315s", sourceTime: "1:28:35", paths: ["/guides/wardogs-season-2", "/guides/wardogs-roadmap", "/guides/wardogs-best-weapons-loadouts", "/items/weapons", "/tools/weapon-compare", "/tools/loadout-budget"], relatedPaths: ["/guides/wardogs-season-2", "/tools/weapon-compare", "/tools/loadout-budget"]},
  {id: "gold", status: "explained", reviewedAt: "2026-10-09", sourceUrl: "https://www.youtube.com/watch?v=liRK9si1Ubo&t=1958s", sourceTime: "32:38", paths: ["/guides/wardogs-season-2", "/guides/wardogs-roadmap", "/gold-market", "/guides/wardogs-money-guide", "/guides/wardogs-progression-wipes-guide", "/guides/wardogs-what-to-buy-before-wipe"], relatedPaths: ["/gold-market", "/guides/wardogs-progression-wipes-guide", "/guides/wardogs-what-to-buy-before-wipe"]},
  {id: "weather", status: "announced", reviewedAt: "2026-10-09", sourceUrl: "https://www.youtube.com/watch?v=liRK9si1Ubo&t=5181s", sourceTime: "1:26:21", paths: ["/guides/wardogs-season-2", "/guides/wardogs-roadmap", "/guides/wardogs-map", "/tools/map"], relatedPaths: ["/guides/wardogs-season-2", "/tools/map"]},
  {id: "armor", status: "announced", reviewedAt: "2026-10-09", sourceUrl: "https://www.youtube.com/watch?v=liRK9si1Ubo&t=5127s", sourceTime: "1:25:27", paths: ["/guides/wardogs-season-2", "/guides/wardogs-roadmap", "/guides/wardogs-armor-damage-ttk-guide", "/tools/loadout-budget", "/tools/weapon-compare"], relatedPaths: ["/guides/wardogs-season-2", "/tools/loadout-budget"]}
];

export function getReleaseImpacts(path: string) {
  return releaseImpacts.filter((impact) => path === "/videos" || impact.paths.includes(path));
}

type ImpactCopy = {title: string; summary: string; action: string};
type ReleaseCopy = {
  title: string; description: string; announced: string; explained: string;
  checked: string; source: string; details: string; readNext: string;
  links: Record<string, string>;
  impacts: Record<ReleaseImpactId, ImpactCopy>;
};

const copy: Record<Locale, ReleaseCopy> = {
  en: {
    title: "What the next season changes for you", description: "Developer interview, checked October 9. Announced plans stay separate from verified live equipment and prices.", announced: "Announced plan", explained: "Developer explanation", checked: "Reviewed", source: "Watch the original interview", details: "What to do next", readNext: "Continue with",
    links: {"/guides/wardogs-season-2": "Season 2 changes", "/tools/weapon-compare": "Compare weapons", "/tools/loadout-budget": "Plan a loadout", "/gold-market": "Gold Market", "/guides/wardogs-progression-wipes-guide": "What survives a wipe", "/guides/wardogs-what-to-buy-before-wipe": "Before-wipe purchases", "/tools/map": "Tactical map"},
    impacts: {
      weapons: {title: "Four class weapons are planned", summary: "The developers describe one new weapon for Assault, Medic, Support and Recon. The complete names, prices and performance data are not confirmed here.", action: "Keep current loadouts usable. Compare the new weapons after their in-game values and compatibility are checked; announced equipment is not inserted into live calculators."},
      gold: {title: "Shop rotation is different from losing an owned skin", summary: "The interview says existing shop items continue across seasons, with a rotation exception discussed for the black-and-gold AK. Gold can be saved.", action: "Check the current shop before buying. A sale rotation does not mean that an already owned cosmetic disappears, and the interview does not provide today's exchange rate."},
      weather: {title: "Rain and fog will affect what you can see", summary: "The team discusses rain, fog and wet equipment. This is a planned weather presentation, not a measured visibility or performance table.", action: "Recheck sightlines when the weather update is live. A map pin marks a location; it does not guarantee a clear view or an unobstructed firing path."},
      armor: {title: "L4 visor protection has a view trade-off", summary: "The developers discuss the restricted field of view and a visor that cannot be raised. A possible fogging effect is not confirmed as a live feature.", action: "Check the released helmet in game before changing a loadout. Do not treat the discussion as proof of a new helmet model, damage values or movement penalties."}
    }
  },
  ru: {
    title: "Что новый сезон изменит для вас", description: "Интервью разработчиков проверено 9 октября. Анонсы отделены от проверенных характеристик и цен текущей версии.", announced: "Анонсированный план", explained: "Пояснение разработчиков", checked: "Проверено", source: "Смотреть исходное интервью", details: "Что делать дальше", readNext: "Связанные материалы",
    links: {"/guides/wardogs-season-2": "Изменения сезона 2", "/tools/weapon-compare": "Сравнить оружие", "/tools/loadout-budget": "Спланировать снаряжение", "/gold-market": "Золотой рынок", "/guides/wardogs-progression-wipes-guide": "Что сохраняется после вайпа", "/guides/wardogs-what-to-buy-before-wipe": "Покупки перед вайпом", "/tools/map": "Тактическая карта"},
    impacts: {
      weapons: {title: "Запланировано четыре классовых оружия", summary: "Разработчики говорят об одном новом оружии для штурмовика, медика, поддержки и разведчика. Полные названия, цены и характеристики здесь не подтверждены.", action: "Сохраните рабочие текущие комплекты. Сравнивайте новинки после проверки характеристик и совместимости в игре; анонсы не добавляются в действующие калькуляторы как готовые данные."},
      gold: {title: "Ротация магазина не удаляет купленный облик", summary: "По интервью товары сохраняются в продаже между сезонами; отдельно обсуждается ротация чёрно-золотого AK. Золото можно накапливать.", action: "Перед покупкой проверьте текущий магазин. Исчезновение товара из продажи не означает потерю уже купленного облика; сегодняшнего курса обмена интервью не сообщает."},
      weather: {title: "Дождь и туман меняют видимость", summary: "Команда обсуждает дождь, туман и мокрое снаряжение. Это план погодных эффектов, а не измеренная таблица видимости или производительности.", action: "После выхода обновления заново проверьте обзор. Метка на карте обозначает место, но не гарантирует видимость или свободную траекторию выстрела."},
      armor: {title: "Защита забрала L4 ограничивает обзор", summary: "Разработчики обсуждают узкое поле зрения и забрало, которое нельзя поднять. Возможное запотевание не подтверждено как действующая функция.", action: "Перед сменой комплекта проверьте шлем в выпущенной версии. Обсуждение не доказывает новый тип шлема, показатели урона или штрафы движения."}
    }
  },
  de: {
    title: "Was die nächste Saison für dich ändert", description: "Entwicklerinterview, am 9. Oktober geprüft. Ankündigungen bleiben von bestätigten Werten und Preisen der aktuellen Version getrennt.", announced: "Angekündigter Plan", explained: "Entwickleraussage", checked: "Geprüft", source: "Originalinterview ansehen", details: "Nächster Schritt", readNext: "Weiterführend",
    links: {"/guides/wardogs-season-2": "Änderungen in Saison 2", "/tools/weapon-compare": "Waffen vergleichen", "/tools/loadout-budget": "Ausrüstung planen", "/gold-market": "Goldmarkt", "/guides/wardogs-progression-wipes-guide": "Was einen Wipe übersteht", "/guides/wardogs-what-to-buy-before-wipe": "Käufe vor dem Wipe", "/tools/map": "Taktische Karte"},
    impacts: {
      weapons: {title: "Vier Klassenwaffen sind geplant", summary: "Die Entwickler nennen je eine neue Waffe für Assault, Medic, Support und Recon. Vollständige Namen, Preise und Leistungswerte sind hier noch nicht bestätigt.", action: "Behalte funktionierende aktuelle Ausrüstungen. Vergleiche die neuen Waffen erst nach Prüfung ihrer Spielwerte und Kompatibilität; Ankündigungen werden nicht als fertige Rechnerdaten eingetragen."},
      gold: {title: "Shoprotation ist kein Verlust gekaufter Skins", summary: "Laut Interview bleiben bestehende Shopartikel saisonübergreifend im Angebot; für die schwarz-goldene AK wird eine Rotation besprochen. Gold kann gespart werden.", action: "Prüfe vor dem Kauf den aktuellen Shop. Ein Verkaufswechsel entfernt keinen bereits gekauften Skin; das Interview liefert keinen heutigen Wechselkurs."},
      weather: {title: "Regen und Nebel verändern die Sicht", summary: "Das Team bespricht Regen, Nebel und nasse Ausrüstung. Das sind geplante Wettereffekte, keine gemessenen Sichtweiten oder Leistungswerte.", action: "Prüfe Sichtlinien nach Veröffentlichung erneut. Ein Kartenpunkt kennzeichnet einen Ort, garantiert aber weder freie Sicht noch eine ungehinderte Schussbahn."},
      armor: {title: "Das L4-Visier schützt auf Kosten der Sicht", summary: "Die Entwickler beschreiben ein eingeschränktes Sichtfeld und ein nicht hochklappbares Visier. Mögliches Beschlagen ist keine bestätigte aktuelle Funktion.", action: "Prüfe den veröffentlichten Helm im Spiel, bevor du deine Ausrüstung änderst. Daraus folgen weder ein neues Helmmodell noch bestätigte Schadenswerte oder Bewegungseinbußen."}
    }
  },
  "pt-br": {
    title: "O que a próxima temporada muda para você", description: "Entrevista dos desenvolvedores conferida em 9 de outubro. Planos anunciados ficam separados dos atributos e preços verificados da versão atual.", announced: "Plano anunciado", explained: "Explicação dos desenvolvedores", checked: "Conferido", source: "Assistir à entrevista original", details: "Próximo passo", readNext: "Continue em",
    links: {"/guides/wardogs-season-2": "Mudanças da temporada 2", "/tools/weapon-compare": "Comparar armas", "/tools/loadout-budget": "Planejar equipamento", "/gold-market": "Mercado de ouro", "/guides/wardogs-progression-wipes-guide": "O que fica após o reset", "/guides/wardogs-what-to-buy-before-wipe": "Compras antes do reset", "/tools/map": "Mapa tático"},
    impacts: {
      weapons: {title: "Quatro armas de classe estão planejadas", summary: "Os desenvolvedores mencionam uma arma para Assault, Medic, Support e Recon. Os nomes completos, preços e atributos ainda não estão confirmados aqui.", action: "Mantenha equipamentos atuais funcionais. Compare as novidades após conferir seus valores e compatibilidade no jogo; anúncios não entram nos cálculos como dados já disponíveis."},
      gold: {title: "Rotação da loja não apaga uma skin comprada", summary: "A entrevista diz que os itens continuam à venda entre temporadas, com uma exceção de rotação discutida para a AK preta e dourada. O ouro pode ser guardado.", action: "Confira a loja atual antes de comprar. Sair de venda não significa perder um cosmético já comprado; a entrevista não informa a cotação de hoje."},
      weather: {title: "Chuva e neblina alteram a visibilidade", summary: "A equipe comenta chuva, neblina e equipamentos molhados. São efeitos planejados, não uma tabela medida de visibilidade ou desempenho.", action: "Confira novamente as linhas de visão quando a atualização chegar. Um ponto no mapa indica um local, mas não garante visão livre nem trajetória desimpedida."},
      armor: {title: "A proteção da viseira L4 reduz o campo de visão", summary: "Os desenvolvedores discutem visão restrita e uma viseira que não pode ser levantada. Um possível embaçamento não está confirmado na versão atual.", action: "Confira o capacete lançado no jogo antes de mudar seu equipamento. A conversa não confirma novo modelo, valores de dano ou penalidades de movimento."}
    }
  },
  ja: {
    title: "次のシーズンで変わること", description: "10月9日に開発者インタビューを確認。発表された計画と現行版で確認済みの装備・価格を区別しています。", announced: "発表された計画", explained: "開発者の説明", checked: "確認日", source: "元のインタビューを見る", details: "次に確認すること", readNext: "関連するページ",
    links: {"/guides/wardogs-season-2": "シーズン2の変更点", "/tools/weapon-compare": "武器を比較", "/tools/loadout-budget": "装備を計画", "/gold-market": "ゴールドマーケット", "/guides/wardogs-progression-wipes-guide": "ワイプで残るもの", "/guides/wardogs-what-to-buy-before-wipe": "ワイプ前の買い物", "/tools/map": "戦術マップ"},
    impacts: {
      weapons: {title: "4兵科に1つずつ新武器を計画", summary: "開発者はAssault・Medic・Support・Reconに各1つの新武器を説明しています。全武器の正式名称・価格・性能はまだ確認できていません。", action: "現行版で使える装備を維持し、新武器はゲーム内の数値と互換性を確認してから比較してください。未実装の発表値を計算機の現行データには入れません。"},
      gold: {title: "販売ローテーションと購入済み外観の消失は別", summary: "インタビューでは既存の商品はシーズンをまたいで販売し、黒金AKにはローテーションの例外があると説明しています。ゴールドは貯められます。", action: "購入前に現在の店を確認してください。販売終了は購入済み外観の消失を意味しません。インタビューでは今日の交換レートは分かりません。"},
      weather: {title: "雨と霧による見え方の変化", summary: "開発者は雨・霧・濡れた装備の表現を説明しています。これは予定された天候表現であり、視認距離や動作性能の実測表ではありません。", action: "天候更新の実装後に視線を再確認してください。地図のピンは位置を示すもので、見通しや弾道の安全を保証しません。"},
      armor: {title: "L4バイザーは防護と視野のトレードオフ", summary: "開発者は狭い視野と、上げられないバイザーについて説明しています。曇る可能性への言及は、現行版への実装確認ではありません。", action: "装備を変える前に実装後のヘルメットをゲーム内で確認してください。新モデル・被ダメージ値・移動ペナルティが確定したとは扱いません。"}
    }
  },
  "zh-cn": {
    title: "下个赛季会怎样影响你的玩法", description: "开发者访谈核查于 10 月 9 日。已公布计划与现行版本的装备、价格分开呈现。", announced: "已公布计划", explained: "开发者说明", checked: "核查日期", source: "观看原始访谈", details: "接下来怎么做", readNext: "继续查看",
    links: {"/guides/wardogs-season-2": "第二赛季变化", "/tools/weapon-compare": "武器比较", "/tools/loadout-budget": "配装规划", "/gold-market": "黄金市场", "/guides/wardogs-progression-wipes-guide": "赛季重置保留规则", "/guides/wardogs-what-to-buy-before-wipe": "重置前购买建议", "/tools/map": "战术地图"},
    impacts: {
      weapons: {title: "四个兵种各计划增加一把武器", summary: "开发者提到 Assault、Medic、Support、Recon 各一把新武器。完整正式名称、价格和性能数值尚未在此确认。", action: "保留现有可用配装，待游戏内数值和兼容性核实后再比较新武器。公布计划不会被当作已上线装备直接填入计算器。"},
      gold: {title: "商店轮换不等于删除已购外观", summary: "访谈说明现有商品会跨季继续销售，并特别讨论了黑金 AK 的轮换例外。金条可以储存。", action: "购买前查看当前商店。商品下架不表示已购外观消失，访谈也不能提供今天的实时兑换汇率。"},
      weather: {title: "雨雾会改变可见范围", summary: "团队讨论了雨、雾和装备湿润的表现。这是计划中的天气效果，并非已经实测的视距或性能表。", action: "更新上线后重新检查观察路线。地图标记只能说明位置，不能保证现场无遮挡或弹道畅通。"},
      armor: {title: "L4 面罩需要权衡防护与视野", summary: "开发者讨论了受限视野和不能抬起的面罩；可能起雾的说法还不能当作现行版已实现功能。", action: "更换配装前先在游戏里检查正式上线的头盔。不能据此断言新头盔型号、伤害数值或移动惩罚。"}
    }
  },
  "zh-tw": {
    title: "下個賽季會怎樣影響你的玩法", description: "開發者訪談查核於 10 月 9 日。已公布計畫與現行版本的裝備、價格分開呈現。", announced: "已公布計畫", explained: "開發者說明", checked: "查核日期", source: "觀看原始訪談", details: "接下來怎麼做", readNext: "繼續查看",
    links: {"/guides/wardogs-season-2": "第二賽季變化", "/tools/weapon-compare": "武器比較", "/tools/loadout-budget": "配裝規劃", "/gold-market": "黃金市場", "/guides/wardogs-progression-wipes-guide": "賽季重置保留規則", "/guides/wardogs-what-to-buy-before-wipe": "重置前購買建議", "/tools/map": "戰術地圖"},
    impacts: {
      weapons: {title: "四個兵種各計畫增加一把武器", summary: "開發者提到 Assault、Medic、Support、Recon 各一把新武器。完整正式名稱、價格和性能數值尚未在此確認。", action: "保留現有可用配裝，待遊戲內數值和相容性查核後再比較新武器。公布計畫不會被當作已上線裝備直接填入計算器。"},
      gold: {title: "商店輪換不等於刪除已購外觀", summary: "訪談說明現有商品會跨季繼續販售，並特別討論了黑金 AK 的輪換例外。金條可以儲存。", action: "購買前查看目前商店。商品下架不表示已購外觀消失，訪談也不能提供今天的即時兌換匯率。"},
      weather: {title: "雨霧會改變可見範圍", summary: "團隊討論了雨、霧和裝備濕潤的表現。這是計畫中的天氣效果，並非已經實測的視距或效能表。", action: "更新上線後重新檢查觀察路線。地圖標記只能說明位置，不能保證現場無遮擋或彈道暢通。"},
      armor: {title: "L4 面罩需要權衡防護與視野", summary: "開發者討論了受限視野和不能抬起的面罩；可能起霧的說法還不能當作現行版已實現功能。", action: "更換配裝前先在遊戲裡檢查正式上線的頭盔。不能據此斷言新頭盔型號、傷害數值或移動懲罰。"}
    }
  },
  pl: {
    title: "Co kolejny sezon zmieni dla ciebie", description: "Wywiad z twórcami sprawdzony 9 października. Zapowiedzi oddzielamy od zweryfikowanych parametrów i cen obecnej wersji.", announced: "Zapowiedziany plan", explained: "Wyjaśnienie twórców", checked: "Sprawdzono", source: "Obejrzyj oryginalny wywiad", details: "Co zrobić dalej", readNext: "Czytaj dalej",
    links: {"/guides/wardogs-season-2": "Zmiany sezonu 2", "/tools/weapon-compare": "Porównaj broń", "/tools/loadout-budget": "Zaplanuj wyposażenie", "/gold-market": "Rynek złota", "/guides/wardogs-progression-wipes-guide": "Co przetrwa reset", "/guides/wardogs-what-to-buy-before-wipe": "Zakupy przed resetem", "/tools/map": "Mapa taktyczna"},
    impacts: {
      weapons: {title: "Planowane są cztery bronie klasowe", summary: "Twórcy zapowiadają po jednej broni dla Assault, Medic, Support i Recon. Pełne nazwy, ceny i parametry nie są tu jeszcze potwierdzone.", action: "Zachowaj działające obecne zestawy. Porównaj nowości po sprawdzeniu parametrów i zgodności w grze; zapowiedzi nie trafiają do kalkulatorów jako gotowe dane."},
      gold: {title: "Rotacja sklepu nie usuwa kupionej skórki", summary: "Według wywiadu obecne towary pozostają w sprzedaży między sezonami; osobno omówiono rotację czarno-złotego AK. Złoto można odkładać.", action: "Przed zakupem sprawdź aktualny sklep. Wycofanie ze sprzedaży nie oznacza utraty kupionego wyglądu; wywiad nie podaje dzisiejszego kursu wymiany."},
      weather: {title: "Deszcz i mgła zmieniają widoczność", summary: "Zespół omawia deszcz, mgłę i mokry ekwipunek. To plan efektów pogody, a nie zmierzona tabela widoczności czy wydajności.", action: "Sprawdź linie widzenia po wydaniu aktualizacji. Znacznik mapy określa miejsce, lecz nie gwarantuje widoczności ani wolnego toru pocisku."},
      armor: {title: "Ochrona wizjera L4 ogranicza pole widzenia", summary: "Twórcy opisują węższe pole widzenia i wizjer, którego nie można podnieść. Możliwe parowanie nie jest potwierdzoną funkcją obecnej wersji.", action: "Przed zmianą wyposażenia sprawdź wydany hełm w grze. Rozmowa nie potwierdza nowego modelu, wartości obrażeń ani kar ruchu."}
    }
  }
};

export function getReleaseImpactCopy(locale: Locale) {return copy[locale];}
