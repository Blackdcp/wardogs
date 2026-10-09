import {createHash} from "node:crypto";
import {existsSync} from "node:fs";
import path from "node:path";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {locales, type Locale} from "../../src/config/site";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {decodeBudgetState, encodeBudgetState} from "../../src/features/tools/share-state";
import {calculatePurchases} from "../../src/features/tools/workflow-state";

const slugs = ["wardogs-money-guide", "wardogs-best-weapons-loadouts", "wardogs-helicopter-guide"] as const;
const sample = {cash: 10_000, loadout: 2_000, vehicle: 0, reserve: 3_000, once: 1_000, mode: "total" as const};

// Protect only the assigned TDK fields; future source/date updates remain possible.
const tdkBaselines: Record<Locale, readonly string[]> = {
  en: ["1c2c0a705017b84092ee30949460bee6a29daab0afb477b0cc220d1482829789", "3201608c56b68e2c93ebe8e6a212eb96348941bd90c810040a48c03350127436", "54a28612ab9efc6537eccfaacdc97f894d6c97bccb157e71359735180eccbe14"],
  ru: ["8cb214fce147fe7d358be4ed5195aac59eb3925c82cfb3870919952080d47b5e", "c164b0f1413b2f64b2357b3fb3e93fab137400918d47644a33d370e3a2dea3b1", "d347f782286634a9f4ac450fbddceb3b4b024d3d00b8cbf27a985214dc46a45c"],
  de: ["c8b53fa31c7a5a60a16425faa017fd2c44023c0e31032594d5d83f9d94339e7d", "4d26177c71fec339dfe410c3ee93148e6d040d403b2c2d3fff9842a4fc603a1e", "a3dc4d2703540cd9e5e31085e6157931ffe838bd3b807c37611e17bfa4df3476"],
  "pt-br": ["3354345f04aabae499b0f1d76dd29348ce6007b0cc7f71692373d9073807b76d", "1fc0e6d41d1ec7d509e33b91d073814b73076a3ca4ed16a5a6493185cf56ad7d", "d18b716b97e9dac5af7bace20af2b8b6cd8f5d52b50cead75a1840ddc4c8eb30"],
  ja: ["ce913949ad9555faeeda1bdccdaa2008682e3256f9799f20a010312c43e91900", "cbd323d6d8904157472f0e8a3aaf02c5631679ca3c0c9f56cf3ae525d9960a05", "2f0541daeb940177dd95a3eca530968f08665815b60bbcc215b3440788619a6d"],
  "zh-cn": ["18be44eec8d98113f926d37054cd43910a0b3462050ce32b9e4f19f3119e6543", "ff48f8470e827de2cd2f2a4dabeb699c1d1ae3e413856792962b4c3acef0fa3f", "e6b482ed0c25f5fce68c07c1fc84e3163ecbb2a612241ebd8bf843f4c36e8cfd"],
  "zh-tw": ["0da15f143f46368d203cbe995f9f764a887193fa9a48208230e29f0393392f81", "65e4d89ad3984079ef26a448d0fc628031877dd6a3698fbe24ced92f636618fa", "d9e5fcecf868fd083a3810ed627d5bb514632095467e1176d513fb043a40e383"],
  pl: ["91d3041d9118684be86f664f432f3e030a16a177afa700e707e1e76f01fe03da", "d790d62cdbd47219a2221166eefd04fe151b58e8edb66fae4fbdbd2a61e11298", "a1e88bbd30b928354bea1cc7782ad838a5536e2a70b20b7447e683952d56292d"]
};

// Snapshot of pre-October-9 H2 text/order: new economic advice must not erase old anchors.
const moneyHeadingProtection: Record<Locale, {legacyHash: string; newHeadings: string[]}> = {
  "en": {
    "legacyHash": "ee3077748d57064f3fa73d93d369c38b491efde8c93a0c6d78ecd2289c32c263",
    "newHeadings": [
      "## Is your infantry or transport route actually profitable?"
    ]
  },
  "ru": {
    "legacyHash": "9f3654a0ccc4db94bf018f9faa7e209e68cd0138eae3df9c810577a92e607ee7",
    "newHeadings": [
      "## Приносит ли пехота или перевозка чистую прибыль?"
    ]
  },
  "de": {
    "legacyHash": "9597f9ae337172ed2a8584ad88c4d2793c2316f76329833f6491d49b7faceb9e",
    "newHeadings": [
      "## Ist deine Infanterie- oder Transportroute wirklich rentabel?"
    ]
  },
  "pt-br": {
    "legacyHash": "6c9e244abf26a92c6fb218d12f393a3cadf1634c99af91178cb926d62e825c22",
    "newHeadings": [
      "## Sua rota de infantaria ou transporte dá lucro líquido?"
    ]
  },
  "ja": {
    "legacyHash": "34ecb68f5497585abd22d16ab31679aaa9391f333c7b82954ce04444aed7ecf1",
    "newHeadings": [
      "## キルが増えても現金が減るときは？"
    ]
  },
  "zh-cn": {
    "legacyHash": "bca1ff373a73977964940f5b9d4676a77328b348bc496c165ff6dd8c00d56e8a",
    "newHeadings": [
      "## 为什么击杀多了，现金却越来越少？"
    ]
  },
  "zh-tw": {
    "legacyHash": "07ecd4fe69bdd80c210687d56e1261487e6953d9cee4a99c8c828a527ee18506",
    "newHeadings": [
      "## 為什麼擊殺變多，現金卻愈來愈少？"
    ]
  },
  "pl": {
    "legacyHash": "a0d25d472d925ad2c9515c8c4b51ee559f5fb08969176512dbd4a32c0eb736a9",
    "newHeadings": [
      "## Czy twoja rola piechura lub kierowcy rzeczywiście przynosi zysk?"
    ]
  }
};

const copy = {
  en: {
    headings: ["Worked cash ledger: income is not net profit", "A cheap starter kit you can afford to replace", "Diagnose a flight symptom with a repeatable record"],
    h2Counts: [16, 17, 20], hypothetical: /Hypothetical user inputs, not official game prices/,
    replacements: /first kit plus two replacements/, expensive: /one kit and no full replacement/,
    editorial: /Editorial checks, not client-tested fixes/, unknown: /remain unverified here/,
    symptoms: [/Unexpected movement on takeoff/, /No response, changing prompts or lost bindings/, /Drift or oscillation on landing/]
  },
  ru: {
    headings: ["Пример учёта: выплата не равна чистому доходу", "Дешёвый набор для новичка с запасом на замену", "Как проверить симптом при взлёте, посадке или смене устройства"],
    h2Counts: [16, 13, 17], hypothetical: /Условные данные пользователя, не официальные цены/,
    replacements: /первый комплект и две замены/, expensive: /один комплект, без полной замены/,
    editorial: /Советы редакции, не проверенные в клиенте/, unknown: /здесь не проверены/,
    symptoms: [/Неожиданное движение при взлёте/, /Нет реакции, меняются подсказки или пропадают привязки/, /Снос или раскачка при посадке/]
  },
  de: {
    headings: ["Rechenbeispiel: Einnahmen sind nicht der Nettogewinn", "Ein günstiges Einsteigerkit mit Ersatzbudget", "Flugsymptome nachvollziehbar eingrenzen"],
    h2Counts: [18, 13, 18], hypothetical: /Angenommene Nutzereingaben, keine offiziellen Spielpreise/,
    replacements: /ein Erstkit und zwei Ersatzkits/, expensive: /einen Kauf und kein vollständiges Ersatzkit/,
    editorial: /Redaktionelle Prüfschritte, keine im Client getesteten Lösungen/, unknown: /hier ungeprüft/,
    symptoms: [/Unerwartete Bewegung beim Start/, /Keine Reaktion, wechselnde Symbole oder verlorene Belegung/, /Drift oder Schwingen bei der Landung/]
  },
  "pt-br": {
    headings: ["Exemplo de caixa: pagamento não é lucro líquido", "Kit barato para iniciante com dinheiro para reposição", "Como registrar e conferir um sintoma de voo"],
    h2Counts: [18, 13, 18], hypothetical: /Entradas hipotéticas do usuário, não preços oficiais/,
    replacements: /primeiro kit e duas reposições/, expensive: /apenas um kit, sem reposição completa/,
    editorial: /Verificações editoriais, não correções testadas no cliente/, unknown: /seguem sem verificação aqui/,
    symptoms: [/Movimento inesperado na decolagem/, /Sem resposta, ícones alternando ou comandos perdidos/, /Deriva ou oscilação no pouso/]
  },
  ja: {
    headings: ["収支の計算例：受取額と純利益は別", "初心者の安い装備は再購入まで考える", "離着陸と入力機器の症状を記録して切り分ける"],
    h2Counts: [13, 13, 13], hypothetical: /ユーザーが仮に入力した値で、公式/,
    replacements: /最初の1組と補充2組/, expensive: /1組だけで、完全な補充はできません/,
    editorial: /編集部の確認手順で、クライアントで実測した修正方法.*ではありません/,
    unknown: /ここでは未検証/,
    symptoms: [/離陸時に意図しない動きが出る/, /無反応・表示切り替わり・割り当て消失/, /着陸時に流れる・揺り戻す/]
  },
  "zh-cn": {
    headings: ["可复算账例：到账收入不等于净收益", "新手便宜配装，要能买也能补", "起降与输入设备症状，怎样留下可复查记录"],
    h2Counts: [14, 18, 15], hypothetical: /假设的用户输入，不是游戏官方价格/,
    replacements: /首套加两次补装/, expensive: /只能买一套，无法再整套补装/,
    editorial: /编辑诊断建议，不是客户端实测修复/, unknown: /仍未验证/,
    symptoms: [/起飞时出现意外运动/, /没有响应、提示跳变或绑定丢失/, /降落漂移或反复摆动/]
  },
  "zh-tw": {
    headings: ["可重算的收支例子：入帳不等於淨收益", "新手便宜配裝，要買得起也補得起", "起降與輸入裝置症狀，如何留下可複查紀錄"],
    h2Counts: [14, 18, 15], hypothetical: /使用者假設輸入，不是遊戲官方價格/,
    replacements: /第一套加兩次補裝/, expensive: /只能買一套，無法再整套補裝/,
    editorial: /編輯診斷建議，不是遊戲客戶端實測修復/, unknown: /仍未驗證/,
    symptoms: [/起飛時出現非預期運動/, /沒有反應、提示切換或配置遺失/, /降落飄移或反覆擺動/]
  },
  pl: {
    headings: ["Przykład bilansu: wypłata to nie zysk netto", "Tani ekwipunek dla początkujących z budżetem na odtworzenie", "Jak udokumentować objaw podczas lotu lub zmiany urządzenia"],
    h2Counts: [16, 17, 20], hypothetical: /Hipotetyczne dane użytkownika, nie oficjalne ceny/,
    replacements: /pierwszy zestaw i dwa odtworzenia/, expensive: /jeden zestaw, bez pełnego odtworzenia/,
    editorial: /Wskazówki redakcyjne, nie poprawki przetestowane w kliencie/, unknown: /pozostają tu niezweryfikowane/,
    symptoms: [/Nieoczekiwany ruch przy starcie/, /Brak reakcji, zmienne ikony lub utrata przypisań/, /Znoszenie lub oscylacje przy lądowaniu/]
  }
} as const;

function refreshedSection(body: string, heading: string) {
  const normalized = body.replace(/\r/g, "");
  const marker = `### ${heading}\n`;
  expect(normalized.split(marker)).toHaveLength(2);
  return normalized.split(marker)[1].split(/^#{2,3} /m)[0].trim();
}

function internalLinks(section: string) {
  return [...section.matchAll(/\]\((\/[^)]+)\)/g)].map(match => new URL(match[1], "https://www.wardogswiki.com"));
}

describe("TDK budget and flight answer refresh across eight locales", () => {
  it("uses the real tool's once/total-mode contract and recalculates both kit choices", () => {
    expect(decodeBudgetState(encodeBudgetState(sample))).toEqual(sample);
    expect(calculatePurchases(sample.cash, sample.reserve, sample.loadout + sample.vehicle, sample.once)).toEqual({
      spent: 3_000, remaining: 7_000, reserveMet: true, purchases: 3, replacements: 2
    });
    expect(calculatePurchases(sample.cash, sample.reserve, 3_500, sample.once)).toEqual({
      spent: 4_500, remaining: 5_500, reserveMet: true, purchases: 1, replacements: 0
    });
    const received = 1_500;
    const ending = sample.cash - sample.once - sample.loadout + received;
    expect(ending).toBe(8_500);
    expect(ending - sample.cash).toBe(-1_500);
    expect(calculatePurchases(ending, sample.reserve, sample.loadout, 0)?.spent).toBe(2_000);
    expect(calculatePurchases(sample.cash, sample.reserve, null, sample.once)).toBeNull();
  });

  for (const locale of locales) {
    const text = copy[locale];
    for (const [index, slug] of slugs.entries()) {
      it(`${locale}/${slug}: preserves TDK and renders a localized, linked answer`, async () => {
        const guide = await loadGuideDocument(locale, slug);
        expect(guide).not.toBeNull();
        const {frontmatter, body} = guide!;
        const tdk = [frontmatter.slug, frontmatter.title, frontmatter.keyword, frontmatter.description];
        expect(createHash("sha256").update(JSON.stringify(tdk)).digest("hex")).toBe(tdkBaselines[locale][index]);
        const h2s = body.match(/^## .*$/gm) ?? [];
        if (index === 0) {
          const protection = moneyHeadingProtection[locale];
          for (const heading of protection.newHeadings) expect(h2s).toContain(heading);
          const previous = h2s.filter(heading => !protection.newHeadings.includes(heading));
          expect(previous).toHaveLength(text.h2Counts[index]);
          expect(createHash("sha256").update(JSON.stringify(previous)).digest("hex")).toBe(protection.legacyHash);
          expect(h2s).toHaveLength(text.h2Counts[index] + protection.newHeadings.length);
        } else {
          expect(h2s).toHaveLength(text.h2Counts[index]);
        }
        expect(new Set(h2s).size).toBe(h2s.length);

        const section = refreshedSection(body, text.headings[index]);
        const links = internalLinks(section);
        expect(links).toHaveLength(index === 2 ? 3 : 2);
        for (const link of links) {
          expect(link.pathname.startsWith(`/${locale}/`)).toBe(true);
          const route = link.pathname.slice(locale.length + 2);
          const target = route.startsWith("guides/")
            ? path.resolve("content", locale, `${route}.mdx`)
            : path.resolve("src/app/[locale]", route, "page.tsx");
          expect(existsSync(target), target).toBe(true);
        }

        if (index < 2) {
          expect(section).toMatch(text.hypothetical);
          const budget = links.find(link => link.pathname.endsWith("/tools/loadout-budget"));
          expect(budget).toBeDefined();
          const restored = decodeBudgetState(budget!.search);
          expect(restored).toEqual(sample);
          const result = calculatePurchases(restored!.cash, restored!.reserve, restored!.loadout + restored!.vehicle, restored!.once!);
          expect(result).toMatchObject({spent: 3_000, remaining: 7_000, purchases: 3, replacements: 2});
          if (index === 0) {
            expect(section).toContain("$1,000 + $2,000 = $3,000");
            expect(section).toContain("$10,000 - $3,000 + $1,500 = $8,500");
            expect(section).toContain("-$1,500");
            expect(links.some(link => link.pathname.endsWith(`/${slugs[1]}`))).toBe(true);
          } else {
            for (const price of ["$6,000", "$3,500", "$4,500", "$5,500"]) expect(section).toContain(price);
            expect(section).toMatch(text.replacements);
            expect(section).toMatch(text.expensive);
            expect(section).toContain("Alpha/Beta");
            expect(links.some(link => link.pathname.endsWith(`/${slugs[0]}`))).toBe(true);
          }
        } else {
          expect(section).toMatch(text.editorial);
          expect(section).toMatch(text.unknown);
          expect(section.match(/^- \*\*/gm)).toHaveLength(3);
          for (const symptom of text.symptoms) expect(section).toMatch(symptom);
          expect(links.map(link => link.pathname)).toEqual([
            `/${locale}/vehicles/helicopters`, `/${locale}/guides/wardogs-controls`, `/${locale}/guides/wardogs-known-issues`
          ]);
          expect(section).not.toMatch(/\$\d|\b\d+(?:\.\d+)?(?:%|°)|J-Hook|\*\*[A-Z]\*\*/);
          expect(body).toContain(`/${locale}/videos#candidate-oCPyxCVQBvA`);
        }

        const compiled = await compileLocalizedGuideBody(body, mdxComponents, locale);
        const html = renderToStaticMarkup(compiled.content);
        for (const link of links) expect(html).toContain(link.pathname);
        if (index < 2) expect(html).toContain("once=1000&amp;mode=total");
      });
    }
  }
});
