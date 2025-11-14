export interface HistorialDocSalida {
  usuario: string;
  version: number;
  rol: string;
  htmlContent: string;
}

export const shouldCreateTrazabilidad = (trazaDocument: HistorialDocSalida[], htmlContent: string) => {
  if (!trazaDocument.length || !htmlContent) {
    return false;
  }

  const lastDocument = trazaDocument[trazaDocument.length - 1];
  return lastDocument.htmlContent !== htmlContent;
};
