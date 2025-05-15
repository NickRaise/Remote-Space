import { Request, Response, Router } from "express";
import { ValidateZodSchema } from "../../middleware/common";
import { UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/authMiddleware";
import {
  GetMetaDataByIds,
  UpdateUserMetadata,
} from "../../controllers/userController";

const router = Router();

router.post(
  "/metadata",
  userMiddleware,
  ValidateZodSchema(UpdateMetadataSchema),
  async (req: Request, res: Response) => {
    await UpdateUserMetadata(req.userId!, req.body.avatarId, res);
  }
);

router.get("/metadata/bulk", async (req: Request, res: Response) => {
  const userIdString = (req.query.ids ?? "[]") as string;
  const userIds = userIdString.slice(1, userIdString.length - 1).split(",");
  await GetMetaDataByIds(userIds, res);
});

export const UserRouter = router;
