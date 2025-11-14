<template>
  <div class="q-py-lg">
    <div class="tw-pt-4">
      <router-link to="/facturacion/facturas-manual">
        <q-btn flat color="primary" label="Volver" icon="chevron_left" />
      </router-link>
    </div>
    <div class="tw-flex tw-justify-between tw-pt-4">
      <ComponentTitle class="" :title="'Caso #' + initialData.secuencia ?? ''" classTitle="tw-font-bold tw-text-4xl" />
      <q-btn class="tw-w-52 tw-h-10 flex q-mt-sm" color="primary" @click="pruebaTab">
        <q-icon name="add" class="q-mr-sm" size="20px" />
        Cargar documento
      </q-btn>
    </div>
    <div class="tw-flex tw-items-center tw-justify-between">
      <div class="tw-flex tw-flex-col">


        <q-chip square :ripple="false"
          class="tw-border-[0.5px] tw-border-solid tw-border-[#0049ff] tw-bg-[#e5edff] tw-text-[#2c3948] tw-rounded-lg tw-mr-auto">
          Por emitir
        </q-chip>
      </div>
    </div>
    <q-form ref="formLoad" v-if="load == true">
      <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
        <div class="col row">
          <p class="tw-text-2xl tw-font-bold">Adjunte de documento</p>
        </div>

        <div class="tw-mt-2">
          <div class="row q-col-gutter-md q-pb-md q-px-md">
            <!-- Adjunte los documentos -->
            <div class="col-12">
              <label class="tw-w-full">

                <FileLoader v-model="loadDocument" class="tw-w-full" accept-file="xls, xlsx"
                  :max-file-size="8 * 1024 * 1024" max-file-size-label="8" :max-files="1" @rejected="rejectedFiles" />
              </label>
            </div>
          </div>
        </div>
      </q-card>
    </q-form>
    <q-card class="tw-rounded-xl tw-mt-8" flat bordered>
      <q-tabs v-model="tab" no-caps indicator-color="white" align="left">
        <q-tab :key="tab.key" :name="tab.key" :ripple="false" class="tw-px-2" v-for="tab in uiTabs"
          @click="event => handleSwitchTab(event, tab)">
          <q-chip :icon="tab.icon" square :ripple="false"
            style="border: .5px solid #A5B1BF; background: #FFFFFF; color: #2C3948; border-radius: 8px;">
            {{ tab.name }}
          </q-chip>
        </q-tab>
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="tw-bg-transparent">
      <q-tab-panel name="infoGeneral" class="q-pa-none">
        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Información básica</b>
              </div>
            </template>

            <div class="q-pb-lg q-px-md tw-flex tw-justify-between tw-gap-8">
              <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                <p class="titles">Dependencia</p>
                <p>{{ initialData.dependencia }}</p>
                <p class="titles">Tipo de trámite</p>
                <p>Facturacion Administrativa</p>
                <p class="titles">Tipo de documento</p>
                <p>{{ initialData.tipoDocumento }}</p>
                <p class="titles">Primer apellido</p>
                <p>{{ initialData.primerApellido }}</p>
                <p class="titles">Primer nombre</p>
                <p>{{ initialData.primerNombre }}</p>
              </div>

              <div class="tw-flex tw-flex-col tw-leading-6 tw-w-1/2">
                <p class="titles">Responsable del proceso</p>
                <p>{{ initialData.responsable }}</p>
                <p class="titles">Canal de recepción</p>
                <p>{{ initialData.canal }}</p>
                <p class="titles">Número de identificación</p>
                <p>{{ initialData.numeroDocumento }}</p>
                <p class="titles">Segundo apellido</p>
                <p>{{ initialData.segundoApellido }}</p>
                <p class="titles">Otros nombres</p>
                <p>{{ initialData.otrosNombres }}</p>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Información documento soporte equivalente</b>
              </div>
            </template>

            <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">

              <div class="tw-flex tw-flex-col tw-w-full">
                <p class="titles">Tipo de bien o servicio</p>
                <p>{{ initialData.bienServicio }}</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-full">
                <p class="titles">Observación</p>
                <p>{{ initialData.observacion }}</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">Valor</p>
                <p>{{ initialData.valor }}</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">Valor en letras</p>
                <p>{{ initialData.valorLetra }}</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-full">
                <p class="titles">Aprobador</p>
                <p>{{ initialData.aprobador }}</p>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Campos automáticos al radicar</b>
              </div>
            </template>

            <div class="q-pb-lg q-px-md tw-flex tw-flex-wrap tw-justify-start tw-gap-x-8 tw-leading-6">
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">FECHA / sistema a radicar</p>
                <p>{{ moment(initialData.fecha_hora).format("DD/MM/YYYY") }}</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">HORA / sistema al radicar</p>
                <p>{{ moment(initialData.fecha_hora).format("HH:MM") }}</p>
              </div>
              <div class="tw-flex tw-flex-col tw-w-[48%]">
                <p class="titles">Estado de trámite</p>
                <p>{{ initialData.estado }}</p>
              </div>
            </div>
          </q-expansion-item>
        </q-card>

        <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
          <q-expansion-item default-opened>
            <template v-slot:header>
              <div class="col row">
                <b class="tw-text-lg">Solicitud</b>
              </div>
            </template>

            <p class="titles q-px-md q-mb-md q-mt-lg">Documentos adjuntos</p>

            <div class="flex row q-px-md wrap q-mr-auto tw-gap-3 q-pb-md">
              <a href="../../../../assets/doc1.xlsx" target="_blank">
                <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="PDFIcon">
                  <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                  <a href="../../../../assets/doc1.xlsx" download>
                    <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                  </a>
                </q-card>
              </a>

              <a href="../../../../assets/doc1.xlsx" target="_blank">
                <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="PDFIcon">
                  <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                  <a href="../../../../assets/doc1.xlsx" download>
                    <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                  </a>
                </q-card>
              </a>

              <a href="../../../../assets/doc1.xlsx" target="_blank">
                <q-card class="flex row items-center tw-gap-x-2 q-px-md q-py-sm tw-max-w-[210px]" flat bordered>
                  <img style="width: 26px" v-lazy :data-url="PDFIcon">
                  <p class="tw-text-sm tw-font-semibold">evidencia.pdf</p>
                  <q-icon size="20px" class="tw-text-[#6B737C]" name="error_outline" />
                  <a href="../../../../assets/doc1.xlsx" download>
                    <q-icon size="20px" class="tw-text-[#6B737C] tw-cursor-pointer" name="file_download" />
                  </a>
                </q-card>
              </a>
            </div>
          </q-expansion-item>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="docsRelacionados">
        <q-card class="tw-rounded-xl tw-mt-4 q-pa-md" flat bordered>
          <div class="col ">
            <div class="tw-flex tw-justify-between tw-pt-4">
              <p class="tw-text-lg text-weight-bold q-mx-lg">
                Documentos relacionados
              </p>
              <q-btn class="tw-w-52 no-shadow" color="primary" @click="sendDocument = true">
                <q-icon name="send" class="q-mr-sm" size="20px" />
                Enviar documentos
              </q-btn>
            </div>

            <TableDocs :TABLE_BODY="rowsDocs" :TABLE_HEADER="columnsDocs" row-key="nombre_documento"
              type-selection="single" />
          </div>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="trazabilidad">
        <q-card class="tw-rounded-xl tw-mt-4 q-pa-md" flat bordered>
          <p class="tw-text-lg text-weight-bold q-mx-lg">
            Trazabilidad
          </p>
          <div class="col">
            <TableRadicados class="q-pa-md" :TABLE_HEADER="columnsTrazabilidad" :TABLE_BODY="rowsTrazabilidad"
              key-id="usuarios" />
          </div>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="sendDocument">
      <q-card class="q-py-xl q-px-xl">
        <div class="tw-rounded-lg tw-flex tw-justify-center">
          <span class="tw-rounded-[50px] tw-flex tw-justify-center"
            style="background-color: rgba(0, 219, 0, 0.05); width: 130px; height: 82px">
            <img v-lazy :data-url="Mail" alt="mail" width="40">
          </span>
        </div>

        <p class="tw-text-[24px] text-center tw-font-bold q-mt-lg q-mb-md">
          Disposición de factura electrónica
        </p>
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="col row">
              <b class="tw-text-base text-grey-7">Enviar a</b>
            </div>
          </template>

          <q-input bottom-slots @keyup.enter="addEmail()" v-model="emailForm.email" label="Inserte el correo">
            <template v-slot:append>
              <q-icon name="add" @click="addEmail()" class="q-mr-sm roundedDocBTN cursor-pointer" color="white"
                size="16px" />
            </template>
            <template v-slot:prepend>
              <q-icon name="check_circle" class="q-mr-sm cursor-pointer" color="grey-4" size="16px" />
            </template>
          </q-input>
          <q-list bordered v-if="emailForm.listEmails.length > 0" class="rounded-borders" style="max-width: 600px">
            <!-- <q-item-label header>label</q-item-label> -->
            <div v-for="list in emailForm.listEmails">
              <q-item>
                <q-item-section avatar>
                  <q-icon name="check_circle" class="q-mr-sm cursor-pointer" color="grey-4" size="16px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <span class="text-weight-medium">{{ list }}</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-icon name="close" class="q-mr-sm cursor-pointer" @click="deleteEmail(list)" color="grey-4"
                      size="16px" />
                  </div>
                </q-item-section>
              </q-item>

              <q-separator />
            </div>


          </q-list>
        </q-expansion-item>

        <div class="col-12">
          <span class="tw-w-full">
            <b class="tw-text-base text-grey-7 q-ml-md">Asunto del correo</b>
            <q-input v-model="emailForm.subject" dense label="Ingrese" outlined class="tw-rounded-lg" :rules="[]">
            </q-input>
          </span>
        </div>
        <div class="col-12 q-mt-lg">
          <span class="tw-w-full">
            <b class="tw-text-base text-grey-7 q-ml-md">Seleccione los documentos a enviar</b>
            <q-list bordered separator class="rounded-borders">
              <q-item v-for="(doc, index) in rowsDocs" tag="label" v-ripple>
                <q-item-section side top>
                  <q-checkbox @click="addDocument(index, doc)" v-model="checkList[index]" />
                </q-item-section>

                <q-item-section>
                  <div class="row">
                    <img style="width: 26px" v-lazy :data-url="excelIcon">
                    <q-item-label class="q-mt-xs q-ml-sm">{{ doc.nombre_documento }}</q-item-label>
                  </div>

                </q-item-section>
              </q-item>
            </q-list>
          </span>
        </div>
        <div class="tw-flex tw-justify-between tw-mt-8">
          <q-btn class="tw-w-44 tw-h-16" flat color="white" text-color="black" @click="() => sendDocument = false">
            <span class="tw-px-5">Cancelar</span>
          </q-btn>
          <q-btn class="tw-w-44 tw-h-16 tw-ms-4" color="secondary" @click="">
            <span class="tw-px-5">Enviar</span>
          </q-btn>

        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ComponentTitle from "src/components/ComponentTitle/ComponentTitle.vue";
import moment from "moment";
import TableDocs from 'components/Tables/TableDocsRelacionados.vue'
// @ts-ignore
import PDFIcon from "src/assets/pdf.svg";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import excelIcon from "../../../assets/excel.svg";
import Mail from "src/assets/mail.svg";
import FileLoader from "src/components/FormFields/FileLoader.vue";
import TableRadicados from 'components/Tables/TableRadicados.vue'

interface UITab {
  key: string;
  icon: string;
  name: string;
}

const load = ref(false);
const sendDocument = ref(false)
const loadDocument = ref()
const email = ref()
const checkList = ref([])

const emailForm = ref({
  listEmails: [],
  subject: '',
  docList: [],
  email: ''
})
const columnsTrazabilidad = [
  {
    name: "iniciaEvento",
    label: "Inicia evento",
    field: "iniciaEvento",
    sortable: true,
    align: 'center'
  },
  {
    name: "proceso",
    label: "Proceso",
    field: "proceso",
    sortable: true,
    align: 'center'
  },
  {
    name: "descripcion",
    label: "Descripcion",
    field: "descripcion",
    sortable: true,
    align: 'center'
  },
  {
    name: "estados",
    label: "Estado",
    field: "estados",
    sortable: true,
    align: 'center'
  },
]

const rowsTrazabilidad = [
  // {
  //     iniciaEvento: '14 / 02 / 2023 13:45',
  //     proceso: 'Leyendo excel',
  //     estados: 'Oficina asignada',
  //     descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam porta vel erat eu consequat.',
  // },
]

const columnsDocs = [
  {
    name: "formato",
    label: "Formato",
    field: "formato",
    sortable: true,
    align: "center",
  },
  {
    name: "nombre_documento",
    label: "Nombre del documento",
    field: "nombre_documento",
    sortable: true,
    align: "center",
  },
  {
    name: "tipo_documento",
    label: "Tipo de documento",
    field: "tipo_documento",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha_cargue",
    label: "Fecha de cargue",
    field: "fecha_cargue",
    sortable: true,
    align: "center",
  },
  {
    name: "cargado_por",
    label: "Cargado por",
    field: "cargado_por",
    sortable: true,
    align: "center",
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    sortable: true,
    align: "center",
  },
];

const rowsDocs = ref([
  // {
  //     formato: 'pdf',
  //     nombre_documento: 'Nombre de documento.pdf',
  //     tipo_documento: 'De salida',
  //     fecha_cargue: '14/02/2023 13:45',
  //     cargado_por: 'Pedro Pérez',
  //     acciones: ''
  // },
  // {
  //     formato: 'word',
  //     nombre_documento: 'Nombre de documento.word',
  //     tipo_documento: 'De entrada',
  //     fecha_cargue: '14/02/2023 13:45',
  //     cargado_por: 'Pedro Pérez',
  //     acciones: ''
  // }
])

const uiTabs: UITab[] = [
  {
    key: 'docsRelacionados',
    icon: 'folder',
    name: 'Documentos relacionados',
  },
  {
    key: 'trazabilidad',
    icon: 'timer',
    name: 'Trazabilidad'
  },
];

const route = useRoute();
const router = useRouter();
const routeNumber = ref<string>('');
const tab: any = ref(route.params.tab)
const initialData = ref<any>({})

onMounted(async () => {
  await getData()
})

//@ts-ignore
onBeforeMount(async () => { await getAllRegisters(); routeNumber.value = route.params.id; });

const getData = async () => {
  const idParams = route.params.id as string
  if (!idParams) manualNotFound(idParams)

  try {
    const id = parseInt(idParams)
    const response = await sgdeaAxios.get(`/facManual/obtenerRegistroExcelFacturaManual?id=${id}`);

    if (response.status !== 200) manualNotFound(id);

    initialData.value = response.data;
  } catch (error) {
    manualNotFound(idParams)
  }

  rowsDocs.value.forEach(element => {
    checkList.value.push(false)
  });
}

const handleSwitchTab = async (_, currentTab: UITab) => {
  if (currentTab.key === 'aprobar' || currentTab.key === 'rechazar') {
    tab.value = 'infoGeneral';
    return;
  }
}

const pruebaTab = async () => {
  // tab.value = 'infoGeneral';
}

const addDocument = (i, data) => {
  if (checkList.value[i]) {
    emailForm.value.docList.push(data)
  } else {
    emailForm.value.docList = emailForm.value.docList.filter(item => item !== data);

  }
}

const addEmail = () => {
  if (!emailForm.value.listEmails.includes(email.value)) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patron.test(email.value)) {
      showNotif('Ingrese un correo electrónico válido')
    } else {
      emailForm.value.listEmails.push(email.value)
      email.value = ''
    }
  } else {
    showNotif("El correo ya se encuentra en la lista");
  }
}

const deleteEmail = (data) => {
  emailForm.value.listEmails = emailForm.value.listEmails.filter(item => item !== data);
}

const manualNotFound = (id?: number | string) => {
  let message = 'Factura manual no existe';

  if (Boolean(id)) {
    message = 'Factura manual con id ' + id + ' no existe.'
  }

  toast.error(message);

  router.replace('/facturacion/facturas-manual/');
}

function showNotif(title: string) {
  toast.error(title);
}

const rejectedFiles = (error) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    showNotif("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    showNotif("Solo se pueden adjuntar 30 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === 'accept')) {
    showNotif('Formato inválido, los formatos permitidos son (xls, xlsx).')
  }
};

</script>

<style>
.titles {
  color: #6B737C;
  font-weight: bold;
  margin-top: 10px;
}

.no-shadow:before {
  box-shadow: none !important;
}

.roundedDocBTN {
  background-color: #ff7500;
  border-radius: 9999px;
}
</style>
