import { ASTARTES_LEGIONS, HERESY_ARMIES } from "@/data/armies";
import type { Allegiance } from "@/models/player";
import { type PlayerChange, useGameStore } from "@/zustand/zustand";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

const HeresyStartPage: NextPage = () => {
  const { data: session, status } = useSession();
  const [guest, setGuest] = useState(false);
  const updateName = useGameStore((state) => state.updateName);

  if (status !== "authenticated" && !guest) {
    return (
      <div className="flex flex-col items-center p-16">
        <div className="text-xl font-bold">You are not signed in</div>
        <button
          onClick={() => signIn(undefined, { callbackUrl: "/heresy-start" })}
          className="hover:underline"
        >
          Sign in
        </button>
        <button className="hover:underline" onClick={() => setGuest(true)}>
          or continue as guest (your game {"won't"} be logged)
        </button>
      </div>
    );
  } else if (typeof session?.user?.name === "string") {
    updateName(session.user.name, "player1");
  }

  return (
    <>
      <div className="flex flex-row items-center justify-evenly">
        <FormComponent playerNumber="player1" />
        <FormComponent playerNumber="player2" />
      </div>
      <div className="p-4 text-center">
        <ContinueButton />
      </div>
    </>
  );
};

export default HeresyStartPage;

const FormComponent: React.FC<{ playerNumber: PlayerChange }> = ({
  playerNumber,
}) => {
  const player = useGameStore((state) =>
    playerNumber === "player1" ? state.player1 : state.player2
  );
  const actions = useGameStore((state) => ({
    updateName: state.updateName,
    updateArmy: state.updateArmy,
    updateId: state.updateId,
    updateAllegiance: state.updateAllegiance,
  }));
  const [name, setName] = useState("");

  const armyOptions = HERESY_ARMIES.map((army) => (
    <option key={army} value={army}>
      {army}
    </option>
  ));

  const onArmyChange = (newArmy: string) => {
    if (newArmy === "--") {
      actions.updateArmy("Legiones Astartes", playerNumber);
      return;
    }
    actions.updateArmy(newArmy, playerNumber);
    if (newArmy === "Legio Custodes") {
      actions.updateAllegiance("Loyalist", playerNumber);
    }
    if (newArmy === "Daemons of the Ruinstorm") {
      actions.updateAllegiance("Traitor", playerNumber);
    }
  };

  return (
    <div className="flex w-1/2 flex-col items-center p-4">
      <h1 className="mb-4 flex-row text-4xl font-bold">{player.name}</h1>
      <label
        className="flex-row text-2xl font-bold"
        htmlFor={`${playerNumber}-army`}
      >
        Select Army:
      </label>
      <select
        className="mb-2 ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
        id={`${player.name}-army`}
        onChange={(e) => onArmyChange(e.target.value)}
      >
        <option value="None">--</option>
        {armyOptions}
      </select>
      {(player.army === "Legiones Astartes" ||
        ASTARTES_LEGIONS.includes(player.army)) && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select Legion</h2>
          <select
            onChange={(e) => actions.updateArmy(e.target.value, playerNumber)}
            className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          >
            <option value="--">--</option>
            {ASTARTES_LEGIONS.map((legion) => (
              <option value={legion} key={legion}>
                {legion}
              </option>
            ))}
          </select>
        </div>
      )}
      <label
        className="text-2xl font-bold"
        htmlFor={`${playerNumber}-allegiance`}
      >
        Select Allegiance
      </label>
      <select
        className="mb-2 ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
        onChange={(e) =>
          actions.updateAllegiance(
            e.target.value === "--"
              ? undefined
              : (e.target.value as Allegiance),
            playerNumber
          )
        }
        value={player.allegiance ?? "--"}
        disabled={
          player.army === "Daemons of the Ruinstorm" ||
          player.army === "Legio Custodes"
        }
      >
        <option value="--">--</option>
        <option value="Loyalist">Loyalist</option>
        <option value="Traitor">Traitor</option>
      </select>
    </div>
  );
};

const ContinueButton: React.FC = () => {
  return <button></button>;
};
