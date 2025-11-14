<template>
  <div>
    <div>
      <BreadCrumbs :crumbs="crumbs" />
      <h2 class="tw-font-bold tw-text-4xl tw-py-6">Editar Empresa</h2>
    </div>

    <div>
      <div class="tw-bg-white tw-p-8 tw-rounded-xl flex-wrap">
        <h3 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold">
          Datos Básicos (Información general o Información de la empresa)
        </h3>
        <q-form ref="createForm" @submit.prevent="createSerie" class="row flex col">
          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Código Empresa *</label>
            <q-input :disable="true" filled v-model="dataForm.idEmpresa" class="tw-rounded-lg" dense
              :rules="[inputRequired, (v) => maxLengthInput(50, v)]" label="Inserte"></q-input>
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Nombre Empresa *</label>
            <q-input v-model="dataForm.nombre" outlined class="tw-rounded-lg" dense
              :rules="[inputRequired, (v) => maxLengthInput(50, v)]" label="Inserte"></q-input>
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Tipo de Sociedad *</label>
            <q-select :options="tipoSociedad" emit-value placeholder="Seleccione" map-options outlined
              v-model="dataForm.tipoSociedad" class="" dense :rules="[inputRequired]" label="Seleccione" />
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Fecha constitución *</label>
            <Datepicker mask="YYYY/MM/DD" label="aaaa / mm / dd" v-model:input-data-prop="dataForm.fechaContitucion"
              :rules="[inputRequired, validateDate]" />
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Acto Administrativo de Constitución *</label>
            <q-input v-model="dataForm.actoAdministrativoConstitucion" outlined class="tw-rounded-lg" dense
              :rules="[inputRequired, (v) => maxLengthInput(10, v)]" label="Inserte"></q-input>
          </span>
          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">NIT *</label>
            <q-input v-model="dataForm.nit" outlined class="tw-rounded-lg" dense :rules="[inputRequired, val => preciseLengthInput(9, val), val => onlyNumbers(val)]" label="Inserte"></q-input>
          </span>
          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Dirección *</label>
            <q-input v-model="dataForm.direccion" outlined class="tw-rounded-lg" dense
              :rules="[inputRequired, (v) => maxLengthInput(50, v)]" label="Inserte"></q-input>
          </span>
          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Teléfono *</label>
            <q-input v-model="dataForm.telefono" outlined class="tw-rounded-lg" dense :rules="[
              inputRequired,
              (v) => maxLengthInput(15, v),
              (val) => onlyNumbers(val),
            ]" label="Inserte"></q-input>
          </span>
          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Correo electrónico *</label>
            <q-input v-model="dataForm.email" outlined class="tw-rounded-lg" dense :rules="[
              inputRequired,
              (v) => maxLengthInput(200, v),
              (val) => validationEmail(val),
            ]" label="Inserte"></q-input>
          </span>

          <h3 class="tw-text-xl q-pl-md tw-mb-4 tw-font-bold col-12">
            Información Representante Legal
          </h3>
          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="text-[--subtitle-color] tw-text-label">Nombre del representante legal *</label>
            <q-input v-model="dataForm.nombreRepresentanteLegal" outlined class="tw-rounded-lg" dense
              :rules="[inputRequired, (v) => notNumber(v), (v) => maxLengthInput(50, v)]" label="Inserte"></q-input>
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Teléfono del representante legal *</label>
            <q-input v-model="dataForm.telefonoRepresentanteLegal" outlined class="tw-rounded-lg" dense :rules="[
              inputRequired,
              (v) => maxLengthInput(15, v),
              (val) => onlyNumbers(val),
            ]" label="Inserte"></q-input>
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Dirección del representante legal *</label>
            <q-input v-model="dataForm.direccionRepresentanteLegal" outlined class="tw-rounded-lg" dense
              :rules="[inputRequired, (v) => maxLengthInput(50, v)]" label="Inserte"></q-input>
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Nacionalidad del representante legal *</label>
            <q-input v-model="dataForm.nacionalidadRepesentanteLegal" outlined class="tw-rounded-lg" dense :rules="[
              inputRequired,
              (v) => maxLengthInput(50, v),
              (val) => !/[^a-zA-ZáéíóúñÁÉÍÓÚÑ ]/.test(val) || 'Solo letras',
            ]" label="Inserte"></q-input>
          </span>

          <span class="col-xs-12 col-sm-12 col-md-6 col-lg-6 q-pr-xl">
            <label class="tw-text-label">Correo electrónico del representante legal *</label>
            <q-input v-model="dataForm.correoRepresentanteLegal" outlined class="tw-rounded-lg" dense :rules="[
              inputRequired,
              (v) => maxLengthInput(200, v),
              (val) => validationEmail(val),
            ]" label="Inserte"></q-input>
          </span>

          <span class="w-full flex justify-center tw-gap-4 tw-mt-8 col-12">
            <q-btn label="Cancelar" color="accent" textColor="black" class="tw-rounded-lg tw-w-[200px]"
              @click="() => (cancelModal = true)"></q-btn>
            <q-btn label="Editar" color="secondary" class="tw-rounded-lg tw-p-2 tw-w-[200px] text-bold"
              type="submit"></q-btn>
          </span>
        </q-form>
      </div>
      <Modal v-model="showModal" title="Asignación exitosa"
        :text="`La empresa “${dataForm.idEmpresa} ${dataForm.nombre}” fue editada correctamente.`" is-success
        text-button="¡Ok!" @handleAccept="handleModal" />
      <Modal v-model="cancelModal" title="¿Desea cancelar la acción?" :text="``" text-button="Si"
        @handleAccept="() => router.push('/administracion/empresas')" label="Confirmar" cancelButton
        text-button-cancel="No"
        @close-modal="() => cancelModal = false" />
      <Modal v-model="errorModal" title="Error" text="¡Ha ocurrido un error!" :is-success="false" text-button="Aceptar"
        @handleAccept="handleModal" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { routes, IDataEmpresa, options } from ".";

import BreadCrumbs from "src/components/BreadCrumbs/BreadCrumbs.vue";
import Modal from "components/Modal/Modal.vue";
import Datepicker from "components/FormFields/datePickerComponent.vue";
import { adminAxios } from "src/services";
import { inputRequired, maxLengthInput, onlyNumbers, preciseLengthInput, validateDate, validationEmail, notNumber } from "src/helpers/validations";
import { useLoadingStore } from "src/stores/loading.store";

const crumbs = ref([...routes, { name: "Editar empresa" }]);

const route = useRoute();
const router = useRouter();

const showModal = ref(false);
const errorModal = ref(false);
const cancelModal = ref(false);

const dataForm = ref({
  actoAdministrativoConstitucion: "",
  correoRepresentanteLegal: "",
  direccion: "",
  direccionRepresentanteLegal: "",
  email: "",
  estado: true,
  fechaContitucion: "",
  idEmpresa: 0,
  nacionalidadRepesentanteLegal: "",
  nit: "",
  nombre: "",
  nombreRepresentanteLegal: "",
  telefono: "",
  telefonoRepresentanteLegal: "",
  tipoSociedad: "",
});

const createForm = ref();

const tipoSociedad: Ref<{ label: string; value: any }[]> = ref([]);

const createSerie = async () => {
  if (await createForm.value.validate()) {
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await adminAxios.put(
        `/empresas/actualizar/${route.params.id}`,
        {
          ...dataForm.value,
        },
        {
          headers: headers,
          successMessage: `La empresa “${dataForm.value.idEmpresa} ${dataForm.value.nombre}” fue editada correctamente.`,
          errorMessage: 'Ha ocurrido un error'
        },
      );

      if ([200, 201].includes(response.status)) {
        showModal.value = true;
      }
    } catch (e) {
      console.error(e);
      errorModal.value = true;
    }
  }
};

const handleModal = () => {
  if (showModal.value) {
    showModal.value = false;
    router.push("/administracion/empresas");
  } else {
    errorModal.value = false;
  }
};

onMounted(async () => {
  const { data: response } = await adminAxios.get(`/empresas/obtener/${route.params.id}`);

  dataForm.value = response;

  const {data:responseSociedad} = await adminAxios.get(`/entidades/list/8`);
  tipoSociedad.value = responseSociedad.map((item: any) => ({
    label: item.entidad,
    value: item.idEntidad,
  }));
});
</script>

<style></style>
