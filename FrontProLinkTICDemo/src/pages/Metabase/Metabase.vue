<template>
  <div>
  <iframe class="tw-w-full" style="height: calc(100vh - 96px)" :src="urlFrameMetaBase" />
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { generateToken, url } from '.';

const urlFrameMetaBase= ref('')

onMounted(() => {
  urlFrameMetaBase.value=`${url}/embed/dashboard/${generateToken()}#bordered=true&titled=true`
});

</script>
