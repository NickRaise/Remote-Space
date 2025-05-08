import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET!;

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization; // Bearer {token}
  const token = header?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      role: string;
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization; // Bearer {token}
  const token = header?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      role: string;
      userId: string;
    };

    if (decoded.role !== "Admin") {
      res.status(403).json({ message: "Unauthorized" });
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
