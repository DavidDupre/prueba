<template>
  <div>
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-10 tw-gap-6">
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
        {{ title }}
      </p>
    </div>

    <q-table flat :rows="body" :columns="JUZGADOS_HEADER" row-key="nombre" table-header-class="text-black text-h6 "
      class="q-mr-md full-width"
      no-data-label="No se encontraron datos con los criterios ingresados, por favor verifique e intente nuevamente"
      v-model:pagination="pagination" hide-pagination selection="none" v-model:selected="selected">

      <template v-slot:body-cell-acciones="props">
        <q-td>
          <q-btn no-caps style="color: #FF7500;" unelevated icon="delete" @click="deleteFila(props.rowIndex)" />
        </q-td>
      </template>

      <template v-slot:bottom>
        <div class="row q-mt-md" style="width: 100%;">
          <div class="col">
            <label for="" class="flex items-center q-gutter-x-md">
              <span style="font-size: 14px; font-weight: 500;">
                Filas por página
              </span>
              <q-select style="width: 120px; height: 40px;" outlined dense mapOptions emitValue
                :options="[5, 25, 50, 100]" v-model:model-value="pagination.rowsPerPage" />
            </label>
          </div>

          <q-pagination v-model="pagination.page" color="black" active-color="primary" direction-links gutter="20px"
            :max="pagesNumber" class="col-8 q-pl-xl" />
        </div>
      </template>

      <template v-slot:no-data="{ message }">
        <div class="flex items-center justify-center full-width">
          <div class="flex items-center justify-center q-mt-lg"
            style="padding: 15px; border: 1px solid #E3E4E5; border-radius: 5px; gap: 9px;">
            <q-icon size="20px" name="cancel" color="negative" />
            <span class="text-weight-medium">
              {{ message }}
            </span>
          </div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch} from "vue";
const props = withDefaults(defineProps<{
  JUZGADOS_HEADER: any[],
  JUZGADOS_BODY: any[],
  title?: string,
}>(), {
  title: 'Usuarios internos en copia'
})

const emit = defineEmits(["update:itemDeleted"]);

const body = ref(props.JUZGADOS_BODY)
const selected = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 5,
})

const deleteFila = async (id) => {
  const fila = props.JUZGADOS_BODY[id]
  const destinatairesFiltered = props.JUZGADOS_BODY.filter((item: any) => item !== fila)
  emit("update:itemDeleted", destinatairesFiltered)
}

watch(
    () => props.JUZGADOS_BODY,
    (newBody) => {
      const unique = [];
      const seen = new Set();
      for (const item of newBody) {
        const key = JSON.stringify(item);
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      }
      body.value = unique;
    }
  );

const pagesNumber = computed(() => Math.ceil(props.JUZGADOS_BODY.length / pagination.value.rowsPerPage));

</script>