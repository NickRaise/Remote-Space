import { Request, Response, Router } from "express";
import { SignUpSchema } from "../../types";
import { SignUpUser } from "../../controllers/userController";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const parsedData = SignUpSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ success: false, message: "Validation failed" });
    return;
  }

  await SignUpUser(parsedData.data, res);
});

router.post("/signin", (req, res) => {
  console.log("Signin route activated");
});

export const AuthRouter = router;
