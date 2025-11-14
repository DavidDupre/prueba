<template>
  <div class="dark-background">
    <q-spinner-pie
      color="secondary"
      size="70px"
    />
    <div class="message">{{text}}</div>
  </div>
</template>

<script>
export default {
  name: 'DarkSpinner',
  // add text prop
  props: {
    text: {
      type: String,
      default: 'Espere un momento...'
    }
  }
}
</script>

<style src="./LoadingScreen.css" scoped></style>
