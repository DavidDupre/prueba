<template>
  <section class="tw-space-y-6">
    <!-- Sección de Reclasificación -->
    <q-card class="tw-p-4 tw-shadow-sm">
      <div class="tw-flex tw-flex-col tw-items-center tw-space-y-4">
        <!-- Fila de Inputs -->
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-w-full">
          <!-- Código Unidad de Conservación -->
          <div>
            <Label label="Código Unidad de Conservación" required />
            <q-input v-model="form.codigoDocumento" outlined dense disable placeholder="Código" class="tw-rounded-lg"
              :rules="[required]" ref="codigoInput" />
          </div>

          <!-- Nombre del Documento -->
          <div>
            <Label label="Nombre del Documento" required />
            <q-input v-model="form.nombreDocumento" outlined dense disable placeholder="Nombre completo"
              class="tw-rounded-lg" :rules="[required]" ref="nombreInput" />
          </div>

          <!-- Clasificación de Seguridad -->
          <div>
            <Label label="Clasificación de Seguridad" />
            <q-select v-model="form.clasificacionSeguridad" :options="securityLevels" outlined dense
              class="tw-rounded-lg" :disable="readonly" :rules="[inputRequired]" ref="clasificacionInput" />
          </div>
        </div>

        <Button v-if="authorizedOriginalDependencies.length > 0 || authorizedOriginalUsers.length > 0" color="secondary"
          label="Reclasificar Documento" type="primary" type-button="button" :disabled="readonly" class="tw-w-120"
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
                  <Button color="blue" type="tertiary" type-button="button" icon-left="trash"
                    @click="removeDependency(data.valueDependency)" :disabled="readonly" />

                  <Button icon-left="cog" color="blue" type="tertiary" type-button="button"
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
                  <Button color="blue" type="tertiary" type-button="button" icon-left="trash"
                    @click="removeUser(data.usuario)" :disabled="readonly" />

                  <Button icon-left="cog" color="blue" type="tertiary" type-button="button"
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
                  <!-- Campo de justificación -->
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <q-input v-model="dependency.justificacion" label="Justificación" type="textarea" autogrow
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
              label="Usted está modificando los niveles de seguridad del documento, por favor especifique el motivo"
              class="tw-w-full" />
          </q-card-section>

          <q-card-actions align="center" class="q-mt-sm tw-gap-4">
            <Button label="Cancelar" color="blue" type-button="button" type="tertiary" @click="cancelApproval"
              icon-left="circle-xmark" />
            <Button label="Aceptar" color="primary" type="primary" @click="reclasificarDocumento" />
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
import { useRoute } from "vue-router";
import { useAuthStore } from "stores/auth.store";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import { sgdeaArchivoAxios } from "src/services";

const justificacionContenido = ref('');
const route = useRoute();
const auth = useAuthStore();
const props = route.params["documento"] as string;
const nodeId = ref('');
// Implementacion de validaciones de campos
const formSeguridad = ref<any>(null);
const formReclasificacion = ref<any>(null);
const observacionModal = ref("");
const showApprovalModal = ref(false);

// Estado del componente
const readonly = ref(false);
const loading = ref(false);

// Niveles de seguridad
const securityLevels = ref(["PUBLICO", "CONFIDENCIAL", "RESERVADO"]);

// Formulario principal
const form = ref({
  codigoDocumento: "",
  nombreDocumento: "",
  clasificacionSeguridad: securityLevels.value[0],
  observacion: "",
});

const mostrarModalUser = ref(false)
const mostrarModalDependency = ref(false)
const usuarioActual = ref('')
const dependenciaActual = ref('')
// Autorizaciones
const selectedUser = ref<any[]>([]);
const selectedDependency = ref(null);
const authorizedOriginalUsers = ref<any[]>([]);
const authorizedOriginalDependencies = ref<any[]>([]);
const authorizedUsers = ref<any[]>([]);
const authorizedDependencies = ref<any[]>([]);
const dependenciaSearch = ref("");

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

// Métodos
const validateAndReclassify = async () => {
  try {
    if (!validateForm()) return;
    loading.value = true;

    const usersPermission =
      authorizedUsers.value?.length > 0
        ? authorizedUsers.value.map((auth) => ({
          user: auth.usuario.user,
          userName: auth.usuario.label,
          justificacion: auth.justificacion,
        }))
        : [];

    const dependenciesPermission =
      authorizedDependencies.value?.length > 0
        ? authorizedDependencies.value.map((dep) => ({
          dependencyId: dep.valueDependency,
          justificacion: dep.justificacion,
        }))
        : [];
    const payload = {
      securityLevel: form.value.clasificacionSeguridad,
      documentId: props,
      justification: justificacionContenido.value,
      username: auth.userInfo.username,
      dependenciesPermission,
      usersPermission,
    };

    const permissionsResponse = await sgdeaArchivoAxios.post(
      "/expediente/seguridad/documento/gestionar-permisos",
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
    codigoDocumento: form.value.codigoDocumento,
    nombreDocumento: form.value.nombreDocumento,
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
    // Cargar permisos
    const permissionsResponse = await sgdeaArchivoAxios.get(
      `/expediente/seguridad/documento/${props}`
    );

    // Cargar dependencias autorizadas
    if (permissionsResponse.status === 200) {
      const data = permissionsResponse.data;
      justificacionContenido.value = data.justificacion;
      form.value.clasificacionSeguridad = data.nivelSeguridad || '';

      authorizedDependencies.value = (data.dependencias || []).map((dep: any) => ({
        labelDependency: dep.nombre,
        valueDependency: dep.id,
        justificacion: dep.justificacion,
      }));
      dependenciaSearch.value = authorizedDependencies.value[0].codigo + '-' + authorizedDependencies.value[0].labelDependency;

      authorizedUsers.value = (data.usuarios || []).map((user: any) => ({
        usuario: {
          user: user.user,
          label: user.userName,
        },
        justificacion: user.justificacion,
      })) || [];

      authorizedOriginalDependencies.value = authorizedDependencies.value;
      authorizedOriginalUsers.value = authorizedUsers.value;
    }
  } catch (error) {
    console.info("No hay permisos para el documento:", error);
  }
};

const documento = ref<any>({});

onMounted(async () => {
  const response = await sgdeaArchivoAxios.get(
    `/record/getByNode/${props}`
  );
  if (response.status === 200 || response.status === 201) {
    documento.value = response.data;

    form.value = {
      codigoDocumento: response.data.codUnidad,
      nombreDocumento: response.data.nombre,
      clasificacionSeguridad:
        response.data.securityLevel || securityLevels.value[0],
      observacion: response.data.justificacionSeguridad,
    };
  }

  nodeId.value = documento.value.nodeId;

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

const reclasificarDocumento = async () => {
  const isValidateReclasificacion = await formReclasificacion.value.validate();
  if (!isValidateReclasificacion) {
    toast.error("La justificación es obligatoria");
    return;
  }

  try {
    const payload = {
      securityLevel: form.value.clasificacionSeguridad,
      documentId: nodeId.value,
      justification: observacionModal.value,
      username: auth.userInfo.username,
    };
    await sgdeaArchivoAxios.post(
      "/expediente/seguridad/reclasificar-documento",
      payload
    );

    toast.success("Documento reclasificado correctamente");
    showApprovalModal.value = false;
    fetchInitialData();
  } catch (error) {
    toast.error("Ocurrió un error al reclasificar el documento");
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
