import apiClient from "@/src/service/api";
import { LoginDTO, LoginResponse } from "../interface/ILogin";

export const loginApi = async (loginData: LoginDTO): Promise<LoginResponse> => {
  const { data } = await apiClient.post("/auth/login", loginData);
  return data;
};
