import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/src/service/auth";
import { LoginDTO, LoginResponse } from "../interface/ILogin";
import { useUser } from "../context/userContext";
import Toast from "react-native-toast-message";

export const useLogin = () => {
  const { setUserName, setAccessToken } = useUser();

  return useMutation({
    mutationFn: async (loginData: LoginDTO): Promise<LoginResponse> => {
      return await loginApi(loginData);
    },
    onSuccess: (data) => {
      console.log("Login bem-sucedido!", data);
      Toast.show({
        type: "success",
        text1: "Login realizado com sucesso!",
        position: "top",
        visibilityTime: 3000,
      });
      setUserName(data.usuario.nome);
      setAccessToken(data.access_token);
    },
    onError: (error) => {
      console.error("Erro no login:", error.message);
      Toast.show({
        type: "error",
        text1: "Erro ao tentar realizar o login!",
        position: "top",
        visibilityTime: 3000,
      });
    },
  });
};
