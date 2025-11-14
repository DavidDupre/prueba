import { useAuthStore } from 'src/stores/auth.store';
import { getAllDataComunicacion,getDocumentosByIdML,getListadoGestion,getTipoSiniestro,getSiniestroUnico,getTipoOrigin,getPlantillas,getTipoEvento,getMetadataML,listTypePrefix2,getListOfficial2,getDependenciesTypes2,listTypeRadicado,documentaryTypeCorrespondence, listTypeCommunication, listTypePrefix, listTypeTemplate, sendNewCommunication, sendNewGeneralData, listShippingWay, listShippingWayMedicina, sendNewExitData, getCopiesTypes,  getDependenciesTypes, getListOfficial, getRadicadoAsociado, getAllDataComunicacionCor } from '../../API/endpointsData';
import Api from 'src/services/Api';
import { toast } from 'src/helpers/toast';

const auth=useAuthStore()

const fixLabelOptions={
  'Accidente':'Accidente de trabajo',
  'Enfermedad':'Enfermedad laboral'
}

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

export const useCrearComunicacionesLogic = () => {
  const getAllDataByID = async (id) => {
    try {
      const {data}= await getAllDataComunicacion(id);
      return data
    } catch (error) {
      toast.error('Error al obtener la info de comunicacion')
    }
  }

  const getAllDataComunicacionCo = async (id) => {
    try {
      const {data}= await getAllDataComunicacionCor(id);
      return data
    } catch (error) {
      toast.error('Error al obtener la info de comunicacion')
    }
  }

  const getDocsByIdML = async (id) => {
    try {
      const {data}= await getDocumentosByIdML(id);
      return data
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getListadoGestionOptions= async () => {
    try {
      const {data}= await getListadoGestion();
      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  const getSiniestrosOptions = async () => {
    try {
      const {data}= await getTipoSiniestro();
      return data.map((siniestro)=>{
        return{
          label: siniestro.id,
          value: siniestro.id
        }
      }).filter((siniestro)=>siniestro.label !== 'No aplica')
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getSiniestrosUnicoOptions = async () => {
    try {
      const {data}= await getSiniestroUnico();
      return data.map((siniestro)=>{
        return{
          label: siniestro.id,
          value: siniestro.id
        }
      }).filter((siniestro)=>siniestro.label !== 'No aplica')
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getTypePlantillaLoaded2=async ()=>{
    try {
      const {data}=await getPlantillas()
      return data.list.entries.map((item)=>({
        label: item.entry.name,
        value: item.entry.id
      }))
    } catch (error) {
      console.error(error)
      return []
    }
  }
  const getTipoEventoOptions = async () => {
    try {
      const {data}= await getTipoEvento();
      return data.map((tipo)=>{
        return{
          label: fixLabelOptions[tipo.nombre],
          value: tipo.id
        }
      })
    } catch (error) {
      return [];
    }
  }
  const getTipoOriginOptions = async () => {
    try {
      const {data}= await getTipoOrigin();
      return data.map((origin)=>{
        return{
          label: origin.evento,
          value: origin.id
        }
      })
    } catch (error) {
      return [];
    }
  }

  const getInfoMetadataML = async (id) => {
    try {
      const {data}= await getMetadataML(id);
      return data
    } catch (error) {
      console.error(error);
    }
  }


  const getRadicadoAsociadoOptions = async () => {
    try {
      const { data } = await getRadicadoAsociado();

      if (!data) {
        return [];
      }

      const idRadicadoOptions = data
        .filter((radicado) => radicado.idRadicado)
        .slice(0, 5)
        .map((radicado) => ({
          label: radicado.idRadicado,
          value: radicado.idRadicado,
        }));

      const radicadoSalidaAprobarOptions = data
        .filter((radicado) => radicado.radicadoSalidaAprobar)
        .slice(0, 5)
        .map((radicado) => ({
          label: radicado.radicadoSalidaAprobar,
          value: radicado.idRadicado,
        }));

      const combinedOptions = [...idRadicadoOptions, ...radicadoSalidaAprobarOptions];

      return combinedOptions;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getTipoDocumentoOptions = async () => {
    try {
      const {data} = await documentaryTypeCorrespondence();

      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getTypesCommunicationOptions = async () => {
    try {
      const {data} = await listTypeCommunication();

      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getTypesPrefix = async () => {
    try {
      const {data} = await listTypePrefix();

      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  const getTypesPrefix2 = async () => {
    try {
      // const {data} = await listTypePrefix();
      const {data:medicinaPref}= await listTypePrefix2();
      const {relations}=auth

      const oficinaRelations=relations.map((relation)=>{
        return relation.idDependencia
      })

      const filteredPref=medicinaPref.filter((prefijo)=>{
        return oficinaRelations.includes(prefijo?.oficina?.idDependencia)
      })

      const allPrefijos=[...filteredPref]

      return allPrefijos.map((value) => ({
        label: value?.nombre,
        value: value?.id,
        aprobacionAutomatica: value?.aprobacionAutomatica,
        nameAprobador: `${value?.aprobador?.firstname} ${value?.aprobador?.lastname}`,
        grupo: value?.oficina?.nombre,
        plantilla: value?.plantilla,
        idAprobador: value.aprobador?.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getTypesTemplates = async () => {
    try {
      const {data}= await listTypeTemplate();
      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const createCommunication = async (data: any) => {
    try {
      const response = await sendNewCommunication(data);
      return response;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const createGeneralData = async (data: any) => {
    try {
      const response = await sendNewGeneralData(data);
      return response;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getShippingWayOptions = async () => {
    try {
      const {data} = await listShippingWay();

      return sortOptions( data.map((value) => ({
        label: value.nombre,
        value: value.id,
      })))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getShippingWayOptionsMedicina = async () => {
    try {
      const {data} = await listShippingWayMedicina();

      return sortOptions( data.map((value) => ({
        label: value.forma,
        value: value.id,
      })))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getListTypeRadicadoOptions = async () => {
    try {
      const {data} = await listTypeRadicado();

      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const loadDepartments = async (idPais = 425) => {
    try {
      const response = await Api.listDepartamento(idPais);
      const data = response;

      return data?.map((value) => ({
        label: value.nombre,
        value: value.idPais,
      })) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const loadMunicipalities = async (idDepartamento) => {
    try {
      const response = await Api.listMunicipio(idDepartamento);
      const data = response;

      return data?.map((value) => ({
        label: value.nombre,
        value: value.idMunicipio,
        codigoDivipola: value.codigoDivipola,
      })) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const createExitData = async (data: any) => {
    try {
      const response = await sendNewExitData(data);
      return response;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getCopiesTypesOptions = async () => {
    try {
      const {data} = await getCopiesTypes();

      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getDependenciesTypesOptions = async () => {
    try {
      const {data} = await getDependenciesTypes();

      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  const getDependenciesTypesOptions2 = async () => {
    try {
      const {data} = await getDependenciesTypes2();
      return data.map((value) => ({
        label: value.nombre,
        value: value.idSeccionSubSeccion,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getListOfficialOptions = async () => {
    try {
      const {data} = await getListOfficial();

      return data.map((value) => ({
        label: value.nombre,
        value: value.id,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  const getListOfficialOptions2 = async (id) => {
    try {
      const {data} = await getListOfficial2(id);

      return data.map((value) => ({
        label: `${value.firstname} ${value.lastname}`,
        value: value.id,
        email: value.email,
        cargo: value.cargo,
      }))|| [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  return {
    getTipoDocumentoOptions,
    getTypesCommunicationOptions,
    getTypesPrefix,
    getTypesTemplates,
    createCommunication,
    createGeneralData,
    getShippingWayOptions,
    getShippingWayOptionsMedicina,
    loadDepartments,
    loadMunicipalities,
    createExitData,
    getCopiesTypesOptions,
    getDependenciesTypesOptions,
    getListOfficialOptions,
    getListTypeRadicadoOptions,
    getDependenciesTypesOptions2,
    getListOfficialOptions2,
    getRadicadoAsociadoOptions,
    getListadoGestionOptions,
    getTypesPrefix2,
    getInfoMetadataML,
    getTipoEventoOptions,
    getTypePlantillaLoaded2,
    getTipoOriginOptions,
    getSiniestrosOptions,
    getDocsByIdML,
    getAllDataByID,
    getAllDataComunicacionCo,
    getSiniestrosUnicoOptions
  };
};
