import { Request, Response, Router } from "express";
import { adminMiddleware } from "../../middleware/authMiddleware";
import { ValidateZodSchema } from "../../middleware/common";
import { CreateAvatarSchema, CreateElementSchema, UpdateElementSchema } from "../../types";
import { CreateAvatarController, CreateElementController, UpdateElementController } from "../../controllers/adminController";

const router = Router();

router.post("/element", ValidateZodSchema(CreateElementSchema), async (req: Request, res: Response) => {
    await CreateElementController(req.body, res)
})

router.put("/element/:elementId", ValidateZodSchema(UpdateElementSchema), async (req: Request, res: Response) => {
    await UpdateElementController(req.body, req.params.elementId!, res)
})

router.post("/avatar", ValidateZodSchema(CreateAvatarSchema), async (req, res) => {
    await CreateAvatarController(req.body, res)
})

router.post("/map", (req, res) => {

})

export const AdminRouter = router