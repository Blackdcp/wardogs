import {describe, expect, it} from "vitest";
import {renderToStaticMarkup} from "react-dom/server";
import {VideoCandidateList} from "../../src/components/videos/video-candidate-list";
import {getVideoCandidateCopy} from "../../src/features/videos/video-candidate-copy";
import {videoCandidates} from "../../src/features/videos/video-candidates";
import {CANDIDATE_EVIDENCE_CHECKED_AT, getVideoCandidateEvidence, videoCandidateEvidence, videoTimestamp} from "../../src/features/videos/video-candidate-evidence";

const locales = ["en", "ja", "ru", "de", "pt-br", "zh-cn", "zh-tw", "pl"] as const;

describe("candidate caption and footage evidence", () => {
  it("preserves fourteen reviewed candidates and six metadata-only additions without calling exports verification", () => {
    expect(Object.keys(videoCandidateEvidence).sort()).toEqual(videoCandidates.map(video => video.youtubeId).sort());
    const evidence = Object.values(videoCandidateEvidence);
    expect(evidence.filter(item => item.captionReview === "not-reviewed")).toHaveLength(6);
    expect(evidence.filter(item => item.captionReview === "full-track-read")).toHaveLength(10);
    expect(evidence.filter(item => item.captionReview === "excerpts-read")).toHaveLength(3);
    expect(evidence.filter(item => item.captionReview === "unavailable")).toHaveLength(1);
    expect(evidence.filter(item => item.footage.length)).toHaveLength(13);
    expect(evidence.filter(item => item.footage.some(sample => sample.scope === "intro"))).toHaveLength(3);
    expect(CANDIDATE_EVIDENCE_CHECKED_AT).toBe("2026-09-30");
    for (const video of videoCandidates) {
      expect(video.transcriptVerified).toBe(false);
      expect(video.gameplayVerified).toBe(false);
      expect(video.embedPlaybackVerified).toBe(false);
    }
  });

  it("keeps the blocked export and future unknown IDs unreviewed", () => {
    for (const id of ["yjTYiok5yng", "unknown"]) {
      expect(getVideoCandidateEvidence(id)).toEqual({captionReview: "unavailable", footage: []});
    }
  });

  it("records inspected frames rather than substituting chapter start times", () => {
    expect(getVideoCandidateEvidence("WRp2TtPMru8").footage).toEqual([{seconds: 225, scope: "sample"}]);
    expect(getVideoCandidateEvidence("oCPyxCVQBvA").footage).toEqual([{seconds: 1126, scope: "sample"}]);
    expect(getVideoCandidateEvidence("6Xp6IRzDL4g").footage).toEqual([{seconds: 220, scope: "sample"}]);
    for (const evidence of Object.values(videoCandidateEvidence)) {
      for (const sample of evidence.footage) {
        expect(Number.isInteger(sample.seconds) && sample.seconds >= 0).toBe(true);
      }
    }
    expect(videoTimestamp(1126)).toBe("18:46");
    expect(videoTimestamp(83)).toBe("1:23");
  });

  it.each(locales)("renders distinct localized review scopes and keeps embeds opt-in: %s", locale => {
    const ui = getVideoCandidateCopy(locale);
    const html = renderToStaticMarkup(<VideoCandidateList locale={locale} />);
    expect(html).toContain(ui.summary);
    for (const status of Object.values(ui.captions)) expect(html).toContain(status);
    expect(html).toContain(ui.intro);
    expect(html).toContain(ui.noFootage);
    expect(html).toContain('href="https://www.youtube.com/watch?v=WRp2TtPMru8&amp;t=225s"');
    expect(html).toContain('href="https://www.youtube.com/watch?v=oCPyxCVQBvA&amp;t=1126s"');
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("browser-use");
    expect(html).not.toContain(".txt");
    const blockedArticle = html.split('id="candidate-yjTYiok5yng"')[1].split("</article>")[0];
    expect(blockedArticle).toContain(ui.captions.unavailable);
    expect(blockedArticle).toContain(ui.noFootage);
    expect(blockedArticle).not.toContain("&amp;t=");
  });

  it("anchors source-specific cautions to the reviewed caption passages", () => {
    const html = renderToStaticMarkup(<VideoCandidateList locale="en" />);
    for (const [id, seconds, key] of [
      ["PbvKl6Cicw4", 504, "wipe-estimate"],
      ["z8i2cQiQSjE", 141, "floating-roof"],
      ["oCPyxCVQBvA", 102, "input-overlay"]
    ] as const) {
      expect(getVideoCandidateEvidence(id).caution).toEqual({seconds, key});
      expect(html).toContain(`href="https://www.youtube.com/watch?v=${id}&amp;t=${seconds}s"`);
      expect(html).toContain(getVideoCandidateCopy("en").evidenceCautions[key]);
    }
  });

  it("falls back to English review copy without retaining the metadata-only summary", () => {
    expect(getVideoCandidateCopy("unknown")).toEqual(getVideoCandidateCopy("en"));
    expect(getVideoCandidateCopy("en").summary).toContain("not independently checked against the audio");
    expect(getVideoCandidateCopy("en").summary).not.toContain("Operations, full transcripts and embedded playback are not verified");
  });
});
