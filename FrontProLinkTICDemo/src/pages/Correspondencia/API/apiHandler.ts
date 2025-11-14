import axios, { AxiosInstance, AxiosStatic } from 'axios'
import axiosRetry from 'axios-retry';
import Api from "src/services/Api";



let url: string = "";

try {
    if (process.env.API_CORRESPONDENCIA) {
        url = process.env.API_CORRESPONDENCIA
    }
}
catch (e) {
    console.error(e)
    try {
        url = ``;
    } catch (e) {
        console.error(e)

    }

}
export const baseUrl = url;
//export const baseUrl = "http://aee105e2d074744ea96fd7e88125d569-279764405.us-east-1.elb.amazonaws.com";
//export const baseUrl = await  Api.baseURL();

export default class httpClient {
    urlPrefix: string;
    axiosClient: AxiosStatic | AxiosInstance

    constructor(urlPrefix: string,) {

        let baseHeaders: { [key: string]: string } = {}
        // if($state.token !== null && $state.token !== ""){
        //     baseHeaders["Authorization"] = 'Bearer '+$state.token;
        // }
        this.urlPrefix = urlPrefix;
        this.axiosClient = axios.create({ baseURL: baseUrl, headers: baseHeaders })

        axiosRetry(this.axiosClient, {
            retries: 3,
            retryDelay: (retryCount: any) => {
                return retryCount * 1000;
            },
            retryCondition: (error: any) => {
                return ![200, 201, 400, 401, 403, 419, 422, 500, 501].includes(error.response?.status || 0);
            },

        });

        // @ts-ignore
        this.axiosClient.interceptors.request.use((config: any) => {
            // const { $state } = useAuthStore();
            //  if ($state.token) {
            //      config.headers.Authorization = `Bearer ${$state.token}`;
            //  }
            config.headers.Accept = "application/json";

            return config
        })
    }

    //Metodos

    async get(urlExtraPrefix?: string | undefined) {
        return await this.axiosClient.get(urlExtraPrefix ? this.urlPrefix + urlExtraPrefix : this.urlPrefix)
            .then((response) => { return response })
            .catch((error) => { return error })
    }

    async getWithParams(urlExtraPrefix?: string | undefined, data?: object) {
      return await this.axiosClient.get(urlExtraPrefix ? this.urlPrefix + urlExtraPrefix : this.urlPrefix, data)
          .then((response) => { return response })
          .catch((error) => { return error })
  }

    async post(urlExtraPrefix?: string | undefined, data?: object | undefined) {
        return await this.axiosClient.post(urlExtraPrefix ? this.urlPrefix + urlExtraPrefix : this.urlPrefix, data)
            .then((response) => { return response })
            .catch((error) => { return error })
    }

    async put(urlExtraPrefix?: string | undefined, data?: object | undefined) {
        return await this.axiosClient.put(urlExtraPrefix ? this.urlPrefix + urlExtraPrefix : this.urlPrefix, data)
            .then((response) => { return response })
            .catch((error) => { return error })
    }

    async delete(urlExtraPrefix?: string | undefined, data?: object | undefined) {
        return await this.axiosClient.delete(urlExtraPrefix ? this.urlPrefix + urlExtraPrefix : this.urlPrefix, data)
            .then((response) => { return response })
            .catch((error) => { return error })
    }
}

export const client = new httpClient("")
