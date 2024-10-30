import type { Method } from 'axios'
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
  url: string,
  {
    method = 'get',
    params = {},
    requiredKeys = [],
    returnFull = false,
    defaultValue = null,
    immediate = true,
    preventRepeat,
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
  const checkBeforeRequest = (queryParams: any): Promise<void> => {
    if(typeof queryParams !== 'object') {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      if (requiredKeys.length > 0) {
        // 判断是否存在 并 String转换一下，避免 0 的情况
        const hasRequiredKeys = requiredKeys.every(key => !isNil(queryParams[key]))
  
        if (!hasRequiredKeys) {
          return reject(new Error('缺少必要参数'))
        }
      }
  
      const shoudPreventRepeat = preventRepeat ?? !isGet
  
      if (shoudPreventRepeat && loading.value) {
        ElMessage.closeAll()
        ElMessage.warning('请求正在进行中，请勿重复调用')
  
        return reject(new Error('请求正在进行中'))
      }
  
      resolve()
    })
  }

  const sendRequest = (url, data, resolve, reject) => {
    http({
      url,
      method: method as Method,
      params: isGet ? data : {},
      data: isGet ? {} : data
    })
    // @ts-ignore
      .then((res: ApiResponse) => {
        if (isGet && !returnFull) {
          result.value = res.data
          resolve(res.data)
        } else {
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

  const fetchData = (queryP = {}): Promise<ApiResponse> => {
    if (!url || url.trim() === '') {
      return Promise.reject(new Error('URL 不能为空'))
    }
    
    return new Promise((resolve, reject) => {
      // 对两次参数进行处理
      const [data, notObject] = processParams(params, queryP)

      checkBeforeRequest(data).then(() => {
        loading.value = true

        const [newUrl, newData] = handleUrl(url, data)
        // 兼容对象如果空的就取非对象的值，这里是处理url通过对象传参改的，然后有的不是对象类型
        const reqData = isNil(newData) ? notObject : newData
        sendRequest(newUrl, reqData, resolve, reject)
      })
    })
  }

  onMounted(() => {
    if (immediate && isGet) {
      fetchData()
    }
  })

  if (deps) {
    watch(deps, () => {
      if (immediate && isGet) {
        fetchData()
      }
    }, {
      deep: true
    })
  }

  return {
    data: result,
    loading,
    refetch: fetchData
  }
}

export default useRequest
