import type { Response } from "express";
import type { Authrequest } from "../middleware/authMiddleware.js";
import { createHabitSchema } from "../schemas/habitSchema.js";
import * as habitService from "../services/habitService.js";
import { handleError } from "../utils/handleError.js";

export const getHabitsHandler = async (req: Authrequest, res: Response) => {
  try {
    const habits = await habitService.getHabits(req.user!.userId);
    res.json(habits);
  } catch (err) {
    handleError(err, res);
  }
};

export const createHabitHandler = async (req: Authrequest, res: Response) => {
  try {
    const data = createHabitSchema.parse(req.body);

    const habit = await habitService.createHabit(req.user!.userId, data.name);

    res.json(habit);
  } catch (err) {
    handleError(err, res);
  }
};

export const toggleHabitHandler = async (req: Authrequest, res: Response) => {
  try {
    const habitId = req.params.id as string;
    if (!habitId) {
      throw new Error("NOT_FOUND");
    }
    const result = await habitService.toggleHabit(req.user!.userId, habitId);

    res.json(result);
  } catch (err) {
    handleError(err, res);
  }
};
