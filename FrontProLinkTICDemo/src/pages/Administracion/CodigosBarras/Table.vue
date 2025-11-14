
<template>
  <div>
    <q-table flat :rows-per-page-options="[5, 25, 50, 100]" :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId"
      table-header-class="text-black text-h6 " class="q-mr-md full-width" rows-per-page-label="Páginas"
      selection="multiple" v-model:selected="selection">
      <template v-slot:body-cell-estados="props">
        <q-td class="">
          <q-toggle @update:model-value="confirm(props.row)" v-model="props.row.estados" size="xl">

          </q-toggle>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">

        <q-td class="text-center">
          <q-btn size="sm" color= "secondary" :icon="icon || 'edit'" flat
            @click="editRow(props.row.id_seriesubserie || props.row.id || props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
                 @click="viewDetails(props.row[rowId])" />
        </q-td>


      </template>
      <template v-slot:body-cell-actions="props">

        <q-td class="text-center">
          <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat
                 @click="editData(props.row[rowId])" />
          <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
                 @click="handleSecondIcon(props.row[rowId])" />
        </q-td>


      </template>
      <template v-slot:no-data="{ icon, message, filter }">
        <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
          <img v-lazy :data-url="NoData" alt="" width="120">
          <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
            {{ msgNoData ? msgNoData : 'No existe data por el momento' }}
          </span>
        </div>
      </template>
      <template v-slot:body-cell-procedimiento="props">
        <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
          <p class="tw-text-center tw-border-0">
            {{ collapseContent(props.row.procedimiento) }}

          </p>
          <div class="tw-flex tw-justify-end" v-if="props.row.procedimiento?.length >= 200">
            <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
              {{ showingFullText ? 'Ver menos' : 'Ver más'}}
            </q-btn>
          </div>

        </div>
      </template>
    </q-table>
  </div>


  <Modal v-model="confirmSingleModal" title="¡Espera un momento!" :text="`¿Estás seguro de activar el tipo de codigo de barras seleccionado?`" text-button="Sí"
        @handleAccept="confirmSingleModal = false, singleSuccess = true;" @closeModal="handleModal"
        label="Confirmar" cancelButton text-button-cancel="No"/>

        <Modal v-model="confirmDeactivateSingleModal" title="¡Espera un momento!" :text="`¿Estás seguro de desactivar el tipo de codigo de barras seleccionado?`" text-button="Sí"
        @handleAccept="confirmDeactivateSingleModal = false, singleSuccessDeactivate = true;" @closeModal="handleModal"
        label="Confirmar" cancelButton text-button-cancel="No"/>


        <Modal v-model="singleSuccess" title="Activacion exitosa" is-success :text="singleSucessMsg" text-button="Sí"
        @handleAccept="handleModals"
        label="Confirmar" /> 

        <Modal v-model="singleSuccessDeactivate" title="Desactivacion exitosa" is-success :text="singleSucessDeactiveMsg" text-button="Sí"
        @handleAccept="handleModals"
        label="Confirmar" /> 
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Modal from 'components/Modal/Modal.vue';
import NoData from "assets/filterImage.svg"

const props = withDefaults(defineProps<{
  TABLE_BODY: any[],
  TABLE_HEADER: any[],
  selection: "none" | "single" | "multiple" | undefined,
  itemSelected: any[],
  icon?: string,
  keyId?: string,
  msgNoData: string,
  rowId: string,
  isSecondIcon: boolean,
  secondIcon: string,
  // buscar: string,
  // action: string,
  // target?: string,
}>(), {
  selection: "none",
  keyId: "codigo",
  secondIcon: "eye",
  // target: ""
})
const vuerouter = useRouter()
const route = useRoute()

const confirmSingleModal = ref(false)
const confirmDeactivateSingleModal = ref(false)
const singleSuccess = ref(false)
const singleSuccessDeactivate = ref(false)
const singleSucessMsg = ref(``)
const singleSucessDeactiveMsg = ref('')


const selection = ref([])
const showingFullText = ref(false)

const emit = defineEmits(['update:itemSelected', 'handleEditData', 'handleSecondIcon'])


const editData = (id: number) => {
  emit('handleEditData', id)
}

const singleRow = ref();


const confirm  = (row:any) => {
  // confirmSingleModal.value = true;

  singleRow.value = row;

  if(row.estados) {
    confirmDeactivateSingleModal.value = true;

    singleSucessDeactiveMsg.value = `Se desactivó correctamente el tipo códigos de barras "${row.id} y ${row.tiposCodigo}"`
  } else {
    confirmSingleModal.value = true;
    singleSucessMsg.value = `Se activó correctamente el tipo códigos de barras "${row.id} y ${row.tiposCodigo}"`
  }

}



const handleSecondIcon = (id: number) => {
  emit('handleSecondIcon', id)
}

watch(selection, (newdateData) => {
  selection.value = newdateData
  emit('update:itemSelected', selection.value)
});


function editRow(id: number) {
  vuerouter.push(route.path + '/ver/' + id)
}

function viewDetails(id: number) {
  vuerouter.push(route.path + '/visualizacion/' + id)
}

const collapseContent = (text = '') => {
  if (showingFullText.value) {
    return text;
  }
  return `${text?.slice(0, 200).trim()}`;
}

const handleModals = () => {
  if (singleSuccess.value | singleSuccessDeactivate.value) {
      singleSuccess.value = false
      singleSuccessDeactivate.value = false
  } else {
    
  }
}

const handleModal = () => {
  singleRow.value.estados ? (singleRow.value.estados = false, confirmSingleModal.value = false) : (singleRow.value.estados = true, confirmSingleModal.value = false, confirmDeactivateSingleModal.value = false)
}


</script>

<style lang="scss" scoped></style>

