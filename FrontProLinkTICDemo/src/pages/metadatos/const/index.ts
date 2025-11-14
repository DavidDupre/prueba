export const META_HEADER = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre del campo",
    field: "nombre",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripción",
    field: (row: any) => {
      const description = row.descripcion || "-";
      // Dividir el texto en líneas de 70 caracteres
      const formattedDescription = description.match(/.{1,99}/g)?.join('\n') || description;
      return formattedDescription;
    },
    sortable: true,
    style: { whiteSpace: 'pre' }, // Respetar los saltos de línea sin espaciado adicional
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo de dato",
    field: "tipoDato",
    sortable: true,
  },
  {
    name: "tamano",
    align: "center",
    label: "Tamaño del dato",
    field: (row: any) => {
      return row.tamanio ? row.tamanio : "-";
    },
    sortable: true,
  },
  {
    name: "lista",
    align: "center",
    label: "Datos de lista desplegable",
    field: (row: any) => {
      if(row.tipoDato=== 'Boolean (si o no)'){
        row.lista='Si/No'
      }
      return row.lista ? row.lista : "-";
    },
    sortable: true,
  },
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];

export const fakeData = [
  {
    id: 1,
    nombre: "nombre",
    descripcion: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes",
    tipo: "Lista desplegabe",
    tamano: 50,
    lista:"Cedula de ciudadania / Tarjeta de identidad / Cedula de extranjeria / Pasaporte",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "apellido",
    descripcion: "apellido de la persona",
    tipo: "Alfanumerico",
    tamano: 50,
    lista:"Cedula de ciudadania / Tarjeta de identidad / Cedula de extranjeria / Pasaporte",
    estado: "Inactivo",
  },
  {
    id: 3,
    nombre: "edad",
    descripcion: "edad de la persona",
    tipo: "int",
    tamano: 3,
    lista:"Cedula de ciudadania / Tarjeta de identidad / Cedula de extranjeria / Pasaporte",
    estado: "Activo",
  },
]

export const objResponse={
  campos_obligtorios:"Debe diligenciar los campos obligatorios para continuar con el proceso",
  error:"Error al crear el metadato",
  success:"Se ha guardado el metadato correctamente",
  successEdit:"Se ha editado el metadato correctamente",
  errorEdit:"Error al editar el metadato",
  errorFile:"Error al descargar el archivo",
  errorGet:"Error al obtener el metadato",
  errorConfig:"Error al crear la configuración",

}

export const datoslistaDesplegable = [
  {
    label:"Pasaporte",
    value:"Pasaporte"
  },
  {
    label:"Cedula de ciudadania",
    // value:"Cedula-**"
    value:"Cedula"
  },
  {
    label:"Cedula de extranjeria",
    value:"CExt"
  },
  {
    label:"Tarjeta de identidad",
    value:"TI"
  },
  {
    label:"Registro civil",
    value:"RC"
  }
];

export const listaDesplegable=[
  {
    label: "Alfanumerico",
    value: 1,
  },
  {
    label: "Lista desplegable",
    value: 2,
  },
  {
    label:"Boolean (si o no)",
    value: 3,
  }
]

export const state=[
  {
    label: "Activo",
    value: true,
  },
  {
    label: "Inactivo",
    value: false,
  },
]

export const objDatosListaDesplegable = {
  Pasaporte: "Pasaporte",
  Cedula: "Cedula de ciudadania",
  CExt: "Cedula de extranjeria",
  TI: "Tarjeta de identidad",
  RC: "Registro civil",
}

export const listaDesplegableBoolean=[
  {
    label: "Si",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
]

export const objOptionsExport = [
  {
    label: "Exportar CSV",
    value: 2,
  },
  {

    label: "Exportar xlsx",
    value: 1,
  },
]

export const listaFormatoTiempo = [
  'Sin tiempo', 'Horas', 'Días'
]

export const listaTipoTiempo = [
  'Calendario', 'Laboral (hábiles)'
]

