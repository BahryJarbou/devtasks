import { prisma } from "../lib/prisma.js";

export const getTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createTask = async (
  userId: string,
  title: string,
  projectId: string,
  priority: string,
  dueDate: string,
) => {
  return prisma.task.create({
    data: {
      title,
      userId,
      projectId,
      priority,
      dueDate: new Date(dueDate),
    },
  });
};

export const updateTask = async (
  userId: string,
  taskId: string,
  data: { title?: string; completed?: boolean },
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== userId) {
    throw new Error("NOT_FOUND");
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTask = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task || task.userId !== userId) {
    throw new Error("NOT_FOUND");
  }

  return prisma.task.delete({
    where: { id: taskId },
  });
};
