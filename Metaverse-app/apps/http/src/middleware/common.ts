import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const ValidateZodSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedData = schema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ success: false, message: "Validation failed" });
      return;
    }
    req.body = parsedData.data;
    next();
  };
};
