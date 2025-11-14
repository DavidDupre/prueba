import { correspondeciaAxios } from "src/services";

export const updateStateComunication = async (
  id: number,
  idNuevoEstado: number
) => {
  return await correspondeciaAxios.put<string>(
    `/correspondencia/comunicacion/actualizarEstado/${id}?idNuevoEstado=${idNuevoEstado}`
  );
};
