export type Mission = {
  name: string;
  primary: { name: string; score: number }[];
  secondaries: { name: HeresySecondary; score: number }[];
};

type HeresySecondary =
  | "Slay the Warlord"
  | "First Blood"
  | "Last Man Standing"
  | "Attrition"
  | "Linebreaker"
  | "The Price of Failure";
