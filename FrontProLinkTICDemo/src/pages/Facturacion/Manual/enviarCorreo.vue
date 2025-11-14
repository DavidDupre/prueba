<template>
  <q-dialog
    v-model="props.open"
    persistent
    transition-show="scale"
    transition-hide="scale"
    transition-duration="300"
  >
    <q-card class="tw-px-5">
      <q-card-section class="tw-bg-white">
        <div class="full-width row tw-justify-center tw-items-center">
          <img v-lazy :data-url="require('src/assets/mail.svg')" alt="email" />
        </div>
      </q-card-section>

      <q-card-section>
        <p class="tw-font-bold tw-text-2xl tw-text-center">
          Disposición de factura electrónica
        </p>

        <div class="tw-mt-6">
          <span class="text-weight-bold text-h6" style="color: #2c3948">Enviar a *</span>
          <q-item class="tw-border-b">
            <q-item-section avatar>
              <q-icon name="check_circle_outline" size="sm" color="grey-6" />
            </q-item-section>

            <q-item-section>
               <q-select
                v-model="selectedCorreos"
                input-debounce="0"
                label="Inserte el correo"
                borderless
                dense
                multiple
                emit-value
                map-options
                @filter="correosOptionsFilterFn"
                :options="correosOptions"
                use-input
                hide-selected
                fill-input
                class="tw-mb-[-10px]"
              />
            </q-item-section>

            <q-item-section side>
              <q-btn
                flat
                dense
                size="md"
                rounded
                color="orange-7"
                icon="add_circle"
                @click="addNewItem"
              />
            </q-item-section>
          </q-item>

          <q-scroll-area style="height: 100px; width: 100%">
            <div v-for="(item, index) in selectedCorreos" :key="index" class="tw-py-[-10px]" >
              <q-item class="tw-border-b">
                <q-item-section avatar>
                  <q-icon name="check_circle_outline" size="sm" color="grey-6" />
                </q-item-section>

                <q-item-section>
                  <q-input v-model="selectedCorreos[index]" borderless dense />
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    flat
                    dense
                    size="sm"
                    rounded
                    color="grey-6"
                    icon="close"
                    @click="removeAt(index)"
                  />
                </q-item-section>
              </q-item>
            </div>
          </q-scroll-area>

          <span class="text-weight-bold text-h6" style="color: #2c3948">Asunto *</span>
          <q-item class="">
            <q-item-section>
              <q-input
                v-model="asunto"
                label="Inserte el asunto"
                :rules="[inputSelectRequired]"
              />
            </q-item-section>
          </q-item>

          <span class="text-weight-bold text-h6" style="color: #2c3948">Seleccionar archivos *</span>
          <q-item class="tw-border-b">
            <q-item-section>
              <div
                v-for="file in filesOptions"
                :key="file.id"
                class="row items-center tw-border-b tw-py-2"
              >
                <q-checkbox
                  v-model="selectedFiles"
                  :val="file"
                  :label="file.nombre"
                  dense
                />
              </div>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <q-card-section class="flex column justify-center items-center">
        <div class="tw-flex tw-mt-8">
          <q-btn
            label="No"
            color="accent"
            text-color="black"
            class="tw-p-3"
            style="width: 200px; height: 50px"
            flat
            v-close-popup
            @click="cancelar"
          />
          <q-btn
            label="Sí"
            style="width: 200px; height: 50px"
            text-color="white"
            color="secondary"
            v-close-popup
            class="tw-rounded-xl tw-p-3"
            @click="sendData"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { validationEmail, inputSelectRequired } from "src/helpers/validations";
import { sgdeaAxios } from "src/services";

const props = defineProps<{ open: boolean; filesOptions: any[] }>();
const emit = defineEmits(["cancelar", "aceptar"]);

const selectedCorreos = ref<string[]>([]);
const correosOptions = ref<any[]>([]);
const allCorreos = ref<any[]>([]);
const correo = ref<string[]>([]);
const asunto = ref("");
const selectedFiles = ref<any[]>([]); // Ahora es un array de objetos completos

const fetchCorreos = async () => {
  try {
    const response = await sgdeaAxios.get('/usuarios/emails');
    allCorreos.value = response.data.map((item: any) => ({
      label: item.usuarioEmail,
      value: item.usuarioEmail
    }));
    correosOptions.value = [...allCorreos.value];
  } catch (error) {
    console.error('Error fetching correos:', error);
  }
};

function addNewItem() {
  if (correo.value.length > 0 && correo.value.every(val => validationEmail(val))) {
    selectedCorreos.value = [...new Set([...selectedCorreos.value, ...correo.value])];
    correo.value = [];
    correosOptions.value = allCorreos.value.filter(
      (v) => !selectedCorreos.value.includes(v.value)
    );
  }
}

function removeAt(index: number) {
  selectedCorreos.value.splice(index, 1);
  correosOptions.value = allCorreos.value.filter(
    (v) => !selectedCorreos.value.includes(v.value)
  );
}

function cancelar() {
  correo.value = [];
  selectedCorreos.value = [];
  selectedFiles.value = [];
  asunto.value = "";
  emit('cancelar');
}

function sendData() {
  const correosString = selectedCorreos.value.join(", ");
  emit('aceptar', correosString, asunto.value, selectedFiles.value); // Enviar el array completo de archivos
}

const correosOptionsFilterFn = (val: string, update: any) => {
  const needle = val.toLowerCase();
  update(() => {
    correosOptions.value = allCorreos.value.filter(
      (v) => v.label.toLowerCase().includes(needle) && !selectedCorreos.value.includes(v.value)
    );
  });
};

onMounted(() => {
  fetchCorreos();
});

</script>
