<template>
    <q-card class="tw-rounded-xl tw-p-4 tw-mt-4" flat bordered>
        <q-expansion-item default-opened>
            <template v-slot:header>
                <div class="col row">
                    <b class="tw-text-lg">Datos del Correo</b>
                </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">

                <div class="col-12">
                    <span class="text-weight-bold tw-text-gray-dark">Asunto Correo *</span>
                    <q-input :rules="[inputRequired, v => maxLengthInput(200, v)]" name="asuntoCorreo" outlined v-model="form.asuntoCorreo" label="Inserte" dense :disable="isPorAprobar" />
                </div>

                <div class="col-12">
                    <span class="text-weight-bold tw-text-gray-dark">Cuerpo del Correo *</span>
                    <q-input type="textarea" :rules="[inputRequired, v => maxLengthInput(1000, v)]" name="cuerpoCorreo" outlined v-model="form.cuerpoCorreo" label="Inserte" dense :disable="isPorAprobar" />
                </div>
            </div>
        </q-expansion-item>
    </q-card>
</template>

<script setup lang="ts">
import { defineProps, PropType } from "vue";
import { inputRequired, maxLengthInput } from "src/helpers/validations";

interface Correo {
    asuntoCorreo: string;
    cuerpoCorreo: string;
}

const props = defineProps({
    form: {
        type: Object as PropType<Correo>,
        default: () => ({
            asuntoCorreo: '',
            cuerpoCorreo: ''
        })
    },
    isPorAprobar: {
        type: Boolean,
        required: true
    }
})
</script>