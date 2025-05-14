import Prisma from "@repo/db/client";
import { Avatar } from "../../../../packages/db/prisma/generated/prisma";

export const GetAllAvatars = (): Promise<Avatar[]> => {
  const avatars = Prisma.avatar.findMany();
  return avatars;
};
