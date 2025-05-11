import Prisma from "@repo/db/client";
import { Avatar } from "../../../../packages/db/prisma/generated/prisma";

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

export const GetAvatarByIds = async (
  ids: string[]
): Promise<{ id: string; avatar: Avatar | null }[]> => {
  const metaData = Prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      avatar: true,
      id: true,
    },
  });

  return metaData;
};
