<template>
  <section class="tw-flex tw-flex-row">
    <main class="tw-min-h-screen tw-w-full tw-p-7 tw-pt-0">
      <BreadCrumbs :crumbs="routes" />
      <div class="tw-flex tw-justify-between tw-items-center tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold tw-my-4">Editar entidad</h1>
      </div>
      <q-card class="tw-mt-[20px] tw-rounded-xl q-pa-lg" flat>
        <q-form ref="createForm" @submit.prevent="createSerie">
          <div
            class="tw-grid tw-grid-cols-3 tw-gap-5 tw-mb-12 tw-border-b tw-border-b-gray-[#969EAF] [&>*]:tw-flex [&>*]:tw-flex-col [&>*]:tw-gap-2">
            <span class="">
              <label for="nombre" class="tw-text-label">Código entidad *</label>
              <q-input v-model="(route.params.id as string)" readonly label="" outlined class="mb-3" type="text" dense />
            </span>
            <span class="">
              <label for="nombre" class="tw-text-label">Nombre entidad *</label>
              <q-input v-model="form.nombre" label="Inserte" outlined class="mb-3"
                :rules="[rulesValidation, (val) => lengthValidation(50, val)]" type="text" dense />
            </span>
            <span class="">
              <label for="code" class="tw-text-label">Tipo entidad * </label>

              <q-select v-model="form.tipo" required label="seleccione" :options="idTipoEntidades" dense outlined
                class="tw-rounded-lg" maxlength="50">
              </q-select>
            </span>
            <span class="tw-col-span-3">
              <label for="description" class="tw-text-label">Detalle</label>
              <q-input v-model="form.descripcion" label="Inserte" outlined class="mb-3"
                :rules="[(val) => lengthValidation(500, val)]" type="textarea" autogrow rows="3" min-rows="3"
                maxlength="250" id="description" dense />
            </span>
            <span class="">
              <label class="tw-text-label" for="state">Estado</label>
              <div class="tw-flex items-center tw-justify-between">
                <p>{{ form.estado === true ? 'Activo' : 'Inactivo' }}</p>

                <q-toggle v-model="form.estado" :rules="[rulesValidation]" color="secondary"></q-toggle>
              </div>

            </span>
          </div>

          <div class="row tw-flex tw-justify-center tw-gap-2 [&>*]:tw-p-2">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg col-2"
              @click="() => (backModal = true)" />
            <q-btn label="Editar" type="submit" color="secondary" class="tw-rounded-lg col-2"></q-btn>
          </div>
        </q-form>
      </q-card>
      <Modal v-model:model-value="showModal" title="Creación exitosa"
        :text="`La entidad '${route.params.id} ${form.nombre}' fue modificada correctamente.`" is-success
        text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model:model-value="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false"
        text-button="Aceptar" @handleAccept="handleModal" />

      <Modal v-model="backModal" title="¡Espera un momento!"
        :text="`¿Está seguro de abandonar la edición de la entidad ${route.params.id} ${nombreEntidad}?`"
        :is-success="false" textButtonCancel="No" cancel-button
        @handleAccept="() => router.push('/administracion/entidades')" text-button="Si"
        @close-modal="() => (backModal = false)" />
    </main>
  </section>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted } from "vue";

import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import { routes } from "./index";
import { IDataEntidades } from "..";
import { useRoute, useRouter } from "vue-router";
import Modal from "components/Modal/Modal.vue";
import { adminAxios } from "src/services";

const route = useRoute();
const router = useRouter();
const showModal = ref(false);
const errorModal = ref(false);
const backModal = ref(false);
let nombreEntidad = ref("");
const idTipoEntidades: Ref<{ label: string; value: any }[]> = ref([]);

const form: Ref<any> = ref({
  descripcion: "",
  nombre: "",
  tipo: "",
  estado: false,
});
const createForm = ref();

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return "Este campo es requerido";
  }
  return true;
};
const lengthValidation = (n: number, val: string) =>
  val.length < n || "Maximo " + n + " Caracteres";

onMounted(async () => {
  const response: IDataEntidades[] =
    await adminAxios.get("/entidades/");
  let idTipoEntidadesArray = response?.map(
    (item: IDataEntidades) => item.idTipoEntidad
  );
  let uniqueIdTipoEntidadesArray = idTipoEntidadesArray.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  idTipoEntidades.value = uniqueIdTipoEntidadesArray.map((idTipoEntidad) => ({
    label: idTipoEntidad.toString(),
    value: idTipoEntidad,
  }));

  const { data }: { data: IDataEntidades } =
    await adminAxios.get(`/entidades/${route.params.id}`);

  if (data) {
    form.value.nombre = data.entidad;
    form.value.tipo = idTipoEntidades.value.find(item => item.value === data.idTipoEntidad);
    form.value.descripcion = data.descripcion;
    form.value.estado = data.estado;
    nombreEntidad.value = data.entidad;
  }
});

const createSerie = async () => {
  if (await createForm.value.validate()) {
    const response = await adminAxios.put(`/entidades/${route.params.id}`, {
      descripcion: form.value.descripcion,
      estado: form.value.estado,
      entidad: form.value.nombre,
      idTipoEntidad: form.value.tipo.value,
      idEntidad: route.params.id,
    });

    if ([405, 401, 404, 400, 403, 500].includes(response?.status)) {
      errorModal.value = true;
    } else if ([200, 201].includes(response.status)) {
      showModal.value = true;
    }
  }
};

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push("/administracion/entidades");
  } else {
    errorModal.value = false;
  }
};
</script>
