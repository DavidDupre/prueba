export const COBROS_HEADER = [
  {
    name: "dependencia",
    align: "center",
    label: "Dependencia radicado",
    field: "dependencia",
  },
  {
    name: "responsable",
    align: "center",
    label: "Responsable del proceso",
    field: "responsable",
  },
  {
    name: "tramite",
    align: "center",
    label: "Tipo de trámite",
    field: "tramite",
  },
  {
    name: "recepcion",
    align: "center",
    label: "Canal de recepción",
    field: "recepcion",
  },
  {
    name: "tipoDocumento",
    align: "center",
    label: "Tipo de documento",
    field: "tipoDocumento",
  },
  {
    name: "numeroDocumento",
    align: "center",
    label: "Número de identificación",
    field: "numeroDocumento",
  },
  {
    name: "remitente",
    align: "center",
    label: "Remitente",
    field: "remitente",
  },
  {
    name: "fechaHora",
    align: "center",
    label: "Fecha y hora",
    field: "fechaHora",
  },
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];


export interface Filtro {
  numeroRadicado: string;
  oficina: string;
  remitente: string;
  fechaRadicado: string;
  estado: string;
}
