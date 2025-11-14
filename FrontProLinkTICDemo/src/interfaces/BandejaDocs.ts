export interface DocsRadicados {
  code: string;
  message: string;
  result: Result;
}

export interface Result {
  descripcionError: null;
  error: boolean;
  radicado: Radicado[];
  checked?: boolean
}

export interface Radicado {
  anexos: Anexo[];
  node: Node;
}

export interface Anexo {
  contentType: string;
  docAnexo: string;
  nombreAnexo: string;
}

interface Node {
  entry: Entry;
}

interface Entry {
  aspectNames: null;
  content: null;
  createdAt: string;
  createdByUser: EdByUser;
  file: boolean;
  folder: boolean;
  id: string;
  modifiedAt: string;
  modifiedByUser: EdByUser;
  name: string;
  nodeType: string;
  parentId: string;
  properties: null;
}

interface EdByUser {
  displayName: string;
  id: string;
}
