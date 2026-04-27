import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getHabitsHandler,
  createHabitHandler,
  toggleHabitHandler,
} from "../controllers/habitController.js";
import { get } from "node:http";

const habitRouter = Router();

habitRouter.use(authMiddleware);

habitRouter.get("/", getHabitsHandler);
habitRouter.post("/", createHabitHandler);
habitRouter.post("/:id/toggle", toggleHabitHandler);

export default habitRouter;
