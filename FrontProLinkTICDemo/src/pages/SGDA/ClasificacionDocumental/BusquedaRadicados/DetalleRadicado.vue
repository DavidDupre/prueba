<template>
  <div>
    <BreadCrumbs :crumbs="routes" />

    <div class="pl-4 tw-font-bold tw-text-3xl tw-my-5 text-bold">
      Detalle de radicado
    </div>

    <q-card class="tw-rounded-lg tw-p-7" flat>

      <p class="tw-text-2xl tw-font-bold">Información general</p>

      <div class="tw-flex tw-full q-col-gutter-md tw-mt-2">
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Tipo de documento</p>
          <span>{{ form.tipoDocumento }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Documento</p>
          <span>{{ form.documento }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Tipo de persona</p>
          <span>{{ form.tipoPersona }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Nombre y apellido</p>
          <span>{{ form.nombreApellido }}</span>
        </div>
      </div>


      <div class="tw-flex tw-full q-col-gutter-md tw-mt-2">
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Cargo</p>
          <span>{{ form.cargo }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Dignatario</p>
          <span>{{ form.dignatario }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Teléfono</p>
          <span>{{ form.telefono }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Mail</p>
          <span>{{ form.mail }}</span>
        </div>
      </div>

      <div class="tw-flex tw-full q-col-gutter-md tw-mt-2">
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Continente</p>
          <span>{{ form.continente }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">País</p>
          <span>{{ form.pais }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Departamento</p>
          <span>{{ form.departamento }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Municipio</p>
          <span>{{ form.municipio }}</span>
        </div>
      </div>

      <div class="tw-flex tw-full q-col-gutter-md tw-mt-2">
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Dirección</p>
          <span>{{ form.direccion }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Medio de recepción</p>
          <span>{{ form.medioRecepcion }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Tipo de radicado</p>
          <span>{{ form.tipoRadicado }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Tipo documental</p>
          <span>{{ form.tipoDocumental }}</span>
        </div>
      </div>

      <div class="tw-flex tw-full q-col-gutter-md tw-mt-2">
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">No folios</p>
          <span>{{ form.nFolios }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">No anexos</p>
          <span>{{ form.nAnexos }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Desc anexos</p>
          <span>{{ form.descAnexos }}</span>
        </div>
        <div class="tw-w-1/4">
          <p class="tw-text-label tw-font-bold">Dependencia</p>
          <span>{{ form.dependencia }}</span>
        </div>
      </div>

      <div class="tw-w-full  tw-mt-4">
        <p class="tw-text-label tw-font-bold">Asunto</p>
        <span>{{ form.asunto }}</span>
      </div>
    </q-card>
  </div>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import {onMounted, onUpdated, Ref, ref} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Table from 'src/components/Table.vue';
import BreadCrumbs from 'components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import Datepicker from 'components/FormFields/datePickerComponent.vue';
import TableComponent from 'components/Tables/TableComponent.vue';
import { sgdeaAxios } from 'src/services';


interface Filters {
  codigoSerie: string;
  codigoSubserie: string;
  fechaInicial: string;
  fechaFinal: string;
  descripcion: string;
  tiempoGestion: string;
  tiempoCentral: string;
  soporte: string;
  disposicionFinal: string;
  estado: string;
  procedimiento: string;
}

const options = ref([])
const file = ref();
const header = [
  {
    name: 'number',
    label: 'ID',
    field: 'number',
    align: '',
  },
  {
    name: 'retencion',
    label: 'ID Radicado',
    field: 'retencion',
    align: 'center',
  },
  {
    name: 'disposicion',
    label: 'Tipo documento',
    field: 'disposicion',
    align: 'center',
  },
  {
    name: 'documento',
    label: 'Documento',
    field: 'documento',
    align: '',
  },
  {
    name: 'nombre',
    label: 'Nombre y apellido',
    field: 'nombre',
    align: '',
  },
  {
    name: 'fecha',
    label: 'Fecha de radicación',
    field: 'fecha',
    align: '',
  },
  {
    name: 'radicado',
    label: 'Tipo de radicado',
    field: 'radicado',
    align: '',
  },
  {
    name: 'documental',
    label: 'Tipo documental',
    field: 'documental',
    align: '',
  },
  {
    name: 'acciones',
    label: '',
    field: 'acciones',
    align: '',
  },
]

const columns = ref( [
  {
    number: 1,
    retencion: 'Frozen Yogurt',
    disposicion: 'ass',
    documento: 'asas',
    nombre: 159,
    fecha: 159,
    radicado: 120,
    documental: 6.0,
    acciones: 123
  },
]);

const q = useQuasar();
const route = useRoute()
const router = useRouter()
const showModal = ref(false)

const data = [
  {
    descripcion: 'Lorem ipsum',
    termino: 'Lorem ipsum',
    radicado: 'Lorem ipsum',
    estado: 'Activo',

  },
]
const filtersSearch: Ref<Filters> = ref({
  codigoSerie: "",
  codigoSubserie: "",
  fechaInicial: "",
  fechaFinal: "",
  descripcion: "",
  tiempoGestion: "",
  tiempoCentral: "",
  soporte: "",
  disposicionFinal: "",
  estado: "",
  procedimiento: "",
});

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/home'
  },
  {
    name: 'Clasificación documental',
    to: '/home'
  },
  {
    name: 'Búsqueda de radicados',
    to: '/home'
  },
  {
    name: 'Visualizar radicado',
    to: '/home'
  }
]


const form = ref({
  tipoDocumento: "",
  documento: "",
  tipoPersona: "",
  nombreApellido: "",
  cargo: "",
  dignatario: "",
  telefono: "",
  mail: "",
  continente: "",
  pais: "",
  departamento: "",
  municipio: "",
  direccion: "",
  medioRecepcion: "",
  tipoRadicado: "",
  tipoDocumental: "",
  nFolios: "",
  nAnexos: "",
  descAnexos: "",
  dependencia: "",
  asunto: "",
})


onMounted(async () => {

  const {data}  = await sgdeaAxios.get(`operacionesradicados/selectById?id=${router.currentRoute.value.params.id}`);

  const continentes = await sgdeaAxios.get(`continentes/list`);
  const paises = await sgdeaAxios.get(`paises/list/${data.idContinente}`);
  const departamentos = await sgdeaAxios.get(`departamentos/list/${data.idPais}`)
  const municipios = await sgdeaAxios.get(`municipios/list/${data.idDepartamento}`)
  const tipoDoc  = await sgdeaAxios.get(`/entidades/list/1`)
  const ccd  = await sgdeaAxios.post(`/tablaRetencionDocumental/paginate?pageNumber=0&pageSize=10000`,{
                                  "codigoDependencia": null,
                                  "dependencia": null,
                                  "disposicionFinal": null,
                                  "idSerie": null,
                                  "idSubserie": null,
                                  "procedimiento": null,
                                  "tiempoCentral": null,
                                  "tiempoGestion": null
                                })


  form.value.tipoDocumento = tipoDoc.data.find((val:any)=>val.idEntidad == data.idTipoDocumento).descripcion
  form.value.documento = data.documento
  form.value.tipoPersona = data.entidadPersonalNatural
  form.value.nombreApellido = data.nombreCompleto
  form.value.cargo = data.cargo
  form.value.dignatario = data.dignatario
  form.value.telefono = data.telefono
  form.value.mail = data.email
  form.value.continente = continentes.data.find((val:any)=>val.idContinente == data.idContinente).nombre
  form.value.pais = paises.data.find((val:any)=>val.idPais == data.idPais) ?
                paises.data.find((val:any)=>val.idPais == data.idPais).nombre : "-"
  form.value.departamento = departamentos.data.find((val:any)=>val.idDepartamento == data.idDepartamento) ?
                departamentos.data.find((val:any)=>val.idDepartamento == data.idDepartamento).nombre : "-"
  form.value.municipio = municipios.data.find((val:any)=>val.idMunicipio == data.idMunicipio) ?
                municipios.data.find((val:any)=>val.idMunicipio == data.idMunicipio).nombre : "-"
  form.value.direccion = data.direccion
  form.value.medioRecepcion = data.idMedioRecepcion
  form.value.tipoRadicado = data.tipoRadicado.nombreTipoRadicado
  form.value.tipoDocumental = data.tipoDocumentaL.descripcion
  form.value.nFolios = data.numeroFolios
  form.value.nAnexos = data.numeroAnexos
  form.value.descAnexos = data.descripcionAnexos
  form.value.dependencia = ccd.data.content.find((val:any)=>val.tipoDocumento?.id_tipo_documental ==
                data.tipoDocumentaL.id_tipo_documental).idDependencia.nombre
  form.value.asunto = data.asunto

})

</script>

<style lang="scss" scoped>

</style>
