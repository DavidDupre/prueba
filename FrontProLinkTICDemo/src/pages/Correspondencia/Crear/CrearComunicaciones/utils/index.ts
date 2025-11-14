
import { dictionaryTypeCopy } from "../const";

export const validateCustom = (formGeneralData) => {
  return new Promise((resolve, reject) => {
    if (formGeneralData.value.asunto) {
      resolve(true);
    } else {
      reject(new Error('Diligencie los campos obligatorios de datos generales para continuar.'));
    }
  });
};

export const validateCustomFormData = (formDta, key) => {
  return new Promise((resolve, reject) => {
    if (formDta.has(key)) {
      resolve(true);
    } else {
      reject(new Error('Diligencie los campos obligatorios y guarde el formulario de datos de salida para continuar.'));
    }
  });
};

export const mapFormDataToDestinataires = (formExitData,type) => {
  if (type === dictionaryTypeCopy[1]) {
    return {
      id : `${formExitData.official.email}-${formExitData.dependencieType}`,
      nombre: formExitData.official,
      dependencia: formExitData.dependencieType,
      dependencia_label: formExitData.dependencia_label,
      nombre_label: formExitData.nombre_label,
      cargo: formExitData.manualInternoCargoDestinatario,
      correo: formExitData.manualInternoCorreoDestinatario,
    }
  }
  if (type === dictionaryTypeCopy[2]) {
    return {
      id: formExitData.manualExternoCorreo,
      forma: formExitData.manualExternoFormaEnvioId,
      tipo: formExitData.manualExternoTipoDocumentoDestinatarioId,
      nombre: formExitData.manualExternoNombreDestinatario,
      numero: formExitData.manualExternoNumeroDocumentoDestinatario,
      direccion: formExitData.manualExternoDireccion,
      pais: formExitData.manualExternoPaisId,
      departamento: formExitData.manualExternoDeptoId,
      municipio: formExitData.manualExternoMunicipioId,
      telefonoDestinatario: formExitData.manualExternoTelefono,
      correoElectronico: formExitData.manualExternoCorreo,
      municipio_label: formExitData.municipio_label,
      departamento_label: formExitData.departamento_label,
      pais_label: formExitData.manualExternoPaisId.label,
      forma_label: formExitData.forma_label,
      tipo_label: formExitData.tipo_label,

    }
  }
}
