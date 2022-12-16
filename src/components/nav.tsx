import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Nav: React.FC = () => {
  const router = useRouter();
  const session = useSession();

  const authButton =
    session.status === "authenticated" ? (
      <div className="mx-4 my-2 flex flex-row justify-between text-xl text-gray-600">
        <div>Hello, {session.data?.user?.name}</div>
        <button className="ml-4 hover:text-black" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    ) : (
      <button
        className="mx-4 my-2 text-xl text-gray-600 hover:text-black"
        onClick={() => router.push("/api/auth/signin")}
      >
        Log in
      </button>
    );

  return (
    <div className="mb-3 flex flex-row justify-between px-8 shadow-lg">
      <div className="mx-5">
        <button
          className="mx-4 my-2 text-xl text-gray-600 hover:text-black"
          onClick={() => router.push("/")}
        >
          Home
        </button>
        <button
          className="mx-4 my-2 text-xl text-gray-600 hover:text-black"
          onClick={() => router.push("/ninth-start")}
        >
          40k 9th Edition
        </button>
        <button
          className="mx-4 my-2 text-xl text-gray-600 hover:text-black"
          onClick={() => router.push("/scoreboard")}
        >
          Scoreboard
        </button>
        <button
          className="mx-4 my-2 text-xl text-gray-600 hover:text-black"
          onClick={() => router.push("/results")}
        >
          Results
        </button>
      </div>
      {authButton}
    </div>
  );
};

export default Nav;
