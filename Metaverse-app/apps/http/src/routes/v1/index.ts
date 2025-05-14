import { Router } from "express";
import { AuthRouter } from "./auth";
import { UserRouter } from "./user";
import { SpaceRouter } from "./space";
import { AdminRouter } from "./admin";
import { adminMiddleware } from "../../middleware/authMiddleware";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/space", SpaceRouter);
router.use("/admin", adminMiddleware, AdminRouter);

router.get("/avatars", (req, res) => {
  res.send("avatar route");
});

router.get("/elements", (req, res) => {
  
});

export const V1Router = router;
