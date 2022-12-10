import { ARMIES, CHAPTERS, LEGIONS } from "@/data/armies";
import { SECONDARIES } from "@/data/Secondaries";
import type { Secondary, SecondaryType } from "@/models/secondary";
import { useGameStore, type PlayerChange } from "@/zustand/zustand";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const NinthStartPage: NextPage = () => {
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

export default NinthStartPage;

const FormComponent: React.FC<{ playerNumber: PlayerChange }> = ({
  playerNumber,
}) => {
  const player = useGameStore((state) =>
    playerNumber === "player1" ? state.player1 : state.player2
  );
  const actions = useGameStore((state) => ({
    updateName: state.updateName,
    updateArmy: state.updateArmy,
    addSecondary: state.addSecondary,
    removeSecondary: state.removeSecondary,
    replaceSecondary: state.replaceSecondary,
  }));
  const [name, setName] = useState("");

  const onSecondaryChange = (title: string, type: SecondaryType) => {
    const newSecondary = SECONDARIES.find((sec) => sec.title === title);
    if (!newSecondary) {
      actions.removeSecondary(type, playerNumber);
      return;
    }
    if (player.secondaries.find((sec) => sec.title === title))
      actions.replaceSecondary(newSecondary, playerNumber);
    else actions.addSecondary(newSecondary, playerNumber);
  };

  const availableArmy = (secondary: Secondary) =>
    secondary.armyRequirement === "None" ||
    player.army.includes(secondary.armyRequirement);

  const disableSecondary = (type: SecondaryType): boolean => {
    if (player.secondaries.length < 3) return false;
    return player.secondaries.find((sec) => sec.type === type) ? false : true;
  };

  //#region options
  const armyOptions = ARMIES.map((army) => (
    <option key={army} value={army}>
      {army}
    </option>
  ));

  const pteOptions = SECONDARIES.filter(
    (sec) => sec.type === "Purge The Enemy" && availableArmy(sec)
  ).map((sec) => (
    <option value={sec.title} key={sec.title}>
      {sec.title}
    </option>
  ));

  const nmnrOptions = SECONDARIES.filter(
    (sec) => sec.type === "No Mercy, No Respite" && availableArmy(sec)
  ).map((sec) => (
    <option value={sec.title} key={sec.title}>
      {sec.title}
    </option>
  ));

  const wcOptions = SECONDARIES.filter(
    (sec) => sec.type === "Warpcraft" && availableArmy(sec)
  ).map((sec) => (
    <option value={sec.title} key={sec.title}>
      {sec.title}
    </option>
  ));

  const bsOptions = SECONDARIES.filter(
    (sec) => sec.type === "Battlefield Supremacy" && availableArmy(sec)
  ).map((sec) => (
    <option value={sec.title} key={sec.title}>
      {sec.title}
    </option>
  ));

  const soOptions = SECONDARIES.filter(
    (sec) => sec.type === "Shadow Operations" && availableArmy(sec)
  ).map((sec) => (
    <option value={sec.title} key={sec.title}>
      {sec.title}
    </option>
  ));
  //#endregion

  const onChapterChange = (chapter: string) => {
    if (!CHAPTERS.includes(chapter))
      actions.updateArmy("Space Marines", playerNumber);
    else actions.updateArmy(`Space Marines-${chapter}`, playerNumber);
  };

  const chapterSelect = player.army.includes("Space Marines") ? (
    <div className="text-center">
      <h2 className="text-2xl font-bold">Select Chapter</h2>
      <select
        onChange={(e) => onChapterChange(e.target.value)}
        className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
      >
        <option value="--">--</option>
        {CHAPTERS.map((chap) => (
          <option value={chap} key={chap}>
            {chap}
          </option>
        ))}
      </select>
    </div>
  ) : null;

  const onLegionChange = (legion: string) => {
    if (!LEGIONS.includes(legion))
      actions.updateArmy("Chaos Marines", playerNumber);
    else actions.updateArmy(`Chaos Marines-${legion}`, playerNumber);
  };

  const legionSelect = player.army.includes("Chaos Marines") ? (
    <div className="text-center">
      <h2 className="text-2xl font-bold">Select Legion</h2>
      <select
        onChange={(e) => onLegionChange(e.target.value)}
        className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
      >
        <option value="--">--</option>
        {LEGIONS.map((legion) => (
          <option value={legion} key={legion}>
            {legion}
          </option>
        ))}
      </select>
    </div>
  ) : null;

  if (!player.name)
    return (
      <div className="max-w-1/2 p-4">
        <h1 className="text-2xl font-bold">Enter your name:</h1>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          className="mt-2 rounded-md border-gray-400 bg-gray-100 focus:bg-white"
        />
        <button
          onClick={() => actions.updateName(name, playerNumber)}
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
        htmlFor={`${player.name}-army`}
      >
        Select army:
      </label>
      <select
        className="ml-1 mb-2 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
        id={`${player.name}-army`}
        onChange={(e) => actions.updateArmy(e.target.value, playerNumber)}
      >
        <option value="None">--</option>
        {armyOptions}
      </select>
      {chapterSelect}
      {legionSelect}
      <h2 className="mt-2 mb-1 flex-row text-2xl font-bold">
        Select Secondaries:
      </h2>
      <div className="mb-1 flex-row">
        <label htmlFor={`${player.name}-pte`}>Purge the Enemy</label>
        <select
          id={`${player.name}-pte`}
          className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          onChange={(e) => onSecondaryChange(e.target.value, "Purge The Enemy")}
          disabled={disableSecondary("Purge The Enemy")}
        >
          <option value="--">--</option>
          {pteOptions}
        </select>
      </div>
      <div className="mb-1 flex-row">
        <label htmlFor={`${player.name}-nmnr`}>No Mercy, No Respite</label>
        <select
          id={`${player.name}-nmnr`}
          className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          onChange={(e) =>
            onSecondaryChange(e.target.value, "No Mercy, No Respite")
          }
          disabled={disableSecondary("No Mercy, No Respite")}
        >
          <option value="--">--</option>
          {nmnrOptions}
        </select>
      </div>
      <div className="mb-1 flex-row">
        <label htmlFor={`${player.name}-wc`}>Warpcraft</label>
        <select
          id={`${player.name}-wc`}
          className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          onChange={(e) => onSecondaryChange(e.target.value, "Warpcraft")}
          disabled={disableSecondary("Warpcraft")}
        >
          <option value="--">--</option>
          {wcOptions}
        </select>
      </div>
      <div className="mb-1 flex-row">
        <label htmlFor={`${player.name}-bs`}>Battlefield Supremacy</label>
        <select
          id={`${player.name}-bs`}
          className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          onChange={(e) =>
            onSecondaryChange(e.target.value, "Battlefield Supremacy")
          }
          disabled={disableSecondary("Battlefield Supremacy")}
        >
          <option value="--">--</option>
          {bsOptions}
        </select>
      </div>
      <div className="flex-row">
        <label htmlFor={`${player.name}-so`}>Battlefield Supremacy</label>
        <select
          id={`${player.name}-so`}
          className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          onChange={(e) =>
            onSecondaryChange(e.target.value, "Shadow Operations")
          }
          disabled={disableSecondary("Shadow Operations")}
        >
          <option value="--">--</option>
          {soOptions}
        </select>
      </div>
    </div>
  );
};

const ContinueButton: React.FC = () => {
  const router = useRouter();
  const { p1, p2 } = useGameStore((state) => ({
    p1: state.player1,
    p2: state.player2,
  }));

  const p1Ready = () => {
    if (p1.secondaries.length !== 3) return false;
    if (!p1.name) return false;
    if (!p1.army) return false;
    return true;
  };

  const p2Ready = () => {
    if (p2.secondaries.length !== 3) return false;
    if (!p2.name) return false;
    if (!p2.army) return false;
    return true;
  };

  if (!p1Ready() || !p2Ready())
    return (
      <button
        className="btn rounded bg-green-500 px-4 py-2 font-bold text-white opacity-75 hover:bg-green-600"
        disabled
      >
        Finish your selectiosn
      </button>
    );

  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      onClick={() => router.push("/scoreboard")}
    >
      Start Game
    </button>
  );
};
