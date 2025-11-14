import { Empresa } from "./Empresa";

export interface Fondo {
  codigo:      null;
  descripcion: null;
  empresa:     Empresa;
  estado:      boolean;
  idFondo:     number;
  nitFondo:    number;
  nombre:      string;
  observacion: string;
 }