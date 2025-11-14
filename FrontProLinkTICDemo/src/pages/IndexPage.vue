<template>
  <main>
    <div class="tw-pl-4 tw-my-5">
      <h1 class="tw-font-bold tw-text-3xl text-bold">
        Bienvenido, {{ userInfo?.name ?? "Usuario" }}
      </h1>
    </div>

    <q-card flat class="q-pa-md">
      <h2 class="tw-text-xl">
        Rol de usuario:
        <!-- <span class="tw-text-primary">{{ userInfo.role }}</span
        >.-->
      </h2>
      <p>
        Estos son los roles o permisos que posees, selecciona uno para cambiar
        del actual.
      </p>

      <q-card-section class="row q-mt-md tw-gap-8 tw-flex-wrap">
        <q-card
          v-for="(role, index) in roles"
          :key="index"
          bordered
          :flat="!isActiveRole(index)"
          :class="
            createCssCard(role.rol, role.idOficina, role.idDependencia, index)
          "
          @click="selectRoleByIndex(index)"
        >
          <q-item class="flex tw-justify-between cursor-pointer">
            <q-item-section avatar>
              <q-avatar class="tw-rounded-2xl">
                <i :class="createCss(role.rol)"></i>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label
                caption
                class="flex tw-justify-end tw-min-w-[100px]"
              >
                <q-chip outline v-if="isActiveRole(index)">Seleccionado</q-chip>
                <q-chip outline :class="createCssChip()" v-else>
                  Seleccionar
                </q-chip>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-card-section horizontal>
            <q-card-section>
              <p class="tw-font-semibold tw-capitalize">Rol</p>
              <p class="block q-py-sm">
                <span>Oficina</span>
                <!-- <span
                  v-html="
                    role.oficina
                      ? '<strong>Oficina: </strong> ' + role.oficina
                      : '<strong>Dependencia: </strong> ' + role.dependencia
                  "
                ></span> -->
              </p>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>

    <PasswordChangeModal
      v-model="showPasswordModal"
      :loading="isChangingPassword"
      @submit="handlePasswordChange"
    />

    <BannerModal
      v-model="showBanner"
      :image-url="bannerImageUrl"
      width-class="tw-w-[1000px]"
      max-width-class="tw-max-w-[95vw]"
      alt-text="Banner de bienvenida de la plataforma"
      @open-video="
        showVideoModal = true;
        showBanner = false;
      "
    />

    <VideoModal v-model="showVideoModal" :video-url="videoTutorialUrl" />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/auth.store";
import { roleIcon } from "src/helpers/roleHelpers";
import { toast } from "src/helpers/toast";
import { sgdeaAxios } from "src/services";

import PasswordChangeModal from "src/components/Modal/PasswordChangeModal.vue";
import BannerModal from "src/components/Modal/BannerModal.vue";
import VideoModal from "src/components/Modal/VideoModal.vue";

const { getUserInfo, getRelations, setRelationByRelationIndex } =
  useAuthStore();
const userInfo = ref(getUserInfo());
const roles = ref<any[]>([]);

const showPasswordModal = ref(false);
const isChangingPassword = ref(false);

const showBanner = ref(false);
const bannerImageUrl = "/baner/Banner_1.webp";

const showVideoModal = ref(false);
const videoTutorialUrl = "/baner/video/Logo Docum animado.mp4";

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

onMounted(async () => {
  userInfo.value = getUserInfo();
  const { roles: relations } = await getRelations();
  roles.value = relations;
});

watch(
  userInfo,
  (newUserInfo) => {
    if (newUserInfo?.mensajeAcceso === "false") {
      showBanner.value = true;
    }
  },
  { immediate: true }
);

const selectRoleByIndex = async (index: number) => {
  await setRelationByRelationIndex(index);
  userInfo.value = getUserInfo();
};

const isActiveRole = (index: number) => {
  const role = roles.value[index];
  return (
    userInfo.value.role === role.rol &&
    userInfo.value.dependencia === role.idDependencia &&
    userInfo.value.oficina === role.idOficina
  );
};

const createCss = (rolename: string) =>
  `fa-solid fa-${roleIcon(rolename)} tw-text-primary tw-text-[30px]`;

const createCssChip = () => `tw-border-primary tw-rounded-xl`;

const createCssCard = (
  rolename: string,
  idOficina: number | null,
  idDependencia: number,
  index: number
) => {
  const active = isActiveRole(index);
  return `tw-border-primary col-2 tw-rounded-xl !tw-w-[300px] ${
    active ? "tw-bg-[#FF7500]/30" : ""
  }`;
};
</script>
