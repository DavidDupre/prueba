<template>
  <div class="q-py-lg">
    <span v-on:click="router.push({ name: 'Factura administrativa' })" class="tw-text-primary"
      style="text-decoration: none;cursor:pointer">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver </b>
    </span>
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-flex tw-flex-col">
        <ComponentTitle class="q-mt-lg" :title="`Factura Administrativa #${initialData.sec}`"
          classTitle="tw-font-bold tw-text-4xl" />

        <q-chip class="tw-text-center" square :ripple="false"
          style="border: .5px solid #0049FF; background: #E5EDFF; color: #2C3948; border-radius: 8px; width: 100px; padding: 8px 10px;">
          {{ checkStatus(initialData.estado) }}
        </q-chip>
      </div>
    </div>

    <q-card :key="uiTabsKey" class="tw-rounded-xl tw-mt-8" flat bordered>
      <q-tabs v-model="tab" no-caps indicator-color="white" align="left" outside-arrows>
        <q-tab :key="tab.key" :name="tab.key" :ripple="false" class="tw-px-2"
          @click="event => handleSwitchTab(event, tab)" v-for="tab in filteredTabs">
          <q-chip :icon="tab.icon" square :ripple="false" class="tw-pl-4"
            style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
            {{ tab.name }}
          </q-chip>
        </q-tab>
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="tw-bg-transparent">
      <q-tab-panel name="infoGeneral" class="q-pa-none">
        <template v-if="isEdit">
          <q-form ref="forms">
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
                        <q-select v-model="formInfo.dependencia" map-options :options="optionsDependencias"
                          @update:model-value="v => edited = true" label="Seleccione" dense outlined
                          class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Responsable del proceso</label>
                        <q-select v-model="formInfo.responsable" map-options emit-value label="Seleccione"
                          @update:model-value="v => edited = true" :options="options" dense outlined
                          class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <!-- Tipo de trámite y Tipo de remitente -->
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de trámite *</label>
                        <q-select v-model="formInfo.tipoTramite" map-options emit-value label="Seleccione" dense
                          :options="tipoTramite" outlined class="tw-rounded-lg" :rules="[inputRequired]" disable>

                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de remitente *</label>
                        <q-select v-model="formInfo.tipoRemitente" label="Seleccione" dense map-options emit-value
                          @update:model-value="v => edited = true" outlined :options="tipoRemitente"
                          class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <!-- País, Departamento y Municipio -->
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">País *</label>
                        <q-select v-model="formInfo.pais" label="Seleccione" dense outlined map-options emit-value
                          @update:model-value="v => edited = true" class="tw-rounded-lg" :options="optionsPaises"
                          :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Departamento *</label>
                        <q-select v-model="formInfo.departamento" label="Seleccione" dense outlined
                          @update:model-value="v => edited = true" class="tw-rounded-lg" :rules="[inputRequired]"
                          :options="optionsDepartamentos" :disable="isntColombia">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Municipio *</label>
                        <q-select v-model="formInfo.municipio" label="Seleccione" dense outlined class="tw-rounded-lg"
                          @update:model-value="v => edited = true" :rules="[inputRequired]" :options="optionsMunicipios"
                          :disable="isntColombia">
                        </q-select>
                      </span>
                    </div>

                    <!-- Canal de recepción -->
                    <div class="col-12">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Canal de recepción *</label>
                        <q-select v-model="formInfo.canal" map-options emit-value label="Seleccione" dense disable
                          outlined class="tw-rounded-lg" :options="optionsCanales" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <!-- Tipo de documento y Número de identificación -->
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de documento *</label>
                        <q-select v-model="formInfo.tipoDocumento" label="Seleccione" map-options emit-value dense
                          @update:model-value="v => edited = true" outlined :options="tipoDocumento"
                          class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Número de identificación *</label>
                        <q-input v-model.number="formInfo.numeroDocumento" @update:model-value="v => edited = true"
                          :rules="[inputRequired, Number(formInfo.tipoDocumento) == 11 ? alphanumeric : (v: string) => onlyNumbers(v), (val) => maxLengthInput(15, val)]" dense label="Ingrese"
                          outlined class="tw-rounded-lg" @blur="blurSearchUser">
                        </q-input>
                      </span>
                    </div>

                    <!-- Primer apellido, Segundo apellido, Primer nombre y Otros nombres -->
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Primer apellido *</label>
                        <q-input v-model="formInfo.primerApellido" dense label="Ingrese" filled class="tw-rounded-lg"
                          :rules="[inputRequired]" readonly />
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Segundo apellido *</label>
                        <q-input v-model="formInfo.segundoApellido" dense label="Ingrese" filled class="tw-rounded-lg"
                          :rules="[inputRequired]" readonly />
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Primer nombre *</label>
                        <q-input v-model="formInfo.primerNombre" dense label="Ingrese" filled class="tw-rounded-lg"
                          :rules="[inputRequired]" readonly />
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="!isNit">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Otros nombres</label>
                        <q-input v-model="formInfo.otrosNombres" dense label="Ingrese" filled class="tw-rounded-lg"
                          :rules="[]" readonly />
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="isNit">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Razón Social</label>
                        <q-input v-model="formInfo.razonSocial" dense label="Ingrese" filled class="tw-rounded-lg"
                          :rules="[]" readonly />
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="isNit">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Nombre Comercial</label>
                        <q-input v-model="formInfo.nombreComercial" dense label="Ingrese" filled class="tw-rounded-lg"
                          :rules="[]" readonly />
                      </span>
                    </div>

                    <!-- Dirección -->
                    <div class="col-12">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Dirección *</label>
                        <q-input v-model="formInfo.direccion" dense outlined label="Ingrese" class="tw-rounded-lg"
                          @update:model-value="v => edited = true"
                          :rules="[inputRequired, alphanumericWithSpaceAndHashtag, val => maxLengthInput(30, val)]" />
                      </span>
                    </div>

                    <!-- Teléfono, Celular y Correo electrónico -->
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Teléfono *</label>
                        <q-input v-model.number="formInfo.telefono" @update:model-value="v => edited = true"
                          :rules="[inputRequired, onlyNumbers, homePhoneNumber]" dense label="Ingrese" outlined
                          class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Celular *</label>
                        <q-input v-model.number="formInfo.celular" @update:model-value="v => edited = true"
                          :rules="[inputRequired, onlyNumbers, mobilePhonNumber]" dense label="Ingrese" outlined
                          class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Correo electrónico *</label>
                        <q-input v-model="formInfo.email" @update:model-value="v => edited = true"
                          :rules="[inputRequired, validationEmail, val => maxLengthInput(200, val)]" dense
                          label="Ingrese" outlined class="tw-rounded-lg">
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
                      Información factura administrativa
                    </p>
                  </div>
                </template>

                <div class="tw-mt-2">
                  <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <!-- Número de radicado de la entidad remitente y Número de factura -->
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Fecha de la factura *</label>
                        <DatePickerComponent v-model:input-data-prop="formInfo.fechaFac" dense label="dd / mm / aaaa"
                          outlined class="tw-rounded-lg" disabled mask="DD/MM/YYYY">
                        </DatePickerComponent>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Número de radicado de la entidad remitente</label>
                        <q-input v-model="formInfo.numeroRadicado" dense label="Ingrese" outlined class="tw-rounded-lg"
                          @update:model-value="v => edited = true"
                          :rules="[alphanumeric, val => maxLengthInput(70, val)]">
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Número de factura *</label>
                        <q-input v-model="formInfo.numeroFactura"
                          :rules="[inputRequired, alphanumeric, val => minLengthInput(5, val), val => maxLengthInput(70, val)]"
                          dense label="Ingrese" outlined class="tw-rounded-lg" @update:model-value="v => edited = true">
                        </q-input>
                      </span>
                    </div>

                    <!-- Descripción (detalle) -->
                    <div class="col-12">
                      <span class="w-full">
                        <label class="tw-text-label">Descripción (Detalle) {{ formInfo.descripcion.length }}/2000
                          *</label>
                        <q-input v-model="formInfo.descripcion" dense outlined class="tw-rounded-lg" :rules="[
                          inputRequired,
                          alphanumeric,
                          (val) => maxLengthInput(2000, val),
                        ]" type="textarea" @update:model-value="v => edited = true" />
                      </span>
                    </div>

                    <!-- Valor y Valor en letras -->
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Valor *</label>

                        <q-input v-model="formInfo.valor" prefix="$" @update:model-value="v => edited = true"
                          :rules="[inputRequired, onlyNumbers, val => maxLengthInput(10, val), val => val > 0 || 'El valor debe ser mayor a cero']"
                          dense label="Ingrese" outlined class="tw-rounded-lg" mask="#.###.###.###" unmasked-value
                          reverse-fill-mask maxlength="12"></q-input>
                      </span>
                    </div>


                    <!-- Medio que autoriza para envío de respuesta -->
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Medio que autoriza para envío de respuesta *</label>
                        <q-select v-model="formInfo.medio" label="Seleccione" dense outlined map-options emit-value
                          @update:model-value="v => edited = true" :options="medioOptions" class="tw-rounded-lg"
                          :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 q-mx-md">
                  <span class="tw-w-full">
                    <label class="tw-text-label">Valor en letras *</label>
                    <q-input v-model="formInfo.valorLetra" :rules="[inputRequired]" dense label="Ingrese" filled
                      class="tw-rounded-lg" disable>
                    </q-input>
                  </span>
                </div>
              </q-expansion-item>
            </q-card>

            <!-- Campos automáticos al radicar -->
            <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
              <q-expansion-item default-opened>
                <template v-slot:header>
                  <div class="col row">
                    <b class="tw-text-lg">Campos Automáticos al Radicar</b>
                  </div>
                </template>
                <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
                  <div class="tw-flex tw-flex-col tw-w-[48%]">
                    <p class="titles">FECHA / sistema a radicar</p>
                    <p>{{ moment(formInfo.fechaFormateada, 'DD/MM/YYYY hh:mm:ss a').format("DD/MM/YYYY") }}</p>
                  </div>
                  <div class="tw-flex tw-flex-col tw-w-[48%]">
                    <p class="titles">HORA / sistema al radicar</p>
                    <p>{{ moment(formInfo.fechaFormateada, 'DD/MM/YYYY hh:mm:ss a').format("HH:mm") }}</p>
                  </div>
                  <div class="tw-flex tw-flex-col tw-w-[48%]">
                    <p class="titles">Estado de trámite</p>
                    <p>{{ checkStatus(formInfo.estado) }}</p>
                  </div>
                </div>
              </q-expansion-item>
            </q-card>
            <div class="col row justify-center q-gutter-x-md q-my-md">
              <q-btn color="accent" textColor="secondary" label="Cancelar" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " type="reset" no-caps @click="cancelModal = true" />

              <q-btn color="primary" label="Guardar" style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          " :disabled="!edited" @click="sendFunction" :loading="handleSubmitIsLoading" />
            </div>
          </q-form>
        </template>

        <template v-else>
          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="row justify-between tw-w-full">
                  <b class="tw-text-lg">Información Básica Radicación</b>
                  <q-btn v-if="initialData.estado == 'Por asignar' || initialData.estado == 'En asignación'" icon="edit" color="secondary" label="Editar" dense
                    class="q-py-xs" @click="e => { e.preventDefault(); isEdit = true }"></q-btn>
                </div>
              </template>
              <div class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8">
                <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                  <p class="titles">Dependencia</p>
                  <p>{{ initialData.dependencia }}</p>
                  <p class="titles">Tipo de trámite</p>
                  <p>{{ initialData.tipoTramite }}</p>
                  <p class="titles">Tipo de documento</p>
                  <p>
                    {{ tipoDocumento.find(item => item.value === initialData.tipoDocumento)?.label }}
                  </p>
                  <p v-if="!isNit" class="titles">Primer apellido</p>
                  <p v-if="!isNit">{{ initialData.primerApellido }}</p>
                  <p v-if="!isNit" class="titles">Primer nombre</p>
                  <p v-if="!isNit">{{ initialData.primerNombre }}</p>
                  <p v-if="isNit" class="titles">Razón Social</p>
                  <p v-if="isNit">{{ initialData.razonSocial }}</p>
                </div>

                <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                  <p class="titles">Responsable del proceso</p>
                  <p>{{ initialData.responsable }}</p>
                  <p class="titles">Canal de recepción</p>
                  <p>{{ initialData.canal }}</p>
                  <p class="titles">Número de identificación</p>
                  <p>{{ initialData.numeroDocumento }}</p>
                  <p v-if="!isNit" class="titles">Segundo apellido</p>
                  <p v-if="!isNit">{{ initialData.segundoApellido }}</p>
                  <p v-if="!isNit" class="titles">Otros nombres</p>
                  <p v-if="!isNit">{{ initialData.otrosNombres }}</p>
                  <p v-if="isNit" class="titles">Nombre Comercial</p>
                  <p v-if="isNit">{{ initialData.nombreComercial }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                  <p class="titles">Dirección</p>
                  <p>{{ initialData.direccion }}</p>
                  <p class="titles">Teléfono</p>
                  <p>{{ initialData.telefono }}</p>
                  <p class="titles">Celular</p>
                  <p>{{ initialData.celular }}</p>
                  <p class="titles">País</p>
                  <p>{{ initialData.pais }}</p>
                  <p class="titles">Departamento</p>
                  <p>{{ initialData.departamento }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                  <p class="titles">Municipio</p>
                  <p>{{ initialData.municipio }}</p>
                  <p class="titles">Correo Electrónico</p>
                  <p>{{ initialData.email }}</p>
                  <p class="titles">Tipo de Remitente</p>
                  <p>{{ initialData.tipoRemitente }}</p>
                </div>
              </div>
            </q-expansion-item>
          </q-card>

          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <b class="tw-text-lg">Información de Factura Administrativa</b>
                </div>
              </template>
              <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
                <div class="tw-flex tw-flex-col tw-w-full">
                  <p class="titles">Número de Factura</p>
                  <p>{{ initialData.numeroFactura }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-full">
                  <p class="titles">Fecha de Factura</p>
                  <p>{{ initialData.fechaFac }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-full">
                  <p class="titles">Número de radicado de la entidad remitente </p>
                  <p>{{ initialData.numeroRadicado }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-full">
                  <p class="titles">Medio que autoriza para envío de respuesta</p>
                  <p>{{ initialData.medio }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-full">
                  <p class="titles">Descripción (Detalle)</p>
                  <p class="tw-overflow-hidden tw-w-[1000px] tw-break-words">{{ initialData.descripcion }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Valor</p>
                  <p>$ {{ initialData.valor?.toLocaleString('es-ES') }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Valor en letras</p>
                  <p>{{ initialData.valorLetra }}</p>
                </div>
              </div>
            </q-expansion-item>
          </q-card>

          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <b class="tw-text-lg">Campos Automáticos al Radicar</b>
                </div>
              </template>
              <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">FECHA / sistema a radicar</p>
                  <p>{{ moment(formInfo.fechaFormateada, 'DD/MM/YYYY hh:mm:ss a').format("DD/MM/YYYY") }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">HORA / sistema al radicar</p>
                  <p>{{ moment(formInfo.fechaFormateada, 'DD/MM/YYYY hh:mm:ss a').format("HH:mm") }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Estado de trámite</p>
                  <p>{{ checkStatus(initialData.estado) }}</p>
                </div>
              </div>
            </q-expansion-item>
          </q-card>

          <q-card class="tw-rounded-xl tw-mt-4" flat bordered v-if="dataNDNC">
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <b class="tw-text-lg">Información ND/NC</b>
                </div>
              </template>
              <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Número de radicado anterior</p>
                  <p>{{ dataNDNC.numeroRadicadoAnterior }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Número de Factura</p>
                  <p>{{ dataNDNC.numeroFactura }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Tipificacion</p>
                  <p>{{ dataNDNC.tipificacion }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Número de la Nota</p>
                  <p>{{ dataNDNC.numeroNota }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Valor del Ajuste</p>
                  <p>{{ dataNDNC.valorAjuste }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Dependecia</p>
                  <p>{{ dataNDNC.dependecia }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Proveedor</p>
                  <p>{{ dataNDNC.proveedor }}</p>
                </div>
                <div class="tw-flex tw-flex-col tw-w-[48%]">
                  <p class="titles">Descripción</p>
                  <p>{{ dataNDNC.descripcion }}</p>
                </div>
              </div>
            </q-expansion-item>
          </q-card>

        </template>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Documentos Cargados</b>
              </div>
            </template>

            <p class="titles q-px-md q-mb-md q-mt-lg">Documento de soporte</p>

            <div class="tw-flex tw-flex-col row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm tw-mr-auto" flat bordered
                :key="doc.id" v-for="doc in radicadoDoc">
                <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.content.mimeType)">
                <p class="tw-text-sm tw-font-semibold">{{ doc.name }}</p>
                <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                <button @click="() => handleOpenDocFile(doc.id, doc.name)">
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="file_download" />
                </button>
              </q-card>
            </div>
            <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos </p>

            <div class="tw-flex tw-flex-col row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm tw-mr-auto" flat bordered
                :key="doc.id" v-for="doc in filteredDocs">
                <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.content.mimeType)">
                <p class="tw-text-sm tw-font-semibold">{{ doc.name }}</p>
                <q-icon v-if="doc.formato.includes('pdf')" size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                <button @click="() => handleOpenDocFile(doc.id, doc.name)">
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="file_download" />
                </button>
              </q-card>
            </div>
          </q-expansion-item>

        </q-card>
      </q-tab-panel>
      <q-tab-panel name="trazabilidad">
        <q-card class="tw-rounded-xl tw-mt-4 q-pa-md" flat bordered>
          <div class="col row">
            <p class="tw-text-lg text-weight-bold q-mx-lg">
              Trazabilidad
            </p>

            <div class="col-12 tw-mt-2">
             <Trazabilidad :TABLE_BODY="trazabilidadData" />
            </div>
          </div>
        </q-card>
      </q-tab-panel>

      <!-- ! Comentarios -->
      <q-tab-panel name="comentarios">
        <Comentarios :facData="initialData" text-default="Ha comentado sobre la radicación" />
      </q-tab-panel>

      <!-- Gestion -->
      <q-tab-panel name="gestion" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4 q-pa-md" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Gestión de Factura Administrativa</b>
              </div>
            </template>
            <q-form ref="gestionRef">
              <div class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-2 tw-flex-col">
                <p class="tw-w-full mt-2 tw-font-semibold">¿Es necesario realizar una nota de ajuste NC (Nota crédito) o
                  ND (Nota
                  débito)?</p>
              </div>
              <div class="tw-flex tw-leading-6 tw-w-1/2 tw-justify-between q-px-md">
                <q-radio v-model="realizarAjuste" label="Si" val="s"></q-radio>
                <q-radio v-model="realizarAjuste" label="No" val="n"></q-radio>
              </div>

              <div class="tw-flex-col tw-leading-6 tw-w-1/2 tw-justify-between q-px-md" v-if="realizarAjuste == 's'">

                <span class="tw-w-full">
                  <label class="tw-text-label">Valor Ajuste</label>
                  <q-input v-model="valorAjuste" label="Inserte" prefix="$" outlined class="tw-rounded-lg" dense
                    mask="#.###.###.###" unmasked-value reverse-fill-mask maxlength="12"
                    :rules="[inputRequired, onlyNumbers, val => maxLengthInput(12, val), val => val > 0 || 'El valor debe ser mayor a cero']"></q-input>
                </span>
                <span class="tw-w-full">
                  <label class="tw-text-label">Tipificación</label>
                  <q-select :options="['NC', 'ND']" flat map-options emit-value dense outlined
                    v-model="tipificacionSelect" :rules="[inputRequired]"></q-select>
                </span>
              </div>
              <div class="tw-flex tw-gap-5 tw-mt-10 tw-justify-end">
                <q-btn @click="() => modalRechazoCancelar = true" color="primary" label="Cancelar"
                  class="q-px-xl"></q-btn>
                <q-btn icon="save" @click="guardarAjuste" color="secondary" label="Gestionar" class="q-pa-md"></q-btn>
              </div>
            </q-form>
          </q-expansion-item>
        </q-card>
      </q-tab-panel>
      <!-- Incluir Expediente -->
      <q-tab-panel name="incluirExpediente">
        <incluirExpediente :cobro-data="initialData" />
      </q-tab-panel>
      <!-- Documentos relacionados -->
      <q-tab-panel name="docsRelacionados">
        <q-card class="tw-rounded-xl tw-mt-4 q-pa-md tw-max-w-full" flat bordered>
          <div class="col ">
            <div class="tw-flex tw-justify-between">
              <p class="tw-text-lg text-weight-bold q-mx-lg">
                Listado de Documentos Cargados
              </p>
              <q-btn label="Subir un Documento" color="primary" icon="add" @click="modalDocuments = true" />
            </div>
            <div class="tw-flex tw-justify-end tw-items-center w-full tw-gap-x-2 tw-py-3"
              v-if="selectedDocs?.length !== 0">
              <p class="tw-text-sm tw-font-semilight q-mx-lg">
                Cantidad seleccionada: {{ selectedDocs.length }}</p>
              <q-btn label="Eliminar" color="negative" icon="delete" @click="deleteDocs" />
            </div>

            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md tw-max-w-full">
              <TableDocs :DOCUMENTOS_BODY="loadedDocs" class="tw-w-full" v-model:selected-items="selectedDocs"
                :visualize="getBlobToIframe" />
            </div>
          </div>
        </q-card>
        <div v-if="visualizadorPDF" class="tw-h-full tw-w-full">
          <q-dialog v-model="visualizadorPDF" seamless position="right" class="">
            <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
              <q-btn @click="visualizadorPDF = false"
                class="tw-absolute tw-ml-12 tw-mt-3 tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
              <iframe class="tw-h-full tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
            </q-card>
          </q-dialog>
        </div>
      </q-tab-panel>
      <!-- Asignar -->
      <q-tab-panel name="asignar" v-if="!asignado" class="q-pa-none">
        <q-form ref="asignarRef">
          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <h3 class="text-bold tw-text-xl  q-mx-md">
                    Área Encargada
                  </h3>
                </div>
              </template>
              <div dense expand-separator class="tw-bg-white q-pa-md" style="border-radius: 5px">

                <div class="col full-width tw-justify-start justify-around q-mb-md">
                  <div class="row full-width">
                    <div class="col-6 q-pr-md">
                      <label class="q-px-md tw-text-label">Dependencia del proceso
                      </label>
                      <p class="q-px-md">{{ dep.value }}</p>
                    </div>

                    <div class="col-6">
                      <label class="q-px-md tw-text-label">Responsable del proceso *
                      </label>
                      <p class="q-px-md">{{ responsable.value }}</p>
                    </div>

                    <div class="q-mt-md q-mx-sm tw-flex tw-flex-col col-12">
                      <label class="titles block">¿Desea asignar al responsable?
                        <div class="flex items-center tw-gap-16 q-mt-xs">
                          <q-radio v-model="asignaResponsable" val="si" label="Sí" />
                          <q-radio v-model="asignaResponsable" val="no" label="No" />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-card>
          <q-card v-if="asignaResponsable == 'no'" class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                    Asignación
                  </h3>
                </div>
              </template>
              <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">

                <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
                  <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #e3e4e5">
                    <TableAsignar :TABLE_BODY="listUsers" :TABLE_HEADER="columnsAsignar"
                      title="Seleccionar el usuario que desea asignar al radicado" @update:item-selected="handleAssign"
                      row-key="colaborador" :is-selection="false" type-selection="single" />
                  </div>
                  <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
                    style="border: 1px solid #e3e4e5">
                    <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                      Estos son los usuarios que ha seleccionado
                    </span>
                    <div class="flex wrap tw-gap-3 q-pt-sm">
                      <div v-for="(asign, index) in cardsAsignar" :key="index">
                        <div v-if="asign.visible"
                          class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                          style="border: 1px solid #e3e4e5">
                          <q-icon size="24px" name="person_outline" />
                          {{ asign.name }}
                          <q-icon class="tw-cursor-pointer" size="24px" name="close"
                            @click="removeCardAsignar(index)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-card>

          <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                    Motivo de Asignación
                  </h3>
                </div>
              </template>
              <div class="tw-bg-white q-mt-lg tw-p-4" style="border-radius: 5px">

                <div class="row full-width wrap tw-justify-start justify-around">

                  <div class="row full-width">

                    <div class="col-12">
                      <label class="q-px-md tw-text-label">Observaciones *
                        {{ asignarUsuarioBody.motivoAsignacion.length }}/1000
                        <q-input type="textarea" outlined label="Inserte" dense emit-value
                          v-model="asignarUsuarioBody.motivoAsignacion"
                          :rules="[inputRequired, v => maxLengthInput(1000, v), v => minLengthInput(10, v)]" />
                      </label>
                    </div>
                  </div>
                  <div class="tw-flex tw-justify-center tw-p-10 tw-w-full tw-gap-5">
                    <q-btn label="Cancelar" type="reset" style="width: 240px;height: 40px;" text-color="black"
                      color="accent" class="tw-rounded-xl" @click="() => showModal = true" />
                    <q-btn label="Asignar" text-color="white" @click="showModalAsigna"
                      style="width: 240px;height: 40px;" color="primary" class="tw-rounded-xl tw-btn tw-p-2" />
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-card>
        </q-form>
        <Modal v-model:model-value="showModal" title="¡Espera un momento!"
          text="¿Estás seguro de cancelar la asignación de la factura administrativa?" :is-success="false"
          textButtonCancel="No" cancel-button @handleAccept="showModal = false; router.push('/facturacion/radicados')"
          text-button="Si" @close-modal="() => (showModal = false)" />

        <Modal v-model:model-value="showConfirmationModal" title="Confirmación"
          :text="`¿Estás seguro de asignar el radicado ${initialData.sec} al gestionador ${asignarUsuarioBody.usuarioAsignado}?`"
          :is-success="false" textButtonCancel="No" cancel-button @handleAccept="handleAcceptModal" text-button="Si"
          @close-modal="() => (showConfirmationModal = false)" />
      </q-tab-panel>
      <!-- Metadatos -->
      <q-tab-panel name="metadatos" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4 tw-py-6 tw-px-5" flat bordered>
          <div class="row">
            <b class="tw-text-2xl">Ingresar metadatos</b>
          </div>

          <div class="row q-col-gutter-md q-pb-md q-mt-sm">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <span class="text-weight-bold">Remitente *</span>
              <q-select :rules="[inputRequired, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]" name="remitente" outlined v-model="metadatos.remitente" label="Seleccione" dense
                map-options emit-value :options="[
                  { value: 'Radicado', label: 'Radicado' }
                ]" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <span class="text-weight-bold">Tipo de requerimiento *</span>
              <q-select :rules="[]" name="tipoRequerimiento" outlined v-model="metadatos.tipoRequerimiento"
                label="Seleccione" dense map-options emit-value :options="[
                  { value: 'Radicado', label: 'Radicado' }
                ]" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <span class="text-weight-bold">Tipo de documento del afectado *</span>
              <q-select :rules="[]" name="tipoDocumentoAfectado" outlined v-model="metadatos.tipoDocumentoAfectado"
                label="Seleccione" dense map-options emit-value :options="[
                  { value: 'Radicado', label: 'Radicado' }
                ]" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <span class="text-weight-bold">Documento del afectado</span>
              <q-input :rules="[inputRequired, v => maxLengthInput(15, v), Number(metadatos.tipoDocumentoAfectado) == 11 ? alphanumeric : (v: string) => onlyNumbers(v)]" name="documentoAfectado" outlined v-model="metadatos.documentoAfectado"
                label="Inserte" dense />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <span class="text-weight-bold">Nombre del afectado</span>
              <q-input :rules="[inputRequired, v => maxLengthInput(200, v), alphabeticalWithSpecialCharacters]" name="nombreAfectado" outlined v-model="metadatos.nombreAfectado" label="Inserte"
                dense />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <span class="text-weight-bold">¿Pertenece a la comunidad LGBTQ? *</span>
              <q-select :rules="[]" name="lgbtq" outlined v-model="metadatos.lgbtq" label="Seleccione" dense map-options
                emit-value :options="[
                  { value: 'Si', label: 'Si' },
                  { value: 'No', label: 'No' }
                ]" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <span class="text-weight-bold">Sexo *</span>
              <q-select :rules="[]" name="sexo" outlined v-model="metadatos.sexo" label="Seleccione" dense map-options
                emit-value :options="[
                  { value: 'Femenino', label: 'Femenino' },
                  { value: 'Masculino', label: 'Masculino' }
                ]" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <span class="text-weight-bold">Condición especial *</span>
              <q-select :rules="[]" name="condicionEspecial" outlined v-model="metadatos.condicionEspecial"
                label="Seleccione" dense map-options emit-value :options="[
                  { value: 'No', label: 'No' }
                ]" />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <span class="text-weight-bold">Teléfono celular</span>
              <q-input :rules="[]" name="telefonoCelular" outlined v-model="metadatos.telefonoCelular" label="Inserte"
                dense />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
              <span class="text-weight-bold">Correo electrónico</span>
              <q-input :rules="[]" name="correoElectronico" outlined v-model="metadatos.correoElectronico"
                label="Inserte" dense />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <span class="text-weight-bold">Tipo de solicitud *</span>
              <q-select :rules="[]" name="tipoSolicitud" outlined v-model="metadatos.tipoSolicitud" label="Seleccione"
                dense map-options emit-value :options="[
                  { value: 'Radicado', label: 'Radicado' }
                ]" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <span class="text-weight-bold">Detalle de la solicitud *</span>
              <q-input :rules="[]" name="detalleSolicitud" outlined v-model="metadatos.detalleSolicitud" label="Inserte"
                dense type="textarea" />
            </div>

            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <span class="text-weight-bold">Producto *</span>
              <q-select :rules="[]" name="producto" outlined v-model="metadatos.producto" label="Seleccione" dense
                map-options emit-value :options="[
                  { value: 'Radicado', label: 'Radicado' }
                ]" />
            </div>
          </div>
        </q-card>
        <div class="col row justify-center q-gutter-x-md q-mt-md">
          <q-btn color="accent" textColor="secondary" label="Cancelar"
            style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" type="reset" no-caps />

          <q-btn color="primary" label="Guardar"
            style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps />
        </div>
      </q-tab-panel>
      <!-- Aprobar -->
      <q-tab-panel name="aprobar" class="q-pa-none">
        <p>Aprobar</p>
      </q-tab-panel>
      <!-- Rechazar -->
      <q-tab-panel name="rechazo" class="q-pa-none">
        <q-form greedy ref="rechazar">
          <q-card class="tw-rounded-xl tw-mt-4 tw-p-4" flat bordered>

            <q-expansion-item default-opened>
              <template v-slot:header>
                <div class="col row">
                  <b class="tw-text-lg">Rechazar</b>
                </div>
              </template>

              <div class="row q-col-gutter-md q-pb-md q-mt-sm">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <span class="text-weight-bold">Motivo de Rechazo *</span>
                  <q-input type="textarea"
                    :rules="[inputRequired, l => maxLengthInput(1000, l), l => minLengthInput(10, l)]" name="producto"
                    outlined v-model="form.motivoRechazo" v-if="auth.$state.userInfo.role === 'Aprobador'"
                    label="Seleccione" dense />
                  <q-select :rules="[inputRequired]" name="producto" outlined v-model="form.motivoRechazo"
                    label="Seleccione" dense map-options emit-value :options="[
                      { value: 'Motivo1', label: 'Los valores de los servicios cobrados, no coinciden con los del valor de la factura.' },
                      { value: 'Motivo2', label: 'El número de la factura ya se encuentra radicada en la base de datos de POSITIVA.' },
                      { value: 'Motivo3', label: 'La fecha de la factura debe ser del mismo mes que se va a gestionar no se reciben facturas de meses anteriores.' },
                      { value: 'otro', label: 'Otro' }
                    ]" v-else />
                  <div v-if="form.motivoRechazo == 'otro'" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

                    <span class="text-weight-bold">Comentario *</span>
                    <q-input :rules="[inputRequired, l => maxLengthInput(1000, l), l => minLengthInput(10, l)]"
                      name="comentario" outlined v-model="form.comentario" label="Inserte" dense type="textarea" />
                  </div>
                </div>
              </div>
            </q-expansion-item>
          </q-card>

          <div class="col row justify-center q-gutter-x-md q-my-md">
            <q-btn color="accent" textColor="secondary" label="Cancelar" @click="modalRechazoCancelar = true"
              style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" type="reset" no-caps />

            <q-btn color="primary" label="Rechazar" @click="validaRechazar"
              style="width: 330px; height: 60px; border-radius: 8px; font-size: 18px;" no-caps />
          </div>
        </q-form>
        <Modal v-model="enviarRechazo" title="¡Espera un momento!" text-button-cancel="No" :is-success="false"
          text-button="Si" @handleAccept="handleOnReject" cancel-button text="¿Está seguro de enviar a rechazo?"
          @close-modal="enviarRechazo = false" />

      </q-tab-panel>
      <q-tab-panel name="enviarAprobacion">
        <EnviarAprobacion :details-fac="initialData" @handle-cancel="() => cancelEnviar = true" />
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="modalPreguntaCancelar" persistent>
      <q-card class="tw-p-5">
        <q-card-section class="row tw-p-4">
          <span class="tw-text-slate-500 text-center tw-text-2xl">
            ¿Está seguro?
          </span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn label="No" color="secondary" @click="modalPreguntaCancelar = false" />
          <q-btn label="Si" color="primary" @click="resetForm()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <q-dialog v-model="modalRechazoCancelar" persistent>
    <q-card class="tw-p-5">
      <q-card-section class="row tw-p-4">
        <span class="tw-text-slate-500 text-center tw-text-2xl">
          ¿Está seguro de cancelar el proceso?
        </span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="No" color="secondary" @click="modalRechazoCancelar = false" />
        <q-btn label="Si" color="primary" @click=" modalRechazoCancelar = false; tab = 'infoGeneral';" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <Modal v-model="enviarAprobacion" title="¡Espera un momento!" text-button-cancel="No" :is-success="false"
    text-button="Si" @handleAccept="handleAprobar" cancel-button text="¿Está seguro de enviar a aprobación?"
    @close-modal="enviarAprobacion = false" />
  <q-dialog v-model="modalDocuments" persistent>
    <q-card class="tw-p-5">
      <q-card-section class="row tw-p-4">
        <span class="tw-text-slate-500 text-center tw-text-2xl">
          Cargue un nuevo documento para la factura
        </span>
      </q-card-section>
      <q-card-section class="row tw-p-4">
        <FileLoader class="tw-w-full" v-model="newFileInput"
          accept-file="pdf, png, jpg, jpeg, webp, bmp, txt, doc, docx, xls, xlsx, mp3, mp4, avi, csv, zip, rar, ppt, pptx, eml, msg"
          max-file-size-label="50" :maxFileSize="50000000" @rejected="rejected" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn label="Cancelar" color="secondary" @click="modalDocuments = false" />
        <q-btn label="Subir" color="primary" @click="handleUploadFile" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Aceptar"
    @handleAccept="clear" cancel-button text="¿Está seguro de que no quieres modificar los datos?"
    @close-modal="cancelModal = false" type="button" />
  <Modal v-model="cancelAction" title="¡Espera un momento!" :is-success="false" text-button="Aceptar" cancel-button
    text-button-cancel="Cancelar" text="¿Deseas realizar la acción?" @close-modal="cancelAction = false"
    @handle-accept="() => tab = 'infoGeneral'" />
  <Modal v-model="cancelEnviar" title="¡Espera un momento!" :is-success="false" text-button="Sí" cancel-button
    text-button-cancel="No" text="¿Deseas realizar la acción?" @close-modal="cancelEnviar = false"
    @handle-accept="() => tab = 'infoGeneral'" />
</template>

<script setup lang="ts">
import { Ref, computed, onBeforeMount, ref, watch, onMounted } from "vue";
import Modal from 'components/Modal/Modal.vue';
import TableAsignar from "components/Tables/TableAsignar.vue";
import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { currentHour, secondFormatDate } from "src/helpers/formtDate";
import { numberToHumanText } from "src/helpers/number";
import { toast } from "src/helpers/toast";
import {
  inputRequired,
  maxLengthInput,
  minLengthInput,
  onlyNumbers,
  alphanumeric,
  mobilePhonNumber,
  validationEmail,
  alphanumericWithSpaceAndHashtag,
  homePhoneNumber,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import { BonitaAPI, SelectInput } from "src/interfaces";
import IncluirExpediente from "src/pages/PQRD/IncluirExpediente/incluirExpediente.vue";
import { adminAxios, sgdeaAxios } from "src/services";
import { columnsAsignar } from "./Aprobacion";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import unknown from 'src/assets/unknown_document.svg';
// @ts-ignore
import docxIcon from 'src/assets/word.svg';
import moment from 'moment';
import { medioOptions, tipoDocumento } from "src/constantes/options";
import { checkStatus } from "src/helpers/checkStatus";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import Trazabilidad from "src/pages/EntesDeControl/Bandeja/Detalles/Trazabilidad/TrazabilidadTable.vue";
import { useAuthStore } from "src/stores/auth.store";
import { useRoute, useRouter } from "vue-router";
import { IAsignarFacturaUsuario, asignarUsuario } from "./Asignar/asignar";
import { ConsultarDocumentoResponse } from "../..";
import EnviarAprobacion from "./EnviarAprobacion.vue";
import TableDocs from "pages/Facturacion/administrativa/TableDocs.vue";
import DatePickerComponent from "components/FormFields/datePickerComponent.vue";
import Comentarios from './comentarios/comentarios.vue'
import incluirExpediente from "../IncluirExpediente/incluirExpediente.vue";

const initialData: Ref<any> = ref({})
const showConfirmationModal = ref<boolean>(false);
const showModal = ref<boolean>(false)
const modalRechazoCancelar = ref<boolean>(false);
const newFileInput = ref<any>([]);
const isEdit = ref(false);
const edited = ref(false);
const cancelModal = ref(false);
const cancelAction = ref(false);
const cancelEnviar = ref(false);
const route = useRoute()
const router = useRouter();
const auth = useAuthStore()
const handleSubmitIsLoading = ref(false)
const forms = ref()
const tipificacionSelect = ref("")
const valorAjuste = ref(0)
let initialFormInfo
const dataNDNC = ref({
  idFactura: "",
  numeroRadicadoAnterior: "",
  numeroFactura: "",
  tipificacion: "",
  numeroNota: "",
  valorAjuste: "",
  dependecia: "",
  proveedor: "",
  descripcion: ""
});
const isNit = ref(false);


interface UITab {
  key: string;
  icon: string;
  name: string;
}

const isChange = () => {
  if (JSON.stringify(initialFormInfo) === JSON.stringify(formInfo.value)) {
    return true
  }
  return false
}

const sendFunction = async () => {
  if (isChange()) {
    clear()
    return
  }
  if (await forms.value.validate()) {
    handleSubmitIsLoading.value = true
    isEdit.value = false
    try {
      delete formInfo.value.fechaFormateada;
      delete formInfo.value.fechaFac;
      formInfo.value.fechafac = initialData.value.fechaFac;
      const response = await sgdeaAxios.put("/facturacion/actualizarFacAdmin", { ...formInfo.value, dependencia: formInfo.value.dependencia.label ?? formInfo.value.dependencia, municipio: formInfo.value.municipio.label ? formInfo.value.municipio.label : formInfo.value.municipio, departamento: formInfo.value.departamento.label ? formInfo.value.departamento.label : formInfo.value.departamento })
      setTimeout(() => handleSubmitIsLoading.value = false, 1000)
      toast.success("Radicado editado correctamente");
      initialData.value = response.data.facAdmin;

      formInfo.value = initialData.value
      await crearTrazabilidad({
        proceso: "FAC" + initialData.value.idFactura,
        secuencia: initialData.value.sec,
        estado: checkStatus(initialData.value.estado),
        descripcion: "Se ha editado la información de la factura",
        comentario: 'Adjunto',
        nombre: auth.$state.userInfo.name
      })
    } catch (error) {
      console.error(error)
    }

  } else {
    return toast.error("Debes llenar todos los campos requeridos")
  }
}

const asignarUsuarioBody: Ref<IAsignarFacturaUsuario> = ref({
  type: 'FACTURA',
  short_type: 'FAC',
  id: parseInt(route.params.id as string),
  usuarioAsignado: '',
  motivoAsignacion: ''
})

async function handleUploadFile() {
  const files: File[] | File = newFileInput.value;

  if (Array.isArray(files) && files.length === 0 || files === null) {
    toast.error("Debe seleccionar un archivo");
    return;
  }

  const formData = new FormData();
  for (const file of Array.isArray(files) ? files : [files]) {
    formData.append("anexos", file);
  }

  formData.append("idRadicado", initialData.value.nodeId);
  formData.append("descripcionRadicado", "FACTURA");

  try {
    const { data } = await sgdeaAxios.post("/api/v1/integracion/alfresco/agregarAnexos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (data) {
      toast.success("Archivo cargado correctamente");
      await crearTrazabilidad({
        proceso: "FAC" + initialData.value.idFactura,
        secuencia: initialData.value.sec,
        estado: checkStatus(initialData.value.estado.toLowerCase()),
        descripcion: "Se ha adjuntado un documento a la factura administrativa",
        comentario: 'Adjunto',
        nombre: auth.$state.userInfo.name
      })
      modalDocuments.value = false;
      getData()
    }
  } catch (error) {
    toast.error("Error al cargar el archivo");
  }
}

const optionsDependencias = ref<SelectInput[]>([
  { label: 'GERENCIA JURÍDICA', value: 'GERENCIA JURÍDICA' },
  { label: 'OFICINA DE CONTROL DISCIPLINARIO', value: 'OFICINA DE CONTROL DISCIPLINARIO' },
  { label: 'OFICINA DE CONTROL INTERNO', value: 'OFICINA DE CONTROL INTERNO' },
  { label: 'OFICINA DE ESTRATEGIA Y DESARROLLO', value: 'OFICINA DE ESTRATEGIA Y DESARROLLO' },
  { label: 'OFICINA DE GESTIÓN INTEGRAL DE RIESGOS', value: 'OFICINA DE GESTIÓN INTEGRAL DE RIESGOS' },
  { label: 'OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN', value: 'OFICINA DE TECNOLOGÍAS DE LA INFORMACIÓN' },
  { label: 'PRESIDENCIA', value: 'PRESIDENCIA' },
  { label: 'SECRETARÍA GENERAL Y JURÍDICA', value: 'SECRETARÍA GENERAL Y JURÍDICA' },
]);

const options = ref([]);

const tipoTramite = ref<SelectInput[]>([
  {
    label: 'Facturas Administrativas',
    value: 'Facturas Administrativas'
  },
  {
    label: 'Cuenta de cobro o documento equivalente soporte',
    value: 'Cuenta de cobro o documento equivalente soporte',
  },
  {
    label: 'Factura Emisión Manual',
    value: 'Factura Emisión Manual'
  },
  {
    label: 'Nota Crédito / Nota Débito',
    value: 'Nota Crédito / Nota Débito'
  },
  {
    label: 'Crear Adquirente',
    value: 'Crear Adquirente'
  },
])

const tipoRemitente = ref<SelectInput[]>([
  {
    label: 'Proveedor',
    value: 'proveedor'
  }
]);

const optionsCanales: Ref<SelectInput[]> = ref([{ label: "CRM", value: "CRM" }]);

const blurSearchUser = async (val) => {
  try {
    const response = await sgdeaAxios.get<ConsultarDocumentoResponse>(
      `/facturacion/getVende/${initialData.value.numeroDocumento}`
    );
    initialData.value.primerApellido = response.data["papellido"] ?? ' '
    initialData.value.segundoApellido = response.data["sapellido"] ?? ' '
    initialData.value.primerNombre = response.data["pnombre"] ?? ' '
    initialData.value.otrosNombres = response.data["onombre"] ?? ' '


    return response
  } catch (e) {
    console.error(e)
    toast.error('Documento de identificación no existe, por favor solicitar la creación del usuario que no se encuentra registrado')
    initialData.value.primerApellido = ''
    initialData.value.segundoApellido = ''
    initialData.value.primerNombre = ''
    initialData.value.otrosNombres = ''

  }
}

const clear = async () => {
  formInfo.value = { ...initialData.value }
  isEdit.value = false
}

const tipoIcon = (tipo) => {
  if (tipo === 'application/pdf') return PDFIcon
  if (tipo === 'application/vnd.ms-excel' || tipo === 'text/xml' || tipo === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || tipo.includes('xls')) return excelIcon
  if (tipo === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || tipo === 'application/msword' || tipo.includes('docx')) return docxIcon
  return unknown
}

const uiTabs: UITab[] = [
  {
    key: 'infoGeneral',
    icon: 'info',
    name: 'Información básica radicación'
  },
  {
    key: 'infoGeneral',
    icon: 'info',
    name: 'Información general',
  },
  {
    key: 'gestion',
    icon: 'manage_accounts',
    name: 'Gestionar factura administrativa'
  },
  {
    key: 'trazabilidad',
    icon: 'timer',
    name: 'Trazabilidad'
  },
  {
    key: 'docsRelacionados',
    icon: 'folder',
    name: 'Documentos relacionados'
  },
  {
    key: 'asignar',
    icon: 'timer',
    name: 'Asignar'
  },
  {
    key: 'incluirExpediente',
    icon: 'folder',
    name: 'Incluir expediente'
  },
  {
    key: 'comentarios',
    icon: 'comments',
    name: 'Comentarios'
  },
  {
    key: 'metadatos',
    icon: 'info',
    name: 'Metadatos'
  },
  {
    key: 'aprobar',
    icon: 'task_alt',
    name: 'Aprobar'
  },
  {
    key: 'rechazo',
    icon: 'cancel',
    name: 'Rechazar'
  },
]


const handleAcceptModal = () => {
  showConfirmationModal.value = false;
  asignarUsuario(asignarUsuarioBody.value, () => {
    router.push('/facturacion/radicados');
  });
}

const tab = ref('infoGeneral')
const realizarAjuste = ref('n')
const asignarRef = ref()
const asignaResponsable = ref('si')
const gestionRef = ref()
const listUsers = ref([]);

const isntColombia = ref(false)
const optionsDepartamentos: Ref<SelectInput[]> = ref([]);
const optionsPaises = ref<SelectInput[]>([])
const optionsMunicipios: Ref<SelectInput[]> = ref([]);
const municipios: Ref<SelectInput[]> = ref([]);
const modalPreguntaCancelar = ref(false)
const modalDocuments = ref(false);
const formInfo: Ref<any> = ref({
  dependencia: "",
  responsable: "",
  tipoTramite: { label: 'Facturas Administrativas', value: 'Facturas Administrativas' },
  canal: "CRM",
  tipoDocumento: "",
  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  segundoNombre: "",
  otrosNombres: "",
  direccion: "",

  valor: 0,
  valorLetra: "",

  fechaRadicar: secondFormatDate(new Date()),
  fechaFormateada: "",
  horaInicio: currentHour(new Date()),
  estado: "radicado",

  cuentaCobro: null as any,
  pagoSeguridadSocial: null as any,
  entregaSoportes: null as any,
  numeroDocumento: "",

  otrosTiposDocumentales: null as any,
  celular: "",
  email: "",
  departamento: null,
  descripcion: "",
  medio: "",
  municipio: null,
  numeroFactura: "",
  numeroRadicado: "",
  pais: {
    label: "Colombia",
    value: "Colombia",
  },
  telefono: "",
  tipoRemitente: "",
  sec: "FACA",
  fechafac: "",
  razonSocial: "",
  nombreComercial: "",
});

const dep = ref({
  label: '',
  value: ''
});

const nameDocument = ref('');
const iframePdfUrl = ref('');
const visualizadorPDF = ref(false);

const getBlobToIframe = async (id: string) => {
  const { data } = await sgdeaAxios.get(
    `/radicados/consultar_documento/${id}`
  );

  if (id) {
    nameDocument.value = loadedDocs.value.find((it) => it.id === id)?.nombre
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
}

const loadedDocs = ref<any[]>([]);
const selectedDocs = ref<any[]>([]);
const responsable = ref();
const responsableOptions = ref([]);

const deleteDocs = async () => {
  try {
    for (const selectedDoc of selectedDocs.value) {
      const response = await sgdeaAxios.delete('/alfresco/deleteFile/' + selectedDoc.nodeId);
      if (response.status === 200) {
        toast.success('Documento eliminado con éxito');
        getData();
      }
    }
    selectedDocs.value = [];
  } catch (error) {
    console.error(error);
    toast.error('Ocurrió un error al eliminar el documento');
  }
}

const rejected = (file: any[]) => {
  if (file[0].failedPropValidation === "accept") {
    toast.error("El archivo no cumple con alguno de los formatos permitidos");
  } else if (file[0].failedPropValidation === "max-file-size") {
    toast.error("El archivo excede el tamaño permitido (50MB)");
  }
}

const trazabilidadData = ref<any[]>([])

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
}

const facAdminNotFound = (id?: number | string) => {
  let message = 'Factura administrativa no existe';

  if (Boolean(id)) {
    message = 'Factura administrativa con id ' + id + ' no existe.'
  }
  toast.error(message);
  router.replace('/facturacion/radicados');
}
const comentarioData = ref<any[]>([])

const getTrazabilidad = async () => {
  const response = await sgdeaAxios.get('/trazabilidad/obtenerPorCodProceso/' + 'FAC' + initialData.value.idFactura);

  trazabilidadData.value = response.data.sort((a, b) => a.id - b.id).map((item, index) => ({
  canal: item.canal ?? "_",
  accion: item.descripcion,
  fechaHora: moment(item.fechaHora).add(1, 'day').format('DD/MM/YYYY'),
  estado: item.estado ?? "Sin estado",
  usuario: item.nombre,
  cargoUsuario: item.cargoUsuario,
  descripcion: `${item.detalle} - Secuencia: ${item.secuencia}`,
  tramite: item.tramite ?? "Factura Administrativa",
  secuencia: item.secuencia,
}));

  comentarioData.value = response.data.filter(x => x.descripcion == 'Se adjunto un nuevo comentario').map((item, index) => ({
    name: item.nombre,
    tipoUser: '',
    label1: 'Ha comentado sobre la factura administrativa',
    label2: '',
    label3: item.comentario,
    fecha: moment(item.fechaHora).add(1, 'day').format('DD/MM/YYYY'),
    hora: ''
  }));
}

onMounted(async () => {
  await getData();
  await getTrazabilidad();
  await getDependencies();
  await getBlobToIframe(initialData.value.nodeId);
});

const uiTabsKey = ref(0)
const updateUiTabs = (key: string, add: boolean) => {
  const index = uiTabs.findIndex(tab => tab.key === key);
  if (add && index === -1) {
    uiTabs.push({
      key,
      icon: '',
      name: ''
    });
  } else if (!add && index !== -1) {
    uiTabs.splice(index, 1);
  }
  uiTabsKey.value++
};

async function getDependencies(){
  try {
    const { data } = await sgdeaAxios.get('/seccionSubSeccion')
    options.value = data?.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((dependencia: any) => ({
      label: dependencia.nombre,
      value: dependencia.idSeccionSubSeccion
    }))

  } catch (error) {
    console.error(error)
  }

}

const reloadData = async () => {
  const idParams = router.currentRoute.value.params?.id as string;
  try {
    const id = parseInt(idParams);
    const response = await sgdeaAxios.get('/facturacion/getFac/' + id);

    const responseND_NC = await sgdeaAxios.get(`/facturacion/obtenerNotaDebitoCredito?id=${id}`);

    if (responseND_NC.status == 200 || responseND_NC.status == 201) {
      dataNDNC.value = responseND_NC.data[0]
    }

    if (response.status !== 200 || !response.data.mensaje) facAdminNotFound(id)

    initialData.value = { ...response.data.facAdmin, fechaFac: moment(response.data.facAdmin.fechaFac).format("DD/MM/YYYY") }
    formInfo.value = { ...response.data.facAdmin, fechaFac: moment(response.data.facAdmin.fechaFac).format("DD/MM/YYYY") };

    responsableOptions.value = [{
      label: response.data.facAdmin.responsable,
      value: response.data.facAdmin.responsable
    }]

    responsable.value = {
      label: response.data.facAdmin.responsable,
      value: response.data.facAdmin.responsable
    }

    asignarUsuarioBody.value.usuarioAsignado = response.data.facAdmin.responsable;

    if (checkStatus(initialData.value.estado?.toLowerCase()) == 'para asignar') {
      updateUiTabs('aprobar', false)
    } else if (checkStatus(initialData.value.estado?.toLowerCase()) == 'para gestión') {
      updateUiTabs('gestion', false)

    }
    initialFormInfo = JSON.parse(JSON.stringify(initialData.value))

    if (!initialData.value?.gestionada) {
      filteredTabs.value = filteredTabs.value.filter(tab => tab.key !== 'enviarAprobacion')
    } else {
      filteredTabs.value = [...filteredTabs.value, {
        key: 'enviarAprobacion',
        icon: 'task_alt',
        name: 'Enviar a aprobación'
      }]
    }
  } catch (error) {
    facAdminNotFound(idParams)
  }
}


const getData = async () => {
  const idParams = router.currentRoute.value.params?.id as string;
  if (!idParams) facAdminNotFound(idParams);
  await reloadData()

  try {
    const response = await sgdeaAxios.get('/radicados/obtenerHijosPorNodo/' + initialData.value.nodeId);

    if (response.status !== 200 && response.status !== 201) {
      return;
    }

    const docs = response.data.list.entries.map((docs) => {
      return {
        ...docs?.entry,
        nodeId: docs?.entry.id,
        nombreDocumento: docs?.entry.name,
        tipoDocumento: docs?.entry.name.startsWith("ENT") ? "De salida" : "De entrada",
        fechaCargue: moment(docs?.entry?.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY'),
        cargadoPor: docs?.entry.createdByUser.displayName,
        formato: docs?.entry?.content?.mimeType,
      }
    });

    loadedDocs.value = docs;

  } catch (error) {
    console.error(error);
  }

  const {
    data: dptos,
  }: {
    data: BonitaAPI[];
  } = await adminAxios.get("/departamentos/list");

  const {
    data: mnpios,
  }: {
    data: BonitaAPI[];
  } = await adminAxios.get("/municipios/list");

  const { data: formData } = await adminAxios.get<{
    idMunicipio: number,
    nombre: string,
    codigoDivipola: string
  }[]>("/municipios/list");

  const { data: paisesData } = await adminAxios.get<{ idPais: number; nombre: string }[]>("/paises/list");

  optionsDepartamentos.value = sortOptions(dptos.map((item) => ({
    label: item.nombre,
    value: item.idDepartamento,
  })));

  municipios.value = mnpios.map((item) => ({
    label: item.nombre,
    value: item.idDepartamento,
  }));

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
      value: nombre
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
      value: nombre
    }
  });

  isNit.value = initialData.value.tipoDocumento === 'Número de Identificación Tributaria NIT';
};

watch(
  () => formInfo.value.valor,
  (newNumber) => {
    if (String(newNumber).startsWith('0') && String(newNumber) !== '0') {
      let format = parseFloat(String(newNumber).substring(1));

      if (isNaN(format)) {
        format = 0;
      }

      formInfo.value.valor = format;
    }

    formInfo.value.valorLetra = numberToHumanText(newNumber);
  }
);
const asignado = ref(false)

const cardsAsignar = ref([]);

const removeCardAsignar = (index) => {
  cardsAsignar.value.splice(index, 1);
};

watch(
  () => asignaResponsable.value,
  (newValue) => {
    if (newValue === 'si') {
      asignarUsuarioBody.value.usuarioAsignado = responsable.value.value;
      cardsAsignar.value = [];
      asignarUsuarioBody.value.motivoAsignacion = '';
    } else if (newValue === 'no') {
      asignarUsuarioBody.value.usuarioAsignado = '';
      cardsAsignar.value = [];
      asignarUsuarioBody.value.motivoAsignacion = '';
    }
  }
);

const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) =>
  ({
    name: item.colaborador,
    visible: true,
    user: item.user
  }),

    array.map(item => {
      asignarUsuarioBody.value.usuarioAsignado = item.colaborador;
    }),

  );
};

const filteredTabs = ref([])

onBeforeMount(async () => {

  await getData()
  await getDependencies()
  await getAllRegisters()
  if (initialData.value.estado.toLowerCase() == ('por aprobar') || initialData.value.estado.toLowerCase() == ('gestionado')) {
    filteredTabs.value = [
      {
        key: 'infoGeneral',
        icon: 'info',
        name: 'Información general',
      },
      {
        key: 'trazabilidad',
        icon: 'timer',
        name: 'Trazabilidad'
      },
      {
        key: 'comentarios',
        icon: 'comments',
        name: 'Comentarios'
      },
      {
        key: 'aprobar',
        icon: 'task_alt',
        name: 'Aprobar'
      },
      {
        key: 'rechazo',
        icon: 'cancel',
        name: 'Rechazar'
      },
    ]
  }
  else if (initialData.value.estado.toLowerCase() == ('para gestión') || initialData.value.estado.toLowerCase() == ('asignado')) {
    filteredTabs.value = [
      {
        key: 'infoGeneral',
        icon: 'info',
        name: 'Información general',
      },
      {
        key: 'trazabilidad',
        icon: 'timer',
        name: 'Trazabilidad'
      },
      {
        key: 'comentarios',
        icon: 'comments',
        name: 'Comentarios'
      },
      {
        key: 'incluirExpediente',
        icon: 'comments',
        name: 'Incluir Expediente'
      },
      {
        key: 'docsRelacionados',
        icon: 'folder',
        name: 'Documentos relacionados'
      },
      {
        key: 'gestion',
        icon: 'manage_accounts',
        name: 'Gestionar'
      },

      {
        key: 'rechazo',
        icon: 'cancel',
        name: 'Rechazar'
      },
      {
        key: 'enviarAprobacion',
        icon: 'task_alt',
        name: 'Enviar a Aprobacion'
      },
    ]

    if (!initialData.value?.gestionada) {
      filteredTabs.value = filteredTabs.value.filter(tab => tab.key !== 'enviarAprobacion')
    }
  } else if (checkStatus(initialData.value.estado) == 'Por asignar' || checkStatus(initialData.value.estado) == 'En asignación') {
    dep.value = {
      label: initialData.value.dependencia,
      value: initialData.value.dependencia,
    }
    responsable.value = {
      label: initialData.value.responsable,
      value: initialData.value.responsable
    }
    filteredTabs.value = [{
      key: 'infoGeneral',
      icon: 'info',
      name: 'Información general',
    },
    {
      key: 'trazabilidad',
      icon: 'timer',
      name: 'Trazabilidad'
    },
    {
      key: 'comentarios',
      icon: 'comments',
      name: 'Comentarios'
    },
    {
      key: 'docsRelacionados',
      icon: 'folder',
      name: 'Documentos relacionados'
    },
    {
      key: 'asignar',
      icon: 'timer',
      name: 'Asignar'
    },
    ]
  }
});

interface Form {
  motivoRechazo: string;
  comentario: string;
}

const form = ref<Form>({
  motivoRechazo: '',
  comentario: ''
});

const metadatos: Ref<any> = ref({})

const rechazar = ref()
const enviarAprobacion = ref(false)
const enviarRechazo = ref(false)

const validaRechazar = async () => {
  if (await rechazar.value.validate()) {
    enviarRechazo.value = true
  } else {
    toast.error('Para continuar, asegúrese de que todos los campos requeridos estén completos');
  }
}

const handleOnReject = async () => {
  try {
    const idParams = router.currentRoute.value.params?.id as string
    let response = { status: null }
    if (!idParams) return;

    const id = parseInt(idParams)
    if (initialData.value.estado.toLowerCase() == 'para gestión') {
      response = await sgdeaAxios.put(`/facturacion/updateFacAdminCto/${id}`, {
        "aprobadorUsuario": auth.$state.userInfo.name,
        "gestionObs": 'rechazado',
        "tipo": "FACTURA",
        "state": "RECHAZADA"
      });
    } else {
      response = await sgdeaAxios.put('/facturacion/actualizarEstadoFac/' + id, {
        aprobadoRechazado: "Rechazado",
        observacion: 'Rechazado'
      });
    }

    if (response.status === 200 || response.status === 201) {
      toast.success('La radicación ha sido rechazada con éxito.');

      await crearTrazabilidad({
        proceso: "FAC" + initialData.value.idFactura,
        secuencia: initialData.value.sec,
        estado: "Rechazado",
        descripcion: "Se ha rechazado la factura administrativa",
        comentario: form.value.comentario,
        nombre: auth.$state.userInfo.name
      })

    } else {
      toast.error('Ocurrió un problema al rechazar la radicación.');
    }
  } catch (error) {
    toast.error('Ocurrió un problema al rechazar.');
  }
  router.push('/facturacion/radicados')
}

const handleSwitchTab = async (_, currentTab: UITab) => {
  if (currentTab.key === 'aprobar') {
    enviarAprobacion.value = true
    tab.value = 'infoGeneral'
  } else if (currentTab.key === 'trazabilidad') {
    await getTrazabilidad()
  }
}

const handleAprobar = async () => {
  try {
    const idParams = router.currentRoute.value.params?.id as string

    if (!idParams) return;

    const id = parseInt(idParams)

    const response = await sgdeaAxios.put(`/facturacion/actualizarEstadoFac/${id}`, {
      aprobadoRechazado: "Aprobado",
      observacion: 'Aprobado'
    });

    if (response.status === 200) {
      toast.success('El radicado fue aprobado con éxito.');

      await crearTrazabilidad({
        proceso: "FAC" + initialData.value.idFactura,
        secuencia: initialData.value.sec,
        estado: "Aprobado",
        descripcion: "Se ha aprobado la factura administrativa",
        comentario: "Aprobado",
        nombre: auth.$state.userInfo.name
      })
    } else {
      toast.error('Ocurrió un problema al aprobar el radicado.');
    }
  } catch (error) {
    console.error(error);
    toast.error('Ocurrió un problema al aprobar el radicado.');
  }
  router.push('/facturacion/radicados')
}

const guardarAjuste = async () => {
  if (await gestionRef.value.validate()) {
    try {
      const id = <number>initialData.value.idFactura;
      if (realizarAjuste.value == 's') {
        const response = await sgdeaAxios.put(`/facturacion/updateFacAdminCto/${id}`, {
          "aprobadorUsuario": auth.$state.userInfo.name,
          "gestionObs": 'retenido',
          "gestionTipificacion": tipificacionSelect.value,
          "gestionValorAjuste": valorAjuste.value,
          "tipo": "FACTURA",
          "state": "RETENIDO"
        });

        await crearTrazabilidad({
          proceso: "FAC" + initialData.value.idFactura,
          secuencia: initialData.value.sec,
          estado: "Gestionado",
          descripcion: "Se ha retenido la factura administrativa",
          comentario: "Gestionado",
          nombre: auth.$state.userInfo.name
        })

        toast.success('La radicación ha sido gestionada con éxito.');
        router.push('/facturacion/radicados')
      } else {
        const response = await sgdeaAxios.put('/facturacion/facGestionada/' + id);
        tab.value = 'infoGeneral'
        await crearTrazabilidad({
          proceso: "FAC" + initialData.value.idFactura,
          secuencia: initialData.value.sec,
          estado: "Gestionado",
          descripcion: "Se ha gestionado la factura administrativa",
          comentario: "Gestionado",
          nombre: auth.$state.userInfo.name
        });
        await reloadData();
        await getTrazabilidad();
        toast.success('La radicación ha sido gestionada con éxito.');
      }

    } catch (error) {
      toast.error('Ocurrió un problema al gestionar la radicación.');
    }
  } else {
    toast.error('Diligencie los campos obligatorios.');
  }
}

async function getAllRegisters() {
  try {
    let role = "Aprobador"
    if (initialData.value.estado.toLowerCase() == 'por asignar' || initialData.value.estado.toLowerCase() == 'en asignación') {
      role = "Gestionador"
    }
    let urlGetInfo = ""
    if(auth.$state.userInfo.oficina !=  "" && auth.$state.userInfo.oficina != null)
      urlGetInfo = `/api/usuarios/rolYoficina?rolName=${role}&oficinaId=${auth.$state.userInfo.oficina}`
    else
      urlGetInfo = `/api/usuarios/rolesYSeccionSubseccion/${auth.$state.userInfo.dependencia}?rolNames=Gestionador`
    const { data } = await sgdeaAxios.get(urlGetInfo);
    listUsers.value = data.filter((responsable: any) => responsable.enabled).map((item) => ({
      colaborador: item.firstname + ' ' + item.lastname,
      cargo: item.cargo.nombre,
      id: item.id,
      user: item.userName,
      grupo: item.usuarioRelaciones?.length ? item.usuarioRelaciones[0]?.oficina?.nombre : ''
    })).sort((a, b) => {
      if (a.colaborador.toLowerCase() > b.colaborador.toLowerCase()) {
        return 1;
      }
      if (a.colaborador.toLowerCase() < b.colaborador.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  } catch (error) {
    console.error(error)
  }
}

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
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

watch(
  () => formInfo.value.pais,
  async (value) => {
    if (!isEdit.value) return
    let val = value as unknown as string
    formInfo.value.departamento = ''
    formInfo.value.municipio = ''
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(425);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);

    } else {
      formInfo.value.departamento = { label: val, value: value }
      formInfo.value.municipio = { label: val, value: value }
      isntColombia.value = true
    }

  }
);

watch(
  () => formInfo.value.departamento,
  async (value) => {
    if (!isEdit.value) return
    //@ts-ignore
    if (!isntColombia.value) {
      formInfo.value.municipio = ''
    }

    const { optionsMunicipalities } = await useMunicipalities(value.value);
    optionsMunicipios.value = sortOptions(optionsMunicipalities.value)
  }
);

watch(
  () => formInfo.value.dependencia,
  async (newVal) => {
    if (!newVal.value) return
    const response = await sgdeaAxios.get(`/api/usuarios/rolYSeccionSubseccion/${newVal.value}?rolName=Administrador de Trámite`)
    options.value = response.data
      .filter((responsable: any) => responsable.enabled)
      .map((responsable: any) => ({
        label: responsable.firstname + ' ' + responsable.lastname,
        value: responsable.firstname + ' ' + responsable.lastname
      }));
    formInfo.value.responsable = ''
  }
)

const showModalAsigna = async () => {
  if (await asignarRef.value.validate()) {
    if (asignaResponsable.value === 'si' && asignarUsuarioBody.value.usuarioAsignado) {
      showConfirmationModal.value = true;
    } else if (asignaResponsable.value === 'no' && cardsAsignar.value.length !== 0) {
      showConfirmationModal.value = true;
    } else {
      toast.error("Debe seleccionar un usuario para completar la asignación");
    }
  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos.")
  }
}

const resetForm = () => {
  formInfo.value = {
    dependencia: "",
    responsable: "",
    tipoTramite: { label: 'Facturas Administrativas', value: 'Facturas Administrativas' },
    canal: "CRM",
    tipoDocumento: "",
    primerApellido: "",
    segundoApellido: "",
    primerNombre: "",
    segundoNombre: "",
    otrosNombres: "",
    direccion: "",

    valor: 0,
    valorLetra: "",

    fechaRadicar: secondFormatDate(new Date()),
    horaInicio: currentHour(new Date()),
    estado: "radicado",

    cuentaCobro: null as any,
    pagoSeguridadSocial: null as any,
    entregaSoportes: null as any,
    otrosTiposDocumentales: null as any,

    numeroDocumento: "",
    celular: "",
    email: "",
    departamento: "",
    descripcion: "",
    medio: "",
    municipio: "",
    numeroFactura: "",
    numeroRadicado: "",
    pais: {
      label: "Colombia",
      value: "Colombia",
    },
    telefono: "",
    tipoRemitente: "",
    sec: "FACA",
  };
};
const radicadoDoc = computed(() => {
  return loadedDocs.value.filter(
    (it) =>
      it.name === `${initialData.value.sec}.pdf`
  )
});
const filteredDocs = computed(() => {
  return loadedDocs.value.filter(
    (it) =>
      it.name !== `${initialData.value.sec}.pdf`
  )
});
</script>

<style>
.titles {
  color: #6B737C;
  font-weight: bold;
  margin-top: 10px;
}
</style>
