<template>
  <q-form ref="myForm10" v-if="stepDataSend === 0" greedy>
    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
          Destinatarios externos
      </p>
        <FormFormDatosSalida :data-initial="formExitData" onlyRead />
    </q-card>
  </q-form>

  <q-form ref="myForm20"  v-if="stepDataSend === 1" greedy>
    <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
      <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
        Copia
      </p>
      <div class="row q-col-gutter-md q-pb-md q-px-md">

        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <span class="tw-w-full">
            <label class="tw-text-label">¿Con copia?*</label>
            <q-select map-options emit-value dense outlined class="tw-rounded-lg" v-model="formExitData.copyType"
              label="Seleccione" :rules="[inputRequired]" />
          </span>
        </div>
      </div>
    </q-card>

    <div v-if="formExitData.copyType === 1">
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
            Copia Interna
        </p>
        <FormCopyInterna :key="isFormResetInterno" @update:item-added="(form)=>handleClickAddNewDestinaryInterno(form)" />
      </q-card>

      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <TableDestinatarios :key="bodyCopyInterna" class="full-width" :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_INTERNA" :JUZGADOS_BODY="bodyCopyInterna" @update:item-deleted="(value)=>bodyCopyInterna=value" />
      </q-card>
    </div>

    <div v-else-if="formExitData.copyType === 2">
      <q-card  class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <p class="tw-text-2xl tw-font-bold tw-pb-4 ">
            Copia Externa
        </p>
        <FormCopyExterna :key="isFormResetExterno" @update:item-added="(form)=>handleClickAddNewDestinaryExterno(form)" />
      </q-card>

      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
          <TableDestinatarios :key="bodyCopyExterna" class="full-width" :JUZGADOS_HEADER="DESTINARIOS_HEADER_COPY_EXTERNA" :JUZGADOS_BODY="bodyCopyExterna" @update:item-deleted="(value)=>bodyCopyExterna=value" />
      </q-card>
    </div>
  </q-form>
</template>
<script setup lang="ts">
import FormFormDatosSalida from 'src/components/comunicacion/FormDatosSalida.vue';
import FormCopyExterna from 'src/components/comunicacion/FormCopyExterna.vue';
import FormCopyInterna from 'src/components/comunicacion/FormCopyInterna.vue';
import {DESTINARIOS_HEADER_COPY_EXTERNA, DESTINARIOS_HEADER_COPY_INTERNA, dictionaryTypeCopy } from '../CrearComunicaciones/const/index';
import {
  inputRequired,
} from "src/helpers/validations";
import { ref, onMounted, onBeforeMount } from 'vue';
import { mapFormDataToDestinataires } from '../CrearComunicaciones/utils';

const props = withDefaults(defineProps<{
  detallesComunicaciones: any
}>(), {
});

const stepDataSend = ref(0);
const isFormResetExterno = ref(0);
const isFormResetInterno = ref(0)
const bodyCopyExterna = ref([]);
const bodyCopyInterna = ref([]);

const formExitData = ref({
  datosSalidaFormaEnvioId: '',
  datosSalidaTipoDocumentoDestinatarioId: '',
  datosSalidaNumeroDocumentoDestinatario: '',
  datosSalidaNombreDestinatario: '',
  datosSalidaDireccion: '',
  datosSalidaPaisId: {value: 425, label: 'Colombia'},
  datosSalidaDeptoId: '',
  datosSalidaMunicipioId: '',
  datosSalidaCorreo:'',
  datosSalidaTelefono:'',
  asunto: '',
  datosSalidaAnexos: '',
  observacion: '',
  datosSalidaTipoDocumentoAfectadoId: '',
  datosSalidaNumeroDocumentoAfectado: '',
  datosSalidaNombreAfectado: '',

  asuntoCorreo:'',
  contenidoCorreo:'',
  copyType: '',
});

const handleClickAddNewDestinaryInterno = (formExitDataCopyInterno) => {
  const mapTypeCopyValue= dictionaryTypeCopy[formExitData.value.copyType];
  bodyCopyInterna.value=[...bodyCopyInterna.value, mapFormDataToDestinataires(formExitDataCopyInterno, mapTypeCopyValue)];
  isFormResetInterno.value = isFormResetInterno.value + 1;
}

const handleClickAddNewDestinaryExterno = (formExitDataCopyExterno) => {
  const mapTypeCopyValue= dictionaryTypeCopy[formExitData.value.copyType];
  bodyCopyExterna.value=[...bodyCopyExterna.value, mapFormDataToDestinataires(formExitDataCopyExterno,mapTypeCopyValue)];
  isFormResetExterno.value = isFormResetExterno.value + 1;
}

onBeforeMount(() => {
  const datos = props.detallesComunicaciones?.datosSalida

  const isColombia = datos.pais.nombre.toLowerCase() == 'colombia'

  formExitData.value = {
    datosSalidaFormaEnvioId: datos.formaEnvio.id,
    datosSalidaTipoDocumentoDestinatarioId: datos.tipoDocumentoDestinatario.id,
    datosSalidaNumeroDocumentoDestinatario: datos?.numeroDocumentoDestinatario,
    datosSalidaNombreDestinatario: datos.nombreDestinatario,
    datosSalidaDireccion: datos.direccionDestinatario,
    datosSalidaPaisId: { value: datos.pais.idPais, label: datos.pais.nombre },
    datosSalidaDeptoId: isColombia ? datos?.departamento?.idDepartamento : datos.pais.nombre,
    datosSalidaMunicipioId: isColombia ? datos?.municipio?.idMunicipio : datos.pais.nombre,
    datosSalidaCorreo: datos?.correoDestinatario,
    datosSalidaTelefono: datos?.telefonoDestinatario,
    asunto: datos.asunto,
    datosSalidaAnexos: datos.anexos,
    observacion: datos.observacion,
    datosSalidaTipoDocumentoAfectadoId: datos?.tipoDocumentoAfectado?.id,
    datosSalidaNumeroDocumentoAfectado: datos.numeroDocumentoAfectado,
    datosSalidaNombreAfectado: datos.nombreAfectado,

    asuntoCorreo:'',
    contenidoCorreo:'',
    copyType: '',
  }
})

</script>
<style>
    
</style>