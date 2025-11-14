<template>
    <div class="tw-p-10">
      <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
        <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
          Busqueda
        </div>
      </div>
  
      <q-card class="tw-rounded-xl tw-py-4 tw-flex tw-flex-col" flat>
        <p class="tw-text-2xl tw-font-bold tw-ml-8">Filtros</p>
  
        <q-form ref="CotizacionesForm" class="tw-mt-6" @submit="handleSearch">
          <div class="tw-flex tw-full tw-justify-center q-col-gutter-md tw-px-8">
            <div class="tw-w-1/2">
              <p class="tw-text-label">Tramite</p>
              <q-select outlined v-model="coreSelected" :options="coreOptions" placeholder="Seleccione" emit-value map-options label="Inserte" dense :rules="[]" />
            </div>
  
            <div class="tw-w-1/2">
              <p class="tw-text-label">Número de documento</p>
              <q-input outlined v-model="filtersSearch.nroDocumento" label="Inserte" dense :rules="[(val => !!val ? /^\d+$/.test(val) || 'Solo caracteres numéricos' : true)]" />
            </div>
            <div class="tw-w-1/2">
              <p class="tw-text-label">Número de radicado</p>
              <q-input outlined v-model="filtersSearch.nroRadicado" label="Inserte" dense :rules="[(val => !!val ? /^\d+$/.test(val) || 'Solo caracteres numéricos' : true)]" />
            </div>
          </div>
          <div class="row tw-flex tw-justify-center tw-gap-6 [&>*]:tw-p-2 tw-mt-12">
            <q-btn label="Limpiar filtros" color="accent" textColor="secondary" class="tw-rounded-lg col-2" @click="resetForm" />
            <q-btn label="Buscar" color="secondary" class="tw-rounded-lg col-2" type="submit" />
          </div>
        </q-form>
      </q-card>
  
      <section v-if="load">
        <p class="tw-text-2xl tw-font-bold tw-my-4">Detalle de los documentos</p>
  
        <q-card class="q-pa-md tw-mt-4 tw-rounded-xl" flat>
          <div class="tw-w-full tw-flex tw-p-4 row" v-if="!!data.response.docs.length">
            <div class="tw-w-full row" v-for="(elems, n) in data.response.docs" :key="n">
              <div class="tw-gap-2 q-pa-md tw-mx-auto col-4">
                <p class="tw-text-label tw-font-semibold">Documento:</p>
  
                <q-card class="tw-mt-8">
                  <q-tabs v-model="tabNumbers[n]" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
                    <q-tab :name="String(i)" :label="String(i + 1)" v-for="(url, i) in folderUrl" :key="i" />
                  </q-tabs>
  
                  <q-separator />
  
                  <q-tab-panels v-model="tabNumbers[n]" animated>
                    <q-tab-panel :name="String(i)" v-for="(url, i) in folderUrl" :key="i">
                      <div class="text-h6">{{ i + 1 }}</div>
                      <a v-if="isImage(url)" target="_blank" :href="url">
                        <img :src="url">
                      </a>
                      <a v-else target="_blank" :href="url">
                        <q-btn icon="picture_as_pdf" label="Ver Documento" />
                      </a>
                    </q-tab-panel>
                  </q-tab-panels>
                </q-card>
              </div>
              <div class="row col-8">
                <div class="tw-w-full tw-flex tw-flex-col tw-gap-2 col-4 q-pa-md" v-for="d in Object.keys(elems).filter((e) => e !== 'images' && elems[e].length && elems[e].trim())" :key="d">
                  <p class="tw-text-label tw-font-semibold">{{ d }}</p>
                  <span>{{ elems[d] }}</span>
                </div>
              </div>
              <div class="document-divider"></div>
            </div>
  
          </div>
          <div v-else class="tw-flex tw-justify-center">
            <h2 class="tw-font-bold tw-text-2xl tw-py-5"> No se encontraron documentos asociados</h2>
          </div>
        </q-card>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import axios from 'axios';
import { toast } from 'src/helpers/toast';
  
  import { onMounted, ref, Ref } from 'vue';
  import { useRouter } from "vue-router";
  
  const load = ref(false)
  const data = ref()
  const img = ref()
  const tabNumbers = ref({})
  const folderUrl = ref([])
  const coreSelected = ref()
  const coreOptions = ref([{ label: 'Auditoria', value: 'afi_auditoria_2023' }, { label: 'Afiliaciones', value: 'afiliaciones_2023' }, { label: 'Autorizaciones', value: 'autorizaciones_2023' }, { label: 'Indemnizaciones', value: 'indemnizaciones_2023' }, { label: 'Recaudo', value: 'recaudo_2023' }, { label: 'Suscripción y Expedición de Pólizas', value: 'suscripcion_y_expedicion_de_polizas_2023' }])
  const router = useRouter()
  
  onMounted(async ()=> {
    const response = await axios.get("https://datahistorica.positivasgdea.com/solr/admin/cores?action=STATUS&wt=json")
    if(response.data){
      const cores = Object.keys(response.data.status)
      coreOptions.value = cores.map((item) => { return {label: item.replace('_', ' '), value: item}})
    }
  })
  
  const routes = [
    {
      name: 'Inicio',
      to: '/home'
    },
    {
      name: 'Migración',
      to: '/home'
    },
  
    {
      name: 'Busqueda'
    },
  ]
  
  function isImage(url) {
    return url.toLowerCase().endsWith('.png');
  }
  
  const imgRoute = (info: any) => {
    let newUrl = ''
  
    newUrl = `${info.ano_rad}`
    newUrl += `${String(info.codi_sec).length == 2 ? '' : '0'.repeat(2 - String(info.codi_sec).length)}${info.codi_sec}`
    newUrl += `${String(info.codi_pat).length == 3 ? '' : '0'.repeat(3 - String(info.codi_pat).length)}${info.codi_pat}`
    newUrl += `${String(info.nume_rad).length == 6 ? '' : '0'.repeat(6 - String(info.nume_rad).length)}${info.nume_rad}`
  
  
  
    return newUrl
  
  }
  
  const axiosInstance = axios.create({
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  });
  
  
  const objectKeys = {
    'id': 'ID',
    'ano_rad': 'Año de Radicación',
    'fech_rad': 'Fecha de Radicación',
    'cant_hoj': 'Cantidad de Hojas',
    'codi_est': 'Codigo de Estado',
    'codi_usu': 'Codigo de Usuario',
    'ini_rad': 'Inicio de Radicado',
    'fin_rad': 'Fin de radicado',
    'fech_carg': 'Fecha de cargue',
    'nomb_tra': 'Nombre de tramite',
    'nomb_est': 'Transferido',
    'razn_emp': 'Razon',
    'dire_emp': 'Direccion de la Empresa',
    'mail_per': 'Correo Personal',
    'nomb_mun': 'Nombre del municipio',
    'desc_pqr': 'Descripcion',
    'nume_rad': 'Numero de radicado',
    'ndoc_afi': 'Numero de documento del afiliado'
  }
  
  const objectKeys_pyp = {
    'id': 'ID',
    'ano_rad': 'Año de Radicación',
    'fech_rad': 'Fecha de Radicación',
    'cant_hoj': 'Cantidad de Hojas',
    'codi_est': 'Codigo de Estado',
    'codi_usu': 'Codigo de Usuario',
    'ini_rad': 'Inicio de Radicado',
    'fin_rad': 'Fin de radicado',
    'fech_carg': 'Fecha de cargue',
    'nomb_tra': 'Nombre de tramite',
    'nomb_est': 'Transferido',
    'razn_emp': 'Razon',
    'dire_emp': 'Direccion de la Empresa',
    'mail_per': 'Correo Personal',
    'nomb_mun': 'Nombre del municipio',
    'desc_pqr': 'Descripcion',
    'nume_rad': 'Numero de radicado',
    'ndoc_afi': 'Numero de documento del afiliado'
  }
  
  const bucketurl = 'bcktdevpositivasgda'
  const testNum = 2765
  const filtersSearch: Ref<Filters> = ref({});
  
  interface Filters {
    nroDocumento?: number;
    nroRadicado?: number;
  }
  
  const bucketUrlList = {
    suscripcion_y_expedicion_de_polizas_2023: "2023_12_MigracionMayo"
  }
  
  const resetForm = () => {
    filtersSearch.value = ({})
    load.value = false
    folderUrl.value = []
  }
  
  const handleSearch = async () => {
    let query = ''
    if (filtersSearch.value.nroRadicado) {
      query += `nume_rad: ${filtersSearch.value.nroRadicado} & `
    }
  
    if (filtersSearch.value.nroDocumento) {
      query += 'ndoc_afi:' + filtersSearch.value.nroDocumento + '&'
    }
    if (!coreSelected.value) {
      toast.error("Debe seleccionar un tramite");
      return
    }
  
    if (!query) {
      toast.error("Debe llenar alguno de los filtros");
      return
    }
    folderUrl.value = []
    const newQuery = `https://datahistorica.positivasgdea.com/solr/${coreSelected.value}/query?indent=true&q.op=OR&q=${query}useParams=`
    data.value = (await axios.get(newQuery)).data
    data.value.response.docs.forEach(doc => {
      // Check if the 'doc' object has the 'images' property and it's an array
      if (Array.isArray(doc.images)) {
        // Loop through each image
        doc.images.forEach(async image => {
          // Call the 'folder' method for each image
          await folder(image);
        });
      }
    }
    )
    load.value = true
  }
  
  const encodeFolderName = (key) => {
    return bucketUrlList[key] || key.replace(/_/g, '%20');
  };
  
  
  const folder = async (el) => {
    let encoded = el;
    folderUrl.value.push('https://storage.googleapis.com/' + `${bucketurl}/${encodeFolderName(coreSelected.value)}/` + encoded)
  }
  </script>
  
  <style scoped>
  .document-divider {
    height: 5px;
    background-color: #8f8c8c; /* light gray color */
    margin: 20px 0;
    border-radius: 2px;
    width: 100%;
  }
  
  .document-card {
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f9f9f9; /* light background color */
    border: 1px solid #e0e0e0; /* light border color */
    border-radius: 8px;
  }
  </style>
  