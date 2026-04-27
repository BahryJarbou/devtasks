import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email(),
    password: z.string().min(6),
    role: z.string().optional(),
  })
  .transform((data) => {
    // Create a copy or modify in place to remove undefined keys
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );
  });

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
