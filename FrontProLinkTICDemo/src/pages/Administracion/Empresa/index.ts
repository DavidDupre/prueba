export const routes = [
  {
    name: 'Inicio',
    to: '/home'
  },
  {
    name: 'Módulo Administración',
  },
  {
    name: 'Empresas',
    to: '/administracion/empresas'

  },

]

export const Empresa_HEADER = [
  {
    name: "idEmpresa",
    align: "center",
    label: "ID",
    field: "idEmpresa",
  },
  {
    name: "codigo",
    align: "center",
    label: "Código Empresa",
    field: "idEmpresa",
  },
  {
    name: "empresa",
    align: "center",
    label: "Nombre Empresa",
    field: "nombre",
  },
  {
    name: "tipoSociedad",
    align: "center",
    label: "Tipo de Sociedad",
    field: "tipoSociedad",
  },
  {
    name: "fechaContitucion",
    align: "center",
    label: "Fecha Constitución",
    field: "fechaContitucion",
    style: "width: 80px",
    headerStyle: "max-width: 180px; white-space: break-spaces; min-width: 180px;",
  },
  {
    name: "actoAdministrativoConstitucion",
    align: "center",
    label: "Acto Administrativo de Constitución",
    field: "actoAdministrativoConstitucion",
    headerStyle: "max-width: 180px; white-space: break-spaces; min-width: 180px;",
  },
  {
    name: "nit",
    align: "center",
    label: "Nit",
    field: "nit",
  },
  {
    name: "direccion",
    align: "center",
    label: "Dirección",
    field: "direccion",
  },
  {
    name: "telefono",
    align: "center",
    label: "Teléfono",
    field: "telefono",
  },
  {
    name: "email",
    align: "center",
    label: "Correo Electrónico",
    field: "email",
  },
  {
    name: "nombreRepresentante",
    align: "center",
    label: "Nombre Representante Legal",
    field: "nombreRepresentanteLegal",
    headerStyle: "max-width: 180px; white-space: normal; min-width: 180px;",
  },
  {
    name: "telefonoRepresentante",
    align: "center",
    label: "Teléfono Representante Legal",
    field: "telefonoRepresentanteLegal",
    headerStyle: "max-width: 180px; white-space: normal; min-width: 180px;",
  },
  {
    name: "direccionRepresentante",
    align: "center",
    label: "Dirección Representante Legal",
    field: "direccionRepresentanteLegal",
    headerStyle: "max-width: 180px; white-space: normal; min-width: 180px;",
  },

  {
    name: "nacionalidadRepesentanteLegal",
    align: "center",
    label: "Nacionalidad Representante Legal",
    field: "nacionalidadRepesentanteLegal",
    headerStyle: "max-width: 180px; white-space: normal; min-width: 180px;",
  },
  {
    name: "emailRepresentante",
    align: "center",
    label: "Correo Electrónico Representante Legal",
    field: "correoRepresentanteLegal",
    headerStyle: "max-width: 170px; white-space: normal; min-width: 170px;",
  },
  {
    name: "acciones",
    align: "center",
    label: "Acciones",
    field: "acciones",
  },
];


export interface IDataEmpresa {
  actoAdministrativoConstitucion: string,
  correoRepresentanteLegal: string,
  direccion: string,
  direccionRepresentanteLegal: string,
  email: string,
  estado: true,
  fechaContitucion: string,
  idEmpresa: number,
  nacionalidadRepesentanteLegal: string,
  nit: string,
  nombre: string,
  nombreRepresentanteLegal: string,
  telefono: string,
  telefonoRepresentanteLegal: string,
  tipoSociedad: number
}


export const options = []
