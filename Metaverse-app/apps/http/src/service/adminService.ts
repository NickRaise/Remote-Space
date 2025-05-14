import z from "zod";
import Prisma from "@repo/db/client";
import { CreateAvatarSchema, CreateElementSchema } from "../types";
import {
  Avatar,
  Element,
} from "../../../../packages/db/prisma/generated/prisma";

export const CreateElement = async (
  elementData: z.infer<typeof CreateElementSchema>
): Promise<Element> => {
  const element = await Prisma.element.create({
    data: elementData,
  });

  return element;
};

export const UpdateElement = async (
  imageUrl: string,
  elementId: string
): Promise<Element> => {
  const element = await Prisma.element.update({
    where: {
      id: elementId,
    },
    data: {
      imageUrl,
    },
  });

  return element;
};

export const CreateAvatar = async (
  avatarData: z.infer<typeof CreateAvatarSchema>
): Promise<Avatar> => {
  const avatar = await Prisma.avatar.create({
    data: avatarData,
  });

  return avatar;
};
