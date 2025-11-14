import { formatDateTimeStandTwo, formatDateForDoc } from "src/helpers/formtDate";
import { RowI } from "src/pages/EntesDeControl/Reportes/interfaces";

export const columns: any = [
  {
    name: "nroRadicado",
    label: "Radicado",
    align: "center",
    field: (row: RowI) => row.numeroRadicado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "fechaRadicacion",
    label: "Fecha de radicación",
    align: "center",
    field: (row: RowI) => row.fechaRadicacion,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "fechaRadicacion",
    label: "Mes",
    align: "center",
    field: (row: RowI) => row.mes,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "fechaRespuesta",
    label: "Fecha máxima de respuesta",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.fechaMaximaRespuesta,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "fechaCierre",
    label: "Fecha de cierre",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.fechaCierre,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : val.includes('registra') ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "fechaEnvio",
    label: "Fecha de envio",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.fechaEnvio,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "tiempoPorVencer",
    label: "Tiempo por vencer",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.tiempoVencer,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "canalRadicacion",
    label: "Canal de radicación",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.canalRadicacion,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "remitente",
    label: "Remitente",
    align: "center",
    field: (row: RowI) => ({
      documento: row.documentoRemitente,
      nombre: row.nombreRemitente,
    }),
    format: (val: { documento: string; nombre: string }) => {
      return `N° de Documento: ${val.documento}, Nombre: ${val.nombre}`;
    },
    sortable: true,
  },
  {
    name: "tipoRequerimiento",
    label: "Tipo de requerimiento",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.tipoTramiteRequerimiento,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "detalleTramite",
    label: "Detalle del trámite",
    style: "min-width: 450px; word-wrap: break-word; white-space: normal;",
    align: "center",
    field: (row: RowI) => row.detalleTramite,
    format: (val: string) => {
      const result = val.length > 300 ? val.slice(0, 300) + "..." : val;
      return val == "" ? "-" : result;
    },
    sortable: true,
  },
  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: (row: RowI) => row.estadoRadicado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "radicador",
    label: "Radicador",
    align: "center",
    field: (row: RowI) => {
      return {
        documento: row.usuarioRadicador?.numeroDocumento,
        nombre: `${row.usuarioRadicador?.firstname} ${row.usuarioRadicador?.lastname}`,
      };
    },
    format: (val: { documento: string; nombre: string }) => {
      return `N° de Documento: ${val.documento}, Nombre: ${val.nombre}`;
    },
    sortable: true,
  },
  {
    name: "clonado",
    label: "Clonado",
    align: "center",
    field: (row: RowI) => row.esClonado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "oficina",
    label: "Oficina responsable de respuesta",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.oficinaResponsableRespuesta.nombre,
    format: (val: string) => (val == "" ? "-" : val.toUpperCase()),
    sortable: true,
  },
  {
    name: "oficinas",
    label: "Oficinas que intervienen en la respuesta",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.oficinasIntervinientes,
    format: (val: string) => (val == "" ? "-" : val.toUpperCase()),
    sortable: true,
  },
  {
    name: "tiempoAsignador",
    label: "Tiempo asignado de radicación a oficina responsable",
    headerStyle: "min-width:210px;",
    align: "center",
    field: (row: RowI) => row.tiempoAsignadoOficinaResponsable,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "asignadorResponsable",
    label: "Asignador de responsable",
    align: "center",
    field: (row: RowI) => row.asignadorResponsable,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "fechaAsignacionOficina",
    label: "Fecha de asignación a la oficina",
    align: "center",
    field: (row: RowI) => row.fechaAsignacionOficina,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "fechaAsignacionGestionador",
    label: "Fecha de asignación al gestionador",
    align: "center",
    field: (row: RowI) => row.fechaAsignacionGestionador,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "diasAsignacionGestionador",
    label: "Días asignación gestionador",
    headerStyle: "min-width:200px;",
    align: "center",
    field: (row: RowI) => row.diasAsignacionGestionador,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "gestionadorResponsable",
    label: "Gestionador responsable",
    headerStyle: "min-width:200px;",
    align: "center",
    field: (row: RowI) => row.gestionadorResponsable,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "gestionadoresIntervienenRespuesta",
    label: "Gestionadores que intervienen en la respuesta",
    headerStyle: "min-width:200px;",
    align: "center",
    field: (row: RowI) => row.gestionadoresIntervinientes,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "diasOtorgadosGestionadoresClonados",
    label: "Días otorgados a gestionadores (Clonados)",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.diasOtorgadosGestionadoresClonados,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "fechaMaxRespuestaGestionadoresClonados",
    label: "Fecha máxima de respuesta gestionadores (Clonados)",
    headerStyle: "min-width:200px;",
    align: "center",
    field: (row: RowI) => row.fechaMaximaRespuestaGestionadoresClonados,
    format: (val: string) => {
      if (val != "-") {
        if (val.includes(",")) {
          return val.split(",").map((value) => formatDateForDoc(value)).join(", ");
        } else return formatDateForDoc(val);
      } else return val;
    },
    sortable: true,
  },
  {
    name: "fechaCierreGestionadoresClonados",
    label: "Fecha de cierre gestionadores (Clonados)",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.fechaCierreGestionadoresClonados,
    format: (val: string) => {
      if (val && val != "-") {
        if (val.includes(",")) {
          return val
            .split(",")
            .map((value) => formatDateForDoc(value))
            .join(", ");
        } else return formatDateForDoc(val);
      } else return val ? val : "-";
    },
    sortable: true,
  },
  {
    name: "fechaInicioGestion",
    label: "Fecha de iniciar gestión",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.fechaInicioGestion,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "fechaEnvioAprobacion",
    label: "Fecha de envío a aprobación",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.fechaEnvioAprobacion,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "fechaAprobacion",
    label: "Fecha de aprobación",
    align: "center",
    field: (row: RowI) => row.fechaAprobacion,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "diasEnGestionAprobacion",
    label: "Días en gestión de aprobación",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.diasEnGestionAprobacion,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "responsableAprobacion",
    label: "Responsable aprobación",
    align: "center",
    field: (row: RowI) => row.responsableAprobacion,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "fechaEnvioRevision",
    label: "Fecha de envío la revisión",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.fechaEnvioRevision,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "fechaRevision",
    label: "Fecha de revisión",
    align: "center",
    field: (row: RowI) => row.fechaRevision,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "diasGestionRevision",
    label: "Días en gestión de revisión",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.diasEnGestionRevision,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "responsableRevision",
    label: "Responsable revisión",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.responsableRevision,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "nombreRemitente",
    label: "Nombre del remitente",
    align: "center",
    field: (row: RowI) => row.nombreRemitente,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "departamentoRemitente",
    label: "Departamento del remitente",
    align: "center",
    field: (row: RowI) => row.departamentoRemitente,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "municipioRemitente",
    label: "Municipio del remitente",
    align: "center",
    field: (row: RowI) => row.municipioRemitente,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "direccionRemitente",
    label: "Dirección del remitente",
    align: "center",
    field: (row: RowI) => row.direccionRemitente,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "correoRemitente",
    label: "Correo electrónico del remitente",
    align: "center",
    field: (row: RowI) => row.emailRemitente,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "nombreAfectado",
    label: "Nombre del afectado",
    align: "center",
    field: (row: RowI) => row.nombreAfectado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "documentoAfectado",
    label: "Número de Documento del Afectado",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.documentoAfectado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "sexoAfectado",
    label: "Sexo del afectado",
    align: "center",
    field: (row: RowI) => row.sexoAfectado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  // {
  //   name: "empresaAfectado",
  //   label: "Empresa del afectado",
  //   align: "center",
  //   field: (row:RowI) => row.empresaAfectado,
  //   sortable: true,
  // },
  {
    name: "direccionAfectado",
    label: "Dirección del afectado",
    align: "center",
    field: (row: RowI) => row.direccionAfectado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "correoAfectado",
    label: "Correo electronico del afectado",
    align: "center",
    field: (row: RowI) => row.emailAfectado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "telefonoAfectado",
    label: "Telefono del afectado",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.telefonoAfectado,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "condicionEspecial",
    label: "Condición especial",
    align: "center",
    field: (row: RowI) => row.condicionEspecial,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "lgbtiq",
    label: "LGBTIQ+",
    align: "center",
    field: (row: RowI) => row.lgbtiq,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "tiposSolicitudAsignador",
    label: "Tipo de solicitud asignador",
    headerStyle: "min-width:160px;",
    align: "center",
    field: (row: RowI) => row.tipoSolicitudAsignador,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "tipoSolicitudGestionador",
    label: "Tipo de solicitud gestionador",
    headerStyle: "min-width:160px;",
    align: "center",
    field: (row: RowI) => row.tipoSolicitudGestionador,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "producto",
    label: "Producto",
    align: "center",
    field: (row: RowI) => row.producto,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "detalle",
    label: "Detalle",
    align: "center",
    style: "min-width: 450px; word-wrap: break-word; white-space: normal;",
    field: (row: RowI) => row.detalleSolicitud,
    format: (val: string) => {
      const result = val.length > 300 ? val.slice(0, 300) + "..." : val;
      return val == "" ? "-" : result;
    },
    sortable: true,
  },
  {
    name: "tutela",
    label: "Tutela",
    align: "center",
    field: (row: RowI) => row.tutela,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "marcacionSuperfinanciera",
    label: "Marcación (Superfinanciera)",
    style: "min-width: 450px; word-wrap: break-word; white-space: normal;",
    align: "center",
    field: (row: RowI) => row.marcacionSuperfinanciera,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "radicadoSalida",
    label: "Radicado de salida",
    align: "center",
    field: (row: RowI) => row.radicadoSalida,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "fechaRadicadoSalida",
    label: "Fecha radicado de salida",
    headerStyle: "min-width:130px;",
    align: "center",
    field: (row: RowI) => row.fechaRadicadoSalida,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateTimeStandTwo(val);
    },
    sortable: true,
  },
  {
    name: "fechaEnvio",
    label: "Fecha de envio",
    align: "center",
    field: (row: RowI) => row.fechaEnvioRespuesta,
    format: (val: string) => {
      return val == "" ? "-" : val == "-" ? val : formatDateForDoc(val);
    },
    sortable: true,
  },
  {
    name: "nombreDestinatario",
    label: "Nombre del destinatario",
    align: "center",
    field: (row: RowI) => row.nombreDestinatario,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "numeroDocumentoDestinatario",
    label: "Número de documento del destinatario",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.numeroDocumentoDestinatario,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "direccionDestinatario ",
    label: "Dirección del destinatario",
    align: "center",
    field: (row: RowI) => row.direccionDestinatario,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "departamentoDestinatario",
    label: "Departamento del destinatario",
    align: "center",
    field: (row: RowI) => row.departamentoDestinatario,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "municipioDestinatario",
    label: "Municipio del destinatario",
    align: "center",
    field: (row: RowI) => row.municipioDestinatario,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "telefonoDestinatario",
    label: "Teléfono del destinatario",
    align: "center",
    field: (row: RowI) => row.telefonoDestinatario,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "correoDestinatario",
    label: "Correo electronico del destinatario",
    headerStyle: "min-width:150px;",
    align: "center",
    field: (row: RowI) => row.emailDestinatario,
    sortable: true,
  },
  {
    name: "conCopia",
    label: "Con copia",
    headerStyle: "min-width:90px;",
    align: "center",
    field: (row: RowI) => row.conCopia,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "enviadoConCopia",
    label: "Enviado el: con copia",
    headerStyle: "min-width:100px;",
    align: "center",
    field: (row: RowI) => row.formaEnvioConCopia,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "formaEnvioConCopia",
    label: "Forma de envío de: con copia",
    headerStyle: "min-width:150px;",
    align: "center",
    field: (row: RowI) => row.formaEnvioDestinatariosCopia,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
  {
    name: "formaEnvioDestinatarioCopia ",
    label: "Forma de envío del destinatario de la copia",
    headerStyle: "min-width:180px;",
    align: "center",
    field: (row: RowI) => row.nombresDestinatariosEnCopia,
    format: (val: string) => (val == "" ? "-" : val),
    sortable: true,
  },
];
