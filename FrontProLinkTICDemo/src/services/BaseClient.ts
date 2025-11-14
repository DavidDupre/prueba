

import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

// Constants
const {SOLR} = process.env;


// Desestructuración
const { CancelToken } = axios;
const { source } = CancelToken;

// Constantes
const http: AxiosInstance = axios.create({
	baseURL: SOLR,
	headers: {
		'Content-Type': 'application/json; charset=UTF-8',
		Accept: 'application/json',
		'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin':"*",
		Pragma: 'no-cache',
		Expires: '0',
	},
	cancelToken: source().token,
});



// #region Funciones de validaciones

const extractData = <T>(response: AxiosResponse<T>): T => {
	const { data: S_data } = response;
	//const { data } = S_data;
	return S_data!;
};

const handleError = async (reject: AxiosError<undefined>): Promise<any> => {
	const { response } = reject;

	const status = reject.status;
	/* const message = response?.data.message;
	const content = message ?? 'Por favor intente de nuevo más tarde o póngase en contacto con soporte técnico.'; */

	

	switch (status) {
		case 0:
		case 401:
			console.error("Error de autorizacion")
			break;
	}

	return await Promise.reject(response?.data ?? reject);
};

// #endregion
// #region Interceptores de peticiones http

/* http.interceptors.request.use(
	(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
		const { token } = useTokenStore.getState();
		const { idCompany } = useAccountStore.getState();
		const { headers } = config;

		if (idCompany != null) {
			headers.Company = idCompany;
		}

		if (token != null) {
			headers.Authorization = token;
		}

		return config;
	},
	(error: Error): Promise<Error> => Promise.reject(error)
); */

// #endregion
// #region Metodos CRUD
/**
 * Método de Http para postear información.
 * @param params Configuración del servicio.
 * @returns Promesa con la respuesta del servicio.
 */
const post = async <T, P = T>({
	url,
	payload,
	options,
	
	cancel = false,
}: HttpSetting<P>): Promise<T> => {
	const servicePromise = async (): Promise<T> => {
		
		if (cancel) {
			source().cancel();
		}

		return http
			.post<T>(url, payload, options)
			.then<T>(resp => extractData<T>(resp))
			.catch(error => handleError(error));
	};

	

	
	if (confirm) {
		return servicePromise();
	}

	
	return Promise.reject(new Error('Cancelado por el usuario.'));
};

/**
 * Método de Http para actualizar información.
 * @param params Configuración del servicio.
 * @returns Promesa con la respuesta del servicio.
 */
const put = async <T, P = T>({
	url,
	payload,
	
	options,
	
	cancel = false,
}: HttpSetting<P>): Promise<T> => {
	const servicePromise = async (): Promise<T> => {
	

		if (cancel) {
			source().cancel();
		}

		return http
			.put<T>(url, payload, options)
			.then<T>(resp => extractData<T>(resp))
			.catch(error => handleError(error));
	};


	if (confirm) {
		return servicePromise();
	}

	
	return Promise.reject(new Error('Cancelado por el usuario.'));
};

/**
 * Método de Http para obtener información.
 * @param params Configuración del servicio.
 * @returns Promesa con la respuesta del servicio.
 */
const get = async <T>({
	url,
	
	options,
	
	cancel = false,
}: Omit<HttpSetting, 'configMessageConfirm' | 'payload'>): Promise<T> => {
	
	if (cancel) {
		source().cancel();
	}

	return http
		.get<T>(url, options)
		.then<T>(resp => extractData<T>(resp))
		.catch(error => handleError(error));
};

/**
 * Método de Http para eliminar información.
 * @param params Configuración del servicio.
 * @returns Promesa con la respuesta del servicio.
 */
/** */
const deleted = async <T>({
	url,
	
	options,
	
	cancel = false,
}: Omit<HttpSetting, 'payload'>): Promise<T> => {
	const servicePromise = async (): Promise<T> => {
		

		if (cancel) {
			source().cancel();
		}

		return http
			.delete<T>(url, options)
			.then<T>(resp => extractData<T>(resp))
			.catch(error => handleError(error));
	};

	if (confirm) {
		return servicePromise();
	}

	
	return Promise.reject(new Error('Cancelado por el usuario.'));
};

// #endregion
// #region Interfaces

/** Interface para la configuración de los métodos axios. */
type HttpSetting<T = unknown> = {
	/** Ruta del Endpoint. */
	url: string;
	/** Mostrar el loading, por defecto es true. */
	loading?: boolean;
	/** Cuerpo del servicio. */
	payload?: Partial<T>;
	/** Configuraciones del mensaje */
	//configMessageConfirm?: MessageProps | boolean;
	/** Configuraciones del mensaje de respuesta. */
	//configMessageResolve?: MessageProps | boolean;
	/** Mostrar mensajes de error. */
	//configMessageReject?: CustomConfigMesage;
	/** Configuraciones generales del axios. */
	options?: {
		headers?: Record<string, string | number | boolean>;
		params?: unknown;
	};
	/** Cancelar la petición anterior. */
	cancel?: boolean;
};

//type CustomConfigMesage = ((message?: Message) => MessageProps) | boolean;
/* type Message = Pick<ModalFuncProps, 'title' | 'content' | 'type'>; */

type T = {
	message?: string;
	data?: T;
	count: number;
	responseTime: string;
	code: number;
};

// #endregion

export { post, put, get, deleted };
export type { HttpSetting };