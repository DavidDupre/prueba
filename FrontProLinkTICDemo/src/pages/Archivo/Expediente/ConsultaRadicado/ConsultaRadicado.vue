<template>
    <main>
        <div class="q-pb-md q-px-md tw-mt-5">
            <div class="col row">
                <h3 class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
                    Consulta Radicados
                </h3>
            </div>
            <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
                <div class="col-6">
                    <label class="q-px-md tw-text-label">
                        Número de Radicado *
                        <q-input dense label="Ingrese el número de radicado" outlined v-model="radicado" :rules="[
                            val => !!val || 'El campo es obligatorio',
                            val => val.length <= 30 || 'El número de radicado no puede tener más de 30 caracteres',
                            val => val.match(/^[A-Za-z0-9-]+$/) || 'Solo se permiten letras, números y guiones'
                        ]" @keyup.enter="buscarTramite" :disabled="loading">
                            <template v-slot:append>
                                <q-icon name="search" class="cursor-pointer" @click="buscarTramite"
                                    :class="{ 'tw-opacity-50': loading }" />
                            </template>
                        </q-input>
                    </label>
                </div>

                <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
                    <q-btn class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]" no-caps
                        style="border: 1px solid #2c3948" label="Limpiar" icon="cancel" @click="cancelar" />
                    <q-btn class="tw-w-1/4 tw-h-11 bg-primary text-white" type="submit" label="Buscar" icon="search"
                        @click="buscarTramite" />
                </div>
            </q-card>

            <main>
                <q-card flat class="tw-p-4 tw-rounded-xl tw-mt-5" v-if="tramites.length > 0">
                    <div class="show-table-icons">
                        <TableConsultaRadicado class="q-pa-md" :TABLE_HEADER="columnas" :TABLE_BODY="tramites"
                            key-id="id"
                            :msg-no-data="mostrarMensajeNoEncontrado ? 'No se encontraron documentos para el radicado ingresado' : ''"
                            :loading="loading" @ver-detalles="verDetalles" @ver-documentos="verDocumentos" />
                    </div>
                </q-card>

                <q-card flat class="tw-p-4 tw-rounded-xl tw-mt-4" v-if="mostrarMensajeNoEncontrado">
                    <div class="text-center text-grey-8">
                        No se encontraron documentos para el radicado ingresado
                    </div>
                </q-card>
            </main>
        </div>

        <!-- Modal más ancho para mostrar documento -->
        <q-dialog v-model="modalDocumento" persistent maximized>
            <q-card class="full-width">
                <q-card-section class="row items-center q-pb-none">
                    <q-space />
                    <q-btn icon="close" flat round dense @click="cerrarModal" />
                </q-card-section>

                <q-card-section class="q-pt-none full-height">
                    <div v-if="loadingDocumento" class="row justify-center q-pa-lg full-height items-center">
                        <q-spinner-dots size="50px" color="primary" />
                    </div>

                    <div v-else class="document-container full-height">
                        <iframe v-if="documentoActual?.url" :src="documentoActual.url" class="pdf-viewer-wide"
                            frameborder="0"></iframe>

                        <div v-else class="text-center q-pa-lg full-height flex flex-center">
                            <div>
                                <q-icon name="error" size="50px" color="negative" />
                                <p class="text-negative q-mt-md">No se pudo cargar el documento</p>
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
    </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useRouter } from "vue-router";
import TableConsultaRadicado from "./TableConsultaRadicado.vue";

const router = useRouter();
const radicado = ref("");
const tramites = ref([]);
const loading = ref(false);
const mostrarMensajeNoEncontrado = ref(false);
const modalDocumento = ref(false);
const documentoActual = ref<any>(null);
const loadingDocumento = ref(false);

const INTEGRATION_API_URL = process.env.VITE_INTEGRATION_API_URL

const columnas = [
    {
        name: "nombre",
        label: "Nombre del Documento",
        field: "nombre",
        align: "center",
        sortable: true
    },
    {
        name: "descripcion",
        label: "Descripción",
        field: "descripcion",
        align: "center",
        sortable: true
    },
    {
        name: "id",
        label: "ID Documento",
        field: "id",
        align: "center",
        sortable: true
    },
    {
        name: "acciones",
        label: "Acciones",
        field: "acciones",
        align: "center"
    }
];

async function buscarTramite() {
    if (!radicado.value) {
        toast.error("Por favor ingrese un número de radicado");
        return;
    }

    loading.value = true;
    mostrarMensajeNoEncontrado.value = false;

    try {
        const response = await sgdeaAxios.get(
            `${INTEGRATION_API_URL}/buscar_documento_radicado/${radicado.value}`
        );

        if (response.data && response.data.documentos && Array.isArray(response.data.documentos)) {
            tramites.value = response.data.documentos;
        } else {
            tramites.value = [];
        }

        mostrarMensajeNoEncontrado.value = tramites.value.length === 0;

    } catch (error: any) {
        let errorMsg = "Ocurrió un error al buscar los trámites";

        if (error.response) {
            if (error.response.status === 404) {
                errorMsg = "No se encontraron documentos para este radicado";
            } else if (error.response.status === 500) {
                errorMsg = "Error interno del servidor al procesar la solicitud";
            }
        }

        toast.error(errorMsg);
        tramites.value = [];
        mostrarMensajeNoEncontrado.value = true;
    } finally {
        loading.value = false;
    }
}

function cancelar() {
    radicado.value = "";
    tramites.value = [];
    mostrarMensajeNoEncontrado.value = false;
}

function verDetalles(documento: any) {
    router.push(`/detalle-documento/${documento.id}`);
}

async function verDocumentos(documento: any) {
    loadingDocumento.value = true;
    try {
        const response = await sgdeaAxios.get(
            `${INTEGRATION_API_URL}/consultar_documento/${documento.id}`
        );

        // Crear URL para el documento en base64
        const pdfData = `data:application/pdf;base64,${response.data.documento}`;

        documentoActual.value = {
            url: pdfData
        };

        modalDocumento.value = true;
    } catch (error: any) {
        toast.error("Error al cargar el documento");
    } finally {
        loadingDocumento.value = false;
    }
}

function cerrarModal() {
    modalDocumento.value = false;
    documentoActual.value = null;
}
</script>

<style scoped>
.document-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 52px);
    /* Ajuste para el header del modal */
    width: 100%;
}

.pdf-viewer-wide {
    width: 95%;
    height: 95%;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.full-height {
    height: 100%;
}

.full-width {
    width: 100%;
}

.flex {
    display: flex;
}

.flex-center {
    align-items: center;
    justify-content: center;
}
</style>
