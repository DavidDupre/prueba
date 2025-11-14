<template>
  <div class="q-pa-md tw-h-full">
    <q-card class="my-card tw-p-5" flat bordered>
      <q-card-section>
        <h1 class="tw-text-lg tw-font-bold">
          Metadatos incluidos al trámite y estado
        </h1>
      </q-card-section>
      <div class="table-container">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Trámite</th>
              <th class="text-center">Campo Obligatorio</th>
              <th class="text-center">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, index) in rows" :key="index">
              <tr>
                <td class="text-left">
                  <div style="display: flex; align-items: center">
                    <q-btn
                      v-if="row.options && row.options.length > 0"
                      color="orange"
                      flat
                      round
                      :icon="
                        row.showOptions
                          ? 'keyboard_arrow_up'
                          : 'keyboard_arrow_down'
                      "
                      @click="toggleOptions(index)"
                      class="q-ml-sm"
                      style="margin-right: 5px"
                    />
                    <span>{{ row.name }}</span>
                  </div>
                </td>
                <td class="text-center">
                  <q-toggle
                    v-model="row.accept"
                    @update:model-value="updateAccept(row)"
                  />
                </td>
                <td class="text-center">
                  <q-btn
                    color="orange"
                    flat
                    round
                    icon="delete"
                    @click="deleteRow(index)"
                  />
                </td>
              </tr>
              <tr v-if="row.showOptions">
                <td colspan="3">
                  <div
                    v-for="(option, oIndex) in row.options"
                    :key="`option-${index}-${oIndex}`"
                    class="option-item"
                  >
                    <div class="option-details">
                      <span class="tw-ml-32">{{ option.name }}</span>
                      <q-toggle class="tw-ml-20" v-model="option.active" />
                      <q-btn
                        color="orange"
                        flat
                        round
                        icon="delete"
                        @click="removeOption(row, oIndex)"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </q-markup-table>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { sgdeaAxios } from "src/services";
import { PropType } from "vue";

const props = defineProps({
  rows: {
    type: Array as PropType<Array<any>>,
    required: true,
  },
  toggleOptions: {
    type: Function as PropType<(index: number) => void>,
    required: true,
  },
  removeOption: {
    type: Function as PropType<(row: any, oIndex: number) => void>,
    required: true,
  },
});



const updateAccept = async (row: any) => {
  try {
    const response = await sgdeaAxios.put(
      `http://ms-sgdea.prolinkticdev.linktic.com/parametrizacion-formulario/updateVisible/${row.value}`,
      {
        id: row.value,
        obligatorio: row.accept,
      }
    );

  } catch (error) {
    console.error(error);
  }
};

const deleteRow = async (index: number) => {
  const rowToDelete = props.rows[index];
  try {
    // Realiza la llamada para eliminar el elemento en el backend
    const response = await sgdeaAxios.delete(
      `http://ms-sgdea.prolinkticdev.linktic.com/parametrizacion-formulario/delete?param_id=${rowToDelete.value}`
    );


    // Actualiza localmente el array de rows eliminando el elemento
    props.rows.splice(index, 1);
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.table-container {
  max-height: 300px;
  overflow-y: auto;
}

/* Personaliza la barra de desplazamiento */
.table-container::-webkit-scrollbar {
  width: 12px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb {
  background-color: #ff7500;
  border-radius: 6px;
  border: 3px solid #f1f1f1;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background-color: #e66300;
}

.option-item {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}

.option-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
