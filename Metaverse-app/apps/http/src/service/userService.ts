import z from "zod";
import { SignUpSchema } from "../types";
import Prisma from "@repo/db/client";
import { IUser } from "../types/modelsTypes";

export const CreateUser = async (userData: z.infer<typeof SignUpSchema>): Promise<IUser> => {
  try {
    const user = await Prisma.user.create({
      data: {
        username: userData.username,
        password: userData.password,
        role: userData.type === "admin" ? "Admin" : "User",
      },
    });
    return user
  } catch (err) {
    throw err;
  }
};
