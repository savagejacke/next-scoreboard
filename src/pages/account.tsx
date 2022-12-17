import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const AccountPage: NextPage = () => {
  const session = useSession();
  const { data: group } = trpc.account.getGroup.useQuery();
  const [create, setCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const { data: invitedTo } = trpc.account.getInvitedTo.useQuery();

  if (session.status !== "authenticated") {
    return (
      <div className="flex flex-col items-center p-12">
        <h1 className="text-4xl font-bold">You are not signed in</h1>
        <button
          className="hover:underline"
          onClick={() => signIn(undefined, { callbackUrl: "/account" })}
        >
          Sign in to continue
        </button>
      </div>
    );
  }

  const groupCreateButton = (
    <button
      className="flex flex-row items-center justify-around rounded-full border border-black px-2 hover:bg-black hover:text-white"
      onClick={() => setCreate(true)}
    >
      <Image
        src="/plus.svg"
        alt=""
        height={16}
        width={16}
        className="rounded-full bg-white"
      />
      <span className="ml-2">Create a group</span>
    </button>
  );

  const groupCreateForm = (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="Group Name"
        className="rounded-md border-gray-400 bg-gray-100 px-1 focus:bg-white"
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div className="mt-1 flex flex-row justify-between">
        <button
          className="mr-1 rounded border border-solid border-red-500 px-2 font-semibold text-red-500 hover:bg-red-500 hover:text-white"
          onClick={() => setCreate(false)}
        >
          Cancel
        </button>
        <button
          className="rounded border border-solid border-blue-500 px-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
          onClick={() => console.log(groupName)}
        >
          Create
        </button>
      </div>
    </div>
  );

  const noGroup = (
    <div className="flex flex-col items-center">
      <div className="mb-1 text-xl font-semibold">
        {create ? "Create group" : "You are not in a group"}
      </div>
      {create ? groupCreateForm : groupCreateButton}
    </div>
  );

  const invitedToDisplay = (
    <div className="flex w-3/4 flex-col items-center">
      <div className="w-full border border-black bg-gray-400">
        <h2 className="text-xl font-semibold">Groups you&apos;re invited to</h2>
      </div>
      {invitedTo?.invitedTo.map((invite) => (
        <div
          className="flex w-full flex-row justify-between border border-t-0 border-black px-2"
          key={invite.id}
        >
          <div className="text-xl">{invite.name}</div>
          {group && (
            <button className="rounded-full border border-black hover:bg-black hover:text-white">
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const withGroup = <div></div>;

  return (
    <div className="flex flex-col items-center p-12">
      <h1 className="text-4xl font-bold">{session.data.user?.name}</h1>
      <br />
      {group ? withGroup : noGroup}
      <br />
      {invitedTo?.invitedTo &&
        invitedTo?.invitedTo.length > 0 &&
        invitedToDisplay}
    </div>
  );
};

export default AccountPage;
