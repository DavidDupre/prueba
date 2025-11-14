<template>

  <div class="tw-flex tw-flex-col tw-gap-2">

      <subTramiteTable class="q-pa-md" :idTramite="detalleRadicado?.idTramite" :TABLE_HEADER="renderColumns()" :TABLE_BODY="subTramite" key-id="id" icon="someIcon" :pagination="pagination" :handlePageChange="handlePageChange" :handleRowsPerPageChange="handleRowsPerPageChange" />
  </div>
</template>


<script setup lang="ts">
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import subTramiteTable from './subTramiteTable.vue';
import { sgdeaAxios } from "src/services";

const props = withDefaults(defineProps<{
  detailsRadicado: any,
}>(), {
})

const q = useQuasar();
const route = useRoute();
const subTramite = ref([]);
const detalleRadicado = ref()

const pagination = ref({
  pageNo: 0,
  pageSize: 20,
  rowsPerPage: 20,
});

async function getDestinatariosData(){
  const responseExt = await sgdeaAxios.get(`/correspondencia/comunicacionManual/consultarCopiasExterna?comunicacionDatosGeneralesId=${props.detailsRadicado.id}`);
  const responseInt = await sgdeaAxios.get(`/correspondencia/comunicacionManual/consultarCopiasInterna?comunicacionDatosGeneralesId=${props.detailsRadicado.id}`);
}


onMounted(async () => {
  await getDestinatariosData()
  renderColumns();

  subTramite.value = props.detailsRadicado.copiasExternaList?.map((item) => ({
      idRadicado: detalleRadicado.value.aprobado ? detalleRadicado.value.idRadicado : 'Desconocido',
      id: item.id,
      nombreDestinatario: item.nombre,
      fechaRadicacion: item.fechaRadicacion,
      formaEnvio: item.codigoFormaEnvio,
      municipio: item.codigoMunicipioDestinatario,
      departamento: item.codigoDepartamentoDestinatario,
      estado: item.estado
    }))
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
      field:  (row) => moment(row.fechaRadicacion).format('DD/MM/YYYY'),
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
