import z from "zod";
import { SignUpSchema } from "../types";
import { Response } from "express";
import { CreateUser } from "../service/userService";
import { PrismaClientKnownRequestError } from "../../../../packages/db/prisma/generated/prisma/runtime/library";

export const SignUpUser = async (
  userData: z.infer<typeof SignUpSchema>,
  res: Response
) => {
  try {
    const user = await CreateUser(userData);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      userId: user.id,
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2001") {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
