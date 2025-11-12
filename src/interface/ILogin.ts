export interface LoginDTO {
  nome: string;
  senha: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    tipo: string;
  };
}
