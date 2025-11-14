<template>
  <a @click.prevent="router.back()"
    class=" tw-text-primary q-mb-md block cursor-pointer" style="text-decoration: none">
    <q-icon size="1.5em" name="chevron_left"></q-icon>
    <b>Regresar</b>
  </a>
  <q-card class="tw-p-8 tw-rounded-lg" flat>

    <section class="tw-flex tw-justify-between tw-mb-8">
      <div class="tw-flex-1">
        <Title label="Tipologia Documental" />
      </div>
    </section>
    <div class="tw-flex tw-justify-end"></div>

    <Table :columns="columns" :url="url" :key="url" />
  </q-card>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, Ref, ref } from "vue";
import Table from "src/shared/components/PrimeComponents/Table/Table.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import { toast } from "src/helpers/toast";
import { IFiltros } from "..";
import { sgdeaArchivoAxios } from "src/services";

const router = useRouter();
const route = useRoute();

const id = route.params["id"];
const versiontrd = route.query.versiontrd;
const estado = ref();
const form: Ref<IFiltros> = ref({
  codigoSerieSub: "",
  nombreSerieSub: "",
  estadoSerieSub: "",
});

const isFilterVisible = ref(false);

const formRef = ref();

//const url = ref(`archivo/trd/series-subseries/${route.params["id"]}/paginated`);
//const url = ref(`archivo/trd/series-subseries/paginated`);

// http://172.19.8.213/archivo/trd/series-subseries?trdVersionId=1

// const url = ref(`/trd/series-subseries/paginated`);

const idSeccionSubSeccion = route.query.idSeccionSubSeccion;
const idSerieSubserie = route.query.serieSubserieId;

const url = ref(`/documentType/positiva/all?officeId=${idSeccionSubSeccion}&trdId=${versiontrd}&serieSubserieId=${idSerieSubserie}`);

const tableKey = ref(0);

const serireSubserie = ref(""); // El valor seleccionado en el q-select
const seriesSubseries = ref<any[]>([]); // Lista de opciones para el select

const serireSubserieCodigo = ref("");

  const columns: Column[] = [
    {
      field: "id",
      header: "#",
      type: "string",
    },
    {
      field: "name",
      header: "Nombre del Tipo Documental",
      type: "string",
      format: "uppercase",
      classCss: "text-right",
      replaceValue: (value) => value || "-",
    },
    {
      field: "shortName",
      header: "Nombre Corto",
      type: "string",
      replaceValue: (value) => value || "-",
    },
    {
      field: "documentTypologyCode",
      header: "Código documento calidad",
      type: "string",
      replaceValue: (value) => value || "-",
    },
    /*{
      field: "description",
      header: "Descripción",
      type: "string",
      replaceValue: (value) => value || "-",
    },*/
    {
      //field: ({ status }) => (status ? "Activo" : "Inactivos"),
      header: "Estado",
      type: "string",
      field: "status",
      replaceValue: (value) => value ? "Activo" : "Inactivo",
    },
    //  {
    //    field: "action",
    //    header: "Acciones",
    //    type: "string",
    //    format: "uppercase",
    //    classCss: "text-right",
    //    width: "50px",
    //    name: "actions",
    //    actions: [
    //      {
    //        icon: "edit",
    //        eventbtn: (row: any) => {
    //          router.push(
    //            `/clasificacion-documental/tipo-documental/editar/${row.id}`
    //          );
    //        },
    //        name: "edit",
    //        color: "primary",
    //      },
    //      {
    //     icon: "eye",
    //     eventbtn: (row: any) => {
    //       router.push(
    //         `/clasificacion-documental/gestionar-versiones/detalle-tipo-documental/${row.documentTypologyCode}`
    //       );
    //     },
    //     name: "detalle",
    //     color: "primary",
    //   },
    //    ],
    //  },
  ];

const validateAndSearch = async () => {
  const isValid = await formRef.value.validate();
  if (!isValid) {
    return;
  }
  tableKey.value++;
  searchItems();
};

// Simula el refresco de datos en la tabla (opcional)
const searchItems = () => {
  url.value = `series?description=${form.value.nombreSerieSub || ""}&code=${form.value.codigoSerieSub || ""
    }`;
};

// const goToAgregarSerieSubserie = () => {
//   router.push(`/archivo/clasificacion-documental/gestionar-versiones/series-subseries/agregar/${versiontrd}`);
// };

const goToAgregarSerieSubserie = () => {
  router.push({
    path: `/archivo/clasificacion-documental/gestionar-versiones/series-subseries/agregar/${versiontrd}`,
    query: { officeId: route.query.idSeccionSubSeccion }
  });
};
const actionFilter = () => {
  isFilterVisible.value = !isFilterVisible.value;
};

const fetchSeriesSubseries = async () => {
  try {
    const response = await sgdeaArchivoAxios.get(
      "/series/series-subseries/select"
    );
    seriesSubseries.value = response.data;
  } catch (error) {
    toast.error("Error al obtener series/subseries");
  }
};

const buscar = async () => {
  const params = new URLSearchParams();

  if (serireSubserie.value) {
    params.append(
      "description",
      encodeURIComponent(serireSubserie.value.toString())
    );
  }
  if (serireSubserieCodigo.value) {
    params.append(
      "code",
      encodeURIComponent(serireSubserieCodigo.value.toString())
    );
  }

  if (
    estado.value !== null &&
    estado.value !== undefined &&
    estado.value !== ""
  ) {
    params.append("status", estado.value ? "true" : "false");
  }

  url.value = `/documentType/positiva/all?officeId=${idSeccionSubSeccion}&trdId=${versiontrd}`;
};

const limpiar = () => {
  serireSubserie.value = "";
  estado.value = "";
  serireSubserieCodigo.value = "";
  buscar();
};
onMounted(() => {
  fetchSeriesSubseries();

  // buscar();
});

const isBuscarHabilitado = computed(() => {
  return (
    !!serireSubserie.value ||
    (estado.value !== null &&
      estado.value !== undefined &&
      estado.value !== "") ||
    !!serireSubserieCodigo.value
  );
});
</script>
