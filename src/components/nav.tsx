import Link from "next/link";

const Nav: React.FC = () => {
  return (
    <div className="mb-3 shadow-lg">
      <div className="mx-5">
        <Link href="/" className="mx-4 my-2 text-xl hover:font-semibold">
          Home
        </Link>
        <button className="mx-4 my-2 text-xl hover:font-semibold">
          40k 9th Edition
        </button>
        <button className="mx-4 my-2 text-xl hover:font-semibold">
          Scoreboard
        </button>
        <button className="mx-4 my-2 text-xl hover:font-semibold">
          Results
        </button>
      </div>
    </div>
  );
};

export default Nav;
