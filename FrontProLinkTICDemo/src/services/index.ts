import { createAxiosInstance } from "./axios";
import { useLoadingStore } from "src/stores/LoadingStore";
import type { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "src/stores/auth.store";

// Obtener URLs desde variables de entorno
declare module "axios" {
  export interface AxiosRequestConfig {
    showLoader?: boolean;
  }
}

let url: string = "https://gcpsgdea.positivasgdea.com";
let adminUrl: string = "";
let urlArchivo: string = "";
let intescoUrl: string = "";
let urlCorrespondecia = process.env.API_CORRESPONDENCIA
  ? process.env.API_CORRESPONDENCIA
  : "https://gcpsgdea.positivasgdea.com";

try {
  if (process.env.API) url = process.env.API;
  if (process.env.ADMIN) adminUrl = process.env.ADMIN;
  if (process.env.API_INTESCO) intescoUrl = process.env.API_INTESCO;
  if (process.env.API_ARCHIVO) urlArchivo = process.env.API_ARCHIVO;
} catch (e) {
  console.error(e);
  try {
    url = ``;
    adminUrl = "";
    intescoUrl = "";
    urlArchivo = "";
  } catch (e) {
    console.error(e);
  }
}

// Crear instancias de Axios
export const sgdeaAxios = createAxiosInstance(
  // "https://gcpsgdea.positivasgdea.com/",
  "https://ms-sgdea-uat-711792583187.us-east1.run.app/",
);
export const sgdeaArchivoAxios = createAxiosInstance(urlArchivo);
export const adminAxios = createAxiosInstance(adminUrl);
export const intescoAxios = createAxiosInstance(intescoUrl);
export const correspondeciaAxios = createAxiosInstance(urlCorrespondecia);
export const integracionesSgdea = createAxiosInstance(
  process.env.VITE_INTEGRATION_API_URL,
);

// Interceptores
const axiosInstances = [
  adminAxios,
  intescoAxios,
  correspondeciaAxios,
  sgdeaAxios,
  integracionesSgdea,
];
axiosInstances.forEach((instance) => {
  // --- Interceptor de request ---
  instance.interceptors.request.use((config) => {
    const auth = useAuthStore();
    const loadingStore = useLoadingStore();
    const requiresAuth = config.headers?.["authRequired"] !== false;

    // --- Loader ---
    if (config.showLoader === false) {
      loadingStore.stopLoading();
    } else {
      loadingStore.startLoading();
    }

    // --- Agregar token si existe ---
    if (requiresAuth && auth.token) {
      if (config.headers) {
        // Axios 1.x
        if (typeof (config.headers as any).set === "function") {
          (config.headers as any).set("Authorization", `Bearer ${auth.token}`);
        } else {
          // Axios <1.x
          (config.headers as any)["Authorization"] = `Bearer ${auth.token}`;
        }
      }
    }

    return config;
  });

  // --- Interceptor de response ---
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      useLoadingStore().stopLoading();
      const auth = useAuthStore();
      if (
        !auth.userInfo ||
        !auth.userInfo.userid ||
        !auth.userInfo.username ||
        !auth.userInfo.role
      ) {
        auth.logOut();
      }
      return response;
    },
    async (error: AxiosError) => {
      useLoadingStore().stopLoading();
      const originalRequest = error.config as any;
      const auth = useAuthStore();

      // Validar si el error viene del refreshToken con status 400
      if (
        originalRequest.url.endsWith("/auth/refreshToken") &&
        error.response?.status === 400
      ) {
        auth.logOut();
        return Promise.reject(error);
      }

      // Si el token ha expirado y la petición no es el refresh ni hemos reintentado
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.endsWith("/auth/refreshToken")
      ) {
        originalRequest._retry = true;

        const result = await auth.refreshTokenAction();
        if (result && auth.token) {
          originalRequest.headers["Authorization"] = `Bearer ${auth.token}`;
          return instance(originalRequest);
        } else {
          auth.logOut();
        }
      }
      return Promise.reject(error);
    },
  );
});

// Métodos CRUD reutilizables
const request = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  instance: AxiosInstance,
  url: string,
  data?: any,
  showLoader = true,
): Promise<T> => {
  const config = { showLoader };

  try {
    const response =
      method === "get" || method === "delete"
        ? await instance[method]<T>(url, config)
        : await instance[method]<T>(url, data, config);

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const apiService = {
  get: <T>(instance: AxiosInstance, url: string, showLoader = true) =>
    request<T>("get", instance, url, undefined, showLoader),
  post: <T>(
    instance: AxiosInstance,
    url: string,
    data: any,
    showLoader = true,
  ) => request<T>("post", instance, url, data, showLoader),
  put: <T>(
    instance: AxiosInstance,
    url: string,
    data: any,
    showLoader = true,
  ) => request<T>("put", instance, url, data, showLoader),
  patch: <T>(
    instance: AxiosInstance,
    url: string,
    data: any,
    showLoader = true,
  ) => request<T>("patch", instance, url, data, showLoader),
  delete: <T>(instance: AxiosInstance, url: string, showLoader = true) =>
    request<T>("delete", instance, url, undefined, showLoader),
};
