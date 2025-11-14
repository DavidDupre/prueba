<template>
  <section class="tw-flex tw-flex-row tw-bg-bg">
    <main class="tw-w-full tw-p-7 tw-pt-0">
      <router-link to="/home" class="text-primary q-mb-md block">
        <q-icon size="1.5em" name="chevron_left" color="primary" />
        <b> Volver</b>
      </router-link>
      <div class="tw-flex tw-justify-between tw-pt-4">
        <h1 class="tw-text-3xl tw-font-bold">Parametrización de Firmas</h1>
      </div>

      <div
        v-if="isGenerica"
        class="row tw-mt-20 tw-bg-white tw-p-10 tw-h-[300px]"
      >
        <span class="col">
          <p>Firmas Genérica</p>
          <span>{{ iniciales }}</span>
        </span>
        <span class="col tw-ml-10 tw-relative">
          <div class="row tw-items-center">
            <p>Seleccionar como firma preterminada</p>
            <q-radio
              :disable="!iniciales"
              name="preterminado"
              v-model="firmas.preterminada"
              @update:model-value="updatePreterminada(1)"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="1"
            />
            <div
              class="row flex tw-items-center"
              v-if="firmas.preterminada == true"
            >
              <q-icon
                v-if="iniciales"
                size="1.5em"
                name="delete"
                class="tw-cursor-pointer tw-ml-5"
                @click="confirmDeleteFirma(1)"
              >
                <q-tooltip> Eliminar Firma </q-tooltip>
              </q-icon>
            </div>
          </div>
        </span>
      </div>

      <div v-if="isGrafo" class="row tw-mt-14 tw-bg-white tw-p-10 tw-h-[300px]">
        <span class="col">
          <p>Firmas Grafo</p>
          <FileLoader
            v-model="firmas.grafo"
            class="tw-w-full"
            @update:model-value="updateFiles"
            accept-file="png, jpg, jpeg, webp"
            :multiple="true"
            :max-file-size="50 * 1024 * 1024"
            :max-files="1"
            max-file-size-label="1"
            @rejected="(e) => rejectedFiles(e, 'grafo')"
          />
        </span>
        <span class="col tw-ml-10 tw-w-full tw-h-40">
          <div class="row tw-items-center">
            <p>Seleccionar como firma preterminada</p>
            <q-radio
              :disable="!urls.img"
              name="preterminado"
              v-model="firmas.preterminada"
              @update:model-value="updatePreterminada(2)"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              :val="2"
            />
          </div>
          <div class="row flex tw-items-center">
            <div v-if="urls.img">
              <img :src="urls.img" style="height: 200px; max-width: 400px" />
            </div>
            <q-icon
              v-if="urls.img"
              size="1.5em"
              name="delete"
              class="tw-cursor-pointer tw-ml-5"
              @click="confirmDeleteFirma(2), (imgToDelete = urls.img)"
            >
              <q-tooltip> Eliminar Firma </q-tooltip>
            </q-icon>
          </div>
        </span>
      </div>

      <div class="row q-pt-lg q-pb-xl justify-center tw-gap-x-5">
        <q-btn
          class="tw-w-1/4 tw-font-bold tw-h-11 tw-bg-white tw-text-[#2C3948]"
          no-caps
          style="border: 1px solid #2c3948"
          @click="cancelModal = true"
          >Cancelar</q-btn
        >
        <q-btn
          class="tw-w-1/4 tw-h-11 bg-primary text-white"
          @click="uploadSignatures"
          >Guardar</q-btn
        >
      </div>
    </main>

    <Modal
      v-model="confirmModal"
      title="Confirmación"
      persistent
      text="Está seguro de guardar las firmas parametrizadas"
      :is-success="true"
      :cancelButton="true"
      @closeModal="confirmModal = false"
      textButtonCancel="No"
      text-button="Si"
      @handleAccept="sendFirmas"
    />
    <Modal
      v-model="cancelModal"
      title="Confirmación"
      :is-success="false"
      @handleAccept="router.push('/home')"
      cancel-button
      textButtonCancel="No"
      textButton="Si"
      text="Al cancelar la acción perderá los datos ingresados en el formulario, ¿Desea realizar la acción?"
      @close-modal="cancelModal = false"
      type="button"
    />
    <Modal
      v-model="deleteModal"
      title="Confirmación"
      persistent
      :text="deleteModalText"
      :is-success="true"
      :cancelButton="true"
      @closeModal="deleteModal = false"
      textButtonCancel="No"
      text-button="Si"
      @handleAccept="deleteFirma"
    />
  </section>
</template>
<script setup lang="ts">
import FileLoader from "src/components/FormFields/FileLoader.vue";
import { toast } from "src/helpers/toast";
import { onMounted, ref, computed } from "vue";

import Modal from "components/Modal/Modal.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { sgdeaAxios } from "src/services";

interface FirmasType {
  generica: Array<any>;
  grafo: Array<any>;
  preterminada: any;
}

const router = useRouter();
const auth = useAuthStore();
const confirmModal = ref<boolean>(false);
const deleteModal = ref<boolean>(false);
const cancelModal = ref<boolean>(false);
const imgToDelete = ref();
const isGenerica = ref<boolean>(true);
const isGrafo = ref<boolean>(true);
const firmaToDelete = ref(null);

const userid = ref(auth.$state.userInfo.userid);
const userName = ref(auth.$state.userInfo.name);

const firmas = ref<FirmasType>({
  generica: null,
  grafo: null,
  preterminada: null,
});

const urls = ref({
  img: null,
  pdf: null,
});

function obtenerIniciales(nombreCompleto) {
  const nombresArray = nombreCompleto.split(" ");
  const iniciales = nombresArray
    .map((nombre) => nombre.charAt(0).toUpperCase())
    .join(".");
  return iniciales;
}

const deleteModalText = computed(() => {
  if (firmaToDelete.value === firmas.value.preterminada) {
    return "Está seguro de eliminar la firma predeterminada?";
  }
  return "Está seguro de eliminar la firma?";
});

const confirmDeleteFirma = (tipoFirmaId) => {
  firmaToDelete.value = tipoFirmaId;
  deleteModal.value = true;
};

// Computar las iniciales basado en el nombre del usuario
const iniciales = computed(() => obtenerIniciales(userName.value));

const rejectedFiles = (error, typeFirma) => {
  if (error.some((it) => it.failedPropValidation === "max-file-size")) {
    toast.error("El peso permitido es hasta 50MB.");
  }
  if (error.some((it) => it.failedPropValidation === "max-files")) {
    toast.error("Solo se pueden adjuntar 1 archivos.");
  }
  if (error.some((it) => it.failedPropValidation === "accept")) {
    toast.error(
      `Únicamente se pueden subir archivos ${
        typeFirma === "generica" ? "PDF" : "PNG, JPG, JPEG, WEBP"
      }.`
    );
  }
};

const updatePreterminada = async (tipoFirmaId: number) => {
  try {
    if (tipoFirmaId === 2 && !firmas.value.grafo) {
      toast.error("No se puede seleccionar esta opción sin una firma cargada");
      return;
    }

    const response = await sgdeaAxios.post(
      `/usuarios/usuario/${userid.value}/firma-predeterminada/${tipoFirmaId}`
    );

    if (response.status === 200) {
      toast.success("Firma predeterminada actualizada exitosamente");
      firmas.value.preterminada = tipoFirmaId;

      // Actualizar el estado de predeterminada en las firmas
      if (firmas.value.generica)
        firmas.value.generica.predeterminada = tipoFirmaId === 1;
      if (firmas.value.grafo)
        firmas.value.grafo.predeterminada = tipoFirmaId === 2;
    } else {
      toast.error("Error al actualizar la firma predeterminada");
    }
  } catch (error) {
    toast.error("Guarda la firma para implementar como predeterminada");
  }
};

const deleteFirma = async () => {
  try {
    const tipoFirmaId = firmaToDelete.value;
    const isPredeterminada = tipoFirmaId === firmas.value.preterminada;

    // Verificar si la firma existe en el servidor (grafo o generica)
    const firmaExiste =
      tipoFirmaId === 1 ? !!firmas.value.generica : !!firmas.value.grafo;

    let response;

    if (firmaExiste) {
      // Si la firma es predeterminada, elimínala
      if (isPredeterminada) {
        response = await sgdeaAxios.delete(
          `/usuarios/eliminarPredeterminada/${userid.value}`
        );
        if (response.status === 200) {
          firmas.value.preterminada = null;
          toast.success("Firma predeterminada eliminada con éxito");
        } else {
          throw new Error("Error al eliminar la firma predeterminada");
        }
      } else {
        // Eliminar firma normal del servidor
        response = await sgdeaAxios.delete("/usuarios/eliminar-firma", {
          params: {
            usuarioId: userid.value,
            tipoFirmaId: tipoFirmaId,
          },
        });
        if (response.status === 200) {
          toast.success("Firma eliminada con éxito");
        } else {
          throw new Error("Error al eliminar la firma");
        }
      }
    }
    // Refresca la lista de firmas si la firma existía en el servidor
    if (firmaExiste) {
      await getFirmas();
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Si la firma no existe en el servidor, eliminar localmente
      if (firmaToDelete.value === 2) {
        firmas.value.grafo = null;
      } else if (firmaToDelete.value === 1) {
        firmas.value.generica = [];
      }
      urls.value.img = null;
      toast.success("Firma eliminada con éxito");
    } else {
      toast.error("Error al eliminar la firma: " + error.message);
    }
  } finally {
    // Restablece el estado después de la operación
    deleteModal.value = false;
    firmaToDelete.value = null;
  }
};

const uploadSignatures = async () => {
  const promises = []; // Almacenaremos las promesas de cada petición
  const userId = userid.value.toString();

  // Firma Genérica (tipo 1)
  if (iniciales.value) {
    const formDataGenerica = new FormData();
    formDataGenerica.append("fgenerica", iniciales.value); // Firma genérica
    formDataGenerica.append("tipoFirmaId", "1");
    formDataGenerica.append("userId", userId);

    const promiseGenerica = sgdeaAxios.post(
      "/usuarios/firma",
      formDataGenerica,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    promises.push(promiseGenerica); // Añadimos la promesa de esta petición al array
  }

  // Firma Grafo (tipo 2)
  if (firmas.value.grafo && firmas.value.grafo.length > 0) {
    const formDataGrafo = new FormData();
    formDataGrafo.append("file", firmas.value.grafo[0]); // Archivo de la firma grafo
    formDataGrafo.append("tipoFirmaId", "2");
    formDataGrafo.append("userId", userId);

    const promiseGrafo = sgdeaAxios.post("/usuarios/firma", formDataGrafo, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    promises.push(promiseGrafo); // Añadimos la promesa de esta petición al array
  }

  // Si no se ha proporcionado ninguna firma
  if (promises.length === 0) {
    toast.error("No se ha proporcionado ninguna firma para guardar");
    return;
  }

  try {
    // Ejecutamos todas las peticiones en paralelo
    const responses = await Promise.all(promises);

    // Revisamos las respuestas
    const successfulResponses = responses.filter(
      (response) => response.status === 200
    );

    if (successfulResponses.length === responses.length) {
      toast.success("Firmas guardadas exitosamente");
      firmas.value.grafo = null;
      await getFirmas(); // Actualizar las firmas después de guardar
    } else {
      toast.error("Algunas firmas no se pudieron guardar");
    }
  } catch (error) {
    toast.error(
      "Error al guardar las firmas: " +
        (error.response?.data?.message || "Error desconocido")
    );
  }
};

const updateFiles = (file) => {
  const img = new Image();
  const objectUrl = URL.createObjectURL(file[0]);

  img.onload = () => {
    if (img.width > 400 || img.height > 200) {
      toast.error("La imagen excede la resolución máxima de 400x200px.");
      if (firmas.value.generica.find((it) => it.name == file[0].name)) {
        firmas.value.generica = [];
      } else {
        firmas.value.grafo = [];
      }
    }
  };
  img.src = objectUrl;
  urls.value.img = objectUrl;
  toast.success("Cargue exitoso");
};

const getFirmas = async () => {
  try {
    const response = await sgdeaAxios.get(
      `/usuarios/obtener-firma/${userid.value}`
    );
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach((firma) => {
        if (firma.tipoFirmaUsuario.id === 1) {
          // Firma Genérica
          firmas.value.generica = firma;
        } else if (firma.tipoFirmaUsuario.id === 2) {
          // Firma Grafo
          firmas.value.grafo = firma;
          urls.value.img = `data:${firma.fileType};base64,${firma.fileData}`;
        }
        if (firma.predeterminada) {
          firmas.value.preterminada = firma.tipoFirmaUsuario.id;
        }
      });
    }
  } catch (error) {
    toast.error("Error al obtener las firmas");
  }
};

const sendFirmas = async () => {
  // TODO: si solo hay una firma de las 2, enviarla como preterminada
  toast.success("Datos guardados exitosamente");
  // router.push("/home")
};

onMounted(async () => {
  await getFirmas();
});
</script>
<style></style>
