<template>
  <div>
    <RouterLink to="/administracion/admin-prefijos" class="text-primary q-mb-md" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver</b>
    </RouterLink>
    <div>
      <div class='tw-mb-6 tw-mt-4'>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">Crear Prefijo - Oficina</p>
      </div>
      <q-form ref="form" class="[&>*]:tw-mb-4" greedy>
        <q-card class="tw-px-8 tw-py-2 tw-pb-8 tw-rounded-xl" flat>
          <q-expansion-item label="Información General" default-opened
            header-class="tw-text-lg tw-font-bold tw-pl-0 tw-pb-6 tw-pt-4">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Prefijo *</p>
                <q-select :options="filteredPrefijos" outlined v-model='formData.prefijo' label="Inserte" dense
                  @filter="filterPrefijos" use-input fill-input hide-selected map-options emit-value
                  :rules="[inputRequired]">
                  <template v-slot:option="scope">
                    <q-item :class="scope.opt.asociado ? 'text-orange tw-bg-orange-50' : ''" v-bind="scope.itemProps">
                      <q-item-section>
                        {{ scope.opt.label }}
                      </q-item-section>
                    </q-item>
                  </template>
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
                <p class="tw-text-label tw-font-semibold">Oficina *</p>
                <q-select :options="filteredOficinas" outlined v-model='formData.oficina' label="Inserte" dense
                  @filter="filterOficinas" use-input fill-input hide-selected map-options emit-value
                  :rules="[inputRequired]">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div :class="isShow ? 'tw-col-span-2 tw-mt-2' : 'tw-col-span-3 tw-mt-2'">
                <p class="tw-text-label tw-font-semibold">Aprobación Automática *</p>
                <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
                  v-model='formData.aprobacion_auto' label="Seleccione" dense map-options emit-value
                  :rules="[inputRequired]" />
              </div>
              <div v-if="isShow" class="tw-col-span-2 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Revisión Masiva *</p>
                <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
                  v-model='formData.revision' label="Seleccione" dense map-options emit-value
                  :rules="[inputRequired]" />
              </div>
              <div v-if="isShow" class="tw-col-span-2 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Aprobación Masiva *</p>
                <q-select :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" outlined
                  v-model='formData.aprobacion_masiva' label="Seleccione" dense map-options emit-value
                  :rules="[inputRequired]" />
              </div>
              <div class="tw-col-span-3 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Tipo de firma *</p>
                <q-select :options="opsFirmas" outlined v-model='formData.firma' label="Seleccione" dense map-options
                  emit-value :rules="[inputRequired]" />
              </div>
              <div :class="isShow ? 'tw-col-span-3 tw-mt-2' : 'tw-col-span-6 tw-mt-2'">
                <p class="tw-text-label tw-font-semibold">Plantilla</p>
                <q-select :options="opsPlatillas" outlined @filter="filterPlantillas" use-input fill-input hide-selected
                  map-options emit-value v-model='formData.tipoPlantilla' label="Seleccione" dense />
              </div>
              <div :class="isShow ? 'tw-col-span-3 tw-mt-2' : 'tw-col-span-3 tw-mt-6'" v-if="isMedicinaLaboral">
                <p class="tw-text-label tw-font-semibold">Proceso *</p>
                <q-select v-model="formData.proceso" :options="listProcesos" :rules="isMedicinaLaboral ? [inputRequired] : []" label="Seleccione"
                  dense outlined class="tw-rounded-lg" map-options>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div :class="isShow ? 'tw-col-span-3 tw-mt-2' : 'tw-col-span-3 tw-mt-6'" v-if="isMedicinaLaboral">
                <p class="tw-text-label tw-font-semibold">Subproceso *</p>
                <q-select v-model="formData.subproceso" :options="listSubProcesos" :rules="isMedicinaLaboral ? [inputRequired] : []"
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
              <div class="tw-col-span-3 tw-mt-2">
                <p class="tw-text-label tw-font-semibold">Estado *</p>
                <q-toggle :modelValue="formData.estado" @update:modelValue="handleToggle" />
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
      <q-form v-if="!!formData.aprobacion_auto === true" ref="asignarRef">
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
                    :mySelection="tableSelection" type-selection="single" @update:officeSelected="filterUser" />
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

                    <div v-if="cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
                      Debe seleccionar al menos un usuario
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </div>

    <div class="col col-12 row justify-center tw-w-full tw-m-[10px] tw-mt-8 tw-flex tw-gap-4">
      <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-xl tw-p-3 tw-w-[200px]" outline
        @click="cancelModal = true" />
      <q-btn type="submit" label="Guardar" @click="submit" color="primary" textColor="white"
        class="tw-rounded-xl tw-w-[200px] tw-h-10" :loading="handleSubmitIsLoading" />
    </div>

    <Modal v-model="cancelModal" title="Confirmación" :is-success="false"
      @handleAccept="router.push('/administracion/admin-prefijos')" cancel-button textButtonCancel="No" textButton="Si"
      text="¿Está seguro de cancelar la asociación del prefijo y Oficinas en curso?" @close-modal="cancelModal = false"
      type="button" />

    <Modal v-model:model-value="changeState" title="Confirmación" persistent
      :text="`¿Está seguro de ${getDataProp ? 'activar' : 'inactivar'} el prefijo?`" :is-success="false"
      :cancelButton="true" @handle-accept="cambiarEstado" textButtonCancel="No" text-button="Si"
      @close-modal="changeState = false" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { onMounted, ref, watch } from 'vue';
import { intescoAxios, sgdeaAxios } from 'src/services';
import { toast } from "src/helpers/toast";
import Modal from "components/Modal/Modal.vue";
import TableAprobador from "./TableAprobador.vue";
import { useAuthStore } from "src/stores/auth.store";
import { inputRequired } from "src/helpers/validations";
import { sortOptions } from "src/helpers/sortOptions";

const isReadOnly = ref(false)
const handleSubmitIsLoading = ref<boolean>(false)
const formData = ref({
  prefijo: '',
  oficina: '',
  revision: '',
  aprobacion_auto: '',
  aprobacion_masiva: '',
  firma: '',
  estado: false,
  tipoPlantilla: '',
  proceso: '',
  subproceso: ''
})

const isShow = ref(true)
const changeState = ref(false)
const getDataProp = ref();
const router = useRouter()
const auth = useAuthStore()
const form = ref()
const cancelModal = ref(false)
const listadoPrefijos = ref()
const listadoPrefijosOfi = ref()
const listadoOficinas = ref()
const filteredOficinas = ref()
const filteredPrefijos = ref()
const listUsers = ref([]);
const cardsAsignar = ref([]);
const tableSelection = ref([])
const originalListUsers = ref([])
const opsFirmas = ref([])
const opsPlatillas = ref([])
const opsPlatillasStatic = ref([])
const asignarUsuarioBody = ref({
  usuarioAsignado: '',
  idUser: "",
  motivoAsignacion: '',
  usuarioConsolidador: ''
})
const listProcesos = ref([]);
const listSubProcesos = ref([]);
const listSubProcesosFull = ref([]);

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
    getPrefijos(),
    loadOficinas(),
    loadFirmas(),
    getPlantillas(),
    getProcesos(),
    loadUsers(undefined, true),
  ])

  filteredOficinas.value = listUsers.value.map((e: {
    colaborador: any; firstname: any; lastname: any; id: any;
  }) => {
    return {
      label: e.colaborador,
      value: e.id
    }
  })

  originalListUsers.value = listUsers.value
})

const getPrefijos = async () => {
  try {
    const response = await sgdeaAxios.get('/medicina/prefijos');
    const responsePrefijosOfi = await sgdeaAxios.get('/medicina/prefijo-oficina')

    listadoPrefijosOfi.value = responsePrefijosOfi.data.map((e) => {
      return {
        label: e.prefijo?.nombre,
        value: e.prefijo?.id,
        activo: e.activo,
        oficinaId: e.oficina?.id,
        oficina: e.oficina?.nombre
      }
    }).filter(e => e.value !== 1)

    listadoPrefijos.value = response.data.map((e) => {
      const findPrefijo = listadoPrefijosOfi.value.find(prefijo => prefijo.label === e.nombre)
      if (!e.nombre) return
      return {
        label: e.nombre,
        value: e.id,
        activo: e.activo,
        asociado: !!findPrefijo
      }
    }).filter(e => e.value !== 1)
  } catch (error) {
    toast.error("Hubo un error al cargar los prefijos")
  }
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
    toast.error("Hubo un error al cargar la lista de subprocesos")
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

const cambiarEstado = () => {
  formData.value.estado = !formData.value.estado
}

const handleToggle = (val) => {
  getDataProp.value = val
  changeState.value = true
}

const loadOficinas = async () => {
  const response = await sgdeaAxios.get('oficinas/all')

  listadoOficinas.value = response.data
    .filter((e) => e.id !== 14)
    .map((e) => {
      return {
        label: e.nombre,
        value: e.id,
      }
    }
    )

  // listadoOficinas.value = response.data.map((e) => {
  //   return {
  //     label: e.nombre,
  //     value: e.id,
  //   }
  // })



  // @ts-expect-error
  if (auth.userInfo.modulo === 'Medicina Laboral') {
    listadoOficinas.value = [
      { label: '5 GRUPO CENTRO DE EXCELENCIA', value: 7 },
      { label: '6 GRUPO CENTRO DE EXCELENCIA', value: 8 },
      { label: '5 GRUPO JUNTAS DE CALIFICACIÓN', value: 10 },
      { label: '6 GRUPO JUNTAS DE CALIFICACIÓN', value: 11 },
      { label: 'GERENCIA MÉDICA EXCELENCIA', value: 9 },
      { label: 'GERENCIA MEDICA JUNTAS', value: 12 },
      { label: 'Mesa Back Medicina Laboral', value: 13 },
    ]
  } else {
    listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
  }
}

const submit = async () => {
  const isValidate = await form.value.validate()
  if (cardsAsignar.value.length === 0 && formData.value.aprobacion_auto) {
    toast.error("Debe seleccionar un usuario para completar la acción")
    return
  }

  if (isValidate) {
    const prefijoWanted = listadoPrefijosOfi.value.find((e: { value: number; }) => { return e.value === +formData.value.prefijo })
    const prefijoName = listadoPrefijos.value.find((e: { value: number; }) => { return e.value === +formData.value.prefijo })?.label
    const validation = prefijoWanted?.oficinaId === +formData.value.oficina

    if (validation) {
      const message = prefijoWanted?.activo === true
        ? 'El prefijo que está intentando crear ya está asociado a la oficina y se encuentra activo'
        : 'El prefijo que está intentando crear ya está asociado a la oficina y se encuentra inactivo, si lo requiere puede activarlo'
      toast.error(message)
    }
    else {
      handleSubmitIsLoading.value = true;
      try {
        const response = await sgdeaAxios.post(`/medicina/prefijo-oficina`, {
          idPrefijo: formData.value.prefijo,
          idOficina: formData.value.oficina,
          revisionMasiva: formData.value.revision || false,
          aprobacionMasiva: formData.value.aprobacion_masiva || false,
          aprobacionAutomatica: formData.value.aprobacion_auto,
          estado: formData.value.estado,
          tipoFirma: formData.value.firma,
          plantilla: formData.value.tipoPlantilla,
          usuario: auth.userInfo.userid,
          aprobador: cardsAsignar.value ? cardsAsignar.value[0]?.user : null,
          // @ts-expect-error
          subProceso: formData.value.subproceso.value
        })
        if (response.status == 200) {
          toast.success(`Se asoció correctamente el prefijo ${prefijoName} a la oficina ${getLabelOffice(formData.value.oficina)}`)
          handleSubmitIsLoading.value = false;
          router.push('/administracion/admin-prefijos')
        }
      } catch (error) {
        toast.error(error.response?.data?.message ?? 'Ha ocurrido un error.')
        handleSubmitIsLoading.value = false;
      }
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos")
  }
}

const filterPrefijos = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredPrefijos.value = listadoPrefijos.value
    })
    return
  }
  update(() => {
    filteredPrefijos.value = listadoPrefijos.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterOficinas = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = listadoOficinas.value
    })
    return
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterPlantillas = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      opsPlatillas.value = opsPlatillasStatic.value
    })
    return
  }
  update(() => {
    opsPlatillas.value = opsPlatillasStatic.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const loadUsers = async (selectedOffice?: any, initial: boolean = false) => {
  try {
    if (initial) {
      const isOffice = auth.userInfo.oficina ? true : false
      const response = !isOffice
        ? await sgdeaAxios.get(`/api/usuarios/rolesYSeccionSubseccion/${auth.userInfo.dependencia}?rolNames=Aprobador`)
        : await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador&oficinaId=${auth.userInfo.oficina}`)

      const findDependencia = auth.userInfo.relations.find((e) => { return e.idDependencia === auth.userInfo.dependencia }).dependencia
      if (response.status == 200) {
        const users = response.data
        const res = users.map((e) => {
          return {
            colaborador: e.firstname + ' ' + e.lastname,
            cargo: e.cargo,
            grupo: isOffice ? e.usuarioRelaciones.map((e) => { return e.oficina }).find((item) => { return item?.id == auth.userInfo.oficina })?.nombre : findDependencia,
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
    toast.error("Hubo un error al cargar los usuarios");
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
  const index = cardsAsignar.value.findIndex(card => card.user === user);
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

const getLabelOffice = (id) => {
  return listadoOficinas.value.find((e) => e.value === id)?.label
}

const MEDICINA_LABORAL_OFFICES = [
  7,  // 3 GRUPO CENTRO DE EXCELENCIA
  8,  // 4 GRUPO CENTRO DE EXCELENCIA
  10, // 3 GRUPO JUNTAS DE CALIFICACIÓN
  11, // 4 GRUPO JUNTAS DE CALIFICACIÓN
  9,  // GERENCIA MÉDICA EXCELENCIA
  12, // GERENCIA MEDICA JUNTAS
  13  // Mesa Back Medicina Laboral
];
var isMedicinaLaboral = false;

watch(() => formData.value.oficina, async (newValue, oldValue) => {
  if (newValue && newValue !== oldValue) {

    isMedicinaLaboral = MEDICINA_LABORAL_OFFICES.includes(Number(newValue));

    await loadUsers(newValue, false)
    cardsAsignar.value = [];
  }
})

watch(() => formData.value.prefijo, (newValue) => {
  formData.value.estado = listadoPrefijos.value.find((e: { value: number; }) => { return e.value === +newValue })?.activo
})

watch(() => formData.value.aprobacion_auto, async (newValue) => {
  isReadOnly.value = false
  if (!newValue) {
    cardsAsignar.value = [];
    tableSelection.value = []
    // @ts-expect-error
    formData.value.aprobacion_masiva = false
    // @ts-expect-error
    formData.value.revision = false
    isReadOnly.value = true
    listUsers.value = originalListUsers.value
    isShow.value = true
  } else isShow.value = false
})

watch(() => formData.value.proceso, (newValue) => {
  // @ts-expect-error
  getSubProcesos(Number(newValue.value))
  formData.value.subproceso = ''
  form.value.reset()
})

</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
