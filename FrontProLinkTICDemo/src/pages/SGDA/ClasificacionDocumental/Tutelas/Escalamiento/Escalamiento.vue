<template>
  <q-form ref="escalar">
    <!-- <q-card>
      <q-expansion-item default-opened class='text-bold'>
        <template v-slot:header>
            <div class="col row">
                <h3 class="tw-text-xl">Asignación</h3>
            </div>
        </template>
         <div class="tw-bg-white q-mt-lg tw-rounded-md">
            <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex tw-flex-row">
              <div class="width-container tw-w-1/2 q-px-sm tw-rounded-xl" style="border: 1px solid #E3E4E5;">
                <TableAsignar
                  :TABLE_BODY="listUsers"
                  :TABLE_HEADER="columnsAsignar"
                  @update:item-selected="handleAssign"
                />
              </div>
              <div class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl" style="border: 1px solid #e3e4e5">
                <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
                  Estos son los usuarios que ha seleccionado
                </span>
                <div class="flex wrap tw-gap-3 q-pt-sm">
                  <div v-for="(asign, index) in cardsAsignar" :key="index">
                    <div v-if="asign.visible" class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl" style="border: 1px solid #e3e4e5">
                      <q-icon size="24px" name="person_outline" />
                      {{ asign.name }}
                      <q-icon class="tw-cursor-pointer" size="24px" name="close" @click="removeCardAsignar(index)" />
                    </div>
                  </div>
                  <div v-if="cardsAsignar.length === 0" class="tw-text-red-500 text-weight-bold">
                    Debe seleccionar al menos un usuario
                  </div>
                </div>
              </div>
            </div>
          </div>
      </q-expansion-item>
    </q-card> -->

    <MotivoEscalamiento ref="step1Sal" :form="form" />

    <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
      <q-btn label="Cancelar" type="reset" text-color="black" color="accent"
             class="tw-rounded-xl tw-w-[240px] tw-border-black tw-border tw-border-solid !tw-p-2"
             @click="cancelModal = true"/>
      <q-btn label="Escalar" @click="createEscalamiento" text-color="white" color="primary"
             class="tw-rounded-xl !tw-p-2 tw-w-[240px]"/>
    </div>

    <Modal v-model="cancelModal" title="Confirmación" :is-success="false"
           @handleAccept="clear"
           cancel-button text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?" @close-modal="cancelModal = false" textButtonCancel="No" text-button="Si" type="button"/>
    <Modal v-model="showModal" title="Creación exitosa" :text="text" is-success text-button="¡Ok!"
           @handleAccept="handleModal" persistent/>
    <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
           @handleAccept="handleModal"/>

  </q-form>
</template>

<script lang="ts" setup>
import {Ref, onMounted, ref, watch, onBeforeMount} from "vue";
import {useRoute, useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import Modal from 'components/Modal/Modal.vue';
import TableAsignar from "components/Tables/TableAsignar.vue";

import {useLoadingStore} from "src/stores/loading.store";

import {useStateStore} from "src/stores/status.store";
import {columnsAsignar, routes} from "../";
import MotivoEscalamiento from "./MotivoEscalamiento.vue";
import { toast } from "src/helpers/toast";


const props = withDefaults(defineProps<{
  detailsTutela: any
}>(), {
})
const {showLoading, hideLoading} = useLoadingStore();

const route = useRoute();
const showRoute = ref(route.params.id);

const escalar = ref()
let showModal = ref(false);
const text = ref('')

const storeStatus = useStateStore();
const state = storeToRefs(storeStatus);

let fechaValida = ref(false)
const valida = () => {
  fechaValida.value = true
}

const errorModal = ref(false)
const cancelModal = ref(false)

const insumo = `Si la información se encuentra en los aplicativos de la compañía, se emitirá la respuesta de fondo a la Gerencia Jurídica, en un plazo máximo de cuatro (4) horas.
Si el insumo técnico requiere un escalamiento, el plazo para entregar se extiende a ocho (8) horas, en caso de tener más de un escalamiento el plazo es de doce (12) horas.
Si el término concedido por la autoridad judicial para responder el requerimiento es inferior a 4 horas, se informará a la operación el detalle del plazo de cada radicado y se gestionará conforme a la solicitud.`

const form: Ref<any> = ref({
  // data: "",
  // estado: "",
  // tramite: "",
  // ciudad: "",
  // asignado: "",
  // motivo: "",

  asunto: '',
  etapa: '',
  radicado: '',
  tipoDoc: '',
  numeroDoc: '',
  afectado: '',
  fecha: '',
  insumo,
  pretension: '',
  observaciones: '',
  archivos: [],
});

//cards asignar
const cardsAsignar = ref([]);

const asignar = ref([]);
const listUsers = ref([]);


const handleAssign = (array: any[]) => {
  cardsAsignar.value = array.map((item) => ({
    name: item.colaborador,
    visible: true,
  }));
};


const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
  } else {
    errorModal.value = false
  }
};


const clear = () => {
  form.value = {
    asunto: '',
    etapa: '',
    radicado: '',
    tipoDoc: '',
    numeroDoc: '',
    afectado: '',
    fecha: '',
    insumo,
    pretension: '',
    observaciones: '',
    archivos: [],
  }

  cancelModal.value = false;
}

const createEscalamiento = async () => {
  if (await escalar.value.validate() && fechaValida.value) {
    showModal.value = true;
    text.value = 'Creando...'
  } else {
    toast.error('Complete todos los campos para proceder a radicar.')
  }
}


onMounted(() => {
  const informacionProceso = props.detailsTutela.informacionProceso
  form.value = {
    asunto: '',
    etapa: props.detailsTutela.etapaProcesal.nombre,
    radicado: props.detailsTutela.idRadicado,
    tipoDoc:  informacionProceso.tipoDocumentoAfectado,
    numeroDoc: informacionProceso.numeroDocumentoAfectado,
    afectado: informacionProceso.primerNombreAfectado + ' ' +
    informacionProceso.segundoNombreAfectado + ' ' +
    informacionProceso.primerApellidoAfectado + ' ' +
    informacionProceso.segundoApellidoAfectado,
    insumo,
    fecha: '',
    pretension: '',
    observaciones: '',
    archivos: [],
  }
})

</script>
