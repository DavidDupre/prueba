<template>
<TableBase
  :TABLE_BODY="props.TABLE_BODY"
  :TABLE_HEADER="props.TABLE_HEADER ? props.TABLE_HEADER : columns"
  isSelection="none"
/>

</template>

<script lang="ts" setup>
import TableBase from "src/components/Table.vue";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps<{
  TABLE_BODY: any[];
  TABLE_HEADER?: any[];
}>();

let columns = ref([
  {
    label: "Canal",
    field: "canal",
    align: "center",
    name: "canal",},
  {
    label: "Usuario",
    field: "nombre",
    align: "center",
    name: "usuarioA",
    sort: (row) => row.nombre,
  },
  {
    label: "Acción",
    field: "accion",
    align: "center",
    name: "action",
  },
  {
    label: "Trámite",
    field: "tramite",
    align: "center",
    name: "tramite",
  },
  {
    label: "Fecha",
    field: "fechaHora",
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
  },
]);

onBeforeMount(() => {
  const currentRoute =
    router.currentRoute.value.fullPath.includes("facturacion");
  if (currentRoute) {
    columns.value = columns.value.map((column) => {
      if (column.name === "usuarioA") {
        column.name = "usuario";
      } else if (column.name === "action") {
        column.field = "action";
      } else if (column.name === "detalle") {
        column.field = "detalle";
      }
      return column;
    });
  }
});
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
