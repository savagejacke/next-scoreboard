import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="flex-row">
        <h1 className="text-4xl font-bold">Warhammer Scoreboard</h1>
      </div>
      <div className="mt-3 flex-row">
        <button className="mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Start Game
        </button>
        <button className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600">
          Scoreboard
        </button>
      </div>
    </div>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
