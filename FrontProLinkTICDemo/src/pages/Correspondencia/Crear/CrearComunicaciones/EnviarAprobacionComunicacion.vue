<template>
    <div>
      <section>
        <q-form ref="asignarRef">
          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                    Enviar a Aprobación
                  </h3>
                </div>
              </template>
              <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
                <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                  <div class="width-container tw-w-1/2 q-px-md tw-rounded-xl" style="border: 1px solid #e3e4e5">
                    <br>
                    <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold tw-mt-2">
                      Seleccione los usuarios que desea asignar al radicado
                    </span> <br>
                    <span class="tw-text-[#000000b0] tw-font-semibold tw-pl-2">
                      Filtrar por Usuario
                    </span>
                    <q-select
                      v-model="aprobadores"
                      :options="filteredAprobadores"
                      use-input
                      fill-input
                      hide-selected
                      input-debounce="0"
                      @filter="selectOptionsFilterFn"
                      @update:model-value="onAprobadorSeleccionado"
                      outlined
                      dense
                      class="tw-w-full tw-pl-2"
                      placeholder="Seleccione"
                    >

                      <template #prepend>
                        <q-icon name="search" />
                      </template>

                      <template #no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <AsignarTable :TABLE_BODY="filteredUsers" :TABLE_HEADER="columnsAsignar"
                      :listadoOficinas="filteredOficinas" @update:item-selected="handleAssign" row-key="colaborador"
                      :is-selection="false" :mySelection="tableSelection" type-selection="single"
                      :filtered="filteredOficinas" @update:officeSelected="filterUser" />
                  </div>
                  <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                    style="border: 1px solid #e3e4e5">
                    <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                      Este es el usuario aprobador que ha seleccionado
                    </span>
                    <div v-if="!asignadorSeleccionadoID" class="tw-text-red-500 text-weight-bold">
                      Debe seleccionar al menos un usuario
                    </div>

                    <div class="flex wrap tw-gap-3 q-pt-sm">
                      <div v-for="(asign, index) in cardsAsignar" :key="index">
                        <div v-if="asign.visible"
                          class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                          style="border: 1px solid #e3e4e5">
                          <q-icon size="24px" name="person_outline" />
                          {{ asign.name }}
                          <q-icon class="tw-cursor-pointer" size="24px" name="close"
                            @click="removeCardAsignar(asignadorSeleccionadoID)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-card>

<!--          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>-->
<!--          <p class="tw-text-2xl tw-font-bold tw-pb-4 ">-->
<!--            Motivo de Asignación-->
<!--          </p>-->

<!--          <div class="col-12">-->
<!--            <label>Observaciones *</label>-->
<!--            <q-input type="textarea" outlined label="Inserte" dense emit-value v-model:model-value="observations"-->
<!--                :rules="[inputRequired, v => maxLengthInputCustom(1000, v, 'campo'), v => minLengthInputCustomAsignacion(10, v) ]" />-->
<!--          </div>-->
<!--        </q-card>-->

        </q-form>
      </section>
      <div class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
        <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
          class="tw-rounded-xl" @click="() => (showModal = true)" />
        <q-btn label="Enviar" text-color="white" @click="showModalAsigna" style="width: 240px; height: 40px"
          color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
      </div>
    </div>

    <Modal v-model:model-value="showModal" title="¡Espera un momento!"
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      :is-success="false" textButtonCancel="No" cancel-button @handleAccept="removeCardAsignar(asignadorSeleccionadoID)"
      text-button="Si" @close-modal="() => showModal = false" />

    <Modal v-model:model-value="showConfirmationModal" title="Confirmación"
      :text="`¿Está seguro que desea enviar el trámite para aprobación?`" :is-success="false" textButtonCancel="Cancelar"
      cancel-button @handleAccept="handleAcceptModal" text-button="Aceptar"
      @close-modal="() => (showConfirmationModal = false)" />
  </template>

  <script setup lang="ts">

  import AsignarTable from "src/pages/Correspondencia/ComunicacionMasiva/AsignarTable.vue";
  import { sgdeaAxios } from "src/services";
  import { onMounted, ref } from "vue";
  import { useQuasar } from "quasar";
  import { toast } from "src/helpers/toast";
  import { useRoute, useRouter } from "vue-router";
  import Modal from "src/components/Modal/Modal.vue";
  import { useAuthStore } from "src/stores/auth.store";
  import { inputRequired, maxLengthInputCustom,minLengthInputCustomAsignacion } from "src/helpers/validations";
  import { crearTrazabilidad } from "src/helpers/trazabilidad";

  const tableSelection = ref([])
  const q = useQuasar();
  const router = useRouter();
  const showModal = ref(false);
  const observations = ref('');
  const asignarRef = ref();
  const asignadorSeleccionadoID = ref()
  const showConfirmationModal = ref(false);
  const listadoOficinas = ref([])
  const originalListUsers = ref([])
  const auth = useAuthStore()
  const aprobadores = ref()
  const allAprobadores = ref([])
  const filteredUsers = ref([])
  const originOp = ref()
  const filteredAprobadores = ref()
  const props = withDefaults(defineProps<{
    idComunicacion: number
    expedienteData: any
  }>(), {
  })
const route = useRoute();
  const listUsers = ref([]);
  const cardsAsignar = ref([]);
  const totalUsers = ref([]);
  const filteredOficinas = ref()
  const asignarUsuarioBody = ref({
    usuarioAsignado: '',
    idUser: "",
    motivoAsignacion: '',
    usuarioConsolidador: ''
  })

  onMounted(async () => {
    await loadOficina()
    await loadUsers(undefined, true)
    filteredOficinas.value = listUsers.value.map((e: { firstname: any; lastname: any; id: any; }) => {
          return {
            label: '',
            value: e.id
          }
        })
    originalListUsers.value = listUsers.value
  })

  const loadOficina = async () => {
    try {
      const response = await sgdeaAxios.get("/pqrd/listadoOficinas")
      if (response.status == 200 || response.status == 201) {
        listadoOficinas.value = response.data.map((e: { nombre: any; id: any; }) => {
          return {
            label: e.nombre,
            value: e.id
          }
        })
        listadoOficinas.value = listadoOficinas.value.filter((e) => { return e.value !== 26 })
        //filteredOficinas.value = listadoOficinas.value
      }
    } catch (error) {
      console.error(error)
    }
  }

  function filterUser(filterby){
    listUsers.value = originalListUsers.value.filter((e) => e.id == filterby)
  }

  const loadUsers = async (selectedOffice?: any, initial: boolean = false) => {
    // const { relations } = auth.userInfo;
    try {
      // selectedOffice = 6
      // if (initial) {
      //   for (const oficina of relations) {
      //     if (oficina.oficina === "N/A") break;
      //    // selectedOffice = listadoOficinas.value.find((e) => e.label === oficina.dependencia)?.value;

      //     const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador&oficinaId=${selectedOffice}`)
      //     if (response.status === 200) {
      //       const users = response.data
      //       const res = users.map((e) => {
      //         return {
      //           colaborador: e.firstname + ' ' + e.lastname,
      //           cargo: e.cargo,
      //           grupo: e.usuarioRelaciones.map((e) => { return e.oficina }).find((item) => { return item?.id == selectedOffice })?.nombre,
      //           id: e.id,
      //         }
      //       })
      //       listUsers.value = [...listUsers.value, ...res]
      //       var opSelect = response.data.map((item) => ({
      //         label: item.firstname + item.lastname,
      //         value: item.id
      //       }))
      //       originOp.value = opSelect
      //       filteredAprobadores.value = opSelect
      //     }
      //   }
      //   return;
      // }
      const response = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador`)
      if (response.status == 200) {
        listUsers.value = response.data
        const res = listUsers.value.map((e) => {
          return {
            colaborador: e.firstname + ' ' + e.lastname,
            cargo: 'Aprobador',
            grupo: e.usuarioRelaciones[0]?.oficina?.nombre
                  || e.usuarioRelaciones[0]?.seccionSubSeccion?.nombre,
            id: e.id,
          }
        })
        var opSelect = response.data.map((item) => ({
          label: item.firstname + item.lastname,
          value: item.id
        }))
        listUsers.value = res;
        filteredUsers.value = [...res];
        originOp.value = opSelect;
        allAprobadores.value = opSelect;
        filteredAprobadores.value = [...opSelect];

      }
    } catch (error) {
      console.error(error)
    }
  }

  const columnsAsignar = [
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

  const removeCardAsignar = (user) => {
    const indexSelection = tableSelection.value.findIndex(item => item.id === user)
    tableSelection.value.splice(indexSelection, 1)
    const index = cardsAsignar.value.findIndex(card => card.user === user);
    cardsAsignar.value.splice(index, 1);

    showModal.value = false;
    observations.value = "";
    asignadorSeleccionadoID.value = "";
  };

const selectOptionsFilterFn = (val, update) => {
  if (val === '') {
    update(() => {
      filteredAprobadores.value = allAprobadores.value
      filteredUsers.value = listUsers.value
    })
    return
  }
  update(() => {
    filteredAprobadores.value = allAprobadores.value.filter((option) =>
      option.label.toLowerCase().includes(val.toLowerCase())
    )
    filteredUsers.value = listUsers.value.filter((user) =>
      user.colaborador.toLowerCase().includes(val.toLowerCase())
    )
  })
}
function onAprobadorSeleccionado(val) {
  if (!val) {
    filteredUsers.value = [...listUsers.value]
    return
  }
  filteredUsers.value = listUsers.value.filter(user => user.id === val.value)
}


  const handleAssign = (array: any[]) => {
    if (array.length === 0) {
      cardsAsignar.value = [];
      tableSelection.value = []
      asignarUsuarioBody.value.usuarioAsignado = '';
      asignarUsuarioBody.value.idUser = '';
      asignadorSeleccionadoID.value = "";
    } else {
      cardsAsignar.value = array.map((item) => ({
        name: item.colaborador,
        visible: true,
        user: item.id
      }));
      tableSelection.value = array
      asignadorSeleccionadoID.value = cardsAsignar.value[0].user

      if (array.length > 0) {
        tableSelection.value = array
        const firstSelected = array[0];
        asignarUsuarioBody.value.usuarioAsignado = firstSelected.colaborador;
        asignarUsuarioBody.value.idUser = firstSelected.id;
      }
    }
    totalUsers.value = cardsAsignar.value.map((e) => { return { label: e.name, value: e.user } })
  };

  const handleAcceptModal = async () => {
    try {

      const response = await sgdeaAxios.post(
        `/correspondencia/comunicacion/asignarAprobacion/${route.query.idTramite}`,
        {
          observaciones: observations.value,
          usuario: auth.userInfo.userid,
          asignador: asignadorSeleccionadoID.value
        }
      );

      if (response.status === 200) {
        showConfirmationModal.value = false; auth.userInfo.userid
        toast.success('El radicado ha sido enviado para aprobación con éxito');
        router.go(-1);
        await trazabilidad();

      }

    } catch (error) {
      const { message } = error.response.data
      if(message){
        toast.error(error.message);
      }
    }
  }

  const trazabilidad = async () => {
    try {
      await crearTrazabilidad({
        proceso: `COMIND${props.expedienteData.id}`,
        secuencia: props.expedienteData.idRadicado,
        estado: "Por aprobar",//props.expedienteData.estadoProceso,
        descripcion: `Usuario: ${auth.$state.userInfo.name} Descripción: Se envío a aprobación la comunicación `,
        comentario:  "Se envío a aprobación la comunicación",
        nombre: auth.$state.userInfo.name,
        tramite: props.expedienteData.tipoTramite,
        accion:  "Se envío a aprobación el radicado"
      });
    } catch (error) {
      console.error(`error en crear la trazabilidad al envíar a aprobación el radicado`);
    }
};

  const showModalAsigna = async() => {
    const { data: isExpediente } = await sgdeaAxios.post(`/correspondencia/${route.params.id}/expediente`)

    if (!isExpediente) {
      toast.error('Debe incluir las comunicaciones a un expediente antes de enviar a aprobar');
      return;
    }

    if (!(await asignarRef.value.validate())){
      toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
      return;
    }

    if (cardsAsignar.value.length === 0) {
      toast.error('Debe seleccionar un usuario para completar la acción');
      return;
    }

    showConfirmationModal.value = true;
  }
  </script>

