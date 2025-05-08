import Prisma from "@repo/db/client";

export const UpdateMetadata = async (userId: string, avatarId: string) => {
  try {
    await Prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarId,
      },
    });
  } catch (err) {
    throw err;
  }
};
