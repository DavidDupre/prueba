import { defineStore } from 'pinia';
import { ResponseListadotipoDato } from 'src/pages/metadatos/interface';
import { sgdeaAxios } from 'src/services';

interface MetadatoTipoList {
  label: string;
  value: number;
}

export const useListTipoListMetadato = defineStore('listTipoListMetadato', {
    state: () => ({
      listaDesplegableStore:[] as MetadatoTipoList[],
    }),
    actions: {

      async getlistaDesplegableStore(){

        if(this.listaDesplegableStore.length>0){
          return this.listaDesplegableStore;
        }

        const {data}=await sgdeaAxios.get<ResponseListadotipoDato[]>(`/metadato/listadotipoMD`)
        this.listaDesplegableStore = data.map((item) => {
          return {
            label: item.nombre,
            value: item.id,
          };
        }) as MetadatoTipoList[];

        return this.listaDesplegableStore;

      }
    },
    persist: false
});
