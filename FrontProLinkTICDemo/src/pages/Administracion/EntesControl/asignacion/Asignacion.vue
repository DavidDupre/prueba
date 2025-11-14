<template>
    <div class="q-my-md">
        <div class="tw-flex tw-justify-between tw-items-center">
            <span class="tw-font-bold tw-text-3xl tw-my-5">
                Entes de Control
            </span>
        </div>

        <q-card class="tw-rounded-xl" flat bordered>
            <q-expansion-item default-opened expand-separator>
                <template v-slot:header>
                    <div class="col row">
                        <b class="tw-text-lg">Filtrar por</b>
                    </div>
                </template>

                <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <span class="text-weight-bold">Estado</span>
                        <q-select :rules="[]" name="estado" outlined v-model="filtro.estado" label="Seleccione" dense map-options emit-value :options="[
                            { value: 'Radicado', label: 'Radicado'}
                        ]"/>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <span class="text-weight-bold">Número de radicado</span>
                        <q-input :rules="[]" name="nroRadicado" outlined v-model="filtro.numeroRadicado" label="Inserte" dense />
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <span class="text-weight-bold">Fecha de vencimiento</span>
                        <q-input :rules="[]" name="fechaVencimiento" outlined v-model="filtro.fechaVencimiento" dense type="date"/>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <span class="text-weight-bold">Ciudad</span>
                        <q-select :rules="[]" name="ciudad" outlined v-model="filtro.ciudad" label="Seleccione" dense map-options emit-value :options="[
                            { value: 'BOG', label: 'Bogotá D.C'}
                        ]"/>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <span class="text-weight-bold">Tipo de trámite</span>
                        <q-select :rules="[]" name="tipoTramite" outlined v-model="filtro.tipoTramite" label="Seleccione" dense map-options emit-value :options="[
                            { value: 'Remitente', label: 'Remitente'}
                        ]"/>
                    </div>
                </div>
            </q-expansion-item>
        </q-card>
        
        <q-card class="tw-rounded-xl q-mt-lg tw-p-5" flat bordered>
            <div class="flex items-center justify-between q-px-md q-mb-sm row col-12">
                <span class="text-weight-bold text-h5" style="color: #2C3948;">Listado de casos pendientes por asignar</span>
            </div>
            <TableAsignacion :buscar="buscar" class="full-width" :ASIGNACION_HEADER="ASIGNACION_HEADER" :ASIGNACION_BODY="ASIGNACION_BODY"/>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import TableAsignacion from "./Table.vue";

import { IFiltros } from "../";
import { ASIGNACION_HEADER, ASIGNACION_BODY } from ".";

const filtro = ref<IFiltros>({
    estado: '',
    numeroRadicado: '',
    fechaVencimiento: '',
    ciudad: '',
    tipoTramite: ''
})

let buscar = ref('')
const selection = ref([])
</script>