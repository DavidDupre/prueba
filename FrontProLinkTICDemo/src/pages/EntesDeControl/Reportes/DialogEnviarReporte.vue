  <template>
    <q-dialog v-model="props.open" persistent transition-show="scale" transition-hide="scale" transition-duration="300">
      <q-card class="tw-px-10">
        <q-card-section class="tw-bg-white">
          <div class="full-width row tw-justify-center tw-items-center">
            <img v-lazy :data-url="require('src/assets/mail.svg')" alt="email" />
          </div>
        </q-card-section>

        <q-card-section>
          <p class="tw-font-bold tw-text-2xl tw-text-center">Enviar Reporte al Correo </p>

          <div class="tw-mt-6">
            <p class="tw-font-bold text-h6" style="color: #2c3948">Formato</p>
            <q-select v-model="inputFormat" :rules="[inputSelectRequired]" outlined map-options emit-value label="Seleccione" :options="[
              { value: 'xlsx', label: 'Excel' },
              { value: 'csv', label: 'CSV' }
            ]" />
          </div>

          <div class="tw-mt-6">
            <span class="text-weight-bold text-h6" style="color: #2c3948">Correos electrónico *</span>
            <q-item class="tw-border-b">
              <q-item-section avatar>
                <q-icon name="check_circle_outline" size="sm" color="grey-6" />
              </q-item-section>

              <q-item-section>
                <q-select v-model="correo" input-debounce="0" label="Inserte el correo" borderless dense
                  @filter="correosOptionsFilterFn" :options="correosOptions" use-input hide-selected fill-input
                  @input-value="(val) => val!=correo ? correo = val : correo" :rules="[validationEmail]" class="tw-mb-[-20px]"/>
              </q-item-section>

              <q-item-section side>
                <q-btn flat dense size="md" rounded color="orange-7" icon="add_circle" @click="addNewItem" />
              </q-item-section>
            </q-item>
          </div>
          <q-scroll-area style="height: 100px; width:100%;">
            <div v-for="(item, index) in selectedCorreos" :key="index">
              <q-item class="tw-border-b">
                <q-item-section avatar>
                  <q-icon name="check_circle_outline" size="sm" color="grey-6" />
                </q-item-section>

                <q-item-section>
                  <q-input v-model="selectedCorreos[index]" borderless dense />
                </q-item-section>

                <q-item-section side>
                  <q-btn flat dense size="sm" rounded color="grey-6" icon="close" @click="removeAt(index)" />
                </q-item-section>
              </q-item>
            </div>
          </q-scroll-area>
        </q-card-section>

        <q-card-section class="flex column justify-center items-center">
          <div class="tw-flex tw-mt-8">
            <q-btn label="No" color="accent" text-color="black" class="tw-p-3" style="width: 200px; height: 50px;" flat
              v-close-popup @click="emit('cancelar')" />
            <q-btn label="Sí" style="width: 200px; height: 50px;" text-color="white" color="secondary" v-close-popup
              class="tw-rounded-xl tw-p-3 " @click="emit('aceptar', selectedCorreos, inputFormat)" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>

<script setup lang="ts">
import { validationEmail, inputSelectRequired } from 'src/helpers/validations';
import { ref, watchEffect } from 'vue';

const props = defineProps<{ open: boolean, dataTable: any[] }>()
const emit = defineEmits(['cancelar', 'aceptar']);

const selectedCorreos = ref<string[]>([]);
const correosOptions: any = ref([]);
const optCorreos: any = ref([]);
const inputFormat = ref();
const correo = ref();


function addNewItem() {
  if (correo.value && validationEmail(correo.value)==true) {
    selectedCorreos.value.push(correo.value);
    correo.value = '';
  }
}

function removeAt(index) {
  selectedCorreos.value.splice(index, 1)
}

const correosOptionsFilterFn = (val: string, update: any) => {
  if (val === "") {
    update(() => {
      correosOptions.value = optCorreos.value
        .filter((data) => !selectedCorreos.value.includes(data))
        .slice(0, 5);
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    correosOptions.value = optCorreos.value
      .filter(
        (v) => v.toLowerCase().indexOf(needle) > -1,
      ).slice(0, 5);
  });
};

watchEffect(() => {
  if (props.dataTable) {
    let data = [...new Set(props.dataTable.map((v) => v.emailAfectado.toLowerCase()))];
    correosOptions.value = data;
    optCorreos.value = data;
  }
})
</script>
