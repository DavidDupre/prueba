<template>
  <div class="q-pa-xl">
    <h5 class="text-weight-bold text-h5" style="margin-bottom: 20px">Escalar</h5>
    <div class="row q-col-gutter-md">
      <div class="col" style="width: 50%">
        <q-card class="q-pa-md container_background" style="height: 570px">
          <span class="custom-label text-weight-bold"
            >Seleccione los usuarios que desea escalar</span
          >
          <q-input
            v-model="searchUser"
            outlined
            dense
            placeholder="Buscar colaborador..."
            class="q-mb-md"
            :style="{ maxWidth: '100%', marginTop: '20px' }"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-scroll-area style="height: 450px">
            <q-table
              :rows="filteredAvailableUsers"
              :columns="columnsAvailable"
              row-key="id"
              flat
              dense
              :rows-per-page-options="[0]"
              hide-pagination
            >
              <template v-slot:body-cell-seleccionar="props">
                <q-td :props="props">
                  <q-checkbox
                    :model-value="false"
                    color="primary"
                    @update:model-value="selectUser(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-scroll-area>
        </q-card>
      </div>
      <div class="col" style="width: 50%">
        <q-card class="q-pa-md container_background" style="height: 570px">
          <span class="custom-label text-weight-bold"
            >Estos son los usuarios que ha seleccionado</span
          >
          <q-scroll-area style="height: 520px; margin-top: 20px">
            <div class="q-gutter-sm">
              <div
                v-for="user in selectedUsers"
                :key="user.id"
                class="flex items-center q-mb-sm"
                style="
                  border: 2px solid #6b737c;
                  font-size: 1rem;
                  border-radius: 20px;
                  display: inline-flex;
                  min-width: 0;
                  max-width: 340px;
                  padding: 6px 16px;
                  margin-right: 10px;
                "
              >
                <q-icon name="person_outline" size="20px" />
                <span style="margin: 0 10px; font-weight: 500">{{ user.colaborador }}</span>
                <q-icon name="close" size="20px" class="cursor-pointer" @click="removeUser(user)" />
              </div>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </div>
    <div>
      <h5 class="text-weight-bold text-h5" style="margin-bottom: 20px">Motivo de escalamiento</h5>
      <div>
        <FormComponentModel v-model="formData" :form="finalForm" />
      </div>
    </div>
  </div>
  <!-- Botones de Acción al final -->
  <div v-if="isEditing" class="row justify-center q-mt-md q-gutter-sm">
    <component-button
      flat
      :colorButton="'secondary'"
      :colorText="'secondary'"
      :class="'q-mb-md'"
      text="Cancelar"
      @click="cancelEdit"
      style="width: 120px; height: 42px"
    />
    <component-button
      :colorButton="'primary'"
      :colorText="'white'"
      :class="'q-mb-md'"
      text="Escalar"
      @click="modalVisibleTotal = true"
      style="width: 120px; height: 42px"
    />
  </div>
  <!-- Modal de Confirmación -->
  <template v-if="modalVisibleTotal">
    <MultiPurposeDialog
      v-if="modalVisibleTotal"
      type="question"
      :title="'Confirma antes de continuar'"
      :subtitle="'¿Desea escalar la solicitud para continuar?'"
      accept-label="Si"
      cancel-label="No"
      :action="saveChanges"
      :cancel-action="
        () => {
          modalVisibleTotal = false;
          return false;
        }
      "
    />
  </template>
</template>

<script setup lang="ts">
import { computed, reactive, ref, inject, Ref } from 'vue';
import { useQuasar } from 'quasar';
import FormJs from '../../../boot/formEscalar.json';
import FormComponentModel from '@shell/components/Forms/FormComponentModel.vue';
import { fieldConfigParser } from '@shell/components/Forms/formParser';
import MultiPurposeDialog from '@shell/components/MultiPurposeDialog.vue';
import ComponentButton from '@shell/components/ComponentButton.vue';

const $q = useQuasar();
const searchUser = ref('');
const modalVisibleTotal = ref(false);
const isEditing = ref(true);
const selectedUser = ref('Juan Pérez García'); // Usuario seleccionado
const activeTab = inject<Ref<string>>('activeTab');
const changeProcessStatus =
  inject<(newStatus: 'por-asignar' | 'por-gestionar' | 'en-gestion') => void>(
    'changeProcessStatus',
  );

// Datos de usuarios disponibles
const availableUsers = ref([
  {
    id: 1,
    colaborador: 'Juan Pérez García',
    cargo: 'Analista Jurídico',
    grupo: 'Juridico',
    motivo: 'Especialista en derecho laboral',
  },
  {
    id: 2,
    colaborador: 'María González López',
    cargo: 'Abogada Senior',
    grupo: 'Juridico',
    motivo: 'Experiencia en casos complejos',
  },
  {
    id: 3,
    colaborador: 'Carlos Rodríguez Díaz',
    cargo: 'Asistente Legal',
    grupo: 'Soporte Legal',
    motivo: 'Disponibilidad inmediata',
  },
  {
    id: 4,
    colaborador: 'Ana Martínez Ruiz',
    cargo: 'Coordinadora Jurídica',
    grupo: 'Coordinación',
    motivo: 'Gestión de procesos ministeriales',
  },
  {
    id: 5,
    colaborador: 'Luis Hernández Castro',
    cargo: 'Abogado Junior',
    grupo: 'Juridico',
    motivo: 'Apoyo en trámites administrativos',
  },
]);

// Usuarios seleccionados
const selectedUsers = ref<typeof availableUsers.value>([]);

// Columnas para tabla de usuarios disponibles
const columnsAvailable = [
  {
    name: 'seleccionar',
    label: '',
    align: 'center',
    field: 'seleccionar',
    style: 'width: 50px',
  },
  {
    name: 'colaborador',
    label: 'Colaborador',
    align: 'center',
    field: 'colaborador',
    sortable: true,
  },
  {
    name: 'cargo',
    label: 'Cargo',
    align: 'center',
    field: 'cargo',
    sortable: true,
  },
  {
    name: 'grupo',
    label: 'Grupo',
    align: 'center',
    field: 'grupo',
    sortable: true,
  },
];

// Filtrar usuarios disponibles
const filteredAvailableUsers = computed(() => {
  const search = searchUser.value.toLowerCase();
  return availableUsers.value.filter((user) => {
    const isNotSelected = !selectedUsers.value.some((selected) => selected.id === user.id);
    if (!search) return isNotSelected;

    return (
      isNotSelected &&
      (user.colaborador.toLowerCase().includes(search) ||
        user.cargo.toLowerCase().includes(search) ||
        user.grupo.toLowerCase().includes(search) ||
        user.motivo.toLowerCase().includes(search))
    );
  });
});

// Seleccionar usuario
const selectUser = (user: (typeof availableUsers.value)[0]) => {
  if (!selectedUsers.value.some((selected) => selected.id === user.id)) {
    selectedUsers.value.push(user);
    $q.notify({
      type: 'positive',
      message: `Usuario ${user.colaborador} agregado`,
      position: 'top-right',
    });
  }
};

// Remover usuario
const removeUser = (user: (typeof availableUsers.value)[0]) => {
  const index = selectedUsers.value.findIndex((selected) => selected.id === user.id);
  if (index > -1) {
    selectedUsers.value.splice(index, 1);
    $q.notify({
      type: 'info',
      message: `Usuario ${user.colaborador} removido`,
      position: 'top-right',
    });
  }
};

const props = defineProps<{
  cotizacionId?: string | number;
  isEdit?: boolean;
  isCotFromCore: boolean;
  ramo: number;
}>();

// estado reactivo para los valores del formulario (v-model)
const formData = reactive<Record<string, unknown>>({});

// helper que soporta tanto JSON-objeto como función exportada
const resolveFormSource = (src: unknown, ramo: number | string) => {
  if (typeof src === 'function') {
    return src(ramo);
  }
  const key = String(ramo);
  return src && typeof src === 'object' && key in src ? (src as Record<string, unknown>)[key] : src;
};

const formFieldsDatosGenerales = computed(() => {
  const resolved = resolveFormSource(FormJs, props.ramo);
  return resolved;
});

const finalForm = computed(() => fieldConfigParser(formFieldsDatosGenerales.value));

const cancelEdit = () => {
  modalVisibleTotal.value = false;
  isEditing.value = true;
  $q.notify({
    type: 'info',
    message: 'Asignación cancelada',
    position: 'top-right',
  });
};

const saveChanges = () => {
  modalVisibleTotal.value = false;
  isEditing.value = false;

  // ACTUALIZAR EL ESTADO Y REDIRIGIR
  if (changeProcessStatus) {
    changeProcessStatus('en-gestionar');
  }

  // Redirigir a la pestaña de solicitud de escalamiento
  if (activeTab) {
    activeTab.value = 'solicitud-escalamiento';
  }

  $q.notify({
    type: 'positive',
    message: `Proceso escalado exitosamente`,
    position: 'top-right',
  });
};
</script>
