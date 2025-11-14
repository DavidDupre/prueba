import { BonitaAPI } from "src/interfaces";
import { sgdeaAxios } from "src/services";

export const getDepartments = async () => {
  const { data } = await sgdeaAxios.get<BonitaAPI[]>(
    "api/v1/integracion/bonita/models/departamentosBonitaXNombre?p=0&c=1000"
  );

  return data.map((value) => ({
    label: value.nombre,
    value: value.codigoDivipola,
  }));
};

export const getMunicipalities = async () => {
  const { data } = await sgdeaAxios.get<BonitaAPI[]>(
    "api/v1/integracion/bonita/models/municipiosBonitaXNombre?p=0&c=1000"
  );

  return data.map((value) => ({
    label: value.nombre,
    value: value.codigoDivipola,
  }));
};

export const filterMunicipalities = async (departmentCode: string) => {
  const municipalities = await getMunicipalities();
  return municipalities.filter((municipality) =>
    municipality.value.startsWith(departmentCode)
  );
};
