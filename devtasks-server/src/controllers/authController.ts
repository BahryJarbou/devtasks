import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";
import { loginUser, registerUser } from "../services/authService.js";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data.email, data.password, data.role);

    res.json(user);
  } catch (err: any) {
    handleError(err, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const { accessToken, refreshToken } = await loginUser(
      data.email,
      data.password,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // should be changed for production
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in" });
  } catch (err: any) {
    handleError(err, res);
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "No refresh token" });
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!stored) {
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  const accessToken = jwt.sign(
    { userId: stored.userId, role: stored.user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
  res.json({ message: "Refreshed" });
};

const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
};
