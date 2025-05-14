import Prisma from "@repo/db/client";
import { Element } from "../../../../packages/db/prisma/generated/prisma";

export const GetAllElements = async (): Promise<Element[]> => {
  const elements = await Prisma.element.findMany();
  return elements;
};
