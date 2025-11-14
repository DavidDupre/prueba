<template>
  <div>
      <q-card class="tw-rounded-lg tw-px-7 tw-pt-7 tw-mb-[80px]" flat>

          <p class="tw-text-xl tw-font-bold">Juzgado Remitente</p>

          <q-form ref="radicado" class="tw-mt-6 tw-h-full tw-font-bold">

              <div class="tw-flex tw-full q-col-gutter-md">
                <div class="tw-w-1/3 tw-mt-3">
                        <label for="code" class="tw-text-label">País * </label>
                        <q-select v-model="form.pais" disable outlined dense use-input hide-selected fill-input
                            input-debounce="0" label="Seleccione" :options="optionsCountries" :rules="[inputRequired]"
                            @filter="filterPais">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        Sin resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                  <div class="tw-w-1/3 tw-mt-3">
                      <label for="code" class="tw-text-label">Departamento * </label>
                      <q-select v-model="form.departamento" :disable="opsDep.length > 0 ? false : true"
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
                  <div class="tw-w-1/3 tw-mt-3">
                      <label for="code" class="tw-text-label">Municipio * </label>
                      <q-select v-model="form.municipio" :disable="municipiosListFiltered.length > 0 ? false : true"
                          name="departamento" outlined dense use-input hide-selected fill-input input-debounce="0"
                          label="Seleccione" :options="municipiosListFiltered" :rules="[inputRequired]"
                          @filter="filterMuni">
                          <template v-slot:no-option>
                              <q-item>
                                  <q-item-section class="text-grey">
                                      Sin resultados
                                  </q-item-section>
                              </q-item>
                          </template>
                      </q-select>
                  </div>
              </div>

              <div class="tw-w-full tw-mb-1">
                  <p class="tw-text-label">Nombre del Juzgado *</p>
                  <SearchInput :options="optionsJuzgados" v-model:input-data-prop="form.nombre_juzgado"
                      label="Búsqueda" :limit-number="200" :rules="[v => maxLengthInput(200, v), inputRequired]"
                      @update="currentInfoJuzgado" />
              </div>
              <div class="tw-w-full tw-mb-1">
                  <p class="tw-text-label">Código del Juzgado</p>
                  <q-select outlined dense v-model="form.codigo_juzgado" @filter="filterFn" use-input
                      :options="optionsCode" map-options label="Búsqueda"
                      :rules="[v => maxLengthInput(12, v), inputRequired]" @update:model-value="currentInfoJuzgado">
                      <template v-slot:append>
                          <q-icon name="search" />
                      </template>
                      <template v-slot:no-option>
                          <q-item>
                              <q-item-section class="text-grey">
                                  No se encontró
                              </q-item-section>
                          </q-item>
                      </template>
                  </q-select>
              </div>


              <div class="tw-w-full">
                  <p class="tw-text-label">Dirección del Juzgado </p>
                  <q-input outlined v-model="form.direccion" label="Inserte" dense
                      :rules="[v => maxLengthInput(200, v)]">
                  </q-input>
              </div>
              <div class="tw-flex tw-full q-col-gutter-md">
                  <div class="tw-w-1/2">
                      <label for="code" class="tw-text-label">Teléfono </label>
                      <q-input outlined v-model="form.telefono" label="Inserte" dense
                          :rules="[alphanumericWithPoint, v => maxLengthInput(20, v)]" />
                  </div>
                  <div class="tw-w-1/2">
                      <label for="code" class="tw-text-label">Celular </label>
                      <q-input outlined v-model="form.celular" label="Inserte" dense
                          :rules="[alphanumeric, v => mobilePhonNumberCel(v)]" />
                  </div>

              </div>
              <div class="tw-w-full">
                  <label for="code" class="tw-text-label">Correo Electrónico del Remitente *</label>
                  <q-input outlined v-model="form.correo" label="Inserte" dense
                      :rules="[v => validationEmail(v), (val) => maxLengthInput(200, val), inputRequired]" />
              </div>
              <div class="tw-flex tw-full q-col-gutter-md tw-mt-0.5">
                  <div class="tw-w-1/2">
                      <p class="tw-text-label">Código del Proceso *</p>
                      <q-input outlined v-model="form.codigo" @blur="consultarCodigoProceso" label="Inserte" dense
                          :rules="[val => maxLengthInput(23, val), inputRequired, alphanumeric, v => /^[-\w\d]{12,}$/.test(v) || 'Mínimo deben ser 12 caracteres para poder continuar']">
                      </q-input>
                  </div>
                  <div class="tw-w-1/2">
                      <p class="tw-text-label">Fecha de Ingreso del Correo *</p>
                      <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa" :options="optionsDateFunc"
                          v-model:input-data-prop="form.fecha" @valida-fecha="emitValidation" :rules="[inputRequired]"
                          :error-message="'Debe seleccionar una fecha válida'" />
                  </div>
              </div>
              <div class="tw-flex tw-justify-center tw-p-10 q-gutter-x-md">
                    <q-btn label="Cancelar" style="width: 240px;height: 40px;" text-color="black" color="accent"
                        class="tw-rounded-xl" @click="cancelModal = true" />
                    <q-btn label="Guardar" :loading="loadingRadicar" @click="createRadicado" text-color="white"
                        style="width: 240px;height: 40px;" color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
              </div>
          </q-form>
      </q-card>


      <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
          text-button-cancel="No" @handleAccept="clear" cancel-button
          text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
          @close-modal="cancelModal = false" type="button" />
      <!-- <q-dialog v-model="showModal">
          <q-card class="q-py-xl q-px-xl tw'bg-none">
              <div class="tw-rounded-lg tw-flex tw-justify-center">
                  <span class="tw-rounded-[50px] tw-p-5 tw-flex tw-justify-center"
                      style="background-color: rgba(184, 184, 184, 0.05);">
                      <img :src="Check" alt="check" width="40">
                  </span>
              </div>
              <p class="tw-text-[24px] text-center tw-font-bold q-mt-lg">
                  ¡Éxito!
              </p>
              <p class="tw-text-[18px] text-center tw-mt-'">{{ text }}</p>
              <div class="tw-flex tw-justify-between tw-mt-8">
                  <q-btn class="tw-w-auto tw-h-10" color="white" flat text-color="black" @click="handleModal">
                      <span class="tw-px-5">Descargar radicado</span>
                  </q-btn>
                  <q-btn class="tw-w-auto tw-h-10 tw-ms-4" color="secondary" @click="clear">
                      <span class="tw-px-5">Finalizar</span>
                  </q-btn>

              </div>
          </q-card>
      </q-dialog> -->
      <Modal v-model="showModal" title="Radicación exitosa" :text="text" is-success text-button="Finalizar"
          @handleAccept="clear" cancel-button text-button-cancel="Descargar" @close-modal="handleModal" />
      <!-- <Modal v-model="showModal" title="Creación exitosa" :text="text" is-success text-button="Finalizar"
    @handleAccept="handleModal" persistent /> -->
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false"
          text-button="Aceptar" @handleAccept="handleModal" />
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { Ref, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import service from "src/services/Api";
import FileLoader from 'src/components/FormFields/FileLoader.vue'
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import TimePicker from 'components/FormFields/timePickerComponent.vue';
import {
  homePhoneNumber,
  phoneFormat,
  alphanumeric,
  onlyNumbers,
  mobilePhonNumberCel,
  validationEmail,
  maxLengthInput,
  inputRequired,
  minLengthInput,
  alphanumericWithPoint
} from 'src/helpers/validations';
import SearchInput from 'components/SearchInput/SearchInput.vue';
import {
  useCountries,
  useDepartments,
  useNewJuzgados,
  useCanales,
  useMunicipalities
} from "src/composables/useVersion";
import moment from "moment/moment"
import { DocumentoRadicado, ITutelaRadicado } from 'src/interfaces'
import { sgdeaAxios } from 'src/services';
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { toast } from "src/helpers/toast";

const MAX_FILE = 30

const props = withDefaults(defineProps<{
  listDocs: any[],
  download: (nodeId) => {},
  visualize: (nodeId, list) => {},
  detalleTutela: any,
  allValid: any
}>(), {
})

const auth = useAuthStore()
const q = useQuasar();
const route = useRoute()
const router = useRouter()
const emit = defineEmits(['cancelled', 'success'])

const radicado = ref()

function optionsDateFunc(date) {
  return date <= moment().format('YYYY/MM/DD')
}

const showModal = ref(false);
const errorModal = ref(false);
const createForm = ref();
const confirmModal = ref(false)
const cancelModal = ref(false)
const file = ref()
const text = ref('')
const loadingRadicar = ref(false)

const form: Ref<ITutelaRadicado | any> = ref({
  tramite: 'TUTELAS',
  canal: 'Correo electrónico',
  pais: { label: 'Colombia', value: 425 },
  departamento: '',
  municipio: '',
  nombre_juzgado: '',
  direccion: '',
  telefono: '',
  celular: '',
  correo: '',
  codigo: '',
  fecha: '',
  hora: '',
  descripcion: '',
  idRadicado: '',
  archivos: [],
  codigo_juzgado: '',
  idJuzgado: '',
  tutelaId: ''
});

// const { optionsJuzgados } = useNewJuzgados()
const optionsJuzgados = ref([]);
const opCodeJuz = ref([])
const optionsCode = ref()
onMounted(async () => {
  const { data } = (await sgdeaAxios.get("/juzgados/activos"));
  optionsJuzgados.value = data?.map((item: any) => ({
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
  opCodeJuz.value = data?.map((item) => ({
      label: item.codigo.toString(),
      id: item.idJuzgado,
      codigo: item.codigo,
      nombre: item.nombre,
      departamento: item.departamento,
      municipio: item.municipio,
      direccion: item.direccion,
      telefono: item.telefono,
      celular: item.celular,
      correo: item.correo,
      estado: item.estado,
      pais: item.pais,
      value: item.idJuzgado
  }))
  optionsCode.value = opCodeJuz.value
  opsCountry.value = optionsCountries.value
  currentInfoJuzgado(props.detalleTutela.juzgado)
  form.value.codigo = props.detalleTutela.codigoProceso
  form.value.fecha = moment(props.detalleTutela.fecha, "YYYY-MM-DD").format("DD-MM-YYYY")
  form.value.canal = props.detalleTutela.canal
  form.value.descripcion = props.detalleTutela.descripcion
  form.value.tutelaId = props.detalleTutela.idTutela
})



const { optionsCountries } = useCountries()
const opsCountry = ref([])
const departmentsList = ref([])
const opsDep = ref([])
const validDepW = ref(true)
const municipiosListFiltered = ref([])
const opsMuni = ref([])
let municipiosListAll = []
const filesRadicar = ref()
const optionsCanales = ref([
  'Correo electrónico',
  'Página web',
  'Ventanilla'
])

onMounted(async () => {
  montarComponente()
})

const montarComponente = async () => {
  const { data } = await sgdeaAxios.get<string>('/generar/secuencia/TTL')
  form.value.idRadicado = data;
  const { optionsDepartments } = await useDepartments(form.value.pais.value);
  departmentsList.value = optionsDepartments.value;
  opsDep.value = optionsDepartments.value

}

const selectedJuzgado = ref()

const currentInfoJuzgado = async (data: any) => {
  validDepW.value = false
  form.value = {
      ...form.value,
      departamento: data.departamento,
      municipio: data.municipio,
      direccion: data.direccion,
      telefono: data.telefono,
      celular: data.celular,
      correo: data.correo,
      codigo_juzgado: data.value,
      idJuzgado: data.id
  }
  selectedJuzgado.value = data
  form.value.codigo_juzgado = data.codigo
  form.value.nombre_juzgado = data.nombre
  if(!form.value.idJuzgado){
    form.value.idJuzgado = data.idJuzgado
  }
  var idDepart = departmentsList.value.filter((item) => item.label == data.departamento)
  municipiosListFiltered.value = []
  const { optionsMunicipalities } = await useMunicipalities(idDepart[0].value);
  municipiosListFiltered.value = optionsMunicipalities.value;
  setTimeout(() => {
      validDepW.value = true
  }, 1000);
}
function showNotif(title: string) {
    toast.error(title)
}

const radicadoNumber = ref(0)
const nodeId = ref('')

const validate = ref({
  fecha: false,
  hora: false,
});

const emitValidation = ({ type, data }) => {
  validate.value[type] = data
}

const createRadicado = async () => {
  if (await radicado.value.validate()) {
      var dataBody = {
          tramite: form.value.tramite,
          canal: form.value.canal,
          idRadicado: props.detalleTutela.idRadicado,
          juzgado: {
              idJuzgado: form.value.idJuzgado,
              nombre: form.value.nombre_juzgado,
              direccion: form.value.direccion,
              pais: form.value.pais.label ? form.value.pais.label : form.value.pais,
              departamento: selectedJuzgado.value.departamento,
              municipio: selectedJuzgado.value.municipio,
              codigo: form.value.codigo_juzgado,
              telefono: form.value.telefono,
              celular: form.value.celular,
              correo: form.value.correo,
              estado: true
          },
          descripcion: form.value.descripcion,
          codigoProceso: form.value.codigo,
          hora: form.value.hora,
          fecha: moment(form.value.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          pais: form.value.pais.label ? form.value.pais.label : form.value.pais,
          departamento: form.value.departamento.label ? form.value.departamento.label : form.value.departamento,
          municipio: form.value.municipio.label ? form.value.municipio.label : form.value.municipio,
          tutelaId: props.detalleTutela.idTutela,
          estado: props.detalleTutela.estado
      }

      const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "*",
      "Content-Type": "multipart/form-data",
      "Content-Transfer-Encoding": "BINARY"
    }

    const formdata = new FormData();

    formdata.append('body', JSON.stringify(dataBody))

      const response = await sgdeaAxios.put('/tutela', formdata, {headers: headers})
      if(response.status == 200){
        crearTrazabilidad({
          proceso: "TUT" + props.detalleTutela.idTutela,
          secuencia: props.detalleTutela.idRadicado,
          estado: props.detalleTutela.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
              `Descripción: Se modificó el radicado de tutela`,
          comentario: 'Se modificó el radicado de tutela',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha modificado los datos del radicado de tutela ${props.detalleTutela.idRadicado}`,
          tramite: 'Tutela',
        })
        toast.success('Se realizó exitosamente la modificación')
        emit('success')
      }

  } else {
      toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
  }
}

const routes = [
  {
      name: 'Inicio',
      to: '/home'
  },
  {
      name: 'Módulo SGDEA',
  },
  {
      name: 'Clasificación documental',
  },
  {
      name: 'Radicar tutela',
  }
]

const handleModal = async () => {
  if (showModal.value) {
    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${nodeId.value}`
    );

    const docRadicado = listDocs.list.entries?.find(
      (it) => {
        const entryName = it.entry.name;
        return entryName && entryName.startsWith(radicadoNumber.value);
      }
    );

      const { data } = await sgdeaAxios.get<DocumentoRadicado>(
          `/radicados/consultar_documento/${docRadicado.entry.id}`
      );
      const byteCharacters = atob(data.base64x);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = String(radicadoNumber.value);

      link.click();

      URL.revokeObjectURL(blobUrl);

      clear()
  } else {
      errorModal.value = false
  }
}

const filterFn = (val, update, abort) => {
  if (val === '') {
      update(() => {
          optionsCode.value = opCodeJuz.value
      })
      return
  }

  update(() => {
      const needle = val.toLocaleLowerCase()
      optionsCode.value = opCodeJuz.value.filter(v => v.label.toLocaleLowerCase().indexOf(needle) > -1)
  })
}

const handleFileUpload = (event) => {
  filesRadicar.value = event
};

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === 'max-file-size')) {
      showNotif('El peso permitido es hasta 50MB.')
  }
  if (error.some((it) => it.failedPropValidation === 'max-files')) {
      showNotif(`Solo se pueden adjuntar ${MAX_FILE} archivos.`)
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
      showNotif('Formato inválido, los formatos permitidos son (pdf, png, jpg, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, jpeg, bmp, zip, rar, ppt, pptx).')
  }
}

const consultarCodigoProceso = async () => {
  try {
      const getJuzgado = (await sgdeaAxios.get(`/juzgados/obtenerJuzgadoXCodigo/${form.value.codigo}`));
      if (getJuzgado) {
          form.value = {
              ...form.value,
              departamento: getJuzgado.data.departamento,
              municipio: getJuzgado.data.municipio,
              direccion: getJuzgado.data.direccion,
              telefono: getJuzgado.data.telefono,
              celular: getJuzgado.data.celular,
              correo: getJuzgado.data.correo,
              codigo_juzgado: getJuzgado.data.codigo,
              idJuzgado: getJuzgado.data.id,
              nombre_juzgado: getJuzgado.data.nombre
          }
      }
  } catch (error) {
      console.error(error);
  }
}

const clear = async () => {
  emit('cancelled')
}

// watch(
//     () => form.value.archivos,
//     (value) => {
//     }
// )

watch(
  () => form.value.pais.value,
  async (value) => {
      form.value.departamento = ''
      form.value.municipio = ''
      const { optionsDepartments } = await useDepartments(value);
      departmentsList.value = optionsDepartments.value;
      opsDep.value = departmentsList.value
      if (departmentsList.value.length == 0) {
          form.value.departamento = form.value.pais.label
          form.value.municipio = form.value.pais.label
      }
  }
);

watch(
  () => form.value.departamento.value,
  async (value) => {
      if (validDepW.value) {
          municipiosListFiltered.value = []
          form.value.municipio = ''
          const { optionsMunicipalities } = await useMunicipalities(value);
          municipiosListFiltered.value = optionsMunicipalities.value;
          opsMuni.value = municipiosListFiltered.value
          if (municipiosListFiltered.value.length == 0) {
              form.value.municipio = form.value.pais.label
          }
      }

  }
);

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const filterPais = (val, update) => {
  if (val === '') {
      update(() => {
          optionsCountries.value = opsCountry.value
      })
      return
  }

  const needle = normalizeString(val);
  update(() => {
      optionsCountries.value = opsCountry.value.filter(v => {
          return normalizeString(v.label).indexOf(needle) > -1;
      });
  });
}

const filterDep = (val, update) => {
  if (val === '') {
      update(() => {
          departmentsList.value = opsDep.value
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

</script>

<style lang="scss">
.alert-error {
  background-color: #ffdbdb;
  border: 1px solid red;
}

.container-buttons {
  display: flex;
  justify-content: center;
  margin-top: 180px;
}
</style>
