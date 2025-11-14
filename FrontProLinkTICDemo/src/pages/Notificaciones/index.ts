export const ASIGNACION_HEADER = [
    {
      name: 'modulo',
      label: 'Módulo',
      field: 'modulo',
      sortable: true,
      align: 'center'
    },
    {
      name: 'perfil',
      label: 'Perfil',
      field: 'rol',
      sortable: true,
      align: 'center'
    },
    {
      name: 'asunto',
      label: 'Asunto',
      field: 'asunto',
      sortable: true,
      align: 'center'
    },
    {
      name: 'tipologia',
      label: 'Tipología PQRD',
      field: 'tipologia',
      sortable: true,
      align: 'center'
    },
    {
      name: 'tipoNoti',
      label: 'Tipo de notificación',
      field: 'tipoNotificacion',
      sortable: true,
      align: 'center'
    },
    {
      name: 'diasProceso',
      label: 'Días de notificación',
      field: 'diasProceso',
      sortable: true,
      align: 'center'
    },
    {
      name: 'diaInicial',
      label: 'Días inicial de notificación',
      field: 'diaInicial',
      sortable: true,
      align: 'center',
      format: (val) => (val === null ? '-' : val)
    },
    {
      name: 'diaMaximo',
      label: 'Días maximo de notificación',
      field: 'diaMaximo',
      sortable: true,
      align: 'center',
      format: (val) => (val === null ? '-' : val)
    },
    {
      name: 'estado',
      label: 'Estado',
      field: 'estado',
      sortable: true,
      align: 'center'
    },
    {
      name: 'acciones',
      label: 'Acciones',
      field: 'acciones',
      sortable: true,
      align: 'center'
    }
  ];
