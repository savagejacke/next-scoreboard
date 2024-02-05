import { TENTH_SECONDARIES } from "@/data/Secondaries";
import { ARMIES, CSM_LEGIONS, SM_CHAPTERS } from "@/data/armies";
import { TENTH_MISSION } from "@/data/missions";
import { trpc } from "@/utils/trpc";
import { type PlayerChange, useGameStore } from "@/zustand/zustand";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

const TenthStartPage: NextPage = () => {
  const { data: session, status } = useSession();
  const [guest, setGuest] = useState(false);
  const [mission, setMission] = useState<string>();
  const updateName = useGameStore((state) => state.updateName);

  const missionOptions = TENTH_MISSION.map((mission) => (
    <option value={mission} key={mission}>
      {mission}
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
          or continue as guest (your game won&apos;t be logged)
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
  const [missionType, setMissionType] = useState<"tactical" | "fixed">(
    "tactical"
  );
  const [fixed1, setFixed1] = useState("");
  const [fixed2, setFixed2] = useState("");

  const membersQuery = trpc.account.getGroupMembers.useQuery();
  const members = membersQuery.data?.filter(
    (member) => member.id !== session?.user?.id
  );

  const armyOptions = ARMIES.map((army) => (
    <option key={army} value={army}>
      {army}
    </option>
  ));

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
    playerNumber === "player2" && members?.length && members.length > 0
      ? true
      : false;
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
        onChange={(e) => actions.updateArmy(e.target.value, playerNumber)}
      >
        <option value="None">--</option>
        {armyOptions}
      </select>
      {(player.army === "Space Marines" ||
        SM_CHAPTERS.includes(player.army)) && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select Chapter</h2>
          <select
            onChange={(e) => actions.updateArmy(e.target.value, playerNumber)}
            className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          >
            <option value="Space Marines">--</option>
            {SM_CHAPTERS.map((chapter) => (
              <option value={chapter} key={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </div>
      )}
      {(player.army === "Chaos Marines" ||
        CSM_LEGIONS.includes(player.army)) && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select Legion</h2>
          <select
            onChange={(e) => actions.updateArmy(e.target.value, playerNumber)}
            className="border border-solid bg-white text-center disabled:bg-gray-100"
          >
            <option value="Chaos Marines">--</option>
            {CSM_LEGIONS.map((legion) => (
              <option value={legion} key={legion}>
                {legion}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex flex-row items-center justify-center space-x-2">
        <label>Fixed Missions</label>
        <input
          type="checkbox"
          checked={missionType === "fixed"}
          onChange={() =>
            setMissionType(missionType === "tactical" ? "fixed" : "tactical")
          }
        />
      </div>
      {missionType === "fixed" && (
        <div className="flex flex-row items-center justify-around space-x-2">
          <select
            className="border border-solid bg-white text-center disabled:bg-gray-100"
            onChange={(e) => setFixed1(e.target.value)}
          >
            <option value="">--</option>
            {TENTH_SECONDARIES.filter(
              (sec) => sec.fixed && sec.name !== fixed2
            ).map((sec) => (
              <option value={sec.name} key={sec.name}>
                {sec.name}
              </option>
            ))}
          </select>
          <select
            className="border border-solid bg-white text-center disabled:bg-gray-100"
            onChange={(e) => setFixed2(e.target.value)}
          >
            <option value="">--</option>
            {TENTH_SECONDARIES.filter(
              (sec) => sec.fixed && sec.name !== fixed1
            ).map((sec) => (
              <option value={sec.name} key={sec.name}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>
      )}
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
    if (!mission) {
      alert("Select a mission");
      return;
    }
    if (!p1Ready() || !p2Ready()) {
      alert("Finish your selections");
      return;
    }

    await mutateAsync({
      gameType: "40k 10th Edition",
      player1,
      player2,
      mission: { name: mission, secondaries: [] },
    });
    updateGameType("40k 10th Edition");
    router.push("/scoreboard");
  };

  const p1Ready = () => {
    if (!player1.army || player1.army === "None") return false;
    if (!player1.name) return false;
    return true;
  };
  const p2Ready = () => {
    if (!player2.army || player2.army === "None") return false;
    if (!player2.name) return false;
    return true;
  };

  if (!p1Ready() || !p2Ready() || !mission) {
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

export default TenthStartPage;
