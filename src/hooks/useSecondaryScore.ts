import { type PlayerChange, useGameStore } from "@/zustand/zustand";
import { useRef } from "react";

export const useSecondaryScore = (idx: number, player: PlayerChange) => {
  const { updateSecondaryScore, title } = useGameStore((state) => ({
    updateSecondaryScore: state.updateSecondaryScore,
    title:
      player === "player1"
        ? state.player1.secondaries[idx]?.title
        : state.player2.secondaries[idx]?.title,
  }));
  const turn1Ref = useRef(0);
  const turn2Ref = useRef(0);
  const turn3Ref = useRef(0);
  const turn4Ref = useRef(0);
  const turn5Ref = useRef(0);

  if (title === "No Prisoners")
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

      const count =
        turn1Ref.current +
        turn2Ref.current +
        turn3Ref.current +
        turn4Ref.current +
        turn5Ref.current;
      const score = Math.floor(count / 10);
      if (count < 50) updateSecondaryScore(score, idx, player);
      else if (count < 100) updateSecondaryScore(score + 1, idx, player);
      else updateSecondaryScore(Math.min(score + 2, 15), idx, player);
    };

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
