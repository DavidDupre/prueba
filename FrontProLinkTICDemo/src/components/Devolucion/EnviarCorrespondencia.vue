<template>
  <q-form ref="formulario" greedy>
    <q-card class="tw-rounded-xl tw-p-4" flat>
      <q-expansion-item default-opened>
        <template v-slot:header>
          <div class="col row">
            <b class="tw-text-xl">Enviar por Correspondencia</b>
          </div>
        </template>
        <div class="row q-col-gutter-md q-pb-md q-px-md">
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="text-weight-bold">Teléfono *</span>
            <q-input
              :rules="[
                onlyNumbers,
                alphanumeric2,
                (v) => maxLengthInput(10, v),
                (v) => minLengthInput(7, v),
              ]"
              map-options
              outlined
              v-model="form.telefono"
              label="Inserte"
              dense
              autocomplete="off"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <span class="text-weight-bold">Dirección *</span>
            <q-input
              :rules="[
                inputRequired,
                (v) => maxLengthInput(200, v),
              ]"
              map-options
              outlined
              v-model="form.direccion"
              label="Inserte"
              dense
              autocomplete="off"
            />
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="text-weight-bold"
              >Departamento <span v-if="isRequired">*</span></span
            >
            <q-select
              v-model="form.departamento"
              map-options
              outlined
              dense
              use-input
              hide-selected
              fill-input
              label="Seleccione"
              :options="opsDepa"
              @filter="filterDep"
              :rules="[isRequired ? inputRequired : null]"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="text-weight-bold"
              >Municipio <span v-if="isRequired">*</span></span
            >
            <q-select
              v-model="form.municipio"
              map-options
              outlined
              dense
              use-input
              hide-selected
              fill-input
              label="Seleccione"
              :options="opsMuni"
              @filter="filterMuni"
              :rules="[isRequired ? inputRequired : null]"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <span class="text-weight-bold">Forma de Envío *</span>
            <q-select
              :rules="[inputRequired]"
              outlined
              v-model="form.formaEnvio"
              label="Seleccione"
              dense
              map-options
              :options="opsEnvios"
            />
          </div>
        </div>
      </q-expansion-item>
    </q-card>
    <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
      <q-btn
        class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
        no-caps
        style="border: 1px solid #2c3948"
        @click="$emit('backView')"
        label="Cancelar"
      />
      <q-btn
        class="tw-w-1/4 tw-h-11 bg-primary text-white"
        @click="sendData"
        label="Actualizar"
      />
    </div>
  </q-form>

  <q-dialog v-model="showModalExito" persistent>
    <q-card class="tw-px-2 tw-p-6" style="width: 1200px; max-width: 80vw">
      <div class="tw-flex tw-justify-center tw-mt-3">
        <span
          class="tw-rounded-[100px] tw-flex tw-justify-center"
          style="background-color: #f6f6f9; width: 82px; height: 82px"
        >
          <img v-lazy :data-url="InterrogationModal" alt="check" />
        </span>
      </div>

      <h2 class="tw-text-2xl text-center tw-font-bold q-mt-lg tw-mb-3">
        Éxito
      </h2>

      <p class="tw-text-[18px] text-center tw-px-10">
        El envío por correspondencia física ha sido programado con éxito.
      </p>

      <p class="tw-text-[18px] text-center q-mt-lg tw-mb-3 tw-px-10">
        Por favor imprimir esta colilla con la dirrección actualizada y
        entregarla como hoja principal a correspondencia, adjuntando el
        comunicado de salida y sus adjuntos
      </p>

      <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
        <q-btn
          class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
          no-caps
          @click="descargarPdf"
          label="Descargar PDF"
        />
        <q-btn
          class="tw-w-1/4 tw-h-11 bg-secondary text-white"
          @click="(showModalExito = false), $emit('backView')"
          label="Continuar"
        />
      </div>
      <q-expansion-item
        dense
        expand-separator
        class="tw-bg-white q-mt-md"
        style="border-radius: 5px"
      >
        <template v-slot:header>
          <h3 class="text-bold tw-text-lg tw-flex-1 q-py-md tw-ps-9">
            Previsualización de Documento
          </h3>
        </template>
        <iframe
          class="tw-h-[700px] tw-w-full"
          :src="blobColilla"
          frameborder="0"
        ></iframe>
      </q-expansion-item>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  alphanumeric2,
  onlyNumbers,
  inputRequired,
  maxLengthInput,
  minLengthInput,
} from "src/helpers/validations";
import { adminAxios, sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useMunicipalities } from "src/composables/useVersion";
// @ts-ignore
import InterrogationModal from "src/assets/interrogation-modal.svg";
import { crearTrazabilidad } from "src/helpers/trazabilidad";
import { useAuthStore } from "src/stores/auth.store";
import {useRoute} from "vue-router";
const route = useRoute();
const auth = useAuthStore();

const props = withDefaults(
  defineProps<{
    datosRemitente: any;
    endpoint: string;
    radicadoSalida: any;
    detalleRadicado: any;
  }>(),
  {}
);

const emit = defineEmits(["backView"]);

const isRequired = computed(
  () => form.value.formaEnvio == "3" || form.value.formaEnvio === ""
);
const opsEnvios = ref([]);
const opsDepa = ref([]);
const opsForDepa = ref([]);
const opsMuni = ref([]);
const opsForMuni = ref([]);
const blobColilla = ref();
const showModal = ref(false);
const showModalExito = ref(false);
const iframePdfUrl = ref();
const formulario = ref();
const form = ref({
  telefono: "",
  direccion: "",
  departamento: "",
  municipio: "",
  formaEnvio: "",
});

onMounted(async () => {
  const { data: envios } = await sgdeaAxios.get(
    "/correspondencia/comunicacion/listadoFormaEnvio"
  );
  const { data: departamentos } = await adminAxios.get(
    `/departamentos/list/${425}`
  );
  opsEnvios.value = envios
    ?.map((items) => ({
      label: items.nombre,
      value: items.id,
    }))
    .filter(({ label }) => label === "Courier" || label === "Mensajero")
    .sort((a, b) => a.label.localeCompare(b.label));

  opsForDepa.value = departamentos
    .map((data) => ({
      label: data.nombre,
      value: data.idDepartamento,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  opsDepa.value = opsForDepa.value;

  const data = props.datosRemitente;

  form.value = {
    telefono: data?.telefono || "",
    direccion: data.direccion || "",
    departamento: data.departamento?.idDepartamento || "",
    municipio: data.municipio?.idMunicipio || "",
    formaEnvio: "",
  };
});

const sendData = async () => {
  // Validación del formulario
  if (!(await formulario.value.validate())) {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos");
    return;
  }

  // Verificación de datos del radicado
  if (!props.detalleRadicado) {
    toast.error("No se encontró información del radicado");
    return;
  }

  try {
    // Preparación de datos para trazabilidad
    const datosRemitente = props.datosRemitente || {};

    const telefono =
      `Teléfono anterior: ${datosRemitente.telefono || "No registra"}\n` +
      `Teléfono Nuevo: ${form.value.telefono}\n`;

    const direccion =
      `Dirección anterior: ${datosRemitente.direccion || "No registra"}\n` +
      `Dirección nueva: ${form.value.direccion}\n`;

    const departamento =
      `Departamento anterior: ${
        datosRemitente.departamento?.nombre || "No registra"
      }\n` +
      `Departamento nuevo: ${
        form.value.departamento?.label ??
        opsDepa.value.find((item) => item.value == form.value.departamento)?.label
      }\n`;

    const municipio =
      `Municipio anterior: ${
        datosRemitente.municipio?.nombre || "No registra"
      }\n` +
      `Municipio nuevo: ${
        form.value.municipio?.label ??
        opsMuni.value.find((item) => item.value == form.value.municipio)?.label
      }\n`;

    const formaEnvio = `Forma envío: ${form.value.formaEnvio?.label}`;

    // Validación del ID del radicado
    const idRadicado = props.detalleRadicado.id;
    if (!idRadicado) {
      toast.error("No se encontró el ID del radicado");
      return;
    }
    const radicadoSalida = props.radicadoSalida;

    // Envío de correspondencia
    const enviarCorrespondencia = await sgdeaAxios.put(
      `/envios/devolucionEnviarXCorrespondencia`,
      {
        radicadoSalida: radicadoSalida.replace('.pdf', ''),
        telefono: form.value.telefono,
        direccion: form.value.direccion,
        municipio: form.value.municipio?.label ??
                 opsMuni.value.find((item) => item.value == form.value.municipio)?.label,
        departamento: form.value.departamento?.label ??
                    opsDepa.value.find((item) => item.value == form.value.departamento)?.label,
        formaEnvio: form.value.formaEnvio?.label,
      }
    );

    if (!enviarCorrespondencia?.data?.id) {
      throw new Error("No se recibió ID de envío de correspondencia");
    }

    // Cambio de estado del radicado
    const idRadicadoEstado = props.detalleRadicado.idRadicado || props.detalleRadicado.nroRadicado;
    if (!idRadicadoEstado) {
      throw new Error("No se encontró ID/número de radicado para cambiar estado");
    }

    await sgdeaAxios.patch(
      `/correspondencia/cambiarEstadoCorrespondenciaRadicacion/Por recibir correspondencia/${idRadicadoEstado}`
    );

    // Generación de colilla
    const generarColilla = await sgdeaAxios.put(
      `/envios/generarColillaEnvios/${enviarCorrespondencia.data.id}`,
      {},
      { responseType: "blob" }
    );

    if (!generarColilla.data) {
      throw new Error("No se pudo generar la colilla de envío");
    }

    blobColilla.value = URL.createObjectURL(generarColilla.data);
    const isEntesDeControl = route.path.includes('entes-de-control');

    // Creación de trazabilidad
    await crearTrazabilidad({
      proceso: `${isEntesDeControl ? 'ENTC' + props.detalleRadicado.id : 'COR' + props.detalleRadicado.id}`,
      secuencia: isEntesDeControl ? props.detalleRadicado.nroRadicado : props.detalleRadicado.idRadicado,
      estado: props.detalleRadicado?.estadoProceso?.estado || props.detalleRadicado?.estado?.estado,
      descripcion: `Usuario:${auth.$state.userInfo.name} ${telefono} ${direccion} ${departamento}${municipio} ${formaEnvio}`,
      comentario: "Se ha enviado por correspondencia",
      nombre: auth.$state.userInfo.name,
      tramite: props.detalleRadicado?.tipoTramite?.nombre || props.detalleRadicado?.solicitud?.tipoTramite,
      accion: `${auth.$state.userInfo.name} ha enviado por correspondencia el radicado ${radicadoSalida.replace('.pdf', '')}`,
    });

    // Mostrar modal de éxito
    showModalExito.value = true;

  } catch (error) {
    toast.error(error.message || "Ocurrió un error al procesar la solicitud");
  }
};

const descargarPdf = () => {
  const link = document.createElement("a");
  link.href = blobColilla.value;
  link.download = "Formato de reenvío comunicación por devolución";
  link.click();
  URL.revokeObjectURL(link.href);
};

watch(
  () => form.value.departamento,
  async (value, oldValue) => {
    if (value) {
      // Asegurémonos de que estamos usando el ID correcto
      const departamentoId = typeof value === "object" ? value.value : value;
      if (departamentoId) {
        const { optionsMunicipalities } = await useMunicipalities(
          departamentoId
        );
        opsForMuni.value = optionsMunicipalities.value;
        opsMuni.value = optionsMunicipalities.value;
        //form.value.municipio = null; // Resetear el municipio
      }
    }
  }
);

const filterDep = (val, update) => {
  if (val === "") {
    update(() => {
      opsDepa.value = opsForDepa.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opsDepa.value = opsForDepa.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterMuni = (val, update) => {
  if (val === "") {
    update(() => {
      opsMuni.value = opsForMuni.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opsMuni.value = opsForMuni.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>
<style></style>
