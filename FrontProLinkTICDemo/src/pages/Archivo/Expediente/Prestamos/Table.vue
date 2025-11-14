<template>
  <div>
    <q-table flat :rows-per-page-options="[5, 25, 50, 100]" :rows="filteredData" :columns="TABLE_HEADER"
      :row-key="keyId" table-header-class="text-black text-h6" class="q-mr-md full-width" rows-per-page-label="Páginas"
      selection="multiple" v-model:selected="selection" hide-pagination v-model:pagination="pagination">
      <template v-slot:top-right>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <q-input outlined dense rounded v-model="search" label="Buscador" class="tw-w-[300px]">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td class="text-center">
          <q-btn size="sm" color="secondary" v-if="props.row.estado_prestamo.toLowerCase() === 'disponible'" flat
            @click="showDialog(props.row)">
            Crear solicitud
          </q-btn>
        </q-td>
      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120" />
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{
              msgNoData
                ? msgNoData
                : "No se encontraron datos con los criterios ingresados, Por favor verifique e intente nuevamente"
            }}
          </span>
        </div>
      </template>
    </q-table>

    <div class="row justify-between q-mt-md">
      <div class="tw-flex tw-gap-x-3 tw-items-center">
        <span>Filas por página</span>
        <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
      </div>
      <q-pagination v-model="pagination.page" color="secondary" :max="pagesNumber" size="md" direction-links
        boundary-links boundary-numbers />
      <q-btn icon="refresh" type="button" flat class="invisible" />
    </div>


    <q-dialog v-model="dialogVisible">
      <q-card class="tw-p-[40px] tw-w-[800px] tw-max-w-[800px] ">
        <q-card-section class="text-h6 tw-max-w-sm tw-px-0 tw-pt-0">
          <p class=" tw-text-xl tw-text-modal-blue-main-title text-weight-bold">Solicitud de prestamo</p>
        </q-card-section>

        <q-form @submit.prevent="submitSolicitud()">

          <div class="tw-flex tw-justify-between">
            <span class="tw-w-[48%]">
              <label class="tw-text-label">Fecha de Préstamo *</label>
              <Datepicker mask="DD/MM/YYYY" :future="true" label="dd / mm / aaaa"
                v-model:input-data-prop="form.fechaPrestamo" :rules="[inputRequired]" @blur="calculoDevolucion()" />
            </span>
            <span>
              <label class="tw-text-label">Fecha de Devolución</label>
              <q-input type="text" v-model="form.fechaDevolucion" outlined dense :disable="true" />
            </span>
          </div>
          <div>
            <label class="tw-text-label">Descripción *</label>
            <q-input  type="textarea" label="Inserte"
            class="font-normal  tw-text-[18px] tw-w-full modal-custom-input tw-rounded-[28px] " outlined dense
            :rules="[inputRequired, (val) => maxLengthInput(1000, val)]" v-model="form.observaciones" />
          </div>


          <q-card-actions align="center" class="q-mt-sm tw-gap-[20px]">
            <q-btn type="button" flat label="Cancelar" class="tw-h-12 text-weight-bold tw-text-md" style="width: 40%"
              color="secondary" @click="dialogVisible = false" />
            <q-btn type="submit" flat label="Solicitar" class="tw-h-12 bg-primary text-weight-bold tw-text-md"
              style="width: 40%" color="white" />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import NoData from "assets/filterImage.svg";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { sgdeaAxios } from "src/services";
import { useAuthStore } from 'src/stores/auth.store';
import { toast } from "src/helpers/toast";

const form = ref({
  fechaPrestamo: "",
  observaciones: "",
  diasDevolucion: "",
  fechaDevolucion: "",
});


const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
    selection: "none" | "single" | "multiple" | undefined;
    itemSelected: any[];
    icon?: string;
    keyId?: string;
    msgNoData?: string;
    rowId?: string;
    isSelection?: "none" | "single" | "multiple" | undefined;
  }>(),
  {
    selection: "none",
    keyId: "codigo",
    secondIcon: "eye",
    isSelection: "multiple",
    icon: "printer",
  }
);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 5,
});

const rowsPerPage = ref(5);
const selection = ref([]);
const search = ref("");
const dialogVisible = ref(false);
const selectedRow = ref(null);
const vencimientoPrestamo = ref();
const auth = useAuthStore();

const emit = defineEmits(['update:loadExpedientes']);

const filteredData = computed(() => {
  if (!search.value) return props.TABLE_BODY;
  const searchTerm = search.value.toLowerCase();
  return props.TABLE_BODY.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm)
    );
  });
});

onMounted(async () => {
  await loadPrestamoConfig();
});

const loadPrestamoConfig = async () => {
  try {
    const response = await sgdeaAxios.get("/prestamo/configuracion", {
    headers: {
      'tenantName': auth.$state.userInfo.username
      }
  });
    vencimientoPrestamo.value = response.data.vencimientoPrestamo;

  } catch (error) {
    console.error(error);
  }

};

const calculoDevolucion = () => {
  const fechaPrestamo = form.value.fechaPrestamo.split('/').reverse().join('-');
  const fechaDevolucionDate = new Date(fechaPrestamo);
  fechaDevolucionDate.setDate(fechaDevolucionDate.getDate() + vencimientoPrestamo.value);
  const day = String(fechaDevolucionDate.getDate()).padStart(2, '0');
  const month = String(fechaDevolucionDate.getMonth() + 1).padStart(2, '0');
  const year = fechaDevolucionDate.getFullYear();
  form.value.fechaDevolucion = `${day}/${month}/${year}`;
}

const submitSolicitud = async () => {
  const body = {
    expedienteId: selectedRow.value.expedienteId,
    usuarioSolicitanteId: auth.$state.userInfo.userid,
    description: form.value.observaciones,
    fechaPrestamo: new Date(form.value.fechaPrestamo.split('/').reverse().join('-')).toISOString(),
    fechaDevolucion: new Date(form.value.fechaDevolucion.split('/').reverse().join('-')).toISOString(),
  }
  try {
    await sgdeaAxios.post("/expediente/crearSolicitudPrestamo", body, {
      headers: {
        'tenantName': auth.$state.userInfo.username
      }
    });
    dialogVisible.value = false;
    toast.success("Solicitud realizada correctamente");
    emit('update:loadExpedientes');
  } catch (error) {
    console.error(error);
  }
}

const pagesNumber = computed(() =>
  Math.ceil(filteredData.value.length / rowsPerPage.value)
);

const showDialog = (row: any) => {
  selectedRow.value = row;
  dialogVisible.value = true;
}

</script>

<style>
/* Add your styles here */
</style>
