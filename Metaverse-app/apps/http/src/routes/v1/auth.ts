import { Request, Response, Router } from "express";
import { SignInSchema, SignUpSchema } from "../../types";
import { SignInUser, SignUpUser } from "../../controllers/authController";
import { ValidateZodSchema } from "../../service/common";

const router = Router();

router.post(
  "/signup",
  ValidateZodSchema(SignUpSchema),
  async (req: Request, res: Response) => {
    await SignUpUser(req.body, res);
  }
);

router.post(
  "/signin",
  ValidateZodSchema(SignInSchema),
  async (req: Request, res: Response) => {
    await SignInUser(req.body, res);
  }
);

export const AuthRouter = router;
