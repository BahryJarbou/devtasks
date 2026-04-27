import { prisma } from "../lib/prisma.js";

export const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
};

export const createProject = async (
  userId: string,
  name: string,
  description?: string,
) => {
  return prisma.project.create({
    data: {
      name,
      userId,
      description: description ? description : "",
    },
  });
};

export const getProject = async (userId: string, projectId: string) => {
  return await prisma.project.findUnique({
    where: { userId, id: projectId },
  });
};

export const updateProject = async (
  userId: string,
  projectId: string,
  data: { name?: string; status?: string; description?: string },
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.userId !== userId) {
    throw new Error("NOT_FOUND");
  }

  return prisma.project.update({
    where: { id: projectId },
    data,
  });
};

export const deleteProject = async (userId: string, projectId: string) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.userId !== userId) {
    throw new Error("NOT_FOUND");
  }

  return prisma.project.delete({
    where: { id: projectId },
  });
};
