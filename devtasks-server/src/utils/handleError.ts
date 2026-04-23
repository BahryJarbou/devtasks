import type { Response } from "express";

export const handleError = (err: any, res: Response) => {
  if (err.name === "ZodError") {
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors,
    });
  }

  if (err.message === "USER_EXISTS") {
    return res.status(400).json({ error: "User already exists" });
  }

  if (err.message === "INVALID_CREDENTIALS") {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  console.error(err);

  return res.status(500).json({ error: "Internal server error" });
};
