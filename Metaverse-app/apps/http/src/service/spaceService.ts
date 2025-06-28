import Prisma from "@repo/db/client";
import z from "zod";
import { CreateSpaceSchema } from "@repo/common/api-types";
import {
  Element,
  MapElements,
  Space,
  SpaceElements,
} from "../../../../packages/db/prisma/generated/prisma";

interface IMapWithElements {
  width: number;
  height: number;
  mapElements: MapElements[];
}

interface SpaceData extends Space {
  spaceElements: (SpaceElements & { element: Element })[];
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
      thumbnail: spaceData.thumbnail,
    },
  });

  return space;
};

export const CreateSpaceWithMapId = async (
  spaceData: z.infer<typeof CreateSpaceSchema>,
  map: IMapWithElements,
  userId: string
): Promise<Space> => {
  // Set the dimensions to be same as map
  spaceData.dimensions = `${map.width}x${map.height}`;

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
      height: true,
      width: true,
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

export const FindSpaceByIdAndCreator = async (
  spaceId: string,
  userId: string
): Promise<Space | null> => {
  const space = await Prisma.space.findUnique({
    where: {
      id: spaceId,
      creatorId: userId,
    },
  });

  return space;
};

export const GetSpaceDataById = async (
  spaceId: string
): Promise<SpaceData | null> => {
  const space = await Prisma.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      spaceElements: {
        include: {
          element: true,
        },
      },
    },
  });

  return space;
};
