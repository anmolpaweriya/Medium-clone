import api from "./api";

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const signup = (data: SignupData) => api.post("/auth/signup", data);

export const login = (data: { email: string; password: string }) => api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");
