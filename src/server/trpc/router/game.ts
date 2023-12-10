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
        orderBy: { createdAt: "asc" },
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
    return await ctx.prisma.gameResult.findMany({
      where: {
        OR: [
          { player1Id: ctx.session.user.id },
          { player2Id: ctx.session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
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
      orderBy: { createdAt: "asc" },
    });
  }),
  getActiveGame: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.gameInProgress.findFirst({
      where: {
        OR: [
          { player1Id: ctx.session.user.id },
          { player2Id: ctx.session.user.id },
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
          id: z.string().nullish(),
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
      const player1Id = input.player1.id ?? ctx.session.user.id;
      return await ctx.prisma.gameResult.create({
        data: {
          gameType: input.gameType,
          player1Name: input.player1.name,
          player1Army: input.player1.army,
          player1Score: input.player1.score,
          player1Id,
          player2Name: input.player2.name,
          player2Army: input.player2.army,
          player2Score: input.player2.score,
          player2Id: input.player2.id ?? undefined,
          numberOfRounds: input.numberOfRounds,
          description: input.description,
        },
      });
    }),
  startGame: protectedProcedure
    .input(
      z.object({
        gameType: z.string(),
        mission: z.string().nullish(),
        player1: z.object({
          name: z.string(),
          army: z.string(),
          allegiance: z.string().nullish(),
          id: z.string().nullish(),
        }),
        player2: z.object({
          name: z.string(),
          army: z.string(),
          allegiance: z.string().nullish(),
          id: z.string().nullish(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const player1Id = input.player1.id ?? ctx.session.user.id;
      const data = {
        gameType: input.gameType,
        mission: input.mission,
        player1Name: input.player1.name,
        player1Army: input.player1.army,
        player1Allegiance: input.player1.allegiance,
        player1Id,
        player2Name: input.player2.name,
        player2Army: input.player2.army,
        player2Allegiance: input.player2.allegiance,
        player2Id: input.player2.id,
      };
      return await ctx.prisma.gameInProgress.upsert({
        where: {
          player1Id,
        },
        update: data,
        create: data,
      });
    }),
  updateGame: protectedProcedure
    .input(
      z.object({
        playerNumber: z.string(),
        primary: z.number().nullish(),
        slayTheWarlord: z.number().nullish(),
        firstBlood: z.number().nullish(),
        lastManStanding: z.number().nullish(),
        attrition: z.number().nullish(),
        linebreaker: z.number().nullish(),
        priceOfFailure: z.number().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.playerNumber === "player1") {
        return await ctx.prisma.gameInProgress.update({
          where: { player1Id: ctx.session.user.id },
          data: {
            player1PrimaryScore: input.primary || undefined,
            player1SlayTheWarlord: input.slayTheWarlord || undefined,
            player1FirstBlood: input.firstBlood || undefined,
            player1LastManStanding: input.lastManStanding || undefined,
            player1Attrition: input.attrition || undefined,
            player1Linebreaker: input.linebreaker || undefined,
            player1PriceOfFailure: input.priceOfFailure || undefined,
          },
        });
      }
      return await ctx.prisma.gameInProgress.update({
        where: { player2Id: ctx.session.user.id },
        data: {
          player2PrimaryScore: input.primary || undefined,
          player2SlayTheWarlord: input.slayTheWarlord || undefined,
          player2FirstBlood: input.firstBlood || undefined,
          player2LastManStanding: input.lastManStanding || undefined,
          player2Attrition: input.attrition || undefined,
          player2Linebreaker: input.linebreaker || undefined,
          player2PriceOfFailure: input.priceOfFailure || undefined,
        },
      });
    }),
});
