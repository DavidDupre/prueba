// src/stores/ui.store.ts

import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    // Este estado controlará si el modal de contraseña debe estar visible
    isPasswordModalOpen: false,
  }),
  actions: {
    // Una acción para abrir el modal desde cualquier componente
    openPasswordModal() {
      this.isPasswordModalOpen = true;
    },
    // Una acción para cerrar el modal
    closePasswordModal() {
      this.isPasswordModalOpen = false;
    },
  },
});