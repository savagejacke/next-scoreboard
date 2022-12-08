import { useGameStore } from "@/zustand/zustand";
import { type NextPage } from "next";

const ScoreboardPage: NextPage = () => {
  const { player1, player2 } = useGameStore((state) => ({
    player1: state.player1,
    player2: state.player2,
  }));

  return (
    <>
      <div>{player1.name}</div>
      <div>{player2.name}</div>
    </>
  );
};

export default ScoreboardPage;
