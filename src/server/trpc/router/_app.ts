import { router } from "../trpc";
import { authRouter } from "./auth";
import { gameRouter } from "./game";

export const appRouter = router({
  game: gameRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
