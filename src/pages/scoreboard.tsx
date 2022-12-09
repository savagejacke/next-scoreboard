import { useActionScore } from "@/hooks/useActionScore";
import { usePrimaryScore } from "@/hooks/usePrimaryScore";
import { useSecondaryScore } from "@/hooks/useSecondaryScore";
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
      <div className="flex basis-1/5 flex-row py-4">
        <PrimaryCols playerNumber={playerNumber} />
        <SecondaryCol idx={0} player={playerNumber} />
        <SecondaryCol idx={1} player={playerNumber} />
        <SecondaryCol idx={2} player={playerNumber} />
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
    <>
      <div className="flex flex-col">
        <div className="border border-gray-400 text-center">
          <h3 className="text-center font-semibold">Primary</h3>
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            placeholder="-"
            disabled
            className="border border-gray-400 bg-gray-100 text-center"
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 2, "Basic")}
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 3, "Basic")}
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 4, "Basic")}
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 5, "Basic")}
          />
        </div>
        <div className="border border-gray-400 text-center">{score}</div>
      </div>
      <div className="flex flex-col">
        <div className="border border-gray-400 text-center">
          <h3 className="font-semibold">Additional Primary</h3>
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            placeholder="-"
            disabled
            className="border border-gray-400 bg-gray-100 text-center"
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 2, "Additional")}
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 3, "Additional")}
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 4, "Additional")}
          />
          <input
            type="number"
            className="border border-gray-400 bg-white text-center"
            onChange={(e) => update(+e.target.value, 5, "Additional")}
          />
          <div className="border border-gray-400 text-center">-</div>
        </div>
      </div>
    </>
  );
};

const SecondaryCol: React.FC<{ idx: number; player: PlayerChange }> = ({
  idx,
  player,
}) => {
  const secondary = useGameStore((state) =>
    player === "player1"
      ? state.player1.secondaries[idx]
      : state.player2.secondaries[idx]
  );
  const update = useSecondaryScore(idx, player);

  if (
    secondary?.title === "Warp Ritual" ||
    secondary?.title === "Retrieve Nephilim Data"
  )
    return <ActionSecondaryCol idx={idx} playerNumber={player} />;

  return (
    <div className="flex flex-col">
      <div className="border border-gray-400 px-1 text-center">
        <h3 className="font-semibold">{secondary?.title}</h3>
      </div>
      <div className="flex flex-col">
        <input
          type="number"
          className="border border-gray-400 bg-white text-center"
          onChange={(e) => update(+e.target.value, 1)}
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
        <div className="border border-gray-400 text-center">
          {secondary?.score}
        </div>
      </div>
    </div>
  );
};

const ActionSecondaryCol: React.FC<{
  idx: number;
  playerNumber: PlayerChange;
}> = ({ idx, playerNumber }) => {
  const player = useGameStore((state) =>
    playerNumber === "player1" ? state.player1 : state.player2
  );
  const secondary = player.secondaries[idx];
  const update = useActionScore(idx, playerNumber);

  return (
    <div className="flex flex-col">
      <div className="border border-gray-400 px-1 text-center">
        <h3 className="font-semibold">{secondary?.title}</h3>
      </div>
      <div className="flex justify-around border border-gray-400 bg-white text-center">
        <label
          htmlFor={`turn1${player.name}-${secondary?.title}`}
          className="ml-1"
        >
          Action Completed
        </label>
        <input
          type="checkbox"
          id={`turn1${player.name}-${secondary?.title}`}
          onChange={() => update(1)}
          className="mx-1"
        />
      </div>
      <div className="flex justify-around border border-gray-400 bg-white text-center">
        <label
          htmlFor={`turn2${player.name}-${secondary?.title}`}
          className="ml-1"
        >
          Action Completed
        </label>
        <input
          type="checkbox"
          id={`turn2${player.name}-${secondary?.title}`}
          onChange={() => update(2)}
          className="mx-1"
        />
      </div>
      <div className="flex justify-around border border-gray-400 bg-white text-center">
        <label
          htmlFor={`turn3${player.name}-${secondary?.title}`}
          className="ml-1"
        >
          Action Completed
        </label>
        <input
          type="checkbox"
          id={`turn3${player.name}-${secondary?.title}`}
          onChange={() => update(3)}
          className="mx-1"
        />
      </div>
      <div className="flex justify-around border border-gray-400 bg-white text-center">
        <label
          htmlFor={`turn4${player.name}-${secondary?.title}`}
          className="ml-1"
        >
          Action Completed
        </label>
        <input
          type="checkbox"
          id={`turn4${player.name}-${secondary?.title}`}
          onChange={() => update(4)}
          className="mx-1"
        />
      </div>
      <div className="flex justify-around border border-gray-400 bg-white text-center">
        <label
          htmlFor={`turn5${player.name}-${secondary?.title}`}
          className="ml-1"
        >
          Action Completed
        </label>
        <input
          type="checkbox"
          id={`turn5${player.name}-${secondary?.title}`}
          onChange={() => update(5)}
          className="mx-1"
        />
      </div>
      <div className="border border-gray-400 text-center">
        {secondary?.score}
      </div>
    </div>
  );
};
