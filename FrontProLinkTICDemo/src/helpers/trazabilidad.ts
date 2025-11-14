import { sgdeaAxios } from "src/services";

interface TrazabilidadI {
  proceso: any,
  secuencia: any,
  estado: any,
  descripcion: string,
  comentario: string,
  nombre: string,
  tramite?: string,
  accion?: string
}

export const crearTrazabilidad = async (data: TrazabilidadI) => {
  await sgdeaAxios.post("/trazabilidad/crear", data, { showLoader: false });
}
