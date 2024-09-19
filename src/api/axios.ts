import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router/index'
import { ElMessage } from 'element-plus'
import { RESPONSE_CODE } from './interface'

axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'
const http = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,
  timeout: 60 * 1000
})
const isAlerted = false

// 请求拦截器
http.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    config.data = obj2Params(config.data)
    config.params = obj2Params(config.params)

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    return config
  },
  (error) => {
    return Promise.reject(error.data.error.message)
  }
)

http.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const resData = response.data

    // 业务异常状态提醒
    if (!resData.success && resData.message) {
      ElMessage.error(resData.message)
    }

    return resData
  },
  // 响应错误
  (error) => {
    if (error.response) {
      const status = error.response.status

      if (status === RESPONSE_CODE.TOKEN_INVALID || status === RESPONSE_CODE.PERMISSION_DENIED) {
        if (!isAlerted) {
          ElMessage.warning('登录失效,请重新登陆')
        }
        router.push({ path: '/login' })
      } else if (!!error.response.data.error && !!error.response.data.error.message) {
        ElMessage.error(error.response.data.error.message)
      } else {
        ElMessage.error(error.message)
      }
    } else if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      ElMessage.error('网络访问失败，请稍后重试。')
    } else {
      ElMessage.error(error.message)
    }

    return Promise.reject(error)
  }
)

export default http

//过滤掉值为空的字段
function obj2Params(params: any) {
  if (
    !params ||
    Array.isArray(params) ||
    Object.prototype.toString.call(params) === '[object FormData]'
  ) {
    return params
  }
  const reqParams: any = {}

  Object.keys(params).forEach((key: any) => {
    const val = params[key]

    if (val === 0 || val) {
      reqParams[key] = val
    } else {
      //为空值的则应该设置null，则通信请求会过滤此字段。或者添加此参数。
      // reqParams[key] = null
    }
  })

  return reqParams
}
