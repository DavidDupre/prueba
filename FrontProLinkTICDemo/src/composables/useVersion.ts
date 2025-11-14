import { ref, onMounted, onUpdated } from 'vue';
import { adminAxios, sgdeaAxios } from "src/services";
import { VersionTRD } from '../interfaces';

interface IOptions {
  label: string,
  value: number,
}


const sortOptions = (vals) => {
  return vals.sort((leftItem, rightItem) => {
    const nombreA = leftItem.label.toLowerCase().trim();
    const nombreB = rightItem.label.toLowerCase().trim();

    if (nombreA < nombreB) {
      return -1;
    }

    if (nombreA > nombreB) {
      return 1;
    }

    return 0;
  });
}

export const useVersion = () => {

  const optionsVersion = ref([]);

  onMounted(async () => {
    const { data } = await sgdeaAxios.get<VersionTRD[]>("/versiontrd/list");
    optionsVersion.value = data
      .filter((item: any) => item.estado === true)
      .map((item: any) => ({
        label: item.nombreVersion,
        value: item.id,
      }));
  })

  return { optionsVersion }
}


export const useCountries = () => {

  const optionsCountries = ref([]);

  onMounted(async () => {
    const { data } = (await adminAxios.get("/paises/list"));

    optionsCountries.value = data?.map((item: any) => ({
      label: item.nombre,
      value: item.idPais,
      idPositiva: item.idPositiva
    })).sort((a, b) => a.label.localeCompare(b.label));
  })

  return { optionsCountries }
}

export const useCountries2 = async () => {
  const optionsCountries = ref([]);

  const { data } = (await adminAxios.get("/paises/list"));
  optionsCountries.value = data?.map((item: any) => ({
    label: item.nombre,
    value: item.idPais,
  })).sort((a, b) => a.label.localeCompare(b.label));


  return { optionsCountries }
}

export const useDependencies = () => {
  const optionsDependencies = ref([]);
  
  onMounted(async () => {
    const { data } = await sgdeaAxios.get("/seccionSubSeccion");
    
    const mappedData = data?.map((item: any) => ({
      label: item.nombre,
      value: item.idSeccionSubSeccion,
    })).sort((a, b) => a.label.localeCompare(b.label));
    
  optionsDependencies.value = [
      ...mappedData,
      { label: "OTROS", value: 0 }
    ].sort((a, b) => a.label.localeCompare(b.label));
  });
  
  return { optionsDependencies };
};

// export const useDependencies = () => {

//   const optionsDependencies = ref([]);

//   onMounted(async () => {
//     const { data } = (await sgdeaAxios.get("/seccionSubSeccion"));
//     optionsDependencies.value = data?.map((item: any) => ({
//       label: item.nombre,
//       value: item.idSeccionSubSeccion,
//     })).sort((a, b) => a.label.localeCompare(b.label));
//   })

//   return { optionsDependencies }
// }

export const useUnidadTiempo = () => {

  const opUnidadTiempo = ref([]);

  onMounted(async () => {
    const { data } = (await sgdeaAxios.get("/tutela/listadoUnidadTiempo"));
    opUnidadTiempo.value = data?.map((item: any) => ({
      label: item.nombre,
      value: item.id,
    }))
  })

  return { opUnidadTiempo }
}



export const useEstadoEtapas = async (id: number) => {

  const opEstadoEtapas = ref([]);

  const { data } = (await sgdeaAxios.get(`/tutela/listadoEstadosEtapaProcesalXETAPA/${id}`));
  opEstadoEtapas.value = data?.map((item: any) => ({
    label: item.nombre,
    value: item.id,
  }));

  return { opEstadoEtapas }
}

export const useCauses = async (id: number) => {

  const optionsCauses = ref([]);

  const { data } = (await sgdeaAxios.get(`/tutela/listadoCausalesXDependencia/${id}`));
  optionsCauses.value = data?.map((item: any) => ({
    label: item.nombre,
    value: item.id,
  }));

  return { optionsCauses }
}

export const useDepartments = async (id?: number) => {

  const optionsDepartments = ref([]);

  const url = id ? `/departamentos/list/${id}` : `/departamentos/list`;

  const { data } = (await adminAxios.get(url));

  optionsDepartments.value = data?.map((item: any) => ({
    label: toUpperCaseFormatted(item.nombre),
    value: item.idDepartamento,
  }));


  return { optionsDepartments }
}
export const toUpperCaseFormatted = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.toUpperCase())
    .join(' ');
};



export const useDepartmentsbyOpen = async (id: number) => {
  const optionsDepartments = ref([]);
  const { data } = (await adminAxios.get(id ?`/departamentos/list/${id}`: `/departamentos/list`));


  optionsDepartments.value = data?.map((item: any) => ({
    label: item.nombre,
    value: item.idDepartamento,
    codigoDivipola: item.codigoDivipola
  }));

  return { optionsDepartments }
}

export const useMunicipalities = async (id: any) => {
  const optionsMunicipalities = ref([]);

  let inputValue: number | null = null;

  if (typeof id === 'number') {
    inputValue = id;
  } else if (typeof id === 'object') {
    if ('value' in id) {
      const raw = id.value;
      if (typeof raw === 'number') {
        inputValue = raw;
      } else if (typeof raw === 'object' && raw?.idDepartamento) {
        inputValue = raw.idDepartamento;
      }
    } else if (id?.idDepartamento) {
      inputValue = id.idDepartamento;
    }
  }

  if (!inputValue || isNaN(inputValue)) {
    return { optionsMunicipalities };
  }

  const { data } = await adminAxios.get(`/municipios/list/${inputValue}`);

  optionsMunicipalities.value = sortOptions(
    data.map((item: any) => ({
      label: toUpperCaseFormatted(item.nombre),
      value: item.idMunicipio,
      codigoDivipola: item.codigoDivipola
    }))
  );

  return { optionsMunicipalities };
};


export const useJuzgados = () => {

  const optionsJuzgados = ref([]);

  onMounted(async () => {
    const { data } = (await sgdeaAxios.get("/api/v1/integracion/bonita/models/juzgados"));
    optionsJuzgados.value = data?.map((item: any) => ({
      label: item.nombre,
      value: item.persistenceId,
      direccion: item.direccion,
      telefono: item.telefono,
      celular: item.celular,
      correo: item.correo
    }));
  })

  return { optionsJuzgados }
}

export const useNewJuzgados = () => {

  const optionsJuzgados = ref([]);

  onMounted(async () => {
    const { data } = (await sgdeaAxios.get("/juzgados/"));
    optionsJuzgados.value = data?.map((item: any) => ({
      label: item.nombre,
      value: item.idJuzgado,
      direccion: item.direccion,
      telefono: item.telefono,
      celular: item.celular,
      correo: item.correo
    }));
  })

  return { optionsJuzgados }
}

export const useCanales = () => {

  const optionsCanales = ref([]);

  const nombresExcluidos = ['Call center', 'Ventanilla única de correspondencia', 'Aplicación Móvil'];

  onMounted(async () => {
    const { data } = (await sgdeaAxios.get("/api/v1/integracion/bonita/models/tiposCanal"));

    optionsCanales.value = data
      .filter(item => !nombresExcluidos.includes(item.nombre))
      .map(item => ({
        label: item.nombre,
        value: item.persistenceId,
      }));
  })

  return { optionsCanales }
}


export const useFondos = () => {

  const optionsFondos = ref([]);

  onMounted(async () => {
    const { data } = (await sgdeaAxios.get("/fondo"));
    optionsFondos.value = data?.map((item: any) => ({
      label: item.nombre,
      value: item.idFondo,
    }));
  })

  return { optionsFondos }
}

export const useVersiones = async (id: number) => {

  const optionsVersiones = ref([]);

  const { data } = (await sgdeaAxios.get(`/versiontrd/search?id_fondo=${id}`));
  optionsVersiones.value = data?.map((item: any) => ({
    label: item.nombreVersion,
    value: item.id,
  }));

  return { optionsVersiones }
}
