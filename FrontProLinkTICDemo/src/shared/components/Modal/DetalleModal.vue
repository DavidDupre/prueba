<template>
  <q-dialog v-bind="dialogProps" @hide="closeModal">
    <q-card class="q-ma-md">
      <h1 class="text-h6 tw-font-bold tw-p-4">{{ title }}</h1>
      <q-card-section>
        <div v-if="data" class="card-grid">
          <q-card
            v-for="(value, key) in data"
            :key="key"
            class="q-mb-md card-item"
          >
            <q-card-section>
              <strong>{{ key }}:</strong>
              <p>
                Anterior:
                {{ value.valorAnterior ? value.valorAnterior : "No reporta" }}
              </p>
              <p>
                Nuevo: {{ value.valorNuevo ? value.valorNuevo : "No reporta" }}
              </p>
            </q-card-section>
          </q-card>
        </div>
        <!-- <q-card class="q-mb-md tw-mt-4" v-else> -->
         <q-card-section v-else>
        <p class="texto-largo" v-html="formattedText"></p>
      </q-card-section>
        <!-- </q-card> -->
      </q-card-section>
      <q-card-actions class="q-mt-md q-pt-none q-pb-md justify-center">
        <q-btn
          flat
          class="tw-bg-primary tw-w-52"
          label="Cerrar"
          @click="closeModal"
          color="white"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps<{
  isVisible: boolean;
  data: any[];
  detalle: string;
  title: string;
}>();

const emit = defineEmits<{
  (event: "update:isVisible", value: boolean): void;
}>();

const dialogProps = computed(() => ({
  modelValue: props.isVisible,
  "onUpdate:modelValue": (value: boolean) => emit("update:isVisible", value),
}));

const closeModal = () => {
  emit("update:isVisible", false);
};
const keywords = {
  Asignador: true,
  Asignado: true,
  Motivo: true,
  Comentario: true,
  Usuario: true,
  Prefijo: true,
  Tiempo: true,
  Formato: true,
  Proceso: true,
  SubProceso: true,
  "Trámite nuevo": true,
  "Trámite anterior": true,
  Oficina: true,
  "Documento eliminado": true,
  "Tipo de documento": true,
  Gestionó: true,
  Revisor: true,
  "Motivo asignacion revisor": true,
  Aprobador: true,
  "Motivo asignacion aprobador": true,
  "Gestionador nuevo": true,
  "Gestionador anterior": true,
  Dependencia: true,
  Series: true,
  Subseries: true,
  TipoDocumental: true,
  Expedientes: true,
  "Reasignado a": true,
  Detalle: true,
  Destinatario: true,
  Documentos: true,
  Documento: true,
  Rol: true,
  "Oficina anterior": true,
  "Oficina nueva": true,
  "Punto Radicacion anterior": true,
  "Dependencia anterior": true,
  "Nombre Comunicación": true,
  Tipo: true,
  Plantilla: true,
  Expediente: true,
  Descripción: true,
  Aprobadores: true,
  "Número de Guía": true,
  Publicador: true,
  "Teléfono anterior": true,
  "Teléfono Nuevo": true,
  "Dirección anterior": true,
  "Departamento nuevo": true,
  "Dirección nueva": true,
  "Departamento anterior": true,
  "Municipio anterior": true,
  "Municipio nuevo": true,
  "Forma envío": true,
  "Correo nuevo": true,
  "Correo anterior": true,
  "Número de documento": true,
  "Nombre del afectado": true,
  "Radicado asociado": true,
  Siniestro: true,
  "Fecha siniestro": true,
  Asunto: true,
  "Dirección destinatario": true,
  "País destinatario": true,
  Teléfono: true,
  Correo: true,
  "Tipo de copia": true,
  "Nombre documento": true,
  Fecha: true,
  "Tipo documental": true,
  Subserie: true,
  Serie: true,
  " Escaladores":true,
    "Dias de escalamiento":true,
  "Hora de escalamiento":true,
  "Usuario Escalador":true,
  "Usuario de tramite":true,
  Nombre:true,
  Departamento:true,
  Dirección:true, Municipio:true,
  Copia:true,
  "Tipología":true,
  "Procesos":true,
  "Causa Raiz anterior":true,
  "Causa Raiz nueva":true,
  "Consolidador":true,
  "Gestionador":true,

};
const formattedText = computed(() => {
  return props.detalle.replace(
    new RegExp(`(${Object.keys(keywords).join("|")}):`, "g"),
    (match) => {
      return `<br><strong class="tw-color-orange">${match}</strong>`;
    }
  );
});
</script>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card-item {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  width: 40%;
  max-width: 100%;
}

.texto-largo {
  overflow-wrap: break-word;
  white-space: normal; 
}
</style>
