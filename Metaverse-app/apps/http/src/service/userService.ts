import z from "zod";
import { SignUpSchema } from "../types";
import Prisma from "@repo/db/client";
import { IUser } from "../types/modelsTypes";
import bcrypt from "bcryptjs";

export const CreateUser = async (
  userData: z.infer<typeof SignUpSchema>
): Promise<IUser> => {
  const hashedPassword = await hashPassword(userData.password);

  try {
    const user = await Prisma.user.create({
      data: {
        username: userData.username,
        password: hashedPassword,
        role: userData.type === "admin" ? "Admin" : "User",
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

export const findUser = async (username: string): Promise<IUser | null> => {
  try {
    const user = await Prisma.user.findUnique({
      where: {
        username,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const isPasswordCorrect = async (
  password: string,
  hash: string
): Promise<Boolean> => {
  return await bcrypt.compare(password, hash);
};
