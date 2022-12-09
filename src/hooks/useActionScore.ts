import { useRef } from "react";
import { useGameStore, type PlayerChange } from "@/zustand/zustand";

export const useActionScore = (idx: number, player: PlayerChange) => {
  const { updateSecondaryScore, title } = useGameStore((state) => ({
    updateSecondaryScore: state.updateSecondaryScore,
    title:
      player === "player1"
        ? state.player1.secondaries[idx]?.title
        : state.player2.secondaries[idx]?.title,
  }));
  const refs = [
    useRef(false),
    useRef(false),
    useRef(false),
    useRef(false),
    useRef(false),
  ];

  if (title === "Warp Ritual")
    return (turn: number) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      refs[turn - 1]!.current = !refs[turn - 1]?.current;
      const completed = refs.reduce(
        (count, ref) => (ref.current ? count + 1 : count),
        0
      );
      if (completed < 1) updateSecondaryScore(0, idx, player);
      else if (completed === 1) updateSecondaryScore(3, idx, player);
      else if (completed === 2) updateSecondaryScore(7, idx, player);
      else updateSecondaryScore(12, idx, player);
    };

  return (turn: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    refs[turn - 1]!.current = !refs[turn - 1]?.current;
    const completed = refs.reduce(
      (count, ref) => (ref.current ? count + 1 : count),
      0
    );
    if (completed < 2) updateSecondaryScore(0, idx, player);
    else if (completed === 2) updateSecondaryScore(4, idx, player);
    else if (completed === 3) updateSecondaryScore(8, idx, player);
    else updateSecondaryScore(12, idx, player);
  };
};
