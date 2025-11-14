<template>
  <div class="[&>*]:tw-mb-4">
    <section>
      <q-form ref="formMetadatos" greedy>
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Metadatos
                </h3>
              </div>
            </template>
            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-bold">Proceso Medicina Laboral *</p>
                  <q-select v-model="formData.proceso" :options="listProcesos" :rules="[inputRequired]"
                    label="Seleccione" dense outlined class="tw-rounded-lg" map-options>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-bold">Subproceso *</p>
                  <q-select v-model="formData.subProceso" :options="listSubProcesos" :rules="[inputRequired]"
                    label="Seleccione" dense outlined class="tw-rounded-lg" map-options>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-bold">Prefijo *</p>
                  <q-select v-model="formData.prefijo" :options="listPrefijo" :rules="[inputRequired]"
                    label="Seleccione" dense outlined class="tw-rounded-lg" map-options>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="row tw-p-2">
                <div class="col-sm-6 tw-p-2 tw-text-label tw-font-bold">
                  <p>Formato tiempo *</p>
                  <q-input v-model="formData.formatoFecha" :rules="[inputRequired]" dense outlined class="tw-rounded-lg"
                    disable filled />
                </div>
                <div class="col-sm-6 tw-p-2 tw-text-label tw-font-bold">
                  <p>Tiempo *</p>
                  <q-input v-model="formData.tiempo" :rules="[inputRequired]" dense outlined class="tw-rounded-lg"
                    disable filled />
                </div>
              </div>
              <div class="row tw-p-2">
                <DynamicFields :listFields="listFields" :alfanumFields="alfanumFields" :booleanFields="booleanFields" />
              </div>
            </div>

          </q-expansion-item>
        </q-card>
        <div class="justify-center tw-w-full tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
          <q-btn label="Cancelar" style="width: 240px; height: 40px" text-color="black" color="accent"
            class="tw-rounded-xl" @click="() => (showModal = true)" />
          <q-btn label="Guardar" text-color="white" @click="save" style="width: 240px; height: 40px" color="primary"
            class="tw-rounded-xl tw-btn tw-p-2" />
        </div>
      </q-form>
    </section>
  </div>

  <Modal v-model:model-value="showModal" title="¡Espera un momento!" text="Al cancelar el proceso perderá los datos
  ingresados en el formulario, ¿desea realizar la acción?" :is-success="false" textButtonCancel="No" cancel-button
    @handleAccept="emit('redirect')" text-button="Si" @close-modal="() => (showModal = false)" />
</template>

<script lang="ts" setup>
import {
  inputRequired,
} from "src/helpers/validations";
import { onMounted, ref, watch } from "vue";
import { sgdeaAxios } from "../../../services";
import { toast } from 'src/helpers/toast';
import Modal from "../../../components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { sortOptions } from "src/helpers/sortOptions";
import { Medicina, Metadatos as Meta } from "src/interfaces";
import DynamicFields from 'src/components/metadtos/DynamicFields/DynamicFields.vue'

const props = withDefaults(defineProps<{
  medicinaData: Medicina,
  metadatosInfo: Meta,
  metadatos: any
}>(), {})

const emit = defineEmits(['successSave', 'redirect'])
const formMetadatos = ref()
const auth = useAuthStore()
const showModal = ref(false);
const listProcesos = ref([]);
const listPrefijo = ref([])
const listSubProcesos = ref([]);
const listSubProcesosFull = ref([]);
const isGet = ref(false)
const listFields = ref([]);
const alfanumFields = ref([])
const booleanFields = ref([])
isGet.value = props.metadatosInfo !== null ? true : false

const formData = ref({
  proceso: '',
  subProceso: '',
  formatoFecha: '',
  tiempo: '',
  prefijo: ''
});

onMounted(async () => {
  await getProcesos()
  if (props.metadatosInfo) {
    formData.value = {
      // @ts-expect-error
      proceso: { label: props.metadatosInfo.process.proceso, value: props.metadatosInfo.process.id },
      // @ts-expect-error
      subProceso: { label: props.metadatosInfo.subProceso.subProceso, value: props.metadatosInfo.subProceso.id },
      formatoFecha: props.metadatosInfo.formatoFecha,
      tiempo: String(props.metadatosInfo.tiempo),
      // @ts-expect-error
      prefijo: { label: props.metadatosInfo.prefijoOficina.prefijo.nombre, value: props.metadatosInfo.prefijoOficina.id }
    }
  }
  await filterListsMetadatos()
})

async function filterListsMetadatos() {
  listFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 2)
  alfanumFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 1)
  booleanFields.value = await props.metadatos.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 3)
}


const getProcesos = async () => {
  try {
    const response = await sgdeaAxios.get('/medicina/listProceso')
    if (response.status === 200) {
      listProcesos.value = sortOptions(response.data.map((e) => {
        return {
          label: e.proceso,
          value: e.id,
        }
      }))
    }
  } catch (error) {
    console.error(error)
  }
}

const getPrefijo = async (subprocesoId: number) => {
  try {
    const response = await sgdeaAxios.post('/medicina/prefijo-oficina/filtrar', {
        subProceso: subprocesoId,
        idOficina: auth.$state.userInfo.oficina
      });
    if (response.status === 200) {
      if (response.data.content.length === 0) {
        listPrefijo.value = [{ label: "Sin prefijo", value: 1 }]
      } else {
        listPrefijo.value = sortOptions(response.data.content.map((e) => {
          return {
            label: e.prefijo.nombre,
            value: e.id,
          }
        }))
      }
    }
  } catch (error) {
    console.error(error)
    // Consider adding a default option here as well in case of an error
    listPrefijo.value = [{ label: "Sin prefijo", value: 1 }]
  }
}

const getSubProcesos = async (id: number) => {
  try {
    const response = await sgdeaAxios.get('/medicina/listSubProceso/', { params: { id: id } })
    if (response.status === 200) {
      listSubProcesosFull.value = response.data
      listSubProcesos.value = sortOptions(response.data.map((e) => {
        return {
          label: e.subProceso,
          value: e.id,
        }
      }))
    }else{

    }
  } catch (error) {
    console.error(error)
  }
}

watch(() => formData.value.proceso, (newValue) => {
  // @ts-expect-error
  getSubProcesos(Number(newValue.value))
  if (!isGet.value) {
    formData.value.subProceso = ''
    formData.value.prefijo = ''
    listPrefijo.value = []
  }
  formMetadatos.value.reset()
})


watch(() => formData.value.subProceso, async (value) => {
  // @ts-expect-error
  formData.value.prefijo = ''
  listPrefijo.value = []

  const filter = listSubProcesosFull.value.find((e) => { return e.id === value.value })
  // @ts-expect-error
  await getPrefijo(value.value)
  if (!isGet.value) {
    formData.value.prefijo = ''
    formData.value.formatoFecha = filter?.formatoFecha || ''
    formData.value.tiempo = filter?.tiempo;
  }

  isGet.value = false


   await getPrefijo(value.value)

})

async function getApi(endpoint, params, action) {
  try {
    let method;
    switch (action.toLowerCase()) {
      case 'post':
        method = 'post';
        break;
      case 'put':
        method = 'put';
        break;
    }
    const response = await sgdeaAxios[method](endpoint, null, { params })
    return response
  } catch (error) {
    toast.error("Ha ocurrido un error")
  }
}

async function registerTraza(action) {
  await crearTrazabilidad({
    proceso: "ML" + props.medicinaData.id,
    secuencia: props.medicinaData.idRadicado,
    estado: props.medicinaData.estado.estado,
    descripcion: `Usuario:${auth.$state.userInfo.name}` + `Proceso: ${formData.value.proceso.label}` + `SubProceso: ${formData.value.subProceso.label}` +
      `Formato: ${formData.value.formatoFecha}` + `Tiempo: ${formData.value.tiempo}` + `Prefijo: ${formData.value.prefijo.label}`,
    comentario: `Se han ${action} los metadatos de la radicación`,
    nombre: auth.$state.userInfo.name,
    accion: `${auth.$state.userInfo.name} ha ${action} los metadatos del radicado ${props.medicinaData.idRadicado}`,
    tramite: 'Medicina Laboral',
  })

}

async function save() {
  if (!(await formMetadatos.value.validate())) {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
    return;
  }

  const endpoint = !props.metadatosInfo ? '/medicina/crear-metadatos' : '/medicina/actualizar-metadatos'
  const action = !props.metadatosInfo ? 'post' : 'put'
  const prefijoId = formData.value.prefijo?.value || null

  const paramsAll = !props.metadatosInfo ? {
    idMl: props.medicinaData.id,
    // @ts-expect-error
    idSubProcess: formData.value.subProceso.value,
    prefijo: prefijoId
  }
    : {
      id: props.medicinaData.id,
      // @ts-expect-error
      idSubProcess: formData.value.subProceso.value,
      prefijo: prefijoId,
      usuario: auth.$state.userInfo.name
    }

  const response = await getApi(endpoint, paramsAll, action)

  if (response.status === 200) {
    const action = !props.metadatosInfo ? 'validado' : 'actualizado'
    const message = !props.metadatosInfo ? 'ingresados' : 'actualizados'
    if (endpoint === "/medicina/crear-metadatos") {
      await registerTraza(action)
    }

    toast.success(`Metadatos ${message} correctamente`)
    emit('successSave')
  }
}

</script>
