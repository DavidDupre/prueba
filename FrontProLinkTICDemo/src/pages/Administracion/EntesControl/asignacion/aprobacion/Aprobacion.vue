<template>
    <div class="q-py-lg">
        <a href="/SGDA/entes-control/asignacion" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary"/>
            <b>
                Volver
            </b>
        </a>

        <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-flex-col">
                <ComponentTitle class="q-mt-lg" title="Caso #845784" classTitle="tw-font-bold tw-text-4xl"/>

                <q-chip square :ripple="false" style="border: .5px solid #0049FF; background: #E5EDFF; color: #2C3948; border-radius: 8px; width: 110px;">
                    Por consolidar
                </q-chip>
            </div>

            <q-btn color="secondary" label="Adjuntar a la respuesta final" style="width: 300px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps @click="adjuntarRespuesta"/>
        </div>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-tabs v-model="tab" no-caps indicator-color="white" align="left">
                <q-tab name="documentoRelacionado" :ripple="false">
                    <q-chip icon="folder_open" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Documentos relacionados
                    </q-chip>
                </q-tab>

                <q-tab name="parrafoRespuesta" :ripple="false">
                    <q-chip icon="sort" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Párrafos de respuesta
                    </q-chip>
                </q-tab>
            </q-tabs>
        </q-card>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="documentoRelacionado" class="q-pa-none">
                <q-card class="tw-rounded-xl q-mt-lg tw-p-4" flat bordered>
                    <div class="tw-flex tw-flex-col items-start justify-between q-px-md q-mb-sm row col-12">
                        <span class="text-weight-bold text-h6" style="color: #2C3948;">Listado de documentos cargados</span>
                        
                        <p>
                            Recuerde que los documentos seleccionados se enviarán como soporte al documento de salida
                        </p>
                    </div>
                    <TableDocumentosCargados class="full-width" :DOCUMENTOS_HEADER="DOCUMENTOS_HEADER" :DOCUMENTOS_BODY="DOCUMENTOS_BODY"/>
                </q-card>
            </q-tab-panel>

            <q-tab-panel name="parrafoRespuesta" class="q-pa-none">
                
            </q-tab-panel>
        </q-tab-panels>

        <template v-if="modal">
            <MultiPurposeModal title="Confirmación"
            subtitle="¿Está seguro que desea adjuntar estos documentos?" type="question"
            :action="() => $router.push('/SGDA/entes-control/envio-respuesta')" action-label="Cancelar"
            accept-label="Aceptar"/>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import ComponentTitle from "components/ComponentTitle/ComponentTitle.vue";
import TableDocumentosCargados from "./Table.vue";
//import MultiPurposeModal from "components/Modal/MultiPurposeModal.vue";

import { DOCUMENTOS_HEADER, DOCUMENTOS_BODY } from ".";

const tab = ref('documentoRelacionado')

const modal = ref(false)

const adjuntarRespuesta = () => {
    modal.value = true
}
</script>