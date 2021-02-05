import axios from 'axios'
import { message } from 'antd'

const CONFIG = {
  baseURL: process.env.axiosBaseURL,
}

export default function request(config) {
  const instance = axios.create()

  instance.interceptors.request.use(cfg => {
    // if (token) {
    //   cfg.headers.Authorization = `Bearer ${token}`
    // }
    return cfg
  })

  instance.interceptors.response.use(res => {
    const { code, data, message: msg } = res.data
    if (config.fullRes) {
      return res
    }
    // if (code === 401) {
    //   if (location.pathname !== path) {
    //     window.location.href = path
    //   }
    //   return null
    // }
    if (code !== 0) {
      message.error(msg)
      return null
    }
    return data
  })

  return instance.request({ ...CONFIG, ...config })
}

export const get = (url, config) => {
  return request({
    url,
    method: 'GET',
    ...config,
  })
}

export const del = (url, config) => {
  return get(url, { ...config, method: 'DELETE' })
}

export const post = (url, data, config) => {
  return request({
    url,
    data,
    method: 'POST',
    ...config,
  })
}

export const patch = (url, data, config) => {
  return post(url, data, { ...config, method: 'PATCH' })
}

export const put = (url, data, config) => {
  return post(url, data, { ...config, method: 'PUT' })
}
