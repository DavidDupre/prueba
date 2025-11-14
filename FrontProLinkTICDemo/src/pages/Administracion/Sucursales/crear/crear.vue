<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Crear Sucursal</h1>
      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <h3 class="tw-text-2xl tw-font-bold tw-pl-2 tw-pb-6">Sucursales</h3>
        <q-form ref="createForm" @submit="submit">
          <div
            class="tw-grid tw-grid-cols-6 tw-gap-4 tw-border-b tw-border-b-gray-[#969EAF] tw-h-auto [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2"
          >
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Codigo Sucursal * </label>
              <q-input
                v-model="form.codigo"
                label="Inserte"
                outlined
                class="mb-3"
                :rules="[rulesValidation]"
                dense
                mask="#####"
                filled
                disable
              />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Nombre Sucursal * </label>
              <q-input
                v-model="form.nombre"
                label="Inserte"
                outlined
                class="mb-3"
                :rules="[(v) => lengthValidation(50, v), rulesValidation]"
                dense
              />
            </span>
            <span class="tw-col-span-6">
              <label for="code" class="tw-text-label">Empresa * </label>
              <q-select
                v-model="form.empresa"
                label="Seleccione"
                outlined
                class="mb-3"
                :rules="[rulesValidation]"
                id="description"
                dense
                :options="empresasOptions"
              />
            </span>
            <span class="tw-col-span-2">
              <label for="code" class="tw-text-label">Pais * </label>
              <q-select
                v-model="form.pais"
                label="Seleccione"
                outlined
                class="mb-3"
                :rules="[rulesValidation]"
                id="description"
                dense
                :options="paiseOptions"
              />
            </span>
            <span class="tw-col-span-2">
              <label for="code" class="tw-text-label">Departamento * </label>
              <q-select
                v-model="form.departamento"
                label="Seleccione"
                outlined
                class="mb-3"
                :rules="[rulesValidation]"
                dense
                :options="departamentoOptions"
              />
            </span>
            <span class="tw-col-span-2">
              <label for="code" class="tw-text-label">Municipio * </label>
              <q-select
                v-model="form.municipio"
                label="Seleccione"
                outlined
                class="mb-3"
                :rules="[rulesValidation]"
                dense
                :options="municipioOptions"
              />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Direccion * </label>
              <q-input
                v-model="form.direccion"
                label="Inserte"
                outlined
                class="mb-3"
                :rules="[rulesValidation, (v) => lengthValidation(150, v)]"
                dense
                maxlength="150"
              />
            </span>
            <span class="tw-col-span-3">
              <label for="code" class="tw-text-label">Localidad</label>
              <q-input
                v-model="form.localidad"
                label="Inserte"
                outlined
                class="mb-3"
                dense
                :rules="[(v) => lengthValidation(50, v)]"
              />
            </span>
            <span class="tw-col-span-3">
              <label for="description" class="tw-text-label">Telefono</label>
              <q-input
                v-model="form.telefono"
                label="Inserte"
                outlined
                class="mb-3"
                id="description"
                dense
                :rules="[
                  (v) => lengthValidation(10, v),
                  (val) =>
                    /^[0-9]+$/.test(val)
                      ? true
                      : 'Ingrese un numero telefonico valido',
                ]"
                type="number"
              />
            </span>
            <span class="tw-col-span-3">
              <label for="initialDate" class="tw-text-label"
                >Correo Electronico</label
              >
              <q-input
                v-model="form.correo"
                label="Inserte"
                outlined
                class="mb-3"
                id="description"
                dense
                :rules="[(v) => lengthValidation(200, v), validationEmail]"
              />
            </span>
            <div class="tw-col-span-6 tw-h-[200px]">
              <p class="tw-text-label tw-font-bold">Información Adicional</p>
              <q-input
                outlined
                v-model="form.informacionAdicional"
                :label="form.informacionAdicional === '' ? 'Inserte' : ''"
                class="tw-h-5"
                type="textarea"
                dense
                :rules="[(v) => lengthValidation(150, v)]"
              />
            </div>

            <div class="tw-col-span-2">
              <q-checkbox v-model="form.atencion"
                >Atención al publico</q-checkbox
              >
            </div>
          </div>

          <div
            class="row tw-flex tw-justify-center tw-mt-8 tw-cols-6 tw-gap-2 [&>*]:tw-p-2"
          >
            <q-btn
              label="Cancelar"
              color="accent"
              textColor="black"
              class="tw-rounded-lg col-2"
              @click="cancelModal = true"
            />
            <q-btn
              label="Crear"
              type="submit"
              color="secondary"
              class="tw-rounded-lg col-2"
            ></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal
        v-model="showModal"
        title="Creación exitosa"
        :text="`La sucursal ${form.codigo} ${form.nombre} fue creada correctamente. `"
        is-success
        text-button="¡Ok!"
        @handleAccept="handleModal"
      />
      <Modal
        v-model="cancelModal"
        title="¡Espera un momento!"
        :text="`¿Desea cancelar la acción?`"
        text-button="Sí"
        @handleAccept="() => router.push('/administracion/sucursales')"
        @closeModal="cancelModal = false"
        label="Confirmar"
        cancelButton
        text-button-cancel="No"
      />
      <Modal
        v-model="errorModal"
        title="Error"
        :text="errMessage"
        :is-success="false"
        text-button="Aceptar"
        @handleAccept="handleModal"
      />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, watch } from "vue";
import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import { useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { useDepartments, useMunicipalities } from "src/composables/useVersion";

const errMessage = ref(``);

const paiseOptions: Ref<any[]> = ref([]);
const departamentoOptions: Ref<any[]> = ref([]);
const municipioOptions: Ref<any[]> = ref([]);
const empresasOptions: Ref<any[]> = ref([]);

const data = ref();
const cancelModal = ref(false);

const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Administracion",
    to: "/administracion",
  },
  {
    name: "Sucursales",
    to: "/administracion/sucursales",
  },
  {
    name: "Crear Sucursal",
    to: "/administracion/sucursal/crear",
  },
];

import { sgdeaAxios } from "src/services";

const router = useRouter();
const showModal = ref(false);
const errorModal = ref(false);

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
  correo: "",
  estado: false,
  informacionAdicional: "",
  cumple: "",
  atencion: false,
});

const createForm = ref();

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return "Este campo es requerido";
  }
  return true;
};

const lengthValidation = (n: number, val: string) =>
  val.length <= n || "Máximo " + n + " carácteres";

function validationEmail(email: string) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!patron.test(email)) {
    return "Ingrese un correo electrónico válido";
  }
}

watch(
  () => form.value.pais,
  async (value) => {
    const { optionsDepartments } = await useDepartments(value.value);
    departamentoOptions.value = optionsDepartments.value;
  }
);

watch(
  () => form.value.departamento,
  async (value) => {
    const { optionsMunicipalities } = await useMunicipalities(value.value);
    municipioOptions.value = optionsMunicipalities.value;
  }
);

async function loadFilter() {
  await loadPaises();
  await loadDepartamentos();
  await loadMunicipios();
}

onMounted(async () => {
  loadFilter();

  const { data } = await sgdeaAxios.get("/sucursales");

  // Encuentra el ID más alto
  const maxId = data.reduce(
    (max: any, obj: any) => Math.max(max, parseInt(obj.id, 10)),
    0
  );

  // Incrementa el ID en uno
  const nuevoId = maxId + 1;

  // Añade ceros al inicio para que tenga 5 dígitos
  form.value.codigo = nuevoId.toString().padStart(5, "0");
});

async function loadEmpresas() {
  const { data } = await sgdeaAxios.get("/empresas/?activo=true");
  empresasOptions.value = [
    ...empresasOptions.value,
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        id: val.idEmpresa,
      };
    }),
  ];
}

async function loadPaises() {
  const { data } = await sgdeaAxios.get("/paises/list");
  paiseOptions.value = [
    ...paiseOptions.value,
    ...data.map((val: any) => {
      return {
        label: val.nombre,
        value: val.idPais,
      };
    }),
  ];
}

async function loadDepartamentos() {
  const { data } = await sgdeaAxios.get("/departamentos/list");
  departamentoOptions.value = data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

async function loadMunicipios() {
  const { data } = await sgdeaAxios.get("/municipios/list");
  municipioOptions.value = data.map((val: any) => {
    return {
      label: val.nombre,
      value: val.idDepartamento,
    };
  });
}

onMounted(async () => {
  const { data } = await sgdeaAxios.get("/empresas/?activo=true");

  empresasOptions.value = data.map((item: any) => {
    return {
      label: item.nombre,
      value: item.idEmpresa,
    };
  });
});

// let sgdeaAxiosState = await createForm.value?.validate()

const submit = async () => {
  const response = await sgdeaAxios.post("/sucursales", {
    nombre: form.value.nombre,
    idEmpresa: form.value.empresa.value,
    pais: form.value.pais.value,
    direccion: form.value.direccion,
    localidad: form.value.localidad.value,
    departamento: form.value.departamento.value,
    telefono: form.value.telefono,
    email: form.value.correo,
    activo: form.value.estado,
    idMunicipio: form.value.municipio.value,
    informacionAdicional: form.value.informacionAdicional,
    atencionPublico: form.value.atencion,
  });

  if ([405, 401, 404, 400, 403, 500].includes(response.response?.status)) {
    //errMessage.value = `¡Ha ocurrido un error! ${response.response?.data.message}`
    errMessage.value = `¡Los datos son incorrectos, inténtelo de nuevo!`;
    errorModal.value = true;
  } else if ([200, 201].includes(response.status)) {
    showModal.value = true;
  }
};

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push("/administracion/sucursales");
  } else {
    errorModal.value = false;
  }
};
</script>

<style>



input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;

}


input[type=number] { -moz-appearance:textfield; }

</style>
