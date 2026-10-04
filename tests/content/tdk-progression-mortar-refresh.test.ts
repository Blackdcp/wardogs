import {createHash} from "node:crypto";
import {access} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {getItemType} from "../../src/features/items/item-library";
import {isItemDetailRouteAvailable} from "../../src/features/items/item-route-availability";
import {getMapMeasurementCopy} from "../../src/features/maps/map-measurement-copy";

const locales = ["en", "ru", "de", "pt-br", "ja", "zh-cn", "zh-tw", "pl"] as const;
const slugs = ["wardogs-achievements", "wardogs-progression-wipes-guide", "wardogs-mortar-guide"] as const;

// Pre-edit title, description, keyword and slug digests, in the slug order above.
const metadataBaseline = {
  en: ["53bec00f32596ba90db71b51057bdefbc43008480736bc13b6892ceea4d10b67", "f9d8b57e888b6a6ca54e9dff0ebbba44c8308e089f6ac0ca70fe9fc98175e663", "9ff948f12ceba7b58e2b795b29d52acc5e33fc305f115c9269d3b00947a80b75"],
  ru: ["edaf25d19a8ae1ed1c164c82566565afb5acde379044014f2117b5443f8eb484", "75a6ed4056d12b45e151bb233723ca790bd5b41da17e6d36c9fd6b03386097f2", "6ac8f2bb75dc239b0baf1f78b1fb515e06bbdc195a86ab70907b5a62da9961dc"],
  de: ["36c1826af9f501763571828e1550056e638189a4a028d699b067eaf8483bfe69", "7d8a09e289c264bf26f595e4a5a61007353e141a4e13dedfb62365ecff99b689", "0d2dd3121f9a942e8a971ff16d16b11a48c83fea902eae1ff9bf23187bc1dff2"],
  "pt-br": ["d88c2afece53c82398969adb85612a0e10375832816b44920b1bcb811d98a755", "d032d90d3531ce7e6cb117164205f42f860af56567fc872b0896d141ad15c2bc", "4a4b75be318713767043cc657d466d166b270c5bfd922bc3bbf3d0ead18b5c74"],
  ja: ["ef43e8769c34752cacb3839c9d08a9155c3c28b149074a87576a130f6a300c67", "3dcbc593a76a55b199d85f9f84dd43dbe8f6f7d5bc3e3f85b67b97b222a0bfb8", "9aedf072ee5d017a60f43f68289514ec45878c1576ef4e59222342b499cb25b2"],
  "zh-cn": ["0d06e04228bc39f800126dd389d57fdeec185fae1e29190ebe0356e3133f8259", "b9671a42fc2ecc29b20b5f3a4501cf53fd333cf510abba8ddfeaa6ff9ad1e522", "155a375460b6b243b4bf14e3084a21447bb5f7c25c03949831aad159859091f6"],
  "zh-tw": ["04dc9f0542334683c3fce2f9979c0397eb6d018ebdf3194e84d6cf07c253f09c", "4dc9e1edac064f88738064277ce2cefea78f9750a0a7fce78b7c2e1090e8a907", "8c1240b122d43d3cb3811076e14713e853a087ddffccacf9b0bc5e0bf5fd97be"],
  pl: ["99fde2ce0954c246d4a81fbaff0f9ea950adf8b4932a2cb3a22e635970e7705e", "97fb0bf9592df395822b3c8c1685610c8b56f68dc8941f2c1ce425d0803e4601", "b80cee330bb322f38b3319f7b64308ebd17fdca8671a5b95de4bde6a98f4d697"],
};
const headingCounts = {
  en: [7, 18, 16], ru: [7, 14, 14], de: [7, 14, 15], "pt-br": [7, 14, 15],
  ja: [7, 14, 11], "zh-cn": [7, 15, 14], "zh-tw": [7, 15, 14], pl: [7, 18, 15],
};

const boundaries = {
  en: {
    achievements: ["**Public condition:", "**Hidden condition:", "**Expected result, still locked:", "not a tested fix", "No fixed synchronization wait"],
    progression: ["Role/class level is not Career level", "not your Career level", "not the full unlock roster", "An empty changes list", "do **not** establish the season-end automatic cash-conversion rate"],
    mortar: ["no verified game-world coordinate conversion or azimuth output", "image pixels only, not meters", "uniform image scale", "bounds cover only your entered distance and point errors", "not a precise mortar or artillery calculator", "Reference notes and build are included in the link"],
  },
  ru: {
    achievements: ["**Открытое условие:", "**Скрытое условие:", "**Результат ожидаемый, но значок закрыт:", "не испытанное исправление", "Фиксированное ожидание синхронизации"],
    progression: ["Уровень роли/класса не равен уровню карьеры", "не уровень Career", "не полный список открытий", "Пустой список означает", "**не** устанавливают курс автоматической конвертации"],
    mortar: ["нет проверенного перевода в игровые координаты и вывода азимута", "только в пикселях изображения, не в метрах", "равномерный масштаб изображения", "только заданные ошибки расстояния и точек", "не точный миномётный или артиллерийский калькулятор", "включая заметки об источнике и версию игры"],
  },
  de: {
    achievements: ["**Öffentliche Bedingung:", "**Versteckte Bedingung:", "**Erwartetes Ergebnis, weiterhin gesperrt:", "keine getestete Fehlerbehebung", "Eine feste Synchronisationsfrist"],
    progression: ["Rollen-/Klassenlevel und Karriere-Level (Career) sind nicht dasselbe", "nicht dein Career-Level", "keine vollständige Freischaltliste", "Eine leere Änderungsliste", "**nicht** den Kurs der automatischen Cash-Umrechnung zum Saisonende"],
    mortar: ["keine bestätigte Umrechnung in Spielkoordinaten und keine Azimut-Ausgabe", "nur Bildpixel, keine Meter", "gleichmäßiger Bildmaßstab", "nur die eingegebenen Entfernungs- und Punktfehler", "kein präziser Mörser- oder Artillerierechner", "Quelle und Spielversion stehen ebenfalls im Link"],
  },
  "pt-br": {
    achievements: ["**Condição pública:", "**Condição oculta:", "**Resultado esperado, mas ainda bloqueada:", "não uma correção testada", "prazo fixo de sincronização"],
    progression: ["Nível de função/classe não é nível de Carreira", "não o nível Career", "não uma lista completa de desbloqueios", "Uma lista vazia indica", "**não** estabelecem a cotação da conversão automática"],
    mortar: ["não conversão verificada para coordenadas do jogo nem saída de azimute", "pixels da imagem, não em metros", "escala da imagem é considerada uniforme", "apenas erros de distância e pontos fornecidos", "não uma calculadora precisa de morteiro ou artilharia", "Notas da referência e versão do jogo entram no link"],
  },
  ja: {
    achievements: ["**公開条件がある場合：", "**条件が非公開の場合：", "**条件を満たしたように見えるのに未解除の場合：", "実機で検証した修正方法ではありません", "固定の同期待ち時間"],
    progression: ["ロール／クラスのレベルとCareerレベルは別", "Careerレベルを代わりに入れない", "全解除一覧", "変更欄が空でも", "シーズン終了時のCash自動変換レートを確定するものではありません"],
    mortar: ["ゲーム座標への検証済み変換や方位角の出力はありません", "画像ピクセルの距離だけで、メートル値ではありません", "画像の縮尺が均一", "入力した距離・端点の誤差のみ", "正確な迫撃砲・砲兵計算機ではありません", "リンクには基準の記録とゲームのバージョンも含まれる"],
  },
  "zh-cn": {
    achievements: ["**条件已公开：", "**条件隐藏：", "**看似达标但仍未触发：", "不是已经实测有效的修复方案", "没有已确认的固定同步等待时间"],
    progression: ["角色／职业等级不等于生涯等级", "不要填 Career 等级", "不是完整解锁清单", "变更列表为空", "现行换汇率不等于季末剩余现金的自动转换率"],
    mortar: ["没有经过验证的游戏世界坐标换算或方位角输出", "图片像素距离，不是米数", "图片比例均匀", "范围只覆盖输入的距离与端点误差", "不是精确迫击炮／火炮计算器", "链接会包含基准记录与游戏版本"],
  },
  "zh-tw": {
    achievements: ["**條件已公開：", "**條件隱藏：", "**看似達標但仍未觸發：", "不是經過實測的修復方法", "沒有已確認的固定同步等待時間"],
    progression: ["角色／職業等級不等於生涯等級", "不要填 Career 等級", "不是完整解鎖清單", "變更列表為空", "現行匯率不等於季末剩餘現金的自動轉換率"],
    mortar: ["沒有經過驗證的遊戲世界座標換算或方位角輸出", "圖片畫素距離，不是公尺數", "圖片比例均勻", "範圍只涵蓋輸入的距離及端點誤差", "不是精確的迫擊砲／火炮計算器", "連結會包含基準記錄和遊戲版本"],
  },
  pl: {
    achievements: ["**Jawny warunek:", "**Ukryty warunek:", "**Oczekiwany wynik, nadal blokada:", "nie przetestowana naprawa", "stałego czasu synchronizacji"],
    progression: ["Poziom roli/klasy to nie poziom kariery", "nie poziom Career", "nie pełną listę odblokowań", "Pusta lista oznacza", "**nie** ustalają one kursu automatycznej konwersji"],
    mortar: ["nie zweryfikowane przeliczenie na współrzędne świata gry ani wynik azymutu", "tylko piksele obrazu, nie metry", "jednolitą skalę obrazu", "tylko podane błędy odległości i punktów", "nie precyzyjny kalkulator moździerza lub artylerii", "Notatki odniesienia i wersja gry również trafiają do linku"],
  },
};

describe.each(locales)("TDK progression and mortar refresh: %s", (locale) => {
  it.each(slugs)("preserves metadata and headings and compiles %s", async (slug) => {
    const guide = await loadGuideDocument(locale, slug);
    expect(guide).not.toBeNull();
    if (!guide) throw new Error(`Missing guide: ${locale}/${slug}`);
    const {title, description, keyword, slug: actualSlug} = guide.frontmatter;
    const digest = createHash("sha256").update(JSON.stringify([title, description, keyword, actualSlug])).digest("hex");
    const index = slugs.indexOf(slug);
    expect(digest).toBe(metadataBaseline[locale][index]);
    const headings = [...guide.body.matchAll(/^## (.+)$/gm)].map(([, heading]) => heading.trim());
    expect(headings).toHaveLength(headingCounts[locale][index]);
    expect(new Set(headings).size).toBe(headings.length);
    await expect(compileLocalizedGuideBody(guide.body, {}, locale)).resolves.toHaveProperty("content");
  });

  it("separates public, hidden and missing triggers without a tested-fix claim", async () => {
    const guide = await loadGuideDocument(locale, slugs[0]);
    const body = guide!.body;
    const diagnosis = body.split(/^## /m)[1];
    for (const text of boundaries[locale].achievements) expect(diagnosis).toContain(text);
    for (const name of ["Fat Stacks", "Big Spender", "That was rude"]) expect(diagnosis).toContain(name);
    expect(diagnosis).toContain(`/${locale}/tools/loadout-budget`);
    expect(guide!.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://steamcommunity.com/stats/1867240/achievements", kind: "official", checkedAt: "2026-09-26",
    }));
    const achievementNames = ["This is WARDOGS", "Ricochet", "Fat Stacks", "That was rude", "Long Shot", "Top Dog", "CZ Survivor", "Do Not Resuscitate", "Clean Sweep", "Big Spender"];
    for (const name of achievementNames) expect(body.split("\n").filter((line) => line.startsWith(`| ${name} |`))).toHaveLength(1);
  });

  it("bounds role planning and distinguishes live Gold exchange from season-end conversion", async () => {
    const guide = await loadGuideDocument(locale, slugs[1]);
    for (const text of boundaries[locale].progression) expect(guide!.body).toContain(text);
    for (const href of [`/${locale}/tools/progression-route`, `/${locale}/gold-market`, `/${locale}/items/vehicles/l2a6`]) {
      expect(guide!.body).toContain(`](${href})`);
    }
    for (const url of [
      "https://store.steampowered.com/news/app/1867240/view/701027323413004455",
      "https://www.youtube.com/watch?v=PQvtvAvl-78&t=185s",
    ]) expect(guide!.frontmatter.sources).toContainEqual(expect.objectContaining({url, kind: "official"}));
    expect(guide!.body).not.toContain("/guides/wardogs-class-progression");
  });

  it("documents implemented ruler controls without treating geometry as ballistics", async () => {
    const guide = await loadGuideDocument(locale, slugs[2]);
    for (const text of boundaries[locale].mortar) expect(guide!.body).toContain(text);
    const copy = getMapMeasurementCopy(locale);
    for (const text of [copy.measure, copy.reference, copy.center, copy.apply]) expect(guide!.body).toContain(`**${text}**`);
    for (const href of [`/${locale}/tools/map`, `/${locale}/items/weapons/mortar`]) expect(guide!.body).toContain(`](${href})`);
  });

  it("keeps contextual links localized and checks their actual route targets", async () => {
    for (const slug of slugs) {
      const guide = await loadGuideDocument(locale, slug);
      const links = [...guide!.body.matchAll(/\]\((\/[^)#?\s]+)(?:[?#][^)]*)?\)/g)];
      expect(links.length).toBeGreaterThan(0);
      for (const [, href] of links) {
        expect(href, `${locale}/${slug}: ${href}`).toMatch(new RegExp(`^/${locale}/`));
        const route = href.slice(locale.length + 1);
        if (route.startsWith("/guides/")) {
          await expect(access(path.join("content", `${href.slice(1)}.mdx`))).resolves.toBeUndefined();
        } else if (route.startsWith("/items/")) {
          const parts = route.split("/").filter(Boolean);
          if (parts.length === 3) expect(isItemDetailRouteAvailable(locale, route), href).toBe(true);
          else expect(getItemType(parts[1]), href).toBeDefined();
        } else {
          await expect(access(path.join("src", "app", "[locale]", route.slice(1), "page.tsx"))).resolves.toBeUndefined();
        }
      }
    }
  });
});
