import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/src/service/auth";
import { LoginDTO, LoginResponse } from "../interface/ILogin";
import { useUser } from "../context/userContext";

export const useLogin = () => {
  const { setUserName, setAccessToken } = useUser();

  return useMutation({
    mutationFn: async (loginData: LoginDTO): Promise<LoginResponse> => {
      return await loginApi(loginData);
    },
    onSuccess: (data) => {
      console.log("Login bem-sucedido!", data);
      setUserName(data.usuario.nome)
      setAccessToken(data.access_token)
    },
    onError: (error) => {
      console.error("Erro no login:", error.message);
    },
  });
};
