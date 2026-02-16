import api from "./axiosConfig";

export const login = async (username: string, password: string) => {
  const response = await api.post("/api/auth/login", {
    username,
    password,
  });
  return response.data;
};
