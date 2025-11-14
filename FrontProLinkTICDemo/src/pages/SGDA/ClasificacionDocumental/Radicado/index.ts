export const Documental_HEADER = [

  {
    name: 'id',
    align: 'center',
    label: 'Codigo tipo de Radicado',
    field: 'id',
    sortable: true,
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre tipo de Radicado',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'fecha',
    align: 'center',
    label: 'Fecha de radicado',
    field: 'fecha',
    sortable: true,
  },
  {
    name: 'estados',
    align: 'center',
    label: 'Estado',
    field: 'estados',
    sortable: true,
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones'
  }
];

export const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Módulo SGDEA",
    to: "/home",
  },
  {
    name: "Clasificación documental",
    to: "/home",
  },
  {
    name: "Administración de Tipos de Radicado",
  },
];

export const crear_routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Módulo SGDEA",
    to: "/home",
  },
  {
    name: "Clasificación documental",
    to: "/home",
  },
  {
    name: "Tipos de Radicado",
    to: '/SGDA/radicado'
  },
  {
    name: "Crear Tipo de Radicado",
  },
];
