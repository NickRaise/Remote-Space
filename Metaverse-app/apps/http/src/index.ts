import express from "express"
import { V1Router } from "./routes/v1"
import PrismaClient from "@repo/db/client"

const app = express()
app.use(express.json())

app.use("/api/v1", V1Router)

app.get("/", (req, res) => {
    res.send("API working!!!")
})

app.listen(process.env.port || 3000)