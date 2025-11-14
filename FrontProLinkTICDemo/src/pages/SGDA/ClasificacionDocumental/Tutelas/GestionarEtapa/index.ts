import { sgdeaAxios } from "src/services";

export const getTaskId = async (route) => {
  try {
    const response = await sgdeaAxios.get(`/tutela/info/${route.params.id}`);
    return response.data.codigoProceso;
  } catch (error) {
    console.error('Error getting task ID:', error);
    throw error;
  }
}

export const submitEtapaProcesal = async (body, id) => {
  try {
    const response = await sgdeaAxios.post(`/tutela/${id}/tarea/etapaProcesalDatosProceso`, body);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editEtapaProcesal = async (body, id) => {
  try {
    const response = await sgdeaAxios.put(`/tutela/tareaEtapaProcesalDatosProceso/${id}`, body);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

