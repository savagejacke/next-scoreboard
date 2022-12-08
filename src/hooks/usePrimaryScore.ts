import { useRef } from "react";
import { type PlayerChange } from "@/zustand/zustand";

export const usePrimaryScore = (
  updatePrimaryScore: (primaryScore: number, player: PlayerChange) => void,
  player: PlayerChange
) => {
  const turn2Ref = useRef(0);
  const turn3Ref = useRef(0);
  const turn4Ref = useRef(0);
  const turn5Ref = useRef(0);

  return (newScore: number, turn: number) => {
    switch (turn) {
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

    const score = Math.min(
      turn2Ref.current + turn3Ref.current + turn4Ref.current + turn5Ref.current,
      45
    );
    updatePrimaryScore(score, player);
  };
};
