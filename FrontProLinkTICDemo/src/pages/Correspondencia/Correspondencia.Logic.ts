import { Documental_HEADER, routes} from "."
import { Ref, onBeforeMount, ref} from "vue"
// import httpClient, { client } from 'src/services';

interface IForm {
  codigoExpediente?: string,
  fechaVigenciaFinal?: string,
  fechaVigenciaInicial?: string,
  mail?: string,
  nombre?: string,
  nombre2?: string,
  nombreTipoRadicado?: string,
  numDocumento?: number,
  numeroRadicado?: string,
  pagina: number | null,
  registros: number | null,
  dependencia?: string
}

export const useCorrespondencyData = () =>{

  const routesData = ref([]);
  const headersData = ref([]);
  const msgFilter = ref('No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente')
  const docTable = ref(0)

  const correspondencies: Ref<any[]> = ref([])
  const correspondenciesBackup: Ref<any[]> = ref([])

  const correspondenciesFiltrado: Ref<any[]> = ref([])

  const form: Ref<IForm> = ref({
    numDocumento: null,
    pagina: null,
    registros: null,
    codigoExpediente: ""
  });

  const documentOptions: Ref<any[]> = ref([])
  const radicadoOptions: Ref<any[]> = ref([])

  onBeforeMount(async () => {
    routesData.value = routes;
    headersData.value = Documental_HEADER;
    await loadDataFiltro();
    await getAllRegisters();
  })

  async function getAllRegisters() {

  }

  async function loadDataFiltro() {
    await loadTipoRadicado();
    await loadTipoDocumental();
  };

  function loadTipoRadicado() {

    radicadoOptions.value = [
    {
        label: "option 1",
        value: 1
      },
      {
        label: "option 2",
        value: 2
      }
    ]
  };
  function loadTipoDocumental() {

    documentOptions.value = [
    {
        label: "option 1",
        value: 1
      },
      {
        label: "option 2",
        value: 2
      }
    ]
  };




  const clean = () => {
    correspondenciesFiltrado.value = correspondencies.value

    form.value = {
      numDocumento: null,
      pagina: null,
      registros: null
    }

    docTable.value++
    correspondencies.value = correspondenciesBackup.value
  }



  const handleSearch = async () => {
    getAllRegisters();
  }


  return{
    handleSearch,
    form,
    clean,
    msgFilter,
    correspondencies,
    docTable,
    correspondenciesFiltrado,
    documentOptions,
    radicadoOptions,
    routesData,
    headersData,
  }

}
