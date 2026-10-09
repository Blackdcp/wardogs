import {z} from "zod";

export const attachmentRecipeIds = ["evo-m4-control", "evo-ak74-control", "evo-ak74-suppressed"] as const;
export type AttachmentRecipeId = (typeof attachmentRecipeIds)[number];
export const attachmentObservationSchema = z.object({
  recipeId: z.enum(attachmentRecipeIds),
  rangeMeters: z.number().finite().min(0).max(5_000).nullable(),
  optic: z.string().max(80), ammo: z.string().max(80),
  stance: z.enum(["unknown", "standing", "crouched", "prone"]),
  bipod: z.enum(["unknown", "stowed", "unmounted", "mounted"]),
  magazineRounds: z.number().int().min(1).max(1_000).nullable(),
  adsMilliseconds: z.number().finite().min(0).max(60_000).nullable(),
  notes: z.string().max(400)
});
export type AttachmentObservation = z.infer<typeof attachmentObservationSchema>;
export function emptyAttachmentObservation(recipeId: AttachmentRecipeId): AttachmentObservation {
  return {recipeId, rangeMeters: null, optic: "", ammo: "", stance: "unknown", bipod: "unknown", magazineRounds: null, adsMilliseconds: null, notes: ""};
}

/** Measurements belong to the recorded setup; editing conditions requires a new measurement. */
export function updateAttachmentObservation(current: AttachmentObservation, patch: Partial<AttachmentObservation>): AttachmentObservation {
  const context = ["recipeId", "rangeMeters", "optic", "ammo", "stance", "bipod", "magazineRounds"] as const;
  const changed = context.some((field) => field in patch && patch[field] !== current[field]);
  return {...current, ...patch, ...(changed ? {adsMilliseconds: null} : {})};
}
