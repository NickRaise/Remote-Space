import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only if not in production
//Set NODE_ENV to production on deployment
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.resolve(__dirname, "../.env"),
  });
}

export const environmentConfig = {
  jwtSecret: process.env.JWT_SECRET,
};
