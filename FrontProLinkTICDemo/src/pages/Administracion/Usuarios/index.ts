import { Usuario } from "./interfaces/usuario";

export const Usuarios_HEADER = [
  {
    name: 'id',
    align: 'center',
    label: 'Código',
    field: 'id',
    sortable: true,
  },
  {
    name: 'name',
    align: 'center',
    label: 'Nombre Completo',
    field: (row: any) => row.firstname + ' ' + row.lastname,
    sortable: true,
  },
  {
    name: 'userName',
    align: 'center',
    label: 'Nombre de Usuario',
    field: 'userName',
    sortable: true,
  },
  {
    name: 'depOps',
    align: 'center',
    label: 'Dependencia - Oficina',
    field: (row: Usuario) => dependenciaOficina(row),
    style: 'white-space: pre-line; width: 300px;',
    sortable: true,
  },
  {
    name: "roles",
    align: 'center',
    label: 'Roles',
    field: (row: Usuario) => getRoles(row),
    style: 'white-space: pre-line; width: 300px;',
    sortable: true,
  },
  {
    name: 'enabled',
    align: 'center',
    label: 'Estado',
    field: 'enabled',
    sortable: true,
  },
  {
    name: 'acciones',
    align: 'center',
    label: 'Acciones',
    field: 'acciones',
    sortable: true,
  }
];

const dependenciaOficina = (row: Usuario) => {
  if (row.usuarioRelaciones.length) {
    return row.usuarioRelaciones.map((us) => (us.seccionSubSeccion?.nombre ?? '') + ' - ' + (us?.oficina?.nombre ?? 'Todas'))?.join('\n')
  }
  return 'No asignado'
}

const getRoles = (row: Usuario) => {
  return row.usuarioRelaciones.map((us) => us.rol.nombre).join('\n')
}

export interface ISearchData {
  nombre_fondo: '',
  codigo_fondo: '',
  estado: ''
}
