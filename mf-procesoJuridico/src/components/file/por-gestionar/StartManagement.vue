<template>
  <div class="q-pa-md container_background">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 text-primary">
          <q-icon name="play_circle" size="md" class="q-mr-sm" />
          Iniciar Gestión del Proceso
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-center q-pa-xl">
          <q-icon name="task_alt" size="100px" color="positive" />

          <div class="text-h5 q-mt-md q-mb-sm">Gestión Iniciada Correctamente</div>

          <div class="text-body1 text-grey-7 q-mb-lg">
            El proceso ha sido habilitado para gestión. Ahora puede acceder a todas las
            funcionalidades disponibles a través de las pestañas del menú.
          </div>

          <q-list
            bordered
            separator
            class="rounded-borders q-mt-lg"
            style="max-width: 600px; margin: 0 auto"
          >
            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Gestión de documentos de salida</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Adjuntar documentos adicionales</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Vincular expedientes</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon color="green" name="check_circle" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Escalar proceso y enviar a revisión/aprobación</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="q-mt-lg text-body2 text-grey-6">
            Utilice el menú de navegación superior para acceder a las diferentes opciones de
            gestión.
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';

// Inyectar la función para cambiar el estado
const changeToManagement = inject<() => void>('startManagement');

// Cambiar automáticamente al estado "En Gestión" cuando se monta el componente
onMounted(() => {
  if (changeToManagement) {
    changeToManagement();
  }
});
</script>
