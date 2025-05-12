import { Request, Response, Router } from "express";
import { userMiddleware } from "../../middleware/authMiddleware";
import { ValidateZodSchema } from "../../middleware/common";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
import { AddSpaceElementController, CreateSpaceController, DeleteSpaceController, DeleteSpaceElementController, GetAllSpacesController } from "../../controllers/spaceController";

const router = Router()

router.post("/", userMiddleware, ValidateZodSchema(CreateSpaceSchema), async (req: Request, res: Response) => {
    const userId = req.userId!
    await CreateSpaceController(req.body, userId, res)
})

router.delete("/:spaceId", userMiddleware, async (req, res) => {
    const userId = req.userId!
    const spaceId = req.params.spaceId!
    await DeleteSpaceController(spaceId, userId, res)
})

router.get("/all", userMiddleware, async (req, res) => {
    const userId = req.userId!
    await GetAllSpacesController(userId, res)
})

router.get("/:spaceId", (req, res) => {
    
})

router.post("/element",userMiddleware, ValidateZodSchema(AddElementSchema), async (req, res) => {
    const userId = req.userId!
    await AddSpaceElementController(req.body, userId, res)
})

router.delete("/element", userMiddleware, ValidateZodSchema(DeleteElementSchema), async (req, res) => {
    const userId = req.userId!
    await DeleteSpaceElementController(req.body, userId, res)
})

export const SpaceRouter = router