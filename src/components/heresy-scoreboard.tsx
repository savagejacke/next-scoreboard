import type { Mission } from "@/models/mission";
import { trpc } from "@/utils/trpc";
import { type PlayerChange } from "@/zustand/zustand";
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
            player1Attrition: update.attrition ?? oldData.player1Attrition,
            player1FirstBlood: update.firstBlood ?? oldData.player1FirstBlood,
            player1LastManStanding:
              update.lastManStanding ?? oldData.player1LastManStanding,
            player1Linebreaker:
              update.linebreaker ?? oldData.player1Linebreaker,
            player1PriceOfFailure:
              update.priceOfFailure ?? oldData.player1PriceOfFailure,
            player1SlayTheWarlord:
              update.slayTheWarlord ?? oldData.player1SlayTheWarlord,
            player1PrimaryScore: update.primary ?? oldData.player1PrimaryScore,
          };
        }
        return {
          ...oldData,
          player2Attrition: update.attrition ?? oldData.player2Attrition,
          player2FirstBlood: update.firstBlood ?? oldData.player2FirstBlood,
          player2LastManStanding:
            update.lastManStanding ?? oldData.player2LastManStanding,
          player2Linebreaker: update.linebreaker ?? oldData.player2Linebreaker,
          player2PriceOfFailure:
            update.priceOfFailure ?? oldData.player2PriceOfFailure,
          player2SlayTheWarlord:
            update.slayTheWarlord ?? oldData.player2SlayTheWarlord,
          player2PrimaryScore: update.primary ?? oldData.player2PrimaryScore,
        };
      });
    },
    onError: () => ctx.game.getActiveGame.invalidate(),
    onSettled: () => ctx.game.getActiveGame.invalidate(),
  });

  const score =
    game.primary +
    game.attrition +
    game.firstBlood +
    game.lastManStanding +
    game.linebreaker +
    game.priceOfFailure +
    game.slayTheWarlord;

  return (
    <div className="flex flex-col items-center space-y-2">
      <h1 className="text-4xl font-bold">{game.playerName}</h1>
      <h2 className="text-4xl font-bold">{score}</h2>
      <h2 className="text-2xl font-bold">Primary Objectives:</h2>
      <input
        type="number"
        value={game.primary}
        onChange={(e) => mutate({ primary: +e.target.value, playerNumber })}
        className="rounded-md border border-black bg-white text-center"
      />
      {game.mission.secondaries.includes("Attrition") && (
        <AttritionForm
          score={game.attrition}
          onChange={(attrition) => mutate({ attrition, playerNumber })}
        />
      )}
      {game.mission.secondaries.includes("First Blood") && (
        <FirstBloodForm
          score={game.firstBlood}
          onChange={(firstBlood) => mutate({ firstBlood, playerNumber })}
        />
      )}
      {game.mission.secondaries.includes("Last Man Standing") && (
        <LastManStandingForm
          score={game.lastManStanding}
          onChange={(lastManStanding) =>
            mutate({ lastManStanding, playerNumber })
          }
        />
      )}
      {game.mission.secondaries.includes("Linebreaker") && (
        <LinebreakerForm
          score={game.linebreaker}
          onChange={(linebreaker) => mutate({ linebreaker, playerNumber })}
        />
      )}
      {game.mission.secondaries.includes("Slay the Warlord") && (
        <SlayTheWarlordForm
          score={game.slayTheWarlord}
          onChange={(slayTheWarlord) =>
            mutate({ slayTheWarlord, playerNumber })
          }
        />
      )}
      {game.mission.secondaries.includes("The Price of Failure") && (
        <PriceOfFailureForm
          score={game.priceOfFailure}
          onChange={(priceOfFailure) =>
            mutate({ priceOfFailure, playerNumber })
          }
        />
      )}
    </div>
  );
};

export default HeresyScoreboard;

const AttritionForm: React.FC<{
  score: number;
  onChange: (attrition: number) => void;
}> = ({ score, onChange }) => {
  return (
    <>
      <label className="text-xl">Attrition</label>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(+e.target.value)}
        className="rounded-md border border-black bg-white text-center"
      />
    </>
  );
};

const FirstBloodForm: React.FC<{
  score: number;
  onChange: (firstBlood: number) => void;
}> = ({ score, onChange }) => {
  return (
    <>
      <label className="text-xl">First Blood</label>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(+e.target.value)}
        className="rounded-md border border-black bg-white text-center"
      />
    </>
  );
};

const LastManStandingForm: React.FC<{
  score: number;
  onChange: (lastManStanding: number) => void;
}> = ({ score, onChange }) => {
  return (
    <>
      <label className="text-xl">Last Man Standing</label>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(+e.target.value)}
        className="rounded-md border border-black bg-white text-center"
      />
    </>
  );
};

const LinebreakerForm: React.FC<{
  score: number;
  onChange: (linebreaker: number) => void;
}> = ({ score, onChange }) => {
  return (
    <>
      <label className="text-xl">Linebreaker</label>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(+e.target.value)}
        className="rounded-md border border-black bg-white text-center"
      />
    </>
  );
};

const SlayTheWarlordForm: React.FC<{
  score: number;
  onChange: (slayTheWarlord: number) => void;
}> = ({ score, onChange }) => {
  return (
    <>
      <label className="text-xl">Slay the Warlord</label>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(+e.target.value)}
        className="rounded-md border border-black bg-white text-center"
      />
    </>
  );
};

const PriceOfFailureForm: React.FC<{
  score: number;
  onChange: (priceOfFailure: number) => void;
}> = ({ score, onChange }) => {
  return (
    <>
      <label className="text-xl">The Price of Failure</label>
      <input
        type="number"
        value={score}
        onChange={(e) => onChange(+e.target.value)}
        className="rounded-md border border-black bg-white text-center"
      />
    </>
  );
};

type Props = {
  playerName: string;
  mission: Mission;
  primary: number;
  slayTheWarlord: number;
  firstBlood: number;
  lastManStanding: number;
  attrition: number;
  linebreaker: number;
  priceOfFailure: number;
};
