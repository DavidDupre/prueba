import { sgdeaAxios } from "src/services";

interface TrazabilidadI {
  htmlContent: string;
  usuario: string;
  rol: string;
}

export const crearTrazabilidadDocumento = async (
  data: TrazabilidadI,
  documentoFile: string,
  flujo?: string
) => {
  if (!flujo || (flujo !== "ML" && flujo !== "COM")) {
    await sgdeaAxios.post(
      `/api/documentos/${flujo}/${documentoFile}/historial`,
      data
    );
  } else
    await sgdeaAxios.post(
      `api/documentos-salida/${documentoFile}/historial`,
      data
    );
};
