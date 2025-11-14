import { ref, onMounted, watch, isRef } from "vue";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

// const mockData = [
//   {
//     idSolicitud: "1",
//     alertaColorFechaSolicitud: "green",
//     idDependencia: "DEP01",
//     numeroRadicado: "SAP12345",
//     fechaInicial: "2025-08-10",
//     fechaFinal: "2025-08-20",
//     fechaSolicitud: "2025-08-05",
//     fechaProrroga: "2025-08-21",
//     ubicacionTopografica: "Piso 2, Estante 4",
//     numeroFolios: "12",
//     nombreSolicitante: "Juan Pérez",
//     motivoSolicitud: "Revisión de expediente",
//     nombreSerieExpediente: "Administrativo",
//     serieExpediente: {
//       subseries: [
//         { description: "Contratos" },
//         { description: "Documentación interna" }
//       ]
//     },
//     nombreTipoDocumentalExpediente: "Factura",
//     tituloExpediente: "Expediente contrato 2025",
//     soporte: "FISICO",
//     codigoUnidadAlmacenamiento: "UNI-001",
//     estado: "APROBADO"
//   },
//   {
//     idSolicitud: "2",
//     alertaColorFechaSolicitud: "yellow",
//     idDependencia: "DEP02",
//     numeroRadicado: "RAD67890",
//     fechaInicial: "2025-07-01",
//     fechaFinal: "2025-07-15",
//     fechaSolicitud: "2025-06-30",
//     fechaProrroga: null,
//     ubicacionTopografica: "",
//     numeroFolios: "8",
//     nombreSolicitante: "María Gómez",
//     motivoSolicitud: "Auditoría",
//     nombreSerieExpediente: "",
//     serieExpediente: { subseries: [] },
//     nombreTipoDocumentalExpediente: "Informe",
//     tituloExpediente: null,
//     soporte: "DIGITAL",
//     codigoUnidadAlmacenamiento: "UNI-002",
//     estado: "EN PROCESO"
//   },
//   {
//     idSolicitud: "3",
//     alertaColorFechaSolicitud: "red",
//     idDependencia: "DEP03",
//     numeroRadicado: "SAP56789",
//     fechaInicial: "",
//     fechaFinal: "",
//     fechaSolicitud: "2025-08-18",
//     fechaProrroga: "",
//     ubicacionTopografica: "Piso 1, Armario B",
//     numeroFolios: "",
//     nombreSolicitante: "Carlos López",
//     motivoSolicitud: "Consulta",
//     nombreSerieExpediente: "Legal",
//     serieExpediente: {
//       subseries: [
//         { description: "Demandas" }
//       ]
//     },
//     nombreTipoDocumentalExpediente: "Contrato",
//     tituloExpediente: "Expediente legal 2025",
//     soporte: "FISICO",
//     codigoUnidadAlmacenamiento: "UNI-003",
//     estado: "RECHAZADO"
//   }
// ];

export function useDataTable(
  url: string,
  columns: any[],
  instance: string,
  filter = "",
  params = {},
  dataKey = "elementos",
  metodo = "get",
  body = {},
  pageSize: string,
  pageNo: string,
) {
  const globalFilter = ref("");
  const originalData = ref([]);
  const dataTable = ref<any[]>([]);
  const totalElements = ref(0);
  const currentPage = ref(0);
  const rowsPerPage = ref(20);
  const isLoading = ref(false);
  const selectedElements = ref([]);

  const searchSubject = new Subject<string>();

  const fetchData = async () => {
    try {
      isLoading.value = true;

      const paramInitial = url.includes("?") ? "&" : "?";
      let requestUrl = `${url}${paramInitial}${pageNo}=${currentPage.value}&${pageSize}=${rowsPerPage.value}`;
      if (globalFilter.value) {
        requestUrl += `&search=${globalFilter.value}`;
      }
      if (filter) {
        requestUrl += filter;
      }

      // Verificar que la instancia tiene el método `get`
      const apiInstance = instance == 'sgdeaAxios' ? sgdeaAxios : sgdeaArchivoAxios;
      if (!apiInstance || typeof apiInstance.get !== "function") {
        throw new Error(
          "No se encontró una instancia válida con el método 'get'. Verifica la prop instance."
        );
      }

      let response: { data: any } = { data: null };
      if (url.length > 0 && metodo === "get") {
        response = await apiInstance.get(requestUrl, { params });
      }

      if (url.length > 0 && metodo === "post") {
        response = await apiInstance.post(url, body);
      }

      dataTable.value =
        response.data[dataKey] ??
        response.data?.data?.elementos ??
        response.data?.data ??
        response.data ??
        [];

      originalData.value = [...dataTable.value]
      totalElements.value = response.data?.totalElements ?? response.data?.data?.totalElements ?? 0;
    } catch (error) {
      console.error(error);
      // dataTable.value = mockData;
    } finally {
      isLoading.value = false;
    }

  };

  const onPageChange = (event: { page: number; rows: number }) => {
    currentPage.value = event.page;
    rowsPerPage.value = event.rows;
    fetchData();
  };

  const onPaginatorChange = (event: { first: number; rows: number }) => {
    currentPage.value = event.first / event.rows;
    rowsPerPage.value = event.rows;
    fetchData();
  };

  const getSemaforoClass = (value: string) => {
    if (value === 'green') return "tw-border-green-600 tw-text-green-600";
    if (value === 'yellow') return "tw-border-orange-600 tw-text-orange-600";
    if (value === 'red') return "tw-border-red-600 tw-text-red-600";
  };

  const extractNumber = (value: string): number => {
    const match = value.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  onMounted(() => {
    if (url.length > 0) {
      fetchData();
    }
  });

  watch(globalFilter, (newFilter) => {
    searchSubject.next(newFilter);
  });

  searchSubject.pipe(debounceTime(2000)).subscribe(() => {
    fetchData();
  });

  return {
    globalFilter,
    dataTable,
    totalElements,
    currentPage,
    rowsPerPage,
    isLoading,
    fetchData,
    onPageChange,
    onPaginatorChange,
    getSemaforoClass,
    selectedElements,
  };
  }
