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
                    <span class="text-weight-bold tw-text-gray-dark">Asunto *</span>
                    <q-input :rules="[inputRequired, v => maxLengthInput(100, v)]" name="asunto" outlined v-model="form.asunto" label="Inserte" dense :disable="isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <span class="text-weight-bold tw-text-gray-dark">Anexos (Cantidad de Folios) *</span>
                    <q-input :rules="[inputRequired, onlyNumbers, v => maxLengthInput(5, v)]" name="anexos" outlined v-model="form.anexos" label="Inserte" dense :disable="isPorAprobar" />
                </div>

                <!-- <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="text-weight-bold tw-text-gray-dark">Observación * {{form.observacion.length}}/1000</span>
                    <q-input type="textarea" :rules="[inputRequired, v => maxLengthInput(1000, v)]" name="observacion" outlined v-model="form.observacion"
                        label="Inserte" dense :disable="isPorAprobar" />
                </div> -->

                <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                    <span class="text-weight-bold tw-text-gray-dark">Tipo de Documento del Afectado *</span>
                    <q-select :rules="[inputRequired]" name="tipoDocumento" outlined v-model="form.tipoDocumentoAfectado"
                        label="Seleccione" dense map-options emit-value :options="tipoDocumentoDatosSalida" @update:model-value="typeAfectado" @blur="getPerson" :disable="isPorAprobar" />
                </div>

                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                    <span class="text-weight-bold tw-text-gray-dark">Número de Documento del Afectado</span>
                    <q-input :rules="[alphanumericAbsolute, inputRequired, v => maxLengthInput(15, v)]" name="numeroDocumentoAfectado" outlined
                        v-model="form.numeroDocumentoAfectado" label="Inserte" dense :disable="form.tipoDocumentoAfectado === 'Ninguno' || isPorAprobar" @blur="getPerson"  />
                </div>

                <template v-if="isNit">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <span class="text-weight-bold tw-text-gray-dark">Nombre Comercial *</span>
                        <q-input :rules="[inputRequired, alphanumericAbsolute, v => maxLengthInput(80, v)]" name="numeroDocumentoAfectado" outlined
                            v-model="form.nombreAfectado" label="Inserte" dense :disable="isPorAprobar" />
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <span class="text-weight-bold tw-text-gray-dark">Razón Social *</span>
                        <q-input :rules="[inputRequired, alphanumericAbsolute, v => maxLengthInput(80, v)]" name="numeroDocumentoAfectado" outlined
                            v-model="form.razonSocial" label="Inserte" dense :disable="isPorAprobar" />
                    </div>
                </template>

                <template v-else>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <span class="text-weight-bold tw-text-gray-dark">Nombre del Afectado *</span>
                        <q-input :rules="[inputRequired, alphanumericAbsolute, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]" name="nombreAfectado" outlined v-model="form.nombreAfectado"
                            label="Inserte" dense map-options emit-value :disable="isPorAprobar" />
                    </div>
                </template>
            </div>
        </q-expansion-item>
    </q-card>
</template>

<script setup lang="ts">
import { ref, defineProps, PropType, computed } from "vue";

import { tipoDocumentoDatosSalida } from 'src/constantes/options'
import { alphanumeric, inputRequired, maxLengthInput, nonRequiredAlphanumeric, onlyNumbers, alphanumericAbsolute, alphabeticalWithSpecialCharacters } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
interface Salida {
    anexos: string;
    asunto: string;
    observacion: string;
    tipoDocumentoAfectado: string;
    numeroDocumentoAfectado: string;
    nombreAfectado: string;
    razonSocial: string;
}

const props = defineProps({
    form: {
        type: Object as PropType<Salida>,
        default: () => ({
            anexos: '',
            asunto: '',
            observacion: '',
            tipoDocumentoAfectado: '',
            numeroDocumentoAfectado: '',
            nombreAfectado: '',
            razonSocial: ''
        })
    },
    isPorAprobar: {
        type: Boolean,
        required: true
    }
})

const isNit = ref(false)

const typeAfectado = () => {
    //@ts-ignore
    isNit.value = (props.form.tipoDocumentoAfectado === 'Sociedad extranjera sin NIT en Colombia ' || props.form.tipoDocumentoAfectado === 'Número de Identificación Tributaria NIT')

    props.form.nombreAfectado = ''
    props.form.razonSocial = ''
}

async function getPerson() {
  const tipoDoc = props.form.tipoDocumentoAfectado === 'Cédula de Ciudadanía' ? 'cc' : ''
  const number = props.form.numeroDocumentoAfectado ? props.form.numeroDocumentoAfectado : ''

  if (tipoDoc !== '' && number !== '') {
      const { data } = await sgdeaAxios.get("/personas", {
        params: {
          tipoDocumento: tipoDoc,
          numeroDocumento: number
        }
      })

      if (data.length) {
        props.form.nombreAfectado = [
            data[0]?.nombre1,
            data[0]?.nombre2,
            data[0]?.apellido1,
            data[0]?.apellido2
        ].filter(Boolean).join(' ');
      } else {
        props.form.nombreAfectado = ''
      }
  }

}
</script>
