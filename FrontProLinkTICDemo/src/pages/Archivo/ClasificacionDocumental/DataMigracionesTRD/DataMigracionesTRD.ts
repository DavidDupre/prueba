import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { sgdeaArchivoAxios } from "src/services";

export const useDataMigracionesTRD = () => {
  const isFilterVisible = ref(false);
  const actionFilter = () => {
    isFilterVisible.value = !isFilterVisible.value;
  };

  const route = useRoute();
  const allOfficesOptions = ref([]);
  const serieOptions = ref([]);
  const typeDocumentsOptions = ref([]);

  const codeInput = ref("");
  const nameInput = ref("");
  const statusInput = ref("");

  const allOfices = async () => {
    try {
      const response = await sgdeaArchivoAxios.get(
        "/trd/offices"
      );
      allOfficesOptions.value = response.data;
    } catch (error) {
      console.error(error);
      allOfficesOptions.value = [];
    }
  };

  const seriesSubserie = async (officeId) => {
    try {
      const response = await sgdeaArchivoAxios.get(
        `/trd/subseries/${officeId}`
      );
      serieOptions.value = response.data;
    } catch (error) {
      console.error(error);
      serieOptions.value = [];
    }
  };

  const typeDocuments = async () => {
    try {
      const response = await sgdeaArchivoAxios.get(
        "/documentType/simple-list"
      );
      const options = response.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      typeDocumentsOptions.value = options;
    } catch (error) {
      console.error(error);
      typeDocumentsOptions.value = [];
    }
  };

  const url = ref(`/trd/positiva/data/version/${route.params["id"]}`);

  const fetchData = () => {
    const params = new URLSearchParams();

    if (codeInput.value) params.append("officeId", codeInput.value);
    if (nameInput.value) params.append("serieId", nameInput.value);
    if (statusInput.value) params.append("documentTypeId", statusInput.value);

    url.value = `/trd/positiva/data/version/${
      route.params["id"]
    }?${params.toString()}`;
  };

  const columns: Column[] = [
    {
      field: "codigoOficina",
      type: "string",
      header: "Código de la Oficina Productora",
      replaceValue: (value) => value || "-",
    },
    {
      field: "codigoSerie",
      type: "string",
      header: "Código Serie",
      replaceValue: (value) => (value ? value.split(".").pop() : "-"),
    },
    {
      field: "codigoSubSerie",
      type: "string",
      header: "Código Subserie",
      replaceValue: (value) => {
        if (!value) return "-";
        const firstDot = value.indexOf(".");
        return firstDot !== -1 ? value.substring(firstDot + 1) : value;
      },
    },
    {
      field: "nombreOficina",
      type: "string",
      header: "Nombre de la Oficina Productora",
      replaceValue: (value) => value || "-",
    },
    {
      field: "nombreSerie",
      type: "string",
      header: "Serie",
      replaceValue: (value) => value || "-",
    },
    {
      field: "nombreSubSerie",
      type: "string",
      header: "Subserie",
      replaceValue: (value) => value || "-",
    },
    {
      field: "tipoDocumental",
      type: "string",
      header: "Tipo Documental",
      replaceValue: (value) => value || "-",
    },
    {
      field: "tipoDocumental",
      type: "string",
      header: "Proceso",
      replaceValue: (value) => "N.A.",
    },
    {
      field: "tipoDocumental",
      type: "string",
      header: "Procedimiento",
      replaceValue: (value) => "N.A.",
    },
    {
      field: "archivoGestion",
      type: "string",
      header: "Gestión",
      replaceValue: (value) => value || "-",
    },
    {
      field: "archivoCentral",
      type: "string",
      header: "Central",
      replaceValue: (value) => value || "-",
    },
    {
      field: "ct",
      type: "string",
      header: "CT",
      replaceValue: (value) => value || "-",
    },
    {
      field: "e",
      type: "string",
      header: "E",
      replaceValue: (value) => value || "-",
    },
    {
      field: "md",
      type: "string",
      header: "MT",
      replaceValue: (value) => value || "-",
    },
    {
      field: "s",
      type: "string",
      header: "S",
      replaceValue: (value) => value || "-",
    },
    {
      field: "procedure",
      type: "string",
      header: "Procedimientos",
      getTooltip: (value) => value || "-",
      replaceValue: (value) => {
        if (!value) return "-";
        return value.length > 200 ? value.slice(0, 200) + "..." : value;
      },
    },
    // {
    //   field: "Acciones",
    //   type: "string",
    //   header: "Acciones",
    //   replaceValue: (value) => value || "-",
    // },
  ];

  return {
    url,
    columns,
    isFilterVisible,
    actionFilter,
    allOfficesOptions,
    allOfices,
    serieOptions,
    seriesSubserie,
    typeDocumentsOptions,
    typeDocuments,
    codeInput,
    nameInput,
    statusInput,
    fetchData,
  };
};
