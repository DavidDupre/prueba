import { adminAxios } from "src/services";

const transformStringToBoolean = (value: string | boolean): string | boolean => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (typeof value === "boolean") {
    return value;
  }

  return "";
};

const transformStringToInteger = (value: string | number): string | number => {
  if (value) {
    if (typeof value === "string") {
      return Number(value);
    }
    if (typeof value === "number") {
      return value;
    }
  }

  return "";
};

// Nos aseguramos que los FK sean number y los booleanos boolean para que no reviente el endpoint cuando persistimos.
export const saveInMemoryData = (
  remitenteForm,
  remitenteData,
  afectadoForm,
  afectadoData,
  solicitudForm,
  solicitudData
) => {
  if (remitenteForm && remitenteForm.value && remitenteForm.value.enteControl) {
    remitenteForm.value.enteControl.tipoDocumentoRemitente =
      transformStringToInteger(
        remitenteForm.value.enteControl.tipoDocumentoRemitente
      );

    remitenteData.value = remitenteForm.value.enteControl;
  }
  if (afectadoForm && afectadoForm.value && afectadoForm.value.enteControl) {
    afectadoForm.value.enteControl.tipoDocumentoAfectado =
      transformStringToInteger(
        afectadoForm.value.enteControl.tipoDocumentoAfectado
      );
    afectadoForm.value.enteControl.lgbti = transformStringToBoolean(
      afectadoForm.value.enteControl.lgbti
    );
    afectadoForm.value.enteControl.sexoAfectado = transformStringToInteger(
      afectadoForm.value.enteControl.sexoAfectado
    );
    afectadoForm.value.enteControl.condicionEspecial = transformStringToInteger(
      afectadoForm.value.enteControl.condicionEspecial
    );
    afectadoForm.value.enteControl.paisAfectado = transformStringToInteger(
      afectadoForm.value.enteControl.paisAfectado
    );
    afectadoForm.value.enteControl.departamentoAfectado =
      transformStringToInteger(
        afectadoForm.value.enteControl.departamentoAfectado
      );
    afectadoForm.value.enteControl.municipioAfectado = transformStringToInteger(
      afectadoForm.value.enteControl.municipioAfectado
    );
    afectadoForm.value.enteControl.medioRespuesta = transformStringToInteger(
      afectadoForm.value.enteControl.medioRespuesta
    );
    afectadoData.value = afectadoForm.value.enteControl;
  }
  if (solicitudForm && solicitudForm.value && solicitudForm.value.enteControl) {
    solicitudForm.value.enteControl.canalRecepcion = transformStringToInteger(
      solicitudForm.value.enteControl.canalRecepcion
    );
    solicitudForm.value.enteControl.tipoSolicitud = transformStringToInteger(
      solicitudForm.value.enteControl.tipoSolicitud
    );
    solicitudForm.value.enteControl.tipoProducto = transformStringToInteger(
      solicitudForm.value.enteControl.tipoProducto
    );
    solicitudData.value = solicitudForm.value.enteControl;
  }


  return {
    remitenteData,
    afectadoData,
    solicitudData
  }
};


export const getPaises = async () => {
  const response = await adminAxios.get("/paises/list");
  if(response.status === 200){
    const { data } = response;
    const unorderedList = data.map((pais) => {
      return {
        label: pais.nombre,
        value: pais.idPais,
      }
    })

    unorderedList.sort((a, b) => a.label.localeCompare(b.label));
    return unorderedList;
  }
}

export const getDepartamentos = async (paisID:number) => {
  const response = await adminAxios.get(`/departamentos/list/${paisID}`);
  if(response.status === 200){
    const { data } = response;
    const departamentos = data.map((departamento) => {
      return {
        label: departamento.nombre,
        value: departamento.idDepartamento,
      }
    })

    return departamentos;
  }
}

export const getMunicipios = async (departamentoID:number) => {
  const response = await adminAxios.get(`/municipios/list/${departamentoID}`);
  if(response.status === 200){
    const { data } = response;
    const municipios = data.map((municipio) => {
      return {
        label: municipio.nombre,
        value: municipio.idMunicipio,
        codigoDivipola: municipio.codigoDivipola
      }
    })

    return municipios;
  }
}

type Response = {
  data: any,
  headers: unknown
}

export const handleDownloadFile = (response:Response, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([response?.data]));
  const link = document.createElement('a');
  link.href = url;

  const contentDisposition = response.headers['content-disposition'];

  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
    if (fileNameMatch.length === 2)
      fileName = fileNameMatch[1];
  }

  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}


export const phoneValidation = (val) => {
  const expresionRegular = /^\d{7,10}$/;
  const caracteresNoNumericos = /[^0-9]/;

  if (val) {
    if (caracteresNoNumericos.test(val)) {
      return "El campo solo permite valores numéricos";
    }
    if (expresionRegular.test(val)) {
      return true;
    } else {
      return "El número de teléfono debe tener entre 7 y 10 números";
    }
  }
};

export const celValidation = (val) => {
  const expresionRegular = /^\d{10}$/;
  const caracteresNoNumericos = /[^0-9]/;

  if (val) {
    if (caracteresNoNumericos.test(val)) {
      return "El campo solo permite valores numéricos";
    }
    if (expresionRegular.test(val)) {
      return true;
    } else {
      return "El número de teléfono celular debe tener 10 números";
    }
  }
};
