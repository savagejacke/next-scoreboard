import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const accountRouter = router({
  getGroup: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      include: { group: true },
    });
    return user.group;
  }),
  getGroupMembers: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    });
    if (!user.groupId) {
      throw new TRPCError({
        message: "You are not a member of a group",
        code: "BAD_REQUEST",
      });
    }
    const group = await ctx.prisma.group.findUniqueOrThrow({
      where: { id: user.groupId },
      include: { members: true, admin: true },
    });
    const members = group.members ?? [];
    return members.concat(group.admin).map((user) => ({
      id: user.id,
      name: user.name,
    }));
  }),
  getInvitedTo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      include: { InvitedTo: true },
    });
    return { invitedTo: user.InvitedTo };
  }),
  createGroup: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (typeof ctx.session.user.name !== "string") {
        throw new TRPCError({
          message:
            "You must be logged in with an account name to perform this action",
          code: "BAD_REQUEST",
        });
      }
      return await ctx.prisma.group.create({
        data: {
          name: input.name,
          adminId: ctx.session.user.name,
        },
      });
    }),
  inviteToGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.group.update({
        where: { adminId: ctx.session.user.id },
        data: {
          invites: {
            create: [{ id: input.id }],
          },
        },
      });
    }),
  joinGroup: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        include: { InvitedTo: true },
      });
      const group = await ctx.prisma.group.findUniqueOrThrow({
        where: { name: input.name },
      });
      if (!user.InvitedTo.includes(group)) {
        throw new TRPCError({
          message: "You are not invited to this group",
          code: "UNAUTHORIZED",
        });
      }
      return await ctx.prisma.group.update({
        where: { name: input.name },
        data: {
          members: {
            create: [{ id: user.id }],
          },
        },
      });
    }),
});
