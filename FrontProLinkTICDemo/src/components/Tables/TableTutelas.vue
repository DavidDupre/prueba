<template>
  <q-table
    class="q-pa-md"
    :rows="TABLE_BODY"
    :columns="TABLE_HEADER"
    row-key="tutelas"
    flat
    bordered
  >
    <template v-slot:body-cell-actions="props">
      <div class="tw-flex tw-justify-center">
        <q-btn
          class="tw-h-12"
          flat
          icon="download"
          @click="handleClickDowload(props.row)"
        />
      </div>
    </template>

    <template v-slot:no-data="{ icon, message, filter }">
      <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
        <img v-lazy :data-url="NoData" alt="" width="120" />
        <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
          No existe data por el momento
        </span>
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
//import { watch } from "vue";
import NoData from "assets/filterImage.svg";

const props = withDefaults(
  defineProps<{
    TABLE_BODY: any[];
    TABLE_HEADER: any[];
  }>(),
  {}
);

const emit = defineEmits(["update:itemSelected"]);

const handleClickDowload = (row: any) => {
  emit("update:itemSelected", row);
};
</script>

<style lang="scss" scoped>
.border-header {
  border-color: rgba(0, 0, 0, 0.12);
  border-top: 10px;
  border-left: 0;
  border-bottom-width: 1px;
}

.border {
  border: transparent;
}
</style>
