<template>
  <main class="q-py-md">
    <q-dialog persistent v-model="isModalOpen" class="modal-mask">
      <q-card class="modal-wrapper tw-p-5">
        <q-card-section class="modal-header">
          <h2 class="tw-font-bold tw-text-xl tw-text-labels">
            Crear Comunicación Masiva
          </h2>
        </q-card-section>

        <q-card-section class="modal-body">
          <q-form greedy ref="myForm" class="q-gutter-md form-group">
            <div class="col-12">
              <span class="tw-w-full">
                <label class="tw-text-label">Nombre de Comunicación * ({{ form.nombreComunicacion.length }}/150)</label>
                <q-input
                  v-model="form.nombreComunicacion"
                  dense
                  outlined
                  label="Inserte"
                  class="tw-rounded-lg"
                  :rules="[inputRequired, (val) => maxLengthInput(150, val)]"
                />
              </span>
            </div>

            <div class="col-12">
              <span class="tw-w-full">
                <label class="tw-text-label">Tipo de Comunicación *</label>
                <q-select
                  v-model="form.tipoComunicacion"
                  label="Seleccione"
                  map-options
                  emit-value
                  dense
                  outlined
                  :options="tipoComunicacionOptions"
                  :rules="[inputRequired]"
                  class="tw-rounded-lg"
                >
                </q-select>
              </span>
            </div>

            <div class="col-12">
              <span class="tw-w-full">
                <label class="tw-text-label">Prefijo de Comunicación *</label>
                <q-select
                  v-model="form.prefijoComunicacion"
                  label="Seleccione"
                  map-options
                  emit-value
                  dense
                  outlined
                  :options="prefijoComunicacionOptions"
                  :rules="[inputRequired]"
                  class="tw-rounded-lg"
                  :disable="form.tipoComunicacion === 2"
                >
                </q-select>
              </span>
            </div>

            <div class="col-12">
              <span class="tw-w-full">
                <label class="tw-text-label">Tipo de Plantilla *</label>
                <q-select
                  :disable="form.prefijoComunicacion !== 1"
                  v-model="form.tipoPlantilla"
                  label="Seleccione"
                  map-options
                  emit-value
                  dense
                  outlined
                  :options="tipoPlantillaOptions"
                  :rules="[inputRequired]"
                  class="tw-rounded-lg"
                >
                </q-select>
              </span>
            </div>
          </q-form>
        </q-card-section>

        <div
          class="tw-flex tw-justify-center tw-items-center tw-mb-10 tw-gap-6 tw-px-4"
        >
          <q-btn
            @click="closeModal()"
            label="Cancelar"
            type="reset"
            style="width: 240px"
            text-color="black"
            color="accent"
            class="tw-rounded-xl tw-h-12"
          />

          <q-btn
            @click="submitForm()"
            label="Crear"
            text-color="white"
            style="width: 240px"
            color="secondary"
            class="tw-rounded-xl tw-h-12 tw-p-2"
          />
        </div>
      </q-card>
    </q-dialog>

    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold tw-ms-2">
        Trámites Comunicacionales
      </h1>
<q-btn
        label="Crear Comunicaciones Masivas"
        color="primary"
        @click="openModal()"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        icon="add"
      />
    </div>
    <q-card flat class="tw-p-4 tw-rounded-xl tw-mt-6">
      <div class="show-table-icons">
        <crearMasivaTable
          class="q-pa-md"
          :TABLE_HEADER="renderColumns()"
          :TABLE_BODY="tramitesComunicacionales"
          key-id="id"
          icon="someIcon"
          :total="totalItems"
          :module="module"
          @handleRowsPerPageChange="handleRowsPerPageChange"
          @handlePageChange="handlePageChange"
        />
      </div>
    </q-card>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, reactive } from "vue";
import { sgdeaAxios } from "src/services";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import { useAuthStore } from "src/stores/auth.store";
import { toast } from "src/helpers/toast";
import moment from "moment";
import crearMasivaTable from "./crearMasivaTable.vue";
import { useCrearComunicacionesLogic } from "src/pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones.Logic";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useRoute } from "vue-router";

const tipoComunicacionOptions = ref([]);
const prefijoComunicacionOptions = ref([]);
const tipoPlantillaOptions = ref([]);
const route = useRoute();
const opsPlantilla = ref([]);
const myForm = ref();
const totalItems = ref(0);
const form = reactive({
  nombreComunicacion: '',
  tipoComunicacion: '',
  prefijoComunicacion: '',
  tipoPlantilla: '',
});
const isModalOpen = ref(route.query.volver === 'true' ? false : true);
const module = ref("crearMasiva");
const auth = useAuthStore();

const resetForm = () => {
  form.nombreComunicacion = '';
  form.tipoComunicacion = '';
  form.prefijoComunicacion = '';
  form.tipoPlantilla = '';
  if (myForm.value) {
    myForm.value.resetValidation();
  }
};

onMounted(async () => {
  const { getTypesCommunicationOptions, getTypesTemplates } =
    useCrearComunicacionesLogic();
  tipoComunicacionOptions.value = await getTypesCommunicationOptions();
  opsPlantilla.value = await getTypesTemplates();

  try {
    // const dataPrefijos = await sgdeaAxios.get(`/medicina/prefijo-by-oficina/${auth.userInfo.oficina}`);
    const response = await sgdeaAxios.get(`/medicina/prefijos`);

    if (response.status === 200) {
      const sinPrefijo = response.data.find(e => e.nombre === "Sin prefijo");
      prefijoComunicacionOptions.value = response.data
        .filter(e => e.nombre !== "Sin prefijo")
        .map(e => ({
          label: e.nombre,
          value: e.id
        }));
      if (sinPrefijo) {
        prefijoComunicacionOptions.value.unshift({
          label: sinPrefijo.nombre,
          value: sinPrefijo.id
        });
      }
    }
  } catch (error) {
    toast.error("Error al listar los prefijos");
  }
});

watch(() => form.tipoComunicacion, (newValue) => {
    const tipoComunicacion = Number(newValue);
   if (tipoComunicacion === 1) { // Com. Interna
     form.prefijoComunicacion = prefijoComunicacionOptions.value.filter(it => it.label === 'Sin prefijo')[0].value;
     tipoPlantillaOptions.value = opsPlantilla.value.filter(it => it.label === 'Memorando interno');
   } else if (tipoComunicacion === 2) { // Com. Externa
     tipoPlantillaOptions.value = opsPlantilla.value.filter(it => it.label === 'Comunicaciones de salida');
     form.prefijoComunicacion = prefijoComunicacionOptions.value.filter(it => it.label === 'Sin prefijo')[0].value;
    } else {
      tipoPlantillaOptions.value = [];
    }

   if(Number(form.prefijoComunicacion) === 1){
      if (tipoComunicacion === 1) {
      form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Memorando interno')[0].value;
    }else if (tipoComunicacion === 2) {
      form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Comunicaciones de salida')[0].value;
      }
    }
 });

watch(() => form.prefijoComunicacion, (newValue) => {
    if (Number(newValue) === 1) {
      if (Number(form.tipoComunicacion) === 1) {
      form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Memorando interno')[0].value;
      } else if (Number(form.tipoComunicacion) === 2) {
      form.tipoPlantilla = opsPlantilla.value.filter(it => it.label === 'Comunicaciones de salida')[0].value;
      }
  }else{
    form.tipoPlantilla = '';
  }
});


const submitForm = async () => {
  const isValidate = await myForm.value.validate();
  if (!isValidate) {
    return;
  }

  const formData = new FormData();

  formData.append("nombreComunicacion", form.nombreComunicacion);
  formData.append("tipoComunicacionId", form.tipoComunicacion);
  formData.append("prefijoComunicacionId", form.prefijoComunicacion);
  formData.append("tipoPlantillaId ", form.tipoPlantilla);
  formData.append("usuarioId", useAuthStore().$state.userInfo.userid);
  formData.append("esExterno", form.tipoComunicacion == 2);

  const response = await sgdeaAxios.post(
    "/correspondencia/comunicacionMasiva/crear",
    formData
  );

  if (response.status == 200 || response.status == 201) {
    toast.success("Se ha creado la comunicación masiva exitosamente");
    // router.push('/home')
    await crearTrazabilidad({
      proceso: "CORMAS" + response.data.id,
      secuencia: response.data.secuenciaRadicacion,
      estado: response.data.estado.estado,
      descripcion: `Usuario:${auth.userInfo.name} Nombre Comunicación:${response.data.nombreComunicacion} Tipo:${response.data.tipoComunicacion.nombre}
                        Prefijo: ${response.data.prefijoComunicacion.nombre} Plantilla: ${response.data.tipoPlantilla.nombre}`,
      comentario: "Se creo una comunicación masiva. ",
      nombre: auth.$state.userInfo.name,
      accion: `${auth.$state.userInfo.name} creo la comunicacion masiva ${response.data.secuenciaRadicacion}`,
      tramite: "Comunicación Masiva",
    });
    tramitesComunicacionales.value = [
      ...tramitesComunicacionales.value,
      response.data,
    ];

    isModalOpen.value = false;
    resetForm();
  }
};
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
   resetForm();
};

const handleRowsPerPageChange = (event) => {
  getTramitesComunicacionales(event.page, event.rowsPerPage);
};

const handlePageChange = (event) => {
  getTramitesComunicacionales(event.page - 1, event.rowsPerPage);
};

const tramitesComunicacionales = ref([]);
onMounted(async () => {
  renderColumns();
  getTramitesComunicacionales(0, 20);
});

const getTramitesComunicacionales = async (pageNumber, pageSize) => {
  const bodyParam = {
    usuario: useAuthStore().$state.userInfo.userid,
    size: pageSize,
    page: pageNumber,
  };

  try {
    const { data } = await sgdeaAxios.post(
      "/correspondencia/comunicaciones/masivas/bandeja",
      bodyParam
    );

    if (data) {
      tramitesComunicacionales.value = data.content.sort((a, b) => a.id - b.id);
      totalItems.value = data.totalPages;
    }
  } catch (error) {
    console.error(error);
  }
};

const renderColumns = () => {
  const columns = [
    {
      name: "id",
      label: "Consecutivo",
      field: "id",
      sortable: true,
      align: "center",
    },
    {
      name: "nombreComunicacion",
      label: "Nombre de la Comunicación",
      field: "nombreComunicacion",
      sortable: true,
      align: "center",
    },
    {
      name: "fechaRadicacion",
      label: "Fecha de Creación",
      field: (row) => moment(row.fechaRadicacion).format("DD/MM/YYYY"),
      sortable: true,
      align: "center",
    },
    {
      name: "tipoComunicacion",
      label: "Tipo de Comunicación",
      field: (row) => row.tipoComunicacion.nombre,
      sortable: true,
      align: "center",
    },
    {
      name: "cantidad",
      label: "Cantidad",
      field: "cantidad",
      align: "center",
    },
    {
      name: "subTramite",
      label: "Ver Sub Trámites",
      field: "subTramite",
      align: "center",
    },
    {
      name: "gestionDoc",
      label: "Gestión Documental",
      field: "gestionDoc",
      align: "center",
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
      align: "center",
    },
  ];
  return columns;
};
</script>
