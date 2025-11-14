import { thirdFormatDate } from "src/helpers/formtDate";
import { toast } from "src/helpers/toast";
import { sgdeaArchivoAxios } from "src/services";
import { Column } from "src/shared/components/PrimeComponents/Table/Table";
import { Ref, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useMigrarTRD = (emit: (event: string, ...args: any[]) => void) => {
  const route = useRoute();
  const router = useRouter()

  const showConfirmModal = ref(false);
  const showErrorsModal = ref(false);

  const filePicker = ref();
  const file: Ref<File> = ref();

  const count = ref(0);

  const currentBatch = ref();

  const url = ref(`/trd/positiva/file/${route.params["id"]}`);
  const columns: Column[] = [
    {
      field: "fileName",
      header: "Nombre del Archivo",
      type: "string",
    },
    {
      field: "uploadDate",
      header: "Fecha de Cargue",
      type: "string",
      replaceValue: (val) => thirdFormatDate(val),
    },
    {
      field: "errorCount",
      header: "Cantidad de Registros",
      type: "number",
    },
      {
      field:  (row) => row.trdVersion?.versionName ?? "-",
      header: "Nombre o versión de la TRD",
      type: "number",
    },
       {
      field:  (row) => row.trdVersion?.status ?? "-",
      header: "Estado",
      type: "number",
    },
    {
      field: "action",
      header: "Ver",
      type: "string",
      format: "uppercase",
      classCss: "text-right",
      name: "actions",
      actions: [
        {
          icon: "eye",
          eventbtn: ({ fileKey, batchId }: any) => {
            currentBatch.value = `${fileKey}/${batchId}`;
            showErrorsModal.value = true;
          },
          name: "view",
          color: "primary",
        },
      ],
    },
  ];

  watch(file, () => {
    if (file.value) showConfirmModal.value = true;
  });

  const onOpenFilePicker = () => {
    if (filePicker.value) {
      filePicker.value.pickFiles();
    }
  };

  const onSendFile = async (storedFile: File) => {
    try {
      file.value = null;
      let formData = new FormData();
      formData.append("file", storedFile);
      const response = await sgdeaArchivoAxios.post(
        `/trd/masive?trdVersion=${route.params["id"]}&sheet=0`,
        formData
      );

     const responseData = await sgdeaArchivoAxios.post(
        `/trd/positiva/upload?trdVersion=${route.params["id"]}`,
        response.data
      );


      router.push("/archivo/clasificacion-documental/gestionar-versiones/");
      const cantidadRegistros = responseData.data?.data;
      toast.success(`¡Carga Exitosa! se han cargado ${cantidadRegistros} registros.`);
    } catch (error) {
      toast.error("La consulta solicitada está tardando más de lo esperado en procesarse, inténtelo nuevamente");
    } finally {
      count.value++;
    }
  };

  return {
    url,
    columns,
    filePicker,
    file,
    count,
    currentBatch,
    showConfirmModal,
    showErrorsModal,
    onOpenFilePicker,
    onSendFile,
  };
};
