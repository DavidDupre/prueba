export const ESTADOS = {
  'Por asignar': { bg: '#E5EDFF', border: '#004efc', text: '#2C3948' },
  'Por revisar': { bg: '#EBF8EA', border: '#39BA2E', text: '#2C3948' },
  Revisado: { bg: '#BFC7DB73', border: '#2348AA', text: '#2C3948' },
  'Por aprobar': { bg: '#FFF8E7', border: '#FFB800', text: '#2C3948' },
  'Por Aprobar': { bg: '#FFF8E7', border: '#FFB800', text: '#2C3948' },
  'Aprobación rechazada': { bg: '#FDE5E5', border: '#EA0000', text: '#2C3948' },
  Aprobada: { bg: '#d9f3ac41', border: '#337e2d', text: '#2C3948' },
  Aprobado: { bg: '#d9f3ac41', border: '#337e2d', text: '#2C3948' },
  'Por gestionar': { bg: '#FFECDC', border: '#fa7c11', text: '#2C3948' },
  'Por recibir correspondencia': { bg: '#FFECDC', border: '#fa7c11', text: '#2C3948' },
  'Solicitud de reclasificación': { bg: '#fbb700', border: '#f5bc00', text: '#2C3948' },
  'Revisión rechazada': { bg: '#ffd2d2', border: '#b30202', text: '#2C3948' },
  Seguimiento: { bg: '#faac96', border: '#ff3a00', text: '#2C3948' },
  'Para gestión': { bg: '#39bf10', border: '#2e6d1b', text: '#2C3948' },
  'Para Gestion': { bg: '#FFECDC', border: '#fa7c11', text: '#2C3948' },
  'En edición': { bg: '#F7E5FF', border: '#be42f5', text: '#2C3948' },
  'Sin asignación': { bg: '#7086b8', border: '#1346ba', text: '#2C3948' },
  'Entrega Exitosa': { bg: '#d9f3ac41', border: '#337e2d', text: '#2C3948' },
  Enviado: { bg: '#d9f3ac41', border: '#337e2d', text: '#2C3948' },
  'Cerrado sin gestión': { bg: '#f5a17a', border: '#fe6721', text: '#2C3948' },
  Devolucion: { bg: '', border: '#db9cf7', text: '#2C3948' },
  'Por Publicar': { bg: '#ff835e', border: '#ff4d19', text: '#2C3948' },
  'Por publicar': { bg: '#ff835e', border: '#ff4d19', text: '#2C3948' },
  Publicado: { bg: '#e4a3fd', border: '#dd8bfc', text: '#2C3948' },
  'Publicacion rechazada': { bg: '#db5858', border: '#F7CBCB', text: '#2C3948' },
  'Publicacion cerrada ': { bg: '#cfee9a', border: '#b8f255', text: '#2C3948' },
  'Clonación en edición': { bg: '#efcdfd', border: '#d37cf7', text: '#2C3948' },
  'Clonación rechazada': { bg: '#F7CBCB', border: '#b30202', text: '#2C3948' },
  'Gestión terminada': { bg: '#d9f3ac41', border: '#337e2d', text: '#2C3948' },
  'Gestión rechazada': { bg: '#FDE5E5', border: '#EA0000', text: '#2C3948' },
  'Por consolidar': { bg: '#ffdcbf', border: '#fa7405', text: '#2C3948' },
  'Gestión clonada': { bg: '#E4FFA3', border: '#9dd315', text: '#2C3948' },
  'Excluido ': { bg: '#fc8068', border: '#f62900', text: '#2C3948' },
  'En asignación': { bg: '#e9fcff', border: '#4e77d4', text: '#2C3948' },
  'Para asignar': { bg: '#E5EDFF', border: '#82a8ff', text: '#2C3948' },
  Cerrado: { bg: '#E4FFA3', border: '#9dd315', text: '#2C3948' },
  Eliminada: { bg: '#ffd2d2', border: '#b30202', text: '#2C3948' },
  PENDIENTE: { bg: '#FFECDC', border: '#8C99A8', text: '#2C3948' },
  'ENTREGA EXITOSA': { bg: '#d9f3ac41', border: '#337e2d', text: '#2C3948' },
};

export interface EstadoColor {
  bg: string;
  border: string;
  text: string;
}

export const ColoresEstado = (estado: string): EstadoColor => {
  return ESTADOS[estado] ?? { bg: '', border: '', text: '#2C3948' };
};
