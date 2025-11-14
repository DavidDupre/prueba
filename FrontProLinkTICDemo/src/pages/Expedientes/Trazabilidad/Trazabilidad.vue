<template>
  <div>
    <q-card class="tw-p-6 q-mt-md">
      <div class="q-mt-sm">
        <div class="row tw-justify-between">
          <p class="tw-text-lg text-weight-bold q-mx-lg">
            Trazabilidad
          </p>
        </div>
        <Table :TABLE_HEADER="columns" :TABLE_BODY="props.doneItems" />
      </div>
    </q-card>

  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import Table from "src/components/Table.vue";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  doneItems: Array<{
    descripcion: string;
    detalle: string;
    fecha: string;
    usuario: string;
    tramite: string;
    estado: string;
    index: number;
  }>;
  module?: string;
}>();
let columns = [
  {
    label: "Canal",
    field: "canal",
    align: "center",
    name: "canal",
  },
  {
    label: "Usuario",
    field: row =>
      [row.nombre, row.oficinaUsuario, row.cargoUsuario]
        .filter(Boolean)
        .join(' - '),
    align: "center",
  },
  {
    label: "Acción",
    field: "descripcion",
    align: "center",
    name: "action",
  },
  {
    label: "Trámite",
    field: 'tramite',
    align: "center",
    name: "tramite",
  },
  // {
  //   label: "Oficina del usuario",
  //   field: row => row.oficina ?? '-',
  //   align: "center",
  //   sortable: true,
  //   name: "oficina"
  // },
  {
    label: "Fecha y hora",
    field: (row: { fechaHora: string }) => moment(row.fechaHora, 'YYYY-MM-DD HH:mm:ss', true).isValid()
      ? moment(row.fechaHora, 'YYYY-MM-DD HH:mm:ss', true).format('DD/MM/YYYY HH:mm')
      : row.fechaHora,
    align: "center",
    name: "fecha",
  },
  {
    label: "Estado",
    field: "estado",
    align: "center",
    name: "estado",
  },
  {
    label: "Detalle",
    field: "descripcion",
    align: "center",
    name: "detalle",
  }
];

onBeforeMount(() => {
  const currentRoute = router.currentRoute.value.fullPath.includes('facturacion');
  if (currentRoute) {
    columns = columns.map((column) => {
      if (column.name === 'usuarioA') {
        column.name = 'usuario';
      } else if (column.name === 'action') {
        column.field = "action";
      } else if (column.name === 'detalle') {
        column.field = "detalle";
      }
      return column;
    })
  }
})
</script>

<style scoped>
.linea-vertical {
  width: 2px;
  height: 30px;
  background-color: var(--primary);
  margin-left: 14px;
  margin-top: -3px;
}

.state-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-left: 3px;
}
</style>
