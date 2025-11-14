<template>
  <div class="file-loader-container">
    <!-- Área de carga principal -->
    <div
      class="upload-area q-pa-lg"
      style="
        cursor: pointer;
        border: 2px dashed #ccc;
        border-radius: 8px;
        text-align: center;
        position: relative;
      "
    >
      <!-- Input HTML nativo transparente que cubre toda el área -->
      <input
        type="file"
        :multiple="props.multiple"
        :accept="props.accept"
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 10;
        "
        @change="onFileChange"
      />

      <div
        v-if="!hasFiles"
        class="upload-empty"
        style="position: relative; z-index: 1; pointer-events: none"
      >
        <div class="row justify-center items-center q-mb-sm">
          <q-icon name="add_to_drive" size="48px"></q-icon>
        </div>
        <b class="block q-mb-xs">Clic aquí para cargar sus archivos</b>
        <p class="text-grey-7 q-ma-none">Peso máximo de 50MB</p>
      </div>
      <div
        v-else
        class="upload-with-files"
        style="position: relative; z-index: 1; pointer-events: none"
      >
        <div class="row justify-center items-center q-mb-sm">
          <q-icon
            name="add_circle"
            size="24px"
            color="primary"
            class="q-mr-sm"
          ></q-icon>
          <b>Clic aquí para cargar más archivos</b>
        </div>
      </div>
    </div>

    <!-- Lista de archivos cargados -->
    <div v-if="hasFiles" class="files-list q-mt-md" @click.stop>
      <q-chip
        v-for="(file, index) in fileArray"
        :key="index"
        class="q-py-md q-ma-xs"
        square
        outline
        removable
        @remove="removeFile(index)"
        @click.stop
      >
        <q-icon name="description" size="1.5rem" class="q-mr-sm" />
        <div class="ellipsis relative-position">
          {{ file.name }}
        </div>
        <q-tooltip>
          {{ file.name }}
        </q-tooltip>
      </q-chip>
    </div>

    <p v-if="props.hint" class="text-grey-7 q-mt-sm">{{ props.hint }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
// Importaciones explícitas de Quasar para MF

type FileValue = File[] | File | null;

interface FileLoaderProps {
  modelValue: FileValue;
  hint?: string;
  multiple?: boolean;
  accept?: string;
}

const props = withDefaults(defineProps<FileLoaderProps>(), {
  modelValue: null,
  hint: "",
  multiple: true,
  accept: "*/*",
});

const emit = defineEmits<{
  "update:modelValue": [value: FileValue];
}>();

// Eliminado fileRef y setFileRef, ya no se usan

// Computed para verificar si hay archivos de forma segura
const hasFiles = computed(() => {
  const val = props.modelValue;
  console.log(
    "hasFiles computed - modelValue:",
    val,
    "isArray:",
    Array.isArray(val)
  );
  if (Array.isArray(val)) {
    return val.length > 0;
  }
  return val !== null;
});

// Computed para obtener el array de archivos
const fileArray = computed(() => {
  const val = props.modelValue;
  console.log("fileArray computed - modelValue:", val);
  if (Array.isArray(val)) {
    return val;
  }
  return val ? [val] : [];
});

// Watch para diagnosticar cambios en modelValue desde el padre
watch(
  () => props.modelValue,
  (val) => {
    console.log(
      "[FileLoader] modelValue changed:",
      val,
      "isArray:",
      Array.isArray(val)
    );
  },
  { immediate: true }
);

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const filesArray = Array.from(target.files);
    const validFiles = checkFileSize(filesArray);

    if (validFiles.length === 0) {
      console.warn("Todos los archivos exceden el tamaño máximo de 50MB");
      return;
    }

    // Determinar el nuevo valor basado en si es múltiple o no
    let newValue: FileValue;

    if (props.multiple) {
      // Si es múltiple, SIEMPRE trabajar con arrays
      if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
        // Agregar a los existentes
        newValue = [...props.modelValue, ...validFiles];
      } else {
        // Crear nuevo array
        newValue = validFiles;
      }
    } else {
      // Si no es múltiple, solo un archivo
      newValue = validFiles[0] || null;
    }

    console.log("Emitting files:", newValue);
    console.log("Is array?", Array.isArray(newValue));
    emit("update:modelValue", newValue);

    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    target.value = "";
  }
}

function checkFileSize(files: File[]) {
  // Aceptar SOLO archivos de hasta 50MB
  return files.filter((file: File) => file.size <= 50 * 1024 * 1024);
}

function removeFile(index: number) {
  if (Array.isArray(props.modelValue)) {
    const newFiles = [...props.modelValue];
    newFiles.splice(index, 1);
    console.log("Removing file, new array:", newFiles);
    emit("update:modelValue", newFiles.length > 0 ? newFiles : null);
  } else if (props.modelValue) {
    // Si es un solo archivo, emitir null
    emit("update:modelValue", null);
  }
}

// Eliminada función openPicker porque no se usa
</script>
