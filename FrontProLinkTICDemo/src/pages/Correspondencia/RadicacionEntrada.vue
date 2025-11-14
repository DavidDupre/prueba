<template>
  <div class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
    <div class="tw-pt-4">
      <router-link to="/home">
        <q-btn flat color="primary" label="Volver" icon="chevron_left" />
      </router-link>
    </div>

    <div class="tw-flex tw-justify-between tw-pt-4">
      <h1 class="tw-text-3xl tw-font-bold">Radicación de entrada</h1>
    </div>
    <div class="tw-container tw-mx-auto tw-mt-4">
      <q-linear-progress v-if="form0.tipoTramite.label == 'PQRD'" size="8px" :value="((0.20 * (step + 1) - 0.1))" />
      <q-linear-progress v-else-if="form0.tipoTramite.label == 'Tutelas'" size="8px"
        :value="((0.50 * (step + 1) - 0.25))" />
      <q-linear-progress v-else-if="form0.tipoTramite.label == 'Medicina laboral'" size="8px"
        :value="((0.20 * (activeMed ? medicinaComp?.step + 2 : step + 1) - 0.1))" />
      <q-linear-progress v-else-if="form0.tipoTramite.label == 'Entes de control'" size="8px"
        :value="((0.20 * (activeEntes ? entesComp?.step + 2 : step + 1) - 0.1))" />
      <q-linear-progress v-else size="8px" :value="((0.25 * (step + 1) - 0.125))" />

      <div class="tw-grid tw-grid-cols-5 tw-gap-0" v-if="form0.tipoTramite.label == 'PQRD'">
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Tipo de comunicación</b> <br>
            <span class="tw-text-label" :class="step >= 0 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Selección
              de tramite</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Datos generales</b> <br>
            <span class="tw-text-label" :class="step >= 1 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información del
              trámite</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 2 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Remitente</b> <br>
            <span class="tw-text-label" :class="step >= 2 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información del
              remitente</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 3 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Afectado</b> <br>
            <span class="tw-text-label" :class="step >= 3 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información del
              afectado</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 4 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Medios de contacto</b> <br>
            <span class="tw-text-label" :class="step >= 4 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Medio
              y
              envio de respuesta</span>
          </h4>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-gap-0" v-else-if="form0.tipoTramite.label == 'Tutelas'">
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Tipo de comunicación</b> <br>
            <span class="tw-text-label" :class="step >= 0 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Selección
              de tramite</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Radicar Tutela</b> <br>
            <span class="tw-text-label" :class="step >= 1 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información del
              trámite</span>
          </h4>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-5 tw-gap-0" v-else-if="form0.tipoTramite.label == 'Medicina laboral'">
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Tipo de comunicación</b> <br>
            <span class="tw-text-label" :class="step >= 0 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Selección
              de tramite</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Remitentes</b> <br>
            <span class="tw-text-label" :class="step >= 1 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos
              del remitente</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 2 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Afectado</b> <br>
            <span class="tw-text-label" :class="step >= 2 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos
              del afectado</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 3 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Solicitud</b> <br>
            <span class="tw-text-label" :class="step >= 3 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información
              adicional</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 4 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Documento</b> <br>
            <span class="tw-text-label" :class="step >= 4 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Adjuntar
              documentos de
              entrada</span>
          </h4>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-5 tw-gap-0" v-else-if="form0.tipoTramite.label == 'Entes de control'">
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Tipo de comunicación</b> <br>
            <span class="tw-text-label" :class="step >= 0 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Selección
              de tramite</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Remitente</b> <br>
            <span class="tw-text-label" :class="step >= 1 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos
              del remitente</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 2 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Afectado</b> <br>
            <span class="tw-text-label" :class="step >= 2 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos
              del afectado</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 3 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Solicitud</b> <br>
            <span class="tw-text-label" :class="step >= 3 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Información sobre
              la
              solicitud</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 4 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Documentos</b> <br>
            <span class="tw-text-label" :class="step >= 4 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Documentos
              adicionales</span>
          </h4>
        </div>
      </div>
      <div class="tw-grid tw-grid-cols-4 tw-gap-0" v-else>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 0 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Tipo de comunicación</b> <br>
            <span class="tw-text-label" :class="step >= 0 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Selección
              de tramite</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5 "
            :class="step >= 1 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Remitentes</b> <br>
            <span class="tw-text-label" :class="step >= 1 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos
              del
              remitente</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 2 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Afectado</b> <br>
            <span class="tw-text-label" :class="step >= 2 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Datos
              del
              afectado</span>
          </h4>
        </div>
        <div class="tw-mt-2">
          <h4 class="tw-text-2xs tw-text-center tw-leading-5"
            :class="step >= 3 ? 'tw-text-slate-600' : 'tw-text-slate-400'"> <b>Documento</b> <br>
            <span class="tw-text-label" :class="step >= 3 ? 'tw-text-slate-400' : 'tw-text-slate-300'">Adjuntar
              documentos de entrada</span>
          </h4>
        </div>
      </div>
    </div>

    <q-form ref="myForm0" v-if="step == 0">
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <div class="col row">
          <p class="tw-text-2xl tw-font-bold">Tipo de comunicación</p>
        </div>

        <div class="tw-mt-2">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <label class="tw-w-full">
                <span class="tw-text-label">Canal de Recepción *</span>
                <q-select v-model="form0.canalRecepcion" disable label="Seleccione" dense outlined class="tw-rounded-lg"
                  :options="['Ventanilla']" :rules="[inputRequired]">
                </q-select>
              </label>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <label class="tw-w-full">
                <span class="tw-text-label">Tipo de trámite *</span>
                <q-select v-model="form0.tipoTramite" :options="opTipoTramite" label="Seleccione" dense outlined
                  class="tw-rounded-lg" :rules="[inputRequired]">
                </q-select>
              </label>
            </div>
          </div>
        </div>
      </q-card>
    </q-form>

    <div v-if="form0.tipoTramite.label == 'PQRD'">

      <q-form ref="myForm1PQRD" v-if="step == 1" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Datos generales</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Ciudad *</span>
<!--                  <SearchInput :options="optionsCiudades" v-model:input-data-prop="form1PQRD.ciudad" map-options-->
<!--                    label="Inserte" :limit-number="200" :rules="[v => maxLengthInput(15, v), inputRequired]" />-->
                  <q-input
                    outlined
                    v-model="form1PQRD.ciudad"
                    dense
                    readonly
                  />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Fecha * </span>
                  <Datepicker mask="DD/MM/YYYY" disable label="dd / mm / aaaaa"
                    v-model:input-data-prop="form1PQRD.fecha" :rules="[inputRequired]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Punto de radicación *</span>
                  <q-select emit-value map-options v-model="form1PQRD.puntoRadicacion" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :options="opPuntoRadicacion" :rules="[inputRequired]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Tipología de la PQRD *</span>
                  <q-select emit-value map-options v-model="form1PQRD.tipologiaPQRD" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :options="opTipologiaPQRD" :rules="[inputRequired]" />
                </label>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Prestaciones asistenciales</span>
                  <q-select emit-value map-options v-model="form1PQRD.prestacionesAsistenciales" label="Seleccione"
                    dense outlined class="tw-rounded-lg" :options="opPrestacionesAsistenciales" :rules="[isSelected]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Procesos indemnizaciones</span>
                  <q-select emit-value map-options v-model="form1PQRD.procesosIndemnizaciones" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opProcesosIndemnizaciones" :rules="[isSelected]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Administración de pensiones</span>
                  <q-select emit-value map-options v-model="form1PQRD.administracionPensiones" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opAdministracionPensiones" :rules="[isSelected]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Póliza de vida </span>
                  <q-select emit-value map-options v-model="form1PQRD.polizaVida" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :options="opPolizaVida" :rules="[isSelected]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Proceso de afiliaciones</span>
                  <q-select emit-value map-options v-model="form1PQRD.procesoAfiliaciones" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opProcesoAfiliaciones" :rules="[isSelected]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Proceso recaudo y cartera </span>
                  <q-select emit-value map-options v-model="form1PQRD.procesoRecaudoCartera" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opProcesoRecaudoCartera" :rules="[isSelected]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Procesos de promoción y prevención </span>
                  <q-select emit-value map-options v-model="form1PQRD.procesosPromocionPrevencion" label="Seleccione"
                    dense outlined class="tw-rounded-lg" :options="opProcesosPromocionPrevencion"
                    :rules="[isSelected]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Otro ¿Cuál?
                  </span>
                  <q-input v-model="form1PQRD.otro" type="textarea" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[isSelected, v => maxLengthInput(100, v)]">
                  </q-input>
                </label>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>
      <q-form ref="myForm2PQRD" v-if="step == 2" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Información del Remitente</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Tipo de documento del remitente *</span>
                  <q-select emit-value map-options v-model="form2PQRD.tipoDocumentoRemitente" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opTipoDocumentoRemitentePQRD" :rules="[inputRequired]" />
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Número de documento del remitente *</span>
                  <SearchInput :options="[]" editable v-model:input-data-prop="form2PQRD.numeroDocumentoRemitente"
                    label="Inserte" :limit-number="15"
                    :rules="[v => maxLengthInput(15, v), inputRequired, alphanumeric ]"
                    @blur="getPersonInfo"/>
                </label>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Nombre del remitente * ({{ form2PQRD.nombreRemitente.length }}/200)</span>
                  <SearchInput :options="[]" editable v-model:input-data-prop="form2PQRD.nombreRemitente"
                    @keypress="alphabeticalWithSpecialCharacters" label="Inserte" :limit-number="200"
                    :rules="[v => maxLengthInput(200, v), inputRequired]" />
                </label>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>
      <q-form ref="myForm3PQRD" v-if="step == 3" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Información del afectado</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Tipo de documento del afectado *</span>
                  <q-select emit-value map-options v-model="form3PQRD.tipoDocumentoAfectado" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opTipoDocumentoAfectadoPQRD" :rules="[inputRequired]" />
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Número de documento del afectado *</span>
                  <SearchInput :options="[]" editable v-model:input-data-prop="form3PQRD.numeroDocumentoAfectado"
                    label="Inserte" :limit-number="20"
                    :rules="[v => maxLengthInput(20, v), inputRequired, alphanumeric]"
                    @blur="getPersonProfile"/>
                </label>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Nombre del afectado * ({{ form3PQRD.nombreAfectado.length }}/200)</span>
                  <SearchInput :options="[]" editable v-model:input-data-prop="form3PQRD.nombreAfectado"
                    @keypress="alphabeticalWithSpecialCharacters" label="Inserte" :limit-number="200"
                    :rules="[v => maxLengthInput(200, v), inputRequired]" />
                </label>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Sexo *</span>
                  <q-select :disable="[7, 8, 9, 10, 13].includes(Number(form3PQRD.tipoDocumentoAfectado))" emit-value
                    map-options v-model="form3PQRD.sexo" label="Seleccione" dense outlined class="tw-rounded-lg"
                    :options="opGenerosPQRD" :rules="[inputRequired]" />
                </label>
              </div>
              <div v-if="sexoSelecionado === 6" class="tw-col-span-2">
                <p class="tw-text-label tw-font-semibold">Otro ¿Cuál? *</p>
                <q-input outlined v-model='form3PQRD.sexoCual' label="Inserte" dense
                  :rules="[(v: string) => lengthValidation(50, v), inputRequired, alphabeticalWithSpecialCharacters]"
                  @keypress="alphabeticalWithSpecialCharacters" />
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">¿Pertenece a la comunidad LGBTIQ+? *</span>
                  <q-select :disable="[7, 8, 9, 10, 13].includes(Number(form3PQRD.tipoDocumentoAfectado))" emit-value
                    map-options v-model="form3PQRD.perteneceComunidadLGBTIQ" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]"
                    :rules="[inputRequired]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Condición *</span>
                  <q-select :disable="[7, 8, 9, 10, 13].includes(Number(form3PQRD.tipoDocumentoAfectado))" emit-value
                    map-options v-model="form3PQRD.condicionEspecial" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]"
                    :rules="[inputRequired]">
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" v-if="form3PQRD.condicionEspecial == true">
                <label class="tw-w-full">
                  <span class="tw-text-label">Tipo de condición especial *</span>
                  <q-select emit-value map-options v-model="form3PQRD.tipoCondicionEspecial" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opTipoCondicionEspecial"
                    :rules="form3PQRD.condicionEspecial == true ? [inputRequired] : []" />
                </label>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>
      <q-form ref="myForm4PQRD" v-if="step == 4" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Medio y envio de respuesta</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Dirección de contacto *({{ form4PQRD.direccionContacto.length }}/200)</span>
                  <q-input v-model="form4PQRD.direccionContacto" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="form4PQRD.medioRespuesta == 2 ? [inputRequired, v => maxLengthInput(200, v)] : [v => maxLengthInput(200, v)]"
                    </q-input>
                </label>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <label class="tw-w-full">
                  <span class="tw-text-label">País *</span>
                  <q-select v-model="form4PQRD.pais" outlined dense use-input hide-selected fill-input label="Búsqueda"
                    :options="opsForCountries" @filter="filterPais" :rules="[inputRequired]">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>
              </div>

              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <label class="tw-w-full">
                  <span class="tw-text-label">Departamento *</span>
                  <q-select v-model="form4PQRD.departamento" outlined dense use-input hide-selected fill-input
                    label="Búsqueda" :options="opsFordepartamentoOptions" @filter="filterDep" :rules="[inputRequired]"
                    :disable="isntColombia">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>

              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <label class="tw-w-full">
                  <span class="tw-text-label">Municipio *</span>
                  <q-select v-model="form4PQRD.municipio" outlined dense use-input hide-selected fill-input
                    label="Búsqueda" :options="opsFormunicipioOptions" @filter="filterMun" :rules="[inputRequired]"
                    :disable="isntColombia">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <label class="tw-w-full">
                  <span class="tw-text-label">Barrio *</span>
                  <q-input v-model="form4PQRD.barrio" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="form4PQRD.medioRespuesta == 2 ? [inputRequired, v => maxLengthInput(50, v)] : [v => maxLengthInput(50, v)]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Teléfono móvil *</span>
                  <q-input v-model="form4PQRD.telefonoMovil" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[v => atLeastOnePhoneNumber(v, form4PQRD), v => mobilePhonNumber(v)]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Teléfono fijo </span>
                  <q-input v-model="form4PQRD.telefonoFijo" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[v => atLeastOnePhoneNumber(v, form4PQRD),onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Correo electrónico *</span>
                  <q-input v-model="form4PQRD.correo" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="form4PQRD.medioRespuesta == 1 ? [inputRequired, validationEmail, v => maxLengthInput(250, v)] : [validationEmail, v => maxLengthInput(250, v)]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Medio por el que se desea recibir respuesta *</span>
                  <q-select emit-value map-options v-model="form4PQRD.medioRespuesta" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :options="opMedioRecibirRespuesta"
                    :rules="[inputRequired, (v: number) => v === 1 && form4PQRD.correo === '' ?
                      'Por favor diligencie correo electrónico del remitente para autorizar envío de respuesta por medio electrónico' : true,
                      (v: number) => v === 2 && form4PQRD.direccionContacto === '' ?
                        'Por favor diligencie dirección de remitente para autorizar envío de respuesta por este medio físico' : true]" />
                </label>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Descripción de PQRD * ({{form4PQRD.descripcionPQRD.length }}/10000)</span>
                  <q-input v-model="form4PQRD.descripcionPQRD" type="textarea" dense label="Inserte" outlined
                    class="tw-rounded-lg" :rules="[inputRequired, v => maxLengthInput(10000, v)]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Anexo folios *</span>
                  <q-select emit-value map-options v-model="form4PQRD.anexoFolios" label="Seleccione" dense outlined
                    class="tw-rounded-lg" :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]"
                    :rules="[inputRequired]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">¿Cuántos? *</span>
                  <q-input v-model="form4PQRD.cantidadFolios" class="tw-rounded-lg" label="Inserte" dense outlined
                    type="number"
                    :rules="form4PQRD.anexoFolios != true ? [onlyNumbers, v => maxLengthInput(3, v), v => greaterThan2(0, v)] : [inputRequired, onlyNumbers, v => maxLengthInput(3, v), v => greaterThan2(0, v)]" />
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Medios magnéticos *</span>
                  <q-select emit-value map-options v-model="form4PQRD.mediosMagneticos" label="Seleccione" dense
                    outlined class="tw-rounded-lg"
                    :options="[{ label: 'Si', value: true }, { label: 'No', value: false }]" :rules="[inputRequired]" />
                </label>
              </div>
              <div class="col-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Adjunte los documentos</span>
                  <FileLoader v-model:model-value="form4PQRD.docs" class="tw-w-full"
                    accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                    sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 50MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                    :multiple="true" :max-file-size="50 * 1024 * 1024" :max-files="30" max-file-size-label="50"
                    @rejected="rejectedFiles" />
                </label>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>
    </div>
    <div v-else-if="form0.tipoTramite.label == 'Tutelas'">
      <template v-if="step == 1">
        <RadicarTutelas :is-correspondencia="true" ref="tutelaComp"  :on-prev="validPrev"/>
      </template>

    </div>
    <div v-else-if="form0.tipoTramite.label == 'Medicina laboral'">
      <template v-if="step == 1">
        <MedicinaLaboral :is-correspondencia="true" @prev="validPrev()" ref="medicinaComp" />
      </template>
    </div>

    <div v-else-if="form0.tipoTramite.label == 'Entes de control'">
      <template v-if="step == 1">
        <RadicarEnte :is-correspondencia="true" @prev="validPrev()" ref="entesComp" />
      </template>
    </div>

    <div v-else>
      <q-form ref="myForm1" v-if="step == 1" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Datos del remitente</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Número radicado de la entidad remitente </span>
                  <q-input v-model="form1.numeroRadicadoEntidadRemitente" dense label="Inserte" outlined
                    class="tw-rounded-lg" :rules="[v => maxLengthInput(100, v), alphanumeric]"
                    @keypress="onlyAlphaNumeric">
                  </q-input>
                </label>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Número de factura </span>
                  <q-input v-model="form1.numeroFactura" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[v => maxLengthInput(100, v), alphanumeric]" @keypress="onlyAlphaNumeric">
                  </q-input>
                </label>
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Tipo documento del remitente *</span>
                  <q-select emit-value map-options v-model="form1.tipoDocumentoRemitente" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opTipoDocumentoRemitente" :rules="[inputRequired]" />
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Número documento del remitente *</span>
                  <q-input v-model="form1.numeroDocumentoRemitente"
                    :disable="form1.tipoDocumentoRemitente == '12' ? true : false" dense label="Inserte" outlined
                    class="tw-rounded-lg"
                    :rules="form1.tipoDocumentoRemitente != '12' ? [inputRequired, alphanumeric, v => maxLengthInput(15, v)] : []"
                    @blur="getPerson">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Nombre del remitente * ({{ form1.nombresRemitente.length }}/200)</span>
                  <q-input v-model="form1.nombresRemitente" dense label="Inserte" outlined class="tw-rounded-lg"
                    @keypress="onlyAlphabetic"
                    :rules="[alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v), inputRequired]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">País *</span>
                  <q-select v-model="form1.pais" outlined dense use-input hide-selected fill-input label="Búsqueda"
                    :options="optionsCountries" @filter="filterPais" :rules="[inputRequired]">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>
              </div>

              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Departamento *</span>
                  <q-select v-model="form1.departamento" outlined dense use-input hide-selected fill-input
                    label="Búsqueda" :options="departmentsOptions" @filter="filterDep" :rules="[inputRequired]"
                    :disable="isntColombia">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>
              </div>
              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                <label class="tw-w-full">
                  <span class="tw-text-label">Municipio *</span>
                  <q-select v-model="form1.municipio" outlined dense use-input hide-selected fill-input label="Búsqueda"
                    :options="opsFormunicipioOptions" @filter="filterMun" :rules="[inputRequired]"
                    :disable="isntColombia">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </label>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Dirección del remitente ({{ form1.direccionRemitente.length }}/200)</span>
                  <q-input v-model="form1.direccionRemitente" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[v => maxLengthInput(200, v)]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Teléfono </span>
                  <q-input v-model="form1.telefono" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Correo electrónico del remitente ({{ form1?.correoRemitente?.length
                    }}/100)</span>
                  <q-input v-model="form1.correoRemitente" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[validationEmail, v => maxLengthInput(100, v)]">
                  </q-input>
                </label>
              </div>

            </div>
          </div>
        </q-card>
      </q-form>

      <q-form ref="myForm2" v-if="step == 2" greedy>
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Datos del afectado</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Tipo de documento del afectado {{form0.tipoTramite.label == 'Entes de control' || form0.tipoTramite.label == 'Correspondencia'  ? "*" : ""}}</span>
                  <q-select emit-value map-options v-model="form2.tipoDocumentoAfectado" label="Seleccione" dense
                    outlined class="tw-rounded-lg" :options="opTipoDocumentoAfectado" :rules="form0.tipoTramite.label == 'Entes de control' || form0.tipoTramite.label == 'Correspondencia'  ? [inputRequired] : []" />
                </label>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <label class="tw-w-full">
                  <span class="tw-text-label">Número de documento {{form0.tipoTramite.label == 'Entes de control' || form0.tipoTramite.label == 'Correspondencia'  ? "*" : ""}}</span>
                  <q-input v-model="form2.numeroDocumento" :disable="form2.tipoDocumentoAfectado == '12' ? true : false"
                    dense label="Inserte" outlined class="tw-rounded-lg"
                           :rules="[
                              (val) => {
                                if (form0?.tipoTramite?.label === 'Entes de control' || form0?.tipoTramite?.label === 'Correspondencia') {
                                  return inputRequired(val)
                                }

                                if (form2.tipoDocumentoAfectado !== '12') {
                                  if (Number(form2.tipoDocumentoAfectado) === 11) {
                                    return alphanumeric(val)
                                  } else {
                                    return onlyNumbers(val)
                                  }
                                }

                                return true
                              },
                              (val) => (form2.tipoDocumentoAfectado !== '12' ? maxLengthInput(15, val) : true)
                            ]"
                    @blur="getPerso">
                  </q-input>
                </label>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Nombre del afectado ({{ form2.nombreAfectado.length }}/200)</span>
                  <q-input v-model="form2.nombreAfectado" dense label="Inserte" outlined
                    @keypress="alphabeticalWithSpecialCharacters" class="tw-rounded-lg"
                    :rules="[alphabeticalWithSpecialCharacters, v => maxLengthInput(200, v)]">
                  </q-input>
                </label>
              </div>
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Numero teléfono</span>
                  <q-input v-model="form2.afectadoTelefono" dense label="Inserte" outlined class="tw-rounded-lg"
                    :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]">
                  </q-input>
                </label>
              </div>
              <div v-if="!isTramite" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <p class="tw-text-label tw-font-semibold">¿Pertenece a la Comunidad LGBTIQ+? *</p>
                <q-select :disable="[7, 8, 9, 10, 13].includes(Number(form2.tipoDocumentoAfectado))"
                  :options="[{ label: 'No', value: false }, { label: 'Si', value: true }]" map-options emit-value
                  outlined v-model='form2.lgtbtq' label="Seleccione" dense
                  :rules="[inputRequired, (v: null) => v === null ? 'Este campo es requerido' : true]" />
              </div>
              <div v-if="!isTramite" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <p class="tw-text-label tw-font-semibold">Sexo *</p>
                <q-select :disable="[7, 8, 9, 10, 13].includes(Number(form2.tipoDocumentoAfectado))"
                  :options="generoOptions" map-options emit-value outlined v-model='form2.sexo' label="Seleccione" dense
                  :rules="[inputRequired]" />
              </div>
              <div v-if="!isTramite" class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                <p class="tw-text-label tw-font-semibold">Condición Especial *</p>
                <q-select :disable="[7, 8, 9, 10, 13].includes(Number(form2.tipoDocumentoAfectado))"
                  :options="listadoCondiciones" outlined v-model='form2.listadoCondiciones' :rules="[inputRequired]"
                  label="Seleccione" dense input-debounce="0" class="tw-rounded-lg">
                </q-select>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>
      <q-form ref="myForm3" v-if="step == 3">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="col row">
            <p class="tw-text-2xl tw-font-bold">Documento de entrada</p>
          </div>

          <div class="tw-mt-2">
            <div class="row q-col-gutter-md q-pb-md q-px-md">
              <!-- Adjunte los documentos -->
              <div class="col-12">
                <label class="tw-w-full">
                  <span class="tw-text-label">Adjunte los documentos</span>

                  <FileLoader v-model="form3.docs" class="tw-w-full"
                    accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
                    sub-title="Puede adjuntar (30) Archivo(s) cada uno con un tamaño permitido de 30MB en cualquiera de las siguientes extenciones <hr>(pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg)"
                    :multiple="true" :max-file-size="50 * 1024 * 1024" :max-files="30" max-file-size-label="50"
                    @rejected="rejectedFiles" />
                </label>
              </div>
            </div>
          </div>
        </q-card>
      </q-form>
    </div>

    <div v-if="!activeMed && !activeEntes" class="tw-flex tw-justify-center tw-items-center tw-my-10 tw-gap-6">
      <q-btn v-if="step > 0" label="Regresar" text-color="white" icon="chevron_left" style="width: 240px"
        color="primary" class="tw-rounded-xl tw-h-12 tw-p-2" @click="validPrev()" />

      <q-btn label="Cancelar" style="width: 240px" text-color="black" color="accent" class="tw-rounded-xl tw-h-12"
        @click="modalPreguntaCancelar = true" />

      <q-btn
        v-if="form0.tipoTramite.label == 'PQRD' && step != 4 || form0.tipoTramite.label != 'PQRD' && form0.tipoTramite.label != 'Tutelas' && step != 3 || form0.tipoTramite.label == 'Tutelas' && step == 0"
        label="Continuar" text-color="white" icon-right="navigate_next" style="width: 240px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2" @click="nextStep(step)" />

      <q-btn :disable="radicando"
        v-if="form0.tipoTramite.label == 'PQRD' && step == 4 || form0.tipoTramite.label != 'PQRD' && step == 3 || form0.tipoTramite.label == 'Tutelas' && step == 1"
        type="submit" label="Radicar" text-color="white" style="width: 240px" color="primary"
        class="tw-rounded-xl tw-h-12 tw-p-2"
        @click="form0.tipoTramite.label == 'Tutelas' ? tutelaRadicar() : createRadicacion()"
        :loading="handleSubmitIsLoading" />
    </div>


    <!-- <q-dialog v-model="showSuccessModal" persistent>
      <q-card class="q-py-xl q-px-xl">
        <div class="tw-rounded-lg tw-flex tw-justify-center">
          <span class="tw-rounded-[50px] tw-flex tw-justify-center"
            style="background-color: rgba(0, 219, 0, 0.05); width: 130px; height: 82px">
            <img v-lazy :data-url="Check" alt="check" width="40">
          </span>
        </div>
        <p class="tw-text-[24px] text-center tw-font-bold q-mt-lg">
          Radicado
        </p>
        <p class="tw-text-[18px] text-center tw-mt-'">Se generó el radicado {{ responseRadicado.idRadicado }}.
        </p>
        <div class="tw-flex tw-justify-between tw-mt-8">
          <q-btn class="tw-w-auto tw-h-10" color="white" text-color="black" @click="download">
            <span class="tw-px-5">Descargar radicado</span>
          </q-btn>
          <q-btn class="tw-w-auto tw-h-10 tw-ms-4" color="secondary" @click="cancelarFormulario">
            <span class="tw-px-5">Finalizar</span>
          </q-btn>

        </div>
      </q-card>
    </q-dialog> -->

<ScannerModal v-model="showScanModal" @files-ready="handleFilesFromScanner" />

    <Modal text-button-cancel="No" text-button="Sí" :is-success="false" @close-modal="modalPreguntaCancelar = false"
      v-model="modalPreguntaCancelar" title="Cancelar" type="button" cancel-button
      text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
      @handleAccept="cancelarFormulario()" />

    <Modal v-model="showModalDescargaSticker" v-if="form0.tipoTramite.label !== 'PQRD'" title="Exito"
      :text="`Se ha generado el radicado ${responseRadicado?.idRadicado} exitosamente`" is-success cancel-button
      text-button="Imprimir Sticker" @handleAccept="imprimirSticker" @close-modal="showSuccessModal = true" />

    <Modal v-model="showModalDescargaSticker" v-if="form0.tipoTramite.label == 'PQRD'" title="Exito"
      :text="`Se ha generado el radicado ${responseRadicado?.idRadicado} exitosamente`" is-success cancel-button
      text-button="Imprimir Sticker" @handleAccept="imprimirStickerPQRD" @close-modal="showSuccessModal = true" />
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import Modal from "components/Modal/Modal.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import SearchInput from 'components/SearchInput/SearchInput.vue';
// @ts-ignore
// import Check from '../../assets/check.svg';
import { inputRequired, onlyNumbers, maxLengthInput, alphanumeric, validationEmail, minLengthInput, mobilePhonNumber, greaterThan2, alphabeticalWithSpecialCharacters } from "src/helpers/validations";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "stores/auth.store";
import { DocumentoRadicado } from "src/interfaces";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import RadicarTutelas from 'src/pages/SGDA/ClasificacionDocumental/Tutelas/radicar/TutelasRadicar.vue'
import MedicinaLaboral from 'src/pages/MedicinaLaboral/Radicacion/RadicacionML.vue'
import RadicarEnte from 'src/pages/EntesDeControl/Radicar.vue'
import { getAcronimobyId } from 'src/helpers/prefijoTipoDoc';
import ScannerModal from "src/components/Modal/ScannerModal.vue";
import moment from "moment";

const handleSubmitIsLoading = ref<boolean>(false)
const departmentsOptions = ref([]);
const departamentos = ref([]);
const auth = useAuthStore();
const router = useRouter()
const sexoSelecionado = ref<number | null>(null)
type FormDataType0 = {
  canalRecepcion: string;
  tipoTramite: { label: string, value: any };
};

type FormDataType1PQRD = {
  ciudad: string;
  fecha: string;
  puntoRadicacion: string;
  tipologiaPQRD: string;
  prestacionesAsistenciales: string;
  procesosIndemnizaciones: string;
  administracionPensiones: string;
  polizaVida: string;
  procesoAfiliaciones: string;
  procesoRecaudoCartera: string;
  procesosPromocionPrevencion: string;
  otro: string;
};
type FormDataType1 = {
  numeroRadicadoEntidadRemitente: string;
  numeroFactura: string;
  tipoDocumentoRemitente: string;
  numeroDocumentoRemitente: string;
  nombresRemitente: string;
  pais: any;
  departamento: any;
  municipio: any;
  direccionRemitente: string;
  telefono: string;
  correoRemitente: string;
};

type FormDataType2PQRD = {
  tipoDocumentoRemitente: string;
  numeroDocumentoRemitente: string;
  nombreRemitente: string;
};

type FormDataType2 = {
  tipoDocumentoAfectado: string;
  numeroDocumento: string;
  nombreAfectado: string;
  afectadoTelefono: string;
};

type FormDataType3PQRD = {
  tipoDocumentoAfectado: string;
  numeroDocumentoAfectado: string;
  nombreAfectado: string;
  sexo: any;
  perteneceComunidadLGBTIQ: boolean;
  condicionEspecial: boolean;
  tipoCondicionEspecial: string;
  sexoCual: any;

};

type FormDataType3 = {
  docs: any;
};

type FormDataType4PQRD = {
  direccionContacto: string;
  pais: any;
  departamento: any;
  municipio: any;
  barrio: any;
  telefonoMovil: string;
  telefonoFijo: string;
  correo: string;
  medioRespuesta: any;
  descripcionPQRD: string;
  anexoFolios: boolean;
  cantidadFolios: string;
  mediosMagneticos: string;
  docs: any;
};


const myForm0 = ref<HTMLFormElement>(null);
const myForm1PQRD = ref<HTMLFormElement>(null);
const myForm2PQRD = ref<HTMLFormElement>(null);
const myForm3PQRD = ref<HTMLFormElement>(null);
const myForm4PQRD = ref<HTMLFormElement>(null);
const myForm1 = ref<HTMLFormElement>(null);
const myForm2 = ref<HTMLFormElement>(null);
const myForm3 = ref<HTMLFormElement>(null);

const formRefs: Record<string, Ref<HTMLFormElement>> = {
  myForm0: myForm0,
  myForm1PQRD: myForm1PQRD,
  myForm2PQRD: myForm2PQRD,
  myForm3PQRD: myForm3PQRD,
  myForm4PQRD: myForm4PQRD,
  myForm1: myForm1,
  myForm2: myForm2,
  myForm3: myForm3,
};

const showSuccessModal = ref<boolean>(false);
const showModalDescargaSticker = ref<boolean>(false);
const modalPreguntaCancelar = ref<boolean>(false);
const radicando = ref(false)

const showScanModal = ref<boolean>(false);

const getToday = () => {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate
}

const form0 = ref<FormDataType0>({
  canalRecepcion: "Ventanilla",
  tipoTramite: { label: 'Correspondencia', value: 6 },
});
const form1PQRD = ref<FormDataType1PQRD>({
  ciudad: '',
  fecha: getToday(),
  puntoRadicacion: '',
  tipologiaPQRD: '',
  prestacionesAsistenciales: null,
  procesosIndemnizaciones: null,
  administracionPensiones: null,
  polizaVida: null,
  procesoAfiliaciones: null,
  procesoRecaudoCartera: null,
  procesosPromocionPrevencion: null,
  otro: null
});
const form1 = ref<FormDataType1>({
  numeroRadicadoEntidadRemitente: '',
  numeroFactura: '',
  tipoDocumentoRemitente: '',
  numeroDocumentoRemitente: '',
  nombresRemitente: '',
  pais: { label: 'Colombia', value: 425 },
  departamento: '',
  municipio: '',
  direccionRemitente: '',
  telefono: '',
  correoRemitente: '',
});
const form2PQRD = ref<FormDataType2PQRD>({
  tipoDocumentoRemitente: '',
  numeroDocumentoRemitente: '',
  nombreRemitente: '',
});

const form2 = ref<FormDataType2>({
  tipoDocumentoAfectado: '',
  numeroDocumento: '',
  nombreAfectado: '',
  afectadoTelefono: ''


});

const form3PQRD = ref<FormDataType3PQRD>({
  tipoDocumentoAfectado: '',
  numeroDocumentoAfectado: '',
  nombreAfectado: '',
  sexo: null,
  perteneceComunidadLGBTIQ: null,
  condicionEspecial: null,
  tipoCondicionEspecial: '',
  sexoCual: null

});

const form3 = ref<FormDataType3>({
  docs: []
});

const form4PQRD = ref<FormDataType4PQRD>({
  direccionContacto: '',
  pais: { label: 'Colombia', value: 425 },
  departamento: '',
  municipio: '',
  barrio: '',
  telefonoMovil: '',
  telefonoFijo: '',
  correo: '',
  medioRespuesta: '',
  descripcionPQRD: '',
  anexoFolios: null,
  cantidadFolios: '',
  mediosMagneticos: null,
  docs: []
});

const step = ref(0)
const { optionsCountries } = useCountries()
const opsForCountries = ref()
const optionsCiudades = ref([])
const departamentoOptions: Ref<any[]> = ref([]);
const opsFordepartamentoOptions: Ref<any[]> = ref([]);
const departamentoOptionsPQRD: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const opsFormunicipioOptions: Ref<any[]> = ref([]);
const municipioOptionsPQRD: Ref<any[]> = ref([]);
const opTipoTramite = ref([])
const opPuntoRadicacion = ref([])
const opTipologiaPQRD = ref([])
const opPrestacionesAsistenciales = ref([])
const opProcesosIndemnizaciones = ref([])
const opAdministracionPensiones = ref([])
const opPolizaVida = ref([])
const opProcesoAfiliaciones = ref([])
const opProcesoRecaudoCartera = ref([])
const opProcesosPromocionPrevencion = ref([])
const opTipoDocumentoRemitentePQRD = ref([])
const opTipoDocumentoAfectadoPQRD = ref([])
const opGenerosPQRD = ref([])
const opTipoCondicionEspecial = ref([])
const opMedioRecibirRespuesta = ref([])
const opTipoDocumentoRemitente = ref([])
const opTipoDocumentoAfectado = ref([])
const userInfo = ref();
const { getUserInfo } = useAuthStore();
const isntColombia = ref<boolean>(false);
const generoOptions: Ref<any[]> = ref([])
const listadoCondiciones: Ref<any[]> = ref([])
const tutelaComp = ref()
const medicinaComp = ref()
const activeMed = ref(false)
const activeEntes = ref(false)
const entesComp = ref()

const responseRadicado = ref()

const nextStep = async (sp: number) => {
  if (step.value == 0 && form0.value.tipoTramite.label == 'PQRD') {
    step.value++
    getDataPQRD()
    return
  } else if (form0.value.tipoTramite.label == 'Medicina laboral') {
    activeMed.value = true
  } else if (form0.value.tipoTramite.label == 'Entes de control') {
    activeEntes.value = true
  }
  else if (step.value == 0 && form0.value.tipoTramite.label != 'PQRD' && form0.value.tipoTramite.label != 'Medicina laboral') {
    step.value++
    getDataOthers()
    return
  }
  const formName = form0.value.tipoTramite.label === 'PQRD' ? `myForm${sp}PQRD` : `myForm${sp}`;
  const isValidForm = await formRefs[formName]?.value.validate();

  if (isValidForm) {
    step.value++;
  } else {
    toast.error("Complete todos los campos para proceder a radicar.");
  }
};

const validPrev = () => {
  if (activeMed.value) {
    activeMed.value = false
  } if (activeEntes.value) {
    activeEntes.value = false
  }
  step.value--
}


const obtenerPuntoRadicacion = async () => {
  const idPuntoRadicacion = userInfo.value?.relations[0]?.idPuntoRadicacion
  if (idPuntoRadicacion) {
    const { data: puntoRadicacionUser } = (await sgdeaAxios.get(`/correspondencia/puntoRadicacion/${idPuntoRadicacion}`))
    const PuntoRadicacionDep = departamentoOptionsPQRD.value.filter(it => it.label === puntoRadicacionUser?.departamento)
    const { optionsMunicipalities } = await useMunicipalities(PuntoRadicacionDep[0].value);
    optionsCiudades.value = optionsMunicipalities.value;
    puntoRadicacion.value = puntoRadicacionUser

    form1PQRD.value.ciudad = puntoRadicacionUser?.municipio
    if (puntoRadicacionUser?.activo === false) {
      toast.error('El punto de radicacion del usuario se encuentra inactivo.')
    } else {
      form1PQRD.value.puntoRadicacion = puntoRadicacionUser?.id
    }

  }
}

const getDataPQRD = async () => {

  await obtenerPuntoRadicacion();

  const { data: puntoRadicacionData } = (await sgdeaAxios.get("/correspondencia/puntoRadicacion/listadoActive"));
  opPuntoRadicacion.value = puntoRadicacionData
    ?.filter((item) => item.activo && item.municipio === form1PQRD.value.ciudad)
    .map((item) => ({
      value: item.id,
      label: item.nombrePunto,
      ...item
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const { data: tipologiaPQRDData } = (await sgdeaAxios.get("/pqrd/listadoTipologia"));
  opTipologiaPQRD.value = tipologiaPQRDData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).filter(({ label }) => label !== 'PQRD Express' && label !== 'Derecho de petición verbal').sort((a, b) => a.label.localeCompare(b.label));

  const { data: prestacionesAsistencialesData } = (await sgdeaAxios.get("/pqrd/listadoPrestacionesAsistenciales"));
  opPrestacionesAsistenciales.value = prestacionesAsistencialesData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

  const { data: procesosIndemnizacionesData } = (await sgdeaAxios.get("/pqrd/listadoIndemnizaciones"));
  opProcesosIndemnizaciones.value = procesosIndemnizacionesData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

  const { data: administracionPensionesData } = (await sgdeaAxios.get("/pqrd/listadoPensiones"));
  opAdministracionPensiones.value = administracionPensionesData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

  const { data: polizaVidaData } = (await sgdeaAxios.get("/pqrd/listadoPolizas"));
  opPolizaVida.value = polizaVidaData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

  const { data: procesoAfiliacionesData } = (await sgdeaAxios.get("/pqrd/listadoAfiliaciones"));
  opProcesoAfiliaciones.value = procesoAfiliacionesData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

  const { data: procesoRecaudoCarteraData } = (await sgdeaAxios.get("/pqrd/listadoRecaudos"));
  opProcesoRecaudoCartera.value = procesoRecaudoCarteraData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

  const { data: procesosPromocionPrevencionData } = (await sgdeaAxios.get("/pqrd/listadoPromociones"));
  opProcesosPromocionPrevencion.value = procesosPromocionPrevencionData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));

  const { data: tipoDocsData } = (await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion"));
  opTipoDocumentoRemitentePQRD.value = tipoDocsData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).filter(({ label }) => label !== 'Ninguno').sort((a, b) => a.label.localeCompare(b.label));
  opTipoDocumentoAfectadoPQRD.value = [...opTipoDocumentoRemitentePQRD.value];

  const { data: generosData } = (await sgdeaAxios.get("/pqrd/listadoGenero"));
  opGenerosPQRD.value = generosData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).filter(({ value }) => value === 2 || value === 3 || value === 1 || value === 6);

  const { data: condicionesEspecialesData } = (await sgdeaAxios.get("/pqrd/listadoCondicionesEspeciales"));
  opTipoCondicionEspecial.value = condicionesEspecialesData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  }));

  const { data: medioRespuestaData } = (await sgdeaAxios.get("/pqrd/listadoMediosRespuesta"));
  opMedioRecibirRespuesta.value = medioRespuestaData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  }));
}

const getDataOthers = async () => {
  const { data: tipoDocsData } = (await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoIdentificacion"));
  opTipoDocumentoRemitente.value = tipoDocsData?.map((item: any) => ({
    value: item.id,
    label: item.nombre
  })).sort((a, b) => a.label.localeCompare(b.label));
  opTipoDocumentoAfectado.value = [...opTipoDocumentoRemitente.value];
  await loadGenero()
  await loadListadoCondiciones()
}


const mountedComponent = async () => {
  userInfo.value = await getUserInfo();

  const { data } = await sgdeaAxios.get("/correspondencia/comunicacion/listadoTipoTramite");
  opTipoTramite.value = data
    ?.filter(tramite =>
      tramite.nombre !== "Comunicación Interna" &&
      tramite.nombre !== "Retiro de empresa" &&
      tramite.nombre !== "Recepción documental" &&
      tramite.nombre !== "Mortales"
    )
    .map((item: any) => ({
      value: item.id,
      label: item.nombre
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const { optionsDepartments } = await useDepartments(form4PQRD.value.pais.value);
  departamentoOptions.value = optionsDepartments.value;
  departamentoOptionsPQRD.value = optionsDepartments.value;
}

async function loadGenero() {
  try {
    const response = await sgdeaAxios.get("/pqrd/listadoGenero")

    if (response.status == 200 || response.status == 201) {
      generoOptions.value = response.data.sort((a: { nombre: string; id: number; }, b: { nombre: string; id: number; }) => {
        const labelA = a.nombre.toUpperCase();
        const labelB = b.nombre.toUpperCase();
        if (labelA < labelB) {
          return -1;
        }
        if (labelA > labelB) {
          return 1;
        }
        return 0;
      }).map((e: { nombre: string; id: number; }) => {
        return {
          label: e.nombre,
          value: e.id
        };
      });
    }

  } catch (error) {
    toast.error("Error al cargar los generos");
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

    listadoCondiciones.value = sortOptions(listadoCondiciones.value)

  } catch (error) {
    toast.error("Error al cargar las condiciones especiales");
  }
}

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

const tutelaRadicar = async () => {
  await tutelaComp.value.createRadicado()
}

onMounted(async () => {
  mountedComponent()
  await obtenerPuntoRadicacionCorres();
  const { optionsDepartments } = await useDepartments();
  departamentos.value = optionsDepartments.value;
  await getDepartamentos(425);
})


function onlyAlphaNumeric(event: { which: any; keyCode: any; preventDefault: () => void; }) {
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

const isSelected = computed(() => camposGenerales.some(el => form1PQRD.value[el] !== null) ? null : v => inputRequired(v))
const camposGenerales = ['prestacionesAsistenciales', 'procesosIndemnizaciones', 'administracionPensiones', 'polizaVida', 'procesoAfiliaciones', 'procesoRecaudoCartera', 'procesosPromocionPrevencion', 'otro']
let arrSelected = ref([])
watch(
  () => form1PQRD.value,
  (value) => {
    const campoSeleccionado = camposGenerales.find(el => value[el] != null)
    const filedsSelect = camposGenerales.filter(field => value[field] !== null);
    if (campoSeleccionado && !arrSelected.value.includes(campoSeleccionado)) {
      arrSelected.value.push(campoSeleccionado)
    }
    if (filedsSelect.length > 1) {
      const removedElement = arrSelected.value.shift();
      value[removedElement] = null;
    }

    if (value.ciudad != '' && value.puntoRadicacion != '' && value.tipologiaPQRD != '' && campoSeleccionado) {
      myForm1PQRD.value.reset()
    }
  },
  { deep: true }
);

watch(() => form1.value.pais, async (value) => {
    form1.value.departamento = ''
    form1.value.municipio = ''
    //@ts-ignore
    await getDepartamentos(value.value);
});

watch(
  () => form1.value.departamento,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      form1.value.municipio = '';
    }
  }
);

watch(() => form1.value.departamento, async (value) => {
  //@ts-ignore
  if (form1.value.pais.value !== 425) {
    //@ts-ignore
    const {optionsMunicipalities} = await getMunicipios(value.value, form1.value.pais.value);
    municipioOptions.value = sortOptions(optionsMunicipalities.value);
  }else{
      const {optionsMunicipalities} = await useMunicipalities(value.value);
      municipioOptions.value = sortOptions(optionsMunicipalities.value)
  }
});

watch(
  () => form4PQRD.value.pais,
  async (value) => {
    let val = value.label as unknown as string
    form4PQRD.value.departamento = ''
    form4PQRD.value.municipio = ''
    if (val == 'Colombia') {
      isntColombia.value = false
      const { optionsDepartments } = await useDepartments(value.value);
      departamentoOptionsPQRD.value = optionsDepartments.value;
    } else {
      // @ts-ignore
      form4PQRD.value.departamento = { label: val, value: null }
      // @ts-ignore
      form4PQRD.value.municipio = { label: val, value: null }
      isntColombia.value = true
    }
  }
);

watch(
  () => form1.value.tipoDocumentoRemitente,
  (value) => {
    form1.value.numeroDocumentoRemitente = ''
  }
);

watch(
  () => form2.value.tipoDocumentoAfectado,
  (value) => {
    form2.value.numeroDocumento = ''
  }
);

watch(() => form3PQRD.value.sexo, async (newValue, oldValue) => {
  await loadGenero()
  const selectedOption = generoOptions.value.find(option => option.value === newValue);
  if (selectedOption) {
    sexoSelecionado.value = selectedOption.value
  }
});



watch(
  () => form4PQRD.value.departamento,
  async (value) => {
    if (!isntColombia.value) {
      form4PQRD.value.municipio = ''
    }

    if (value.value) {
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      municipioOptionsPQRD.value = optionsMunicipalities.value;
    }
  }
);

watch(() => form3PQRD.value.tipoDocumentoAfectado, () => {
  if ([8, 9, 10, 13].includes(Number(form3PQRD.value.tipoDocumentoAfectado))) {
    form3PQRD.value.perteneceComunidadLGBTIQ = false
    form3PQRD.value.sexo = 1
    form3PQRD.value.condicionEspecial = false
  } else {
    form3PQRD.value.perteneceComunidadLGBTIQ = null
    form3PQRD.value.sexo = ''
    form3PQRD.value.condicionEspecial = null
  }
})

const createRadicacion = async () => {
  if (form0.value.tipoTramite.label === 'PQRD') {
    if (await myForm4PQRD.value.validate()) {
      handleSubmitIsLoading.value = true;
      radicando.value = true
      const formData = new FormData();

      // @ts-ignore
      formData.append('datosGeneralesCiudad', form1PQRD.value.ciudad);
      formData.append('datosGeneralespuntoRadicacionId', form1PQRD.value.puntoRadicacion);
      formData.append('datosGeneralesTipologiaId', form1PQRD.value.tipologiaPQRD);
      formData.append('solicitudTipoPqrdId', form1PQRD.value.tipologiaPQRD);
      formData.append('datosRemitenteTipoRemitenteId', '2');
      formData.append('solicitudDescripcionAccesoInformacionId', '1');
      if (form1PQRD.value.prestacionesAsistenciales && form1PQRD.value.prestacionesAsistenciales !== '') {
        formData.append('datosGeneralesPrestacionesId', form1PQRD.value.prestacionesAsistenciales);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.prestacionesAsistenciales)
      }
      if (form1PQRD.value.procesosIndemnizaciones && form1PQRD.value.procesosIndemnizaciones !== '') {
        formData.append('datosGeneralesIndemnizacionesId', form1PQRD.value.procesosIndemnizaciones);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.procesosIndemnizaciones)
      }
      if (form1PQRD.value.administracionPensiones && form1PQRD.value.administracionPensiones !== '') {
        formData.append('datosGeneralesPensionesId', form1PQRD.value.administracionPensiones);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.administracionPensiones)
      }
      if (form1PQRD.value.polizaVida && form1PQRD.value.polizaVida !== '') {
        formData.append('datosGeneralesPolizasId', form1PQRD.value.polizaVida);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.polizaVida)
      }
      if (form1PQRD.value.procesoAfiliaciones && form1PQRD.value.procesoAfiliaciones !== '') {
        formData.append('datosGeneralesAfiliacionesId', form1PQRD.value.procesoAfiliaciones);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.procesoAfiliaciones)
      }
      if (form1PQRD.value.procesoRecaudoCartera && form1PQRD.value.procesoRecaudoCartera !== '') {
        formData.append('datosGeneralesRecaudoId', form1PQRD.value.procesoRecaudoCartera);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.procesoRecaudoCartera)
      }
      if (form1PQRD.value.procesosPromocionPrevencion && form1PQRD.value.procesosPromocionPrevencion !== '') {
        formData.append('datosGeneralesPromocionId', form1PQRD.value.procesosPromocionPrevencion);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.procesosPromocionPrevencion)
      }
      if (form1PQRD.value.otro && form1PQRD.value.otro !== '') {
        formData.append('datosGeneralesOtros', form1PQRD.value.otro);
        formData.append('solicitudTipoSolicitudId', form1PQRD.value.otro)
      }

      formData.append('datosRemitenteTipoDocumentoId', form2PQRD.value.tipoDocumentoRemitente);
      formData.append('datosRemitenteNumeroDocumento', form2PQRD.value.numeroDocumentoRemitente);
      formData.append('datosRemitenteNombre', form2PQRD.value.nombreRemitente.trimEnd());

      formData.append('datosAfectadoTipoDocumentoId', form3PQRD.value.tipoDocumentoAfectado);
      formData.append('datosAfectadoNumeroDocumento', form3PQRD.value.numeroDocumentoAfectado);
      formData.append('datosAfectadoNombre', form3PQRD.value.nombreAfectado.trimEnd());
      formData.append('datosAfectadoGeneroId', form3PQRD.value.sexo);
      // @ts-ignore
      formData.append('datosAfectadoLgtbtq', form3PQRD.value.perteneceComunidadLGBTIQ);
      // @ts-ignore
      formData.append('isCondicionEspecial', form3PQRD.value.condicionEspecial);
      if (form3PQRD.value.condicionEspecial) {
        formData.append('correspondenciaCondicionId', form3PQRD.value.tipoCondicionEspecial);
      }

      formData.append('datosAfectadoDireccion', form4PQRD.value.direccionContacto);
      formData.append('datosAfectadoPaisIdPais', form4PQRD.value.pais.value);
      if (form4PQRD.value.departamento.value && form4PQRD.value.departamento.value !== '') {
        formData.append('datosAfectadoDepartamentoIdDepartamento', form4PQRD.value.departamento.value);
      }
      if (form4PQRD.value.municipio.value && form4PQRD.value.municipio.value !== '') {
        formData.append('datosAfectadoMunicipioIdMunicipio', form4PQRD.value.municipio.value);
      }
      formData.append('barrioAfectado', form4PQRD.value.barrio)
      formData.append('datosAfectadoTelefonoCelular', form4PQRD.value.telefonoMovil);
      if (form4PQRD.value.telefonoFijo && form4PQRD.value.telefonoFijo !== '') {
        formData.append('datosAfectadoTelefonoFijo', form4PQRD.value.telefonoFijo);
      }
      if (form4PQRD.value.correo && form4PQRD.value.correo !== '') {
        formData.append('datosAfectadoCorreoElectronico', form4PQRD.value.correo);
      }
      formData.append('datosAfectadoMedioRespuestaId', form4PQRD.value.medioRespuesta);
      formData.append('correspondenciaDescripcionPQRD', form4PQRD.value.descripcionPQRD);
      // @ts-ignore
      formData.append('correspondenciaAnexoFolios', form4PQRD.value.anexoFolios);
      if (form4PQRD.value.anexoFolios) {
        formData.append('correspondenciaNroFolios', form4PQRD.value.cantidadFolios)
      }
      formData.append('correspondenciaMediosMagneticos', form4PQRD.value.mediosMagneticos);

      if (form4PQRD.value.docs?.length) {
        for (let i = 0; i < form4PQRD.value.docs.length; i++) {
          formData.append('files', form4PQRD.value.docs[i]);
        }
      }
      // @ts-ignore
      formData.append('canalRadicacion', 6);

      if (form3PQRD.value.sexoCual) {
        formData.append('datosAfectadoGeneroOtro', form3PQRD.value.sexoCual);
      }

      try {
        const response = await sgdeaAxios.post('/pqrd/radicar-pqrd', formData)
        handleSubmitIsLoading.value = false
        if (response.status === 201) {
          responseRadicado.value = response.data

          await crearTrazabilidad({
            proceso: `PQRD${responseRadicado.value.id}`,
            secuencia: responseRadicado.value.idRadicado,
            estado: response.data.estado.estado,
            descripcion: `Usuario: ${auth.userInfo.name}` + "Comentario:Se ha generado correctamente el radicado de la PQRD.",
            comentario: 'Creado',
            nombre: userInfo.value.name,
            tramite: "PQRD",
            accion: `Se radico el tramite #${response.data.idRadicado}`
          })
          // showSuccessModal.value = true
          showModalDescargaSticker.value = true
          radicando.value = false
        }
      } catch (error) {
        radicando.value = false
        toast.error('Ha ocurrido un error.')
      }
    } else {
      radicando.value = false
      toast.error('Debe completar los campos obligatorios para continuar.')
    }
  } else {
    handleSubmitIsLoading.value = true;
    const formData = new FormData();
    formData.append('tipoTramiteID', form0.value.tipoTramite.value);
    formData.append('usuarioCreadorID', userInfo.value.userid);
    if (userInfo.value.oficina != null) {
      formData.append('oficina', userInfo.value.oficina);
    }
    if (userInfo.value.puntoRadicacion !== null) {
      formData.append('puntoRadicacion', userInfo.value.puntoRadicacion);
    }
    formData.append('dependencia', userInfo.value.dependencia);
    formData.append('remitenteNumeroRadicadoEntidad', form1.value.numeroRadicadoEntidadRemitente);
    formData.append('remitenteNumeroFactura', form1.value.numeroFactura);
    formData.append('remitenteTipoDocumentoId', form1.value.tipoDocumentoRemitente);
    formData.append('remitenteNumeroDocumento', form1.value.numeroDocumentoRemitente);
    formData.append('remitenteNombre', form1.value.nombresRemitente);
    formData.append('remitentePaisId', form1.value.pais.value);
    if (form1.value.departamento.value && form1.value.departamento.value !== '') {
      formData.append('remitenteDepartamentoId', form1.value.departamento.value);
    }
     if (form1.value.municipio.value && form1.value.municipio.value !== '') {
      formData.append('remitenteMunicipioId', form1.value.municipio.value);
    }
    formData.append('remitenteDireccion', form1.value.direccionRemitente);
    if (form1.value.telefono && form1.value.telefono !== '') {
      formData.append('remitenteTelefono', form1.value.telefono);
    }
    formData.append('remitenteCorreo', form1.value.correoRemitente);
    formData.append('afectadoTipoDocumentoId', form2.value.tipoDocumentoAfectado);
    formData.append('afectadoNumeroDocumento', form2.value.numeroDocumento);
    formData.append('afectadoNombre', form2.value.nombreAfectado);
    formData.append('afectadoTelefono', form2.value.afectadoTelefono)
    if (form3.value.docs.length) {
      for (let i = 0; i < form3.value.docs.length; i++) {
        formData.append('files', form3.value.docs[i]);
      }
    }
    if (userInfo.value.puntoRadicacion && [19].includes(userInfo.value.puntoRadicacion)) {
      formData.append('esMesaBack', 'true');
    }
    try {
      const response = await sgdeaAxios.post('/correspondencia/ventanilla/crear', formData)
      if (response.status === 201) {
        await crearTrazabilidad({
          proceso: `COR${response.data.id}`,
          secuencia: response.data.idRadicado,
          estado: response.data.estadoProceso.estado,
          descripcion: `Se ha creado el radicado #${response.data.idRadicado}`,
          comentario: 'Creado',
          nombre: userInfo.value.name,
          tramite: response.data.tipoTramite.nombre,
          accion: `Se radico el tramite #${response.data.idRadicado}`
        })
        responseRadicado.value = response.data

        showModalDescargaSticker.value = true
        // showSuccessModal.value = true
      }
    } catch (error) {
      toast.error('Ha ocurrido un error.')
      handleSubmitIsLoading.value = false;
    }
  }
};

const cancelarFormulario = async () => {
  router.push('/home')

}

function onlyAlphabetic(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;

  // Convert the charCode to a String
  let charTyped = String.fromCharCode(charCode);

  // Define a regex for alphanumeric characters and Spanish special characters
  let regex = /^[a-zA-Z áéíóúÁÉÍÓÚÑñ]*$/;

  // Check if the character matches the regex
  if (regex.test(charTyped)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

const download = async () => {
  if (showSuccessModal.value) {
    const { data: listDocs } = await sgdeaAxios.get<any>(
      `/radicados/obtenerHijosPorNodo/${responseRadicado.value.nodeId}`
    );

    const docRadicado = listDocs.list.entries?.find((it) => {
      const entryName = it.entry.name
      return entryName && entryName.startsWith(responseRadicado.value.idRadicado)
    })

    const { data } = await sgdeaAxios.get<DocumentoRadicado>(
      `/radicados/consultar_documento/${docRadicado.entry.id}`
    );
    const byteCharacters = atob(data.base64x);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = String(responseRadicado.value.idRadicado);

    link.click();

    URL.revokeObjectURL(blobUrl);

    router.push("/home")

  } else {
    modalPreguntaCancelar.value = false
  }
}

const puntoRadicacion = ref();
const puntoRadicacionDep = ref();
const puntoRadicacionMun = ref();
const isDisable = ref(false)

const obtenerPuntoRadicacionCorres = async () => {
  const idPuntoRadicacion = auth.$state.userInfo.puntoRadicacion;
  if (idPuntoRadicacion) {
    const response = await sgdeaAxios.get(`/correspondencia/puntoRadicacion/${idPuntoRadicacion}`);
    puntoRadicacion.value = response.data.nombrePunto;
    puntoRadicacionDep.value = response.data.departamento;
    puntoRadicacionMun.value = response.data.municipio;
  }
}

const handleFilesFromScanner = async (files: File[]) => {
  if (!files || files.length === 0) {
    toast.error('No se seleccionó ningún archivo para adjuntar.');
    return;
  }

  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    // 2. Obtener los IDs dinámicos que necesitas
    const radicadoId = responseRadicado.value.id;
    const userId = userInfo.value.userid;

    // 3. Construir la URL del endpoint dinámicamente
    const url = `/correspondencia/documentos/${radicadoId}?user=${userId}&tipoDocumento=ENTRADA`;

    const response = await sgdeaAxios.post(url, formData);

    // 5. Manejar la respuesta exitosa
    if (response.status === 200 || response.status === 201) {
      toast.success(`${files.length} archivo(s) adjuntado(s) correctamente al radicado ${responseRadicado.value.idRadicado}.`);
      cancelarFormulario();
    } else {
      toast.warning('El servicio respondió, pero con un estado inesperado.');
    }

  } catch (error) {
    console.error('Error al adjuntar documentos:', error);
    toast.error('Ocurrió un error al intentar adjuntar los documentos.');
  }
};
const imprimirStickerPQRD = async () => {
  const body = {
    idRadicado: responseRadicado.value.idRadicado,
    numeroDocumento: responseRadicado.value.remitente.numeroDocumento,
    oficina: responseRadicado.value.datosGeneralesPQRD.puntoRadicacion.nombrePunto,
    departamento: responseRadicado.value.datosGeneralesPQRD.puntoRadicacion.departamento,
    municipio: responseRadicado.value.datosGeneralesPQRD.ciudad,
    tipoTramite: "PQRD",
    fechaRadicacion: moment(responseRadicado.value.datosGeneralesPQRD.fechaRadicacion).format('YYYY-MM-DDTHH:mm:ss'),
    PuntoRadicacion: responseRadicado.value.datosGeneralesPQRD.puntoRadicacion.nombrePunto,
    //dependencia: responseRadicado.value.datosGeneralesPQRD.puntoRadicacion.id_dependencia.idSeccionSubSeccion.toString(),
  };

  try {

    const response = await sgdeaAxios.post(`/sticker/generarSticker/pdf`, body, {
      responseType: 'blob' // Set the response type to 'blob'
    });

    if (response.status === 200) {
      // Create a Blob object from the response data
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.download = `STICKER${responseRadicado.value.id}.pdf`; // Specify the file name

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to download the file
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

    }

         showModalDescargaSticker.value = false;
        showScanModal.value = true;

  } catch (error) {
    console.error(error);
  }

}

const imprimirSticker = async () => {
  const body = {
    idRadicado: responseRadicado.value.idRadicado,
    telefono: responseRadicado.value.remitente.telefono ? responseRadicado.value.remitente.telefono.toString() : '',
    numeroDocumento: responseRadicado.value.remitente.numeroDocumento,
    oficina: responseRadicado.value.puntoRadicacion ? puntoRadicacion.value : responseRadicado.value.idOficina ? responseRadicado.value.idOficina.nombre:"",
    departamento: puntoRadicacionDep.value,
    municipio: puntoRadicacionMun.value,
    tipoTramite: responseRadicado.value.tipoTramite.nombre,
    PuntoRadicacion: puntoRadicacion.value,
    fechaRadicacion: moment(responseRadicado.value.fechaRadicacion).format('YYYY-MM-DDTHH:mm:ss'),
    dependencia: responseRadicado.value.dependencia.toString(),
  };

  try {
    const response = await sgdeaAxios.post(`/sticker/generarSticker/pdf`, body, {
      responseType: 'blob' // Set the response type to 'blob'
    });

    if (response.status === 200) {
      // Create a Blob object from the response data
      const fileBlob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(fileBlob);
      link.download = `STICKER${responseRadicado.value.idRadicado}.pdf`; // Specify the file name

      // Append the link to the body
      document.body.appendChild(link);

      // Programmatically trigger a click on the link to download the file
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      showModalDescargaSticker.value = false;
      showScanModal.value = true;
    }

  } catch (error) {
    console.error(error);
  }
  // showSuccessModal.value = true
}

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it: { failedPropValidation: string; }) => it.failedPropValidation === 'accept')) {
    toast.error('Formato inválido, los formatos permitidos son (pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg).')
  }
};

const filterPais = (val, update) => {
  if (val === '') {
    update(() => {
      opsForCountries.value = optionsCountries.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opsForCountries.value = optionsCountries.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const filterDep = (val, update) => {
  let departmentOptionsToUse = form0.value.tipoTramite?.label === 'PQRD' ? departamentoOptionsPQRD.value : departamentoOptions.value;

  if (val === '') {
    update(() => {
      opsFordepartamentoOptions.value = departmentOptionsToUse;
    });
    return;
  }

  const needle = val.toLowerCase();
  update(() => {
    opsFordepartamentoOptions.value = departmentOptionsToUse.filter(v => v.label.toLowerCase().includes(needle));
  });
}

const filterMun = (val, update) => {
  let muniOptionsToUse = form0.value.tipoTramite?.label === 'PQRD' ? municipioOptionsPQRD.value : municipioOptions.value;
  if (val === '') {
    update(() => {
      opsFormunicipioOptions.value = muniOptionsToUse
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opsFormunicipioOptions.value = muniOptionsToUse.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}
const isTramite = ref(false);

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"

onMounted(() => {
  const tiposTramite = [
    'Informativos',
    'Contratos',
    'Mortales',
    'Procesos jurídicos',
    'Correspondencia',
    'Comunicación Interna',
    'Facturas servicios públicos',
    'Retiro de empresa'
  ];

  if (tiposTramite.includes(form0.value.tipoTramite?.label)) {
    isTramite.value = true;
  }
});

async function getPerson() {
  const tipoDoc = getAcronimobyId(Number(form1.value.tipoDocumentoRemitente))
  const number = Number(form1.value.numeroDocumentoRemitente) ? Number(form1.value.numeroDocumentoRemitente) : ''
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

      form1.value.nombresRemitente = fullName
      form1.value.direccionRemitente = response.data.direccion
      form1.value.telefono = response.data.telefono
      form1.value.correoRemitente = response.data.email
      form1.value.pais = { label: response.data.pais.nombre, value: response.data.pais.idPais }
      setTimeout(() => {
        form1.value.departamento = { label: response.data.departamento.nombre, value: response.data.departamento.idDepartamento }
      });
      setTimeout(() => {
        form1.value.municipio = { label: response.data.municipio.nombre, value: response.data.municipio.idMunicipio }
      });
    } else {
      await limpiarExterno()
    }
  } catch (error) {
    console.error(error)
    await limpiarExterno()
  }
}

async function getPerso() {
  const tipoDoc = getAcronimobyId(Number(form2.value.tipoDocumentoAfectado))
  const number = Number(form2.value.tipoDocumentoAfectado) ? Number(form2.value.numeroDocumento) : ''
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

      form2.value.nombreAfectado = fullName

      form2.value.afectadoTelefono = response.data.telefono

    } else {
      await limpiarExternoS()
    }
  } catch (error) {
    console.error(error)
    await limpiarExternoS()
  }
}

async function getPersonInfo() {
  const tipoDoc = getAcronimobyId(Number(form2PQRD.value.tipoDocumentoRemitente))
  const number = Number(form2PQRD.value.tipoDocumentoRemitente) ? Number(form2PQRD.value.numeroDocumentoRemitente) : ''
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


      form2PQRD.value.nombreRemitente = fullName


    } else {
      await clearExternal()
    }
  } catch (error) {
    console.error(error)
    await clearExternal()
  }
}

async function getPersonProfile() {
  const tipoDoc = getAcronimobyId(Number(form3PQRD.value.tipoDocumentoAfectado))
  const number = Number(form3PQRD.value.tipoDocumentoAfectado) ? Number(form3PQRD.value.numeroDocumentoAfectado) : ''
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

      form3PQRD.value.nombreAfectado= fullName
      form3PQRD.value.sexo = response.data.genero
      form3PQRD.value.sexoCual = response.data.otroGenero
      form3PQRD.value.perteneceComunidadLGBTIQ = response.data.lgtbtq
      form3PQRD.value.condicionEspecial = response.data.isCondicionEspecial
      form3PQRD.value.tipoCondicionEspecial = response.data.correspondenciaCondicionId
    } else {
      await cleanExternal()
    }
  } catch (error) {
    console.error(error)
    await cleanExternal()
  }
}


const clearExternal = async () => {
  form2PQRD.value.nombreRemitente = ''
  await myForm2PQRD.value.reset()
}

const cleanExternal = async () => {
  form3PQRD.value.nombreAfectado = ''
   form3PQRD.value.perteneceComunidadLGBTIQ = null
   form3PQRD.value.sexo = ''
   form3PQRD.value.sexoCual = ''
   form3PQRD.value.condicionEspecial = null
  await myForm3PQRD.value.reset()
}



const limpiarExterno = async () => {
  form1.value.nombresRemitente = ''
  form1.value.direccionRemitente = ''
  form1.value.telefono = ''
  form1.value.correoRemitente = ''
  form1.value.pais = { label: 'Colombia', value: 425 }
  form1.value.departamento = ''
  form1.value.municipio = ''
  await myForm1.value.reset()
}

const limpiarExternoS = async () => {
  form2.value.nombreAfectado = ''
  form2.value.afectadoTelefono = ''
  await myForm2.value.reset()
}

watch(() => form1.value.pais.value, (value) => {
  isDisable.value = false;
  //form1.value.departamento = '';
  //@ts-ignore
  if (value !== 425) {
    form1.value.departamento = getLabel(form1.value.pais, optionsCountries.value);
    isDisable.value = true;
  }
})





const getLabel = (value, options) => {
  let option = options.find(option => option.value === value);
  if (!option && value && typeof value === 'string') {
    option = { label: value }
  }
  return option ? option.label : '';
}

const atLeastOnePhoneNumber = (value, form4PQRD) => {
  if (!form4PQRD.telefonoMovil && !form4PQRD.telefonoFijo) {
    return 'Debe digitar al menos un número de teléfono (celular o fijo)';
  }
  return true;
};


const getDepartamentos = async (paisId) => {

  if (paisId == 425) {
    const response = await sgdeaAxios.get(`/geodivision/pais/${paisId}`);
    if (response.status === 200) {
      const { data } = response;
      departmentsOptions.value = data.map((departamento) => {
        return {
          value: departamento.idDepartamento,
          label: departamento.nombre,
        };
      });
    }
  } else {
    const paisEncontrado = optionsCountries.value.find(p => p.value === paisId);
    const idPositiva = paisEncontrado.idPositiva;
    const response = await sgdeaAxios.get(`/geodivision/departamento/${idPositiva}`);
    if (response.status === 200) {
      const { data } = response;
      departmentsOptions.value = data.map((departamento) => {
        return {
          value: departamento.idDepartamento,
          label: departamento.nombre,
        };
      });
    }
  }
};

const getMunicipios = async (departamentoId, paisId) => {
  const paisEncontrado = optionsCountries.value.find(p => p.value === paisId);
  const idPositiva = paisEncontrado.idPositiva;
  const response = await sgdeaAxios.get(`/geodivision/municipios/${idPositiva}?idDepartamento=${departamentoId}`);
  if (response.status === 200) {
    const { data } = response;
    municipioOptions.value = data.map((municipio) => {
      return {
        value: municipio.idMunicipio,
        label: municipio.nombre,
      };
    });
  }
};

</script>
