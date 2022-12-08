import Link from "next/link";

const Nav: React.FC = () => {
  return (
    <div className="mb-3 shadow-lg">
      <div className="mx-5">
        <Link href="/" className="mx-4 my-2 text-xl hover:font-semibold">
          Home
        </Link>
        <Link
          href="/ninth-start"
          className="mx-4 my-2 text-xl hover:font-semibold"
        >
          40k 9th Edition
        </Link>
        <Link
          href="/scoreboard"
          className="mx-4 my-2 text-xl hover:font-semibold"
        >
          Scoreboard
        </Link>
        <button className="mx-4 my-2 text-xl hover:font-semibold">
          Results
        </button>
      </div>
    </div>
  );
};

export default Nav;
