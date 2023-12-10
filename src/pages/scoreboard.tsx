/* eslint-disable @typescript-eslint/no-non-null-assertion */
import HeresyScoreboard from "@/components/heresy-scoreboard";
import NinthScoreboard, {
  NinthGameLogger,
} from "@/components/ninth-scoreboard";
import { HERESY_MISSIONS } from "@/data/missions";
import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const ScoreboardPage: NextPage = () => {
  const { status } = useSession();
  const { data: game, isLoading } = trpc.game.getActiveGame.useQuery();
  const mission = HERESY_MISSIONS.find(
    (mission) => mission.name === game?.mission
  );

  if (game?.gameType === "Horus Heresy") {
    if (isLoading || !game) {
      return <div>Loading...</div>;
    }
    return (
      <div className="flex w-screen flex-row items-center justify-around p-8">
        <HeresyScoreboard
          playerNumber="player1"
          game={{
            playerName: game.player1Name,
            mission: mission ?? HERESY_MISSIONS[HERESY_MISSIONS.length - 1]!,
            primary: game.player1PrimaryScore,
            slayTheWarlord: game.player1SlayTheWarlord,
            firstBlood: game.player1FirstBlood,
            attrition: game.player1Attrition,
            lastManStanding: game.player1LastManStanding,
            linebreaker: game.player1Linebreaker,
            priceOfFailure: game.player1PriceOfFailure,
          }}
        />
        <HeresyScoreboard
          playerNumber="player2"
          game={{
            playerName: game.player2Name,
            mission: mission ?? HERESY_MISSIONS[HERESY_MISSIONS.length - 1]!,
            primary: game.player2PrimaryScore,
            slayTheWarlord: game.player2SlayTheWarlord,
            firstBlood: game.player2FirstBlood,
            attrition: game.player2Attrition,
            lastManStanding: game.player2LastManStanding,
            linebreaker: game.player2Linebreaker,
            priceOfFailure: game.player2PriceOfFailure,
          }}
        />
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
