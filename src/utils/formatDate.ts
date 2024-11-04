import dayjs from 'dayjs'
import { typeOf } from './index'

/**
 * 判断字符串是否为有效的日期时间格式
 * @param value 要判断的值
 * @returns boolean
 * 
 * @example
 * isValidDate('2024-03-20') // true
 * isValidDate('2024-03-20 15:14:24') // true
 * isValidDate('2024-03-20T15:14:24.000Z') // true
 * isValidDate('Wed Mar 20 2024 15:14:24 GMT+0800') // true
 * isValidDate('1233') // false
 * isValidDate('不是日期字符串') // false
 */
export function isValidDate(value: any): boolean {
  // 如果不是字符串，直接返回false
  if (typeof value !== 'string') {
    return false
  }

  // 常见日期格式的正则表达式
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}/, // 匹配 YYYY-MM-DD 开头
    /^\d{4}\/\d{2}\/\d{2}/, // 匹配 YYYY/MM/DD 开头
    /^[A-Za-z]{3}\s[A-Za-z]{3}\s\d{2}/, // 匹配 Wed Mar 20 开头
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, // 匹配 ISO 格式
  ]

  // 检查是否匹配任一日期格式
  const matchesDatePattern = datePatterns.some(pattern => pattern.test(value))

  if (!matchesDatePattern) {
    return false
  }

  // 使用dayjs解析并验证
  const date = dayjs(value)

  return date.isValid() && !isNaN(date.valueOf())
}


interface HandleParamsDateOptions {
  format?: string
  /**
   * 是否需要验证字符串是否为有效的日期时间格式
   * @default false
   */
  shoudValidString?: boolean
}

/**
 * 处理参数中的日期，将日期格式化为指定格式
 * 传给后端做处理，后端取的时间与前端不同，如果不做处理的话，后端取的时间会少8小时
 * @returns 
 */
export function handleParamsDate(params: any, options: HandleParamsDateOptions = {}) {
  const {
    format = 'YYYY-MM-DD HH:mm:ss',
    shoudValidString = false,
  } = options

  if (typeOf(params) === 'Date') {
    return dayjs(params).format(format)
  }

  if (typeOf(params) === 'Array') {
    return params.map((item) => handleParamsDate(item, { format, shoudValidString }))
  }

  if(typeof params === 'string' && shoudValidString) {
    const isValid = isValidDate(params)

    if(!isValid) return params

    return dayjs(params).format(format)
  }

  if(typeOf(params) === 'Object') {
    for (const key in params) {
      params[key] = handleParamsDate(params[key], { format, shoudValidString })
    }
  }

  return params
}

/**
 * 将字符串格式化为指定格式
 * @param value 要格式化的值
 * @param format 格式化格式
 * @returns 
 */
export function toFormat(value: string, format: string) {
  const isValid = isValidDate(value)

  if(!isValid) return value

  return dayjs(value).format(format)
}
