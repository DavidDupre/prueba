import { client } from "./apiHandler";
import { sgdeaAxios } from "src/services";

export const getDependencies = async () => {
  const { data } = (await client.get(`/seccionSubSeccion`));
  return data?.map((item: any) => ({
    label: item.nombre,
    value: item.idSeccionSubSeccion,
  })).filter((it: any) => !!it.label && !!it.value);
};

export const getDocumetalTypes = async () => {
  const { data } = (await client.get(`/tiposdocumentales`));
  return data?.map((doc: any) => ({
    label: `${doc.id_tipo_documental} ${doc.nombre}`,
    value: doc.id_tipo_documental,
  }));
}

export const getIdTypes = async () => {

  const { data } = (await client.get(`/entidades/list/1`));
  return data?.map((value) => ({
    label: value.entidad,
    value: value.idEntidad,
  }));
}

export const getReceptionEnvironment = async () => {

  const { data } = (await client.get(`/entidades/list/4`));
  return data?.map((value) => ({
    label: value.entidad,
    value: value.idEntidad,
  }));
}

export const getProcedureTypes = async () => {
  const response = (await client.get(`/tiporadicados/list/`));

  const { data, status } = response;
  return data?.map((value) => ({
    label: value.nombreTipoRadicado,
    value: value.idTipoRadicado,
  }))
}


export const makeProcedure = async (dataToSend: object) => {
  const response = (await client.post(`/radicados/radicado_entrada`, dataToSend));
  const { status } = response;

  if (status === 200) {
    return { msg: 'Documento radicado con exito', status: 200 };
  }
  else {
    return { msg: 'Error creando el radicado', status };
  }
}

export const documentaryTypeCorrespondence = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoTipoIdentificacion`);
};

export const listTypeCommunication = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoTiposComunicacion`);
}

export const listTypePrefix2 = async () => {
  return await sgdeaAxios.get(`/medicina/prefijos`);
}

export const listTypePrefix = async () => {
  return await sgdeaAxios.get(`/medicina/prefijos`);
}

export const listTypeRadicado = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoTiporadicadoSalida`)
}

export const listTypeTemplate = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoTipoPlantilla`);
}

export const sendNewCommunication = async (data: any) => {
  try {
    const response = await client.post(`/correspondencia/crear`, data);
    const { data: responseData } = response;
    return responseData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const sendNewGeneralData = async (data: any) => {
  try {
    const response = await client.post(`/correspondencia/agregarDatosgenerales`, data);
    const { data: responseData } = response;
    return responseData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const listShippingWay = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoFormaEnvio`);
}

export const listShippingWayMedicina = async () => {
  return await sgdeaAxios.get(`/medicina/getFormasEnvio`);
}

export const sendNewExitData = async (data: any) => {
  try {
    const response = await client.post(`/correspondencia/agregarDatosSalida`, data);
    const { data: responseData } = response;
    return responseData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export const getCopiesTypes = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoTipoCopia`);
}

export const getDependenciesTypes = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoDependencias`);
}

export const getDependenciesTypes2 = async () => {
  return await sgdeaAxios.get(`/seccionSubSeccion`);
}

export const getListOfficial = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoFuncionarios`);
}


export const getListOfficial2 = async (id) => {
  return await sgdeaAxios.get(`/api/usuarios/seccionSubseccion/${id}`);
}

export const getRadicadoAsociado = async () => {
  return await sgdeaAxios.get(`/correspondencia/radicaciones/listadoradicadosentradaysalida`);
}

export const getListadoGestion = async () => {
  return await sgdeaAxios.get(`/correspondencia/comunicacion/listadoTipoGestion`);
}

export const getMetadataML = async (id) => {
  return await sgdeaAxios.get(`/medicina/getComunicacionesById/${id}`);
}

export const getTipoEvento = async () => {
  return await sgdeaAxios.get(`/medicina/eventos`);
}

export const getTipoOrigin= async ()=>{
  return await sgdeaAxios.get(`/medicina/getOrigenEvento`);
}

export const getPlantillas= async ()=>{
  return await sgdeaAxios.get(`/radicados/obtenerHijosPorNodo/7b4a115f-7e94-4add-80a6-82078cc299a8`)
}

export const getTipoSiniestro= async ()=>{
  return await sgdeaAxios.get(`/medicina/getSiniestros`);
}
export const getSiniestroUnico= async ()=>{
  return await sgdeaAxios.get(`/medicina/getSiniestrosUnico`);
}
export const getDocumentosByIdML = async (id) => {
  return await sgdeaAxios.get(`/medicina/getAnexosCargados/${id}`);
}

export const getAllDataComunicacion = async (id) => {
  return await sgdeaAxios.get(`/medicina/getComunicacionesAllById/${id}`);
}
export const getAllDataComunicacionCor = async (id) => {
  return await sgdeaAxios.get(`/correspondencia/obtenerCorrespondenciaComunicacion/${id}`);
}
