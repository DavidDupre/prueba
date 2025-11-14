<script setup lang="ts">
import Button from "src/shared/components/PrimeComponents/Button/Button.vue";
import Label from "src/shared/components/PrimeComponents/Label/Label.vue";
import { useInformacionDocumento } from "./InformacionDocumento";

const { formData, expediente, onReclasificar, tiposDocumentales } = useInformacionDocumento();
</script>

<template>
  <q-form class="tw-grid tw-grid-cols-2 tw-gap-6">
    <div>
      <Label label="Dependencia" />
      <q-input v-model="formData.dependencia" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Serie" />
      <q-input v-model="formData.serie" type="text" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Subserie" />
      <q-input v-model="formData.subserie" type="text" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Tipo Documental" />
      <q-input v-model="formData.tipoDocumental" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Fecha de Elaboración" />
      <q-input v-model="formData.fechaCreacion" type="date" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Fecha de Modificación" />
      <q-input v-model="formData.fechaModificacion" type="date" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Nombre Elaborador/ Remitente" :is-requiered="true" />
      <q-input v-model="formData.nombreElaborador" type="text" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Radicado" />
      <q-input v-model="formData.radicado" type="text" dense outlined disable class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Nombre del Documento" :is-requiered="true" />
      <q-input v-model="formData.nombre" type="text" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Peso del Documento" />
      <q-input v-model="formData.pesoDocumento" type="text" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Hash del Documento" />
      <q-input v-model="formData.hashDocumento" type="text" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Número de Folios" />
      <q-input v-model="formData.numerofolios" type="text" dense outlined class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <div>
      <Label label="Fecha de Incorporación" :is-requiered="true" />
      <q-input v-model="formData.fechaIncorporacion" type="date" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div>

    <!-- <div>
      <Label label="Fecha de Declaración" />
      <q-input v-model="formData.fechaDeclaracion" type="date" dense outlined disable
        class="tw-mt-2 tw-rounded-lg"></q-input>
    </div> -->

    <!-- <section class="tw-col-span-2 tw-flex tw-justify-between tw-mt-6">
      <div v-if="expediente?.status != 'INACTIVO'" class="tw-flex tw-gap-6">
        <Button label="Referenciar" type="tertiary" color="blue" icon-right="copy" type-button="button"
          @click="onReclasificar('referenciar')" />
        <Button label="Reclasificar" type="tertiary" color="blue" icon-right="up-down-left-right" type-button="button"
          @click="onReclasificar('reclasificar')" />
      </div>

      <Button label="Actualizar" type="primary" color="primary" icon-right="circle-arrow-right"
        type-button="submit" />
    </section> -->
  </q-form>
</template>
