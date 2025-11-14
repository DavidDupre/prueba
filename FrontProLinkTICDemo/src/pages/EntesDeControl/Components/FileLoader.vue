<template>
  <label for="" class="grid tw-h-auto">
    <q-file ref="fileInput" v-model="value" outlined :dense="dense" use-chips :max-file-size="maxFileSize" append
      :disable="disable" :loading="loading" :multiple="multiple" class="" :accept="acceptFile" @rejected="rejected"
      @clear="clear" :rules="rules" :max-files="maxFiles" @click="resetFileInput" />
    <figure v-if="!value || value.length === 0" class="flex tw-items-center tw-justify-center !tw-text-sm">
      <div v-if="!dense">
        <q-icon name="add_to_drive" color="grey-6" size="1.5rem"></q-icon>
        <b class="block">Clic aquí para cargar sus archivos</b>
        <p class="block tw-text-gray-500" v-html="props.subTitle" v-if="props.subTitle"></p>
        <p class="text-grey-7" v-if="maxFileSize && !props.subTitle">
          Peso máximo de {{ `${maxFileSizeLabel}MB` ?? "2MB" }}
        </p>
      </div>
      <div v-else>
        <b class="block">Carga tus archivos</b>
        <p class="text-grey-7" v-if="maxFileSize && !props.subTitle">
          Peso máximo de {{ `${maxFileSizeLabel}MB` ?? "2MB" }}
        </p>
      </div>
    </figure>
  </label>
</template>

<script lang="ts" setup>
import { toast } from "src/helpers/toast";
import { computed, ref } from "vue";

const props = defineProps({
  dense: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  disable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  modelValue: { type: null, required: true },
  acceptFile: { type: String, default: '' },
  maxFileSize: { type: Number, default: 0 },
  maxFiles: { type: Number, default: 30 },
  maxFileSizeLabel: { type: String, default: '' },
  rules: { type: Array, default: [] },
  subTitle: { type: String, default: '' },
})

const emit = defineEmits(["update:modelValue", "rejected", "clear"]);
const fileInput = ref()
const uploadedFiles = ref([]);
const vs = ref(null);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    val.forEach(file => {
      if (!uploadedFiles.value.includes(file.name)) {
        uploadedFiles.value.push(file.name);
      }
    });
    emit("update:modelValue", val);
  },
});

function checkDuplicate(files: any) {
  return files.filter((file: any) => uploadedFiles.value.includes(file.name));
}

function resetFileInput() {
  if (fileInput.value) {
    fileInput.value.$el.querySelector('input[type="file"]').value = null;
    fileInput.value.resetValidation();
  }
}

const rejected = (reject) => {
  const duplicates = checkDuplicate(reject);
  if (duplicates.length > 0) {
    toast.error('No puedes subir archivos duplicados');
  }
  emit("rejected", reject);
};

const clear = (clear) => {
  emit("clear", clear);
};
</script>

<style scoped>
.grid {
  display: grid;
  min-height: 160px;
}

.grid>* {
  grid-area: 1/1;
}

.grid>figure {
  text-align: center;
}

.q-field__control {
  height: 100% !important;
}

.h-full {
  height: 100%;
}
</style>

<style>
.grid .q-field--auto-height .q-field__control {
  height: 100% !important;
}
</style>