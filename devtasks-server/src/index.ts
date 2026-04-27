import express from "express";
import type { Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import {
  authMiddleware,
  type Authrequest,
} from "./middleware/authMiddleware.js";
import { requireRole } from "./middleware/roleMiddlewware.js";
import { limiter } from "./utils/rateLimiter.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/taskRoutes.js";
import habitRouter from "./routes/habitRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://dev-tasks-bahryjarbous-projects.vercel.app/",
    credentials: true,
  }),
);
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.get("/auth/me", authMiddleware, (req: Authrequest, res: Response) => {
  res.json({ user: req.user });
});
app.use("/auth", limiter, authRoutes);
app.use("/tasks", taskRouter);
app.use("/habits", habitRouter);
app.use("/projects", projectRouter);
app.get("/protected", authMiddleware, (req: Authrequest, res: Response) => {
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
