import Prisma from "@repo/db/client";
import z from "zod";
import { CreateSpaceSchema } from "../types";
import {
  MapElements,
  Space,
} from "../../../../packages/db/prisma/generated/prisma";

interface IMapWithElements {
  mapElements: MapElements[];
}

export const CreateSpaceWithoutMapId = async (
  spaceData: z.infer<typeof CreateSpaceSchema>,
  userId: string
): Promise<Space> => {
  const space = await Prisma.space.create({
    data: {
      name: spaceData.name,
      width: parseInt(spaceData.dimensions.split("x")[0] ?? "100"),
      height: parseInt(spaceData.dimensions.split("x")[1] ?? "100"),
      creatorId: userId,
    },
  });

  return space;
};

export const CreateSpaceWithMapId = async (
  spaceData: z.infer<typeof CreateSpaceSchema>,
  map: IMapWithElements,
  userId: string
): Promise<Space> => {
  const space = await Prisma.$transaction(async () => {
    const space = await CreateSpaceWithoutMapId(spaceData, userId);
    await Prisma.spaceElements.createMany({
      data: map.mapElements.map((e) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x,
        y: e.y,
      })),
    });
    return space;
  });
  return space;
};

export const FindMapById = async (
  id: string
): Promise<IMapWithElements | null> => {
  const map = await Prisma.map.findUnique({
    where: {
      id,
    },
    select: {
      mapElements: true,
    },
  });

  return map;
};

export const FindSpaceById = async (spaceId: string): Promise<Space | null> => {
  const space = await Prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });

  return space;
};

export const DeleteSpaceById = async (spaceId: string): Promise<Space> => {
  const deleteSpace = await Prisma.space.delete({
    where: {
      id: spaceId,
    },
  });

  return deleteSpace;
};

export const GetAllSpacesById = async (userId: string): Promise<Space[]> => {
  const spaces = await Prisma.space.findMany({
    where: {
      creatorId: userId,
    },
  });

  return spaces;
};
