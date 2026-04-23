import type { Response } from "express";
import type { Authrequest } from "../middleware/authMiddleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchemas.js";
import * as taskService from "../services/taskService.js";
import { handleError } from "../utils/handleError.js";

export const getAllTasks = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const tasks = await taskService.getTasks(userId);

    res.json(tasks);
  } catch (err) {
    handleError(err, res);
  }
};

export const createTaskHandler = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const data = createTaskSchema.parse(req.body);

    const task = await taskService.createTask(userId, data.title);

    res.json(task);
  } catch (err) {
    handleError(err, res);
  }
};

export const updateTaskHandler = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const data = updateTaskSchema.parse(req.body);
    const taskId = req.params.id as string;
    if (!taskId) {
      throw new Error("NOT_FOUND");
    }

    const task = await taskService.updateTask(userId, taskId, data);

    res.json(task);
  } catch (err) {
    handleError(err, res);
  }
};

export const deleteTaskHandler = async (req: Authrequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;

    if (!taskId) {
      throw new Error("NOT_FOUND");
    }

    await taskService.deleteTask(userId, taskId);

    res.json({ success: true });
  } catch (err) {
    handleError(err, res);
  }
};
