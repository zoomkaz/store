import axios, { AxiosRequestConfig } from 'axios'

interface Client {
  data?: unknown | undefined
  method?: string | undefined
  url: string | undefined
  params?: any
  headers?: { [key: string]: string | number } | undefined
}

const BASE_URL = 'http://localhost:7000/api'

const REQUEST_TIMEOUT = 8000

const API = axios.create({
  baseURL: BASE_URL,
  // timeout: REQUEST_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

// добавляем в запрос данные для авторизации с помощью перехватчика (interceptor)
const authInterceptor = (config: any) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.authorization = 'Bearer ' + localStorage.getItem('token')
  }
  return config
}
API.interceptors.request.use(authInterceptor)

export const ApiClient = async ({ data, method = 'GET', url, params, headers }: Client) => {
  const requestParams: AxiosRequestConfig = {
    method,
    url,
    params,
    data,
    responseType: 'json',
    withCredentials: true,
  }

  API.defaults.headers = { ...API.defaults.headers, ...headers }

  return API(requestParams)
    .then((res: any) => ({ data: res.data, status: res.status }))
    .catch((err: any) => {
      console.error(err)
      return { data: err.response?.data.message, status: err.response?.data.status }
    })

}