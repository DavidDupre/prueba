import moment from "moment";
import { InfoGeneral, UserByRolAndIdOfficinaI } from "./types";

export const dataMapping = (info: InfoGeneral): InfoGeneral => {
  return {
    id: info.id,
    asignaciones:info.asignaciones||[],
    informacionRemitente: {
      tipoRemitente: info.informacionRemitente.tipoRemitente,
      tipoDocumentoRemitente: info.informacionRemitente.tipoDocumentoRemitente,
      numeroDocumentoremitente: info.informacionRemitente.numeroDocumentoremitente,
      nombreRemitente: info.informacionRemitente.nombreRemitente,
    },
    informacionGeneral: {
      numeroRadicado: info.informacionGeneral.numeroRadicado,
      tipoSolicitud: info.informacionGeneral.tipoSolicitud,
      afectado: info.informacionGeneral.afectado,
      colaborador: info.informacionGeneral.colaborador,
      fechaVencimiento: info.informacionGeneral.fechaVencimiento
        ? moment(info.informacionGeneral.fechaVencimiento).format("DD/MM/YYYY")
        : "",
    },
    informacionAfectado: {
      tipoDocumentoAfectado: info.informacionAfectado.tipoDocumentoAfectado,
      numeroDocumentoAfectado: info.informacionAfectado.numeroDocumentoAfectado,
      nombresAfectado: info.informacionAfectado.nombresAfectado,
      perteneceLGBT: info.informacionAfectado.perteneceLGBT,
      sexo: info.informacionAfectado.sexo,
      condicionEspecial: info.informacionAfectado.condicionEspecial,
    },
    informacionContacto: {
      email: info.informacionContacto.email,
      telefonoCelular: info.informacionContacto.telefonoCelular,
      telefonoFijo: info.informacionContacto.telefonoFijo,
      paisContacto: info.informacionContacto.paisContacto,
      departamentoContacto: info.informacionContacto.departamentoContacto,
      municipioContacto: info.informacionContacto.municipioContacto,
      direccionContacto: info.informacionContacto.direccionContacto,
      medioRepuesta: info.informacionContacto.medioRepuesta,
    },
    informacionSolicitud: {
      tipoSolicitud: info.informacionSolicitud.tipoSolicitud,
      detalle: info.informacionSolicitud.detalle,
      producto: info.informacionSolicitud.producto,
      observaciones: info.informacionSolicitud.observaciones,
    },
    numeroDevoluciones: info?.numeroDevoluciones,
    nroRadicado: info.nroRadicado,
    nodeID: info.nodeID,
    clonado: info.clonado,
    consolidadorId: info.consolidadorId,
    estado: {
      id: info.estado.id,
      etapa: info.estado.etapa,
      estado: info.estado.estado,
    },
    fechaRadicacion: info.fechaRadicacion,
    detalleSolicitud: info.detalleSolicitud,
    tiempoPorVencer: info.tiempoPorVencer,
    tiempoAsignado: info.tiempoPorVencer,
  };
};

export const validateInputTiempoTramite = (
  val: String,
  row: UserByRolAndIdOfficinaI
) => {
  const maxValue = row.unidadTiempo == "Horas" ? 24 : 30;
  let filteredInput = val.replace(/[^0-9]/g, "");

  if (Number(row.valorTiempo) >= 1 && Number(row.valorTiempo) <= maxValue)
    return;

  if (Number(row.valorTiempo) > maxValue) filteredInput = maxValue.toString();
  if (Number(filteredInput) > maxValue) filteredInput = maxValue.toString();
  if (row.valorTiempo == "0") filteredInput = "1";

  return (row.valorTiempo = filteredInput);
};

export const validateInputTiempoTramiteTwo = (val: String, row: any) => {
  const maxValue = row.unidadTiempo.val.value == "Horas" ? 24 : 30;
  let filteredInput = val.replace(/[^0-9]/g, "");

  if (Number(val) >= 1 && Number(val) <= maxValue)
    return;

  if (Number(val) > maxValue) filteredInput = maxValue.toString();
  if (Number(filteredInput) > maxValue) filteredInput = maxValue.toString();
  if (val == "0") filteredInput = "1";

  setTimeout(() => row.valorTiempo.val.value = filteredInput)
  return row.valorTiempo.val.value = filteredInput;
};

export const validateInputPhone = (val: string, formData: any, field:string) => {
 setTimeout(() => {
    const regex = /\D+/g;
    if (regex.test(val)) {
      formData[field] = val.replace(regex, ''); // Reemplaza las letras por vacío
    }
  });
};

export const maxValorTiempo = (users) => {
  return users.reduce((acc, user) => {
    if (user.valorTiempo > acc.valorTiempo) {
      return { valorTiempo: user.valorTiempo, usuarios: [user] };
    } else if (user.valorTiempo === acc.valorTiempo) {
      acc.usuarios.push(user);
      return acc;
    }
    return acc;
  }, { valorTiempo: 0, usuarios: [] });
}

export const informacionGeneralEmptyDefault = {
  id: 0,
  asignaciones: [],
  informacionRemitente: {
    tipoRemitente: "",
    tipoDocumentoRemitente: "",
    numeroDocumentoremitente: "",
    nombreRemitente: "",
  },
  informacionGeneral: {
    numeroRadicado: "",
    tipoSolicitud: "",
    afectado: "",
    colaborador: "",
    fechaVencimiento: "",
  },
  informacionAfectado: {
    tipoDocumentoAfectado: "",
    numeroDocumentoAfectado: "",
    nombresAfectado: "",
    perteneceLGBT: "",
    sexo: "",
    condicionEspecial: "",
  },
  informacionContacto: {
    email: "",
    telefonoCelular: "",
    telefonoFijo: "",
    paisContacto: "",
    departamentoContacto: "",
    municipioContacto: "",
    direccionContacto: "",
    medioRepuesta: "",
  },
  informacionSolicitud: {
    tipoSolicitud: "",
    detalle: "",
    producto: "",
    observaciones: "",
  },
  nroRadicado: "",
  nodeID: "",
  clonado: false,
  estado: {
    id: 0,
    etapa: "",
    estado: "",
  },
  fechaRadicacion: "",
  detalleSolicitud: "",
};

export const obtenerExtension = (nombreArchivo: string) => {
  const parts = nombreArchivo.toLowerCase().split(".");
  const formato = parts[parts.length - 1];
  return formato
};
