<template>
  <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
    <div class="flex items-center justify-between q-px-md row row col-12">
      <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Cuentas de Cobro Radicadas</span>
    </div>
    <TableCuentasCobro class="full-width" :FACTURA_HEADER="FACTURA_RADICADA_HEADER"
      :TABLE_TOTAL_ROWS="dataTableTotalRows" :isLoading="loadingTable" :FACTURA_BODY="dataTable"
      @handlePageChange="handlePageChange" @handleRowsPerPageChange="handleRowsPerPageChange":pagination-message="customMessageTableResults" @handle-edit="(props: any) => {
        const estado = props.estado.toLowerCase();
        if (estado === 'radicado' || estado == 'por asignar') {
          router.push('/facturacion/cuentas-cobro/radicadas/detalle/' + props.id);
        } else {
          router.push('/facturacion/cuentas-cobro/asignadas/detalle/' + props.id);
        }
      }" />
  </q-card>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, defineExpose } from "vue";
import { useRouter } from "vue-router";
import { sgdeaAxios } from "src/services";
import { FACTURA_RADICADA_HEADER } from "src/pages/Facturacion/cobro";
import { SelectInput } from "src/interfaces";
import TableCuentasCobro from 'src/pages/Facturacion/cobro/Table.vue';
import { toast } from "src/helpers/toast";
import { formatDateWithTimeAndMeridiem } from "src/helpers/formtDate";
import { useAuthStore } from "src/stores/auth.store";

interface CuentaCobroDataTable {
  dependencia: string;
  responsable: string;
  tramite: string;
  recepcion: string;
  tipoDocumento: string;
  nroId: number;
  remitente: string;
  fechaHora: string;
  estado: string;
}
const authStore = useAuthStore();
const router = useRouter();
const emit = defineEmits(['pageChange', 'rowsChange'])
const optionsRemitentes = ref<SelectInput[]>([]);
const dataTable: Ref<CuentaCobroDataTable[]> = ref([]);
const loadingTable = ref(false);
const dataTableTotalRows = ref(0);
const allData = ref([])
const customMessageTableResults = ref("")
onMounted(async () => {
  // @ts-expect-error
  await Promise.allSettled([
    getItems(0, 20),
    getRemitente()
  ])
});

const tipoUsuarioMap: Record<string, string> = {
      "asignador responsable": "ASIGNADOR",
      "gestionador consolidador": "GESTIONADOR_CONSOLIDADOR",
      "gestionador": "GESTIONADOR",
      "gestionador escalador": "GESTIONADOR_ESCALADOR",
      "aprobador": "APROBADOR",
      "revisor": "REVISOR",
      "defensor del consumidor": "DEFENSOR_CONSUMIDOR",
      "administrador master": "ADMINISTRADOR",
    };

const getItems = async (page: number, size: number) => {
  if(authStore.userInfo.role.toLowerCase() !== 'revisor'){
  try {
    loadingTable.value = true;

      const { data } = await sgdeaAxios.get<any>("/facturacion/getAllCto", {
      params: { page: page, size: size, sort: "asc",
        oficina: authStore.userInfo.oficina,
        dependencia: authStore.userInfo.dependencia,
        rol: tipoUsuarioMap[authStore.userInfo.role.toLowerCase()],
        idUsuario: authStore.userInfo.userid
       }
    });

    dataTable.value = data?.content.map((item) => {
      return {
        ...item,
        id: item.idCto,
        dependencia: item.dependencia,
        tramite: "Cuentas de Cobro",
        recepcion: item.canal,
        tipoDocumento: item.tipoDocumento,
        numeroDocumento: item.numeroDocumento,
        remitente: item.aprobador,
        fecha_hora : formatDateWithTimeAndMeridiem(item.fecha),
        estado: item.estado,
      }
    }).sort((a, b) => {
      const firstDate = new Date(a.fecha);
      const secondDate = new Date(b.fecha);
      const currentDate = new Date();

      if (a.estado.toLowerCase() === 'por asignar') {
        const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
        const timeDifference = currentDate.getTime() - firstDate.getTime();

        if (timeDifference > oneDay) {
          return -1;
        } else {
          return 1;
        }
      }

      return firstDate > secondDate ? 1 : -1;
    });

    allData.value = dataTable.value
    dataTableTotalRows.value = data.totalPages
    customMessageTableResults.value = data.paginationMessage
    loadingTable.value = false;
    return { data: dataTable.value, total: data.totalElements || 0 }
  } catch (error) {
    toast.error("Ha ocurrido un error al momento de traer datos de los casos")
    loadingTable.value = false;
  }
  }
  return { data: [], total: 0 }
};

async function getRemitente() {
  try {
    const remitentes = await sgdeaAxios.get<any[]>("/facturacion/getListVendeCto?start=0&end=200");

    optionsRemitentes.value = remitentes.data.map((item) => {
      return {
        label: item.cedula,
        value: item.cedula,
      };
    });
  } catch (error) {
    console.error(error);
  }
}

const handlePageChange = async (event) => {
  await getItems(event.page - 1, event.rowsPerPage);
  emit('pageChange', dataTable.value)
}

const handleRowsPerPageChange = async (event: any) => {
  await getItems(event.page, event.rowsPerPage);
  emit('rowsChange', dataTable.value)
}

defineExpose({
  getItems,
  filterByState
})

function filterByState(estado) {
  if (!estado) {
    dataTable.value = allData.value
  } else {
    dataTable.value = allData.value.filter((item) => item.estado == estado)
  }
}

</script>
