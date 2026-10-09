import {recentVideos} from "./recent-video-data";
export type CaptionReview = "full-track-read" | "excerpts-read" | "unavailable" | "not-reviewed";
export type EvidenceCaution = "wipe-estimate" | "floating-roof" | "input-overlay";

export interface CandidateEvidence {
  captionReview: CaptionReview;
  footage: readonly {seconds: number; scope: "sample" | "intro"}[];
  caution?: {seconds: number; key: EvidenceCaution};
}

export const CANDIDATE_EVIDENCE_CHECKED_AT = "2026-09-30";

// Caption text and sampled YouTube frames are not audio validation or client reproduction.
// Full exported caption tracks remain outside the repository.
export const videoCandidateEvidence: Readonly<Record<string, CandidateEvidence>> = {
  ...Object.fromEntries(recentVideos.filter(video => !video.articleSlug).map(video => [video.id, {captionReview: "not-reviewed" as const, footage: []}])) ,
  BIvKEmXlw78: {captionReview: "full-track-read", footage: [{seconds: 83, scope: "sample"}]},
  YIJ9EE8wflk: {captionReview: "excerpts-read", footage: [{seconds: 22, scope: "intro"}]},
  LfDuaJXN_g0: {captionReview: "full-track-read", footage: [{seconds: 122, scope: "sample"}]},
  PbvKl6Cicw4: {captionReview: "full-track-read", footage: [{seconds: 197, scope: "sample"}], caution: {seconds: 504, key: "wipe-estimate"}},
  oCPyxCVQBvA: {captionReview: "excerpts-read", footage: [{seconds: 1126, scope: "sample"}], caution: {seconds: 102, key: "input-overlay"}},
  dbB4BXEDAPc: {captionReview: "full-track-read", footage: [{seconds: 17, scope: "intro"}]},
  "LJhMbE-Hle8": {captionReview: "excerpts-read", footage: [{seconds: 628, scope: "sample"}]},
  "18NAV3XnXsA": {captionReview: "full-track-read", footage: [{seconds: 143, scope: "sample"}]},
  WRp2TtPMru8: {captionReview: "full-track-read", footage: [{seconds: 225, scope: "sample"}]},
  yjTYiok5yng: {captionReview: "unavailable", footage: []},
  "6Xp6IRzDL4g": {captionReview: "full-track-read", footage: [{seconds: 220, scope: "sample"}]},
  z8i2cQiQSjE: {captionReview: "full-track-read", footage: [{seconds: 41, scope: "sample"}, {seconds: 135, scope: "sample"}], caution: {seconds: 141, key: "floating-roof"}},
  gt7EZW5joDg: {captionReview: "full-track-read", footage: [{seconds: 146, scope: "sample"}]},
  SVLgG_eiLs8: {captionReview: "full-track-read", footage: [{seconds: 21, scope: "intro"}]}
};

const noEvidence: CandidateEvidence = {captionReview: "unavailable", footage: []};

export function getVideoCandidateEvidence(youtubeId: string): CandidateEvidence {
  return videoCandidateEvidence[youtubeId] ?? noEvidence;
}

export function videoTimestamp(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
