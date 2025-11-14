import { toast } from 'src/helpers/toast';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import axios from 'axios';

export interface DocumentalType {
  name: string;
  shortName: string;
  documentTypologyCode: string;
  status: boolean;
  description: string;
  clasificacionSeguridad: string;
  esUnDocumentoIndexable: boolean;
  esUnDocumentoGestion: boolean;
  esUnDocumentoPlantilla: boolean;
  labelIndice: boolean;
  bloqueoIndice: boolean;
  exigidoIndice: boolean;
  unicoIndice: boolean;
  visibleIndice: boolean;
  indexableIndice: boolean;
  editableIndice: boolean;
  esUnDocumentoPlantillaTipoFormulario: boolean;
  cierreAutomatico: boolean;
  typeSupport: string;
}

export interface FormData {
  numero: string;
  codigoDocumentoCalidad: string;
  nombreTipoDocumental: string;
  nombreCorto: string;
  descripcion: string;
  estado: Status | null;
  tipoSoporte: TipoSoporte | null;
  clasificacionSeguridad: SafetyRating | null;
  dependenciaAutorizada: string;
  usuarioAutorizado: string;
  dependenciasSeleccionadas: string[];
  usuariosSeleccionados: string[];
  metadatosDisponibles: string[];
  metadatosAsignados: string[];
}

export interface Status {
  label: string;
  value: boolean;
}

export interface TipoSoporte {
  label: string;
  value: number;
}

export interface SafetyRating {
  label: string;
  value: string;
}

export const estadoOptions: Status[] = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false }
];

export const clasificacionSeguridadOptions = [
  { label: 'Confidencial', value: 'confidencial' },
  { label: 'Publico', value: 'publico' }
];

export const dependenciasDisponibles = ref([
  'Dependencia 1',
  'Dependencia 2',
  'Dependencia 3'
]);

export const usuariosDisponibles = ref([
  'Usuario 1',
  'Usuario 2',
  'Usuario 3'
]);

export const metadatosDisponibles = ref([
  'Metadato 1',
  'Metadato 2',
  'Metadato 3'
]);

export const tipoSoporteOptions = [
  { label: 'Físico', value: 1 },
  { label: 'Electrónico', value: 2 },
  { label: 'Físico/Electrónico', value: 3 }
];

export function useFormLogic() {
  const formData = ref<FormData>({
    numero: '',
    codigoDocumentoCalidad: '',
    nombreTipoDocumental: '',
    nombreCorto: '',
    descripcion: '',
    estado: null,
    tipoSoporte: null,
    clasificacionSeguridad: null,
    dependenciaAutorizada: '',
    usuarioAutorizado: '',
    dependenciasSeleccionadas: [],
    usuariosSeleccionados: [],
    metadatosDisponibles: [],
    metadatosAsignados: [],
  });

  const step = ref(1);
  const selectedDependencia = ref('');
  const selectedUsuario = ref('');
  const selectedMetadato = ref('');
  const route = useRoute()
  const router = useRouter()
  const formRef = ref();
  const isEditing = ref(route.path.includes('editar'));
  const editDocType = ref();
  const showModal = ref(false);

  onMounted(async () => {
    if (isEditing.value && route?.params?.id) {
      await getDocumentalType();
    }
  })

  const getDocumentalType = async (): Promise<void> => {
    try {
      const response = await sgdeaArchivoAxios.get(`/documentType/positiva/${route?.params?.id}`)
      editDocType.value = response.data;
      if (response.status === 200) {
        setDocumentalType(response.data);
      }
    } catch (error) {
      // await router.push('/clasificacion-documental/tipo-documental');
      toast.error('Hubo un error al cargar el tipo documental');
    }
  }

  const setDocumentalType = (documentalType: DocumentalType): void => {
    if (editDocType?.value) {
      // Step 1: Información básica
      formData.value.nombreTipoDocumental = documentalType?.name || "";

      formData.value.nombreCorto = documentalType?.shortName || "";
      formData.value.descripcion = documentalType?.description || "";
      formData.value.codigoDocumentoCalidad = documentalType?.documentTypologyCode || "";
      formData.value.estado = estadoOptions.filter(
        estado => estado.value === documentalType.status)[0];
      formData.value.clasificacionSeguridad = clasificacionSeguridadOptions.filter(
        safety => safety.value === documentalType.clasificacionSeguridad)[0];
      formData.value.tipoSoporte = tipoSoporteOptions.filter(
        support => support.label === documentalType.typeSupport)[0];
    }
  }

  const onDelete = async (): Promise<void> => {
    try {
      await axios.delete(`/archivo/documentType/${route?.params?.id}`);
      showModal.value = false;
      toast.success('Se ha eliminado el tipo documental');
      await router.back();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Se encuentra en expediente relacionado a la tipología documental seleccionada para eliminar, favor validar.");
      } else {
        toast.error("Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente.");
      }
    }
  };

  const handleShowModal = async () => {
    if (await formRef.value.validate()) {
      showModal.value = true;
    } else {
      toast.error("Por favor verifique, datos obligatorios incompletos");
    }

  }

  const onSubmit = async (): Promise<void> => {
    try {
      if (await formRef.value.validate()) {
        const body = {
          // Step 1: Información básica
          name: formData.value.nombreTipoDocumental,
          shortName: formData.value.nombreCorto,
          status: formData.value.estado?.value,
          versionTrd: Number(route.query.versionTrd),
          documentTypologyCode: formData.value.codigoDocumentoCalidad,
          typeSupport: formData.value.tipoSoporte?.label,
          clasificacionSeguridad: formData.value.clasificacionSeguridad?.value,
          // Nuevos nombres de campos según lo solicitado
          indexableDocument: true,
          managementDocument: true,
          templateDocument: true,
          indexLabel: true,
          indexLock: true,
          indexRequired: true,
          indexUnique: true,
          indexVisible: true,
          indexIndexable: true,
          indexEditable: true,
          formTemplateDocument: true,
          automaticClosure: true,
        };
        // Si es edición se actualiza, caso contrario se crea uno nuevo
        if (isEditing.value) {
          await sgdeaArchivoAxios.put(`/documentType/positiva/${route?.params?.id}`, body);
          toast.success('Se ha actualizado el tipo documental');
          await router.back();
        } else {
          await sgdeaArchivoAxios.post("/documentType/positiva", body);
          toast.success('Se ha creado un nuevo tipo documental');
          await router.back();
        }
      } else {
        toast.error("Por favor verifique, datos obligatorios incompletos");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente");
    }
  };

  const nextStep = () => {
    step.value++;
  };

  const prevStep = () => {
    step.value--;
  };

  const goBack = () => {
    router.back();
  }

  const addDependencia = (dependencia: string) => {
    if (dependencia && !formData.value.dependenciasSeleccionadas.includes(dependencia)) {
      formData.value.dependenciasSeleccionadas.push(dependencia);
      selectedDependencia.value = '';
    }
  };

  const removeDependencia = (index: number) => {
    formData.value.dependenciasSeleccionadas.splice(index, 1);
  };

  const addUsuario = (usuario: string) => {
    if (usuario && !formData.value.usuariosSeleccionados.includes(usuario)) {
      formData.value.usuariosSeleccionados.push(usuario);
      selectedUsuario.value = ''; // Limpiar selección
    }
  };

  const removeUsuario = (index: number) => {
    formData.value.usuariosSeleccionados.splice(index, 1);
  };

  const addMetadato = (metadato: string) => {
    if (metadato && !formData.value.metadatosAsignados.includes(metadato)) {
      formData.value.metadatosAsignados.push(metadato);
      formData.value.metadatosDisponibles = formData.value.metadatosDisponibles.filter(
        (item) => item !== metadato
      );
      selectedMetadato.value = ''; // Limpiar selección
    }
  };

  const removeMetadato = (index: number) => {
    const metadato = formData.value.metadatosAsignados.splice(index, 1)[0];
    formData.value.metadatosDisponibles.push(metadato); // Regresar a disponibles
  };

  const validateForm = () => {
    return toast.error("Por favor verifique, datos obligatorios incompletos");
  };

  return {
    step,
    formRef,
    isEditing,
    showModal,
    editDocType,
    estadoOptions,
    clasificacionSeguridadOptions,
    formData,
    selectedDependencia,
    selectedUsuario,
    selectedMetadato,
    dependenciasDisponibles,
    usuariosDisponibles,
    metadatosDisponibles,
    onMounted,
    prevStep,
    nextStep,
    goBack,
    validateForm,
    addDependencia,
    removeDependencia,
    addUsuario,
    removeUsuario,
    addMetadato,
    removeMetadato,
    onSubmit,
    onDelete,
    handleShowModal
  };
}
