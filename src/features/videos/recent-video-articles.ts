import type {Locale} from "@/config/site";
import type {VideoArticle} from "./video-library";
import {recentVideoCopy} from "./recent-video-copy";
import {RECENT_VIDEO_CHECKED_AT, recentVideoDate, recentVideos} from "./recent-video-data";

export function getRecentVideoArticles(locale: Locale): VideoArticle[] {
  return recentVideos.filter(video => video.articleSlug).map((video, index) => {
    const copy = recentVideoCopy[video.id][locale];
    const sections = copy.notes.map((note, i) => {
      const [timestamp, ...body] = note.split(" — ");
      return {heading: `${timestamp} — ${copy.chapterTitles[i]}`, body: [body.join(" — ")]};
    });
    return {
      slug: video.articleSlug!, title: copy.title, description: copy.answer,
      youtubeId: video.id, sourceLabel: `${video.channel}: ${video.title}`,
      sourceUrl: `https://www.youtube.com/watch?v=${video.id}`,
      publishedDate: recentVideoDate(video), publishedAt: video.publishedAt,
      durationSeconds: video.durationSeconds, updatedDate: RECENT_VIDEO_CHECKED_AT,
      kind: "creator", priority: -40 + index, internalGuideSlug: video.guideSlug,
      relatedToolPath: video.toolPath, captionReview: "full-track-read",
      quickAnswer: copy.answer,
      takeaways: copy.notes.map(note => note.split(/[。]|\.\s/)[0]),
      sections,
      clips: copy.notes.map((note, i) => {
        const seconds = (value: string) => value.match(/^\d+(?::\d+){1,2}/)![0].split(":").reduce((total, part) => total * 60 + Number(part), 0);
        const body = note.split(" — ").slice(1).join(" — ");
        return {name: body.split(/[。]|\.\s/)[0], startOffset: seconds(note), endOffset: copy.notes[i + 1] ? seconds(copy.notes[i + 1]) : video.durationSeconds};
      })
    };
  });
}

export function getRecentVideoArticle(locale: Locale, slug: string) {
  return getRecentVideoArticles(locale).find(article => article.slug === slug);
}
