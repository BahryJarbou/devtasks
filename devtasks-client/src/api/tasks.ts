import { api } from "./client";

export const getTasks = async () => {
  const res = await api.get("/tasks", {
    withCredentials: true,
  });
  return Array.isArray(res.data) ? res.data : [];
};

export const createTask = async ({
  title,
  dueDate,
  priority,
  projectId,
}: {
  title: string;
  dueDate?: string;
  priority?: "high" | "low" | "medium";
  projectId?: string;
}) => {
  const res = await api.post(
    "/tasks",
    { title, dueDate, priority, projectId },
    { withCredentials: true },
  );
  return res.data;
};

export const updateTask = async (id: string, data: any) => {
  const res = await api.put(`/tasks/${id}`, data, { withCredentials: true });
  return res.data;
};

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`, { withCredentials: true });
};
