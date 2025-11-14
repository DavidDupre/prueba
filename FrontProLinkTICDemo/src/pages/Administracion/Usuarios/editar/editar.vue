<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class=" tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar Usuario</h1>
        <p class="tw-text-[#969EAF] tw-pl-2 tw-pb-6">Modifica la información del usuario en la plataforma.</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="tw-flex tw-justify-center tw-items-center tw-h-64">
        <q-spinner-dots size="50px" color="primary" />
        <span class="tw-ml-3">Cargando datos del usuario...</span>
      </div>

      <q-form v-else ref="formUsers" greedy>
        <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
          <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-mb-3">Información Personal</h3>
          <div class="row tw-gap-5">
            <span class="col">
              <label class="tw-text-label">Tipo de Documento *</label>
              <q-select
                v-model="form.tipoDoc"
                label="Seleccione"
                outlined
                map-options
                emit-value
                class="mb-3"
                :options="opsTipoDoc"
                dense
                :rules="[inputRequired]"
              />
            </span>
            <span class="col">
              <label class="tw-text-label">Número de Documento *</label>
              <q-input
                v-model="form.numDoc"
                label="Inserte"
                outlined
                class=""
                :rules="[inputRequired, alphanumericAbsolute, (val) => maxLengthInput(15, val)]"
                dense
              />
            </span>
          </div>
          <template v-if="!isNitOrRut">
            <div class="row tw-gap-5">
              <span class="col">
                <label class="tw-text-label">Primer Nombre *</label>
                <q-input
                  v-model="form.firstName"
                  label="Inserte"
                  outlined
                  class=""
                  :rules="[inputRequired, alphanumericAbsolute, (val) => maxLengthInput(50, val)]"
                  dense
                />
              </span>
              <span class="col">
                <label class="tw-text-label">Segundo Nombre *</label>
                <q-input
                  v-model="form.segName"
                  label="Inserte"
                  outlined
                  class=""
                  :rules="[alphanumericAbsolute, (val) => maxLengthInput(50, val)]"
                  dense
                />
              </span>
              <span class="col">
                <label class="tw-text-label">Primer Apellido *</label>
                <q-input
                  v-model="form.firstApellido"
                  label="Inserte"
                  outlined
                  class=""
                  :rules="[inputRequired, alphanumericAbsolute, (val) => maxLengthInput(50, val)]"
                  dense
                />
              </span>
              <span class="col">
                <label class="tw-text-label">Segundo Apellido </label>
                <q-input
                  v-model="form.segApellido"
                  label="Inserte"
                  outlined
                  class=""
                  :rules="[alphanumericAbsolute, (val) => maxLengthInput(50, val)]"
                  dense
                />
              </span>
            </div>
          </template>
          <span v-else class="">
            <label class="tw-text-label">Razón Social *</label>
            <q-input
              v-model="form.RazonSocial"
              label="Inserte"
              outlined
              class="mb-3"
              :rules="[isNotEntidadRemitente ? inputRequired : null, (val) => maxLengthInput(50, val)]"
              dense
            />
          </span>
        </q-card>

        <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
          <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-mb-3">Información de Contacto</h3>
          <div class="row tw-gap-5">
            <span class="col">
              <label class="tw-text-label">Departamento {{isNotEntidadRemitente ? '*': ''}}</label>
              <q-select
                v-model="form.departamento"
                name="departamento"
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                emit-value
                map-options
                label="Seleccione"
                :options="departmentsList"
                :rules="[isNotEntidadRemitente ? inputRequired : null]"
                @filter="filterDep"
                @update:model-value="getMunicipios"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
            <span class="col">
              <label class="tw-text-label">Municipio {{isNotEntidadRemitente ? '*': ''}}</label>
              <q-select
                v-model="form.municipio"
                name="departamento"
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                emit-value
                map-options
                label="Seleccione"
                :options="municipiosList"
                :rules="[isNotEntidadRemitente ? inputRequired : null]"
                @filter="filterMuni"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
            <span class="col">
              <label class="tw-text-label">Dirección {{isNotEntidadRemitente ? '*': ''}}</label>
              <q-input
                v-model="form.dirrecion"
                label="Inserte"
                outlined
                class=""
                :rules="[isNotEntidadRemitente ? inputRequired : null, alphanumeric, (val) => maxLengthInput(50, val)]"
                dense
              />
            </span>
          </div>
          <div class="row tw-gap-5 [&>*]:tw-flex [&>*]:tw-flex-col">
            <span class="col">
              <label class="tw-text-label">Celular {{isNotEntidadRemitente ? '*': ''}}</label>
              <q-input
                v-model="form.celular"
                label="Inserte"
                outlined
                class=""
                :rules="[isNotEntidadRemitente ? inputRequired : null, mobilePhonNumberCel, (val) => maxLengthInput(10, val)]"
                dense
              />
            </span>
            <span class="col">
              <label class="tw-text-label">Correo Personal</label>
              <q-input
                v-model="form.correoPersonal"
                label="Inserte"
                outlined
                class=""
                :rules="[(val) => maxLengthInput(25, val)]"
                dense
              />
            </span>
            <span class="col">
              <label class="tw-text-label">Correo Certificado</label>
              <q-toggle v-model="form.isCertificado" />
            </span>
          </div>
        </q-card>

        <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
          <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-mb-3">Información de Usuario</h3>
          <div
            class="tw-grid tw-grid-cols-2 tw-gap-5 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2"
          >
            <span>
              <label class="tw-text-label">Usuario *</label>
              <q-input
                v-model="form.username"
                label="Inserte"
                outlined
                class=""
                :rules="[inputRequired, (val) => maxLengthInput(10, val)]"
                dense
              />
            </span>
            <span>
              <label class="tw-text-label">Contraseña *</label>
              <q-input
                v-model="form.password"
                label="Inserte"
                outlined
                :type="isPwd ? 'password' : 'text'"
                class=""
                :rules="[inputRequired, (val) => maxLengthInput(15, val), (v) => minLengthInput(8, v)]"
                dense
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </span>
            <span>
              <label class="tw-text-label">Cargo *</label>
              <q-select
                v-model="form.cargo"
                name="departamento"
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                emit-value
                map-options
                label="Seleccione"
                :options="cargosList"
                :rules="[inputRequired]"
                @filter="filterCargo"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
            <span>
              <label class="tw-text-label">Correo Institucional *</label>
              <q-input v-model="form.correoInstitucional" label="Ingrese" outlined class="" :rules="[inputRequired]" dense />
            </span>
            <span>
              <label class="tw-text-label">Tipo de Usuario *</label>
              <q-select
                v-model="form.tipoUser"
                label="Seleccione"
                outlined
                map-options
                emit-value
                class=""
                :options="typesUsersOptions"
                :rules="[inputRequired]"
                dense
              />
            </span>
            <span>
              <label class="tw-text-label">Modulo *</label>
              <q-select
                v-model="form.modulo_id"
                label="Seleccione"
                outlined
                map-options
                emit-value
                class="mb-3"
                :options="modulesOptions"
                :rules="[inputRequired]"
                dense
              />
            </span>
            <span>
              <label class="tw-text-label">Entidad Remitente Asociada para Radicación </label>
              <q-select
                v-model="form.EntRemiAsociadaRadicacion"
                name="entidadAsociada"
                clearable
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                map-options
                label="Seleccione"
                :options="entidadesRemitentes"
                :rules="[]"
                @filter="filterEntidadAsociada"
                @update:model-value="handleEntidadAsociada"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
            <span>
              <label class="tw-text-label">Consolidador de la Oficina </label>
              <q-toggle v-model="form.consolidadorOfi" />
            </span>
          </div>
        </q-card>

        <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
          <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-mb-3">Información de Permisos</h3>
          <div
            class="tw-grid tw-grid-cols-2 tw-gap-5 tw-mb-5 [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2"
          >
            <span>
              <label class="tw-text-label">Dependencia</label>
              <q-select
                v-model="form.dependencia"
                name="dependencias"
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                emit-value
                map-options
                label="Seleccione"
                :options="dependenciasOptions"
                :rules="[]"
                @filter="filterDependencias"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
            <span class="">
              <label class="tw-text-label">Oficina </label>
              <q-select
                v-model="form.oficina"
                name="oficina"
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                emit-value
                map-options
                label="Seleccione"
                :options="oficinasOptions"
                :rules="[]"
                @filter="filterOficina"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
            <span>
              <label class="tw-text-label">Punto de Radicación </label>
              <q-select
                v-model="form.puntoRadicacion"
                name="puntoRadicacion"
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                emit-value
                map-options
                label="Seleccione"
                :options="puntosRadicacion"
                :rules="[]"
                @filter="filterPuntoRadicacion"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
            <span>
              <label class="tw-text-label">Rol </label>
              <q-select
                v-model="form.rol"
                name="rol"
                outlined
                dense
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                emit-value
                map-options
                label="Seleccione"
                :options="roleOptions"
                :rules="[]"
                @filter="filterRol"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">Sin resultados</q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
          </div>
          <div
            class="tw-flex tw-justify-center !tw-flex-row tw-gap-2 [&>*]:tw-p-2 tw-w-full tw-col-span-3 tw-mb-2"
          >
            <q-btn
              label="Limpiar seleccionados"
              color="accent"
              textColor="black"
              class="tw-rounded-lg col-2 tw-w-[17%]"
              @click="clearTable"
              v-if="selectedItems.length > 0"
            />
            <q-btn
              label="Agregar"
              color="primary"
              class="tw-rounded-lg col-2 tw-w-[17%]"
              type="button"
              @click="() => handleDepsAndOffices()"
            />
          </div>
          <Table
            :TABLE_HEADER="cols"
            :TABLE_BODY="rows"
            is-selection="multiple"
            v-model:item-selected="selectedItems"
            key-id="id"
            class="tw-col-span-3"
            ref="table"
          />
        </q-card>

        <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
          <div class="row tw-flex tw-justify-center tw-gap-2 [&>*]:tw-p-2">
            <q-btn
              label="Cancelar"
              color="accent"
              textColor="black"
              class="tw-rounded-lg col-2"
              @click="cancelModal = true"
            />
            <q-btn label="Actualizar" color="primary" class="tw-rounded-lg col-2" @click="updateUser" />
          </div>
        </q-card>
      </q-form>

      <Modal
        v-model="cancelModal"
        title="¿Desea cancelar la acción?"
        :text="``"
        text-button="Si"
        @handleAccept="() => router.push('/SGDA/Administracion/usuarios')"
        label="Confirmar"
        cancelButton
        text-button-cancel="No"
        @close-modal="() => (cancelModal = false)"
      />
      <Modal
        v-model="showModal"
        title="Actualización exitosa"
        :text="`Se ha actualizado con éxito el usuario ${form.username}.`"
        is-success
        text-button="¡Ok!"
        @handleAccept="handleModal"
      />
      <Modal
        v-model="errorModal"
        title="Error"
        text="¡Ha ocurrido un error!"
        :is-success="false"
        text-button="Aceptar"
        @handleAccept="handleModal"
      />
      <Modal
        v-model="validationsModal"
        title="¡UPS!"
        :text="validationText"
        :is-success="false"
        text-button="Aceptar"
        @handleAccept="validationsModal = false"
      />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { Ref, computed, onMounted, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { useAuthStore } from "src/stores/auth.store";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";

import {
  maxLengthInput,
  inputRequired,
  alphanumeric,
  mobilePhonNumberCel,
  minLengthInput,
  alphanumericAbsolute,
} from "src/helpers/validations";
import { useRouter, useRoute } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { Dependencia, SelectInput } from "src/interfaces";
import Table from "src/components/Table.vue";
import { Oficina, Rol } from "../interfaces/usuario";
import { QTable } from "quasar";
import { toast } from "src/helpers/toast";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { log } from "console";

const router = useRouter();
const route = useRoute();
const userId = route.params.id as string; // Obtener ID del usuario de la ruta

const validationsModal = ref<boolean>(false);
const showModal = ref<boolean>(false);
const errorModal = ref<boolean>(false);
const cancelModal = ref<boolean>(false);
const isPwd = ref<boolean>(true);
const validationText = ref<string>("");
const selectedItems = ref<any[]>([]);
const totalRows = ref<number>(1);
const table = ref<QTable>(null);
const formUsers = ref();
const loading = ref<boolean>(true); // Estado de carga

const isNitOrRut = computed<boolean>(() => form.value.tipoDoc === "Nit" || form.value.tipoDoc === "RUT");
const isNotEntidadRemitente = computed<boolean>(() => !form.value.EntRemiAsociadaRadicacion);
const isAprobador = computed<boolean>(() => rows.value.some((it) => it.rol == 1));

const { tokenBpm, tokenJSession } = useAuthStore();

interface CreateUserType {
  // Información Personal
  tipoDoc: number | string;
  numDoc: string;
  firstName: string;
  segName: string;
  firstApellido: string;
  segApellido: string;
  RazonSocial: string;

  // Información de Contacto
  departamento: number | string;
  municipio: number | string;
  dirrecion: string;
  celular: string;
  correoPersonal: string;
  isCertificado: Boolean;

  // Información de Usuario
  username: string;
  password: string;
  cargo: number | string;
  correoInstitucional: string;
  tipoUser: number | string;
  consolidadorOfi: boolean;
  EntRemiAsociadaRadicacion: number | string;

  // Información de Permisos
  modulo_id?: number | string;
  dependencia: number | string;
  oficina: number | string;
  puntoRadicacion: string | number;
  rol?: number | string;

  // firmas
  firma1: boolean;
  firma2: boolean;
  fileFirma1: any;
  fileFirma2: any;
}

const cols = [
  {
    name: "dependencia",
    label: "Dependencia",
    align: "center",
    field: (row: any) =>
      dependenciasOptions.value.find((dependencia) => dependencia.value === row.dependencia)?.label,
  },
  {
    name: "oficina",
    label: "Oficina",
    align: "center",
    field: (row: any) => oficinas.value.find((oficina) => oficina.id === row.oficina)?.nombre ?? "Sin oficina",
  },
  {
    name: "puntoradicacion",
    label: "Punto de Radicación",
    align: "center",
    field: (row: any) => puntosRadicacion.value.find((punto) => punto.value === row.puntoRadicacion)?.label ?? "N/A",
  },
  {
    name: "rol",
    label: "Rol",
    align: "center",
    field: (row: any) => roleOptions.value.find((rol) => rol.value === row.rol)?.label,
  },
];

const rows: Ref<{ id: number; oficina: number; dependencia: number; rol: number; puntoRadicacion: number }[]> = ref([]);

const form = ref<CreateUserType>({
  // Información Personal
  tipoDoc: "",
  numDoc: "",
  firstName: "",
  segName: "",
  firstApellido: "",
  segApellido: "",
  RazonSocial: "",

  // Información de Contacto
  departamento: "",
  municipio: "",
  dirrecion: "",
  celular: "",
  correoPersonal: "",
  isCertificado: false,

  // Información de Usuario
  username: "",
  password: "",
  cargo: "",
  correoInstitucional: "",
  tipoUser: "",
  consolidadorOfi: false,
  EntRemiAsociadaRadicacion: "",

  // Información de Permisos
  modulo_id: 7,
  dependencia: "",
  oficina: "",
  puntoRadicacion: "",
  rol: "",

  // firmas
  firma1: false,
  firma2: false,
  fileFirma1: [],
  fileFirma2: [],
});

const roleOptions: Ref<SelectInput[]> = ref([]);
const opsRol: Ref<SelectInput[]> = ref([]);
const modulesOptions: Ref<SelectInput[]> = ref([]);
const dependenciasOptions: Ref<SelectInput[]> = ref([]);
const opsDepencias: Ref<SelectInput[]> = ref([]);
const oficinasOptions = ref([]);
const oficinas: Ref<Oficina[]> = ref([]);
const opsOficinas: Ref<SelectInput[]> = ref([]);
const puntosRadicacion: Ref<SelectInput[]> = ref([]);
const opsPuntoRad: Ref<SelectInput[]> = ref([]);

const opsTipoDoc: Ref<SelectInput[]> = ref([]);
const departmentsList: Ref<SelectInput[]> = ref([]);
const opsDep: Ref<SelectInput[]> = ref([]);
const municipiosList: Ref<SelectInput[]> = ref([]);
const opsMuni: Ref<SelectInput[]> = ref([]);
const typesUsersOptions: Ref<SelectInput[]> = ref([]);
const cargoOptions: Ref<SelectInput[]> = ref([]);
const cargosList: Ref<SelectInput[]> = ref([]);
const entidadesRemitentes: Ref<SelectInput[]> = ref([]);
const opsEntidadesRemitentes: Ref<SelectInput[]> = ref([]);

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Administración",
  },
  {
    name: "Usuarios",
    to: "/SGDA/administracion/usuarios",
  },
  {
    name: "Editar Usuario",
    to: `/SGDA/administracion/usuarios/editar/${userId}`,
  },
];

// Corregido: cargar código del tipoDoc para evitar error Enum en backend
const loadUserData = async (id: string) => {
  try {
    loading.value = true;

    const response = await sgdeaAxios.get(`/api/usuarios/${id}`);

    if ([200, 201].includes(response.status)) {
      const userData = response.data;

      const firstNameParts = userData.firstname?.split(" ") || [];
      const lastNameParts = userData.lastname?.split(" ") || [];

      form.value = {
        tipoDoc: userData.tipoDocumento?.codigo || "",
        numDoc: userData.numeroDocumento || "",
        firstName: firstNameParts[0] || "",
        segName: firstNameParts[1] || "",
        firstApellido: lastNameParts[0] || "",
        segApellido: lastNameParts[1] || "",
        RazonSocial: userData.razonSocial || "",

        // Contacto
        departamento: userData.departamento?.idDepartamento || "",
        municipio: "",
        dirrecion: userData.direccion || "",
        celular: userData.celular || "",
        correoPersonal: userData.emailPersonal || "",
        isCertificado: userData.isCertificado || false,

        // Usuario
        username: userData.userName || "",
        password: "SGdea2024*",
        cargo: userData.cargo?.nombre || "",
        correoInstitucional: userData.email || "",
        tipoUser: userData.tipoUsuario || "",
        consolidadorOfi: userData.consolida || userData.isConsolidador || false,
        EntRemiAsociadaRadicacion: "",

        // Permisos
        modulo_id: userData.modulo?.id || 7,
        dependencia: "",
        oficina: "",
        puntoRadicacion: "",
        rol: "",

        // firmas
        firma1: false,
        firma2: false,
        fileFirma1: [],
        fileFirma2: [],
      };

      if (userData.departamento?.idDepartamento) {
        await getMunicipios(userData.departamento.idDepartamento);
        form.value.municipio = userData.municipio?.idMunicipio || "";
      }

      if (userData.usuarioRelaciones && userData.usuarioRelaciones.length > 0) {
        rows.value = userData.usuarioRelaciones.map((relacion, index) => ({
          id: index + 1,
          dependencia: relacion.seccionSubSeccion?.idSeccionSubSeccion || 0,
          oficina: relacion.oficina?.id || 0,
          rol: relacion.rol?.id || 0,
          puntoRadicacion: relacion.puntoRadicacion?.id || 0,
        }));
        totalRows.value = rows.value.length + 1;
      }
    }
  } catch (error) {
    toast.error("Error al cargar los datos del usuario");
    errorModal.value = true;
  } finally {
    loading.value = false;
  }
};

const updateUser = async () => {
  try {
    if (!(await formUsers.value.validate())) {
      toast.error("Debe diligenciar los campos obligatorios para continuar con el proceso");
      return;
    }

    if (rows.value.length === 0) {
      validationText.value = "Debe seleccionar al menos una dependencia y un rol";
      validationsModal.value = true;
      return;
    }

    const payload = {
      firstName: [form.value.firstName.trim(), form.value.segName.trim()].filter(Boolean).join(" "),
      lastName: [form.value.firstApellido.trim(), form.value.segApellido.trim()].filter(Boolean).join(" "),
      email: form.value.correoInstitucional,
      email_persona: form.value.correoPersonal,
      certificado: form.value.isCertificado,
      username: form.value.username,
      password: form.value.password,
      cargo: form.value.cargo,
      tipoDocumentoUsuario: form.value.tipoDoc,
      numDocumento: form.value.numDoc,
      modulo_id: form.value.modulo_id,
      depsOficinas: rows.value.map((row) => ({
        idDependencia: row.dependencia,
        idOficina: row.oficina,
        idPuntoRadicacion: row.puntoRadicacion,
        idRol: row.rol,
      })),
      departamento: form.value.departamento,
      municipio: form.value.municipio,
      direccion: form.value.dirrecion,
      celular: form.value.celular || null,
      razonSocial: form.value.RazonSocial,
      tipoUser: form.value.tipoUser,
      consolidador: form.value.consolidadorOfi,
    };

    const queryParameters = new URLSearchParams({
      BpmToken: tokenBpm || "",
      JJSESSIONID: tokenJSession || "",
    }).toString();

    const response = await sgdeaAxios.put(`/api/usuarios/editar?${queryParameters}`, payload);

    if ([200, 201].includes(response.status)) {
      showModal.value = true;
    } else if ([203].includes(response.status)) {
      validationsModal.value = true;
      validationText.value = response?.data.message;
    }
  } catch (error) {
    const message = error?.response?.data?.message;
    toast.error(message ?? "Ha ocurrido un error");
  }
};

const getData = async () => {
  try {
    const response = await sgdeaAxios.get<Rol[]>("/roles");

    if ([200, 201].includes(response.status)) {
      opsRol.value = response.data
        .map((rol) => ({
          label: rol.nombre,
          value: rol.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } else if ([203].includes(response.status)) {
      validationsModal.value = true;
      // @ts-ignore
      validationText.value = response?.data.message;
    }

    const { data: tipoDocData } = await sgdeaAxios.get<
      { id: number; codigo: string; descripcion: string }[]
    >("/usuarios/obtener-tipoDocumentos");
    opsTipoDoc.value = tipoDocData
      .map((tipo) => ({
        label: `${tipo.codigo}: ${tipo.descripcion}`,
        value: tipo.codigo,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const { optionsDepartments } = await useDepartments(425);
    opsDep.value = optionsDepartments.value;

    const { data: modulesData } = await sgdeaAxios.get<{ id: number; nombre: string }[]>("/notificaciones/modulos");
    modulesOptions.value = modulesData
      .map((module) => ({
        label: module.nombre,
        value: module.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const { data } = await sgdeaAxios.get<Dependencia[]>("/seccionSubSeccion");
    opsDepencias.value = data
      .map((dependencia) => ({
        label: dependencia.nombre,
        value: dependencia.idSeccionSubSeccion,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const { data: oficinasData } = await sgdeaAxios.get<Oficina[]>("/oficinas/all");
    oficinas.value = oficinasData;

    const { data: puntosRadicacionData } = await sgdeaAxios.get("/correspondencia/puntoRadicacion/listadoActive");
    opsPuntoRad.value = puntosRadicacionData
      .map((punto) => ({
        label: punto.nombrePunto,
        value: punto.id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const { data: typeUser } = await sgdeaAxios.get("/api/usuarios/obtenerTipoUsuario");
    typesUsersOptions.value = typeUser
      .map((type) => ({
        label: type,
        value: type,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const { data: cargosUser } = await sgdeaAxios.get("/usuarios/obtener-cargos");
    cargoOptions.value = cargosUser
      .map((cargo) => ({
        label: cargo.nombre,
        value: cargo.nombre,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const { data: entidades } = await sgdeaAxios.get("/usuarios/lista-entidades-remitentes");
    opsEntidadesRemitentes.value = entidades
      .map((ent) => ({
        label: ent.nombre,
        value: ent.nit,
        tipo: ent.tipo,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Inicializar listas para filtros
    roleOptions.value = opsRol.value;
    departmentsList.value = opsDep.value;
    cargosList.value = cargoOptions.value;
    dependenciasOptions.value = opsDepencias.value;
    puntosRadicacion.value = opsPuntoRad.value;
    entidadesRemitentes.value = opsEntidadesRemitentes.value;
  } catch (error) {
    console.error(error);
  }
};

const handleDepsAndOffices = () => {
  if (!form.value.dependencia || !form.value.rol) {
    validationText.value = "Debe seleccionar una dependencia y un rol";
    validationsModal.value = true;
    return;
  }

  if (form.value.oficina !== "") {
    rows.value.push({
      id: totalRows.value,
      oficina: Number(form.value.oficina),
      dependencia: Number(form.value.dependencia),
      rol: Number(form.value.rol),
      puntoRadicacion: Number(form.value.puntoRadicacion),
    });
  } else {
    rows.value.push({
      id: totalRows.value,
      oficina: 0,
      dependencia: Number(form.value.dependencia),
      rol: Number(form.value.rol),
      puntoRadicacion: Number(form.value.puntoRadicacion),
    });
  }

  form.value.dependencia = "";
  form.value.oficina = "";
  form.value.rol = null;
  form.value.puntoRadicacion = "";
  totalRows.value += 1;
};

const clearTable = () => {
  rows.value = rows.value.filter((row) => !!selectedItems.value.find((it) => it.id !== row.id));
  totalRows.value = rows.value.length;
  selectedItems.value = [];
  // @ts-ignore
  table.value.cleanSelect();
};

watch(
  () => form.value.dependencia,
  (newValue) => {
    oficinasOptions.value = [];
    form.value.oficina = "";
    const oficinasFiltered = oficinas.value.filter((oficina) => newValue === oficina?.dependencia?.idSeccionSubSeccion);
    opsOficinas.value = oficinasFiltered.map((oficina) => ({
      label: oficina.nombre,
      value: oficina.id,
    }));
    oficinasOptions.value = opsOficinas.value;
  }
);

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push("/SGDA/Administracion/usuarios");
  } else {
    errorModal.value = false;
  }
};

const getMunicipios = async (value) => {
  form.value.municipio = "";
  const { optionsMunicipalities } = await useMunicipalities(value);
  opsMuni.value = optionsMunicipalities.value;
  municipiosList.value = opsMuni.value;
};

const handleEntidadAsociada = async (entidad) => {
  if (entidad) {
    form.value.RazonSocial = entidad.label;
    form.value.tipoDoc = "Nit";
    form.value.numDoc = entidad.value;
  } else {
    form.value.RazonSocial = "";
    form.value.tipoDoc = "";
    form.value.numDoc = "";
  }
};

const normalizeString = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const filterDep = (val, update) => {
  if (val === "") {
    update(() => {
      departmentsList.value = opsDep.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    departmentsList.value = opsDep.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const filterCargo = (val, update) => {
  if (val === "") {
    update(() => {
      cargosList.value = cargoOptions.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    cargosList.value = cargoOptions.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const filterMuni = (val, update) => {
  if (val === "") {
    update(() => {
      municipiosList.value = opsMuni.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    municipiosList.value = opsMuni.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const filterDependencias = (val, update) => {
  if (val === "") {
    update(() => {
      dependenciasOptions.value = opsDepencias.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    dependenciasOptions.value = opsDepencias.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const filterOficina = (val, update) => {
  if (val === "") {
    update(() => {
      oficinasOptions.value = opsOficinas.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    oficinasOptions.value = opsOficinas.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const filterPuntoRadicacion = (val, update) => {
  if (val === "") {
    update(() => {
      puntosRadicacion.value = opsPuntoRad.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    puntosRadicacion.value = opsPuntoRad.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const filterRol = (val, update) => {
  if (val === "") {
    update(() => {
      roleOptions.value = opsRol.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    roleOptions.value = opsRol.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const filterEntidadAsociada = (val, update) => {
  if (val === "") {
    update(() => {
      entidadesRemitentes.value = opsEntidadesRemitentes.value;
    });
    return;
  }

  const needle = normalizeString(val);
  update(() => {
    entidadesRemitentes.value = opsEntidadesRemitentes.value.filter((v) => {
      return normalizeString(v.label).indexOf(needle) > -1;
    });
  });
};

const rejectedFiles = async (error, type) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error(`Solo se pueden adjuntar 1 archivos.`);
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(`Formato inválido, los formatos permitidos son ${type == 1 ? "pdf" : "png, jpg"}.`);
  }
};

onMounted(async () => {
  await getData();
  if (userId) {
    await loadUserData(userId);
  }
});
</script>
