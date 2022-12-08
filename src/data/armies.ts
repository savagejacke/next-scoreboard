export const ARMIES = [
  "Adepta Sororitas",
  "Adeptus Custodes",
  "Adeptus Mechanicus",
  "Imperial Guard",
  "Grey Knights",
  "Imperial Knights",
  "Space Marines",
  "Chaos Daemons",
  "Chaos Knights",
  "Chaos Marines",
  "Death Guard",
  "Thousand Sons",
  "Craftworld Eldar",
  "Drukhari",
  "Genestealer Cults",
  "Harlequins",
  "Necrons",
  "Orks",
  "Ta'u Empire",
  "Tyranids",
  "Leagues of Votann",
] as const;

export const CHAPTERS = [
  "Black Templars",
  "Blood Angels",
  "Dark Angels",
  "Deathwatch",
  "Imperial Fists",
  "Iron Hands",
  "Raven Guard",
  "Salamanders",
  "Space Wolves",
  "Ultramarines",
  "White Scars",
];

export const LEGIONS = [
  "Alpha Legion",
  "Black Legion",
  "Emperor's Children",
  "Iron Warriors",
  "Night Lords",
  "Word Bearers",
  "World Eaters",
  "Red Corsairs",
  "Creations of Bile",
];

export type Army = typeof ARMIES[number] | "None";
