<template>
  <q-select outlined dense v-model="selectData" use-input :hide-selected="!multiple" fill-input input-debounce="0"
    :options="optionList" @filter="filterFn" label="Búsqueda" :multiple="multiple" :rules="rules" :error="isError"
    :error-message="errorMsg" :map-options="mapOptions" :emit-value="emitValue" @update:model-value="handleUpdate" @input-value="addOpt">
    <template v-slot:append>
      <q-icon name="search" />
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No se encontró
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref, watch, computed, Ref, onMounted } from "vue";

const props = withDefaults(defineProps<{
  inputDataProp: any,
  options: any[],
  multiple?: boolean,
  rules?: any[] | undefined,
  limitNumber?: number,
  mapOptions?: boolean,
  emitValue?: boolean,
  editable?: boolean,
}>(), {
  multiple: false,
  editable: false,
})

const optionList: Ref<any[]> = ref([])
const valorSeleccionado = ref<string | null>([]);
const errorMsg = ref()
const isError = ref(false)

const emit = defineEmits(['handleSelect', 'update:inputDataProp', 'update'])

onMounted(() => {

})

const selectData = computed({
  get() {
    return props.inputDataProp
  },
  set(value) {
    emit('update:inputDataProp', value)
    emit('update', value)
  }
})

const addOpt = (newOpt) => {
  if (props.editable) {
    emit('update:inputDataProp', newOpt)
  }
}

const filterFn = (val, update, abort) => {
  if (val.length > props.limitNumber) {
    update(() => {
      isError.value = true
      if (isError.value) {
        errorMsg.value = 'Máximo ' + props.limitNumber + ' cáracteres'
      }
    });
  } else {
    isError.value = false
  }

  update(() => {
    const needle = val.toLowerCase()
    optionList.value = props.options.filter(v => v.label.toLowerCase().indexOf(needle) > -1 )
  })
}

const handleUpdate = (data: any) => {
  emit('update', data)
}

watch(valorSeleccionado, (nuevoValor) => {
  emit("handleSelect", nuevoValor.value)
});

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
