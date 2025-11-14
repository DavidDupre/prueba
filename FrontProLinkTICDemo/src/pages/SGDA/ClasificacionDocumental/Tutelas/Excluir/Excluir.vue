<template>
  <main class="q-py-md">
    <a :href="'/tutelas/detalle/' + showRoute" class="text-primary q-mb-md block" style="text-decoration: none;">
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b>
        Volver
      </b>
    </a>
    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Exclusión de Radicado</h1>
      <q-btn color="primary" class="tw-w-42 tw-h-12 flex" @click="currentInfoJuzgado(detalleTutela.juzgado, true);showModalNuevoProceso = true"><q-icon name="add"
          class="q-mr-xs" size="20px" />Nuevo Proceso</q-btn>
    </div>
    <q-card flat>
      <q-expansion-item expand-separator default-opened class="q-bg-white q-mt-lg">
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-lg">Filtros</b>
          </div>
        </template>
        <div class="row q-px-md">
          <div class="col-4">

            <label class="q-px-md tw-text-label">Código del Proceso
              <q-select v-model="formulario.numeroProceso" outlined dense use-input hide-selected emit-value map-options
                fill-input label="Búsqueda" input-debounce="0" :options="radicadoOptions" @filter="filterRa"
                :rules="[v => maxLengthInput(50, v), alphanumeric]" @input-value="v => addValue(v, 'numeroProceso')">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </label>
          </div>
          <div class="col-4">
            <label class="q-px-md tw-text-label">Número de Documento del Accionante
              <q-select v-model="formulario.documentoAccionante" outlined dense use-input hide-selected emit-value
                map-options fill-input input-debounce="0" label="Búsqueda" :options="coProcOptions"
                @filter="filterCoProc" :rules="[v => maxLengthInput(50, v), alphanumeric]"
                @input-value="v => addValue(v, 'documentoAccionante')">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </label>
          </div>
          <div class="col-4">
            <label class="q-px-md tw-text-label">Número de Documento del Afectado
              <q-select v-model="formulario.documentoAfectado" outlined dense use-input hide-selected emit-value
                map-options fill-input input-debounce="0" label="Búsqueda" :options="coProcOptions"
                @filter="filterCoProc" :rules="[v => maxLengthInput(50, v), alphanumeric]"
                @input-value="v => addValue(v, 'documentoAfectado')">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </label>
          </div>
        </div>

        <div class="tw-flex tw-justify-center tw-items-center tw-py-5 tw-gap-6">
          <q-btn label="Limpiar Filtros" type="reset" style="width: 240px" text-color="black" color="accent"
            class="tw-rounded-xl tw-h-12" @click="toClearFilters" />

          <q-btn @click="filterService" label="Buscar" text-color="white" style="width: 240px" color="primary"
            class="tw-rounded-xl tw-h-12 tw-p-2" />
        </div>
      </q-expansion-item>
    </q-card>

    <div class="q-mt-xl">
      <p class="tw-text-lg text-weight-bold q-mx-lg">
        Listado de Procesos
      </p>
      <Table class="q-pa-md" :TABLE_HEADER="columns" :TABLE_BODY="filteredTutelas" key-id="idRadicado"
        @handle-edit-data="seleccionExcluir" select="multiple"
        msg-no-data="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente" />
    </div>

    <q-dialog v-model="showModalNuevoProceso">
      <q-card>
        <q-card-section class=" tw-p-10">
          <q-form ref="nuevoProcesoForm" greedy>
            <h2 class=" tw-text-bold tw-mb-10 tw-text-secondary tw-font-bold tw-text-lg">Nuevo Proceso
            </h2>
            <div class=" tw-mt-3">
              <label for="code" class="tw-text-label">Departamento * </label>
              <q-select v-model="formNuevoProceso.departamento" :disable="opsDep.length > 0 ? false : true"
                name="departamento" outlined dense use-input hide-selected fill-input input-debounce="0"
                label="Seleccione" :options="departmentsList" :rules="[inputRequired]" @filter="filterDep">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class=" tw-mt-3">
              <label for="code" class="tw-text-label">Municipio * </label>
              <q-select v-model="formNuevoProceso.municipio" :disable="municipiosListFiltered.length > 0 ? false : true"
                name="departamento" outlined dense use-input hide-selected fill-input input-debounce="0"
                label="Seleccione" :options="municipiosListFiltered" :rules="[inputRequired]" @filter="filterMuni">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="tw-w-full tw-mb-1">
              <p class="tw-text-label">Nombre del Juzgado *</p>
              <SearchInput :options="optionsJuzgados" v-model:input-data-prop="currentSelectedJuzgado" label="Búsqueda"
                :limit-number="200" :rules="[v => maxLengthInput(200, v), inputRequired]"
                @update="currentInfoJuzgado" />
            </div>
            <div class="">
              <p class="tw-text-label">Código del Proceso *</p>
              <q-input outlined v-model="formNuevoProceso.codigoProceso" label="Inserte" dense
                :rules="[val => maxLengthInput(23, val), inputRequired, alphanumeric, v => /^[-\w\d]{9,}$/.test(v) || 'Mínimo deben ser 9 caracteres para poder continuar']">
              </q-input>
            </div>
            <div class="tw-flex tw-gap-5">
              <q-btn label="Cancelar" type="reset" style="width: 200px" text-color="blue-grey-10" color="white"
                @click="cancelarNuevoProcesoModal = true" class="tw-rounded-xl tw-h-12" />
              <q-btn label="Guardar" type="reset" style="width: 200px" text-color="white" color="blue-grey-10"
                class="tw-rounded-xl tw-h-12" @click="validateNuevoProceso" />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showModalExcluir">
      <q-card>
        <q-card-section class=" tw-p-10">
          <q-form ref="excluirForm">
            <h2 class=" tw-text-bold tw-mb-10 tw-text-secondary tw-font-bold tw-text-lg">Excluir Radicado
            </h2>
            <div class=" tw-mt-3">
              <label for="code" class="tw-text-label">Etapa Procesal *</label>
              <q-select v-model="formExcluir.etapaId" emit-value map-options name="etapaProcesal" outlined dense
                use-input hide-selected fill-input input-debounce="0" label="Seleccione" :options="etapaOp"
                :rules="[inputRequired]" @filter="filterDep">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Sin resultados
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
            <div class="">
              <p class="tw-text-label">Motivo de Exclusión *</p>
              <q-input type="textarea" v-model.trim="formExcluir.motivoExclusion" dense outlined label="Inserte"
                class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInputCustom(1000, v, 'motivo'), v => minLengthInputCustomAsignacion(10, v)]" />
            </div>
            <div class="tw-flex tw-gap-5">
              <q-btn label="Cancelar" type="reset" style="width: 200px" text-color="blue-grey-10" color="white"
                @click="cancelarExclusion" class="tw-rounded-xl tw-h-12" />
              <q-btn label="Excluir" type="reset" style="width: 200px" text-color="white" color="blue-grey-10"
                class="tw-rounded-xl tw-h-12" @click="validateExcluir" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>


    <Modal v-model="cancelarNuevoProcesoModal" title="Confirmación" :is-success="false"
      @handleAccept="cancelarNuevoProceso" cancel-button textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelarNuevoProcesoModal = false" type="button" />

    <Modal v-model="confirmNuevoProcesoModal" title="Confirmación" :is-success="false" @handleAccept="crearNuevoProceso"
      cancel-button textButtonCancel="No" textButton="Si"
      :text="`¿Está seguro de crear el proceso ${formNuevoProceso.codigoProceso}?`"
      @close-modal="confirmNuevoProcesoModal = false" type="button" />

    <Modal v-model="confirmExclusion" title="Confirmación" :is-success="false" @handleAccept="excluirProceso"
      cancel-button textButtonCancel="No" textButton="Si"
      :text="`¿Está seguro de excluir el radicado ${showRoute} del proceso ${detalleTutela?.codigoProceso} y asociarlo al proceso ${selectedCodigo}?`"
      @close-modal="confirmExclusion = false" type="button" />

  </main>
</template>

<script lang="ts" setup>
import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import Modal from "src/components/Modal/Modal.vue";
import { fourthFormatDate, dateForFilter } from "src/helpers/formtDate";
import SearchInput from "src/components/SearchInput/SearchInput.vue";
import { Tutelas } from "src/interfaces";
import { sgdeaAxios } from "src/services";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Table from "./Table.vue";
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { useAuthStore } from "stores/auth.store";
import {
  homePhoneNumber,
  phoneFormat,
  mobilePhonNumber,
  minLengthInputCustomAsignacion,
  validationEmail,
  maxLengthInput,
  maxLengthInputCustom,
  inputRequired,
  minLengthInput,
  alphanumeric
} from 'src/helpers/validations';
import { toast } from "src/helpers/toast";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

const router = useRouter();
const formulario = ref({
  documentoAccionante: "",
  numeroProceso: "",
  documentoAfectado: "",
});

const formNuevoProceso = ref({
  municipio: null,
  departamento: null,
  codigoProceso: null,
  codigoJuzgado: null,
  tutelaId: null
})


const formExcluir = ref({
  etapaId: null,
  motivoExclusion: null
})



const { getUserInfo } = useAuthStore();
const userInfo = ref()
const selectedCodigo = ref()
const route = useRoute()
const excluirForm = ref()
const confirmExclusion = ref(false)
const confirmNuevoProcesoModal = ref(false)
const cancelarNuevoProcesoModal = ref(false)
const optionsJuzgados = ref([]);
const detalleTutela = ref()
const nuevoProcesoForm = ref()
const showModal = ref(false);
const currentSelectedJuzgado = ref(null)
const showModalExcluir = ref(false)
const showRoute = ref(route.params.id);
const showModalNuevoProceso = ref(false)
const allTutelas = ref([]);
const selectedJuzgado = ref()
const departmentsList = ref([])
const opsDep = ref([])
const validDepW = ref(true)
const municipiosListFiltered = ref([])
const opsMuni = ref([])
const filteredTutelas = ref([])
const radicadoOptions = ref()
const opForRadicados = ref()
const opForCoProc = ref()
const coProcOptions = ref()
const etapaOp = ref([])
const columns = [
  {
    name: "codigo",
    label: "Código del Proceso",
    field: "codigoProceso",
    align: 'center',
    sortable: true,
  },
  {
    name: "nombreJuzgado",
    label: "Nombre del Juzgado",
    field: (row) => row.juzgado.nombre,
    align: 'center',
    sortable: true,
  },
  {
    name: "afectado",
    label: "Nombre - Identificación Afectado",
    align: 'center',
    field: (row) => row.informacionProceso.numeroDocumentoAfectado + " - " + row.informacionProceso.nombreCompletoAfectado,
    sortable: true,
  },
  {
    name: "accionante",
    label: "Nombre - Identificación Accionante",
    field: (row) => row.informacionProceso.numeroDocumentoAccionante + " - " + row.informacionProceso.nombreCompletoAccionante,
    align: 'center',
    sortable: true,
  },
  {
    name: "departamento",
    label: "Departamento",
    field: 'departamento',
    sortable: true,
    align: 'center',
  },
  {
    name: "municipio",
    label: "Municipio",
    field: "municipio",
    align: 'center',
    sortable: true,
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    sortable: false,
    align: "center",
  },
];

async function excluirProceso() {
  if (await excluirForm.value.validate()) {
    //formExcluir.value.codigoProceso = re
    const formdata = {
      tutelaId: detalleTutela.value.idTutela,
      codigoProceso: selectedCodigo.value,
      etapaId: formExcluir.value.etapaId
    }
    const response = await sgdeaAxios.patch(`/tutela/excluirEtapaProcesoTutela`, formdata);
    if(response.status == 200){
      await crearTrazabilidad({
        proceso: `TUT${detalleTutela.value.idTutela}`,
        secuencia: detalleTutela.value.idRadicado,
        estado: detalleTutela.value.estado,
        descripcion: `Usuario: ${useAuthStore().$state.userInfo.name} \n` +
              `Motivo: ${formExcluir.value.motivoExclusion}`,
        comentario: formExcluir.value.motivoExclusion,
        nombre: useAuthStore().$state.userInfo.name,
        tramite: 'Tutela',
        accion: `${useAuthStore().$state.userInfo.name} ha excluido el radicado ${detalleTutela.value.idRadicado} e incluido al proceso ${selectedCodigo.value} para la tutela`,
      })
      toast.success('Exclusión realizada correctamente')
      router.push('/tutelas/detalle/' + showRoute.value)
    }
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
    return;
  }
}

async function validateExcluir() {
  if (await excluirForm.value.validate()) {
    confirmExclusion.value = true
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
    return;
  }
}

function cancelarNuevoProceso() {
  formNuevoProceso.value = {
    municipio: null,
    departamento: null,
    codigoProceso: null,
    codigoJuzgado: null,
    tutelaId: null
  }
  currentSelectedJuzgado.value = null
  showModalNuevoProceso.value = false
  cancelarNuevoProcesoModal.value = false
}

function cancelarExclusion() {
  formExcluir.value = {
    etapaId: null,
    motivoExclusion: null
  }
  showModalExcluir.value = false
}

function seleccionExcluir(data) {
  showModalExcluir.value = true
  selectedCodigo.value = data.codigoProceso
}



onMounted(async () => {
  userInfo.value = await getUserInfo();

  //await getAllTutelas("/tutela/info");
  const { data } = await sgdeaAxios.get(`/tutela/info/${showRoute.value}`);
  detalleTutela.value = data
  //const listadoEtapas = await sgdeaAxios.get(`/tutela/listadoEtapaProcesalXTutela/${data.codigoProceso}`);
  //filteredTutelas.value = listadoEtapas.data
  // opEtapaProcesal.value = data?.map((item: any) => ({
  //   label: capitalizarPalabrasExceptoDe(item.nombre),
  //   value: item.id,
  //   descripcion: item.descripcion
  // })).filter((item) => item.label != 'Duplicado');
  opEP.value = opEtapaProcesal.value
  const dataOfi = (await sgdeaAxios.get("/oficinas/all"));
  etapaOp.value = (await sgdeaAxios.get("/tutela/listadoEtapaProcesal")).data.map((item) => { return { value: item.id, label: item.nombre } })
  opOficinas.value = dataOfi.data?.map((item: any) => ({
    label: item.nombre,
    value: item.id,
    dependencia: item.dependencia
  }));
  opOfi.value = opOficinas.value
  const dataJuzgado = (await sgdeaAxios.get("/juzgados/activos"));
  optionsJuzgados.value = dataJuzgado.data?.map((item: any) => ({
    label: item.nombre,
    value: item.idJuzgado,
    codigo: item.codigo,
    nombre: item.nombre,
    id: item.idJuzgado,
    departamento: item.departamento,
    municipio: item.municipio,
    direccion: item.direccion,
    telefono: item.telefono,
    celular: item.celular,
    correo: item.correo
  }));
});

async function validateNuevoProceso() {
  if (await nuevoProcesoForm.value.validate()) {
    const validationResponse = await sgdeaAxios.get("/tutela/buscarDatosProcesos?numeroProceso="+formNuevoProceso.value.codigoProceso)
    if(validationResponse.data && validationResponse.data.length){
      let sinNulidad = false
      validationResponse.data.forEach((item) => {
        if(item.estadoEtapaProcesal.nombre !== "Decreta Nulidad"){
          sinNulidad = true
        }
      })
      if(sinNulidad){
        toast.error("No se puede crear el proceso ya que actualmente hay un proceso activo con el mismo código ingresado y no se encuentra en estado de nulidad")
      } else {
        confirmNuevoProcesoModal.value = true
      }
    } else {
      confirmNuevoProcesoModal.value = true
    }

  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
    return;
  }
}

async function crearNuevoProceso() {
  if (await nuevoProcesoForm.value.validate()) {
    formNuevoProceso.value.tutelaId = detalleTutela.value.idTutela
    const response = await sgdeaAxios.patch(`/tutela/crearNuevoProceso`, formNuevoProceso.value);
    if (response.status == 200) {
      toast.success("Nuevo proceso creado exitosamente")
      selectedCodigo.value = formNuevoProceso.value.codigoProceso

      await crearTrazabilidad({
        proceso: `TUT${detalleTutela.value.idTutela}`,
        secuencia: detalleTutela.value.idRadicado,
        estado: detalleTutela.value.estado,
        descripcion: `Se ha creado el nuevo proceso ${selectedCodigo.value} para la tutela`,
        comentario: 'Nuevo proceso',
        nombre: useAuthStore().$state.userInfo.name,
        tramite: 'Tutela',
        accion: `${useAuthStore().$state.userInfo.name} ha creado el nuevo proceso ${selectedCodigo.value} para la tutela ${detalleTutela.value.idTutela}`
      })

      formNuevoProceso.value = {
        municipio: null,
        departamento: null,
        codigoProceso: null,
        codigoJuzgado: null,
        tutelaId: null
      }
      currentSelectedJuzgado.value = null
      showModalNuevoProceso.value = false
      cancelarNuevoProcesoModal.value = false

      showModalExcluir.value = true
    }
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos')
    return;
  }

}

async function getAllTutelas(path) {
  const { data } = await sgdeaAxios.get<Tutelas[]>(path);

  allTutelas.value = data.map((it) => ({
    ...it
  }))
  // let lastSort = allTutelas.value.sort((a, b) => {
  //   if (a.tiempoVencer != '' && b.tiempoVencer != '') {
  //     let numA = parseInt(a.tiempoVencer.match(/-?\d+/)[0]);
  //     let unitA = a.tiempoVencer.match(/[a-zA-Z]+/)[0];

  //     let numB = parseInt(b.tiempoVencer.match(/-?\d+/)[0]);
  //     let unitB = b.tiempoVencer.match(/[a-zA-Z]+/)[0];

  //     if (unitA === unitB) {
  //       return numA - numB;
  //     } else {
  //       return unitA === 'H' ? -1 : 1;
  //     }
  //   } else {
  //     return 1
  //   }

  // });

  filteredTutelas.value = allTutelas.value
  // opForRadicados.value = allTutelas.value.map((data) => ({
  //   label: data.idRadicado,
  //   value: data.idRadicado
  // }))
  // const codigoMap = new Map();

  // allTutelas.value.forEach((data) => {
  //   const codigo = data.codigo;
  //   if (!codigoMap.has(codigo)) {
  //     codigoMap.set(codigo, true);
  //   }
  // });
  // const uniqueCodigos = Array.from(codigoMap.keys());
  // opForCoProc.value = uniqueCodigos.map((codigo) => ({
  //   label: codigo,
  //   value: codigo
  // }));
}


async function toClearFilters(): void {
  formulario.value = {
    numeroProceso: null,
    documentoAccionante: null,
    documentoAfectado: null
  }
  filteredTutelas.value = []
}

const opEtapaProcesal = ref()
const opEP = ref()
const opOficinas = ref()
const opOfi = ref()

const filterService = () => {
  const entries = Object.entries(formulario.value);
  if (entries.every(([_, val]) => !val)) {
    toast.error('Por favor, seleccione al menos un filtro.');
    return;
  }

  let path = '/tutela/buscarDatosProcesos?'

  entries.forEach(([key, value]) => {
    if (value) {
      if (key == 'fecha') {
        value = dateForFilter(value)
      }
      //@ts-ignore
      path = typeof value === 'string' || typeof value === 'number' ? `${path}${key}=${value}&` : `${path}${key}=${value.label}&`
    }
  });
  // Elimina el último '&' si existe
  path = path.endsWith('&') ? path.slice(0, -1) : path;
  getAllTutelas(path)
}

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};


const filterRa = (val, update, abort) => {
  if (val.length < 4) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    radicadoOptions.value = opForRadicados.value.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
  })
}

const filterCoProc = (val, update, abort) => {
  if (val.length < 2) {
    abort()
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    coProcOptions.value = opForCoProc.value.filter(v => v.value.toLowerCase().indexOf(needle) > -1)
  })
}


const filterDep = (val, update) => {
  if (val === '') {
    update(() => {
      etapaOp.value = etapaOp.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    departmentsList.value = opsDep.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterMuni = (val, update) => {
  if (val === '') {
    update(() => {
      municipiosListFiltered.value = opsMuni.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    municipiosListFiltered.value = opsMuni.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const currentInfoJuzgado = async (data: any, init: boolean = false) => {
  validDepW.value = false
  formNuevoProceso.value = {
    ...formNuevoProceso.value,
    departamento: data.departamento,
    municipio: data.municipio,
    codigoJuzgado: data.codigo
  }
  selectedJuzgado.value = data
  formNuevoProceso.value.codigoJuzgado = data.codigo
  if(init){
    currentSelectedJuzgado.value = {
    label: data.nombre,
    value: data.idJuzgado,
    codigo: data.codigo,
    nombre: data.nombre,
    id: data.idJuzgado,
    departamento: data.departamento,
    municipio: data.municipio,
    direccion: data.direccion,
    telefono: data.telefono,
    celular: data.celular,
    correo: data.correo
  }
  }
  var idDepart = departmentsList.value.filter((item) => item.label == data.departamento)
  municipiosListFiltered.value = []
  const { optionsMunicipalities } = await useMunicipalities(idDepart[0].value);
  municipiosListFiltered.value = optionsMunicipalities.value;
  setTimeout(() => {
    validDepW.value = true
  }, 1000);
}

const addValue = (value, type) => {
  formulario.value[type] = value
}

</script>

<style>
label {
  padding: 0px 10px;
}
</style>
