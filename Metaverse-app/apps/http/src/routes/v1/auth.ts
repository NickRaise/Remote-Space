import { Router } from "express";

const router = Router()

router.post("/signup", (req, res) => {
    console.log("Signup route activated")
})

router.post("/signin", (req, res) => {
    console.log("Signin route activated")
})

export const AuthRouter = router