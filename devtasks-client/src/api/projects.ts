import { api } from "./client";

export const getProjects = async () => {
  const res = await api.get("/projects", {
    withCredentials: true,
  });
  return Array.isArray(res.data) ? res.data : [];
};

export const getProject = async (id: string) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const createProject = async (name: string) => {
  const res = await api.post("/projects", { name }, { withCredentials: true });
  return res.data;
};

export const updateProject = async (id: string, data: any) => {
  const res = await api.put(`/projects/${id}`, data, { withCredentials: true });
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await api.delete(`/projects/${id}`, { withCredentials: true });
};
