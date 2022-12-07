import { type Player } from "@/models/player";
import type { SecondaryType, Secondary } from "@/models/secondary";
import create from "zustand/react";

export const useGameStore = create<GameState>((set) => ({
  player1: {
    name: "",
    army: "",
    secondaries: [],
    primaryScore: 0,
  },
  player2: {
    name: "",
    army: "",
    secondaries: [],
    primaryScore: 0,
  },
  updatePrimaryScore: (primaryScore: number, player: PlayerChange) => {
    if (player === "player1") {
      set((state) => ({
        player1: { ...state.player1, score: primaryScore },
      }));
    } else {
      set((state) => ({
        player2: { ...state.player2, score: primaryScore },
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
          secondaries: [...state.player2.secondaries],
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
}));

interface GameState {
  player1: Player;
  player2: Player;
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
}

export type PlayerChange = "player1" | "player2";
