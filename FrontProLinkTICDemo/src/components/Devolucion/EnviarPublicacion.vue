<template>
  <section>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl q-py-md tw-flex-1 q-px-md">
        Enviar a Publicación
      </h3>
      <div class="tw-bg-white q-mt-lg tw-rounded-md">
        <div
          class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row"
        >
          <div
            class="width-container tw-w-1/2 q-px-sm tw-rounded-xl overflow-hidden"
            style="border: 1px solid #e3e4e5"
          >
            <q-table
              v-model:selected="selection"
              :columns="columnsAsignar2"
              :filter="filterValue"
              :rows="listUsersOriginal"
              :rows-per-page-options="[8]"
              class="sizes q-mr-md tableclass"
              clearSelection
              color="primary"
              flat
              row-key="id"
              rows-per-page-label="Páginas"
              selection="single"
              style="
                margin: 0 auto;
                border-radius: 15px;
                min-height: auto;
                max-height: 400px;
                overflow: hidden;
              "
              table-header-class="text-black text-h6 "
              virtual-scroll
              @update:selected="handleAssign"
              @row-dblclick="dblclickReasignar"
            >
              <template
                v-slot:body-cell-colaborador="props"
                :draggable="true"
                auto-width
              >
                <td
                  :draggable="true"
                  class="tw-text-center"
                  @dragstart="dragAsignar(props.row)"
                >
                  {{ props.row.colaborador }}
                </td>
              </template>
              <template v-slot:top>
                <span
                  class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                >
                  Usuario que desea asignar
                </span>
                <div class="row tw-justify-center tw-w-full">
                  <span class="tw-text-base tw-font-bold tw-mt-3 tw-w-full"
                    >Filtrar por Usuario</span
                  >
                  <q-select
                    v-model="selectOficina"
                    :options="filteredOffices"
                    class="tw-w-full tw-overflow-hidden tw-text-nowrap tw-text-ellipsis"
                    dense
                    fill-input
                    hide-selected
                    input-debounce="0"
                    outlined
                    use-input
                    @filter="selectOptionsFilter"
                  />
                </div>
              </template>
            </q-table>
          </div>
          <div
            class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
            style="border: 1px solid #e3e4e5"
            @drop="dropAsignar()"
            @dragover.prevent
          >
            <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
              Este es el usuario que ha seleccionado
            </span>
            <div class="flex wrap tw-gap-3 q-pt-sm">
              <div v-for="(asign, index) in cardsAsignar" :key="index">
                <div
                  v-if="asign.visible"
                  class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                  style="border: 1px solid #e3e4e5"
                >
                  <q-icon name="person_outline" size="24px" />
                  {{ asign.name }}
                  <q-icon
                    class="tw-cursor-pointer"
                    name="close"
                    size="24px"
                    @click="removeCardAsignar(index)"
                  />
                </div>
              </div>
              <div
                v-if="cardsAsignar.length === 0"
                class="tw-text-red-500 text-weight-bold"
              >
                Debe seleccionar al menos un usuario
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md q-px-sm">
        Motivo de Asignación
      </h3>
      <q-form ref="formRef">
        <div class="row full-width wrap tw-justify-start justify-around">
          <div class="row full-width">
            <div class="col-12">
              <label class="q-px-md tw-text-label"
                >Observaciones *
                <q-input
                  v-model="form.observaciones"
                  :rules="[inputRequired, (v) => maxLengthInput(10000, v)]"
                  dense
                  emit-value
                  label="Inserte"
                  outlined
                  type="textarea"
                />
              </label>
            </div>
          </div>
        </div>
        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn
            class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
            label="Cancelar"
            no-caps
            style="border: 1px solid #2c3948"
            @click="() => $emit('backView')"
          />
          <q-btn
            class="tw-w-1/4 tw-h-11 bg-primary text-white"
            label="Asignar"
            @click="confirmAsignar"
          />
        </div>
      </q-form>
    </div>
  </section>
  <Modal
    v-model="confirmModal"
    :cancelButton="true"
    :is-success="true"
    persistent
    text="a"
    text-button="Si"
    textButtonCancel="No"
    title="Confirmación"
    @closeModal="confirmModal = false"
    @handleAccept="confirmAsignar"
  />
</template>
<script lang="ts" setup>
import { onBeforeUpdate, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import Modal from "components/Modal/Modal.vue";

import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from "src/services";

const router = useRouter();
const cardsAsignar = ref([]);
const listUsersOriginal = ref([]);
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const formRef = ref();
const confirmModal = ref(false);
const filterValue = ref("");
const selectOficina = ref("");
const oficinas = ref([]);
const filteredOffices = ref([]);
const filteredRows = ref(listUsersOriginal.value);
const selection = ref([]);
const publicador = ref();
const initialSet = ref(false);
const form = ref({
  observaciones: "",
  usuarios: [],
});
const props = withDefaults(
  defineProps<{
    typeFlujoSgda: string;
    idCaso: number;
    pathBandeja: string;
    detalleRadicado;
  }>(),
  {}
);

const emit = defineEmits(["backView"]);

const columnsAsignar2: any = [
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
  },
];

const flujoSgda = {
  "Correpondencia-Ventanilla": 1,
  "Comunicacion Normal": 2,
  "Comunicacion Masivo": 3,
  "Comunicacion Manual": 4,
  PQRD: 5,
  Tutelas: 6,
  "Entes de Control": 7,
  "Medicina Laboral": 8,
};

onMounted(async () => {
  getAllRegisters();
});

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
  selection.value.splice(index, 1);
};

watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = listUsersOriginal.value.filter((row) =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = listUsersOriginal.value;
  }
});

watch(
  () => selectOficina.value,
  async (newValue: any, oldValue: any) => {
    if (newValue !== oldValue) {
      listUsersOriginal.value = [];
      const { data } = await sgdeaAxios.get(
        `/api/usuarios/rolYoficina?rolName=Publicador${
          newValue.value ? "&oficinaId=" + newValue.value : ""
        }`
      );

      listUsersOriginal.value = data
        .filter((item) => item.id !== userInfo.value.userid)
        .map((item) => ({
          colaborador: item.firstname + " " + item.lastname,
          enabled: item.enabled,
          id: item.id,
          user: item.userName,
          cargo: item.cargo,
          grupo: newValue.label,
        }))
        .sort((a, b) => a.colaborador.localeCompare(b.colaborador));
    }
  }
);

const selectOptionsFilter = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredOffices.value = oficinas.value;
    });
    return;
  }
  update(() => {
    filteredOffices.value = oficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

async function getAllRegisters() {
  try {
    userInfo.value = await getUserInfo();
    const { data: oficinasAll } = await sgdeaAxios.get(
      "/oficinas/oficinasSeries"
    );
    oficinas.value = oficinasAll
      .filter((e) => e.origen === "oficina")
      .map((item) => ({
        label: item.nombre,
        value: item.id_dependencia,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    filteredOffices.value = oficinas.value;
    selectOficina.value = oficinas.value.find(
      (it) => it.value === userInfo.value.oficina
    );

    const { data: publicadores } = await sgdeaAxios.get(
      `/api/usuarios/rolYoficina?rolName=Publicador`
    );
    listUsersOriginal.value = publicadores
      .map((item) => ({
        colaborador: item.firstname + " " + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo,
        grupo: item.usuarioRelaciones[0]?.oficina?.nombre,
      }))
      .sort((a, b) => a.colaborador.localeCompare(b.colaborador));

    //TODO:obtener publicador
    // publicador.value =
  } catch (error) {
    console.error(error);
  }
}

const confirmAsignar = async () => {
  try {
    if (!(await formRef.value.validate())) {
      toast.error(
        "Para continuar, asegúrese de que todos los campos requeridos estén completos"
      );
      return;
    }

    if (cardsAsignar.value.length === 0) {
      toast.error("Debe seleccionar un usuario para completar la acción");
      return;
    }

    const response = await sgdeaAxios.put("/publicacion/enviarPublicacion", {
      usuario: { id: userInfo.value.userid },
      publicador: { id: cardsAsignar.value[0].id },
      motivo: form.value.observaciones,
      idCaso: props.idCaso,
      flujoSgda: { id: flujoSgda[props.typeFlujoSgda] },
    });

    if (response.status == 200) {
      toast.success("La comunicación ha sido asignada con éxito");
      await router.push(props.pathBandeja);
      await crearTrazabilidad({
        proceso: `COR${props.detalleRadicado?.id}`,
        secuencia: props.detalleRadicado?.idRadicado,
        estado:
          props.detalleRadicado?.estadoProceso?.estado ||
          props.detalleRadicado?.estado?.estado,
        descripcion: `Usuario:${userInfo.value.name} Publicador:${cardsAsignar.value[0].name} Detalle:Se ha enviado a publicación`,
        comentario: "Se ha enviado a publicación",
        nombre: userInfo.value.name,
        tramite:
          props.detalleRadicado?.tipoTramite?.nombre || props.typeFlujoSgda,
        accion: `${userInfo.value.name}  envio a publicación el radicado ${props.detalleRadicado.idRadicado}`,
      });
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al momento de hacer la reasignación");
  }
};

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    id: item.id,
    visible: true,
    user: item.user,
  }));
};

const dblclickReasignar = (_, row) => {
  if (row) {
    const user = listUsersOriginal.value.find((it) => it.id === row.id);
    if (user) {
      cardsAsignar.value = [
        {
          id: user.id,
          name: user.colaborador,
          visible: true,
          user: user.user,
        },
      ];
      selection.value = [user];
    }
  }
};

const rowAsignar = ref();
const dragAsignar = (row) => {
  rowAsignar.value = row;
};
const dropAsignar = () => {
  const user = listUsersOriginal.value.find(
    (it) => it.id === rowAsignar.value.id
  );
  if (user) {
    cardsAsignar.value = [
      {
        id: user.id,
        name: user.colaborador,
        visible: true,
        user: user.user,
      },
    ];
    selection.value = [user];
  }
};

onBeforeUpdate(() => {
  if (publicador.value) {
    const userTable = listUsersOriginal.value.find(
      (it) => it.id == publicador.value
    );
    if (userTable !== selection.value[0] && !initialSet.value) {
      selection.value = [userTable];
      initialSet.value = true;
    }
  }
});
</script>
<style></style>
