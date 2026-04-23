import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllTasks,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/taskController.js";

const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.get("/", getAllTasks);
taskRouter.post("/", createTaskHandler);
taskRouter.put("/:id", updateTaskHandler);
taskRouter.delete("/:id", deleteTaskHandler);

export default taskRouter;
