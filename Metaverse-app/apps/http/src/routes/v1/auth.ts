import { Request, Response, Router } from "express";
import { SignInSchema, SignUpSchema } from "../../types";
import { SignInUser, SignUpUser } from "../../controllers/userController";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const parsedData = SignUpSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ success: false, message: "Validation failed" });
    return;
  }

  await SignUpUser(parsedData.data, res);
});

router.post("/signin", async (req, res) => {
  const parsedData = SignInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ success: false, message: "Validation failed" });
    return;
  }

  await SignInUser(parsedData.data, res);
});

export const AuthRouter = router;
