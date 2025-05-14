import z from "zod";
import Prisma from "@repo/db/client";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
} from "../types";
import {
  Avatar,
  Element,
  Map,
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

export const CreateMap = async (
  mapData: z.infer<typeof CreateMapSchema>
): Promise<Map> => {
  const map = await Prisma.map.create({
    data: {
      name: mapData.name,
      thumbnail: mapData.thumbnail,
      width: parseInt(mapData.dimensions.split("x")[0] ?? "100"),
      height: parseInt(mapData.dimensions.split("x")[1] ?? "100"),
      mapElements: {
        create: mapData.defaultElements.map((e) => ({
          elementId: e.elementId,
          x: e.x,
          y: e.y,
        })),
      },
    },
  });

  return map;
};
