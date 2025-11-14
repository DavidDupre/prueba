import { onMounted, Ref, ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import { sgdeaArchivoAxios } from "src/services";
import { toast } from "src/helpers/toast";

export function useFormLogic() {
  const router = useRouter();
  const route = useRoute();
  const tableKey = ref(0);
  const isFilterVisible = ref(false);
  const documentTypeCodeFilter = ref("");
  const documentTypeNameFilter = ref("");
  const statusFilter = ref("");
  const dependencia = ref();
  const serie = ref();
  const selectedTipology = ref();
  const openSubmitModal = ref(false);
  const showAsignarModal = ref(false);
  const columns: Column[] = [
    {
      field: "id",
      header: "#",
      type: "string",
    },
    {
      field: "name",
      header: "Nombre del Tipo Documental",
      type: "string",
      format: "uppercase",
      classCss: "text-right",
      replaceValue: (value) => value || "-",
    },
    {
      field: "shortName",
      header: "Nombre Corto",
      type: "string",
      replaceValue: (value) => value || "-",
    },
    {
      field: "documentTypologyCode",
      header: "Código documento calidad",
      type: "string",
      replaceValue: (value) => value || "-",
    },
    /*{
      field: "description",
      header: "Descripción",
      type: "string",
      replaceValue: (value) => value || "-",
    },*/
    {
      //field: ({ status }) => (status ? "Activo" : "Inactivos"),
      header: "Estado",
      type: "string",
      field: "status",
      replaceValue: (value) => (value ? "Activo" : "Inactivo"),
    },
    {
      field: "action",
      header: "Acciones",
      type: "string",
      format: "uppercase",
      classCss: "text-right",
      width: "50px",
      name: "actions",
      actions: [
        {
          icon: "edit",
          eventbtn: (row: any) => {
            router.push(
              `/clasificacion-documental/tipo-documental/editar/${row.id}?versionTrd=${route.params.id}`
            );
          },
          name: "edit",
          color: "primary",
        },
        //    {
        //   icon: "eye",
        //   eventbtn: (row: any) => {
        //     router.push(
        //       `/clasificacion-documental/gestionar-versiones/detalle-tipo-documental/${row.documentTypologyCode}`
        //     );
        //   },
        //   name: "detalle",
        //   color: "primary",
        // },
      ],
    },
  ];

  onMounted(() => {
    // getSeriesSubseries();
    getDependencias();
  });

  const selectedSeriesSubseries = ref([]);

  const actionFilter = () => {
    isFilterVisible.value = !isFilterVisible.value;
  };

  const selectTipo = (tipology: any) => {
    selectedTipology.value = tipology;
  };

  const resetForm = () => {
    documentTypeNameFilter.value = "";
    statusFilter.value = "";
    url.value = `/documentType/positiva/all?trdId=${route.params.id}`;
    tableKey.value += 1;
    isFilterVisible.value = false;
  };

  const optionsEstados = [
    { label: "Activo", value: true },
    { label: "Inactivo", value: false },
  ];

  const url = ref(`/documentType/positiva/all?trdId=${route.params.id}`);
  // const filters: Ref<IFilters> = ref({
  //   // codigoTipologiaDocumental: "",
  //   nombre: "",
  //   estado: null,
  // });

  const onFilterTable = () => {
    const params = new URLSearchParams();

    if (documentTypeNameFilter.value) {
      params.append("name", documentTypeNameFilter.value);
    }
    if (statusFilter.value !== "") {
      params.append("status", String(statusFilter.value));
    }

    url.value = `/documentType/positiva/all?trdId=${
      route.params.id
    }&${params.toString()}`;
    tableKey.value += 1;
  };

  const listaSeriesSubseries = ref([]);
  const listaSeries = ref([]);
  const listaSubseries = ref([]);
  const seriesFiltered = ref([]);
  const subseriesFiltered = ref([]);
  const listDependencias = ref([]);
  const filterDependencias = ref([]);

  const getDependencias = async () => {
    try {
      const response = await sgdeaArchivoAxios.get(
        `/Office/positiva/all-by-version?versionId=68&pageNo=0&pageSize=100000`
      );
      listDependencias.value = response.data.elementos.map((item: any) => ({
        value: item.idSeccionSubSeccion,
        label: item.nombre,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const filterDependenciasByName = (value, update) => {
    update(() => {
      if (!value || value.trim() === "") {
        filterDependencias.value = listDependencias.value;
        return;
      }
      filterDependencias.value = listDependencias.value.filter((d: any) =>
        d.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const getSeriesSubseries = async (dependencia) => {
    if (dependencia) {
      try {
        const response = await sgdeaArchivoAxios.get(
          `/trd/positiva/series-subseries-by-office?trdId=${route.params.id}&officeId=${dependencia}&pageNo=&pageSize=10000`
        );
        listaSeriesSubseries.value = response.data.elementos;

        listaSeries.value = listaSeriesSubseries.value.filter(
          (serie: any) => !serie.fatherId
        ).map((serie: any) => ({
          value: serie.id,
          label: `${serie.code} - ${serie.description}`,
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onFilterSeries = (value, update) => {
    update(() => {
      if (!value || value.trim() === "") {
        seriesFiltered.value = listaSeries.value;
        return;
      }
      seriesFiltered.value = listaSeries.value.filter((s: any) =>
        s.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const onFilterSubseries = (value, update) => {
    update(() => {
      if (!value || value.trim() === "") {
        subseriesFiltered.value = listaSubseries.value;
        return;
      }
      subseriesFiltered.value = listaSubseries.value.filter((s: any) =>
        s.label.toLowerCase().includes(value.toLowerCase())
      );
    });
  };

  const asignarTipoDocumental = () => {
    const params = new URLSearchParams();

    selectedSeriesSubseries.value.forEach((item: any) => {
      params.append("serieSubserieId", item.value);
    });

    selectedTipology.value.forEach((item: any) => {
      params.append("tipologiaId", item.id);
    });

    try {
      const response = sgdeaArchivoAxios.post(
        `/documentType/positiva/relations`,
        params
      );
      showAsignarModal.value = false;
      openSubmitModal.value = false;
      tableKey.value += 1;
      selectedSeriesSubseries.value = [];
      selectedTipology.value = [];
      toast.success("Tipo documental asignado exitosamente");
    } catch (error) {
      console.error(error);
    }
  };

  watch(
    () => dependencia.value,
    (newId) => {
      getSeriesSubseries(newId);
    },
    { immediate: true }
  );

  watch(
    () => serie.value,
    (newValue) => {
      if (newValue) {
        listaSubseries.value = listaSeriesSubseries.value.filter(
          (subserie: any) => subserie.fatherId && subserie.fatherId.id === newValue.value
        ).map((subserie: any) => ({
          value: subserie.id,
          label: `${subserie.code} - ${subserie.description}`,
        }));

        if(listaSubseries.value.length == 0) {
          selectedSeriesSubseries.value.push(newValue);
        }
      }
    },
    { immediate: true }
  );

  return {
    columns,
    url,
    router,
    // filters,
    selectedTipology,
    selectTipo,
    optionsEstados,
    onFilterTable,
    actionFilter,
    resetForm,
    tableKey,
    isFilterVisible,
    documentTypeCodeFilter,
    documentTypeNameFilter,
    statusFilter,
    selectedSeriesSubseries,
    showAsignarModal,
    seriesFiltered,
    onFilterSeries,
    asignarTipoDocumental,
    openSubmitModal,
    filterDependenciasByName,
    filterDependencias,
    dependencia,
    serie,
    onFilterSubseries,
    subseriesFiltered
  };
}
