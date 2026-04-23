import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/roleMiddlewware.js";
import { limiter } from "./utils/rateLimiter.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/auth", limiter, authRoutes);
app.get("/", (req, res) => {
  res.send("API is running");
});
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated" });
});

app.get("/admin", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({ message: "Admin Only" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
