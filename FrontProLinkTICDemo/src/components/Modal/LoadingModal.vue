<template>
    <q-dialog v-model="isLoading" persistent transition-show="scale" transition-hide="scale" transition-duration="300">
      <q-card class="tw-px-10 tw-py-5">
        <q-card-section class="tw-flex tw-flex-col tw-items-center q-gutter-sm">
          <div class="relative-position">
            <q-spinner-ios size="120px" color="orange-7"/>
            <div class="absolute-center tw-font-bold tw-text-2xl">{{ loading }}%</div>
          </div>
          <div class="tw-flex tw-flex-col tw-items-center tw-gap-3.5">
            <div class="tw-text-xl tw-font-bold">{{ props.title }}</div>
            <div class="tw-text-md tw-text-gray-600">{{ props.subtitle }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Consultando informaciónnnnnnnnn"
  },
  subtitle: {
    type: String,
    default: "Espere un momento por favor"
  },
  total: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['load-complete'])
const isLoading = ref(false)
const loading = ref(0)

async function loadData() {
  isLoading.value = true

  for (let i = 0; i < props.total; i++) {
    await new Promise(resolve => setTimeout(resolve, 100))
    loading.value = Math.floor((i / props.total) * 100)
  }

  isLoading.value = false
  emit('load-complete')
}

onMounted(loadData)
</script>

<style scoped lang="scss">
.q-card {
  border-radius: 10px;
}
</style>
