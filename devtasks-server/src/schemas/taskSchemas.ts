import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .transform((data) => {
    // Create a copy or modify in place to remove undefined keys
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );
  });
