// store/loading.js
import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    textLoading: 'Espere un momento...',
  }),
  actions: {
    showLoading(textLoading = 'Espere un momento...') {
      this.isLoading = true;
      this.textLoading = textLoading;
    },
    hideLoading() {
      this.isLoading = false;
      this.textLoading = 'Espere un momento...';
    },
  },
});
