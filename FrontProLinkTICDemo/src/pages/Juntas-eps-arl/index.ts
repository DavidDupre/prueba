export const TABLE_HEADER:any = [
  {
    name: "nombreRemitente",
    align: "center",
    label: "Nombre del Remitente",
    field: "nombreRemitente",
  },
  {
    name: "numeroDocumento",
    align: "center",
    label: "Numero de Documento del Remitente",
    field: "numeroDocumento",
  },
  {
    name: "direccionRemitente",
    align: "center",
    label: "Direccion del Remitente",
    field: "direccionRemitente",
  },
  {
    name: "tipoDocumentoRemitente",
    align: "center",
    label: "Tipo de Documento del Remitente",
    field: "tipoDocumentoRemitente",
  },
  {
    name: "pais",
    align: "center",
    label: "Pais",
    field: "pais",
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
    name: "correo",
    align: "center",
    label: "Correo del Remitente",
    field: "correo",
  },
  {
    name: "telefono",
    align: "center",
    label: "Telefono del Remitente",
    field: "telefono",
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
  nombreDepartamento: { label: String, value: Number };
  nombreMunicipio: { label: String, value: Number };
  nombreRemitente: string;
}
