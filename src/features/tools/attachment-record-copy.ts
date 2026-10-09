import type {Locale} from "@/config/site";

const copy = {
  "en": [
    "Start a custom weapon test",
    "Your recorded setup",
    "Exact tested weapon",
    "Tested grip / none",
    "Tested muzzle / none",
    "This record describes the tested setup, separately from your shopping list. Name the weapon before entering a measurement. Changing the weapon, grip or muzzle creates your own setup and clears the old ADS result. Use separate saved loadouts for A and B; record the build and repeats in each."
  ],
  "ja": [
    "独自の武器テストを開始",
    "自分の検証構成",
    "検証した正確な武器",
    "検証したグリップ・なし",
    "検証した銃口装備・なし",
    "この記録は購入一覧とは別の検証構成です。測定値の前に武器名を入力してください。武器・グリップ・銃口装備の変更で独自構成となり、古い ADS 値は消去されます。A と B は別の保存装備にし、それぞれにビルドと反復を残します。"
  ],
  "de": [
    "Eigenen Waffentest beginnen",
    "Deine dokumentierte Konfiguration",
    "Genau getestete Waffe",
    "Getesteter Griff / keiner",
    "Getestete Mündung / keine",
    "Dieses Protokoll beschreibt die getestete Konfiguration getrennt von der Einkaufsliste. Vor Messwerten die Waffe benennen. Waffen-, Griff- oder Mündungswechsel erzeugen eine eigene Konfiguration und löschen den alten ADS-Wert. A und B als getrennte Loadouts mit Build und Wiederholungen speichern."
  ],
  "ru": [
    "Начать свой тест оружия",
    "Ваша записанная конфигурация",
    "Точное проверенное оружие",
    "Проверенная рукоять / нет",
    "Проверенный дульный модуль / нет",
    "Запись описывает проверенную конфигурацию отдельно от покупок. До измерения укажите оружие. Смена оружия, рукояти или дульного модуля создаёт ваш вариант и очищает старое ADS. Сохраните A и B отдельными комплектами, указывая сборку и повторы."
  ],
  "pt-br": [
    "Iniciar teste de arma próprio",
    "Sua configuração registrada",
    "Arma exata testada",
    "Empunhadura testada / nenhuma",
    "Bocal testado / nenhum",
    "Este registro descreve a configuração testada, separada das compras. Nomeie a arma antes de medir. Mudar arma, empunhadura ou bocal cria uma configuração própria e limpa o ADS antigo. Salve A e B como loadouts separados, com build e repetições em cada um."
  ],
  "zh-cn": [
    "开始自定义武器测试",
    "你记录的测试配置",
    "实际测试的武器型号",
    "实际测试的握把 / 无",
    "实际测试的枪口 / 无",
    "记录描述实际测试配置，与购物清单分开。先填写武器再录入测量值；改武器、握把或枪口后会转为你的自定义配置，并清除旧 ADS 结果。A 与 B 分别保存为两套配装，各自留下构建和重复次数。"
  ],
  "zh-tw": [
    "開始自訂武器測試",
    "你記錄的測試配置",
    "實際測試的武器型號",
    "實際測試的握把 / 無",
    "實際測試的槍口 / 無",
    "記錄描述實際測試配置，與購物清單分開。先填寫武器再輸入測量值；改武器、握把或槍口後會轉為你的自訂配置，並清除舊 ADS 結果。A 與 B 分別儲存為兩套配裝，各自留下組建和重複次數。"
  ],
  "pl": [
    "Rozpocznij własny test broni",
    "Twoja zapisana konfiguracja",
    "Dokładnie testowana broń",
    "Testowany chwyt / brak",
    "Testowane urządzenie wylotowe / brak",
    "Zapis dotyczy testowanej konfiguracji, osobno od zakupów. Nazwij broń przed pomiarem. Zmiana broni, chwytu lub wylotu tworzy własny wariant i usuwa stary ADS. A i B zapisz jako osobne zestawy z buildem i powtórzeniami."
  ]
} as const satisfies Record<Locale, readonly [string, string, string, string, string, string]>;
export function getAttachmentRecordCopy(locale: Locale) {const [start, title, weapon, grip, muzzle, note] = copy[locale]; return {start, title, weapon, grip, muzzle, note};}
