<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="tw-header tw-top-0 tw-flex tw-flex-grow">
      <div
        class="tw-flex tw-items-center tw-justify-between tw-w-full tw-bg-white tw-px-8 tw-h-[70px] tw-shadow-md tw-z-10 tw-"
      >
        <div class="tw-flex tw-flex-row tw-justify-start tw-w-1/3"></div>

        <div class="tw-flex tw-flex-row tw-justify-center tw-items-center">
          <!-- :role="userInfo?.role" -->
          <HeaderAvatar
            :image="<string>mask"
            :name="userInfo?.name ?? ''"
            @open-change-password="handleOpenPasswordModal"
          />
        </div>
      </div>
    </q-header>

    <!--ESTO PERMITE QUE EL MAIN ESTÉ DEBAJO DEL HEADER-->
    <div class="tw-flex tw-flex-col tw- tw-w-full">
      <q-drawer
        :mini="leftDrawerOpen"
        show-if-above
        bordered
        v-if="userInfo.role !== ''"
      >
        <q-scroll-area class="fit">
          <section
            class="tw-flex tw-flex-row tw-pt-5 tw-px-2 tw-gap-5 tw-mb-7 tw-pr-4 tw-justify-between tw-items-center"
          >
            <a href="/home" class="" :class="leftDrawerOpen ? 'tw-hidden' : ''">
              <img v-lazy :data-url="logo" alt="logo-Positiva" />
            </a>
            <a href="/home" class="" :class="leftDrawerOpen ? 'tw-hidden' : ''">
              <img v-lazy :data-url="logoDocu" alt="logo-docum" />
            </a>
          </section>
          <q-list
            class="text-grey-6 tw-mb-14"
            v-if="findRoles('Administrador Master')"
          >
            <q-item clickable v-ripple to="/home">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-house" color="grey-6" size="1.5rem" />
              </q-item-section>

              <q-item-section> Home</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/notificaciones">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-bell" color="grey-6" size="1.5rem" />
              </q-item-section>

              <q-item-section>Notificaciones</q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/form">
              <q-item-section avatar>
                <q-icon
                  name="fa-solid fa-file-lines"
                  color="grey-6"
                  size="1.5rem"
                />
              </q-item-section>

              <q-item-section>ruta micro</q-item-section>
            </q-item>
            <q-item
              clickable
              tag="a"
              to="/form-Ministerio/Ministry-Labor/applications"
              class="tw-p-2 tw-px-4 tw-text-gray-400"
            >
              <q-item-section avatar>
                <q-icon name="fa-solid fa-briefcase" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Bandeja de entrada</q-item-label>
              </q-item-section>
            </q-item>

            <q-expansion-item
              icon="fa-solid fa-gavel"
              label="Procesos Jurídicos"
              v-if="findRoles('Administrador Master')"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                to="/form-Ministerio"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Radicar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                tag="a"
                to="/form-Ministerio/gestionar"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Gestionar</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                tag="a"
                to="/form-Ministerio/file/355"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Detalle</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <q-item clickable v-ripple to="/administracion-tramite">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-gear" color="grey-6" size="1.5rem" />
              </q-item-section>

              <q-item-section> Administración de Radicados </q-item-section>
            </q-item>

            <q-expansion-item
              icon="fa-solid fa-database"
              label=" Configurar reglas de metadatos"
              v-if="findRoles('Administrador Master')"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="item.href"
                v-for="item in linkConfigMetadata"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
                </q-item-section>
              </q-item>
            </q-expansion-item>

            <q-expansion-item
              icon="fa-solid fa-gear"
              label=" Administración"
              v-if="
                findRoles('Usuario Gestor') || findRoles('Administrador Master')
              "
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="item.href"
                v-for="item in linksAdm"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-file"
              label="Clasificación Documental"
              v-if="
                findRoles('Usuario Gestor') || findRoles('Administrador Master')
              "
            >
              <q-item
                clickable
                tag="a"
                :to="item.href"
                v-for="item in links"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-inbox"
              label="Envíos y seguimientos"
              v-if="
                findRoles('Usuario Gestor') || findRoles('Administrador Master')
              "
            >
              <q-item
                clickable
                tag="a"
                :to="'' + item.href"
                v-for="item in linksEnviosSeguimientos"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <!-- <q-item-label caption>{{ caption }}</q-item-label> -->
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-circle-question"
              label="PQRD"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="'/' + item.href"
                v-for="item in linksPQRD"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-circle-question"
              label="Consulta"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="'/' + item.href"
                v-for="item in linksConsulta"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="monetization_on"
              label="Facturación"
              class="text-grey-6"
            >
              <template v-for="item in linksFacturacion">
                <q-expansion-item
                  v-if="item?.children"
                  :label="item.label"
                  class="text-grey-6"
                  header-class="tw-pl-6 tw-py-2"
                >
                  <q-item
                    clickable
                    tag="a"
                    :to="'/facturacion' + children.href"
                    v-for="children in item.children"
                    class="tw-p-2 tw-pl-8 tw-px-6 tw-text-gray-400"
                  >
                    <q-item-section>
                      <q-item-label>{{ children.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-expansion-item>

                <q-item
                  v-if="!Array.isArray(item.children)"
                  clickable
                  tag="a"
                  :to="'/facturacion' + item.href"
                  class="tw-p-2 tw-px-6 tw-text-gray-400"
                >
                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-heart-pulse"
              label="Medicina Laboral"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="'/medicina' + item.href"
                v-for="item in linksMedicina"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-note-sticky"
              label="Tutelas"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="'/tutelas' + item.href"
                v-for="item in linksTutelas"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="add_circle"
              label="Entes de Control"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="'/' + item.href"
                v-for="item in linksEntes"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-sheet-plastic"
              label="Expedientes"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="'/' + item.href"
                v-for="item in linksExpedientes"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-message"
              label="Correspondencia"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :to="item.href"
                v-for="item in linkCorrespondencia"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-item
              clickable
              tag="a"
              to="/bandeja"
              class="tw-p-2 tw-px-4 tw-text-gray-400"
            >
              <q-item-section avatar>
                <q-icon name="fa-solid fa-briefcase" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Mi Bandeja de Tareas</q-item-label>
              </q-item-section>
            </q-item>
            <q-expansion-item icon="gavel" label="Juzgados" class="text-grey-6">
              <q-item
                clickable
                tag="a"
                :to="item.href"
                v-for="item in linksJuzgados"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="fa-solid fa-chart-line"
              label="Reportes"
              class="text-grey-6"
            >
              <q-item
                clickable
                tag="a"
                :href="item.href"
                :target="item.target || '_self'"
                v-for="item in linksReportes"
                :key="item.href"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-list>
          <q-list class="text-grey-6 tw-mb-14" v-else>
            <q-item clickable v-ripple to="/home">
              <q-item-section avatar>
                <q-icon name="fa-solid fa-house" color="grey-6" size="1.5rem" />
              </q-item-section>

              <q-item-section> Home</q-item-section>
            </q-item>

            <q-item
              clickable
              v-if="
                !findRoles('Radicador - Web') &&
                !findRoles('Radicador - Contact Center') &&
                !findRoles('Radicador - Mail') &&
                !findRoles('Consulta') &&
                !findRoles('Asignador Oficina')
              "
              v-ripple
              to="/bandeja"
            >
              <q-item-section avatar>
                <q-icon
                  name="fa-solid fa-briefcase"
                  color="grey-6"
                  size="1.7rem"
                />
              </q-item-section>

              <q-item-section> Bandeja de Entrada </q-item-section>
            </q-item>

            <q-item
              clickable
              v-if="
                findRoles('Asignador Responsable') ||
                findRoles('Administrador de Trámite')
              "
              v-ripple
              to="/administracion-tramite"
            >
              <q-item-section avatar>
                <q-icon name="settings" color="grey-6" size="2rem" />
              </q-item-section>
              <q-item-section> Administración de Radicados </q-item-section>
            </q-item>

            <q-item
              clickable
              v-if="
                findRoles('Administrador de Trámite') ||
                findRoles('Gestionador') ||
                findRoles('Defensor del Consumidor') ||
                findRoles('Administrador Master') ||
                findRoles('Consulta')
              "
              v-ripple
              to="/public/centroDeNotificaciones"
            >
              <q-item-section avatar>
                <q-icon name="email" color="grey-6" size="2rem" />
              </q-item-section>
              <q-item-section> Inbox </q-item-section>
            </q-item>

            <q-expansion-item
              v-for="(moduleLinks, moduleName) in getRoleOptions()"
              :icon="getSeccionIcon(moduleName)"
              :key="moduleName"
              :label="moduleName"
              class="text-grey-6"
              :default-opened="false"
            >
              <q-item
                v-for="link in moduleLinks"
                :key="link.href"
                clickable
                tag="a"
                :to="link.href"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>{{ link.label }}</q-item-label>
                </q-item-section>
              </q-item>
              <!-- <q-item
                clickable
                tag="a"
                :to="'/juntas-eps-arl'"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
                v-if="findRoles('Administrador de Trámite')"
              >
                <q-item-section>
                  <q-item-label>Juntas Eps y Arl</q-item-label>
                </q-item-section>
              </q-item> -->
            </q-expansion-item>

            <q-expansion-item
              v-if="!findRoles('Consulta')"
              icon="fa-solid fa-chart-line"
              label="Reportes"
              class="text-grey-6"
              :default-opened="false"
            >
              <q-item
                clickable
                tag="a"
                :to="{ name: 'reporte-general' }"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Reporte general</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                tag="a"
                :to="{ name: 'reporte-pqrd' }"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Reporte PQRD</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
            <q-expansion-item
              icon="query_stats"
              label="Consulta"
              class="text-grey-6"
              :default-opened="false"
              v-if="!findRoles('Consulta')"
            >
              <q-item
                clickable
                tag="a"
                :to="{ name: 'consulta-general' }"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Consulta general</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                tag="a"
                :to="{ name: 'consulta-historico' }"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Consulta Historica</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                tag="a"
                :to="{ name: 'consulta-radicados' }"
                class="tw-p-2 tw-px-6 tw-text-gray-400"
              >
                <q-item-section>
                  <q-item-label>Consulta Radicados</q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-list>
        </q-scroll-area>
        <q-item
          class="tw-w-full tw-flex-col tw-justify-end tw-absolute tw-bottom-1 tw-bg-white"
        >
          <span>
            version: 1.1.2
            <!-- version: {{ version.version }} -->
          </span>
        </q-item>
      </q-drawer>
    </div>

    <q-page-container style="min-height: 100vh" class="tw-bg-background">
      <div class="tw-p-[40px]">
        <router-view />
      </div>
    </q-page-container>

    <!-- <SearchModal
      title="Seleccionar rol"
      :body="`Hola, ${userInfo.name}. Por favor selecciona un rol.`"
      label="Seleccione"
      v-model:model-value="showRoleModal"
      v-model:selected-value="roleSelected"
      :select-options="roles"
      @handle-accept="handleSubmit"
      @close-modal="showRoleModal = false"
      @cancel="showRoleModal = false"
    /> -->
    <Loading v-if="loadingStore.isLoading"></Loading>

    <PasswordChangeModal
      v-model="showPasswordModal"
      :loading="isChangingPassword"
      @submit="handlePasswordChange"
      :show-cancel-button="true"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { Ref, nextTick, onMounted, ref } from "vue";
import mask from "src/assets/mask.svg";
import logo from "assets/logo-positiva.svg";
import logoDocu from "assets/docu_logo.svg";
import { useAuthStore } from "src/stores/auth.store";
import HeaderAvatar from "components/HeaderAvatar.vue";
// import SearchModal from "src/components/Modal/SearchModal.vue";
import { SelectInput } from "src/interfaces";
import Loading from "src/shared/components/Loading/Loading.vue";
import { useLoadingStore } from "src/stores/LoadingStore";
import PasswordChangeModal from "src/components/Modal/PasswordChangeModal.vue";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";
const loadingStore = useLoadingStore();

const showPasswordModal = ref(false);
const isChangingPassword = ref(false);

let isRadicador = ref(false);
type RoleType = "Radicador - Web";
const RADICADOR: RoleType = "Radicador - Web";

const handleOpenPasswordModal = () => {
  showPasswordModal.value = true; // Simplemente ponemos la variable en 'true'
};

const handlePasswordChange = async (payload: {
  oldPassword: string;
  newPassword: string;
}) => {
  if (!userInfo.value?.username) {
    toast.error(
      "No se pudo obtener el nombre de usuario. Por favor, inicie sesión de nuevo."
    );
    return;
  }

  try {
    isChangingPassword.value = true;
    const requestData = {
      username: userInfo.value.username,
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
    };

    await sgdeaAxios.post("/usuarios/changePassword", requestData);

    toast.success("Contraseña actualizada exitosamente");
    showPasswordModal.value = false;
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    const errorMessage =
      error.response?.data?.message ||
      "Error al cambiar la contraseña. Verifica tus datos e intenta nuevamente.";
    toast.error(errorMessage);
  } finally {
    isChangingPassword.value = false;
  }
};

const linksExpedientes = ref([
  {
    href: "archivo/expediente",
    label: "Expedientes",
  },
  {
    href: "expediente/ciclo-expedientes",
    label: "Ciclo de Expedientes",
  },
  // {
  //   href: "archivo/solicitar-prestamo",
  //   label: "Solicitar Préstamo",
  // },
]);

const linksReportes = ref([
  {
    href: "/facturacion/reportes",
    label: "Reporte de Facturas Administrativas",
  },
  {
    href: "/facturacion/facturas-manual/reportes",
    label: "Reporte de Facturas Emisión Manual",
  },
  {
    href: "/tutelas/reportes",
    label: "Reporte de Tutelas",
  },
  {
    href: "/usuario/reportes",
    label: "Usuarios",
  },
  // {
  //   href: "https://lookerstudio.google.com/embed/u/0/reporting/ea8bbde1-baaf-4bd4-9dc2-b5d212f6dd3d/page/1M",
  //   label: "Analisis Estadistico",
  //   target: "_blank", // Abrir en una nueva pestaña
  // },
]);

const linksEnviosSeguimientos = ref([
  {
    href: "/envios-seguimientos/bandeja",
    label: "Bandeja de Envíos - Por enviar",
  },
  {
    href: "/envios-seguimientos/seguimientos",
    label: "Seguimiento envíos - Mensajería y Courier",
  },
  {
    href: "/envios-seguimientos/correos",
    label:
      "Devolución envíos - Correo electrónico y Correo electrónico certificado",
  },
]);

// asignador: bandeja de entrada en radicado
// aprobador: bandeja de entrada en por aprobar
// gestor: bandeja de entrada en asignado y gestion

const links = ref([
  {
    // href: "/administracion-versionamiento",
    href: "/archivo/clasificacion-documental/gestionar-versiones/",
    label: "Administración Versionamiento",
  },
]);

const linksAdm = ref([
  {
    href: "/administracion/empresas",
    label: "Empresas",
  },
  {
    href: "/correspondencia/form-settings",
    label: "Configuración de Formularios",
  },
  {
    href: "/SGDA/administracion/usuarios",
    label: "Usuarios",
  },
  {
    href: "/SGDA/fondos",
    label: "Fondos",
  },
  {
    href: "/administracion/secuencias",
    label: "Secuencias",
  },
  {
    href: "/administracion/puntos-radicacion",
    label: "Puntos de Radicación",
  },
  {
    href: "/administracion/prefijos",
    label: "Búsqueda de Prefijos",
  },
  {
    href: "/administracion/admin-prefijos",
    label: "Administración  y asociación de prefijos",
  },
  {
    href: "/administracion/admin-tipologia/crear",
    label: "Crear Tipología",
  },
  {
    href: "/metadata/crear",
    label: "Crear Metadatos",
  },
]);

const linksPQRD = ref([
  // {
  //   href: "pqrd/home",
  //   label: "Inicio",
  // },
  {
    href: "pqrd/reporte",
    label: "Reportes",
  },
  {
    href: "pqrd/verificacion",
    label: "Bandeja de Entrada",
  },
  {
    href: "SGDA/radicar-pqrd",
    label: "Radicación",
  },
  {
    href: "pqrd/envio-respuesta",
    label: "Envío Respuesta",
  },
  {
    href: "pqrd/consolidar",
    label: "Consolidar",
  },
  {
    href: "pqrd/reclasificacion",
    label: "Solicitudes de Reclasificación",
  },
]);

const linksConsulta = ref([
  {
    href: "consulta-general",
    label: "Consulta General",
  },
  {
    href: "public/historico",
    label: "Consulta Historica",
  },
  {
    href: "consulta-radicados",
    label: "Consulta Radicados",
  },
]);

const linksJuzgados = ref([
  {
    href: "/juzgados",
    label: "Juzgados",
  },
  {
    href: "juntas-eps-arl",
    label: "Juntas Eps y Arl",
  },
]);

const linksMedicina = ref([
  {
    href: "/bandeja",
    label: "Bandeja de entrada",
  },
  {
    href: "/radicacion-ml",
    label: "Radicar",
  },
  {
    href: "/comunicaciones",
    label: "Crear comunicaciones ML",
  },
]);

const linksTutelas = ref([
  {
    href: "/bandeja",
    label: "Bandeja de Entrada",
  },
  {
    href: "/radicar",
    label: "Radicar",
  },
  {
    href: "/consultas",
    label: "Consulta de Tutelas",
  },
  {
    href: "/reportes",
    label: "Reporte de Tutelas",
  },
]);

const linksFacturacion = ref([
  {
    href: "/radicados",
    label: "Formulario FA",
    children: [
      {
        href: "/radicados",
        label: "Bandeja de Entrada",
      },
      {
        href: "/radicar",
        label: "Radicar",
      },
      {
        href: "/factura-administrativa",
        label: "Consultas",
      },
      {
        href: "/reportes",
        label: "Reportes",
      },
    ],
  },
  {
    href: "",
    label: "Formulario DCS",
    children: [
      {
        href: "/cuentas-cobro/radicadas",
        label: "Bandeja de Entrada",
      },

      {
        href: "/cuentas-cobro/radicar",
        label: "Radicar",
      },
    ],
  },
  {
    href: "/facturas-manual",
    label: "Factura Emisión Manual",
  },
  {
    href: "/nc-nd",
    label: "Nota Crédito y Débito",
  },
  {
    href: "/manual",
    label: "Crear Adquiriente",
  },
  {
    href: "/manual-proveedores",
    label: "Crear Proveedor",
  },
]);

const linksEntes = ref([
  {
    href: "entes-de-control/radicar",
    label: "Radicar Entes de Control",
  },
  {
    href: "entes-de-control/bandeja",
    label: "Bandeja de Entrada de Entes de Control",
  },
  {
    href: "entes-de-control/reportes",
    label: "Reportes",
  },
  // {
  //   href: "entes-control/caso",
  //   label: "Visualizar Caso",
  // },

  /* {
    href: "/radicar",
    label: "Radicar factura",
  }, */
  /* {
    href: "/formulario",
    label: "Radicar cuenta de cobro",
  }, */
  /* {
    href: "/cuentas-cobro",
    label: "Cuenta de cobro",
  }, */
  // {
  //   href: "/cuentas-cobro",
  //   label: "Facturación",
  // },
]);

const linksDefensor = ref([
  {
    href: "/pqrd/verificacion",
    label: "Bandeja de Entrada",
  },
  {
    href: "/pqrd/radicar-defensor",
    label: "Radicar PQRD Defensor Consumidor",
  },
]);

const linksAsignadorOficina = ref([
  {
    href: "/mesa-back",
    label: "Bandeja de Entrada Mesa Back",
  },
]);

const linkCorrespondencia = ref([
  // {
  //   href: "/",
  //   label: "Consulta de Tutelas",
  // },
  {
    href: "/correspondencia",
    label: "Bandeja de Entrada",
  },
  {
    href: "/correspondencia/crear-comunicaciones",
    label: "Crear Comunicaciones",
  },

  {
    href: "/correspondencia/crear-comunicaciones-masiva",
    label: "Crear Comunicaciones Masivas",
  },
  {
    href: "/correspondencia/radicacion-entrada",
    label: "Radicado de Entrada",
  },
  {
    href: "/correspondencia/bandeja-manual",
    label: "Radicación Manual",
  },

  // {
  //   href: "/puntos-radicacion",
  //   label: "Puintos de radicación",
  // },
  {
    href: "/mesa-back",
    label: "Bandeja de Entrada Mesa Back",
  },
]);

const linkConfigMetadata = ref([
  {
    label: "Configuración de Reglas de Metadatos",
    href: "/metadata/configuracion",
  },
]);

const leftDrawerOpen = ref(false);
const userInfo: Ref<any> = ref({ name: "", role: "", username: "" });
const roles: Ref<SelectInput[]> = ref([]);
const showRoleModal = ref(false);
const roleSelected = ref("");

const { getUserInfo, getRelations, setRelationByRole } = useAuthStore();
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
onMounted(async () => {
  userInfo.value = await getUserInfo();
  await nextTick();
  window.gtag("config", "G-LNZYVY55ZK", {
    user_id: userInfo.value.userId,
  });
  const { roles: relations, many } = await getRelations();

  if (many && userInfo.value.role === "") {
    showRoleModal.value = true;
    roles.value = relations.map((rel) => ({ label: rel.rol, value: rel.rol }));
  }

  switch (userInfo.value.role) {
    case "Administrador":
  }

  validateRoles();
});

const validateRoles = () => {
  if (String(userInfo.value.role) === RADICADOR) {
    isRadicador.value = true;
  }
};

// Define constants or configuration objects for links
const LINKS = {
  PQRD: [
    {
      href: "/pqrd/verificacion",
      label: "Bandeja de Entrada de PQRD",
      roles: ["Administrador Master"],
    },
    {
      href: "/SGDA/radicar-pqrd",
      label: "Radicación de PQRD",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
  ],
  Consulta: [
    {
      href: "/consulta-general",
      label: "Consulta General",
      roles: ["Administrador Master", "Consulta"],
    },
    {
      href: "/public/historico",
      label: "Consulta Historica",
      roles: ["Administrador Master", "Consulta"],
    },
    {
      href: "/consulta-radicados",
      label: "Consulta Radicados",
      roles: ["Administrador Master", "Consulta"],
    },
  ],
  Administración: [
    {
      href: "/metadata/crear",
      label: "Crear Metadatos",
      roles: ["Administrador de Trámite"],
    },
    {
      href: "/juntas-eps-arl",
      label: "Juntas Eps y Arl",
      roles: ["Administrador de Trámite"],
    },
  ],
  Tutelas: [
    {
      href: "/bandeja",
      label: "Bandeja de Entrada de Tutelas",
      roles: ["Administrador Master"],
    },
    {
      href: "/tutelas/consultas",
      label: "Consulta de Tutelas",
      exclusions: ["Radicador - Web", "Radicador - Contact Center"],
    },
    {
      href: "/tutelas/radicar",
      label: "Radicar Tutelas",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/juzgados",
      label: "Juzgados",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/tutelas/reportes",
      label: "Reporte de Tutelas",
      roles: [
        "Gestionador",
        "Aprobador",
        "Administrador Master",
        "Administrador de Trámite",
        "Gestionador Escalador",
      ],
    },
  ],
  "Cuentas de Cobro": [
    {
      href: "/facturacion/cuentas-cobro/radicadas",
      label: "Bandeja de Entrada de Cuentas de Cobro",
      roles: ["Administrador Master"],
    },
    {
      href: "/facturacion/cuentas-cobro/radicar",
      label: "Radicar Cuenta de Cobro",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/facturacion/manual-proveedores",
      label: "Crear Proveedores",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
  ],
  Correspondencia: [
    {
      href: "/correspondencia/radicacion-entrada",
      label: "Radicación de Entrada",
      roles: [
        "Radicador - Web",
        "Radicador - Ventanilla",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/correspondencia/bandeja-manual",
      label: "Radicación Manual",
      roles: [
        "Administrador Master",
        "Administrador de Trámite",
        "Gestionador",
        "Aprobador",
        "Asignador Oficina",
        "Asignador Responsable",
        "Radicador - Ventanilla",
      ],
    },
    {
      href: "/correspondencia",
      label: "Bandeja de Entrada de Correspondencia",
      roles: ["Administrador Master"],
    },
    {
      href: "/envios-seguimientos/correos",
      label: "Devoluciones",
      roles: ["Administrador Master", "Administrador de Trámite"],
    },
    {
      href: "/correspondencia/crear-comunicaciones",
      label: "Crear Comunicaciones",
      roles: [
        "Gestionador",
        "Administrador Master",
        "Administrador de Trámite",
        "Revisor",
        "Asignador Responsable",
        "Aprobador",
      ],
    },
    {
      href: "/correspondencia/crear-comunicaciones-masiva",
      label: "Crear Comunicaciones Masivas",
      roles: [
        "Gestionador",
        "Administrador Master",
        "Administrador de Trámite",
        "Revisor",
        "Asignador Responsable",
        "Aprobador",
      ],
    },
    {
      href: "/envios-seguimientos/bandeja",
      label: "Bandeja de Envíos - Por enviar",
      roles: ["Seguimiento Envío"],
    },
    {
      href: "/envios-seguimientos/seguimientos",
      label: "Seguimiento envíos - Mensajería y Courier",
      roles: ["Seguimiento Envío"],
    },
    {
      href: "/envios-seguimientos/correos",
      label:
        "Devolución envíos - Correo electrónico y Correo electrónico certificado",
      roles: ["Seguimiento Envío"],
    },
    {
      href: "/correspondencia/form-settings",
      label: "Configuración de Formularios",
      roles: ["Administrador Master", "Administrador de Trámite"],
    },
  ],
  "Facturas Administrativas": [
    {
      href: "/facturacion/radicados",
      label: "Bandeja de Entrada de Facturas Administrativas",
      roles: ["Administrador Master"],
    },
    {
      href: "/facturacion/radicar",
      label: "Radicar Factura Administrativa",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/facturacion/nc-nd",
      label: "Nota Crédito y Débito",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/facturacion/facturas-manual",
      label: "Factura Emisión Manual",
      roles: [
        "Emisión Manual",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/facturacion/manual",
      label: "Crear Adquiriente",
      roles: [
        "Emisión Manual",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
  ],
  "Entes de Control": [
    {
      href: "/entes-de-control/bandeja",
      label: "Bandeja de Entrada de Entes de Control",
      roles: ["Administrador Master"],
    },
    {
      href: "/entes-de-control/reportes",
      label: "Reportes",
      exclusions: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
      ],
    },
    {
      label: "Radicar Entes de Control",
      href: "/entes-de-control/radicar",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
  ],
  "Medicina Laboral": [
    {
      href: "/medicina/bandeja",
      label: "Bandeja de Entrada de ML",
      roles: ["Administrador Master"],
    },
    {
      href: "/medicina/reporte",
      label: "Reportes ML",
      exclusions: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
      ],
    },
    {
      href: "/medicina/bandeja-comunicaciones",
      label: "Comunicaciones Oficiales ML",
      exclusions: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
      ],
    },
    {
      href: "/medicina/reclasificacion",
      label: "Solicitudes de Reclasificación ML",
      exclusions: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
      ],
    },
    {
      href: "/medicina/radicacion-ml",
      label: "Radicar ML",
      roles: [
        "Radicador - Web",
        "Radicador - Mail",
        "Radicador - Contact Center",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/medicina/comunicaciones",
      label: "Crear comunicaciones ML",
      roles: [
        "Gestionador",
        "Administrador Master",
        "Administrador de Trámite",
      ],
    },
    {
      href: "/administracion/prefijos",
      label: "Creación de Prefijos",
      roles: ["Administrador Master", "Administrador de Trámite"],
    },
    {
      href: "/administracion/admin-prefijos",
      label: "Administracion  y asociación de prefijos",
      roles: ["Administrador Master", "Administrador de Trámite"],
    },
  ],
};
function getSeccionIcon(seccionaName) {
  let iconName = "folder_open";
  switch (seccionaName) {
    case "Medicina Laboral":
      iconName = "fa-solid fa-heart-pulse";
      break;
    case "Tutelas":
      iconName = "fa-solid fa-note-sticky";
      break;
    case "Entes de Control":
      iconName = "add_circle";
      break;
    case "Correspondencia":
      iconName = "fa-solid fa-message";
      break;
    case "PQRD":
      iconName = "fa-solid fa-circle-question";
      break;
    case "Facturas Administrativas":
      iconName = "fa-solid fa-layer-group";
      break;
    case "Cuentas de Cobro":
      iconName = "fa-solid fa-landmark";
      break;
    default:
      break;
  }
  return iconName;
}

function getRoleOptions() {
  const { role, modulo } = userInfo.value;
  if (role === "Defensor del Consumidor") {
    return { "Defensor del Consumidor": linksDefensor.value };
  }

  const modulesToInclude = {};

  if (modulo === "Todos") {
    Object.keys(LINKS).forEach((moduleName) => {
      var validEmpty = false;

      for (const item of LINKS[moduleName]) {
        if (item.roles) {
          if (item.roles?.includes(role)) {
            validEmpty = true;
            break;
          }
        }
        if (item.exclusions) {
          if (!item.exclusions?.includes(role)) {
            validEmpty = true;
            break;
          }
        }
      }

      if (validEmpty) {
        modulesToInclude[moduleName] = getModuleOptions(moduleName, role);
      }
    });
  } else {
    var validEmpty = false;
    for (const item of LINKS[modulo]) {
      if (item.roles) {
        if (item.roles?.includes(role)) {
          validEmpty = true;
          break;
        }
      }
      if (item.exclusions) {
        if (!item.exclusions?.includes(role)) {
          validEmpty = true;
          break;
        }
      }
    }

    if (validEmpty) {
      modulesToInclude[modulo] = getModuleOptions(modulo, role);
    }
  }

  if (role === "Asignador Responsable") {
    if (userInfo.value.oficina == 15) {
      modulesToInclude["Asignador Responsable Atención Integral"] = [
        {
          href: "/pqrd/reclasificacion",
          label: "Solicitudes de Reclasificación PQRD",
        },
      ];
    }
  }

  if (role.includes("Asignador Oficina")) {
    modulesToInclude["Asignador Oficina"] = linksAsignadorOficina.value;
  }
  return modulesToInclude;
}

function getModuleOptions(module, role) {
  let moduleLinks = [];

  if (module === "Todos") {
    // Aggregate links from all modules
    Object.values(LINKS).forEach((links) => {
      moduleLinks = moduleLinks.concat(links);
    });
  } else {
    moduleLinks = LINKS[module] || [];
  }

  // Filter links based on role inclusions and exclusions
  return moduleLinks.filter((link) => {
    const isIncluded = !link.roles || link.roles.includes(role);
    const isNotExcluded = !link.exclusions || !link.exclusions.includes(role);
    return isIncluded && isNotExcluded;
  });
}

const findRoles = (role: string) => {
  var valid = userInfo.value?.role?.includes(role) ? true : false;
  return valid;
};

const handleSubmit = () => {
  const role = userInfo.value.relations.find(
    (rel) => rel.rol === roleSelected.value
  )?.idRol;
  setRelationByRole(role);
  showRoleModal.value = false;
};
</script>

<style>
.q-field--standout.q-field--highlighted .q-field__control {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
  background-color: lightgray;
}
</style>
