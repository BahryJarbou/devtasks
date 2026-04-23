import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (
  email: string,
  password: string,
  role?: string,
) => {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("USER_EXISTS");
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, role: role || "user" },
  });

  return {
    id: user.id,
    email: user.email,
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = crypto.randomUUID();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};
