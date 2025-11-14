import { ref, onMounted, watch } from "vue";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

export function useDataTable(
  url: string,
  columns: any[],
  instance: string,
  filter = "",
  params = {},
  dataKey = "elementos",
  metodo = "get",
  body = {}
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
      let requestUrl = `${url}${paramInitial}pageNumber=${currentPage.value}&pageSize=${rowsPerPage.value}`;
      if (globalFilter.value) {
        requestUrl += `&search=${globalFilter.value}`;
      }
      if (filter) {
        requestUrl += filter;
      }

      // Verificar que la instancia tiene el método `get`
      const apiInstance =
        instance == "sgdeaAxios" ? sgdeaAxios : sgdeaArchivoAxios;
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

      if (response.data && response.data.radicados) {
        dataTable.value = extraerArchivos(response.data.radicados);
        originalData.value = [...dataTable.value];
        totalElements.value = dataTable.value.length;
      } else {
        dataTable.value = [];
        originalData.value = [];
        totalElements.value = 0;
      }
    } catch (error) {
      console.error(error);
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
    if (value === "green") return "tw-border-green-600 tw-text-green-600";
    if (value === "yellow") return "tw-border-orange-600 tw-text-orange-600";
    if (value === "red") return "tw-border-red-600 tw-text-red-600";
  };

  function extraerArchivos(radicados) {
    const archivos = [];

    function recorrerNodo(nodo, parentFolder = null) {
      if (Array.isArray(nodo)) {
        nodo.forEach((item) => recorrerNodo(item, parentFolder));
      } else if (nodo) {
        if (nodo.esArchivo) {
          archivos.push({
            ...nodo,
            parentFolder: parentFolder ? parentFolder.nombre : null,
          });
        }
        if (nodo.contenido && nodo.contenido.length > 0) {
          recorrerNodo(nodo.contenido, nodo);
        }
      }
    }

    recorrerNodo(radicados);
    return archivos;
  }

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
