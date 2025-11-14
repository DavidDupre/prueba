export const ASIGNACION_HEADER = [
  {
    name: "nombre",
    label: "Prefijo",
    field: "nombre",
    sortable: true,
  },
  {
    name: "descripcion",
    label: "Descripción",
    sortable: true,
    field: (row) => collapseTextDescription(row),
    style: "white-space: pre;",
  },
  {
    name: "fecha_c",
    label: "Fecha de creación",
    field: "fecha_c",
    sortable: true,
  },
  {
    name: "usuario",
    label: "Usuario de creación",
    field: "usuario",
    sortable: true,
  },
  {
    name: "activo",
    label: "Estado",
    field: "activo",
    sortable: true,
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    sortable: false,
    align: "center",
  },
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
