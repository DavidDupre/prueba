<template>
    <div class="tw-flex tw-justify-between tw-items-center tw-py-4">
        <span class="tw-font-bold tw-text-3xl tw-my-5">
            Entes de Control
        </span>

        <q-btn label="Radicar" class="tw-h-16 tw-w-36 tw-rounded-lg tw-bg-orange-button tw-text-white tw-text-lg" @click="router.push('/entes-control/crear')"/>
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter()
</script>