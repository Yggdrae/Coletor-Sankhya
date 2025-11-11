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

export default apiClient;
