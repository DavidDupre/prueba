import { defineStore } from 'pinia';

export const useDocumentStore = defineStore('document', {
  state: () => ({
    documentContent: localStorage.getItem('documentContent') || '', // Inicializa desde localStorage si existe
  }),
  actions: {
    setDocumentContent(content) {
      this.documentContent = content;
      localStorage.setItem('documentContent', content); // Guarda el contenido en localStorage
    },
    clearDocumentContent() {
      this.documentContent = '';
      localStorage.removeItem('documentContent'); // Limpia el contenido de localStorage
    }
  }
});
