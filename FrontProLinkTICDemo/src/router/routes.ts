import { RouteRecordRaw } from "vue-router";
import mfFormsRoutes from "@mf-forms/router/routes";
import mfProcesoJuridicoRoutes from "@mf-procesoJuridico/router/routes";
console.log(mfProcesoJuridicoRoutes);

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("pages/Login.vue"),
  },

  {
    path: "/reset-password",
    component: () => import("pages/Reset-password.vue"),
  },
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/form",
    component: () => import("layouts/MainLayout.vue"),
    children: mfFormsRoutes,
  },
  {
    path: "/form-Ministerio",
    component: () => import("layouts/MainLayout.vue"),
    children: mfProcesoJuridicoRoutes,
  },
  {
    path: "/reporte-general",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "reporte-general",
        component: () => import("src/pages/ReporteGeneral/Reportes.vue"),
      },
    ],
  },
  {
    path: "/consulta-general",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "consulta-general",
        component: () =>
          import("src/pages/Consultageneral/Consultageneral.vue"),
      },
    ],
  },
  {
    path: "/notificaciones",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Notificaciones/Dashboard.vue"),
      },
      {
        path: "crear",
        component: () => import("pages/Notificaciones/crearNotificacion.vue"),
      },
      {
        path: "/notificaciones/:id",
        component: () => import("pages/Notificaciones/Detalle.vue"),
      },
    ],
  },

  // HU 01
  {
    path: "/SGDA/administracion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/SGDA/Administracion/TiposDocumentales.vue"),
      },
      {
        path: "crear",
        component: () =>
          import("src/pages/SGDA/Administracion/crear/DocumentalTypesForm.vue"),
      },
      {
        path: "editar",
        component: () =>
          import("src/pages/SGDA/Administracion/crear/DocumentalTypesForm.vue"),
      },
      {
        path: "visualizacion/:id",
        component: () =>
          import("src/pages/SGDA/Administracion/detalle/detalle.vue"),
      },
    ],
  },
  {
    path: "/SGDA/administracion/usuarios",
    component: () => import("layouts/MainLayout.vue"),
    meta: { requiresAuth: true, allowedRoles: ["administrador master"] },
    children: [
      {
        path: "",
        component: () => import("pages/Administracion/Usuarios/Usuarios.vue"),
      },
      {
        path: "crear",
        component: () =>
          import("src/pages/Administracion/Usuarios/crear/crear.vue"),
      },
      {
        path: "editar/:id",
        component: () =>
          import("src/pages/Administracion/Usuarios/editar/editar.vue"),
      },

      /* {
         path: "visualizacion/:id",
         component: () =>
           import("src/pages/SGDA/Administracion/Usuarios/detalle/detalle.vue"),
       }, */
    ],
  },

  {
    path: "/archivo",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "clasificacion-documental/gestionar-versiones",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/GestionVersionesTRD/GestionarVersiones.vue"
          ),
      },
      {
        path: "clasificacion-documental/gestionar-versiones/crear",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/GestionVersionesTRD/Crear/Crear.vue"
          ),
      },
      {
        path: "clasificacion-documental/gestionar-versiones/detalle/:id",
        component: () =>
          import("src/pages/Archivo/ClasificacionDocumental/Detalle.vue"),
      },
      {
        path: "clasificacion-documental/gestionar-versiones/crear-oficina-productoras",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/OficinasProductoras/CrearOfIcinaProductora.vue"
          ),
      },
      {
        path: "clasificacion-documental/gestionar-versiones/oficinas/:id",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/OficinasProductoras/CrearOfIcinaProductora.vue"
          ),
      },
      {
        path: "clasificacion-documental/gestionar-versiones/detalle-oficina/:code",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/OficinasProductoras/detalleOficinaProductora/detalleOficinaProductora.vue"
          ),
      },
      {
        path: "clasificacion-documental/gestionar-versiones/series-subseries/agregar/:from",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/SeriesSubseries/AgregarEditar/AgregarEditar.vue"
          ),
      },
      {
        path: "clasificacion-documental/gestionar-versiones/series-subseries/editar/:id",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/SeriesSubseries/AgregarEditar/AgregarEditar.vue"
          ),
      },
      {
        path: "expediente",
        component: () => import("src/pages/Archivo/Expediente/Expedient.vue"),
      },
      {
        path: "crear-expediente",
        component: () =>
          import(
            "src/pages/Archivo/Expediente/CrearExpediente/CrearExpediente.vue"
          ),
      },
      {
        path: "expediente/detalle",
        component: () => import("src/pages/Archivo/Expediente/Detalle.vue"),
      },
      // {
      //   path: "prestamos",
      //   component: () =>
      //     import(
      //       "src/pages/Archivo/Expediente/Prestamos/Prestamos.vue"
      //     ),
      // },
      // {
      //   path: "solicitar-prestamo",
      //   component: () =>
      //     import(
      //       "src/pages/Archivo/Expediente/SolicitarPrestamo/SolicitarPrestamo.vue"
      //     ),
      // },
      // {
      //   path: "crear-solicitar-prestamo",
      //   component: () =>
      //     import(
      //       "src/pages/Archivo/Expediente/SolicitarPrestamo/CrearPrestamo.vue"
      //     ),
      // },

      {
        path: "documento/:expediente/:documento",
        component: () =>
          import(
            "pages/Archivo/Expediente/DetalleDocumento/DetalleDocumento.vue"
          ),
      },
      {
        path: "clasificacion-documental/series-subseries",
        component: () =>
          import(
            "pages/Archivo/ClasificacionDocumental/SeriesSubseries/SeriesSubseries.vue"
          ),
      },
      {
        path: "/clasificacion-documental/tipo-documental/crear",
        component: () =>
          import(
            "pages/Archivo/ClasificacionDocumental/TipoDocumental/Crear/Crear.vue"
          ),
      },
      {
        path: "/clasificacion-documental/tipo-documental/editar/:id",
        component: () =>
          import(
            "pages/Archivo/ClasificacionDocumental/TipoDocumental/Crear/Crear.vue"
          ),
      },
      {
        path: "clasificacion-documental/TipoDocumentalParams",
        component: () =>
          import(
            "src/pages/Archivo/ClasificacionDocumental/SeriesSubseries/TipoDocumentalParams/TipoDocumentalParams.vue"
          ),
      },
    ],
  },
  // HU 02
  {
    path: "/SGDA/series",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/SGDA/ClasificacionDocumental/Series/Series.vue"),
      },
      {
        path: "crear",
        component: () =>
          import("pages/SGDA/ClasificacionDocumental/Series/crear/crear.vue"),
      },
      {
        path: "editar/:id",
        component: () =>
          import("pages/SGDA/ClasificacionDocumental/Series/editar/editar.vue"),
      },
    ],
  },
  // HU 03
  {
    path: "/SGDA/subseries",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/SGDA/ClasificacionDocumental/Subseries/Subseries.vue"),
      },
      {
        path: "crear",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Subseries/crear/SubseriesCrear.vue"
          ),
      },
      {
        path: "editar/:id",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Subseries/editar/SubseriesEditar.vue"
          ),
      },
    ],
  },
  // HU 04
  {
    path: "/SGDA/dependecias",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Dependencias/Dependencias.vue"
          ),
      },
      {
        path: "crear",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Dependencias/Crear/Crear.vue"
          ),
      },
      {
        path: "editar/:id",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Dependencias/Editar/Editar.vue"
          ),
      },
    ],
  },
  // HU 05
  {
    path: "/administracion/radicado",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/SGDA/ClasificacionDocumental/Radicado/Radicado.vue"),
      },
      {
        path: "crear",
        component: () =>
          import("pages/SGDA/ClasificacionDocumental/Radicado/crear/crear.vue"),
      },
      {
        path: "editar/:id",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Radicado/editar/editar.vue"
          ),
      },
    ],
  },
  // HU 06
  {
    path: "/SGDA/cuadros",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Cuadros/AdministracionCuadros.vue"
          ),
      },
    ],
  },
  // HU 07
  {
    path: "/SGDA/formulario-radicacion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/FormularioRadicacion/FormularioRadicacion.vue"
          ),
      },
    ],
  },
  // HU 08
  {
    path: "/SGDA/asignacion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Asignacion/Asignacion.vue"
          ),
      },
    ],
  },
  // HU 09
  {
    path: "/SGDA/exportar-trd",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/ExportarTRD/ExportarTRD.vue"
          ),
      },
    ],
  },

  // hu 10
  {
    path: "/SGDA/tabla-valoracion-documental",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/TablaValoracionDocumental/TablaValoracionDocumental.vue"
          ),
      },
      {
        path: "",
        component: () => import("pages/PQRD/exitoso.vue"),
      },
    ],
  },
  // hu 11
  {
    path: "/SGDA/administracion-versionamiento",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/AdministracionVersionamiento/administracionVersionamiento.vue"
          ),
      },
      {
        path: "crear",
        component: () =>
          import(
            "pages/SGDA/AdministracionVersionamiento/crear/crearAdministracionVersionamiento.vue"
          ),
      },
      {
        path: "editar/:id",
        component: () =>
          import(
            "pages/SGDA/AdministracionVersionamiento/editar/editarAdministracionVersionamiento.vue"
          ),
      },
    ],
  },
  {
    path: "/SGDA/digitalizacion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Digitalizacion/digitalizacion.vue"
          ),
      },
    ],
  },
  {
    path: "/SGDA/radicar-pqrd",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PQRD/Radicacion/radicacion.vue"),
      },
    ],
  },
  {
    path: "/pqrd",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "home",
        component: () => import("pages/PQRD/Home/Home.vue"),
      },
      {
        path: "reporte",
        component: () => import("pages/PQRD/Reporte/Reporte.vue"),
        children: [
          {
            path: "",
            name: "reporte-pqrd",
            component: () => import("pages/PQRD/Reporte/Reporte.vue"),
          },
        ],
      },
      {
        path: "radicar",
        component: () => import("pages/PQRD/Radicacion/radicacion.vue"),
      },
      {
        path: "verificacion",
        component: () => import("pages/PQRD/Verificacion/verificacion.vue"),
      },
      {
        path: "rechazo",
        component: () => import("pages/PQRD/Consolidar/Rechazo/rechazo.vue"),
      },
      {
        path: "asignacion",
        component: () => import("pages/PQRD/Asignacion/asignacion.vue"),
      },
      {
        path: "reasignacion",
        component: () => import("pages/PQRD/Reasignacion/reasignacion.vue"),
      },
      {
        path: "informacion/:id",
        component: () =>
          import("pages/PQRD/InformacionGeneral/informacion.vue"),
      },
      {
        path: "informacion/:id/:id2",
        component: () =>
          import("pages/PQRD/GestiónEscalamiento/InfoGestion.vue"),
      },
      {
        path: "inactivacion",
        component: () => import("pages/PQRD/Inactivacion/inactivacion.vue"),
      },
      {
        path: "consolidar",
        component: () => import("pages/PQRD/Consolidar/consolidar.vue"),
      },
      {
        path: "test",
        component: () =>
          import("pages/PQRD/GestiónEscalamiento/GestiónEscalamiento.vue"),
      },
      // {
      //   path: "escalar",
      //   component: () =>
      //     import("pages/PQRD/Escalar/Escalar.vue"),
      // },
      // {
      //   path: "escalador",
      //   component: () =>
      //     import(
      //       "pages/PQRD/Escalar/Escalador/Escalador.vue"
      //       ),
      // },
      {
        path: "consolidar-informacion/:id",
        component: () =>
          import(
            "pages/PQRD/Consolidar/InformacionGeneral/informacionGeneral.vue"
          ),
      },
      {
        path: "consolidar-documentos/:id",
        component: () =>
          import("pages/PQRD/Consolidar/DocumentosSoporte/gestionPQRD.vue"),
      },
      {
        path: "envio-respuesta",
        component: () => import("pages/PQRD/EnvioRespuesta/EnvioRespuesta.vue"),
      },
      {
        path: "reclasificacion",
        component: () =>
          import("pages/PQRD/Reclasificacion/Reclasificacion.vue"),
      },
      {
        path: "reclasificacion/:id",
        component: () =>
          import("pages/PQRD/Reclasificacion/ReclasificacionDetalle.vue"),
      },
      {
        path: "radicar-defensor",
        component: () => import("pages/PQRD/Radicacion/RadicacionDefensor.vue"),
      },
    ],
  },
  // HU 13
  // {
  //   path: "/SGDA/versionamiento-trd",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [
  //     {
  //       path: "",
  //       component: () =>
  //         import(
  //           "pages/SGDA/ClasificacionDocumental/VersionamientoTRD/VersionamientoTRD.vue"
  //         ),
  //     },
  //   ],
  // },
  // HU 14
  {
    path: "/SGDA/periocidad-tvd",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/SGDA/PeriocidadTvd/PeriocidadTvd.vue"),
      },
      {
        path: "crear",
        component: () =>
          import("pages/SGDA/PeriocidadTvd/crear/CrearPeriocidadTvd.vue"),
      },
      {
        path: "editar/:id",
        component: () =>
          import("pages/SGDA/PeriocidadTvd/editar/EditarPeriocidadTvd.vue"),
      },
    ],
  },
  // hu 15
  {
    path: "/SGDA/busqueda-radicados",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/BusquedaRadicados/BusquedaRadicados.vue"
          ),
      },
      {
        path: "editar/:id",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/BusquedaRadicados/DetalleRadicado.vue"
          ),
      },
    ],
  },
  // nuevo sitio de fondos

  {
    path: "/SGDA/fondos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Administracion/Fondos/Fondos.vue"),
      },
      {
        path: "crear",
        component: () => import("pages/Administracion/Fondos/crear/crear.vue"),
      },
      {
        path: "editar/:id",
        component: () =>
          import("pages/Administracion/Fondos/editar/editar.vue"),
      },
    ],
  },

  //EXPEDIENTES HU001 , HU002
  {
    path: "/expediente",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Expedientes/NuevoExpedientes.vue"),
      },
      {
        path: "crear",
        component: () =>
          import("pages/Expedientes/CrearExpedientes/crearExpediente.vue"),
      },
      {
        path: "detalle/:id",
        component: () => import("pages/Expedientes/Detalles.vue"),
      },
      {
        path: "detalle/:id/editar",
        component: () => import("pages/Expedientes/Detalle/Editar.vue"),
      },
      {
        path: "ciclo-expedientes",
        component: () =>
          import("pages/Expedientes/CicloExpedientes/cicloExpedientes.vue"),
      },
    ],
  },
  //Administracion hu001, hu002, hu003
  {
    path: "/administracion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "empresas",
        component: () => import("pages/Administracion/Empresa/Empresa.vue"),
      },
      {
        path: "empresas/crear",
        component: () => import("pages/Administracion/Empresa/Crear.vue"),
      },
      {
        path: "empresas/editar/:id",
        component: () => import("pages/Administracion/Empresa/Editar.vue"),
      },
      {
        path: "sucursales",
        component: () =>
          import("pages/Administracion/Sucursales/Sucursales.vue"),
      },
      {
        path: "sucursales/crear",
        component: () =>
          import("pages/Administracion/Sucursales/crear/crear.vue"),
      },
      {
        path: "sucursales/editar/:id",
        component: () =>
          import("pages/Administracion/Sucursales/editar/editar.vue"),
      },
      {
        path: "seguridad",
        component: () => import("pages/Administracion/Seguridad/Seguridad.vue"),
      },
      {
        path: "seguridad/crear",
        component: () =>
          import("pages/Administracion/Seguridad/crear/crear.vue"),
      },
      {
        path: "seguridad/editar/:id",
        component: () =>
          import("pages/Administracion/Seguridad/editar/editar.vue"),
      },
      {
        path: "secuencias",
        component: () =>
          import("pages/Administracion/Secuencias/Secuencias.vue"),
      },
      {
        path: "secuencias/crear",
        component: () =>
          import("pages/Administracion/Secuencias/crear/crear.vue"),
      },
      {
        path: "secuencias/editar/",
        component: () =>
          import("pages/Administracion/Secuencias/editar/editar.vue"),
      },
      {
        path: "secuencias/editar/:id",
        component: () =>
          import("pages/Administracion/Secuencias/editar/editar.vue"),
      },
      {
        path: "tiposEntidades",
        component: () =>
          import("pages/Administracion/tiposEntidades/index.vue"),
      },
      {
        path: "tiposEntidades/crear",
        component: () =>
          import("pages/Administracion/tiposEntidades/Crear.vue"),
      },
      {
        path: "tiposEntidades/editar/:id",
        component: () =>
          import("pages/Administracion/tiposEntidades/Editar.vue"),
      },
      {
        path: "ubicacion",
        component: () => import("pages/Administracion/Ubicacion/Ubicacion.vue"),
      },
      {
        path: "ubicacion/crear",
        component: () =>
          import("pages/Administracion/Ubicacion/crear/crear.vue"),
      },
      {
        path: "ubicacion/editar/:id",
        component: () =>
          import("pages/Administracion/Ubicacion/editar/editar.vue"),
      },
      {
        path: "ubicacion/visualizacion/:id",
        component: () =>
          import(
            "pages/Administracion/Ubicacion/visualizacion/visualizacion.vue"
          ),
      },
      {
        path: "entidades",
        component: () => import("pages/Administracion/Entidades/Entidades.vue"),
      },
      {
        path: "entidades/editar/:id",
        component: () =>
          import("pages/Administracion/Entidades/editar/editar.vue"),
      },
      {
        path: "entidades/crear",
        component: () =>
          import("pages/Administracion/Entidades/crear/crear.vue"),
      },
      {
        path: "cargue-plantillas",
        component: () =>
          import("pages/Administracion/CarguePlantillas/CarguePlantillas.vue"),
      },
      {
        path: "cargue-plantillas/visualizacion/:id",
        component: () =>
          import(
            "pages/Administracion/CarguePlantillas/visualizar/visualizar.vue"
          ),
      },
      {
        path: "barras",
        component: () =>
          import("pages/Administracion/CodigosBarras/barras.vue"),
      },
      {
        path: "barras/ver/:id",
        component: () =>
          import("pages/Administracion/CodigosBarras/ver/ver.vue"),
      },
      {
        path: "puntos-radicacion",
        component: () =>
          import("pages/Administracion/Puntos/PuntosRadicacion.vue"),
      },
      {
        path: "puntos-radicacion/crear",
        component: () => import("pages/Administracion/Puntos/CrearPunto.vue"),
      },
      {
        path: "puntos-radicacion/editar/:id",
        component: () => import("pages/Administracion/Puntos/EditarPunto.vue"),
      },
      {
        path: "prefijos",
        component: () => import("pages/Administracion/Prefijos/Dashboard.vue"),
      },
      {
        path: "prefijos/crear",
        component: () =>
          import("pages/Administracion/Prefijos/crearPrefijo.vue"),
      },
      {
        path: "prefijos/:id",
        component: () => import("pages/Administracion/Prefijos/Detalle.vue"),
      },
      {
        path: "admin-prefijos",
        component: () =>
          import("pages/Administracion/PrefijosOficinas/Dashboard.vue"),
      },
      {
        path: "admin-prefijos/crear",
        component: () =>
          import(
            "pages/Administracion/PrefijosOficinas/crearPrefijoOficina.vue"
          ),
      },
      {
        path: "admin-tipologia/crear",
        component: () =>
          import("pages/Administracion/Tipologia/crearTipologia.vue"),
      },
      {
        path: "admin-prefijos/:id",
        component: () =>
          import("pages/Administracion/PrefijosOficinas/Detalle.vue"),
      },
    ],
  },
  // Auditoria HU021
  {
    path: "/auditoria",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Auditoria/Auditoria.vue") },
    ],
  },

  // HU 23
  {
    path: "/politicas",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PQRD/Home/PoliticasSeguridad.vue"),
      },
    ],
  },

  // Expedientes HU06
  {
    path: "/inventarioFisico",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "ubicacion",
        component: () => import("pages/InventarioFisico/Ubicacion.vue"),
      },
      {
        path: "ubicacion/asignar",
        component: () =>
          import("pages/InventarioFisico/AsignacionUbicacion.vue"),
      },
      {
        path: "reubicacion",
        component: () => import("pages/InventarioFisico/Reubicacion.vue"),
      },
      {
        path: "ubicacion/reubicar",
        component: () => import("pages/InventarioFisico/Reubicar.vue"),
      },
    ],
  },
  {
    path: "/entes-de-control/radicar",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/EntesDeControl/Radicar.vue"),
      },
    ],
  },
  {
    path: "/entes-de-control/reportes",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/EntesDeControl/Reportes/Reportes.vue"),
      },
    ],
  },
  {
    path: "/entes-de-control/bandeja",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/EntesDeControl/Bandeja/EntesDeControl.vue"),
      },
      {
        path: "detalle/:id",
        component: () =>
          import("pages/EntesDeControl/Bandeja/Detalles/Detalle.vue"),
      },
    ],
  },
  {
    path: "/entes-control",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/Administracion/EntesControl/EntesControl.vue"),
      },
      {
        path: "crear",
        component: () =>
          import(
            "pages/Administracion/EntesControl/crear/RadicarEnteControl.vue"
          ),
      },
      {
        path: "asignacion",
        component: () =>
          import("pages/Administracion/EntesControl/asignacion/Asignacion.vue"),
      },
      {
        path: "aprobacion",
        component: () =>
          import(
            "pages/Administracion/EntesControl/asignacion/aprobacion/Aprobacion.vue"
          ),
      },
      {
        path: "envio-respuesta",
        component: () =>
          import(
            "pages/Administracion/EntesControl/asignacion/aprobacion/envio-respuesta/EnvioRespuesta.vue"
          ),
      },
      {
        path: "consolidacion",
        component: () =>
          import(
            "pages/Administracion/EntesControl/asignacion/consolidacion/Consolidacion.vue"
          ),
      },
      {
        path: "revision",
        component: () =>
          import(
            "pages/Administracion/EntesControl/asignacion/revision/Revision.vue"
          ),
      },
    ],
  },
  {
    path: "/bandeja",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/Bandeja/BandejaEntrada/NuevaBandeja.vue"),
        meta: { keepAlive: true },
      },
      {
        path: ":proceso",
        component: () =>
          import("pages/Bandeja/BandejaEntrada/NuevaBandeja.vue"),
      },
      {
        path: "carpeta/:tipo/:id",
        component: () =>
          import(
            "pages/Bandeja/BandejaEntrada/previsualizar/Previsualizar.vue"
          ),
      },
    ],
  },

  {
    path: "/consulta-radicados",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import(
            "pages/Archivo/Expediente/ConsultaRadicado/ConsultaRadicado.vue"
          ),
        name: "consulta-radicados",
      },
    ],
  },

  {
    path: "/administracion-tramite",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/Correspondencia/AdminTramite/AdminTramite.vue"),
      },
      {
        path: "anulacion-de-tramite",
        component: () =>
          import("pages/Correspondencia/AdminTramite/AnulacionDeTramite.vue"),
      },
      {
        path: "reemplazo-masivo",
        component: () =>
          import("pages/Correspondencia/AdminTramite/ReemplazoMasivo.vue"),
      },
      {
        path: "ver-datos-entes/:id",
        component: () =>
          import(
            "src/pages/Correspondencia/AdminTramite/verDatos/AdminVerDtos.vue"
          ),
      },
      {
        path: "ver-datos-pqrd/:id",
        component: () =>
          import(
            "src/pages/Correspondencia/AdminTramite/verDatos/AdminVerDtosPqrd.vue"
          ),
      },
      {
        path: "ver-datos-medicina-laboral/:id",
        component: () =>
          import(
            "src/pages/Correspondencia/AdminTramite/verDatos/AdminVerDtosMedicina.vue"
          ),
      },
      {
        path: "ver-datos-tutela/:id",
        component: () =>
          import(
            "src/pages/Correspondencia/AdminTramite/verDatos/AdminVerDtosTutelas.vue"
          ),
      },
      {
        path: "ver-datos-correspondencia/:id",
        component: () =>
          import(
            "src/pages/Correspondencia/AdminTramite/verDatos/AdminVerDtosCrMunica.vue"
          ),
      },
      {
        path: "ver-datos-facturacion-administrativa/:id",
        component: () =>
          import(
            "src/pages/Correspondencia/AdminTramite/verDatos/AdminVerDtosFacAdm.vue"
          ),
      },
      {
        path: "ver-datos-cuenta-cobro/:id",
        component: () =>
          import(
            "src/pages/Correspondencia/AdminTramite/verDatos/AdminVerDtosCuentaCobro.vue"
          ),
      },
    ],
  },
  {
    path: "/correspondencia",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "inicio-correspondencia",
        component: () => import("pages/Correspondencia/Correspondencia.vue"),
      },
      {
        path: "detalle/:id",
        component: () => import("pages/Correspondencia/Detalle.vue"),
      },
      {
        path: "detalle-plantilla/:id",
        component: () =>
          import(
            "pages/Correspondencia/ComunicacionMasiva/SubTramite/DetallePlantilla.vue"
          ),
      },
      {
        path: "crear",
        component: () =>
          import("pages/Correspondencia/Crear/CrearCorrespondencia.vue"),
      },
      {
        path: "form-settings",
        component: () =>
          import("pages/Correspondencia/FormSettings/FormConfiguration.vue"),
      },
      {
        path: "radicacion-entrada",
        component: () => import("pages/Correspondencia/RadicacionEntrada.vue"),
      },
      {
        path: "radicacion-manual",
        component: () => import("pages/Correspondencia/RadicacionManual.vue"),
      },
      {
        path: "bandeja-manual",
        name: "bandeja-manual",
        component: () =>
          import(
            "pages/Correspondencia/RadicacionManual/CorrespondenciaManual.vue"
          ),
      },
      {
        path: "seguimiento-mensajeria",
        component: () =>
          import("pages/EnviosSeguimientos/Seguimientos/Seguimientos.vue"),
      },
      {
        path: "crear-comunicaciones",
        component: () =>
          import(
            "pages/Correspondencia/Crear/CrearComunicaciones/CrearComunicaciones2.vue"
          ),
      },
      {
        path: "detalles-comunicaciones",
        component: () =>
          import(
            "src/pages/Correspondencia/Crear/CrearComunicaciones/DetallesComunicaciones.vue"
          ),
      },
      {
        path: "crear-comunicaciones-masiva",
        component: () =>
          import("pages/Correspondencia/ComunicacionMasiva/CrearMasiva.vue"),
      },
      {
        path: "crear-comunicaciones-masiva/subtramite/:id",
        component: () =>
          import(
            "pages/Correspondencia/ComunicacionMasiva/SubTramite/subTramite.vue"
          ),
      },
      {
        path: "crear-comunicaciones-masiva/editar/:id",
        component: () =>
          import("pages/Correspondencia/ComunicacionMasiva/Editar.vue"),
      },
      {
        path: "devoluciones",
        component: () =>
          import("pages/EnviosSeguimientos/Correos/SeguimientosCorreo.vue"),
      },
      {
        path: "devoluciones/:id",
        component: () =>
          import("pages/EnviosSeguimientos/Correos/Detalle/DetalleCaso.vue"),
      },
      // {
      //   path: "puntos-radicacion",
      //   component: () =>
      //   import("pages/Administracion/Puntos/PuntosRadicacion.vue"),
      // },
      // {
      //   path: "puntos-radicacion/crear",
      //   component: () =>
      //   import("pages/Administracion/Puntos/CrearPunto.vue"),
      // },
      // {
      //   path: "puntos-radicacion/editar/:id",
      //   component: () =>
      //   import("pages/Administracion/Puntos/EditarPunto.vue"),
      // },
    ],
  },

  {
    path: "/mesa-back",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Correspondencia/MesaBack/MesaBack.vue"),
      },
    ],
  },
  {
    path: "/usuario/reportes",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Correspondencia/Reportes.vue"),
      },
    ],
  },

  //HU003 documentos - DESCARGAR PLANTILLAS -- HU004
  {
    path: "/documentos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Documentos/Plantillas.vue") },
      {
        path: "plantillas",
        component: () => import("pages/Documentos/Nuevo/Plantillas.vue"),
      },
      {
        path: "series",
        component: () => import("pages/Series/Series.vue"),
      },
      {
        path: "plantillas/editar",
        component: () => import("pages/Documentos/Nuevo/Nuevo.vue"),
      },

      {
        path: "temporales",
        component: () =>
          import("pages/Documentos/DocumentosTemporales/DocumentosTemp.vue"),
      },
      {
        path: "temporales/editar/:id",
        component: () =>
          import("pages/Documentos/DocumentosTemporales/editar/editar.vue"),
      },
    ],
  },
  {
    path: "/tutelas",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "consultas",
        component: () =>
          import("src/pages/SGDA/ClasificacionDocumental/Tutelas/Index.vue"),
      },
      {
        path: "bandeja",
        component: () =>
          import("src/pages/SGDA/ClasificacionDocumental/Tutelas/Tutelas.vue"),
      },
      {
        path: "reportes",
        component: () =>
          import("src/pages/SGDA/ClasificacionDocumental/Tutelas/Reportes.vue"),
      },
      {
        path: "detalle/:id",
        component: () =>
          import(
            "src/pages/SGDA/ClasificacionDocumental/Tutelas/DetalleConsulta.vue"
          ),
      },
      {
        path: "bandeja/detalle/:id",
        component: () =>
          import("src/pages/SGDA/ClasificacionDocumental/Tutelas/Detalle.vue"),
      },
      {
        path: "excluir/:id",
        component: () =>
          import(
            "src/pages/SGDA/ClasificacionDocumental/Tutelas/Excluir/Excluir.vue"
          ),
      },
      {
        path: "radicar",
        component: () =>
          import(
            "pages/SGDA/ClasificacionDocumental/Tutelas/radicar/TutelasRadicar.vue"
          ),
      },
      // {
      //   path: "juzgados",
      //   component: () => import("pages/SGDA/ClasificacionDocumental/Tutelas/Juzgados/Juzgados.vue"),
      // },
      // {
      //   path: "juzgados/crear",
      //   component: () => import("pages/SGDA/ClasificacionDocumental/Tutelas/Juzgados/CrearJuzgado.vue"),
      // }
    ],
  },
  {
    path: "/medicina",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "bandeja",
        component: () =>
          import("pages/MedicinaLaboral/Bandeja/BandejaEntrada.vue"),
      },
      {
        path: "reporte",
        component: () => import("pages/MedicinaLaboral/Reporte/Reporte.vue"),
      },
      {
        path: "casos/detalle/:id/:idFlujo?",
        name: "detalleCaso",
        component: () => import("pages/MedicinaLaboral/Casos/DetalleCaso.vue"),
      },
      {
        path: "radicacion-ml",
        component: () =>
          import("pages/MedicinaLaboral/Radicacion/RadicacionML.vue"),
      },
      {
        path: "reclasificacion",
        component: () =>
          import("pages/MedicinaLaboral/Reclasificacion/Reclasificacion.vue"),
      },
      {
        path: "bandeja-comunicaciones",
        component: () =>
          import(
            "pages/MedicinaLaboral/comunicaciones/BandejaComunicaciones.vue"
          ),
      },
      {
        path: "comunicaciones",
        component: () =>
          import("pages/MedicinaLaboral/comunicaciones/Comunicaciones.vue"),
      },
      {
        path: "comunicaciones/:id",
        component: () =>
          import(
            "pages/MedicinaLaboral/comunicaciones/Edit/EditComunicaciones.vue"
          ),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/facturacion",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "radicados",
        component: () =>
          import("pages/Facturacion/administrativa/FacturaAdministrativa.vue"),
      },
      {
        path: "cuentas-cobro/radicar",
        component: () => import("pages/Facturacion/cobro/RadicarCuenta.vue"),
      },
      {
        path: "radicar",
        component: () => import("pages/Facturacion/RadicarFactura.vue"),
      },
      {
        path: "cuentas-cobro/radicadas",
        name: "Cuentas cobro radicadas",
        component: () => import("pages/Facturacion/cobro/CuentasCobro.vue"),
      },
      {
        path: "cuentas-cobro/radicadas/detalle/:id",
        component: () => import("pages/Facturacion/cobro/Asignacion.vue"),
      },
      {
        path: "cuentas-cobro/asignadas",
        component: () =>
          import("pages/Facturacion/cobro/CuentasCobroAsignadas.vue"),
      },
      {
        path: "cuentas-cobro/asignadas/detalle/:id",
        component: () =>
          import("pages/Facturacion/cobro/DetalleCuentaCobro.vue"),
      },

      {
        path: "cuentas-cobro/aprobacion-rechazo/:id",
        component: () => import("pages/Facturacion/cobro/AprobarRechazo.vue"),
      },
      {
        path: "reportes",
        component: () => import("pages/Facturacion/reportes/Reportes.vue"),
      },
      {
        path: "radicados/aprobacion/:id",
        component: () =>
          import("pages/Facturacion/administrativa/aprobacion/Aprobacion.vue"),
      },
      {
        path: "radicados/gestion/:id",
        component: () =>
          import("pages/Facturacion/administrativa/aprobacion/Aprobacion.vue"),
      },
      {
        path: "radicados/asignacion/:id",
        component: () =>
          import("pages/Facturacion/administrativa/aprobacion/Aprobacion.vue"),
      },
      {
        path: "factura-administrativa",
        name: "Factura administrativa",
        component: () =>
          import("pages/Facturacion/administrativa/FacturaAdministrativa.vue"),
      },
      {
        path: "factura-administrativa/radicados",
        component: () =>
          import("pages/Facturacion/administrativa/radicados/Radicado.vue"),
      },
      {
        path: "factura-administrativa/aprobacion/:id",
        component: () =>
          import("pages/Facturacion/administrativa/aprobacion/Aprobacion.vue"),
      },
      {
        path: "nc-nd",
        component: () =>
          import("pages/Facturacion/Notas/NotasCreditoDebito.vue"),
      },
      {
        path: "facturas-manual",
        component: () => import("pages/Facturacion/Manual/FacturasManual.vue"),
      },
      {
        path: "facturas-manual/detalles/:id/:tab",
        component: () =>
          import("pages/Facturacion/Manual/DetallesFacturaManual.vue"),
      },
      {
        path: "facturas-manual/reportes",
        component: () =>
          import("pages/Facturacion/Manual/ReportesFacturasManual.vue"),
      },
      {
        path: "manual",
        component: () => import("pages/Facturacion/Manual/Manual.vue"),
      },
      {
        path: "manual/crear",
        component: () => import("pages/Facturacion/Manual/CrearManual.vue"),
      },
      {
        path: "manual-proveedores",
        component: () =>
          import("pages/Facturacion/Proveedores/ManualProveedores.vue"),
      },
      {
        path: "manual-proveedores/crear",
        component: () =>
          import("pages/Facturacion/Proveedores/CrearManualProveedores.vue"),
      },
    ],
  },
  // HU 44
  {
    path: "/juzgados",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Juzgados/Juzgados.vue") },
      {
        path: "crear",
        component: () => import("pages/Juzgados/CrearJuzgado.vue"),
      },
      {
        path: "editar/:id",
        component: () => import("pages/Juzgados/EditarJuzgado.vue"),
      },
    ],
  },
  {
    path: "/juntas-eps-arl",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Juntas-eps-arl/Grilla.vue") },
      {
        path: "crear",
        component: () => import("pages/Juntas-eps-arl/Crear.vue"),
      },
      {
        path: "editar/:id",
        component: () => import("pages/Juntas-eps-arl/Editar.vue"),
      },
    ],
  },
  {
    path: "/public/pqrd",
    //component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/PQRD/Home/Home.vue"),
      },
      {
        path: "radicar-pqrd",
        component: () => import("pages/PQRD/Radicacion/radicacionWeb.vue"),
      },
      {
        path: "politicas",
        component: () => import("pages/PQRD/Home/PoliticasSeguridad.vue"),
      },
      {
        path: "consulta",
        component: () =>
          import("pages/PQRD/Home/ConsultarEstado/ConsultarEstado.vue"),
      },
    ],
  },
  {
    path: "/public/medicina-laboral",
    //component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "radicar",
        component: () =>
          import("pages/MedicinaLaboral/RadicacionWeb/RadicacionML.vue"),
      },
    ],
  },
  {
    path: "/public/historico",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/SGDA/Administracion/Index.vue"),
        name: "consulta-historico",
      },
    ],
  },
  {
    path: "/public/centroDeNotificaciones",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("src/pages/CentroDeNotificaciones/CentroDeNotificaciones.vue"),
      },
    ],
  },
  {
    path: "/metabase",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Metabase/Metabase.vue"),
      },
    ],
  },
  {
    path: "/metadata",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "crear",
        component: () => import("pages/metadatos/crear/Crear.vue"),
      },

      {
        path: "editar/:id",
        component: () => import("pages/metadatos/editar/Editar.vue"),
      },
      {
        path: "configuracion",
        component: () => import("pages/metadatos/configuracion/index.vue"),
      },
      {
        path: "configuracion/crear",
        component: () => import("pages/metadatos/configuracion/Crear.vue"),
      },
    ],
  },
  {
    path: "/envios-seguimientos",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "bandeja",
        component: () => import("pages/EnviosSeguimientos/Bandeja/Bandeja.vue"),
      },
      {
        path: "devoluciones",
        component: () =>
          import("pages/EnviosSeguimientos/Devoluciones/Devoluciones.vue"),
      },
      {
        path: "seguimientos",
        component: () =>
          import("pages/EnviosSeguimientos/Seguimientos/Seguimientos.vue"),
      },
      {
        path: "correos",
        component: () =>
          import("pages/EnviosSeguimientos/Correos/SeguimientosCorreo.vue"),
      },
      {
        path: "correos/detalle/:id",
        component: () =>
          import("pages/EnviosSeguimientos/Correos/Detalle/DetalleCaso.vue"),
      },
    ],
  },

  // HU 141
  {
    path: "/firmas",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Administracion/Firmas/Firmas.vue"),
      },
    ],
  },
  {
    path: "/demon",
    component: () => import("components/Editor/Collaboration.vue"),
  },
];

export default routes;
