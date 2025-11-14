<template>
  <div class="[&>*]:tw-mb-4">
    <section>
      <q-form
        ref="metadataRef"
        @validation-error="errorForm()"
        @submit.prevent="saveMetaData"
      >
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Metadatos
                </h3>
              </div>
            </template>

            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Remitente*</p>
                  <q-select
                    v-model="formData.idRemitente"
                    outlined
                    dense
                    use-input
                    hide-selected
                    emit-value
                    map-options
                    option-value="value"
                    fill-input
                    label="Busqueda"
                    input-debounce="0"
                    :options="remitentes"
                    @filter="filterRe"
                    :rules="[inputRequired, v => maxLengthInput(200, v)]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="search" />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de Requerimiento*
                  </p>
                  <q-select
                    v-model="formData.idTipoRequerimiento"
                    :options="tipo_requerimientos"
                    label="Seleccione"
                    dense
                    outlined
                    :rules="[
                      (val) => (val && val.idTipoRequerimiento == null) || 'Campo requerido',
                    ]"
                  :disable="formData.idTipoRequerimiento?.value == 2 && notSave"
                  :readonly="formData.idTipoRequerimiento?.value == 2 && notSave"
                  />
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de Solicitud*
                  </p>
                  <q-select
                    v-model="formData.idTipoSolicitud"
                    :options="tipo_solicitudOpt"
                    label="Seleccione"
                    dense
                    outlined
                    :rules="[
                      (val) => (val && !val.idTipoSolicitud) || 'Campo requerido',
                    ]"
                  />
                </div>

                <!-- Metadatos Hu 124 -->
                <DynamicFields :listFields="listFields" :alfanumFields="alfanumFields" :booleanFields="booleanFields" @updateValue="handleUpdateValue" />
              </div>
            </div>

            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm-4 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Producto *</p>
                  <q-select
                    v-model="formData.idTipoProducto"
                    :options="tipoProductoOptions"
                    label="Seleccione"
                    dense
                    :rules="[inputRequired]"
                  />
                </div>
              </div>
            </div>
            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm-12 tw-p-2">
                  <CommentTextArea v-model="formData.detalle" :is-required="true" :max-length="500"
                    label="Detalles" />
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <h3 class="text-bold tw-text-xl d tw-flex-1 q-px-md">
                  Información del Afectado
                </h3>
              </div>
            </template>

            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Tipo de Documento del Afectado*
                  </p>
                  <q-select
                    v-model="formData.idTipoDocumento"
                    :options="tipoDocumentoOpt"
                    label="Seleccione"
                    dense
                    outlined
                    :rules="[inputRequired]"
                    @update:model-value="validateId"
                  />
                </div>
                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Número de Documento del Afectado*
                  </p>
                  <q-input
                    v-model="formData.nroDocumento"
                    label="Ingrese el número de documento"
                    dense
                    outlined
                    @keypress="onlyAlphaNumeric"
                    :rules="[inputRequired, v => maxLengthInput(15, v), noCaracteresEspecialesSelect]"
                  />
                </div>

                <div class="col-sm tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Nombre del Afectado*</p>
                  <q-input
                    v-model="formData.nombreAfectado"
                    label="Ingrese el nombre del afectado"
                    dense
                    outlined
                    @keypress="onlyAlphaNumeric"
                    :rules="[inputRequired, v => maxLengthInput(200, v)]"
                  />
                </div>
              </div>
            </div>

            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm-4 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    ¿Pertenece a la Comunidad LGBTIQ+?*
                  </p>
                  <q-select
                    v-model="formData.lgbti"
                    :options="lgtbiOptions"
                    label="Seleccione"
                    dense
                    outlined
                    :rules="[
                      (val) => (val && !val?.lgbti) || 'Campo requerido',
                    ]"
                    :disable="disableByNit"
                  />
                </div>
                <div class="col-sm-4 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Sexo*</p>
                  <q-select
                    v-model="formData.idSexo"
                    :options="genOptions.sort((a,b)=> a.label > b.label ? 1 : -1)"
                    label="Seleccione"
                    dense
                    outlined
                    :rules="[
                      (val) => (val && !val?.idSexo) || 'Campo requerido',
                    ]"
                    :disable="disableByNit"
                  />
                </div>
                <div class="col-sm-4 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Condición Especial*
                  </p>

                  <q-select
                    v-model="formData.idCondicionEspecial"
                    :options="condicionEspecialOpt"
                    label="Seleccione"
                    dense
                    outlined
                    :rules="[
                      (val) =>
                        (val && !val?.idCondicionEspecial) || 'Campo requerido',
                    ]"
                    :disable="disableByNit"
                  />
                </div>
              </div>
            </div>

            <div class="tw-bg-white tw-p-4" style="border-radius: 5px">
              <div class="row tw-p-2">
                <div class="col-sm-6 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">Teléfono Celular</p>
                  <q-input
                    @update:model-value="(val) => validateInputPhone(val, formData, 'telCelular')"
                    :rules="[mobilePhoneNumberTenToTwelve]"
                    v-model="formData.telCelular"
                    label="Ingrese el número"
                    :maxlength="10"
                    outlined
                    dense
                  />
                  <!-- mask="(###) ###-####" -->
                </div>
                <div class="col-sm-6 tw-p-2">
                  <p class="tw-text-label tw-font-semibold">
                    Correo Electrónico
                  </p>
                  <q-input
                    v-model="formData.email"
                    label="Ingrese el correo electrónico"
                    dense
                    outlined
                    type="email"
                    :maxlength="200"
                    :rules="[validationEmail]"
                  />
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <div class="justify-center tw-w-full tw-m-[10px] tw-mt-10 tw-mb-6 tw-flex tw-gap-4">
          <q-btn
            label="Cancelar"
            type="reset"
            style="width: 240px; height: 40px"
            text-color="black"
            color="accent"
            class="tw-rounded-xl"
            @click="cancelModal = true"
          />
          <q-btn
            type="submit"
            label="Guardar"
            text-color="white"
            style="width: 240px; height: 40px"
            color="primary"
            class="tw-rounded-xl tw-btn tw-p-2"
          />
        </div>
      </q-form>
    </section>
  </div>

  <Modal
    v-model="cancelModal"
    title="¡Espera un momento!"
    :is-success="false"
    @handleAccept="emit('changeView', 'documentos')"
    cancel-button
    textButtonCancel="No"
    textButton="Si"
    text="Al cancelar el proceso perderá los datos ingresados en el formulario, ¿desea realizar la acción?"
    @close-modal="cancelModal = false"
    type="button"
  />
</template>

<script lang="ts" setup>
import { validateInputPhone } from "src/pages/EntesDeControl/Bandeja/Detalles/utils";
import { condicionEspecialOptions, genOptions } from "src/constantes/options";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import { ref, onMounted, defineProps } from "vue";
import Modal from "components/Modal/Modal.vue";
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { InfoGeneral } from "../types";
import { useRoute } from "vue-router";
// import { useQuasar } from "quasar";
import {
  onlyNumbers,
  maxLengthInput,
  inputRequired,
  alphanumeric,
  mobilePhoneNumberTenToTwelve,
  validationEmail,
  alphabetical,
  onlyAlphaNumeric,
  noCaracteresEspecialesSelect,
  alphabeticalWithSpecialCharacters
} from "src/helpers/validations";
import CommentTextArea from  "src/shared/components/TextArea/Comments.vue";


const props = defineProps<{ informacionGeneral: InfoGeneral, metadatos: any }>();

const emit = defineEmits(["changeView", 'success']);

const selectedValues = ref([])
const route = useRoute();
// const q = useQuasar();

const ente_id = route.params.id;
const cancelModal = ref(false);
const disableByNit = ref(false);

const notSave = ref(false);
const listFields = ref([]);
const alfanumFields = ref([]);
const booleanFields = ref([]);
const copyData = ref();
const formData = ref({
  id: null,
  idRemitente: null, //requerido
  idTipoRequerimiento: null, //requerido
  idTipoDocumento: null, //requerido
  nroDocumento: null, //requerido
  nombreAfectado: null, //requerido
  lgbti: null, //requerido
  idSexo: null, //requerido
  idCondicionEspecial: null,
  telCelular: null, // no requerido
  email: null, // no requerido
  idTipoSolicitud: null, //requerido
  detalle: null, //requerido
  idTipoProducto: null, //no requerido
  idEnteControl: null,
});

const remitentesOpt = ref([]);
const metadataRef = ref();
const remitentes = ref();

const condicionEspecialOpt = ref([]);
const tipoProductoOptions = ref([]);
const tipo_requerimientos = ref([]);
const tipoDocumentoOpt = ref([]);

const lgtbiOptions = ref([
  {
    label: "Si",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
]);

const tipo_solicitudOpt = ref([]);

const getMetadata = () => {
  sgdeaAxios
    .get(`api/entes/getMetadatosByEnteControlId/${ente_id}`)
    .then((res) => {
      metadataRef.value.reset();
      setMetadata(res.data);
      if (formData.value.idTipoRequerimiento?.value == 2) {
        notSave.value = true
      }
      setTimeout(()=>validateId(), 100);
    })
    .catch((error) => {
      setMetadataFromGeneral();
      setTimeout(()=>validateId(), 100);
    });
};

const setMetadataFromGeneral = () => {
  const { informacionAfectado, informacionContacto, informacionSolicitud } = props?.informacionGeneral;

  const data = {
    id: null,
    idRemitente: null,
    idTipoRequerimiento: {
      label: "Requerimiento",
      value: 1,
    },
    idTipoDocumento: {
      label: informacionAfectado.tipoDocumentoAfectado,
      value: tipoDocumentoOpt.value.find(
        (option) => option.label == informacionAfectado.tipoDocumentoAfectado
      )?.value,
    },
    nroDocumento: informacionAfectado.numeroDocumentoAfectado,
    nombreAfectado: informacionAfectado.nombresAfectado,
    lgbti: {
      label: informacionAfectado.perteneceLGBT,
      value: informacionAfectado.perteneceLGBT.toLowerCase('si') ? true : false,
    },
    idSexo: {
      label: informacionAfectado.sexo,
      value: genOptions.find(
        (option) => option.label == informacionAfectado.sexo
      )?.value,
    },
    idCondicionEspecial: {
      label: informacionAfectado.condicionEspecial,
      value: condicionEspecialOpt.value.find(
        (option) => option.label == informacionAfectado.condicionEspecial
      )?.value,
    },
    telCelular:
      informacionContacto.telefonoCelular ||
      informacionContacto.telefonoFijo ||
      "",
    email: informacionContacto.email,
    idTipoSolicitud: {
      label: informacionSolicitud.tipoSolicitud,
      value: tipo_solicitudOpt.value.find(
        (option) => option.label == informacionSolicitud.tipoSolicitud
      )?.value,
    },
    detalle: informacionSolicitud.detalle,
    idTipoProducto: {
      label: informacionSolicitud.producto,
      value: tipoProductoOptions.value.find(
        (option) => option.label == informacionSolicitud.producto
      )?.value,
    },
    idEnteControl: Number(ente_id),
  };

  copyData.value = {...data};
  formData.value = data;
  setTimeout(() => metadataRef.value.resetValidation(), 100);
};

const setMetadata = (data: any) => {

  formData.value = {
    id: data.id,
    idRemitente: {
      label: data.remitente?.nombre || null,
      value: data.remitente?.id || null,
    },
    idTipoRequerimiento: {
      label: data.tipoRequerimiento?.nombre || null,
      value: data.tipoRequerimiento?.id || null,
    },
    idTipoDocumento: tipoDocumentoOpt.value.find(option => { return option.label.toLowerCase() == data.enteControl.tipoDocumentoAfectado.toLowerCase()}),
    nroDocumento: data.enteControl.nroDocumentoAfectado || null,
    nombreAfectado: data.enteControl.nombreAfectado || null,
    lgbti: {
      label: data.lgbti ? "Si" : "No",
      value: data.lgbti || false,
    },
    idSexo: {
      label: data.genero?.nombre || null,
      value: data.genero?.id || null,
    },
    idCondicionEspecial: {
      label: data.condicionEspecial?.nombre || null,
      value: data.condicionEspecial?.id || null,
    },
    telCelular: data.telCelular == "null" ? "" : data.telCelular || null,
    email: data.email || null,
    idTipoSolicitud: {
      label: data.tipoSolicitud?.nombre || null,
      value: data.tipoSolicitud?.id || null,
    },
    detalle: data.detalle || null,
    idTipoProducto: {
      label: data.tipoProducto?.nombre || null,
      value: data.tipoProducto?.id || null,
    },
    idEnteControl: Number(ente_id),
  };
  copyData.value = {...formData.value};
  if (!data.remitente?.nombre && !data.remitente?.id) {
    formData.value.idRemitente = null;
  }
  if (!data.tipoRequerimiento?.nombre && !data.tipoRequerimiento?.id) {
    formData.value.idTipoRequerimiento = {
      label: "Requerimiento",
      value: 1,
    };
  }
  if (!data.tipoDocumento?.nombre && !data.tipoDocumento?.id) {
    formData.value.idTipoDocumento = null;
  }
  if (!data.genero?.nombre && !data.genero?.id) {
    formData.value.idSexo = null;
  }
  if (!data.condicionEspecial?.nombre && !data.condicionEspecial?.id) {
    formData.value.idCondicionEspecial = null;
  }
  if (!data.tipoSolicitud?.nombre && !data.tipoSolicitud?.id) {
    formData.value.idTipoSolicitud = null;
  }
  if (!data.tipoProducto?.nombre && !data.tipoProducto?.id) {
    formData.value.idTipoProducto = null;
  }
};

const getTipoDocumentoOptions = () => {
  sgdeaAxios.get(`/api/entes/listadoTipoIdentificacion`)
  .then((response)=> {
    tipoDocumentoOpt.value = response.data
      .filter((tipo) => tipo.nombre !== "Ninguno")
      .map(({ nombre, id }) => ({ label:nombre, value:id }));
  })
  .catch((error) => {
      console.error("errorEntes", error);
  });
}

const getEntes = () => {
  sgdeaAxios
    .get(`api/entes/listadoTiposRemitente`)
    .then((res) => {
      remitentesOpt.value = res.data.map(({ id, nombre }) => ({
        label: nombre,
        value: id,
      }));
    })
    .catch((error) => {
      console.error("errorEntes", error);
    });
};

const getRequerimientos = () => {
  sgdeaAxios
    .get(`api/entes/listadoTiposRequerimiento`)
    .then((res) => {
      tipo_requerimientos.value = res.data.map(({ id, nombre }) => ({
        label: nombre,
        value: id,
      })).sort((a, b) => b.value.toString().localeCompare(a.value.toString()))
    })
    .catch((error) => {
      console.error("errorRequerimientos", error);
    });
};

const getTipoSolicitud = () => {
  sgdeaAxios
    .get(`api/entes/tipos-solicitud`)
    .then((res) => {
      tipo_solicitudOpt.value = res.data.map(({ id, nombre }) => ({
        label: nombre,
        value: id,
      }));
    })
    .catch((error) => {
      console.error("errorTipoSolicitud", error);
    });
};

const getProductos = () => {
  sgdeaAxios
    .get(`pqrd/listadoProductosPQRD`)
    .then((res) => {
      tipoProductoOptions.value = res.data.map(({ id, nombre }) => ({
        label: nombre,
        value: id,
      })).sort((a,b)=> b.value - a.value);
    })
    .catch((error) => {
      console.error("errorProductos", error);
    });
};

const newTrazabilidad = async () => {
  const status = formData.value?.id ? "actualizado" : "guardado";

  await crearTrazabilidad({
    proceso: `ENTC${props.informacionGeneral.id}`,
    secuencia: props.informacionGeneral.nroRadicado,
    estado: props.informacionGeneral.estado.estado,
    descripcion: `Usuario:${useAuthStore().$state.userInfo.name}, Ha ${status} los metadatos del radicado`,
    comentario: "Metadatos",
    nombre: useAuthStore().$state.userInfo.name,
    accion: `Se han ${status} los metadatos del radicado`,
    tramite: "Entes de Control",
  });
};

const saveMetaData = () => {
  let data = {
    idRemitente: formData.value.idRemitente?.value,
    idTipoRequerimiento: formData.value.idTipoRequerimiento?.value,
    idTipoDocumento: formData.value.idTipoDocumento?.value,
    nroDocumento: formData.value.nroDocumento,
    nombreAfectado: formData.value.nombreAfectado,
    lgbti: formData.value.lgbti?.value || false,
    idSexo: formData.value.idSexo?.value || null,
    idCondicionEspecial: formData.value.idCondicionEspecial?.value || null,
    telCelular: String(formData.value.telCelular),
    email: formData.value.email,
    idTipoSolicitud: formData.value.idTipoSolicitud?.value,
    detalle: formData.value.detalle,
    idTipoProducto: formData.value.idTipoProducto?.value,
    idEnteControl: formData.value.idEnteControl,
  };

  if (!formData.value.idRemitente.value) {
    data.idRemitente = formData.value.idRemitente;
  }

  sgdeaAxios
    .post(`api/entes/guardarMetadatosAsignar`, data)
    .then(async (res) => {
      if (res.data) {
        getMetadata();
        await newTrazabilidad();

        const status = formData.value.id != null ? "actualizados" : "ingresados";
        const textBase = `Metadatos ${status} correctamente`;
        toast.success(
          formData.value.idTipoRequerimiento.value == 2
            ? `${textBase}, registro para transferencia Momento 2 - Superfinanciera`
            : textBase
        );
        notSave.value = true;
        emit('success')
      }
      else toast.success(`Error al guardar los datos`);
    })
    .catch((error) => {
      toast.error("Error al guardar los datos");
    });
};

const filterRe = (val: string, update: (arg: any) => void) => {
  return update(() => {
    remitentes.value = remitentesOpt.value
      .filter((v) => {
        return v.label?.toLowerCase().indexOf(val?.toLowerCase()) > -1;
      })
      .map(({ label, value }) => ({ label, value }));
  });
};

const errorForm = () => {
  toast.error(
    "Para continuar, asegúrese de que todos los campos requeridos estén completos."
  );
};

const validateId = () => {
  if (formData.value.idTipoDocumento?.value == 11) {
    disableByNit.value = true;
    formData.value.idSexo = null;
    formData.value.idCondicionEspecial = null;
    formData.value.lgbti = null
  } else {
    disableByNit.value = false;
    formData.value.lgbti = {
      label: copyData.value.lgbti.value ? "Si" : "No",
      value: copyData.value.lgbti.value,
    };
    formData.value.idSexo = {
      label: copyData.value.idSexo?.label,
      value: copyData.value.idSexo?.value,
    };
    formData.value.idCondicionEspecial = {
      label: copyData.value.idCondicionEspecial?.label,
      value: copyData.value.idCondicionEspecial?.value,
    };
  }
};

const sortCondEspecialOpt = () => {
  condicionEspecialOpt.value = condicionEspecialOptions.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });
};

async function filterListsMetadatos() {
  listFields.value = await props.metadatos?.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 2)
  alfanumFields.value = await props.metadatos?.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 1)
  booleanFields.value = await props.metadatos?.filter(it => it.metadatoConOpciones?.metadato?.tipoDato?.id === 3)
}

const handleUpdateValue = ({ arr }) => {
    selectedValues.value = arr
}

onMounted(async () => {
  remitentes.value = remitentesOpt.value.map((remit) => ({
    label: remit.label,
    value: remit.value,
  }));

  getTipoDocumentoOptions();
  sortCondEspecialOpt();
  getRequerimientos();
  getTipoSolicitud();
  getProductos();
  getEntes();

  //Necesitamos que espere a que cargue todo los demas enpoint
  setTimeout(()=> getMetadata(), 100)
  filterListsMetadatos();
});
</script>
