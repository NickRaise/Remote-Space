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
  const ids = req.query.ids;
  const userIds = typeof ids === "string" ? JSON.parse(ids) : [];

  await GetMetaDataByIds(userIds, res);
});

export const UserRouter = router;
