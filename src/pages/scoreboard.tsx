import { usePrimaryScore } from "@/hooks/usePrimaryScore";
import { type PlayerChange, useGameStore } from "@/zustand/zustand";
import { type NextPage } from "next";

const ScoreboardPage: NextPage = () => {
  return (
    <div className="flex flex-row justify-evenly">
      <Scoreboard playerNumber="player1" />
      <Scoreboard playerNumber="player2" />
    </div>
  );
};

export default ScoreboardPage;

const Scoreboard: React.FC<{ playerNumber: PlayerChange }> = ({
  playerNumber,
}) => {
  const player = useGameStore((state) =>
    playerNumber === "player1" ? state.player1 : state.player2
  );
  const score =
    player.primaryScore +
    player.secondaries.reduce((val, sec) => val + sec.score, 0);

  return (
    <div className="max-w-1/2 p-4">
      <h2 className="text-center text-4xl font-bold">
        {player.name} - {score}
      </h2>
      <div className="grid-rows-7">
        <PrimaryCols playerNumber={playerNumber} />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};

const PrimaryCols: React.FC<{ playerNumber: PlayerChange }> = ({
  playerNumber,
}) => {
  const { score, updatePrimaryScore } = useGameStore((state) => ({
    score:
      playerNumber === "player1"
        ? state.player1.primaryScore
        : state.player2.primaryScore,
    updatePrimaryScore: state.updatePrimaryScore,
  }));
  const update = usePrimaryScore(updatePrimaryScore, playerNumber);

  return (
    <div className="col-span-1">
      <div className="border border-gray-400 text-center">
        <h3 className="text-center font-semibold">Primary</h3>
      </div>
      <div>
        <input
          type="number"
          placeholder="-"
          disabled
          className="border border-gray-400 bg-gray-100 text-center"
        />
        <input
          type="number"
          className="border border-gray-400 bg-white text-center"
          onChange={(e) => update(+e.target.value, 2)}
        />
        <input
          type="number"
          className="border border-gray-400 bg-white text-center"
          onChange={(e) => update(+e.target.value, 3)}
        />
        <input
          type="number"
          className="border border-gray-400 bg-white text-center"
          onChange={(e) => update(+e.target.value, 4)}
        />
        <input
          type="number"
          className="border border-gray-400 bg-white text-center"
          onChange={(e) => update(+e.target.value, 5)}
        />
      </div>
      <div className="border border-gray-400 text-center">{score}</div>
    </div>
  );
};
