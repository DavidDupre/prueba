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
    field: (row) => { 
      return row.usuarioRelaciones.find((user)=> { 
          return user.oficina.nombre.toLowerCase().includes('jurídica')
      }) || row.usuarioRelaciones[0];
    },
    format: (value) => value.oficina.nombre,
    sortable: false,
  },
  {
    name: "tiempo-tramite",
    align: "center",
    label: "Tiempo trámite por gestionador",
    field: (row) => row,
    sortable: false,
  },
] as any;

export const tipoTiempoTramites = ['Días', 'Horas'];