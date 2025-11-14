<template>
    <q-card class="tw-rounded-xl tw-mt-4" flat bordered>
        <q-expansion-item default-opened>
            <template v-slot:header>
                <div class="col row">
                    <b class="tw-text-lg">
                        {{ data.title }}
                    </b>
                </div>
            </template>

            <div class="row items-center justify-between q-col-gutter-md q-pb-md q-pl-md">
                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3" v-for="items in data.fields">
                    <p class="input_title tw-font-semibold text-grey-9 tw-mb-3">{{ items.label }}</p>
                    <span class="input_text" v-if="items.method">{{ items?.method(values[items.value]) }}</span>
                    <span class="input_text" v-else>{{ values[items.value] }}</span>
                </div>
            </div>
        </q-expansion-item>
    </q-card>
</template>

<script setup lang="ts">
import { DetailsVisualization } from ".";

const props = defineProps<{
  data: DetailsVisualization,
  values: any
}>()
</script>