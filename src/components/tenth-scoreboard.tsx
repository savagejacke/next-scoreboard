import { TENTH_SECONDARIES } from "@/data/Secondaries";
import type { Mission } from "@/models/mission";
import { trpc } from "@/utils/trpc";
import { type PlayerChange } from "@/zustand/zustand";
import type { ActiveSecondary } from "@prisma/client";
import React, { useState } from "react";

const TenthScoreboard: React.FC<{
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
  const { mutateAsync: createNewSecondary } =
    trpc.game.createNewSecondary.useMutation({
      onSettled: () => ctx.game.getActiveGame.invalidate(),
    });
  const [newSecondary, setNewSecondary] = useState("");

  const onNewSecondaryCreate = async () => {
    await createNewSecondary({ name: newSecondary, playerNumber });
    setNewSecondary("");
  };

  const score =
    game.primary +
    game.secondaries.reduce((prev, curr) => prev + curr.score, 0);

  return (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="text-4xl font-bold">{game.playerName}</h1>
      <h2 className="text-4xl font-bold">{score}</h2>
      <h2 className="text-2xl font-bold">Primary Objective:</h2>
      <input
        type="number"
        value={game.primary}
        onChange={(e) =>
          mutate({ id: "primary", playerNumber, score: +e.target.value })
        }
        className="rounded-md border border-black bg-white text-center"
      />
      <h2 className="text-2xl font-bold">Secondary Objectives:</h2>
      {game.secondaries.map((sec) => (
        <div className="flex flex-col space-y-1" key={sec.id}>
          <label className="text-xl">{sec.name}</label>
          <div className="flex flex-row space-x-1">
            <input
              type="number"
              value={sec.score}
              onChange={(e) =>
                mutate({ id: sec.id, playerNumber, score: +e.target.value })
              }
              className="rounded-md border border-black bg-white text-center"
              disabled={sec.completed}
            />
            {game.missionType === "tactical" && !sec.completed && (
              <button
                className="rounded border border-solid border-blue-500 px-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() =>
                  mutate({
                    id: sec.id,
                    completed: true,
                    score: sec.score,
                    playerNumber,
                  })
                }
              >
                Complete
              </button>
            )}
          </div>
        </div>
      ))}
      {game.secondaries.reduce(
        (prev, curr) => (curr.completed ? prev : prev + 1),
        0
      ) < 2 &&
        game.missionType === "tactical" && (
          <div className="flex flex-row space-x-1">
            <select
              className="border border-solid bg-white text-center disabled:bg-gray-100"
              value={newSecondary}
              onChange={(e) => setNewSecondary(e.target.value)}
            >
              <option value="">--</option>
              {TENTH_SECONDARIES.filter(
                (sec) => !game.secondaries.some((s) => s.name === sec.name)
              ).map((sec) => (
                <option value={sec.name} key={sec.name}>
                  {sec.name}
                </option>
              ))}
            </select>
            <button
              className="rounded border border-solid border-blue-500 px-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
              onClick={onNewSecondaryCreate}
            >
              Begin Secondary
            </button>
          </div>
        )}
    </div>
  );
};

export default TenthScoreboard;

type Props = {
  playerName: string;
  mission: Mission;
  missionType: string;
  primary: number;
  secondaries: ActiveSecondary[];
};
