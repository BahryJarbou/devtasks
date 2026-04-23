import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface Authrequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (
  req: Authrequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
