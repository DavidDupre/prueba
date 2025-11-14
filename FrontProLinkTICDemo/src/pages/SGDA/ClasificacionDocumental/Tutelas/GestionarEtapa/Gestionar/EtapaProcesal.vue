<template>
    <q-expansion-item dense expand-separator default-opened class="tw-bg-white q-mt-md" style="border-radius: 5px">
        <template v-slot:header>
            <h3 class="text-bold tw-text-xl tw-flex-1 q-py-md">Datos del Proceso</h3>
        </template>
        <!-- <div class="tw-p-4 tw-flex tw-gap-8">
            <div class="tw-w-32 tw-text-center tw-flex tw-flex-col tw-gap-1 tw-items-center tw-cursor-pointer"
                v-for="{ nombre, persistenceId } in listEtapas" :key="persistenceId"
                @click="handleSteps(nombre, persistenceId)">
                <div
                    :class="['tw-rounded-full tw-border-solid tw-border-8 tw-h-8 tw-w-8', stepName === nombre ? 'tw-border-primary' : 'tw-border-gray']">
                </div>
                <span class="tw-font-bold">{{ nombre }}</span>
            </div>
        </div> -->

        <q-card class="tw-flex-col" style="box-shadow: none">
            <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">
                    <label for="" class="tw-text-gray-dark">Radicado de Entrada *</label>
                    <q-input v-model="form.radicadoEntrada" filled placeholder="" disable />
                </span>
            </div>
            <div v-if="validForm" class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">
                    <label for="" class="tw-text-gray-dark">Radicado Etapa Procesal *</label>
                    <q-select v-model="form.radicadoEtapa" :disable="etapasOp.length > 1 ? false : true" emit-value
                        placeholder="Seleccione" outlined :options="etapasOp" dense :rules="[]" map-options />
                </span>
            </div>
            <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">
                    <label for="" class="tw-text-gray-dark">Número de Siniestro</label>
                    <q-input v-model="form.numeroSiniestro" dense placeholder="Inserte" outlined :rules="[onlyNumbers]"
                        :disable="findRoles([1]) || isPorAprobar" />
                </span>
            </div>
            <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">
                    <label for="" class="tw-text-gray-dark">Dependencia *</label>
                    <q-select v-model="form.dependencia" :disable="!findRoles([0, 3]) || isPorAprobar" use-chips
                        :autofocus="true" fill-input input-debounce="0" multiple
                        :rules="[findRoles([0, 3]) ? inputRequired : null]" use-input @filter="filterDep" emit-value
                        placeholder="Buscar" outlined map-options :options="saveDepOp">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </span>
            </div>
            <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">

                    <label for="" class="tw-text-gray-dark">Causal </label>
                    <q-select v-model="form.causal" multiple use-chips use-input @filter="filterCau" emit-value
                        placeholder="Buscar" outlined :options="saveOpCaus" map-options
                        :disable="findRoles([1]) || isPorAprobar">
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    Sin resultados
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>
                </span>
            </div>


            <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">
                    <!-- {{ form.fechaVencimiento }} -->
                    <label for="" class="tw-text-gray-dark">Fecha de Vencimiento <span v-if="validRequiredDate()">*</span> </label>
                    <q-input :disable="findRoles([3])" v-model="form.fechaVencimiento" outlined :rules="validRequiredDate() ? [inputRequired, validateHourRange] : [validateHourRange]">
                        <template v-slot:prepend>
                            <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-date v-model="form.fechaVencimiento" :options="optionsFn" :rules="validRequiredDate() ? [inputRequired, validateHourRange] : [validateHourRange]" mask="DD/MM/YYYY HH:mm">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                        </div>
                                    </q-date>
                                </q-popup-proxy>
                            </q-icon>
                            <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                    <q-time v-model="form.fechaVencimiento"
                                        :rules="validRequiredDate() ? [inputRequired] : []" mask="DD/MM/YYYY HH:mm"
                                        format24h :hour-options="allowedHours"
                                        :minute-options="getMinuteOptions(form.fechaVencimiento)">
                                        <div class="row items-center justify-end">
                                            <q-btn v-close-popup label="Cerrar" color="primary" flat />
                                        </div>
                                    </q-time>
                                </q-popup-proxy>
                            </q-icon>
                        </template>
                    </q-input>
                </span>
            </div>
            <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">
                    <label for="" class="tw-text-gray-dark">Estado de Etapa *</label>
                    <q-select v-model="form.estadoEtapa" :rules="[findRoles([0, 3]) ? inputRequired : null]"
                        :disable="findRoles([1]) || !(estadosEtapasOp.length > 0) || isPorAprobar"
                        placeholder="Seleccione" outlined :options="estadosEtapasOp" dense map-options />
                </span>
            </div>
            <div class='tw-flex tw-flex-col tw-w-full tw-p-4'>
                <span class="tw-font-bold">
                    <label for="" class="tw-text-gray-dark">Observación {{ form.observacion.length }}/5000 </label>
                    <q-input input-debounce="0" label="Inserte" dense outlined class="tw-rounded-lg"
                        v-model="form.observacion" :rules="[(v) => maxLengthInput(5000, v)]" type="textarea"
                        :disable="isPorAprobar" />
                </span>
            </div>
        </q-card>
    </q-expansion-item>
</template>

<script lang="ts" setup>
import { inputRequired, maxLengthInput, onlyNumbers } from 'src/helpers/validations';
import { Ref, defineEmits, ref, onMounted, watch, onBeforeMount, computed } from 'vue'
import { fourthFormatDate } from "src/helpers/formtDate";
import axios from "axios";
import moment from "moment/moment"
import { useAuthStore } from "stores/auth.store";
import {
    useDependencies,
    useCauses,
    useEstadoEtapas,
    useUnidadTiempo
} from "src/composables/useVersion";
import { toast } from 'src/helpers/toast';
const props = withDefaults(defineProps<{
    valueEtapa: any;
    stepName: string;
    listEtapas: any[];
    handleSteps: () => {};
    radicadosEtapa: any;
    datosGestion: any;
    validForm: any;
    form: any,
    etapa: any
    isPorAprobar: boolean
}>(), {
    valueEtapa: null,
});

const emit = defineEmits(['changeRadicado', 'resetForm'])

const loadDep = ref(false)
const firstTime = ref(true)
const pruebaMulti = ref('')
const opCauses = ref([])
const saveOpCaus = ref()
const activeWatchDep = ref(true)
const { optionsDependencies } = useDependencies()
const { opUnidadTiempo } = useUnidadTiempo()
const saveDepOp = ref(optionsDependencies.value)
const userInfo = ref()

// Horas permitidas: de 8:00 AM a 5:00 PM
const allowedHours = [8, 9, 10, 11, 12, 13, 14, 15, 16]

const { getUserInfo } = useAuthStore();
const allowedTime = (hr, min, sec) => {
    // Configura las horas permitidas (ejemplo: de 9 a 18)
    return hr === 16 ? hr >= 7 && hr <= 16 && min <= 30 : 7 && hr <= 16;

}

function optionsFn(date) {
    return date >= moment().format('YYYY/MM/DD')
}

const etapasOp = ref()
const estadosEtapasOp = ref([])

etapasOp.value = props.radicadosEtapa.listadoRadicados.filter((val) => val.idRadicado != props.form.radicadoEtapa).map((item) => ({
    value: item,
    label: item.idRadicado
}))

const filterDep = (val, update, abort) => {
    update(() => {
        const needle = val.toLowerCase()
        saveDepOp.value = optionsDependencies.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}

const filterCau = (val, update, abort) => {
    update(() => {
        const needle = val.toLowerCase()
        saveOpCaus.value = opCauses.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
    })
}


function validateHourRange(dateTimeStr) {
  if (!dateTimeStr) return 'La hora es obligatoria';
  const [date, time] = dateTimeStr.split(' ');
  if (!time) return 'El formato debe ser DD/MM/YYYY HH:mm';
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  // Valid range: 7:00am <= hour < 16:30pm (i.e., 7:00am a 4:30pm)
  if (hour < 7 || hour > 16 || (hour === 16 && minute > 30)) {
    return 'La hora debe estar entre las 7:00 am y las 4:30 pm';
  }

  // Validar si la fecha es hoy y la hora es anterior a la actual
  const now = moment();
  const inputDate = moment(dateTimeStr, 'DD/MM/YYYY HH:mm');
  if (inputDate.isSame(now, 'day')) {
    if (inputDate.isBefore(now, 'minute')) {
      return 'No puede seleccionar una hora anterior a la actual';
    }
  }

  return true;
}



const validRequiredDate = () => {

    if (props.etapa == 7) {
        emit("resetForm")
        return false
    } else if (props.etapa == 6) {

        if (props.form.estadoEtapa) {
            if (props.form.estadoEtapa.value == 23) {
                emit("resetForm")
                return false
            } else {
                emit("resetForm")
                return true
            }
        } else {
            emit("resetForm")
            return true
        }
    } else {
        emit("resetForm")
        return true
    }
}

// Función para controlar los minutos según la hora seleccionada
const getMinuteOptions = (dateTimeValue) => {
    if (!dateTimeValue) {
        return Array.from({ length: 60 }, (_, i) => i)
    }

    const parts = dateTimeValue.split(' ')
    if (parts.length < 2) {
        return Array.from({ length: 60 }, (_, i) => i)
    }

    const timePart = parts[1]
    const hour = parseInt(timePart.split(':')[0])

    // Si es las 16 (4:00 PM), solo permitir minutos 0-30
    if (hour === 16) {
        return Array.from({ length: 31 }, (_, i) => i)
    }

    // Para todas las demás horas (8-15), permitir todos los minutos
    return Array.from({ length: 60 }, (_, i) => i)
}

const validateTimeAndShowToast = (newValue) => {
    if (!newValue) return
    
    const parts = newValue.split(' ')
    if (parts.length < 2) return
    
    const timePart = parts[1]
    const [hour, minute] = timePart.split(':').map(Number)
    
    // Si es hora 16 (4:00 PM) y el minuto es mayor a 30
    if (hour === 16 && minute > 30) {
        const datePart = parts[0]
        props.form.fechaVencimiento = `${datePart} 16:30`
        
        toast.warning('El horario máximo permitido es 4:30 PM')
    }
}

const validTypeForm = async () => {

    if (props.validForm) {
        const { opEstadoEtapas } = await useEstadoEtapas(props.datosGestion.etapaProcesal.id);

        setTimeout(() => {
            if (!opEstadoEtapas.value.includes(props.form.estadoEtapa) && props.datosGestion.etapaProcesal.id != 1) {
                props.form.estadoEtapa = ''
            }
        }, 500);
        estadosEtapasOp.value = opEstadoEtapas.value
    } else {
        const { opEstadoEtapas } = await useEstadoEtapas(1);
        estadosEtapasOp.value = opEstadoEtapas.value
        props.form.estadoEtapa = { label: 'N/A', value: 0 }
    }
}

watch(
    () => props.form.fechaVencimiento,
    (newValue) => {
        validateTimeAndShowToast(newValue)
    }
)

watch(
    () => props.etapa,
    async (value) => {
        const { opEstadoEtapas } = await useEstadoEtapas(value);
        props.form.estadoEtapa = null
        estadosEtapasOp.value = opEstadoEtapas.value
    }
);

watch(
    () => props.form.radicadoEtapa,
    async (value) => {
        if (firstTime.value) {
            firstTime.value = false
            return
        } else {
            emit('changeRadicado', value)
        }
    }
);

watch(
    () => props.form.radicadoEtapa,
    async (value) => {
        etapasOp.value = props.radicadosEtapa.listadoRadicados.filter((val) => val.idRadicado != props.form.radicadoEtapa).map((item) => ({
            value: item,
            label: item.idRadicado
        }))
    }
);

watch(
    () => props.form.dependencia,
    async (value) => {
        var options = []
        for (const element of value) {
            const { optionsCauses } = await useCauses(element);
            options = options.concat(optionsCauses.value)
        }
        opCauses.value = options
        saveOpCaus.value = options
        if (props.validForm && activeWatchDep.value) {
            activeWatchDep.value = false
            saveDepOp.value = []
            saveDepOp.value = optionsDependencies.value
        }
        props.form.causal = props.form.causal.filter(cau => saveOpCaus.value.some(item => item.value == cau));

    }
);

const findRoles = (role) => {
    var nomenclatura = [
        'Administrador', //0
        'Asignador Responsable', //1
        'aprobador_sgdea', //2
        'Gestionador', //3
        'Radicador - Web' //4
    ]
    var valid = false
    role.forEach(element => {
        if (userInfo.value?.role?.includes(nomenclatura[element])) {
            valid = true
        }
    });
    return valid
}

onMounted(async () => {
    validTypeForm()
    userInfo.value = await getUserInfo();

    // getSiniestros()

})

onBeforeMount(async () => {
})

</script>
