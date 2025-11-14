<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0  ">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 ">

        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar Sucursal</h1>

      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Sucursal</h3>
        <q-form ref="createForm">
          <div
            class="tw-grid tw-grid-cols-6 tw-gap-4 tw-border-b tw-border-b-gray-[#969EAF] tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">

            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Codigo Sucursal </label>
              <q-input filled disable v-model="form.codigo" label="Inserte" outlined class="mb-3" :rules="[rulesValidation]"
                dense />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Nombre Sucursal * </label>
              <q-input v-model="form.nombre" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, v => lengthValidation(50, v)]" dense />
            </span>
            <span class="tw-col-span-6">
              <label for="code" class="tw-text-label">Empresa * </label>
              <q-select v-model="form.empresa" :options="empresasOptions" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, v => rulesValidation(v)]" dense />
            </span>
            <span class="tw-col-span-2">
              <label for="code" class="tw-text-label">Pais * </label>
              <q-select v-model="form.pais" :options="paiseOptions" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, v => rulesValidation(v)]" dense />
            </span>
            <span class="tw-col-span-2">
              <label for="code" class="tw-text-label">Departamento * </label>
              <q-select v-model="form.departamento" label="Inserte" :options="departamentoOptions" outlined class="mb-3"
                :rules="[rulesValidation, v => rulesValidation(v)]" dense />
            </span>
            <span class="tw-col-span-2">
              <label for="code" class="tw-text-label">Municipio * </label>
              <q-select :options="municipioOptions" v-model="form.municipio" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, v => rulesValidation(v)]" dense />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Direccion * </label>
              <q-input v-model="form.direccion" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, v => lengthValidation(150, v)]" dense />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Localidad * </label>
              <q-input v-model="form.localidad" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, v => lengthValidation(150, v)]" dense />
            </span>
            <span class="tw-col-span-3">
              <label for="description" class="tw-text-label">Telefono * </label>
              <q-input v-model="form.telefono" label="Inserte" outlined class="mb-3 "
                :rules="[rulesValidation, v => lengthValidation(10, v), val => /^[0-9]+$/.test(val) ? true : 'Ingrese un numero telefonico valido']" id="description" dense />

            </span>
            <span class="tw-col-span-3">
              <label for="initialDate" class="tw-text-label">Correo Electronico *</label>
              <q-input v-model="form.email" label="Inserte" outlined class="mb-3 " :rules="[
                rulesValidation,
                validationEmail,
                v => lengthValidation(50, v)
              ]" id="description" dense />
            </span>
            <span class="tw-col-span-3">
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ form.estado === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="form.estado" :rules="[rulesValidation]" color="secondary"></q-toggle>
              </div>

            </span>

            <div class="tw-col-span-6 tw-h-[200px]">
              <p class="tw-text-label tw-font-bold">Información adicional</p>
              <q-input outlined v-model="form.informacionAdicional" label="Inserte" class="" type="textarea"
                dense :rules="[v => lengthValidation(150, v)]" />
            </div>
            <div class="tw-col-span-6 tw-h-[200px]">
              <p class="tw-text-label tw-font-bold">Observaciones</p>
              <q-input outlined v-model="form.observacion" label="Inserte" class="" type="textarea" dense
                :rules="[v => lengthValidation(150, v)]"/>
            </div>
            <div class="tw-col-span-3">
              <q-checkbox v-model="form.atencionPublico" label="Atencion al publico"></q-checkbox>
            </div>

          </div>

          <div class="row tw-flex tw-justify-center tw-cols-6 tw-mt-8 tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="cancelModal = true" />
            <q-btn label="Guardar cambios" @click="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model="cancelModal" title="¡Espera un momento!" :text="textMsg" text-button="SI"
        @handleAccept="() => router.push('/administracion/sucursales')" @closeModal="cancelModal = false"
        label="Confirmar" cancelButton text-button-cancel="NO" />
      <Modal v-model="showModal" title="Edición exitosa"
        :text="`La sucursal ${form.codigo} ${form.nombre} fue modificada correctamente`" is-success text-button="¡Ok!"
        @handleAccept="handleModal" />
      <Modal v-model="errorModal" title="Error" :text="errMsg" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
    </main>
  </section>
</template>

<script  lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  useCountries,
  useDepartments,
  useMunicipalities
} from "src/composables/useVersion";
import BreadCrumbs from 'src/components/BreadCrumbs/BreadCrumbs.vue';
import Modal from 'components/Modal/Modal.vue';
import { routes } from ".."
import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";


const data = ref()


const paiseOptions = ref([])
const departamentoOptions = ref([])
const municipioOptions = ref([])
const empresasOptions = ref([])
const errMsg = ref()

const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Administracion',
    to: '/administracion'
  },
  {
    name: 'Sucursal',
    to: '/administracion/sucursales'

  },
  {
    name: 'Editar Sucursales',
    to: '/administracion/sucursal/editar'

  },

]

async function loadFilter() {
  await loadPaises();
  await loadDepartamentos();
  await loadMunicipios();
  await loadEmpresas()


};


const showNotif = () => {
  toast.error('Diligencie todos los campos para modificar la sucursal')
}

const form: Ref<any> = ref({
  codigo: "",
  nombre: "",
  empresa: "",
  pais: "",
  departamento: "",
  municipio: "",
  direccion: "",
  localidad: "",
  telefono: "",
  email: "",
  estado: true,
  informacionAdicional: "",
  atencionPublico: true,
  observacion: ""
});

const textMsg = ref()


const route = useRoute()
const router = useRouter()
const showModal = ref(false)
const errorModal = ref(false)
const cancelModal = ref(false)


const editForm = ref()
const departmentList = ref([]);
const municipalitiesList = ref([])
const createForm = ref()

async function loadEmpresas() {
  const { data } = (await sgdeaAxios.get("/empresas/?activo=true"));
  empresasOptions.value = [...empresasOptions.value, ...data.map((val: any) => {
    return {
      label: val.nombre,
      id: val.idEmpresa
    }
  })]
};


async function loadPaises() {
  const { data } = (await sgdeaAxios.get("/paises/list"));
  paiseOptions.value = [...paiseOptions.value, ...data.map((val: any) => {
    return {
      label: val.nombre,
      id: val.idPais
    }
  })]
};

async function loadDepartamentos() {
  const { data } = (await sgdeaAxios.get("/departamentos/list"));
  departamentoOptions.value = [...departamentoOptions.value, ...data.map((val: any) => {
    return {
      label: val.nombre,
      id: val.idDepartamento
    }
  })]
};

async function loadMunicipios() {
  const { data } = (await sgdeaAxios.get("/municipios/list"));
  municipioOptions.value = [...municipioOptions.value, ...data.map((val: any) => {
    return {
      label: val.nombre,
      id: val.idDepartamento
    }
  })]
};


const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
}

function validationEmail(email: string) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!patron.test(email)) {
    return 'Ingrese un correo electrónico válido';
  }
}

const lengthValidation = (n, val: string) => val.length <= n || 'Máximo ' + n + ' carácteres';

watch(() => form.value.pais, async (value) => {
  const { optionsDepartments } = await useDepartments(value.value);
  departmentList.value = optionsDepartments.value
})

watch(() => form.value.departamento, async (value) => {
  const { optionsMunicipalities } = await useMunicipalities(value.value);
  municipalitiesList.value = optionsMunicipalities.value
})

const editSucursal = async () => {
  if (await editForm.value.validate()) {
    const response = (await sgdeaAxios.post("/serie/serie", {
      codigo: String(form.value.codigo),
      descripcion: form.value.descripcion,
      estados: form.value.estados,
      tipo_de_soporte: 1,
      id_seriesubserie: 0,
      id_padre: 1,
      fecha_vigencia_inicial: moment(form.value.fecha_vigencia_inicial).format("YYYY-MM-DD"),
      fecha_vigencia_final: moment(form.value.fecha_vigencia_final).format("YYYY-MM-DD"),
    }))

    if ([405, 401, 404, 400, 403, 500].includes(response.response?.status)) {
      errorModal.value = true
    } else if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
  }
}

const getById = async () => {
  const id = route.params.id;

  const response = (await sgdeaAxios.get(`/sucursales/${id}`)).data
  form.value = {
    codigo: response.id,
    nombre: response.nombre,
    empresa: response.empresa,
    pais: response.pais,
    departamento: response.departamento,
    municipio: response.municipio,
    direccion: response.municipio,
    localidad: response.localidad,
    telefono: response.telefono,
    email: response.email,
    estado: response.activo,
    informacionAdicional: response.informacionAdicional,
    observacion: response.observacion,
    atencionPublico: response.atencionPublico,
    idDepartamento: response.idDepartamento,
    idEmpresa: response.idEmpresa,
    idMunicipio: response.idMunicipio,
    idPais: response.idPais,
  }

  textMsg.value = `¿Esta seguro de abandonar la edicion de la sucursal "${form.value.codigo} + ${form.value.nombre}"`

}



const submit = async () => {
  if( await createForm.value.validate()) {
    const response = (await sgdeaAxios.put(`/sucursales/${route.params.id}`, {


      activo: form.value.estado,
      atencionPublico: form.value.atencionPublico,
      departamento: form.value.departamento.label,
      direccion: form.value.direccion,
      email: form.value.email,
      empresa: form.value.empresa,
      id: route.params.id,
      idDepartamento: form.value.idDepartamento,
      idEmpresa: form.value.idEmpresa,
      idMunicipio: form.value.idMunicipio,
      idPais: form.value.idPais,
      informacionAdicional: form.value.informacionAdicional,
      localidad: form.value.localidad,
      municipio: form.value.municipio,
      nombre: form.value.nombre,
      observacion: form.value.observacion,
      pais: form.value.pais.label,
      telefono: form.value.telefono





      // nombre: form.value.nombre,
      // idEmpresa: form.value.empresa,
      // pais: form.value.pais,
      // direccion: form.value.direccion,
      // localidad: form.value.localidad,
      // telefono: form.value.telefono,
      // email: form.value.email,
      // activo: form.value.estado,
      // idMunicipio: form.value.municipio,
      // informacionAdicional: form.value.informacionAdicional,
      // atencionPublico: form.value.cumple,
      // observacion: form.value.observaciones

    }))

    if ([405, 401, 404, 400, 403, 500].includes(response.response?.status)) {
      const arrMsg = response.response?.data.message;

      const msg = arrMsg.map((item: any) => {
        return item.message
      })

      errMsg.value = msg.join(', ')

      errorModal.value = true

    } else if ([200, 201].includes(response.status)) {
      showModal.value = true
    }
  } else {
    showNotif()
  }
}

onMounted(() => {
  getById()
  loadFilter()


})

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false
    router.push('/administracion/sucursales')
  } else {
    errorModal.value = false
  }
}



</script>
