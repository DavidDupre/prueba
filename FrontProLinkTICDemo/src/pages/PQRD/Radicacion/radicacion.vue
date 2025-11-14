<template>
  <div>
    <div>
      <div class='tw-mb-6'>

        <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold"> Radicar PQRD</p>
        <p class="tw-text-label tw-text-[16px]">Positiva recibirá y responderá en los tiempos definidos por la ley a los
          medios de contacto suministrados</p>
      </div>

      <q-form ref="form" class="[&>*]:tw-mb-4" greedy @submit.prevent="submit">
        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item default-opened header-class="tw-text-lg tw-font-bold" label="Datos del Remitente">
            <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">

              <div class="tw-col-span-4">
                <p class="tw-text-label tw-font-semibold">Tipo de Remitente *</p>
                <q-select v-model='formData.tipoRemitente' :options="listadoTipoRemitente" :rules="[rulesValidation]" dense
                          emit-value label="Seleccione" map-options outlined/>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Tipo de Documento del Remitente</p>
                <q-select v-model='formData.tipoDocumentoRemitente' :options="tipoDoc" dense emit-value label="Seleccione"
                          map-options outlined/>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Número de Documento del Remitente</p>
                <q-input v-model='formData.numeroDocumentoRemitente' :rules="[(v: string) => lengthValidation(15, v), alphanumeric]" dense label="Inserte" min="0" outlined
                         type="text"
                         @blur="getPerson"
                         @keypress="Number(formData.tipoDocumentoRemitente) == 11 ? onlyAlphaNumeric : onlyNumber"/>
              </div>
              <div class="tw-col-span-4">
                <label class="tw-text-label">Nombre del Remitente * ({{ formData.nombresRemitente?.length }}/200)</label>
                <q-input v-model='formData.nombresRemitente' :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]" dense label="Inserte"
                         outlined
                         @keypress="alphabeticalWithSpecialCharacters"/>
              </div>
              <div class="tw-col-span-4">
                <q-checkbox v-model='formData.remitenteAfectado'
                            class='tw-text-slate-600 tw-font-semibold tw-border tw-border-slate-300 tw-pl-3 tw-pr-6 tw-rounded-md'
                            label="Los datos del remitente son los mismos del afectado" size="md"/>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item default-opened header-class="tw-text-lg tw-font-bold" label="Datos del Afectado">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <p v-if="Number(formData.canalEntrada) === 2"
                 class="tw-col-span-6 tw-text-black tw-font-semibold tw-pb-2">
                Recuerde que los
                datos del afectado son los relacionados a
                los de quien se solicita el requerimiento ante Positiva *</p>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipo Documento Afectado *</p>
                <q-select v-model='formData.tipoDocumentoAfectado' :options="tipoDoc" :rules="[rulesValidation]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Número de Documento Afectado *</p>
                <q-input v-model='formData.numeroDocumentoAfectado' :rules="[(v: string) => lengthValidation(15, v), rulesValidation, alphanumeric]" dense label="Inserte" min="0" outlined
                         type="text"
                         @blur="getPersonProfile"
                         @keypress="Number(formData.tipoDocumentoAfectado) == 11 ? onlyAlphaNumeric : onlyNumbers"/>
              </div>
              <div class="tw-col-span-6">
                <label class="tw-text-label">Nombre del Afectado * ({{ formData.nombresAfectado?.length }}/200)</label>
                <q-input v-model='formData.nombresAfectado' :rules="[(v: string) => lengthValidation(200, v), inputRequired, alphabeticalWithSpecialCharacters]" dense label="Inserte"
                         outlined
                         @keypress="alphabeticalWithSpecialCharacters"/>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">¿Pertenece a la Comunidad LGBTIQ+? *</p>
                <q-select v-model='formData.lgtbtq'
                          :disable="[8, 9, 10, 13].includes(formData.tipoDocumentoAfectado)" :options="[{ label: 'No', value: false }, { label: 'Si', value: true }]"
                          :rules="[rulesValidation, (v: null) => v === null ? 'Este campo es requerido' : true]"
                          dense emit-value label="Seleccione" map-options
                          outlined/>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Sexo *</p>
                <q-select v-model='formData.sexo' :disable="[8, 9, 10, 13].includes(formData.tipoDocumentoAfectado)"
                          :options="generoOptions" :rules="[rulesValidation]" dense emit-value label="Seleccione" map-options
                          outlined/>
              </div>
              <div v-if="sexoSelecionado === 6" class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Otro ¿Cuál? *</p>
                <q-input v-model='formData.sexoCual' :rules="[(v: string) => lengthValidation(50, v), inputRequired, alphabeticalWithSpecialCharacters]" dense label="Inserte"
                         outlined
                         @keypress="alphabeticalWithSpecialCharacters"/>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Condición Especial *</p>
                <q-select v-model='formData.listadoCondiciones'
                          :disable="[8, 9, 10, 13].includes(formData.tipoDocumentoAfectado)" :options="listadoCondiciones" :rules="[rulesValidation]"
                          class="tw-rounded-lg" dense input-debounce="0" label="Seleccione" outlined>
                </q-select>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item default-opened header-class="tw-text-lg tw-font-bold"
                            label="Medios de Contacto y Envio de Respuesta (afectado)">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Canal de Entrada *</p>
                <q-select v-model='formData.canalEntrada' :options="listadoCanalesRadicacion" :rules="[rulesValidation]" dense disable
                          emit-value label="Seleccione" map-options outlined/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Correo Electrónico Afectado *
                  ({{ formData.correoAfectado?.length }}/100)</p>
                <q-input v-model='formData.correoAfectado' :rules="[rulesValidation, (v: string) => validationEmail(v), (v: string) => lengthValidation(200, v)
                ]" dense label="Inserte" outlined/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Teléfono Celular</p>
                <q-input v-model='formData.tlfCelularAfectado' :rules="[mobilePhonNumber, onlyNumbers, v => atLeastOnePhoneNumber(v, formData)]" dense label="Inserte" min="0"
                         outlined type="text"
                         @keypress="onlyNumber"/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Teléfono Fijo</p>
                <q-input v-model='formData.tlfFijoAfectado' :rules="[v => maxLengthInput(10, v), v => minLengthInput(7, v), onlyNumbers,v => atLeastOnePhoneNumber(v, formData)]" dense label="Inserte" min="0"
                         outlined
                         type="text"
                         @keypress="onlyNumber"/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">País *</p>
                <q-select v-model='formData.paisContacto' :options='paiseOptions' :rules="[rulesValidation]" dense
                          label="Seleccione" map-options outlined/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Departamento *</p>
                <q-select v-model='formData.departamentoContacto' :options='departmentsOptions' :rules="[rulesValidation]" dense
                          label="Seleccione" map-options outlined/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Municipio *</p>
                <q-select v-model='formData.ciudadContacto' :options='municipioOptions' :rules="[rulesValidation]" dense
                          label="Seleccione" map-options outlined/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Dirección del Afectado ({{
                    formData.direccionContacto?.length
                  }}/200)</p>
                <!-- @vue-expect-error -->
                <q-input ref="direccionContactoInput" v-model='formData.direccionContacto'
                         :rules="(formData.medioRespuestaContacto == 2 || formData.direccionContacto || !formData.correoAfectado)
                    ? [inputRequired, (v: string) => lengthValidation(200, v)]
                    : [true]" dense label="Inserte" outlined/>
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Medio que Autoriza para Envío de Respuesta *</p>
                <q-select ref="medioRespuestaContactoSelect" v-model='formData.medioRespuestaContacto' :options="listadoMediosRespuestaOptions"
                          :rules="[
                    (v: number) => v === 1 && formData.correoAfectado === '' ?
                      'Por favor diligencie correo electrónico del remitente para autorizar envío de respuesta por medio electrónico' : true,
                    (v: number) => v === 2 && formData.direccionContacto === '' ?
                      'Por favor diligencie dirección de remitente para autorizar envío de respuesta por este medio físico' : true,
                    inputRequired,
                  ]" dense emit-value label="Seleccione" map-options outlined/>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
        <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
          <q-expansion-item default-opened header-class="tw-text-lg tw-font-bold" label="Solicitud">
            <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2"></h2>
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipo de Solicitud *</p>
                <q-select v-model='formData.tipoSolicitud' :options="filteredSolicitudes" :rules="[rulesValidation]" dense emit-value
                          fill-input hide-selected label="Seleccione" map-options
                          outlined
                          use-input @filter="solicitudOptionsFilterFn" @update:model-value="updateAporteMedicina"/>
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Tipología de la PQRD *</p>
                <q-select
                  v-model='formData.tipologiaPQRD'
                  :disable="isAporteMedicina" :options="Number(formData.canalEntrada) === 2 ? listadoTipologiaOptions2 : Number(formData.canalEntrada) === 3 ? listadoTipologiaOptions3 : listadoTipologiaOptions4" :rules="[rulesValidation]" dense emit-value
                  label="Seleccione" map-options outlined/>
              </div>
              <div class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Producto *</p>
                <q-select v-model='formData.producto' :options="filteredProductos" :rules="[rulesValidation]" dense emit-value
                          fill-input hide-selected label="Seleccione" map-options
                          outlined
                          use-input @filter="productoOptionsFilterFn"/>
              </div>
              <div v-if="Number(formData.tipoSolicitud) === 14 && formData.canalEntrada == 2" class="tw-col-span-6">
                <span class="tw-w-full">
                  <label class="tw-text-label tw-font-semibold">Asignar Oficina *</label>
                  <q-select v-model="formData.oficinas" :options="filteredOficinas" :rules="[rulesValidation]" class="tw-rounded-lg" dense
                            fill-input hide-selected label="Seleccione" map-options
                            outlined
                            use-input @filter="selectOptionsFilterFn">
                  </q-select>
                </span>
              </div>
              <div v-if="Number(formData.tipoSolicitud) === 14" class="tw-col-span-6">
                <CommentTextArea v-model="formData.solicitudDetalle" :is-required="true" :max-length="500"
                                 label="Detalle"/>
              </div>
              <div class="tw-col-span-6 tw-mb-5">
                <CommentTextArea v-model="formData.observaciones" :is-required="true" :max-length="formData.canalEntrada == 2 ? 100000 : 10000"
                                 label="Observaciones"/>
              </div>
              <div v-if="formData.canalEntrada != 3" class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Adjuntar Documentos de Soporte</p>
                <FileLoader v-model:model-value="formData.files" :max-file-size="30 * 1024 * 1024"
                            :max-files="10" :rules="[]" accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                            max-file-size-label="30"
                            multiple
                            sub-title="Puede adjuntar (10) Archivo(s) cada uno con un tamaño permitido de 30MB en cualquiera de las siguientes extensiones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)" @rejected="rejectedFiles"/>
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </div>

    <div class="col col-12 row justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4">
      <q-btn class=" tw-rounded-xl tw-p-3 tw-w-[200px]" label="Cancelar" outline textColor="black"
             @click="cancelModal = true"/>
      <q-btn :loading="handleSubmitIsLoading" class="tw-rounded-xl tw-w-[200px]" color="primary" label="Radicar" textColor="white"
             type="submit" @click="submit"/>
    </div>

    <Modal v-model="cancelModal" :is-success="false" cancel-button text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?" textButton="Si"
           textButtonCancel="No" title="¡Espera un momento!"
           type="button"
           @handleAccept="onReset" @close-modal="cancelModal = false"/>

    <Modal v-model="cancelModalDireccion" :is-success="false" cancel-button
           text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?" textButton="Si" textButtonCancel="No" title="¡Espera un momento!"
           type="button"
           @handleAccept="clearDireccionForm" @close-modal="cancelModalDireccion = false, direccionModal = true"/>

    <q-dialog v-model="radicadoModal" persistent>
      <q-card class="tw-px-3 tw-h-[auto] tw-w-[450px]">
        <div class="tw-flex tw-justify-center tw-mt-3">
          <span class="tw-rounded-[50px] tw-flex tw-justify-center"
                style="background-color: rgba(0, 219, 0, 0.05); width: 130px; height: 82px">
            <img v-lazy :data-url="Check" alt="check" width="40">
          </span>
        </div>
        <q-card-section class="flex column justify-center items-center" q-card-section>
          <p class="tw-text-[24px] text-center tw-font-bold q-mt-xs">
            Radicación exitosa
          </p>
          <div class="tw-text-[18px] text-center tw-mt-3 tw-w-[370px]">
            <p class="tw-font-bold">Su solicitud se ha radicado con el código {{ responseId || 'ENT1251252141' }}</p>
            <p>La respuesta será enviada en plazos definidos por la ley al medio que nos indicó en su solicitud.</p>
            <p>Se envió a su correo una copia de su solicitud, pero también puede descargarla aquí.</p>
          </div>
          <div class="tw-flex tw-mt-8">
            <q-btn v-close-popup class="tw-p-3" color="accent" flat
                   label="Descargar" style="width: 200px; height: 50px;" text-color="black" @click="handleDownloadRadicacionDocument"/>
            <q-btn v-close-popup class="tw-rounded-xl tw-p-3" color="secondary" label="Finalizar"
                   style="width: 200px; height: 50px;" text-color="white" @click="handleCloseDownloadModal"/>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="direccionModal">
      <q-card :class="['tw-px-10 tw-py-6']" style="width: 1000px; max-width: 80vw;">
        <h3 class="text-bold text-grey-7 tw-text-2xl tw-flex-1 q-py-md q-px-sm">
          Dirección del Afectado
        </h3>
        <q-form ref="locationForm">
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">

            <div class="tw-col-span-2">
              <label class="q-px-md tw-mt-2 tw-text-label">Tipo de Via *
                <q-select v-model='direccionForm.tipoVia' :options="viasOp" :rules="[inputRequired]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>
            <div class="tw-col-span-2">
              <label class="q-px-md tw-mt-2 tw-text-label">Nombre o Número de Vía *
                <q-input v-model='direccionForm.nombreVia' :rules="[inputRequired, v => maxLengthInput(6, v)]" dense label="Inserte" outlined
                         @keypress="onlyAlphaNumeric2"/>
              </label>
            </div>
            <div class="tw-col-span-2 row">
              <q-checkbox v-model='direccionForm.bis1' class='tw-text-label' dense label="BIS"
                          size="sm" style="margin-top: -20px;"/>
              <label v-if="direccionForm.bis1" class="q-px-md tw-text-label">Indicativo BIS (Opcional)
                <q-input v-model='direccionForm.indBis1' :rules="[v => maxLengthInput(6, v)]" dense label="Inserte" outlined
                         @keypress="onlyAlphaNumeric2"/>
              </label>
            </div>

            <!-- ----------------------------------- -->

            <div class="tw-col-span-2">
              <label class="q-px-md tw-mt-2 tw-text-label">Cuadrante Vía Principal
                <q-select v-model='direccionForm.cuadrantePrincipal' :options="cuadranteOp" :rules="[]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>
            <div class="tw-col-span-2">
              <label class="q-px-md tw-mt-2 tw-text-label">Número de la Vía Generadora <span
                v-if="direccionForm.cuadrantePrincipal != ''">*</span>
                <q-input v-model='direccionForm.numeroViaGeneradora' :rules="direccionForm.cuadrantePrincipal != '' ? [inputRequired, v => maxLengthInput(6, v)] : [v => maxLengthInput(6, v)]" dense label="Inserte"
                         outlined/>
              </label>
            </div>
            <div class="tw-col-span-2 row">
              <q-checkbox v-model='direccionForm.bis2' class='tw-text-label' dense label="BIS"
                          size="sm" style="margin-top: -20px;"/>
              <label v-if="direccionForm.bis2" class="q-px-md tw-text-label">Indicativo BIS (Opcional)
                <q-input v-model='direccionForm.indBis2' :rules="[v => maxLengthInput(6, v)]" dense label="Inserte" outlined
                         @keypress="onlyAlphaNumeric2"/>
              </label>
            </div>

            <!-- ----------------------------------- -->

            <div class="tw-col-span-2">
              <label class="q-px-md tw-mt-2 tw-text-label">Número de la Placa
                <q-input v-model='direccionForm.numeroPlaca' :rules="[onlyNumbers, v => maxLengthInput(6, v)]" dense label="Inserte"
                         outlined/>
              </label>
            </div>

            <div class="tw-col-span-2">
              <label class="q-px-md tw-mt-2 tw-text-label">Cuadrante Vía Generadora
                <q-select v-model='direccionForm.cuadranteGeneradora' :options="cuadranteOp" :rules="[]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>

            <div class="tw-col-span-2">
              <label class="q-px-md tw-mt-2 tw-text-label">Complemento
                <q-select v-model='direccionForm.complemento' :options="complementosOp" :rules="[]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>

            <!-- ----------------------------------- -->

            <div class="tw-col-span-3">
              <label class="q-px-md tw-mt-2 tw-text-label">Barrio
                <q-select v-model='direccionForm.barrio' :options="barriosOp" :rules="[]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>

            <div class="tw-col-span-3">
              <label class="q-px-md tw-mt-2 tw-text-label">Nombre del Barrio <span
                v-if="direccionForm.barrio != ''">*</span></label>
              <q-input v-model='direccionForm.barrioNombre' :rules="direccionForm.barrio != '' ? [inputRequired, v => maxLengthInput(30, v)] : [v => maxLengthInput(30, v)]" dense label="Inserte"
                       outlined/>

            </div>


            <div class="tw-col-span-3">
              <label class="q-px-md tw-mt-2 tw-text-label">Urbanización
                <q-select v-model='direccionForm.urbanizacion' :options="urbanizacionOp" :rules="[]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>

            <div class="tw-col-span-3">
              <label class="q-px-md tw-mt-2 tw-text-label">Nombre de la Urbanización {{
                  (direccionForm.urbanizacion !=
                    '' && direccionForm.urbanizacion != null) ? '*' : ''
                }}</label>
              <q-input v-model='direccionForm.nombreUrbanizacion' :rules="direccionForm.urbanizacion != '' && direccionForm.urbanizacion != null ? [inputRequired, v => maxLengthInput(30, v)] : [v => maxLengthInput(30, v)]" dense label="Inserte"
                       outlined/>

            </div>

            <!-- ----------------------------------- -->

            <div class="tw-col-span-3 tw-mt-2">
              <label class="q-px-md tw-text-label">Manzana
                <q-select v-model='direccionForm.manzana' :options="manzanasOp" :rules="[]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>

            <div class="tw-col-span-3 tw-mt-2">
              <label class="q-px-md tw-text-label">Nombre de la Manzana {{
                  (direccionForm.manzana != '' &&
                    direccionForm.manzana != null) ? '*' : ''
                }}</label>
              <q-input v-model='direccionForm.nombreManzana' :rules="direccionForm.manzana != '' && direccionForm.manzana != null ? [inputRequired, v => maxLengthInput(30, v)] : [v => maxLengthInput(30, v)]" dense label="Inserte"
                       outlined/>
            </div>

            <div class="tw-col-span-3 tw-mt-2">
              <label class="q-px-md tw-text-label">Vereda
                <q-input v-model='direccionForm.vereda' :rules="[v => maxLengthInput(30, v)]" dense label="Inserte"
                         outlined/>
              </label>
            </div>

            <div class="tw-col-span-3 tw-mt-2">
              <label class="q-px-md tw-text-label">Corregimiento
                <q-input v-model='direccionForm.corregimiento' :rules="[v => maxLengthInput(30, v)]" dense label="Inserte"
                         outlined/>
              </label>
            </div>

            <div class="tw-col-span-3 tw-mt-2">
              <label class="q-px-md tw-text-label">Tipo Predio
                <q-select v-model='direccionForm.tipoPredio' :options="prediosOp" :rules="[]" dense emit-value
                          label="Seleccione" map-options outlined/>
              </label>
            </div>

            <div class="tw-col-span-3 tw-mt-2">
              <label class="q-px-md tw-text-label">Nombre de Predio {{
                  direccionForm.tipoPredio != '' &&
                  direccionForm.tipoPredio != null ? '*' : ''
                }} </label>
              <q-input v-model='direccionForm.nombrePredio' :rules="direccionForm.tipoPredio != '' && direccionForm.tipoPredio != null ? [inputRequired, v => maxLengthInput(30, v)] : [v => maxLengthInput(30, v)]" dense label="Inserte"
                       outlined/>

            </div>

          </div>
        </q-form>

        <q-card-actions align="center">
          <q-btn class="tw-w-48 tw-h-12" color="primary" flat label="Cancelar" @click="cancelModalDireccion = true"/>
          <q-btn class="tw-w-48 tw-h-12" color="primary" label="Guardar" @click="saveLocation"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import Check from 'src/assets/check.svg';
import {useRouter} from "vue-router";
import {onMounted, Ref, ref, watch} from 'vue';
import FileLoader from 'components/FormFields/FileLoader.vue';
import {adminAxios, sgdeaAxios} from 'src/services';
import {useMunicipalities} from 'src/composables/useVersion';
import {toast} from "src/helpers/toast";
import {DocumentoRadicado, SelectInput} from "src/interfaces";
import {useAuthStore} from "src/stores/auth.store";
import Modal from "components/Modal/Modal.vue";
import {
  alphabeticalWithSpecialCharacters,
  alphanumeric,
  inputRequired,
  maxLengthInput,
  minLengthInput,
  onlyNumbers,
  validationEmail
} from "src/helpers/validations";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import {getAcronimobyId} from 'src/helpers/prefijoTipoDoc';
import { toUpperCaseFormatted } from "src/composables/useVersion";


interface PQRD {
  tipoRemitente: string;
  tipoDocumentoRemitente: string;
  numeroDocumentoRemitente: string;
  nombresRemitente: string;
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombresAfectado: string;
  lgtbtq: boolean,
  sexo: string;
  sexoCual: string;
  condicionEspecial: any[];
  correoAfectado: string;
  tlfCelularAfectado: string;
  tlfFijoAfectado: string;
  paisContacto: string;
  departamentoContacto: any;
  ciudadContacto: any;
  remitenteAfectado: boolean,
  direccionContacto: string;
  medioRespuestaContacto: string;
  tipologiaPQRD: string;
  tipoSolicitud: string;
  producto: string;
  accesopPublico: boolean;
  descripcionAccesoInfo: string;
  observaciones: string;
  solicitudDetalle: string;
  listadoCondiciones: any[];
  files: any[];
  canalEntrada: number;
  oficinas: string;
}

const handleSubmitIsLoading = ref<boolean>(false)

const formData: Ref<PQRD> = ref({
  tipoRemitente: '',
  tipoDocumentoRemitente: '',
  numeroDocumentoRemitente: '',
  nombresRemitente: '',
  tipoDocumentoAfectado: '',
  numeroDocumentoAfectado: '',
  nombresAfectado: '',
  lgtbtq: null,
  sexo: '',
  sexoCual: '',
  condicionEspecial: [],
  correoAfectado: '',
  tlfCelularAfectado: '',
  tlfFijoAfectado: '',
  paisContacto: '',
  departamentoContacto: '',
  ciudadContacto: '',
  remitenteAfectado: false,
  direccionContacto: '',
  medioRespuestaContacto: '',
  tipologiaPQRD: '',
  tipoSolicitud: '',
  producto: '',
  accesopPublico: false,
  descripcionAccesoInfo: '',
  observaciones: '',
  solicitudDetalle: '',
  listadoCondiciones: [],
  files: [],
  canalEntrada: '',
  oficinas: ''
});

const router = useRouter()
const form = ref()
const radicadoModal = ref(false)
const paiseOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const generoOptions: Ref<any[]> = ref([])
const descripcionAcessInfoOptions: Ref<any[]> = ref([])
const listadoMediosRespuestaOptions: Ref<any[]> = ref([])
const listadoTipologiaOptions: Ref<any[]> = ref([])
const listadoTipologiaOptions2: Ref<any[]> = ref([])
const listadoTipologiaOptions3: Ref<any[]> = ref([])
const listadoTipologiaOptions4: Ref<any[]> = ref([])
const listadoCondiciones: Ref<any[]> = ref([])
const listadoTipoRemitente: Ref<any[]> = ref([])
const listadoProductosPQRD: Ref<any[]> = ref([])
const listadoTiposSolicitud: Ref<any[]> = ref([])
const listadoCanalesRadicacion: Ref<any[]> = ref([])
const listadoOficinas: Ref<any[]> = ref([])
const tipoDoc: Ref<SelectInput[]> = ref([]);
const filteredOficinas = ref<SelectInput[]>([]);
const filteredSolicitudes = ref<SelectInput[]>([]);
const filteredProductos = ref<SelectInput[]>([]);
const responseId = ref('')
const correoAfectado = ref('')
const departmentsOptions = ref([]);
const notChangeDep = ref(true)
const notChangePais = ref(true)
const isntColombia = ref(false)
const cancelModal = ref(false)
const cancelModalDireccion = ref(false)
const generatedDocId = ref<string | null>(null);
const MAX_FILE = 10
const medioRespuestaContactoSelect = ref(null)
const direccionContactoInput = ref(null)
const sexoSelecionado = ref<number | null>(null)
let ignoreRemitenteWatch = false;
const fieldsToWatch = [
  'tipoDocumentoRemitente',
  'nombresRemitente',
  'numeroDocumentoRemitente',
];
const auth = useAuthStore()
const isAporteMedicina = ref(false)
const direccionModal = ref(false)
const locationForm = ref()
const text = `
  <p>Su solicitud se ha radicado con el código ${responseId.value}</p>
  <p>La respuesta será enviada en plazos definidos por la ley al medio que nos indicó en su solicitud.</p>
  <p>Se envió a su correo una copia de su solicitud, pero también puede descargarla aquí.</p>
`;


const direccionForm = ref({
  tipoVia: '',
  nombreVia: '',
  bis1: false,
  indBis1: '',
  cuadrantePrincipal: null,
  numeroViaGeneradora: '',
  bis2: false,
  indBis2: '',
  numeroPlaca: '',
  cuadranteGeneradora: null,
  complemento: null,
  barrio: null,
  barrioNombre: '',
  urbanizacion: null,
  nombreUrbanizacion: '',
  manzana: null,
  nombreManzana: '',
  vereda: '',
  corregimiento: '',
  tipoPredio: null,
  nombrePredio: ''
})

const clearDireccionForm = async () => {
  formData.value.direccionContacto = ''
  direccionForm.value = {
    tipoVia: '',
    nombreVia: '',
    bis1: false,
    indBis1: '',
    cuadrantePrincipal: '',
    numeroViaGeneradora: '',
    bis2: false,
    indBis2: '',
    numeroPlaca: '',
    cuadranteGeneradora: '',
    complemento: '',
    barrio: '',
    barrioNombre: '',
    urbanizacion: '',
    nombreUrbanizacion: '',
    manzana: '',
    nombreManzana: '',
    vereda: '',
    corregimiento: '',
    tipoPredio: '',
    nombrePredio: ''
  }
  direccionModal.value = false
}

const viasOp = ref([
  {label: 'Autopista', value: 'AU'},
  {label: 'Avenida', value: 'AV'},
  {label: 'Avenida Calle', value: 'AC'},
  {label: 'Avenida Carrera', value: 'AK'},
  {label: 'Bulevar', value: 'BL'},
  {label: 'Calle', value: 'CL'},
  {label: 'Carrera', value: 'KR'},
  {label: 'Carretera', value: 'CT'},
  {label: 'Circular', value: 'CQ'},
  {label: 'Circunvalar', value: 'CV'},
  {label: 'Cuentas Corridas', value: 'CC'},
  {label: 'Diagonal', value: 'DG'},
  {label: 'Pasaje', value: 'PJ'},
  {label: 'Paseo', value: 'PS'},
  {label: 'Peatonal', value: 'PT'},
  {label: 'Transversal', value: 'TV'},
  {label: 'Troncal', value: 'TC'},
  {label: 'Variante', value: 'VT'},
  {label: 'Vía', value: 'VI'}
]);

const cuadranteOp = ref([
  {label: '-', value: ''},
  {label: 'Este', value: 'ESTE'},
  {label: 'Norte', value: 'NORTE'},
  {label: 'Oeste', value: 'OESTE'},
  {label: 'Sur', value: 'SUR'}
]);

const complementosOp = ref([
  {label: '-', value: ''},
  {label: 'Administración', value: 'AD'},
  {label: 'Agrupación', value: 'AG'},
  {label: 'Altillo', value: 'AL'},
  {label: 'Apartamento', value: 'AP'},
  {label: 'Barrio', value: 'BR'},
  {label: 'Bloque', value: 'BQ'},
  {label: 'Bodega', value: 'BG'},
  {label: 'Casa', value: 'CS'},
  {label: 'Célula', value: 'CU'},
  {label: 'Centro Comercial', value: 'CE'},
  {label: 'Ciudadela', value: 'CD'},
  {label: 'Conjunto Residencial', value: 'CO'},
  {label: 'Consultorio', value: 'CN'},
  {label: 'Corregimiento', value: 'C'},
  {label: 'Deposito', value: 'DP'},
  {label: 'Deposito Sótano', value: 'DS'},
  {label: 'Edificio', value: 'ED'},
  {label: 'Entrada', value: 'EN'},
  {label: 'Esquina', value: 'EQ'},
  {label: 'Estación', value: 'ES'},
  {label: 'Etapa', value: 'ET'},
  {label: 'Exterior', value: 'EX'},
  {label: 'Finca', value: 'FI'},
  {label: 'Garaje', value: 'GA'},
  {label: 'Garaje Sótano', value: 'GS'},
  {label: 'Interior', value: 'IN'},
  {label: 'Kilómetro', value: 'KM'},
  {label: 'Local', value: 'LC'},
  {label: 'Local Mezzanine', value: 'LM'},
  {label: 'Lote', value: 'LT'},
  {label: 'Manzana', value: 'MZ'},
  {label: 'Mezzanine', value: 'MN'},
  {label: 'Módulo', value: 'MD'},
  {label: 'Oficina', value: 'OF'},
  {label: 'Parque', value: 'PQ'},
  {label: 'Parqueadero', value: 'PA'},
  {label: 'Pent-House', value: 'PN'},
  {label: 'Piso', value: 'PI'},
  {label: 'Planta', value: 'PL'},
  {label: 'Porteria', value: 'PR'},
  {label: 'Predio', value: 'PD'},
  {label: 'Puesto', value: 'PU'},
  {label: 'Round Point', value: 'RP'},
  {label: 'Sector', value: 'SC'},
  {label: 'Semisótano', value: 'SS'},
  {label: 'Sótano', value: 'SO'},
  {label: 'Suite', value: 'ST'},
  {label: 'Supermanzana', value: 'SM'},
  {label: 'Terraza', value: 'TZ'},
  {label: 'Torre', value: 'TO'},
  {label: 'Unidad', value: 'UN'},
  {label: 'Unidad Residencial', value: 'UL'},
  {label: 'Urbanización', value: 'UR'},
  {label: 'Vereda', value: 'VRD'},
  {label: 'Zona', value: 'ZN'}
]);

const barriosOp = ref([
  {label: '-', value: ''},
  {label: 'Barrio', value: 'BR'},
  {label: 'Ciudadela', value: 'CD'},
  {label: 'Supermanzana', value: 'SM'}
]);

const urbanizacionOp = ref([
  {label: '-', value: ''},
  {label: 'Bloque', value: 'BQ'},
  {label: 'Célula', value: 'CU'},
  {label: 'Conjunto Residencial', value: 'CO'},
  {label: 'Etapa', value: 'ET'},
  {label: 'Urbanización', value: 'UR'},
  {label: 'Sector', value: 'SC'},
  {label: 'Torre', value: 'TO'},
  {label: 'Zona', value: 'ZN'}
]);

const manzanasOp = [
  {label: '-', value: ''},
  {label: 'Manzana', value: 'MZ'},
  {label: 'Interior', value: 'IN'},
  {label: 'Sector', value: 'SC'},
  {label: 'Etapa', value: 'ET'},
  {label: 'Edificio', value: 'ED'},
  {label: 'Módulo', value: 'MD'},
  {label: 'Torre', value: 'TO'}
];

const prediosOp = [
  {label: '-', value: ''},
  {label: 'Altillo', value: 'AL'},
  {label: 'Apartamento', value: 'AP'},
  {label: 'Bodega', value: 'BG'},
  {label: 'Casa', value: 'CS'},
  {label: 'Consultorio', value: 'CN'},
  {label: 'Deposito', value: 'DP'},
  {label: 'Deposito Sótano', value: 'DS'},
  {label: 'Garaje', value: 'GA'},
  {label: 'Garaje Sótano', value: 'GS'},
  {label: 'Local', value: 'LC'},
  {label: 'Local Mezzanine', value: 'LM'},
  {label: 'Lote', value: 'LT'},
  {label: 'Mezzanine', value: 'MN'},
  {label: 'Oficina', value: 'OF'},
  {label: 'Parqueadero', value: 'PA'},
  {label: 'Pent-House', value: 'PN'},
  {label: 'Planta', value: 'PL'},
  {label: 'Predio', value: 'PD'},
  {label: 'Semisótano', value: 'SS'},
  {label: 'Sótano', value: 'SO'},
  {label: 'Suite', value: 'ST'},
  {label: 'Terraza', value: 'TZ'},
  {label: 'Unidad', value: 'UN'},
  {label: 'Unidad Residencial', value: 'UL'}
];


onMounted(async () => {
  formData.value.canalEntrada = auth.$state.userInfo.role == 'Radicador - Contact Center' ? 3 : 2
  await loadPaises()
  await loadTipoDoc()
  await loadGenero()
  await loadDescripcionAcessInfo()
  await loadListadosMediosRepuesta()
  await loadListadoTipologia()
  await loadListadoTipoRemitente()
  await loadListadoCanalesRadicacion()
  await loadListadoOficinas()
  await loadListadoCondiciones()
  await loadListadoProductosPQRD()
  await loadListadoTiposSolicitud()
})

async function loadTipoDoc() {
  const {data} = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion");
  tipoDoc.value = [
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.id,
      };
    }),
  ];

  tipoDoc.value = tipoDoc.value.filter((e) => {
    return e.value !== 12
  })
}

async function loadPaises() {
  const {data} = await adminAxios.get("/paises/list");
  paiseOptions.value = [
    ...data.map((val: any) => {
      return {
        label: toUpperCaseFormatted(val.nombre),
        value: val.idPais,
      };
    }).sort((a, b) => a.label.localeCompare(b.label)),
  ];

  formData.value.paisContacto = paiseOptions.value.find(val => val.value === 425)
}

async function loadGenero() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoGenero");

    if (response.status == 200 || response.status == 201) {
      generoOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        };
      }).sort((a, b) => a.label.localeCompare(b.label));
    }

    // Asignar el primer valor al formulario

  } catch (error) {
    console.error(error);
  }
}

async function loadDescripcionAcessInfo() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoDescripcionAccesoInfo")

    if (response.status == 200 || response.status == 201) {
      descripcionAcessInfoOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    }

    formData.value.descripcionAccesoInfo = descripcionAcessInfoOptions.value[0].value;

  } catch (error) {
    console.error(error);
  }
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
    console.error(error);
  }
}

async function loadListadoTipologia() {
  try {
    const response = await sgdeaAxios.get(`/pqrd/listadoTipologia?filterType=0&pqrdId=0&canalEntrada=${formData.value.canalEntrada}`)

    if (response.status == 200 || response.status == 201) {
      listadoTipologiaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

    listadoTipologiaOptions2.value = listadoTipologiaOptions.value.filter((e) => {
      return e.value !== 8
    })

    listadoTipologiaOptions3.value = listadoTipologiaOptions.value.filter((e) => {
      return e.value !== 7 && e.value !== 2
    })

    listadoTipologiaOptions4.value = listadoTipologiaOptions.value.filter((e) => {
      return e.value !== 7 && e.value !== 8
    })

  } catch (error) {
    console.error(error);
  }
}

async function loadListadoTipoRemitente() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTiposRemitente")

    if (response.status == 200 || response.status == 201) {
      listadoTipoRemitente.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

  } catch (error) {
    console.error(error);
  }
}

async function loadListadoCondiciones() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoCondiciones")

    if (response.status == 200 || response.status == 201) {
      listadoCondiciones.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

  } catch (error) {
    console.error(error);
  }
}

async function loadListadoProductosPQRD() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoProductosPQRD")

    if (response.status == 200 || response.status == 201) {
      listadoProductosPQRD.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    }

    filteredProductos.value = listadoProductosPQRD.value

  } catch (error) {
    console.error(error);
  }
}

async function loadListadoTiposSolicitud() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTiposSolicitud")

    if (response.status == 200 || response.status == 201) {
      listadoTiposSolicitud.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      })
    }

    listadoTiposSolicitud.value = listadoTiposSolicitud.value.filter(e => e.value !== 2)

  } catch (error) {
    console.error(error);
  }
}

const saveLocation = async () => {
  if (await locationForm.value.validate()) {
    var location = ''
    for (let propiedad in direccionForm.value) {
      if (propiedad == 'bis1' || propiedad == 'bis2') {
        if (direccionForm.value[propiedad] == true) {
          location = location + ' BIS'
        }
        if (propiedad == 'bis1' && !direccionForm.value[propiedad]) {
          direccionForm.value.indBis1 = ''
        }
        if (propiedad == 'bis2' && !direccionForm.value[propiedad]) {
          direccionForm.value.indBis2 = ''
        }
      } else {
        if (direccionForm.value[propiedad] != '') {
          location = location + ' ' + direccionForm.value[propiedad]
        }
      }
    }
    formData.value.direccionContacto = location
    direccionModal.value = false
  } else {
    toast.error("Para continuar, Asegúrese de que todos los campos obligatorios estén completos")
  }
}

async function loadListadoCanalesRadicacion() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoCanalesRadicacion")

    if (response.status == 200 || response.status == 201) {
      listadoCanalesRadicacion.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id
        }
      }).sort((a, b) => a.label.localeCompare(b.label))
    }

    listadoCanalesRadicacion.value = listadoCanalesRadicacion.value.filter((e) => {
      return e.value !== 1 && e.value !== 4 && e.value !== 5
    })
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoOficinas() {
  try {
    const response = await sgdeaAxios.get("/oficinas/oficinasSeries")

    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data
      .filter((e: any) => e.origen === 'oficina')
        .map((e: any) => ({
          label: e.nombre,
          value: e.id_original
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) // Orden alfabético
    }

    // Lista de IDs de oficinas que quieres excluir
    // const idsAExcluir = [7, 8, 9, 10, 11, 12, 14] Agrega aquí los IDs que quieres excluir
    listadoOficinas.value = listadoOficinas.value
    filteredOficinas.value = listadoOficinas.value
  } catch (error) {
    console.error(error);
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredOficinas.value = listadoOficinas.value
    })
    return
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const solicitudOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredSolicitudes.value = listadoTiposSolicitud.value
    })
    return
  }
  update(() => {
    filteredSolicitudes.value = listadoTiposSolicitud.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const productoOptionsFilterFn = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredProductos.value = listadoProductosPQRD.value
    })
    return
  }
  update(() => {
    filteredProductos.value = listadoProductosPQRD.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const sortOptions = (vals: any[]) => {
  return vals.sort((leftItem: { label: string; }, rightItem: { label: string; }) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

function onReset() {
  formData.value = {
    tipoRemitente: null,
    tipoDocumentoRemitente: '',
    numeroDocumentoRemitente: '',
    nombresRemitente: '',
    tipoDocumentoAfectado: '',
    numeroDocumentoAfectado: '',
    nombresAfectado: '',
    lgtbtq: false,
    sexo: '',
    sexoCual: '',
    condicionEspecial: [],
    correoAfectado: '',
    tlfCelularAfectado: '',
    tlfFijoAfectado: '',
    paisContacto: '',
    departamentoContacto: '',
    ciudadContacto: '',
    remitenteAfectado: false,
    direccionContacto: '',
    medioRespuestaContacto: '',
    tipologiaPQRD: '',
    tipoSolicitud: '',
    producto: '',
    accesopPublico: false,
    descripcionAccesoInfo: '',
    observaciones: '',
    solicitudDetalle: '',
    listadoCondiciones: [],
    files: [],
    canalEntrada: '',
    oficinas: ''
  }

  // @ts-ignore
  router.go()
};

const handleDownloadRadicacionDocument = async () => {
  handleSubmitIsLoading.value = true
  try {
    const {data: listDocs} = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${generatedDocId.value}`
    );

      const docRadicado = listDocs.list.entries?.find(
      (it) => {
        const entryName = it.entry.name;
        return entryName && entryName.startsWith(responseId.value);
      }
    );

    const {data} = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${docRadicado.entry.id}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/pdf'});

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = String(responseId.value);

    link.click();

    URL.revokeObjectURL(blobUrl);

    location.reload()
  } catch (error) {
    toast.error('Ocurrió un error inesperado.');
  }
};

const rejectedFiles = (error: any[]) => {
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-file-size')) {
    toast.error('El peso permitido es hasta 30MB.')
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'max-files')) {
    toast.error(`Solo se pueden adjuntar ${MAX_FILE} archivos.`)
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'duplicate')) {
    toast.error('Archivo duplicado.')
  }
}

const handleCloseDownloadModal = () => {
  location.reload()
}

watch(() => formData.value.sexo, (newValue, oldValue) => {
  const selectedOption = generoOptions.value.find(option => option.value === newValue);
  if (selectedOption) {
    sexoSelecionado.value = selectedOption.value
  }
});

watch(
  () => formData.value.departamentoContacto,
  async (value) => {
    //@ts-ignore
    if (!isntColombia.value) {
      formData.value.ciudadContacto = ''
    }
    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    municipioOptions.value = sortOptions(optionsMunicipalities.value)
    if (municipioOptions.value?.length === 0) {
        formData.value.ciudadContacto = value;
    }
  }
);

watch(
  () => formData.value.paisContacto,
  async (pais) => {
    formData.value.departamentoContacto = null;
    formData.value.ciudadContacto = null;

    if (!pais || !pais.label) return;

    const countryLabel = pais.label.toLowerCase().trim();

    const deptos = await getDepartamentos(pais.value);
    departmentsOptions.value = deptos;
    if (countryLabel === 'colombia') {
      isntColombia.value = false;
    } else {
      isntColombia.value = true;
      if (departmentsOptions.value?.length === 0) {
        // @ts-ignore
        formData.value.departamentoContacto = pais;
        // @ts-ignore
        formData.value.ciudadContacto = pais;
      }
    }
  }
);


watch(
  () => fieldsToWatch.map(field => formData.value[field]),
  (newValues) => {
    if (formData.value.remitenteAfectado) {
      formData.value.tipoDocumentoAfectado = newValues[0];
      formData.value.nombresAfectado = newValues[1];
      formData.value.numeroDocumentoAfectado = newValues[2];
    }
  }
);
// Main watcher for the checkbox (remitenteAfectado)
watch(
  () => formData.value.remitenteAfectado,
  async (value) => {
    if (ignoreRemitenteWatch) {
      ignoreRemitenteWatch = false;
      return;
    }
    if (value) {
      const hasData =
        formData.value.numeroDocumentoRemitente &&
        formData.value.tipoDocumentoRemitente;

      if (!hasData) return;
      await getPerson();

      formData.value.tipoDocumentoAfectado = formData.value.tipoDocumentoRemitente;
      formData.value.numeroDocumentoAfectado = formData.value.numeroDocumentoRemitente;
      formData.value.nombresAfectado = formData.value.nombresRemitente;
    } else {
      formData.value.tipoDocumentoAfectado = "";
      formData.value.numeroDocumentoAfectado = "";
      formData.value.nombresAfectado = "";
      formData.value.sexo = "";
      formData.value.sexoCual = "";
      formData.value.lgtbtq = null;
      formData.value.condicionEspecial = [];
      formData.value.direccionContacto = "";
      formData.value.departamentoContacto = "";
      formData.value.ciudadContacto = "";
      formData.value.tlfFijoAfectado = "";
      formData.value.correoAfectado = "";
    }
  }
);

// Watcher for manual changes in numeroDocumentoAfectado
watch(
  () => formData.value.numeroDocumentoAfectado,
  (newVal) => {
    const isEqual = newVal === formData.value.numeroDocumentoRemitente;

    if (isEqual && !formData.value.remitenteAfectado) {
      ignoreRemitenteWatch = true;
      formData.value.remitenteAfectado = true;
    }

    if (!isEqual && formData.value.remitenteAfectado) {
      ignoreRemitenteWatch = true;
      formData.value.remitenteAfectado = false;
    }
  }
);

// Watcher to update affected person data when numeroDocumentoRemitente changes
watch(
  () => formData.value.numeroDocumentoRemitente,
  async () => {
    if (formData.value.remitenteAfectado) {
      await getPerson();

      formData.value.tipoDocumentoAfectado = formData.value.tipoDocumentoRemitente;
      formData.value.numeroDocumentoAfectado = formData.value.numeroDocumentoRemitente;
      formData.value.nombresAfectado = formData.value.nombresRemitente;
    }
  }
);

watch(() => formData.value.tipoSolicitud, async (v) => {
  if (Number(formData.value.tipoSolicitud) == 14) {
    formData.value.oficinas = 15

  }
})

watch(() => formData.value.tipoDocumentoAfectado, () => {
  if ([8, 9, 10, 13].includes(formData.value.tipoDocumentoAfectado)) {
    formData.value.lgtbtq = false
    formData.value.sexo = 1
    formData.value.listadoCondiciones = {label: "No aplica", value: 1}
  } else {
    formData.value.lgtbtq = ''
    formData.value.sexo = ''
    formData.value.listadoCondiciones = ''
    form.value.reset()
  }
})

const submit = async () => {
  if (await form.value.validate()) {
    handleSubmitIsLoading.value = true;

    const newPqrd2 = new FormData();
    newPqrd2.append('datosRemitenteTipoRemitenteId', formData.value.tipoRemitente);
    // @ts-ignore
    newPqrd2.append('datosRemitenteTipoDocumentoId', formData.value.tipoDocumentoRemitente || 12);
    newPqrd2.append('datosRemitenteNumeroDocumento', formData.value.numeroDocumentoRemitente);
    newPqrd2.append('datosRemitenteNombre', formData.value.nombresRemitente);
    newPqrd2.append('datosAfectadoTipoDocumentoId', formData.value.tipoDocumentoAfectado);
    newPqrd2.append('datosAfectadoNumeroDocumento', formData.value.numeroDocumentoAfectado);
    newPqrd2.append('datosAfectadoNombre', formData.value.nombresAfectado);
    if (![8, 9, 10, 13].includes(Number(formData.value.tipoDocumentoAfectado))) {
      const lgtbtqValue = formData.value.lgtbtq ? 'true' : 'false';
      const generoValue = String(formData.value.sexo);

      newPqrd2.append('datosAfectadoLgtbtq', lgtbtqValue);
      newPqrd2.append('datosAfectadoGeneroId', generoValue);
    }
    if (formData.value.sexoCual) {
      newPqrd2.append('datosAfectadoGeneroOtro', formData.value.sexoCual);
    }

    newPqrd2.append('datosAfectadoCorreoElectronico', formData.value.correoAfectado);

    if (formData.value.tlfCelularAfectado && formData.value.tlfCelularAfectado !== '') {
      newPqrd2.append('datosAfectadoTelefonoCelular', formData.value.tlfCelularAfectado);
    }

    if (formData.value.tlfFijoAfectado && formData.value.tlfFijoAfectado !== '') {
      newPqrd2.append('datosAfectadoTelefonoFijo', formData.value.tlfFijoAfectado);
    }

    //@ts-ignore
    newPqrd2.append('datosAfectadoPaisIdPais', formData.value.paisContacto.value);
    //@ts-ignore
    newPqrd2.append('datosAfectadoDepartamentoIdDepartamento', formData.value.departamentoContacto.value);
    //@ts-ignore
    newPqrd2.append('datosAfectadoMunicipioIdMunicipio', formData.value.ciudadContacto.value);
    newPqrd2.append('datosAfectadoDireccion', formData.value.direccionContacto);
    newPqrd2.append('datosAfectadoMedioRespuestaId', formData.value.medioRespuestaContacto);
    if (formData.value.tipologiaPQRD && formData.value.tipologiaPQRD !== '') {
      newPqrd2.append('solicitudTipoPqrdId', formData.value.tipologiaPQRD);
    }
    newPqrd2.append('solicitudTipoSolicitudId', formData.value.tipoSolicitud);
    newPqrd2.append('solicitudTipoproductoId', formData.value.producto);
    // @ts-ignore
    newPqrd2.append('solicitudAccesoInformacionPublica', formData.value.accesopPublico);
    newPqrd2.append('solicitudDescripcionAccesoInformacionId', formData.value.descripcionAccesoInfo);
    newPqrd2.append('solicitudObservaciones', formData.value.observaciones);
    //@ts-ignore
    newPqrd2.append('solicitudDetalle', formData.value.solicitudDetalle);
    newPqrd2.append('usuarioCreador', auth.$state.userInfo.name);
    newPqrd2.append('canalRadicacion', formData.value.canalEntrada);

    if (Number(formData.value.tipoSolicitud) == 14) {
      //@ts-ignore
      newPqrd2.append('oficina', 15);
    } else {
      //@ts-ignore
      newPqrd2.append('oficina', formData.value.oficinas.value || 26);
    }

    newPqrd2.append('detalleAfectado', '');
    //@ts-ignore
    let idCondiciones = [formData.value.listadoCondiciones.value];
    // @ts-ignore
    newPqrd2.append('listadoCondiciones', `[${idCondiciones}]`);

    if (formData.value.files?.length) {
      for (let i = 0; i < formData.value.files?.length; i++) {
        newPqrd2.append('files', formData.value.files[i]);
      }
    }

    correoAfectado.value = formData.value.correoAfectado

    try {
      const response = await sgdeaAxios.post("/pqrd/radicar-pqrd", newPqrd2)
      if (response.data) {
        responseId.value = response.data.idRadicado
        generatedDocId.value = response.data.nodeId
        radicadoModal.value = true
        handleSubmitIsLoading.value = false

        const dataTrazabilidad = {
          proceso: `PQRD${response.data.id}`,
          secuencia: response.data.idRadicado,
          estado: response.data.estado.estado,
          descripcion: `Usuario: ${auth.$state.userInfo.name} Rol: ${auth.$state.userInfo.role} Descripción: Se ha radicado una PQRD`,
          comentario: 'Radicado',
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha radicado la PQRD ${response.data.idRadicado}`,
          tramite: response.data.solicitud.tipoPqrd?.id == 7 ? 'PQRD Express' : 'PQRD',
        }
        const crearTrazabilidad = await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad)
      }
    } catch (error) {
      toast.error("Ha ocurrido un error")
      handleSubmitIsLoading.value = false;
    }
  } else {
    return toast.error("Para continuar, Asegúrese de que todos los campos obligatorios estén completos")
  }
}

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

function onlyAlphaNumeric(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;

  // Convert the charCode to a String
  let charTyped = String.fromCharCode(charCode);

  // Define a regex for alphanumeric characters and Spanish special characters
  let regex = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚÑñ#-]*$/;

  // Check if the character matches the regex
  if (regex.test(charTyped)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

function onlyAlphaNumeric2(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;

  // Convert the charCode to a String
  let charTyped = String.fromCharCode(charCode);

  // Define a regex for alphanumeric characters and Spanish special characters
  let regex = /^[a-zA-Z0-9 áéíóúÁÉÍÓÚÑñ]*$/;

  // Check if the character matches the regex
  if (regex.test(charTyped)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

function onlyNumber(event: { keyCode: any; which: any; preventDefault: () => void; }) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if ((keyCode >= 48 && keyCode <= 57)) {
    return true;
  }
  event.preventDefault();
  return false;
}

const mobilePhonNumber = (val: any) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{8}$/;
  if (val) {
    if (val[0] != '3') {
      return "El número de teléfono celular debe iniciar por el número (3)"
    } else if (val?.length == 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (30)";
    } else if (!expresionRegular.test(val)) {
      return "El número de teléfono celular debe contener 10 dígitos";
    }
  }
};

const lengthValidation = (n, val: string) => val?.length <= n || "Máximo " + n + " caracteres"
const updateAporteMedicina = (v) => {
  if (v == 2 || v == 7) {
    isAporteMedicina.value = true
    formData.value.tipologiaPQRD = ''
  } else {
    isAporteMedicina.value = false
  }
}


async function getPersonProfile() {
  const tipoDoc = getAcronimobyId(Number(formData.value.tipoDocumentoAfectado))
  const number = Number(formData.value.tipoDocumentoAfectado) ? Number(formData.value.numeroDocumentoAfectado) : ''
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

      formData.value.nombresAfectado = fullName
      formData.value.sexo = response.data.genero
      formData.value.sexoCual = response.data.otroGenero
      formData.value.lgtbtq = response.data.lgtbtq
      formData.value.condicionEspecial = response.data.isCondicionEspecial
      formData.value.direccionContacto = response.data.direccion
      formData.value.departamentoContacto = {
        label: response.data.departamento.nombre,
        value: response.data.departamento.idDepartamento
      }
      setTimeout(() => {
        formData.value.ciudadContacto = {
          label: response.data.municipio.nombre,
          value: response.data.municipio.idMunicipio
        }
      });
      formData.value.tlfFijoAfectado = response.data.telefono
      formData.value.correoAfectado = response.data.email


      notChangeDep.value = false
      notChangePais.value = false

    } else {
      await cleanExternal()
    }
  } catch (error) {
    console.error(error);
    await cleanExternal()
  }
}

const cleanExternal = async () => {
  formData.value.nombresAfectado = ''
  formData.value.lgtbtq = null
  formData.value.sexo = ''
  formData.value.sexoCual = ''
  formData.value.condicionEspecial = null
  formData.value.direccionContacto = ''
  formData.value.departamentoContacto = ''
  formData.value.ciudadContacto = ''
  formData.value.correoAfectado = ''
  await PQRD.value.reset()
}

async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(formData.value.tipoDocumentoRemitente))
  const number = Number(formData.value.tipoDocumentoRemitente) ? Number(formData.value.numeroDocumentoRemitente) : ''
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

      formData.value.nombresRemitente = fullName
      if (formData.value.remitenteAfectado) {

        formData.value.sexo = response.data.genero
        formData.value.sexoCual = response.data.otroGenero
        formData.value.lgtbtq = response.data.lgtbtq
        formData.value.condicionEspecial = response.data.isCondicionEspecial
        formData.value.direccionContacto = response.data.direccion
        formData.value.departamentoContacto = {
          label: response.data.departamento.nombre,
          value: response.data.departamento.idDepartamento
        }
        setTimeout(() => {
          formData.value.ciudadContacto = {
            label: response.data.municipio.nombre,
            value: response.data.municipio.idMunicipio
          }
        });
        formData.value.tlfFijoAfectado = response.data.telefono
        formData.value.correoAfectado = response.data.email
      }
    }
  } catch (error) {
    console.error(error);
  }
}

const atLeastOnePhoneNumber = (value, formData) => {
  if (!formData.tlfCelularAfectado && !formData.tlfFijoAfectado) {
    return 'Debe digitar al menos un número de teléfono (celular o fijo)';
  }
  return true;
};

const normalizeForSort = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const getDepartamentos = async (paisId: number) => {
  const response = await sgdeaAxios.get(`/geodivision/pais/${paisId}`);
  if (response.status === 200) {
    const { data } = response;
    return data
      .map(depto => ({
        value: depto.idDepartamento,
        label: toUpperCaseFormatted(depto.nombre),
      }))
      .sort((a, b) => normalizeForSort(a.label).localeCompare(normalizeForSort(b.label), 'es', { sensitivity: 'base' }));
  }
  return [];
};

</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
