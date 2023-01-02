import { trpc } from "@/utils/trpc";
import { useGameStore } from "@/zustand/zustand";
import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const AccountPage: NextPage = () => {
  const session = useSession();
  const router = useRouter();
  const ctx = trpc.useContext();
  const updateName = useGameStore((state) => state.updateName);

  const { data: group, isFetched: groupFetched } =
    trpc.account.getGroup.useQuery();
  const { data: members } = trpc.account.getGroupMembers.useQuery();
  const { data: invitedTo } = trpc.account.getInvitedTo.useQuery();
  const { data: uninvited } = trpc.account.getUninvited.useQuery();

  const { mutateAsync: createGroupAsync } =
    trpc.account.createGroup.useMutation({
      onSuccess() {
        ctx.account.invalidate();
      },
    });
  const { mutateAsync: inviteAsync } = trpc.account.inviteToGroup.useMutation({
    onSuccess() {
      ctx.account.getInvitedTo.invalidate();
    },
  });
  const { mutateAsync: joinGroupAsync } = trpc.account.joinGroup.useMutation({
    onSuccess() {
      ctx.account.invalidate();
    },
  });
  const { mutateAsync: removeAsync } = trpc.account.removeFromGroup.useMutation(
    {
      onSuccess() {
        ctx.account.getGroupMembers.invalidate();
      },
    }
  );
  const { mutateAsync: disbandAsync } = trpc.account.disbandGroup.useMutation({
    onSuccess() {
      ctx.account.invalidate();
    },
  });

  const [create, setCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [disband, setDisband] = useState(false);

  const isAdmin = group?.adminId === session.data?.user?.id;

  const startGame = ({
    player1Name,
    player2Name,
  }: {
    player1Name: string | null | undefined;
    player2Name: string | null | undefined;
  }) => {
    updateName(player1Name ?? "", "player1");
    updateName(player2Name ?? "", "player2");
    router.push("/ninth-start");
  };

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
          onClick={async () => await createGroupAsync({ name: groupName })}
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
      <div className="w-full border border-black bg-gray-400 px-2">
        <h2 className="text-xl font-semibold">Groups you&apos;re invited to</h2>
      </div>
      {invitedTo?.invitedTo.map((invite) => (
        <div
          className="flex w-full flex-row items-center justify-between border border-t-0 border-black px-2"
          key={invite.id}
        >
          <div className="text-xl">{invite.name}</div>
          {!group && (
            <button
              className="my-1 rounded border border-black px-2 hover:bg-black hover:text-white"
              onClick={() => joinGroupAsync({ name: invite.name })}
            >
              Join
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const disbandGroupButton = disband ? (
    <div className="flex flex-row items-center justify-between">
      <span>Are you sure you want to disband {group?.name}?</span>
      <button
        className="mx-2 rounded border border-red-600 bg-white px-2 py-1 font-bold text-red-600 hover:bg-red-600 hover:text-white"
        onClick={async () => await disbandAsync()}
      >
        Confirm
      </button>
      <button
        className="rounded border border-black bg-white px-2 py-1 font-bold text-black hover:bg-black hover:text-white"
        onClick={() => setDisband(false)}
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      className="rounded bg-red-600 px-2 py-1 font-bold text-white hover:bg-red-800"
      onClick={() => setDisband(true)}
    >
      Disband group
    </button>
  );

  const withGroup = (
    <div className="flex w-3/4 flex-col items-center">
      <h2 className="text-2xl font-bold">{group?.name}</h2>
      {isAdmin && disbandGroupButton}
      {members
        ?.filter((member) => member.id !== session.data.user?.id)
        .map((member) => (
          <div
            className="my-2 flex w-full flex-row justify-between px-4"
            key={member.id}
          >
            <div className="text-xl">
              {member.name}
              <span className="ml-2 text-gray-500">{member.email}</span>
            </div>
            <div>
              <button
                className="rounded border border-solid border-blue-500 px-4 py-1 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
                onClick={() =>
                  startGame({
                    player1Name: session.data.user?.name,
                    player2Name: member.name,
                  })
                }
              >
                Play
              </button>
              {isAdmin && (
                <button
                  className="ml-2 rounded border border-solid border-red-500 px-2 py-1 font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={async () => await removeAsync({ id: member.id })}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );

  const sendInvites = (
    <div className="flex w-3/4 flex-col items-center">
      <h2 className="mb-2 text-2xl font-bold">Invite Users:</h2>
      {uninvited?.map((user) => (
        <div
          className="my-2 flex w-full flex-row justify-between"
          key={user.id}
        >
          <div className="text-xl">
            {user.name}
            <span className="ml-2 text-gray-500">{user.email}</span>
          </div>
          <button
            className="rounded border border-solid border-blue-500 px-4 py-1 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
            onClick={async () => await inviteAsync({ id: user.id })}
          >
            Invite to group
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center p-12">
      <h1 className="text-4xl font-bold">{session.data.user?.name}</h1>
      <br />
      {groupFetched && (group ? withGroup : noGroup)}
      <br />
      {invitedTo?.invitedTo &&
        invitedTo?.invitedTo.length > 0 &&
        invitedToDisplay}
      <br />
      {isAdmin && sendInvites}
    </div>
  );
};

export default AccountPage;
