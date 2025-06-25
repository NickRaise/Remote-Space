import Prisma from "@repo/db/client";
export const GetAllMaps = async () => {
  const maps = await Prisma.map.findMany();
  return maps;
};
