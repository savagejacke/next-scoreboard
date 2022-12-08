import { ARMIES, type Army } from "@/data/armies";
import { SECONDARIES } from "@/data/Secondaries";
import { type SecondaryType } from "@/models/secondary";
import { useGameStore, type PlayerChange } from "@/zustand/zustand";
import { type NextPage } from "next";
import { useState } from "react";

const NinthStartPage: NextPage = () => {
  return (
    <div className="flex flex-row items-center justify-evenly">
      <FormComponent playerNumber="player1" />
      <FormComponent playerNumber="player2" />
    </div>
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

  const armyOptions = ARMIES.map((army) => (
    <option key={army} value={army}>
      {army}
    </option>
  ));

  const pteOptions = SECONDARIES.filter(
    (sec) =>
      sec.type === "Purge The Enemy" &&
      (sec.armyRequirement === "None" || sec.armyRequirement === player.army)
  ).map((sec) => (
    <option value={sec.title} key={sec.title}>
      {sec.title}
    </option>
  ));

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
    <div className="max-w-1/2 flex flex-col items-center p-4">
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
        onChange={(e) =>
          actions.updateArmy(e.target.value as Army, playerNumber)
        }
      >
        <option value="None">--</option>
        {armyOptions}
      </select>
      <h2 className="mt-2 mb-1 flex-row text-2xl font-bold">
        Select Secondaries:
      </h2>
      <div className="mb-1 flex-row">
        <label htmlFor={`${player.name}-pte`}>Purge the Enemy</label>
        <select
          id={`${player.name}-pte`}
          className="ml-1 flex-row border border-solid bg-white text-center disabled:bg-gray-100"
          onChange={(e) => onSecondaryChange(e.target.value, "Purge The Enemy")}
        >
          <option value="--">--</option>
          {pteOptions}
        </select>
      </div>
      <div className="flex-row"></div>
      <div className="flex-row"></div>
      <div className="flex-row"></div>
      <div className="flex-row"></div>
    </div>
  );
};
