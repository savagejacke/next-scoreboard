import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { gameRouter } from "./game";

export const appRouter = router({
  game: gameRouter,
  auth: authRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
