import type { Method, AxiosRequestConfig } from 'axios'
import http from '@/api/axios'
import type { ApiResponse } from '@/api/interface'
import { handleUrl, isNil, processParams } from '@/utils'
import { ElMessage } from 'element-plus'

interface UseRequestOptions {
  method?: Method
  /**
   * 请求参数 Get和Data请求都用这一个
   */
  params?: any
  /**
   * 非get请求参数
   */
  query?: any
  /**
   * 必须要有的字段才能开始请求
   */
  requiredKeys?: string[]
  /**
   * 是否返回完整数据
   */
  returnFull?: boolean
  /**
   * 默认值
   */
  defaultValue?: any
  /**
   * 是否在条件为真时立即发起请求，当有when时，不再自动发起请求了
   * when与immediate互斥
   */
  when?: Ref<boolean>
  /**
   * 是否立即执行, 默认get会立即执行，post不会立即执行
   */
  immediate?: boolean
  /**
   * 是否阻止重复请求, post默认阻止, get默认不阻止
   */
  preventRepeat?: boolean
  /**
   * 依赖项
   */
  deps?: any[]
  /**
   * 请求结束回调
   */
  onFinally?: () => void
  /**
   * 请求成功回调
   */
  onSuccess?: (data: any) => void
  /**
   * 请求失败回调
   */
  onError?: (error: any) => void
}

// eslint-disable-next-line max-lines-per-function
const useRequest = (
  url: string | Ref<string>,
  {
    method = 'get',
    params = {},
    query = {},
    requiredKeys = [],
    returnFull = false,
    defaultValue = null,
    immediate = true,
    preventRepeat,
    when,
    onFinally,
    onSuccess,
    onError,
    deps
  }: UseRequestOptions = {}
) => {
  const result = ref(defaultValue)
  const loading = ref(false)
  const isGet = method.toLowerCase() === 'get'

  // 请求前的校验
  const checkBeforeRequest = (queryParams: any, reject): Promise<void> => {
    if(typeof queryParams !== 'object') {
      return Promise.resolve()
    }

    if (requiredKeys.length > 0) {
      // 判断是否存在 并 String转换一下，避免 0 的情况
      const hasRequiredKeys = requiredKeys.every(key => !isNil(queryParams[key]))
  
      if (!hasRequiredKeys) {
        reject('缺少必要参数')

        return
      }
    }
    const shoudPreventRepeat = preventRepeat ?? !isGet

    if (shoudPreventRepeat && loading.value) {
      ElMessage.closeAll()
      ElMessage.warning('请求正在进行中，请勿重复调用')
  
      reject('请求正在进行中')

      return
    }
  
    return Promise.resolve()
  }

  const sendRequest = (url, data, resolve, reject) => {
    const options: AxiosRequestConfig = { 
      url, 
      method 
    }

    if(!isNil(data) || !isNil(query)) {
      if(isGet) {
        options.params = { ...query, ...data }
      } else {
        options.data = data
        if (!isNil(query)) options.params = query
      }
    }

    http(options)
    // @ts-ignore
      .then((res: ApiResponse) => {
        if (isGet && !returnFull) {
          result.value = res.data
          resolve(res.data)
        } else {
          result.value = res
          resolve(res)
        }
        onSuccess?.(res)
      })
      .finally(() => {
        loading.value = false
        onFinally?.()
      })
      .catch((error) => {
        result.value = defaultValue
        reject(defaultValue)
        onError?.(error)
      })
  }

  const fetchData = <T = any>(queryP = {}) => {
    const urlValue = unref(url)

    if (!urlValue || urlValue.trim() === '') {
      return Promise.reject(new Error('URL 不能为空'))
    }
    
    return new Promise<T>((resolve, reject) => {
      // 对两次参数进行处理
      const [data, notObject] = processParams(params, queryP)

      checkBeforeRequest(data, reject).then(() => {
        loading.value = true

        const [newUrl, newData] = handleUrl(urlValue, data)
        // 兼容对象如果空的就取非对象的值，这里是处理url通过对象传参改的，然后有的不是对象类型
        const reqData = isNil(newData) ? notObject : newData
        sendRequest(newUrl, reqData, resolve, reject)
      })
    })
  }

  onMounted(() => {
    if (immediate && isGet && typeof when === 'undefined') {
      fetchData()
    }
  })

  if(when) {
    watch(when, (val) => {
      if (val) fetchData()
    })
  }

  if (deps) {
    watch(deps, () => {
      if (immediate && isGet) fetchData()
    }, { deep: true })
  }

  return {
    data: result,
    loading,
    refetch: fetchData
  }
}

export default useRequest
