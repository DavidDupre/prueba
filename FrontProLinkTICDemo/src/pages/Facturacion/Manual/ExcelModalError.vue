<template>
  <q-dialog v-model="props.showErrorModal" persistent>
    <q-card style="min-width: 600px">
      <q-card-section class="row items-center">
        <q-icon name="error" color="negative" size="2em" />
        <span class="q-ml-sm text-h6">Errores en documentos</span>
      </q-card-section>

      <q-card-section>
        <div v-for="(doc, index) in props.invalidDocuments" :key="index" class="q-mb-md">
          <div class="text-weight-bold">
            <template v-if="doc.numeroRadicado">
              Documento: {{ doc.numeroRadicado }}
              <span v-if="doc.prefijoFactura || doc.numeroFactura">
                ({{ doc.prefijoFactura || '' }} {{ doc.numeroFactura || '' }})
              </span>
            </template>
            <template v-else>
              Documento: {{ doc.prefijoFactura }} - {{ doc.numeroFactura }}
            </template>
          </div>

          <div v-if="doc.adquiriente" class="text-subtitle2 q-mt-xs">
            Adquiriente: {{ doc.adquiriente }}
          </div>

          <q-list bordered separator class="q-mt-sm">
            <q-item v-for="(error, errorIndex) in doc.errores" :key="errorIndex">
              <q-item-section>
                <q-item-label>{{ error }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
const props = defineProps({
  showErrorModal: Boolean,
  invalidDocuments: Array
});
</script>
