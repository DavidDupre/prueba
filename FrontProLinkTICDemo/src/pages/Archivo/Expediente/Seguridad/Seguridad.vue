<template>
  <section class="tw-space-y-6">
    <!-- Sección de Reclasificación -->
    <q-card class="tw-p-4 tw-shadow-sm">
      <div class="tw-flex tw-flex-col tw-items-center tw-space-y-4">
        <!-- Fila de Inputs -->
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-w-full">
          <!-- Código de Expediente -->
          <div>
            <Label label="Código de Expediente" required />
            <q-input v-model="form.codigoExpediente" outlined dense disable placeholder="Código" class="tw-rounded-lg"
              :rules="[required]" ref="codigoInput" />
          </div>

          <!-- Nombre del Expediente -->
          <div>
            <Label label="Nombre del Expediente" required />
            <q-input v-model="form.nombreExpediente" outlined dense disable placeholder="Nombre completo"
              class="tw-rounded-lg" :rules="[required]" ref="nombreInput" />
          </div>

          <!-- Clasificación de Seguridad -->
          <div>
            <Label label="Clasificación de Seguridad" />
            <q-select v-model="form.clasificacionSeguridad" :options="securityLevels" outlined dense
              class="tw-rounded-lg" :disable="readonly" ref="clasificacionInput" />
          </div>
        </div>

        <Button v-if="authorizedOriginalDependencies.length > 0 || authorizedOriginalUsers.length > 0" color="secondary"
          label="Reclasificar Expediente" type="primary" type-button="button" :disabled="readonly" class="tw-w-120"
          icon-right="circle-arrow-right" @click="handleTransfer" />


      </div>
    </q-card>

    <!-- Sección de Autorizaciones -->

    <q-form greedy ref="formSeguridad">
      <q-card class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-6 tw-p-4" flat>
        <!-- Dependencias Autorizadas -->
        <div class="tw-space-y-4">
          <h5 class="tw-text-xl tw-font-bold tw-text-blue-600">
            Dependencia Autorizada
          </h5>

          <!-- Dependencia -->
          <div class="tw-grid tw-grid-cols-4 tw-gap-2">
            <q-select v-model="selectedDependency" :options="filteredDependencies" label="Seleccione Dependencia"
              option-value="value" option-label="label" outlined dense use-input hide-selected fill-input
              @filter="filterDependencies" class="tw-col-span-3 tw-rounded-lg" :disable="readonly" />

            <Button color="primary" type="tertiary" type-button="button" icon-left="plus" @click="addDependency"
              :disabled="readonly || !selectedDependency" class="tw-mb-1" />
          </div>

          <DataTable :value="authorizedDependencies" class="tw-border tw-rounded-lg" :loading="loading">
            <Column field="labelDependency" header="Dependencia" sortable />
            <Column header="Acciones">
              <template #body="{ data }" style="text-align: center;">
                <div class="flex justify-center gap-2">
                  <Button color="primary" type="tertiary" type-button="button" icon-left="trash"
                    @click="removeDependency(data.valueDependency)" :disabled="readonly" />

                  <Button icon-left="cog" color="primary" type="tertiary" type-button="button"
                    @click.prevent="togglePermisosDependencia(data.valueDependency)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Usuarios Autorizados -->
        <div class="tw-space-y-4">
          <h5 class="tw-text-xl tw-font-bold tw-text-blue-600">
            Usuarios Autorizados
          </h5>

          <div class="tw-flex tw-gap-2 tw-items-end">
            <q-select v-model="selectedUser" :options="filteredUsers" label="Seleccione usuario" option-value="value"
              option-label="label" outlined dense use-input fill-input multiple @filter="filterUsers"
              class="tw-flex-1 tw-rounded-lg" :disable="readonly" use-chips />

            <Button color="primary" type="tertiary" type-button="button" icon-left="plus" @click="addUser"
              :disabled="readonly || !selectedUser" class="tw-mb-1" />
          </div>

          <DataTable :value="authorizedUsers" class="tw-border tw-rounded-lg" :loading="loading">
            <Column field="usuario.user" header="Usuario" sortable />
            <Column field="usuario.label" header="Nombre" sortable />
            <Column header="Acciones">
              <template template #body="{ data }" style="text-align: center;">
                <div class="flex justify-center gap-2">
                  <Button color="primary" type="tertiary" type-button="button" icon-left="trash"
                    @click="removeUser(data.usuario)" :disabled="readonly" />

                  <Button icon-left="cog" color="primary" type="tertiary" type-button="button"
                    @click.prevent="togglePermisosUsuario(data.usuario)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </q-card>

      <template>
        <q-dialog v-model="mostrarModalDependency" persistent>
          <q-card style="min-width: 400px;">
            <q-card-section class="p-4 text-center" style="color: black"> <!-- Aquí centramos el contenido -->
              <template v-for="dependency in authorizedDependencies" :key="dependency.valueDependency">
                <div v-if="dependency.valueDependency === dependenciaActual">
                  <q-toolbar-title class="tw-text-xl tw-font-bold tw-text-blue-600"
                    style="margin: 0 auto; display: inline-block;">
                    Configuración de permisos
                  </q-toolbar-title>
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <q-checkbox v-model="dependency.permisoConsultarExpediente" label="Consultar expediente" />
                    <q-checkbox v-model="dependency.permisoEditarExpediente" label="Editar expediente" />
                    <q-checkbox v-model="dependency.permisoConsultarDocumentos" label="Consultar documentos" />
                    <q-checkbox v-model="dependency.permisoEditarDatosDocumento" label="Editar datos de documentos" />
                    <q-checkbox v-model="dependency.permisoIncluirDocumentos" label="Incluir documentos" />
                  </div>
                  <!-- Campo de justificación -->
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <q-input v-model="dependency.justificacion" label="Justificación" type="textarea" autogrow
                      :readonly="readonly" dense />
                  </div>
                </div>
              </template>
            </q-card-section>

            <q-card-actions align="center"> <!-- Centramos el botón -->

              <Button color="primary" label="Cerrar" type="tertiary" type-button="button" flat v-close-popup
                :disabled="readonly" class="tw-w-32" icon-left="close" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </template>
      <template>
        <q-dialog v-model="mostrarModalUser" persistent>
          <q-card style="min-width: 400px;">
            <q-card-section class="p-4 text-center" style="color: black"> <!-- Aquí centramos el contenido -->
              <template v-for="user in authorizedUsers" :key="user.usuario.user">
                <div v-if="user.usuario.user === usuarioActual">
                  <q-toolbar-title class="tw-text-xl tw-font-bold tw-text-blue-600"
                    style="margin: 0 auto; display: inline-block;">
                    Configuración de permisos
                  </q-toolbar-title>
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <q-checkbox v-model="user.permisoConsultarExpediente" label="Consultar expediente" />
                    <q-checkbox v-model="user.permisoEditarExpediente" label="Editar expediente" />
                    <q-checkbox v-model="user.permisoConsultarDocumentos" label="Consultar documentos" />
                    <q-checkbox v-model="user.permisoEditarDatosDocumento" label="Editar datos de documentos" />
                    <q-checkbox v-model="user.permisoIncluirDocumentos" label="Incluir documentos" />
                  </div>
                  <!-- Campo de justificación -->
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <q-input v-model="user.justificacion" label="Justificación" type="textarea" autogrow
                      :readonly="readonly" dense />
                  </div>
                </div>
              </template>
            </q-card-section>

            <q-card-actions align="center"> <!-- Centramos el botón -->

              <Button color="blue" label="Cerrar" type="tertiary" type-button="button" flat v-close-popup
                :disabled="readonly" class="tw-w-32" icon-left="close" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </template>


      <!-- Sección de Observación -->
      <q-card class="tw-p-4 tw-shadow-sm">
        <div class="tw-flex tw-flex-col tw-items-center tw-space-y-4">
          <div class="tw-flex tw-gap-4">
            <Button color="segundary" label="Cancelar" type="tertiary" type-button="button" @click="cancelReclassification"
              :disabled="readonly" class="tw-w-32" icon-left="close" />
            <Button color="primary" label="Guardar" type="primary" type-button="button" @click="confirmarModal"
              :disabled="readonly" class="tw-w-32" icon-left="save" />
          </div>
        </div>
      </q-card>
    </q-form>

    <!-- Modal de confirmación -->
    <ConfirmModal :show-modal="modalConfirmar" text-show-modal="¿Está seguro de la acción a realizar?"
      text-confirm-modal="Aceptar" text-cancel-modal="Cancelar" @confirm-modal="validateAndReclassify"
      :persistent="false" @update:show-modal="modalConfirmar = false" />

    <!-- Modal de aprobación -->
    <q-form greedy ref="formReclasificacion">
      <q-dialog v-model="showApprovalModal" persistent>
        <q-card class="q-py-xl q-px-xl tw-max-w-2xl tw-w-full">
          <q-card-section>
            <CommentTextArea v-model="observacionModal" outlined dense :is-required="true" :max-length="5000"
              :rules="[inputRequired, (val) => maxLengthInput(5000, val)]"
              label="Usted está modificando los niveles de seguridad del expediente, por favor especifique el motivo"
              class="tw-w-full" />
          </q-card-section>

          <q-card-actions align="center" class="q-mt-sm tw-gap-4">
            <Button label="Cancelar" color="primary" type-button="button" type="tertiary" @click="cancelApproval"
              icon-left="circle-xmark" />
            <Button label="Aceptar" color="blue" type="primary" @click="reclasificarExpediente" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-form>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { toast } from "src/helpers/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { inputRequired, maxLengthInput } from "src/helpers/validations";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
import { useAuthStore } from "stores/auth.store";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import axios from "axios";
import { sgdeaArchivoAxios } from "src/services";

const mostrarModalUser = ref(false)
const mostrarModalDependency = ref(false)
interface Expediente {
  identificationCode: string;
  title: string;
  securityLevel?: string;
  justificacionSeguridad?: string;
}

const props = defineProps<{
  expediente: Expediente;
}>();

// Implementacion de validaciones de campos
const formSeguridad = ref<any>(null);
const formReclasificacion = ref<any>(null);
const observacionModal = ref("");
const showApprovalModal = ref(false);
const justificacionContenido = ref("");
const readonly = ref(false);
const loading = ref(false);
const dependenciaSearch = ref("");
const auth = useAuthStore();
// Niveles de seguridad
const securityLevels = ref(["PUBLICO", "RESERVADO", "PRIVADO"]);

// Formulario principal
const form = ref({
  codigoExpediente: "",
  nombreExpediente: "",
  clasificacionSeguridad: securityLevels.value[0],
  observacion: "",
});

const usuarioActual = ref('')
const dependenciaActual = ref('')
// Autorizaciones
const selectedUser = ref<any[]>([]);
const selectedDependency = ref(null);
const authorizedOriginalUsers = ref<any[]>([]);
const authorizedOriginalDependencies = ref<any[]>([]);
const authorizedUsers = ref<any[]>([]);
const authorizedDependencies = ref<any[]>([]);
// Datos para selects
const allUsers = ref<any[]>([]);
const allDependencies = ref<any[]>([]);
const filteredUsers = ref<any[]>([]);
const filteredDependencies = ref<any[]>([]);

// Referencias a los inputs
const codigoInput = ref();
const nombreInput = ref();
const clasificacionInput = ref();

// Modal de confirmación
const modalConfirmar = ref(false);

// Reglas de validación
const required = (val: string) => !!val || "Campo obligatorio";

const validateAndReclassify = async () => {
  try {
    if (!validateForm()) return;
    loading.value = true;

    const usersPermission = authorizedUsers.value?.map((auth) => ({
      user: auth.usuario.user,
      userName: auth.usuario.label,
      permisoConsultarExpediente: auth.permisoConsultarExpediente ?? false,
      permisoEditarExpediente: auth.permisoEditarExpediente ?? false,
      permisoConsultarDocumentos: auth.permisoConsultarDocumentos ?? false,
      permisoEditarDatosDocumento: auth.permisoEditarDatosDocumento ?? false,
      permisoIncluirDocumentos: auth.permisoIncluirDocumentos ?? false,
      justificacion: auth.justificacion,
    })) || [];

    const dependenciesPermission = authorizedDependencies.value?.map((dep) => ({
      dependencyId: dep.valueDependency,
      permisoConsultarExpediente: dep.permisoConsultarExpediente ?? false,
      permisoEditarExpediente: dep.permisoEditarExpediente ?? false,
      permisoConsultarDocumentos: dep.permisoConsultarDocumentos ?? false,
      permisoEditarDatosDocumento: dep.permisoEditarDatosDocumento ?? false,
      permisoIncluirDocumentos: dep.permisoIncluirDocumentos ?? false,
      justificacion: dep.justificacion,
    })) || [];

    const payload = {
      securityLevel: form.value.clasificacionSeguridad,
      expedientCode: form.value.codigoExpediente,
      justification: justificacionContenido.value,
      username: auth.userInfo.username,
      dependenciesPermission,
      usersPermission,
    };

    const response = await axios.post(
      "archivo/expediente/seguridad/gestionar-permisos",
      payload
    );

    modalConfirmar.value = false;
    toast.success("Cambios guardados correctamente");
    resetForm();
    setTimeout(() => {
      location.reload();
    }, 1000);
  } catch (error) {
    toast.error("Error al modificar los permisos");
  } finally {
    loading.value = false;
  }
};

const confirmarModal = async () => {
  const isValidate = await formSeguridad.value.validate();
  if (!isValidate) {
    toast.error("Por favor complete todos los campos obligatorios");
    return;
  }
  modalConfirmar.value = true;
};

const validateForm = () => {
  return [
    codigoInput.value?.validate(),
    nombreInput.value?.validate(),
    clasificacionInput.value?.validate(),
  ].every((valid) => valid);
};

const resetForm = () => {
  form.value = {
    codigoExpediente: form.value.codigoExpediente,
    nombreExpediente: form.value.nombreExpediente,
    clasificacionSeguridad: form.value.clasificacionSeguridad,
    observacion: form.value.observacion,
  };

  allUsers.value = [];
  filteredUsers.value = [];
  filteredDependencies.value = [];
};

const cancelReclassification = () => {
  resetForm();
  fetchInitialData();
  toast.success("Operación cancelada");
};

// Métodos para usuarios
const addUser = () => {
  if (!selectedUser.value?.length) {
    toast.error("Debe seleccionar al menos un usuario");
    return;
  }

  selectedUser.value.forEach((user) => {

    const exists = authorizedUsers.value.some(
      (u) => u.usuario.user === user.user
    );

    if (!exists) {
      authorizedUsers.value.push({
        usuario: user,
        nomre: user.label,
        permisoConsultarExpediente: false,
        permisoEditarExpediente: false,
        permisoConsultarDocumentos: false,
        permisoEditarDatosDocumento: false,
        permisoIncluirDocumentos: false,
      });
    }
  });

  selectedUser.value = []; // Limpia la selección
};

const removeUser = (userId) => {

  authorizedUsers.value = authorizedUsers.value.filter(
    (u) => u.usuario.user !== userId.user
  );
};

const filterUsers = (val: string, update: Function) => {
  if (allUsers.value.length === 0) {
    onSetUsersDefoult()
  }

  update(() => {
    if (!val) {
      filteredUsers.value = [...allUsers.value];
      return;
    }
    const search = val.toLowerCase();
    filteredUsers.value = allUsers.value.filter((user) =>
      user.label.toLowerCase().includes(search)
    );
  });
};

// Métodos para dependencias
const addDependency = async () => {
  if (!selectedDependency.value) {
    toast.error("Debe seleccionar una dependencia");
    return;
  }

  const exists = authorizedDependencies.value.some(
    (d) => d.valueDependency === selectedDependency.value.value
  );

  if (exists) {
    toast.error("Esta dependencia ya está autorizada");
    return;
  }

  authorizedDependencies.value.push({
    labelDependency: selectedDependency.value.label,
    valueDependency: selectedDependency.value.value,
    permisoConsultarExpediente: false,
    permisoEditarExpediente: false,
    permisoConsultarDocumentos: false,
    permisoEditarDatosDocumento: false,
    permisoIncluirDocumentos: false,
  });

  selectedDependency.value = null;
};

const removeDependency = (dependencyId: string) => {
  authorizedDependencies.value = authorizedDependencies.value.filter(
    (d) => d.valueDependency !== dependencyId
  );
};

const filterDependencies = (val: string, update: Function) => {
  update(() => {
    if (!val) {
      filteredDependencies.value = [...allDependencies.value];
      return;
    }

    const search = val.toLowerCase();
    filteredDependencies.value = allDependencies.value.filter((dep) =>
      dep.label.toLowerCase().includes(search)
    );
  });
};

// Carga inicial de datos
const fetchInitialData = async () => {
  try {
    loading.value = true;

    loadCurrentPermissions();

    // Cargar dependencias
    const dependenciesResponse = await sgdeaArchivoAxios.get(
      "/trd/offices"
    );
    allDependencies.value = dependenciesResponse.data.map((dep: any) => ({
      label: dep.name,
      value: dep.id,
      code: dep.code,
    }));
    filteredDependencies.value = [...allDependencies.value];
  } catch (error) {
    toast.error("Error al cargar datos iniciales");
  } finally {
    loading.value = false;
  }
};

const loadCurrentPermissions = async () => {
  try {
    const permissionsResponse = await sgdeaArchivoAxios.get(
      `/expediente/seguridad/${props.expediente.identificationCode}`
    );

    if (permissionsResponse.status === 200) {
      const data = permissionsResponse.data;
      justificacionContenido.value = data.justificacion;

      // Cargar dependencias autorizadas con permisos
      authorizedDependencies.value = (data.dependencias || []).map(dep => ({
        labelDependency: dep.nombre,
        valueDependency: dep.id,
        codigo: dep.codigo,
        permisoConsultarExpediente: dep.permisoConsultarExpediente,
        permisoEditarExpediente: dep.permisoEditarExpediente,
        permisoConsultarDocumentos: dep.permisoConsultarDocumentos,
        permisoEditarDatosDocumento: dep.permisoEditarDatosDocumento,
        permisoIncluirDocumentos: dep.permisoIncluirDocumentos,
        justificacion: dep.justificacion,
      }));
      dependenciaSearch.value = authorizedDependencies.value[0].codigo + '-' + authorizedDependencies.value[0].labelDependency;

      authorizedUsers.value = (data.usuarios || []).map(user => ({
        usuario: {
          user: user.user,
          label: user.userName
        },
        permisoConsultarExpediente: user.permisoConsultarExpediente,
        permisoEditarExpediente: user.permisoEditarExpediente,
        permisoConsultarDocumentos: user.permisoConsultarDocumentos,
        permisoEditarDatosDocumento: user.permisoEditarDatosDocumento,
        permisoIncluirDocumentos: user.permisoIncluirDocumentos,
        justificacion: user.justificacion,
      }));

      authorizedOriginalDependencies.value = authorizedDependencies.value;
      authorizedOriginalUsers.value = authorizedUsers.value;
    }
  } catch (error) {
    console.info("No hay permisos para el expediente:", error);
  }
};

onMounted(() => {
  if (form.value.clasificacionSeguridad === 'CONFIDENCIAL') {
    form.value.clasificacionSeguridad = 'PRIVADO';
  }
  form.value = {
    codigoExpediente: props.expediente.identificationCode,
    nombreExpediente: props.expediente.title,
    clasificacionSeguridad: props.expediente.securityLevel || "PUBLICO",
    observacion: props.expediente.justificacionSeguridad,
  };

  loadCurrentPermissions();

  fetchInitialData();
});

const cancelApproval = () => {
  showApprovalModal.value = false;
  observacionModal.value = "";
  fetchInitialData();
};

const handleTransfer = async () => {
  showApprovalModal.value = true;
};

const reclasificarExpediente = async () => {
  const isValidateReclasificacion = await formReclasificacion.value.validate();
  if (!isValidateReclasificacion) {
    toast.error("La justificación es obligatoria");
    return;
  }

  try {
    if (form.value.clasificacionSeguridad === 'PRIVADO') {
      form.value.clasificacionSeguridad = 'CONFIDENCIAL'
    }
    const payload = {
      securityLevel: form.value.clasificacionSeguridad,
      expedientCode: form.value.codigoExpediente,
      justification: observacionModal.value,
      username: auth.userInfo.username,
    };

    await sgdeaArchivoAxios.post(
      "/expediente/seguridad/reclasificar-expediente",
      payload
    );

    toast.success("Expediente reclasificado correctamente");
    showApprovalModal.value = false;
    fetchInitialData();
  } catch (error) {
    toast.error("Ocurrió un error al reclasificar el expediente");
  } finally {
    loading.value = false;
  }
};

const onSetUsersDefoult = async () => {
  // Cargar usuarios
  const usersResponse = await sgdeaArchivoAxios.get("/seguridad/auth/users");

  allUsers.value = usersResponse.data.map((user: any) => ({
    user: user.username,
    label: `${user.firstName} ${user.lastName}`,
  }));
  filteredUsers.value = [...allUsers.value];
};
function togglePermisosUsuario(user) {

  usuarioActual.value = user.user;
  mostrarModalUser.value = true;
}
function togglePermisosDependencia(dependency) {
  dependenciaActual.value = dependency;
  mostrarModalDependency.value = true;
}
</script>
