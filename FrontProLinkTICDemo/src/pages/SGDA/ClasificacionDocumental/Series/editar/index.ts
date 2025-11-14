export interface IEditarSerie {
  descripcion: string,
  estados: boolean,
  fecha_vigencia_inicial: Date | string,
  fecha_vigencia_final: Date | string,
  id_seriesubserie: string,
  id_padre: number,
  codigo: string | number,
}

export const routes = [
  {
    name: "Inicio",
    to: "/home",
  },
  {
    name: "Módulo SGDEA",
  },
  {
    name: "Clasificación documental",
  },
  {
    name: "Series",
    to: "/SGDA/series",
  },
  {
    name: "Editar serie Documental",
  },
];
