import { type PlayerChange, useGameStore } from "@/zustand/zustand";
import { useRef } from "react";

export const useSecondaryScore = (idx: number, player: PlayerChange) => {
  const updateSecondaryScore = useGameStore(
    (state) => state.updateSecondaryScore
  );
  const turn1Ref = useRef(0);
  const turn2Ref = useRef(0);
  const turn3Ref = useRef(0);
  const turn4Ref = useRef(0);
  const turn5Ref = useRef(0);

  return (newScore: number, turn: number) => {
    switch (turn) {
      case 1:
        turn1Ref.current = newScore;
        break;
      case 2:
        turn2Ref.current = newScore;
        break;
      case 3:
        turn3Ref.current = newScore;
        break;
      case 4:
        turn4Ref.current = newScore;
        break;
      case 5:
        turn5Ref.current = newScore;
        break;
    }

    const score =
      turn1Ref.current +
      turn2Ref.current +
      turn3Ref.current +
      turn4Ref.current +
      turn5Ref.current;
    updateSecondaryScore(Math.min(score, 15), idx, player);
  };
};
