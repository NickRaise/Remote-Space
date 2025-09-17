import express from "express";
import cors from "cors";
import { V1Router } from "../routes/v1";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1", V1Router);

app.get("/", (req, res) => {
  res.send("API working!!!");
});

// For Vercel serverless functions, export the app instead of listening
export default app;

// For local development
if (require.main === module) {
  app.listen(process.env.PORT || 3002, () => {
    console.log("Server running on port", process.env.PORT || 3002);
  });
}
