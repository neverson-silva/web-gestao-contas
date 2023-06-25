import { api } from '@apis/api'
import { useState } from 'react'
import { FormInstance } from 'antd/lib/form'
import { AxiosResponse } from 'axios'

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'
type RequestResult<T = any> = AxiosResponse<T, any> | undefined

type UseRequestResult<TParams = any, TData = any> = {
  loading: boolean
  error: boolean
  errorMessage?: string
  data?: TData
  mutate: {
    (): Promise<RequestResult<TData>>
    (data: Record<any, any>): Promise<RequestResult<TData>>
    (form: FormInstance<TParams>): Promise<RequestResult<TData>>
    (form: FormInstance<TParams>, formValues: TParams): Promise<
      RequestResult<TData>
    >
  }
  fetch: {
    (): Promise<RequestResult<TData>>
    (params: Record<any, any>): Promise<RequestResult<TData>>
    (form: FormInstance<TParams>): Promise<RequestResult<TData>>
    (form: FormInstance<TParams>, formValues: TParams): Promise<
      RequestResult<TData>
    >
  }
}
type UseRequestParameters<TForm> = {
  url: string
  method: HttpMethod
  form?: FormInstance<TForm>
  mapper?: (form: FormInstance<TForm>, formValues: TForm) => TForm | any
  headers?: Record<string, string>
}

// @ts-ignore
export const useRequest = <TForm = any, TData = any>({
  url,
  method,
  form,
  mapper,
  headers,
}: UseRequestParameters<TForm>): UseRequestResult<TForm> => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [data, setData] = useState<TData>()
  const interpolateRouteParams = (url: string, params: Record<string, any>) => {
    let interpolatedUrl = url

    if (url.includes(':')) {
      Object.keys(params).forEach((param) => {
        const paramValue = params[param]

        const hasParam = new RegExp(`:${param}`).test(interpolatedUrl)
        interpolatedUrl = interpolatedUrl.replace(`:${param}`, paramValue)

        if (hasParam) {
          delete params[param]
        }
      })
    }
    return interpolatedUrl
  }
  const performRequest = async (
    params?: Record<string, any>
  ): Promise<RequestResult> => {
    try {
      setLoading(true)
      setError(false)
      setErrorMessage(undefined)

      let requestParams: any

      if (method === 'get') {
        requestParams = [{ params, headers }]
      } else {
        requestParams = [params, { headers }]
      }

      const finalUrl = interpolateRouteParams(url, params!)

      const response = await api[method](finalUrl, ...requestParams)

      setData(response.data)

      return response
    } catch (error: any) {
      setError(true)
      setErrorMessage(
        error?.response?.data?.message ?? 'Ocorreu um erro na requisição'
      )
      setData(undefined)
    } finally {
      setLoading(false)
    }
  }

  const mutate: any = (
    data?:
      | TForm
      | ((form: FormInstance<TForm>) => Record<string, any>)
      | ((form: FormInstance<TForm>, formValues: TForm) => Record<string, any>)
  ): // @ts-ignore
  Promise<RequestResult> => {
    if (method === 'get') {
      throw new Error(
        'Não é possível usar objeto de dados com requisições GET.'
      )
    }
    if (typeof data === 'function' || mapper !== undefined) {
      if (form) {
        const formValues = form.getFieldsValue(true)
        const params = mapper
          ? mapper(form, formValues)
          : // @ts-ignore
            data(form, formValues)
        return performRequest(params)
      }
    } else if (typeof data === 'object') {
      // @ts-ignore
      return performRequest(data)
    } else {
      if (form) {
        const formValues = form.getFieldsValue(true)
        return performRequest({ ...formValues })
      } else {
        throw new Error(
          'Não é possível fazer uma requisição sem fornecer dados ou uma instância de formulário.'
        )
      }
    }
  }

  const fetch: any = (
    dataOrForm?:
      | TForm
      | ((form: FormInstance<TForm>) => Record<string, any>)
      | ((form: FormInstance<TForm>, formValues: TForm) => Record<string, any>)
  ): // @ts-ignore
  Promise<RequestResult> => {
    if (method !== 'get') {
      throw new Error(
        'Não é possível usar o método "fetch" com requisições diferentes de GET.'
      )
    }

    if (typeof dataOrForm === 'function' || mapper !== undefined) {
      if (form) {
        const formValues = form.getFieldsValue(true)
        const params = mapper
          ? mapper(form, formValues!)
          : // @ts-ignore
            dataOrForm(form, formValues)
        return performRequest(params)
      }
    } else if (typeof dataOrForm === 'object') {
      return performRequest(dataOrForm as any)
    } else {
      if (form) {
        const formValues = form.getFieldsValue(true)
        return performRequest({ ...formValues })
      } else {
        throw new Error(
          'Não é possível fazer uma requisição sem fornecer dados ou uma instância de formulário.'
        )
      }
    }
  }

  return {
    loading,
    error,
    errorMessage,
    data,
    mutate,
    fetch,
  }
}
