<template>
  <div class="!tw-z-[9999] tw-w-full tw-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center tw-gap-4 loading-overlay ">
    <span class="loader tw-w-40"></span>
    <h2 class="tw-font-semibold tw-text-2xl">Consultando Información</h2>
    <p class="tw-text-lg tw-font-normal">Espere un momento...</p>
  </div>
</template>

<style lang="css">
/* HTML: <div class="loader"></div> */
.loader {
  width: 150px;
  aspect-ratio: 1;
  display:grid;
  -webkit-mask: conic-gradient(from 15deg,#0000,#000);
  animation: l26 1s infinite steps(12);
}
.loader,
.loader:before,
.loader:after{
  background:
    radial-gradient(closest-side at 70% 12.5%,
     #ff7500 96%,#0000) 50% 0/20% 80% repeat-y,
    radial-gradient(closest-side at 12.5% 70%,
     #ff7500 90%,#0000) 0 50%/80% 20% repeat-x;
}
.loader:before,
.loader:after {
  content: "";
  grid-area: 1/1;
  transform: rotate(30deg);
}
.loader:after {
  transform: rotate(60deg);
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.893);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
@keyframes l26 {
  100% {transform:rotate(1turn)}
}
</style>
