<template>
  <main class="tw-px-5 q-py-md">
    <a
      href="/facturacion/cuentas-cobro"
      class="text-primary q-mb-md block"
      style="text-decoration: none"
    >
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver </b>
    </a>
    <BreadCrumbs :crumbs="routes"></BreadCrumbs>

    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">
        Cuenta de cobro # {{ showRoute }}
      </h1>
    </div>

    <div
      class="tw-bg-orange-100 q-my-sm tw-border-orange-400 tw-border tw-rounded-md tw-max-w-max q-px-md q-py-xs"
    >
      Sin asignar
    </div>

    <div
      class="center-content bg-white column tw-w-full q-mx-auto q-py-md q-mt-lg tw-rounded-2xl"
    >
      <div class="row tw-gap-2 items-center">
        <button
          type="button"
          @click="openVista('vistaInformacionGeneral')"
          :class="{
            'tw-bg-[#F2F4F5]': vistaActual === 'vistaInformacionGeneral',
          }"
          no-caps
          class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
          style="box-shadow: none; border: 1px solid #a5b1bf"
        >
          <q-icon size="16px" class="q-mr-xs" name="error_outline" />Información
          General
        </button>
        <button
          type="button"
          @click="openVista('vistaAsignar')"
          no-caps
          :class="{ 'tw-bg-[#F2F4F5]': vistaActual === 'vistaAsignar' }"
          class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
          style="box-shadow: none; border: 1px solid #a5b1bf"
        >
          <q-icon size="16px" class="q-mr-xs" name="assignment_ind" />Asignar
        </button>
      </div>
    </div>

    <section v-if="vistaActual === 'vistaInformacionGeneral'">
      <q-expansion-item
        dense
        expand-separator
        default-opened
        class="tw-bg-white"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información básica radicación
          </h3>
        </template>
        <q-card
          class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8"
          style="box-shadow: none"
        >
          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Dependencia</p>
            <p>data</p>
            <p class="titles">Tipo de trámite</p>
            <p>data</p>
            <p class="titles">Tipo de documento</p>
            <p>data</p>
            <p class="titles">Primer apellido</p>
            <p>data</p>
            <p class="titles">Primer nombre</p>
            <p>data</p>
          </div>
          <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
            <p class="titles">Responsable del proceso</p>
            <p>data</p>
            <p class="titles">Canal de recepción</p>
            <p>data</p>
            <p class="titles">Número de identificación</p>
            <p>data</p>
            <p class="titles">Segundo apellido</p>
            <p>data</p>
            <p class="titles">Otros nombres</p>
            <p>data</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        dense
        expand-separator
        default-opened
        class="tw-bg-white q-mt-md"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Información documento soporte equivalente
          </h3>
        </template>
        <q-card
          class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
        >
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Tipo de bien o servicio</p>
            <p>data</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Observación</p>
            <p>data</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Valor</p>
            <p>data</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Valor en letras</p>
            <p>data</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-full">
            <p class="titles">Aprobador</p>
            <p>data</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        dense
        expand-separator
        default-opened
        class="tw-bg-white q-mt-md"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
            Campos automáticos al radicar
          </h3>
        </template>
        <q-card
          class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6"
        >
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">FECHA / sistema a radicar</p>
            <p>data</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Hora de inicio</p>
            <p>data</p>
          </div>
          <div class="tw-flex tw-flex-col tw-w-[48%]">
            <p class="titles">Estado de trámite</p>
            <p>data</p>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item
        dense
        expand-separator
        default-opened
        class="tw-bg-white q-mt-md"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</h3>
        </template>
        <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos</p>

        <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]"
          >
            <img style="width: 26px" v-lazy :data-url="PDFIcon" />
            <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C]"
              name="error_outline"
            />
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="file_download"
            />
          </q-card>

          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]"
          >
            <img style="width: 26px" v-lazy :data-url="PDFIcon" />
            <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C]"
              name="error_outline"
            />
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="file_download"
            />
          </q-card>

          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]"
          >
            <img style="width: 26px" v-lazy :data-url="PDFIcon" />
            <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C]"
              name="error_outline"
            />
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="file_download"
            />
          </q-card>

          <q-card
            class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]"
          >
            <img style="width: 26px" v-lazy :data-url="PDFIcon" />
            <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
            <q-icon
              size="20px"
              class="tw-text-[#6B737C]"
              name="error_outline"
            />
            <q-icon
              size="20px"
              class="tw-text-[#6B737C] tw-cursor-pointer"
              name="file_download"
            />
          </q-card>
        </div>
      </q-expansion-item>
    </section>

    <q-form>
      <section v-if="vistaActual === 'vistaAsignar'">
        <q-card
          class="row full-width wrap q-px-md tw-justify-start justify-around q-mb-md"
        >
          <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Área encargada</h3>

          <div class="row full-width">
            <div class="col-6">
              <label class="q-px-md tw-text-label"
                >Dependencia del proceso
              </label>
              <q-input
                type="text"
                disable
                readonly
                v-model:model-value="dep"
                dense
                outlined
              />
            </div>

            <div class="col-6">
              <label class="q-px-md tw-text-label"
                >Responsable del proceso *
                <q-input
                  type="text"
                  disable
                  readonly
                  v-model:model-value="dep"
                  dense
                  outlined
                />
              </label>
            </div>

            <div class="q-mb-md q-mx-sm tw-flex tw-flex-col col-6">
              <label class="q-px-md tw-text-label"
                >¿Desea asignar al responsable?
                <div class="flex items-center tw-gap-16 q-mt-xs">
                  <label id="asignar1" class="flex items-center tw-gap-x-2">
                    <input
                      name="responsable"
                      type="radio"
                      class="tw-w-5 tw-h-5"
                    />
                    Sí
                  </label>

                  <label id="asignar2" class="flex items-center tw-gap-x-2">
                    <input
                      name="responsable"
                      type="radio"
                      class="tw-w-5 tw-h-5"
                    />
                    No
                  </label>
                </div>
              </label>
            </div>
          </div>
        </q-card>

        <q-expansion-item
          dense
          expand-separator
          class="tw-bg-white q-mt-lg"
          style="border-radius: 5px"
          v-model="isAsignacion"
        >
          <template v-slot:header>
            <h3 class="text-bold tw-text-xl q-py-md tw-flex-1">Asignación</h3>
          </template>
          <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3">
            <div
              class="width-container tw-w-1/2 q-px-sm tw-rounded-xl"
              style="border: 1px solid #e3e4e5"
            >
              <TableAsignar
                :TABLE_BODY="rowsAsignar"
                :TABLE_HEADER="columnsAsignar"
                @update:item-selected="handleAssign"
                text="radicado"
              />
            </div>
            <div
              class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
              style="border: 1px solid #e3e4e5"
            >
              <span
                class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold"
              >
                Estos son los usuarios que ha seleccionado
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
        </q-expansion-item>

        <q-expansion-item
          dense
          expand-separator
          class="tw-bg-white q-mt-lg"
          style="border-radius: 5px"
          v-model="isMotivoAsignacion"
        >
          <template v-slot:header>
            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
              Motivo de Asignación
            </h3>
          </template>
          <q-card class="row full-width wrap tw-justify-start justify-around">
            <div class="row full-width">
              <div class="col-12">

                <CommentTextArea v-model="formulario.observaciones" :is-required="true" :max-length="1000" label="Observaciones"/>
              </div>
            </div>
          </q-card>
        </q-expansion-item>

        <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
          <q-btn
            class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
            no-caps
            style="border: 1px solid #2c3948"
            @click="() => (showModal = true)"
            >Cancelar</q-btn
          >
          <q-btn class="tw-w-1/4 tw-h-11 bg-secondary text-white">Enviar</q-btn>
        </div>
      </section>
    </q-form>
  </main>
  <Modal
    v-model:model-value="showModal"
    title="¡Espera un momento!"
    text="¿Estás seguro de cancelar la asignación de la cuenta de cobro?"
    :is-success="false"
    textButtonCancel="No"
    cancel-button
    @handleAccept="
      showModal = false;
      router.push('/facturacion/cuentas-cobro');
    "
    text-button="Si"
    @close-modal="() => (showModal = false)"
  />
</template>

<script lang="ts" setup>
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import PDFIcon from "src/assets/pdf.svg";
import TableAsignar from "components/Tables/TableAsignar.vue";
import Modal from "src/components/Modal/Modal.vue";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";

const route = useRoute();
const router = useRouter();
const showRoute = ref(route.params.id);
const isAsignacion = ref(true);
const isMotivoAsignacion = ref(true);
let vistaActual = ref("vistaInformacionGeneral");
let showModal = ref(false);
const dep = ref("data");

const openVista = (vista: string) => {
  vistaActual.value = vista;
};

const formulario = ref({
  data: "",
  tipodocumento: "",
  documento: "",
  nombre: "",
  proceso: "",
  hora: "",
  fecha: "",
  tiempo: "",
  observaciones: "",
});

//cards asignar
const cardsAsignar = ref([]);

const asignar = ref([]);

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
};

//TABLA ASIGNAR
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
  },
];

const rowsAsignar = [
  {
    colaborador: "Pedro Pérez",
    cargo: "Gestor",
    grupo: "Medicina Laboral",
  },
];
//END ASIGNAR

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Medicina Laboral",
  },
  {
    name: "Asignación del caso",
    to: "/medicina-laboral/asignacion-caso",
  },
  {
    name: "# " + showRoute.value,
  },
];

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    visible: true,
  }));
};
</script>

<style>
label {
  padding: 0px 10px;
}

.titles {
  color: #6b737c;
  font-weight: bold;
  margin-top: 10px;
}

.alineation {
  display: flex;
  flex-direction: wrap;
}

@media (max-width: 768px) {
  .alineation {
    flex-direction: column;
  }

  .width-container {
    width: 100%;
  }
}
</style>
