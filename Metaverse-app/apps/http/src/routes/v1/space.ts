import { Request, Response, Router } from "express";
import { userMiddleware } from "../../middleware/authMiddleware";
import { ValidateZodSchema } from "../../middleware/common";
import { CreateSpaceSchema } from "../../types";
import { CreateSpaceController } from "../../controllers/spaceController";

const router = Router()

router.post("/", userMiddleware, ValidateZodSchema(CreateSpaceSchema), async (req: Request, res: Response) => {
    const userId = req.userId!
    await CreateSpaceController(req.body, userId, res)
})

router.delete("/:spaceId", (req, res) => {

})

router.get("/all", (req, res) => {

})

router.get("/:spaceId", (req, res) => {
    
})

router.post("/element", (req, res) => {

})

router.delete("/element", (req, res) => {

})

export const SpaceRouter = router