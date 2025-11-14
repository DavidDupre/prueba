import { toast } from "src/helpers/toast";
import { sgdeaArchivoAxios } from "src/services";
import { onMounted, Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export interface IAgregarSerieSubserie {
  codigoSerie: string;
  nombreSerie: string;
  codigoSubserie: string;
  nombreSubserie: string;
  archivoGestion: number;
  archivoCentral: number;
  disposicionFinal: string;
  reproduccionTecnica?: boolean;
  procedimientos: string;
  estado: { label: string; value: boolean };
  clasificacionSeguridad: string;
  dependenciasAutorizadas?: string;
  usuariosAutorizados?: string;
  dependenciasSeleccionadas?: string[];
  usuariosSeleccionados?: string[];
  metadatosDisponibles?: string[];
  metadatosAsignados?: string[];
  nivelSeguridad?: string;
}

export const estadosOptions = [
  { label: "Activo", value: true },
  { label: "Inactivo", value: false },
];

export const clasificacionSeguridadOptions = [
  "Pública",
  "Reservada",
  "Clasificada",
];

export const dependenciasDisponibles = ref([
  "Dependencia 1",
  "Dependencia 2",
  "Dependencia 3",
]);

export const usuariosDisponibles = ref(["Usuario 1", "Usuario 2", "Usuario 3"]);

export const metadatosDisponibles = ref([
  "Metadato 1",
  "Metadato 2",
  "Metadato 3",
]);

export function useFormLogic() {
  const formData: Ref<IAgregarSerieSubserie> = ref({
    codigoSerie: "",
    nombreSerie: "",
    codigoSubserie: "",
    nombreSubserie: "",
    archivoGestion: null,
    archivoCentral: null,
    disposicionFinal: "",
    reproduccionTecnica: false,
    procedimientos: "",
    estado: null,
    clasificacionSeguridad: "",
    dependenciasAutorizadas: "",
    usuariosAutorizados: "",
    dependenciasSeleccionadas: [],
    usuariosSeleccionados: [],
    metadatosDisponibles: [],
    metadatosAsignados: [],
    nivelSeguridad: "",
  });

  const route = useRoute();
  const router = useRouter();
  const idparam = route.params.id;
  const showModal = ref(false);
  const eliminarModal = ref(false);
  const backModal = ref(false);
  const tieneSubserie = ref("");
  const step = ref(1);
  const selectedDependencia = ref("");
  const selectedUsuario = ref("");
  const selectedMetadato = ref("");
  const asociarMetadatos = ref(false);
  const idSerieSubserie = ref();
  const idSubserie = ref();
  const editarDisposicion = ref(true);
  const isEditing = ref(false);
  const addSubserie = ref(false);
  const showDisposicionFinalError = ref(false);
  const existingSeriesOptions = ref([]);
  const selectedExistingSeries = ref(null);

  let from;
  onMounted(async () => {
    isEditing.value = route.path.includes("editar");
    idSerieSubserie.value = route.params.id;
    if (route.query.subSerie) {
      idSubserie.value = route.query.subSerie;
    }
    from = route.params.from;
    if (isEditing.value) {
      await getData();
    }
    await loadExistingSeries();
  });

  const loadExistingSeries = async () => {
    if (!isEditing.value) {
      try {
        const officeId = route.query.officeId;
        const { data } = await sgdeaArchivoAxios.get(
          `/trd/positiva/series-by-office?officeId=${officeId}`
        );
        existingSeriesOptions.value = data.elementos;
      } catch (error) {
        // toast.error("No se pudieron cargar las series existentes");
      }
    }
  };

  const handleExistingSeriesSelection = (selectedSeries) => {
    if (selectedSeries) {
      selectedExistingSeries.value = selectedSeries;

      addSubserie.value = selectedSeries.containsSubseries !== false;
      if (selectedSeries.containsSubseries === false) {
        toast.warning("Esta serie no permite subseries");
      }
    } else {
      // Resetear valores si no hay selección
      selectedExistingSeries.value = null;
      addSubserie.value = false;
      formData.value.codigoSerie = "";
      formData.value.nombreSerie = "";
    }
  };

  const checkAddSubSerie = () => {
    if (selectedExistingSeries.value?.containsSubseries === false) {
      addSubserie.value = false; // Fuerza el valor si es inválido
      toast.error("Esta serie fue definida como sin subseries");
      return;
    }
    if (!isEditing.value) {
      if (addSubserie.value) {
        formData.value.disposicionFinal = "";
        formData.value.reproduccionTecnica = false;
        formData.value.estado = null;
        formData.value.nivelSeguridad = null;
        formData.value.procedimientos = "";
      } else {
        formData.value.codigoSubserie = "";
        formData.value.nombreSubserie = "";
      }
    }
  };

  const createAsociarMetadatos = async () => {
    asociarMetadatos.value = true;
  };

  const continueStep = () => {
    if (step.value === 3) {
      if (isEditing.value) {
        toast.success("Se ha actualizado la serie o subserie documental");
        router.push("/SGDA/series-subseries");
      } else {
        toast.success("Se ha creado una nueva serie o subserie documental");
        router.push("/SGDA/series-subseries");
      }
    } else {
      step.value++;
    }
  };

  const validityStartDate = ref(new Date().toISOString().split("T")[0]);

  const crearSerieSubserie = async () => {

    // if (addSubserie.value && formData.value.disposicionFinal === "") {
    //   showDisposicionFinalError.value = true;
    //   return;
    // }
    // router.back();
    // const idSerie = ref();

    const bodySerie = {
      description: selectedExistingSeries.value && selectedExistingSeries.value.id ? formData.value.nombreSubserie : formData.value.nombreSerie,
      status: formData.value.estado?.value,
      supportType: 2,
      validityStartDate: validityStartDate.value,
      validityEndDate: "",
      observation: "",
      code: selectedExistingSeries.value && selectedExistingSeries.value.id ? formData.value.codigoSubserie : formData.value.codigoSerie,
      nodeId: "",
      alfrescoId: "",
      procedure: formData.value.procedimientos,
      ct: formData.value.disposicionFinal === "conservacionTotal",
      e: formData.value.disposicionFinal === "eliminacion",
      s: formData.value.disposicionFinal === "seleccion",
      md: formData.value.reproduccionTecnica,
      managementArchiveTime: formData.value.archivoGestion,
      centralArchiveTime: formData.value.archivoCentral,
      securityLevel: formData.value.nivelSeguridad || "",
      containsSubseries: addSubserie.value,
      idFather: selectedExistingSeries.value && selectedExistingSeries.value.id ? selectedExistingSeries.value.id : undefined,
    };
    try {
      const response = await sgdeaArchivoAxios.post(
        `/series/positiva/create?officeId=${route.query.officeId}`,
        bodySerie
      );

      if (
        (response.status === 200 ||
        response.status === 201 ||
        response.status === 204) &&
        addSubserie.value &&
        !selectedExistingSeries.value
      ) {
        const subserieBody = {
          description: formData.value.nombreSubserie,
          status: true,
          supportType: 2,
          validityStartDate: validityStartDate.value,
          validityEndDate: "",
          observation: "",
          code: formData.value.codigoSubserie,
          nodeId: "",
          alfrescoId: "",
          procedure: formData.value.procedimientos,
          ct: formData.value.disposicionFinal === "conservacionTotal",
          e: formData.value.disposicionFinal === "eliminacion",
          s: formData.value.disposicionFinal === "seleccion",
          md: formData.value.reproduccionTecnica,
          managementArchiveTime: formData.value.archivoGestion,
          centralArchiveTime: formData.value.archivoCentral,
          securityLevel: formData.value.nivelSeguridad,
          idFather: response.data.data.id,
          containsSubseries: addSubserie.value,
        };
        await sgdeaArchivoAxios.post(
          `/series/positiva/create?officeId=${route.query.officeId}`,
          subserieBody
        );
      }
      router.push({
        path: `/archivo/clasificacion-documental/gestionar-versiones/detalle/${from}`,
        query: { initial: "SeriesSubseries" },
      });
      toast.success("Registro Exitoso");
    } catch (error) {
      toast.error(
        "Ocurrió un error al actualizar la serie o subserie documental"
      );
    }
    router.back();
  };

  const editarSerieSubserie = async () => {
    if (!formData.value.disposicionFinal) {
      showDisposicionFinalError.value = true;
      return;
    }
    const body = {
      description: addSubserie.value ? formData.value.nombreSubserie : formData.value.nombreSerie,
      status: formData.value.estado.value,
      supportType: 2,
      validityStartDate: validityStartDate.value,
      validityEndDate: "",
      observation: "",
      code: addSubserie.value ? formData.value.codigoSubserie : formData.value.codigoSerie,
      nodeId: "",
      alfrescoId: "",
      procedure: formData.value.procedimientos,
      ct: formData.value.disposicionFinal === "conservacionTotal",
      e: formData.value.disposicionFinal === "eliminacion",
      s: formData.value.disposicionFinal === "seleccion",
      md: formData.value.reproduccionTecnica,
      managementArchiveTime: formData.value.archivoGestion,
      centralArchiveTime: formData.value.archivoCentral,
      securityLevel: formData.value.nivelSeguridad,
      containsSubseries: addSubserie.value,
    };

    try {
      await sgdeaArchivoAxios.patch(
        `/series/positiva/${idSerieSubserie.value}`,
        body
      );
      toast.success(
        "El estado de la serie o subserie documental ha sido actualizado"
      );
      window.history.back();
    } catch (error) {
      toast.error(
        "Ocurrió un error al actualizar la serie o subserie documental"
      );
      window.history.back();
    }
  };

  const onDelete = async () => {
    // try {
    //   const response = await sgdeaArchivoAxios.delete(
    //     `/series/${idSerieSubserie.value}`
    //   );
    //   if (
    //     response.status === 200 ||
    //     response.status === 201 ||
    //     response.status === 204
    //   ) {
    //     toast.success("Se ha eliminado una serie o subserie documental");
    //     router.back();
    //   }
    // } catch (error) {
    //   toast.error(
    //     "Ocurrió un error al eliminar la serie o subserie documental"
    //   );
    // }
  };

  const addDependencia = (dependencia: string) => {
    if (
      dependencia &&
      !formData.value.dependenciasSeleccionadas.includes(dependencia)
    ) {
      formData.value.dependenciasSeleccionadas.push(dependencia);
      selectedDependencia.value = "";
    }
  };

  const removeDependencia = (index: number) => {
    formData.value.dependenciasSeleccionadas.splice(index, 1);
  };

  const addUsuario = (usuario: string) => {
    if (usuario && !formData.value.usuariosSeleccionados.includes(usuario)) {
      formData.value.usuariosSeleccionados.push(usuario);
      selectedUsuario.value = ""; // Limpiar selección
    }
  };

  const removeUsuario = (index: number) => {
    formData.value.usuariosSeleccionados.splice(index, 1);
  };

  const addMetadato = (metadato: string) => {
    if (metadato && !formData.value.metadatosAsignados.includes(metadato)) {
      formData.value.metadatosAsignados.push(metadato);
      formData.value.metadatosDisponibles =
        formData.value.metadatosDisponibles.filter((item) => item !== metadato);
      selectedMetadato.value = ""; // Limpiar selección
    }
  };

  const removeMetadato = (index: number) => {
    const metadato = formData.value.metadatosAsignados.splice(index, 1)[0];
    formData.value.metadatosDisponibles.push(metadato); // Regresar a disponibles
  };

  const validateForm = () => {
    return toast.error("Por favor verifique, datos obligatorios incompletos");
  };

  const getData = async () => {
    try {
      const response = await sgdeaArchivoAxios.get(
        `/series/positiva/${idSerieSubserie.value}`
      );
      if (response.status === 200 || response.status === 201) {
        // 1. Si tiene fatherId y containsSubseries === false, permite editar disposición final
        // 2. Si NO tiene fatherId pero containsSubseries === true, NO permite ver campos de disposición final, solo editar nombre
        // 3. Si NO tiene fatherId y containsSubseries === false, permite ver campos de disposición final y editar
        if (response.data.fatherId && response.data.containsSubseries === false) {
          editarDisposicion.value = true;
        } else if (!response.data.fatherId && response.data.containsSubseries === true) {
          editarDisposicion.value = false;
        } else if (!response.data.fatherId && response.data.containsSubseries === false) {
          editarDisposicion.value = true;
        } else {
          editarDisposicion.value = false;
        }
        formData.value = {
          codigoSerie: response.data.fatherId
            ? response.data.fatherId.code
            : response.data.code,
          nombreSerie: response.data.fatherId
            ? response.data.fatherId.description
            : response.data.description,
          codigoSubserie: response.data.code || "",
          nombreSubserie: response.data.description || "",
          archivoGestion: response.data.managementArchiveTime ?? 2,
          archivoCentral: response.data.centralArchiveTime ?? 2,
          disposicionFinal: response.data.ct
            ? "conservacionTotal"
            : response.data.e
            ? "eliminacion"
            : response.data.s
            ? "seleccion"
            : "seleccion",
          reproduccionTecnica: response.data.md ?? false,
          procedimientos: response.data.procedure ?? "Procedimiento",
          estado: estadosOptions.find(
            (option) => option.value === response.data.status
          ) || { label: "Activo", value: true },
          clasificacionSeguridad: response.data.nivelSeguridad,
          nivelSeguridad: response.data.securityLevel || "",
          // dependenciasAutorizadas: '',
          // usuariosAutorizados: '',
          // dependenciasSeleccionadas: [],
          // usuariosSeleccionados: [],
          // metadatosDisponibles: [],
          // metadatosAsignados: [],
        };

        if (response.data.fatherId) {
          addSubserie.value = true;
        }
      }
    } catch (error) {
      toast.error("Ocurrió un error al obtener la serie o subserie documental");
    }
  };

  const handleModal = () => {
    if (showModal.value) {
      showModal.value = false;
      router.back();
    } else {
      eliminarModal.value = false;
    }
  };

  watch(
    () => formData.value.disposicionFinal,
    (newValue) => {
      if (newValue) {
        showDisposicionFinalError.value = false; // Ocultar mensaje de error
      }
    }
  );

  return {
    formData,
    showModal,
    eliminarModal,
    backModal,
    tieneSubserie,
    route,
    router,
    addSubserie,
    continueStep,
    step,
    isEditing,
    handleModal,
    validateForm,
    onDelete,
    selectedDependencia,
    selectedUsuario,
    selectedMetadato,
    dependenciasDisponibles,
    usuariosDisponibles,
    metadatosDisponibles,
    addDependencia,
    removeDependencia,
    createAsociarMetadatos,
    asociarMetadatos,
    idSerieSubserieValue: route.params.id,
    idSubserie,
    addUsuario,
    removeUsuario,
    addMetadato,
    removeMetadato,
    editarSerieSubserie,
    crearSerieSubserie,
    showDisposicionFinalError,
    existingSeriesOptions,
    selectedExistingSeries,
    loadExistingSeries,
    handleExistingSeriesSelection,
    checkAddSubSerie,
    editarDisposicion,
  };
}
