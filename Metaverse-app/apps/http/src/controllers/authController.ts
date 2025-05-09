import z from "zod";
import { SignInSchema, SignUpSchema } from "../types";
import { Response } from "express";
import {
  CreateUser,
  findUser,
  isPasswordCorrect,
} from "../service/authService";
import jwt from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@repo/db/prismaTypes";
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET!;

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
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2002") {
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

export const SignInUser = async (
  userData: z.infer<typeof SignInSchema>,
  res: Response
) => {
  try {
    const user = await findUser(userData.username);
    if (!user) {
      res.status(403).json({ success: false, message: "Username not found" });
      return;
    }

    const isValid = await isPasswordCorrect(userData.password, user.password);

    if (!isValid) {
      res.status(403).json({ success: false, message: "Invalid password" });
      return
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET
    );

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
