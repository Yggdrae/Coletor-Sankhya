import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/src/service/auth";
import { LoginDTO } from "../interface/ILogin";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (loginData: LoginDTO) => {
      await loginApi(loginData);
    },
    onSuccess: (data) => {
      console.log("Login bem-sucedido!", data);
    },
    onError: (error) => {
      console.error("Erro no login:", error.message);
    },
  });
};
