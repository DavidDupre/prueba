export interface ICrearSerie {
  descripcion: string,
  estados: boolean,
  fechaVigenciaInicial: Date,
  fechaVigenciaFinal: Date,
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
    name: "Crear serie Documental",
  },
];
