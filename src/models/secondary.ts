export interface Secondary {
  title: string;
  type: SecondaryType;
  armyRequirement: string;
  score: number;
  rules?: string;
}

type SecondaryType =
  | "Purge The Enemy"
  | "No Mercy, No Respite"
  | "Warpcraft"
  | "Battlefield Supremacy"
  | "Shadow Operations";
