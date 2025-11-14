<template>
  <div class="[&>*]:tw-mb-4">
    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
      <q-expansion-item label="Información General del caso" header-class="tw-text-lg tw-font-bold tw-pt-0 tw-pl-0"
        default-opened class="tw-bg-white tw-px-4 tw-py-5">
        <template v-slot:header>
          <div class="row justify-between tw-w-full">
            <b class="tw-text-lg">Información General del Caso</b>
          </div>
        </template>
        <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Número de radicado
            </p>
            <p>{{ $props.data?.idRadicado }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">
              Canal de radicación
            </p>
            <p>{{ $props.data?.remitente.canalRadicacion.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tipo de solicitud</p>
            <p>{{ $props.data?.solicitud?.tipoSolicitud?.nombre }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Fecha de vencimiento</p>
            <p>{{ props.data?.asignacion?.fechaVencimiento ?
              moment(props.data?.asignacion?.fechaVencimiento).format("DD-MM-YYYY HH:mm") : '' }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat v-if="auth.userInfo.role !== 'Asignador Responsable'">
      <q-expansion-item label="Metadatos de la asignación" header-class="tw-text-lg tw-font-bold  tw-pl-0"
        default-opened class="tw-bg-white tw-px-4 tw-py-5">
        <div class="tw-grid tw-grid-cols-6 tw-gap-4 tw-pl-3">
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Proceso Medicina Laboral</p>
            <p>{{ $props.metadatosInfo?.process.proceso }}</p>
          </div>
          <div class="tw-col-span-2 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Subproceso</p>
            <p>{{ $props.metadatosInfo?.subProceso.subProceso }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Formato de tiempo</p>
            <p>{{ $props.metadatosInfo?.formatoFecha }}</p>
          </div>
          <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
            <p class="tw-text-label tw-font-semibold tw-pb-1">Tiempo</p>
            <p>{{ $props.metadatosInfo?.tiempo }}</p>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-rounded-xl" flat>
      <q-expansion-item label="Remitente" header-class="tw-text-lg tw-font-bold tw-pl-0 tw-pt-0" default-opened
        class="tw-bg-white tw-px-4 tw-py-5">
        <div class="row q-px-md q-col-gutter-x-md q-col-gutter-y-sm">
          <div class="col-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de remitente</span>
              <span v-if="!disabledTipoRemitente" class="tw-text-label">*</span>
              <q-select ref="tipoRemitente" :options="listadoTipoRemitente" v-model="form0.tipoRemitente" map-options
                label="Seleccione" dense outlined class="tw-rounded-lg"
                :rules="!disabledTipoRemitente ? [inputRequired] : []">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de documento del remitente *</span>
              <q-select :options="tipoDoc" v-model="form0.tipoDocumentoRemitente" map-options label="Seleccione" dense
                outlined class="tw-rounded-lg" :rules="[inputRequired]" @blur="getPerson">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de documento del remitente </span>
              <span v-if="!disabledNumeroDoc" class="tw-text-label">*</span>
              <q-input v-model="form0.numeroDocumentoRemitente" :disable="disabledNumeroDoc ? true : false" dense
                label="Inserte" outlined class="tw-rounded-lg"
                :rules="!disabledNumeroDoc ? [inputRequired, v => maxLengthInput(15, v), Number(form0.tipoDocumentoRemitente?.value) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)] : []"
                @keypress="Number(form0.tipoDocumentoRemitente?.value) == 11 ? onlyAlphaNumeric : onlyNumbers"
                @change="getPerson">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Nombres del remitente *</span>
              <q-input v-model="form0.nombreRemitente" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]"
                @keypress="alphabeticalWithSpecialCharacters">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">País</span>
              <span class="tw-text-label" v-if="Number(form0.medioAutorizadorParaRespuesta?.value) === 2"> *</span>
              <q-select map-options :options="filteredPais" v-model="form0.pais" input-debounce="0" label="Seleccione"
                dense outlined class="tw-rounded-lg" @filter="filterPaisRemitente" use-input hide-selected fill-input
                :rules="[inputRequired]">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Departamento</span>
              <span class="tw-text-label" v-if="Number(form0.medioAutorizadorParaRespuesta?.value) === 2"> *</span>
              <q-select ref="selectDep" :options="filteredDep" v-model="form0.departamento" input-debounce="0"
                label="Seleccione" dense outlined class="tw-rounded-lg" map-options use-input hide-selected fill-input
                @filter="filterDepRemitente"
                :rules="Number(form0.medioAutorizadorParaRespuesta?.value) === 2 ? [inputRequired] : []"
                :disable="isntColombia">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Municipio</span>
              <span class="tw-text-label" v-if="Number(form0.medioAutorizadorParaRespuesta?.value) === 2"> *</span>
              <q-select ref="selectMun" :options="filteredMun" v-model="form0.municipio" input-debounce="0"
                label="Seleccione" dense outlined class="tw-rounded-lg" map-options use-input hide-selected fill-input
                @filter="filterMunRemitente"
                :rules="Number(form0.medioAutorizadorParaRespuesta?.value) === 2 ? [inputRequired] : []"
                :disable="isntColombia">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Dirección del remitente</span>
              <span class="tw-text-label"
                v-if="!form0.correoRemitente || Number(form0.medioAutorizadorParaRespuesta?.value) === 2"> *</span>
              <q-input ref="direccionRef" v-model="form0.direccionRemitente" dense label="Inserte" outlined
                class="tw-rounded-lg"
                :rules="!form0.correoRemitente || Number(form0.medioAutorizadorParaRespuesta?.value) === 2 ? [inputRequired, v => maxLengthInput(200, v)] : [v => maxLengthInput(200, v)]">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Teléfono</span>
              <q-input v-model="form0.telefono"
                :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]" dense label="Inserte"
                outlined class="tw-rounded-lg">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Correo electrónico del remitente *</span>
              <q-input v-model="form0.correoRemitente"
                :rules="[validationEmail, v => maxLengthInput(200, v), inputRequired]" dense label="Inserte" outlined
                class="tw-rounded-lg">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Medio que autoriza para envio de respuesta</span>
              <span v-if="Number(form0.canal) !== 2" class="tw-text-label"> *</span>
              <q-select ref="medioSelect" v-model="form0.medioAutorizadorParaRespuesta" input-debounce="0"
                label="Seleccione" dense map-options outlined :options="listadoMediosRespuestaOptions"
                class="tw-rounded-lg" :rules="Number(form0.canal) !== 2 ? [inputRequired] : []">
              </q-select>
            </label>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
      <q-expansion-item label="Afectado" header-class="tw-text-lg tw-font-bold tw-pt-0 tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-pt-5">
        <div class="row q-px-md q-col-gutter-x-md q-col-gutter-y-sm">
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de documento del afectado *</span>
              <q-select v-model="form1.tipoDocumentoAfectado" label="Seleccione" map-options emit-value dense outlined
                class="tw-rounded-lg" :options="tipoDoc" :rules="[inputRequired]" @blur="getPersonAfectado">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de documento del afectado *</span>
              <q-input v-model="form1.numeroDocumentoAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(15, v), Number(form1.tipoDocumentoAfectado?.value) == 11 ? onlyAlphaNumeric : (v: string) => onlyNumbers(v)]"
                @keypress="Number(form1.tipoDocumentoAfectado?.value) == 11 ? onlyAlphaNumeric : onlyNumbers"
                @change="getPersonAfectado">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Nombre del afectado *</span>
              <q-input v-model="form1.nombreAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]"
                @keypress="alphabeticalWithSpecialCharacters">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">País *</span>
              <q-select v-model="form1.paisAfectado" use-input hide-selected fill-input :options="filteredPais"
                label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]"
                @filter="filterPaisAfectado">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Departamento *</span>
              <q-select :options="filteredDep" use-input hide-selected fill-input v-model="form1.departamentoAfectado"
                input-debounce="0" label="Seleccione" dense outlined class="tw-rounded-lg" map-options
                :rules="[inputRequired]" @filter="filterDepAfectado" :disable="isntColombia">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
            <label class="tw-w-full">
              <span class="tw-text-label">Municipio *</span>
              <q-select v-model="form1.municipioAfectado" map-options use-input hide-selected fill-input
                :disable="isntColombia" label="Seleccione" dense outlined class="tw-rounded-lg" :options="filteredMun"
                :rules="[inputRequired]" @filter="filterMunAfectado">
              </q-select>
            </label>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Dirección del Afectado *</span>
              <q-input v-model="form1.direccionAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(200, v)]">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Teléfono</span>
              <q-input v-model="form1.telefonoAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]">
              </q-input>
            </label>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Correo electrónico del Afectado *</span>
              <q-input v-model="form1.correoAfectado" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[validationEmail, inputRequired, v => maxLengthInput(200, v)]">
              </q-input>
            </label>
          </div>
        </div>
      </q-expansion-item>
    </q-card>

    <q-card class="tw-px-4 tw-py-2 tw-pb-5 tw-rounded-xl" flat>
      <q-expansion-item label="Solicitud" header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0" default-opened
        class="tw-bg-white tw-px-4 tw-pt-5">
        <div class="row q-px-md q-col-gutter-x-md q-col-gutter-y-md">
          <div class="flex tw-items-center col-xs-12 col-sm-12 col-md-12 col-lg-12 tw-text-label">
            <q-checkbox v-model="checkDatosRemitente" />
            <p class="tw-mt-1">¿La presente solicitud se relaciona con una comunicación o solicitud que realizó Positiva
              previamente?</p>
          </div>
          <div v-if="checkDatosRemitente" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de radicado relacionado *</span>
              <q-select :options="filteredRadicados" v-model="form2.numeroRadicadoRelacionado" dense label="Inserte"
                outlined class="tw-rounded-lg" :rules="[inputRequired, v => maxLengthInput(100, v)]" use-input
                map-options fill-input hide-selected @filter="filterRadicados">
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section>
                      El radicado no existe
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </label>
          </div>

          <div :class="checkDatosRemitente ? 'col-xs-6 col-6' : 'col-xs-12 col-6'">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de Trámite *</span>
              <q-select v-model="form2.tipoTramite" label="Seleccione" dense outlined class="tw-rounded-lg" map-options
                emit-value :rules="[inputRequired]" disable>
              </q-select>
            </label>
          </div>

          <div class="flex tw-items-center col-xs-12 col-sm-12 col-md-12 col-lg-12 tw-text-label tw-mt-[-20px]">
            <q-checkbox v-model="form2.autorizacionDatos" />
            <p>Tratamiento de datos personales</p>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de evento *</span> <br>
              <q-radio v-model="form2.tipoEvento" val="1" label="Accidente" :disable="disabledInputs" />
              <q-radio v-model="form2.tipoEvento" val="2" label="Enfermedad" :disable="disabledInputs" />
            </label>
            <br>
            <span v-if="!form2.tipoEvento" class="tw-text-[#c10015] tw-text-xs tw-pl-3">Este campo es requerido</span>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Número de siniestro </span>
              <q-input v-model="form2.numeroSiniestro" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[v => maxLengthInput(12, v), onlyNumbers]">
              </q-input>
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Tipo de solicitud *</span>
              <q-select :options="listadoTiposSolicitud" v-model="form2.tipoSolicitud" map-options label="Seleccione"
                dense outlined class="tw-rounded-lg" :rules="[inputRequired]" :disable="disabledInputs">
              </q-select>
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Constancia de ejecutoriedad *</span>
              <q-select v-model="form2.constancia" label="Seleccione" dense outlined class="tw-rounded-lg" map-options
                emit-value :options="optionsContancia" :rules="[inputRequired]"
                :disable="Number(form0.canal) !== 1 || Number(form2.tipoSolicitud.value) !== 5 || disabledInputs">
              </q-select>
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Fecha de dictamen de la Junta Regional de Calificación *</span>
              <Datepicker mask="DD/MM/YYYY" label="dd / mm / aaaa"
                :disable="Number(form0.canal) !== 1 || Number(form2.tipoSolicitud.value) !== 5 || disabledInputs || !form2.constancia"
                v-model:input-data-prop="form2.fechaDictamenJuntaRegional" :rules="[inputRequired, validationDate]" />
            </label>
          </div>

          <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <label class="tw-w-full">
              <span class="tw-text-label">Oficina *</span>
              <q-select ref="refOfi" :options="listadoOficinas" v-model="form2.oficina" label="Seleccione" dense
                outlined map-options class="tw-rounded-lg" :rules="[inputRequired]"
                :disable="disabledInputs || Number(form0.canal) !== 1 || disabledOfi">
              </q-select>
            </label>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <label class="tw-w-full">
              <span class="tw-text-label">Descripción *
              </span>
              <q-input v-model="form2.descripcion" type="textarea" dense label="Inserte" outlined class="tw-rounded-lg"
                :rules="[inputRequired, v => maxLengthInput(10000, v)]" :disable="disabledInputs">
              </q-input>
            </label>
          </div>
        </div>

        <div class="flex column flex-column-fixed q-mt-md tw-pl-3">
          <p class="tw-text-label tw-font-semibold">Documentos de soporte</p>
          <div class="flex q-mt-xs row q-gutter-sm">
            <q-card class="flex row items-center tw-gap-x-2 q-px-md" flat bordered :key="doc.id"
              v-for="doc in allTypesDocs?.filter((it) => it.nombre === data?.idRadicado + '.pdf')">
              <img v-if="extensiones.includes(obtenerExtension(doc.nombre).toLowerCase())" style="width: 26px"
                v-lazy :data-url="tipoIcon(obtenerExtension(doc.nombre))" alt="Icono de documento">
              <q-icon v-else name="description" size="xs" />
              <p class="tw-text-xs tw-font-semibold">{{ doc.nombre }}</p>
              <div class="tw-flex tw-gap-1">
                <q-icon size="16px" class="tw-cursor-pointer" name="download"
                  @click="() => handleOpenDocFile(doc.id, doc.nombre)" />
                <q-icon size="16px" class="tw-cursor-pointer" name="info"
                  v-if="obtenerExtension(doc.nombre).toLowerCase() == 'pdf'"
                  @click="() => visualize(doc.id, allTypesDocs?.filter((it) => obtenerExtension(it.nombre).toLowerCase() === 'pdf'), true)" />
              </div>
            </q-card>
          </div>
        </div>

        <div class="flex column flex-column-fixed q-mt-md tw-pl-3" v-if="docs?.adjunto?.length">
          <p class="tw-text-label tw-font-semibold">Documentos adjuntos</p>
          <template
            v-for="doc in allTypesDocs?.filter((it) => it.nombre !== data?.idRadicado + '.pdf' && it.tipo === 'De entrada')"
            :key="doc.id">
            <q-card class="flex row tw-items-center q-px-md tw-mt-4 tw-w-1/3" flat bordered>
              <img v-if="extensiones.includes(obtenerExtension(doc.nombre).toLowerCase())" style="width: 26px"
                v-lazy :data-url="tipoIcon(obtenerExtension(doc.nombre))" alt="Icono de documento">
              <q-icon v-else name="description" size="xs" />
              <p class="tw-text-xs tw-font-semibold overflow-hidden tw-ml-2 col">{{ doc.nombre }}</p>
              <div class="tw-flex tw-gap-1">
                <q-icon size="16px" class="tw-cursor-pointer" name="download"
                  @click="() => handleOpenDocFile(doc.id, doc.nombre)" />
                <q-icon size="16px" class="tw-cursor-pointer" name="info"
                  v-if="obtenerExtension(doc.nombre).toLowerCase() == 'pdf'"
                  @click="() => visualize(doc.id, allTypesDocs?.filter((it) => obtenerExtension(it.nombre).toLowerCase() === 'pdf'), true)" />
              </div>
            </q-card>
          </template>
        </div>
      </q-expansion-item>
    </q-card>

    <div class="row justify-center tw-gap-5">
      <q-btn class="tw-w-[11rem] tw-h-11" color="accent" textColor="secondary" label="Cancelar"
        @click="cancelModal = true" />
      <q-btn class="tw-w-[11rem] tw-h-11" color="primary" label="Guardar" @click="submit"
        :loading="handleSubmitIsLoading" />
    </div>
  </div>

  <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Aceptar" cancel-button
    text="¿Estás seguro de cancelar el proceso?" @close-modal="cancelModal = false" @handleAccept="emit('cancelEdit')"
    type="button" />

</template>

<script lang="ts" setup>
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
// @ts-ignore
import img from "src/assets/img.svg";
// @ts-ignore
import music from "src/assets/music.svg";
// @ts-ignore
import video from "src/assets/video.svg";
// @ts-ignore
import txt from "src/assets/txt.svg";
import zip from "assets/folder2.svg";
import msg from "assets/mail.svg";
import ppt from "assets/powerPoint.svg";
import xml from "assets/xml.svg";
import interrogation from "assets/interrogation.svg";
import { onMounted, ref, watch } from "vue";
import moment from "moment";
import Modal from "src/components/Modal/Modal.vue";
import { Medicina, Metadatos } from "src/interfaces";
import { adminAxios, sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import { sortOptions } from "src/helpers/sortOptions";
import {
  inputRequired,
  maxLengthInput,
  onlyAlphaNumeric,
  onlyNumbers,
  alphanumeric,
  alphabeticalWithSpecialCharacters,
  minLengthInput,
  validationEmail
} from "src/helpers/validations";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import { toast } from "src/helpers/toast";
import { useLoadingStore } from "src/stores/loading.store";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";

interface InfoGeneralProps {
  data: Medicina;
  docs: any;
  allTypesDocs: any
  metadatosInfo: Metadatos
  visualize: (nodeId, list, action) => {}
}

const props = defineProps<InfoGeneralProps>();
const auth = useAuthStore()
const cancelModal = ref(false)
const handleSubmitIsLoading = ref<boolean>(false)

const listadoCanalRadicacion = ref()
const listadoTipoRemitente = ref()
const listadoTiposSolicitud = ref()
const listadoOficinas = ref()
const tipoDoc = ref()
const listadoMediosRespuestaOptions = ref()
const listadoRadicados = ref()
const originalListadoRadicados = ref()

const emit = defineEmits(['cancelEdit', 'saveData'])
const myForm0 = ref(null)
const disabledNumeroDoc = ref(false)
const disabledTipoRemitente = ref(false)
const paiseOptions = ref();
const departamentoOptions = ref();
const municipioOptions = ref();
const isntColombia = ref(false)
const tipoRemitente = ref(null)
const direccionRef = ref()
const medioSelect = ref()
const selectDep = ref()
const selectMun = ref()
const filteredPais = ref()
const filteredDep = ref()
const filteredMun = ref()
const departamentoAfectadoOptions = ref();
const municipioAfectadoOptions = ref();

const checkDatosRemitente = ref(false)
const filteredRadicados = ref()
const disabledInputs = ref(false)
const disabledOfi = ref(false)
const dataFormsAll = ref()
let isLoadingData = true;
let isLoadingDataAfectado = true;
const isLoaderCheck = ref(true)

const optionsContancia = ref([
  { label: "Si", value: true },
  { label: "No", value: false },
])

const form0 = ref({
  canal: null,
  tipoRemitente: null,
  tipoDocumentoRemitente: null,
  numeroDocumentoRemitente: '',
  nombreRemitente: '',
  pais: null,
  departamento: null,
  municipio: null,
  direccionRemitente: '',
  telefono: '',
  correoRemitente: '',
  medioAutorizadorParaRespuesta: null,
})

const form1 = ref({
  tipoDocumentoAfectado: null,
  numeroDocumentoAfectado: null,
  nombreAfectado: "",
  direccionAfectado: "",
  telefonoAfectado: null,
  correoAfectado: "",
  paisAfectado: null,
  departamentoAfectado: null,
  municipioAfectado: null,
})

const form2 = ref({
  numeroRadicadoRelacionado: "",
  tipoTramite: "",
  tipoEvento: "",
  numeroSiniestro: "",
  constancia: false,
  fechaDictamenJuntaRegional: "",
  tipoSolicitud: null,
  oficina: null,
  descripcion: "",
  autorizacionDatos: null
});

const extensiones = ref([
  'pdf',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'bmp',
  'txt',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'mp3',
  'mp4',
  'avi',
  'csv',
  'zip',
  'rar',
  'ppt',
  'pptx',
  'eml',
  'msg'
])

onMounted(async () => {
  // @ts-expect-error
  await Promise.allSettled([
    loadListadosCanalRadicacion(),
    loadListadosTipoRemitente(),
    loadTipoDoc(),
    loadListadosMediosRepuesta(),
    loadTiposSolicitud(),
    loadRadicados(),
    loadPaises(),
    loadDepartamentos(),
    loadMunicipios()
  ]);
  getData()
})

function getData() {
  const remitente = props.data.remitente
  const afectado = props.data.afectado
  const solicitud = props.data.solicitud

  form0.value = {
    ...remitente,
    tipoRemitente: mapObjects(remitente.tipoRemitente),
    tipoDocumentoRemitente: mapObjects(remitente.tipoDocumento),
    numeroDocumentoRemitente: remitente.numeroDocumento,
    nombreRemitente: remitente.nombre,
    pais: { label: remitente.pais.nombre, value: remitente.pais.idPais },
    departamento: { label: remitente.departamento.nombre, value: remitente.departamento.idDepartamento },
    municipio: { label: remitente.municipio.nombre, value: remitente.municipio.idMunicipio },
    direccionRemitente: remitente.direccion,
    correoRemitente: remitente.email,
    medioAutorizadorParaRespuesta: mapObjects(remitente.medioRespuesta),
    canal: remitente.canalRadicacion
  }

  form1.value = {
    tipoDocumentoAfectado: mapObjects(afectado.tipoDocumento),
    numeroDocumentoAfectado: afectado.numeroDocumento,
    nombreAfectado: afectado.nombre,
    paisAfectado: { label: afectado.pais.nombre, value: afectado.pais.idPais },
    departamentoAfectado: { label: afectado.departamento.nombre, value: afectado.departamento.idDepartamento },
    municipioAfectado: { label: afectado.municipio.nombre, value: afectado.municipio.idMunicipio },
    direccionAfectado: afectado.direccion,
    telefonoAfectado: afectado.telefono,
    correoAfectado: afectado.correoElectronico
  }

  form2.value = {
    tipoTramite: solicitud.tipoTramite,
    tipoEvento: solicitud.tipoEvento.nombre === 'Accidente' ? '1' : '2',
    numeroSiniestro: solicitud.siniestro?.siniestro,
    tipoSolicitud: mapObjects(solicitud.tipoSolicitud),
    constancia: solicitud.constancia,
    fechaDictamenJuntaRegional: solicitud.fechaDictamen,
    oficina: mapObjects(solicitud.oficina),
    descripcion: solicitud.descripcion,
    numeroRadicadoRelacionado: solicitud.radicadoRelacionado,
    autorizacionDatos: solicitud.autorizacionDatos,
  }
  checkDatosRemitente.value = solicitud.radicadoRelacionado ? true : false
}

const mapObjects = (property) => {
  return { label: property.nombre, value: property.id }
}

async function loadListadosCanalRadicacion() {
  try {
    const response = await sgdeaAxios.get("/medicina/canal-radicacion")
    if (response.status == 200 || response.status == 201) {
      listadoCanalRadicacion.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }
    listadoCanalRadicacion.value = listadoCanalRadicacion.value.filter((e) => { return e.value !== 4 })
  } catch (error) {
    console.error(error)
  }
}

async function loadListadosTipoRemitente() {
  try {
    const response = await sgdeaAxios.get("/medicina/tipos-remitente")
    if (response.status == 200 || response.status == 201) {
      listadoTipoRemitente.value = response.data.map((e: any) => {
        return {
          label: e.nombre.includes("Apoderado") ? "Familiar" : e.nombre,
          value: e.id
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

async function loadTipoDoc() {
  const { data } = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");
  tipoDoc.value = data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.id,
    };
  }).filter((item) => item.label !== 'Ninguno')
  tipoDoc.value = sortOptions(tipoDoc.value).sort((a, b) => {
    if (a.value == 1) return -1; // "Cédula Ciudadanía" va primero
    if (b.value == 1) return 1;  // Si b es "Cédula Ciudadanía", va después

    if (a.value == 3) return -1; // "Carné Diplomático" va segundo
    if (b.value == 3) return 1;  // Si b es "Carné Diplomático", va después

    return 0;
  });
}

async function loadListadosMediosRepuesta() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoMediosRespuesta")
    if (response.status == 200 || response.status == 201) {
      listadoMediosRespuestaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

async function loadTiposSolicitud() {
  try {
    const response = await sgdeaAxios.get("/medicina/tipos-solicitud")
    if (response.status == 200 || response.status == 201) {
      listadoTiposSolicitud.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
      listadoTiposSolicitud.value = sortOptions(listadoTiposSolicitud.value)
    }
  } catch (error) {
    console.error(error)
  }
}

async function loadRadicados() {
  try {
    const response = await sgdeaAxios.get("/medicina/radicados", {
      params: { palabra: '', page: 0, size: 5 }
    })
    if (response.status == 200 || response.status == 201) {
      listadoRadicados.value = response.data.content.map((e: any) => {
        return {
          label: e,
          value: e
        }
      })

      originalListadoRadicados.value = listadoRadicados.value
    }
  } catch (error) {
    console.error(error)
  }
}

listadoOficinas.value = [
  { label: '3 GRUPO CENTRO DE EXCELENCIA', value: 7 },
  { label: '4 GRUPO CENTRO DE EXCELENCIA', value: 8 },
  { label: '3 GRUPO JUNTAS DE CALIFICACIÓN', value: 10 },
  { label: '4 GRUPO JUNTAS DE CALIFICACIÓN', value: 11 },
  { label: 'GERENCIA MÉDICA EXCELENCIA', value: 9 },
  { label: 'GERENCIA MEDICA JUNTAS', value: 12 },
  { label: 'Mesa Back Medicina Laboral', value: 13 },
]

const tipoIcon = (tipo) => {
  if (['pdf', 'application/pdf'].includes(tipo.toLowerCase())) return PDFIcon
  if (['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(tipo.toLowerCase())) return excelIcon
  if (['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(tipo.toLowerCase())) return docxIcon
  if (['jpeg', 'jpg', 'png', 'webp'].includes(tipo.toLowerCase())) return img
  if (['mp3'].includes(tipo.toLowerCase())) return music
  if (['avi', 'mp4'].includes(tipo.toLowerCase())) return video
  if (['txt', 'bmp'].includes(tipo.toLowerCase())) return txt
  if (['xml'].includes(tipo.toLowerCase())) return xml
  if (['zip', 'rar'].includes(tipo.toLowerCase())) return zip
  if (['ppt', 'pptx'].includes(tipo.toLowerCase())) return ppt
  if (['msg', 'eml'].includes(tipo.toLowerCase())) return msg
  return interrogation
}

const obtenerExtension = (nombreArchivo) => {
  const punto = nombreArchivo.lastIndexOf('.');
  if (punto === -1) return '';
  return nombreArchivo.slice(punto + 1);
}

const handleOpenDocFile = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get('/radicados/consultar_documento/' + id);

    const byteCharacters = atob(response.data.base64x);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });

    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = name;

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  } catch (error) {
    console.error(error);
  }
};

async function loadPaises() {
  const { data } = await adminAxios.get("/paises/list");
  paiseOptions.value = [
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.idPais,
      };
    }),
  ]
  paiseOptions.value = sortOptions(paiseOptions.value)
}

async function loadDepartamentos() {
  const { data: formData } = await adminAxios.get("/departamentos/list");
  departamentoOptions.value = formData.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
      divipola: val.codigoDivipola
    };
  });
  departamentoAfectadoOptions.value = departamentoOptions.value
}

async function loadMunicipios() {
  const { data: formData } = await adminAxios.get("/municipios/list");
  municipioOptions.value = formData.sort((a: { nombre: string; }, b: { nombre: string; }) => {
    const labelA = a.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    const labelB = b.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
    return labelA.localeCompare(labelB, 'es-ES', { sensitivity: 'base' });
  }).map((val) => {
    return {
      label: val.nombre,
      value: val.id,
      divipola: val.codigoDivipola
    };
  })
  municipioAfectadoOptions.value = municipioOptions.value
}

async function getPerson() {
  await myForm0.value.reset()
  const tipoDoc = getAcronimobyId(Number(form0.value.tipoDocumentoRemitente?.value))
  const number = Number(form0.value.numeroDocumentoRemitente) ? Number(form0.value.numeroDocumentoRemitente) : ''

  try {
    const response = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number
      }
    })

    if (response.status === 200) {
      const nameObject = {
        nombre1: response.data.nombre1,
        nombre2: response.data.nombre2,
        apellido1: response.data.apellido1,
        apellido2: response.data.apellido2,
      }

      const fullName = Object.values(nameObject).join(' ')

      form0.value.nombreRemitente = fullName
      form0.value.direccionRemitente = response.data.direccion
      form0.value.telefono = response.data.telefono
      form0.value.correoRemitente = response.data.email
      form0.value.pais = { label: response.data?.pais?.nombre, value: response.data?.pais?.idPais }
      form0.value.departamento = { label: response.data?.departamento?.nombre, value: response.data?.departamento?.idDepartamento }
      form0.value.municipio = { label: response.data?.municipio?.nombre, value: response.data?.municipio?.idMunicipio }
    } else {
      await resetInfoRemitente()
      if (Number(form0.value.tipoRemitente) === 1 && form0.value.tipoDocumentoRemitente?.value !== '' && number !== '') {
        toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
      }
    }
  } catch (error) {
    await resetInfoRemitente()
  }
}

async function getPersonAfectado() {
  await myForm0.value.reset()
  const tipoDoc = getAcronimobyId(Number(form1.value.tipoDocumentoAfectado?.value))
  const number = Number(form1.value.numeroDocumentoAfectado) ? Number(form1.value.numeroDocumentoAfectado) : ''

  try {
    const response = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number
      }
    })

    if (response.status === 200) {
      const nameObject = {
        nombre1: response.data.nombre1,
        nombre2: response.data.nombre2,
        apellido1: response.data.apellido1,
        apellido2: response.data.apellido2,
      }

      const fullName = Object.values(nameObject).join(' ')

      form1.value.nombreAfectado = fullName
      form1.value.direccionAfectado = response.data.direccion
      form1.value.telefonoAfectado = response.data.telefono
      form1.value.correoAfectado = response.data.email
      form1.value.paisAfectado = { label: response.data?.pais?.nombre, value: response.data?.pais?.idPais }
      form1.value.departamentoAfectado = { label: response.data?.departamento?.nombre, value: response.data?.departamento?.idDepartamento }
      form1.value.municipioAfectado = { label: response.data?.municipio?.nombre, value: response.data?.municipio?.idMunicipio }
    } else {
      await resetInfoAfectado()
      if (Number(form0.value.tipoRemitente) === 1 && form0.value.tipoDocumentoRemitente?.value !== '' && number !== '') {
        toast.error('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
      }
    }
  } catch (error) {
    await resetInfoAfectado()
  }
}

const resetInfoRemitente = async () => {
  form0.value.nombreRemitente = ''
  form0.value.direccionRemitente = ''
  form0.value.telefono = ''
  form0.value.correoRemitente = ''
  form0.value.pais = { label: 'Colombia', value: 425 }
  form0.value.departamento = ''
  form0.value.municipio = ''
  await myForm0.value.reset()
}

const resetInfoAfectado = async () => {
  form1.value.nombreAfectado = ''
  form1.value.direccionAfectado = ''
  form1.value.telefonoAfectado = ''
  form1.value.correoAfectado = ''
  form1.value.paisAfectado = { label: 'Colombia', value: 425 }
  form1.value.departamentoAfectado = ''
  form1.value.municipioAfectado = ''
  await myForm0.value.reset()
}

const filterPaisRemitente = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredPais.value = paiseOptions.value
    })
    return
  }
  update(() => {
    filteredPais.value = paiseOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterDepRemitente = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredDep.value = departamentoOptions.value
    })
    return
  }
  update(() => {
    filteredDep.value = departamentoOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterMunRemitente = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredMun.value = municipioOptions.value
    })
    return
  }
  update(() => {
    filteredMun.value = municipioOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterPaisAfectado = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredPais.value = paiseOptions.value
    })
    return
  }
  update(() => {
    filteredPais.value = paiseOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterDepAfectado = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredDep.value = departamentoAfectadoOptions.value
    })
    return
  }
  update(() => {
    filteredDep.value = departamentoAfectadoOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterMunAfectado = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredMun.value = municipioAfectadoOptions.value
    })
    return
  }
  update(() => {
    filteredMun.value = municipioAfectadoOptions.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterRadicados = async (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredRadicados.value = originalListadoRadicados.value
    })
    return
  }

  const response = await sgdeaAxios.get("/medicina/radicados", {
    params: { palabra: val, page: 0, size: 5 }
  })

  listadoRadicados.value = response.data.content.map((e: any) => {
    return {
      label: e,
      value: e
    }
  })

  update(() => {
    filteredRadicados.value = listadoRadicados.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const validationDate = (val) => {
  if (moment().format('DD/MM/YYYY') < val) {
    return "No se aceptan fechas superiores a la fecha actual";
  }
  return true;
};

const submit = async () => {
  dataFormsAll.value = { ...form0.value, ...form1.value, ...form2.value }

  const forms = {
    solicitud: {
      tipoTramite: props.data.solicitud.tipoTramite,
      tipoEvento: dataFormsAll.value.tipoEvento,
      tipoSolicitud: dataFormsAll.value.tipoSolicitud.value,
      fechaDictamen: dataFormsAll.value.fechaDictamenJuntaRegional || null,
      oficina: dataFormsAll.value.oficina.value,
      descripcion: dataFormsAll.value.descripcion,
      radicadoRelacionado: dataFormsAll.value.numeroRadicadoRelacionado?.value ?? dataFormsAll.value.numeroRadicadoRelacionado,
      constancia: dataFormsAll.value.constancia || false,
      autorizacionDatos: dataFormsAll.value.autorizacionDatos || false,
      siniestro: dataFormsAll.value.numeroSiniestro
    },
    remitente: {
      tipoRemitente: dataFormsAll.value.tipoRemitente.value,
      tipoDocumento: dataFormsAll.value.tipoDocumentoRemitente?.value,
      canalRadicacion: props.data.remitente.canalRadicacion.id,
      numeroDocumento: dataFormsAll.value.numeroDocumentoRemitente,
      nombre: dataFormsAll.value.nombreRemitente,
      pais: dataFormsAll.value.pais.value,
      departamento: dataFormsAll.value.departamento.value ?? 1,
      municipio: dataFormsAll.value.municipio.value ?? 1,
      direccion: dataFormsAll.value.direccionRemitente,
      telefono: dataFormsAll.value.telefono,
      email: dataFormsAll.value.correoRemitente,
      medioRespuesta: dataFormsAll.value.medioAutorizadorParaRespuesta?.value,
    },
    afectado: {
      tipoDocumento: dataFormsAll.value.tipoDocumentoAfectado?.value,
      numeroDocumento: dataFormsAll.value.numeroDocumentoAfectado,
      nombre: dataFormsAll.value.nombreAfectado,
      correoElectronico: dataFormsAll.value.correoAfectado,
      telefono: dataFormsAll.value.telefonoAfectado,
      pais: dataFormsAll.value.paisAfectado.value,
      departamento: dataFormsAll.value.departamentoAfectado.value,
      municipio: dataFormsAll.value.municipioAfectado.value,
      direccion: dataFormsAll.value.direccionAfectado
    },
    usuario: auth.$state.userInfo.name,
  }

  try {
    const response = await sgdeaAxios.put(`/medicina/${props.data.id}`, forms)
    if (response.status == 200) {
      // const dataTrazabilidad = {
      //   proceso: `ML${response.data.id}`,
      //   secuencia: response.data.idRadicado,
      //   estado: "Actualización",
      //   descripcion: `Ha actualizado la información general del caso ${response.data.idRadicado}`,
      //   comentario: dataFormsAll.value.descripcion,
      //   nombre: auth.$state.userInfo.name,
      //   accion: `${auth.$state.userInfo.name} ha actualizado el radicado ${response.data.idRadicado}`,
      //   tramite: 'Medicina Laboral',
      // }
      // await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
      toast.success("Se ha actualizado el radicado con éxito!")
      emit('saveData')
    }
  } catch (error) {
    toast.error("Ha ocurrido un error al actualizar la radicación")
  }
}

watch(() => form0.value.pais, async (value) => {
  let val = value.label as unknown as string
  if (val.toLowerCase() == 'colombia') {
    isntColombia.value = false
    const { optionsDepartments } = await useDepartments(value.value);
    departamentoOptions.value = sortOptions(optionsDepartments.value);
    if (!isLoadingData) {
      form0.value.departamento = ''
      form0.value.municipio = ''
    }
  } else {
    form0.value.departamento = value
    form0.value.municipio = value
    isntColombia.value = true
  }
  isLoadingData = false;
});

watch(() => form0.value.departamento, async (value) => {
  const { optionsMunicipalities } = await useMunicipalities(value.value);
  municipioOptions.value = sortOptions(optionsMunicipalities.value)

  if (!isLoadingData) {
    if (!isntColombia.value) {
      form0.value.municipio = ''
    }
  }
});

watch(() => form0.value.pais, async (value) => {
  //@ts-ignore
  const { optionsDepartments } = await useDepartments(value.value);
  departamentoOptions.value = optionsDepartments.value;
});

watch(() => form0.value.tipoDocumentoRemitente, (newValue) => {
  disabledNumeroDoc.value = Number(newValue.value) === 12 ? true : false
})

watch(() => form0.value.canal, (newValue) => {
  disabledTipoRemitente.value = Number(newValue) === 2 ? true : false
  if (disabledTipoRemitente.value) {
    tipoRemitente.value.resetValidation()
  }
})

watch(() => form0.value.correoRemitente, () => {
  direccionRef.value.resetValidation()
})

watch(() => form0.value.canal, (newValue) => {
  if (Number(newValue) === 2) {
    medioSelect.value.resetValidation()
  }
})

watch(() => form0.value.medioAutorizadorParaRespuesta, (newValue) => {
  if (Number(newValue.value) === 1) {
    selectDep.value.resetValidation()
    selectMun.value.resetValidation()
    direccionRef.value.resetValidation()
  }
})

watch(() => form0.value.tipoRemitente, (val) => {
  if (Number(val) === 1) {
    toast.warning('Al seleccionar tipo de remitente "Afectado", debe tener alguna relación como afiliado a Positiva S.A.')
  }
})

watch(() => form1.value.paisAfectado, async (value) => {
  let val = value.label as unknown as string
  if (val.toLowerCase() == 'colombia') {
    isntColombia.value = false
    const { optionsDepartments } = await useDepartments(value.value);
    departamentoAfectadoOptions.value = sortOptions(optionsDepartments.value);
    if (!isLoadingDataAfectado) {
      form1.value.departamentoAfectado = ''
      form1.value.municipioAfectado = ''
    }
  } else {
    form1.value.departamentoAfectado = value
    form1.value.municipioAfectado = value
    isntColombia.value = true
  }
  isLoadingDataAfectado = false;
});

watch(() => form1.value.departamentoAfectado, async (value) => {
  const { optionsMunicipalities } = await useMunicipalities(value.value);
  municipioAfectadoOptions.value = sortOptions(optionsMunicipalities.value)

  if (!isLoadingDataAfectado) {
    if (!isntColombia.value) {
      form1.value.municipioAfectado = ''
    }
  }
});

watch(() => form1.value.paisAfectado, async (value) => {
  //@ts-ignore
  const { optionsDepartments } = await useDepartments(value.value);
  departamentoAfectadoOptions.value = optionsDepartments.value;
});

watch(() => checkDatosRemitente.value, (newValue) => {
  if (isLoaderCheck.value) {
    isLoaderCheck.value = false
    return
  }

  if (newValue) {
    disabledInputs.value = true
  } else {
    form2.value.numeroRadicadoRelacionado = ''
    disabledInputs.value = false
  }
})

watch(() => form2.value.numeroRadicadoRelacionado, () => {
  disabledInputs.value = false
})

watch(() => form2.value.tipoSolicitud, (value) => {
  if (Number(value.value) !== 5) {
    form2.value.constancia = null
    form2.value.fechaDictamenJuntaRegional = null
  }
})

watch(() => form2.value.constancia, (val) => {
  if (val && Number(form0.value.canal) == 1) {
    form2.value.oficina = { label: 'Grupo JRC Automática', value: 14 }
    disabledOfi.value = true
  } else if (!val && Number(form0.value.canal) == 1) {
    disabledOfi.value = false
    form2.value.oficina = ''
  }
})

</script>
