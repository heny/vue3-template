
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
