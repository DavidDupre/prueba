<template>
  <q-dialog v-model="showModal" persistent>
    <q-card style="max-width: 1000px;" :class="['tw-px-3 ', 'tw-h-[auto] tw-w-[700px]', 'tw-py-6']">
      <div class="tw-flex tw-justify-center tw-mt-3">
        <span class="tw-rounded-[100px] tw-flex tw-justify-center"
              style="background-color: #F6F6F9; width: 82px; height: 82px">
          <img v-lazy :data-url="InterrogationModal" alt="check" />
        </span>
      </div>
      <q-card-section class="flex row justify-center items-center">
        <div class="col-12">
          <p class="tw-text-[24px] text-center tw-font-bold q-mt-xs">
            Confirmación
          </p>
        </div>
        <div class="col-12">
          <p :class="['tw-text-[18px] text-center tw-mt-3']">
            ¿Desea cerrar esta devolución?
          </p>
        </div>
        <div class="col-12">
          <label class="q-px-md tw-text-label">Motivo de cierre * {{form.observaciones ? form.observaciones.length : '0'}}/1000
            <q-input type="textarea" outlined label="Inserte" dense emit-value v-model="form.observaciones"
                     :rules="[inputRequired, v => maxLengthInput(1000, v)]" />
          </label>
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn label="Cancelar" color="accent" text-color="black"
               class="tw-p-3" style="width: 200px; height: 50px;" flat @click="$emit('backView')" v-close-popup/>
        <q-btn label="Aceptar" style="width: 200px; height: 50px;" text-color="white" color="secondary" v-close-popup
               class="tw-rounded-xl tw-p-3  tw-ml-4" @click="handleAccept"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">

import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { toast } from "src/helpers/toast";
import { crearTrazabilidad } from 'src/helpers/trazabilidad';
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from 'src/services';
import {inputRequired, maxLengthInput} from "src/helpers/validations";
import InterrogationModal from "assets/interrogation-modal.svg";

const router = useRouter();
const cardsAsignar = ref([]);
const listUsersOriginal = ref([])
const { getUserInfo } = useAuthStore();
const userInfo = ref();
const formRef = ref()
const showModal = ref(true)
const filterValue = ref('')
const filteredRows = ref(listUsersOriginal.value)
const selection = ref([])
const form = ref({
  observaciones: '',
  usuarios: [],
})

const props = withDefaults(defineProps<{
  detallesRadicado: any,
  typeFlujoSgda: string,
  pathBandeja: string,
}>(), {
})

const emit = defineEmits(['backView'])

const columnsAsignar2 = [
  {
    name: "colaborador",
    label: "Colaborador",
    field: "colaborador",
    sortable: true,
    align: "center",
  },
  {
    name: "cargo",
    label: "Cargo",
    field: "cargo",
    sortable: true,
    align: "center",
  },
  {
    name: "grupo",
    label: "Oficina",
    field: "grupo",
    sortable: true,
    align: "center",
  },
];

onMounted(async () => {
  getAllRegisters()

});


watch(filterValue, (newValue) => {
  if (newValue) {
    filteredRows.value = listUsersOriginal.value.filter(row =>
      row.colaborador.toLowerCase().includes(newValue.toLowerCase())
    );
  } else {
    filteredRows.value = listUsersOriginal.value;
  }
});

async function getAllRegisters() {
  try {
    userInfo.value = await getUserInfo();

    const oficina = userInfo.value.oficina


    const { data: gestionadores } = await sgdeaAxios.get(`/api/usuarios/rolYoficina?rolName=Aprobador&oficinaId=${oficina}`);

      listUsersOriginal.value = gestionadores.map((item) => ({
        colaborador: item.firstname + ' ' + item.lastname,
        enabled: item.enabled,
        id: item.id,
        user: item.userName,
        cargo: item.cargo,
        grupo: item.usuarioRelaciones[0]?.oficina?.nombre,
      })).sort((a, b) => a.colaborador.localeCompare(b.colaborador))

  } catch (error) {
    console.error(error);
  }
}

const flujoSgda = {
  "Correpondencia-Ventanilla": 1,
  "Comunicacion Normal": 2,
  "Comunicacion Masivo": 3,
  "Comunicacion Manual": 4,
  "PQRD": 5,
  "Tutelas": 6,
  "Entes de control": 7,
  "Medicina Laboral": 8,
}

const acortadoresFlujos = {
  "Correpondencia-Ventanilla": "COR",
  "Tutelas": "TUT",
}

const handleAccept = async () => {
  if (form.value.observaciones && form.value.observaciones.trim().length > 0) {
    const idCaso = props.typeFlujoSgda.includes('Tutelas') ? props.detallesRadicado.idTutela : props.detallesRadicado.id

    const response = await sgdeaAxios.put(`/envios/cierreDevolucion/${idCaso}/${flujoSgda[props.typeFlujoSgda]}`,
      {
        motivoRechazo: form.value.observaciones,
      })
    if (response.status === 200) {
      const tramite = props.typeFlujoSgda.includes('Correpondencia') ? props.detallesRadicado.tipoTramite.nombre : props.typeFlujoSgda

      await crearTrazabilidad({
        proceso: `${acortadoresFlujos[props.typeFlujoSgda]}${props.detallesRadicado.id || props.detallesRadicado.idTutela}`,
        secuencia: props.detallesRadicado.idRadicado,
        estado: props.detallesRadicado.estadoProceso.estado,
        descripcion: `Usuario:${userInfo.value.name} Detalle: Se ha cerrado la devolución`,
        comentario: 'Cerrado',
        nombre: userInfo.value.name,
        tramite,
        accion: `${userInfo.value.name} ha realizado el cierre de la devolución`,
      })
      toast.success('Se ha realizado el cierre de la devolución')
      await router.push(props.pathBandeja)
      showModal.value = false
    }
  }
}


</script>
<style>

</style>
