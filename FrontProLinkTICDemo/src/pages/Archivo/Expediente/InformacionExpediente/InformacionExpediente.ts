import { toast } from "src/helpers/toast";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import moment from "moment";

export const statusOptions = [
  { label: "Activo", value: true },
  { label: "Inactivo", value: false },
];

export const faseOptions = [
  { label: "Gestión", value: "GESTION" },
  { label: "Central", value: "CENTRAL" },
  { label: "Histórico", value: "HISTORICO" },
];
// const metadataInputs = ref<Array<{ id: number; label: string; value: string }>>(
//   []
// );

export const useInformacionExpediente = (
  emit: (event: string, ...args: any[]) => void,
  process: string,
  expediente: any
) => {
  const router = useRouter();
  const route = useRoute();

  const user = ref();
  const formReclasificacion = ref<any>(null);
  const dependencies = ref([]);
  const dependenciesFiltered = ref([]);

  const series = ref([]);
  const seriesFiltered = ref([]);

  const subSeries = ref([]);
  const subSeriesFiltered = ref([]);
  const listadoTiposDocumentales = ref();
  const filteredTiposDocumentales = ref();
  const creating = ref(expediente ? false : true);
  const showApprovalModal = ref(false);
  const files = ref<File[]>([]);

  const showModalSend = ref(false);
  const openSubmitModal = ref(false);

  const closeRecord = ref(false);
  const metadataInputs = ref<
    Array<{ id: number; label: string; value: string }>
  >([]);

  const formData = ref({
    dependency: [],
    series: [],
    subseries: [],
    documentType: [],
    identificationCode: "",
    title: "",
    status: { label: "Activo", value: "ACTIVO" },
    endDate: "",
    startDate: "",
    closeDate: "",
    createDate: new Date().toISOString().split("T")[0],
    responsibleId: "",
    securityLevel: "PUBLICO",
    phaseFile: "GESTION",
    metadata: {},
    tipoDocumental: [],
  });

  const formReclasificar = ref({
    serieReclasificar: null,
    subserieReclasificar: null,
    observacionReclasificar: "",
  });

  const prevStatus = expediente?.estado;

  // const dependency = computed(() => {
  //   const id = formData.value.dependency;
  //   if (!id) return null;
  //   return dependencies.value.find((d) => d.value == id)
  //     ? id
  //     : formData.value.dependency;
  // });

  // const serie = computed(() => {
  //   const id = formData.value.series?.id;
  //   if (!id) return null;
  //   return series.value.find((s) => s.value == id)
  //     ? id
  //     : formData.value.series.description;
  // });

  // const subserie = computed(() => {
  //   const id = formData.value.subseries?.id;
  //   if (!id) return null;
  //   return subSeries.value.find((s) => s.value == id)
  //     ? id
  //     : formData.value.subseries.description;
  // });

  onMounted(async () => {
    await onSetDependencias();
    if (expediente) {
      cargarDatosExpediente(expediente);
      await onSetSeries(formData.value.dependency);
      await onSetSubSeries(formData.value.series);
      await loadTipoDocumental(formData.value.subseries || formData.value.series);
      // await loadMetadata(expediente.series.id, expediente.subseries.id);
    }

    // const id = route.params["id"];
    // if (id && id != "new") {
    //   const {
    //     data: { elementos },
    //   } = await axios.get(
    //     `/archivo/record/filter?expediente_id=${id}`
    //   );
    //   formData.value = elementos.find((item) => item.recordId == id);
    //   creating.value = false;
    // }
  });

  const validateFile = () => {
    if (files.value.length <= 0) {
      toast.error("Por favor adjunte archivo de documento digitalizado");
      return;
    }
    showModalSend.value = true;
  };

  const cargarDatosExpediente = (expediente: any) => {
    formData.value.dependency = expediente.idDependencia;
    formData.value.series = expediente.idSerie;
    formData.value.subseries = expediente.idSubserie;
    formData.value.identificationCode = expediente.codIdentificacion;
    formData.value.title = expediente.titulo;
    formData.value.endDate = expediente.fechaFinal;
    formData.value.startDate = expediente.fechaInicial;
    formData.value.closeDate = expediente.fechaCierre;
    formData.value.phaseFile = expediente.phaseFile;
    formData.value.status = expediente.estado;
    user.value = expediente.responsable;
    formData.value.createDate = moment(expediente.fechaCreacion).format(
      "YYYY-MM-DD"
    );
    formData.value.responsibleId = expediente.idResponsable;
    formData.value.securityLevel = expediente.nivelSeguridad;
    //@ts-ignore
    formData.value.tipoDocumental = {label: expediente.tipoDocumental, value: expediente.idTipoDocumental};
  };

  const validateForm = () => {
    return toast.error(
      "Por favor completa todos los campos obligatorios antes de continuar."
    );
  };

  const onSendFile = async () => {
    showModalSend.value = false;
    const formSend = new FormData();
    // formSend.append("idRecord", formData.value.recordId.toString());
    // formSend.append("subserieId", formData.value.subseries.nodeId);
    // formSend.append("expedienteId", formData.value.nodeId);
    files.value.forEach((file) => {
      formSend.append("file", file);
    });
    try {
      const response = await sgdeaArchivoAxios.post(
        "/record/uploadFile",
        formSend
      );
      toast.success("Se ha incluido el documento en el expediente");
    } catch (e) {
      toast.error("Ha ocurrido un error al procesar su solicitud");
    }
  };

  const rejectedFiles = (rejections: any[]) => {
    rejections.forEach((rejection) => {
      console.error(`Archivo rechazado: ${rejection.file.name}`);
      console.error(`Razón: ${rejection.errors.join(", ")}`);
    });
  };

  const onSetDependencias = async () => {
    const { data } = await sgdeaAxios.get(`/seccionSubSeccion`);

    dependencies.value = dependenciesFiltered.value = data.map((item) => ({
      label: item.nombre,
      value: item.idSeccionSubSeccion,
    }));
  };

  const onFilterDependencies = (value, update) => {
    update(async () => {
      if (!value || value.trim() == "") {
        dependenciesFiltered.value = dependencies.value;
        formData.value.subseries = formData.value.series = null;
        return;
      }
      dependenciesFiltered.value = dependencies.value.filter((d) =>
        d.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const onSetSeries = async (value) => {
    formData.value.dependency = value;
    if (!formData.value.dependency) {
      series.value = seriesFiltered.value = [];
      formData.value.series = formData.value.subseries = null;
      return;
    }
    const responseSeries = await sgdeaAxios.get(`serie/buscarSerie`, {
      params: {
        idSeriesubserie: null,
        descripcion: null,
        estado: true,
        codigo: null,
        seccionSubSeccion: value,
        padre: null,
      },
    });
    series.value = seriesFiltered.value = responseSeries.data.map((item) => ({
      label: item.descripcion,
      value: item.idSeriesubserie,
    }));
  };

  const onFilterSeries = (value, update) => {
    update(() => {
      if (!value || value.trim() == "") {
        seriesFiltered.value = series.value;
        formData.value.subseries = null;
        return;
      }
      seriesFiltered.value = series.value.filter((s) =>
        s.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const onSetSubSeries = async (value) => {
    const responseSubSeries = await sgdeaAxios.get(`serie/buscarSub`, {
      params: {
        idSeriesubserie: null,
        descripcion: null,
        estado: true,
        codigo: null,
        seccionSubSeccion: null,
        padre: value,
      },
    });

    if (responseSubSeries.data.length > 0) {
      subSeries.value = subSeriesFiltered.value = responseSubSeries.data.map(
        (item) => ({
          label: item.descripcion,
          value: item.idSeriesubserie,
        })
      );
    } else {
      subSeries.value = undefined;
    }

    // if (value) {
    //   loadMetadata(value);
    // } else {
    //   metadataInputs.value = [];
    //   formData.value.metadata = {};
    // }

    // Limpiar metadatos cuando cambia la serie
    metadataInputs.value = [];
    formData.value.metadata = {};
  };

  watch(
  () => formData.value.series,
  async (newValue) => {
    if (newValue) {
        await loadTipoDocumental(newValue);
    }
  }
);

  watch(
    () => formData.value.subseries,
    (newValue) => {
      if (newValue) {
        loadTipoDocumental(newValue);
      }
    }
  );

  const loadTipoDocumental = async (id) => {
  try {
    const response = await sgdeaAxios.get(
      `tiposdocumentales/asignacion/serie/tipos_documentales`,
      {
        params: { serie: id },
      }
    );

    listadoTiposDocumentales.value =
      response.data.tiposDocumentalesAsociados.map((e) => {
        let item = e.tipologiaDocumental;
        return {
          label: item.nombre,
          value: item.idTipologiaDocumental,
        };
      });
  } catch (error) {
    console.error(error);
    listadoTiposDocumentales.value = [];
  }
};

const filterTiposDocumental = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredTiposDocumentales.value = listadoTiposDocumentales.value;
    });
    return;
  }
  update(() => {
    filteredTiposDocumentales.value = listadoTiposDocumentales.value.filter(
      (option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      }
    );
  });
};

  // const loadMetadata = async (serieId: number, subSerieId?: number) => {
  //   const request = subSerieId
  //     ? `/record/metadatos?serieId=${serieId}&subserieId=${subSerieId}`
  //     : `/record/metadatos?serieId=${serieId}`;

  //   try {
  //     const response = await axios.get(request);
  //     metadataInputs.value = response.data.map((item) => ({
  //       id: item.metadatoId,
  //       label: item.nombre,
  //       value: item.valor || "",
  //     }));

  //     // Inicializar los valores en formData
  //     formData.value.metadata = {};
  //     response.data.forEach((item) => {
  //       formData.value.metadata[item.metadatoId] = item.valor || "";
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     metadataInputs.value = [];
  //     formData.value.metadata = {};
  //   }
  // };

  const onSetSubserieValue = (value) => {
    // formData.value.subseries = { id: value };
  };

  const onFilterSubSeries = (value, update) => {
    update(() => {
      if (!value || value.trim() == "") {
        subSeriesFiltered.value = subSeries.value;
        return;
      }
      subSeriesFiltered.value = subSeriesFiltered.value.filter((s) =>
        s.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const handleTransfer = () => {
    showApprovalModal.value = true;
  };

  const cancelApproval = () => {
    showApprovalModal.value = false;
    formReclasificar.value = {
      serieReclasificar: null,
      subserieReclasificar: null,
      observacionReclasificar: "",
    };
  };

  const onSubmit = async () => {
    const body = {
      id: expediente?.id,
      dependencia: formData.value.dependency,
      serie: formData.value.series,
      subserie: formData.value.subseries,
      //@ts-ignore
      tipoDocumental: formData.value.tipoDocumental?.value,
      codIdentificacion: formData.value.identificationCode,
      responsable: expediente?.idResponsable,
      observaciones: "",
      titulo: expediente?.titulo,
      nivelSeguridad: formData.value.securityLevel,
      creacion: false,
      nodeIdExp: expediente?.nodeId,
      modulo: 11,
      radicado: "",
      phaseFile: formData.value.phaseFile,
      fechaInicial: formData.value.startDate,
      fechaFinal: formData.value.endDate,
      estado: formData.value.status?.value || formData.value.status,
    };
    try {
      showModalSend.value = false;

      // 1. Primero creamos el expediente
      const response = await sgdeaArchivoAxios.post(
        "/record/newpdate", body
      );

      if (response.status == 200 || response.status == 201) {
        // const serieId = formData.value.series?.id;
``
        // 2. Preparamos los metadatos para enviar EXACTAMENTE lo que el usuario escribió
        if (
          formData.value.metadata &&
          Object.keys(formData.value.metadata).length > 0
        ) {
          const metadatosPayload = Object.entries(formData.value.metadata).map(
            ([id, valor]) => ({
              metadatoId: Number(id),
              valor: valor, // Enviamos el valor tal cual, sin transformación
            })
          );

          // const body = {
          //   metadatos: metadatosPayload,
          //   serieId: Number(formData.value.series.id),
          //   subserieId: Number(formData.value.subseries.id),
          // };

          // await .post(
          //   `/record/metadatos`,
          //   body
          // );
        }

        toast.success("Expediente creado y metadatos guardados correctamente")
        router.go(0);
      }

      // ... (código de logs existente)
    } catch (error) {
      toast.error(
        "Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente"
      );
    }
  };

  const onChangeForm = () => {
    emit("onChangeForm");
    // toast.success("Cancelacion exitosa");
    // router.push("/expediente");
  };

  const onCloseRecord = async () => {
    try {
      const { data } = await sgdeaArchivoAxios.post(
        `/record/close-record/${expediente.recordId}?username=${user.value.username}?closeDate=${formData.value.closeDate}`
      );
      toast.success("Expediente cerrado exitosamente");
      router.push("/expediente");
    } catch (error) {
      toast.error("Error al cerrar expediente");
    } finally {
      openSubmitModal.value = false;
    }
  };

  const cancelar = () => {
    openSubmitModal.value = false;
    toast.success("Cancelacion exitosa");
  };

  const clear = (values: string[]) => {
    values.forEach((item) => {
      formData.value[item] = null;
    });
  };

  const reclasificarExpediente = async () => {
    const isValidateReclasificacion =
      await formReclasificacion.value.validate();
    if (!isValidateReclasificacion) {
      toast.error("La justificación es obligatoria");
      return;
    }

    try {
      // if (form.value.clasificacionSeguridad === "PRIVADO") {
      //   form.value.clasificacionSeguridad = "CONFIDENCIAL";
      // }
      const payload = {
        // securityLevel: form.value.clasificacionSeguridad,
        // expedientCode: form.value.codigoExpediente,
        // justification: observacionModal.value,
        // username: auth.userInfo.name,
      };

      await sgdeaArchivoAxios.post(
        "archivo/expediente/seguridad/reclasificar-expediente",
        payload
      );

      toast.success("Expediente reclasificado correctamente");
      showApprovalModal.value = false;
      // fetchInitialData();
    } catch (error) {
      toast.error("Ocurrió un error al reclasificar el expediente");
    }
    // finally {
    //   // loading.value = false;
    // }
  };

  return {
    dependenciesFiltered,
    seriesFiltered,
    subSeriesFiltered,
    formData,
    user,
    creating,
    router,
    files,
    showModalSend,
    openSubmitModal,
    closeRecord,
    prevStatus,
    // dependency,
    // serie,
    // subserie,
    onFilterDependencies,
    onFilterSeries,
    onFilterSubSeries,
    onSetDependencias,
    onSetSeries,
    onSetSubSeries,
    onSubmit,
    onSendFile,
    onChangeForm,
    rejectedFiles,
    validateFile,
    validateForm,
    cancelar,
    onCloseRecord,
    clear,
    onSetSubserieValue,
    metadataInputs,
    handleTransfer,
    showApprovalModal,
    cancelApproval,
    formReclasificar,
    formReclasificacion,
    reclasificarExpediente,
    listadoTiposDocumentales,
    filteredTiposDocumentales,
    filterTiposDocumental,
  };
};
