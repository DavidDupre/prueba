<template>
  <div class="tw-mt-4">
    <q-card flat class="tw-p-4 tw-rounded-xl">
      <!-- Tabla -->
      <div class="tw-mt-6">
        <DataTable
          scrollable
          scrollHeight="400px"
          :value="rows"
          :paginator="true"
          :rows="pageSize"
          :totalRecords="totalElements"
          :lazy="true"
          :first="firstRowIndex"
          :rowsPerPageOptions="[10, 20, 50, 100]"
          @page="onPaginatorChange"
        >
          <Column
            v-for="(col, index) in dynamicColumns"
            :key="'dynamic-' + index"
            :header="col.header"
            :field="typeof col.field === 'string' ? col.field : undefined"
            :sortable="!!col.sort"
            :sortField="col.field"
            :style="{ minWidth: col.width }"
            :headerStyle="{ textAlign: 'center' }"
            :bodyStyle="{
              textAlign: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
            }"
          >
            <template #body="slotProps">
              <div class="tw-text-center tw-w-full">
                {{
                  col.render
                    ? col.render(slotProps.data)
                    : slotProps.data[col.field]
                }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { toast } from "src/helpers/toast";
import { sgdeaArchivoAxios } from "src/services";

const route = useRoute();
const nodeId = route.params["documento"] as string;

interface ColumnDef {
  field: string;
  header: string;
  width: string;
  sort?: boolean;
  render?: (row: any) => string;
}

const rows = ref([]);
const totalElements = ref(0);
const pageSize = ref(10);
const firstRowIndex = ref(0);
const currentPage = ref(0);

const dynamicColumns = ref<ColumnDef[]>([
  {
    header: "Código",
    field: "consecutiveNumber",
    sort: true,
    width: "110px",
    render: (row) => row.consecutiveNumber,
  },
  {
    header: "Descripción",
    field: "description",
    sort: false,
    width: "150px",
    render: (row) => row.description,
  },
  {
    header: "Solicitante",
    field: "user",
    sort: true,
    width: "180px",
    render: (row) => row.user,
  },
  {
    header: "Dependencia",
    field: "dependenci",
    sort: true,
    width: "200px",
    render: (row) => row.dependenci,
  },
  {
    header: "Fecha y Hora",
    field: "timestamp",
    sort: true,
    width: "200px",
    render: (row) => row.timestamp,
  },
  {
    header: "Estado",
    field: "state",
    sort: true,
    width: "200px",
    render: (row) => row.state,
  },
]);

const fetchData = async () => {
  try {
    const { data } = await sgdeaArchivoAxios.get(
      `/systemlog/sytemlog/all?consecutivo=${nodeId}&pageNo=${
        currentPage.value
      }&pageSize=${pageSize.value}&t=${Date.now()}`
    );

    rows.value = (data.elementos || []).map((item: any) => ({
      ...item,
      timestamp: formatDate(item.timestamp),
    }));

    totalElements.value = data.totalElements || 0;
    firstRowIndex.value = currentPage.value * pageSize.value;
  } catch (error) {
    toast.error("Error al cargar los datos");
  }
};

const formatDate = (fecha: string | Date): string => {
  const date = new Date(fecha);
  if (isNaN(date.getTime())) return "";

  const dia = date.getDate().toString().padStart(2, "0");
  const mes = (date.getMonth() + 1).toString().padStart(2, "0");
  const anio = date.getFullYear();

  const horas = date.getHours().toString().padStart(2, "0");
  const minutos = date.getMinutes().toString().padStart(2, "0");
  const segundos = date.getSeconds().toString().padStart(2, "0");

  return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
};

const onPaginatorChange = (event: any) => {
  currentPage.value = event.page;
  pageSize.value = event.rows;
  firstRowIndex.value = event.first;
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.p-datatable-column-header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

::v-deep(.q-table thead th) {
  text-align: center !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
