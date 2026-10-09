import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";
import {mdxComponents} from "../../src/components/mdx/mdx-components";
import {compileLocalizedGuideBody, loadGuideDocument} from "../../src/content/guides";
import {prepareGuideBodyForTaskPanel} from "../../src/features/guides/guide-task-body";
import {getGuideTaskData} from "../../src/features/guides/guide-task-data";

async function renderJapaneseGuide(slug: string) {
  const guide = await loadGuideDocument("ja", slug);
  if (!guide) throw new Error(`Missing Japanese guide: ${slug}`);
  const task = getGuideTaskData(slug, "ja");
  const body = prepareGuideBodyForTaskPanel(guide.body, "ja", Boolean(task));
  const compiled = await compileLocalizedGuideBody(body, mdxComponents, "ja");
  return {guide, task, html: renderToStaticMarkup(compiled.content), compiled};
}

function before(html: string, first: string, second: string) {
  expect(html).toContain(first);
  expect(html).toContain(second);
  expect(html.indexOf(first)).toBeLessThan(html.indexOf(second));
}

describe("Japanese answers before historical context and troubleshooting", () => {
  it("answers how to join friends before microphone diagnosis", async () => {
    const {guide, task, html} = await renderJapaneseGuide("wardogs-squad-guide");
    expect(task).toBeUndefined();
    expect(guide.frontmatter.directAnswer).toMatch(/同じサーバー、同じ陣営、同じ分隊/);
    expect(guide.frontmatter.directAnswer).not.toMatch(/Windows|マイク|権限/);
    expect(guide.body).toMatch(/^## 先に結論/);
    expect(guide.body).not.toContain(guide.frontmatter.directAnswer);
    before(html, "同じサーバー名・同じ陣営・集合地点", "Windowsで入力機器");
    before(html, "Steamのフレンド一覧", "音声不調を機器");
    expect(html).toContain("/ja/guides/wardogs-community-servers-guide");
    expect(html).toContain("/ja/guides/wardogs-known-issues");
    before(html, "DeployのOfficial / Community / Infantry Mode / Low-Level区分", "Windowsで入力機器");
    expect(html).toContain("Join後の接続表示と待機列の順位");
    expect(html).toContain("ゲームの定員ではありません");
    expect(guide.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://store.steampowered.com/news/app/1867240/view/712287592723252267",
      kind: "official", checkedAt: "2026-10-09",
    }));
  });

  it("keeps the wipe asset table ahead of patch history after task-panel preparation", async () => {
    const {guide, task, html} = await renderJapaneseGuide("wardogs-progression-wipes-guide");
    expect(task?.directAnswer).toMatch(/CashとXPがリセット/);
    expect(task?.directAnswer).toMatch(/Gold Barsとコスメは維持/);
    expect(task?.directAnswer).toMatch(/移行時刻・換算率・購入済み解除の扱いは未発表/);
    before(html, "資産別ワイプ確認表", "2026年9月30日のパッチ記録");
    before(html, "資産別ワイプ確認表", "6つのロール系統");
    expect(html).toContain("過去のClosed BetaからEarly Accessへの移行メモ");
    expect(html).not.toContain("Early Access移行の日時や対応表は未発表");
    expect(html).toContain("シーズン終了時のCash自動変換レートを確定するものではありません");
    expect(guide.frontmatter.sources.some(({kind, url}) => kind === "official" && url.includes("PQvtvAvl-78"))).toBe(true);
    before(html, "日本時間の何時に切り替わるかは未発表", "資産別ワイプ確認表");
    expect(html).toContain("過去の08:00 UTCメンテナンスを今回の開始時刻へ転用");
    expect(guide.frontmatter.faq).toContainEqual(expect.objectContaining({
      question: "WARDOGSの次のワイプはいつですか？日本時間で何時？",
      answer: expect.stringContaining("正確な移行時刻と日本時間は未発表"),
    }));
  });

  it("leads mortar users through loading and the calculator before dated emplacement examples", async () => {
    const {guide, task, html} = await renderJapaneseGuide("wardogs-mortar-guide");
    expect(task?.directAnswer).toMatch(/対応弾薬と装填状態/);
    expect(task?.directAnswer).toMatch(/仰角・飛翔時間は推定値/);
    before(html, "装填失敗と照準誤差", "距離測定から迫撃砲計算機");
    before(html, "/ja/tools/artillery-calculator", "Season 1で確認した3種類");
    expect(html).toContain("L81と数値直接入力");
    expect(html).toContain("初期の推定メートル値は仮定の縮尺に基づく");
    expect(html).toContain("2026年9月15日時点のSeason 1");
    before(html, "迫撃砲の作り方と最初の1発", "距離測定から迫撃砲計算機");
    expect(html).toContain("2026年9月3日公開");
    expect(html).toContain("現行クライアントの再現テストではありません");
    expect(html).toContain("FOBへの弾薬搬入が必要");
    expect(html).toContain("照準左のRNGは距離（m）、右のmilsは砲身の仰角");
    expect(html).toContain("Supportレベル3という意味ではありません");
    for (const seconds of [16, 32, 95, 201, 357, 747]) {
      expect(html).toContain(`href="https://www.youtube.com/watch?v=wiWNoWiQy_Q&amp;t=${seconds}s"`);
    }
    expect(guide.frontmatter.sources).toContainEqual(expect.objectContaining({
      url: "https://www.youtube.com/watch?v=wiWNoWiQy_Q", kind: "creator", checkedAt: "2026-10-09",
    }));
  });

  it("puts helicopter takeoff and landing ahead of unverified device configuration", async () => {
    const {guide, task, html} = await renderJapaneseGuide("wardogs-helicopter-guide");
    expect(guide.frontmatter.title).toContain("ヘリコプター");
    expect(guide.frontmatter.title).not.toContain("HOTAS");
    expect(guide.frontmatter.description).toContain("HOTASの確認事項");
    expect(task?.directAnswer).toMatch(/減速.*降下.*再進入/);
    before(html, "離陸と基本飛行", "HOTASについて");
    before(html, "着陸地点へ直接急降下せず", "離着陸と入力機器の症状");
    expect(html).toContain("機種別の検証済みプロファイルはありません");
    expect(html).toContain("具体的なキー、感度曲線、デッドゾーン値、機器別対策はここでは未検証");
    expect(html).toContain("/ja/guides/wardogs-controls");
  });
});
