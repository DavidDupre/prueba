import moment from "moment";

export const ASIGNACION_HEADER = [
  {
    name: "nombre",
    label: "Prefijo",
    field: "nombre",
    sortable: true
  },
  {
    name: "oficina",
    label: "Oficina",
    field: (row) => row?.oficina || "-",
    sortable: true
  },
  {
    name: "descripcion",
    label: "Descripción",
    sortable: true,
    field: (row) => collapseTextDescription(row),
    style: "white-space: pre;"
  },
  {
    name: "revisionMasiva",
    label: "Revisión Masiva",
    field: (row) =>
      row?.revisionMasiva && row.revisionMasiva === true ? "Si" : "No",
    sortable: true
  },
  {
    name: "aprobador",
    label: "Aprobador",
    field: "aprobador",
    sortable: true
  },
  {
    name: "aprobacionMasiva",
    label: "Aprobación Masiva",
    field: (row) =>
      row?.aprobacionMasiva && row.aprobacionMasiva === true ? "Si" : "No",
    sortable: true
  },
  {
    name: "aprobacionAutomatica",
    label: "Aprobación Automática",
    field: (row) =>
      row?.aprobacionAutomatica && row.aprobacionAutomatica === true
        ? "Si"
        : "No",
    sortable: true
  },
  {
    name: "firma",
    label: "Tipo de Firma",
    field: (row) => row?.firma || "-",
    sortable: true
  },
  {
    name: "plantilla",
    label: "Plantilla",
    field: "plantilla",
    sortable: true
  },
  {
    name: "fecha_c",
    label: "Fecha de Creación",
    field: (row) => {
      const fecha = moment(row?.fechaCreacion);
      return fecha.isValid() ? fecha.format("DD/MM/YYYY") : "-";
    },
    sortable: true
  },
  {
    name: "fecha_edicion",
    label: "Fecha de Edición",
    field: (row) => {
      const fecha = moment(row?.prefijo?.usuario?.fechaModificacion);
      return fecha.isValid() ? fecha.format("DD/MM/YYYY") : "-";
    },
    sortable: true
  },
  {
    name: "usuario",
    label: "Usuario de Creación",
    field: "usuario",
    sortable: true
  },
  {
    name: "fecha_inactivacion",
    label: "Fecha de Inactivación",
    field: (row) => {
      const fecha = moment(row?.prefijo?.usuario?.fechaUltimaInactivacion);
      return fecha.isValid() ? fecha.format("DD/MM/YYYY") : "-";
    },
    sortable: true
  },
  {
    name: "proceso",
    label: "Proceso",
    field: "proceso",
    sortable: true
  },
  {
    name: "subproceso",
    label: "Sub-Proceso",
    field: "subproceso",
    sortable: true
  },
  {
    name: "activo",
    label: "Estado",
    field: "activo",
    sortable: true
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    align: "center",
  },
];

export const EXPORT_HEADER = [
  {
    name: "nombre",
    label: "Creacion de Prefijos",
    field: "nombre",
    sortable: true,
    align: "center",
  },
  {
    name: "oficina",
    label: "Oficina",
    field: (row) => row?.oficina || "-",
    sortable: true,
    align: "center",
  },
  {
    name: "descripcion",
    label: "Descripción",
    sortable: true,
    field: (row) => collapseTextDescription(row),
    style: "white-space: pre;",
    align: "center",
  },
  {
    name: "revisionMasiva",
    label: "Revisión Masiva",
    field: (row) =>
      row?.revisionMasiva && row.revisionMasiva === true ? "Si" : "No",
    sortable: true,
    align: "center",
  },
  {
    name: "aprobador",
    label: "Aprobador",
    field: "aprobador",
    sortable: true,
    align: "center",
  },
  {
    name: "aprobacionMasiva",
    label: "Aprobación Masiva",
    field: (row) =>
      row?.aprobacionMasiva && row.aprobacionMasiva === true ? "Si" : "No",
    sortable: true,
    align: "center",
  },
  {
    name: "aprobacionAutomatica",
    label: "Aprobación Automática",
    field: (row) =>
      row?.aprobacionAutomatica && row.aprobacionAutomatica === true
        ? "Si"
        : "No",
    sortable: true,
    align: "center",
  },
  {
    name: "firma",
    label: "Tipo de firma",
    field: (row) => row?.firma || "-",
    sortable: true,
    align: "center",
  },
  {
    name: "plantilla",
    label: "Plantilla",
    field: "plantilla",
    sortable: true,
    align: "center",
  },
  {
    name: "fecha_c",
    label: "Fecha de creación",
    field: (row) => {
      const fechaCreacion = moment(row?.fechaCreacion);
      return fechaCreacion.isValid() ? fechaCreacion.format("DD/MM/YYYY") : "-";
    },
    sortable: true,
    align: "center",
  },
  {
    name: "fecha_edicion",
    label: "Fecha de Edición",
    field: (row) => {
      const fecha = moment(row?.prefijo.usuario.fechaModificacion);
      return fecha.isValid() ? fecha.format("DD/MM/YYYY") : "-";
    },
    sortable: true
  },
  {
    name: "usuario",
    label: "Usuario de Creación",
    field: "usuario",
    sortable: true
  },
  {
    name: "fecha_inactivacion",
    label: "Fecha de Inactivación",
    field: (row) => {
      const fecha = moment(row?.prefijo.usuario.fechaUltimaInactivacion);
      return fecha.isValid() ? fecha.format("DD/MM/YYYY") : "-";
    },
    sortable: true
  },
  {
    name: "activo",
    label: "Estado",
    field: "activo",
    sortable: true,
    align: "center",
  }
];

const collapseTextDescription = (row) => {
  if (!row?.descripcion) return "-";
  const words = row?.descripcion?.split(" ");
  const collapsedText = words.reduce((result, word, index) => {
    if ((index + 1) % 10 === 0) {

      return result + word + "\n";
    } else {
      return result + word + " ";
    }
  }, "");
  return collapsedText.trim();
};
