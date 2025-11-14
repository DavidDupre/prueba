<template>
  <div class="card">
    <Tabs :value="defaultTab" scrollable @update:value="onTabChange">
      <TabList>
        <Tab
          v-for="tab in tabs"
          :key="tab.title"
          :value="tab.value"
          class="tw-flex tw-gap-4 tw-items-center tw-color-black"
          :disabled="
            appStore.status === 'Pendiente Autorización' || tab.disable
          "
        >
          <Icon :name="tab.icon" size="xl"></Icon>
          {{ tab.title }}
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
          <slot :name="tab.value"></slot>
        </TabPanel>
        <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
          <slot :name="'Acta de anulación'"></slot>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "primevue";
import Icon from "src/shared/components/PrimeComponents/Icon/Icon.vue";
import { useAppStore } from "src/stores/taskStatus.store";
import { useRouter } from "vue-router";
const router = useRouter();

const appStore = useAppStore();

const props = defineProps({
  tabs: Array,
  defaultTab: String,
});

const emit = defineEmits(["update:tab"]);

const onTabChange = (newValue) => emit("update:tab", newValue);

const createTipoSecuencia = () => {
  router.back();
};
</script>

<style lang="css">
.p-tablist-tab-list {
  background-color: white !important;
  border-style: none !important;
}

.p-tablist {
  border-radius: 8px;
  background-color: white !important;
}

.p-tab {
  color: black !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  background-color: white !important;
  border: none !important;
  box-shadow: none !important;
}

.p-tab-active {
  color: var(--primary) !important;
  border-radius: none !important;
  border-color: #e5e7eb !important;
}

.p-tab:hover {
  background: #e5e7eb !important;
  border-radius: 10px;
}

.p-tabpanels {
  background: transparent !important;
  margin-top: 10px !important;
  border-radius: 8px !important;
}

/* Estilos para los botones de navegación (< >) */
.p-tablist-nav-button {
  background: white !important;
  color: black !important;
  border-radius: 8px !important;
  transition: background-color 0.3s ease !important;
  border: none !important;
  box-shadow: none !important;
}

.p-tablist-nav-button:hover {
  background: #e5e7eb !important;
}

/* Estilos para el ícono dentro de los botones de navegación */
.p-tablist-nav-button .p-icon {
  color: black !important;
  border: none !important;
  box-shadow: none !important;
}

/* Estilos para los íconos dentro de las pestañas */
.p-tab .p-icon {
  border: none !important;
  box-shadow: none !important;
}
</style>
