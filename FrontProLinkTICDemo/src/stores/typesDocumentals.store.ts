import { defineStore } from 'pinia';
import { TypeDocumentalObject, TypeDocumentalObjectBase } from 'src/pages/SGDA/Administracion/crear/interfaces';

// @ts-ignore
export const useTypeDocumentalsStore = defineStore('tiposDocumentales', {
    state: () => ({
      dataEdit: new TypeDocumentalObject(),
      isEdit: false,
    }),
    actions: {
        async setEditProcedure(val){
          this.isEdit = val;
        },
      async setDataEdit(data: TypeDocumentalObjectBase) {
          this.dataEdit = data;
        }
    },
    persist: false
});
