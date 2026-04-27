import { prisma } from "../lib/prisma.js";

export const getHabits = async (userId: string) => {
  return prisma.habit.findMany({
    where: { userId },
    include: { logs: true },
    orderBy: { createdAt: "desc" },
  });
};

export const createHabit = async (userId: string, name: string) => {
  return prisma.habit.create({
    data: {
      name,
      userId,
    },
  });
};

export const toggleHabit = async (userId: string, habitId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit || habit.userId !== userId) {
    throw new Error("NOT_FOUND");
  }

  const existing = await prisma.habitLog.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: today,
      },
    },
  });

  if (existing) {
    await prisma.habitLog.delete({
      where: { id: existing.id },
    });
    return { completed: false };
  }

  await prisma.habitLog.create({
    data: {
      habitId,
      date: today,
    },
  });

  return { completed: true };
};
