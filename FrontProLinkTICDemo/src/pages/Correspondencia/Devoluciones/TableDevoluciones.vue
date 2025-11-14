<template>
    <div>
      <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6 "
        class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
        v-model:pagination="pagination" :selection="select" :loading="loading" v-model:selected="selection">
        <template v-slot:body-cell-id="props">
          <q-td class="tw-flex tw-items-center tw-justify-center tw-gap-2">
            <p>
              {{ props.row.id }}
            </p>
          </q-td>
        </template>

        <template v-slot:body-cell-caso="props">
          <q-td class="tw-w-[125px]" @click="handleCaso(props.row[rowId])">
            <p class="tw-py-1.5 tw-rounded-md col-8 tw-bg-gray-texts tw-px-4 tw-cursor-pointer tw-font-bold">
              {{ props.row.caso }}
            </p>
          </q-td>
        </template>

        <template v-slot:body-cell-toggle="props">
          <q-td>
            <q-toggle v-model="props.row.toggle" color="secondary"></q-toggle>
          </q-td>
        </template>
      </q-table>
      <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
        <div class="tw-flex tw-gap-x-3 tw-items-center">
          <span>Filas</span>
          <q-select :options="[5, 20, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
        </div>
        <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links boundary-links
          boundary-numbers />
        <q-btn icon="refresh" type="button" flat class="invisible" />
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { useQuasar } from "quasar";
  import { computed, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";

  const props = withDefaults(defineProps<{
    TABLE_BODY: any[],
    TABLE_HEADER: any[],
    icon?: string,
    keyId?: any,
    msgNoData?: string,
    rowId?: string,
    isSecondIcon?: boolean,
    secondIcon?: string,
    select: "none" | "single" | "multiple",
    // buscar: string,
    // action: string,
    // target?: string,
}>(), {
    select: "none",
    keyId: "codigo",
    secondIcon: "eye",
    // target: ""
})


  const vuerouter = useRouter();
  const route = useRoute();
  const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 5,
  });

  const rowsPerPage = ref(5);
  const selection = ref([]);
  const showingFullText = ref(false);

  let pagesNumber = computed(() =>
    Math.ceil(props.TABLE_BODY.length / rowsPerPage.value)
  );

  const emit = defineEmits([
    "update:itemSelected",
    "update:inputDataProp",
    "handleEditData",
    "handleSecondIcon",
    "handleTrazabilidad",
    "handleCaso",
    "handleThridIcon",
  ]);

  const handleCaso = (id) => {
    emit("handleCaso", id);
  };

  watch(rowsPerPage, (value) => {

    pagination.value.rowsPerPage = value;
  });


  watch(selection, (newdateData) => {
    selection.value = newdateData;
    emit("update:itemSelected", selection.value);
  });

  const cleanSelect = () => {
    selection.value = []
  }

  defineExpose({
    cleanSelect
  });
  </script>

  <style>
  .material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
  }
  </style>
