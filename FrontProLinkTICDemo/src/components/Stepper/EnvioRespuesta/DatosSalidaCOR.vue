<template>
    <q-card class="tw-rounded-xl tw-p-4 tw-mt-4" flat bordered>
        <q-expansion-item default-opened>
            <template v-slot:header>
                <div class="col row">
                    <b class="tw-text-lg">Datos de Salida</b>
                </div>
            </template>

            <div class="row q-col-gutter-md q-pb-md q-px-md">

                <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                    <span class="text-weight-bold">Asunto *</span>
                    <q-input :rules="[v => maxLengthInput(100, v)]" name="asunto" outlined v-model="form.asunto" label="Inserte" dense autocomplete="off"
                    :disable="props.isDisabled"/>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <span class="text-weight-bold">Anexos (Cantidad de Folios) *</span>
                    <q-input :rules="[inputRequired, onlyNumbers, v => maxLengthInput(5, v)]" name="anexos" outlined v-model="form.anexos" label="Inserte" dense autocomplete="off" :disable="props.isDisabled"/>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="text-weight-bold">Observaciones *</span>
                    <q-input type="textarea" :rules="[v => maxLengthInput(1000, v)]" name="observacion" outlined v-model="form.observacion"
                        label="Inserte" dense :disable="props.isDisabled"/>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                    <span class="text-weight-bold">Tipo de Documento del Afectado</span>
                    <q-select  name="tipoDocumento" outlined v-model="form.tipoDocumentoAfectado"
                        label="Seleccione" dense map-options emit-value :options="opsTipoDoc" :disable="props.isDisabled"/>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <span class="text-weight-bold">Número de Documento del Afectado {{Number(form.tipoDocumentoAfectado) == 11 ? "":" *"}}</span>
                    <q-input :rules="[Number(form.tipoDocumentoAfectado) == 11 ? alphanumericAbsolute : v => onlyNumbers(v), inputRequired, v => maxLengthInput(15, v)]" name="numeroDocumentoAfectado" outlined
                        v-model="form.numeroDocumentoAfectado" label="Inserte" dense :disable="form.tipoDocumentoAfectado.label === 'Ninguno'|| props.isDisabled" autocomplete="off"/>
                </div>

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="text-weight-bold">Nombre del Afectado </span>
                    <q-input :rules="[alphanumericAbsolute, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]" name="nombreAfectado" outlined v-model="form.nombreAfectado"
                        label="Seleccione" dense map-options emit-value autocomplete="off" :disable="props.isDisabled"/>
                </div>
            </div>
        </q-expansion-item>
    </q-card>
</template>

<script setup lang="ts">
import { ref, defineProps, PropType } from "vue";

import { alphanumeric, inputRequired, maxLengthInput, onlyNumbers, alphanumericAbsolute, alphabeticalWithSpecialCharacters } from "src/helpers/validations";
interface Salida {
    anexos: string;
    asunto: string;
    observacion: string;
    tipoDocumentoAfectado: { label: string, value: string };
    numeroDocumentoAfectado: string;
    nombreAfectado: string;
}

const props = defineProps({
    opsTipoDoc: [],
    isDisabled: Boolean,
    form: {
        type: Object as PropType<Salida>,
        default: () => ({
            anexos: '',
            asunto: '',
            observacion: '',
            tipoDocumentoAfectado: { label: '', value: '' },
            numeroDocumentoAfectado: '',
            nombreAfectado: ''
        })
    }
})
</script>
