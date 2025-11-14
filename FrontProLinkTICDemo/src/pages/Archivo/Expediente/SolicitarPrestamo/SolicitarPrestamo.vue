<template>
  <q-card class="tw-rounded-lg tw-p-8" flat>
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-8">
      <h1 class="tw-flex-1 tw-text-3xl tw-font-bold tw-my-4">
          Consultar solicitudes de préstamo
        </h1>
      <div>
        <Button label="Crear solicitud" type="primary" color="primary" :class="'tw-w-full'"
          icon-right="circle-arrow-right" @click="router.push('/archivo/crear-solicitar-prestamo')" />
      </div>
    </div>

    <!-- Formulario de Filtros -->
    <q-form ref="formRef" greedy @submit="fetchData">
      <div class="row tw-gap-4">
        <!-- No. SAP o Radicado -->
        <q-input outlined dense v-model="numeroRadicado" label="No. SAP o Radicado" class="tw-flex-1" />

        <!-- Oficina Productora -->
        <q-select outlined dense emit-value map-options :options="optionsDependencias" v-model="dependenciaId"
          label="Oficina Productora" class="tw-flex-1" />

        <q-select outlined dense emit-value map-options :options="[
          { label: 'ACTIVO', value: 'ACTIVO' },
          { label: 'DEVUELTO', value: 'DEVUELTO' },
          { label: 'APROBADO', value: 'APROBADO' },
          { label: 'RECHAZADO', value: 'RECHAZADO' }
        ]" v-model="estadoSeleccionado" label="Estado" class="tw-flex-1" />

      </div>

      <div class="row tw-gap-4 tw-mt-4">
        <!-- Fecha Inicial -->
        <q-input outlined dense type="date" v-model="fechaInicial" label="Fecha Inicial" class="tw-flex-1"
          :rules="[validateFechaInicial]" />

        <!-- Fecha Final -->
        <q-input outlined dense type="date" v-model="fechaFinal" label="Fecha Final" class="tw-flex-1"
          :rules="[validateFechaFinal]" />
      </div>

      <!-- Botones -->
      <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
        <Button label="Limpiar" type="tertiary" color="blue" type-button="button" icon-left="circle-xmark"
          @click="resetForm" />
        <Button label="Buscar" type="primary" color="secondary" type-button="submit" icon-right="search" />
      </div>
    </q-form>

    <!-- Tabla -->
    <Table :url="url" :show-search="false" :key="url" :columns="columns" />
  </q-card>

</template>


<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import { fourthFormatDate, formatDateTimeStandTwo } from "src/helpers/formtDate";
import { toast } from "src/helpers/toast";
import { sgdeaArchivoAxios, sgdeaAxios } from "src/services";
// import Label from "src/shared/components/Ui/Label/Label.vue";
// import ConfirmModal from "src/components/Modal/ConfirmModal.vue";
const router = useRouter();
// const selectedRow = ref(null);
const numeroRadicado = ref("");
const dependenciaId = ref("");
const fechaInicial = ref("");
const fechaFinal = ref("");
const url = ref("");
const expedienteId = ref('');
const expedienteNombre = ref('');
// let showModalSend = ref(false)
const expediente = ref({
  idExpendiente: "",
  identificationCode: "",
  radicado: "",
});

const estadoSeleccionado = ref('');

onMounted(() => {
  fetchData();
  getDependencia();
  cargarDatos()
});

const optionsDependencias = ref([]);

const validateFechaInicial = (value: string) => {
  if (!value) return true;
  if (fechaFinal.value && new Date(value) > new Date(fechaFinal.value)) {
  }
  return true;
};

const validateFechaFinal = (value: string) => {
  if (!value) return true;
  if (fechaInicial.value && new Date(value) < new Date(fechaInicial.value)) {
  }
  return true;
};

const getDependencia = async () => {
  try {
    const response = await sgdeaAxios.get("/seccionSubSeccion");
    optionsDependencias.value = response.data
      .map((dependencia: any) => ({
        value: dependencia.idSeccionSubSeccion,
        label: dependencia.nombre,
      }));
  } catch (error) {
    toast.error("Error al obtener la dependencia");
  }
};

const allOptionsExpendientes = ref([
  { id: null, nombre: '' },
])


const filteredOptions = ref([...allOptionsExpendientes.value]);

// function filtrarOpciones(val, update) {
//   update(() => {
//     const texto = val.toLowerCase();
//     filteredOptions.value = allOptionsExpendientes.value.filter(op =>
//       op.nombre.toLowerCase().includes(texto)
//     );
//   });
// }

const columns = [
  {
    field: "idSolicitud",
    header: "#",
    type: "string",
    sort: true,
  },
  {
    field: "alertaColorFechaSolicitud",
    name: "semaforo",
    header: "Semáforo",
    type: "string",
    sort: true,
    classCss: "center",
  },
  {
    field: "idDependencia",
    header: "Dependencia solicitante",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      const dependencia = optionsDependencias.value.find(
        (option: any) => option.value === value
      );
      return dependencia ? dependencia.label : "-";
    },
  },
  {
    field: "numeroRadicado",
    header: "No. SAP o Radicado",
    type: "string",
    sort: true,
  },
  {
    field: "fechaInicial",
    header: "Fecha Inicial",
    type: "string",
    replaceValue: (value: any) => (value ? fourthFormatDate(value) : "N/A"),
    sort: true,
  },
  {
    field: "fechaFinal",
    header: "Fecha Final",
    type: "string",
    replaceValue: (value: any) => (value ? fourthFormatDate(value) : "N/A"),
    sort: true,
  },
  {
    field: "fechaSolicitud",
    header: "Fecha de solicitud",
    type: "string",
    replaceValue: (value: any) => (value ? fourthFormatDate(value) : "N/A"),
    sort: true,
  },
  {
    field: "fechaProrroga",
    header: "Fecha de prórroga",
    type: "string",
    replaceValue: (value: any) => (value ? fourthFormatDate(value) : "N/A"),
    sort: true,
  },
  {
    field: "ubicacionTopografica",
    header: "Ubicación Topográfica",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value !== null && value !== undefined && value !== "" ? value : "-";
    },
  },
  {
    field: "numeroFolios",
    header: "No. de folios",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value !== null && value !== undefined && value !== "" ? value : "-";
    },
  },
  {
    field: "nombreSolicitante",
    header: "Nombre solicitante",
    type: "string",
    sort: true,
  },
  {
    field: "motivoSolicitud",
    header: "Motivo de Solicitud",
    type: "string",
    sort: true,
  },
  {
    field: "nombreSerieExpediente",
    header: "Serie",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value !== null && value !== undefined && value !== "" ? value : "-";
    },
  },
  {
    field: "serieExpediente",
    header: "Subserie",
    type: "string",
    sort: true,
    replaceValue: (serieExpediente: any) => {
      if (!serieExpediente || !Array.isArray(serieExpediente.subseries)) return "-";
      return serieExpediente.subseries.map((s: any) => s.description).join(", ");
    },
  }
  ,
  {
    field: "nombreTipoDocumentalExpediente",
    header: "Tipos documentales",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value !== null && value !== undefined && value !== "" ? value : "-";
    },
  },
  {
    field: "tituloExpediente",
    header: "Expedientes asociados",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value !== null && value !== undefined && value !== "" ? value : "-";
    },
  },
  {
    field: "soporte",
    header: "Fisico",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value === "FISICO" ? "Si" : "No";
    },

  },

  {
    field: "soporte",
    header: "Soporte",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value !== null && value !== undefined && value !== "" ? value : "-";
    },

  },
  {
    field: "codigoUnidadAlmacenamiento",
    header: "Unidad de conservación",
    type: "string",
    sort: true,
    replaceValue: (value: any) => {
      return value !== null && value !== undefined && value !== "" ? value : "-";
    },
  },
  {
    field: "estado",
    header: "Estado",
    type: "string",
    sort: true,
  },
  {
    field: "action",
    name: "actions",
    header: "Archivo",
    type: "string",
    classCss: "center",
    sort: true,
    width: "200px",
    actions: [
      {
        eventbtn: (rowData: any) => {
          // router.push(`/expediente/solicitar-prestamo/detalle/${rowData.idSolicitud}`);
        },
        name: "ver",
        label: "Ver",
        color: "primary",
        style: "tw-w-full",
      },
    ],
  },

  {
    field: "action",
    name: "actions",
    header: "Asociar Expediente",
    type: "string",
    classCss: "center",
    sort: true,
    width: "200px",
    actions: [

      {
        eventbtn: (rowData: any) => {
          // router.push({
          //   path: "/archivo/inventario-documental/consultar-inventario",
          //   query: { idPrestamo: rowData.idSolicitud }
          // });
        },
        name: "aprobar",
        label: "",
        color: "primary",
        icon: "circle-check",
        textColor: "white",
      },

    ],
  }
];

const fetchData = async () => {
  if (fechaInicial.value && fechaFinal.value && new Date(fechaInicial.value) > new Date(fechaFinal.value)) {
    toast.error("La fecha inicial no puede ser mayor que la fecha final");
    return;
  }

  url.value =
    `/archivo/prestamo/obtener?` +
    `${numeroRadicado.value
      ? `numeroRadicado=${encodeURIComponent(numeroRadicado.value)}`
      : ""
    }` +
    `${dependenciaId.value
      ? `&dependenciaId=${encodeURIComponent(dependenciaId.value)}`
      : ""
    }` +
    `${fechaInicial.value
      ? `&fechaInicial=${encodeURIComponent(formatDateTimeStandTwo(fechaInicial.value))}`
      : ""
    }` +
    `${fechaFinal.value
      ? `&fechaFinal=${encodeURIComponent(formatDateTimeStandTwo(fechaFinal.value))}`
      : ""
    }`

    +
    `${estadoSeleccionado.value
      ? `&estados=${encodeURIComponent(estadoSeleccionado.value)}`
      : ""
    }`;
};

const resetForm = () => {
  numeroRadicado.value = "";
  dependenciaId.value = "";
  fechaInicial.value = "";
  fechaFinal.value = "";
  url.value = "";
  estadoSeleccionado.value = "";
  fetchData();
};

// const verSolicitud = (row: any) => {
//   selectedRow.value = row;
//   expediente.value = {
//     idExpendiente: row.idExpediente || null,
//     identificationCode: row.idSolicitud || "",
//     radicado: row.numeroRadicado || "",
//   };
// };

// const cancelar = () => {
//   selectedRow.value = null;
//   expedienteId.value = null;
//   showModalSend.value = false;
//   expedienteNombre.value = null;
// };

async function cargarDatos() {
  // try {
  //   const response = await sgdeaAcueducto.get('archivo/record/all-expedientes')
  //   const data = response.data || []
  //   allOptionsExpendientes.value = data.
  //     sort((a: any, b: any) => a.title.localeCompare(b.title)).
  //     map(item => ({
  //       id: item.recordId,
  //       nombre: item.title
  //     }))
  //   filteredOptions.value = [...allOptionsExpendientes.value]

  // } catch (error) {
  //   console.error(error)
  // }
}
const handleSelection = (selected) => {

  expedienteId.value = selected.id;
  expedienteNombre.value = selected.nombre;
};

</script>
