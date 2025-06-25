import { Router } from "express";
import { AuthRouter } from "./auth";
import { UserRouter } from "./user";
import { SpaceRouter } from "./space";
import { AdminRouter } from "./admin";
import { adminMiddleware } from "../../middleware/authMiddleware";
import { GetElementsController } from "../../controllers/elementController";
import { GetAvatarsController } from "../../controllers/avatarController";
import { GetAllMapsController } from "../../controllers/mapController";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/user", UserRouter);
router.use("/space", SpaceRouter);
router.use("/admin", adminMiddleware, AdminRouter);

router.get("/avatars", async (_, res) => {
  await GetAvatarsController(res)
});

router.get("/elements", async (_, res) => {
  await GetElementsController(res)
});

router.get("/maps", async (_, res) => {
  await GetAllMapsController(res)
});

export const V1Router = router;
