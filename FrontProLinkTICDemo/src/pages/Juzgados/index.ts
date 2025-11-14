export const JUZGADOS_HEADER = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre del Juzgado",
    field: "nombre",
  },
  {
    name: "departamento",
    align: "center",
    label: "Departamento",
    field: "departamento",
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
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
  departamento: string;
  municipio: string;
  nombre: string;
}
