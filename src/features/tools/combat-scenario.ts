import {z} from "zod";

const observed = z.number().finite().min(0).max(100_000).nullable();
export const combatScenarioSchema = z.object({
  build: z.string().trim().max(80).default(""),
  range: z.number().finite().min(0).max(5_000),
  health: z.number().finite().gt(0).max(100_000).nullable(),
  armor: z.enum(["none", "l1", "l2", "l3", "l4"]),
  hitZone: z.enum(["torso", "head", "limbs"]),
  left: z.object({damage: observed, rpm: observed, load: z.string().trim().max(80)}),
  right: z.object({damage: observed, rpm: observed, load: z.string().trim().max(80)}),
});
export type CombatScenario = z.infer<typeof combatScenarioSchema>;
export const emptyCombatScenario: CombatScenario = {
  build: "",
  range: 25, health: null, armor: "none", hitZone: "torso",
  left: {damage: null, rpm: null, load: ""}, right: {damage: null, rpm: null, load: ""},
};

// Damage is measured after range, hit-zone and armor effects. Never apply invented multipliers.
export function calculateCombatScenario(scenario: CombatScenario, side: "left" | "right") {
  if (!combatScenarioSchema.safeParse(scenario).success) return {status: "missing" as const, shots: null, seconds: null};
  const {damage, rpm, load} = scenario[side];
  if (scenario.health === null || damage === null || !load.trim()) return {status: "missing" as const, shots: null, seconds: null};
  if (damage === 0) return {status: "no-damage" as const, shots: null, seconds: null};
  const shots = Math.ceil(scenario.health / damage);
  return {status: "estimated" as const, shots, seconds: shots === 1 ? 0 : rpm !== null && rpm > 0 ? (shots - 1) * 60 / rpm : null};
}

export function changeCombatContext(scenario: CombatScenario, changes: Partial<Pick<CombatScenario, "range" | "armor" | "hitZone">>): CombatScenario {
  if (Object.entries(changes).every(([key, value]) => scenario[key as keyof CombatScenario] === value)) return scenario;
  return {...scenario, ...changes, left: {...scenario.left, damage: null}, right: {...scenario.right, damage: null}};
}

export function changeCombatBuild(scenario: CombatScenario, build: string): CombatScenario {
  if (scenario.build === build) return scenario;
  return {...scenario, build, left: {...scenario.left, damage: null, rpm: null}, right: {...scenario.right, damage: null, rpm: null}};
}
