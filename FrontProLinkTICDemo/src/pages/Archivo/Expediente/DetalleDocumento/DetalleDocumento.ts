import { sgdeaArchivoAxios } from "src/services";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useDetalleDocumento = () => {
  const router = useRouter();
  const route = useRoute();

  const idFile = route.params["documento"];
  // const idRecord = route.params["expediente"];

  const fileUrl = ref();
  const base64Url = ref();

  // onMounted(async () => {
  //   const credentials = btoa("admin:admin");
  //   const response = await fetch(fileUrl, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Basic ${credentials}`,
  //     },
  //   }).then((response) => response.blob());
  //   base64Url.value = await blobToBase64Url(response);
  // });

  onMounted(async () => {
    try {
      if (!idFile) {
        throw new Error("El ID del documento no está definido.");
      }

      // Obtener la URL del documento desde el backend
      const responseUrl = await sgdeaArchivoAxios.get(`alfresco/document/${idFile}`);

      if (!responseUrl.data || !responseUrl.data.content) {
        throw new Error("La respuesta no contiene una URL válida.");
      }

      fileUrl.value = responseUrl.data.content;

      if (!fileUrl.value) {
        throw new Error("La URL del archivo está vacía.");
      }

      base64Url.value = "data:application/pdf;base64," + fileUrl.value;

    } catch (error) {
      console.error(error);
    }
  });

  const activeTab = ref("preview");

  const tabs = [
    {
      title: "Vista Previa",
      value: "preview",
      icon: "fas fa-file",
    },
    {
      title: "Información del Documento",
      value: "informacion",
      icon: "fas fa-info-circle",
    },
    // { title: "Seguridad", value: "seguridad", icon: "fas fa-user-lock" },
    // { title: "Trazabilidad del Documento", value: "trazabilidad", icon: "fas fa-history" },
  ];

  return { tabs, activeTab, router, base64Url, idFile };
};
