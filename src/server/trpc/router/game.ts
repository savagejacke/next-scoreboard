import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const gameRouter = router({
  getAllResults: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.gameResult.findMany();
  }),
  getResultsByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.gameResult.findMany({
        where: {
          gameType: input.type,
        },
      });
    }),
  getResultById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.gameResult.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
    }),
  logGame: protectedProcedure
    .input(
      z.object({
        gameType: z.string(),
        player1: z.object({
          name: z.string(),
          army: z.string(),
          score: z.number(),
        }),
        player2: z.object({
          name: z.string(),
          army: z.string(),
          score: z.number(),
        }),
        numberOfRounds: z.number(),
        description: z.string().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newResult = await ctx.prisma.gameResult.create({
        data: {
          gameType: input.gameType,
          player1Name: input.player1.name,
          player1Army: input.player1.army,
          player1Score: input.player1.score,
          player2Name: input.player2.name,
          player2Army: input.player2.army,
          player2Score: input.player2.score,
          numberOfRounds: input.numberOfRounds,
          description: input.description,
        },
      });
      return newResult;
    }),
});
