import type { FormInstance } from 'element-plus'

/**
 * 默认值处理
 * @returns
 */
export const defaultWithValue = (value, { defaultValue = '-', pre = '', suf = '' } = {}) => {
  const hasValue = typeof value !== 'undefined'
  if (!hasValue) return defaultValue

  const v = hasValue ? value : defaultValue

  return `${pre}${v}${suf}`
}

interface MessageBeforeCloseParams {
  /**
   * 请求方法
   */
  fetch: (params?: any) => Promise<any>
  /**
   * 请求参数
   */
  params?: any
  /**
   * 错误时是否保持弹窗，默认是关闭
   */
  errKeepBox?: boolean
  /**
   * 成功处理
   */
  onSuccess?: (res: any) => void
  /**
   * 错误处理
   */
  onError?: (error: any) => void
}

/**
 * messagebox 需要请求接口后关闭的公共函数
 */
export const handleMsgConfirm = ({ fetch, params, onSuccess, onError, errKeepBox = false }: MessageBeforeCloseParams) => {
  return (action, instance, done) => {
    if (action === 'confirm') {
      instance.confirmButtonLoading = true

      fetch(params)
        .then(async (res) => {
          /**
           * return Promise.reject() 可阻止弹窗关闭
           */
          if(onSuccess) {
            await onSuccess(res)
          }
          done()
        })
        .catch((error) => {
          onError(error)

          if(!errKeepBox) done()
        })
        .finally(() => {
          instance.confirmButtonLoading = false
        })
    } else {
      done()
    }
  }
}

type TypeOf = 'String' | 'Number' | 'Boolean' | 'Array' | 'Object' | 'Function' | 'Date' | 'Null' | 'Undefined'

export const typeOf = (value: any): TypeOf => Object.prototype.toString.call(value).slice(8, -1) as TypeOf

/**
 * 深度解ref
 * 普通的toValue在处理普通对象时，还是需要.value
 * toValue(ref({})) => {a: {b: 1}}
 * toValue({ name: ref('张三') }) => { name: ref('张三') }
 * deepToValue({ name: ref('张三') }) => { name: '张三' }
 */
export function deepToValue<T extends Record<string, any>>(obj: T | Ref<T>): T {
  const unreffedObj = toValue(obj)
  
  if (typeof unreffedObj !== 'object' || unreffedObj === null) {
    return unreffedObj
  }

  // 处理Date类型
  if (typeOf(unreffedObj) === 'Date') {
    return unreffedObj as any
  }

  if (Array.isArray(unreffedObj)) {
    return unreffedObj.map(deepToValue) as any
  }

  const result = {} as T

  for (const key in unreffedObj) {
    const value = unreffedObj[key]
    
    if (typeof value === 'object' && value !== null) {
      // 处理Date类型
      if (typeOf(value) === 'Date') {
        result[key] = value
      } else {
        result[key] = deepToValue(value)
      }
    } else {
      result[key] = toValue(value)
    }
  }

  return result
}
