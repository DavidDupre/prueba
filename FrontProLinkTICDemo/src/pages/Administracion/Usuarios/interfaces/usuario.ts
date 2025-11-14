import { Dependencia } from "src/interfaces";

export interface Usuario {
  id: number
  userName: string
  firstname: string
  lastname: string
  enabled: boolean
  cargo: string
  bonitaId: string
  email: string
  numeroDocumento: string
  usuarioRelaciones: UsuarioRelaciones[]
}

export interface UsuarioRelaciones {
  id: number
  usuario: string
  seccionSubSeccion: Dependencia
  oficina: Oficina
  rol: Rol
}

export interface Oficina {
  id: number
  nombre: string
  dependencia: Dependencia
}

export interface Rol {
  id: number
  nombre: string
  idBonita: number
  idGrupoBonita: number
  idKeycloak: string
}

export interface Oficina {
  id: number;
  nombre: string;
  dependencia: Dependencia;
}
