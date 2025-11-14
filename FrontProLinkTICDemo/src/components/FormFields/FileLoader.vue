<template>
  <label for="" class="grid tw-h-auto">
    <q-file
      v-model="value"
      outlined
      :dense="dense"
      use-chips
      :max-file-size="maxFileSize"
      append
      :disable="disable"
      :loading="loading"
      :multiple="multiple"
      class=""
      :accept="acceptFile"
      @rejected="rejected"
      @clear="clear"
      :rules="customRules"
      :max-files="maxFiles"
      @update:model-value="updateModel"
    />
    <figure
      v-if="!value || value.length === 0"
      class="flex tw-items-center tw-justify-center !tw-text-sm"
    >
      <div v-if="!dense" style="padding-bottom: 50px; padding-top: 20px;" >
        <q-icon name="add_to_drive" color="grey-6" size="1.5rem"></q-icon>
        <b class="block">Clic aquí para cargar sus archivos</b>
        <p class="block tw-text-gray-500" v-html="props.subTitle" v-if="props.subTitle"></p>
        <p class="text-grey-7" v-if="maxFileSize && !isShowDetailMsgFile && !props.subTitle">
          Peso máximo de {{ `${maxFileSizeLabel}MB` ?? "2MB" }}
        </p>
        <p class="text-grey-7" v-if="maxFiles && !props.subTitle">
          Cantidad máxima de archivos: {{ maxFiles }}
        </p>
        <p class="text-grey-7" v-if="isShowDetailMsgFile">
          {{ props.detailsMsgFile }}
        </p>
      </div>
      <div v-else>
        <b class="block">Carga tus archivos</b>
        <p class="text-grey-7" v-if="maxFileSize">
          Peso máximo de {{ `${maxFileSizeLabel}MB` ?? "2MB" }}
        </p>
      </div>
    </figure>
  </label>
</template>

<script lang="ts" setup>
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
  isShowDetailMsgFile: { type: Boolean, required: false, default: false },
  detailsMsgFile: { type: String, required: false },
  required: { type: Boolean, default: false },
  subTitle: { type: String, default: '' },
  existingFiles: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "rejected", "clear", "updateModel"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});


function getValidFileName(fileName, existingList) {
  const nameParts = fileName.split('.');
  const extension = nameParts.length > 1 ? '.' + nameParts.pop() : '';
  const baseName = nameParts.join('.');

  let newName = fileName;
  let counter = 1;

  while (existingList.includes(newName)) {
    newName = `${baseName} (${counter})${extension}`;
    counter++;
  }
  return newName;
}

const updateModel = (newFiles) => {
  if (!newFiles || newFiles.length === 0) {
    emit("update:modelValue", newFiles);
    return;
  }

  // Extraer solo nombres existentes que recibe el componente
  const existingNames = [...props.existingFiles];

  const renamedFiles = newFiles.map(file => {
    if (!file || !file.name) return file;
    const newName = getValidFileName(file.name, existingNames);
    existingNames.push(newName);
    if (newName !== file.name) {
      return new File([file], newName, { type: file.type });
    }
    return file;
  });

  emit("update:modelValue", renamedFiles);
  emit("updateModel", renamedFiles);
};


const customRules = computed(() => [
  ...props.rules,
  (value) => {
    if (props.required && (!value || value.length === 0)) {
      return 'Es obligatorio adjuntar archivos.';
    }
    return true;
  }
]);

const rejected = async (reject) => {
  await emit("rejected", reject);
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
