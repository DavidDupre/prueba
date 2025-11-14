<template>
  <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat>
    <div class="flex items-center justify-between q-px-md row col-12">
      <span class="text-weight-bold text-h6" style="color: #2c3948">Listado de Facturas Radicadas</span>
    </div>
    <TableFacturasAdministrativas class="full-width" :FACTURA_HEADER="FACTURA_HEADER" :FACTURA_BODY="dataTable"
      :TABLE_TOTAL_ROWS="dataTableTotalRows" @handlePageChange="handlePageChange"
      @handleRowsPerPageChange="handleRowsPerPageChange" />
  </q-card>
</template>

<script setup lang="ts">
import { Facturacion, SelectInput } from "src/interfaces";
import TableFacturasAdministrativas from 'src/pages/Facturacion/administrativa/Table.vue'
import { tipoDocumento } from "src/constantes/options";
import { FACTURA_HEADER } from "src/pages/Facturacion/administrativa";
import { onMounted, Ref, ref, defineExpose } from "vue";
import { sgdeaAxios } from "src/services";
import moment from "moment";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";

const auth = useAuthStore();
const emit = defineEmits(['pageChange', 'rowsChange'])
const optionsRemitentes = ref<SelectInput[]>([]);
const dataTable: Ref<Facturacion[]> = ref([]);
const dataTableTotalRows = ref(0);
const loadingTable = ref(false);
const allData = ref()

onMounted(async () => {
  // @ts-expect-error
  await Promise.allSettled([
    getData(0, 20),
    // getRemitente(),
  ])
});



const getData = async (page: number, size: number, estadosFiltrados: string[] | null = null) => {
  try {
    loadingTable.value = true;
    const userDependencia = auth.userInfo.relations?.[0]?.dependencia;
    const userId = auth.userInfo.userid; // Obtenemos el ID del usuario autenticado

    const params: any = { page: page, size: size };

    // Configuración de filtros según rol
    if (auth.userInfo.role === 'Asignador Responsable') {
      params.estado = ['En asignación', 'Por asignar'].join(',');
      if (userDependencia) {
        params.dependencia = userDependencia;
      }
    } else if (auth.userInfo.role === 'Gestionador') {
      // Excluimos los estados no deseados para Gestionador
      params.estado = `!En asignación,!Por asignar`;
      // Añadimos filtro por usuario asignado
      params.userId = userId;
    } else if (auth.userInfo.role === 'Aprobador') {
      // Solo traemos los registros con estado "Por aprobar"
      params.estado = 'Por aprobar';
      if (userDependencia) {
        params.dependencia = userDependencia;
      }
    }

    const resp = await sgdeaAxios.get("/facturacion/getall", { params });

    let processedData = resp.data?.content
      .map((item) => ({
        ...item,
        fecha_hora: moment(item.fechaFormateada, "DD/MM/YYYY hh:mm:ss a").format("DD/MM/YYYY HH:mm:ss"),
        tipoDocumento: tipoDocumento.find((doc) => doc.value == item.tipoDocumento)?.label ?? item.tipoDocumento,
        nombreRemitente: item.tipoDocumento.includes("NIT") && item?.razonSocial !== null
          ? item.razonSocial
          : `${item?.primerNombre ?? ""} ${item.otrosNombres ?? ""} ${item?.primerApellido ?? ""} ${item?.segundoApellido ?? ""}`,
      }))
      // Filtro adicional en frontend por si el backend no aplicó los filtros
      .filter(item => {
        if (auth.userInfo.role === 'Asignador Responsable') {
          return (
            ['En asignación', 'Por asignar'].includes(item.estado) &&
            (!userDependencia || item.dependencia === userDependencia)
          );
        } else if (auth.userInfo.role === 'Gestionador') {
          return (
            !['En asignación', 'Por asignar'].includes(item.estado) &&
            item.iduser === userId // Filtramos solo los registros asignados a este usuario
          );
        } else if (auth.userInfo.role === 'Aprobador') {
          return (
            item.estado === 'Por aprobar' &&
            (!userDependencia || item.dependencia === userDependencia)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const firstDate = new Date(a.fecha);
        const secondDate = new Date(b.fecha);
        const currentDate = new Date();

        if (a.estado.toLowerCase() === "por asignar") {
          const oneDay = 24 * 60 * 60 * 1000;
          const timeDifference = currentDate.getTime() - firstDate.getTime();

          if (timeDifference > oneDay) {
            return -1;
          } else {
            return 1;
          }
        }
        return firstDate > secondDate ? 1 : -1;
      });

    dataTable.value = processedData;
    dataTableTotalRows.value = resp.data.totalPages;
    allData.value = dataTable.value;
    loadingTable.value = false;

    return {
      data: dataTable.value,
      total: processedData.length
    };
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar los registros de la tabla");
    loadingTable.value = false;
    return { data: [], total: 0 };
  }
};

function filterByState(estado: string | null) {
  const userDependencia = auth.userInfo.relations?.[0]?.dependencia;
  const userId = auth.userInfo.userid;

  if (auth.userInfo.role === 'Asignador Responsable') {
    dataTable.value = allData.value.filter(item =>
      (estado ? item.estado === estado : ['En asignación', 'Por asignar'].includes(item.estado)) &&
      (!userDependencia || item.dependencia === userDependencia)
    );
  }
  else if (auth.userInfo.role === 'Aprobador') {
    dataTable.value = allData.value.filter(item =>
      (estado ? item.estado === estado : item.estado === 'Por aprobar') &&
      (!userDependencia || item.dependencia === userDependencia)
    );
  }
  else if (auth.userInfo.role === 'Gestionador') {
    dataTable.value = allData.value.filter(item =>
      (estado ? item.estado === estado : true) &&
      !['En asignación', 'Por asignar'].includes(item.estado) &&
      item.iduser === userId
    );
  }
  else {
    dataTable.value = estado ? allData.value.filter(item => item.estado === estado) : allData.value;
  }
}

// async function getRemitente() {
//   try {
//     const remitentes = await sgdeaAxios.get<any[]>(
//       "/facturacion/getListVende?start=0&size=100"
//     );

//     optionsRemitentes.value = remitentes.data.map((item) => {
//       return {
//         label: item.cedula,
//         value: item.cedula,
//       };
//     });
//   } catch (error) {
//     toast.error("Ocurrió un error al cargar la lista de remitentes");
//   }
// }

const handlePageChange = async (event) => {
  const estadosFiltro = auth.userInfo.role === 'Asignador Responsable'
    ? ['En asignación', 'Por asignar']
    : null;

  await getData(event.page - 1, event.rowsPerPage, estadosFiltro);
  emit('pageChange', dataTable.value);
}

const handleRowsPerPageChange = async (event: any) => {
  const estadosFiltro = auth.userInfo.role === 'Asignador Responsable'
    ? ['En asignación', 'Por asignar']
    : null;

  await getData(event.page, event.rowsPerPage, estadosFiltro);
  emit('rowsChange', dataTable.value);
}

defineExpose({
  getData,
  filterByState
})

</script>
