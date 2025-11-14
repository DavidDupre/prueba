import Api from './Api';
import axios from 'axios';
import { filterObject } from 'src/helpers/filters';

export default {

    async TrdExport(requestBody: any): Promise<void> {
      try {
        const url =`${await Api.baseURL()}/tablaRetencionDocumental/exportar`;
        const response = await axios.post(url,requestBody);

        return response.data;

      } catch (error: any) {
        console.error("Error", error);
      }
    },

    async getPaginate(pageNumber: number,pageSize: number,requestBodyTemp: any): Promise<void> {
      let response: any = "";
      try {
        const requestBody = filterObject({
          codigoDependencia: isNaN(parseInt(requestBodyTemp.codigoSerie))
            ? undefined
            : parseInt(requestBodyTemp.codigoSerie),
          dependencia: requestBodyTemp.dependencia?.value ?? null,
          disposicionFinal: requestBodyTemp.disposicionFinal.value ?? undefined,
          idSerie: requestBodyTemp.codigoSubserie.value ?? undefined,
          idSubserie: requestBodyTemp.estado.value ?? undefined,
          procedimiento: requestBodyTemp.procedimiento ?? undefined,
          tiempoGestion: requestBodyTemp.tiempoGestion ?? undefined,
          tiempoCentral: requestBodyTemp.tiempoCentral ?? undefined,
        });

        const url =`${await Api.baseURL()}/tablaRetencionDocumental/paginate?pageNumber=0&pageSize=50`;
        response = await axios.post(url,{
         ...requestBody
        });
        return response.data;

      } catch (error: any) {
        console.error("Error", error.message());
      }
    },

    async getSeries(){
      try {

        const url =`${await Api.baseURL()}/tablaRetencionDocumental/series`;
        const response = await axios.get(url,);

        return response.data;

      } catch (error: any) {
        console.error("Error", error.message());
      }
    }

};


