interface IRadicado {
  descripcion: string;
  id_tipo_de_radicado: number;
}

export interface IDataDocumental {
  descripcion: string;
  estado: boolean | string;
  id_tipo_documental: number;
  nombre: string;
  termino_tramite: number;
  tipoRadicadoId: IRadicado;
}


export const routes: { [key: string]: string | undefined }[] = [
  {
    name: "Inicio",
    to: "/",
  },
  {
    name: 'Módulo SGDEA',
    to: '/home'
  },
  {
    name: "Correspondencia",
    to: "/correspondencia",
  },
  {
    name: "Radicar documento",
  },
];

export const DOCUMENT_HEADER = [
  {
    name: "id",
    align: "center",
    label: 'ID',
    field: "id",
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre del anexo",
    field: "nombre",
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripción del anexo",
    field: "descripcion",
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo Documental",
    field: (row: string) => row,
  },
  {
    name: "fecha",
    align: "center",
    label: "Fecha del documento",
    field: "fecha",
  },
  {
    name: "archivo",
    align: "center",
    label: "Archivo adjunto",
    field: "archivo",
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  }
];
