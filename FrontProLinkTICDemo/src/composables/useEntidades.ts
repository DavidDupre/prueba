import { onMounted, Ref, ref } from "vue";
import { sgdeaAxios } from "src/services";
import { SelectInput } from "src/interfaces";

export const useEntidades = (id: number) => {
  const optionsEntidades: Ref<SelectInput[]> = ref([]);

  onMounted(async () => {
    const { data } = await sgdeaAxios.get(`/entidades/list/${id}`);
    optionsEntidades.value = data?.map((item: any) => ({
      label: item.entidad,
      value: item.entidad,
    }));
  });

  return { optionsEntidades };
};

export const useSeriesSubseries = (endpoint: string) => {
  const listSeries = ref([]);

  onMounted(async () => {
    const { data } = await sgdeaAxios.get(`/${endpoint}/serie`);
    listSeries.value = data
      ?.map((item: any) => ({
        label: `${item.codigo} - ${item.descripcion}`,
        value: item.codigo,
        estado: item.estados,
      }))
      .filter((it: any) => it.estado === true);
  });

  return { listSeries };
};

export const useDependencias = () => {
  const optionsDependencias = ref([]);
  function compareStrings(a, b) {
    // Convert both strings to lowercase for case-insensitive comparison
    a = a.nombre.toLowerCase();
    b = b.nombre.toLowerCase();
  
    // Compare the characters of the strings
    if (a < b) {
      return -1; // a comes before b
    } else if (a > b) {
      return 1; // b comes before a
    } else {
      return 0; // The strings are equal
    }
  }
  onMounted(async () => {
    const { data } = await sgdeaAxios.get(`/seccionSubSeccion`);
    optionsDependencias.value = data.sort(compareStrings)
      .map((item: any) => ({
        label: item.nombre,
        value: item.idSeccionSubSeccion,
      }))
      .filter((it: any) => !!it.label && !!it.value);
  });
  return { optionsDependencias };
};
