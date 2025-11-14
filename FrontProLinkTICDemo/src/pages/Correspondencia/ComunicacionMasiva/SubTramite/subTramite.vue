<template>

  <div class="tw-flex tw-flex-col tw-gap-2">
    <a class="text-primary q-mb-md block tw-cursor-pointer" style="text-decoration: none" @click="goBack">
      <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
      <b> Volver</b>
    </a>

    <subTramiteTable class="q-pa-md" :detalleRadicado="detalleRadicado" :nodeId="detalleRadicado?.nodeId"
      :idTramite="detalleRadicado?.idTramite" :TABLE_HEADER="renderColumns()" :TABLE_BODY="subTramite"
      :key-id="'idTramite'" icon="someIcon" :pagination="pagination" :handlePageChange="handlePageChange"
      :handleRowsPerPageChange="handleRowsPerPageChange" />
  </div>
</template>


<script setup lang="ts">
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import subTramiteTable from './subTramiteTable.vue';
import { sgdeaAxios } from "src/services";



const q = useQuasar();
const route = useRoute();
const router = useRouter();
const subTramite = ref([]);
const detalleRadicado = ref()

const pagination = ref({
  pageNo: 0,
  pageSize: 20,
  rowsPerPage: 20,
});

function goBack() {
  router.push({ path: '/correspondencia/crear-comunicaciones-masiva', query: { volver: 'true' } });
}

const getData = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/correspondencia/comunicacionMasiva/detalle?comunicacionMasivaId=${route.params.id}`
    );
    if (response.status === 200) {
      const { data } = response;

      if (data) {
        detalleRadicado.value = {
          idRadicado: data?.secuenciaRadicacion,
          idTramite: data?.id,
          aprobado: data?.aprobado,
          nodeId: data?.nodeId,
          estadoProceso: data?.estado.estado,
          tipoTramite: data?.tipoComunicacion.nombre
        };
      }
    }

    const { data } = await sgdeaAxios.get(`/correspondencia/comunicacion/masiva/${route.params.id}/destinatarios`);

    subTramite.value = data.map((item) => ({
      idRadicado: item.comunicacionMasivaId || 'Desconocido',
      id: item.id,
      nombreDestinatario: item.nombre,
      fechaRadicacion: item.fechaRadiacion,
      formaEnvio: item.codigoFormaEnvio,
      municipio: item.codigoMunicipioDestinatario,
      departamento: item.codigoDepartamentoDestinatario,
      estado: item.estado
    }))



  } catch (error) {
    console.error(error)
  }
}


onMounted(() => {
  const route = useRoute();
  const subTramiteId = route.params.id;
  const subTramiteData = ref([]);
  renderColumns();

  getData()

  // subTramite.value = [
  //   {
  //     idRadicado: 1,
  //     nombreDestinatario: "Destinatario 1",
  //     fechaRadicacion: "2021-10-10",
  //     formaEnvio: "Correo",
  //     municipio: "Municipio 1",
  //     departamento: "Departamento 1",
  //     estado: "Estado 1",
  //     documento: "Documento 1",
  //     trazabilidad: "Trazabilidad 1",
  //   },
  //   {
  //     idRadicado: 2,
  //     nombreDestinatario: "Destinatario 2",
  //     fechaRadicacion: "2021-10-10",
  //     formaEnvio: "Correo",
  //     municipio: "Municipio 2",
  //     departamento: "Departamento 2",
  //     estado: "Estado 2",
  //     documento: "Documento 2",
  //     trazabilidad: "Trazabilidad 2",
  //   },
  // ];
});

const renderColumns = () => {

  const columns = [
    {
      name: "idRadicado",
      label: "Numero Radicado",
      field: "idRadicado",
      sortable: true,
    },
    {
      name: "nombreDestinatario",
      label: "Nombre Destinatario",
      field: "nombreDestinatario",
      sortable: true,
    },
    {
      name: "fechaRadicacion",
      label: "Fecha de Creación",
      field: (row) => moment(row.fechaRadicacion, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      name: "formaEnvio",
      label: "Forma de Envío",
      field: "formaEnvio",
      sortable: true,
    },
    {
      name: "municipio",
      label: "Municipio",
      field: "municipio",
      sortable: true,
    },
    {
      name: "departamento",
      label: "Departamento",
      field: "departamento",
    },
    {
      name: "estado",
      label: "Estado",
      field: "estado",
    },
    {
      name: "verDocumento",
      label: "Ver Documentos",
      field: "verDocumento",
    },
    {
      name: "trazabilidad",
      label: "Trazabilidad",
      field: "trazabilidad",
    },
  ];
  return columns;
};



const handlePageChange = async (page: number) => {
  pagination.value.pageNo = page <= 0 ? 0 : page - 1;
}

const handleRowsPerPageChange = async (rowsPerPage: any) => {
  pagination.value.rowsPerPage = rowsPerPage;
}

</script>
