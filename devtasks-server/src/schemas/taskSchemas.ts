import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1),
  projectId: z.string().min(1),
  priority: z.string().min(1),
  dueDate: z.string(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
    priority: z.string().min(1).optional(),
  })
  .transform((data) => {
    // Create a copy or modify in place to remove undefined keys
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );
  });
