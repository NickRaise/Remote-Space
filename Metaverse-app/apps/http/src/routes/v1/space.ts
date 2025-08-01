import { Request, Response, Router } from "express";
import { userMiddleware } from "../../middleware/authMiddleware";
import { ValidateZodSchema } from "../../middleware/common";
import { AddSpaceElementSchema, CreateSpaceSchema, DeleteSpaceElementSchema, UpdateThumbnailToSpaceSchema } from "@repo/common/api-types";
import { AddSpaceElementController, CreateSpaceController, DeleteSpaceController, DeleteSpaceElementController, GetAllAvailableSpaces, GetAllSpacesController, GetSpacesController, UpdateThumbnailController } from "../../controllers/spaceController";

const router = Router()

router.post("/", userMiddleware, ValidateZodSchema(CreateSpaceSchema), async (req: Request, res: Response) => {
    const userId = req.userId!
    await CreateSpaceController(req.body, userId, res)
})

router.get("/available", async (req: Request, res: Response) => {
    await GetAllAvailableSpaces(res)
})


router.get("/all", userMiddleware, async (req, res) => {
    const userId = req.userId!
    await GetAllSpacesController(userId, res)
})

router.post("/element",userMiddleware, ValidateZodSchema(AddSpaceElementSchema), async (req, res) => {
    const userId = req.userId!
    await AddSpaceElementController(req.body, userId, res)
})

router.delete("/element", userMiddleware, ValidateZodSchema(DeleteSpaceElementSchema), async (req, res) => {
    const userId = req.userId!
    await DeleteSpaceElementController(req.body, userId, res)
})

router.delete("/:spaceId", userMiddleware, async (req, res) => {
    const userId = req.userId!
    const spaceId = req.params.spaceId!
    await DeleteSpaceController(spaceId, userId, res)
})

router.get("/:spaceId", userMiddleware, async (req, res) => {
    const spaceId = req.params.spaceId!
    await GetSpacesController(spaceId, res)
})

router.post("/thumbnail", userMiddleware, ValidateZodSchema(UpdateThumbnailToSpaceSchema), async (req, res) => {
    const userId = req.userId!
    await UpdateThumbnailController(req.body, userId!, res)
})

export const SpaceRouter = router