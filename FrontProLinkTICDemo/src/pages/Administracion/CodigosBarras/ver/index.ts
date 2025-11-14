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
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo SGDEA',
    to: '/home'
  },
  {
    name: 'Administracion',
    to: '/home'
  },
  {
    name: 'Tipos codigos de barras',
    to: '/administracion/barras'
  },
  {
    name: 'Visualizacion tipos codigos de barras'
  }
]
