import type { Mission } from "@/models/mission";

export const HERESY_MISSIONS: Mission[] = [
  {
    name: "Blood Feud",
    primary: [
      { name: "Infantry", score: 0 },
      { name: "Daemon", score: 0 },
      { name: "Dreadnought & Automata", score: 0 },
      { name: "Cavalry & Fliers", score: 0 },
      { name: "Non-flyer Vehicles", score: 0 },
      { name: "Primarch", score: 0 },
    ],
    secondaries: [
      "Slay the Warlord",
      "Last Man Standing",
      "The Price of Failure",
    ],
  },
  {
    name: "Onslaught",
    primary: [
      { name: "Onslaught Attack", score: 0 },
      { name: "Seize the Onslaught Objectives", score: 0 },
    ],
    secondaries: ["Slay the Warlord", "Attrition", "The Price of Failure"],
  },
  {
    name: "Shatter Strike",
    primary: [{ name: "Shatter Strike", score: 0 }],
    secondaries: ["Slay the Warlord", "Attrition", "The Price of Failure"],
  },
  {
    name: "Dominion",
    primary: [{ name: "Dominion Objectives", score: 0 }],
    secondaries: ["Slay the Warlord", "Attrition", "The Price of Failure"],
  },
  {
    name: "Tide of Carnage",
    primary: [
      { name: "Player's own Deployment Zone", score: 0 },
      { name: "No Man's Land", score: 0 },
      { name: "Opposing player's Deployment Zone", score: 0 },
    ],
    secondaries: [
      "Slay the Warlord",
      "Last Man Standing",
      "The Price of Failure",
    ],
  },
  {
    name: "War of Lies",
    primary: [
      { name: "Death Toll", score: 0 },
      { name: "War of Lies", score: 0 },
    ],
    secondaries: ["Slay the Warlord", "The Price of Failure"],
  },
  {
    name: "CUSTOM MISSION",
    primary: [{ name: "Primary Objective(s)", score: 0 }],
    secondaries: [
      "Attrition",
      "First Blood",
      "Last Man Standing",
      "Linebreaker",
      "Slay the Warlord",
      "The Price of Failure",
    ],
  },
];
