import {createHash} from "node:crypto";
import {existsSync, readFileSync} from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {CatalogueCard} from "../../src/components/catalogue/catalogue-card";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {getCatalogueRecord} from "../../src/features/catalogue/catalogue-records";

const slugs = ["wardogs-fob-guide", "wardogs-equipment-tools-guide"] as const;
const cases = [
  {
    locale: "en", h2Counts: [20, 16],
    headings: ["Building will not place: which check comes next?", "A hammer or supplies: who resolves the missing requirement?"],
    editorial: /[Ee]ditorial/,
    branches: ["Terrain or overlap", "Tool, unlock or permission", "Missing resources", "Quantity or stacking"],
    stackBoundary: /exact building stack limit is unverified/,
    toolBoundary: /catalogue artwork does not confirm current structure tiers or recipes/,
    plannerBoundary: /does not verify client stock, placement or a building cap/,
    hashes: ["1e91af4572801de51205d18d93f550ec1e86227a48eb5a3e52c45d40d15bf62d", "0280205ec66993c2e4e1a9c3248d197b28e7d13df55b38f8b72d6acfc1c33281"]
  },
  {
    locale: "ru", h2Counts: [17, 12],
    headings: ["Постройка не ставится: что проверить дальше?", "Нужен молоток или ресурс: кто устраняет нехватку?"],
    editorial: /редакции|Редакционная/,
    branches: ["Рельеф или пересечение", "Инструмент, открытие или права", "Не хватает ресурсов", "Количество или установка друг на друга"],
    stackBoundary: /Точный предел такого размещения не проверен/,
    toolBoundary: /иллюстрация не подтверждает актуальные уровни построек и рецепты/,
    plannerBoundary: /не проверяет ресурсы клиента, размещение или лимит построек/,
    hashes: ["d73b532bb543559360779644d703a919a381ffce15af3faf4994b96dd039f9df", "61b66edecf1239277f97981f7a05f975a4e9c659e69fa33bd8fe415180fb40d6"]
  },
  {
    locale: "de", h2Counts: [17, 12],
    headings: ["Bau lässt sich nicht platzieren: was prüfe ich jetzt?", "Hammer oder Material: wer behebt den Engpass?"],
    editorial: /Redaktionelle/,
    branches: ["Gelände oder Überschneidung", "Werkzeug, Freischaltung oder Berechtigung", "Fehlende Ressourcen", "Anzahl oder Stapelung"],
    stackBoundary: /genaue Stapelgrenze ist ungeprüft/,
    toolBoundary: /Katalogbilder bestätigen keine aktuellen Baustufen oder Rezepte/,
    plannerBoundary: /weder Clientbestand noch Platzierung oder Baulimit/,
    hashes: ["d08c410f9147af4638f65a155ee5608de64bf5449d599f33815a078cbd57dda3", "5f2d2f385d4cd1731dd44e029481fd650825a787ad223c57f4e5747c7bffe5ba"]
  },
  {
    locale: "pt-br", h2Counts: [17, 12],
    headings: ["A construção não encaixa: o que conferir agora?", "Martelo ou material: quem resolve a falta?"],
    editorial: /editoria/,
    branches: ["Terreno ou sobreposição", "Ferramenta, desbloqueio ou permissão", "Falta de recursos", "Quantidade ou empilhamento"],
    stackBoundary: /limite exato de empilhamento não foi verificado/,
    toolBoundary: /imagem do catálogo não confirma níveis de estrutura ou receitas atuais/,
    plannerBoundary: /não verifica estoque do cliente, posição ou limite de construções/,
    hashes: ["3fdf8c584f46465ee394fafcc5aa2ec75715b227da4a8376477c08e8d2b76be8", "6e445d05dd30c88aa89218da1a39cd76b68bfaa12f2fe7cfca45d4a11e579b84"]
  },
  {
    locale: "ja", h2Counts: [12, 12],
    headings: ["建築できない時は何を確認する？", "ハンマーか資材か：誰が不足を解消する？"],
    editorial: /編集部/,
    branches: ["地形・重なり", "工具・解除・権限", "資材不足", "個数・積み重ね"],
    stackBoundary: /具体的なスタック上限は未検証/,
    toolBoundary: /カタログ画像から現行の建築段階やレシピは確定できません/,
    plannerBoundary: /在庫・配置可否・建築上限を検証するものではありません/,
    hashes: ["db6ed7e311bef5ab407fa48318e0a151312b239426a87aa2c9336867792922bf", "3f969d89acf17e7099fa7740ec659f4e5d65fab85165cda8d3b8feeb43a08247"]
  },
  {
    locale: "zh-cn", h2Counts: [19, 14],
    headings: ["建筑放不下，下一步查什么？", "缺锤子还是缺材料，由谁处理？"],
    editorial: /编辑/,
    branches: ["地形或重叠", "工具、解锁或权限", "缺资源", "数量或堆叠"],
    stackBoundary: /具体建筑堆叠上限尚未验证/,
    toolBoundary: /目录图片不能证明当前建筑等级或配方/,
    plannerBoundary: /不验证客户端库存、放置结果或建筑上限/,
    hashes: ["18a4d5a9fba88fbfa7cc3e04a29226a65ef18493641c0d05850d32cd77909985", "1f90999faf07ecd446f9e357853a7db58f368035cc28a7fc0a3857dc36f71ade"]
  },
  {
    locale: "zh-tw", h2Counts: [19, 14],
    headings: ["建築放不下，接著該查什麼？", "缺錘子還是缺材料，該由誰處理？"],
    editorial: /編輯/,
    branches: ["地形或重疊", "工具、解鎖或權限", "缺資源", "數量或堆疊"],
    stackBoundary: /具體建築堆疊上限尚未驗證/,
    toolBoundary: /圖鑑圖片不能證明目前的建築等級或配方/,
    plannerBoundary: /不驗證遊戲客戶端的庫存、放置結果或建築上限/,
    hashes: ["e4fa152261107b6b9c6f01d742b3089d472a1bd87e3ce9c6894e6e41f0944abe", "eccff75cffc48c9c351196dd4917e139f101de03310af1dae2e116ef40c86b27"]
  },
  {
    locale: "pl", h2Counts: [20, 16],
    headings: ["Nie można postawić konstrukcji: co sprawdzić dalej?", "Młotek czy materiały: kto uzupełnia brak?"],
    editorial: /redakcyjne|Redakcyjny/,
    branches: ["Teren lub nakładanie elementów", "Narzędzie, odblokowanie lub uprawnienia", "Brak zasobów", "Liczba lub układanie na sobie"],
    stackBoundary: /Dokładny limit piętrzenia konstrukcji nie został zweryfikowany/,
    toolBoundary: /grafika katalogowa nie potwierdza aktualnych poziomów konstrukcji ani receptur/,
    plannerBoundary: /nie sprawdza zapasu w grze, poprawności położenia ani limitu konstrukcji/,
    hashes: ["be083d6cdcb65a975d17768fb4d1b8db659ca60028e3c85cf38aedc0f2d1ea69", "21f34349f7e00384c80af8bb8f044d6c3c8816fc7240e9f0297083f3539162cd"]
  }
] as const;

const linkedRecords = [
  {type: "supplies", slug: "build-supply-pallet"},
  {type: "equipment", slug: "small-hammer"}
] as const;
const linksByGuide = [
  ["guides/wardogs-equipment-tools-guide", "items/supplies#record-supplies-build-supply-pallet", "guides/wardogs-cargo-guide"],
  ["items/equipment#record-equipment-small-hammer", "items/supplies#record-supplies-build-supply-pallet", "guides/wardogs-fob-guide", "tools/logistics-planner"]
] as const;

function getIncrement(body: string, heading: string) {
  const sections = body.replace(/\r/g, "").split(/^### /m).slice(1);
  expect(sections).toHaveLength(1);
  expect(sections[0].startsWith(`${heading}\n`)).toBe(true);
  return sections[0].split(/^## /m)[0].trim();
}

describe.each(cases)("TDK building answer refresh: $locale", (entry) => {
  it("preserves metadata, source dates, FAQ and existing H2 modules from 84b17fc", async () => {
    for (const [index, slug] of slugs.entries()) {
      const source = readFileSync(path.resolve("content", entry.locale, "guides", `${slug}.mdx`), "utf8");
      // Hash parsed frontmatter so line-ending and YAML-format changes do not affect the protected baseline.
      const digest = createHash("sha256").update(JSON.stringify(matter(source).data)).digest("hex");
      expect(digest, slug).toBe(entry.hashes[index]);
      const guide = await loadGuideDocument(entry.locale, slug);
      expect(guide).not.toBeNull();
      const headings = [...guide!.body.matchAll(/^## (.+)$/gm)].map(match => match[1].trim());
      expect(headings).toHaveLength(entry.h2Counts[index]);
      expect(new Set(headings).size).toBe(headings.length);
    }
  });

  it("adds one bounded diagnostic per page without new controls, prices or numeric limits", async () => {
    for (const [index, slug] of slugs.entries()) {
      const guide = await loadGuideDocument(entry.locale, slug);
      const increment = getIncrement(guide!.body, entry.headings[index]);
      expect(increment).toMatch(entry.editorial);
      expect(increment.match(/^- /gm)).toHaveLength(index === 0 ? 4 : 3);
      expect(increment).not.toMatch(/^\|/m);
      const prose = increment.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      expect(prose).not.toMatch(/\d|`|\*\*[A-Z]\*\*/);
      expect(prose.length).toBeLessThan(1_700);
      if (index === 0) {
        for (const branch of entry.branches) expect(increment).toContain(branch);
        expect(increment).toMatch(entry.stackBoundary);
      } else {
        expect(increment).toMatch(entry.toolBoundary);
        expect(increment).toMatch(entry.plannerBoundary);
      }
    }
  });

  it("compiles all additions and links to same-locale guides, tools and actual catalogue anchors", async () => {
    for (const [index, slug] of slugs.entries()) {
      const guide = await loadGuideDocument(entry.locale, slug);
      const increment = getIncrement(guide!.body, entry.headings[index]);
      const links = [...increment.matchAll(/\]\((\/[^)]+)\)/g)].map(match => match[1]);
      expect(links).toEqual(linksByGuide[index].map(href => `/${entry.locale}/${href}`));
      const compiled = await compileLocalizedGuideBody(guide!.body, mdxComponents, entry.locale);
      const html = renderToStaticMarkup(compiled.content);
      for (const href of links) {
        expect(html).toContain(`href="${href}"`);
        const relative = href.slice(entry.locale.length + 2);
        if (relative.startsWith("guides/")) {
          expect(existsSync(path.resolve("content", entry.locale, `${relative}.mdx`))).toBe(true);
        } else if (relative.startsWith("tools/")) {
          expect(existsSync(path.resolve("src/app/[locale]", relative, "page.tsx"))).toBe(true);
        } else {
          expect(existsSync(path.resolve("src/app/[locale]/items/[type]/page.tsx"))).toBe(true);
          const [category, anchor] = relative.split("#");
          const target = linkedRecords.find(record => category === `items/${record.type}` && anchor === `record-${record.type}-${record.slug}`);
          expect(target).toBeDefined();
          const record = getCatalogueRecord(target!.type, target!.slug);
          expect(record).toBeDefined();
          const cardHtml = renderToStaticMarkup(createElement(CatalogueCard, {locale: entry.locale, record: record!}));
          expect(cardHtml).toContain(`id="${anchor}"`);
        }
      }
    }
  });
});
