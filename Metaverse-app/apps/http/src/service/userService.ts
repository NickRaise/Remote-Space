import Prisma from "@repo/db/client";
import { AvatarImage } from "../../../../packages/db/prisma/generated/prisma";

type AvatarWithImagesSubset = {
  id: string;
  name: string | null;
  imageUrl: AvatarImage;
};

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
): Promise<{ id: string; avatar: AvatarWithImagesSubset | null }[]> => {
  const metaData = await Prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      avatar: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  return metaData;
};
