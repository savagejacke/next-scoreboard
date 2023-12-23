import type { Mission } from "@/models/mission";
import { trpc } from "@/utils/trpc";
import type { PlayerChange } from "@/zustand/zustand";
import type { ActiveSecondary } from "@prisma/client";
import React from "react";

const HeresyScoreboard: React.FC<{
  playerNumber: PlayerChange;
  game: Props;
}> = ({ playerNumber, game }) => {
  const ctx = trpc.useContext();

  const { mutate } = trpc.game.updateGame.useMutation({
    onMutate: async (update) => {
      ctx.game.getActiveGame.setData(undefined, (oldData) => {
        if (!oldData) return undefined;
        if (playerNumber === "player1") {
          return {
            ...oldData,
            player1Secondaries: oldData.player1Secondaries.map((sec) => {
              if (sec.id === update.id) {
                return { ...sec, score: update.score };
              }
              return sec;
            }),
          };
        }
        return {
          ...oldData,
          player1Secondaries: oldData.player2Secondaries.map((sec) => {
            if (sec.id === update.id) {
              return { ...sec, score: update.score };
            }
            return sec;
          }),
        };
      });
    },
    onError: () => ctx.game.getActiveGame.invalidate(),
    onSettled: () => ctx.game.getActiveGame.invalidate(),
  });

  const score =
    game.primary +
    game.secondaries.reduce((prev, curr) => prev + curr.score, 0);

  return (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="text-4xl font-bold">{game.playerName}</h1>
      <h2 className="text-4xl font-bold">{score}</h2>
      <h2 className="text-2xl font-bold">Primary Objectives:</h2>
      <input
        type="number"
        value={game.primary}
        onChange={(e) =>
          mutate({ id: "primary", playerNumber, score: +e.target.value })
        }
        className="rounded-md border border-black bg-white text-center"
      />
      {game.secondaries.map((sec) => (
        <>
          <label className="text-xl">{sec.name}</label>
          <input
            type="number"
            value={sec.score}
            onChange={(e) =>
              mutate({ id: sec.id, playerNumber, score: +e.target.value })
            }
            className="rounded-md border border-black bg-white text-center"
          />
        </>
      ))}
    </div>
  );
};

export default HeresyScoreboard;

type Props = {
  playerName: string;
  mission: Mission;
  primary: number;
  secondaries: ActiveSecondary[];
};
