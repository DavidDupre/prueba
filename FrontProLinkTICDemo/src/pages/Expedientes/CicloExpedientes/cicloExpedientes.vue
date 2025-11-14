<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold tw-my-4">
          Firma Índice Expediente
        </h1>
      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <div class="tw-flex tw-gap-5 tw-pb-3">
          <div class="tw-w-1/2">
            <label for="code" class="tw-text-label">Número expediente</label>
            <q-input
              outlined
              class="mb-3"
              dense
              type="text"
              label="Inserte"
              v-model="form.codigoExpediente"
            />
          </div>
          <div class="tw-w-1/2">
            <label for="description" class="tw-text-label"
              >Número radicado</label
            >
            <q-input
              outlined
              class="mb-3"
              dense
              type="text"
              label="Inserte"
              v-model="form.numeroradicado"
            />
          </div>
        </div>
        <div class="tw-flex tw-gap-5 tw-pb-3">
          <div class="tw-w-1/2">
            <label for="description" class="tw-text-label"
              >Número documento</label
            >
            <q-input
              outlined
              class="mb-3"
              dense
              type="text"
              label="Inserte"
              v-model="form.documento"
            />
          </div>
          <div class="tw-w-1/2">
            <label for="code" class="tw-text-label">Serie</label>
            <q-select
              outlined
              class="mb-3"
              dense
              :options="series"
              v-model="form.serie"
              type="text"
              label="Inserte"
            />
          </div>
        </div>
        <div class="tw-flex tw-gap-5">
          <div class="tw-w-1/2">
            <label for="description" class="tw-text-label">Subserie</label>
            <q-select
              outlined
              class="mb-3"
              dense
              :options="subseries"
              type="text"
              label="Inserte"
              v-model="form.subserie"
            />
          </div>
          <div class="tw-w-1/2">
            <label for="initialDate" class="tw-text-label">Fecha inicial</label>
            <DatePickerComponent
              v-model:input-data-prop="form.fechaInicio"
              label="aaaa/mm/dd"
              :rules="[validDate, validateDate]"
              mask="YYYY/MM/DD"
            />
          </div>
        </div>
        <div class="tw-flex tw-gap-3">
          <div class="tw-w-1/2">
            <label for="endingDate" class="tw-text-label">Fecha final</label>
            <DatePickerComponent
              v-model:input-data-prop="form.fechaFin"
              mask="YYYY/MM/DD"
              :options="(date: any) => date >= form.fechaInicio"
              :rules="[validateEndDate, validDate, validateDate]"
              label="aaaa/mm/dd"
            />
          </div>
          <div class="tw-w-1/2">
            <label for="initialDate" class="tw-text-label">Estado</label>
            <q-select
              outlined
              label="Seleccione"
              class="tw-w-full"
              dense
              v-model="form.estado"
              :options="estadoOptions"
              emit-value
              map-options
            />
          </div>
        </div>
        <div class="row tw-flex tw-mt-8 tw-justify-center tw-gap-2">
          <q-btn
            label="Limpiar filtros"
            type="submit"
            color="accent"
            textColor="black"
            class="tw-rounded-lg col-2"
            @click="clearFilters"
          />
          <q-btn
            label="Buscar"
            type="submit"
            color="primary"
            class="tw-rounded-lg col-2"
            @click="handleSendFilter"
          />
        </div>
      </q-card>
      <q-card class="tw-mt-6 tw-rounded-xl tw-p-7" flat>
        <div class="flex flex-center justify-between">
          <p class="tw-text-2xl tw-pl-6">Listado de expedientes</p>
        </div>
        <Table
          :TABLE_HEADER="FIRMA_HEADER"
          :TABLE_BODY="dataTable"
          :selection="undefined"
          v-model:item-selected="selected"
          key-id="id"
        />
        <div class="row tw-flex tw-mt-8 tw-justify-center tw-gap-2">
          <q-btn
            :disable="selected.length === 0"
            label="Firmar"
            type="submit"
            color="primary"
            class="tw-rounded-lg col-2"
            @click="handleSignIndex"
          />
        </div>
      </q-card>
      <Modal
        v-model="showModalNoSign"
        title="Error"
        :text="noSign"
        text-button="Aceptar"
        @handleAccept="() => (showModalNoSign = false)"
      />
      <Modal
        v-model="showModal"
        title="¡Confirmar firma expediente!"
        text="¿Está seguro de firmar el índice de los expedientes seleccionados?"
        text-cancel-button="NO"
        text-button="SI"
        @handleAccept="handleAccept"
        cancel-button
        @closeModal="() => (showModal = false)"
        text-button-cancel="NO"
      />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import { validateDate as validDate } from "src/helpers/validations";
import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import Modal from "components/Modal/Modal.vue";
import { FIRMA_HEADER, routes, estadoOptions, formatedDate, util } from ".";
import Table from "./table.vue";
import { sgdeaAxios } from "src/services";

const router = useRouter();
const dataTable = ref([]);
const series = ref([]);
const subseries = ref([]);
const subserieId = ref("");
const serieId = ref("");
const selected = ref([]);
const showModalNoSign = ref(false);
const noSign = ref("");
const showModal = ref(false);

const form = ref({
  codigoExpediente: "",
  numeroradicado: "",
  documento: "",
  serie: "",
  subserie: "",
  fechaInicio: "",
  fechaFin: "",
  estado: "",
});

const getSerieSubSerie = async () => {
  const { data: getSeries } = await sgdeaAxios.get<any>(
    `/serie/allSerieFilter`
  );
  const { data: getSubSeries } = await sgdeaAxios.get<any>(
    `/serie/allSubSerieFilter`
  );

  series.value = getSeries
    .filter((item: any) => item[0] !== null)
    .map((item: any) => {
      return {
        label: item[1],
        value: item[0],
      };
    });

  subseries.value = getSubSeries
    .filter((item: any) => item[0] !== null)
    .map((item: any) => {
      return {
        label: item[1],
        value: item[0],
      };
    });
};

onBeforeMount(async () => {
  await getSerieSubSerie();
});

const validateEndDate = () => {
  if (form.value.fechaInicial.length > 0 && form.value.fechaFinal.length > 0) {
    return (
      Date.parse(form.value.fechaInicial) <=
        Date.parse(form.value.fechaFinal) ||
      "Debe ingresar un fecha superior a la fecha inicial"
    );
  }

  return true;
};

const handleSendFilter = async () => {
  let response = await sgdeaAxios.get("/expediente/filtroFirma", {
    params: {
      codigoExpediente:
        form.value.codigoExpediente === "" ? null : form.value.codigoExpediente,
      numeroradicado:
        form.value.numeroradicado === "" ? null : form.value.numeroradicado,
      documento: form.value.documento === "" ? null : form.value.documento,
      //@ts-ignore
      serie: form.value.serie === "" ? null : form.value.serie?.value,
      //@ts-ignore
      subserie: form.value.subserie === "" ? null : form.value.subserie.value,
      fechaInicio:
        form.value.fechaInicio === ""
          ? null
          : formatedDate(form.value.fechaInicio),
      fechaFin:
        form.value.fechaFin === "" ? null : formatedDate(form.value.fechaFin),
      estado: form.value.estado === "" ? null : form.value.estado,
    },
  });
  dataTable.value = response.data.map((item: any, index: number) => {
    return {
      id: index + 1,
      codigoExpediente: item.codigoexpediente,
      numeroRadicado: item.idradicado,
      documento: item.documento,
      serie: item.serie,
      subserie: item.subserie,
      fechaInicio: item.fechavigenciainicial,
      fechaFin: item.fechavigenciafinal,
      idExpediente: item.idexpediente,
      estado: item.estado,
    };
  });
};

const handleSignIndex = async () => {
  showModal.value = true;
};

const handleAccept = async () => {
  const response = await sgdeaAxios.post("/expediente/firmar", [
    ...selected.value.map((item: any) => item.idExpediente),
  ]);

  if (response.status === 200) {
    const getNoSign = response.data.filter((item: any) => item.estado !== 3);
    noSign.value = `No se puede firmar índice de los expedientes: #${getNoSign
      .map((item: any) => item.codigoexpediente)
      .join(", #")}`;
    selected.value = [];
    showModal.value = false;
    showModalNoSign.value = true;
  }
};

const clearFilters = () => {
  form.value.codigoExpediente = "";
  form.value.numeroradicado = "";
  form.value.documento = "";
  form.value.serie = "";
  form.value.subserie = "";
  form.value.fechaInicio = "";
  form.value.fechaFin = "";
  form.value.estado = "";
};

const validateDate = (val: any) => {
  const inputDate = new Date(val);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Ignorar la hora actual para comparar solo las fechas.

  if (inputDate >= currentDate) {
    return "La fecha debe ser anterior a la fecha actual";
  }

  return true;
};
</script>
