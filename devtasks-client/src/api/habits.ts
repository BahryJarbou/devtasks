import { api } from "./client";

export const getHabits = async () => {
  const res = await api.get("/habits", { withCredentials: true });
  return Array.isArray(res.data) ? res.data : [];
};

export const createHabit = async (name: string) => {
  const res = await api.post("/habits", { name }, { withCredentials: true });
  return res.data;
};

export const toggleHabit = async (id: string) => {
  const res = await api.post(
    `/habits/${id}/toggle`,
    {},
    { withCredentials: true },
  );
  return res.data;
};

export const deleteHabit = async (id: string) => {
  const res = await api.delete(`/habits/${id}`, { withCredentials: true });
  return res.data;
};
