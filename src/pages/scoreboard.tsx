/* eslint-disable @typescript-eslint/no-non-null-assertion */
import HeresyScoreboard from "@/components/heresy-scoreboard";
import NinthScoreboard, {
  NinthGameLogger,
} from "@/components/ninth-scoreboard";
import TenthScoreboard from "@/components/tenth-scoreboard";
import { HERESY_MISSIONS } from "@/data/missions";
import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const ScoreboardPage: NextPage = () => {
  const { status } = useSession();
  const ctx = trpc.useContext();
  const { data: game, isLoading } = trpc.game.getActiveGame.useQuery();
  const { mutateAsync: logGameAsync } =
    trpc.game.logGameInProgress.useMutation();
  const { mutate: progressRound } = trpc.game.progressRound.useMutation({
    onMutate: async () => {
      ctx.game.getActiveGame.setData(undefined, (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          round: oldData.round + 1,
        };
      });
    },
    onError: () => ctx.game.getActiveGame.invalidate(),
    onSettled: () => ctx.game.getActiveGame.invalidate(),
  });
  const { mutate: regressRound } = trpc.game.regressRound.useMutation({
    onMutate: async () => {
      ctx.game.getActiveGame.setData(undefined, (oldData) => {
        if (!oldData) return undefined;
        return {
          ...oldData,
          round: oldData.round - 1,
        };
      });
    },
    onError: () => ctx.game.getActiveGame.invalidate(),
    onSettled: () => ctx.game.getActiveGame.invalidate(),
  });
  const [description, setDescription] = useState("");
  const router = useRouter();

  const mission = HERESY_MISSIONS.find(
    (mission) => mission.name === game?.mission
  );

  const logGame = async () => {
    await logGameAsync({ description });
    router.push("/results");
  };

  const describe = "Enter a description for your game if you wish";

  if (game?.gameType === "Horus Heresy") {
    if (isLoading || !game) {
      return <div>Loading...</div>;
    }
    return (
      <div className="flex w-screen flex-col items-center space-y-2 p-8">
        <div className="flex w-full flex-row items-center justify-around">
          <HeresyScoreboard
            playerNumber="player1"
            game={{
              playerName: game.player1Name,
              mission: mission ?? HERESY_MISSIONS[HERESY_MISSIONS.length - 1]!,
              primary: game.player1PrimaryScore,
              secondaries: game.player1Secondaries,
            }}
          />
          <HeresyScoreboard
            playerNumber="player2"
            game={{
              playerName: game.player2Name,
              mission: mission ?? HERESY_MISSIONS[HERESY_MISSIONS.length - 1]!,
              primary: game.player2PrimaryScore,
              secondaries: game.player2Secondaries,
            }}
          />
        </div>
        <div className="text-xl font-bold">Round {game.round}</div>
        <div className="flex flex-row space-x-2">
          <button
            className="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
            onClick={() => progressRound()}
          >
            Progress Round
          </button>
          {game.round > 1 && (
            <button
              className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
              onClick={() => regressRound()}
            >
              Regress Round
            </button>
          )}
        </div>
        <textarea
          cols={50}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={describe}
          className="rounded-md border border-black bg-white p-1"
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={logGame}
        >
          Log game
        </button>
      </div>
    );
  }
  if (game?.gameType === "40k 10th Edition") {
    if (isLoading || !game) {
      return <div>Loading...</div>;
    }
    return (
      <div className="flex w-screen flex-col items-center space-y-2 p-8">
        <div className="flex w-full flex-row items-center justify-around">
          <TenthScoreboard
            playerNumber="player1"
            game={{
              playerName: game.player1Name,
              mission: mission ?? HERESY_MISSIONS[HERESY_MISSIONS.length - 1]!,
              missionType: game.p1MissionType || "tactical",
              primary: game.player1PrimaryScore,
              secondaries: game.player1Secondaries,
            }}
          />
          <TenthScoreboard
            playerNumber="player2"
            game={{
              playerName: game.player2Name,
              mission: mission ?? HERESY_MISSIONS[HERESY_MISSIONS.length - 1]!,
              missionType: game.p2MissionType || "tactical",
              primary: game.player2PrimaryScore,
              secondaries: game.player2Secondaries,
            }}
          />
        </div>
        <div className="text-xl font-bold">Round {game.round}</div>
        <div className="flex flex-row space-x-2">
          <button
            className="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
            onClick={() => progressRound()}
          >
            Progress Round
          </button>
          {game.round > 1 && (
            <button
              className="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
              onClick={() => regressRound()}
            >
              Regress Round
            </button>
          )}
        </div>
        <textarea
          cols={50}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={describe}
          className="rounded-md border border-black bg-white p-1"
        />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={logGame}
        >
          Log game
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center p-8">
      <NinthScoreboard playerNumber="player1" />
      <NinthScoreboard playerNumber="player2" />
      {status === "authenticated" && <NinthGameLogger />}
    </div>
  );
};

export default ScoreboardPage;
