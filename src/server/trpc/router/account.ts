import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const accountRouter = router({
  getGroup: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        group: {
          include: { members: true, admin: true },
        },
      },
    });
    if (user?.group) return user.group;

    return await ctx.prisma.group.findUnique({
      where: { adminId: ctx.session.user.id },
      include: { members: true },
    });
  }),
  getGroupMembers: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      include: {
        group: true,
        adminOf: {
          include: { members: true, admin: true },
        },
      },
    });
    const group = user.groupId
      ? await ctx.prisma.group.findUnique({
          where: { id: user.groupId },
          include: { members: true, admin: true },
        })
      : user.adminOf;
    if (!group) {
      throw new TRPCError({
        message: "You are not a member of a group",
        code: "BAD_REQUEST",
      });
    }
    const members = group.members ?? [];
    return members.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }),
  getInvitedTo: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      include: { InvitedTo: true },
    });
    return { invitedTo: user.InvitedTo };
  }),
  getUninvited: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      include: { adminOf: true },
    });
    const allUsers = await ctx.prisma.user.findMany({
      include: { InvitedTo: true },
    });
    return allUsers.filter(
      (member) =>
        !(
          member.InvitedTo.some((group) => group.id === user.adminOf?.id) ||
          member.groupId === user.adminOf?.id ||
          member.id === user.id
        )
    );
  }),
  createGroup: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          adminId: ctx.session.user.id,
        },
      });
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { groupId: group.id },
      });
      return group;
    }),
  inviteToGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.group.update({
        where: { adminId: ctx.session.user.id },
        data: {
          invites: {
            connect: [{ id: input.id }],
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
      if (!user.InvitedTo.some((invite) => invite.id === group.id)) {
        throw new TRPCError({
          message: "You are not invited to this group",
          code: "UNAUTHORIZED",
        });
      }
      const addedGroup = await ctx.prisma.group.update({
        where: { name: input.name },
        data: {
          members: {
            connect: [{ id: user.id }],
          },
          invites: {
            disconnect: [{ id: user.id }],
          },
        },
      });
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          InvitedTo: {
            disconnect: [{ id: addedGroup.id }],
          },
        },
      });
      return addedGroup;
    }),
  disbandGroup: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.group.delete({
      where: { adminId: ctx.session.user.id },
    });
  }),
  removeFromGroup: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.group.update({
        where: { adminId: ctx.session.user.id },
        data: {
          members: {
            disconnect: { id: input.id },
          },
        },
      });
    }),
  leaveGroup: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: {
        group: {
          disconnect: true,
        },
      },
    });
  }),
});
