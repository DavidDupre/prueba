
<template>
  <div>
    <q-table flat :rows-per-page-options="[5, 25, 50, 100]" :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="'id'"
      table-header-class="text-black text-h6 " class="q-mr-md full-width" rows-per-page-label="Páginas"
      selection="multiple" v-model:selected="selection">
      <template v-slot:body-cell-estados="props">
        <q-td class="">

          <span class=" tw-rounded-xl col-8 tw-py-2 tw-px-4">
            {{ props.row.estados }}
          </span>
        </q-td>
      </template>



      <template v-slot:body-cell-observaciones="props">
        <q-td>
          <div class="tw-flex  tw-flex-col tw-px-2 tw-py-4 tw-w-96 tw-whitespace-normal ">
            <p class="tw-text-center" v-if="isCollapsed == props.row.id">

              {{ (props.row.observaciones) }}
            </p>
            <p class="tw-text-center" v-else>
              {{ showTextTable(props.row.observaciones) }}

            </p>
            <div class="tw-flex tw-justify-end" v-if="(props.row.observaciones.length > 50)">

              <q-btn flat color="secondary" @click="() => isCollapsed = 0" v-if="isCollapsed == props.row.id">Ver
                menos</q-btn>
              <q-btn flat color="secondary" @click="() => isCollapsed = props.row.id" v-else>Ver
                más</q-btn>
            </div>

          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">

        <q-td class="text-center">
          <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat
            @click="editRow(props.row.id_seriesubserie || props.row.id)" />
        </q-td>

      </template>

      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
          </span>
        </div>
      </template>

    </q-table>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import NoData from "assets/filterImage.svg";

const vuerouter = useRouter()
const route = useRoute()
const selection = ref([])
const isCollapsed = ref(0);

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  selection: "none" | "single" | "multiple" | undefined,
  itemSelected: any[],
  icon: string,
  keyId?: string,
  msgNoData: string
}>(), {
  selection: "none",
  keyId: "id"
  // target: ""
})

const emit = defineEmits(['update:itemSelected'])

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});

function editRow(id: number) {
  vuerouter.push(route.path + '/editar/' + id)
}


const showTextTable = (text = '', shortenSize = 50) => {
  return text.slice(0, shortenSize);

}
</script>

<style lang="scss" scoped></style>

