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
      { name: "Slay the Warlord", score: 0 },
      { name: "Last Man Standing", score: 0 },
      { name: "The Price of Failure", score: 0 },
    ],
  },
  {
    name: "Onslaught",
    primary: [
      { name: "Onslaught Attack", score: 0 },
      { name: "Seize the Onslaught Objectives", score: 0 },
    ],
    secondaries: [
      { name: "Slay the Warlord", score: 0 },
      { name: "Attrition", score: 0 },
      { name: "The Price of Failure", score: 0 },
    ],
  },
  {
    name: "Shatter Strike",
    primary: [{ name: "Shatter Strike", score: 0 }],
    secondaries: [
      { name: "Slay the Warlord", score: 0 },
      { name: "Attrition", score: 0 },
      { name: "The Price of Failure", score: 0 },
    ],
  },
  {
    name: "Dominion",
    primary: [{ name: "Dominion Objectives", score: 0 }],
    secondaries: [
      { name: "Slay the Warlord", score: 0 },
      { name: "Attrition", score: 0 },
      { name: "The Price of Failure", score: 0 },
    ],
  },
  {
    name: "Tide of Carnage",
    primary: [
      { name: "Player's own Deployment Zone", score: 0 },
      { name: "No Man's Land", score: 0 },
      { name: "Opposing player's Deployment Zone", score: 0 },
    ],
    secondaries: [
      { name: "Slay the Warlord", score: 0 },
      { name: "Last Man Standing", score: 0 },
      { name: "The Price of Failure", score: 0 },
    ],
  },
  {
    name: "War of Lies",
    primary: [
      { name: "Death Toll", score: 0 },
      { name: "War of Lies", score: 0 },
    ],
    secondaries: [
      { name: "Slay the Warlord", score: 0 },
      { name: "The Price of Failure", score: 0 },
    ],
  },
  {
    name: "CUSTOM MISSION",
    primary: [{ name: "Primary Objective(s)", score: 0 }],
    secondaries: [
      { name: "Attrition", score: 0 },
      { name: "First Blood", score: 0 },
      { name: "Last Man Standing", score: 0 },
      { name: "Linebreaker", score: 0 },
      { name: "Slay the Warlord", score: 0 },
      { name: "The Price of Failure", score: 0 },
    ],
  },
];
