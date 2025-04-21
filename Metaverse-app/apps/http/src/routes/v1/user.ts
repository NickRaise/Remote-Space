import { Router } from "express";

const router = Router()

router.post("/metadata", (req, res) => {
    res.send("user metadata route")
})

router.get("/metadata/bulk", (req, res) => {
    res.send("Bulk metadata route")
})

export const UserRouter = router