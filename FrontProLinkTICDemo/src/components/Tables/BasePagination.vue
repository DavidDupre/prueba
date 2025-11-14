<template>
  <div class="row items-center q-mt-md tw-w-full" v-if="totalPages > 0">
    <!-- Filas -->
    <div class="col-auto tw-flex tw-gap-x-3 tw-items-center">
      <span>Filas</span>
      <q-select
        :options="rowsOptions"
        :model-value="rowsPerPage"
        dense
        outlined
        @update:model-value="$emit('update:rowsPerPage', $event)"
      />
    </div>

    <!-- Paginación centrada -->
    <div class="col tw-flex tw-justify-center">
      <q-pagination
        :model-value="page"
        :max="totalPages"
        :max-pages="maxPages"
        color="primary"
        size="md"
        direction-links
        boundary-links
        boundary-numbers
        ellipsis
        @update:model-value="$emit('update:page', $event)"
      />
    </div>

    <!-- Texto + invisible -->
    <div class="col-auto tw-flex tw-items-center tw-text-right">
      {{ paginationMessage }}
      <div class="invisible"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  rowsPerPage: {
    type: Number,
    required: true
  },
  page: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  paginationMessage: {
    type: String,
    default: ""
  },
  rowsOptions: {
    type: Array,
    default: () => [5, 10, 25, 50, 100]
  },
  maxPages: {
    type: Number,
    default: 10
  }
});

defineEmits(["update:rowsPerPage", "update:page"]);
</script>
