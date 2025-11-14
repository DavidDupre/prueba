<template>
  <main>
    <BreadCrumbs :crumbs="routes" />
    <div class="tw-flex tw-justify-between tw-items-center tw-pt-4 tw-mb-8">
      <h2 class="tw-font-bold tw-text-4xl tw-pl-8 tw-py-4">Editar tipo de Radicado</h2>
    </div>
    <q-form ref="form" class="tw-mt-3 tw-h-full" @submit.prevent="update">

      <div class="">

        <div class="flex tw-flex-col  tw-bg-white tw-p-8 tw-rounded-lg flex-wrap ">

          <h3 class=" tw-text-2xl tw-text-left tw-font-bold tw-pl-6 tw-mb-4">Tipo de Radicado con identificador: {{
            idTipoRadicado }}</h3>

          <div class="flex tw-gap-4">

            <span class="tw-w-full">
              <label for="">Nombre tipo de Radicado</label>
              <q-input v-model="formData.nombreTipoRadicado" outlined class="tw-rounded-lg" label="Inserte"
                dense></q-input>
            </span>

            <div class='flex flex-col tw-w-full q-col-gutter-md'>
              <span class="tw-w-[50%]">
                <label for="description" class="text-[--subtitle-color]">Estado</label>
                <q-select emit-value placeholder="Seleccione" map-options outlined :rules="[customRule]"
                  :options="estado_op" v-model="formData.status" label="Estado" dense />
              </span>
            </div>

          </div>


          <span v-if="showActions" class="w-full flex justify-center tw-gap-4 tw-mt-8">
            <router-link to="/SGDA/radicado">
              <q-btn label="Cancelar" color="accent" textColor="black"
                class="tw-rounded-lg tw-p-2 tw-w-[200px]"></q-btn>
            </router-link>

            <q-btn type="submit" label="Editar Tipo Radicado" color="secondary"
              class="tw-rounded-lg tw-w-[200px] text-bold" />
          </span>
        </div>
      </div>
    </q-form>

    <q-dialog v-model="confirmCreation">
      <q-card>
        <q-card-section>
          <div class="text-h6">Mensaje del sistema</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          El Registro fue editado correctamente.
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Aceptar" v-close-popup />
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="errorSearch">
      <q-card>
        <q-card-section>
          <div class="text-h6">El registro no existe</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          El Registro {{ idTipoRadicado }} no existe.
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Aceptar" v-close-popup />
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </main>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { reactive, onUpdated, onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import service from "src/services/Api";

const route = useRoute();
const router = useRouter();

const formData = reactive({
  idTipoRadicado: "",
  nombreTipoRadicado: "",
  status: ""
});

const confirmCreation = ref(false);
const errorSearch = ref(false);
const showActions = ref(false);
const showModal = ref(false);

const idTipoRadicado = ref('');
const model = ref(null);
const form = ref(null);

let estado_op = [
  {
    label: 'Activo',
    value: 'true',
  },
  {
    label: 'Inactivo',
    value: 'false',
  }
]

const obtenerObjetoLista = (lista: any[], value: any): any => {
  const objetoEncontrado = lista.find((elemento) => elemento.value === value);
  return objetoEncontrado;
}

const searchTipoRadicado = () => {
  const url = window.location.pathname;

  // Obtener el último segmento de la URL
  const segments_tmp = url.split('editar');
  const segments = segments_tmp[1].split('/');

  const lastSegment = segments[1];
  idTipoRadicado.value = lastSegment;
  service.searchTipoRadicado(lastSegment, "", "", "")
    .then(response => {
      let estado_op_tmp = [
        {
          label: 'Activo',
          value: 'true',
        },

        {
          label: 'Inactivo',
          value: 'false',
        }
      ];
      let res = response.map(function (value, key) {

        formData.nombreTipoRadicado = value.nombreTipoRadicado;
        formData.status = obtenerObjetoLista(estado_op_tmp, value.status);
        //formData.status = value.status;
        let tmpEstado = {
          label: 'Activo',
          value: 'true',
        };

        if (value.status == false) {
          tmpEstado = {
            label: 'Inactivo',
            value: 'false',
          };
        }
        formData.status = tmpEstado.value;
        errorSearch.value = false;
        showActions.value = true;

      });
      if (res.length == 0) {
        errorSearch.value = true;
      }

    })
    .catch(error => {
      errorSearch.value = true;
      console.error(error);
    });
};

searchTipoRadicado();

const customRule = (val: any) => {
  if (val.length === 0) return 'Este campo es requerido'
}

const update = async () => {
  if (form.value.validate()) {
    service.updateTipoRadicado({
      idTipoRadicado: idTipoRadicado.value,
      nombreTipoRadicado: formData.nombreTipoRadicado,
      status: formData.status,
    })
      .then(result => {
        confirmCreation.value = true;
      })
      .catch(error => {
        console.error(error);
      });
  }
}
</script>
