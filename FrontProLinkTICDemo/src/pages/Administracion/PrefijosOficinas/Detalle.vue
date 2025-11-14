<template>
  <div>
    <RouterLink to="/administracion/admin-prefijos" class="text-primary q-mb-md" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver</b>
    </RouterLink>
    <div>
      <div class='tw-mb-6 tw-mt-4'>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">Edición Prefijo - Oficina</p>
      </div>
      <q-form ref="form" class="[&>*]:tw-mb-4" greedy>
        <q-card class="tw-px-8 tw-py-2 tw-pb-8 tw-rounded-xl" flat>
          <q-expansion-item label="Información General" default-opened
            header-class="tw-text-lg tw-font-bold tw-pl-0 tw-pb-6 tw-pt-4">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4 tw-gap-y-5">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Prefijo *</p>
                <q-select outlined v-model='formData.prefijo' label="Inserte" dense use-input fill-input hide-selected
                  filled disable>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Oficina</p>
                <q-select :options="listadoOficinas" outlined v-model='formData.oficina' label="Inserte" dense use-input
                  fill-input hide-selected filled disable map-options emit-value>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div :class="!formData.aprobacion_auto ? 'tw-col-span-2 tw-mt-2' : 'tw-col-span-3 tw-mt-2'">
                <p class="tw-text-label tw-font-semibold">Aprobación Automática</p>
                <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
                  v-model='formData.aprobacion_auto' label="Seleccione" dense map-options emit-value />
              </div>
              <div v-if="!formData.aprobacion_auto" class="tw-col-span-2 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Revisión Masiva</p>
                <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
                  v-model='formData.revision' label="Seleccione" dense map-options emit-value />
              </div>
              <div v-if="!formData.aprobacion_auto" class="tw-col-span-2 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Aprobación Masiva</p>
                <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
                  v-model='formData.aprobacion_masiva' label="Seleccione" dense map-options emit-value />
              </div>
              <div class="tw-col-span-3 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Tipo de firma</p>
                <q-select :options="opsFirmas" outlined v-model='formData.firma' label="Seleccione" dense map-options
                  emit-value />
              </div>
              <div :class="!formData.aprobacion_auto ? 'tw-col-span-3 tw-mt-2' : 'tw-col-span-6 tw-mt-2'">
                <p class="tw-text-label tw-font-semibold">Plantilla</p>
                <q-select :options="opsPlatillas" outlined v-model='formData.tipoPlantilla' label="Seleccione" dense
                  map-options emit-value />
              </div>
              <div class="tw-col-span-3 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Proceso</p>
                <q-select v-model="formData.proceso" :options="listProcesos" label="Seleccione" dense outlined
                  class="tw-rounded-lg" map-options>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="tw-col-span-3 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Subproceso</p>
                <q-select v-model="formData.subproceso" :options="listSubProcesos" label="Seleccione" dense outlined
                  class="tw-rounded-lg" map-options :rules="[inputRequired]">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="tw-col-span-3 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Estado *</p>
                <q-toggle v-model="formData.estado" />
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
      <q-form ref="asignarRef" v-if="!!formData.aprobacion_auto === true">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Aprobador
                </h3>
              </div>
            </template>
            <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
              <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                  <TableAprobador :TABLE_BODY="listUsers" :TABLE_HEADER="columns" :listadoOficinas="originalListUsers"
                    @update:item-selected="handleAssign" row-key="colaborador" :is-selection="false"
                    :mySelection="tableSelection" type-selection="single" :filtered="filterUser"
                    @update:officeSelected="filterUser" />
                </div>
                <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5">
                  <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                    Estos son los usuarios que ha seleccionado
                  </span>
                  <div class="flex wrap tw-gap-3 q-pt-sm">
                    <div v-for="(asign, index) in cardsAsignar" :key="index">
                      <div v-if="asign.visible"
                        class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                        style="border: 1px solid #e3e4e5">
                        <q-icon size="24px" name="person_outline" />
                        {{ asign.name }}
                        <q-icon class="tw-cursor-pointer" size="24px" name="close"
                          @click="removeCardAsignar(asign.user)" />
                      </div>
                    </div>
                  </div>

                  <div v-if="cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
                    Debe seleccionar al menos un usuario
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </div>

    <div class="col col-12 row justify-center tw-w-full tw-m-[10px] tw-mt-8 tw-flex tw-gap-4">
      <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3 tw-w-[200px]" outline
        @click="cancelModal = true" />
      <q-btn type="submit" label="Guardar" @click="submit" color="primary" textColor="white"
        class="tw-rounded-xl tw-w-[200px] tw-h-10" :loading="handleSubmitIsLoading" />
    </div>

    <Modal v-model="cancelModal" title="Confirmación" :is-success="false"
      @handleAccept="router.push('/administracion/admin-prefijos')" cancel-button textButtonCancel="No" textButton="Si"
      :text="`¿Está seguro de cancelar la edición del prefijo ${formData.prefijo} en la oficina ${formData.oficinaLabel}?`"
      @close-modal="cancelModal = false" type="button" />
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, watch } from 'vue';
import { intescoAxios, sgdeaAxios } from 'src/services';
import { toast } from "src/helpers/toast";
import Modal from "components/Modal/Modal.vue";
import TableAprobador from "./TableAprobador.vue";
import { useAuthStore } from "src/stores/auth.store";
import { sortOptions } from "src/helpers/sortOptions";
import { inputRequired } from "src/helpers/validations";

const handleSubmitIsLoading = ref<boolean>(false)
const formData = ref({
  prefijo: '',
  oficina: '',
  oficinaLabel: '',
  revision: '',
  aprobacion_auto: '',
  aprobacion_masiva: '',
  firma: '',
  estado: false,
  tipoPlantilla: '',
  proceso: null,
  subproceso: null
})

const router = useRouter()
const route = useRoute();
const auth = useAuthStore()
const form = ref()
const cancelModal = ref(false)
const listadoOficinas = ref()
const opsFirmas = ref([])
const opsPlatillas = ref([])
const listUsers = ref([]);
const cardsAsignar = ref([]);
const tableSelection = ref([])
const originalListUsers = ref([])
const isOffice = ref(false)
const asignarUsuarioBody = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: ''
})
const aprobador = ref([])
const listProcesos = ref([]);
const listSubProcesos = ref([]);
const listSubProcesosFull = ref([]);
const opsPlatillasStatic = ref([])
const isGet = ref(false)

const columns = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    sortable: true,
    align: "center",
  },
  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    sortable: true,
    align: "center",
  },
  {
    name: "grupo",
    label: "Grupo",
    field: "grupo",
    sortable: true,
    align: "center",
  }
];

onMounted(async () => {
  // @ts-expect-error
  await Promise.allSettled([
    getPrefijoById(),
    loadOficinas(),
    loadFirmas(),
    getPlantillas(),
    getProcesos(),
    loadUsers(undefined, true),
  ])
  originalListUsers.value = listUsers.value
})

const getPrefijoById = async () => {
  try {
    const { data } = await sgdeaAxios.get(`/medicina/prefijo-oficina/${route.params.id}`);
    formData.value = {
      prefijo: data?.prefijo?.nombre,
      oficina: data?.oficina?.id,
      oficinaLabel: data?.oficina?.nombre,
      revision: data.revisionMasiva,
      aprobacion_auto: data?.aprobacionAutomatica,
      aprobacion_masiva: data?.aprobacionMasiva,
      firma: data?.tipoFirma?.id,
      estado: data.activo,
      tipoPlantilla: data.plantilla,
      proceso: data?.subProceso?.proceso?.proceso ? { label: data?.subProceso?.proceso?.proceso, value: data?.subProceso?.proceso?.id } : '',
      subproceso: data?.subProceso?.subProceso ? { label: data?.subProceso?.subProceso, value: data?.subProceso?.id } : '',
    }
    aprobador.value = data?.aprobador?.id
  } catch (error) {
    toast.error("Sucedió un error al cargar la información del prefijo")
  }
}

const loadOficinas = async () => {
  const response = await sgdeaAxios.get('oficinas/all')
  listadoOficinas.value = response.data.map((e) => {
    return {
      label: e.nombre,
      value: e.id,
    }
  })
  listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
}

const loadFirmas = async () => {
  try {
    const getFirmas = await sgdeaAxios.get('/medicina/tipos-firmas')
    opsFirmas.value = getFirmas.data.map((item) => ({
      label: item.tipoFirma,
      value: item.id,
    }))
  } catch (error) {
    toast.error("Hubo un error al cargar los tipos de firmas")
  }
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
    toast.error("Hubo un error al cargar la lista de procesos")
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
    }
  } catch (error) {
    console.error(error);
  }
}

const getPlantillas = async () => {
  try {
    const { data: getPlantillas } = await sgdeaAxios.get(`/radicados/obtenerHijosPorNodo/7b4a115f-7e94-4add-80a6-82078cc299a8`)
    opsPlatillas.value = getPlantillas.list.entries.map((item) => ({
      label: item.entry.name,
      value: item.entry.id
    }))

    opsPlatillasStatic.value = opsPlatillas.value
  } catch (error) {
    toast.error("Hubo un error al cargar las plantillas")
  }
}

const submit = async () => {
  if (await form.value.validate()) {
    if (cardsAsignar.value.length === 0 && formData.value.aprobacion_auto) {
      toast.error("Debe seleccionar un usuario para completar la acción")
      return
    }

    handleSubmitIsLoading.value = true;
    try {
      const revisionMasiva = !formData.value.aprobacion_masiva ? formData.value.revision : false;
      const aprobacionMasiva = !formData.value.aprobacion_masiva ? formData.value.aprobacion_masiva : false;
      const response = await sgdeaAxios.put(`/medicina/prefijo-oficina/${route.params.id}`, {
        aprobacionAutomatica: formData.value.aprobacion_auto,
        revisionMasiva,
        aprobacionMasiva,
        tipoFirma: formData.value.firma,
        plantilla: formData.value.tipoPlantilla,
        activo: formData.value.estado,
        aprobador: cardsAsignar.value[0]?.user,
        subProceso: formData.value.subproceso.value
      })
      if (response.status == 200) {
        toast.success(`Se Modificó correctamente el prefijo ${formData.value.prefijo} en la oficina ${formData.value.oficina}`)
        handleSubmitIsLoading.value = false;
        await router.push('/administracion/admin-prefijos')
      }
    } catch (error) {
      toast.error(error.response?.data?.message ?? 'Ha ocurrido un error.')
      handleSubmitIsLoading.value = false;
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos")
  }
}

const loadUsers = async (selectedOffice?: any, initial: boolean = false) => {
  try {
    if (initial) {
      isOffice.value = auth?.userInfo.oficina ? true : false
      const response = !isOffice.value
        ? await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${auth.userInfo.dependencia}?rolNames=Aprobador`)
        : await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador&oficinaId=${auth.userInfo.oficina}`)

      const findDependencia = auth.userInfo.relations.find((e) => { return e.idDependencia === auth.userInfo.dependencia })?.dependencia
      if (response.status == 200) {
        const users = response.data
        const res = users?.map((e) => {
          return {
            colaborador: e.firstname + ' ' + e.lastname,
            cargo: e.cargo,
            grupo: isOffice.value ? e.usuarioRelaciones.map((e) => { return e.oficina }).find((item) => { return item?.id == auth.userInfo.oficina })?.nombre : findDependencia,
            id: e.id,
          }
        })
        listUsers.value = [...listUsers.value, ...res]
        originalListUsers.value = [...listUsers.value, ...res]
      }
      return;
    }
    const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador&oficinaId=${selectedOffice}`)
    if (response.status == 200) {
      listUsers.value = response.data
      const res = listUsers.value.map((e) => {
        return {
          colaborador: e.firstname + ' ' + e.lastname,
          cargo: e.cargo,
          grupo: e.usuarioRelaciones.map((e) => { return e.oficina }).find((item) => { return item?.id == selectedOffice })?.nombre,
          id: e.id,
        }
      })
      listUsers.value = res
      originalListUsers.value = [...res]
    }
  } catch (error) {
    console.error(error);
  }
}

function filterUser(filterby) {
  if (filterby == '') {
    listUsers.value = originalListUsers.value
    return
  }
  listUsers.value = originalListUsers.value.filter((e) => e.colaborador == filterby)
}

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(item => item.id == user)
  tableSelection.value.splice(indexSelection, 1)
  const index = cardsAsignar.value.findIndex(card => card?.user === user);
  cardsAsignar.value.splice(index, 1);
};

const handleAssign = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = []
    asignarUsuarioBody.value.usuarioAsignado = '';
    asignarUsuarioBody.value.idUser = '';
  } else {
    cardsAsignar.value = array.map((item) => ({
      name: item.colaborador,
      visible: true,
      user: item.id
    }));
    tableSelection.value = array

    if (array.length > 0) {
      tableSelection.value = array
      const firstSelected = array[0];
      asignarUsuarioBody.value.usuarioAsignado = firstSelected.colaborador;
      asignarUsuarioBody.value.idUser = firstSelected.id;
    }
  }
};

watch(() => formData.value.oficina, async (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {
    cardsAsignar.value = [];
  }
})

watch(() => formData.value.aprobacion_auto, async (newValue) => {
  if (!newValue) {
    cardsAsignar.value = [];
    tableSelection.value = []
    // @ts-expect-error
    formData.value.aprobacion_masiva = false
    // @ts-expect-error
    formData.value.revision = false
    listUsers.value = originalListUsers.value
  }
})

watch(() => formData.value.proceso, (newValue) => {
  getSubProcesos(Number(newValue?.value))
  if (isGet.value) {
    formData.value.subproceso = ''
  }
  isGet.value = true
  form.value.reset()
})

</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
