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

                <q-chip square :ripple="false" style="border: .5px solid #EA0000; background: #FDE5E5; color: #2C3948; border-radius: 8px; width: 100px; padding: 8px 10px;">
                    Rechazado
                </q-chip>
            </div>
        </div>

        <q-card class="tw-rounded-xl tw-mt-8" flat bordered>
            <q-tabs v-model="tab" no-caps indicator-color="white" align="left">
                <q-tab name="documentoSalida" :ripple="false">
                    <q-chip icon="description" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Documento de salida
                    </q-chip>
                </q-tab>

                <q-tab name="enviarRevision" :ripple="false">
                    <q-chip icon="send" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Enviar a revisión
                    </q-chip>
                </q-tab>

                <q-tab name="enviarAprobacion" :ripple="false">
                    <q-chip icon="send" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Enviar a aprobación
                    </q-chip>
                </q-tab>

                <q-tab name="soporteEntrada" :ripple="false">
                    <q-chip icon="post_add" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Soporte entrada
                    </q-chip>
                </q-tab>

                <q-tab name="soporteSalida" :ripple="false">
                    <q-chip icon="post_add" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Soporte salida
                    </q-chip>
                </q-tab>

                <q-tab name="incluirExpediente" :ripple="false">
                    <q-chip icon="move_up" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Incluir expediente
                    </q-chip>
                </q-tab>

                <q-tab name="verDatos" :ripple="false">
                    <q-chip icon="info" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Ver datos
                    </q-chip>
                </q-tab>

                <q-tab name="metadatos" :ripple="false">
                    <q-chip icon="move_up" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Metadatos
                    </q-chip>
                </q-tab>

                <q-tab name="trazabilidad" :ripple="false">
                    <q-chip icon="history" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Trazabilidad
                    </q-chip>
                </q-tab>

                <q-tab name="comentarios" :ripple="false">
                    <q-chip icon="forum" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Comentarios
                    </q-chip>
                </q-tab>

                <q-tab name="rechazoConsolidador" :ripple="false">
                    <q-chip icon="cancel" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Rechazo de consolidador
                    </q-chip>
                </q-tab>

                <q-tab name="solicitudes" :ripple="false">
                    <q-chip icon="visibility" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Ver solicitudes
                    </q-chip>
                </q-tab>

                <q-tab name="excluirGestionadores" :ripple="false">
                    <q-chip icon="arrow_right_alt" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Exclusión
                    </q-chip>
                </q-tab>

                <q-tab name="respuestaFinal" :ripple="false">
                    <q-chip icon="folder_open" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Respuesta final
                    </q-chip>
                </q-tab>
            </q-tabs>
        </q-card>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="rechazoConsolidador" class="q-pa-none">
                <q-card class="tw-rounded-xl tw-mt-8 tw-p-4" flat bordered>

                    <p class="tw-font-bold tw-text-2xl">Motivo de rechazo</p>

                    <div class="row q-col-gutter-md q-pb-md q-mt-sm">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <span class="text-weight-bold">Observaciones *</span>
                            <q-input :rules="[]" name="observaciones" outlined v-model="form.observaciones" label="Inserte" dense type="textarea" />
                        </div>
                    </div>
                </q-card>

                <div class="col row justify-center q-gutter-x-md q-my-md">
                    <q-btn color="accent" textColor="secondary" label="Cancelar"
                    style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" type="reset"
                    no-caps/>

                    <q-btn color="secondary" label="Asignar rechazo"
                    style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps @click="rejectCase"/>
                </div>
            </q-tab-panel>
        </q-tab-panels>
        <template v-if="modal">
            <MultiPurposeModal title="Confirmación"
            subtitle="¿Está seguro de rechazar el caso?" type="question"
            :action="decline" action-label="Cancelar"
            accept-label="Aceptar"/>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import { toast } from "src/helpers/toast";
//import MultiPurposeModal from "src/components/Modal/MultiPurposeModal.vue";

const tab = ref('documentoSalida')

const router = useRouter()

interface Form {
    observaciones: string;
}

const form = ref<Form>({
    observaciones: ''
})

const modal = ref(false)

const rejectCase = () => {
    modal.value = true
}

const decline = () => {
    toast.success('El caso ha sido rechazado.');
    router.push("/SGDA/entes-control/asignacion")
}
</script>
