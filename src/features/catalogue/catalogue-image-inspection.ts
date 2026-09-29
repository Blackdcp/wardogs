export type CatalogueImageOrigin =
  | "publisher-press-kit"
  | "third-party-media"
  | "owner-provided-artwork"
  | "supplied-community-artwork";

export type CatalogueImageInspection = {
  recordedOrigin: CatalogueImageOrigin;
  recordReviewedAt: string;
  captureDate: string | null;
  gameBuild: string | null;
  currentBuildVerified: boolean;
  rights: {
    evidenceReference: string | null;
    rightsHolder: string | null;
    adSupportedHosting: boolean | null;
    modifications: boolean | null;
    attributionRequirements: string | null;
    expiryOrWithdrawal: string | null;
  };
  processing: {
    historyComplete: boolean;
    aiReconstruction: "not-recorded" | "none" | "used";
  };
};

// Audits the legacy manifest, not the original capture or a grant of rights.
// Retrieval dates, filenames and object-match approvals do not fill these gaps.
export function legacyImageInspection(recordedOrigin: CatalogueImageOrigin): CatalogueImageInspection {
  return {
    recordedOrigin,
    recordReviewedAt: "2026-09-30",
    captureDate: null,
    gameBuild: null,
    currentBuildVerified: false,
    rights: {
      evidenceReference: null,
      rightsHolder: null,
      adSupportedHosting: null,
      modifications: null,
      attributionRequirements: null,
      expiryOrWithdrawal: null,
    },
    processing: {historyComplete: false, aiReconstruction: "not-recorded"},
  };
}
