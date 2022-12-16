import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const ResultsPage: NextPage = () => {
  const session = useSession();

  const allResultsQuery = trpc.game.getResultsByType.useQuery({
    type: "40k 9th Edition",
  });

  const userResultsQuery = trpc.game.getUserResults.useQuery();

  const data =
    session.status === "authenticated"
      ? userResultsQuery?.data?.games
      : allResultsQuery.data;

  const allResults = data?.map((result) => {
    const winner =
      result.player1Score > result.player2Score
        ? result.player1Name
        : result.player2Name;

    return (
      <tr key={result.id}>
        <td className="border border-gray-400 px-1 text-center">
          {result.createdAt.toLocaleDateString()}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.player1Name}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.player2Name}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.player1Army}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.player2Army}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.player1Score}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.player2Score}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.player1Score === result.player2Score ? "Tie" : winner}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.numberOfRounds}
        </td>
        <td className="border border-gray-400 px-1 text-center">
          {result.description}
        </td>
      </tr>
    );
  });

  if (allResultsQuery.isFetching)
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">Results</h1>
      </div>
    );

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="mb-4 text-4xl font-bold">Results</h1>
      <table>
        <thead>
          <tr>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Date
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Player 1
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Player 2
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Player 1 Army
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Player 2 Army
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Player 1 Score
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Player 2 Score
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Winner
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Rounds
            </th>
            <th className="border border-gray-400 px-1 text-center font-bold">
              Description
            </th>
          </tr>
        </thead>
        <tbody>{allResults}</tbody>
      </table>
    </div>
  );
};

export default ResultsPage;
