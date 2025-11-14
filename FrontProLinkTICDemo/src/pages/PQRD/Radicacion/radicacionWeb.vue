<template>
  <div class="flex tw-flex-col tw-bg-[#f5f7fb]">
    <div class="tw-max-w-[90%] md:tw-max-w-[78%] tw-mx-auto tw-my-0 tw-w-full">
      <div>
        <div class="tw-mb-6">
          <p class="pl-4 tw-font-bold tw-text-3xl tw-mt-5 tw-mb-3 text-bold">
            Radicar PQRD
          </p>
          <p class="tw-text-label tw-text-[16px]">
            Positiva recibirá y responderá en los tiempos definidos por la ley a
            los medios de contacto suministrados
          </p>
        </div>

        <q-form
          ref="form"
          @submit.prevent="submit"
          class="[&>*]:tw-mb-4"
          greedy
        >
          <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
            <q-expansion-item
              label="Datos del remitente"
              default-opened
              header-class="tw-text-lg tw-font-bold"
            >
              <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
                <div class="tw-col-span-4">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de Remitente *
                  </p>
                  <q-select
                    :options="listadoTipoRemitente"
                    map-options
                    emit-value
                    outlined
                    v-model="formData.tipoRemitente"
                    label="Seleccione"
                    dense
                    :rules="[rulesValidation]"
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de documento del remitente
                  </p>
                  <q-select
                    :options="tipoDoc"
                    map-options
                    emit-value
                    outlined
                    v-model="formData.tipoDocumentoRemitente"
                    label="Seleccione"
                    dense
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">
                    Número de documento del remitente
                  </p>
                  <q-input
                    type="text"
                    min="0"
                    outlined
                    v-model="formData.numeroDocumentoRemitente"
                    label="Inserte"
                    dense
                    :rules="[v => lengthValidation(15, v), Number(formData.tipoDocumentoRemitente) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
                    @keypress="
                      Number(formData.tipoDocumentoRemitente) == 11
                        ? onlyAlphaNumeric
                        : onlyNumbers
                    "
                    @blur="getPerson"
                  />
                </div>
                <div class="tw-col-span-4">
                  <label class="tw-text-label"
                    >Nombre del Remitente * ({{
                      formData.nombresRemitente?.length
                    }}/200)</label
                  >
                  <q-input
                    outlined
                    v-model="formData.nombresRemitente"
                    label="Inserte"
                    dense
                    :rules="[
                      (v) => lengthValidation(200, v),
                      rulesValidation,
                      alphabeticalWithSpecialCharacters,
                    ]"
                    @keypress="alphabeticalWithSpecialCharacters"
                  />
                </div>
                <div class="tw-col-span-4">
                  <q-checkbox
                    v-model="formData.remitenteAfectado"
                    class="tw-text-slate-600 tw-font-semibold tw-border tw-border-slate-300 tw-pl-3 tw-pr-6 tw-rounded-md tw-p-3"
                    label="Los datos del remitente son los mismos del afectado"
                    dense
                    size="md"
                  />
                </div>
              </div>
            </q-expansion-item>
          </q-card>

          <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
            <q-expansion-item
              label="Datos del Afectado"
              default-opened
              header-class="tw-text-lg tw-font-bold"
            >
              <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo Documento Afectado *
                  </p>
                  <q-select
                    :options="tipoDoc"
                    map-options
                    emit-value
                    :rules="[rulesValidation]"
                    outlined
                    v-model="formData.tipoDocumentoAfectado"
                    label="Seleccione"
                    dense
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">
                    Número de Documento Afectado *
                  </p>
                  <q-input
                    type="text"
                    min="0"
                    outlined
                    v-model="formData.numeroDocumentoAfectado"
                    label="Inserte"
                    dense
                    :rules="[v => lengthValidation(15, v), Number(formData.tipoDocumentoRemitente) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]"
                    @keypress="
                      Number(formData.tipoDocumentoRemitente) == 11
                        ? onlyAlphaNumeric
                        : onlyNumbers
                    "
                    @blur="getPersonProfile"
                  />
                </div>
                <div class="tw-col-span-6">
                  <label class="tw-text-label"
                    >Nombre del Afectado * ({{
                      formData.nombresAfectado?.length
                    }}/200)</label
                  >
                  <q-input
                    outlined
                    v-model="formData.nombresAfectado"
                    label="Inserte"
                    dense
                    :rules="[
                      (v) => lengthValidation(200, v),
                      rulesValidation,
                      alphabeticalWithSpecialCharacters,
                    ]"
                    @keypress="alphabeticalWithSpecialCharacters"
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">
                    ¿Pertenece a la comunidad LGBTIQ+? *
                  </p>
                  <q-select
                    :options="[
                      { label: 'No', value: false },
                      { label: 'Si', value: true },
                    ]"
                    map-options
                    emit-value
                    outlined
                    v-model="formData.lgtbtq"
                    label="Seleccione"
                    dense
                    :rules="[
                      rulesValidation,
                      (v) => (v === null ? 'Este campo es requerido' : true),
                    ]"
                    :disable="
                      [8, 9, 10, 13].includes(formData.tipoDocumentoAfectado)
                    "
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Sexo *</p>
                  <q-select
                    :options="generoOptions"
                    map-options
                    emit-value
                    outlined
                    v-model="formData.sexo"
                    label="Seleccione"
                    dense
                    :rules="[rulesValidation]"
                    :disable="
                      [8, 9, 10, 13].includes(formData.tipoDocumentoAfectado)
                    "
                  />
                </div>
                <div v-if="sexoSelecionado === 6" class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Otro ¿Cuál? *</p>
                  <q-input
                    outlined
                    v-model="formData.sexoCual"
                    label="Inserte"
                    dense
                    :rules="[(v: string) => lengthValidation(50, v), inputRequired, alphabeticalWithSpecialCharacters]"
                    @keypress="alphabeticalWithSpecialCharacters"
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">
                    Condición Especial *
                  </p>
                  <q-select
                    :options="listadoCondiciones"
                    outlined
                    v-model="formData.listadoCondiciones"
                    :rules="[rulesValidation]"
                    label="Seleccione"
                    dense
                    input-debounce="0"
                    class="tw-rounded-lg"
                    :disable="
                      [8, 9, 10, 13].includes(formData.tipoDocumentoAfectado)
                    "
                  >
                  </q-select>
                </div>
              </div>
            </q-expansion-item>
          </q-card>
          <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
            <q-expansion-item
              label="Medios de Contacto y Envio de Respuesta (afectado)"
              default-opened
              header-class="tw-text-lg tw-font-bold"
            >
              <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">Canal de Entrada</p>
                  <q-select
                    :options="listadoCanalesRadicacion"
                    :rules="[]"
                    outlined
                    v-model="formData.canalEntrada"
                    disable
                    label="Seleccione"
                    dense
                    readonly
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">
                    Correo Electrónico Afectado * ({{
                      formData.correoAfectado?.length
                    }}/100)
                  </p>
                  <q-input
                    outlined
                    v-model="formData.correoAfectado"
                    label="Inserte"
                    dense
                    :rules="[
                      rulesValidation,
                      (v) => validationEmail(v),
                      (v) => lengthValidation(100, v),
                    ]"
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">Teléfono Celular</p>
                  <q-input
                    outlined
                    min="0"
                    v-model="formData.tlfCelularAfectado"
                    label="Inserte"
                    dense
                    :rules="[
                      mobilePhonNumber,
                      onlyNumbers,
                      formData.tlfFijoAfectado ? true : inputRequired,
                    ]"
                    type="text"
                    @keypress="onlyNumber"
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">Teléfono Fijo</p>
                  <q-input
                    outlined
                    min="0"
                    v-model="formData.tlfFijoAfectado"
                    label="Inserte"
                    dense
                    :rules="[
                      (v) => maxLengthInput(10, v),
                      (v) => minLengthInput(7, v),
                      onlyNumbers,
                      formData.tlfCelularAfectado ? true : inputRequired,
                    ]"
                    type="text"
                    @keypress="onlyNumber"
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">País *</p>
                  <q-select
                    :options="paiseOptions"
                    map-options
                    :rules="[rulesValidation]"
                    outlined
                    v-model="formData.paisContacto"
                    label="Seleccione"
                    dense
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">Departamento *</p>
                  <q-select
                    :options="departamentoOptions"
                    map-options
                    :rules="[rulesValidation]"
                    outlined
                    v-model="formData.departamentoContacto"
                    label="Seleccione"
                    dense
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">Municipio *</p>
                  <q-select
                    :options="municipioOptions"
                    map-options
                    :rules="[rulesValidation]"
                    outlined
                    v-model="formData.ciudadContacto"
                    label="Seleccione"
                    dense
                  />
                </div>
                <div class="tw-col-span-3">
                  <label class="tw-text-label"
                    >Dirección del Afectado * ({{
                      formData.direccionContacto?.length
                    }}/200)</label
                  >
                  <!-- @vue-expect-error -->
                  <q-input
                    ref="direccionContactoInput"
                    outlined
                    v-model="formData.direccionContacto"
                    label="Inserte"
                    dense
                    :rules="
                      formData.medioRespuestaContacto == 2 ||
                      formData.direccionContacto ||
                      !formData.correoAfectado
                        ? [inputRequired, (v) => lengthValidation(200, v)]
                        : [true]
                    "
                  />
                </div>
                <div class="tw-col-span-6">
                  <p class="tw-text-label tw-font-semibold">
                    Medio que autoriza para envío de respuesta *
                  </p>
                  <q-select
                    ref="medioRespuestaContactoSelect"
                    :options="listadoMediosRespuestaOptions"
                    map-options
                    emit-value
                    :rules="[
                      rulesValidation,
                      (v) =>
                        v === 1 && formData.correoAfectado === ''
                          ? 'Por favor diligencie correo electrónico del remitente para autorizar envío de respuesta por medio electrónico'
                          : true,
                      (v) =>
                        v === 2 && formData.direccionContacto === ''
                          ? 'Por favor diligencie dirección de remitente para autorizar envío de respuesta por este medio físico'
                          : true,
                    ]"
                    outlined
                    v-model="formData.medioRespuestaContacto"
                    label="Seleccione"
                    dense
                  />
                </div>
              </div>
            </q-expansion-item>
          </q-card>
          <q-card class="tw-px-4 tw-pt-2 tw-pb-4 tw-rounded-xl" flat>
            <q-expansion-item
              label="Solicitud"
              default-opened
              header-class="tw-text-lg tw-font-bold"
            >
              <h2 class="tw-font-bold tw-text-lg tw-pb-3 tw-pt-2"></h2>
              <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de Solicitud *
                  </p>
                  <q-select
                    :options="filteredSolicitudes"
                    :rules="[rulesValidation]"
                    outlined
                    map-options
                    emit-value
                    v-model="formData.tipoSolicitud"
                    label="Seleccione"
                    dense
                    @filter="solicitudOptionsFilterFn"
                    use-input
                    fill-input
                    hide-selected
                    @update:model-value="updateAporteMedicina"
                  />
                </div>
                <div class="tw-col-span-3">
                  <p class="tw-text-label tw-font-semibold">
                    Tipología de la PQRD *
                  </p>
                  <q-select
                    :options="listadoTipologiaOptions"
                    map-options
                    emit-value
                    :rules="[rulesValidation]"
                    outlined
                    v-model="formData.tipologiaPQRD"
                    label="Seleccione"
                    dense
                    :disable="isAporteMedicina"
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">Producto *</p>
                  <q-select
                    :options="filteredProductos"
                    map-options
                    emit-value
                    :rules="[rulesValidation]"
                    outlined
                    v-model="formData.producto"
                    label="Seleccione"
                    dense
                    @filter="productoOptionsFilterFn"
                    use-input
                    fill-input
                    hide-selected
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">
                    Acceso a Información Pública
                  </p>
                  <q-select
                    :options="[
                      { label: 'No', value: false },
                      { label: 'Sí', value: true },
                    ]"
                    map-options
                    emit-value
                    outlined
                    v-model="formData.accesopPublico"
                    label="Seleccione"
                    dense
                  />
                </div>
                <div class="tw-col-span-2">
                  <p class="tw-text-label tw-font-semibold">
                    Descripción - Acceso a Información
                  </p>
                  <q-select
                    :options="descripcionAcessInfoOptions"
                    map-options
                    emit-value
                    :disable="!formData.accesopPublico"
                    :rules="[rulesValidation]"
                    outlined
                    v-model="formData.descripcionAccesoInfo"
                    label="Seleccione"
                    dense
                  />
                </div>
                <div class="tw-col-span-6" v-if="false">
                  <span class="tw-w-full">
                    <label class="tw-text-label tw-font-semibold"
                      >Asignar Oficina *</label
                    >
                    <q-select
                      v-model="formData.oficinas"
                      map-options
                      :options="filteredOficinas"
                      label="Seleccione"
                      dense
                      outlined
                      class="tw-rounded-lg"
                      :rules="[rulesValidation]"
                      @filter="selectOptionsFilterFn"
                      use-input
                      fill-input
                      hide-selected
                    >
                    </q-select>
                  </span>
                </div>
                <div class="tw-col-span-6 tw-mb-5">
                  <div
                    v-if="Number(formData.tipoSolicitud) === 14"
                    class="tw-col-span-6"
                  >
                    <CommentTextArea
                      v-model="formData.solicitudDetalle"
                      :is-required="true"
                      :max-length="500"
                      label="Detalle"
                    />
                    <p>
                      Su requerimiento debe ser claro y conciso. Por ejemplo:
                      “Solicito respuesta al radicado ENT” “Requiero asignación
                      de asesor para SGSST”, “Solicitar actualización de datos
                      de afiliación riesgos laborales”
                    </p>
                  </div>
                  <div class="tw-col-span-6 tw-mb-5">
                    <CommentTextArea
                      v-model="formData.observaciones"
                      :is-required="true"
                      :max-length="formData.canalEntrada == 2 ? 100000 : 10000"
                      label="Observaciones"
                    />
                  </div>
                </div>
                <div class="tw-col-span-6">
                  <p class="tw-text-label tw-font-semibold">
                    Adjuntar documentos de soporte
                  </p>
                  <FileLoader
                    :max-file-size="30 * 1024 * 1024"
                    max-file-size-label="30"
                    v-model:model-value="formData.files"
                    :rules="[]"
                    :max-files="10"
                    accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                    multiple
                    @rejected="rejectedFiles"
                  >
                  </FileLoader>
                </div>
              </div>
            </q-expansion-item>
          </q-card>
        </q-form>
      </div>
      <div style="display: flex;justify-content: center;padding: 2%;">
        <component
          :is="VueCaptchaSwitcher"
          v-if="VueCaptchaSwitcher"
          :captchaName="captchaName"
          :publicKey="publicKey"
          v-model="captchaResponse"
          @verify="onVerify"
          @expire="onExpire"
          @fail="onFail"
        />
      </div>
      <div
        class="col col-12 row justify-center tw-w-full tw-m-[10px] tw-flex tw-gap-4 tw-pb-7"
      >
        <q-btn
          label="Cancelar"
          :disable="canCancel"
          textColor="black"
          class="tw-rounded-xl tw-p-3 tw-w-[200px]"
          outline
          @click="cancelModal = true"
        />
        <q-btn
          type="submit"
          label="Radicar"
          :disabled="!captchaVerified"
          @click="generateToken"
          :loading="handleSubmitIsLoading"
          color="primary"
          textColor="white"
          class="tw-rounded-xl tw-w-[200px]"
        />
      </div>

      <!--! Validation Token Modal -->
      <q-dialog
        v-model="showModalVerification"
        persistent
        class="tw-w-full tw-h-full"
      >
        <q-card :class="['tw-px-8', 'tw-p-4 tw-w-full']">
          <q-card-section>
            <div class="flex tw-justify-center tw-pb-3">
              <img v-lazy :data-url="mail" />
            </div>
            <p class="tw-text-xl tw-font-bold tw-text-center">
              Correo de verificación
            </p>
            <p class="tw-mt-3 tw-text-center">
              Enviamos un código de confirmación a su correo
              {{
                correoAfectado
                  .substring(0, 3)
                  .concat("*******@")
                  .concat(correoAfectado.split("@")[1])
              }}. Si tarda mucho tiempo en recibirlo, recibe su bandeja de
              correos no deseados.
            </p>
            <p class="tw-mt-3 tw-text-center tw-pb-2">
              Ingrese aquí el código que enviamos a su correo:
            </p>
            <div
              v-if="validationError"
              class="tw-flex justify-center font-semibold tw-pb-5 tw-pt-2"
            >
              <div
                class="tw-flex tw-gap-2 tw-rounded-md tw-bg-[#fde5e5] tw-border-2 tw-border-red-500 tw-py-3 tw-px-2"
              >
                <img v-lazy :data-url="RedCirclePQRD" class="tw-h-5 tw-w-5 tw-mt-[1px]" />
                <p class="tw-font-semibold">
                  El código ingresado no es válido o se encuentra vencido.
                </p>
              </div>
            </div>

            <div class="tw-flex tw-gap-x-2 tw-justify-center">
              <input
                ref="input1"
                v-model="inputsCode.codeOne"
                type="text"
                :class="{
                  'blue-border': inputsCode.codeOne !== '' && !validationError,
                  'red-border': validationError,
                }"
                class="tw-border-b-2 tw-border-[#A5B1BF] tw-w-12 tw-font-bold tw-text-[45px] tw-text-center input-code"
                maxlength="1"
                @keyup="autoFocus('input1', input1, $event.key === 'Backspace')"
                @paste="handlePaste($event, 'input1')"
              />

              <input
                ref="input2"
                v-model="inputsCode.codeTwo"
                type="text"
                :class="{
                  'blue-border': inputsCode.codeTwo !== '' && !validationError,
                  'red-border': validationError,
                }"
                class="tw-border-b-2 tw-border-[#A5B1BF] tw-w-12 tw-font-bold tw-text-[45px] tw-text-center input-code"
                maxlength="1"
                @keyup="autoFocus('input2', input2, $event.key === 'Backspace')"
                @paste="handlePaste($event, 'input2')"
              />

              <input
                ref="input3"
                v-model="inputsCode.codeThree"
                type="text"
                :class="{
                  'blue-border':
                    inputsCode.codeThree !== '' && !validationError,
                  'red-border': validationError,
                }"
                class="tw-border-b-2 tw-border-[#A5B1BF] tw-w-12 tw-font-bold tw-text-[45px] tw-text-center input-code"
                maxlength="1"
                @keyup="autoFocus('input3', input3, $event.key === 'Backspace')"
                @paste="handlePaste($event, 'input3')"
              />

              <input
                ref="input4"
                v-model="inputsCode.codeFour"
                type="text"
                :class="{
                  'blue-border': inputsCode.codeFour !== '' && !validationError,
                  'red-border': validationError,
                }"
                class="tw-border-b-2 tw-border-[#A5B1BF] tw-w-12 tw-font-bold tw-text-[45px] tw-text-center input-code"
                maxlength="1"
                @keyup="autoFocus('input4', input4, $event.key === 'Backspace')"
                @paste="handlePaste($event, 'input4')"
              />

              <input
                ref="input5"
                v-model="inputsCode.codeFive"
                type="text"
                :class="{
                  'blue-border': inputsCode.codeFive !== '' && !validationError,
                  'red-border': validationError,
                }"
                class="tw-border-b-2 tw-border-[#A5B1BF] tw-w-12 tw-font-bold tw-text-[45px] tw-text-center input-code"
                maxlength="1"
                @keyup="autoFocus('input5', input5, $event.key === 'Backspace')"
                @paste="handlePaste($event, 'input5')"
              />
            </div>
            <p
              @click="generateToken"
              class="tw-mt-3 tw-text-center tw-pt-4 tw-font-bold tw-cursor-pointer tw-text-[#FF7500] hover:tw-underline"
            >
              Solicitar el código nuevamente
            </p>
          </q-card-section>
          <q-card-actions align="center" class="-tw-mt-2">
            <q-btn
              label="Cancelar"
              outline
              class="tw-w-[49%] tw-h-9 cancelar-button"
              flat
              @click="
                handleSubmitIsLoading = true;
                cancelModal2 = true;
              "
            />
            <q-btn
              label="Confirmar"
              text-color="white"
              class="tw-rounded-xl tw-font-bold tw-h-9 tw-w-[49%] tw-bg-[#FF7500]"
              @click="validateToken"
              :disable="
                !(
                  inputsCode.codeOne &&
                  inputsCode.codeTwo &&
                  inputsCode.codeThree &&
                  inputsCode.codeFour &&
                  inputsCode.codeFive
                )
              "
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!--! Cancelar Modal Token -->
      <Modal
        v-model="cancelModal2"
        title="¡Espera un momento!"
        :is-success="false"
        @handleAccept="onReset2"
        cancel-button
        textButtonCancel="No"
        textButton="Si"
        text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        @close-modal="
          cancelModal2 = false;
          handleSubmitIsLoading = false;
        "
        type="button"
      />

      <!--! Cancelar Modal -->
      <Modal
        v-model="cancelModal"
        title="¡Espera un momento!"
        :is-success="false"
        @handleAccept="onReset"
        cancel-button
        textButtonCancel="No"
        textButton="Si"
        text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
        @close-modal="cancelModal = false"
        type="button"
      />

      <!--! Radicar Modal -->
      <Exitoso
        v-model="showModalVerification2"
        :title="'Su solicitud se ha radicado con el código ' + responseId"
        is-success
        text-button="Finalizar"
        @handleAccept="showModalVerification2 = false"
        @closeModal="showModalVerification2 = false"
        cancel-button
        text-button-cancel="Descargar solicitud"
        @close-modal="handleDownloadRadicacionDocument"
        @handle-accept="handleCloseDownloadModal"
      />

      <!--! Inactividad Modal -->
      <Modal
        v-model="inactivModal"
        title=""
        :is-success="false"
        @handleAccept="router.go(-1)"
        textButton="Aceptar"
        text="Gracias por usar nuestros servicios"
        @close-modal="
          inactivModal = false;
          handleSubmitIsLoading = false;
        "
        type="button"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import Exitoso from "../exitosoWeb.vue";
import { nextTick, onMounted, onUnmounted, Ref, ref, watch } from "vue";
import FileLoader from "components/FormFields/FileLoader.vue";
import { adminAxios, sgdeaAxios } from "src/services";
import { useDepartments, useMunicipalities, toUpperCaseFormatted } from "src/composables/useVersion";
import { toast } from "src/helpers/toast";
import { DocumentoRadicado, SelectInput } from "src/interfaces";
import Modal from "components/Modal/Modal.vue";
import { Notify } from "quasar";
import {
  validationEmail,
  onlyNumbers,
  alphanumeric,
  inputRequired,
  minLengthInput,
  maxLengthInput,
  alphabeticalWithSpecialCharacters,
} from "src/helpers/validations";
import moment from "moment";
import "moment-duration-format";
// @ts-ignore
import RedCirclePQRD from "assets/RedCirclePQRD.webp";
// @ts-ignore
import mail from "assets/mail.svg";
import { getAcronimobyId } from "src/helpers/prefijoTipoDoc";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";

interface PQRD {
  tipoRemitente: string;
  tipoDocumentoRemitente: string;
  numeroDocumentoRemitente: string;
  nombresRemitente: string;
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombresAfectado: string;
  lgtbtq: boolean;
  sexo: string;
  sexoCual: any;
  condicionEspecial: any[];
  correoAfectado: string;
  tlfCelularAfectado: string;
  tlfFijoAfectado: string;
  paisContacto: string;
  departamentoContacto: any;
  ciudadContacto: any;
  remitenteAfectado: boolean;
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
  canalEntrada: { label: string; value: number };
  oficinas: string;
}

interface Code {
  codeOne: string;
  codeTwo: string;
  codeThree: string;
  codeFour: string;
  codeFive: string;
}

const formData: Ref<PQRD> = ref({
  tipoRemitente: "",
  tipoDocumentoRemitente: "",
  numeroDocumentoRemitente: "",
  nombresRemitente: "",
  tipoDocumentoAfectado: "",
  numeroDocumentoAfectado: "",
  nombresAfectado: "",
  lgtbtq: null,
  sexo: "",
  sexoCual: "",
  condicionEspecial: [],
  correoAfectado: "",
  tlfCelularAfectado: "",
  tlfFijoAfectado: "",
  paisContacto: "",
  departamentoContacto: "",
  ciudadContacto: "",
  remitenteAfectado: false,
  direccionContacto: "",
  medioRespuestaContacto: "",
  tipologiaPQRD: "",
  tipoSolicitud: "",
  producto: "",
  accesopPublico: false,
  descripcionAccesoInfo: "",
  observaciones: "",
  solicitudDetalle: "",
  listadoCondiciones: [],
  files: [],
  canalEntrada: { label: "Página Web", value: 1 },
  oficinas: "",
});

const handleSubmitIsLoading = ref<boolean>(false);

const inputsCode: Ref<Code> = ref({
  codeOne: "",
  codeTwo: "",
  codeThree: "",
  codeFour: "",
  codeFive: "",
});

const VueCaptchaSwitcher = ref();
const captchaVerified = ref(false)
const isLocalhost = window.location.hostname === 'localhost';
const captchaName = ref("turnstile");
const publicKey = "0x4AAAAAABm_meOCvQHc-VU8";
const captchaResponse = ref("");
const onVerify = (token: string) => {
  captchaVerified.value = true;
};

const onExpire = () => {
  captchaVerified.value = false;
};

const onFail = () => {
  captchaVerified.value = false;
};


const router = useRouter();
const form = ref();
const showModalVerification = ref(false);
const showModalVerification2 = ref(false);
const paiseOptions: Ref<any[]> = ref([]);
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const generoOptions: Ref<any[]> = ref([]);
const descripcionAcessInfoOptions: Ref<any[]> = ref([]);
const listadoMediosRespuestaOptions: Ref<any[]> = ref([]);
const listadoTipologiaOptions: Ref<any[]> = ref([]);
const listadoCondiciones: Ref<any[]> = ref([]);
const listadoTipoRemitente: Ref<any[]> = ref([]);
const listadoProductosPQRD: Ref<any[]> = ref([]);
const listadoTiposSolicitud: Ref<any[]> = ref([]);
const listadoCanalesRadicacion: Ref<any[]> = ref([]);
const listadoOficinas: Ref<any[]> = ref([]);
const tipoDoc: Ref<SelectInput[]> = ref([]);
const filteredOficinas = ref<SelectInput[]>([]);
const filteredSolicitudes = ref<SelectInput[]>([]);
const filteredProductos = ref<SelectInput[]>([]);
const responseId = ref("");
const correoAfectado = ref("");
const isntColombia = ref(false);
const cancelModal = ref(false);
const cancelModal2 = ref(false);
const inactivModal = ref(false);
let inactivityTimer;
const generatedDocId = ref<string | null>(null);
const input1 = ref(null);
const input2 = ref(null);
const input3 = ref(null);
const input4 = ref(null);
const input5 = ref(null);
const inputMap = {
  input1: input2,
  input2: input3,
  input3: input4,
  input4: input5,
};
const inputMapPrev = {
  input2: input1,
  input3: input2,
  input4: input3,
  input5: input4,
};
const token = ref("");
const validationError = ref(false);
const ultimoTiempoExpiracion = ref(null);
const MAX_FILE = 10;
const medioRespuestaContactoSelect = ref(null);
const direccionContactoInput = ref(null);
const fieldsToWatch = [
  "tipoDocumentoRemitente",
  "nombresRemitente",
  "numeroDocumentoRemitente",
];

let canCancel = ref(false);
const isAporteMedicina = ref(false);
const sexoSelecionado = ref<number | null>(null);
let ignoreRemitenteWatch = false;
onMounted(async () => {
  await loadPaises();
  await loadMunicipios();
  await loadTipoDoc();
  await loadGenero();
  await loadDescripcionAcessInfo();
  await loadListadosMediosRepuesta();
  await loadListadoTipologia();
  await loadListadoTipoRemitente();
  await loadListadoCanalesRadicacion();
  await loadListadoOficinas();
  await loadListadoCondiciones();
  await loadListadoProductosPQRD();
  await loadListadoTiposSolicitud();
  if (!isLocalhost) {
    VueCaptchaSwitcher.value = (await import('vue-captcha-switcher')).default;
  }
});

async function loadTipoDoc() {
  const { data } = await sgdeaAxios.get(
    "/correspondencia/comunicacion/listadoTipoIdentificacion"
  );
  tipoDoc.value = [
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.id,
      };
    }),
  ];

  tipoDoc.value = tipoDoc.value.filter((e) => {
    return e.value !== 12;
  });
}

async function loadPaises() {
  const { data } = await adminAxios.get("/paises/list");
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
    };
  })
}

async function loadGenero() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoGenero");

    if (response.status == 200 || response.status == 201) {
      generoOptions.value = response.data
        .sort(
          (
            a: { nombre: string; id: number },
            b: { nombre: string; id: number }
          ) => {
            const labelA = a.nombre.toUpperCase();
            const labelB = b.nombre.toUpperCase();
            if (labelA < labelB) {
              return -1;
            }
            if (labelA > labelB) {
              return 1;
            }
            return 0;
          }
        )
        .map((e: { nombre: string; id: number }) => {
          return {
            label: e.nombre,
            value: e.id,
          };
        });
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadDescripcionAcessInfo() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoDescripcionAccesoInfo");

    if (response.status == 200 || response.status == 201) {
      descripcionAcessInfoOptions.value = response.data
        .map((e: any) => {
          return {
            label: e.nombre,
            value: e.id,
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    formData.value.descripcionAccesoInfo =
      descripcionAcessInfoOptions.value[0].value;
  } catch (error) {
    console.error(error);
  }
}

async function loadListadosMediosRepuesta() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoMediosRespuesta");

    if (response.status == 200 || response.status == 201) {
      listadoMediosRespuestaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoTipologia() {
  try {
    const response = await sgdeaAxios.get(
      `/pqrd/listadoTipologia?canalEntrada=web`
    );

    if (response.status == 200 || response.status == 201) {
      listadoTipologiaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }

    listadoTipologiaOptions.value = listadoTipologiaOptions.value.filter(
      (e) => {
        return e.value !== 7 && e.value !== 8;
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoTipoRemitente() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTiposRemitente");

    if (response.status == 200 || response.status == 201) {
      listadoTipoRemitente.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoCondiciones() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoCondiciones");

    if (response.status == 200 || response.status == 201) {
      listadoCondiciones.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }

    listadoCondiciones.value = sortOptions(listadoCondiciones.value);
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoProductosPQRD() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoProductosPQRD");

    if (response.status == 200 || response.status == 201) {
      listadoProductosPQRD.value = response.data
        .filter((item) => item.id == 1 || item.id == 2)
        .map((e: any) => {
          return {
            label: e.nombre,
            value: e.id,
          };
        });
    }

    filteredProductos.value = listadoProductosPQRD.value;
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoTiposSolicitud() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoTiposSolicitud");

    if (response.status == 200 || response.status == 201) {
      listadoTiposSolicitud.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }

    filteredSolicitudes.value = listadoTiposSolicitud.value.filter(
      (e) => e.value !== 2
    );
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoCanalesRadicacion() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoCanalesRadicacion");

    if (response.status == 200 || response.status == 201) {
      listadoCanalesRadicacion.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }

    listadoCanalesRadicacion.value = listadoCanalesRadicacion.value.find(
      (e) => {
        return e.label == "WEB" || e.value == 1;
      }
    );
  } catch (error) {
    console.error(error);
  }
}

async function loadListadoOficinas() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoOficinas");

    if (response.status == 200 || response.status == 201) {
      listadoOficinas.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }

    listadoOficinas.value = listadoOficinas.value.filter((e) => {
      return e.value !== 26;
    });
    filteredOficinas.value = listadoOficinas.value;
  } catch (error) {
    console.error(error);
  }
}

const autoFocus = (currentInputRefName, value, isBackspace) => {
  if (isBackspace) {
    const prevInputRef = inputMapPrev[currentInputRefName];
    if (prevInputRef && prevInputRef.value) {
      prevInputRef.value.focus();
    }
  } else {
    const nextInputRef = inputMap[currentInputRefName];
    if (nextInputRef && nextInputRef.value) {
      nextInputRef.value.focus();
    }
  }
};

const handlePaste = async (event: ClipboardEvent, inputRef: string) => {
  event.preventDefault(); // Prevenir el comportamiento por defecto de pegar
  const pastedData = (event.clipboardData?.getData("text") || "").replace(
    /\D/g,
    ""
  ); // Obtener solo números
  const codeArray = pastedData.slice(0, 5).split(""); // Limitar a 5 caracteres y dividir en un array

  // Actualizar inputsCode directamente
  codeArray.forEach((num, index) => {
    if (index < 5) {
      // Asegúrate de no exceder los 5 inputs
      inputsCode.value[
        `code${["One", "Two", "Three", "Four", "Five"][index]}`
      ] = num; // Asignar al objeto
    }
  });

  await nextTick(); // Esperar a que el DOM se actualice

  // Focaliza el siguiente input vacío
  const inputRefs = ["input1", "input2", "input3", "input4", "input5"];
  const nextEmptyIndex = inputRefs.findIndex((ref, index) => {
    return !inputsCode.value[
      `code${["One", "Two", "Three", "Four", "Five"][index]}`
    ];
  });

  const nextFocusRef =
    nextEmptyIndex !== -1 ? inputRefs[nextEmptyIndex] : "input5";
  (inputMap[nextFocusRef] || input5).value?.focus(); // Enfocar el siguiente input vacío
};

async function generateToken() {
  if (
    ultimoTiempoExpiracion.value &&
    moment().diff(moment(ultimoTiempoExpiracion.value)) < 60000
  ) {
    const duracionHastaExpiracion = moment.duration(
      60000 - moment().diff(moment(ultimoTiempoExpiracion.value)),
      "milliseconds"
    );
    // @ts-ignore
    const tiempoRestanteFormateado = duracionHastaExpiracion.format("m:ss");
    toast.error(
      `Aún no puedes generar un nuevo token. Espera ${tiempoRestanteFormateado} ${
        duracionHastaExpiracion.asMinutes() >= 5
          ? "minutos."
          : duracionHastaExpiracion.asSeconds() >= 60
          ? "minuto."
          : "segundos."
      }`
    );
    return;
  }

  if (await form.value.validate()) {
    handleSubmitIsLoading.value = true;
    try {
      const response = await sgdeaAxios.post("/pqrd/generar-otp", {
        cedula: formData.value.numeroDocumentoAfectado,
        otp: "",
        destinatario: formData.value.correoAfectado,
        nombre: formData.value.nombresAfectado,
        ciudad: "",
      });

      if (showModalVerification.value) {
        toast.success(
          "Se ha enviado nuevamente el código a su correo electrónico."
        );
      }

      showModalVerification.value = true;
      let correoOculto = ocultarCorreo(formData.value.correoAfectado);
      correoAfectado.value = correoOculto;
      ultimoTiempoExpiracion.value = response.data.expiracion;

      return response;
    } catch (error) {
      console.error(error);
    }
  } else {
    return toast.error(
      "Para continuar, Asegúrese de que todos los campos obligatorios estén completos"
    );
  }
}

async function validateToken() {
  token.value =
    inputsCode.value.codeOne +
    inputsCode.value.codeTwo +
    inputsCode.value.codeThree +
    inputsCode.value.codeFour +
    inputsCode.value.codeFive;

  try {
    const response = await sgdeaAxios.post("/pqrd/validar-otp", {
      cedula: formData.value.numeroDocumentoAfectado,
      otp: token.value,
      destinatario: formData.value.correoAfectado,
      nombre: formData.value.nombresAfectado,
    });

    if (response.status == 200 || response.status == 201) {
      toast.success("Validación de Código Exitosa");
      validationError.value = false;
      canCancel = true;
      showModalVerification.value = false;
      await submit();
    } else {
      validationError.value = true;
    }

    return response;
  } catch (error) {
    validationError.value = true;
    console.error(error);
  }
}

const selectOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredOficinas.value = listadoOficinas.value;
    });
    return;
  }
  update(() => {
    filteredOficinas.value = listadoOficinas.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const solicitudOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredSolicitudes.value = listadoTiposSolicitud.value;
    });
    return;
  }
  update(() => {
    filteredSolicitudes.value = listadoTiposSolicitud.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
};

const productoOptionsFilterFn = (val: string, update: any) => {
  if (val == "") {
    update(() => {
      filteredProductos.value = listadoProductosPQRD.value;
    });
    return;
  }
  update(() => {
    filteredProductos.value = listadoProductosPQRD.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  });
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
};

function onReset() {
  formData.value = {
    tipoRemitente: "",
    tipoDocumentoRemitente: "",
    numeroDocumentoRemitente: "",
    nombresRemitente: "",
    tipoDocumentoAfectado: "",
    numeroDocumentoAfectado: "",
    nombresAfectado: "",
    lgtbtq: false,
    sexo: "",
    sexoCual: "",
    condicionEspecial: [],
    correoAfectado: "",
    tlfCelularAfectado: "",
    tlfFijoAfectado: "",
    paisContacto: null,
    departamentoContacto: "",
    ciudadContacto: "",
    remitenteAfectado: false,
    direccionContacto: "",
    medioRespuestaContacto: "",
    tipologiaPQRD: "",
    tipoSolicitud: "",
    producto: "",
    accesopPublico: false,
    descripcionAccesoInfo: "",
    observaciones: "",
    solicitudDetalle: "",
    listadoCondiciones: [],
    files: [],
    canalEntrada: { label: "Página Web", value: 1 },
    oficinas: "",
  };

  // @ts-ignore
  router.go();
}

function onReset2() {
  // @ts-ignore
  router.go();
}

const handleDownloadRadicacionDocument = async () => {
  try {
      const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${generatedDocId.value}`
    );

      const docRadicado = listDocs.list.entries?.find(
      (it) => {
        const entryName = it.entry.name;
        return entryName && entryName.startsWith(responseId.value);
      }
    );

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
    link.download = String(responseId.value);

    link.click();

    URL.revokeObjectURL(blobUrl);

    router.push("/public/pqrd");
  } catch (error) {
    toast.error('Ocurrió un error inesperado.');
  }
};

const rejectedFiles = (error: any[]) => {
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-file-size"
    )
  ) {
    Notify.create({
      type: "error",
      message: "El peso permitido es hasta 30MB.",
    });
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "max-files"
    )
  ) {
    Notify.create({
      type: "error",
      message: `Solo se pueden adjuntar ${MAX_FILE} archivos.`,
    });
  }
  if (
    error.some(
      (it: { failedPropValidation: string }) =>
        it.failedPropValidation === "accept"
    )
  ) {
    Notify.create({
      type: "error",
      message:
        "Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).",
    });
  }
};

const handleCloseDownloadModal = () => {
  router.push("/public/pqrd");
};

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    inactivModal.value = true;
  }, 900000); // 15 minutos de inactividad
};

const handleUserActivity = () => {
  resetInactivityTimer();
};

onMounted(() => {
  document.addEventListener("mousemove", handleUserActivity);
  document.addEventListener("keydown", handleUserActivity);
  resetInactivityTimer();
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleUserActivity);
  document.removeEventListener("keydown", handleUserActivity);
  clearTimeout(inactivityTimer);
});

watch(
  () => formData.value.paisContacto,
  async (value) => {
    if (!value || !value.label) return;

    const countryLabel = value.label.toLowerCase().trim();

    formData.value.departamentoContacto = '';
    formData.value.ciudadContacto = '';
    // @ts-ignore
    const { optionsDepartments } = await useDepartments(value.value);
    const sorted = optionsDepartments.value.sort((a, b) => {
      const normalize = (str: string) =>
        str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalize(a.label).localeCompare(normalize(b.label), 'es', {
        sensitivity: 'base',
      });
    });

    departamentoOptions.value = sorted;

    if (countryLabel === 'colombia') {
      isntColombia.value = false;
    } else {
      isntColombia.value = true;
      if (departamentoOptions.value.length === 0) {
        // @ts-ignore
        formData.value.departamentoContacto = value;
        // @ts-ignore
        formData.value.ciudadContacto = value;
      }
    }
  }
);

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
    if (municipioOptions.value.length === 0) {
        formData.value.ciudadContacto = value;
    }
  }
);

watch(
  () => fieldsToWatch.map((field) => formData.value[field]),
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

//  Watcher for manual changes in numeroDocumentoAfectado
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

watch(
  () => formData.value.correoAfectado,
  () => {
    if (formData.value.correoAfectado) {
      medioRespuestaContactoSelect.value.resetValidation();
      direccionContactoInput.value.resetValidation();
    }
  }
);

watch(
  () => formData.value.direccionContacto,
  () => {
    if (formData.value.direccionContacto) {
      medioRespuestaContactoSelect.value.resetValidation();
    }
  }
);

const submit = async () => {
  const newPqrd2 = new FormData();
  newPqrd2.append(
    "datosRemitenteTipoRemitenteId",
    formData.value.tipoRemitente
  );
  // @ts-ignore
  newPqrd2.append(
    "datosRemitenteTipoDocumentoId",
    formData.value.tipoDocumentoRemitente || 12
  );
  newPqrd2.append(
    "datosRemitenteNumeroDocumento",
    formData.value.numeroDocumentoRemitente
  );
  newPqrd2.append("datosRemitenteNombre", formData.value.nombresRemitente);
  newPqrd2.append(
    "datosAfectadoTipoDocumentoId",
    formData.value.tipoDocumentoAfectado
  );
  newPqrd2.append(
    "datosAfectadoNumeroDocumento",
    formData.value.numeroDocumentoAfectado
  );
  newPqrd2.append("datosAfectadoNombre", formData.value.nombresAfectado);
  if (![8, 9, 10, 13].includes(Number(formData.value.tipoDocumentoAfectado))) {
    const lgtbtqValue = formData.value.lgtbtq ? 'true' : 'false';
    const generoValue = String(formData.value.sexo);

    newPqrd2.append("datosAfectadoLgtbtq", lgtbtqValue);
    newPqrd2.append("datosAfectadoGeneroId", generoValue);
  }
  newPqrd2.append(
    "datosAfectadoCorreoElectronico",
    formData.value.correoAfectado
  );

  if (
    formData.value.tlfCelularAfectado &&
    formData.value.tlfCelularAfectado !== ""
  ) {
    newPqrd2.append(
      "datosAfectadoTelefonoCelular",
      formData.value.tlfCelularAfectado
    );
  }

  if (formData.value.tlfFijoAfectado && formData.value.tlfFijoAfectado !== "") {
    newPqrd2.append(
      "datosAfectadoTelefonoFijo",
      formData.value.tlfFijoAfectado
    );
  }

  // @ts-ignore
  newPqrd2.append("datosAfectadoPaisIdPais", formData.value.paisContacto.value);
  // @ts-ignore
  newPqrd2.append(
    "datosAfectadoDepartamentoIdDepartamento",
    formData.value.departamentoContacto.value
  );
  // @ts-ignore
  newPqrd2.append(
    "datosAfectadoMunicipioIdMunicipio",
    formData.value.ciudadContacto.value
  );
  newPqrd2.append("datosAfectadoDireccion", formData.value.direccionContacto);
  newPqrd2.append(
    "datosAfectadoMedioRespuestaId",
    formData.value.medioRespuestaContacto
  );
  newPqrd2.append("solicitudTipoPqrdId", formData.value.tipologiaPQRD);
  newPqrd2.append("solicitudTipoSolicitudId", formData.value.tipoSolicitud);
  newPqrd2.append("solicitudTipoproductoId", formData.value.producto);
  // @ts-ignore
  newPqrd2.append(
    "solicitudAccesoInformacionPublica",
    formData.value.accesopPublico
  );
  newPqrd2.append(
    "solicitudDescripcionAccesoInformacionId",
    formData.value.descripcionAccesoInfo
  );
  newPqrd2.append("solicitudObservaciones", formData.value.observaciones);
  // @ts-ignore
  newPqrd2.append("solicitudDetalle", formData.value.solicitudDetalle);
  newPqrd2.append("usuarioCreador", "User");
  newPqrd2.append("canalRadicacion", formData.value.canalEntrada.value);
  // @ts-ignore
  newPqrd2.append("oficina", formData.value.oficinas.value || 26);
  newPqrd2.append("detalleAfectado", "");
  //@ts-ignore
  let idCondiciones = [formData.value.listadoCondiciones.value];
  // @ts-ignore
  newPqrd2.append("listadoCondiciones", `[${idCondiciones}]`);

  if (formData.value.files?.length) {
    for (let i = 0; i < formData.value.files?.length; i++) {
      newPqrd2.append("files", formData.value.files[i]);
    }
  }

  if (formData.value.sexoCual) {
    newPqrd2.append("datosAfectadoGeneroOtro", formData.value.sexoCual);
  }

  try {
    const response = await sgdeaAxios.post("/pqrd/radicar-pqrd", newPqrd2);
    if (response.data || response.status == 200 || response.status == 201) {
      generatedDocId.value = response.data.nodeId;
      responseId.value = response.data.idRadicado;
      showModalVerification2.value = true;
      handleSubmitIsLoading.value = false;

      const dataTrazabilidad = {
        proceso: `PQRD${response.data.id}`,
        secuencia: response.data.idRadicado,
        estado: response.data.estado.estado,
        descripcion: `Usuario: Usuario externo Descripción: Se ha radicoado una PQRD por medio del canal web`,
        comentario: formData.solicitudDetalle || "Radicado",
        nombre: "Usuario Externo",
        accion: `Usuario externo ha radicado la PQRD ${response.data.idRadicado}`,
        tramite:
          response.data.solicitud.tipoPqrd.id == 7 ? "PQRD Express" : "PQRD",
      };
      const crearTrazabilidad = await sgdeaAxios.post(
        "/trazabilidad/crear",
        dataTrazabilidad
      );
    }
    return response;
  } catch (error) {
    toast.error("Ha ocurrido un error");
    handleSubmitIsLoading.value = false;
  }
};

function ocultarCorreo(correo, caracteresParaMostrar = 2) {
  let partesCorreo = correo.split("@");
  let local = partesCorreo[0];
  let dominio = partesCorreo[1];

  let asteriscos = local.length - caracteresParaMostrar;

  let parteOculta = "*".repeat(asteriscos);

  let nuevoCorreo = `${local.substring(
    0,
    caracteresParaMostrar
  )}${parteOculta}@${dominio}`;

  return nuevoCorreo;
}

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return "Este campo es requerido";
  }
  return true;
};

function onlyAlphaNumeric(event: {
  which: any;
  keyCode: any;
  preventDefault: () => void;
}) {
  let charCode = event.which ? event.which : event.keyCode;

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

function onlyNumber(event: {
  keyCode: any;
  which: any;
  preventDefault: () => void;
}) {
  let keyCode = event.keyCode ? event.keyCode : event.which;
  if (keyCode >= 48 && keyCode <= 57) {
    return true;
  }
  event.preventDefault();
  return false;
}

const mobilePhonNumber = (val: any) => {
  const expresionRegular = /^(30|31|32|35)[0-9]{8}$/;
  if (val) {
    if (val?.length == 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (30)";
    } else if (!expresionRegular.test(val)) {
      return "El número de teléfono celular debe contener máximo 10 dígitos";
    }
  }
};

const lengthValidation = (n, val: string) =>
  val?.length <= n || "Máximo " + n + " caracteres";

watch(
  () => formData.value.tipoDocumentoAfectado,
  () => {
    if ([8, 9, 10, 13].includes(formData.value.tipoDocumentoAfectado)) {
      formData.value.lgtbtq = false;
      formData.value.sexo = 1;
      formData.value.listadoCondiciones = { label: "No aplica", value: 1 };
    } else {
      formData.value.lgtbtq = "";
      formData.value.sexo = "";
      formData.value.listadoCondiciones = "";
      form.value.reset();
    }
  }
);

watch(
  () => formData.value.sexo,
  async (newValue, oldValue) => {
    await loadGenero();
    const selectedOption = generoOptions.value.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      sexoSelecionado.value = selectedOption.value;
    }
  }
);

const updateAporteMedicina = (v) => {
  if (v == 2 || v == 7) {
    isAporteMedicina.value = true;
    formData.value.tipologiaPQRD = "";
  } else {
    isAporteMedicina.value = false;
  }
};

async function getPerson() {
  const tipoDoc = getAcronimobyId(
    Number(formData.value.tipoDocumentoRemitente)
  );
  const number = Number(formData.value.tipoDocumentoRemitente)
    ? Number(formData.value.numeroDocumentoRemitente)
    : "";
  try {
    const response = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number,
      },
    });

    if (response.status === 200) {
      const nameObject = {
        nombre1: response.data.nombre1,
        nombre2: response.data.nombre2,
        apellido1: response.data.apellido1,
        apellido2: response.data.apellido2,
      };

      const fullName = Object.values(nameObject).join(" ");

      formData.value.nombresRemitente = fullName;

      if (formData.value.remitenteAfectado) {

        formData.value.sexo = response.data.genero;
        formData.value.sexoCual = response.data.otroGenero;
        formData.value.lgtbtq = response.data.lgtbtq;
        formData.value.condicionEspecial = response.data.isCondicionEspecial;
        formData.value.direccionContacto = response.data.direccion;
        formData.value.departamentoContacto = {
          label: response.data.departamento.nombre,
          value: response.data.departamento.idDepartamento,
        };
        setTimeout(() => {
          formData.value.ciudadContacto = {
            label: response.data.municipio.nombre,
            value: response.data.municipio.idMunicipio,
          };
        });
        formData.value.tlfFijoAfectado = response.data.telefono;
        formData.value.correoAfectado = response.data.email;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function getPersonProfile() {
  const tipoDoc = getAcronimobyId(Number(formData.value.tipoDocumentoAfectado));
  const number = Number(formData.value.tipoDocumentoAfectado)
    ? Number(formData.value.numeroDocumentoAfectado)
    : "";
  try {
    const response = await sgdeaAxios.get("/personas", {
      params: {
        tipoDocumento: tipoDoc,
        numeroDocumento: number,
      },
    });

    if (response.status === 200) {
      const nameObject = {
        nombre1: response.data.nombre1,
        nombre2: response.data.nombre2,
        apellido1: response.data.apellido1,
        apellido2: response.data.apellido2,
      };

      const fullName = Object.values(nameObject).join(" ");

      formData.value.nombresAfectado = fullName;
      formData.value.sexo = response.data.genero;
      formData.value.sexoCual = response.data.otroGenero;
      formData.value.lgtbtq = response.data.lgtbtq;
      formData.value.condicionEspecial = response.data.isCondicionEspecial;
      formData.value.direccionContacto = response.data.direccion;
      formData.value.departamentoContacto = {
        label: response.data.departamento.nombre,
        value: response.data.departamento.idDepartamento,
      };
      setTimeout(() => {
        formData.value.ciudadContacto = {
          label: response.data.municipio.nombre,
          value: response.data.municipio.idMunicipio,
        };
      });
      formData.value.tlfFijoAfectado = response.data.telefono;
      formData.value.correoAfectado = response.data.email;
    } else {
      await cleanExternal();
    }
  } catch (error) {
    console.error(error);
    await cleanExternal();
  }
}

const cleanExternal = async () => {
  formData.value.nombresAfectado = "";
  formData.value.lgtbtq = null;
  formData.value.sexo = "";
  formData.value.sexoCual = "";
  formData.value.condicionEspecial = null;
  formData.value.direccionContacto = "";
  formData.value.departamentoContacto = "";
  formData.value.ciudadContacto = "";
  formData.value.correoAfectado = "";
  await PQRD.value.reset();
};
</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}

.blue-border {
  border-color: blue !important;
}

.red-border {
  border-color: red !important;
}

.cancelar-button {
  border: 1px solid black;
}
</style>
