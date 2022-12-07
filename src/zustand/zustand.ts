import { type Player } from "@/models/player";
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
}));

interface GameState {
  player1: Player;
  player2: Player;
  updatePrimaryScore: (primaryScore: number, player: PlayerChange) => void;
  updateName: (name: string, player: PlayerChange) => void;
  updateArmy: (army: string, player: PlayerChange) => void;
}

type PlayerChange = "player1" | "player2";
