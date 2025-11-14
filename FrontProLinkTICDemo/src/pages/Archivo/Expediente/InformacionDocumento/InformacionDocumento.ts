import { onMounted, Ref } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ProcessType } from "../FilterExpediente";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import moment from "moment";
interface DocumentoFormData {
  dependencia: string;
  serie: string;
  subserie: string;
  fechaCreacion: string;
  fechaModificacion: string;
  nombre: string;
  tipoDocumental: string;
  tipoDocumento: string;
  pesoDocumento: string;
  radicado: string;
  hashDocumento: string;
  // codUnidad: string;
  // fechaDeclaracion: string;
  // fechaElaboracion: string;
  // fechaIncorporacion: string;
  // fechaTransmision: string;
  // hashDocumento: string;
  // nombreDocumento: string;
  // nombreElaborador: string;
  // numerofolios: string;
  // origen: string;
  // pesoDocumento: string;
  // radicado: string;
  // tipoDocumental: number;
}

export const useInformacionDocumento = () => {
  const router = useRouter();
  const route = useRoute();
  const documentoId = route.params["documento"];
  const expedienteId = route.params["expediente"];

  const formData: Ref<DocumentoFormData> = ref({
    dependencia: "",
    serie: "",
    subserie: "",
    nombre: "",
    tipoDocumento: "",
    pesoDocumento: "",
    radicado: "",
    fechaCreacion: "",
    fechaModificacion: "",
    tipoDocumental: "",
    hashDocumento: "",
  });

  const expediente = ref();
  const tiposDocumentales = ref([]);
  onMounted(() => {
    cargarData();
    getDocumentTypes();
  });

  const onReclasificar = (process: ProcessType) => {
    router.push(
      `/expediente/documento/${process}/${expedienteId}/${documentoId}`
    );
  };



  const getDocumentTypes = async () => {
    try {
      const response = await sgdeaArchivoAxios.get("/trd/documents");
      if ([200, 202].includes(response.status)) {
        tiposDocumentales.value = response.data
          .map((tipo) => ({ label: tipo.name, value: tipo.id }))
          .sort((a, b) => a.label.localeCompare(b.label));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cargarData = async () => {
    const idExpediente = route.query.titulo;
    const radicado = route.query.radicado;
    try {
      const responseExpediente = await sgdeaAxios.get(
        `/expediente/detail?name=${idExpediente}`
      );

      expediente.value = responseExpediente.data;

      const response = await sgdeaArchivoAxios.get(
        `/alfresco/nodes/${documentoId}/details`
      );
      if (response.status === 200 || response.status === 201) {
        formData.value.dependencia = expediente.value.dependencia;
        formData.value.serie = expediente.value.serie;
        formData.value.subserie = expediente.value.subserie;
        formData.value.tipoDocumental = expediente.value.tipoDocumental;
        formData.value.fechaCreacion = moment(response.data.fechaCreacion).format("YYYY-MM-DD");
        formData.value.fechaModificacion = moment(response.data.fechaModificacion).format("YYYY-MM-DD");
        formData.value.radicado = radicado.toString();
        formData.value.nombre = response.data.nombre?.split('.').slice(0, -1).join('.') || response.data.nombre;
        formData.value.pesoDocumento = response.data.contenido ? (response.data.contenido.tamaño / 1024).toFixed(2) + ' KB' : '0 KB';
        formData.value.hashDocumento = response.data.id || "";
        // formData.value.pesoDocumento = response.data.size;
        // formData.value.nombreDocumento = response.data.nombre;
        // formData.value.hashDocumento = response.data.nodeId;
        // formData.value.radicado = response.data.radicado.idRadicado;
        // formData.value.fechaTransmision = moment(response.data.radicado.fechaRadicacion, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD");
        // formData.value.fechaElaboracion = moment(response.data.radicado.fechaRadicacion, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD");
        // formData.value.fechaIncorporacion = moment(response.data.fechaCargue).format("YYYY-MM-DD");
        // formData.value.nombreElaborador = response.data.radicado.nombre;
        // formData.value.numerofolios = response.data.radicado.nroFolios;
        // formData.value.origen = response.data.radicado.origen;
        // tiposDocumentales.value = response.data.documentType.name;
      }
    } catch (error) {
      toast.error("Error al cargar los datos del documento");
    }
  };

  // const onSubmit = async () => {
  //   if (!formData.value.origen) {
  //     toast.error("El campo Origen es obligatorio");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       origen: formData.value.origen,
  //       folios: formData.value.numerofolios ? parseInt(formData.value.numerofolios) : 1,
  //       documentType: formData.value.tipoDocumental ? { id: formData.value.tipoDocumental.toString() } : null
  //     };

  //     const expedienteId = route.params["expediente"];
  //     const response = await sgdeaArchivoAxios.put(`/upload-documents-file/${expedienteId}`, payload);

  //     if ([200, 201, 202].includes(response.status)) {
  //       toast.success("Documento actualizado correctamente");
  //       // router.push(`/some-path`);
  //     } else {
  //       toast.error("Error al actualizar el documento");
  //     }
  //   } catch (error) {
  //     toast.error("Error al actualizar el documento");
  //   }
  // };
  return { formData, expediente, onReclasificar, tiposDocumentales };
};
