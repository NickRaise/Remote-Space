import { Request, Response, Router } from "express";
import { adminMiddleware } from "../../middleware/authMiddleware";
import { ValidateZodSchema } from "../../middleware/common";
import { CreateElementSchema } from "../../types";
import { CreateElementController } from "../../controllers/adminController";

const router = Router();

router.post("/element", adminMiddleware, ValidateZodSchema(CreateElementSchema), async (req: Request, res: Response) => {
    await CreateElementController(req.body, res)
})

router.put("/element/elementId", (req, res) => {

})

router.post("/avatar", (req, res) => {

})

router.post("/map", (req, res) => {

})

export const AdminRouter = router