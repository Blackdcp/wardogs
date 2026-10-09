import {z} from "zod";

export const attachmentRecipeIds = ["evo-m4-control", "evo-ak74-control", "evo-ak74-suppressed"] as const;
export type AttachmentRecipeId = (typeof attachmentRecipeIds)[number];
export const attachmentObservationSchema = z.object({
  recipeId: z.enum([...attachmentRecipeIds, "custom"]),
  weapon: z.string().max(80).optional(),
  grip: z.string().max(80).optional(),
  muzzle: z.string().max(80).optional(),
  rangeMeters: z.number().finite().min(0).max(5_000).nullable(),
  optic: z.string().max(80), ammo: z.string().max(80),
  stance: z.enum(["unknown", "standing", "crouched", "prone"]),
  bipod: z.enum(["unknown", "stowed", "unmounted", "mounted"]),
  magazineRounds: z.number().int().min(1).max(1_000).nullable(),
  adsMilliseconds: z.number().finite().min(0).max(60_000).nullable(),
  notes: z.string().max(400)
}).superRefine((value, context) => {
  if (value.recipeId === "custom" && value.adsMilliseconds !== null && !value.weapon?.trim()) {
    context.addIssue({code: "custom", path: ["weapon"], message: "A custom measurement needs its weapon identity."});
  }
});
export type AttachmentObservation = z.infer<typeof attachmentObservationSchema>;
export function emptyAttachmentObservation(recipeId: AttachmentObservation["recipeId"]): AttachmentObservation {
  const setups = {
    "evo-m4-control": {weapon: "M4", grip: "RVG", muzzle: "Top Comp"},
    "evo-ak74-control": {weapon: "AK74", grip: "RVG", muzzle: "CQB74"},
    "evo-ak74-suppressed": {weapon: "AK74", grip: "AFG", muzzle: "PBS4"},
    custom: {weapon: "", grip: "", muzzle: ""}
  };
  return {recipeId, ...setups[recipeId], rangeMeters: null, optic: "", ammo: "", stance: "unknown", bipod: "unknown", magazineRounds: null, adsMilliseconds: null, notes: ""};
}

/** Measurements belong to the recorded setup; editing conditions requires a new measurement. */
export function updateAttachmentObservation(current: AttachmentObservation, patch: Partial<AttachmentObservation>): AttachmentObservation {
  const context = ["recipeId", "weapon", "grip", "muzzle", "rangeMeters", "optic", "ammo", "stance", "bipod", "magazineRounds"] as const;
  const changed = context.some((field) => field in patch && patch[field] !== current[field]);
  const identityChanged = (["weapon", "grip", "muzzle"] as const).some((field) => field in patch && patch[field] !== current[field]);
  return {...current, ...patch, ...(identityChanged ? {recipeId: "custom" as const} : {}), ...(changed ? {adsMilliseconds: null} : {})};
}
