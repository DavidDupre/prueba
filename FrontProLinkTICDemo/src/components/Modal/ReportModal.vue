<template>
    <q-dialog v-model="card" persistent transition-show="scale" transition-hide="scale" transition-duration="300">
        <q-card class="tw-p-10">
            <q-card-section class="tw-bg-white">
                <div class="full-width row  tw-justify-center tw-items-center">
                    <img v-lazy :data-url="mail" alt="email" />
                </div>
            </q-card-section>
            <q-card-section>
                <p class="tw-font-bold tw-text-2xl tw-text-center"> {{ title }}</p>
                <p class="tw-font-bold tw-mt-3 tw-mb-1">{{ label }}</p>
                <q-select v-model="inputFormat" outlined map-options emit-value label="Seleccione" :options="[
                    { value: 'xlsx', label: 'Excel' },
                    { value: 'csv', label: 'CSV' }
                ]" />
                <q-select v-model="selectedItems" map-options emit-value :options="[
                    { value: 'C', label: 'Correo electrónico' }
                ]" />
                <div v-for="(item, index) in selectedItems" :key="index">
                    <q-item class="tw-border-b">
                        <q-item-section avatar>
                            <q-icon name="check_circle" size="sm" color="grey-6" />
                        </q-item-section>

                        <q-item-section>
                            <q-input v-model="correo" borderless dense/>
                        </q-item-section>

                        <q-item-section side>
                            <q-btn flat size="sm" padding="xs" rounded color="grey-6" icon="close" @click="removeAt(index)" />
                        </q-item-section>
                    </q-item>
                </div>
            </q-card-section>

            <div class="row justify-center q-mt-md">
                <q-btn v-close-popup color="secondary" flat :label="actionLabel" v-on:click="no"
                class=" col-5 q-ma-none q-py-md" style="width: 200px; height: 60px;"/>

                <q-btn v-close-popup color="secondary" :label="acceptLabel" v-on:click="si"
                class="col-5 tw-bg-primary q-ma-none q-py-md"  style="width: 200px; height: 60px;"/>
            </div>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import mail from "../../assets/mail.svg";

const emit = defineEmits(['update:modelValue', 'cancel'])
const card = ref(true)

const props = defineProps<{
  title: string,
  label: string,
  modelValue: any,
  actionLabel: string,
  acceptLabel: string,
  action?: () => void
  cancelarAction?: () => void
}>()

const inputFormat = ref()
const correo = ref()

const inputValue = ref()

function no() {
  emit('cancel')
  // props.cancelarAction()
}

function si() {
  props.action()
  card.value = false
}

const selectedItems = ref([])

function removeAt(index) {
  inputValue.value.options.splice(index, 1)
}
</script>
