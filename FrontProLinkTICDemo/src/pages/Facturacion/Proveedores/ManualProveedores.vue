<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Administración Proveedores</h1>
      </div>

      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <q-expansion-item expand-separator id="facturacion-manual" default-opened>
             <template v-slot:header>
            <div class="col row tw-justify-between tw-items-center">
              <p class="tw-text-2xl tw-font-bold">
                Editar / Crear Proveedores
              </p>
              <router-link to="/facturacion/manual-proveedores/crear" class="tw-no-underline">
                <q-btn
                  color="primary"
                  label="Crear"
                  icon="add"
                />
              </router-link>
            </div>
          </template>
          <q-form @submit.prevent="searchProveedor" class="tw-mt-2">
            <label>
              <span class="tw-text-[#6B737C] tw-font-bold">NIT / Número de Documento</span>
              <q-input v-model="searchInput" type="search" mask="\N\I\T###############"
                :rules="[inputRequired, alphanumeric]" outlined placeholder="Inserte" class="tw-rounded-lg tw-mt-2">
                <template v-slot:prepend> <q-icon name="search" /> </template>
              </q-input>
            </label>

            <div class="tw-flex tw-justify-center tw-items-center">
              <q-btn color="secondary" label="Buscar"
                style="width: 130px; height: 40px; border-radius: 8px; font-size: 16px;" type="submit" />
            </div>
          </q-form>
        </q-expansion-item>
      </q-card>

      <template v-if="proveedorStatus === 'found'">
        <q-form ref="formValidate" greedy>
          <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <q-expansion-item expand-separator id="facturacion-manual-crear-adquiriente" default-opened>
                <template v-slot:header>
                  <div class="col row">
                    <p class="tw-text-2xl tw-font-bold">Información proveedor</p>
                  </div>
                </template>

                <div class="tw-mt-2">
                  <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de persona *</label>
                        <q-select v-model="formInfo.tipoPersonaId" input-debounce="0" map-options
                          label="Seleccione" :options="opTipoPersona" dense outlined
                          class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de régimen *</label>
                        <q-select v-model="formInfo.tipoRegimenId"
                          :options="opTipoRegimen" :rules="[inputRequired]"
                          input-debounce="0" map-options emit-value label="Seleccione" dense outlined class="tw-rounded-lg">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tipo de documento *</label>
                        <q-select v-model="formInfo.tipoDocumento" input-debounce="0" :options="['NIT']" label="Seleccione"
                          dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Numero de documento *</label>
                        <q-input v-model="formInfo.numeroDocumento" input-debounce="0" :rules="[inputRequired]" dense
                          label="Inserte" outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="formInfo.tipoPersonaId.id == 1 || formInfo.tipoPersonaId.value == 1">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Razón social</label>
                        <q-input v-model="formInfo.razonSocial" :rules="[(v) => minLengthInput(7, v), alphanumeric]"
                          input-debounce="0" dense label="Inserte" outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6" v-if="formInfo.tipoPersonaId.id == 1 || formInfo.tipoPersonaId.value == 1">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Nombre comercial *</label>
                        <q-input v-model="formInfo.nombreComercial" input-debounce="0"
                          :rules="[inputRequired, alphanumeric]" dense label="Inserte" outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>

                    <!-- Nombres y Apellidos - 4 cols desktop - 1 col mobile -->
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Primer apellido *</label>
                        <q-input v-model="formInfo.primerApellido" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                          class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Segundo apellido *</label>
                        <q-input v-model="formInfo.segundoApellido" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                          class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Primer nombre *</label>
                        <q-input v-model="formInfo.primerNombre" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                          class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-3" v-if="formInfo.tipoPersonaId.id == 2 || formInfo.tipoPersonaId.value == 2">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Otros nombres *</label>
                        <q-input v-model="formInfo.otrosNombres" input-debounce="0"
                          :rules="[(v) => minLengthInput(2, v), alphanumeric]" dense label="Inserte" outlined
                          class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>

                    <!-- País, departamento, minicipio selects -->
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">País *</label>
                        <q-select v-model="formInfo.paisId" :options="optionsCountries" input-debounce="0" label="Seleccione"
                          dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Departamento *</label>
                        <q-select v-model="formInfo.departamentoId" :disable="formInfo.paisId.value != 425 ? true : false"
                          :options="departamentoOptions" input-debounce="0" label="Seleccione" dense outlined
                          class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Municipio *</label>
                        <q-select v-model="formInfo.municipioId" :disable="formInfo.paisId.value != 425 ? true : false"
                          :options="municipioOptions" map-options input-debounce="0" label="Seleccione" dense outlined
                          class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <!-- Dirección, localidad -->
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Dirección *</label>
                        <q-input v-model="formInfo.direccion" input-debounce="0"
                          :rules="[inputRequired, alphanumeric, (v) => maxLengthInput(100, v)]" dense label="Inserte"
                          outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Localidad *</label>
                        <q-input v-model="formInfo.localidad" input-debounce="0"
                          :rules="[inputRequired, alphanumeric, (v) => maxLengthInput(100, v)]" dense label="Inserte"
                          outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>

                    <!-- teléfono, correo principal, correo para notificaciones -->
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Teléfono</label>
                        <q-input v-model="formInfo.telefono" input-debounce="0" :rules="[mobilePhoneNumberTenToTwelve]"
                          dense label="Inserte" outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Correo Principal *</label>
                        <q-input v-model="formInfo.correoPrincipal" input-debounce="0"
                          :rules="[validationEmail, inputRequired, (v) => maxLengthInput(100, v)]" dense label="Inserte"
                          outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                    <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Correo electrónico para Notificaciones</label>
                        <q-input v-model="formInfo.correoNotificacion"
                          :rules="[validationEmail, (v) => maxLengthInput(200, v)]" input-debounce="0" dense label="Inserte"
                          outlined class="tw-rounded-lg">
                        </q-input>
                      </span>
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </q-card>

            <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
              <q-expansion-item expand-separator id="facturacion-manual-crear-adquiriente-datos-adicionales" default-opened>
                <template v-slot:header>
                  <div class="col row">
                    <p class="tw-text-2xl tw-font-bold">Datos adicionales</p>
                  </div>
                </template>

                <div class="tw-mt-2">
                  <div class="row q-col-gutter-md q-pb-md q-px-md">
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Responsabilidad fiscal *</label>
                        <q-select v-model="formInfo.responsabilidadesFiscales"
                          :hint="'Cantidad seleccionada:' + formInfo.responsabilidadesFiscales.length" multiple
                          :options="opResponsabilidadFiscales" input-debounce="0" label="Seleccione"
                          dense outlined class="tw-rounded-lg" :rules="[inputRequired]">
                        </q-select>
                      </span>
                    </div>

                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                      <span class="tw-w-full">
                        <label class="tw-text-label">Tributos *</label>
                        <q-select v-model="formInfo.tributos"
                          :hint="'Cantidad seleccionada:' + formInfo.tributos.length" multiple input-debounce="0"
                          :options="opTributos"  label="Seleccione" dense outlined
                          class="tw-rounded-lg">
                        </q-select>
                      </span>
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </q-card>
            <div class="col row justify-center q-gutter-x-md q-my-md">
              <q-btn color="primary" label="Editar" style="
                    width: 130px;
                    height: 40px;
                    border-radius: 8px;
                    font-size: 16px;
                    " @click="() => cancelModal = true" />
            </div>
          </q-card>
        </q-form>
      </template>
      <template v-else-if="proveedorStatus === 'not-found'">
        <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <div class="tw-flex tw-items-center tw-justify-center tw-h-96 tw-my-10 tw-gap-4 tw-flex-col">
            <img v-lazy :data-url="ProveedorNotFoundImage" alt="Proveedores no encontrados" />
            <div class="tw-text-center">
              <h3 class="tw-font-bold tw-text-[#2C3948] tw-text-lg">
                Proveedor no encontrado
              </h3>
              <p>Por favor diligencie los datos solicitados para crear uno</p>
            </div>

            <router-link to="/facturacion/manual-proveedores/crear">
              <q-btn flat color="primary" label="Crear" icon="add" />
            </router-link>
          </div>
        </q-card>
      </template>
      <Modal v-model="cancelModal" title="¡Espera un momento!" :is-success="false" text-button="Si"
        @handleAccept="editarProveedor" cancel-button text-button-cancel="No"
        text="¿Está seguro de editar el proveedor?" @close-modal="cancelModal = false" type="button" />

      <Modal v-model="successModal" title="El proveedor ha sido guardado con éxito" :is-success="true" text-button="Ok"
        @handleAccept="resetForm" @close-modal="successModal = false" type="button" />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, watch } from "vue";
import { maxLengthInput, inputRequired, minLengthInput, alphanumeric, mobilePhoneNumberTenToTwelve, validationEmail } from "src/helpers/validations";
// @ts-ignore
import ProveedorNotFoundImage from "src/assets/asquiriente-not-found.svg";
import { useCountries, useDepartments, useMunicipalities } from "src/composables/useVersion";
import Modal from "components/Modal/Modal.vue";
import { sgdeaAxios } from "src/services";
import { SelectInput } from "src/interfaces";
import { toast } from "src/helpers/toast";

const searchInput = ref<string>("");
const proveedorStatus = ref<'pending' | 'found' | 'not-found'>('pending');
const cancelModal = ref<boolean>(false)
const successModal = ref<boolean>(false)


const { optionsCountries } = useCountries()
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);

type FormInfoType = {
  id?: number;
  tipoPersonaId: string;
  tipoRegimenId: string;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial: string;

  primerApellido: string;
  segundoApellido: string;
  primerNombre: string;
  otrosNombres: string;

  paisId: any;
  departamentoId: string;
  municipioId: string;

  direccion: string;
  localidad: string;

  telefono: string;
  correoPrincipal: string;
};

type FormAditionalDataType = {
  responsabilidadesFiscales: any;
  tributos: any;
};

const formInfo = ref<FormInfoType & FormAditionalDataType>({
  id:0,
  tipoPersonaId: "",
  tipoRegimenId: "",
  tipoDocumento: "NIT",
  numeroDocumento: "",
  razonSocial: "",
  nombreComercial: "",

  primerApellido: "",
  segundoApellido: "",
  primerNombre: "",
  otrosNombres: "",
  paisId: { label: 'Colombia', value: 425 },
  departamentoId: "",
  municipioId: "",
  direccion: "",
  localidad: "",
  telefono: "",
  correoPrincipal: "",

  responsabilidadesFiscales: [],
  tributos: [],
});

const formValidate = ref();

const opResponsabilidadFiscales = ref<SelectInput[]>([]);
const opTributos = ref<SelectInput[]>([]);
const opTipoPersona = ref<SelectInput[]>([]);
const opTipoRegimen = ref<SelectInput[]>([]);

const getData = async () => {
  const { optionsDepartments } = await useDepartments(formInfo.value.paisId.value);
  departamentoOptions.value = optionsDepartments.value;

  const tipoPersonaResponse = await sgdeaAxios.get('/facManual/listadoTipoPersona');
  opTipoPersona.value = tipoPersonaResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));

  const tipoRegimenResponse = await sgdeaAxios.get('/facManual/listadoTipoRegimen');
  opTipoRegimen.value = tipoRegimenResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));

  const responsabilidadesFiscalesResponse = await sgdeaAxios.get('/facManual/listadoResponsabilidadesFiscales');
  opResponsabilidadFiscales.value = responsabilidadesFiscalesResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));

  const tributosResponse = await sgdeaAxios.get('/facManual/listadoTributos');
  opTributos.value = tributosResponse.data.map(({id, nombre}) => ({value: id, label: nombre}));
};

async function editarProveedor(){
  const formEnviar = formInfo.value
  for (const key in formEnviar) {
    if (key === 'tipoPersonaId') {
      formEnviar['tipoPersonaId'] = {
        // @ts-ignore
        id: formInfo.value[key].value,
        // @ts-ignore
          nombre: formInfo.value[key].label
        };
      } else if (key === 'tipoRegimenId') {
        formEnviar['tipoRegimenId'] = {
          // @ts-ignore
          id: formInfo.value[key].value,
          // @ts-ignore
          nombre: formInfo.value[key].label
        };
      } else if (key === 'paisId') {
        formEnviar['paisId'] = {
          idPais: formInfo.value[key].value,
        };
      } else if (key === 'departamentoId') {
        formEnviar['departamentoId'] = {
          idDepartamento: formInfo.value[key].value,
        };
      } else if (key === 'municipioId') {
        formEnviar['municipioId'] = {
          idMunicipio: formInfo.value[key].value,
        };
      } else if (Array.isArray(formInfo.value[key])) {
        formEnviar[key] = [...formInfo.value[key]].map(({value, label}) => ({id: value, nombre: label}));
      } else {
        formEnviar[key] = formInfo.value[key];
      }
    }

  try {
    const response = await sgdeaAxios.put(`/facManual/actualizarAdquirienteFacturaManual/${formInfo.value.id}`, formEnviar);
    if (response.status === 200) {
      successModal.value = true;
    }
  } catch (error) {
    toast.error('Ha ocurrido un error al editar el proveedor');
    console.error(error);
  }
}

onMounted(getData);

watch(
  () => formInfo.value.paisId.value,
  async (value) => {
    if (value != 425) {
      formInfo.value.departamentoId = formInfo.value.paisId.label
      formInfo.value.municipioId = formInfo.value.paisId.label
      departamentoOptions.value = []
      municipioOptions.value = []
    } else {
      formInfo.value.departamentoId = ''
      formInfo.value.municipioId = ''
      const { optionsDepartments } = await useDepartments(value);
      departamentoOptions.value = optionsDepartments.value;
    }
  }
);

watch(
  () => formInfo.value.departamentoId.value,
  async (value) => {
    if (formInfo.value.paisId.value !== 425) {
      formInfo.value.municipioId = ''
    }
    const { optionsMunicipalities } = await useMunicipalities(value);
    municipioOptions.value = optionsMunicipalities.value;
  }
);

const resetForm = async () => {
  formInfo.value = {
    tipoPersonaId: "",
    tipoRegimenId: "",
    tipoDocumento: "",
    numeroDocumento: "",
    razonSocial: "",
    nombreComercial: "",

    primerApellido: "",
    segundoApellido: "",
    primerNombre: "",
    otrosNombres: "",

    pais: { label: 'Colombia', value: 425 },
    departamento: "",
    municipio: "",

    direccion: "",
    localidad: "",

    telefono: "",
    correoPrincipal: "",

    responsabilidadesFiscales: [],
    tributos: [],
  };
};

const searchProveedor = async () => {
  try {
    const response = await sgdeaAxios.get(`/facManual/listadoAdquirienteFacturaManualXNIT/${searchInput.value.replace("NIT", "")}`);

    if (Array.isArray(response.data) && response.data.length === 0) {
      proveedorStatus.value = "not-found";
    } else {
      proveedorStatus.value = "found";
      const proveedor = response.data[0];
      for (const key in proveedor) {
        if (Object.prototype.hasOwnProperty.call(proveedor, key)) {
          const element = proveedor[key];

          if (key === 'tipoPersonaId') {
            // @ts-ignore
            formInfo.value.tipoPersonaId = {
              value: element.id,
              label: element.nombre,
              id: element.id
            };
          } else if (key === 'tipoRegimenId') {
            // @ts-ignore
            formInfo.value.tipoRegimenId = {
              value: element.id,
              id: element.id,
              label: element.nombre
            };
          } else if (key === 'paisId') {
            formInfo.value.paisId = {
              value: element.idPais,
              label: element.nombre,
              idPais: element?.idPais
            };
          } else if (key === 'departamentoId') {
            // @ts-ignore
            formInfo.value.departamentoId = {
              value: element.idDepartamento,
              label: element.nombre,
              idDepartamento: element?.idDepartamento,
              codigoDivipola: element?.codigoDivipola,
            };
          } else if (key === 'municipioId') {
            // @ts-ignore
            formInfo.value.municipioId = {
              value: element.idMunicipio,
              label: element.nombre,
              idMunicipio: element?.idMunicipio,
              codigoDivipola: element?.codigoDivipola,
            };
          } else if (key === 'responsabilidadesFiscales' || key === 'tributos' && Array.isArray(element)) {
            formInfo.value[key] = element.map(({id, nombre}) => ({value: id, label: nombre}));
          } else {
            formInfo.value[key] = element;
          }
        }
      }
    }
  } catch (error) {
    proveedorStatus.value = "not-found";
    console.error(error);
  }
};

</script>
