<template>
  <div>
    <RouterLink to="/administracion/prefijos" class="text-primary q-mb-md" style="text-decoration: none">
      <q-icon size="1.5em" name="chevron_left" color="primary" />
      <b> Volver</b>
    </RouterLink>
    <div>
      <div class='tw-mb-6 tw-mt-4'>
        <p class="pl-4 tw-font-bold tw-text-3xl tw-mb-3 text-bold">Edición de Prefijos</p>
      </div>
      <q-form ref="form" @submit.prevent="" class="[&>*]:tw-mb-4" greedy>
        <q-card class="tw-px-4 tw-py-2 tw-rounded-xl" flat>
          <q-expansion-item label="Información General" default-opened header-class="tw-text-lg tw-font-bold">
            <div class="tw-grid tw-grid-cols-6 tw-gap-x-4">
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Prefijo *</p>
                <q-input outlined v-model='formData.prefijo' label="Inserte" dense filled disable
                  :rules="[(v: string) => lengthValidation(6, v), rulesValidation]" />
              </div>
              <div class="tw-col-span-3">
                <p class="tw-text-label tw-font-semibold">Estado *</p>
                <q-toggle v-model="formData.estado" />
              </div>
              <div class="tw-col-span-6">
                <p class="tw-text-label tw-font-semibold">Descripción *</p>
                <q-input type="textarea" :rules="[rulesValidation, (v: string) => lengthValidation(200, v)]" outlined
                  dense v-model:model-value="formData.descripcion" />
              </div>
            </div>
          </q-expansion-item>
        </q-card>
      </q-form>
    </div>

    <div class="col col-12 row justify-center  tw-w-full tw-m-[10px] tw-mt-10 tw-flex tw-gap-4">
      <q-btn label="Cancelar" textColor="black" class=" tw-rounded-xl tw-p-3 tw-w-[200px]" outline
        @click="cancelModal = true" />
      <q-btn type="submit" label="Guardar Cambios" @click="submit" color="primary" textColor="white"
        class="tw-rounded-xl tw-w-[200px] tw-h-10" :loading="handleSubmitIsLoading" />
    </div>

    <Modal v-model="cancelModal" title="Confirmación" :is-success="false" @handleAccept="onReset" cancel-button
      textButtonCancel="No" textButton="Si":text="`¿Está seguro de cancelar la edición del prefijo ${formData.prefijo}?`"
      @close-modal="cancelModal = false" type="button" />
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute, RouterLink } from "vue-router";
import { onMounted, ref } from 'vue';
import { sgdeaAxios } from 'src/services';
import { toast } from "src/helpers/toast";
import Modal from "components/Modal/Modal.vue";

const handleSubmitIsLoading = ref<boolean>(false)
const formData = ref({
  prefijo: '',
  estado: true,
  descripcion: '',
});

const route = useRoute();
const router = useRouter()
const form = ref()
const cancelModal = ref(false)
const dataPrefijos = ref()
const idPrefijo= ref(route.params.id)

onMounted(async () => {
  await getPrefijoById()
  await getPrefijos()
})

const getPrefijoById = async () => {
  const response = await sgdeaAxios.get(`/medicina/prefijo/${idPrefijo.value}`);

  formData.value.prefijo = response.data.nombre
  formData.value.estado = response.data.activo
  formData.value.descripcion = response.data.descripcion
}

const getPrefijos = async () => {
  const response = await sgdeaAxios.get('/medicina/prefijos');
  dataPrefijos.value = response.data
}

function onReset() {
  router.push('/administracion/prefijos')
};

const submit = async () => {
  const isValidate = await form.value.validate()

  if (isValidate) {
    handleSubmitIsLoading.value = true;
    const prefijoSubmit = {
      estado: formData.value.estado,
      descripcion: formData.value.descripcion
    }

    try {
      const response = await sgdeaAxios.put(`/medicina/actualizar-prefijo/${idPrefijo.value}`, prefijoSubmit)
      if (response.status == 200) {
        toast.success(`Se Modificó correctamente el prefijo ${formData.value.prefijo}`)
        router.push('/administracion/prefijos')
      }
    } catch (error) {
      toast.error("Ha ocurrido un error")
      handleSubmitIsLoading.value = false;
    }

  } else {
    toast.error("Para continuar, asegúrese de que todos los campos requeridos estén completos")
  }
}

const rulesValidation = (val: any) => {
  if (val?.length === 0) {
    return 'Este campo es requerido'
  }
  return true
}

const lengthValidation = (n, val: string) => val.length <= n || "Máximo " + n + " caracteres"
</script>

<style lang="scss" scoped>
.input-code:focus {
  outline: none;
}
</style>
