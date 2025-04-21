import { Router } from "express";

const router = Router()

router.get("/signup", (req, res) => {
    console.log("Signup route activated")
})

router.get("/signin", (req, res) => {
    console.log("Signin route activated")
})

export const AuthRouter = router