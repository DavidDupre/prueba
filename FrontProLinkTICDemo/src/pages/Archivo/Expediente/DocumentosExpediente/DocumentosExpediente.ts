import { onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";

import { toast } from "src/helpers/toast";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import { sgdeaArchivoAxios } from "src/services";

export const useDocumentosExpediente = (expediente) => {
  const router = useRouter();
  const route = useRoute();

  const count = ref(0);
  const refreshKey = ref(0); // 🔹 Clave reactiva para forzar actualización
  const url = ref(
    `/alfresco/nodes/${expediente.nodeId}/structure?name=${route.query.titulo}`
  ); // 🔹 URL dinámica

  const files = ref<File[]>([]);
  const showModalSend = ref(false);
  const documentos = ref<any[]>([]);
  const tiposDocumentales = ref<any[]>([]);

  const formFilter = ref({
    // asunto: "",
    fechaFin: "",
    fechaInicio: "",
    // origen: "",
    // radicado: "",
    // tipoDocumental: null,
  });

  const origenes = ref([
    { value: "DIGITALIZADO", label: "Digitalizado" },
    { value: "ELECTRONICO", label: "Electrónico" },
    { value: "FISICO", label: "Físico" },
  ]);

  const columns: Column[] = [
    {
      field: "nombre",
      header: "Nombre del Documento",
      type: "string",
      replaceValue: (v: string) => (v ? v.replace(/\.[^/.]+$/, "") : ""),
    },
    {
      field: "mimeType",
      header: "Formato",
      type: "string",
      name: "status",
    },
    {
      field: "parentFolder",
      header: "Radicado",
      type: "string",
      replaceValue: (v) => v || "-",
    },
    {
      field: "tamaño",
      header: "Peso del Documento",
      type: "string",
    },
    {
      field: "action",
      header: "Visualizar",
      type: "string",
      classCss: "text-center",
      format: "uppercase",
      name: "actions",
      width: "100px",
      actions: [
        {
          icon: "eye",
          eventbtn: (rowData: any) => {
            const { titulo } = expediente;
            router.push({
              path: `/archivo/documento/${expediente.id}/${rowData.id}`,
              query: {
                titulo,
                radicado: rowData.parentFolder,
              },
            });
          },
          color: "primary",
        },
      ],
    },
  ];

  const getDocumentTypes = async () => {
    try {
      const response = await sgdeaArchivoAxios.get(
        "/trd/documents"
      );
      if ([200, 202].includes(response.status)) {
        tiposDocumentales.value = response.data
          .map((tipo) => ({ label: tipo.name, value: tipo.id }))
          .sort((a, b) => a.label.localeCompare(b.label));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filtroApply = () => {
    url.value = `/alfresco/nodes/${expediente.nodeId}/structure?name=${route.params.id}&fechaInicial=${formFilter.value.fechaInicio}&fechaFinal=${formFilter.value.fechaFin}`;
    count.value++;
  };

  const clearFilter = () => {
    formFilter.value = {
      fechaFin: "",
      fechaInicio: "",
    };
    url.value = `/alfresco/nodes/${expediente.nodeId}/structure?name=${route.params.id}`;
    count.value++;
  };

  const fetchDocuments = async () => {
    try {
      const response = await sgdeaArchivoAxios.get(url.value);
      if (response.status === 200) {
        documentos.value = response.data.documents;
        refreshKey.value++; // 🔹 Forzar actualización de la tabla
      }
    } catch (error) {
      console.error(error);
    }
  };

  const rejectedFiles = (rejections: any[]) => {
    rejections.forEach(({ file, errors }) => {
      console.error(`Archivo rechazado: ${file.name}`);
      console.error(`Razón: ${errors.join(", ")}`);
    });
  };

  const validateFile = () => {
    if (files.value.length === 0) {
      toast.error("Por favor adjunte un archivo de documento digitalizado");
      return;
    }
    showModalSend.value = true;
  };

  const onSendFile = async () => {
    showModalSend.value = false;
    const formSend = new FormData();
    // formSend.append("idRecord", expediente.recordId.toString());
    files.value.forEach((file) => formSend.append("file", file));
    formSend.append("expedienteId", expediente.id.toString());
    formSend.append("subserieId", null);

    try {
      const response = await sgdeaArchivoAxios.post(
        "/alfresco/upload-file",
        formSend
      );
      toast.success("Se ha incluido el documento en el expediente");
      files.value = [];
      count.value++;
      await fetchDocuments();
      // router.go(0);
    } catch (e) {
      toast.error("Ha ocurrido un error al procesar su solicitud");
    }
  };

  watchEffect(fetchDocuments); // 🔹 Se ejecuta automáticamente cuando cambia `count`

  onMounted(async () => {
    await getDocumentTypes();
    await fetchDocuments();
  });

  return {
    getDocumentTypes,
    fetchDocuments,
    rejectedFiles,
    validateFile,
    onSendFile,
    showModalSend,
    columns,
    tiposDocumentales,
    origenes,
    formFilter,
    url,
    router,
    files,
    count,
    documentos,
    filtroApply,
    clearFilter,
    refreshKey, // 🔹 Para asegurar actualización en el template
  };
};
