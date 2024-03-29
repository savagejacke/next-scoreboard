import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import type { ActiveSecondary } from "@prisma/client";

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
      include: {
        player1Secondaries: true,
        player2Secondaries: true,
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
        mission: z.object({
          name: z.string(),
          secondaries: z.array(
            z.object({
              name: z.string(),
              score: z.number(),
            })
          ),
        }),
        player1: z.object({
          name: z.string(),
          army: z.string(),
          missionType: z.string().nullish(),
          allegiance: z.string().nullish(),
          id: z.string().nullish(),
        }),
        player2: z.object({
          name: z.string(),
          army: z.string(),
          missionType: z.string().nullish(),
          allegiance: z.string().nullish(),
          id: z.string().nullish(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const player1Id = input.player1.id ?? ctx.session.user.id;
      // Delete existing secondaries
      const prevGames = await ctx.prisma.gameInProgress.findMany({
        where: {
          OR: [{ player1Id }, { player2Id: input.player2.id }],
        },
        include: {
          player1Secondaries: true,
          player2Secondaries: true,
        },
      });

      if (prevGames.length > 0) {
        const secIds = prevGames
          .reduce(
            (acc: ActiveSecondary[], game) =>
              acc.concat(game.player1Secondaries, game.player2Secondaries),
            []
          )
          .map((sec) => ({ id: sec.id }));
        await ctx.prisma.activeSecondary.deleteMany({
          where: {
            OR: secIds,
          },
        });
      }

      const data = {
        gameType: input.gameType,
        mission: input.mission.name,
        player1Name: input.player1.name,
        player1Army: input.player1.army,
        p1MissionType: input.player1.missionType,
        player1Allegiance: input.player1.allegiance,
        player1PrimaryScore: 0,
        player1Id,
        player1Secondaries: {
          create: input.mission.secondaries,
        },
        player2Name: input.player2.name,
        player2Army: input.player2.army,
        p2MissionType: input.player2.missionType,
        player2Allegiance: input.player2.allegiance,
        player2PrimaryScore: 0,
        player2Id: input.player2.id,
        player2Secondaries: {
          create: input.mission.secondaries,
        },
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
        score: z.number(),
        id: z.string(),
        completed: z.boolean().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === "primary") {
        return await ctx.prisma.gameInProgress.updateMany({
          where: {
            OR: [
              { player1Id: ctx.session.user.id },
              { player2Id: ctx.session.user.id },
            ],
          },
          data:
            input.playerNumber === "player1"
              ? {
                  player1PrimaryScore: input.score,
                }
              : {
                  player2PrimaryScore: input.score,
                },
        });
      }
      return await ctx.prisma.activeSecondary.update({
        where: { id: input.id },
        data: input.completed
          ? { score: input.score, completed: input.completed }
          : { score: input.score },
      });
    }),
  logGameInProgress: protectedProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const gameInProgress = await ctx.prisma.gameInProgress.findFirstOrThrow({
        where: {
          OR: [
            { player1Id: ctx.session.user.id },
            { player2Id: ctx.session.user.id },
          ],
        },
        include: {
          player1Secondaries: true,
          player2Secondaries: true,
        },
      });
      const player1Score =
        gameInProgress.player1PrimaryScore +
        gameInProgress.player1Secondaries.reduce(
          (prev, curr) => prev + curr.score,
          0
        );
      const player2Score =
        gameInProgress.player2PrimaryScore +
        gameInProgress.player2Secondaries.reduce(
          (prev, curr) => prev + curr.score,
          0
        );
      const res = await ctx.prisma.gameResult.create({
        data: {
          gameType: gameInProgress.gameType,
          player1Name: gameInProgress.player1Name,
          player1Army: gameInProgress.player1Army,
          player1Score,
          player1Id: gameInProgress.player1Id,
          player2Name: gameInProgress.player2Name,
          player2Army: gameInProgress.player2Army,
          player2Score,
          player2Id: gameInProgress.player2Id,
          numberOfRounds: gameInProgress.round,
          description: input.description,
        },
      });
      await ctx.prisma.gameInProgress.deleteMany({
        where: {
          OR: [
            { player1Id: ctx.session.user.id },
            { player2Id: ctx.session.user.id },
          ],
        },
      });
      for (const sec of gameInProgress.player1Secondaries.concat(
        gameInProgress.player2Secondaries
      )) {
        await ctx.prisma.activeSecondary.delete({ where: { id: sec.id } });
      }
      return res;
    }),
  progressRound: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.gameInProgress.updateMany({
      where: {
        OR: [
          { player1Id: ctx.session.user.id },
          { player2Id: ctx.session.user.id },
        ],
      },
      data: {
        round: {
          increment: 1,
        },
      },
    });
  }),
  regressRound: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.gameInProgress.updateMany({
      where: {
        OR: [
          { player1Id: ctx.session.user.id },
          { player2Id: ctx.session.user.id },
        ],
      },
      data: {
        round: {
          decrement: 1,
        },
      },
    });
  }),
  createNewSecondary: protectedProcedure
    .input(z.object({ playerNumber: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const gameInProgress = await ctx.prisma.gameInProgress.findFirstOrThrow({
        where: {
          OR: [
            { player1Id: ctx.session.user.id },
            { player2Id: ctx.session.user.id },
          ],
        },
      });

      const inputData =
        input.playerNumber === "player1"
          ? { name: input.name, p1GameId: gameInProgress.id }
          : { name: input.name, p2GameId: gameInProgress.id };

      return await ctx.prisma.activeSecondary.create({ data: inputData });
    }),
});
