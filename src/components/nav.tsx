import { useRouter } from "next/router";

const Nav: React.FC = () => {
  const router = useRouter();
  return (
    <div className="mb-3 flex flex-row justify-between px-8 shadow-lg">
      <div className="mx-5">
        <button
          className="mx-4 my-2 text-xl hover:font-semibold"
          onClick={() => router.push("/")}
        >
          Home
        </button>
        <button
          className="mx-4 my-2 text-xl hover:font-semibold"
          onClick={() => router.push("/ninth-start")}
        >
          40k 9th Edition
        </button>
        <button
          className="mx-4 my-2 text-xl hover:font-semibold"
          onClick={() => router.push("/scoreboard")}
        >
          Scoreboard
        </button>
        <button
          className="mx-4 my-2 text-xl hover:font-semibold"
          onClick={() => router.push("/results")}
        >
          Results
        </button>
      </div>
      {/* <div className="mx-4 my-2 text-xl hover:font-semibold">Log in</div> */}
    </div>
  );
};

export default Nav;
