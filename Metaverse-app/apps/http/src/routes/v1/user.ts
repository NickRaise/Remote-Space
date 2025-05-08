import { Request, Response, Router } from "express";
import { ValidateZodSchema } from "../../middleware/common";
import { UpdateMetadataSchema } from "../../types";

const router = Router()

router.post("/metadata", ValidateZodSchema(UpdateMetadataSchema), (req:Request, res:Response) => {
   
})

router.get("/metadata/bulk", (req:Request, res:Response) => {
    res.send("Bulk metadata route")
})

export const UserRouter = router