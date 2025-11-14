<template>
  <!-- Lista desplegable -->
  <div v-for="({ id, metadatoConOpciones, obligatorio }, i) in listFields" :key="id" class="col-sm-6 tw-p-2 tw-bg-white">
  <template v-if="ensureUserObjectExists(i, id, metadatoConOpciones.metadato.tipoDato.id)">
    <p class="tw-text-label tw-font-semibold ">
      {{ metadatoConOpciones.metadato.nombre }}{{ obligatorio ? ' *': '' }}
    </p>
    <q-select
      v-model="metadatos.list[i].value"
      :rules=" obligatorio ? [inputRequired] : []"
      map-options
      outlined
      label="Seleccione"
      dense
    >
      <q-menu fit  anchor="bottom left" self="top left" >
        <q-list dense ref="menu">
          <q-item clickable v-for="el in metadatoConOpciones.listadoRelacionalesMD.filter(it => it.elemento.estado )" :key="el.elemento.id" >
            <q-item-section>
              {{ el.elemento.nombreRelacional }}
            </q-item-section>
            <q-item-section side>
              <q-icon name="keyboard_arrow_right" />
            </q-item-section>

            <q-menu anchor="top end" self="top start">
              <q-list>
                <q-item
                  v-for="op in el.opciones.filter(it => it.visible)"
                  :key="op.id"
                  dense
                  clickable
                  @click="clicMenu(op, i)"
                >
                  <q-item-section>{{ op.opcion }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-item>
        </q-list>
      </q-menu>
    </q-select>

    </template>
  </div>

  <!-- Alfanumericos -->
  <div v-for="({ id, metadatoConOpciones, obligatorio }, i) in alfanumFields" :key="id" class="col-sm-6 tw-p-2 tw-bg-white">
    <template v-if="ensureUserObjectExists(i, id, metadatoConOpciones.metadato.tipoDato.id)">
      <p class="tw-text-label tw-font-semibold">{{ metadatoConOpciones.metadato.nombre }}{{ obligatorio ? ' *': '' }}</p>
      <q-input
        v-model="metadatos.alfa[i].value"
        :rules=" obligatorio ? [inputRequired] : []"
        map-options
        outlined
        label="Inserte"
        dense
        @update:modelValue="emitChange(metadatos)"
      />
    </template>
  </div>

  <!-- Checkbox -->
  <div v-for="({ id, metadatoConOpciones, obligatorio }, i) in booleanFields" :key="id"  class="col-sm-6 tw-p-2 tw-bg-white">
    <template v-if="ensureUserObjectExists(i, id, metadatoConOpciones.metadato.tipoDato.id)">
      <p class="tw-text-label tw-font-semibold">{{ metadatoConOpciones.metadato.nombre }}{{ obligatorio ? ' *': '' }}</p>
      <q-toggle
        v-model="metadatos.check[i].value"
        @update:modelValue="emitChange(metadatos)"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { toast } from "src/helpers/toast";
import {
  inputRequired,
} from "src/helpers/validations";
import { sgdeaAxios } from "src/services";
import { onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{
  listFields: any
  alfanumFields: any
  booleanFields: any
  detalleRadicado: any
}>(),{
})

const emit = defineEmits(['updateValue']);

const emitChange = (arr: any) => {
  emit('updateValue', { arr });
};

onMounted(async () => {
  await cargarMetadatos();
});

const metadatos = ref({
  list: [],
  alfa: [],
  check: []
})

const clicMenu = (op, index) => {
  metadatos.value.list[index].value = op.opcion
  emitChange(metadatos)
}

function ensureUserObjectExists(index, id, type) {
  if (type === 1) {
    if (metadatos.value.alfa[index] === undefined) {
      metadatos.value.alfa[index] = { id, value: '' };
    }
    return true
  } else if(type === 2){
    if (metadatos.value.list[index] === undefined) {
      metadatos.value.list[index] = { id, value: '' };
    }
    return true
  } else {
    if (metadatos.value.check[index] === undefined) {
      metadatos.value.check[index] = { id, value: false };
    }
    return true
  }
}


async function cargarMetadatos() {

  try {
    const response = await sgdeaAxios.get(`/meta-datos/${props.detalleRadicado.idRadicado}`);
    const metaDatos = response.data.metaDatos;

    Object.keys(metaDatos).forEach((key) => {
      const value = metaDatos[key];

      const alfaField = metadatos.value.alfa.find(field => field.id == key);
      const listField = metadatos.value.list.find(field => field.id == key);
      const checkField = metadatos.value.check.find(field => field.id == key);

      if (typeof value === 'string' && value !== 'true' && value !== 'false') {
        if (alfaField) {
          alfaField.value = value;
        } else if (listField) {
          listField.value = value;
        }
      }
      else if (typeof value === 'boolean' || value === 'true' || value === 'false') {
        const booleanValue = value === true || value === 'true';
        if (checkField) {
          checkField.value = booleanValue;
        }
      }
      else {
        if (listField) {
          listField.value = String(value);
        }
      }
    });

    emitChange(metadatos.value);
  } catch (error) {
    console.error(error);

  }
}
</script>
<style>
</style>
