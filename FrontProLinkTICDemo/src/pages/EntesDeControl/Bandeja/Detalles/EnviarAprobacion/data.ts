export const columms = [
  {
    name: "colaborador",
    required: true,
    label: "Colaborador",
    align: "center",
    field: (row) => `${row.firstname} ${row.lastname}`,
    sortable: false,
  },
  {
    name: "cargo",
    required: true,
    align: "center",
    label: "Cargo",
    field: "cargo",
    sortable: false,
  },
  {
    name: "grupo",
    required: true,
    align: "center",
    label: "Grupo",
    field: (row) => row.usuarioRelaciones.find((user) => user.oficina),
    format: (value) => value.oficina.nombre,
    sortable: false,
  },
] as any;
