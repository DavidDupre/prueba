<template>
  <div v-show="!isEdit">
    <q-expansion-item v-if="!isRevisor && !isAprobador" default-opened dense expand-separator
      class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Información general
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de Radicado</p>
          <p>{{ status && status.toLowerCase() === "aprobado"
            ? detailsRadicado.radicadoSalida
            : detailsRadicado?.idRadicado || detailsComunicacion?.idRadicado }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
          <p>{{ detailsRadicado?.tipoTramite?.nombre || detailsRadicado?.tipoComunicacion?.nombre }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre Afectado</p>
          <p class="break-all">{{ status && status.toLowerCase() === "aprobado"
            ? detailsRadicado?.datosSalida?.nombreAfectado || ''
            : detailsRadicado?.afectado?.nombre || detailsComunicacion?.datosGenerales?.nombreAfectado }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
          <p class="break-all">{{ detailsRadicado?.usuarioCreador?.fullname }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de Radicación</p>
          <p>{{ formateFechaDEradicado }}</p>
        </div>
        <!-- <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de vencimiento</p>
          <p>{{ formateFechaVencimiento }}</p>
        </div> -->
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Tipo de comunicación
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Número de radicado</p>
          <p>{{ detailsRadicado?.idRadicado }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Canal de recepción</p>
          <p>Ventanilla</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de trámite</p>
          <p>{{ (detailsRadicado && detailsRadicado?.tipoTramite && detailsRadicado.tipoTramite.nombre) ?
            detailsRadicado?.tipoTramite.nombre : detailsComunicacion?.tipoComunicacion?.nombre }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Remitente
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de documento</p>
          <p>{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.tipoDocumento) ?
            detailsRadicado.remitente.tipoDocumento.nombre : '' }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de documento</p>
          <p>{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.numeroDocumento) ?
            detailsRadicado.remitente.numeroDocumento : '' }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre</p>
          <p class="break-all">{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.nombre) ?
            detailsRadicado.remitente.nombre : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Número radicado de la entidad</p>
          <p> {{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.numeroRadicadoEntidad) ?
            detailsRadicado.remitente.numeroRadicadoEntidad : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Número de factura</p>
          <p> {{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.nroFactura) ?
            detailsRadicado.remitente.nroFactura : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">País</p>
          <p> {{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.pais &&
            detailsRadicado.remitente.pais.nombre) ? detailsRadicado.remitente.pais.nombre : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
          <p> {{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.departamento &&
            detailsRadicado.remitente.departamento.nombre) ? detailsRadicado.remitente.departamento.nombre : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
          <p> {{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.municipio &&
            detailsRadicado.remitente.municipio.nombre) ? detailsRadicado.remitente.municipio.nombre : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Dirección</p>
          <p> {{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.direccion) ?
            detailsRadicado.remitente.direccion : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Correo electrónico</p>
           <p class="break-all">{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.correo) ?
            detailsRadicado.remitente.correo : '' }}</p>
        </div>
        <div v-if="isRevisor || isAprobador">
          <p class="tw-font-bold tw-text-gray-dark">Teléfono</p>
          <p> {{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.telefono) ?
            detailsRadicado.remitente.telefono : '' }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Afectado
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de documento</p>
          <p>{{ status && status.toLowerCase() === "aprobado"
            ? detailsRadicado?.datosSalida?.tipoDocumentoAfectado?.nombre || ''
            : detailsRadicado?.afectado?.tipoDocumento?.nombre ||
            detailsComunicacion?.datosGenerales?.tipoDocumentoAfectado?.nombre }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de documento</p>
          <p>{{ status && status.toLowerCase() === "aprobado"
            ? detailsRadicado?.datosSalida?.numeroDocumentoAfectado || ''
            : detailsRadicado?.afectado?.numeroDocumento || detailsComunicacion?.datosGenerales?.numeroDocumentoAfectado
            }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre</p>
          <p class="break-all">{{ status && status.toLowerCase() === "aprobado"
            ? detailsRadicado?.datosSalida?.nombreAfectado || ''
            : detailsRadicado?.afectado?.nombre || detailsComunicacion?.datosGenerales?.nombreAfectado }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Medios de contacto y envío de respuesta
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Correo electrónico</p>
          <p class="break-all">{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.correo) ?
            detailsRadicado.remitente.correo : detailsComunicacion?.datosSalida?.correoDestinatario }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Teléfono fijo</p>
          <p>{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.telefono) ?
            detailsRadicado.remitente.telefono : detailsComunicacion?.datosSalida?.telefonoDestinatario }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">País</p>
          <p>{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.pais) ?
            detailsRadicado.remitente.pais.nombre : detailsComunicacion?.datosSalida?.pais?.nombre }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
          <p>{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.departamento) ?
            detailsRadicado.remitente.departamento.nombre : '' }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
          <p>{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.municipio) ?
            detailsRadicado.remitente.municipio.nombre : '' }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Dirección</p>
          <p class="break-all">{{ (detailsRadicado && detailsRadicado.remitente && detailsRadicado.remitente.direccion) ?
            detailsRadicado.remitente.direccion : detailsComunicacion?.datosSalida?.direccionDestinatario }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item v-if="status && status.toLowerCase() === 'aprobado'" default-opened dense expand-separator
      class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Copias
        </h3>
      </template>
      <q-card class="tw-pb-5 tw-mx-4 tw-mb-4" flat>
        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h4 class="text-bold tw-w-100 tw-text-l tw-flex-1 q-py-md">
            Interna
          </h4>
        </div>
        <div v-if="detailsAsignaciones.copiaInterna && detailsAsignaciones.copiaInterna.length > 0"
          v-for="(copy, index) in detailsAsignaciones.copiaInterna" :key="index"
          class="tw-grid tw-grid-cols-4 tw-gap-4 tw-mb-4">
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Nombre</p>
             <p class="break-all">{{ copy?.correspondenciaFuncionario?.firstname ? copy.correspondenciaFuncionario.firstname + ' ' +
              copy.correspondenciaFuncionario.lastname : ''}}</p>
          </div>
          <div v-if="[1, 2].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Correo electrónico</p>
             <p class="break-all">{{ copy?.correspondenciaFuncionario?.email ? copy.correspondenciaFuncionario.email : '' }}</p>
          </div>
          <div v-if="[3, 4, 5].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Teléfono</p>
            <p>{{ copy?.correspondenciaFuncionario?.celular ? copy.correspondenciaFuncionario.celular : '' }}</p>
          </div>
          <div v-if="[3, 4, 5].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
            <p>{{ copy?.correspondenciaFuncionario?.departamento ? copy.correspondenciaFuncionario.departamento.nombre :
              ''}}</p>
          </div>
          <div v-if="[3, 4, 5].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
            <p>{{ copy?.correspondenciaFuncionario?.municipio ? copy.correspondenciaFuncionario.municipio.nombre : '' }}
            </p>
          </div>
        </div>
        <div v-else class="tw-pb-4 tw-px-4 tx-flex tw-justify-center">
          <p class="tw-font-bold tw-text-gray-dark text-center">No existen copias registradas</p>
        </div>
        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h4 class="text-bold tw-w-100 tw-text-l tw-flex-1 q-py-md">
            Externa
          </h4>
        </div>
        <div v-if="detailsAsignaciones.copiaExterna && detailsAsignaciones.copiaExterna.length > 0"
          v-for="(copy, index) in detailsAsignaciones.copiaExterna" :key="index"
          class="tw-grid tw-grid-cols-4 tw-gap-4">
          <div>
            <p class="tw-font-bold tw-text-gray-dark">Nombre</p>
            <p class="break-all">{{ copy?.nombreDestinatario ? copy.nombreDestinatario : '' }}</p>
          </div>
          <div v-if="[1, 2].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Correo electrónico</p>
             <p class="break-all">{{ copy?.correoElectronico ? copy.correoElectronico : '' }}</p>
          </div>
          <div v-if="[3, 4, 5].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Teléfono</p>
            <p>{{ copy?.telefonoDestinatario ? copy.telefonoDestinatario : '' }}</p>
          </div>
          <div v-if="[3, 4, 5].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
            <p>{{ copy?.departamentoDestinatario ? copy.departamentoDestinatario.nombre : '' }}</p>
          </div>
          <div v-if="[3, 4, 5].includes(detailsRadicado.datosSalida.formaEnvio.id)">
            <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
            <p>{{ copy?.municipioDestinatario ? copy.municipioDestinatario.nombre : '' }}</p>
          </div>
        </div>
        <div v-else class="tw-pb-4 tw-px-4 tx-flex tw-justify-center">
          <p class="tw-font-bold tw-text-gray-dark text-center">No existen copias registradas</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px"
      v-if="true">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Documentos
        </h3>
      </template>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documentos de Entrada
          </h5>
          <div class="column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-card class="row items-center tw-gap-x-2 q-px-md q-py-sm tw-w-fit" flat bordered :key="doc.id"
              v-for="doc in sortedListDocs2">
              <img style="width: 26px" v-lazy :data-url="validateFormat(obtenerExtension(doc.nombre))" />
              <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
              <q-icon v-if="doc.nombre.toLowerCase().substring(doc.nombre.length - 4, doc.nombre.length) === '.pdf'"
                size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="error_outline"
                @click="visualize(doc.nodeId, listDocs2.filter(it => obtenerExtension(it.nombre).toLowerCase() === 'pdf'))" />
              <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download"
                @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)" />
            </q-card>
          </div>
        </div>

        <div v-if="isDevolucion || isPublicador || props.detailsRadicado?.estadoProceso?.estado === 'Aprobado'"
          class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documentos de Salida
          </h5>
          <div class="column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-card class="row items-center tw-gap-x-2 q-px-md q-py-sm tw-w-fit" flat bordered :key="doc.id"
              v-for="doc in listDocs">
              <img style="width: 26px" v-lazy :data-url="validateFormat(obtenerExtension(doc.nombre))" />
              <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
              <q-icon v-if="doc.nombre.toLowerCase().substring(doc.nombre.length - 4, doc.nombre.length) === '.pdf'"
                size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="error_outline"
                @click="visualize(doc.nodeId, listDocs3.filter(it => ['pdf', 'application/pdf'].includes(obtenerExtension(it.nombre).toLowerCase())))" />
              <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download"
                @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)" />
            </q-card>
          </div>
        </div>

        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documentos de Gestión
          </h5>
          <div class="column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-card class="row items-center tw-gap-x-2 q-px-md q-py-sm tw-w-fit" flat bordered :key="doc.id"
              v-for="doc in listDocs3">
              <img style="width: 26px" v-lazy :data-url="validateFormat(obtenerExtension(doc.nombre))" />
              <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
              <q-icon v-if="doc.nombre.toLowerCase().substring(doc.nombre.length - 4, doc.nombre.length) === '.pdf'"
                size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="error_outline"
                @click="visualize(doc.nodeId, listDocs3.filter(it => ['pdf', 'application/pdf'].includes(obtenerExtension(it.nombre).toLowerCase())))" />
              <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download"
                @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)" />
            </q-card>
          </div>
        </div>
      </q-card>
    </q-expansion-item>
  </div>

  <!-- Editar Data -->
  <div v-show="isEdit">
    <q-expansion-item v-if="!isRevisor && !isAprobador" default-opened dense expand-separator
      class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Información general
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de Radicado</p>
          <p>{{ isRadicadoSalida ? detailsRadicado?.radicadoSalida : detailsRadicado?.idRadicado }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
          <p>{{ detailsRadicado?.tipoTramite?.nombre }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre Afectado</p>
          <p class="break-all">{{ detailsRadicado?.afectado?.nombre || '' }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
          <p>{{ detailsRadicado?.usuarioCreador?.fullname }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de Radicación</p>
          <p>{{ formateFechaDEradicado }}</p>
        </div>
        <!-- <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de vencimiento</p>
          <p>{{ formateFechaVencimiento }}</p>
        </div> -->
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Tipo de comunicación
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Canal de recepción</p>
          <q-input v-model="form.canal" label="Inserte" outlined class="mb-3" :rules="[inputRequired]" dense />
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de trámite</p>
          <q-select v-model="form.tipoTramite" label="Seleccione" outlined map-options emit-value class="mb-3"
            :options="[]" :rules="[inputRequired]" dense />
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Remitente
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de documento del remitente</p>
          <q-select v-model="form.tipoDocumentoRemi" label="Seleccione" outlined map-options emit-value class="mb-3"
            :options="[]" :rules="[inputRequired]" dense />
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de documento del remitente</p>
          <q-input v-model="form.numRemi" label="Inserte" outlined class="mb-3" :rules="[inputRequired]" dense />
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre del remitente</p>
          <q-input v-model="form.nameRemi" label="Inserte" outlined class="mb-3" :rules="[inputRequired]" dense />
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Afectado
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de documento del afectado</p>
          <q-select v-model="form.tipoDocumentoAfec" label="Seleccione" outlined map-options emit-value class="mb-3"
            :options="[]" :rules="[inputRequired]" dense />
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de documento del afectado</p>
          <q-input v-model="form.numAfectado" label="Inserte" outlined class="mb-3" :rules="[inputRequired]" dense />
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre del afectado</p>
          <q-input v-model="form.nameAfectado" label="Inserte" outlined class="mb-3" :rules="[inputRequired]" dense />
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Medios de contacto y envío de respuesta
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Correo electrónico del afectado</p>
          <q-input v-model="form.emailAfectado" label="Inserte" outlined class="mb-3"
            :rules="[inputRequired, validationEmail, v => maxLengthInput(200, v)]" dense />
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Teléfono fijo</p>
          <q-input v-model="form.telefono" label="Inserte" outlined class="mb-3"
            :rules="[onlyNumbers, v => maxLengthInput(10, v), v => minLengthInput(7, v)]" dense />
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">País</p>
          <q-select v-model="form.pais" map-options outlined dense use-input hide-selected fill-input input-debounce="0"
            label="Inserte" :options="paisList" @filter="filterPais" :rules="[inputRequired]">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Departamento</p>
          <q-select v-model="form.dep" map-options outlined dense use-input hide-selected fill-input input-debounce="0"
            label="Inserte" :options="departmentsList" @filter="filterDep" :rules="[inputRequired]"
            :disable="isntColombia">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Municipio</p>
          <q-select v-model="form.muni" emit-value map-options outlined dense use-input hide-selected fill-input
            input-debounce="0" label="Inserte" :options="muniList" @filter="filterMuni" :rules="[inputRequired]"
            :disable="isntColombia">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sin resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Dirección del afectado</p>
          <q-input v-model="form.direccionAfectado" label="Inserte" outlined class="mb-3" :rules="[inputRequired]"
            dense />
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md q-pb-md"
      style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Documentos
        </h3>
      </template>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>

        <div v-if="isDevolucion || isPublicador || status === 'Aprobado'"
          class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documentos de Salida
          </h5>
          <div class="column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-card class="row items-center tw-gap-x-2 q-px-md q-py-sm tw-w-fit" flat bordered :key="doc.id"
              v-for="doc in listDocs">
              <img style="width: 26px" v-lazy :data-url="validateFormat(obtenerExtension(doc.nombre))" />
              <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
              <q-icon v-if="doc.nombre.toLowerCase().substring(doc.nombre.length - 4, doc.nombre.length) === '.pdf'"
                size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="error_outline"
                @click="visualize(doc.nodeId, listDocs3.filter(it => ['pdf', 'application/pdf'].includes(obtenerExtension(it.nombre).toLowerCase())))" />
              <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download"
                @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)" />
            </q-card>
          </div>
        </div>

        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documentos de Gestión
          </h5>
          <div class="column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-card class="row items-center tw-gap-x-2 q-px-md q-py-sm tw-w-fit" flat bordered :key="doc.id"
              v-for="doc in listDocs3">
              <img style="width: 26px" v-lazy :data-url="validateFormat(obtenerExtension(doc.nombre))" />
              <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
              <q-icon v-if="doc.nombre.toLowerCase().substring(doc.nombre.length - 4, doc.nombre.length) === '.pdf'"
                size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="error_outline"
                @click="visualize(doc.nodeId, listDocs3.filter(it => ['pdf', 'application/pdf'].includes(obtenerExtension(it.nombre).toLowerCase())))" />
              <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download"
                @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)" />
            </q-card>
          </div>
        </div>
        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documentos Adjuntos
          </h5>
          <div class="column q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-card class="row items-center tw-gap-x-2 q-px-md q-py-sm tw-w-fit" flat bordered :key="doc.id"
              v-for="doc in listDocs2">
              <img style="width: 26px" v-lazy :data-url="validateFormat(obtenerExtension(doc.nombre))" />
              <p class="tw-text-sm tw-font-semibold">{{ doc.nombre }}</p>
              <q-icon v-if="doc.nombre.toLowerCase().substring(doc.nombre.length - 4, doc.nombre.length) === '.pdf'"
                size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="error_outline"
                @click="visualize(doc.nodeId, listDocs2.filter(it => obtenerExtension(it.nombre).toLowerCase() === 'pdf'))" />
              <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download"
                @click="() => handleOpenDocFile(doc.nodeId, doc.nombre)" />
            </q-card>
          </div>
        </div>
      </q-card>
    </q-expansion-item>
  </div>

  <div v-if="isEdit" class="col row justify-center q-gutter-x-md q-my-md">
    <q-btn color="accent" textColor="secondary" label="Cancelar" style="
        width: 130px;
        height: 40px;
        border-radius: 8px;
        font-size: 16px;
      " no-caps @click="cancelModal = true" />

    <q-btn color="primary" label="Guardar" style="
        width: 130px;
        height: 40px;
        border-radius: 8px;
        font-size: 16px;
      " @click="submit" :loading="handleSubmitIsLoading" />
  </div>

  <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Aceptar" cancel-button
    text="¿Estás seguro de cancelar el proceso?" @close-modal="cancelModal = false" @handleAccept="isEdit = false"
    type="button" />
</template>

<script lang="ts" setup>
import moment from "moment";
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
// @ts-ignore
import excelIcon from "src/assets/excel.svg";
// @ts-ignore
import docxIcon from 'src/assets/word.svg';
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
import { computed, onMounted, Ref, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import Modal from "src/components/Modal/Modal.vue"; import { inputRequired, maxLengthInput, minLengthInput, onlyNumbers, validationEmail } from "src/helpers/validations";
import { SelectInput } from "src/interfaces";
import { useCountries2, useDepartments, useMunicipalities } from "src/composables/useVersion";

const auth = useAuthStore()
const emit = defineEmits(['valid'])
const props = withDefaults(defineProps<{
  listDocs: any[],
  listDocs2: any[],
  listDocs3: any[],
  download: (id: any) => Promise<void>,
  visualize: (nodeId, listDoc) => {},
  detailsRadicado: any,
  detailsComunicacion: any,
  detailsAsignaciones: any,
  tiempoVencer: string,
  isAprobador: boolean,
  isRevisor: boolean,
  isDevolucion: boolean,
  status: string,
  colaborador: any[]
}>(), {
  status: ""
})

// console.log(props.listDocs,props.listDocs2, props.listDocs3, '+++++' );


const isntColombia = ref<boolean>(false)

const paisList: Ref<SelectInput[]> = ref([])
const opsCoutry: Ref<SelectInput[]> = ref([])

const departmentsList: Ref<SelectInput[]> = ref([])
const opsDep: Ref<SelectInput[]> = ref([])

const muniList: Ref<SelectInput[]> = ref([])
const opsMuni: Ref<SelectInput[]> = ref([])

const form = ref({
  tipoRemitente: '',
  canal: '',
  tipoTramite: '',
  tipoDocumentoRemi: '',
  numRemi: '',
  nameRemi: '',
  tipoDocumentoAfec: '',
  numAfectado: '',
  nameAfectado: '',
  emailAfectado: '',
  telefono: '',
  pais: { label: '', value: null },
  dep: { label: '', value: null },
  muni: { label: '', value: null },
  direccionAfectado: ''
})

const formateFechaVencimiento = computed(() => moment(props.tiempoVencer).format('DD/MM/YYYY HH:mm'))
const formateFechaDEradicado = computed(() => moment(props.detailsRadicado?.fechaRadicacion).format('DD/MM/YYYY HH:mm'))
const isPublicador = computed(() => auth.$state.userInfo.role === "Publicador")
const isRadicadoSalida = computed(() => ["Devolucion", "Publicacion rechazada", "Por Publicar"].includes(props.detailsRadicado?.estadoProceso?.estado))
const isEdit = ref<boolean>(false)
const cancelModal = ref<boolean>(false)
const handleSubmitIsLoading = ref<boolean>(false)

const validateFormat = (formato) => {
  if (['pdf', 'application/pdf'].includes(formato.toLowerCase())) return PDFIcon
  if (['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(formato.toLowerCase())) return excelIcon
  if (['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(formato.toLowerCase())) return docxIcon
  if (['jpeg', 'jpg', 'png', 'webp'].includes(formato.toLowerCase())) return img
  if (['mp3'].includes(formato.toLowerCase())) return music
  if (['avi', 'mp4'].includes(formato.toLowerCase())) return video
  if (['txt', 'bmp'].includes(formato.toLowerCase())) return txt
  if (['xml'].includes(formato.toLowerCase())) return xml
  if (['zip', 'rar'].includes(formato.toLowerCase())) return zip
  if (['ppt', 'pptx'].includes(formato.toLowerCase())) return ppt
  if (['msg', 'eml'].includes(formato.toLowerCase())) return msg
  return interrogation;
}

const sortedListDocs2 = computed(() => {
  if (!Array.isArray(props.listDocs2)) {
    return [];
  }

  return [...props.listDocs2].sort((a, b) => {
    const nameA = a.nombre || '';
    const nameB = b.nombre || '';

    let priorityA = 3;
    if (nameA.startsWith('ENT')) priorityA = 1;
    else if (nameA.startsWith('SAL')) priorityA = 2;

    let priorityB = 3;
    if (nameB.startsWith('ENT')) priorityB = 1;
    else if (nameB.startsWith('SAL')) priorityB = 2;

    return priorityA - priorityB;
  });
});

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

const submit = async () => {
  handleSubmitIsLoading.value = true

  isEdit.value = false
  handleSubmitIsLoading.value = false

}

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

const filterPais = (val, update) => {
  if (val === '') {
    update(() => {
      paisList.value = opsCoutry.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    paisList.value = opsCoutry.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterDep = (val, update) => {
  if (val === '') {
    update(() => {
      departmentsList.value = opsDep.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    departmentsList.value = opsDep.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}

const filterMuni = (val, update) => {
  if (val === '') {
    update(() => {
      muniList.value = opsMuni.value
    })
    return
  }

  const needle = normalizeString(val);
  update(() => {
    muniList.value = opsMuni.value.filter(v => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
}


onMounted(async () => {
  const { optionsCountries } = await useCountries2();
  opsCoutry.value = optionsCountries.value
})

watch(
  () => props.detailsRadicado,
  (value) => {

    form.value = {
      tipoRemitente: '',
      canal: 'Ventanilla',
      tipoTramite: props.detailsRadicado?.tipoTramite?.nombre,
      tipoDocumentoRemi: '',
      numRemi: '',
      nameRemi: '',
      tipoDocumentoAfec: '',
      numAfectado: '',
      nameAfectado: '',
      emailAfectado: '',
      telefono: '',
      pais: { label: props.detailsRadicado?.remitente?.pais?.nombre, value: props.detailsRadicado?.remitente?.pais?.idPais },
      dep: { label: props.detailsRadicado.remitente?.departamento?.nombre, value: props.detailsRadicado.remitente?.departamento?.idDepartamento },
      muni: { label: props.detailsRadicado.remitente?.municipio?.nombre, value: props.detailsRadicado.remitente?.municipio?.idMunicipio },
      direccionAfectado: ''
    }
  }
);

watch(
  () => form.value.pais,
  async (value, oldValue) => {
    //@ts-ignore
    let val = value.label as unknown as string

    if (val == 'Colombia') {
      isntColombia.value = false
      const { optionsDepartments } = await useDepartments(value.value);
      opsDep.value = optionsDepartments.value;
    } else {
      // @ts-ignore
      form.value.dep = { label: val, value: null }
      // @ts-ignore
      form.value.muni = { label: val, value: null }
      isntColombia.value = true
    }
  }
);

watch(
  () => form.value.dep,
  async (value) => {
    if (!isntColombia.value && props.detailsRadicado.remitente?.departamento?.nombre !== value.label) {
      form.value.muni = { label: '', value: null }
    }

    if (value.value) {
      const { optionsMunicipalities } = await useMunicipalities(value.value);
      opsMuni.value = optionsMunicipalities.value;
    }
  }
);

</script>

<style scoped>
.break-all {
  word-break: break-all;
  overflow-wrap: break-word;
}
</style>
