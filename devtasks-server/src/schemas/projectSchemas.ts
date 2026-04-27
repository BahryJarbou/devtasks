import { z } from "zod";

export const createProjectSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
  })
  .transform((data) => {
    // Create a copy or modify in place to remove undefined keys
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );
  });

export const updateProjectSchema = z
  .object({
    name: z.string().min(1).optional(),
    status: z.string().optional(),
    description: z.string().optional(),
  })
  .transform((data) => {
    // Create a copy or modify in place to remove undefined keys
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );
  });
