export interface IConsultarAnexos {
  code: string
  message: string
  result: Result
}

export interface Result {
  radicado: Radicado[]
  error: boolean
  descripcionError: any
}

export interface Radicado {
  node: Node
  anexos: Anexo[]
}

export interface Node {
  entry: Entry
}

export interface Entry {
  createdByUser: CreatedByUser
  modifiedAt: string
  nodeType: string
  content?: Content
  parentId: string
  aspectNames: any
  createdAt: string
  modifiedByUser: ModifiedByUser
  name: string
  id: string
  properties: any
  file: boolean
  folder: boolean
}

export interface CreatedByUser {
  id: string
  displayName: string
}

export interface Content {
  mimeType: string
  mimeTypeName: string
  sizeInBytes: number
  encoding: string
}

export interface ModifiedByUser {
  id: string
  displayName: string
}

export interface Anexo {
  nombreAnexo: string
  docAnexo: string
  contentType: string
}
