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

/**
 * 判断是否为空
 * 空字符串、空数组、undefined、null 都为空
 */
export function isNil(value: any): boolean {
  if(value === undefined || value === null || value === '') {
    return true
  }

  if(Array.isArray(value) && value.length === 0) {
    return true
  }

  return false
}

/**
   * @name 处理url
   * @description
   *  1. 如果url中包含:id，params里面传入了id，则将id替换为params中的id，并删除params里面的id
   *  2. 如果url里面包含:id，params也要传入id，则将url的:id替换成其他的名字，并params里面也传入该名字
   * 
   * case 1
   * handleUrl('/list/:id')  => ['/list/:id', {}]
   * handleUrl('/list/:id', { id: 1 })  => ['/list/1', {}]
   * handleUrl('/list/:id')  => ['/list/:id', {}]
   * handleUrl('/list/:id', { id: 1, name: '张三' })  => ['/list/1', { name: '张三' }]
   * handleUrl('/list/:id?name={name}', { id: 1, name: '张三' })  => ['/list/1?name=张三', {}]
   * handleUrl('/list/:id?name={name}', { id: 1, name: '' })  => ['/list/1?name=', {}]
   */
export function handleUrl(url: string, queryParams: any) {
  if (!url.includes(':') && !url.includes('{')) return [url, queryParams]

  const newQueryParams = { ...queryParams }
  let newUrl = url.replace(/\/:(\w+)/g, (match, p1) => {
    const value = newQueryParams[p1]

    if (isNil(value)) {
      return `/:${p1}`
    }
    delete newQueryParams[p1]

    return `/${value}`
  })

  // 分离基础URL和查询字符串部分
  const [baseUrl, queryString] = newUrl.split('?')

  if (queryString) {
    // 处理查询字符串部分
    const processedQuery = queryString.replace(/\{(\w+)\}/g, (match, p1) => {
      const value = newQueryParams[p1]
      delete newQueryParams[p1]

      if (isNil(value)) {
        return ''
      }

      return `${encodeURIComponent(value)}`
    })
      .split('&')
      .filter(param => param !== '')
      .join('&')

    newUrl = baseUrl + (processedQuery ? `?${processedQuery}` : '')
  } 

  // 处理基础URL中的占位符
  newUrl = newUrl.replace(/\{(\w+)\}/g, (match, p1) => {
    const value = newQueryParams[p1]

    if (isNil(value)) {
      return `{${p1}}`
    }

    delete newQueryParams[p1]

    return encodeURIComponent(value)
  })

  return [newUrl, newQueryParams]
}
