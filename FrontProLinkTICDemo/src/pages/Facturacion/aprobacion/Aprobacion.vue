<template>
    <div class="q-py-lg">
        <a href="/facturacion/cuentas-cobro" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary"/>
            <b>
                Volver
            </b>
        </a>

        <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-flex-col">
                <ComponentTitle class="q-mt-lg" title="Cuenta de cobro #845784" classTitle="tw-font-bold tw-text-4xl"/>

                <q-chip square :ripple="false" style="border: .5px solid #0049FF; background: #E5EDFF; color: #2C3948; border-radius: 8px; width: 100px; padding: 8px 10px;">
                    Asignada
                </q-chip>
            </div>
        </div>

        <q-card class="tw-rounded-xl tw-mt-8" flat bordered>
            <q-tabs v-model="tab" no-caps indicator-color="white" align="left">
                <q-tab name="infoGeneral" :ripple="false">
                        <q-chip icon="info" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                            Información general
                        </q-chip>
                    </q-tab>

                    <q-tab name="rechazar" :ripple="false">
                        <q-chip icon="cancel" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                            Rechazar
                        </q-chip>
                    </q-tab>

                    <q-tab name="aprobar" :ripple="false">
                        <q-chip icon="task_alt" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                            Aprobar
                        </q-chip>
                    </q-tab>
            </q-tabs>
        </q-card>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="infoGeneral" class="q-pa-none">
                <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
                    <q-expansion-item default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <b class="tw-text-lg">Información básica radicación</b>
                            </div>
                        </template>

                        <div class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8">
                            <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                                <p class="titles">Dependencia</p>
                                <p>346456456</p>
                                <p class="titles">Tipo de trámite</p>
                                <p>Cuenta de cobro o documento equivalente soporte</p>
                                <p class="titles">Tipo de documento</p>
                                <p>Cédula de ciudadanía</p>
                                <p class="titles">Primer apellido</p>
                                <p>Pérez</p>
                                <p class="titles">Primer nombre</p>
                                <p>Luis</p>
                            </div>

                            <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                                <p class="titles">Responsable del proceso</p>
                                <p>Juan Vargas</p>
                                <p class="titles">Canal de recepción</p>
                                <p>Correo electrónico</p>
                                <p class="titles">Número de identificación</p>
                                <p>38482342</p>
                                <p class="titles">Segundo apellido</p>
                                <p>Forero</p>
                                <p class="titles">Otros nombres</p>
                                <p>No aplica</p>
                            </div>
                        </div>
                    </q-expansion-item>
                </q-card>

                <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
                    <q-expansion-item default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <b class="tw-text-lg">Información documento soporte equivalente</b>
                            </div>
                        </template>

                        <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
                            
                                <div class="tw-flex tw-flex-col tw-w-full">
                                    <p class="titles">Tipo de bien o servicio</p>
                                    <p>Lorem ipsum</p>
                                </div>
                                <div class="tw-flex tw-flex-col tw-w-full">
                                    <p class="titles">Observación</p>
                                    <p>Lorem ipsum dolor sit amet consectetur adipiscing, elit aliquet tempor purus vehicula dignissim ac, tristique elementum suspendisse ullamcorper cursus. Elementum fermentum inceptos accumsan conubia donec in pharetra eget, sociis interdum netus varius ultrices a leo.</p>
                                </div>
                                <div class="tw-flex tw-flex-col tw-w-[48%]">
                                    <p class="titles">Valor</p>
                                    <p>$ 250,000</p>
                                </div>
                                <div class="tw-flex tw-flex-col tw-w-[48%]">
                                    <p class="titles">Valor en letras</p>
                                    <p>Doscientos cincuenta mil</p>
                                </div>
                                <div class="tw-flex tw-flex-col tw-w-full">
                                    <p class="titles">Aprobador</p>
                                    <p>Luis Pérez</p>
                                </div>
                        </div>
                    </q-expansion-item>
                </q-card>

                <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
                    <q-expansion-item default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <b class="tw-text-lg">Campos automáticos al radicar</b>
                            </div>
                        </template>

                        <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
                            <div class="tw-flex tw-flex-col tw-w-[48%]">
                                <p class="titles">FECHA / sistema a radicar</p>
                                <p>2024/06/15</p>
                            </div>
                            <div class="tw-flex tw-flex-col tw-w-[48%]">
                                <p class="titles">Hora de inicio</p>
                                <p>14:45</p>
                            </div>
                            <div class="tw-flex tw-flex-col tw-w-[48%]">
                                <p class="titles">Estado de trámite</p>
                                <p>Activo</p>
                            </div>
                        </div>
                    </q-expansion-item>
                </q-card>

                <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
                    <q-expansion-item default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <b class="tw-text-lg">Solicitud</b>
                            </div>
                        </template>

                        <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos</p>

                        <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
                            <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                                <img style="width: 26px" v-lazy :data-url="PDFIcon">
                                <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                                <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                                <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                            </q-card>

                            <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                                <img style="width: 26px" v-lazy :data-url="PDFIcon">
                                <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                                <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                                <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                            </q-card>

                            <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                                <img style="width: 26px" v-lazy :data-url="PDFIcon">
                                <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                                <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                                <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                            </q-card>
                        </div>
                    </q-expansion-item>
                </q-card>
            </q-tab-panel>

            <q-tab-panel name="rechazar" class="q-pa-none">
                <q-card class="tw-rounded-xl tw-mt-4 tw-p-4" flat bordered>
                    <q-expansion-item default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <b class="tw-text-lg">Rechazar</b>
                            </div>
                        </template>

                        <div class="row q-col-gutter-md q-pb-md q-mt-sm">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <span class="text-weight-bold">Motivo de Rechazo *</span>
                                <q-select :rules="[]" name="motivoRechazo" outlined v-model="form.motivoRechazo" label="Seleccione" dense map-options emit-value :options="[
                                    { value: 'Radicado', label: 'Radicado'}
                                ]"/>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                                <span class="text-weight-bold">Comentario *</span>
                                <q-input :rules="[v => maxLengthInput(1000, v)]" name="comentario" outlined v-model="form.comentario" label="Inserte" dense type="textarea" />
                            </div>
                        </div>
                    </q-expansion-item>
                </q-card>

                <div class="col row justify-center q-gutter-x-md q-my-md">
                    <q-btn color="accent" textColor="secondary" label="Cancelar"
                    style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" type="reset" 
                    no-caps />

                    <q-btn color="secondary" label="Rechazar"
                    style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps/>
                </div>
            </q-tab-panel>

            <q-tab-panel name="aprobar" class="q-pa-none">
                
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import ComponentTitle from 'src/components/ComponentTitle/ComponentTitle.vue';

import PDFIcon from 'src/assets/pdf.svg';

import { maxLengthInput } from "src/helpers/validations";

const tab = ref('infoGeneral')

interface Form {
    motivoRechazo: string;
    comentario: string;
}

const form = ref<Form>({
    motivoRechazo: '',
    comentario: ''
})
</script>

<style>
    .titles {
        color: #6B737C;
        font-weight: bold;
        margin-top: 10px;
    }
</style>