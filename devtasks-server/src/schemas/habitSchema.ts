import { z } from "zod";

export const createHabitSchema = z.object({
  name: z.string().min(1),
});
