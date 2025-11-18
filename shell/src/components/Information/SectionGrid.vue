<script setup lang="ts">
import type { DataField } from 'interface/information/section';
import { computed } from 'vue';
import { QExpansionItem } from 'quasar';

interface Props {
  title: string;
  columns?: number;
  data: DataField[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  collapsible: true,
  defaultExpanded: true,
});

// Calcular el grid de columnas basado en el prop
const gridColumns = computed(() => {
  return `repeat(${props.columns}, 1fr)`;
});

// Organizar los datos en filas según el número de columnas
const dataRows = computed(() => {
  const rows: DataField[][] = [];
  for (let i = 0; i < props.data.length; i += props.columns) {
    rows.push(props.data.slice(i, i + props.columns));
  }
  return rows;
});
</script>

<template>
  <div class="info-section">
    <q-expansion-item
      :model-value="defaultExpanded"
      :disable="!collapsible"
      header-class="info-section__header"
      expand-icon-class="info-section__icon"
    >
      <template v-slot:header>
        <h3 class="info-section__title text-h6 text-weight-medium">
          {{ title }}
        </h3>
      </template>

      <template v-slot:default>
        <div class="info-section__content">
          <div
            v-for="(row, rowIndex) in dataRows"
            :key="`row-${rowIndex}`"
            class="info-section__row"
            :style="{ gridTemplateColumns: gridColumns }"
          >
            <div
              v-for="(field, colIndex) in row"
              :key="`field-${rowIndex}-${colIndex}`"
              class="info-section__field"
            >
              <span class="info-section__label text-caption text-grey-7">
                {{ field.label }}
              </span>
              <p class="info-section__value text-body2 text-weight-regular q-mb-none">
                {{ field.value }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </q-expansion-item>
  </div>
</template>

<style scoped lang="scss">
.info-section {
  background: white;
  margin: 2rem;

  &__header {
    padding: 4px 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  &__title {
    margin: 0;
    color: #1a1a1a;
    font-size: 16px;
  }

  &__row {
    display: grid;
    gap: 24px 16px;
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__label {
    font-size: 12px;
    line-height: 1.4;
    margin-bottom: 0;
  }

  &__value {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
  }

  :deep(.q-expansion-item__container) {
    .q-item {
      padding: 0 0 40px 0;
    }
  }
}
</style>
