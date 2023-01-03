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
  getUserResults: protectedProcedure.query(async ({ ctx }) => {
    const asPlayer1 = await ctx.prisma.gameResult.findMany({
      where: { player1Id: ctx.session.user.id },
    });
    const asPlayer2 = await ctx.prisma.gameResult.findMany({
      where: { player2Id: ctx.session.user.id },
    });
    return {
      games: asPlayer1.concat(asPlayer2),
    };
  }),
  getGroupResults: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findFirstOrThrow({
      where: { id: ctx.session.user.id },
    });
    return await ctx.prisma.gameResult.findMany({
      where: {
        OR: [
          { player1: { groupId: user.groupId } },
          { player2: { groupId: user.groupId } },
        ],
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
          id: z.string().nullish(),
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
          player1Id: ctx.session.user.id,
          player2Name: input.player2.name,
          player2Army: input.player2.army,
          player2Score: input.player2.score,
          player2Id: input.player2.id ?? undefined,
          numberOfRounds: input.numberOfRounds,
          description: input.description,
        },
      });
      return newResult;
    }),
});
