<template>
    <div class="q-pa-lg">
        <a href="/SGDA/entes-control/asignacion" class="tw-text-primary" style="text-decoration: none;">
            <q-icon size="1.5em" name="chevron_left" color="primary"/>
            <b>
                Volver
            </b>
        </a>

        <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-flex-col">
                <ComponentTitle class="q-mt-lg" title="Caso #845784" classTitle="tw-font-bold tw-text-4xl"/>

                <q-chip square :ripple="false" style="border: .5px solid #9747FF; background: #F2DCFF; color: #2C3948; border-radius: 8px; width: 110px;">
                    En edición
                </q-chip>
            </div>

            <div class="tw-flex tw-items-center tw-gap-5">
                <q-btn color="accent" textColor="secondary" label="Rechazar" style="width: 300px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps @click="rejectResponse"/>

                <q-btn color="secondary" label="Dar visto bueno" style="width: 300px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps @click="giveApproval"/>
            </div>
        </div>

        <q-card class="tw-rounded-xl tw-mt-8" flat bordered>
            <q-tabs v-model="tab" no-caps indicator-color="white" align="left">
                <q-tab name="infoGeneral" :ripple="false">
                    <q-chip icon="info" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
                        Información general
                    </q-chip>
                </q-tab>

                <q-tab name="documentoSalida" :ripple="false">
                    <q-chip icon="description" square :ripple="false" style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
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
                <VisualizationDetails :data="infoGeneral[0]" :values="infoGeneralValue"/>

                <VisualizationDetails :data="remitente[0]" :values="remitenteValue"/>

                <VisualizationDetails :data="afectado[0]" :values="afectadoValue"/>

                <VisualizationDetails :data="medioContacto[0]" :values="medioContactoValue"/>

                <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
                    <q-expansion-item default-opened>
                        <template v-slot:header>
                            <div class="col row">
                                <b class="tw-text-lg">Solicitud</b>
                            </div>
                        </template>

                        <div class="row items-center justify-between q-col-gutter-md q-pb-md q-pl-md">
                            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Tipología de la PQRS</p>
                                <span class="input_text">
                                    Lorem ipsum
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Tipo de solicitud</p>
                                <span class="input_text">
                                    Lorem ipsum
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Detalle</p>
                                <span class="input_text">
                                    Lorem ipsum
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-2">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Producto</p>
                                <span class="input_text">
                                    Lorem ipsum
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-2 col-lg-3">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Acceso a información pública</p>
                                <span class="input_text">
                                    Sí
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Descripción - Acceso a información pública</p>
                                <span class="input_text">
                                    Lorem ipsum dolor sit amet consectetur adipiscing, elit aliquet tempor purus vehicula dignissim ac, tristique elementum suspendisse ullamcorper cursus. Elementum fermentum inceptos accumsan conubia donec in pharetra eget, sociis interdum netus varius ultrices a leo.
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Observación</p>
                                <span class="input_text">
                                    Lorem ipsum dolor sit amet consectetur adipiscing, elit aliquet tempor purus vehicula dignissim ac, tristique elementum suspendisse ullamcorper cursus. Elementum fermentum inceptos accumsan conubia donec in pharetra eget, sociis interdum netus varius ultrices a leo.
                                </span>
                            </div>

                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">Documentos adjuntos</p>
                                <div class="flex row wrap q-mr-auto tw-gap-3 q-pb-md">
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
                            </div>
                        </div>
                    </q-expansion-item>
                </q-card>
            </q-tab-panel>

            <q-tab-panel name="documentoSalida" class="q-pa-none">

            </q-tab-panel>
        </q-tab-panels>
    </div>

    <ActionModal :is-open="modalApprove" :form-inputs="formApproval" :form-data="formDataApprove" button-label="Visto bueno" :is-editing="false"
    form-label="Respuesta" @submit="successApprove" @cancel="modalApprove = false" />

    <template v-if="isModalApprove">
        <MultiPurposeModal title="Confirmación"
        subtitle="¿Está seguro de dar el visto bueno a la respuesta proyectada?" type="question"
        :action="responseApproved" action-label="Cancelar"
        accept-label="Aceptar"/>
    </template>

    <ActionModal :is-open="modalReject" :form-inputs="formRejection" :form-data="formDataReject" button-label="Rechazar" :is-editing="false"
    form-label="Respuesta" @submit="successReject" @cancel="modalReject = false" />

    <template v-if="isModalReject">
        <MultiPurposeModal title="Confirmación"
        subtitle="¿Está seguro de rechazar la respuesta proyectada?" type="question"
        :action="responseRejected" action-label="Cancelar"
        accept-label="Aceptar"/>
    </template>
</template>

<script setup lang="ts">
import { ref } from "vue";

import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import VisualizationDetails from "src/components/Visualization/VisualizationDetails.vue";

import ActionModal from "src/components/Modal/ActionModal.vue";
//import MultiPurposeModal from "src/components/Modal/MultiPurposeModal.vue";

import { maxLengthInput } from 'src/helpers/validations';

import PDFIcon from "src/assets/pdf.svg";
import { toast } from "src/helpers/toast";

const tab = ref('infoGeneral')
const modalApprove = ref(false)
const isModalApprove = ref(false)
const modalReject = ref(false)
const isModalReject = ref(false)

const infoGeneral = [
    {
        title: "Información general del caso",
        fields: [
            {
                label: 'Número de radicado',
                value: 'numeroRadicado'
            },
            {
                label: 'Tipo de solicitud',
                value: 'tipoSolicitud'
            },
            {
                label: 'Afectado',
                value: 'afectado'
            },
            {
                label: 'Colaborador',
                value: 'colaborador'
            },
            {
                label: 'Fecha de vencimiento',
                value: 'fechaVencimiento'
            },
        ]
    }
]

const infoGeneralValue = {
    numeroRadicado: '346456456',
    tipoSolicitud: 'Lorem ipsum',
    afectado: 'Pedro Pérez',
    colaborador: 'Luis Pérez',
    fechaVencimiento: '23/04/2023'
}

const remitente = [
    {
        title: "Remitente",
        fields: [
            {
                label: 'Tipo de remitente',
                value: 'tipoRemitente'
            },
            {
                label: 'Tipo de documento del remitente',
                value: 'tipoDocumentoRemitente'
            },
            {
                label: 'Número de documento del remitente',
                value: 'numeroDocumentoRemitente'
            },
            {
                label: 'Nombre del remitente',
                value: 'nombreRemitente'
            }
        ]
    }
]

const remitenteValue = {
    tipoRemitente: 'Lorem ipsum',
    tipoDocumentoRemitente: 'Cédula de ciudadanía',
    numeroDocumentoRemitente: '46457675',
    nombreRemitente: 'Luis Pérez'
}

const afectado = [
    {
        title: 'Afectado',
        fields: [
            {
                label: 'Tipo de documento afectado',
                value: 'tipoDocumentoAfectado'
            },
            {
                label: 'Número de documento afectado',
                value: 'numeroDocumentoAfectado'
            },
            {
                label: 'Nombre del remitente',
                value: 'nombreRemitente'
            },
            {
                label: '¿Pertenece a la comunidad LGBTQ+?',
                value: 'lgbtq'
            },
            {
                label: 'Sexo',
                value: 'sexo'
            },
            {
                label: 'Condición especial',
                value: 'condicionEspecial'
            },
        ]
    }
]

const afectadoValue = {
    tipoDocumentoAfectado: 'Cédula de ciudadanía',
    numeroDocumentoAfectado: '46457675',
    nombreRemitente: 'Jorge Ruíz',
    lgbtq: 'No',
    sexo: 'Masculino',
    condicionEspecial: 'No'
}

const medioContacto = [
    {
        title: 'Medios de contacto y respuesta',
        fields: [
            {
                label: 'Correo electrónico',
                value: 'correoElectronico'
            },
            {
                label: 'Teléfono celular',
                value: 'telefonoCelular'
            },
            {
                label: 'Teléfono fijo',
                value: 'telefonoFijo'
            },
            {
                label: 'País de contacto',
                value: 'paisContacto'
            },
            {
                label: 'Departamento de contacto',
                value: 'departamentoContacto'
            },
            {
                label: 'Ciudad de contacto',
                value: 'ciudadContacto'
            },
            {
                label: 'Dirección de contacto',
                value: 'direccionContacto'
            },
            {
                label: 'Medio por el que desea recibir respuesta',
                value: 'medioRespuesta'
            },
        ]
    }
]

const medioContactoValue = {
    correoElectronico: 'jorgeruiz23@gmail.com',
    telefonoCelular: '320 4556785',
    telefonoFijo: '601 5678976',
    paisContacto: 'Colombia',
    departamentoContacto: 'Cundinamarca',
    ciudadContacto: 'Chía',
    direccionContacto: 'Calle 23b #17-5',
    medioRespuesta: 'Correo electrónico'
}

const giveApproval = () => {
    modalApprove.value = true
}

const successApprove = () => {
    isModalApprove.value = true
}

const responseApproved = () => {
  toast.success('La respuesta proyectada tiene su visto bueno.');
    modalApprove.value = false
}

const rejectResponse = () => {
    modalReject.value = true
}

const successReject = () => {
    isModalReject.value = true
}

const responseRejected = () => {
  toast.success('La respuesta proyectada fue rechazada.');
    modalReject.value = false
}

const formDataApprove = ref(
    {
        gestionador: '',
    }
)

const formDataReject = ref(
  {
    gestionador: '',
    observaciones: '',
  }
)

const formApproval = ref([
    {
        type: 'text',
        nameField: 'gestionador',
        label: 'Gestionador',
        placeholder: 'Carlos Romero, Gerencia de Logística',
        required: false,
        disabled: true,
        col: 1,
    }
])

const formRejection = ref([
    {
        type: 'text',
        nameField: 'gestionador',
        label: 'Gestionador',
        placeholder: 'Carlos Romero, Gerencia de Logística',
        required: false,
        disabled: true,
        col: 1,
    },
    {
        type: 'textarea',
        nameField: 'observaciones',
        label: 'Observaciones',
        required: false,
        rules: [(v: string) => maxLengthInput(300, v)],
        col: 1,
    }
])
</script>
