<template>
    <main class="q-py-md">
        <a @click="findRoles([1]) ? checkIfAsignado() : router.push('/bandeja')" class="text-primary q-mb-md block"
            style="text-decoration: none; cursor: pointer">
            <q-icon size="1.5em" name="chevron_left" color="primary"></q-icon>
            <b> Volver</b>
        </a>
        <BreadCrumbs :crumbs="routes"></BreadCrumbs>

        <div class="tw-flex tw-justify-between tw-pt-4 tw-mb-3">
            <h1 class="tw-text-3xl tw-font-bold">Radicado {{ showRoute }}</h1>
            <div class="row tw-gap-3" v-if="docActive && !findRoles([5]) && !isDevolucion && tab !== 'docSalida'">
                <q-select class="tw-w-40 tw-h-10" dense v-model="typeExport" use-chips fill-input input-debounce="0"
                    emit-value label="Exportar en" outlined map-options :options="['PDF', 'DOC']">
                </q-select>
                <q-btn class="tw-w-32 tw-h-10" color="secondary" @click="emitSaveDoc">
                    Guardar
                </q-btn>
            </div>
            <div class="row tw-gap-3" v-if="isDevolucion && tab == 'docSalida'">
                <q-btn class="tw-w-56 tw-h-10" @click="tab = 'vistaInformacionGeneral'" label="Cancelar" />
                <q-btn class="tw-w-56 tw-h-10" color="secondary" @click="SaveNewDoc">
                    Guardar
                </q-btn>
            </div>
            <div class="tw-flex"
                v-if="escActive && findRoles([0, 3, 8, 7]) && validRespuestaEscalamiento && !respuestaEcsActiva && isUserEscalado">
                <q-btn class="tw-w-36 flex" color="primary" @click="rechazarEscModal = true">
                    Rechazar
                </q-btn>
                <q-btn class="tw-w-36 flex tw-ml-2" color="secondary" @click="aprobEscalamiento = true">
                    Gestionar
                </q-btn>
            </div>
            <div class="tw-flex tw-flex-wrap tw-gap-2" v-if="findRoles([0, 5, 8]) && !isDevolucion && ((['docSalida'].includes(tab) && !haveDocGestion) ||
            (['docs'].includes(tab) ) && habilitarBotones)">
                <q-btn class="tw-w-36 flex" color="primary" @click="rechazarDocModal = true">
                    Rechazar
                </q-btn>
                <q-btn class="tw-w-36 flex tw-ml-2" color="secondary" @click="handleAprobarClick">
                    Aprobar
                </q-btn>
                <!-- <q-btn class="tw-w-36 flex tw-ml-2" color="secondary" @click="cargarDocumentoSalida()">
                    Cargar Documento de Salida
                </q-btn> -->
            </div>
            <div class="tw-flex tw-flex-wrap tw-gap-2"
                 v-if="findRoles([3]) && detalleTutela.estado === 'Para gestión' && !ocultarBoton && tab === 'docs'">
              <q-btn class="tw-w-36 flex tw-ml-2" color="secondary" @click="cargarDocumentoSalida()">
                    Cargar Documento de Salida
                </q-btn>
            </div>
            <div class="tw-flex"
                v-if="findRoles([0, 6, 8, 3]) && tab == 'gestionEscalamiento' && selectedEscalamientos.length">
                <q-btn class="tw-w-40 flex" color="primary" @click="cerrarEscalModal = true">
                    Cerrar escalamientos
                </q-btn>
            </div>
            <div class="tw-flex" v-if="findRoles([0, 3, 6, 8]) && validCloseButtonGest()">
                <q-btn class="tw-w-40 flex" color="primary" @click="validCierreGestion">
                    Cerrar gestión
                </q-btn>
            </div>
            <!-- <button @click="cerrarGestion">prueba</button> -->
            <div class="tw-flex" v-if="findRoles([0, 8]) && tab == 'vistaInformacionGeneral'">
                <q-btn class="tw-w-40 flex" color="primary" @click="cerrarEscalModal = true">
                    Mover
                </q-btn>
            </div>
            <div class="tw-flex" v-if="findRoles([0, 8]) && tab == 'vistaInformacionGeneral'">
                <q-btn class="tw-w-40 flex" color="primary" @click="cerrarEscalModal = true">
                    Excluir
                </q-btn>
            </div>

            <div class="tw-flex" v-if="tab == 'docs' && findRoles([0, 3, 8])">
                <div>
                    <input type="file" ref="fileInputRef" v-show="false" multiple
                        accept=".pdf, .png, .jpg, .txt, .doc, .docx, .xls, .xlsx, .mp3, .mp4, .avi"
                        @change="uploadFiles" />

                    <q-btn icon="add" label="Subir un Documento" color="primary" class="tw-h-11 tw-w-52"
                        @click="openFileInput"
                        :disable="['por aprobar', 'aprobado', 'enviado'].includes(detalleTutela.estado.toLowerCase()) && userInfo.role.toLowerCase().includes('gestionador')" />
                </div>
            </div>

        </div>
        <span
            :class="['q-my-sm tw-mb-3  tw-border tw-rounded-full tw-w-auto q-px-md q-py-xs', ESTADOS[detalleTutela.estado]]">
            {{ status }}
        </span>
        <br>
      <br>
      <span v-if="haveDocGestion" :class="['q-my-sm tw-mb-3  ttw-w-auto q-px-md q-py-xs']">
        Diríjase a Documentos Relacionados para ver los documentos cargados.
      </span>

        <q-tabs inline-label no-caps outside-arrows align="left"
            class=" tw-rounded-lg tw-my-4 tw-bg-white custom-tabs tw-flex rowsTab-alingCenter"
            indicator-color="transparent" active-color="primary" v-model="tab">
            <template v-if="isDevolucion && !isNewDocCreated">
                <q-tab :disable="isDisabled" v-if="findRoles([0, 1, 3, 5])" name="vistaInformacionGeneral"
                    label="Información General" class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
                    icon="info" />
                <q-tab :disable="isDisabled" v-if="findRoles([0, 3])" name="enviarPorCorrespondencia"
                    label="Enviar por Correspondencia" class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
                    icon="send" />

                <q-tab :disable="isDisabled" v-if="findRoles([0, 3])" name="enviarPorCorreo" label="Enviar por Correo"
                    icon="send" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="findRoles([0, 3])" name="docSalida" label="Nuevo Documento de Salida"
                    icon="post_add" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="findRoles([0, 3])" name="cerrarDevolucion"
                    label="Solicitud Cierre de Devolución" icon="cancel" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="findRoles([0, 3])" name="trazabilidad" label="Trazabilidad"
                    icon="history" class="tw-rounded-lg" />
            </template>
            <template v-else-if="isDevolucion && isNewDocCreated && !isPublicacion">
                <q-tab :disable="isDisabled" name="vistaInformacionGeneral" label="Información General"
                    class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" icon="info" />

                <q-tab :disable="isDisabled" v-if="segundaDevolucion" name="enviarPublicacion"
                    label="Enviar a Publicación" icon="send" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="!segundaDevolucion" name="docSalida" label="Documento de Salida"
                    icon="post_add" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="!segundaDevolucion" name="enviarAprobacion"
                    :label="detalleTutela?.estado == 'Por aprobar' ? 'Cambiar Aprobador' : 'Enviar a Aprobación'"
                    icon="send" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" name="adjuntarSoporte"
                    :label="segundaDevolucion ? 'Adjuntar Documento' : 'Adjuntar Soporte'" icon="feed"
                    class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" name="cerrarDevolucion" label="Solicitud Cierre de Devolución"
                    icon="cancel" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="!segundaDevolucion" name="enviarPorCorrespondencia"
                    label="Enviar por Correspondencia Física" class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]"
                    icon="send" />

                <q-tab :disable="isDisabled" v-if="!segundaDevolucion" name="enviarPorCorreo" label="Enviar por Correo"
                    icon="send" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="findRoles([0, 3])" name="trazabilidad" label="Trazabilidad"
                    icon="history" class="tw-rounded-lg" />
            </template>
            <template v-else-if="isPublicacion && !isDefijacion">
                <q-tab :disable="isDisabled" name="vistaInformacionGeneral" label="Información General"
                    class="tw-rounded-lg q-pa-sm tw-text-sm tw-text-[#6B737C]" icon="info" />

                <q-tab :disable="isDisabled" name="publicar" label="Publicar" icon="open_in_browser"
                    class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" name="rechazarPublicacion" label="Rechazar Publicación" icon="cancel"
                    class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" name="trazabilidad" label="Trazabilidad" icon="history"
                    class="tw-rounded-lg" />

            </template>
            <template v-else-if="isDefijacion">

                <q-tab :disable="isDisabled" name="ArchivosDesfijacion" label="Adjuntar Documento" icon="post_add"
                    class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" name="CierrePublicacion" label="Cierre de Publicación" icon="close"
                    class="tw-rounded-lg" />


            </template>
            <template v-else>
                <q-tab :disable="isDisabled" v-if="findRoles([0, 1, 3, 5, 6, 7, 8])" name="vistaInformacionGeneral"
                    label="Información General" class="tw-rounded-lg q-pa-sm tw-text-sm" icon="info" />
                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([6, 7])" name="trazabilidad"
                    label="Trazabilidad" icon="history" />
                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([6, 7])" name="docs"
                    label="Documentos Relacionados" icon="folder_open" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([6, 7])" name="comentarios"
                    label="Comentarios" icon="forum" />
                <q-tab :disable="isDisabled"
                    v-if="findRoles([6, 7, 0]) && detalleTutela.estado != 'Aprobado' && detalleTutela.estado != 'Enviado'"
                    name="solicitudEscalamiento" :label="findRoles([1, 6]) ? 'Escalar' : 'Solicitud Escalamiento'"
                    icon="move_down" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled"
                    v-if="allValidation && findRoles([0, 6, 8]) && !isUserEscalado && detalleTutela.estado != 'Aprobado'"
                    name="gestionEscalamiento" label="Gestión de Escalamientos" icon="move_down"
                    class="tw-rounded-lg" />
                <q-tab v-if="allValidation &&
                    (
                        (findRoles([0, 1, 3, 8]) && detalleTutela.estado !== 'Aprobado' && detalleTutela.estado !== 'Enviado' && detalleTutela.estado !== 'Cerrado') ||
                        (findRoles([0, 8]) && detalleTutela.estado !== 'Cerrado')
                    )" :disable="isDisabled" name="gestionarEtapa"
                    :label="findRoles([1]) ? 'Incluir Etapa Procesal' : 'Gestionar Etapa Procesal'" icon="fa-solid fa-code-branch"
                    class="tw-rounded-lg" />

                <q-tab :disable="isDisabled"
                    v-if="allValidation && findRoles([0, 1, 6, 8]) && !validEscalamientoRechazado" name="vistaAsignar"
                    label="Asignar" icon="move_up" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([0, 1, 6, 8]) && validRadicadosAsignados"
                    name="radicados" label="Radicados Asociados" icon="handshake" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([0, 1, 3, 5, 8])" name="trazabilidad"
                    label="Trazabilidad" icon="history" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([0, 1, 3, 5, 8])" name="docs"
                    label="Documentos Relacionados" icon="folder_open" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([0, 1, 3, 5, 8])" name="comentarios"
                    label="Comentarios" icon="forum" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled"
                    v-if="allValidation && findRoles([0, 3, 8]) && validRadicadosAsignados && isUserEscalado && detalleTutela.estado != 'Enviado'"
                    name="solicitudEscalamiento" :label="findRoles([1, 6, 3]) ? 'Escalar' : 'Solicitud Escalamiento'"
                    icon="move_down" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="allValidation && findRoles([0, 1, 8])" name="reclasificar"
                    label="Reclasificar Trámite" icon="handshake" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="allValidation &&
                    findRoles([0, 3, 8]) &&
                    detalleTutela.asignaciones.length &&
                    detalleTutela.estado !== 'Aprobado' &&
                    detalleTutela.estado !== 'Enviado' &&
                    detalleTutela.estado !== 'Cerrado'" name="reasignar" label="Reasignar" icon="move_up"
                    class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="allValidation &&
                    (
                        (findRoles([0, 3, 8]) &&
                            detalleTutela.estado !== 'Aprobado' &&
                            detalleTutela.estado !== 'Enviado' &&
                            detalleTutela.estado !== 'Cerrado') ||
                        (findRoles([0]) && detalleTutela.estado !== 'Cerrado')
                    )" name="datoSalida" label="Datos de Salida" icon="error_outline" class="tw-rounded-lg" />



                <q-tab :disable="isDisabled" v-if="allValidation &&
                    findRoles([0, 3, 5, 8]) &&
                    detalleTutela.estado !== 'Aprobado' &&
                    detalleTutela.estado !== 'Enviado' &&
                    detalleTutela.estado !== 'Cerrado'" name="docSalida" label="Documento de Salida" icon="description"
                    class="tw-rounded-lg" @click="onDocSalidaClick" />

                <q-tab :disable="isDisabled" v-if="allValidation &&
                    findRoles([0, 3, 8]) &&
                    detalleTutela.estado !== 'Aprobado' &&
                    detalleTutela.estado !== 'Enviado' &&
                    detalleTutela.estado !== 'Cerrado'" name="adjuntarSoporte" label="Adjuntar Soporte" icon="feed"
                    class="tw-rounded-lg" />

                <q-tab :disable="isDisabled"
                    v-if="allValidation && findRoles([0, 3, 8]) && detalleTutela.estado == 'Aprobado' || allValidation && findRoles([0, 8])"
                    name="enviar" label="Enviar" icon="send" class="tw-rounded-lg" />
                <q-tab :disable="isDisabled" v-if="allValidation &&
                    findRoles([0, 3, 8]) &&
                    detalleTutela.estado !== 'Aprobado' &&
                    detalleTutela.estado !== 'Enviado' &&
                    detalleTutela.estado !== 'Cerrado'" name="incluirExpediente" label="Incluir a Expediente"
                    icon="adf_scanner" class="tw-rounded-lg" />

                <!-- <q-tab :disable="isDisabled"
                    v-if="allValidation && findRoles([0, 8]) && detalleTutela.estado != 'Aprobado'"
                    name="ReinicioGestion" label="Reiniciar Gestión" icon="move_down" class="tw-rounded-lg" /> -->

                <q-tab :disable="isDisabled" v-if="allValidation &&
                    findRoles([0, 3, 8]) &&
                    detalleTutela.estado !== 'Aprobado' &&
                    detalleTutela.estado !== 'Enviado' &&
                    detalleTutela.estado !== 'Cerrado'" name="solicitudEscalamiento" label="Escalar" icon="move_down"
                    class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="allValidation &&
                    (
                        (findRoles([0, 8, 3]) &&
                            detalleTutela.estado !== 'Aprobado' &&
                            detalleTutela.estado !== 'Enviado' &&
                            detalleTutela.estado !== 'Cerrado') ||
                        (findRoles([0]) && detalleTutela.estado !== 'Cerrado')
                    )" name="gestionEscalamiento" label="Gestión de Escalamientos" icon="move_down"
                    class="tw-rounded-lg" />

                <q-tab :disable="isDisabled" v-if="allValidation &&
                    findRoles([0, 3, 8]) &&
                    detalleTutela.userId?.cargo !== 'Aprobador' &&
                    detalleTutela.estado !== 'Aprobado' &&
                    detalleTutela.estado !== 'Enviado' &&
                    detalleTutela.estado !== 'Cerrado'" name="enviarAprobacion"
                    :label="detalleTutela?.estado.toLocaleLowerCase() === 'por aprobar' ? 'Cambiar Aprobador' : 'Enviar a Aprobación'"
                    icon="send" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled"
                    v-if="allValidation && findRoles([0, 3, 8]) && !isUserEscalado && detalleTutela.userId?.cargo == 'Aprobador'"
                    name="cambiarAprobador" label="Cambiar Aprobador" icon="person" class="tw-rounded-lg" />

                <q-tab :disable="isDisabled"
                    v-if="allValidation && findRoles([3, 7]) && validRespuestaEscalamiento && respuestaEcsActiva && detalleTutela.estado != 'Aprobado' || allValidation && findRoles([0, 8])"
                    name="respuestaEscalamiento" label="Respuesta Escalamiento" icon="send" class="tw-rounded-lg" />

                <!-- Metadatos dinamicos -->
                <!-- <q-tab v-if="allValidation && isMetadatos && findRoles([0, 1, 2, 4, 5, 6, 7])" name="metadatos" label="Metadatos" icon="folder_open" /> -->
            </template>


        </q-tabs>

        <q-tab-panels v-model="tab" animated v-if="loaded">
            <q-tab-panel name="vistaInformacionGeneral">
                <InformacionGeneral :list-docs="listDocs" :all-valid="activeValidButton" @valid="validarAll"
                    :download="download" :visualize="getBlobToIframe" :detalle-tutela="detalleTutela" />
            </q-tab-panel>
            <q-tab-panel name="gestionarEtapaProcesal">
                <p>Gestionar</p>
            </q-tab-panel>
            <q-tab-panel name="vistaAsignar">
                <Asignar :details-tutela="detalleTutela" :valid-etapas="validRadicadosAsignados" />
            </q-tab-panel>
            <q-tab-panel name="escalamiento">
                <Escalamiento :details-tutela="detalleTutela" />
            </q-tab-panel>
            <q-tab-panel name="gestionarEtapa">

                <div class="flex tw-flex tw-justify-between tw-flex-nowrap">
                    <section class="tw-w-full">
                        <Etapa v-if="!hasEtapa && !gestionEtapa" @add="addProcess" @edit="editData"
                            @etapa="hasEtapa = true" :detalles-etapa="detallesEtapa" :departments-list="departmentsList"
                            :municipios-list="municipiosList" />
                        <GestionarEtapa v-if="gestionEtapa" @change-view="changeView" @cancel="cancelGestModal = true"
                            :departments-list="departmentsList" :municipios-list="municipiosList" :step-name="stepName"
                            :valid-creacion-etapas-procesales="validCreacionEtapasProcesales"
                            @find-docs="getAllRegisters" :visualize="getBlobToIframe" :list-etapas="stepsEtapaProcesal"
                            :radicados-etapa="detallesEtapa" :datos-gestion="datosGestionEtapa" :valid-own="validOwn"
                            @change-own="getTutelasInfo()" :valid-form="validFormGestion" :handle-steps="handleSteps"
                            :id-etapa-procesal="idEtapaProcesal" :tipos-documentos="tiposDocumentos"
                            :detalle-tutela="detalleTutela" />
                    </section>
                    <q-card class="my-card tw-min-h-full tw-min-w-full tw-absolute" style="width: 100%; height: 100%;"
                        v-if="doc">
                        <embed class="tw-min-w-full tw-min-h-full" style="width: 100%; height: 100%;"
                            src="https://docs.google.com/document/d/1DYlrfQCkSROYlKd-jM73nymGNzxVFRMAKhPoRcofLGo/edit" />
                    </q-card>
                </div>
            </q-tab-panel>
            <q-tab-panel name="trazabilidad">
                <Trazabilidad :doneItems="trazabilidadData" />
            </q-tab-panel>
            <q-tab-panel name="docs">
                <DocumentosRelacionados @detalle-doc="handleDetalleDocumento" ref="docForSoporte" :visualize="getBlobToIframe" @find-docs="getAllRegisters"
                    :detalle-tutela="detalleTutela" :reloadData="reloadData"  @eliminarDocumento="manejarEliminacion"/>
            </q-tab-panel>
            <q-tab-panel name="comentarios">
                <Comentarios @update=handleUpdate :key="incrementaKey" :idDetalle="detalleTutela.idRadicado"
                    text-default="Ha comentado sobre la Tutela" />
            </q-tab-panel>
            <q-tab-panel name="radicados">
                <RadicadosAsociados :radicados="detallesEtapaRadicados" :codigo="detalleTutela.codigoProceso" />
            </q-tab-panel>
            <q-tab-panel id="documentSalid" name="docSalida">
                <Editor :key="docSalidaKey" :data="dataFooter" :referentKey="referentKey" :restric="false"
                    :base64="documentoFile" :isEditorEmpty="true" @datos-response="autoSaveDocument"
                    @aprobado="aprobarCasoAprobador" :img-base64="imgBase64" :aprobado="aprobadoDocSal"
                    :document="htmlContent" />
            </q-tab-panel>
            <q-tab-panel name="datoSalida">
                <DatosSalida :details-tutela="detalleTutela" @cancel="tab = 'vistaInformacionGeneral'"
                    @findTutela="getTutelasInfo()" />
            </q-tab-panel>
            <q-tab-panel name="reclasificar">
                <Reclasificar :detalle-tutela="detalleTutela" />
            </q-tab-panel>
            <q-tab-panel name="iniciarGestion">
                <GestionTutelas />
            </q-tab-panel>
            <q-tab-panel name="cambiarAprobador">
                <CambiarAprobador :detailsTutela="detalleTutela" @handle-cancel="handleCancel" />
            </q-tab-panel>
            <q-tab-panel name="reasignar">
                <Reasignar :detailsTutela="detalleTutela" />
            </q-tab-panel>
            <q-tab-panel name="adjuntarSoporte">
                <AdjuntarSoporte @find-docs="docForSoporte.getDocuments()" :segundaDevolucion="segundaDevolucion"
                    @cancel="tab = 'vistaInformacionGeneral'" :is-devolucion="isDevolucion"
                    :detalle-tutela="detalleTutela" />
                <DocumentosRelacionados ref="docForSoporte" :is-devolucion="isDevolucion" :visualize="getBlobToIframe"
                    @find-docs="getAllRegisters" :is-soporte="true" :active-absolute="true"
                    :detalle-tutela="detalleTutela" :reloadData="reloadData" @eliminarDocumento="manejarEliminacion" />
            </q-tab-panel>
            <q-tab-panel name="gestionEscalamiento">
                <GestionEscalmiento ref="gestionEscalamientoComp"
                    @update:itemSelected="(escalamientos) => selectedEscalamientos = escalamientos"
                    @escalamientoRechazado="tab = 'solicitudEscalamiento'; asignarTabKey++"
                    :detailsTutela="detalleTutela" />
            </q-tab-panel>
            <q-tab-panel name="enviarAprobacion">
                <EnviarAprobacion :detailsTutela="detalleTutela" @handle-cancel="handleCancel" />
            </q-tab-panel>
            <q-tab-panel name="enviar">
                <Enviar :detailsTutela="detalleTutela" :list-docs="listDocs" @cancel="tab = 'vistaInformacionGeneral'"
                    :visualize="getBlobToIframe" :download="download" />
            </q-tab-panel>
            <q-tab-panel name="solicitudEscalamiento">
                <SolicitudEscalamiento @find-docs="getAllRegisters" :detailsTutela="detalleTutela" :list-docs="listDocs"
                    :visualize="getBlobToIframe" :download="download" />
            </q-tab-panel>
            <q-tab-panel name="respuestaEscalamiento">
                <RespuestaEscalamiento @find-docs="getAllRegisters" @cancelResp="tab = 'vistaInformacionGeneral'"
                    :send-visual="getBlobToIframe" :detalle-tutela="detalleTutela" @resetTutela="getTutelasInfo()" />
            </q-tab-panel>
            <q-tab-panel name="incluirExpediente">
                <IncluirExpediente :tutelas-data="detalleTutela" @validExp="validIfExpediente()"
                    @success="handleSuccess()" />
            </q-tab-panel>
            <q-tab-panel name="enviarPorCorrespondencia">
                <EnviarPorCorrespondencia @back-view="tab = 'vistaInformacionGeneral'"
                    :radicado-salida="detalleTutela.refRadicadoSalida" :datos-remitente="detalleTutela.juzgado" />
            </q-tab-panel>
            <q-tab-panel name="enviarPorCorreo">
                <EnviarPorCorreo :tutelas-data="detalleTutela" @back-view="tab = 'vistaInformacionGeneral'"
                    :type-view="'Tutelas'" :detalle-radicado="detalleTutela" />
            </q-tab-panel>
            <q-tab-panel name="cerrarDevolucion">
                <CerrarDevolucion :detalles-radicado="detalleTutela" @back-view="tab = 'vistaInformacionGeneral'"
                    typeFlujoSgda="Tutelas" pathBandeja="/bandeja" />
            </q-tab-panel>
            <q-tab-panel name="enviarPublicacion">
                <EnviarPublicacion @back-view="tab = 'vistaInformacionGeneral'" typeFlujoSgda="Tutelas"
                    :idCaso="detalleTutela.id" />
            </q-tab-panel>
            <q-tab-panel name="enviarPublicacion">
                <EnviarPublicacion @back-view="tab = 'vistaInformacionGeneral'" :id-caso="detalleTutela.idTutela"
                    :typeFlujoSgda="'Tutelas'" />
            </q-tab-panel>
            <q-tab-panel name="publicar">
                <Publicar @back-view="tab = 'vistaInformacionGeneral'" :type="'tutelas'"
                    :detalles-registro="detalleTutela" />
            </q-tab-panel>
            <q-tab-panel name="rechazarPublicacion">
                <RechazarPublicacion @back-view="tab = 'vistaInformacionGeneral'"
                    @back-page="router.push('/bandeja')" :detalles-registro="detalleTutela" :type="'tutelas'" />
            </q-tab-panel>
            <q-tab-panel name="ArchivosDesfijacion">
                <ArchivosDesfijacion @back-view="tab = 'vistaInformacionGeneral'" :detalles-registro="detalleTutela"
                    :type="'tutelas'" />
            </q-tab-panel>
            <q-tab-panel name="CierrePublicacion">
                <CierrePublicacion @back-view="tab = 'vistaInformacionGeneral'" :detallesRegistro="detalleTutela"
                    :type="'tutelas'" />
            </q-tab-panel>

            <!-- <q-tab-panel name="ReinicioGestion">
                <ReiniciarGestionModal :detalle-tutela="detalleTutela" />
            </q-tab-panel> -->

        </q-tab-panels>
        <q-dialog v-model="rechazarModal">
            <q-card :class="['tw-px-10 tw-py-6']" style="width: 700px; max-width: 80vw;">
                <h3 class="text-bold text-grey-7 tw-text-2xl tw-flex-1 q-py-md q-px-sm">
                    Rechazar Caso
                </h3>

                <p class="tw-text-base tw-font-light tw-mb-4 text-grey-8">Escribe aquí el motivo de rechazo</p>
                <label class="q-px-md tw-mt-2 tw-text-label">Observaciones * {{ observacionesDocSalida.length }}/1000
                    <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="observacionesDocSalida"
                        :rules="[inputRequired, alphanumeric, v => maxLengthInput(1000, v)]" />
                </label>
                <q-card-actions align="center">
                    <q-btn flat label="Cancelar" class="tw-w-48 tw-h-12" color="primary" v-close-popup />
                    <q-btn label="Rechazar" class="tw-w-48 tw-h-12" color="primary" @click="rechazarConfirm = true" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="rechazarEscModal">
            <q-card :class="['tw-px-10 tw-py-6']" style="width: 700px; max-width: 80vw;">
                <h3 class="text-bold text-grey-7 tw-text-2xl tw-flex-1 q-py-md">
                    Rechazar Escalamiento
                </h3>

                <q-form ref="rechazarEscalamientoForm">
                    <label class="q-px-md tw-mt-2 tw-text-label">Observaciones * {{ observacionesRechazarEsc.length
                    }}/1000
                        <q-input type="textarea" outlined
                            :label="observacionesRechazarEsc == '' ? 'Escriba aquí el motivo de rechazo' : ''" dense
                            emit-value v-model="observacionesRechazarEsc"
                            :rules="[inputRequired, v => maxLengthInput(1000, v), v => minLengthInput(10, v)]" />
                    </label>
                </q-form>

                <q-card-actions align="center">
                    <q-btn flat label="Cancelar" class="tw-w-48 tw-h-12" color="secondary"
                        @click="tab = 'vistaInformacionGeneral', observacionesRechazarEsc = ''" v-close-popup />
                    <q-btn label="Rechazar" class="tw-w-48 tw-h-12" color="secondary" @click="rechazarEsc" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="rechazarDocModal">
            <q-card :class="['tw-px-10 tw-py-6']" style="width: 700px; max-width: 80vw;">
                <h3 class="text-bold text-grey-7 tw-text-2xl tw-flex-1 q-py-md">
                    Rechazar Caso
                </h3>
                <q-form ref="rechazarDocForm">
                    <label class="q-px-md tw-mt-2 tw-text-label">Observaciones
                        *{{ observacionesRechazarDoc.length }}/10000
                        <q-input type="textarea" outlined
                            :label="observacionesRechazarDoc == '' ? 'Escriba aquí el motivo de rechazo' : ''" dense
                            emit-value v-model="observacionesRechazarDoc"
                            :rules="[inputRequired, v => maxLengthInput(10000, v), v => minLengthInput(10, v)]" />
                    </label>
                </q-form>

                <q-card-actions align="center">
                    <q-btn flat label="Cancelar" class="tw-w-48 tw-h-12" color="secondary"
                        @click="observacionesRechazarDoc = ''" v-close-popup />
                    <q-btn label="Rechazar" class="tw-w-48 tw-h-12" color="secondary" @click="rechazarDocSalida" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <Modal v-model="aprobEscalamiento" title="Confirmación" :is-success="false" @handleAccept="aprobarEscalamiento"
            cancel-button textButtonCancel="No" textButton="Si"
            text="¿Está seguro que desea aceptar y gestionar el escalamiento?" @close-modal="aprobEscalamiento = false"
            type="button" />

        <Modal v-model="aprobarConfirm" title="Confirmación" :is-success="false" @handleAccept="aprobarDoc"
            cancel-button textButtonCancel="Cancelar" textButton="Aceptar"
            text="¿Está seguro de dar el visto bueno a la respuesta proyectada?" @close-modal="aprobarConfirm = false"
            type="button" />
      <q-dialog v-model="showFirmaModal">
        <FirmaModal :row="selectedRow" @close="showFirmaModal = false" :data="documentParaFirmar" :data_footer="dataFooter"  :referentKey="referentKey"
        @aprobate="aprobarCasoAprobador"/>
      </q-dialog>
      />

        <Modal v-model="rechazarConfirm" title="Confirmación" :is-success="false" @handleAccept="" cancel-button
            textButtonCancel="Cancelar" textButton="Aceptar" text="¿Está seguro de rechazar el trámite?"
            @close-modal="rechazarConfirm = false" type="button" />

        <Modal v-model="confirmRechazarDoc" title="¡Espera un momento!" :is-success="false" @handleAccept="rechazarDoc"
            cancel-button textButtonCancel="No" textButton="Si"
            text="¿Está seguro de rechazar la respuesta a la tutela?"
            @close-modal="confirmRechazarDoc = false, observacionesRechazarDoc = '', rechazarDocModal = false"
            type="button" />

        <Modal v-model="validModal" title="Confirmación" :is-success="false" @handleAccept="verifyValidation"
            cancel-button textButtonCancel="No" textButton="Si"
            text="¿Está usted seguro que el Código del Proceso es correcto?" @close-modal="validModal = false"
            type="button" />

        <Modal v-model="cancelGestModal" title="Confirmación" :is-success="false" @handleAccept="cancelarGestion"
            cancel-button textButtonCancel="No" textButton="Si"
            text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
            @close-modal="cancelGestModal = false" type="button" />

        <Modal v-model="cerrarEscalModal" title="Confirmación" :is-success="false" @handleAccept="cerrarEscalamientos"
            cancel-button textButtonCancel="No" textButton="Si" text="¿Está seguro del cierre del escalamiento?8"
            @close-modal="cerrarEscalModal = false" type="button" />

        <Modal v-model="modalSegundaDevolucion" :is-success="false" @handleAccept="tab = 'vistaInformacionGeneral'"
            textButton="Aceptar" text="El documento ha cumplido dos devoluciones, gestionar publicación en Página WEB"
            @close-modal="cancelGestModal = false" type="button" />

        <Modal v-model="cerrarGestionModal" title="Confirmación" :is-success="false" @handleAccept="cerrarGestion"
            cancel-button textButtonCancel="No" textButton="Si"
            text="¿Está seguro de cerrar la gestión del radicado? Recuerde que una vez cerrado, no podrá darle gestión"
            @close-modal="cerrarGestionModal = false, tab = 'vistaInformacionGeneral'" type="button" />


        <ConfirmModal text-cancel-modal="Descargar" text-confirm-modal="Finalizar" persistent
            :text-show-modal="`La respuesta proyectada tiene su visto bueno. Radicado de salida generado ${radicadoSalidaTutela}.`"
            @update:show-modal="download(nodeidDocSalida, '/bandeja')" @confirm-modal="cancelarAprobacion"
            :show-modal="showModalExitoAprobacionRadicado" />

        <Modal v-model="modalLiberarRadicado" title="¡Espera!"
            :text="`¿Está seguro de abandonar el radicado sin asignar?`" text-button="Sí" cancel-button
            text-button-cancel="No" @handleAccept="backDetalle" label="Confirmar"
            @close-modal="() => modalLiberarRadicado = false" />

        <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
            <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
                <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
                    <q-card-section>
                        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                            <div>
                                <q-btn v-if="!visibleDoscRead" @click="visualizadorPDF = false"
                                    class="tw-absolute tw-ml-5 tw-mt-20 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
                                <iframe class="tw-h-[80vh] tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>

                                <template v-if="listForVizualiser.length > 0">
                                    <p class="text-weight-bold tw-mt-2">Documentos de Entrada</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab
                                            v-for="item in listForVizualiser.filter(it => it.tipo.trim() === 'De entrada')"
                                            :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle"
                                                    :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>

                                    <p class="text-weight-bold tw-pt-5">Documentos de Gestión</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab
                                            v-for="item in listForVizualiser.filter(it => it.tipo.trim() === 'De gestión')"
                                            :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle"
                                                    :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>

                                    <p class="text-weight-bold tw-pt-5">Documentos de Salida</p>
                                    <q-tabs v-model="tabsFiles" dense align="justify" narrow-indicator>
                                        <q-tab
                                            v-for="item in listForVizualiser.filter(it => it.tipo.trim() === 'De Salida' || it.tipo.trim() === 'De salida')"
                                            :name="item.nombre">
                                            <q-card class="tw-h-[10vh] tw-w-[150px] tw-p-3"
                                                @click="getBlobToIframe(item.nodeId, null)">
                                                <q-img v-lazy :data-url="docImg" style="width: 30px" />
                                                <p class="tw-text-gray-dark textFile tw-mt-2">{{ item.nombre }}</p>
                                                <q-tooltip class="text-body2" anchor="top middle" self="bottom middle"
                                                    :offset="[10, 10]">
                                                    {{ item.nombre }}
                                                </q-tooltip>
                                            </q-card>
                                        </q-tab>
                                    </q-tabs>
                                </template>
                            </div>

                        </transition>
                    </q-card-section>

                    <q-inner-loading :showing="visibleDoscRead" label-class="text-teal"
                        label-style="font-size: 1.1em" />
                </q-card>
            </q-dialog>
        </div>
        <q-dialog
              v-model="showModalDocumentoSalida"
              backdrop-color="rgba(0, 0, 0, 0.5)"
              persistent
            >
              <q-card class="tw-w-full mx-auto tw-rounded-md">
                <q-form ref="formModalSalida" greedy @submit.prevent="aprobarCasoAprobador(formDocSalida.file)" @validation-error="validationCargaDoc">
                  <q-card-section class="tw-px-8">
                    <div
                      class="tw-text-xl tw-font-bold tw-text-[#0a1b48] tw-mb-4 tw-mt-4"
                    >
                      Cargar el documento de salida
                    </div>
                    <label class="tw-block tw-text-sm tw-font-bold tw-text-[#777e87]"
                      >Adjuntar documento *</label
                    >
                    <div class="tw-col-span-6">
                  <FileLoader
                    :max-file-size="30 * 1024 * 1024"
                    max-file-size-label="30"
                    v-model:model-value="formDocSalida.file"
                    :rules="[inputRequired]"
                    :max-files="1"
                    accept-file="pdf"
                    @rejected="rejectedFiles"
                  >
                  </FileLoader>
                </div>
                  </q-card-section>
                  <div
                    class="tw-flex tw-justify-center tw-items-center tw-pb-6 tw-gap-3"
                  >
                    <q-btn
                      flat
                      label="Cancelar"
                      color="secondary"
                      class="tw-w-[40%] tw-h-10"
                      @click="showModalDocumentoSalida = false"
                    />
                    <q-btn
                      label="Cargar y Aprobar"
                      color="secondary"
                      class="tw-w-[40%] tw-h-10"
                      type="submit"
                    />
                  </div>
                </q-form>
              </q-card>
            </q-dialog>
    </main>
</template>

<script lang="ts" setup>
import { Ref, onMounted, ref, watch, onBeforeMount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fourthFormatDate,formatDateTimeStandTwo, currentHourWithoutSec} from "src/helpers/formtDate";
// @ts-ignore
import docImg from "src/assets/icon-lines.svg";
import { useLastTutelaStore } from "src/stores/lastTutela.store";
import { ITutelaDetalles } from ".";
import { alphanumeric, inputRequired, maxLengthInput, minLengthInput } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { DocumentoRadicado, DataSteps } from "src/interfaces";
import moment from 'moment';
import Modal from "components/Modal/Modal.vue";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import Trazabilidad from "src/pages/Expedientes/Trazabilidad/Trazabilidad.vue";
import Asignar from "./Asignar/Asignar.vue";
import DocumentosRelacionados from "./DocumentosRelacionados/DocumentosRelacionados.vue";
import AdjuntarSoporte from "./DocumentosRelacionados/AdjuntarSoporte.vue";
import Comentarios from "./Comentarios/Comentarios.vue"
import GestionTutelas from "./GestionTutelas/GestionTutelas.vue";
import Escalamiento from "./Escalamiento/Escalamiento.vue";
import DatosSalida from "./DatosSalida/DatosSalida.vue";
import GestionarEtapa from "./GestionarEtapa/GestionarEtapa.vue";
import Etapa from "./GestionarEtapa/Etapa.vue";
import CambiarAprobador from "./CambiarAprobador/CambiarAprobador.vue";
import RadicadosAsociados from './Radicados/Radicados.vue'
import InformacionGeneral from "./InformacionGeneral/InformacionGeneral.vue";
import Reasignar from 'src/pages/SGDA/ClasificacionDocumental/Tutelas/Reasignar/Reasignar.vue'
import GestionEscalmiento from "./Escalamiento/GestionEscalmiento.vue";
import EnviarAprobacion from "./Enviar/EnviarAprobacion.vue";
import Enviar from "./Enviar/Enviar.vue";
import SolicitudEscalamiento from "./Escalamiento/MotivoEscalamiento.vue";
import RespuestaEscalamiento from "./Escalamiento/RespuestaEscalamiento.vue";
import Reclasificar from "./Reclasificar/reclasificar.vue";
import IncluirExpediente from "./Expedientes/IncluirExpediente.vue";
import { useAuthStore } from "stores/auth.store";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import EnviarPorCorrespondencia from 'src/components/Devolucion/EnviarCorrespondencia.vue'
import EnviarPorCorreo from 'src/components/Devolucion/EnviarCorreo.vue'
import CerrarDevolucion from "src/components/Devolucion/CerrarDevolucion.vue";
import EnviarPublicacion from "src/components/Devolucion/EnviarPublicacion.vue";
import Publicar from "src/components/Devolucion/Publicar.vue";
import RechazarPublicacion from "src/components/Devolucion/RechazarPublicacion.vue";
import ArchivosDesfijacion from "src/components/Devolucion/ArchivosDesfijacion.vue";
import CierrePublicacion from "src/components/Devolucion/CierrePublicacion.vue";
import FileLoader from "components/FormFields/FileLoader.vue";
// import Metadatos from "src/components/metadtos/DynamicFields/Metadatos.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import { ESTADOS } from "src/assets/estados/estados"
// import ReiniciarGestionModal from "src/components/ReinicioDeGestion/ReiniciarGestionModal.vue";
import Editor from "src/components/Editor/editor.vue";
import FirmaModal from "src/components/Modal/FirmaModal.vue";

const respuestaEcsActiva = ref(false)
const incrementaKey = ref(0)
const router = useRouter();
const route = useRoute();
const showRoute = ref(route.params.id);
const docActive = ref(false)
const escActive = ref(false)
const modalLiberarRadicado = ref(false)
const rechazarEscalamientoForm = ref()
const cerrarEscalModal = ref(false)
const trazabilidadData = ref<any[]>([])
const doc = ref(false)
const visualizadorPDF = ref(false)
const iframePdfUrl = ref()
const tab = ref("vistaInformacionGeneral");
const stepsEtapaProcesal: Ref<DataSteps[]> = ref([]);
const stepName = ref('Avoco');
const idEtapaProcesal = ref(null);
const asignar = ref([]);
const gestionEscalamientoComp = ref()
const asignarTabKey = ref(0)
const departmentsList = ref([])
const loaded = ref(true);
const status = ref("");
const detalleTutela: Ref<Partial<ITutelaDetalles>> = ref({});
const listDocs = ref([])
const municipiosList = ref([])
const nameDocument = ref(null)
const tiposDocumentos = ref()
const hasEtapa = ref(false)
const gestionEtapa = ref(false)
const allValidation = ref(false)
const validModal = ref(false)
const detallesEtapa = ref({})
const detallesEtapaRadicados = ref()
const datosGestionEtapa = ref()
const validFormGestion = ref(false)
const radicados = ref([])
const cancelGestModal = ref(false)
const activeValidButton = ref(false)
const validRadicadosAsignados = ref(false)
const validRespuestaEscalamiento = ref(false)
const observacionesDocSalida = ref('')
const rechazarModal = ref(false)
const aprobEscalamiento = ref(false)
const rechazarEscModal = ref(false)
const rechazarDocModal = ref(false)
const confirmRechazarDoc = ref(false)
const rechazarConfirm = ref(false)
const aprobarConfirm = ref(false)
const showFirmaModal = ref(false)
const selectedRow = ref<any>(null)
const documentosRelacionados = ref<any[]>([])
const ocultarBoton = ref(false)
const habilitarBotones = ref(false)
const documentParaFirmar = ref ()
const selectedTab = ref('info')
const refDocumentos = ref()
const userInfo = ref()
const { getUserInfo } = useAuthStore();
const loadingDocs = ref(true)
const typeExport = ref()
const validOwn = ref(false)
const observacionesRechazarEsc = ref("")
const observacionesRechazarDoc = ref("")
const isUserEscalado = ref(false)
const auth = useAuthStore()
const docSalidaComp = ref()
const docForSoporte = ref()
const rechazarDocForm = ref()
const listForVizualiser = ref([])
const visibleDoscRead = ref(false)
const tabsFiles = ref()
const isDevolucion = ref(false)
const isNewDocCreated = ref(false)
const segundaDevolucion = ref(false)
const modalSegundaDevolucion = ref(false)
const isPublicacion = ref(false)
const isDefijacion = ref(false)
// const metadatos = ref([]);
const selectedEscalamientos = ref([])
// const isMetadatos = ref(false)
const validEscalamientoRechazado = ref(false)
const cerrarGestionModal = ref(false)
const expedienteIncluido = ref(false)
const validCreacionEtapasProcesales = ref(false)
// const firmaAprobador = ref(null)
// const showModalAprobacionRadicado = ref(false);
const showModalExitoAprobacionRadicado = ref(false);
const nodeidDocSalida = ref("")
const documentId = ref(0);
const htmlContent = ref("");
const documentoFile = ref("");
const imgBase64 = ref();
const aprobadoDocSal = ref(false);
const arrayCopyInterna = ref("");
const selectedSignature = ref();
const docSalidaKey = ref(0)
const showModalDocumentoSalida = ref(false)
let trazabilidadRegistrada = false;
const esDocCargado = ref(false);
const haveDocGestion = ref(false)
const docCargado = ref(false)

const onDocSalidaClick = async () => {
    await getInfoSalida()
    docSalidaKey.value++
}

const formDocSalida = ref(
  {
    file: [],
  }
);

const emit = defineEmits(['goToDocs' , 'change-tab'])


const openFirmaModal = (row: any) => {
  selectedRow.value = row
  showFirmaModal.value = true
}

const handleAprobarClick = (row: any) => {
  if (haveDocGestion.value) {
    esDocCargado.value =true;
    selectedRow.value = row
    showFirmaModal.value = true
  } else {
    esDocCargado.value =false;
    aprobarConfirm.value = true
  }
}

const isDocSalidaBtn = ref(false);

const cargarDocumentoSalida = () => {
    if (docCargado.value){
        toast.error("Debe eliminar el 'Documento_a_aprobar.pdf' cargado previamente para cargar uno nuevo");
    }else{
        isDocSalidaBtn.value = true;
        docCargado.value = true;
        openFileInput();
    }
};

const validationCargaDoc = () => {
  return toast.error("Debe adjuntar el documento de salida");
};

const rejectedFiles = (error: any[]) => {
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-file-size"
    )
  ) {
    toast.error("El peso permitido es hasta 30MB.");
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-files"
    )
  ) {
    toast.error("Solo se puede adjuntar un archivo.");
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "accept"
    )
  ) {
    toast.error("Formato inválido, el formato permitido es pdf.");
  }
};

const manejarEliminacion = async (id) => { 
  try {
    await sgdeaAxios.delete(`/tutela/archivos/${id}`);
    toast.success('Documento eliminado');
    docCargado.value = false;
    await getAllRegisters();
    validateInfoGestion();
  } catch (error) {
    toast.error('Error al eliminar documento');
  }
};

async function autoSaveDocument({ paragraf }) {
    try {
        const htmlContentPara = paragraf;
        const payload = {
            idCorrespondencia: detalleTutela.value?.idTutela,
            id_documentoSalida: documentId.value,
            contenido_html: htmlContentPara,
            usuarioCreadorId: auth.userInfo.userid,
        };
        let response;

        if (documentId.value) {
            // Si existe documento de salida, se actualiza el texto
            response = await sgdeaAxios.patch(
                "tutela/actualizarDocumentoSalida",
                payload, { showLoader: false }
            );
        } else {
            // Si no existe registro previo, se crea uno
            response = await sgdeaAxios.post(
                "/tutela/guardarDocumentoSalida",
                payload,
            );
        }

        if (response.status === 200 || response.status === 201) {
            toast.success("El documento se guardó exitosamente");
            if (!trazabilidadRegistrada) {
                await crearTrazabilidad({
                    proceso: `TUT${detalleTutela.value?.idTutela}`,
                    secuencia: detalleTutela.value?.idRadicado,
                    estado: detalleTutela.value?.estado,
                    descripcion:
                        `Usuario:${userInfo.value.name} ` +
                        `Descripción: Se ha modificado el documento de salida`,
                    comentario: "Se ha modificado el documento de salida",
                    tramite: 'Tutela',
                    nombre: auth.$state.userInfo.name,
                    accion: `${userInfo.value.name} modificó el documento de salida de la comunicación`,
                })
                trazabilidadRegistrada = true;
            }
        } else {
            toast.error("No se pudo guardar el documento. Verifica los datos enviados.");
        }
        await getDocSalida();
    } catch (error) {
        toast.error("Hubo un error al intentar guardar el documento");
    }
}

const getFirma = async (idAprobador, idFirma) => {
    try {
        const response = await sgdeaAxios.get(
            `/usuarios/obtener-firma/${idAprobador || 0}`
        );
        const { data } = response;
        if (data && data.length > 0 && idFirma) {
            selectedSignature.value = data.find(
                (firma) => firma.id === idFirma
            );
        }
    } catch (error) {
        toast.error("Hubo un error al cargar la firma del aprobador");
    }
};

const radicadoSalidaTutela = ref();

const aprobarCasoAprobador = async (data) => {
    const formData = new FormData();
    formData.append("file", data, `RadicadoSalida.pdf`);
    formData.append("usuario", userInfo.value.userid ? userInfo.value.userid : 'indefinido');

    if(esDocCargado.value){
      formData.append("esDocumentoCargado", esDocCargado.value);
    }

    const response = await sgdeaAxios.post(`/tutela/${detalleTutela.value.idTutela}/aprobar`, formData);

    if (response.status === 200) {
        await crearTrazabilidad({
            proceso: `TUT${detalleTutela.value.idTutela}`,
            secuencia: detalleTutela.value.idRadicado,
            estado: detalleTutela.value.estado,
            nombre: auth.$state.userInfo.name,
            comentario: 'Subida de archivo(s)',
            descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
                `Descripción: Se aprobó el documento de salida de la Tutela`,
            accion: `${userInfo.value.name} ha aprobado el documento de salida del ${detalleTutela.value.idRadicado}`,
            tramite: "Tutela"
        })
        toast.success('Se aprobó la tutela correctamente');
        nodeidDocSalida.value = response.data.nodeIdSalida;
        radicadoSalidaTutela.value = response.data.refRadicadoSalida;
        showModalDocumentoSalida.value = false
        showModalExitoAprobacionRadicado.value = true
    }
};

const headers = {
    "Access-Control-Allow-Origin": "*",
    accept: "application/json",
    "Content-Type": "application/json",
};

function checkIfAsignado() {
    if (detalleTutela.value.asignaciones && !detalleTutela.value.asignaciones[0].asignado) {

        modalLiberarRadicado.value = true
    } else {
        backDetalle()
    }
}



const isDisabled = computed(() => {
    return detalleTutela.value?.estado?.toLowerCase() === 'anulado' && detalleTutela.value?.fechaAnulacion !== null && detalleTutela.value?.anulacionConReinicio === false
});

const getBlobToIframe = async (id, list) => {
    visibleDoscRead.value = true

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
    );

    if (id) {
        tabsFiles.value = data.name
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    iframePdfUrl.value = URL.createObjectURL(blob);

    visualizadorPDF.value = true
    if (list) {
        listForVizualiser.value = list
    }
    visibleDoscRead.value = false
}

const referentKey = computed(() => ({
    asunto: detalleTutela.value?.radicadoSalida?.asunto || "",
    NombredeDestinatario: detalleTutela.value?.juzgado?.nombre || "",
    DireccionDeDestinatario: detalleTutela.value?.juzgado?.direccion || "",
    TelefonoDeDestinatario: detalleTutela.value?.juzgado?.telefono || "",
    DepartamentoYMunicipioDestinatario:
        detalleTutela.value?.juzgado && detalleTutela.value?.municipio
            ? `${detalleTutela.value?.juzgado?.departamento} - ${detalleTutela.value?.juzgado?.municipio}`
            : "",
    CorrreoDestinatario: detalleTutela.value?.juzgado?.correo || "",
    Firma: selectedSignature?.value
        ? selectedSignature?.value?.tipoFirmaUsuario?.nombre === 'Grafo'
            ? selectedSignature?.value?.fileData : selectedSignature?.value?.fileName
        : "",
    // NombreAprobador: detalleTutela.value?.userId
    //   ? detalleTutela.value.userId.fullname.toUpperCase()
    //   : "",
    CargoAprobador: detalleTutela.value?.userId
        ? detalleTutela.value.userId?.cargo?.nombre
        : "",
    DependenciaAprobador: detalleTutela.value?.userId?.usuarioRelaciones
        && detalleTutela.value?.userId?.usuarioRelaciones.length > 0
        ? detalleTutela.value.userId?.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ?? ""
        : "",
}));

const dataFooter = computed(() => {
  const estado = detalleTutela.value?.estado; // ajusta el path del estado si cambia
  const datosGestionador =
    estado === "Para gestión"
      ? detalleTutela.value?.userId
        ? `${detalleTutela.value.userId.fullname?.toUpperCase() || ""} - ${
          detalleTutela.value.userId?.cargo?.nombre || ""
        } - ${
          detalleTutela.value.userId?.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ||
          ""
        }`
        : ""
      : detalleTutela.value?.usuarioAntiguo
        ? `${detalleTutela.value.usuarioAntiguo.fullname?.toUpperCase() || ""} - ${
          detalleTutela.value.usuarioAntiguo?.cargo?.nombre || ""
        } - ${
          detalleTutela.value.usuarioAntiguo?.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ||
          ""
        }`
        : "";

  const datosAprobador =
    estado === "Para gestión"
      ? "" // ocultamos el aprobador en este estado
      : detalleTutela.value?.userId
        ? `${detalleTutela.value.userId.fullname?.toUpperCase() || ""} - ${
          detalleTutela.value.userId?.cargo?.nombre || ""
        } - ${
          detalleTutela.value.userId?.usuarioRelaciones[0]?.oficina?.dependencia?.nombre ||
          ""
        }`
        : "";

  return {
    Anexo: detalleTutela.value?.radicadoSalida?.anexos ?? "",
    Copia: arrayCopyInterna.value || "",
    DatosGestionador: datosGestionador,
    DatosAprobador: datosAprobador,
    FormadeEnvio: detalleTutela.value?.radicadoSalida?.formaEnvio,
    //firmaAprobador: "",
    //cargoAprobador: "",
    //dependenciaAprobador: "",
  };
});

const getInfoSalida = async () => {
    const usuariosExternos = await getUsuariosExternos(detalleTutela.value.idTutela);

    arrayCopyInterna.value = usuariosExternos && usuariosExternos.length > 0
        ? usuariosExternos
            .filter((item) => !item.externo) // Filtramos los internos
            .map((item) => formatCopyInterna(item)) // Formateamos los usuarios internos
        : "" // Si es null, asignamos una cadena vacía

}

function validateInfoGestion(){
  const docs = listDocs.value
  const docsGestion = docs.filter((d: any) => {
    if (!d.tipo) return false
    const tipo = d.tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return tipo.includes('gestion') // captura "De gestión" o "gestion"
  })
  haveDocGestion.value = docsGestion.length > 0;

  const documentoAprobar = docsGestion.some(doc => 
    doc.nombre === "Documento_a_aprobar.pdf"
  );
  docCargado.value = documentoAprobar;
}

onMounted(async () => {

    userInfo.value = await getUserInfo();

    const getPlantilla = await getPlantillaSinPrefijo();
    documentoFile.value = getPlantilla.base64x;

    let url = "";
    if (process.env.API) {
        url = process.env.API;
    }

    detalleTutela.value = (
        await sgdeaAxios.get(`${url}/tutela/info/${route.params.id}`, {})
    ).data;

    await getDocSalida();

    const usuariosExternos = await getUsuariosExternos(detalleTutela.value.idTutela);

    arrayCopyInterna.value = usuariosExternos && usuariosExternos.length > 0
        ? usuariosExternos
            .filter((item) => !item.externo) // Filtramos los internos
            .map((item) => formatCopyInterna(item)) // Formateamos los usuarios internos
        : "" // Si es null, asignamos una cadena vacía

    if (detalleTutela.value?.userId) {
        await getFirma(
            detalleTutela.value?.userId?.id, detalleTutela.value?.userId?.firmaPredeterminadaId
        );
    }

    if (detalleTutela.value.usuarioEscalados[detalleTutela.value.usuarioEscalados.length - 1]?.estado == 'Escalamiento Rechazado') {
        validEscalamientoRechazado.value == true
    }
    if (detalleTutela.value.codprocesovalidado) {
        allValidation.value = true
    } else {
        activeValidButton.value = true
    }

    if (detalleTutela.value.estado == "Devolucion") {
        isDevolucion.value = true
    }

    if (detalleTutela.value.es_devolucion) {
        isDevolucion.value = true
    }

    if (detalleTutela.value.estado == "Por publicar" || detalleTutela.value.estado == "Publicado" || detalleTutela.value.estado == "Publicado cerrada" || detalleTutela.value.estado == "Publicacion rechazada") {
        isPublicacion.value = true
    }
    if (detalleTutela.value.fechaPublicacion) {
        const givenDateString = detalleTutela.value.fechaPublicacion
        const givenDate = new Date(givenDateString);
        const currentDate = new Date();
        const millisecondsDiff = currentDate.getTime() - givenDate.getTime();
        const daysDiff = millisecondsDiff / (1000 * 60 * 60 * 24);
        if (daysDiff >= 6) {
            tab.value = 'ArchivosDesfijacion'
            isDefijacion.value = true
        }
    }

    validIfExpediente()
    if (detalleTutela.value.numeroDevoluciones > 1) {
        segundaDevolucion.value = true
        modalSegundaDevolucion.value = true
        isNewDocCreated.value = true
    }

    if (detalleTutela.value.isCierreDevolucion) {
        segundaDevolucion.value = true
        modalSegundaDevolucion.value = true
        isNewDocCreated.value = true
    }

    useLastTutelaStore().saveTutela(detalleTutela.value);
    detalleTutela.value = useLastTutelaStore().getTutela();
    status.value = detalleTutela.value.estado
    validEscalamiento()
    await getEtapasProcesales();
    await getAllRegisters();
    validateInfoGestion()
    if (route.query.tab == 'docRelacionado') {
        tab.value = 'docs'
    } else if (route.query.tab == 'docSalida' && !["Aprobado", "Enviado"].includes(detalleTutela.value.estado)) {
        tab.value = 'docSalida'
    }

    await getDimanicDatos()
    await getInfoSalida()
});

const getUsuariosExternos = async (tutelaId: number) => {
    const response = await sgdeaAxios.get<any>(
        `/tutela/${tutelaId}/usuario/externos`
    );
    if (response.status == 200) {
        return response.data;
    } else {
        return [];
    }
}

const formatCopyInterna = (data: any) => {
    return `${data.nombre || ""} - ${data.correo || ""}`;
}

const getPlantillaSinPrefijo = async () => {
    const nodeid = process.env.NODE_SIN_PREFIJO;

    const response = await sgdeaAxios.get<any>(
        `/radicados/consultar_documento/${nodeid}`
    );
    return response.data;
};

const validIfExpediente = async () => {
    let url = "";
    if (process.env.API) {
        url = process.env.API;
    }
    expedienteIncluido.value = (
        await sgdeaAxios.post(`${url}/correspondencia/${route.params.id}/expediente`, {})
    ).data;
}

async function getDimanicDatos() {
    const user = auth?.$state?.userInfo

    const rolUserId = user.relations.find(it => it.rol === user.role)

    const getEstados = (await sgdeaAxios.get('/estadosProceso/all')).data

    const estadoProceso = getEstados.find((it) => it.estado === detalleTutela.value.estado)

}

const getDocSalida = async () => {
    try {
        const response = await sgdeaAxios.get(`/tutela/traerdocumentosalidaactual?tutelaId=${detalleTutela.value.idTutela}`, { showLoader: false });
        htmlContent.value = response.data.contenido || "";
        documentId.value = response.data.id || 0;
    } catch (error) {
        toast.error('Ha ocurrido un error al momento de cargar los documentos de salida')
    }
}

const editData = (data) => {
    datosGestionEtapa.value = data
    validFormGestion.value = true
    gestionEtapa.value = true
}

const getTutelasInfo = async () => {
    let url = "";
    if (process.env.API) {
        url = process.env.API;
    }
    detalleTutela.value = (
        await sgdeaAxios.get(`${url}/tutela/info/${route.params.id}`, {})
    ).data;
}

onBeforeMount(async () => {

    const findDeparment = departmentsList.value.find((it) => it.label === detalleTutela.value.departamento)?.value;
    const findMunicipio = municipiosList.value.find((it) => it.label === detalleTutela.value.municipio)?.value;


    const updateTutelasData = {
        ...detalleTutela.value,
        departamento: findDeparment,
        municipio: findMunicipio,
    }

    useLastTutelaStore().saveTutela(updateTutelasData);
    detalleTutela.value = useLastTutelaStore().getTutela();

})


async function getAllRegisters() {
    const { data } = await sgdeaAxios.get<any>(
        `/tutela/${detalleTutela.value.idTutela}/archivos`
    );

    listDocs.value = data.map((it) => ({
        formato: /[^.]+$/.exec(it.nombre)[0],
        nombre: it.nombre,
        tipo: it.tipo,
        fecha: formatDateTimeStandTwo(it.fechaCreacion) + ' ' + currentHourWithoutSec(it.fechaCreacion),
        cargado_por: it.usuario,
        id: it.id,
        username: it.username,
        nodeId: it.nodeId,
        extension: it.extension
    }))

    loadingDocs.value = false

}

const handleCancel = (data) => {
    tab.value = data
}

const backDetalle = async () => {
    if (userInfo.value.role == "Asignador Responsable") {
        const soltarReclamo = await sgdeaAxios.put(`/tutela/liberar-radicado-asignador/${detalleTutela.value.idTutela}?userId=${userInfo.value.userid}`)
        if (soltarReclamo.status == 200) {
            toast.success("Se ha desasignado el radicado")
            router.push('/bandeja');
        }
    } else {
        router.push('/bandeja');
    }

}

const fileInputRef = ref(null)
const openFileInput = () => {
    fileInputRef.value.click();
};
const reloadData = ref(false)
const uploadFiles = async () => {

    const files = fileInputRef.value.files;
    if (files.length > 15) return toast.error('Solo se pueden adjuntar 15 archivos.');
    const formdata = new FormData()
    let fileNames = {}
    try {
        for (let file of files) {
            const hasDuplicateName = listDocs.value.some(doc => doc?.nombre == file.name);
            if (hasDuplicateName || fileNames[file.name]) {
                toast.error('Está intentando cargar el mismo archivo más de una vez');
                fileInputRef.value.value = ''
                return;
            }
            if (file.size > 30 * 1024 * 1024) {
                toast.error('El peso máximo permitido es de  30MB');
                fileInputRef.value.value = ''
                return;
            }
            fileNames[file?.name] = true;
            if (isDocSalidaBtn.value) {
              const newFileName = `Documento_a_aprobar.pdf`;
              file = new File([file], newFileName, { type: file.type });
            }
            formdata.append('files', file)
        }
        // @ts-ignore
        const response = await sgdeaAxios.post(`/tutela/${detalleTutela.value.idTutela}/${userInfo.value.userid}/De gestión/archivos/subir?es_devolucion=false`, formdata,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "accept": "*",
                    "Content-Type": "multipart/form-data",
                    "Content-Transfer-Encoding": "BINARY"
                }
            })
        if (response.status === 200) {
            await crearTrazabilidad({
                proceso: `TUT${detalleTutela.value.idTutela}`,
                secuencia: detalleTutela.value.idRadicado,
                estado: detalleTutela.value.estado,
                nombre: auth.$state.userInfo.name,
                comentario: 'Subida de archivo(s)',
                descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
                    `Descripción: Cargue de documentos relacionados a la Tutela`,
                accion: `${auth.$state.userInfo.name} ha subido archivo(s) a ${detalleTutela.value.idRadicado}`,
                tramite: "Tutela"
            })
            toast.success('Se realizó el cargue correctamente')
            fileInputRef.value.value = ''

            getAllRegisters()
            reloadData.value = true
            setTimeout(() => {
                reloadData.value = false
            }, 500);
        }
    } catch (error) {
        toast.error('Ha ocurrido un error')
        fileInputRef.value.value = ''
    } finally {
        fileNames = {}
        fileInputRef.value.value = ''

    }
}

const getEtapasProcesales = async () => {
    let url = "";
    if (process.env.API) {
        url = process.env.API;
    }

    const { data } = await sgdeaAxios.get<DataSteps[]>(
        `${url}/tutela/listadoEtapaProcesalXTutela/${detalleTutela.value.codigoProceso}`
    );
    var arrayForRadicados = JSON.parse(JSON.stringify(data));
    detallesEtapa.value = {
        numeroRadicado: detalleTutela.value.idRadicado,
        fechaRadicado: moment(detalleTutela.value.fechaRadicacion).format('DD/MM/YYYY HH:mm'),
        juzgado: detalleTutela.value.juzgado,
        codigoProceso: detalleTutela.value.codigoProceso,
        nodeId: detalleTutela.value.nodeId,
        listadoRadicados: data.filter((item) => item.informacionProceso)
    }
    detallesEtapaRadicados.value = {
        numeroRadicado: detalleTutela.value.idRadicado,
        fechaRadicado: fourthFormatDate(detalleTutela.value.fechaRadicacion),
        juzgado: detalleTutela.value.juzgado,
        codigoProceso: detalleTutela.value.codigoProceso,
        nodeId: detalleTutela.value.nodeId,
        listadoRadicados: arrayForRadicados.filter((item) => item.informacionProceso)
    }
    var listadoRadicados = arrayForRadicados.filter((item) => item.informacionProceso)

    for (const element of listadoRadicados) {
        if (element.etapaProcesal.id == 2 || element.etapaProcesal.id == 3) {
            if (element.estadoEtapaProcesal.id == 24) {
                validCreacionEtapasProcesales.value = true
                break
            } else {
                validCreacionEtapasProcesales.value = false
            }
        } else {
            validCreacionEtapasProcesales.value = false
        }
    }

    validRadicadosAsignados.value = detalleTutela.value.informacionProceso ? true : false
    validRespuestaEscalamiento.value = detalleTutela.value.escalamientoTutelas ? true : false
}

const getDoc = async (id) => {
    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
        `/radicados/consultar_documento/${id}`
    );

    if (id) {
        nameDocument.value = data.name
    }

    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    return URL.createObjectURL(blob);
}

const download = async (id, path = '') => {
    try {


        const blobUrl = await getDoc(id);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = nameDocument.value;

        link.click();

        URL.revokeObjectURL(blobUrl);

        if (path != '') {
            router.push(path);
        }
    } catch (error) {
        toast.error('Ha ocurrido un error al descargar el documento.');
    }
};

const emitSaveDoc = () => {
    docSalidaComp.value.pruebaPdf()
}

const handleSteps = (item: string, id) => {
    stepName.value = item;
    idEtapaProcesal.value = id;
}

const cancelarGestion = () => {
    gestionEtapa.value = false
}

const validarAll = () => {
    validModal.value = true
    // allValidation.value = true
};

const changeView = (data) => {
    gestionEtapa.value = data
    getEtapasProcesales()
}

const addProcess = (val) => {
    validFormGestion.value = false
    gestionEtapa.value = true
}

const SaveNewDoc = () => {
    docSalidaComp.value.finalDocument()
};

const verifyValidation = async () => {
    let url = "";
    if (process.env.API) {
        url = process.env.API;
    }

    const { data } = await sgdeaAxios.get(
        `${url}/tutela/validarCodProcesoTutela/${detalleTutela.value.idTutela}/${detalleTutela.value.codigoProceso}`
    );
    if (data) {
        allValidation.value = true
        activeValidButton.value = false
    }
}

const aprobarDoc = async () => {
  aprobadoDocSal.value = true;
  aprobarConfirm.value = false
}

const validEscalamiento = () => {
    detalleTutela.value.usuarioEscalados.forEach(element => {
        if (userInfo.value.userid == element.usuarioId) {
            isUserEscalado.value = true
            if (element.estado == 'Gestión escalamiento') {
                respuestaEcsActiva.value = true
            }
        }
    });
}

const validCierreGestion = () => {
    if (expedienteIncluido.value) {
        if (detalleTutela.value.estadoEtapaProcesal?.nombre && detalleTutela.value.estadoEtapaProcesal?.nombre != 'N/A') {
            cerrarGestionModal.value = true
        } else {
            toast.error("La etapa procesal debe tener incluido un estado para poder Cerrar el trámite")
        }
    } else {
        toast.error("Debe incluir el radicado en un expediente para poder cerrar gestión")
    }
}

const cerrarGestion = async () => {
    try {
        const cierreGestion = await sgdeaAxios.post(`/tutela/cierreGestion/${detalleTutela.value.idTutela}`)
        if (cierreGestion.status == 200) {
            await crearTrazabilidad({
                proceso: `TUT${detalleTutela.value.idTutela}`,
                secuencia: detalleTutela.value.idRadicado,
                estado: "Cerrado",
                nombre: auth.$state.userInfo.name,
                comentario: 'Se ha cerrado la gestión',
                descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
                    `Descripción: Ha cerrado la gestión de la Tutela ${detalleTutela.value.idRadicado}`,
                accion: `${auth.$state.userInfo.name} ha cerrado la gestión de ${detalleTutela.value.idRadicado}`,
                tramite: "Tutela"
            })
            toast.success(`Cierre de gestión exitoso para el radicado ${detalleTutela.value.idRadicado}`)
            router.push('/bandeja');
        }
    } catch (error) {
        toast.error("Error al cerrar gestión intente de nuevo")
    }

}

const findRoles = (role) => {
    var nomenclatura = [
        'Administrador Master', //0
        'Asignador Responsable', //1
        'aprobador_sgdea', //2
        'Gestionador', //3
        'Radicador - Web', //4
        'Aprobador', //5
        'Asignador Líder', //6
        'Gestionador Escalador', //7
        'Administrador de Trámite' //8
    ]

    var valid = false
    if (userInfo.value) {
        role.forEach(element => {
            if (userInfo.value?.role == nomenclatura[element]) {

                valid = true
            }
        });
    }

    return valid
}


watch(tab, async (val) => {
    docActive.value = false
    escActive.value = false
    if (val === "trazabilidad") {

        const { data } = await sgdeaAxios.get(`/tutela/info/${showRoute.value}`);
        const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'TUT' + data.idTutela);

        if (!response?.data || response.data.length === 0) {
            trazabilidadData.value = [];
            return;
        }

        trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
            ...item,
            detalle: item.detalle,
        }));
    }
    if (val === 'docSalida') {
        docActive.value = true
        if (detalleTutela.value.estado == "Devolucion") {
            isDevolucion.value = true
        }
    }
    if (val === 'solicitudEscalamiento') {
        escActive.value = true
    }
})

const handleUpdate = () => {
    incrementaKey.value++
}

const cerrarEscalamientos = async () => {
    if (selectedEscalamientos.value.some((item) => item.estado !== 'Rechazo aprobado' && item.estado !== 'Rechazo no aprobado')) {
        toast.error('Debe gestionar todas las solicitudes de rechazo para dar continuidad al cierre del escalamiento')
        return
    }

    selectedEscalamientos.value.forEach(async (item) => {
        await sgdeaAxios.patch(`/tutela/cerrarEscalamientoTutelaUsuarioEscalado?tutelaUsuarioEscaladoId=${item.id}`)
    })

    await crearTrazabilidad({
        proceso: `TUT${detalleTutela.value.idTutela}`,
        secuencia: detalleTutela.value.idRadicado,
        estado: detalleTutela.value.estado,
        descripcion: "Se han cerrado los escalamientos para los usuarios " + selectedEscalamientos.value.map((item) => item.usuario).join(' ,'),
        comentario: 'Cierre de escalamiento',
        accion: `${auth.$state.userInfo.name} ha cerrado los escalamientos de ${detalleTutela.value.idRadicado}`,
        tramite: 'Tutela',
        nombre: auth.$state.userInfo.name
    })

    toast.success('Escalamientos cerrados exitosamente')
    await gestionEscalamientoComp.value.getData()
}

const rechazarDoc = async () => {
    const rechazarDoc = await sgdeaAxios.post(`/tutela/${detalleTutela.value.idTutela}/rechazar`, {
        usuario: userInfo.value.username ? userInfo.value.username : 'indefinido',
        observacion: observacionesRechazarDoc.value
    });
    if (rechazarDoc.status == 200) {
        const id = route.params.id
        const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
        await crearTrazabilidad({
            proceso: `TUT${data.idTutela}`,
            secuencia: data.idRadicado,
            estado: data.estado,
            descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
                `Motivo: ${observacionesRechazarDoc.value}`,
            accion: `${auth.$state.userInfo.name} ha rechazado el documento de salida de ${data.idRadicado}`,
            comentario: 'Rechazo de documento de salida',
            tramite: 'Tutela',
            nombre: auth.$state.userInfo.name
        })
        toast.success('Documento de salida rechazado con éxito')
        rechazarDocModal.value = false
        confirmRechazarDoc.value = false
        router.push('/bandeja');
    }

}

const validCloseButtonGest = () => {
    var etapasInvalidas = [2, 5, 6]
    var estadosInvalidos = [2, 13, 14, 15, 16, 17, 19, 22]
    if (detalleTutela.value.estado != 'Para gestión' || detalleTutela.value.etapaProcesal?.id == 1 || detalleTutela.value.tutelEscalada) {
        return false
    }
    else if (etapasInvalidas.includes(detalleTutela.value.etapaProcesal?.id) && estadosInvalidos.includes(detalleTutela.value.estadoEtapaProcesal?.id)) {
        return false
    } else {
        return true
    }
}

const rechazarDocSalida = async () => {
    if (await rechazarDocForm.value.validate()) {
        confirmRechazarDoc.value = true
    } else {
        toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
    }
}

const rechazarEsc = async () => {
    if (await rechazarEscalamientoForm.value.validate()) {
        const rechazarEscalamiento = await sgdeaAxios.post(`/tutela/${detalleTutela.value.idTutela}/tarea/escalamiento/rechazar`, {
            usuario: userInfo.value.username ? userInfo.value.username : 'indefinido',
            motivo: observacionesRechazarEsc.value
        });
        if (rechazarEscalamiento.status == 200) {
            const id = route.params.id
            const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
            await crearTrazabilidad({
                proceso: `TUT${data.idTutela}`,
                secuencia: data.idRadicado,
                estado: data.estado,
                descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
                    `Motivo: ${observacionesRechazarEsc.value}`,
                comentario: 'Rechazo de escalamiento',
                accion: `${auth.$state.userInfo.name} ha rechazado el escalamiento de ${data.idRadicado}`,
                tramite: 'Tutela',
                nombre: auth.$state.userInfo.name
            })
            toast.success('El escalamiento se ha rechazado con éxito')
            rechazarEscModal.value = false
            router.push('/bandeja');
        }
    } else {
        toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos.')
    }
}

const aprobarEscalamiento = async () => {
    const rechazarEscalamiento = await sgdeaAxios.post(`/tutela/${detalleTutela.value.idTutela}/tarea/escalamiento/gestionar`, {
        usuario: userInfo.value.username ? userInfo.value.username : 'indefinido',
        motivo: "No requerido"
    });
    if (rechazarEscalamiento.status == 200) {
        const id = route.params.id
        const { data } = await sgdeaAxios.get(`/tutela/info/${id}`)
        await crearTrazabilidad({
            proceso: `TUT${data.idTutela}`,
            secuencia: data.idRadicado,
            estado: data.estado,
            accion: `${auth.$state.userInfo.name} ha aprobado el escalamiento de ${data.idRadicado}`,
            descripcion: `Usuario: ${auth.$state.userInfo.name} \n` +
                `Descripción: El escalamiento ha sido aprobado`,
            comentario: "Escalamiento aprobado",
            tramite: 'Tutela',
            nombre: auth.$state.userInfo.name
        })
        toast.success('El escalamiento se ha aceptado para gestión con éxito')
        aprobEscalamiento.value = false
        getTutelasInfo()
        validEscalamiento()
        validRespuestaEscalamiento.value = true
        respuestaEcsActiva.value = true
    } else {
        toast.error('Ha ocurrido un error')
    }

}

const cancelarAprobacion = () => {
    //   location.reload()

    router.push('/bandeja');
}

const handleSuccess = async () => {
    detalleTutela.value = (await sgdeaAxios.get(`/tutela/info/${route.params.id}`, {})).data;
    validIfExpediente()
}

const handleDetalleDocumento = (detalle: DocumentoRadicado) => {
  documentParaFirmar.value= detalle.base64x;
  habilitarBotones.value = true
}

</script>

<style>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24
}

#documentSalid {
    height: 1700px !important;
}

.textFile {
    width: 136px;
    /* Ancho del contenedor */
    overflow: hidden;
    /* Ocultar texto excedente */
    text-overflow: ellipsis;
    font-size: 0.75em
}
</style>
