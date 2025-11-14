<template>
  <q-card class="tw-px-0 tw-py-3 tw-pb-6 tw-rounded-xl tw-mx-4" flat>
    <q-expansion-item default-opened>
      <template v-slot:header>
        <div class="col">
          <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
            Crear Expediente
          </h3>
        </div>
      </template>
      <q-form ref="form" @submit.prevent="submit" greedy>
        <section class="tw-px-8 tw-pt-3">
          <div class="tw-grid tw-grid-cols-4 tw-gap-x-4">
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Dependencia</p>
              <q-select :options="filteredDependencias" map-options outlined v-model="formData.dependencia"
                label="Inserte" dense @filter="filterDependencias" use-input fill-input hide-selected
                :disable="false" />
            </div>
            <div class="tw-col-span-2">
              <p class="tw-text-label tw-font-semibold">Series *</p>
              <q-select :options="filteredSeries" map-options emit-value outlined v-model="formData.series"
                label="Inserte" dense :rules="[inputRequired]" @filter="filterSeries" use-input fill-input
                hide-selected />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Subseries *</p>
              <q-select :options="filteredSubSeries" map-options emit-value outlined v-model="formData.subSeries"
                label="Inserte" dense :rules="[inputRequired]" @filter="filterSubSeries" use-input fill-input
                hide-selected />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Tipo Documental *</p>
              <q-select :options="filteredTiposDocumentales" map-options emit-value outlined
                v-model="formData.tipoDocumental" label="Inserte" dense :rules="[inputRequired]"
                @filter="filterTiposDocumental" use-input fill-input hide-selected />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">
                Código de Proceso *
              </p>
              <q-input type="text" v-model="formData.numeroIdentificacion" label="Inserte" dense outlined
                :rules="[inputRequired, onlyNumbers, v => maxLengthInput(30, v)]" @keypress="onlyAlphaNumeric" readonly />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">
                Número de Identificación
              </p>
              <q-input type="text" v-model="formData.numeroDocumento" label="Inserte" dense outlined
                :rules="[v => maxLengthInput(30, v)]" @keypress="onlyAlphaNumeric" readonly />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Expediente *</p>
              <q-input v-model="formData.expedientes" label="Inserte" dense filled
              :rules="[inputRequired, (v: string) => lengthValidation(150, v)]" disable hint="Estructura del Gestor: EXP-{Código de Proceso}-{Número de Documento Afectado}" />
            </div>
            <div class="tw-col-span-2 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">
                Responsable del expediente
              </p>
              <q-input v-model="formData.responsableExpediente" label="Inserte" dense disable filled />
            </div>
            <div class="tw-col-span-4 tw-mt-4">
              <p class="tw-text-label tw-font-semibold">Observaciones *</p>
              <q-input type="textarea" v-model="formData.observacion" label="Inserte" dense outlined
                :rules="[(v: string) => lengthValidation(1000, v), inputRequired]" />
            </div>
          </div>
        </section>
      </q-form>
    </q-expansion-item>
  </q-card>

  <div class="justify-center tw-w-full tw-pb-6 tw-mt-4 tw-flex tw-gap-4">
    <q-btn label="Cancelar" type="reset" style="width: 240px; height: 40px" text-color="black" color="accent"
      class="tw-rounded-xl" @click="() => (showCancelModal = true)" />
    <q-btn label="Guardar" text-color="white" @click="submit" style="width: 240px; height: 40px" color="primary"
      class="tw-rounded-xl tw-btn tw-p-2" />
  </div>

  <Modal v-model:model-value="showCancelModal" title="¡Espera un momento!" text="Al cancelar el proceso perderá los datos
    ingresados en el formulario, ¿desea realizar la acción?" :is-success="false" textButtonCancel="No" cancel-button
    @handleAccept="resetForm" text-button="Si" @close-modal="() => (showCancelModal = false)" />
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref, watch } from "vue";
import { sgdeaAxios } from "src/services";
import { inputRequired, maxLengthInput, onlyNumbers } from "src/helpers/validations";
import Modal from "src/components/Modal/Modal.vue";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { defineExpose } from 'vue';
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import {Expediente} from "src/interfaces";

interface PQRD {
  oficina: string,
  series: string,
  subSeries: string,
  tipoDocumental: string,
  expedientes: string,
  numeroIdentificacion: string,
  responsableExpediente: string,
  nivelAcceso: string,
  observacion: string,
  numeroDocumento: string
}

const formData = ref({
  dependencia: '',
  series: '',
  subSeries: '',
  tipoDocumental: '',
  expedientes: '',
  numeroIdentificacion: '',
  responsableExpediente: '',
  nivelAcceso: '',
  observacion: '',
  numeroDocumento: ''
});

const props = withDefaults(defineProps<{
  corData: any,
}>(), {})
const showCancelModal = ref(false);
const form = ref();
const listadoOficinas = ref()
const filteredDependencias = ref();
const listadoDependencias = ref();
const listadoSeries = ref()
const filteredSeries = ref()
const listadoSubSeries = ref()
const filteredSubSeries = ref()
const listadoTiposDocumentales = ref()
const filteredTiposDocumentales = ref()
const listadoUsuarios = ref()
const filteredOficinas = ref()
const success = ref(false)
const auth = useAuthStore()

onMounted(async () => {
  if (props.corData?.idRadicacion) {
    try {
      const response = await sgdeaAxios.get(
        `/correspondencia/buscarCaseIDVentanillaXRadicado/${props.corData.idRadicado}`
      );
      formData.value.numeroIdentificacion = response.data.casoBonitaId;
    } catch (error) {
      console.error("Error al obtener el código del expediente:", error);
      formData.value.numeroIdentificacion = String(Math.round(Math.random() * 1000) + 1000);
    }
  } else {
    formData.value.numeroIdentificacion = String(Math.round(Math.random() * 1000) + 1000);
  }

  formData.value.responsableExpediente = auth.userInfo.name;
  formData.value.numeroDocumento = props.corData.afectado?.numeroDocumento || "N/A";

  await getData();
  // await loadUsuarios();
});

const emit = defineEmits(['isExp'])

const listadoNivelAcceso = [
  { label: "Pública", value: "Pública"},
  { label: "Pública clasificada", value: "Pública clasificada"},
  { label: "Pública reservada", value:"Pública reservada" }
]

defineExpose({
  success
});

const getData = async () => {
  try {
    // const { data: responseOficinas} = await sgdeaAxios.get(`oficinas/all`)
    // const oficina = await responseOficinas.find(it => it.nombre === auth.$state.userInfo?.relations[0].oficina);

    //filteredOficinas.value = { label: auth.$state.userInfo.relations.find(it => it.idOficina === auth.$state.userInfo.oficina).oficina, value: auth.$state.userInfo.oficina }
    //formData.value.oficina = filteredOficinas.value
    await loadDependencias();
    // Series
    const responseSeries = await sgdeaAxios.get(`serie/buscarSerie`, {
      params: {
        idSeriesubserie: null, descripcion: null, estado: true, codigo: null, seccionSubSeccion: 30, padre: null
      }
    })

    listadoSeries.value = responseSeries.data.map((item) => {
      return {
        label: item.descripcion,
        value: item.idSeriesubserie
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const loadDependencias = async () => {
  try {
    const response = await sgdeaAxios.get(`/seccionSubSeccion`)
    listadoDependencias.value = response.data.map((e) => {
      return {
        label: e.nombre,
        value: e.idSeccionSubSeccion
      }
    })

    formData.value.dependencia = listadoDependencias.value.find((e) => e.label === 'GERENCIA MÉDICA')
  } catch (error) {
    toast.error("Ha ocurrido un error al cargar las dependencias")
  }
}

const loadSubseries = async (id) => {
  const responseSubSeries = await sgdeaAxios.get(`serie/buscarSub`, {
    params: {
      idSeriesubserie: null, descripcion: null, estado: true, codigo: null, seccionSubSeccion: null, padre: id
    }
  })

  listadoSubSeries.value = responseSubSeries.data.map((item) => {
    return {
      label: item.descripcion,
      value: item.idSeriesubserie
    }
  })
}

const loadTipoDocumental = async (id) => {
  const response = await sgdeaAxios.get(`tiposdocumentales/asignacion/serie/tipos_documentales`, {
    params: { serie: id }
  })

  listadoTiposDocumentales.value = response.data.tiposDocumentalesAsociados.map((e) => {
    let item = e.tipologiaDocumental
    return {
      label: item.nombre,
      value: item.idTipologiaDocumental,
    }
  })

}

const loadUsuarios = async () => {
  const response = await sgdeaAxios.get(`api/usuarios/`)

  listadoUsuarios.value = response.data.map((e) => {
    return {
      label: e.firstname + ' ' + e.lastname,
      value: e.id,
    }
  })

}

function resetForm() {
  location.reload()
  showCancelModal.value = false
}

const submit = async () => {
  if (await form.value.validate()) {
    try {
      const sendData = {
        // @ts-ignore
        "dependencia": formData.value.dependencia.value,
        "serie": formData.value.series,
        "subserie": formData.value.subSeries,
        "tipoDocumental": formData.value.tipoDocumental,
        "codIdentificacion": formData.value.numeroIdentificacion,
        "responsable": auth.userInfo.userid,
        "observaciones": formData.value.observacion,
        "titulo": formData.value.expedientes,
        // @ts-ignore
        "nivelSeguridad": "Pública",
        "creacion": true,
        "nodeIdRad": props.corData.nodeId,
        "modulo": 8,
        "radicado": props.corData.secuenciaRadicado,
        //"dependencia": auth.$state.userInfo.relations[0].idDependencia,
      }

      const response = await sgdeaAxios.post(`/expediente/newpdate`, sendData)
      toast.success("Datos guardados exitosamente")

      await crearTrazabilidad({
        proceso: `PRE${props.corData.id}`,
        secuencia: props.corData.secuenciaRadicado,
        estado: props.corData.estado.nombre,
        descripcion: `Usuario:${auth.$state.userInfo.name}`+`Series:${formData.value.series}`+
        `Subseries:${formData.value.subSeries}`+ `TipoDocumental:${formData.value.tipoDocumental}`+`Expedientes:${formData.value.expedientes}`+
        `Comentario:Se ha incluido un expediente al trámite`,
        comentario: 'Expediente incluido',
        nombre: auth.$state.userInfo.name,
        tramite: props.corData.tipoGestion.nombre,
        accion: `${auth.$state.userInfo.name} creo un expediente en el tramite`
      })
      emit('isExp')
      success.value = true
    } catch (error) {
      toast.error("Ha ocurrido un error al guardar los datos")
    }
  } else {
    toast.error('Debe diligenciar los campos obligatorios para continuar con el proceso')
  }
};

watch(() => formData.value.series, (newValue) => {
  loadSubseries(newValue)
  formData.value.subSeries = ''
})

watch(() => formData.value.subSeries, (newValue) => {
  loadTipoDocumental(newValue)
  formData.value.tipoDocumental = '';
})

watch(() => formData.value.numeroIdentificacion, (newValue) => {
  if(typeof onlyNumbers(newValue) != "string" && newValue.length > 0) {
    formData.value.expedientes = `EXP-${newValue}-${formData.value.numeroDocumento == 'N/A' || formData.value.numeroDocumento == null ? 'NA' : formData.value.numeroDocumento}`
  } else {
    formData.value.expedientes = ''
  }
})

const filterDependencias = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredDependencias.value = listadoDependencias.value
    })
    return
  }
  update(() => {
    filteredDependencias.value = listadoDependencias.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const filterSeries = (val: string, update: any) => {
  const normalizeString = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (val === "") {
    update(() => {
      filteredSeries.value = listadoSeries.value;
    });
    return;
  }

  const normalizedVal = normalizeString(val.toLowerCase());

  update(() => {
    filteredSeries.value = listadoSeries.value.filter((option) => {
      return normalizeString(option.label.toLowerCase()).includes(normalizedVal);
    });
  });
};

const filterSubSeries = (val: string, update: any) => {
  const normalizeString = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (val === "") {
    update(() => {
      filteredSubSeries.value = listadoSubSeries.value;
    });
    return;
  }

  const normalizedVal = normalizeString(val.toLowerCase());

  update(() => {
    filteredSubSeries.value = listadoSubSeries.value.filter((option) => {
      return normalizeString(option.label.toLowerCase()).includes(normalizedVal);
    });
  });
};

const filterTiposDocumental = (val: string, update: any) => {
  if (val == '') {
    update(() => {
      filteredTiposDocumentales.value = listadoTiposDocumentales.value
    })
    return
  }
  update(() => {
    filteredTiposDocumentales.value = listadoTiposDocumentales.value.filter((option) => {
      return option.label.toLowerCase().includes(val.toLowerCase());
    });
  })
};

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"

function onlyAlphaNumeric(event: { which: any; keyCode: any; preventDefault: () => void; }) {
  let charCode = (event.which) ? event.which : event.keyCode;
  if ((charCode > 47 && charCode < 58) ||  // Numbers
    (charCode > 64 && charCode < 91) ||  // Uppercase letters
    (charCode > 96 && charCode < 123) ||  // Lowercase letters
    charCode === 32) {                   // Space
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

</script>

<style lang="scss"></style>
