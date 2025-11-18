<template>
  <div class="navigation-bar-container container_background">
    <q-tabs
      v-model="internalValue"
      inline-label
      no-caps
      outside-arrows
      align="left"
      class="navigation-tabs"
      active-color="orange-6"
      indicator-color="orange-6"
    >
      <q-tab
        v-for="tab in tabs"
        :key="tab.id"
        :name="tab.id"
        class="tab-item"
        @click="handleClick(tab.id)"
      >
        <div class="tab-content">
          <div class="tab-indicator" :class="internalValue === tab.id ? tab.color : 'bg-grey-5'" />
          <q-icon :name="tab.icon" size="16px" />
          <span class="tab-label">{{ tab.label }}</span>
        </div>
      </q-tab>
    </q-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QTabs, QTab, QIcon } from 'quasar';

interface Tab {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface Props {
  tabs: Tab[];
  defaultTab?: string;
  modelValue?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const internalValue = ref(props.modelValue || props.defaultTab || props.tabs[0]?.id || '');

watch(
  () => props.modelValue,
  (val) => {
    if (val && val !== internalValue.value) internalValue.value = val;
  },
);

watch(internalValue, (val) => {
  emit('update:modelValue', val);
  emit('change', val);
  console.log('[NavigationBar] Tab activo cambiado a:', val);
});

function handleClick(id: string) {
  if (internalValue.value !== id) internalValue.value = id;
}
</script>

<style scoped lang="scss">
.navigation-bar-container {
  width: 100%;
}

.tab-item {
  position: relative;
  border: none; /* Eliminar el bordeado */

  &:not(:last-child) {
    border-right: none; /* Asegurar que no haya bordes entre pestañas */
  }
}

.tab-content {
  display: flex;
  align-items: center;
  gap: 4px; /* Reducir aún más el espacio entre el icono y el texto */
  padding: 0 8px;
}

.tab-label {
  font-size: 14px;
  font-weight: 500;
}

.tab-indicator {
  display: none; /* Ocultar el indicador si no es necesario */
}
</style>
