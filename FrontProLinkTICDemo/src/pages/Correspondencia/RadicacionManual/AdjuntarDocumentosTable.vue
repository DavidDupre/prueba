<template>
    <div>
      <q-table flat :rows="TABLE_BODY" :columns="TABLE_HEADER" :row-key="keyId" table-header-class="text-black text-h6 "
        class="q-mr-md full-width tw-bg-transparent" rows-per-page-label="Páginas" hide-pagination
        v-model:pagination="pagination" :selection="isSelection" :loading="loading" v-model:selected="selection">
        <template v-slot:body-cell-estados="props">
          <q-td class="tw-w-[125px]" v-if="isToggle">
            <!-- <q-toggle v-model="toggleValue" color="secondary" /> -->
          </q-td>
          <q-td class="tw-w-[125px]" v-else>
            <p :class="[
              'tw-border  tw-h-[20px] tw-rounded-xl col-8',
              props.row.estados
                ? ' tw-border-green-700 tw-bg-green-100'
                : ' tw-border-gray-400 tw-bg-gray-200 tw-text-black',
            ]">
              {{ props.row.estados ? "Activo" : "Inactivo" }}
            </p>
          </q-td>
        </template>

        <template v-slot:body-cell-estado="props">

          <q-td class="tw-w-[auto]">
            <q-badge style="border-radius: 9px" align="middle" class="tw-px-2 tw-py-1 tw-text-sm tw-font-bold" :class="[
              props.row.estado == 'Escalamiento Rechazado'
                ? ' tw-border-red tw-bg-red-100 tw-text-gray-400 borderRechazo'
                : ' tw-border-gray-400 tw-bg-gray-200 tw-text-gray-400',
            ]">
              {{ convertirAMayusculas(props.row.estado) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-usuario="props">
          <q-td class="tw-mx-auto row !tw-h-[70px] tw-flex tw-justify-start tw-gap-x-1 tw-items-center">
            <div class="row">
              <q-avatar class="tw-w-[50px] tw-h-[50px]">
                <img v-lazy :data-url="image" alt="image">
              </q-avatar>
            </div>
            <div class="column justify-center">
              <span class="text-black text-weight-bold !tw-w-fit text-no-wrap" style="letter-spacing: 0.5px;">{{
                props.row.usuario }}
              </span>
              <span class="text-black q-mt-xs !tw-w-fit"
                style="width: 150px; white-space: break-spaces; line-height: 17px">
                {{ props.row?.cargoUsuario ?? 'Desconocido' }}
              </span>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-formato="props">
          <q-td v-if="['application/pdf', 'pdf'].includes(obtenerExtension(props.row.nombre.toLowerCase()))" class="tw-mx-auto">
            <center>
              <img v-lazy :data-url="pdf" alt="pdf" />
            </center>
          </q-td>
          <q-td v-else-if="['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx', 'application/msword', 'doc'].includes(obtenerExtension(props.row.nombre.toLowerCase()))" class="tw-mx-auto">
            <center>
              <img v-lazy :data-url="word" alt="word" />
            </center>
          </q-td>
          <q-td v-else-if="['application/vnd.ms-excel', 'xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx', 'xml'].includes(obtenerExtension(props.row.nombre.toLowerCase()))"
            class="tw-mx-auto">
            <center>
              <img v-lazy :data-url="excel" alt="excel" />
            </center>
          </q-td>
          <q-td v-else class="tw-mx-auto">
            <center>
              <q-icon name="sym_o_unknown_document" size="xs" />
            </center>
          </q-td>
        </template>

        <template v-slot:body-cell-codigo="props">
          <q-td class="tw-flex tw-items-center tw-justify-center tw-gap-2">
            <q-avatar size="xs">
              <img v-lazy data-url="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
            <p>
              {{ props.row.codigo }}
            </p>
          </q-td>
        </template>

        <template v-slot:body-cell-caso="props">
          <q-td class="tw-w-[125px]" @click="handleCaso(props.row[rowId])">
            <p class="tw-py-1.5 tw-rounded-md col-8 tw-bg-gray-texts tw-px-4 tw-cursor-pointer tw-font-bold">
              {{ props.row.caso }}
            </p>
          </q-td>
        </template>

        <template v-slot:body-cell-trazabilidad="props">
          <q-td class="tw-cursor-pointer">
            <q-icon :name="iconTrazabilidad" size="xs" @click="handleTrazabilidad" />
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td class="text-center">
            <q-btn size="sm" color="secondary" :icon="icon || 'edit'" flat @click="
              editRow(
                props.row.id_seriesubserie || props.row.id || props.row[rowId]
              )
              " />
            <q-btn size="sm" color="secondary" :icon="secondIcon" flat v-if="isSecondIcon"
              @click="viewDetails(props.row[rowId])" />
          </q-td>
        </template>

        <template v-slot:body-cell-actionsGE="props">
          <q-td class="text-center">
            <q-btn unelevated class="tw-w-auto text-black tw-h-9" color="grey-2" @click="handleEscalamiento(props.row)">

              <span class="tw-px-4">Ver Escalamiento</span>
          </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn size="sm" color="primary" :icon="icon || 'edit'" flat @click="editData(props.row.nodeId)" />
            <q-btn v-if="['application/pdf', 'pdf'].includes(obtenerExtension(props.row.nombre.toLowerCase()))" size="sm" color="primary" :icon="thirdIcon" flat
              @click="handleThirdIcon(props.row.nodeId)" />
            <q-btn size="sm" color="primary" :icon="secondIcon" flat
              @click="handleSecondIcon(props.row.nodeId)" />
          </q-td>
        </template>

        <template v-if="!loading" v-slot:no-data="{ icon, message }">
          <div class="full-width row flex-center tw-flex tw-flex-col tw-py-8">
            <img v-lazy :data-url="NoData" alt="" width="120" />
            <span class="tw-text-xl tw-mt-4 tw-w-[480px] tw-text-center">
              {{ msgNoData ? msgNoData : "No existe data por el momento" }}
            </span>
          </div>
        </template>

        <template v-slot:body-cell-procedimiento="props">
          <div class="tw-border-b-[1px] tw-w-96 tw-px-2">
            <p class="tw-text-center tw-border-0">
              {{ collapseContent(props.row.procedimiento, 200) }}
            </p>
            <div class="tw-flex tw-justify-end" v-if="props.row.procedimiento?.length >= 200">
              <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
                {{ showingFullText ? "Ver menos" : "Ver más" }}
              </q-btn>
            </div>
          </div>
        </template>
        <template v-slot:body-cell-detalle="props">
          <q-td class="text-center">
            <div class="tw-min-w-56 tw-px-2">
              <p class="tw-text-center tw-border-0">
                {{ collapseContent(props.row.detalle, 50) }}
              </p>
              <div class="tw-flex tw-justify-end" v-if="props.row.detalle?.length >= 50">
                <q-btn flat color="secondary" @click="showingFullText = !showingFullText">
                  {{ showingFullText ? "Ver menos" : "Ver más" }}
                </q-btn>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-toggle="props">
          <q-td>
            <q-toggle v-model="props.row.toggle" color="secondary"></q-toggle>
          </q-td>
        </template>
      </q-table>
      <div class="row justify-between q-mt-md" v-if="TABLE_BODY?.length > 0">
        <div class="tw-flex tw-gap-x-3 tw-items-center">
          <span>Filas</span>
          <q-select :options="[5, 25, 50, 100]" v-model:model-value="rowsPerPage" dense outlined />
        </div>
        <q-pagination v-model="pagination.page" color="primary" :max="pagesNumber" size="md" direction-links
          boundary-links boundary-numbers />
        <q-btn icon="refresh" type="button" flat class="invisible" />
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { useRoute, useRouter } from "vue-router";

  // @ts-ignore
  import NoData from "assets/filterImage.svg";
  // @ts-ignore
  import excel from "assets/excel.svg";
  // @ts-ignore
  import pdf from "assets/pdf.svg";
  // @ts-ignore
  import word from "assets/word.svg";
  // @ts-ignore
  import image from "src/assets/mask.svg";

  const props = withDefaults(
    defineProps<{
      TABLE_BODY: any[];
      TABLE_HEADER: any[];
      itemSelected: any[];
      icon?: string;
      keyId?: string;
      msgNoData?: string;
      rowId?: string;
      isSecondIcon?: boolean;
      secondIcon?: string;
      isToggle?: boolean;
      iconTrazabilidad?: string;
      isThirdIcon?: boolean;
      thirdIcon: string;
      isSelection?: "none" | "single" | "multiple" | undefined;
      loading?: boolean;
    }>(),
    {
      keyId: "codigo",
      secondIcon: "eye",
      isSelection: "none",
      loading: false,
      icon: "printer",
      // target: ""
    }
  );
  const vuerouter = useRouter();
  const route = useRoute();
  const pagination = ref({
    sortBy: "desc",
    descending: false,
    page: 1,
    rowsPerPage: 5,
  });

  const convertirAMayusculas = (cadena) => {
    let palabras = cadena.split(" ");
    let palabrasMayusculas = palabras.map(palabra => {
      return palabra[0].toUpperCase() + palabra.slice(1);
    });
    return palabrasMayusculas.join(" ");
  }

  const rowsPerPage = ref(5);
  const selection = ref([]);
  const showingFullText = ref(false);

  let pagesNumber = computed(() =>
    Math.ceil(props.TABLE_BODY?.length / rowsPerPage.value)
  );

  const emit = defineEmits([
    "update:itemSelected",
    "update:inputDataProp",
    "handleEditData",
    "handleSecondIcon",
    "handleThirdIcon",
    "handleTrazabilidad",
    "handleCaso",
    'verEscalamiento'
  ]);

  const editData = (id: number) => {
    emit("handleEditData", id);
  };

  const handleSecondIcon = (id: any) => {
    emit("handleSecondIcon", id);
  };

  const handleCaso = (id) => {
    emit("handleCaso", id);
  };

  const handleTrazabilidad = (id) => {
    emit("handleTrazabilidad", id);
  };

  const handleThirdIcon = (id: number) => {
    emit("handleThirdIcon", id);
  };

  const handleEscalamiento = (data) => {
    emit('verEscalamiento' , data)
  }

  const obtenerExtension = (nombreArchivo) => {
    const punto = nombreArchivo.lastIndexOf('.');
    if (punto === -1) return '';
    return nombreArchivo.slice(punto + 1);
  }

  watch(rowsPerPage, (value) => {

    pagination.value.rowsPerPage = value;
  });


  watch(selection, (newdateData) => {
    selection.value = newdateData;
    emit("update:itemSelected", selection.value);
  });

  const cleanSelect = () => {
    selection.value = []
  }

  defineExpose({
    cleanSelect
  })

  function editRow(id: number) {
    vuerouter.push(route.path + "/editar/" + id);
  }

  function viewDetails(id: number) {
    vuerouter.push(route.path + "/visualizacion/" + id);
  }

  const collapseContent = (text = "", length: number) => {
    if (showingFullText.value) {
      return text;
    }
    const textLength = text?.length;
    return `${text?.slice(0, length).trim()}${textLength > length ? "..." : ""}`;
  };
  </script>

  <style>
  .material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
  }
  .borderRechazo {
    border: 1px solid #ea7878
  }
  </style>
