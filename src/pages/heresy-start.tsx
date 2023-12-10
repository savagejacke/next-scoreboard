import { ASTARTES_LEGIONS, HERESY_ARMIES } from "@/data/armies";
import { HERESY_MISSIONS } from "@/data/missions";
import type { Allegiance } from "@/models/player";
import { trpc } from "@/utils/trpc";
import { type PlayerChange, useGameStore } from "@/zustand/zustand";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const HeresyStartPage: NextPage = () => {
  const { data: session, status } = useSession();
  const [guest, setGuest] = useState(false);
  const [mission, setMission] = useState<string>();
  const updateName = useGameStore((state) => state.updateName);

  const missionOptions = HERESY_MISSIONS.map((mission) => (
    <option value={mission.name} key={mission.name}>
      {mission.name}
    </option>
  ));

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
    <div className="flex h-full w-screen flex-col items-center p-8">
      <label htmlFor="mission-select" className="text-2xl font-bold">
        Select Mission:
      </label>
      <select
        onChange={(e) => setMission(e.target.value)}
        className="border border-solid bg-white text-center disabled:bg-gray-100"
        id="mission-select"
      >
        <option value={undefined}>--</option>
        {missionOptions}
      </select>
      <div className="flex w-full flex-row items-center justify-evenly">
        <FormComponent playerNumber="player1" />
        <FormComponent playerNumber="player2" />
      </div>
      <div className="p-4 text-center">
        <ContinueButton mission={mission} />
      </div>
    </div>
  );
};

export default HeresyStartPage;

const FormComponent: React.FC<{ playerNumber: PlayerChange }> = ({
  playerNumber,
}) => {
  const { data: session } = useSession();
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
  const [start, setStart] = useState(false);

  const membersQuery = trpc.account.getGroupMembers.useQuery();
  const members = membersQuery.data?.filter(
    (member) => member.id !== session?.user?.id
  );

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
    if (newArmy === "Legio Custodes" || newArmy === "Sisters of Silence") {
      actions.updateAllegiance("Loyalist", playerNumber);
    }
    if (newArmy === "Daemons of the Ruinstorm") {
      actions.updateAllegiance("Traitor", playerNumber);
    }
  };

  //#region player2 group selection
  const setPlayer2 = (id: string) => {
    if (id === "") {
      actions.updateName("", "player2");
      actions.updateId(undefined, "player2");
      return;
    }

    const name = members?.find((member) => member.id === id)?.name;
    actions.updateName(name ?? "", "player2");
    actions.updateId(id, "player2");
  };

  const player2GroupOptions = members?.map((member) => (
    <option value={member.id} key={member.id}>
      {member.name}
    </option>
  ));

  const player2NameForm = (
    <div className="flex flex-col items-center">
      <label htmlFor="player2GroupSelect" className="text-2xl font-bold">
        Play a group member:
      </label>
      <select
        id="player2GroupSelect"
        className="my-2 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
        onChange={(e) => setPlayer2(e.target.value)}
      >
        <option value={""}>--</option>
        {player2GroupOptions}
      </select>
      <button
        onClick={() => setStart(true)}
        className="rounded border border-solid border-blue-500 px-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
      >
        Start
      </button>
    </div>
  );

  const showMembersDropdown =
    playerNumber === "player2" && members?.length && members.length > 0;
  //#endregion

  const goToForm = () => {
    actions.updateName(name, playerNumber);
    setStart(true);
  };

  if (!player.name || (playerNumber === "player2" && !start))
    return (
      <div className="w-1/2 p-4 text-center">
        {showMembersDropdown && player2NameForm}
        <h1 className="text-2xl font-bold">
          {showMembersDropdown && "Or,"} Enter your name:
        </h1>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          className="mt-2 rounded-md border-gray-400 bg-gray-100 focus:bg-white"
        />
        <button
          onClick={goToForm}
          className="ml-1 rounded border border-solid border-blue-500 px-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
        >
          Submit
        </button>
      </div>
    );

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

const ContinueButton: React.FC<{ mission: string | undefined }> = ({
  mission,
}) => {
  const { player1, player2, updateGameType } = useGameStore((state) => ({
    player1: state.player1,
    player2: state.player2,
    updateGameType: state.updateGameType,
  }));
  const { mutateAsync, isLoading } = trpc.game.startGame.useMutation();
  const router = useRouter();

  const onClick = async () => {
    await mutateAsync({ gameType: "Horus Heresy", player1, player2, mission });
    updateGameType("Horus Heresy");
    router.push("/scoreboard");
  };

  const p1Ready = () => {
    if (!player1.allegiance) return false;
    if (!player1.army) return false;
    if (!player1.name) return false;
    return true;
  };
  const p2Ready = () => {
    if (!player2.allegiance) return false;
    if (!player2.army) return false;
    if (!player2.name) return false;
    return true;
  };

  if (!p1Ready() || !p2Ready()) {
    return (
      <button
        className="btn rounded bg-green-500 px-4 py-2 font-bold text-white opacity-75 hover:bg-green-600"
        disabled
      >
        Finish your selections
      </button>
    );
  }

  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? "Starting..." : "Start Game"}
    </button>
  );
};
