<template>
  <template v-if="isEdit">
    <q-form ref="form" class="[&>*]:tw-mb-4" greedy>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
        <q-expansion-item
          label="Información General del caso"
          header-class="tw-text-lg tw-font-bold  tw-pl-0"
          default-opened
          class="tw-bg-white tw-px-4 tw-py-5"
        >
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="tw-text-lg">Información General del Caso</b>
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Número de Radicado
              </p>
              <p>{{ $props.data?.idRadicado }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Tipo de Solicitud
              </p>
              <p>{{ $props.data?.solicitudDatosGenerales }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Nombre Afectado
              </p>
              <p>{{ $props.data?.informacionAfectada?.nombresAfectado }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Fecha de Radicación
              </p>
                <p>
                {{
                  moment($props.data?.fechaRadicacion, "DD/MM/YYYY hh:mm A").format("DD/MM/YYYY HH:mm")
                }}
                </p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Tiempo por Vencer
              </p>
              <p>{{ $props.data?.diasPorVencer }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Fecha de Vencimiento
              </p>
              <p>
                {{
                  moment(
                    $props.data?.informacionGeneral?.fechaVencimiento
                  ).format("DD/MM/YYYY")
                }}
              </p>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
        <q-expansion-item
          label="Datos del Remitente"
          default-opened
          header-class="tw-text-lg tw-font-bold"
        >
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="text-bold tw-text-xl tw-flex-1 q-py-md"
                >Datos del Remitente</b
              >
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">Tipo de Remitente *</p>
              <q-select
                :options="listadoTipoRemitente"
                map-options
                outlined
                v-model="listaTipoRemitente"
                label="Seleccione"
                dense
                :rules="[rulesValidation]"
                disable
              />
            </div>
            <div
              class="tw-col-span-2"
              v-if="
                props.data?.canalRadicacion?.nombre !==
                'Defensor del consumidor'
              "
            >
              <p class="tw-text-label tw-font-semibold">
                Tipo de documento del remitente
              </p>
              <q-select
                :options="tipoDoc"
                map-options
                emit-value
                outlined
                v-model="listaTipoDocRemitente"
                label="Seleccione"
                dense
                disable
              />
            </div>
            <div
              class="tw-col-span-2"
              v-if="
                props.data?.canalRadicacion?.nombre !==
                'Defensor del consumidor'
              "
            >
              <p class="tw-text-label tw-font-semibold">
                Número de documento del remitente
              </p>
              <q-input
                type="text"
                min="0"
                outlined
                v-model="formData.informacionRemitente.numeroDocumentoremitente"
                label="Inserte"
                dense
                :rules="[(v: string) => lengthValidation(15, v), alphanumeric]"
                disable
              />
            </div>
            <div class="tw-col-span-4">
              <p class="tw-text-label tw-font-semibold">
                Nombres del Remitente *
              </p>
              <q-input
                outlined
                v-model="formData.informacionRemitente.nombreRemitente"
                label="Inserte"
                dense
                :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]"
                @keypress="alphabeticalWithSpecialCharacters"
                disable
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
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="text-bold tw-text-xl tw-flex-1 q-py-md"
                >Datos del Afectado</b
              >
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
            <p
              class="tw-col-span-6 tw-text-black tw-font-semibold tw-pb-2"
              v-if="listaCanalEntrada === 2 || listaCanalEntrada?.value === 2"
            >
              Recuerde que los datos del afectado son los relacionados a los de
              quien se solicita el requerimiento ante Positiva *
            </p>
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
                v-model="listaTipoDocAfectado"
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
                v-model="formData.informacionAfectada.numeroDocumentoAfectado"
                label="Inserte"
                dense
                :rules="[(v: string) => lengthValidation(15, v), alphanumeric, rulesValidation]"
              />
            </div>
            <div class="tw-col-span-6">
              <p class="tw-text-label tw-font-semibold">
                Nombre del Afectado *
              </p>
              <q-input
                outlined
                v-model="formData.informacionAfectada.nombresAfectado"
                label="Inserte"
                dense
                :rules="[(v: string) => lengthValidation(200, v), rulesValidation, alphabeticalWithSpecialCharacters]"
                @keypress="alphabeticalWithSpecialCharacters"
              />
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">
                ¿Pertenece a la Comunidad LGBTIQ+? *
              </p>
              <q-select
                :options="[
                  { label: 'Si', value: true },
                  { label: 'No', value: false },
                ]"
                map-options
                emit-value
                outlined
                v-model="formData.informacionAfectada.perteneceLGBT"
                label="Seleccione"
                dense
                :rules="[rulesValidation, (v: null) => v === null ? 'Este campo es requerido' : true]"
              />
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Sexo *</p>
              <q-select
                :options="generoOptions"
                map-options
                emit-value
                outlined
                v-model="listaGeneroAfectado"
                label="Seleccione"
                dense
                :rules="[rulesValidation]"
              />
            </div>
            <div
              :key="sexoSelecionado"
              v-if="sexoSelecionado === 6"
              class="tw-col-span-2"
            >
              <p class="tw-text-label tw-font-semibold">Otro ¿Cuál? *</p>
              <q-input
                ref="sexoCualInput"
                outlined
                v-model="formData.informacionAfectada.sexoCual"
                label="Inserte"
                dense
                :rules="[
                  (v) => lengthValidation(50, v),
                  inputRequired,
                  alphabeticalWithSpecialCharacters,
                ]"
                @keypress="alphabeticalWithSpecialCharacters"
              />
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Condición Especial *</p>
              <q-select
                :options="listadoCondiciones"
                outlined
                v-model="listaCondicionesEspeciales"
                :rules="[rulesValidation]"
                label="Seleccione"
                dense
                input-debounce="0"
                class="tw-rounded-lg"
              >
              </q-select>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
        <q-expansion-item
          label="Medios de Contacto y Envio de Respuesta"
          default-opened
          header-class="tw-text-lg tw-font-bold"
        >
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="text-bold tw-text-xl tw-flex-1 q-py-md"
                >Medios de Contacto y Envio de Respuesta</b
              >
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Canal de Entrada *</p>
              <q-select
                :options="listadoCanalesRadicacion"
                map-options
                emit-value
                :rules="[rulesValidation]"
                outlined
                v-model="listaCanalEntrada"
                :disable="true"
                label="Seleccione"
                dense
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Correo Electrónico *</p>
              <q-input
                outlined
                v-model="formData.informacionContacto.email"
                label="Inserte"
                dense
                :rules="[rulesValidation, (v: string) => validationEmail(v), (v: string) => lengthValidation(200, v)]"
                :disable="!isAsignadorResponsable"
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Teléfono Celular</p>
              <q-input
                outlined
                min="0"
                v-model="formData.informacionContacto.telefonoCelular"
                label="Inserte"
                dense
                :rules="[
                  mobilePhonNumber,
                  onlyNumbers,
                  formData.informacionContacto.telefonoFijo
                    ? null
                    : inputRequired,
                ]"
                type="text"
                @keypress="onlyNumber"
                :disable="!isAsignadorResponsable"
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Teléfono Fijo</p>
              <q-input
                outlined
                min="0"
                v-model="formData.informacionContacto.telefonoFijo"
                label="Inserte"
                dense
                :rules="[
                  (v) => maxLengthInput(10, v),
                  (v) => minLengthInput(7, v),
                  onlyNumbers,
                  formData.informacionContacto.telefonoCelular
                    ? null
                    : inputRequired,
                ]"
                type="text"
                @keypress="onlyNumber"
                :disable="!isAsignadorResponsable"
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">País *</p>
              <q-select
                :options="paiseOptions"
                map-options
                :rules="[rulesValidation]"
                outlined
                v-model="formData.informacionContacto.paisContacto"
                label="Seleccione"
                dense
                :disable="!isAsignadorResponsable"
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Departamento *</p>
              <q-select
                :options="departamentoOptions"
                map-options
                :rules="[rulesValidation]"
                outlined
                v-model="formData.informacionContacto.departamentoContacto"
                label="Seleccione"
                dense
                :disable="!isAsignadorResponsable"
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Municipio *</p>
              <q-select
                :options="municipioOptions"
                map-options
                :rules="[rulesValidation]"
                outlined
                v-model="formData.informacionContacto.ciudadContacto"
                label="Seleccione"
                dense
                :disable="!isAsignadorResponsable"
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Dirección</p>
              <!-- @vue-expect-error -->
              <q-input
                ref="direccionContactoInput"
                outlined
                v-model="formData.informacionContacto.direccionContacto"
                label="Inserte"
                dense
                :rules="(listaMedioRespuesta == 2 || formData.informacionContacto.direccionContacto || !formData.informacionContacto.email)
                  ? [inputRequired, (v: string) => lengthValidation(100, v)]
                  : [true]"
                @keypress="onlyAlphaNumeric"
                :disable="!isAsignadorResponsable"
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
                :rules="[rulesValidation, (v: number) => v === 1 && formData.informacionContacto.email === '' ?
                  'Por favor diligencie correo electrónico del remitente para autorizar envío de respuesta por medio electrónico' : true,
                  (v: number) => v === 2 && formData.informacionContacto.direccionContacto === '' ?
                    'Por favor diligencie dirección de remitente para autorizar envío de respuesta por este medio físico' : true]"
                outlined
                v-model="listaMedioRespuesta"
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
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</b>
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4 tw-mb-4">
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Tipo de Solicitud *</p>
              <q-select
                :options="filteredSolicitudes"
                :rules="[rulesValidation]"
                outlined
                map-options
                emit-value
                v-model="formData.informacionSolicitud.tiposolicitudEntity.id"
                label="Seleccione"
                dense
                @filter="solicitudOptionsFilterFn"
                use-input
                fill-input
                hide-selected
              />
            </div>
            <div class="tw-col-span-3">
              <p class="tw-text-label tw-font-semibold">Producto *</p>
              <q-select
                :options="filteredProductos"
                map-options
                emit-value
                :rules="[rulesValidation]"
                outlined
                v-model="listaProducto"
                label="Seleccione"
                dense
                @filter="productoOptionsFilterFn"
                use-input
                fill-input
                hide-selected
              />
            </div>
            <div
              class="tw-col-span-3"
              v-if="
                props.data?.canalRadicacion?.nombre !==
                'Defensor del consumidor'
              "
            >
              <p class="tw-text-label tw-font-semibold">
                ¿Es información pública?
              </p>
              <q-select
                v-model="formData.informacionSolicitud.accesoInfo"
                :options="[
                  { label: 'Sí', value: true },
                  { label: 'No', value: false },
                ]"
                map-options
                emit-value
                outlined
                label="Seleccione"
                dense
              />
            </div>
            <div
              class="tw-col-span-3"
              v-if="
                props.data?.canalRadicacion?.nombre !==
                'Defensor del consumidor'
              "
            >
              <p class="tw-text-label tw-font-semibold">
                Acceso a información pública
              </p>
              <q-select
                v-model="listaDetalleAccessInfo"
                :options="
                  formData.informacionSolicitud.accesoInfo
                    ? descripcionAcessInfoOptions
                    : [{ label: 'No reporta', value: null }]
                "
                map-options
                emit-value
                :disable="!formData.informacionSolicitud.accesoInfo"
                :rules="
                  formData.informacionSolicitud.accesoInfo
                    ? [rulesValidation]
                    : []
                "
                outlined
                label="Seleccione"
                dense
              />
            </div>
            <div
              class="tw-col-span-3"
              v-if="listaTipoSolicitud == 14 || listaTipoSolicitud?.value == 14"
            >
              <span class="tw-w-full">
                <label class="tw-text-label tw-font-semibold"
                  >Asignar Oficina *</label
                >
                <q-select
                  v-model="formData.informacionAfectada.oficinaAfectado"
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
            <div
              class="tw-col-span-3"
              v-if="listaTipoSolicitud == 14 || listaTipoSolicitud?.value == 14"
            >
              <p class="tw-text-label tw-font-semibold">Detalle *</p>
              <q-input
                type="textarea"
                :rules="[rulesValidation, (v: string) => lengthValidation(150, v)]"
                outlined
                dense
                v-model:model-value="formData.detalleSolicitud"
                @keypress="onlyAlphaNumeric"
              />
            </div>
          </div>
          <b class="text-bold tw-text-xl tw-ml-4">Metadatos</b>
          <Metadatos
            ref="metadatosComp"
            :pqrdData="data"
            :metadatos="metadatos"
          />

          <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
            <div class="tw-col-span-12 tw-mb-5 tw-w-full">
              <q-separator spaced />

              <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                Información Adicional
              </h3>
              <p class="tw-text-label tw-font-semibold">Observaciones *</p>
              <!-- <p>Su requerimiento debe ser claro y conciso. Por ejemplo:
                “Solicito respuesta al radicado ENT202101000254789”
                “Requiero asignación de asesor para SGSST”,
                “Solicitar actualización de datos de afiliación riesgos laborales”
              </p> -->
              <q-input
                class="tw-w-full"
                type="textarea"
                :rules="[rulesValidation, (v: string) => lengthValidation(10000, v)]"
                outlined
                dense
                v-model:model-value="
                  formData.informacionSolicitud.observaciones
                "
              />
            </div>

            <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-2">
                Documento de Entrada
              </p>

              <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
                <q-card
                  v-for="(
                    { nombre, formato, id, nodeId }, index
                  ) in loadedDocs.filter(
                    (it) => it.tipo == data.idRadicado + '.pdf'
                  )"
                  :key="index"
                  class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                  flat
                  bordered
                >
                  <img style="width: 26px" v-lazy :data-url="tipoIcon(formato)" />
                  <p class="tw-text-xs tw-font-semibold">
                    {{ nombre }}
                  </p>
                  <div class="tw-flex tw-gap-1">
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="download"
                      @click="() => handleOpenDocFile(id, nombre)"
                    />
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="info"
                      v-if="formato == 'application/pdf'"
                      @click="visualize(id)"
                    />
                  </div>
                </q-card>
                <div
                  class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md"
                >
                  <q-card
                    class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                    flat
                    bordered
                    :key="doc.id"
                    v-for="doc in loadedDocs"
                  >
                    <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)" />
                    <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                    <div class="tw-flex tw-gap-1">
                      <q-icon
                        size="16px"
                        class="tw-cursor-pointer"
                        name="download"
                        @click="() => handleOpenDocFile(doc.id, doc.nombre)"
                      />
                      <q-icon
                        size="16px"
                        class="tw-cursor-pointer"
                        name="info"
                        v-if="doc.formato == 'application/pdf'"
                        @click="visualize(doc.id)"
                      />
                    </div>
                  </q-card>
                </div>
              </div>
            </div>

            <!--            <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">-->
            <!--              <p class="tw-text-label tw-font-semibold tw-pb-2">-->
            <!--                Documentos Adjuntos-->
            <!--              </p>-->

            <!--              <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">-->
            <!--                <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm" flat bordered :key="doc.id"-->
            <!--                  v-for="doc in loadedDocs">-->
            <!--                  <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)">-->
            <!--                  <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>-->
            <!--                  <div class="tw-flex tw-gap-1">-->
            <!--                    <q-icon size="16px" class="tw-cursor-pointer" name="download"-->
            <!--                      @click="() => handleOpenDocFile(doc.id, doc.nombre)" />-->
            <!--                    <q-icon size="16px" class="tw-cursor-pointer" name="info" v-if="doc.formato == 'application/pdf'"-->
            <!--                      @click="visualize(doc.id)" />-->
            <!--                  </div>-->
            <!--                </q-card>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </q-expansion-item>
      </q-card>
      <div class="col row justify-center q-gutter-x-md q-my-md">
        <q-btn
          color="accent"
          textColor="secondary"
          label="Cancelar"
          style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          "
          no-caps
          @click="cancelModal = true"
        />

        <q-btn
          color="primary"
          label="Guardar"
          style="
            width: 130px;
            height: 40px;
            border-radius: 8px;
            font-size: 16px;
          "
          @click="submit"
          :loading="handleSubmitIsLoading"
        />
      </div>
    </q-form>
  </template>

  <template v-else>
    <div class="[&>*]:tw-mb-4">
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
        <q-expansion-item
          label="Información General del caso"
          header-class="tw-text-lg tw-font-bold  tw-pl-0"
          default-opened
          class="tw-bg-white tw-px-4 tw-py-5"
        >
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="tw-text-lg">Información General del Caso</b>
              <q-btn
                v-if="auth.$state.userInfo.role == 'Asignador Responsable'"
                icon="edit"
                color="secondary"
                label="Editar"
                dense
                class="q-py-xs"
                @click="isEdit = true"
              ></q-btn>
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Número de Radicado
              </p>
              <p>{{ $props.data?.idRadicado }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Tipo de Solicitud
              </p>
              <p>{{ $props.data?.informacionSolicitud?.tipoSolicitud }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Nombre Afectado
              </p>
              <p>{{ $props.data?.informacionAfectada?.nombresAfectado }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Fecha de Radicación
              </p>
                <p>{{ moment($props.data?.fechaRadicacion, "DD/MM/YYYY hh:mm A").format("DD/MM/YYYY HH:mm") }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Tiempo por Vencer
              </p>
              <p>{{ $props.data?.diasPorVencer }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Fecha de Vencimiento
              </p>
              <p>
                {{
                  moment(
                    $props.data?.informacionGeneral?.fechaVencimiento
                  ).format("DD/MM/YYYY HH:mm")
                }}
              </p>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
        <q-expansion-item
          label="Afectado"
          header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
          default-opened
          class="tw-bg-white tw-px-4 tw-py-5"
        >
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Afectado</b>
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3">
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Tipo de Documento del Afectado
              </p>
              <p>
                {{ $props.data?.informacionAfectada?.tipoDocumentoAfectado }}
              </p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Número de Documento del Afectado
              </p>
              <p>
                {{ $props.data?.informacionAfectada?.numeroDocumentoAfectado }}
              </p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Nombre del Afectado
              </p>
              <p>{{ $props.data?.informacionAfectada?.nombresAfectado }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                ¿Pertenece a la Comunidad LGBTIQ+?
              </p>
              <p>
                {{
                  $props.data?.informacionAfectada?.perteneceLGBT ? "Si" : "No"
                }}
              </p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Sexo</p>
              <p>{{ $props.data?.informacionAfectada?.sexo }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Cual</p>
              <p>{{ $props.data?.informacionAfectada?.sexoCual }}</p>
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Condición Especial
              </p>
              <p>
                {{
                  $props.data?.informacionAfectada?.condicionesEspeciales[0]
                    ?.condicion_especial_id?.nombre
                }}
              </p>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
      <q-card
        class="tw-px-4 tw-py-2 tw-rounded-xl"
        flat
        v-if="props.data?.canalRadicacion?.id !== 5"
      >
        <q-expansion-item
          label="Medios de Contacto y Envio de Respuesta"
          header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
          class="tw-bg-white tw-px-4 tw-py-5"
          default-opened
        >
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="text-bold tw-text-xl tw-flex-1 q-py-md"
                >Medios de Contacto y Envio de Respuesta</b
              >
            </div>
          </template>
          <div class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4">
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Correo Electrónico
              </p>
              <p class="tw-break-words tw-whitespace-normal">
                {{ $props.data?.informacionContacto?.email }}
              </p>
            </div>

            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Teléfono Celular
              </p>
              <p>{{ $props.data?.informacionContacto?.telefonoCelular }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Teléfono Fijo
              </p>
              <p>{{ $props.data?.informacionContacto?.telefonoFijo }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">País</p>
              <p>{{ $props.data?.informacionContacto?.paisContacto }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Departamento</p>
              <p>
                {{
                  $props.data?.informacionContacto?.paisContacto.toLowerCase() ==
                  "colombia"
                    ? $props.data?.informacionContacto?.departamentoContacto
                        .label
                    : "N/A"
                }}
              </p>
            </div>

            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Ciudad</p>
              <p>
                {{
                  $props.data?.informacionContacto?.paisContacto.toLowerCase() ==
                  "colombia"
                    ? $props.data?.informacionContacto?.ciudadContacto.label
                    : "N/A"
                }}
              </p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Dirección</p>
              <p>{{ $props.data?.informacionContacto?.direccionContacto }}</p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Medio por el que Desea Recibir Respuesta
              </p>
              <p>{{ $props.data?.informacionContacto?.medioRepuesta }}</p>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl tw-w-full" flat>
        <q-expansion-item
          label="Solicitud"
          header-class="tw-text-lg tw-font-bold tw-text-red tw-pl-0"
          default-opened
          class="tw-bg-white tw-px-4 tw-py-5"
        >
          <template v-slot:header>
            <div class="row justify-between tw-w-full">
              <b class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</b>
            </div>
          </template>
          <div
            class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4 tw-mb-5"
          >
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold">Tipología de la PQRD</p>
              <p>{{ formData?.informacionSolicitud?.tipologia || "N/A" }}</p>
            </div>

            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Tipo de Solicitud
              </p>
              <p>
                {{ $props.data?.informacionSolicitud?.tipoSolicitud || "N/A" }}
              </p>
            </div>
            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Producto</p>
              <p>{{ $props.data?.informacionSolicitud?.producto || "N/A" }}</p>
            </div>
            <div
              v-if="props.data?.canalRadicacion?.nombre === 'WEB'"
              class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between"
            >
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Información Pública
              </p>
              <p>
                {{
                  $props.data?.informacionSolicitud?.accesoInfo ? "Si" : "No"
                }}
              </p>
            </div>

            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Proceso</p>
              <p>{{ metadatos?.categoria?.nombre || "N/A" }}</p>
            </div>

            <div class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Causa Raíz</p>
              <p>{{ metadatos?.causaRaiz?.nombre || "N/A" }}</p>
            </div>
            <div class="tw-col-span-5 tw-flex tw-flex-col tw-justify-between">
              <p class="tw-text-label tw-font-semibold tw-pb-1">Detalle</p>
              <p>{{ $props.data?.informacionSolicitud?.observaciones }}</p>
            </div>
            <div
              v-if="props.data?.canalRadicacion?.nombre === 'WEB'"
              class="tw-col-span-1 tw-flex tw-flex-col tw-justify-between"
            >
              <p class="tw-text-label tw-font-semibold tw-pb-1">
                Acceso a Información Pública
              </p>
              <p>{{ $props.data?.informacionSolicitud?.detalle }}</p>
            </div>
          </div>
          <div
            class="tw-grid tw-grid-cols-5 tw-gap-4 tw-pl-3 tw-gap-y-4 tw-mb-5"
          >
            <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
              <q-separator spaced />

              <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
                Información Adicional
              </h3>

              <div class="tw-col-span-12">
                <p class="tw-text-label tw-font-semibold tw-pb-1">
                  Observación
                </p>
                <p>{{ $props.data?.informacionSolicitud?.observaciones }}</p>
              </div>

              <p class="tw-text-label tw-font-semibold tw-pb-2 tw-mt-5">
                Documento de Entrada
              </p>

              <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
                <q-card
                  v-for="(
                    { nombre, formato, id, nodeId }, index
                  ) in loadedDocs.filter((it) => it.tipo == 'De Entrada')"
                  :key="index"
                  class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                  flat
                  bordered
                >
                  <img style="width: 26px" v-lazy :data-url="tipoIcon(formato)" />
                  <p class="tw-text-xs tw-font-semibold">
                    {{ nombre }}
                  </p>
                  <div class="tw-flex tw-gap-1">
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="download"
                      @click="() => handleOpenDocFile(id, nombre)"
                    />
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="info"
                      v-if="formato == 'application/pdf'"
                      @click="visualize(id)"
                    />
                  </div>
                </q-card>
              </div>

              <p class="tw-text-label tw-font-semibold tw-pb-2 tw-mt-5">
                Documentos de Salida
              </p>

              <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
                <q-card
                  class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                  flat
                  bordered
                  :key="doc.id"
                  v-for="doc in loadedDocs.filter(
                    (it) => it.tipo == 'De salida'
                  )"
                >
                  <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)" />
                  <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                  <div class="tw-flex tw-gap-1">
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="download"
                      @click="() => handleOpenDocFile(doc.id, doc.nombre)"
                    />
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="info"
                      v-if="doc.formato == 'application/pdf'"
                      @click="visualize(doc.id)"
                    />
                  </div>
                </q-card>
                <q-card
                  class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                  flat
                  bordered
                  :key="doc.id"
                  v-for="doc in cargarDocs.filter(
                    (it) =>
                      it.tipo == 'De salida' &&
                      it.nombre &&
                      it.nombre.startsWith('SAL')
                  )"
                >
                  <img style="width: 26px" v-lazy :data-url="PDFIcon" />
                  <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                  <div class="tw-flex tw-gap-1">
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="download"
                      @click="() => handleOpenDocFile(doc.id, doc.nombre)"
                    />
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="info"
                      @click="visualize(doc.id)"
                    />
                  </div>
                </q-card>
              </div>
              <p class="tw-text-label tw-font-semibold tw-pb-2 tw-mt-5">
                Documentos de Gestión
              </p>

              <div class="flex column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
                <q-card
                  class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-sm"
                  flat
                  bordered
                  :key="doc.id"
                  v-for="doc in loadedDocs.filter(
                    (it) => it.tipo == 'De gestión'
                  )"
                >
                  <img style="width: 26px" v-lazy :data-url="tipoIcon(doc.formato)" />
                  <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
                  <div class="tw-flex tw-gap-1">
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="download"
                      @click="() => handleOpenDocFile(doc.id, doc.nombre)"
                    />
                    <q-icon
                      size="16px"
                      class="tw-cursor-pointer"
                      name="info"
                      v-if="doc.formato == 'application/pdf'"
                      @click="visualize(doc.id)"
                    />
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </q-expansion-item>
      </q-card>
    </div>
  </template>
  <Modal
    v-model="cancelModal"
    title="¡Espera un momento!"
    :is-success="false"
    text-button="Aceptar"
    cancel-button
    text="¿Estás seguro de cancelar el proceso?"
    @close-modal="cancelModal = false"
    @handleAccept="isEdit = false"
    type="button"
  />
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
import { Ref, computed, onMounted, ref, watch } from "vue";
import moment from "moment";
import { adminAxios, intescoAxios, sgdeaAxios } from "src/services";
import { DocsBD, SelectInput } from "src/interfaces";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import {
  validationEmail,
  onlyNumbers,
  inputRequired,
  minLengthInput,
  maxLengthInput,
  alphabeticalWithSpecialCharacters,
  alphanumeric,
} from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import { useRoute, useRouter } from "vue-router";
import Modal from "src/components/Modal/Modal.vue";
import { useAuthStore } from "src/stores/auth.store";
import { fourthFormatDate } from "src/helpers/formtDate";
import Metadatos from "src/pages/PQRD/Metadatos/metadatos.vue";

interface PQRD {
  id: number;
  informacionRemitente: {
    tipoRemitente: string;
    tipoDocumentoRemitente: string;
    numeroDocumentoremitente: string;
    nombreRemitente: string;
    tipoRemitenteEntity: { id: number; nombre: string };
    tipoDocumentoEntity: { id: number; nombre: string };
  };
  informacionGeneral: {
    numeroRadicado: string;
    tipoSolicitud: string;
    afectado: string;
    fechaVencimiento: number;
  };
  informacionAfectada: {
    tipoDocumentoAfectado: string;
    numeroDocumentoAfectado: string;
    nombresAfectado: string;
    perteneceLGBT: boolean;
    sexo: string;
    sexoCual: any;
    condicionEspecial: boolean;
    oficinaAfectado: string;
    tipoDocumentoAfectadoEntity: { id: number; nombre: string };
    generoEntity: { id: number; nombre: string };
    condicionesEspeciales: {
      id: number;
      afectado: {
        id: number;
        tipoDocumento: { id: number; nombre: string };
        numeroDocumento: string;
        nombre: string;
        lgtbtq: boolean;
        genero: { id: number; nombre: string };
        otroGenero: string | null;
        correoElectronico: string;
        telefonoCelular: string | null;
        telefonoFijo: string | null;
        pais: { idPais: number; nombre: string; idContinente: number };
        departamento: {
          idDepartamento: number;
          nombre: string;
          idPais: number;
          codigoDivipola: string;
        };
        municipio: {
          idMunicipio: number;
          nombre: string;
          idDepartamento: number;
          codigoDivipola: string;
        };
        direccion: string;
        medioRespuesta: { id: number; nombre: string };
        oficina: string;
        detalle: string;
        descripcionPqrd: string | null;
        anexoFolios: string | null;
        numeroFolios: string | null;
        mediosMagneticos: string | null;
        isCondicionEspecial: string | null;
        condicionCorrespondencia: string | null;
        barrio: string | null;
      };
      condicion_especial_id: { id: number; nombre: string };
    }[];
  };
  informacionContacto: {
    email: string;
    telefonoCelular: string;
    telefonoFijo: string;
    paisContacto: string;
    departamentoContacto: string;
    ciudadContacto: string;
    direccionContacto: string;
    medioRepuesta: string;
    paisEntity: { idPais: number; nombre: string; idContinente: number };
    medioRespuestaEntity: { id: number; nombre: string };
    departamentoEntity: {
      idDepartamento: number;
      nombre: string;
      idPais: number;
      codigoDivipola: string;
    };
    municipioEntity: {
      idMunicipio: number;
      nombre: string;
      idDepartamento: number;
      codigoDivipola: string;
    };
  };
  informacionSolicitud: {
    producto: string;
    accesoInfo: boolean;
    observaciones: string;
    detalle: string;
    tipologia: string;
    tipoSolicitud: string;
    productoEntity: { id: number; nombre: string };
    tipologiaEntity: { id: number; nombre: string };
    tiposolicitudEntity: { id: number; nombre: string };
  };
  nodeID: string;
  idRadicado: string;
  clonado: boolean;
  idConsolidador: number;
  estado: { id: number; etapa: string; estado: string };
  canalRadicacion: { id: number; nombre: string };
  detalleSolicitud: string;
  oficinaDatosGenerales: null;
}

const formData: Ref<PQRD> = ref({
  id: 0,
  informacionRemitente: {
    tipoRemitente: "",
    tipoDocumentoRemitente: "",
    numeroDocumentoremitente: "",
    nombreRemitente: "",
    tipoRemitenteEntity: { id: 0, nombre: "" },
    tipoDocumentoEntity: { id: 0, nombre: "" },
  },
  informacionGeneral: {
    numeroRadicado: "",
    tipoSolicitud: "",
    afectado: "",
    fechaVencimiento: 0,
  },
  informacionAfectada: {
    tipoDocumentoAfectado: "",
    numeroDocumentoAfectado: "",
    nombresAfectado: "",
    perteneceLGBT: false,
    sexo: "",
    sexoCual: "",
    condicionEspecial: false,
    oficinaAfectado: "",
    tipoDocumentoAfectadoEntity: { id: 0, nombre: "" },
    generoEntity: { id: 0, nombre: "" },
    condicionesEspeciales: [],
  },
  informacionContacto: {
    email: "",
    telefonoCelular: "",
    telefonoFijo: "",
    paisContacto: "",
    departamentoContacto: "",
    ciudadContacto: "",
    direccionContacto: "",
    medioRepuesta: "",
    paisEntity: { idPais: 0, nombre: "", idContinente: 0 },
    medioRespuestaEntity: { id: 0, nombre: "" },
    departamentoEntity: {
      idDepartamento: 0,
      nombre: "",
      idPais: 0,
      codigoDivipola: "",
    },
    municipioEntity: {
      idMunicipio: 0,
      nombre: "",
      idDepartamento: 0,
      codigoDivipola: "",
    },
  },
  informacionSolicitud: {
    producto: "",
    accesoInfo: false,
    observaciones: "",
    detalle: "",
    tipologia: "",
    tipoSolicitud: "",
    productoEntity: { id: 0, nombre: "" },
    tipologiaEntity: { id: 0, nombre: "" },
    tiposolicitudEntity: { id: 0, nombre: "" },
  },
  nodeID: "",
  idRadicado: "",
  clonado: false,
  idConsolidador: 0,
  estado: { id: 0, etapa: "", estado: "" },
  canalRadicacion: { id: 0, nombre: "" },
  detalleSolicitud: "",
  oficinaDatosGenerales: null,
});

const isEdit = ref(false);
const cancelModal = ref(false);
const form = ref();
const auth = useAuthStore();
const listaTipoRemitente = ref();
const listaTipoDocRemitente = ref();
const listaTipoDocAfectado = ref();
const listaGeneroAfectado = ref(null);
const listaPaises = ref();
const listaCondicionesEspeciales = ref();
const listaMedioRespuesta = ref();
const listaTipoSolicitud = ref();
const listaTipologia = ref();
const listaProducto = ref();
const listaCanalEntrada = ref();
const listaDetalleAccessInfo = ref();
const handleSubmitIsLoading = ref<boolean>(false);
const metadatosComp = ref();
const sexoSelecionado = ref<number | null>(null);

defineExpose({
  isEdit,
});

interface InfoGeneralProps {
  infoEditada: boolean;
  data: any;
  metadatos: any;
  visualize: (nodeId: string) => {};
}

const emit = defineEmits(["successSave", "success"]);

const props = defineProps<InfoGeneralProps>();
const loadedDocs = ref<any[]>([]);
const paiseOptions: Ref<any[]> = ref([]);
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const generoOptions: Ref<any[]> = ref([]);
const descripcionAcessInfoOptions: Ref<any[]> = ref([]);
const listadoMediosRespuestaOptions: Ref<any[]> = ref([]);
const listadoTipologiaOptions: Ref<any[]> = ref([]);
const listadoTipologiaOptions2: Ref<any[]> = ref([]);
const listadoTipologiaOptions3: Ref<any[]> = ref([]);
const listadoTipologiaOptions4: Ref<any[]> = ref([]);
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
const isntColombia = ref(false);
const medioRespuestaContactoSelect = ref(null);
const direccionContactoInput = ref(null);
let isLoadingData = true;
const route = useRoute();
const router = useRouter();

const isAsignadorResponsable = computed(() => {
  return auth.$state.userInfo.role?.toLowerCase() === "asignador responsable";
});
const localInfoEditada = ref(props.infoEditada);

watch(localInfoEditada, (newValue) => {
  emit("update-info-editada", newValue); // Emitir el evento al padre
});

onMounted(async () => {
  await loadPaises();
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
  let intervalID = setInterval(() => {
    if (props.data) {
      getData();
      getAllRegisters();
      clearInterval(intervalID);
    }
  }, 100);
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
        label: val.nombre,
        value: val.idPais,
      };
    }),
  ];
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
      descripcionAcessInfoOptions.value = response.data.map((e: any) => {
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
    const response = await sgdeaAxios.get("/pqrd/listadoTipologia");

    if (response.status == 200 || response.status == 201) {
      listadoTipologiaOptions.value = response.data.map((e: any) => {
        return {
          label: e.nombre,
          value: e.id,
        };
      });
    }

    listadoTipologiaOptions2.value = listadoTipologiaOptions.value.filter(
      (e) => {
        return e.value !== 8;
      }
    );

    listadoTipologiaOptions3.value = listadoTipologiaOptions.value.filter(
      (e) => {
        return e.value !== 7;
      }
    );

    listadoTipologiaOptions4.value = listadoTipologiaOptions.value.filter(
      (e) => {
        return e.value !== 7 && e.value !== 8;
      }
    );

    sortOptions(listadoTipologiaOptions.value);
    sortOptions(listadoTipologiaOptions2.value);
    sortOptions(listadoTipologiaOptions3.value);
    sortOptions(listadoTipologiaOptions4.value);
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
      listadoProductosPQRD.value = response.data.map((e: any) => {
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

    filteredSolicitudes.value = listadoTiposSolicitud.value;
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

    listadoCanalesRadicacion.value = listadoCanalesRadicacion.value.filter(
      (e) => {
        return e.value !== 1 && e.value !== 4;
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
  return vals.sort(
    (leftItem: { label: string }, rightItem: { label: string }) => {
      const nombreA = leftItem.label.toLowerCase().trim();
      const nombreB = rightItem.label.toLowerCase().trim();

      if (nombreA < nombreB) {
        return -1;
      }

      if (nombreA > nombreB) {
        return 1;
      }

      return 0;
    }
  );
};

const tipoIcon = (tipo) => {
  if (['pdf', 'application/pdf'].includes(tipo.toLowerCase())) return PDFIcon;
  if (
    [
      'xls',
      'xlsx',
      'csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ].includes(tipo.toLowerCase())
  ) return excelIcon;
  if (
    [
      'docx',
      'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ].includes(tipo.toLowerCase())
  ) return docxIcon;
  if (
    [
      'jpeg',
      'jpg',
      'png',
      'webp',
      'image/jpg',
      'image/png',
      'image/jpeg'
    ].includes(tipo.toLowerCase())
  ) return img;
  if (['mp3', 'audio/mpeg'].includes(tipo.toLowerCase())) return music;
  if (
    [
      'avi',
      'mp4',
      'video/x-msvideo',
      'video/mp4'
    ].includes(tipo.toLowerCase())
  ) return video;
  if (
    [
      'txt',
      'bmp',
      'text/plain'
    ].includes(tipo.toLowerCase())
  ) return txt;
  if (['xml'].includes(tipo.toLowerCase())) return xml;
  if (['zip', 'rar'].includes(tipo.toLowerCase())) return zip;
  if (['ppt', 'pptx'].includes(tipo.toLowerCase())) return ppt;
  if (['msg', 'eml'].includes(tipo.toLowerCase())) return msg;
  return interrogation;
};

const handleOpenDocFile = async (id: string, name: string) => {
  try {
    const response = await sgdeaAxios.get(
      "/radicados/consultar_documento/" + id
    );

    const byteCharacters = atob(response.data.base64x);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/octet-stream" });

    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = name;

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);
  } catch (error) {
    console.error(error);
  }
};

function findOfficeValueByLabel(label) {
  const office = listadoOficinas.value.find((office) => office.label === label);
  return office ? office.value : null;
}

const getData = async () => {
  const nodeID = props.data.nodeID;

  formData.value = { ...props.data };
  const condicionesEsp =
    formData.value?.informacionAfectada?.condicionesEspeciales;

  listaCondicionesEspeciales.value = condicionesEsp.map(
    ({ condicion_especial_id }) => ({
      label: condicion_especial_id?.nombre,
      value: condicion_especial_id?.id,
    })
  )[0];

  const tipoRemitente = formData.value.informacionRemitente.tipoRemitenteEntity;
  const tipoDocRemitente =
    formData.value.informacionRemitente.tipoDocumentoEntity;
  const tipoDocAfectado =
    formData.value.informacionAfectada.tipoDocumentoAfectadoEntity;
  const tipoGeneroAfectado = formData.value.informacionAfectada.generoEntity;
  const tipoPais = formData.value.informacionContacto.paisEntity;
  const tipoMedioRespuesta =
    formData.value.informacionContacto.medioRespuestaEntity;
  // const tipoDepartamentos = formData.value.informacionContacto.departamentoEntity
  // const tipoMunicipios = formData.value.informacionContacto.municipioEntity

  formData.value.informacionContacto.departamentoContacto = {
    label: formData.value.informacionContacto.departamentoEntity?.nombre,
    value:
      formData.value.informacionContacto.departamentoEntity?.idDepartamento,
  } as any;
  formData.value.informacionContacto.ciudadContacto = {
    label: formData.value.informacionContacto.municipioEntity?.nombre,
    value: formData.value.informacionContacto.municipioEntity?.idMunicipio,
  } as any;

  const tipoTipoSolicitud =
    formData.value.informacionSolicitud.tiposolicitudEntity ||
    (formData.value.informacionSolicitud.tiposolicitudEntity = {
      id: 0,
      nombre: "",
    });
  const tipoTipologia = formData.value.informacionSolicitud.tipologiaEntity;
  const tipoProductos = formData.value.informacionSolicitud.productoEntity;

  const tipoCanalEntrada = formData.value.canalRadicacion;

  // @ts-ignore
  const tipoDetalleInfo =
    formData.value.informacionSolicitud.solicitudEntity
      ?.descripcionAccesoInformacion ||
    (formData.value.informacionSolicitud.solicitudEntity.descripcionAccesoInformacion =
      { id: 1, nombre: "Reservada" });

  listaTipoRemitente.value = {
    label: tipoRemitente ? tipoRemitente.nombre : "",
    value: tipoRemitente ? tipoRemitente.id : 0,
  };

  listaTipoDocRemitente.value = {
    label: tipoDocRemitente.nombre,
    value: tipoDocRemitente.id,
  };

  listaTipoDocAfectado.value = {
    label: tipoDocAfectado.nombre,
    value: tipoDocAfectado.id,
  };

  sexoSelecionado.value = tipoGeneroAfectado.id;
  listaGeneroAfectado.value = {
    label: tipoGeneroAfectado.nombre,
    value: tipoGeneroAfectado.id,
  };

  listaPaises.value = {
    label: tipoPais?.nombre,
    value: tipoPais?.idPais,
  };

  listaMedioRespuesta.value = {
    label: tipoMedioRespuesta?.nombre,
    value: tipoMedioRespuesta?.id,
  };

  listaTipoSolicitud.value = {
    label: tipoTipoSolicitud ? tipoTipoSolicitud.nombre : "",
    value: tipoTipoSolicitud ? tipoTipoSolicitud.id : 0,
  };

  listaTipologia.value = {
    label: tipoTipologia?.nombre,
    value: tipoTipologia?.id,
  };

  listaProducto.value = {
    label: tipoProductos ? tipoProductos.nombre : "",
    value: tipoProductos ? tipoProductos.id : 0,
  };

  listaCanalEntrada.value = {
    label: tipoCanalEntrada?.nombre,
    value: tipoCanalEntrada?.id,
  };

  // listaDetalleAccessInfo.value = {
  //   label: tipoDetalleInfo ? tipoDetalleInfo.nombre : "",
  //   value: tipoDetalleInfo ? tipoDetalleInfo.id : 0,
  // }

  if (formData.value.informacionSolicitud.accesoInfo === false) {
    listaDetalleAccessInfo.value = { label: "No reporta", value: "" };
  } else {
    listaDetalleAccessInfo.value = {
      label: tipoDetalleInfo?.nombre || "",
      value: tipoDetalleInfo?.id || 0,
    };
  }
};

const cargarDocs = ref<any[]>([]);

async function getAllRegisters() {
  // const { data } = await intescoAxios.get<any>(
  //   `/bandeja/consultarAnexosPorCarpeta?nodeId=${props.data.nodeID}`
  // );

  const idPqrd = route.params.id || props.data.id;
  const { data: files }: { data: DocsBD[] } = await sgdeaAxios.get(
    `/pqrd/obtenerDocs?idPqrd=${idPqrd}`
  );

  cargarDocs.value = files;

  loadedDocs.value = files.map((it) => ({
      formato: it.nombre.substring(it.nombre.lastIndexOf('.') + 1),
      nombre: it.nombre,
      fecha: fourthFormatDate(it.fechaCargue),
      cargado_por: (it && it.usuario)
        ? it.usuario?.firstname + ' ' + it.usuario?.lastname
        : 'Administrador',
      tipo: it.tipo ? it.tipo : 'De gestión',
      id: it.nodeId,
    }))
    .filter((it) => !it.tipo.includes("Respuesta"));

  const documentoPrincipal = loadedDocs.value.find((doc) =>
    doc.nombre.includes(props.data.idRadicado)
  );
  if (documentoPrincipal) {
    loadedDocs.value = [
      documentoPrincipal,
      ...loadedDocs.value.filter((doc) => doc !== documentoPrincipal),
    ];
  }

  if (props.data?.numeroAprobaciones > 0) {
    if (
      props.data?.numeroAprobaciones > 0 &&
      props.data?.refRadicadoSalida != null
    ) {
      const file = files.find((item) =>
        item.nombre.includes(props.data?.refRadicadoSalida)
      );
      // const file = files.find((item) =>  item.nombre.includes('SAL20240000265757'))

      const Datap = {
        formato: "application/pdf",
        nombre: file.nombre,
        fecha: fourthFormatDate(file.fechaCargue),
        cargado_por:
          file && file.usuario
            ? file.usuario?.firstname + " " + file.usuario?.lastname
            : "Administrador",
        tipo: file ? file.tipo : "De gestión",
        id: file.nodeId,
        es_devolucion: file?.es_devolucion || false,
      };

      loadedDocs.value = [...loadedDocs.value, Datap];
    }
  }
}

watch(
  () => formData.value.informacionContacto?.paisContacto,
  async (value) => {
    //@ts-ignore
    if (
      (value.label && value.label.toLowerCase() == "colombia") ||
      (value && value.toLowerCase() == "colombia")
    ) {
      isntColombia.value = false;
      //@ts-ignore
      const { optionsDepartments } = await useDepartments(425);
      departamentoOptions.value = sortOptions(optionsDepartments.value);
      if (!isLoadingData) {
        formData.value.informacionContacto.departamentoContacto = "";
        formData.value.informacionContacto.ciudadContacto = "";
      }
    } else {
      // @ts-ignore
      formData.value.informacionContacto.departamentoContacto = value;
      formData.value.informacionContacto.ciudadContacto = value;
      isntColombia.value = true;
    }
    isLoadingData = false;
  }
);

watch(
  () => formData.value.informacionContacto.departamentoContacto,
  async (value) => {
    if (value.value) {
      //@ts-ignore
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      municipioOptions.value = sortOptions(optionsMunicipalities.value);
    }

    if (isntColombia.value) {
      formData.value.informacionContacto.ciudadContacto = "";
    }
  }
);

watch(
  () => formData.value.informacionContacto.email,
  () => {
    if (formData.value.informacionContacto.email) {
      medioRespuestaContactoSelect.value?.resetValidation();
      direccionContactoInput.value?.resetValidation();
    }
  }
);

watch(
  () => formData.value.informacionContacto.direccionContacto,
  () => {
    if (formData.value.informacionContacto.direccionContacto) {
      medioRespuestaContactoSelect.value?.resetValidation();
    }
  }
);

watch(
  () => listaGeneroAfectado.value,
  async (newValue, oldValue) => {
    await loadGenero();
    const selectedOption = generoOptions.value.find(
      (option) => option.value === newValue
    );
    if (selectedOption) {
      if (selectedOption.value != 6)
        formData.value.informacionAfectada.sexoCual = "";
      sexoSelecionado.value = selectedOption.value;
    }
  }
);

function findCountryValueByLabel(label) {
  const country = paiseOptions.value.find(
    (country) => country.label.toLowerCase() === label.toLowerCase()
  );
  return country ? country.value : null;
}

function findDepValueByLabel(label) {
  const dep = departamentoOptions.value.find((dep) => dep.label === label);
  return dep ? dep.value : null;
}

function findCityValueByLabel(label) {
  const city = municipioOptions.value.find((city) => city.label === label);
  return city ? city.value : null;
}

const submit = async () => {
  const countryId = findCountryValueByLabel(
    formData.value.informacionContacto.paisContacto
  );
  const depId = findDepValueByLabel(
    formData.value.informacionContacto.departamentoContacto
  );
  const cityId = findCityValueByLabel(
    formData.value.informacionContacto.ciudadContacto
  );

  if (await form.value.validate()) {
    const validate = await metadatosComp.value.save();

    handleSubmitIsLoading.value = true;

    const oficinaAfectadoValue = findOfficeValueByLabel(
      formData.value.informacionAfectada.oficinaAfectado
    );
    const newFormData = new FormData();
    // @ts-ignore
    newFormData.append("pqrdId", Number(route.params.id));
    newFormData.append(
      "datosRemitenteTipoRemitenteId",
      listaTipoRemitente.value.value
    );
    // @ts-ignore
    newFormData.append(
      "datosRemitenteTipoDocumentoId",
      listaTipoDocRemitente.value.value || listaTipoDocRemitente.value
    );
    newFormData.append(
      "datosRemitenteNumeroDocumento",
      formData.value.informacionRemitente.numeroDocumentoremitente
    );
    newFormData.append(
      "datosRemitenteNombre",
      formData.value.informacionRemitente.nombreRemitente
    );
    newFormData.append(
      "datosAfectadoTipoDocumentoId",
      listaTipoDocAfectado.value.value || listaTipoDocAfectado.value
    );
    newFormData.append(
      "datosAfectadoNumeroDocumento",
      formData.value.informacionAfectada.numeroDocumentoAfectado
    );
    newFormData.append(
      "datosAfectadoNombre",
      formData.value.informacionAfectada.nombresAfectado
    );
    // @ts-ignore
    newFormData.append(
      "datosAfectadoLgtbtq",
      formData.value.informacionAfectada.perteneceLGBT
    );
    newFormData.append(
      "datosAfectadoGeneroId",
      listaGeneroAfectado.value.value || listaGeneroAfectado.value
    );
    newFormData.append(
      "datosAfectadoCorreoElectronico",
      formData.value.informacionContacto.email
    );

    if (
      formData.value.informacionContacto.telefonoCelular &&
      formData.value.informacionContacto.telefonoCelular !== ""
    ) {
      newFormData.append(
        "datosAfectadoTelefonoCelular",
        formData.value.informacionContacto.telefonoCelular
      );
    }

    if (
      formData.value.informacionContacto.telefonoFijo &&
      formData.value.informacionContacto.telefonoFijo !== ""
    ) {
      newFormData.append(
        "datosAfectadoTelefonoFijo",
        formData.value.informacionContacto.telefonoFijo
      );
    }

    //@ts-ignore
    newFormData.append(
      "datosAfectadoPaisIdPais",
      formData.value.informacionContacto.paisContacto.value || countryId
    );
    //@ts-ignore
    newFormData.append(
      "datosAfectadoDepartamentoIdDepartamento",
      formData.value.informacionContacto.departamentoContacto.value
    );
    //@ts-ignore
    newFormData.append(
      "datosAfectadoMunicipioIdMunicipio",
      formData.value.informacionContacto.ciudadContacto.value
    );
    newFormData.append(
      "datosAfectadoDireccion",
      formData.value.informacionContacto.direccionContacto
    );
    newFormData.append(
      "datosAfectadoMedioRespuestaId",
      listaMedioRespuesta.value.value || listaMedioRespuesta.value
    );
    newFormData.append("solicitudTipoPqrdId", listaTipologia.value.value);
    // @ts-ignore
    newFormData.append(
      "solicitudTipoSolicitudId",
      formData.value.informacionSolicitud.tiposolicitudEntity.id
    );
    newFormData.append(
      "solicitudTipoproductoId",
      listaProducto.value.value || listaProducto.value
    );

    // @ts-ignore
    newFormData.append(
      "solicitudAccesoInformacionPublica",
      formData.value.informacionSolicitud.accesoInfo
    );
    newFormData.append(
      "solicitudDescripcionAccesoInformacionId",
      listaDetalleAccessInfo.value?.value
    );
    newFormData.append(
      "solicitudObservaciones",
      formData.value.informacionSolicitud.observaciones
    );
    //@ts-ignore
    newFormData.append("solicitudDetalle", "");
    newFormData.append("usuarioCreador", props.data.usuarioCreador);
    newFormData.append(
      "canalRadicacion",
      listaCanalEntrada?.value?.value || listaCanalEntrada?.value
    );
    //@ts-ignore
    newFormData.append(
      "oficina",
      formData.value.informacionAfectada?.oficinaAfectado?.value ||
        oficinaAfectadoValue ||
        26
    );
    newFormData.append("detalleAfectado", "");
    //@ts-ignore
    let idCondiciones = [listaCondicionesEspeciales.value?.value];
    // @ts-ignore
    newFormData.append("listadoCondiciones", `[${idCondiciones}]`);

    if (formData.value.informacionAfectada.sexoCual) {
      newFormData.append(
        "datosAfectadoGeneroOtro",
        formData.value.informacionAfectada.sexoCual
      );
    }

    try {
      const response = await sgdeaAxios.post("/pqrd/radicar-pqrd", newFormData);
      if (response.status == 200 || response.status == 201) {
        const dataTrazabilidad = {
          proceso: `PQRD${response.data.id}`,
          secuencia: response.data.idRadicado,
          estado: response.data.estado.estado,
          descripcion: `Usuario:${auth.$state.userInfo.name} Descripción: Se ha actualizado la información de la PQRD. `,
          comentario: "Radicado",
          nombre: auth.$state.userInfo.name,
          accion: `${auth.$state.userInfo.name} ha editado la PQRD ${response.data.idRadicado}`,
          tramite:
            response.data.solicitud.tipoPqrd.id == 7 ? "PQRD Express" : "PQRD",
        };
        await sgdeaAxios.post("/trazabilidad/crear", dataTrazabilidad);
        //toast.success("Radicado editado correctamente")
        emit("successSave");
        setTimeout(() => {
          // @ts-ignore
          isEdit.value = false;
        }, 3000);
      }
      handleSubmitIsLoading.value = false;
    } catch (error) {
      toast.error("Ha ocurrido un error");
      handleSubmitIsLoading.value = false;
    }
  } else {
    metadatosComp.value.asignarRef.validate();
    return toast.error(
      "Para continuar, Asegúrese de que todos los campos obligatorios estén completos"
    );
  }
};

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
  if (
    (charCode > 47 && charCode < 58) ||
    (charCode > 64 && charCode < 91) ||
    (charCode > 96 && charCode < 123) ||
    charCode === 32
  ) {
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
    if (val.length == 12 && !expresionRegular.test(val)) {
      return "Ingrese un número de teléfono válido, debe contener el indicativo al principio (30)";
    } else if (!expresionRegular.test(val)) {
      return "El número de teléfono celular debe contener máximo 10 dígitos";
    }
  } else {
    return true;
  }
};

const lengthValidation = (n, val: string) =>
  val.length <= n || "Máximo " + n + " caracteres";
</script>
