import { useActionScore } from "@/hooks/useActionScore";
import { usePrimaryScore } from "@/hooks/usePrimaryScore";
import { useSecondaryScore } from "@/hooks/useSecondaryScore";
import { trpc } from "@/utils/trpc";
import { type PlayerChange, useGameStore } from "@/zustand/zustand";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const ScoreboardPage: NextPage = () => {
  const { status } = useSession();

  return (
    <div className="flex flex-col items-center p-8">
      <Scoreboard playerNumber="player1" />
      <Scoreboard playerNumber="player2" />
      {status === "authenticated" && <GameLogger />}
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
    <div className="p-4 max-w-1/2">
      <h2 className="text-4xl font-bold text-center">
        {player.name} - {score}
      </h2>
      <div className="flex flex-row py-4 basis-1/5">
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
        <div className="text-center border border-gray-400">
          <h3 className="font-semibold text-center">Primary</h3>
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            placeholder="-"
            disabled
            className="text-center bg-gray-100 border border-gray-400"
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 2, "Basic")}
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 3, "Basic")}
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 4, "Basic")}
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 5, "Basic")}
          />
        </div>
        <div className="text-center border border-gray-400">{score}</div>
      </div>
      <div className="flex flex-col">
        <div className="text-center border border-gray-400">
          <h3 className="font-semibold">Additional Primary</h3>
        </div>
        <div className="flex flex-col">
          <input
            type="number"
            placeholder="-"
            disabled
            className="text-center bg-gray-100 border border-gray-400"
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 2, "Additional")}
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 3, "Additional")}
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 4, "Additional")}
          />
          <input
            type="number"
            className="text-center bg-white border border-gray-400"
            onChange={(e) => update(+e.target.value, 5, "Additional")}
          />
          <div className="text-center border border-gray-400">-</div>
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
      <div className="px-1 text-center border border-gray-400">
        <h3 className="font-semibold">{secondary?.title ?? "N/A"}</h3>
      </div>
      <div className="flex flex-col">
        <input
          type="number"
          className="text-center bg-white border border-gray-400"
          onChange={(e) => update(+e.target.value, 1)}
        />
        <input
          type="number"
          className="text-center bg-white border border-gray-400"
          onChange={(e) => update(+e.target.value, 2)}
        />
        <input
          type="number"
          className="text-center bg-white border border-gray-400"
          onChange={(e) => update(+e.target.value, 3)}
        />
        <input
          type="number"
          className="text-center bg-white border border-gray-400"
          onChange={(e) => update(+e.target.value, 4)}
        />
        <input
          type="number"
          className="text-center bg-white border border-gray-400"
          onChange={(e) => update(+e.target.value, 5)}
        />
        <div className="text-center border border-gray-400">
          {secondary?.score ?? 0}
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
      <div className="px-1 text-center border border-gray-400">
        <h3 className="font-semibold">{secondary?.title}</h3>
      </div>
      <div className="flex justify-around text-center bg-white border border-gray-400">
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
      <div className="flex justify-around text-center bg-white border border-gray-400">
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
      <div className="flex justify-around text-center bg-white border border-gray-400">
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
      <div className="flex justify-around text-center bg-white border border-gray-400">
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
      <div className="flex justify-around text-center bg-white border border-gray-400">
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
      <div className="text-center border border-gray-400">
        {secondary?.score ?? 0}
      </div>
    </div>
  );
};

const GameLogger: React.FC = () => {
  const { player1, player2 } = useGameStore((state) => ({
    player1: state.player1,
    player2: state.player2,
  }));
  const { mutateAsync } = trpc.game.logGame.useMutation();
  const router = useRouter();
  const [numberOfRounds, setNumberOfRounds] = useState(1);
  const [description, setDescription] = useState("");

  const logGame = async () => {
    const player1Score =
      player1.primaryScore +
      player1.secondaries.reduce((val, sec) => val + sec.score, 0);
    const player2Score =
      player2.primaryScore +
      player2.secondaries.reduce((val, sec) => val + sec.score, 0);

    const p1LogArmy =
      player1.army.includes("Space Marines") ||
      player1.army.includes("Chaos Marines")
        ? player1.army.substring(14)
        : player1.army;

    const p2LogArmy =
      player2.army.includes("Space Marines") ||
      player2.army.includes("Chaos Marines")
        ? player2.army.substring(14)
        : player2.army;

    await mutateAsync({
      gameType: "40k 9th Edition",
      player1: {
        name: player1.name,
        army: p1LogArmy,
        score: player1Score,
        id: player1.id,
      },
      player2: {
        name: player2.name,
        army: p2LogArmy,
        score: player2Score,
        id: player2.id,
      },
      numberOfRounds,
      description,
    });
    router.push("/results");
  };

  const describe = "Enter a description for your game if you wish";

  return (
    <div className="flex flex-col items-center">
      <label htmlFor="number-of-rounds" className="mb-1">
        How many rounds did you play?
      </label>
      <input
        type="number"
        max={5}
        id="number-of-rounds"
        onChange={(e) => setNumberOfRounds(+e.target.value)}
        value={numberOfRounds}
        className="text-center bg-white border border-black rounded-md"
      />
      <textarea
        cols={50}
        rows={3}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={describe}
        className="p-1 my-4 bg-white border border-black rounded-md"
      />
      <button
        className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={logGame}
      >
        Log game
      </button>
    </div>
  );
};
