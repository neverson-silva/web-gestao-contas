import { Usuario } from '@models/auth'
import { notification } from 'antd'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import jwtDecode from 'jwt-decode'
import moment from 'moment'
import { isValidValue } from '@utils/util.ts'
import cryptojs from 'crypto-js'
import { encode as base64_encode, decode as base64_decode } from 'base-64'

export class ApiService {
  private readonly useEncryptation =
    import.meta.env.VITE_USE_ENCRYPTATION == 'true'

  private readonly BASE_URL = import.meta.env.VITE_API_URL

  private readonly publicKey = import.meta.env.VITE_PUBLIC_KEY

  private _axios: AxiosInstance

  constructor() {
    this.setUp()
  }

  public getInstance(): AxiosInstance {
    return this._axios
  }

  private setUp() {
    this._axios = axios.create({
      baseURL: this.BASE_URL,
    })

    // Adicione o interceptor para redirecionar para a tela de login quando ocorrer erro de status 401
    this._axios.interceptors.response.use(
      (response) => {
        const chave = this.obterChave()

        response.data = this.decriptarDados(
          response.data?.data ?? response?.data,
          chave
        )
        return response
      }, // Caso a resposta seja bem-sucedida, retorne-a diretamente
      (error) => {
        if (error?.response?.status === 401 && localStorage.getItem('token')) {
          localStorage.clear()
          // Redirecione para a tela de login
          window.location.href = '/login' // Substitua '/login' pela rota da sua tela de login
        }
        return Promise.reject(error)
      }
    )

    // Adicione o interceptor para redirecionar para a tela de login quando ocorrer erro de status 401
    this._axios.interceptors.request.use(
      // Função para interceptar e modificar as requisições
      (config) => {
        const chave = this.obterChave()
        config.data = this.encriptarDados(config.data, chave)
        config.params = this.encriptarDados(config.params, chave)
        // config.headers['data'] = encriptar(config.headers, this.publicKey)

        return config
      },
      async (error) => {
        return Promise.reject(error)
      }
    )
  }
  async login(conta: string, senha: string): Promise<Usuario> {
    return await this.post('/auth/login', { conta, senha })
      .then((response) => {
        localStorage.setItem('token', response.data.accessToken)

        const decoded = new Date(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          Number(jwtDecode(response.data.accessToken).exp) * 1000
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
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.get(url, this.getAuthHeaders(config))
  }

  async delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.delete(url, this.getAuthHeaders(config))
  }

  async options<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.options(url, this.getAuthHeaders(config))
  }

  async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.post(url, data, this.getAuthHeaders(config))
  }

  async put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.put(url, data, this.getAuthHeaders(config))
  }

  async patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R> {
    return await this._axios.patch(url, data, this.getAuthHeaders(config))
  }

  private obterChave(): string {
    const token = localStorage.getItem('token')
    const usuario = isValidValue(token)
      ? // @ts-ignore
        (jwtDecode(token)?.usuario as unknown as Usuario)
      : undefined
    const composicao = usuario
      ? `${usuario?.id}|${usuario?.login}|${usuario?.pessoa.id}|${usuario?.pessoa.nome}|${usuario?.pessoa.sobrenome}`
      : this.publicKey
    return cryptojs.enc.Base64.stringify(cryptojs.enc.Utf8.parse(composicao))
  }

  private decriptarDados(value: any, chave: string): any {
    if (this.useEncryptation) {
      if (!isValidValue(value)) {
        return value
      }
      try {
        const decriptado = cryptojs.AES.decrypt(
          base64_decode(value?.data ?? value),
          chave
        )
        const plainText = decriptado.toString(cryptojs.enc.Utf8)
        return JSON.parse(plainText)
      } catch (e: any) {
        return value
      }
    }
    return value
  }

  private encriptarDados(data: any, chave: string): any {
    if (this.useEncryptation) {
      if (!isValidValue(data)) {
        return data
      }
      try {
        const mensagem = JSON.stringify(data)

        const dados = cryptojs.AES.encrypt(mensagem, chave).toString()

        return { data: base64_encode(dados) }
      } catch (e: any) {
        return data
      }
    }
    return data
  }
}

export const api = new ApiService()
