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
    name: "Administración",
    to: "/administracion",
  },

  {
    name: "Entidades",
    to: "/administracion/entidades"
  },
  {
    name: "Crear entidad"
  }
];
