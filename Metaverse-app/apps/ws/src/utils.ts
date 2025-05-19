import jwt from "jsonwebtoken";
import { environmentConfig } from "@repo/common/config";

const JWT_SECRET = environmentConfig.jwtSecret as string;

export function generateUserId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let userId = "";
  for (let i = 0; i < 10; i++) {
    userId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return userId;
}

export const verifyUser = (
  token: string
): { userId: string; role: "admin" | "user" } | null => {
  try {
    const metaData = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: "admin" | "user";
    };
    return metaData;
  } catch (err) {
    console.log("Error verifying user on ws: ", err);
    return null;
  }
};
