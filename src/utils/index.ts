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

  if (Array.isArray(unreffedObj)) {
    return unreffedObj.map(deepToValue) as any
  }

  const result = {} as T

  for (const key in unreffedObj) {
    const value = unreffedObj[key]
    
    if (typeof value === 'object' && value !== null) {
      result[key] = deepToValue(value)
    } else {
      result[key] = toValue(value)
    }
  }

  return result
}

/**
 * 重置表单项
 * 直接取字段重置，不会丢失响应
 */
export const resetFormFields = (form: Recordable, formRef?: Ref<FormInstance>) => {
  formRef?.value?.resetFields()

  for (const key in form) {
    if (typeof form[key] === 'string') {
      form[key] = ''
    } else if (typeof form[key] === 'number') {
      form[key] = undefined
    } else if (Array.isArray(form[key])) {
      form[key] = []
    } else if (typeof form[key] === 'boolean') {
      form[key] = false
    } else if (form[key] instanceof Date) {
      form[key] = null
    } else {
      form[key] = null
    }
  }
}
