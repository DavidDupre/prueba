// store/metadatos.ts

import { defineStore } from "pinia";
import { sgdeaAxios } from "src/services"; // Asegúrate de importar tu servicio Axios aquí

export const useMetadatosStore = defineStore("metadatos", {
  state: () => ({
    formData: {
      tramite: "",
      rol: "",
      oficina: "",
      filterOficina: "",
      estado: "",
      metadatos: [],
    },
    errors: {
      tramite: null,
      rol: null,
      oficina: null,
      estado: null,
    },
  }),

  actions: {
    async saveMetadato(
      metadatos: any
    ) {
      try {
        const response = await sgdeaAxios.post(
          "/parametrizacion-formulario/save",
          metadatos
        );
      } catch (error) {
        console.error("Error al guardar metadato:", error);
        throw error; // Re-lanzar el error para manejarlo en el componente Vue
      }
    },

    async deleteRow(id:any) {
      try {
        // Realizar la llamada para eliminar el elemento en el backend
        const response = await sgdeaAxios.delete(
          `/parametrizacion-formulario/delete?param_id=${id}`
        );
      } catch (error) {
        console.error("Error al eliminar", error);
      }
    },

    async updateAccept(row: any) {
      try {
        const response = await sgdeaAxios.put(
          `/parametrizacion-formulario/updateVisible/${row.id}`
        );
      } catch (error) {
        console.error("Error al actualizar", error);
        throw error; // Re-lanzar el error para manejarlo en el componente Vue si es necesario
      }
    },
  },

});
