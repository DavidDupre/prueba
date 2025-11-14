import axios from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
} from "axios";
import { toast } from "src/helpers/toast";

// interface CustomAxiosRequestConfig extends AxiosRequestConfig {
//   successMessage?: string;
//   errorMessage?: string;
// }

// Función para crear una instancia de Axios personalizada
export const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  // const handleSuccess = (
  //   response: AxiosResponse,
  //   successMessage?: string
  // ): AxiosResponse => {
  //   if (successMessage) {
  //     toast.success(successMessage);
  //   }
  //   return response;
  // };

  // const handleError = (
  //   error: AxiosError,
  //   errorMessage?: string
  // ): Promise<AxiosError> => {
  //   if (errorMessage) {
  //     toast.error(`${errorMessage} - Código ${error.code}`);
  //   }
  //   return Promise.reject(error);
  // };

  // instance.interceptors.response.use(
  //   (res) =>
  //     handleSuccess(
  //       res,
  //       (res.config as CustomAxiosRequestConfig).successMessage
  //     ),
  //   (err) =>
  //     handleError(err, (err.config as CustomAxiosRequestConfig).errorMessage)
  // );

  return instance;
};
