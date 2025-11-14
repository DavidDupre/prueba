import { useRouter } from "vue-router";
import { Ref, ref, onBeforeMount } from "vue";
import { radicadoOptions } from 'src/constantes/tipoRadicado'
import { FilterBase, Filters, TableDataDocumentalsBase, TableDataDocumentals, GeneralSelector, PaginationBase, PaginationObject } from "./interfaces";
// @ts-ignore
import {
  getAllDataDocumentaltypes,
  getDocumetalTypesList,
  getNumberTotalRegistersAndPages,
  getNumberTotalRegistersAndPagesFiltered,
  getAllDataDocumentaltypesFiltered,
  gettypeDocumentalById
} from "./API/endpointsData";
import { DOCUMENTAL_HEADER, stateOptions, routes } from ".";
import { useTypeDocumentalsStore } from "src/stores/typesDocumentals.store";
import { useLoadingStore } from "src/stores/loading.store";

export const useTiposDocumentalesData = () => {
  const router = useRouter()
  const { setEditProcedure, setDataEdit } = useTypeDocumentalsStore();
  const crumbs = ref([
    ...routes, {
      name: 'Tipología documental'
    }
  ])
  const typeDocumentalsOptions : Ref<GeneralSelector[]> = ref([]);
  const filterForm : Ref<FilterBase> = ref(new Filters());
  const dataTable : Ref<TableDataDocumentalsBase[]> = ref([new TableDataDocumentals()]);
  const isLoading : Ref<boolean> = ref(false);
  const pagination : Ref<PaginationBase> = ref(new PaginationObject());
  const intervalLabel : Ref<string> = ref('');
  const totalPages: Ref<number> = ref(null);

  onBeforeMount(async()=>{

    const response = await setInitialPagination();
    pagination.value = new PaginationObject({...response});
    setLabel();
    setDataTable(pagination.value);
    setOptionsTypeDocumentals(pagination.value);

  });

  const setInitialPagination = async () => {
    const initialData = await getNumberTotalRegistersAndPages();
    totalPages.value = initialData.pages;
    return {
      descending: false,
      page: 1,
      rowsPerPage: 15,
      rowsNumber: initialData.dataElements
    }
  }

  const setDataTable = async (paginationParameter: PaginationBase) => {
    dataTable.value = await getAllDataDocumentaltypes(paginationParameter.rowsPerPage, paginationParameter.page - 1);
  }

  const setDataTableFiltered = async (paginationParameter: PaginationBase, dataFilter: FilterBase) => {
    dataTable.value = await getAllDataDocumentaltypesFiltered(paginationParameter.rowsPerPage, paginationParameter.page -1, dataFilter);
  }

  const setOptionsTypeDocumentals = async (paginationParameter: PaginationBase) => {
    typeDocumentalsOptions.value = await getDocumetalTypesList(paginationParameter.rowsNumber);
  }

  const nextPage = () => {

    pagination.value.page += 1;
    setLabel();
    if(validateFilters()){
      setDataTableFiltered(pagination.value, filterForm.value);
    }
    else{
      setDataTable(pagination.value);
    }

  }

  const prevPage = () => {

    pagination.value.page -= 1;
    setLabel();
    if(validateFilters()){
      setDataTableFiltered(pagination.value, filterForm.value);
    }
    else{
      setDataTable(pagination.value);
    }

  }

  const firstPage = () => {

    pagination.value.page = 1;
    setLabel();
    if(validateFilters()){
      setDataTableFiltered(pagination.value, filterForm.value);
    }
    else{
      setDataTable(pagination.value);
    }

  }

  const lastPage = () => {

    pagination.value.page = totalPages.value;
    setLabel();
    if(validateFilters()){
      setDataTableFiltered(pagination.value, filterForm.value);
    }
    else{
      setDataTable(pagination.value);
    }

  }

  const setLoading = (state: boolean) => {
    isLoading.value = state
  }

  const setLabel = () => {
    intervalLabel.value = `(Pág. ${pagination.value.page})
                            ${((pagination.value.page-1)*pagination.value.rowsPerPage)+1}-${(pagination.value.page)*pagination.value.rowsPerPage < pagination.value.rowsNumber ? (pagination.value.page)*pagination.value.rowsPerPage : pagination.value.rowsNumber}
                            de ${pagination.value.rowsNumber}`;
  }

  const validateFilters = () => {

    const indexes = Object.keys(filterForm.value);
    let isValid = false;

    indexes.map((nameIndex)=>{
      if(nameIndex === 'estado'){
        if(filterForm.value.estado.label !== ''){
          isValid = isValid || true;
        }
      }
      else if(nameIndex === 'codigoTipoDocumental'){
        if(filterForm.value.codigoTipologiaDocumental.label !== ''){
          isValid = isValid || true;
        }
      }
      else if(filterForm.value[nameIndex] !== ''){
        isValid = isValid || true;
      }

      return true;
    })

    return isValid;

  }

  const searchFilterData = async () =>{

    if(validateFilters()){

      const paginationData = await getNumberTotalRegistersAndPagesFiltered(filterForm.value);
      totalPages.value = paginationData.pages;
      pagination.value = new PaginationObject({
        descending: false,
        page: 1,
        rowsNumber: paginationData.dataElements,
        rowsPerPage: 5
      });
      setLabel();
      setDataTableFiltered(pagination.value, filterForm.value);

    }

  }

  const resetFilters = async () => {

    filterForm.value = new Filters();
    const response = await setInitialPagination();
    pagination.value = new PaginationObject({...response});
    setLabel();
    setDataTable(pagination.value);

  }

  const handleRoute = () => {
    setEditProcedure(false);
    router.push('/SGDA/administracion/crear');
  }

  const handleEditRoute = async (id: number) =>{
    const response = await gettypeDocumentalById(id);
    setDataEdit(response);
    setEditProcedure(true);
    router.push('/SGDA/administracion/editar');
  }

  return {
    typeDocumentalsOptions,
    filterForm,
    dataTable,
    isLoading,
    pagination,
    intervalLabel,
    nextPage,
    prevPage,
    DOCUMENTAL_HEADER,
    stateOptions,
    router,
    crumbs,
    radicadoOptions,
    searchFilterData,
    resetFilters,
    firstPage,
    lastPage,
    handleRoute,
    handleEditRoute
  }

}
