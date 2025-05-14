import z from "zod";
import Prisma from "@repo/db/client";
import { CreateElementSchema } from "../types";
import { Element } from "../../../../packages/db/prisma/generated/prisma";

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
