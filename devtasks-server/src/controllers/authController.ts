import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { handleError } from "../utils/handleError.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";
import { loginUser, registerUser } from "../services/authService.js";

export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const data = registerSchema.parse(req.body);
    const { accessToken, refreshToken } = await registerUser(
      data.email!,
      data.password!,
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true, // should be changed for production
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "User created" });
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
      secure: true, // should be changed for production
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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

  if (stored.expiresAt < new Date()) {
    return res.status(401).json({ error: "Expired refresh token" });
  }

  const accessToken = jwt.sign(
    { userId: stored.userId, email: stored.user.email, role: stored.user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" },
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });
  res.json({ message: "Refreshed" });
};

export const logout = async (req: Request, res: Response) => {
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
