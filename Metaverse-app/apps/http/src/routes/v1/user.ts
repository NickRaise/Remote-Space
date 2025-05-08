import { Request, Response, Router } from "express";
import { ValidateZodSchema } from "../../middleware/common";
import { UpdateMetadataSchema } from "../../types";
import { userMiddleware } from "../../middleware/authMiddleware";
import { UpdateUserMetadata } from "../../controllers/userController";

const router = Router();

router.post(
  "/metadata",
  userMiddleware,
  ValidateZodSchema(UpdateMetadataSchema),
  async (req: Request, res: Response) => {
    await UpdateUserMetadata(req.userId!, req.body.avatarId, res);
  }
);

router.get("/metadata/bulk", (req: Request, res: Response) => {
  res.send("Bulk metadata route");
});

export const UserRouter = router;
