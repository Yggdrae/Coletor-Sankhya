import axios from "axios";

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAxiosBaseURL = (url: string) => {
  apiClient.defaults.baseURL = url;
  console.log(`Axios baseURL set to: ${url}`);
};

if (__DEV__) {
  apiClient.interceptors.request.use(
    (config) => {
      console.groupCollapsed(
        `%cREQUEST: ${config.method?.toUpperCase()} ${config.url}`,
        "color: #00A36C; font-weight: bold;"
      );

      if (config.data) {
        console.log("Body:", config.data);
      }
      if (config.params) {
        console.log("Params:", config.params);
      }

      console.groupEnd();

      return config;
    },
    (error) => {
      console.error("REQUEST ERROR:", error);
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.groupCollapsed(
        `%cRESPONSE: ${response.status} ${response.config.url}`,
        "color: #007BFF; font-weight: bold;"
      );

      console.log("Data:", response.data);
      console.groupEnd();

      return response;
    },
    (error) => {
      console.groupCollapsed(
        `%cRESPONSE ERROR: ${error.response?.status} ${error.config?.url}`,
        "color: #DC3545; font-weight: bold;"
      );

      console.log("Mensagem:", error.message);
      if (error.response?.data) {
        console.log("Erro da API:", error.response.data);
      }

      console.groupEnd();

      return Promise.reject(error);
    }
  );
}

export default apiClient;
