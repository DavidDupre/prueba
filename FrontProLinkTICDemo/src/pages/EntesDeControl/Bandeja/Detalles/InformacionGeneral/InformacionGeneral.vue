<template>
  <template v-if="!isEdit">
    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Información General
        </h3>
<!--        <div class="flex tw-items-center tw-mr-5">-->
<!--          <q-btn v-if="auth.$state.userInfo.role == 'Asignador Responsable'" icon="edit" color="secondary" label="Editar" dense @click="isEdit = true" />-->
<!--        </div>-->
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de Radicado</p>
          <p>{{ props.informacionGeneral?.nroRadicado }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.tipoSolicitud }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Afectado</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.nombresAfectado }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
          <p>{{ props.informacionGeneral?.informacionGeneral?.colaborador }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de Radicación</p>
          <p>{{ props.informacionGeneral?.fechaRadicacion }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tiempo por Vencer</p>
          <p>{{ props.informacionGeneral?.tiempoPorVencer }}</p>
        </div>

        <!-- <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de Vencimiento</p>
          <p>{{ props.informacionGeneral?.informacionGeneral?.fechaVencimiento || '-' }}</p>
        </div> -->
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Remitente</h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Remitente</p>
          <p>{{ props.informacionGeneral?.informacionRemitente?.tipoRemitente }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Tipo de Documento del Remitente
          </p>
          <p>
            {{ props.informacionGeneral?.informacionRemitente?.tipoDocumentoRemitente }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Número de Documento del Remitente
          </p>
          <p>
            {{
            props.informacionGeneral?.informacionRemitente?.numeroDocumentoremitente
            }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre del Remitente</p>
          <p>{{ props.informacionGeneral?.informacionRemitente?.nombreRemitente }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Afectado</h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Tipo de Documento del Afectado
          </p>
          <p>
            {{ props.informacionGeneral?.informacionAfectado?.tipoDocumentoAfectado }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Número de Documento del Afectado
          </p>
          <p>
            {{ props.informacionGeneral?.informacionAfectado?.numeroDocumentoAfectado }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre del Afectado</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.nombresAfectado }}</p>
        </div>
        <div v-if="!isNitDocumentoAfectado">
          <p class="tw-font-bold tw-text-gray-dark">
            ¿Pertenece a la Comunidad LGBTIQ+?
          </p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.perteneceLGBT }}</p>
        </div>
        <div v-if="!isNitDocumentoAfectado">
          <p class="tw-font-bold tw-text-gray-dark">Sexo</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.sexo }}</p>
        </div>
        <div v-if="!isNitDocumentoAfectado">
          <p class="tw-font-bold tw-text-gray-dark">Condición Especial</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.condicionEspecial }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Medios de Contacto y Respuesta
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div class="tw-max-w-full tw-break-words">
          <p class="tw-font-bold tw-text-gray-dark">Correo Electrónico</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.email }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Teléfono Celular</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.telefonoCelular }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Teléfono Fijo</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.telefonoFijo }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">País de Contacto</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.paisContacto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Departamento de Contacto</p>
          <p>
            {{ props.informacionGeneral?.informacionContacto?.departamentoContacto }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Ciudad de Contacto</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.municipioContacto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Dirección de Contacto</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.direccionContacto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Medio por el que desea Recibir Respuesta
          </p>
          <p>{{ props.informacionGeneral?.informacionContacto?.medioRepuesta }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-1 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.tipoSolicitud }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Detalle</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.detalle }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Producto</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.producto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Observación</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.observaciones }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Información Adicional
        </h3>
      </template>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documento de Soporte
          </h5>
          <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-list separator>
              <q-card v-for="doc in entradaFiles" :key="doc.id" class="flex row items-center tw-gap-x-2 q-px-md tw-py-1" flat bordered>

                    <img style="width: 26px" v-lazy :data-url="validateFormat(doc.nombreArchivo)">
                  <p class="tw-text-xs tw-font-semibold">{{ doc.nombreArchivo }}</p>

                  <div class="tw-flex tw-gap-1">
                    <button @click="() => visualizeFile(doc.nodeId)" class="tw-inline">
                      <q-icon size="20px" class="tw-text-black" name="error" />
                    </button>
                    <button @click="() => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)" class="tw-online">
                      <q-icon size="20px" class="tw-text-black" name="file_download" />
                    </button>
                  </div>
              </q-card>
            </q-list>
          </div>
          <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
            <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
              Documentos Adjuntos
            </h5>
            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-list separator>
                <q-card v-for="doc in adjuntoFiles" :key="doc.id" class="flex row items-center tw-gap-x-2 q-px-md tw-py-1" flat bordered>
                      <img style="width: 26px" v-lazy :data-url="validateFormat(doc.nombreArchivo)">
                    <p class="tw-text-sm tw-font-semibold">{{ doc.nombreArchivo }}</p>
                    <div class="tw-flex tw-gap-1">
                      <button @click="() => visualizeFile(doc.nodeId)" class="tw-inline"
                        v-if="doc.nombreArchivo.toLowerCase().includes('.pdf')">
                        <q-icon size="20px" class="tw-text-black" name="error" />
                      </button>
                      <button @click="() => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)" class="tw-online">
                        <q-icon size="20px" class="tw-text-black" name="file_download" />
                      </button>
                    </div>
                </q-card>
              </q-list>
            </div>
          </div>

          <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
            <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
              Documento de Salida
            </h5>
            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-list separator>
                <q-card v-for="doc in salidaFiles" :key="doc.id" class="flex row items-center tw-gap-x-2 q-px-md tw-py-1" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="validateFormat(doc.nombreArchivo)">
                  <p class="tw-text-sm tw-font-semibold">{{ doc.nombreArchivo }}</p>
                  <div class="tw-flex tw-gap-1">
                    <button @click="() => visualizeFile(doc.nodeId)" class="tw-inline"
                            v-if="doc.nombreArchivo.toLowerCase().includes('.pdf')">
                      <q-icon size="20px" class="tw-text-black" name="error" />
                    </button>
                    <button @click="() => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)" class="tw-online">
                      <q-icon size="20px" class="tw-text-black" name="file_download" />
                    </button>
                  </div>
                </q-card>
              </q-list>
            </div>
          </div>
        </div>
      </q-card>
    </q-expansion-item>
  </template>

    <!-- Editar Data -->
  <template v-else>
    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Información General
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Número de Radicado</p>
          <p>{{ props.informacionGeneral?.nroRadicado }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.tipoSolicitud }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Afectado</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.nombresAfectado }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Colaborador</p>
          <p>{{ props.informacionGeneral?.informacionGeneral?.colaborador }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de Radicación</p>
          <p>{{ props.informacionGeneral?.fechaRadicacion }}</p>
        </div>

        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tiempo por Vencer</p>
          <p>{{ props.informacionGeneral?.tiempoPorVencer }}</p>
        </div>

        <!-- <div>
          <p class="tw-font-bold tw-text-gray-dark">Fecha de Vencimiento</p>
          <p>{{ props.informacionGeneral?.informacionGeneral?.fechaVencimiento || '-' }}</p>
        </div> -->
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Remitente</h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Remitente</p>
          <p>{{ props.informacionGeneral?.informacionRemitente?.tipoRemitente }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Tipo de Documento del Remitente
          </p>
          <p>
            {{ props.informacionGeneral?.informacionRemitente?.tipoDocumentoRemitente }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Número de Documento del Remitente
          </p>
          <p>
            {{
            props.informacionGeneral?.informacionRemitente?.numeroDocumentoremitente
            }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre del Remitente</p>
          <p>{{ props.informacionGeneral?.informacionRemitente?.nombreRemitente }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Afectado</h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Tipo de Documento del Afectado
          </p>
          <p>
            {{ props.informacionGeneral?.informacionAfectado?.tipoDocumentoAfectado }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Número de Documento del Afectado
          </p>
          <p>
            {{ props.informacionGeneral?.informacionAfectado?.numeroDocumentoAfectado }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Nombre del Afectado</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.nombresAfectado }}</p>
        </div>
        <div v-if="!isNitDocumentoAfectado">
          <p class="tw-font-bold tw-text-gray-dark">
            ¿Pertenece a la Comunidad LGBTIQ+?
          </p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.perteneceLGBT }}</p>
        </div>
        <div v-if="!isNitDocumentoAfectado">
          <p class="tw-font-bold tw-text-gray-dark">Sexo</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.sexo }}</p>
        </div>
        <div v-if="!isNitDocumentoAfectado">
          <p class="tw-font-bold tw-text-gray-dark">Condición Especial</p>
          <p>{{ props.informacionGeneral?.informacionAfectado?.condicionEspecial }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Medios de Contacto y Respuesta
        </h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-4 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div class="tw-max-w-full tw-break-words">
          <p class="tw-font-bold tw-text-gray-dark">Correo Electrónico</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.email }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Teléfono Celular</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.telefonoCelular }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Teléfono Fijo</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.telefonoFijo }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">País de Contacto</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.paisContacto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Departamento de Contacto</p>
          <p>
            {{ props.informacionGeneral?.informacionContacto?.departamentoContacto }}
          </p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Ciudad de Contacto</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.municipioContacto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Dirección de Contacto</p>
          <p>{{ props.informacionGeneral?.informacionContacto?.direccionContacto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">
            Medio por el que desea Recibir Respuesta
          </p>
          <p>{{ props.informacionGeneral?.informacionContacto?.medioRepuesta }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Solicitud</h3>
      </template>
      <q-card class="tw-grid tw-grid-cols-1 tw-gap-4 tw-pb-5 tw-mx-4" style="box-shadow: none">
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Tipo de Solicitud</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.tipoSolicitud }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Detalle</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.detalle }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Producto</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.producto }}</p>
        </div>
        <div>
          <p class="tw-font-bold tw-text-gray-dark">Observación</p>
          <p>{{ props.informacionGeneral?.informacionSolicitud?.observaciones }}</p>
        </div>
      </q-card>
    </q-expansion-item>

    <q-expansion-item default-opened dense expand-separator class="tw-bg-white q-mt-md" style="border-radius: 5px">
      <template v-slot:header>
        <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">
          Información Adicional
        </h3>
      </template>
      <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
        <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
          <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
            Documento de Soporte
          </h5>
          <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
            <q-list separator>
              <q-card v-for="doc in entradaFiles" :key="doc.id" class="flex row items-center tw-gap-x-2 q-px-md tw-py-1" flat bordered>

                    <img style="width: 26px" v-lazy :data-url="validateFormat(doc.nombreArchivo)">
                  <p class="tw-text-xs tw-font-semibold">{{ doc.nombreArchivo }}</p>

                  <div class="tw-flex tw-gap-1">
                    <button @click="() => visualizeFile(doc.nodeId)" class="tw-inline">
                      <q-icon size="20px" class="tw-text-black" name="error" />
                    </button>
                    <button @click="() => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)" class="tw-online">
                      <q-icon size="20px" class="tw-text-black" name="file_download" />
                    </button>
                  </div>
              </q-card>
            </q-list>
          </div>
          <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
            <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
              Documentos Adjuntos
            </h5>
            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-list separator>
                <q-card v-for="doc in adjuntoFiles" :key="doc.id" class="flex row items-center tw-gap-x-2 q-px-md tw-py-1" flat bordered>
                      <img style="width: 26px" v-lazy :data-url="validateFormat(doc.nombreArchivo)">
                    <p class="tw-text-sm tw-font-semibold">{{ doc.nombreArchivo }}</p>
                    <div class="tw-flex tw-gap-1">
                      <button @click="() => visualizeFile(doc.nodeId)" class="tw-inline"
                        v-if="doc.nombreArchivo.toLowerCase().includes('.pdf')">
                        <q-icon size="20px" class="tw-text-black" name="error" />
                      </button>
                      <button @click="() => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)" class="tw-online">
                        <q-icon size="20px" class="tw-text-black" name="file_download" />
                      </button>
                    </div>
                </q-card>
              </q-list>
            </div>
          </div>
          <div class="tw-col-span-12 tw-flex tw-flex-col tw-justify-between">
            <h5 class="text-bold tw-text-l tw-flex-1 q-py-md">
              Documentos de Salida
            </h5>
            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <q-list separator>
                <q-card v-for="doc in salidaFiles" :key="doc.id" class="flex row items-center tw-gap-x-2 q-px-md tw-py-1" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="validateFormat(doc.nombreArchivo)">
                  <p class="tw-text-sm tw-font-semibold">{{ doc.nombreArchivo }}</p>
                  <div class="tw-flex tw-gap-1">
                    <button @click="() => visualizeFile(doc.nodeId)" class="tw-inline"
                            v-if="doc.nombreArchivo.toLowerCase().includes('.pdf')">
                      <q-icon size="20px" class="tw-text-black" name="error" />
                    </button>
                    <button @click="() => handleOpenDocFile(doc.nodeId, doc.nombreArchivo)" class="tw-online">
                      <q-icon size="20px" class="tw-text-black" name="file_download" />
                    </button>
                  </div>
                </q-card>
              </q-list>
            </div>
          </div>
        </div>
      </q-card>
    </q-expansion-item>
  </template>

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

  <q-dialog v-model="visualizadorPDF" seamless position="right" class="tw-h-full tw-w-full">
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <q-card class="tw-h-full tw-w-[2000px] tw-z-[1000] tw-overflow-hidden">
        <q-card-section>
          <q-btn @click="visualizadorPDF = false"
            class="tw-absolute tw-ml-4 tw-mt-[65px] tw-z-[2000] tw-text-white tw-bg-red-500">Cerrar</q-btn>
          <iframe class="tw-h-[85vh] tw-w-full" :src="iframePdfUrl" frameborder="0"></iframe>
        </q-card-section>

        <q-inner-loading :showing="spinnerFile" label-class="text-teal" label-style="font-size: 1.1em" />
      </q-card>
    </transition>
  </q-dialog>
</template>

<script lang="ts" setup>
import { obtenerExtension } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { computed, onMounted, ref } from "vue";
import { sgdeaAxios } from "src/services";
import { InfoGeneral } from "../types";
import { useRoute } from "vue-router";
// import { useAuthStore } from "src/stores/auth.store";

import Modal from "src/components/Modal/Modal.vue";

const route = useRoute();
const props = defineProps<{ informacionGeneral: InfoGeneral }>();

const entradaFiles = ref([]);
const adjuntoFiles = ref([]);
const salidaFiles = ref([]);
const iframePdfUrl = ref();
const visualizadorPDF = ref(false);
const spinnerFile = ref(false);
// const auth = useAuthStore()
const isEdit = ref<boolean>(false)
const cancelModal = ref<boolean>(false)
const handleSubmitIsLoading = ref<boolean>(false)

const isNitDocumentoAfectado = computed(() => props.informacionGeneral?.informacionAfectado?.tipoDocumentoAfectado === 'Número de identificación tributaria (NIT)');

const validateFormat = (nombreArchivo: string) => {

  const formato = obtenerExtension(nombreArchivo);

  if (['pdf', 'application/pdf'].includes(formato.toLowerCase())) return require('src/assets/pdf.svg');
  if (['xls', 'xlsx', 'csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(formato.toLowerCase())) return require('src/assets/excel.svg');
  if (['docx', 'doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(formato.toLowerCase())) return require('src/assets/word.svg');
  if (['jpeg', 'jpg', 'png', 'webp'].includes(formato.toLowerCase())) return require('src/assets/img.svg');
  if (['mp3'].includes(formato.toLowerCase())) return require('src/assets/music.svg');
  if (['avi', 'mp4'].includes(formato.toLowerCase())) return require('src/assets/video.svg');
  if (['txt', 'bmp'].includes(formato.toLowerCase())) return require('src/assets/txt.svg');
  if (['xml'].includes(formato.toLowerCase())) return require('src/assets/xml.svg');
  if (['zip', 'rar'].includes(formato.toLowerCase())) return require('assets/folder2.svg');
  if (['ppt', 'pptx'].includes(formato.toLowerCase())) return require('assets/powerPoint.svg');
  if (['msg', 'eml'].includes(formato.toLowerCase())) return require('assets/mail.svg');
  return require("src/assets/interrogation.svg");
};

const handleOpenDocFile = (id: string, name: string) => {
  const url = "/radicados/consultar_documento/" + id;
  sgdeaAxios.get(url).then((response) => {
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
  })

};


const getFiles = () => {
  // 1. Primero intenta obtener el ID del localStorage
  const storedId = localStorage.getItem('idDocEntes');
  const enteId = storedId || route.params.id;

  const url = `/api/entes/getDocumentosByEnteControlId/${enteId}`;
  const numeroRadicado = props.informacionGeneral?.nroRadicado;

  sgdeaAxios.get(url).then((response) => {
    const files = response.data.reduce((acc, item) => {
      const isFileType = item.tipoArchivo === "ENTRADA_R";
      const isReplaceFileName = item.nombreArchivo.replace(".pdf", "");

      if (isFileType && isReplaceFileName == numeroRadicado) acc.entradaFilesData = [...acc.entradaFilesData, item];
      if (isFileType && isReplaceFileName != numeroRadicado) acc.adjuntoFilesData = [...acc.adjuntoFilesData, item];
      if (!isFileType && isReplaceFileName != numeroRadicado) acc.salidaFilesData = [...acc.salidaFilesData, item];
      return acc;
    },
      { entradaFilesData: [], adjuntoFilesData: [], salidaFilesData: [] }
    );

    entradaFiles.value = files.entradaFilesData;
    adjuntoFiles.value = files.adjuntoFilesData;
    salidaFiles.value = files.salidaFilesData;
  });
};

const visualizeFile = async (nodeID: string) => {
  spinnerFile.value = true;
  visualizadorPDF.value = true;

  const url = `/radicados/consultar_documento/${nodeID}`;
  const { data } = await sgdeaAxios.get<any>(url);

  const byteCharacters = atob(data.base64x);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });

  iframePdfUrl.value = URL.createObjectURL(blob);
  spinnerFile.value = false;
};

const submit = async() => {
  handleSubmitIsLoading.value = true
  isEdit.value = false
  handleSubmitIsLoading.value = false
}

onMounted(() => {
  setTimeout(() => getFiles(), 8000);
});
</script>
