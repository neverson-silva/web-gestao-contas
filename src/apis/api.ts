import { Usuario } from '@models/auth'
import { notification } from 'antd'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import jwtDecode from 'jwt-decode'
import moment from 'moment'

export class ApiService {
	 private readonly BASE_URL = import.meta.env.VITE_API_URL ??
	 	'https://api-gestaocontas-eqilywar6a-uc.a.run.app/api/v1'
	//private readonly BASE_URL = 'http://localhost:9090/api/v1'

	private _axios: AxiosInstance
	// private token: string | null
	// private expiresIn: Date | null

	constructor() {
		this._axios = axios.create({
			baseURL: this.BASE_URL,
		})

    // Adicione o interceptor para redirecionar para a tela de login quando ocorrer erro de status 401
    this._axios.interceptors.response.use(
      response => response, // Caso a resposta seja bem-sucedida, retorne-a diretamente
      async (error) => {
        if (error?.response?.status === 401 && await localStorage.getItem('token')) {

          await localStorage.clear();
          // Redirecione para a tela de login
          window.location.href = '/login'; // Substitua '/login' pela rota da sua tela de login
        }
        return Promise.reject(error);
      }
    );
	}

	async login(conta: string, senha: string): Promise<Usuario> {
		return await this.post('/auth/login', { conta, senha })
			.then((response) => {
				localStorage.setItem('token', response.data.accessToken)

				const decoded = new Date(
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					Number(jwtDecode(response.data.accessToken).exp) * 1000,
				)

				localStorage.setItem('expiresIn', moment(decoded).toISOString())

				return response.data
			})
			.catch((err) => {
				if (err?.response?.status === 401) {
					notification.error({
						message: 'Falha na autenticação',
						description: 'Usuário e/ou senha inválidos, tente novamente',
					})
					return
				}
				console.log(err)
			})
	}

	logout() {
		localStorage.clear()
	}

	private getAuthHeaders(config?: AxiosRequestConfig): AxiosRequestConfig {
		const token = localStorage.getItem('token')
		const expiresIn = localStorage.getItem('expiresIn')

		if (!token) {
			return {}
		}
		if (expiresIn && moment().isSameOrAfter(expiresIn)) {
			// throw new Error('Credenciais inválidas')
			notification.error({
				message: 'Ocorreu um erro',
				description: 'Credenciais inválidas',
			})
			this.logout()
      window.location.href = '/login'
		}

		if (config) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (!config.headers) {
				config.headers = {}
			}
			config.headers['Authorization'] = `Bearer ${token}`
			return config
		} else {
			return {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			} as unknown as AxiosRequestConfig
		}
	}

	async get<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>,
	): Promise<R> {
		return await this._axios.get(url, this.getAuthHeaders(config))
	}

	async delete<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>,
	): Promise<R> {
		return await this._axios.delete(url, this.getAuthHeaders(config))
	}

	async options<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>,
	): Promise<R> {
		return await this._axios.options(url, this.getAuthHeaders(config))
	}

	async post<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>,
	): Promise<R> {
		return await this._axios.post(url, data, this.getAuthHeaders(config))
	}

	async put<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>,
	): Promise<R> {
		return await this._axios.put(url, data, this.getAuthHeaders(config))
	}

	async patch<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>,
	): Promise<R> {
		return await this._axios.patch(url, data, this.getAuthHeaders(config))
	}
}

export const api = new ApiService()
