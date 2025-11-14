import { toast } from "src/helpers/toast";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, Ref, ref } from "vue";
import { cleanObject } from "src/helpers/object";
import axios from "axios";

export interface TRDFormData {
  versionName: string;
  instrumentType: string;
  startDate: string;
  endDate: string;
  approvalDate: string;
  approvalAct: string;
  adoptionDate: string;
  adoptionAct: string;
  status: string;
}

export function useTRDForm() {
  // Define the form data state
  const formData = ref<TRDFormData>({
    versionName: "",
    instrumentType: "",
    startDate: "",
    endDate: "",
    approvalDate: "",
    approvalAct: "",
    adoptionDate: "",
    adoptionAct: "",
    status: "Borrador",
  });

  const formTRD = ref();

  const tipoInstrumentoOptions = ref([
    "Tabla de Retención Documental",
    "Tabla de Valoración Documental",
  ]);

  // Options for Estado
  const estadoOptions = ref(["Activa", "Inactiva", "Borrador"]);

  const route = useRoute();
  const router = useRouter();

  const isEditing = ref(
    route.path.includes("editar") || route.path.includes("detalle")
  );
  const formEditing = ref(false);
  const prevStatus: Ref<string> = ref();

  onMounted(async () => {
    if (isEditing.value) {
      await getData(route.params.id);
    }
  });

  const goBack = () => {
    router.back();
  };

  const submitForm = async () => {
    const isValid = await formTRD.value?.validate();

    if (!isValid) {
      toast.error("Por favor completa los campos obligatorios.");
      return;
    }

    if (formData.value.status.toLowerCase() === "inactiva" && !formData.value.endDate) {
      toast.error("La Fecha Final de Aplicación es obligatoria para el estado Inactiva.");
      return;
    }

    const body = {
      //@ts-ignore
      instrumentType: formData.value.instrumentType,
      versionName: formData.value.versionName ?? "",
      startDate: formData.value.startDate ?? "",
      endDate: formData.value.endDate ?? "",
      adoptionDate: formData.value.adoptionDate ?? "",
      adoptionAct: formData.value.adoptionAct ?? "",
      approvalDate: formData.value.approvalDate ?? "",
      approvalAct: formData.value.approvalAct ?? "",
      status: formData.value.status.toUpperCase(),
    };
    try {
      const { data } = await sgdeaArchivoAxios.get(
        `/trd/positiva/version/draft?status=BORRADOR`
      );

      if (data?.length > 0) {
        toast.error("Ya existe un borrador de Tabla de Retención Documental");
        return;
      }

      const response = await sgdeaArchivoAxios.post(`/trd/positiva/version`, body);
      if (
        response.status === 201 ||
        response.status === 202 ||
        response.status === 200
      ) {
        toast.success(
          "Se ha creado una nueva versión de Tabla de Retención Documental"
        );
        router.push("/archivo/clasificacion-documental/gestionar-versiones/");
      }
    } catch (error) {
      toast.error(
        "Ocurrió un error al crear la versión de TRD." +
        (error.status == 409 ? " El nombre de la versión ya existe." : "")
      );
    }
  };

  const onUpdate = async () => {
    try {
      const payload = cleanObject(formData.value);

      if (payload.status) payload.status = payload.status.toUpperCase();
      if (payload.status == "ACTIVA") {
        const { data } = await sgdeaArchivoAxios.get(
          `/trd/positiva/version/draft?status=ACTIVA`
        );
        if (
          data &&
          data.length > 0 &&
          !data.find((s) => s.id == route.params.id)
        ) {
          toast.error("Ya existe una Tabla de Retención Documental activa");
          return;
        }
      }

      const response = await sgdeaArchivoAxios.patch(
        `/trd/positiva/version/update/${route.params.id}`,
        payload
      );
      if (
        response.status === 201 ||
        response.status === 200 ||
        response.status === 202
      ) {
        toast.success(
          "Se ha actualizado la versión de la Tabla de Retención Documental"
        );
        router.push("/archivo/clasificacion-documental/gestionar-versiones/");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente");
    }
  };

  const getData = async (id) => {
    try {
      const response = await sgdeaArchivoAxios.get(`/trd/positiva/version/${id}`);
      if (response.status === 200 || response.status === 201) {
        formData.value.versionName = response.data.versionName;
        formData.value.instrumentType = response.data.instrumentType;
        formData.value.startDate = response.data.startDate;
        formData.value.endDate = response.data.endDate;
        formData.value.approvalDate = response.data.approvalDate;
        formData.value.approvalAct = response.data.approvalAct;
        formData.value.adoptionDate = response.data.adoptionDate;
        formData.value.adoptionAct = response.data.adoptionAct;
        formData.value.status =
          estadoOptions.value.find(
            (o) => o.toUpperCase() == response.data.status
          ) || "";
      }
      switch (formData.value.status) {
        case "Borrador":
          estadoOptions.value = ["Borrador", "Activa"];
          break;
        case "Activo":
          estadoOptions.value = ["Activa", "Inactiva"];
          break;
        default:
          estadoOptions.value = ["Inactiva"];
          break;
      }
      prevStatus.value = formData.value.status.toUpperCase();
    } catch (error) {
      toast.error("Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente");
    }
  };

  const actualizarVersion = async () => {
    try {
      const response = await sgdeaArchivoAxios.patch(
        `/trd/positiva/version/update/${route.params.id}`,
        { status: formData.value.status.toUpperCase() }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        toast.success(
          "Se ha actualizado el estado de la versión de Tabla de Retención Documental"
        );
        router.push("/archivo/clasificacion-documental/gestionar-versiones/");
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente");
    }
  };

  const eliminarVersion = async () => {
    try {
      // const { data: expedientes } = await sgdeaArchivoAxios.get(
      //   `/trd/positiva/version/${route.params.id}/count-expedientes`
      // );
      // if (expedientes > 0) {
      //   toast.error(
      //     "No se puede eliminar la TRD porque tiene expedientes abiertos."
      //   );
      //   return;
      // }
      const response = await sgdeaArchivoAxios.patch(
        `/trd/positiva/version/update/${route.params.id}`,
        { status: "ELIMINADO" }
      );
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        router.push("/archivo/clasificacion-documental/gestionar-versiones/");
        toast.success(
          "Se ha eliminado una versión de Tabla de Retención Documental"
        );
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente");
    }
  };

  const fechaMinimaAdopcion = computed(() => {
    if (formData.value.startDate && formData.value.approvalDate) {
      return formData.value.approvalDate > formData.value.startDate
        ? formData.value.approvalDate
        : formData.value.startDate;
    }
    return formData.value.approvalDate || formData.value.startDate;
  });

  const fechaMaximaAprobacion = computed(() => {
    if (formData.value.endDate && formData.value.adoptionDate) {
      return formData.value.endDate > formData.value.adoptionDate
        ? formData.value.endDate
        : formData.value.adoptionDate;
    }
    return formData.value.adoptionDate || formData.value.endDate;
  });

  return {
    formData,
    tipoInstrumentoOptions,
    estadoOptions,
    prevStatus,
    isEditing,
    fechaMinimaAdopcion,
    fechaMaximaAprobacion,
    submitForm,
    formTRD,
    goBack,
    actualizarVersion,
    eliminarVersion,
    onUpdate,
  };
}
