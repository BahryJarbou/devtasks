import type { Response, NextFunction } from "express";
import type { Authrequest } from "./authMiddleware.js";
import { error } from "node:console";

export const requireRole = (role: string) => {
  return (req: Authrequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user?.role !== role) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};
