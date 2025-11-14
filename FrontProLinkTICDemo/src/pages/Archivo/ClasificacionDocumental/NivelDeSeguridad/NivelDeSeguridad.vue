<template>
  <q-card class="tw-p-8 tw-rounded-lg" flat>
    <q-form class="tw-p-2">
      <div class="">
        <Title label="Nivel de seguridad" />
      </div>
      <div>
        <Label label="Clasificación de seguridad" />
        <q-select
          v-model="trdSelected"
          emit-value
          map-options
          outlined
          dense
          use-input
          hide-selected
          fill-input
          clearable
          :options="trdsFiltered"
          @filter="onFilterTRD"
          :rules="[inputRequired]"
          class="tw-mt-2 tw-rounded-lg"
        ></q-select>
      </div>
    </q-form>

    <!-- q-card -->

    <div class="tw-bg-white q-mt-lg" style="border-radius: 5px">
      <div class="full-width q-px-lg q-pb-lg alineation tw-gap-3 tw-flex">
        <!-- Contenedor de Dependencias Autorizadas -->
        <div
          class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
          style="border: 1px solid #e3e4e5"
        >
          <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
            Dependencias Autorizadas
          </span>
          <div class="flex wrap tw-gap-3 q-pt-sm">
            <div v-for="(dep, index) in dependenciasAutorizadas" :key="index">
              <div
                v-if="dep.visible"
                class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                style="border: 1px solid #e3e4e5"
              >
                <q-icon size="24px" name="business" />
                {{ dep.name }}
              </div>
            </div>
          </div>
          <div class="tw-flex tw-gap-2 tw-mt-4">
            <Button
              label="Agregar Dependencia"
              color="primary"
              type-button="button"
              @click="agregarDependencia"
            />
            <Button
              label="Eliminar Dependencia"
              color="black"
              type="tertiary"
              type-button="button"
              @click="eliminarDependencia"
              icon-left="circle-xmark"
            />
          </div>
        </div>

        <!-- Contenedor de Usuarios Autorizados -->
        <div
          class="width-container tw-w-1/2 q-pa-sm q-px-lg tw-pt-3 tw-rounded-xl"
          style="border: 1px solid #e3e4e5"
        >
          <span class="full-width tw-text-lg tw-text-[#2C3948] tw-font-bold">
            Usuarios Autorizados
          </span>
          <div class="flex wrap tw-gap-3 q-pt-sm">
            <div v-for="(user, index) in usuariosAutorizados" :key="index">
              <div
                v-if="user.visible"
                class="q-px-sm tw-text-base q-py-sm tw-gap-2 flex justify-between tw-text-[#2C3948] tw-rounded-3xl"
                style="border: 1px solid #e3e4e5"
              >
                <q-icon size="24px" name="person_outline" />
                {{ user.name }}
              </div>
            </div>
          </div>
          <div class="tw-flex tw-gap-2 tw-mt-4">
            <Button
              label="Agregar Usuario"
              color="primary"
              type-button="button"
              @click="agregarUsuario"
            />
            <Button
              label="Eliminar Usuario"
              color="black"
              type="tertiary"
              type-button="button"
              @click="eliminarUsuario"
              icon-left="circle-xmark"
            />
          </div>
        </div>
      </div>
    </div>
  </q-card>

  <div class="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
    <Button
      label="Eliminar"
      color="black"
      type="tertiary"
      type-button="button"
      @click="eliminar"
      icon-left="circle-xmark"
    />
    <Button
      label="Actualizar"
      color="primary"
      type-button="button"
      @click="actualizar"
    />
  </div>
</template>

<script lang="ts" setup>
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Title from "src/shared/components/PrimeComponents/Fuentes/Title/Title.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import { ref } from "vue";

interface Dependencia {
  id: number;
  name: string;
  visible: boolean;
}

interface Usuario {
  id: number;
  name: string;
  visible: boolean;
}

const dependenciasAutorizadas = ref<Dependencia[]>([
  { id: 1, name: "Dependencia 1", visible: true },
  { id: 2, name: "Dependencia 2", visible: true },
]);

const usuariosAutorizados = ref<Usuario[]>([
  { id: 1, name: "Carlos Ramírez", visible: true },
  { id: 2, name: "María Luisa Rincón", visible: true },
]);

const trdSelected = ref(null);
const trds = ref([
  { label: "Clasificación 1", value: "Clasificación1" },
  { label: "Clasificación 2", value: "Clasificación2" },
  { label: "Clasificación 3", value: "Clasificación3" },
]);
const trdsFiltered = ref([...trds.value]);

const onFilterTRD = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    const needle = val.toLowerCase();
    trdsFiltered.value = trds.value.filter(
      (trd) => trd.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const inputRequired = (val: string) => !!val || "Campo obligatorio";

// Funciones para agregar y eliminar
const agregarDependencia = () => {
  const nuevaDependencia: Dependencia = {
    id: Date.now(),
    name: `Dependencia ${dependenciasAutorizadas.value.length + 1}`,
    visible: true,
  };
  dependenciasAutorizadas.value.push(nuevaDependencia);
};

const eliminarDependencia = () => {
  if (dependenciasAutorizadas.value.length > 0) {
    dependenciasAutorizadas.value.pop();
  }
};

const agregarUsuario = () => {
  const nuevoUsuario: Usuario = {
    id: Date.now(),
    name: `Usuario ${usuariosAutorizados.value.length + 1}`,
    visible: true,
  };
  usuariosAutorizados.value.push(nuevoUsuario);
};

const eliminarUsuario = () => {
  if (usuariosAutorizados.value.length > 0) {
    usuariosAutorizados.value.pop();
  }
};

const actualizar = () => {
};

const eliminar = () => {
};
</script>

<style scoped></style>
