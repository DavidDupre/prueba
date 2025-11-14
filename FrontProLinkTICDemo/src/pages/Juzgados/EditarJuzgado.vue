<template>
   <section class="tw-flex tw-flex-row tw-bg-bg">
     <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
       <div class="tw-pt-4">
         <router-link to="/juzgados">
           <q-btn flat color="primary" label="Volver" icon="chevron_left" />
         </router-link>
       </div>

       <div class="tw-flex tw-justify-between tw-pt-4">
         <h1 class="tw-text-3xl tw-font-bold">Editar Juzgado</h1>
       </div>

       <q-form ref="formValidate" greedy >
         <q-card class="q-mt-lg tw-rounded-xl q-pa-lg" flat>
           <q-expansion-item expand-separator default-opened>
             <template v-slot:header>
               <div class="col row">
                 <p class="tw-text-2xl tw-font-bold">
                   Remitente
                 </p>
               </div>
             </template>

             <div class="tw-mt-2">
               <div class="row q-col-gutter-md q-pb-md q-px-md">
                 <!-- País, Departamento y Municipio -->
                 <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                   <span class="tw-w-full">
                     <label class="tw-text-label">País *</label>
                     <q-select v-model="form.pais" label="Seleccione" dense outlined map-options emit-value
                       class="tw-rounded-lg" :options="optionsPaises" disable :rules="[v => inputRequired(v.label)]" />
                   </span>
                 </div>
                 <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Departamento *</label>
                     <q-select v-model="form.departamento" label="Seleccione" dense outlined class="tw-rounded-lg"
                       :rules="[v => inputRequired(v.label)]" :options="optionsDepartamentos" :disable="isntColombia" />
                   </span>
                 </div>
                 <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Municipio *</label>
                     <q-select v-model="form.municipio" label="Seleccione" dense outlined class="tw-rounded-lg"
                       :rules="[v => inputRequired(v.label)]" :options="optionsMunicipios" :disable="isntColombia" />
                   </span>
                 </div>

                 <!-- Nombre del juzgado para registro de tutelas y Código de juzgado -->
                 <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Nombre del Juzgado para Registro de Tutelas *</label>
                     <q-input v-model="form.nombre" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[(v) => maxLengthInput(200, v), inputRequired]" />
                   </span>
                 </div>
                 <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Código del Juzgado *</label>
                     <q-input v-model="form.codigo" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[(v) => maxLengthInput(12, v), onlyNumbers, inputRequired]" />
                   </span>
                 </div>

                 <!-- Dirección de juzgado -->
                 <div class="col-12">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Dirección del Juzgado</label>
                     <q-input v-model="form.direccion" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[(v) => maxLengthInput(200, v)]" />
                   </span>
                 </div>

                 <!-- Teléfono, Celular y Correo electrónico del remitente -->
                 <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Teléfono</label>
                     <q-input v-model="form.telefono" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[]" />
                   </span>
                 </div>
                 <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Celular</label>
                     <q-input v-model="form.celular" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[v => mobilePhonNumber(v)]" />
                   </span>
                 </div>
                 <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Correo Electrónico del Remitente *</label>
                     <q-input v-model="form.correoRemitente" dense outlined label="Ingrese" class="tw-rounded-lg" :rules="[v => validationEmail(v), (val) => maxLengthInput(200, val), inputRequired]" />
                   </span>
                 </div>

                 <!-- Estado -->
                 <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                   <span class="tw-w-full">
                     <label class="tw-text-label">Estado *</label>
                     <div>
                       <q-toggle v-model="form.estado" color="primary" />
                     </div>
                   </span>
                 </div>
               </div>
             </div>
           </q-expansion-item>
         </q-card>

         <div class="col row justify-center q-gutter-x-md q-my-md">
           <q-btn color="accent" textColor="secondary" label="Cancelar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" no-caps @click="router.push('/juzgados')" />

           <q-btn color="primary" label="Guardar" style="width: 130px;height: 40px;border-radius: 8px;font-size: 16px;" @click="handleSubmit" />
          </div>
        </q-form>
     </main>
   </section>
 </template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { alphanumeric, inputRequired, maxLengthInput, homePhoneNumber, mobilePhonNumber, onlyNumbers, phoneFormat, validationEmail } from 'src/helpers/validations';
import { BonitaAPI, SelectInput } from 'src/interfaces';
import { adminAxios, sgdeaAxios } from 'src/services';
import { useDepartments, useMunicipalities } from "src/composables/useVersion";
import { toast } from 'src/helpers/toast';

const route = useRoute();
const router = useRouter();
const formValidate = ref();
const form = ref({
  departamento: { label: '', value: ''},
  municipio: { label: '', value: ''},
  pais: "Colombia",
  codigo: '',
  nombre: '',
  direccion: '',
  telefono: '',
  celular: '',
  correoRemitente: '',
  estado: false,
});
const optionsPaises = ref<SelectInput[]>([]);
const optionsDepartamentos = ref<SelectInput[]>([]);
const optionsMunicipios = ref<SelectInput[]>([]);
const isntColombia = ref<boolean>(false);

const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

const getData = async () => {
  try {
    const { data } = await sgdeaAxios.get(`/juzgados/${route.params.id}`);

    const { data: paisesData } = (await adminAxios.get('/paises/list'))
    const { data: dptos } = await adminAxios.get("/departamentos/list");
    const { data: formData } = await adminAxios.get("/municipios/list");

    const selectedCountry = paisesData.find((it) => it.nombre === data.pais.toUpperCase());
    if (selectedCountry.nombre === 'COLOMBIA') {
      const selectedDept  = selectedCountry.departamentos.find((it) => it.nombre === data.departamento.toUpperCase());
      const selectedMuni = selectedDept.municipios.find((it) => it.nombre === data.municipio.toUpperCase());

      form.value = {
        ...data,
        departamento:  { label: data.departamento.toUpperCase(), value: selectedDept.idDepartamento },
        municipio: { label: data.municipio.toUpperCase(), value: selectedMuni?.idMunicipio },
        correoRemitente: data.correo
      }
    } else {
      isntColombia.value = true
      form.value = {
        ...data,
        departamento: { label: data.departamento.toUpperCase(), value: data.departamento },
        municipio: { label: data.municipio.toUpperCase(), value: data.municipio },
        correoRemitente: data.correo
      }
    }

    // Departments
    optionsDepartamentos.value = sortOptions(
      dptos.map((item) => ({
        label: item.nombre,
        value: item.idDepartamento,
      }))
    );

    // Municipalities
    optionsMunicipios.value = sortOptions(
      formData.map(({ nombre }) => ({
        label: nombre,
        value: nombre,
      }))
    );

    // Countries
    optionsPaises.value = sortOptions(
      paisesData.map(({ nombre }) => ({
        label: nombre,
        value: nombre,
      }))
    );
  } catch (error) {
    console.error('Error al obtener datos:', error);
  }
};

const handleSubmit = async () => {
  if (!(await formValidate.value.validate())) {
    toast.error('Diligencie los campos obligatorios.');
    return;
  }
  const dataEditar = {
    nombre: form.value.nombre,
    direccion: form.value.direccion,
    pais: form.value.pais,
    departamento: form.value.departamento.label,
    municipio: form.value.municipio.label,
      codigo: form.value.codigo,
      telefono: form.value.telefono,
      celular: form.value.celular,
      correo: form.value.correoRemitente,
      estado: form.value.estado,
    };

  try {
    const response = await sgdeaAxios.put(`/juzgados/editar/${route.params.id}`, dataEditar)

    if (response.status === 200) {
      toast.success('Juzgado modificado exitosamente.');
      router.push('/juzgados');
    } else {
      toast.error('Ocurrió un problema con la operación.');
    }
  } catch (error) {
    toast.error( error.response.status === 409 ? `${error.response.data.message}` : 'Ocurrió un problema con la operación.')
  }
};
onMounted(getData);

watch(
  () => form.value.pais,
  async (value) => {
    let val = value as unknown as string
    form.value.departamento = { label: '', value: ''}
    form.value.municipio = { label: '', value: ''}
    if (val.toLowerCase() == 'colombia') {
      isntColombia.value = false
      // @ts-ignore
      const { optionsDepartments } = await useDepartments(value.value);
      optionsDepartamentos.value = sortOptions(optionsDepartments.value);

    } else {
      form.value.departamento = { label: val, value: value }
      form.value.municipio = { label: val, value: value }
      isntColombia.value = true
    }
  }
);

watch(
  () => form.value.departamento,
  async (value, old) => {
    // @ts-ignore
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    optionsMunicipios.value = sortOptions(optionsMunicipalities.value)
    if(value.label !== old.label && old.label !== ''){
      form.value.municipio = { label: '', value: '' }
    }
  }
);
</script>
