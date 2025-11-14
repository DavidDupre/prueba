import { TableHeader }  from 'src/interfaces/TableHeaders'

export const Casos_HEADER: TableHeader[] = [
  {
    name: "canal_radicacion",
    align: "center",
    label: "Canal de radicación",
    field: "id",
    sortable: true,
  },
  {
    name: "numero_radicado",
    align: "center",
    label: "Número de radicado",
    field: "firstname",
    sortable: true,
  },
  {
    name: "fecha_radicacion",
    align: "center",
    label: "Fecha de radicación",
    field: "lastname",
    sortable: true,
  },
  {
    name: "tiempo_asignado",
    align: "center",
    label: "Tiempo asignado",
    field: "userName",
    sortable: true,
  },

  {
    name: "tiempo_por_vencer",
    align: "center",
    label: "Tiempo por vencer",
    field: "enabled",
    sortable: true,
  },

  {
    name: "fecha_vencimiento",
    align: "center",
    label: "Fecha de vencimiento",
    field: "enabled",
    sortable: true,
  },

  {
    name: "nombre_afectado",
    align: "center",
    label: "Nombre del afectado",
    field: "enabled",
    sortable: true,
  },

  {
    name: "remitente",
    align: "center",
    label: "Remitente",
    field: "enabled",
    sortable: true,
  },

  {
    name: "ciudad",
    align: "center",
    label: "Ciudad",
    field: "enabled",
    sortable: true,
  },
  // {
  //   name: 'acciones',
  //   align: 'center',
  //   label: 'Acciones',
  //   field: 'acciones',
  //   sortable: true,
  // }
];

export interface ISearchCasosData {
  ciudad: string;
  estado: string;
  numeroRadicado: string;
  tipoTramite: string;
}
