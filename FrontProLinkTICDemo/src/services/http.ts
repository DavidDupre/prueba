import axios from "axios";
import { getActivePinia } from "pinia";
import { useAuthStore } from "src/stores/auth.store";

const api = axios.create({
  baseURL: process.env.API,
});

api.interceptors.request.use((config) => {
  const pinia = getActivePinia();
  if (pinia) {
    const auth = useAuthStore(pinia);
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  }
  return config;
});

export default api;
