export type TipoComunicacion = {
  id: number,
  nombre: string
}

export type Response = {
    data: any,
    headers: unknown
}

export enum AccionesDocumentos {
  AGREGAR_DOCS = 'AGREGAR_DOCS',
  ELIMINAR_DOCS = 'ELIMINAR_DOCS'
}