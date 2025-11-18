<template>
  <div class="q-pa-xl container_background">
    <h3 class="text-weight-bold text-h5" style="margin-bottom: 20px">Reasignación</h3>
    <div class="row q-col-gutter-md">
      <div class="col" style="width: 50%">
        <q-card class="q-pa-md container_background" style="height: 570px">
          <p>Seleccione los usuarios que desea asignar</p>
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
          <p>Estos son los usuarios que ha seleccionado</p>
          <q-scroll-area style="height: 520px; margin-top: 20px">
            <div v-if="selectedUsers.length === 0" class="text-center text-grey-6 q-pa-md">
              No hay usuarios seleccionados
            </div>
            <div v-else class="q-gutter-sm">
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

    <h3 class="info-section__title text-h6 text-weight-medium">Motivo de reasignación</h3>
    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12">
      <q-input
        class="mb-3"
        v-model="observations"
        type="textarea"
        label="Observaciones"
        outlined
        :maxlength="1000"
        counter
        input-style="resize:none"
      />
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
      text="Reasignar"
      @click="modalVisibleTotal = true"
      style="width: 120px; height: 42px"
    />
  </div>
  <!-- Modal de Confirmación -->
  <template v-if="modalVisibleTotal">
    <MultiPurposeDialog
      v-if="modalVisibleTotal"
      type="question"
      title="¡Espera un momento!"
      :subtitle="`¿Está seguro de reasignar el radicado <strong>${radicadoNumber}</strong> a la <strong>${selectedBranch}</strong>?`"
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
import { ref, computed } from 'vue';
import { useQuasar, QCard, QScrollArea, QInput, QIcon } from 'quasar';
import MultiPurposeDialog from '@shell/components/MultiPurposeDialog.vue';
import ComponentButton from '@shell/components/ComponentButton.vue';

const $q = useQuasar();
const observations = ref('');
const searchUser = ref('');
const modalVisibleTotal = ref(false);
const isEditing = ref(true);
const radicadoNumber = ref('ENT202050528002352');
const selectedBranch = ref('Sucursal Coordinadora ATLÁNTICO');

const cancelEdit = () => {
  modalVisibleTotal.value = false;
  isEditing.value = true;
  $q.notify({
    type: 'info',
    message: 'Reasignación cancelada',
    position: 'top-right',
  });
};

const saveChanges = () => {
  modalVisibleTotal.value = false;
  isEditing.value = false;

  $q.notify({
    type: 'positive',
    message: `Radicado ${radicadoNumber.value} reasignado a ${selectedBranch.value}`,
    position: 'top-right',
  });
};

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
    align: 'left',
    field: 'colaborador',
    sortable: true,
  },
  {
    name: 'cargo',
    label: 'Cargo',
    align: 'left',
    field: 'cargo',
    sortable: true,
  },
  {
    name: 'grupo',
    label: 'Grupo',
    align: 'left',
    field: 'grupo',
    sortable: true,
  },
  {
    name: 'motivo',
    label: 'Motivo',
    align: 'left',
    field: 'motivo',
    sortable: true,
  },
];

// Columnas para tabla de usuarios seleccionados
const columnsSelected = [
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
    align: 'left',
    field: 'colaborador',
    sortable: true,
  },
  {
    name: 'cargo',
    label: 'Cargo',
    align: 'left',
    field: 'cargo',
    sortable: true,
  },
  {
    name: 'grupo',
    label: 'Grupo',
    align: 'left',
    field: 'grupo',
    sortable: true,
  },
  {
    name: 'motivo',
    label: 'Motivo',
    align: 'left',
    field: 'motivo',
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
</script>
