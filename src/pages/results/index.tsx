import { trpc } from "@/utils/trpc";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const ResultsPage: NextPage = () => {
  const session = useSession();

  const { data: user } = trpc.auth.getUser.useQuery();

  const allResultsQuery = trpc.game.getResultsByType.useQuery({
    type: "40k 9th Edition",
  });
  const userResultsQuery = trpc.game.getUserResults.useQuery();
  const groupResults = trpc.game.getGroupResults.useQuery();

  const authedData = user?.groupId
    ? groupResults.data
    : userResultsQuery.data?.games;
  const data =
    session.status === "authenticated" ? authedData : allResultsQuery.data;

  const allResults = data?.map((result) => {
    const winner =
      result.player1Score > result.player2Score
        ? result.player1Name
        : result.player2Name;

    return (
      <tr key={result.id}>
        <td className="px-1 text-center border border-gray-400">
          {result.createdAt.toLocaleDateString()}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.player1Name}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.player2Name}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.player1Army}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.player2Army}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.player1Score}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.player2Score}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.player1Score === result.player2Score ? "Tie" : winner}
        </td>
        <td className="px-1 text-center border border-gray-400">
          {result.numberOfRounds}
        </td>
        <td className="px-1 text-center border border-gray-400">
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
            <th className="px-1 font-bold text-center border border-gray-400">
              Date
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Player 1
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Player 2
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Player 1 Army
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Player 2 Army
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Player 1 Score
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Player 2 Score
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Winner
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
              Rounds
            </th>
            <th className="px-1 font-bold text-center border border-gray-400">
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
