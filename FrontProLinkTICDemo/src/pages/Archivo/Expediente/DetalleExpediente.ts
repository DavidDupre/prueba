import { onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth.store";
import { FormDataExpediente } from "src/interfaces/Expediente";
import { sgdeaArchivoAxios } from "src/services";

export const useDetalleExpediente = () => {
  const router = useRouter();
  const route = useRoute();
  const activeTab = ref();
  const loading = ref(true);

  const { getUserInfo } = useAuthStore();
  const user = ref(getUserInfo());

  const expediente: Ref<FormDataExpediente> = ref();

  onMounted(async () => {
    loading.value = true;
    const id = route.params["id"];
    const {
      data: { elementos },
    } = await sgdeaArchivoAxios.get(`/record/filter?expediente_id=${id}`);
    expediente.value = elementos.find((item) => item.recordId == id);
    // if (expediente.value?.status === "INACTIVO") {
    //   tabs.push({
    //     title: "Ficha de Declaración",
    //     value: "fichaDeclaracion",
    //     icon: "fas fa-user-plus",
    //   });
    // }
    loading.value = false;
  });

  const tabs = [
    {
      title: "Información del Expediente",
      value: "informacion",
      icon: "fas fa-info-circle",
    },
    {
      title: "Documentos del Expediente",
      value: "documentos",
      icon: "fas fa-book",
    },
    // {
    //   title: "Unidades Físicas",
    //   value: "unidades",
    //   icon: "fas fa-box-archive",
    // },
    { title: "Seguridad", value: "seguridad", icon: "fas fa-user-lock" },
    {
      title: "Trazabilidad del Expediente",
      value: "asignar",
      icon: "fas fa-user-plus",
    },
    {
      title: "Unidades Físicas",
      value: "unidades",
      icon: "fa-solid fa-list",
    },
  ];



  return {
    tabs,
    activeTab,
    router,
    expediente,
    loading,
  };
};
