import { assign } from 'lodash-es'

/**
 * 重写number.toFixed，解决四舍五入问题
 * @returns
 */
export function toFixed(value: number, precision: number): string {
  if (typeof value === 'undefined') return ''

  return new Intl.NumberFormat(undefined, {
    useGrouping: false,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value)
}

/**
 * 格式化金钱
 * currency格式: ['zh-CN', 'CNY']
 * @returns
 */
export function toMoney(value: number, precision = 0, currency?: [string, string]): string {
  if (typeof value === 'undefined') return ''

  const lang = currency ? currency[0] : undefined
  const options = {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }

  if (currency) {
    assign(options, { style: 'currency', currency: currency[1] })
  }

  return new Intl.NumberFormat(lang, options).format(value)
}

/**
 * 将数字添加逗号
 * @returns 
 */
export function toCommas(value: number | string, precision = 0): string {
  if(typeof value === 'undefined') return value

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(+value)
}

/**
 * 转换为单位
 * en-US: ["1.2K", "123K", "1.2B", "1.2T", "12,236T"]
 * zh-CN: ["1.2万", "123万", "1.2亿", "1.2万亿", "12,236亿"]
 */
export function toLocal(value: number, language: string): string {
  if (typeof value === 'undefined') return ''

  return new Intl.NumberFormat(language, { notation: 'compact' } as any).format(value)
}
