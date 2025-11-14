export interface ICrearSerie {
  codigo: string;
  id_seriesubserie: string;
  fecha_vigencia_inicial: Date;
  fecha_vigencia_final: Date;
  descripcion: string;
  // tiempoGestion: string;
  // tiempoCentral: string;
  soporte: string;
  // disposicionFinal: string;
  estado: boolean | string;
  // procedimiento: string;
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
    name: "Subseries",
    to: "/SGDA/subseries",
  },
  {
    name: "Crear subserie ",
  },
];
