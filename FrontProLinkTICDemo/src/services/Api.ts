import axios from "axios";
import {adminAxios, sgdeaAxios} from ".";
import { useLastTutelaStore } from "src/stores/lastTutela.store";
import { useAuthStore } from "src/stores/auth.store";

let url = "";
if (process.env.API) {
  url = process.env.API;
}

const token = useAuthStore();

export default {
  async baseURL() {
    try {
      return url;
    } catch (error: any) {
      console.error("Error", error.message());
    }
  },

  async create(radicadoJson: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "application/json",
      "Content-Type": "application/json",
    };
    let baseURL = url + "/radicados/";

    return axios
      .post(baseURL, radicadoJson, { headers })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async createRadication(formData: any): Promise<any> {
    let baseURL = url + "/radicados/radicado_documento";
    // let baseURL =
    //   "https://3993-181-53-96-103.ngrok-free.app" +
    //   "/radicados/radicado_documento";
    const config = {
      method: "post",
      url: baseURL,
      data: formData,
      // headers: {
      //   "ngrok-skip-browser-warning": "asdasd",
      //   "User-Agent": "custom/non-standard",
      //   "Access-Control-Allow-Origin": "*"
      // }
    };

    return axios(config)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async createAnexo(anexosJson: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "*",
      "Content-Type": "multipart/form-data",
    };

    const fileData = new FormData();

    fileData.append("nombre", anexosJson.nombre);
    fileData.append("file", anexosJson.file);

    fileData.append("radicado", anexosJson.radicado);
    fileData.append("principal", anexosJson.principal);

    let baseURL = url + "/anexos/uploadFile/";
    const response = await axios.post(baseURL, fileData, { headers });

    return response;
  },

  async searchTipoRadicado(
    id_tipo_radicado: any,
    nombreTipoRadicado: any,
    status: any,
    fecha_creacion: any
  ): Promise<any> {
    let id_tipo_radicado_url = "";
    let nombre_tipo_radicado_url = "";
    let status_url = "";
    let fecha_creacion_url = "";

    let page_url = "page=0&";
    let size_url = "size=500&";

    if (id_tipo_radicado !== "") {
      id_tipo_radicado_url = "id=" + id_tipo_radicado + "&";
    }
    if (nombreTipoRadicado !== "") {
      nombre_tipo_radicado_url = "nombre=" + nombreTipoRadicado + "&";
    }
    if (status !== "") {
      status_url = "estado=" + status + "&";
    }
    if (fecha_creacion !== "" && fecha_creacion != undefined) {
      fecha_creacion_url = "fecha_creacion=" + fecha_creacion + "&";
    }

    let baseURL =
      url +
      "/tiporadicados/search?" +
      id_tipo_radicado_url +
      nombre_tipo_radicado_url +
      status_url +
      fecha_creacion_url +
      size_url +
      page_url;

    const response = await axios.get(baseURL);
    return response.data;
  },

  async listContinente(): Promise<any> {
    let baseURL = "/continentes/list";

    return adminAxios
      .get(baseURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async listPais(id_continente: any): Promise<any> {
    let baseURL = "/paises/list/" + id_continente;
    return adminAxios
      .get(baseURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async listDepartamento(id_pais: any): Promise<any> {
    let baseURL = "/departamentos/list/" + id_pais;
    return adminAxios
      .get(baseURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async listMunicipio(id_mmunicipio: any): Promise<any> {
    let baseURL = "/municipios/list/" + id_mmunicipio;
    return adminAxios
      .get(baseURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async listEntidad(id_tipo_entidad: any): Promise<any> {
    let baseURL = url + "/entidades/list/" + id_tipo_entidad;
    return axios
      .get(baseURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async listTipoRadicado(): Promise<any> {
    let baseURL = url + "/entidades/list/23";
    return axios
      .get(baseURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async updateTipoRadicado(dataJson: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "application/json",
      "Content-Type": "application/json",
    };
    let baseURL = url + "/tiporadicados/";

    return axios
      .put(baseURL, dataJson, { headers })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async createTipoRadicado(dataJson: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "application/json",
      "Content-Type": "application/json",
    };
    let baseURL = url + "/tiporadicados/";

    return axios
      .post(baseURL, dataJson, { headers })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async listTipoRadicadoTipoDocumental(): Promise<any> {
    let baseURL = url + "/tipoRadicadotipodocumental/list/";
    return axios
      .get(baseURL)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async createAdministracionVerion(dataJson: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "application/json",
      "Content-Type": "application/json",
    };
    let baseURL = url + "/versiontrd/";

    return axios
      .post(baseURL, dataJson, { headers })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async updateAdministracionVerion(dataJson: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "application/json",
      "Content-Type": "application/json",
    };
    let baseURL = url + "/versiontrd/";

    let dataJsonTmp = dataJson;
    //dataJsonTmp.estado = dataJson.estado.value;
    return await axios
      .put(baseURL, dataJsonTmp, { headers })
      .then((response) => response.data);
  },

  async listAdministracionVerion(dataJson: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "application/json",
      "Content-Type": "application/json",
    };
    let baseURL = url + "/versiontrd/";

    return axios
      .post(baseURL, dataJson, { headers })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  },

  async searchAdministracionVerion(
    codigo: any,
    estado: any,
    fechaVersion: any,
    nombreVersion: any,

    fechaInicio: any,
    fechaFin: any,
    observaciones: any,
    fondo: ""
  ): Promise<any> {
    let codigo_url = "";
    let estado_url = "";
    let fecha_version_url = "";
    let nombre_version_url = "";

    let fecha_inicio_url = "";
    let fecha_fin_url = "";
    let observaciones_url = "";
    let fondo_url = "";

    let page_url = "page=0&";
    let size_url = "size=500&";

    if (codigo !== undefined && codigo !== "") {
      codigo_url = "codigo=" + codigo + "&";
    }
    if (estado !== undefined && estado !== "") {
      estado_url = "estado=" + estado + "&";
    }
    if (fechaVersion !== undefined && fechaVersion !== "") {
      fecha_version_url = "fecha_version=" + fechaVersion + "&";
    }
    if (nombreVersion !== undefined && nombreVersion !== "") {
      nombre_version_url = "nombre=" + nombreVersion + "&";
    }
    if (fechaInicio !== undefined && fechaInicio !== "") {
      fecha_inicio_url = "fecha_inicio=" + fechaInicio + "&";
    }
    if (fechaFin !== undefined && fechaFin !== "") {
      fecha_fin_url = "fecha_fin=" + fechaFin + "&";
    }
    if (observaciones !== undefined && observaciones !== "") {
      observaciones_url = "observaciones=" + observaciones + "&";
    }
    if (fondo !== undefined && fondo !== "") {
      fondo_url = "id_fondo=" + fondo + "&";
    }

    let baseURL =
      url +
      "/versiontrd/search?" +
      codigo_url +
      estado_url +
      fecha_version_url +
      nombre_version_url +
      fecha_inicio_url +
      fecha_fin_url +
      observaciones_url +
      fondo_url +
      size_url +
      page_url;

    const response = await axios.get(baseURL);
    return response.data;
  },

  async getAdministracionVerionById(id: any): Promise<any> {
    let baseURL = url + "/versiontrd/search?id=" + id + "&page=0&size=500&";

    const response = await axios.get(baseURL);
    return response.data;
  },

  async createEstructuraAlfresco(dataJson: any): Promise<any> {
    const headers = {
      Accept: "*/*",
      "Content-Type": "application/json",
    };

    let baseURL = url + "/instalar/estructura_alfresco";

    if (dataJson) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: baseURL,
        headers,
        data: JSON.stringify(dataJson),
      };

      return axios
        .request(config)
        .then((response) => response.data)
        .catch((error) => {
          console.error(error);
          throw error;
        });
    } else {
      console.error("error,data incorrecta");
      throw "error,data incorrecta";
    }
  },
  async radicarTutela(data: any): Promise<any> {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      accept: "*",
      "Content-Type": "multipart/form-data",
      "Content-Transfer-Encoding": "BINARY"
    };

    const formdata = new FormData();
    for (var i = 0; i < data.file.length; i++) {
        formdata.append("archivos", data.file[i]);
    }

    formdata.append('body', JSON.stringify(data.body))

    let baseURL = url + "/tutela";
    const response = await sgdeaAxios.post(baseURL, formdata, { headers });

    return response;
  },

  async subirArchivos(data: any, isDevuelto?: boolean): Promise<any> {

    const headers = {
        "Access-Control-Allow-Origin": "*",
        accept: "*",
        "Content-Type": "multipart/form-data",
        "Content-Transfer-Encoding": "BINARY",
        "Authorization": `Bearer ${token.$state.token}`
    };

    const formdata = new FormData();
    for (var i = 0; i < data.files.length; i++) {
        formdata.append("files", data.files[i]);
    }

    const isDevueltoValue = isDevuelto !== undefined ? isDevuelto : false;

    let baseURL = url + `/tutela/${data.tutelaId}/${data.userId}/${data.tipo}/archivos/subir?es_devolucion=${isDevueltoValue}`;
    
    try {
        const response = await axios.post(baseURL, formdata, { headers });
        return response;
    } catch (error) {
        console.error('Error al subir archivos:', error);
        throw error;
    }
}
};
