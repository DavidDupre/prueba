export const RECLASIFICACION_HEADER = [
  {
    name: "radicado",
    align: "center",
    label: "Número de radicado",
    field: "radicado",
  },
  {
    name: "oficina",
    align: "center",
    label: "Oficina",
    field: "oficina",
  }, {
    name: "tramite",
    align: "center",
    label: "Tipo de trámite",
    field: "tramite",
  },
  {
    name: "reclasificacion",
    align: "center",
    label: "Reclasificar trámite",
    field: "reclasificacion",
  },
  {
    name: "observaciones",
    align: "center",
    label: "Observaciones",
    field: "observaciones",
  },
  {
    name: "tiempoPorVencer",
    align: "center",
    label: "Tiempo por vencer",
    field: "tiempoPorVencer",
  },
  {
    name: "fechaVencimiento",
    align: "center",
    label: "Fecha de vencimiento",
    field: "fechaVencimiento",
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
]


export interface Filtro {
  tiempoPorVencer: string;
  tipoDeTramite: string;
  oficina: string;
}
