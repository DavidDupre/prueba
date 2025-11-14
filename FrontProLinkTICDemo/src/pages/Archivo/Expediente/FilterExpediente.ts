import { onMounted, ref } from "vue";
import { toast } from "src/helpers/toast";
import { Ref } from "vue";
import { useRouter } from "vue-router";
import { FormDataExpediente } from "src/interfaces/Expediente";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";

export type ProcessType = "radicado" | "referenciar" | "reclasificar";
interface formDataFilter {
  dependencia: number;
  serieId: number;
  subserieId: number;
  title: string;
  status: string;
  fase: string;
  responsibleId: string;
  startDate: string;
  endDate: string;
  contrato: string;
  proveedor: string;
  Objeto: string;
  vigencia: string;
  tipodecontrato: string;
}

export const useFilterExpediente = (
  emit: (event: string, ...args: any[]) => void,
  process: ProcessType,
  expediente: FormDataExpediente
) => {
  var router = useRouter();

  var url = ref("/record/positiva/listar");

  const dependencies = ref([]);
  const dependenciesFiltered = ref([]);

  const series = ref([]);
  const seriesFiltered = ref([]);

  const subSeries = ref([]);
  const subSeriesFiltered = ref([]);

  const users = ref([]);
  const usersFiltered = ref([]);

  // const metadatos = ref([
  //   { label: "Número de Contrato", type: "text" },
  //   { label: "Proveedor", type: "text" },
  //   { label: "Proveedor", type: "text" },
  //   { label: "Vigencia", type: "text" },
  //   { label: "Tipo de contrato", type: "text" },
  // ]);

  const showTable = ref(false);
  // const expedienteSelected: Ref<FormDataExpediente> = ref(expediente);

  const mensajeTabla = 'Expediente no existe.  Es necesario crear el expediente para continuar'

  const formDataFilter: Ref<formDataFilter> = ref({
    dependencia: null,
    serieId: null,
    subserieId: null,
    title: "",
    status: "",
    fase: "",
    responsibleId: "",
    startDate: "",
    endDate: "",
    contrato: "",
    proveedor: "",
    Objeto: "",
    vigencia: "",
    tipodecontrato: "",
  });

  const columns: Column[] = [
    {
      field: "id",
      header: "#",
      type: "string",
      sort: true,
    },
    {
      field: "dependencia",
      header: "Dependencia",
      type: "string",
      tooltip: "Dependencia del Expediente",
      replaceValue: (value) => (value ? value : "N/A"),
      sort: true,
    },
    {
      field: "serie",
      header: "Serie",
      type: "string",
      tooltip: "Serie del radicado",
      replaceValue: (value) => (value ? value : "N/A"),
      sort: true,
    },
    {
      field: "subserie",
      header: "Subserie",
      type: "string",
      tooltip: "Subserie del radicado",
      replaceValue: (value) => (value ? value : "N/A"),
      sort: true,
    },
    {
      field: "titulo",
      header: "Expediente",
      type: "string",
      sort: true,
    },
    {
      field: "startDate",
      header: "Fecha Inicial",
      type: "date",
      replaceValue: (value: any) => {
        if (!value) return "N/A";
        const date = new Date(value);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      },
      sort: true,
    },
    {
      field: "endDate",
      header: "Fecha Final",
      type: "date",
      replaceValue: (value: any) => {
        if (!value) return "N/A";
        const date = new Date(value);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      },
      sort: true,
    },
    {
      field: "phaseFile",
      header: "Fase de Archivo",
      type: "string",
      sort: true,
    },
    {
      field: "status",
      header: "Estado",
      type: "string",
      tooltip: "detalle",
      name: "status",
      sort: true,
    },
    {
      field: "action",
      header: "Selección",
      type: "string",
      format: "uppercase",
      classCss: "text-right",
      name: "actions",
      actions: [
        {
          icon: "edit",
          eventbtn: (rowData: any) => {
            router.push(`/archivo/expediente/detalle?titulo=${rowData.titulo}`);
          },
          name: "edit",
          color: "primary",
        },
        ...(process
          ? [
              {
                icon: "circle-check",
                eventbtn: (rowData: any) => {
                  expediente = rowData;
                  emit("onSelectExpediente", expediente);
                  toast.success("Expediente Seleccionado");
                },
                name: "select",
                color: "primary",
              },
            ]
          : []),
      ],
    },
  ];

  onMounted(() => {
    setDependencias();
    setUsers();
  });

const onFilter = async () => {
  try {
    const params = new URLSearchParams();

    const paramMapping = {
      dependencia: 'dependenciaId',
      serieId: 'serieId',
      subserieId: 'subserieId',
      title: 'titulo',
      status: 'estado',
      fase: 'fase',
      responsibleId: 'responsableId',
      startDate: 'startDate',
      endDate: 'endDate',
      contrato: 'contrato',
      proveedor: 'proveedor',
      Objeto: 'Objeto',
      vigencia: 'vigencia',
      tipodecontrato: 'tipodecontrato'
    };

    Object.entries(formDataFilter.value).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        const apiParamName = paramMapping[key] || key;

        if (key === 'status') {
          const booleanValue = value === true || value === 'true' || value === '1' || value === 1;
          params.append(apiParamName, String(booleanValue));
        } else {
          params.append(apiParamName, String(value));
        }
      }
    });

    url.value = `/record/positiva/listar?${params.toString()}`;

    showTable.value = true;

  } catch (error) {
    toast.error(
      "Error al filtrar expedientes. Por favor, intente nuevamente."
    );
  }
};
  const toggleTable = () => {
    emit("onSelectExpediente", null);
    // expedienteSelected.value = null;
    // showTable.value = !showTable.value;
  };

  const onChangeForm = () => {
    emit("onChangeForm");
  };

  const validateForm = () => {
    return toast.error(
      "Por favor completa todos los campos obligatorios antes de continuar."
    );
  };

  const setDependencias = async () => {
    // const { data } = await axios.get("https://gcpsgdea.positivasgdea.com/seccionSubSeccion");

    // const transformedData = data.map((item) => ({
    //   label: item.nombre,
    //   value: item.id,
    // }));
      const response = await sgdeaAxios.get(`/seccionSubSeccion`)
   const  transformedData = response.data.map((e) => {
      return {
        label: e.nombre,
        value: e.idSeccionSubSeccion
      }
    })

    dependencies.value = transformedData;
    dependenciesFiltered.value = transformedData;
  };

  const onFilterDependencies = (value, update) => {
    update(async () => {
      if (!value || value.trim() == "") {
        dependenciesFiltered.value = dependencies.value;
        formDataFilter.value.subserieId = formDataFilter.value.serieId = null;
        return;
      }
      dependenciesFiltered.value = dependencies.value.filter((d) =>
        d.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const onSetSeries = async () => {
    if (!formDataFilter.value.dependencia) {
      series.value = seriesFiltered.value = [];
      formDataFilter.value.serieId = formDataFilter.value.subserieId = null;
      return;
    }
    const { data } = await sgdeaArchivoAxios.get(
      `/trd/subseries/office/${formDataFilter.value.dependencia}`
    );
    const transformedData = data.map((item) => ({
      label: item.description,
      value: item.id,
    }));

    series.value = seriesFiltered.value = transformedData;
  };

  const onFilterSeries = (value, update) => {
    update(() => {
      if (!value || value.trim() == "") {
        seriesFiltered.value = series.value;
        formDataFilter.value.subserieId = null;
        return;
      }
      seriesFiltered.value = series.value.filter((s) =>
        s.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const onSetSubSeries = async () => {
    if (!formDataFilter.value.dependencia) {
      subSeries.value = subSeriesFiltered.value = [];
      formDataFilter.value.subserieId = null;
      return;
    }
    const { data } = await sgdeaArchivoAxios.get(
      `/trd/subseries/${formDataFilter.value.serieId}`
    );

    const transformedData = data.map((item) => ({
      label: item.description,
     // value: item.id,
     value: item.series_subseries_id,
    }));
    subSeries.value = subSeriesFiltered.value = transformedData;
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

  const onFilterUsers = (value, update) => {
    update(() => {
      if (!value || value.trim() == "") {
        usersFiltered.value = users.value;
        return;
      }
      value = value.toLowerCase();
      usersFiltered.value = users.value.filter(
        (u) =>
          u.label?.toLowerCase().includes(value) ||
          u.email?.toLowerCase().includes(value) ||
          u.username?.toLowerCase().includes(value)
      );
    });
  };

  const setUsers = async () => {
    // try {
    //   const { data } = await .get(
    //     `https/seguridad/auth/users`
    //   );
    //   users.value = data.map((item) => ({
    //     label: `${item.firstName} ${item.lastName}`,
    //     value: item.id,
    //     email: item.email,
    //     username: item.username,
    //   }));
    // } catch (error) {
    //   toast.error(
    //     "Ha ocurrido un error al procesar su solicitud, inténtelo nuevamente"
    //   );
    // }
  };

  return {
    columns,
    url,
    showTable,
    formDataFilter,
    dependenciesFiltered,
    seriesFiltered,
    subSeriesFiltered,
    router,
    usersFiltered,
    onFilter,
    onFilterSeries,
    onFilterSubSeries,
    onFilterDependencies,
    onFilterUsers,
    onSetSeries,
    onSetSubSeries,
    validateForm,
    toggleTable,
    onChangeForm,
    mensajeTabla
    // metadatos,
  };
};
