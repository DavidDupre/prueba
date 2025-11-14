<template>
    <q-card class="tw-rounded-xl tw-p-4" flat bordered>
        <q-expansion-item default-opened>
            <template v-slot:header>
                <div class="col row">
                    <b class="tw-text-lg">Datos del afectado</b>
                </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <span class="text-weight-bold">Anexos medios magnéticos *</span>
                    <q-select :rules="[]" name="anexoMediosMagneticos" outlined v-model="datosAfectado.anexoMediosMagneticos" label="Seleccione" dense map-options emit-value :options="[
                        { value: 'REM', label: 'Remitente'}
                    ]"/>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <span class="text-weight-bold">Anexo cantidad de folios *</span>
                    <q-select :rules="[]" name="anexoCantidadFolios" outlined v-model="datosAfectado.anexoCantidadFolios" label="Seleccione" dense map-options emit-value :options="[
                        { value: 'REM', label: 'Remitente'}
                    ]"/>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <span class="text-weight-bold">Asunto</span>
                    <q-input :rules="[]" name="asunto" outlined v-model="datosAfectado.asunto" label="Inserte" dense />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                    <span class="custom-label text-weight-bold">Observación *</span>
                    <q-input name="observacion" v-model="datosAfectado.observacion" dense label="Inserte" outlined
                    class="mb-3" type="textarea" :rules="[]" />
                </div>
            </div>
        </q-expansion-item>
    </q-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Afectado {
    anexoMediosMagneticos: string;
    anexoCantidadFolios: string;
    asunto: string;
    observacion: string;
}

const datosAfectado = ref<Afectado>({
    anexoMediosMagneticos: '',
    anexoCantidadFolios: '',
    asunto: '',
    observacion: ''
})
</script>