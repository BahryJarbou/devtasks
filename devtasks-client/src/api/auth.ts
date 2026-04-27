import { api } from "./client";

export const signup = async (email: string, password: string) => {
  const res = await api.post(
    "/auth/register",
    { email, password },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me", { withCredentials: true });
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout", {}, { withCredentials: true });
};

export const login = async (email: string, password: string) => {
  try {
    const res = await api.post(
      "auth/login",
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );
    console.log(res.data);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const refresh = async () => {
  try {
    await api.post("auth/refresh", {}, { withCredentials: true });
  } catch (err) {
    throw err;
  }
};
