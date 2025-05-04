import z from "zod";
import { SignUpSchema } from "../types";
import Prisma from "@repo/db/client";

export const CreateUser = async (userData: z.infer<typeof SignUpSchema>) => {
  try {
    const user = await Prisma.user.create({
      data: {
        username: userData.username,
        password: userData.password,
        role: userData.type === "admin" ? "Admin" : "User",
      },
    });
  } catch (err) {
    throw err;
  }
};
