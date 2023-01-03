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
      ctx.account.getUninvited.invalidate();
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
  const { mutateAsync: leaveAsync } = trpc.account.leaveGroup.useMutation({
    onSuccess() {
      ctx.account.invalidate();
    },
  });

  const [create, setCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [disband, setDisband] = useState(false);
  const [leave, setLeave] = useState(false);

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
      className="flex flex-row items-center justify-around px-2 border border-black rounded-full hover:bg-black hover:text-white"
      onClick={() => setCreate(true)}
    >
      <Image
        src="/plus.svg"
        alt=""
        height={16}
        width={16}
        className="bg-white rounded-full"
      />
      <span className="ml-2">Create a group</span>
    </button>
  );

  const groupCreateForm = (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="Group Name"
        className="px-1 bg-gray-100 border-gray-400 rounded-md focus:bg-white"
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div className="flex flex-row justify-between mt-1">
        <button
          className="px-2 mr-1 font-semibold text-red-500 border border-red-500 border-solid rounded hover:bg-red-500 hover:text-white"
          onClick={() => setCreate(false)}
        >
          Cancel
        </button>
        <button
          className="px-2 font-semibold text-blue-500 border border-blue-500 border-solid rounded hover:bg-blue-500 hover:text-white"
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
    <div className="flex flex-col items-center w-3/4">
      <div className="w-full px-2 bg-gray-400 border border-black">
        <h2 className="text-xl font-semibold">Groups you&apos;re invited to</h2>
      </div>
      {invitedTo?.invitedTo.map((invite) => (
        <div
          className="flex flex-row items-center justify-between w-full px-2 border border-t-0 border-black"
          key={invite.id}
        >
          <div className="text-xl">{invite.name}</div>
          {!group && (
            <button
              className="px-2 my-1 border border-black rounded hover:bg-black hover:text-white"
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
        className="px-2 py-1 mx-2 font-bold text-red-600 bg-white border border-red-600 rounded hover:bg-red-600 hover:text-white"
        onClick={async () => await disbandAsync()}
      >
        Confirm
      </button>
      <button
        className="px-2 py-1 font-bold text-black bg-white border border-black rounded hover:bg-black hover:text-white"
        onClick={() => setDisband(false)}
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      className="px-2 py-1 font-bold text-white bg-red-600 rounded hover:bg-red-800"
      onClick={() => setDisband(true)}
    >
      Disband group
    </button>
  );

  const leaveGroupButton = leave ? (
    <div className="flex flex-row items-center justify-between">
      <span>Are you sure you want to leave {group?.name}?</span>
      <button
        className="px-2 py-1 mx-2 font-bold text-red-600 bg-white border border-red-600 rounded hover:bg-red-600 hover:text-white"
        onClick={async () => await leaveAsync()}
      >
        Confirm
      </button>
      <button
        className="px-2 py-1 font-bold text-black bg-white border border-black rounded hover:bg-black hover:text-white"
        onClick={() => setLeave(false)}
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      className="px-2 py-1 font-bold text-white bg-red-600 rounded hover:bg-red-800"
      onClick={() => setLeave(true)}
    >
      Leave group
    </button>
  );

  const withGroup = (
    <div className="flex flex-col items-center w-3/4">
      <h2 className="text-2xl font-bold">{group?.name}</h2>
      {isAdmin && disbandGroupButton}
      {!isAdmin && leaveGroupButton}
      {members
        ?.filter((member) => member.id !== session.data.user?.id)
        .map((member) => (
          <div
            className="flex flex-row justify-between w-full px-4 my-2"
            key={member.id}
          >
            <div className="text-xl">
              {member.name}
              <span className="ml-2 text-gray-500">{member.email}</span>
            </div>
            <div>
              <button
                className="px-4 py-1 font-semibold text-blue-500 border border-blue-500 border-solid rounded hover:bg-blue-500 hover:text-white"
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
                  className="px-2 py-1 ml-2 font-semibold text-red-500 border border-red-500 border-solid rounded hover:bg-red-500 hover:text-white"
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
    <div className="flex flex-col items-center w-3/4">
      <h2 className="mb-2 text-2xl font-bold">Invite Users:</h2>
      {uninvited?.map((user) => (
        <div
          className="flex flex-row justify-between w-full my-2"
          key={user.id}
        >
          <div className="text-xl">
            {user.name}
            <span className="ml-2 text-gray-500">{user.email}</span>
          </div>
          <button
            className="px-4 py-1 font-semibold text-blue-500 border border-blue-500 border-solid rounded hover:bg-blue-500 hover:text-white"
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
