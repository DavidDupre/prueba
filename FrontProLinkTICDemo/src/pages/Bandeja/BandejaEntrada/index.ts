export const SUBSERIES_HEADER = [
  {
    name: 'id',
    align: 'center',
    label: 'Código',
    field: 'id',
    sortable: true,
  },
  {
    name: 'nombreRadicado',
    align: 'center',
    label: 'Nombre del Radicado',
    field: 'nombreRadicado',
    sortable: true,
  },
  {
    name: 'cantidadAnexos',
    align: 'center',
    label: 'Cantidad de Anexos',
    field: 'cantidadAnexos',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'actions',
    sortable: true,
  }

];

export interface DataPaginator {
  start: number,
  end: number,
  total: number,
}
