<template>
  <div>
    <section>
      <q-form ref="asignarRef">
        <q-card class="tw-rounded-xl tw-mt-4" flat>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-pt-2">
                Reasignación
              </h3>
            </template>
            <div class="tw-bg-white q-mt-sm">
              <div
                class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex"
              >
                <div
                  class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
                  style="border: 1px solid #e3e4e5"
                >
                  <TableAsignar
                    :TABLE_BODY="listOffice"
                    :TABLE_HEADER="columnsAsignar"
                    @update:dragEvent="dragGestor"
                    @update:handleDblClickEvent="handleDoubleClickEvent"
                    :listado-offices="filteredOffice"
                    @update:item-selected="handleAssign"
                    row-key="id"
                    :is-selection="false"
                    type-selection="single"
                    @update:office-selected="filterItem"
                  />
                </div>

                <div
                  class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                  style="border: 1px solid #e3e4e5"
                  @dragover.prevent
                  @drop="dropGestor()"
                >
                  <span
                    class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
                  >
                    Esta es la oficina que ha seleccionado
                  </span>

                  <div class="flex wrap tw-gap-3 q-pt-sm">
                    <div v-for="(asign, index) in cardsAsignar" :key="index">
                      <div
                        v-if="asign.visible"
                        class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                        style="border: 1px solid #e3e4e5"
                      >
                        <q-icon size="24px" name="person_outline" />
                        {{ asign.name }}
                        <q-icon
                          class="tw-cursor-pointer"
                          size="24px"
                          name="close"
                          @click="removeCardAsignar(asign.user)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md tw-pt-2">
                Motivo de Reasignación
              </h3>
            </template>
            <div class="tw-bg-white q-mt-sm tw-px-8 tw-pb-2">
              <div class="row full-width wrap tw-justify-start justify-around">
                <div class="col-12">
                  <label class="tw-text-label"
                    >Observaciones *
                    <q-input
                      type="textarea"
                      outlined
                      label="Inserte"
                      dense
                      emit-value
                      v-model="asignarUsuarioBody.motivoAsignacion"
                      :rules="[
                        (v) => inputRequired(v),
                        (v) => maxLengthInput(10000, v),
                        (v) => minLengthInput(10, v),
                      ]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </section>

    <div class="justify-center tw-flex tw-gap-4 tw-w-full tw-mt-6">
      <q-btn
        label="Cancelar"
        type="reset"
        text-color="black"
        color="accent"
        class="tw-rounded-xl tw-h-11 tw-w-44"
        @click="() => (showModal = true)"
      />
      <q-btn
        label="Reasignar"
        text-color="white"
        @click="showModalAsigna"
        color="primary"
        class="tw-rounded-xl tw-h-11 tw-w-44"
      />
    </div>
  </div>

  <Modal
    v-model:model-value="showModal"
    title="¡Espera un momento!"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="emit('redirect')"
    text-button="Si"
    @close-modal="() => (showModal = false)"
  />

  <Modal
    v-model:model-value="showModalConfirm"
    title="¡Espera un momento!"
    :text="`¿Está seguro de reasignar el radicado ${
      data.idRadicado ?? data.sec ?? data.nroRadicado
    } a la oficina ${asignarUsuarioBody.oficinaAsignada}?`"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="saveData"
    text-button="Si"
    @close-modal="() => (showModalConfirm = false)"
  />
</template>

<script lang="ts" setup>
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { onMounted, ref } from "vue";
import TableAsignar from "./TableReasignar.vue";
import { columnsAsignar } from ".";
import { useAuthStore } from "src/stores/auth.store";
const auth = useAuthStore();

const props = withDefaults(
  defineProps<{
    data: any;
    module?: string;
  }>(),
  {}
);

const emit = defineEmits(["handleAcceptModal", "redirect"]);
const tableSelection = ref([]);
const showModal = ref(false);
const showModalConfirm = ref(false);
const asignarRef = ref();
const listOffice = ref([]);
const cardsAsignar = ref([]);
const totalUsers = ref([]);
const filteredOffice = ref();
const originalListUser = ref();
const asignarUsuarioBody = ref({
  oficinaAsignada: "",
  oficinaId: "",
  motivoAsignacion: "",
  origen: "",
});
const rowGestor = ref();

onMounted(async () => {
  await loadOffice();
});

const dragGestor = (row: any) => {
  rowGestor.value = row;
};

const dropGestor = () => {
  const user = listOffice.value.find(
    (element) => element.id === rowGestor.value.id
  );
  const isCardsAsignarEmpty = !cardsAsignar.value.find(
    (element) => element.user === user.id
  );
  if (user && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: user.id,
      name: user.oficinas,
      visible: true,
    });
  }
};

const handleDoubleClickEvent = (row: any) => {
  const office = listOffice.value.find((element) => element.id === row.id);
  const isCardsAsignarEmpty = !cardsAsignar.value.find(
    (element) => element.office === office.id
  );
  if (office && isCardsAsignarEmpty) {
    cardsAsignar.value.push({
      user: office.id,
      name: office.oficinas,
      visible: true,
    });
  }
};

const loadOffice = async () => {
  try {
    //const response = await sgdeaAxios.get(`/pqrd/listadoOficinas?tipo=0`) // Anteriormente usado
    const response = await sgdeaAxios.get("/oficinas/oficinasSeries");
    const excludedOffices = [
      "N/A",
      "5 GRUPO CENTRO DE EXCELENCIA",
      "6 GRUPO CENTRO DE EXCELENCIA",
      "5 GRUPO JUNTAS DE CALIFICACIÓN",
      "6 GRUPO JUNTAS DE CALIFICACIÓN",
      "GERENCIA MEDICA JUNTAS",
      "GERENCIA MEDICA EXCELENCIA",
    ];

    const includeOffice = [
      "5 GRUPO CENTRO DE EXCELENCIA",
      "6 GRUPO CENTRO DE EXCELENCIA",
      "5 GRUPO JUNTAS DE CALIFICACIÓN",
      "6 GRUPO JUNTAS DE CALIFICACIÓN",
      "GERENCIA MEDICA JUNTAS",
      "GERENCIA MEDICA EXCELENCIA",
      "Mesa Back Medicina Laboral",
    ];
    const officeList = response.data
      .map((e) => {
        return {
          label: e.nombre,
          value: e.id_original,
        };
      })
      .filter((e: { value: number }) => e.value !== auth.userInfo.oficina) // Se excluye oficina del usuario actual
      .filter((e) => !excludedOffices.includes(e.label.trim())) // Excluir oficinas que no apliquen
      .sort((a, b) => a.label.localeCompare(b.label));
    const res = response.data
      .map((e) => {
        return {
          oficinas: e.nombre,
          id: e.id_original,
          origen: e.origen,
        };
      })
      .filter((e: { value: number }) => e.value !== auth.userInfo.oficina) // Se excluye oficina del usuario actual
      .filter((e) => !excludedOffices.includes(e.oficinas.trim())) // Excluir oficinas que no apliquen
      .sort((a, b) => a.oficinas.localeCompare(b.oficinas));

    if (
      props.module === "Medicina Laboral" &&
      auth.userInfo.role.toLowerCase() === "asignador responsable"
    ) {
      const oficinasFiltradas = response.data.filter(
        (e) =>
          includeOffice.includes(e.nombre?.trim()) &&
          e.id_original !== auth.userInfo.oficina
      );

      // Para el componente que usa label/value
      filteredOffice.value = oficinasFiltradas.map((e) => ({
        label: e.nombre,
        value: e.id_original,
      }));

      // Para el componente que usa oficinas/id
      listOffice.value = oficinasFiltradas.map((e) => ({
        oficinas: e.nombre,
        id: e.id_original,
      }));

      originalListUser.value = listOffice.value;
    } else {
      const oficinasFiltradas = response.data
        .filter((e) => e.origen === "oficina")
        .filter((e) => e.id_original !== auth.userInfo.oficina)
        .filter((e) => !excludedOffices.includes(e.nombre?.trim()));

      listOffice.value = oficinasFiltradas.map((e) => ({
        oficinas: e.nombre,
        id: e.id_original,
        origen: e.origen,
      }));

      filteredOffice.value = oficinasFiltradas.map((e) => ({
        label: e.nombre,
        value: e.id_original,
      }));

      originalListUser.value = listOffice.value;

    }
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las oficinas");
  }
};

const removeCardAsignar = (user) => {
  const indexSelection = tableSelection.value.findIndex(
    (item) => item.id == user
  );
  tableSelection.value.splice(indexSelection, 1);
  const newCardsAsignar = cardsAsignar.value.filter(
    (card) => card.user !== user
  );
  cardsAsignar.value = newCardsAsignar;
  totalUsers.value = newCardsAsignar.map((e) => {
    return { label: e.name, value: e.user };
  });
};

const handleAssign = (array: any[]) => {
  if (array.length === 0) {
    cardsAsignar.value = [];
    tableSelection.value = [];
    asignarUsuarioBody.value.oficinaAsignada = "";
    asignarUsuarioBody.value.oficinaId = "";
  } else {
    cardsAsignar.value = array.map((item) => ({
      name: item.oficinas,
      visible: true,
      user: item.id,
    }));
    tableSelection.value = array;

    if (array.length > 0) {
      tableSelection.value = array;
      const firstSelected = array[0];
      asignarUsuarioBody.value.oficinaAsignada = firstSelected.oficinas;
      asignarUsuarioBody.value.oficinaId = firstSelected.id;
      asignarUsuarioBody.value.origen = firstSelected.origen;
    }
  }
  totalUsers.value = cardsAsignar.value.map((e) => {
    return { label: e.name, value: e.user };
  });
};

function filterItem(filterby) {
  if (!filterby || (!filterby.value && !filterby.label)) {
    listOffice.value = originalListUser.value;
    return;
  }

  const val = filterby.value?.toString().toLowerCase();
  const label = filterby.label?.toLowerCase();

  listOffice.value = originalListUser.value.filter((e) => {
    return (
      e.id?.toString().toLowerCase() === val &&
      e.oficinas?.toLowerCase().includes(label)
    );
  });
}


const showModalAsigna = async () => {
  if (cardsAsignar.value.length == 0) {
    toast.error("Debe seleccionar una oficina para completar la reasignación.");
    return;
  }

  if (await asignarRef.value.validate()) {
    showModalConfirm.value = true;
  } else {
    toast.error(
      "Para continuar, asegúrese de que todos los campos requeridos estén completos."
    );
  }
};

const saveData = () => {
  emit("handleAcceptModal", asignarUsuarioBody.value);
};
</script>
