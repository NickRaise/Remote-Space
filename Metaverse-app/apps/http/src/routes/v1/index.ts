import { Router } from "express";
import { AuthRouter } from "./auth";
import { UserRouter } from "./user";
import { SpaceRouter } from "./space";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/space", SpaceRouter)

router.get("/avatars", (req, res) => {
  res.send("avatar route");
});

router.get("/elements", (req, res) => {

})

export const V1Router = router;
