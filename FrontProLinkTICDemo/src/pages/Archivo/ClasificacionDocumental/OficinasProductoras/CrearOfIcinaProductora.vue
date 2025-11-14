<template>
  <a
    @click.prevent="router.back"
    class="tw-text-primary q-mb-md block cursor-pointer"
    style="text-decoration: none"
  >
    <q-icon size="1.5em" name="chevron_left"></q-icon>
    <b> Regresar</b>
  </a>

  <q-card flat class="tw-p-8 tw-rounded-lg">
    <div class="tw-mb-6">
      <Title label="Oficinas Productoras" />
    </div>

    <q-form
      greedy
      @submit.prevent="submitForm"
      @validation-error="validateForm()"
      class="tw-grid tw-grid-cols-2 tw-gap-6"
    >
      <div>
        <Label label="Código" :is-requiered="true" />
        <q-input
          v-model="formData.code"
          dense
          label="Inserte"
          outlined
          class="tw-rounded-lg"
          :rules="[inputRequired]"
          maxlength="12"
          :debounce="500"
        />
      </div>

      <div>
        <Label label="Nombre" :is-requiered="true" />
        <q-input
          v-model="formData.name"
          dense
          label="Inserte"
          outlined
          class="tw-rounded-lg"
          :rules="[inputRequired]"
          maxlength="255"
          :debounce="500"
        />
      </div>

      <div v-if="id">
        <Label label="Estado" :is-requiered="true" />
        <q-select
          v-model="formData.status"
          outlined
          dense
          :options="[
            { label: 'ACTIVO', value: true },
            { label: 'INACTIVO', value: false },
          ]"
          class="tw-rounded-lg"
          emit-value
          map-options
          :rules="[inputRequired]"
        />
      </div>

      <div class="tw-col-span-2">
        <CommentTextArea
          v-model="formData.observations"
          :is-required="true"
          :max-length="500"
          label="Descripción"
        />
      </div>

      <div class="tw-col-span-2 tw-flex tw-justify-end tw-gap-6">
        <!-- <Button
          v-if="datos.code"
          label="Eliminar"
          type="tertiary"
          color="black"
          icon-left="circle-xmark"
          @click="deleteOffice"
          :type-button="'button'"
        /> -->
        <Button
          :label="id ? 'Editar' : 'Crear'"
          type="primary"
          color="primary"
          icon-right="circle-arrow-right"
          type-button="submit"
        />
      </div>
    </q-form>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { inputRequired } from "src/helpers/validations";
import { toast } from "src/helpers/toast";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import CommentTextArea from "src/shared/components/TextArea/Comments.vue";
import { sgdeaArchivoAxios } from "src/services";
const router = useRouter();
const route = useRoute();
const id = route.params["id"];
const from = route.query["from"];

// Datos del formulario
const formData = ref({
  code: "",
  name: "",
  status: true,
  observations: "",
});
const datos = ref({
  id: null,
  code: "",
  name: "",
  status: true,
  observations: "",
});

onMounted(async () => {
  if (id) {
    const { data } = await sgdeaArchivoAxios.get(`/Office/${id}`);
    formData.value = data;
    datos.value = { ...data };
  }
});

const validateForm = () => {
  return toast.error(
    "Por favor completa todos los campos obligatorios antes de continuar."
  );
};

const submitForm = async () => {
  try {
    const { status } = id
      ? await sgdeaArchivoAxios.put(`/Office/update/${id}`, formData.value)
      : await sgdeaArchivoAxios.post("/Office/store", formData.value);

    if (status === 200) {
      toast.success("Formulario enviado correctamente");
      router.push({
        path: `/archivo/clasificacion-documental/gestionar-versiones/detalle/${from}`,
        query: { initial: "OficinasProductoras" },
      });

      setTimeout(() => {
        router.replace({
          path: `/archivo/clasificacion-documental/gestionar-versiones/detalle/${from}`,
          query: { initial: "detalle" },
        });
      }, 500);
    }
  } catch (error) {
    toast.error(error.response.data);
  }
};

// const deleteOffice = async () => {
//   try {
//     const { status } = await sgdeaArchivoAxios.delete(
//       `/Office/${datos.value.id}`
//     );

//     if (status === 200 || status === 201 || status === 204) {
//       toast.success("Registro eliminado correctamente");
//       router.push({
//         path: `/archivo/clasificacion-documental/gestionar-versiones/detalle/${from}`,
//         query: { initial: "OficinasProductoras" },
//       });

//       setTimeout(() => {
//         router.replace({
//           path: `/archivo/clasificacion-documental/gestionar-versiones/detalle/${from}`,
//           query: { initial: "detalle" },
//         });
//       }, 500);
//     }
//   } catch (error) {
//     toast.error(error.response.data.error);
//   }
// };
</script>

<style scoped>
.tw-rounded-lg {
  border-radius: 0.5rem;
}

.tw-text-label {
  color: var(--q-primary);
}
</style>
