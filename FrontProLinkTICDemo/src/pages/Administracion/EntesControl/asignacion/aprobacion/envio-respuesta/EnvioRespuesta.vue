<template>
    <div class="q-py-lg">
        <a href="/SGDA/entes-control/aprobacion" class="tw-text-primary" style="text-decoration: none;">
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
        </div>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-tabs v-model="tab" no-caps indicator-color="white" align="left">
                <q-tab name="infoGeneral" :ripple="false">
                    <q-chip icon="info" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Información general
                    </q-chip>
                </q-tab>

                <q-tab name="documentoSalida" :ripple="false">
                    <q-chip icon="text_snippet" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Documento de salida
                    </q-chip>
                </q-tab>

                <q-tab name="vistoBueno" :ripple="false">
                    <q-chip icon="task_alt" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Visto bueno respuesta
                    </q-chip>
                </q-tab>

                <q-tab name="rechazarRespuesta" :ripple="false">
                    <q-chip icon="cancel" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Rechazar respuesta
                    </q-chip>
                </q-tab>

                <q-tab name="trazabilidad" :ripple="false">
                    <q-chip icon="history" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Trazabilidad
                    </q-chip>
                </q-tab>
            </q-tabs>
        </q-card>

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="infoGeneral" class="q-pa-none">
                <q-form ref="Destinatarioform" greedy @reset="cancelar">
                    <q-stepper ref="stepper" v-model="step" animated flat keep-alive header-class="hidden">
                        <q-step :done="step > 1" :name="1" prefix="1" title="Datos del destinatario">
                            <DatosDestinatario ref="step1" v-model="formDatosDestinatario"/>
                        </q-step>
                        <q-step :done="step > 2" :name="2" prefix="2" title="Datos del afectado">
                            <DatosAfectado ref="step2" v-model="formDatosAfectado"/>
                        </q-step>
                        <q-step :done="step > 3" :name="3" prefix="3" title="Copia">
                            <Copia ref="step3" v-model="formCopia"/>
                        </q-step>

                        <template v-slot:navigation>
                            <q-stepper-navigation class="col row justify-between q-gutter-x-md q-mt-md">
                                <q-btn v-if="step > 1" :disable="step === 1" color="secondary" label="Regresar"
                                style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps @click="step--" />

                                <q-btn color="accent" textColor="secondary" label="Cancelar" style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" type="reset" no-caps />

                                <q-btn color="secondary" label="Siguiente"
                                style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps @click="step++"/>
                            </q-stepper-navigation> 
                        </template>
                    </q-stepper>
                </q-form>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import DatosDestinatario from "src/components/Stepper/EnvioRespuesta/DatosDestinatario.vue";
import DatosAfectado from "src/components/Stepper/EnvioRespuesta/DatosAfectado.vue";
import Copia from "src/components/Stepper/EnvioRespuesta/Copia.vue";

const step = ref(1)

const tab = ref('infoGeneral')

const router = useRouter()

const step1 = ref<InstanceType<typeof DatosDestinatario> | null>(null)
const step2 = ref<InstanceType<typeof DatosAfectado> | null>(null)
const step3 = ref<InstanceType<typeof Copia> | null>(null)

const formDatosDestinatario = ref({
    formaEnvio: '',
    tipoDocumento: '',
    numeroDocumentoDestinatario: '',
    nombreDestinatario: '',
    direccionDestinatario: '', 
    paisDestinatario: '',
    departamentoDestinatario: '',
    telefonoDestinatario: '',
    correoElectronico: ''
})
const formDatosAfectado = ref({
    anexoMediosMagneticos: '',
    anexoCantidadFolios: '',
    asunto: '',
    observacion: ''
})
const formCopia = ref({
    copia: '',
    dependencia: '',
    nombreFuncionario: ''
})

const cancelar = () => {
    formDatosAfectado.value = {
        anexoMediosMagneticos: '',
        anexoCantidadFolios: '',
        asunto: '',
        observacion: ''
    }

    router.push('/SGDA/entes-control/envio-respuesta')
}
</script>