import Prisma from "@repo/db/client";
import z from "zod";
import { AddSpaceElementSchema } from "@repo/common/api-types";
import { Space, SpaceElements } from "../../../../packages/db/prisma/generated/prisma";

interface SpaceElementWithSpace extends SpaceElements {
  space: Space;
}

export const CreateSpaceElement = async (
  elementData: z.infer<typeof AddSpaceElementSchema>
): Promise<SpaceElements> => {
  const spaceElement = await Prisma.spaceElements.create({
    data: elementData,
  });

  return spaceElement;
};

export const DeleteSpaceElementById = async (
  spaceElementId: string
): Promise<SpaceElements> => {
  const spaceElement = await Prisma.spaceElements.delete({
    where: {
      id: spaceElementId,
    },
  });

  return spaceElement;
};

export const FindSpaceElementById = async (
  id: string
): Promise<SpaceElementWithSpace | null> => {
  const spaceElement = await Prisma.spaceElements.findUnique({
    where: {
      id,
    },
    include: {
      space: true,
    },
  });

  return spaceElement;
};
