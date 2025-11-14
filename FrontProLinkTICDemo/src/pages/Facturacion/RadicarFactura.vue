<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-pt-4">
        <router-link to="/home">
          <q-btn flat color="primary" label="Volver" icon="chevron_left" />
        </router-link>
      </div>

      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Radicar factura administrativa</h1>
      </div>

      <q-form ref="formValidate" greedy>
        <!-- Información básica radicación -->
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator default-opened>
            <template v-slot:header>
              <div class="col row">
                <p class="tw-text-2xl tw-font-bold">
                  Información Básica Radicación
                </p>
              </div>
            </template>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">
                <!-- Dependencia y Responsable del proceso -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Dependencia *</label>
                    <q-select v-model="form.dependencia" map-options :options="filteredOptionsDependencias"
                      label="Seleccione" dense outlined class="tw-rounded-lg" :rules="[inputRequired]"
                      @filter="selectOptionsFilterFn" use-input fill-input hide-selected>
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Responsable del Proceso</label>
                    <q-select v-model="form.responsable" map-options emit-value label="Seleccione" :options="options"
                      dense outlined class="tw-rounded-lg">
                    </q-select>
                  </span>
                </div>

                <!-- Tipo de trámite y Tipo de remitente -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de Trámite *</label>
                    <q-select v-model="form.tipoTramite" map-options emit-value label="Seleccione" dense
                      :options="tipoTramite" outlined class="tw-rounded-lg" :rules="[inputRequired]" disable>
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de Remitente *</label>
                    <q-select v-model="form.tipoRemitente" label="Seleccione" dense map-options emit-value outlined
                      :options="tipoRemitente" class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <!-- País, Departamento y Municipio -->
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">País *</label>
                    <q-select v-model="form.pais" label="Seleccione" dense outlined map-options emit-value
                      class="tw-rounded-lg" :options="optionsPaises" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Departamento *</label>
                    <q-select v-model="form.departamento" label="Seleccione" dense outlined class="tw-rounded-lg"
                      :rules="[inputRequired]" :options="optionsDepartamentos" :disable="isntColombia">
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Municipio *</label>
                    <q-select v-model="form.municipio" label="Seleccione" dense outlined class="tw-rounded-lg"
                      :rules="[inputRequired]" :options="optionsMunicipios" :disable="isntColombia">
                    </q-select>
                  </span>
                </div>

                <!-- Canal de recepción -->
                <div class="col-12">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Canal de Recepción *</label>
                    <q-select v-model="form.canal" map-options emit-value label="Seleccione" dense outlined
                      class="tw-rounded-lg" :options="optionsCanales" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>

                <!-- Tipo de documento y Número de identificación -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Tipo de Documento *</label>
                    <q-select v-model="form.tipoDocumento" label="Seleccione" map-options emit-value dense outlined
                      :options="tipoDocumento" class="tw-rounded-lg" :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Número de Identificación *</label>
                    <q-input v-model="form.numeroDocumento" :rules="[
                      inputRequired,
                      form.tipoDocumento === 'Pasaporte' ? alphanumeric : (v: string) => onlyNumbers(v),
                      (val) => maxLengthInput(15, val),
                    ]" dense label="Ingrese" outlined class="tw-rounded-lg" @blur="blurSearchUser">
                    </q-input>
                  </span>
                </div>

                <!-- Primer apellido, Segundo apellido, Primer nombre y Otros nombres -->

                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Primer Apellido *</label>
                    <q-input v-model="form.primerApellido" dense label="Ingrese" filled class="tw-rounded-lg"
                      :rules="[inputRequired]" readonly />
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Segundo Apellido *</label>
                    <q-input v-model="form.segundoApellido" dense label="Ingrese" filled class="tw-rounded-lg"
                      :rules="[inputRequired]" readonly />
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Primer Nombre *</label>
                    <q-input v-model="form.primerNombre" dense label="Ingrese" filled class="tw-rounded-lg"
                      :rules="[inputRequired]" readonly />
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Otros Nombres</label>
                    <q-input v-model="form.otrosNombres" dense label="Ingrese" filled class="tw-rounded-lg" :rules="[]"
                      readonly />
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-6 col-lg-6" v-if="isNit">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Nombre Comercial</label>
                    <q-input v-model="form.nombreComercial" dense label="Ingrese" filled class="tw-rounded-lg"
                      :rules="[]" readonly />
                  </span>
                </div>
                <div class="col-xs-12 col-sm-3 col-md-6 col-lg-6" v-if="isNit">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Razón Social</label>
                    <q-input v-model="form.razonSocial" dense label="Ingrese" filled class="tw-rounded-lg" :rules="[]"
                      readonly />
                  </span>
                </div>

                <!-- Dirección -->
                <div class="col-12">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Dirección * ({{ form.direccion.length }} / 200)</label>
                    <q-input v-model="form.direccion" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[
                      inputRequired,
                      (val) => maxLengthInput(200, val),
                    ]" />
                  </span>
                </div>

                <!-- Teléfono, Celular y Correo electrónico -->
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Teléfono </label>
                    <q-input v-model="form.telefono" :rules="[onlyNumbers, homePhoneNumber]" dense label="Ingrese"
                      outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Celular *</label>
                    <q-input v-model="form.celular" :rules="[inputRequired, onlyNumbers, mobilePhonNumber]" dense
                      label="Ingrese" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Correo Electrónico * ({{ form.email.length }} / 200)</label>
                    <q-input v-model="form.email" :rules="[
                      inputRequired,
                      validationEmail,
                      (val) => maxLengthInput(200, val),
                    ]" dense label="Ingrese" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <!-- Información factura administrativa -->
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator default-opened>
            <template v-slot:header>
              <div class="col row">
                <p class="tw-text-2xl tw-font-bold">
                  Información Factura Administrativa
                </p>
              </div>
            </template>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">
                <!-- Número de radicado de la entidad remitente y Número de factura -->
                <div class="tw-w-full">
                  <span class="tw-w-full">
                    <label class="tw-text-label">CUFE (Código Único de Facturación Electrónica) *</label>
                    <q-input v-model="form.cufe" dense label="Ingrese" outlined class="tw-rounded-lg" :rules="[
                      inputRequired,
                      alphanumeric,
                      (val) => maxLengthInput(150, val),
                    ]">
                    </q-input>
                  </span>
                </div>
              </div>
            </div>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">
                <!-- Número de radicado de la entidad remitente y Número de factura -->
                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Fecha de Factura *</label>
                    <DatePickerComponent v-model:input-data-prop="form.fechaFac"
                      :options="(date) => date <= moment().format('YYYY/MM/DD')" mask="DD/MM/YYYY"
                      label="dd / mm / aaaa" />
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Número de Radicado de la Entidad Remitente</label>
                    <q-input v-model="form.numeroRadicado" dense label="Ingrese" outlined class="tw-rounded-lg"
                      :rules="[alphanumeric, (val) => maxLengthInput(70, val)]">
                    </q-input>
                  </span>
                </div>

                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Número de Factura *</label>
                    <q-input v-model="form.numeroFactura" :rules="[
                      inputRequired,
                      alphanumeric,
                      (val) => minLengthInput(5, val),
                      (val) => maxLengthInput(70, val),
                    ]" dense label="Ingrese" outlined class="tw-rounded-lg">
                    </q-input>
                  </span>
                </div>

                <!-- Descripción (detalle) -->
                <div class="col-12">
                  <CommentTextArea v-model="form.descripcion" :is-required="true" :max-length="10000"
                    label="Descripción (Detalle)" />
                </div>

                <!-- Valor y Valor en letras -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Valor *</label>

                    <q-input v-model="form.valor" prefix="$" :rules="[
                      inputRequired,
                      onlyNumbers,
                      (val) => maxLengthInput(10, val),
                      (val) => val > 0 || 'El valor debe ser mayor a cero',
                    ]" dense label="Ingrese" outlined class="tw-rounded-lg" mask="#.###.###.###.###" unmasked-value
                      reverse-fill-mask maxlength="10"></q-input>
                  </span>
                </div>

                <!-- Medio que autoriza para envío de respuesta -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Medio que Autoriza para Envío de Respuesta
                    </label>

                    <q-select v-model="form.medio" label="Seleccione" dense outlined map-options emit-value
                      :options="medioOptions" class="tw-rounded-lg" disable :rules="[inputRequired]">
                    </q-select>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label"> IVA </label>

                    <q-input v-model="tasaIva" prefix="%" :rules="[
                      onlyNumbers,
                      (val) =>
                        (val >= 0 && val <= 19) ||
                        'El valor debe estar entre 0 y 19',
                    ]" dense label="Ingrese" outlined class="tw-rounded-lg" mask="#" reverse-fill-mask maxlength="2">
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Valor Total</label>

                    <q-input v-model="valorTotal" :rules="[inputRequired, (val) => maxLengthInput(10, val)]" dense
                      label="Ingrese" class="tw-rounded-lg" filled disable prefix="$" mask="#.###.###.###.###"
                      unmasked-value reverse-fill-mask maxlength="12"></q-input>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-mx-md">
              <span class="tw-w-full">
                <label class="tw-text-label">Valor en Letras *</label>
                <q-input v-model="form.valorLetra" :rules="[inputRequired]" dense label="Ingrese" filled
                  class="tw-rounded-lg" disable>
                </q-input>
              </span>
            </div>
          </q-expansion-item>
        </q-card>

        <!-- Campos automáticos al radicar -->
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg hidden" flat>
          <q-expansion-item expand-separator default-opened>
            <template v-slot:header>
              <div class="col row">
                <p class="tw-text-2xl tw-font-bold">
                  Campos Automáticos al Radicar
                </p>
              </div>
            </template>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">
                <!-- FECHA / sistema al radicar y HORA / sistema al radicar -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">FECHA / Sistema al Radicar *</label>
                    <q-input v-model="form.fechaRadicar" type="date" :rules="[inputRequired]" dense label="Ingrese"
                      filled class="tw-rounded-lg" disable>
                    </q-input>
                  </span>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">HORA / Sistema al Radicar *</label>
                    <q-input v-model="form.horaInicio" type="time" :rules="[inputRequired]" dense label="Ingrese" filled
                      class="tw-rounded-lg" disable>
                    </q-input>
                  </span>
                </div>

                <!-- Estado del trámite -->
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Estado del Trámite</label>
                    <q-select :options="estados" v-model="form.estado" label="Seleccione" dense map-options emit-value
                      class="tw-rounded-lg" filled disable>
                    </q-select>
                  </span>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <!-- Cargue de documentos -->
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <q-expansion-item expand-separator default-opened>
            <template v-slot:header>
              <div class="col row">
                <p class="tw-text-2xl tw-font-bold">Cargue de Documentos</p>
              </div>
            </template>

            <div class="tw-mt-2">
              <div class="row q-col-gutter-md q-pb-md q-px-md">
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                  <span class="custom-label text-weight-bold">Factura Administrativa en Formato PDF *</span>
                  <q-file ref="myFile" name="croquisAccidente" v-model="form.cuentaCobro" flat label="" dense outlined
                    clearable clear-icon="close" class="mb-3" :max-file-size="50000000" input-style="opacity: 0"
                    accept=".pdf" :filter="allowedTypes" @rejected="rejectedTypes" :rules="[inputRequired]">
                    <template v-slot:prepend>
                      <q-icon name="check_circle" color="grey-5" />
                    </template>
                    <template v-slot:file="{ file }">
                      <q-chip outline v-if="form.cuentaCobro" square color="secondary" class="q-my-sm" style="
      border-radius: 5px;
      border: 1px solid #e3e4e5;
      background: #fff;
    ">
                        <q-avatar size="24px" square>
                          <img v-lazy :data-url="pdfIcon" alt="pdfIcon" />
                        </q-avatar>

                        <div class="fileName relative-position">
                          {{ file.name }}
                        </div>

                        <q-btn dense flat round icon="download" @click.stop="descargarPDF(file)" class="q-ml-xs">
                          <q-tooltip>Descargar PDF</q-tooltip>
                        </q-btn>

                        <q-tooltip anchor="top middle" self="bottom middle">
                          {{ file.name }}
                        </q-tooltip>
                      </q-chip>
                    </template>
                    <template v-slot:append>
                      <q-icon name="attach_file" color="grey-6" @click="openFile" class="tw-cursor-pointer" />
                    </template>
                  </q-file>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                  <span class="custom-label text-weight-bold">Factura en Formato o Archivo XML *</span>
                  <q-file ref="myFile2" name="croquisAccidente" v-model="form.entregaSoportes" flat label="" dense
                    outlined clearable clear-icon="close" class="mb-3" input-style="opacity: 0"
                    :max-file-size="50000000" accept=".xml" :filter="allowedTypes" @rejected="rejectedTypes">
                    <template v-slot:prepend>
                      <q-icon name="check_circle" color="grey-5" />
                    </template>
                    <template v-slot:file="{ file }">
                      <q-chip v-if="form.entregaSoportes" outline square color="secondary" class="q-my-sm" style="
      border-radius: 5px;
      border: 1px solid #e3e4e5;
      background: #fff;
    ">
                        <q-avatar size="24px" square>
                          <q-icon name="upload_file" size="sm" />
                        </q-avatar>

                        <div class="fileName relative-position">
                          {{ file.name }}
                        </div>

                        <q-btn dense flat round icon="download" @click.stop="descargarXML(file)" class="q-ml-xs">
                          <q-tooltip>Descargar XML</q-tooltip>
                        </q-btn>

                        <q-tooltip anchor="top middle" self="bottom middle">
                          {{ file.name }}
                        </q-tooltip>
                      </q-chip>
                    </template>
                    <template v-slot:append>
                      <q-icon name="attach_file" color="grey-6" @click="openFile2" class="tw-cursor-pointer" />
                    </template>
                  </q-file>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                  <span class="custom-label text-weight-bold">Pagos de Seguridad Social *</span>
                  <q-file ref="myFile3" name="croquisAccidente" v-model="form.pagoSeguridadSocial" flat label="" dense
                    outlined clearable clear-icon="close" class="mb-3" input-style="opacity: 0"
                    :max-file-size="50000000" accept=".pdf" :filter="allowedTypes" @rejected="rejectedTypes"
                    :rules="[inputRequired]">
                    <template v-slot:prepend>
                      <q-icon name="check_circle" color="grey-5" />
                    </template>
                    <template v-slot:file="{ file }">
                      <q-chip outline square v-if="form.pagoSeguridadSocial.name" color="secondary" class="q-my-sm"
                        style="
                          border-radius: 5px;
                          border: 1px solid #e3e4e5;
                          background: #fff;
                        ">
                        <q-avatar size="24px" square>
                          <img v-lazy :data-url="pdfIcon" alt="pdfIcon" />
                        </q-avatar>

                        <div class="fileName relative-position">
                          {{ file.name }}
                        </div>
                        <q-tooltip anchor="top middle" self="bottom middle">
                          {{ file.name }}
                        </q-tooltip>
                      </q-chip>
                    </template>
                    <template v-slot:append>
                      <q-icon name="attach_file" color="grey-6" @click="openFile3" class="tw-cursor-pointer" />
                    </template>
                  </q-file>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
                  <span class="custom-label text-weight-bold">Otros Tipos Documentales
                  </span>
                  <q-file name="croquisAccidente" ref="otrosTiposInput" multiple append
                    v-model="form.otrosTiposDocumentales" flat label="" dense outlined clearable clear-icon="close"
                    max-file-size="50000000" class="mb-3" input-style="opacity: 0" use-chips
                    accept="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg" max-files="10"
                    :filter="allowedTypes" @rejected="rejectedTypesOtros">
                    <template v-slot:prepend>
                      <q-icon name="check_circle" color="grey-5" />
                    </template>
                    <template v-slot:file="{ file }">
                      <q-chip outline square color="secondary" class="q-my-sm" style="
                          border-radius: 5px;
                          border: 1px solid #e3e4e5;
                          background: #fff;
                        ">
                        <q-avatar size="24px" square>
                          <img v-lazy :data-url="tipoIcon(file.type)" alt="docIcon" />
                        </q-avatar>

                        <div class="fileName relative-position">
                          {{ file.name }}
                        </div>
                        <q-tooltip anchor="top middle" self="bottom middle">
                          {{ file.name }}
                        </q-tooltip>
                      </q-chip>
                    </template>
                    <template v-slot:append>
                      <q-icon name="attach_file" color="grey-6" @click="openFile4" class="tw-cursor-pointer" />
                    </template>
                  </q-file>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>

      <div class="col row justify-center q-gutter-x-md q-my-md">
        <q-btn color="accent" textColor="secondary" label="Cancelar" :disable="alreadyRadicated" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " type="reset" no-caps @click="cancelModal = true" />

        <q-btn color="primary" label="Radicar" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " @click="radicarModal = true" :loading="handleSubmitIsLoading" />
      </div>

    </main>

    <!-- Modal de Facturas Disponibles - Versión Quasar -->
    <q-dialog v-model="showFacturasModal" persistent>
      <q-card style="width: 80vw; max-width: 1200px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Facturas Disponibles</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="resetSelection" />
        </q-card-section>

        <q-card-section>
          <q-table :rows="facturasData" :columns="columns" row-key="consecutivo" v-model:selected="selectedRows"
            selection="single" :pagination="pagination" :loading="loading" :filter="filter">
            <template v-slot:top-right>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey q-gutter-sm">
                <span>No se encontraron facturas</span>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup icon="close" @click="resetSelection" />
          <q-btn flat label="Seleccionar" color="positive" v-close-popup icon="check" :disable="!selectedRows"
            @click="handleSelectFactura" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" @handleAccept="resetForm" cancel-button
      textButtonCancel="No" textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @close-modal="cancelModal = false" type="button" />
    <Modal v-model:model-value="downloadModal" title="Radicación exitosa" persistent
      :text="`Trámite de radicación de documento de Facturas Administrativas generado correctamente, número de radicado ${downloadSec}. El documento pasará a la bandeja del asignador para continuar el proceso`"
      :is-success="true" :cancelButton="true" @handle-accept="handleCloseDownloadModal" textButtonCancel="Descargar"
      text-button="Finalizar" @close-modal="handleDownloadRadicacionDocument" />
    <Modal v-model="radicarModal" title="¡Espera un momento!" :is-success="false" @handleAccept="handleSubmit"
      cancel-button textButtonCancel="No" textButton="Si" text=" ¿Estas seguro de radicar la información ingresada?"
      @close-modal="radicarModal = false" type="button" />
  </section>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { type Ref, ref, onMounted, watch } from "vue";

const cancelModal = ref(false);
const radicarModal = ref(false);

import { currentHour } from "src/helpers/formtDate";
import { numberToHumanText } from "src/helpers/number";
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
  onlyNumbers,
  homePhoneNumber,
  mobilePhonNumber,
  validationEmail,
  alphanumeric,
} from "src/helpers/validations";

// @ts-ignore
import pdfIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from "src/assets/word.svg";
// @ts-ignore
import imgIcon from "src/assets/img.svg";
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

import { SelectInput, BonitaAPI, DocumentoRadicado } from "src/interfaces";
import { adminAxios, integracionesSgdea, sgdeaAxios } from "src/services";
import { medioOptions, tipoDocumento } from "src/constantes/options";
import moment from "moment";
import Modal from "components/Modal/Modal.vue";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

const router = useRouter();
const route = useRoute();
const formValidate = ref();
const otrosTiposInput = ref();

const downloadModal = ref<boolean>(false);
const downloadSec = ref<string | null>(null);
const generatedDocId = ref<string | null>(null);
const handleSubmitIsLoading = ref<boolean>(false);
const alreadyRadicated = ref<boolean>(false);
const isntColombia = ref(false);
const isNit = ref(false);
const form = ref({
  dependencia: "",
  responsable: "",
  tipoTramite: {
    label: "Facturas Administrativas",
    value: "Facturas Administrativas",
  },
  canal: "",
  tipoDocumento: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  segundoNombre: "hhhh",
  otrosNombres: "",
  razonSocial: "",
  nombreComercial: "",
  direccion: "",
  cufe: "",
  fechaFac: "",

  valor: 0,
  valorLetra: "",
  iva: 0,
  valorTotal: 0,

  fechaRadicar: moment().format("MM-DD-AAAA HH:mm"),
  horaInicio: currentHour(new Date()),
  estado: "Por asignar",

  cuentaCobro: null as any,
  pagoSeguridadSocial: null as any,
  entregaSoportes: null as any,
  numeroDocumento: "",

  otrosTiposDocumentales: null as any,
  celular: "",
  email: "",
  departamento: "",
  descripcion: "",
  medio: "Correo electrónico",
  municipio: "",
  numeroFactura: "",
  numeroRadicado: "",
  // pais: {
  //   label: "Colombia",
  //   value: "Colombia",
  // },
  pais: "Colombia",
  telefono: "",
  tipoRemitente: "",
});

// Variables reactivas adicionales
const showFacturasModal = ref(false);
const facturasData = ref([]);
const selectedRows = ref([]);

// Columnas para la tabla de facturas
const columns = ref([
  {
    name: 'numeroFactura',
    required: true,
    label: 'N° Factura',
    align: 'center',
    field: row => `${row.prefijo || ''}${row.consecutivo || ''}`,
    sortable: true
  },
  {
    name: 'fechaHora',
    label: 'Fecha y Hora',
    align: 'center',
    field: row => `${formatDate(row.fecha || '')} ${row.hora || ''}`.trim(),
    sortable: true
  },
  {
    name: 'tipo',
    label: 'Tipo',
    align: 'center',
    field: row => row.tipoTexto,
    sortable: true
  },
  {
    name: 'valor',
    label: 'Valor',
    align: 'center',
    field: 'valor',
    sortable: true,
    format: val => formatCurrency(val)
  },
  {
    name: 'cufe',
    label: 'CUFE',
    align: 'center',
    field: 'cufe',
    classes: 'ellipsis',
    style: 'max-width: 200px'
  }
]);

const pagination = ref({
  sortBy: 'fecha',
  descending: true,
  page: 1,
  rowsPerPage: 10
});

const filter = ref('');
const loading = ref(false);


const descargarPDF = async (file: File) => {
  try {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF descargado correctamente');
    }
    else if (typeof form.value.cuentaCobro === 'string') {
      const byteCharacters = atob(form.value.cuentaCobro);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura_${form.value.numeroFactura || 'documento'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF descargado correctamente');
    }
  } catch (error) {
    toast.error('Error al descargar el PDF');
  }
};

const descargarXML = async (file: File) => {
  try {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('XML descargado correctamente');
    }
    else if (typeof form.value.entregaSoportes === 'string') {
      const byteCharacters = atob(form.value.entregaSoportes);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura_${form.value.numeroFactura || 'documento'}.xml`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('XML descargado correctamente');
    }
  } catch (error) {
    toast.error('Error al descargar el XML');
  }
};

const formatDate = (dateString: string) => {
  return moment(dateString).format('DD/MM/YYYY');
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

watch(
  () => form.value.dependencia,
  async (newVal: any) => {
    const response = await sgdeaAxios.get(
      `/api/usuarios/rolYSeccionSubseccion/${newVal.value}?rolName=Gestionador`
    );
    options.value = response.data
      .filter((responsable: any) => responsable.enabled)
      .map((responsable: any) => ({
        label: responsable.firstname + " " + responsable.lastname,
        value: responsable.id,
      }));
    form.value.responsable = "";
  }
);
let tasaIva = ref(0);
let valorTotal = 0;

watch([() => tasaIva.value, () => form.value.valor], ([newIva, newValor]) => {
  let ivaFormat = parseFloat(String(newIva));
  if (String(newIva).startsWith("0") && String(newIva) !== "0") {
    ivaFormat = parseFloat(String(newIva).substring(1));
    if (isNaN(ivaFormat)) {
      ivaFormat = 0;
    }
  }

  let valorFormat = parseFloat(String(newValor));
  if (String(newValor).startsWith("0") && String(newValor) !== "0") {
    valorFormat = parseFloat(String(newValor).substring(1));
    if (isNaN(valorFormat)) {
      valorFormat = 0;
    }
  }

  if (ivaFormat > 0) {
    let valorIva = (ivaFormat / 100) * valorFormat;
    valorTotal = valorFormat + valorIva;
  } else {
    valorTotal = valorFormat;
  }

  form.value.valorLetra = numberToHumanText(valorTotal);
});

watch(
  () => form.value.tipoDocumento,
  (newVal) => {
    isNit.value = newVal === "Número de Identificación Tributaria NIT";
  }
);
const optionsDependencias = ref<SelectInput[]>([]);

const filteredOptionsDependencias = ref<SelectInput[]>([]);
const optionsDepartamentos: Ref<SelectInput[]> = ref([]);
const optionsPaises = ref<SelectInput[]>([]);
const optionsMunicipios: Ref<SelectInput[]> = ref([]);
const optionsCanales: Ref<SelectInput[]> = ref([
  { label: "CRM", value: "CRM" },
  {label: "EMAIL", value: "EMAIL"}
]);
const municipios: Ref<SelectInput[]> = ref([]);

const tipoTramite = ref<SelectInput[]>([
  {
    label: "Facturas Administrativas",
    value: "Facturas Administrativas",
  },
  {
    label: "Cuenta de cobro o documento equivalente soporte",
    value: "Cuenta de cobro o documento equivalente soporte",
  },
  {
    label: "Factura Emisión Manual",
    value: "Factura Emisión Manual",
  },
  {
    label: "Nota Crédito / Nota Débito",
    value: "Nota Crédito / Nota Débito",
  },
  {
    label: "Crear Adquirente",
    value: "Crear Adquirente",
  },
]);
const tipoRemitente = ref<SelectInput[]>([
  {
    label: "Proveedor",
    value: "proveedor",
  },
]);

const handleCloseDownloadModal = () => {
  downloadModal.value = false;
  router.push("/home");
};

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredOptionsDependencias.value = optionsDependencias.value;
    });
    return;
  }
  update(() => {
    filteredOptionsDependencias.value = optionsDependencias.value.filter(
      (option) => {
        return option.label.toLowerCase().includes(val.toLowerCase());
      }
    );
  });
};

const resetSelection = () => {
  selectedRows.value = [];
};

const handleSelectFactura = async () => {
  if (selectedRows.value.length === 0) {
    toast.error("Por favor selecciona una factura primero");
    return;
  }

  const [selectedFactura] = selectedRows.value;

  try {
    loading.value = true;

    const fechaFormateada = moment(selectedFactura.fecha).format('YYYY-MM-DD');

    let url;

    if (route.path.includes('docu')) {
      url = process.env.VITE_INTEGRATION_API_URL;
    }else{
      url = process.env.API_INTEGRACIONES;
    }

    const { data } = await sgdeaAxios.get(
      `${url}/facturacionDescarga/consultaDocumento?cufe=${selectedFactura.cufe}&fecha=${fechaFormateada}`
    );


    form.value.cufe = selectedFactura.cufe;
    form.value.numeroFactura = `${selectedFactura.prefijo || ''}${selectedFactura.consecutivo || ''}`;
    form.value.fechaFac = moment(selectedFactura.fecha).format('DD/MM/YYYY');
    form.value.valor = selectedFactura.valor;

    if (data.pdf) {
      form.value.cuentaCobro = base64ToFile(data.pdf, 'application/pdf', `factura_${form.value.numeroFactura}.pdf`);
    }

    if (data.xml) {
      form.value.entregaSoportes = base64ToFile(data.xml, 'text/xml', `factura_${form.value.numeroFactura}.xml`);
    }

    toast.success("Documentos cargados correctamente");
    showFacturasModal.value = false;

  } catch (error) {
    toast.error(error.message || "Error al cargar los documentos");
  } finally {
    loading.value = false;
  }
};


const base64ToFile = (base64: string, mimeType: string, fileName: string): File => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  return new File([blob], fileName, { type: mimeType });
};

const getTipoTexto = (tipo: string) => {
  switch (tipo) {
    case '01':
      return 'Factura de ventas';
    case '02':
      return '02';
    case '03':
      return '03';
    default:
      return tipo;
  }
};

const blurSearchUser = async (val) => {
  try {
    const { numeroDocumento } = form.value;
    if (numeroDocumento.length === 0) {
      return;
    }

    let url;

    if (route.path.includes('docu')) {
      url = process.env.VITE_INTEGRATION_API_URL;
    }else{
      url = process.env.API_INTEGRACIONES;
    }

    const [{ data: dataProveedor, status: proveedorStatus }, { data: { data }, status }] = await Promise.all([
      sgdeaAxios.get(`/facturacion/getVende/${numeroDocumento}`),
      sgdeaAxios.get(`${url}/facturacionDescarga/consultar/?proveedor=${numeroDocumento}`)
    ]);


    const statusResponse = status === 200 && proveedorStatus === 200;

    if (!statusResponse) {
      return
    }
    const {
      papellido: primerApellido,
      sapellido: segundoApellido,
      pnombre: primerNombre,
      onombre: otrosNombres,
      razonSocial,
      nombreComercial,
      mens: tipoPersona
    } = dataProveedor;

    const payload = {
      primerApellido,
      segundoApellido,
      primerNombre,
      otrosNombres,
      razonSocial,
      nombreComercial
    }

    if (tipoPersona.includes("Natural")) {
      delete payload.razonSocial;
      delete payload.nombreComercial;

      form.value = {
        ...form.value,
        ...payload,
      };
      isNit.value = false;
    } else {

      delete payload.primerApellido;
      delete payload.segundoApellido;
      delete payload.primerNombre;
      delete payload.otrosNombres;

      form.value = {
        ...form.value,
        ...payload,
      };

      const facturasDisponibles = data || [];

      if (Array.isArray(facturasDisponibles) && facturasDisponibles.length > 0) {
        facturasData.value = facturasDisponibles.map(f => ({
          ...f,
          numeroFactura: `${f.prefijo || ''}${f.consecutivo || ''}`,
          fechaHora: `${f.fecha || ''} ${f.hora || ''}`.trim(),
          valor: Number(f.valor) || 0,
          tipoTexto: getTipoTexto(f.tipo)
        }));

        showFacturasModal.value = true;
      } else {
        toast.error("El proveedor existe pero no tiene facturas registradas");
      }
      isNit.value = true;
    }

    // form.value.nombreComercial = dataProveedor.nombreComercial;
    // form.value.razonSocial = dataProveedor.razonSocial;

    //TODO: Abrir modal y cargar datos a formulario


    return "";
  } catch (e) {
    toast.error(
      "Documento de identificación no existe, por favor solicitar la creación del usuario que no se encuentra registrado"
    );
    form.value.primerApellido = "";
    form.value.segundoApellido = "";
    form.value.primerNombre = "";
    form.value.otrosNombres = "";
    form.value.razonSocial = "";
    form.value.nombreComercial = "";
  }
};

const handleDownloadRadicacionDocument = async () => {
  try {
    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${generatedDocId.value}`
    );

    const docRadicado = listDocs.list.entries?.find((it) => {
      const entryName = it.entry.name;
      return entryName && entryName.startsWith(downloadSec.value);
    });

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${docRadicado.entry.id}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = String(downloadSec.value);

    link.click();

    URL.revokeObjectURL(blobUrl);

    router.push("/home");
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
};

const getData = async () => {
  const {
    data: dptos,
  }: {
    data: BonitaAPI & { idDepartamento: number; nombre: string }[];
  } = await sgdeaAxios.get("/geodivision/pais/425");

  const {
    data: mnpios,
  }: {
    data: BonitaAPI &
    { idMunicipio: number; nombre: string; codigoDivipola: string }[];
  } = await adminAxios.get("/municipios/list");

  const { data: formData } = await adminAxios.get<
    {
      idMunicipio: number;
      nombre: string;
      codigoDivipola: string;
    }[]
  >("/municipios/list");

  const { data: paisesData } = await adminAxios.get<
    { idPais: number; nombre: string }[]
  >("/paises/list");

  optionsDepartamentos.value = sortOptions(
    dptos.map((item) => {
      return {
        label: item.nombre,
        value: item.idDepartamento,
      };
    })
  );

  municipios.value = mnpios.map((item) => {
    return {
      label: item.nombre,
      value: item.idMunicipio,
    };
  });

  const sortedMunicipios = formData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  optionsMunicipios.value = sortedMunicipios.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre,
    };
  });

  const sortedPaises = paisesData.sort((leftMunicipio, rightMunicipio) => {
    const nombreA = leftMunicipio.nombre.toLowerCase().trim();
    const nombreB = rightMunicipio.nombre.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });

  optionsPaises.value = sortedPaises.map(({ nombre }) => {
    return {
      label: nombre,
      value: nombre,
    };
  });
};

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();
    return nombreA.localeCompare(nombreB, "es");
  });
};

const myFile = ref();
const myFile2 = ref();
const myFile3 = ref();

const openFile = () => {
  myFile.value.pickFiles();
};

const openFile2 = () => {
  myFile2.value.pickFiles();
};

const openFile3 = () => {
  myFile3.value.pickFiles();
};

const openFile4 = () => {
  otrosTiposInput.value.pickFiles();
};

watch(
  () => form.value.pais,
  async (value) => {
    let val = value as unknown as string;
    form.value.departamento = "";
    form.value.municipio = "";
    if (val.toLowerCase() == "colombia") {
      isntColombia.value = false;
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);
    } else {
      // @ts-ignore
      form.value.departamento = { label: val, value: value };
      // @ts-ignore
      form.value.municipio = { label: val, value: value };
      isntColombia.value = true;
    }
  }
);

watch(
  () => form.value.departamento,
  async (value) => {
    //@ts-ignore
    if (!isntColombia.value) {
      form.value.municipio = "";
    }

    //@ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    optionsMunicipios.value = sortOptions(optionsMunicipalities.value);
  }
);

let filesUpload: Ref<any> = ref({});

watch(
  () => form.value,
  async (newVal) => {
    if (
      newVal.pagoSeguridadSocial instanceof File &&
      newVal.pagoSeguridadSocial.name
    ) {
      const key = "pagoSeguridadSocial";
      if (
        Object.values({
          ...filesUpload.value,
          pagoSeguridadSocial: undefined,
        }).some((x) => x == newVal[key].name)
      ) {
        toast.error("Ya existe un archivo con el mismo nombre");
        form.value[key] = null; // Clear the file input
      } else {
        filesUpload.value[key] = form.value[key].name;
      }
    } else {
      delete filesUpload.value.pagoSeguridadSocial;
    }

    if (
      newVal.otrosTiposDocumentales instanceof Array &&
      newVal.otrosTiposDocumentales.length > 0
    ) {
      const key = "otrosTiposDocumentales";

      newVal.otrosTiposDocumentales.forEach((file) => {
        if (file instanceof File && file.name) {
          if (
            Object.values({ ...filesUpload.value, [key]: undefined }).some(
              (x) => x == file.name
            )
          ) {
            toast.error("Ya existe un archivo con el mismo nombre");
            const index = form.value[key].indexOf(file);
            form.value[key].splice(index, 1); // Remove the file from the array
          } else {
            filesUpload.value[key] = filesUpload.value[key] || [];
            filesUpload.value[key].push(file.name);
          }
        }
      });
    } else {
      delete filesUpload.value.otrosTiposDocumentales;
    }
  },
  { deep: true }
);

async function checkRole() {
  if (
    auth.$state.userInfo.role.includes("Radicador") ||
    auth.$state.userInfo.role === "Administrador de Trámite" ||
    auth.$state.userInfo.role === "Administrador Master"
  ) {
    //
  } else {
    router.push("/home");
  }
}

async function getDependencies() {
  const { data } = await sgdeaAxios.get("/seccionSubSeccion");
  optionsDependencias.value = data
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .map((dependencia: any) => ({
      label: dependencia.nombre,
      value: dependencia.idSeccionSubSeccion,
    }));
  filteredOptionsDependencias.value = optionsDependencias.value;
}

onMounted(() => {
  checkRole();
  getDependencies();
  getData();
});
const auth = useAuthStore();

const handleSubmit = async () => {
  handleSubmitIsLoading.value = true;

  try {
    if (await formValidate.value.validate()) {
      const alreadyExists = await sgdeaAxios.put(`/facturacion/getByNum`, {
        tipoDoc: form.value.tipoDocumento,
        numeroDoc: form.value.numeroDocumento,
        numeroFac: form.value.numeroFactura,
      });

      if (alreadyExists.data.exists) {
        toast.error(
          `El número de la factura ${form.value.numeroFactura} ya se encuentra radicada en la fecha ${alreadyExists.data.fecha}`
        );
        handleSubmitIsLoading.value = false;
        return;
      }

      alreadyRadicated.value = true;
      let newFiles = Object.values(filesUpload.value);
      if (newFiles.some((val, i) => newFiles.indexOf(val) !== i)) {
        toast.error("Tiene archivos duplicados");
        handleSubmitIsLoading.value = false;
        return;
      }
      let files = [];
      const formData = new FormData();

      for (const key in form.value) {
        if (
          form.value[key] instanceof File &&
          !["entregaSoportes", "cuentaCobro"].includes(key)
        ) {
          formData.append("files", form.value[key], form.value[key].name);
        } else if (["cuentaCobro", "entregaSoportes"].includes(key)) {
          formData.append(key, form.value[key]);
        } else if (
          form.value[key] instanceof Array &&
          form.value[key].length > 0
        ) {
          form.value[key].forEach((file) => {
            if (file instanceof File) {
              formData.append("files", file);
            }
          });
        } else if (key === "fechaRadicar") {
          formData.append("fecha_hora", moment().format("MM/DD/YYYY HH:mm"));
        } else if (key === "fechaFac") {
          formData.append(
            key,
            moment(form.value[key], "DD/MM/YYYY").format("YYYY-MM-DD")
          );
        } else if (key == "dependencia") {
          formData.append(key, form.value[key].label);
        } else if (
          key === "departamento" ||
          key === "municipio" ||
          key === "tipoTramite"
        ) {
          //@ts-ignore
          formData.append(key, form.value[key].label);
        } else if (key === "otrosTiposDocumentales" || key === "horaInicio") {
          // do nothing
        } else {
          formData.append(key, String(form.value[key]));
        }
      }
      formData.append("radicadorId", auth.$state.userInfo.userid);
      const response = await sgdeaAxios.post(
        "/facturacion/crearFacAdmin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if ([200].includes(response.status)) {
        downloadModal.value = true;
      } else {
        toast.error("Ocurrió un error inesperado.");
      }

      downloadSec.value = response.data?.facAdmin?.sec as string;
      generatedDocId.value = response.data?.facAdmin?.nodeId as string;
      await crearTrazabilidad({
        proceso: "FAC" + response.data?.facAdmin?.idFactura,
        secuencia: response.data?.facAdmin?.sec,
        estado: "Radicado",
        descripcion: "Se ha radicado la factura administrativa",
        comentario: "Radicado",
        nombre: auth.$state.userInfo.name,
      });
    } else {
      toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
    }
  } catch (error) {
    toast.error("Ocurrió un error inesperado.");
  }
  handleSubmitIsLoading.value = false;
};

const resetForm = async () => {
  window.location.reload();
};

function allowedTypes(files) {
  return files.filter(
    (file) =>
      file.type === "application/pdf" ||
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "text/csv" ||
      file.type === "application/vnd.ms-excel" ||
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword" ||
      file.type === "text/xml" ||
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/jpg"
  );
}

const tipoIcon = (tipo) => {
  const formato = (tipo || '').toLowerCase();

  if (['pdf', 'application/pdf'].includes(formato)) return pdfIcon;
  if (
    [
      'xls',
      'xlsx',
      'csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ].includes(formato)
  ) return excelIcon;
  if (
    [
      'docx',
      'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ].includes(formato)
  ) return docxIcon;
  if (
    [
      'jpeg',
      'jpg',
      'png',
      'webp',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ].includes(formato)
  ) return imgIcon;
  if (['mp3', 'audio/mp3'].includes(formato)) return music;
  if (
    [
      'avi',
      'mp4',
      'video/avi',
      'video/mp4'
    ].includes(formato)
  ) return video;
  if (
    [
      'txt',
      'bmp',
      'text/plain',
      'image/bmp'
    ].includes(formato)
  ) return txt;
  if (
    [
      'xml',
      'text/xml',
      'application/xml'
    ].includes(formato)
  ) return xml;
  if (
    [
      'zip',
      'rar',
      'application/zip',
      'application/x-rar-compressed'
    ].includes(formato)
  ) return zip;
  if (
    [
      'ppt',
      'pptx',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ].includes(formato)
  ) return ppt;
  if (
    [
      'msg',
      'eml',
      'application/vnd.ms-outlook',
      'message/rfc822'
    ].includes(formato)
  ) return msg;

  return interrogation;
};

function rejectedTypes(fileEntries) {
  if (fileEntries.filter((file) => file.type === "application/pdf")) {
    toast.error(
      `(${fileEntries.length}) archivo/s no cumple/n con el formato requerido`
    );
  } else {
    toast.error(
      `(${fileEntries.length}) archivo/s tiene/n un peso mayor a 50 MB`
    );
  }
}

function rejectedTypesOtros(fileEntries) {
  const existingFiles =
    otrosTiposInput.value?.modelValue?.map((file) => file.name) ?? [];
  const duplicateFiles = fileEntries.filter((fileEntry) =>
    existingFiles.includes(fileEntry.file.name)
  );
  if (duplicateFiles.length > 0) {
    toast.error(
      `Los siguientes archivos ya existen: ${duplicateFiles
        .map((file) => file.file.name)
        .join(", ")}`
    );
  } else if (
    otrosTiposInput.value?.modelValue?.length === 10 ||
    fileEntries.length > 10
  ) {
    toast.error(`El límite de archivos permitidos es de 10`);
  } else {
    toast.error(
      `(${fileEntries.length}) archivo/s no cumple/n con el formato requerido o tiene/n un peso mayor a 50 MB`
    );
  }
}

const options = ref([]);

const estados = ref([
  {
    value: "Radicado",
    label: "Radicado",
  },
  {
    value: "rechazado",
    label: "Rechazado",
  },
  {
    value: "rechazado-operador",
    label: "Rechazado-Operador",
  },
  {
    value: "aprobado",
    label: "Aprobado",
  },
]);
</script>

<style>
.fileName {
  text-overflow: ellipsis !important;
}
</style>
