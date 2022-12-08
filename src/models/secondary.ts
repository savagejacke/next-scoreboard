export interface Secondary {
  title: string;
  type: SecondaryType;
  armyRequirement: string;
  score: number;
  rules?: string;
}

export const SECONDARY_TYPES = [
  "Purge The Enemy",
  "No Mercy, No Respite",
  "Warpcraft",
  "Battlefield Supremacy",
  "Shadow Operations",
] as const;

export type SecondaryType = typeof SECONDARY_TYPES[number];
