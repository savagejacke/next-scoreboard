import type { Allegiance, Player } from "@/models/player";
import type { SecondaryType, Secondary } from "@/models/secondary";
import create from "zustand";

export const useGameStore = create<GameState>((set) => ({
  player1: {
    name: "",
    army: "None",
    secondaries: [],
    primaryScore: 0,
  },
  player2: {
    name: "",
    army: "None",
    secondaries: [],
    primaryScore: 0,
  },
  gameType: "40k 9th Edition",
  updatePrimaryScore: (primaryScore: number, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => ({
        player1: { ...state.player1, primaryScore },
      }));
    } else {
      set((state) => ({
        player2: { ...state.player2, primaryScore },
      }));
    }
  },
  updateName: (name: string, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => ({
        player1: { ...state.player1, name },
      }));
    } else {
      set((state) => ({
        player2: { ...state.player2, name },
      }));
    }
  },
  updateArmy: (army: string, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => ({
        player1: { ...state.player1, army },
      }));
    } else {
      set((state) => ({
        player2: { ...state.player2, army },
      }));
    }
  },
  addSecondary: (newSecondary: Secondary, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => ({
        player1: {
          ...state.player1,
          secondaries: [...state.player1.secondaries, newSecondary],
        },
      }));
    } else {
      set((state) => ({
        player2: {
          ...state.player2,
          secondaries: [...state.player2.secondaries, newSecondary],
        },
      }));
    }
  },
  replaceSecondary: (newSecondary: Secondary, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => {
        const newSecs = state.player1.secondaries.map((sec) =>
          sec.armyRequirement === newSecondary.armyRequirement
            ? newSecondary
            : sec
        );
        return {
          player1: {
            ...state.player1,
            secondaries: newSecs,
          },
        };
      });
    } else {
      set((state) => {
        const newSecs = state.player2.secondaries.map((sec) =>
          sec.armyRequirement === newSecondary.armyRequirement
            ? newSecondary
            : sec
        );
        return {
          player2: {
            ...state.player2,
            secondaries: newSecs,
          },
        };
      });
    }
  },
  removeSecondary: (type: SecondaryType, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => ({
        player1: {
          ...state.player1,
          secondaries: state.player1.secondaries.filter(
            (sec) => sec.type != type
          ),
        },
      }));
    } else {
      set((state) => ({
        player2: {
          ...state.player2,
          secondaries: state.player2.secondaries.filter(
            (sec) => sec.type != type
          ),
        },
      }));
    }
  },
  updateSecondaryScore: (score: number, idx: number, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => {
        const newSecondaries = state.player1.secondaries.map((sec, i) =>
          i === idx ? { ...sec, score } : sec
        );
        return {
          player1: {
            ...state.player1,
            secondaries: newSecondaries,
          },
        };
      });
    } else {
      set((state) => {
        const newSecondaries = state.player2.secondaries.map((sec, i) =>
          i === idx ? { ...sec, score } : sec
        );
        return {
          player2: {
            ...state.player2,
            secondaries: newSecondaries,
          },
        };
      });
    }
  },
  updateId: (id: string | undefined, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => {
        return { player1: { ...state.player1, id } };
      });
    } else {
      set((state) => {
        return { player2: { ...state.player2, id } };
      });
    }
  },
  updateAllegiance: (
    allegiance: Allegiance | undefined,
    player: PlayerChange
  ) => {
    if (player === "player1") {
      set((state) => ({
        player1: { ...state.player1, allegiance },
      }));
    } else {
      set((state) => ({
        player2: { ...state.player2, allegiance },
      }));
    }
  },
}));

interface GameState {
  player1: Player;
  player2: Player;
  gameType: "40k 9th Edition" | "Horus Heresy";
  updatePrimaryScore: (primaryScore: number, player: PlayerChange) => void;
  updateName: (name: string, player: PlayerChange) => void;
  updateArmy: (army: string, player: PlayerChange) => void;
  addSecondary: (newSecondary: Secondary, player: PlayerChange) => void;
  replaceSecondary: (newSecondary: Secondary, player: PlayerChange) => void;
  removeSecondary: (type: SecondaryType, player: PlayerChange) => void;
  updateSecondaryScore: (
    score: number,
    idx: number,
    player: PlayerChange
  ) => void;
  updateId: (id: string | undefined, player: PlayerChange) => void;
  updateAllegiance: (
    allegiance: Allegiance | undefined,
    player: PlayerChange
  ) => void;
}

export type PlayerChange = "player1" | "player2";
