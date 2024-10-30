import type { FormInstance } from 'element-plus'

interface ResetFormFieldsProps {
  /**
   * 指定哪些字段清除
   */
  keys?: string[]
  /**
   * 指定哪些字段不清理
   */
  omitKeys?: string[]
  /**
   * 表单清除
   * 
   */
  formRef?: Ref<FormInstance>
}

const isPathExcluded = (path: string, omitKeys: string[]) => {
  return omitKeys.some(omitKey => {
    // 将当前路径和排除路径都转换为数组
    const currentPath = path.split('.')
    const omitPath = omitKey.split('.')
    
    // 如果当前路径长度小于排除路径，不可能匹配
    if (currentPath.length < omitPath.length) return false
    
    // 检查路径前缀是否匹配
    return omitPath.every((segment, index) => currentPath[index] === segment)
  })
}

/**
 * demo
 * const form = reactive({
 *  name: 'test',
 *  info: {
 *    age: 18
 *  }
 * })
 * case 1: 重置单个字段
 * resetFormFields(form, { keys: ['name'] })
 * case 2: 重置嵌套字段
 * resetFormFields(form, { keys: ['info.age'] })
 * case 3: 重置所有字段
 * resetFormFields(form)
 */

/**
 * 重置响应式的对象值
 * 直接取字段重置，不会丢失响应
 */
const resetFormFields = (
  form: Recordable,
  { keys = [], omitKeys = [], formRef }: ResetFormFieldsProps = {}
) => {
  if (!form) return

  if (formRef) {
    // 如果有omitKeys，则获取所有字段并过滤掉被排除的字段
    let fieldsToReset = keys
    
    if (omitKeys.length) {
      fieldsToReset = Object.keys(form).filter(key => !omitKeys.includes(key))
    }

    /**
     * 使用formRef重置一遍之后再重置一遍
     * formRef的重置主要能清除校验错误
     */
    formRef.value?.resetFields(fieldsToReset)
  }

  const resetField = (field) => {
    if (typeof field === 'string') {
      return ''
    } else if (typeof field === 'number') {
      return undefined
    } else if (Array.isArray(field)) {
      return []
    } else if (typeof field === 'boolean') {
      return false
    } else if (field instanceof Date) {
      return null
    } else if (typeof field === 'object' && field !== null) {
      for (const key in field) {
        if (Object.prototype.hasOwnProperty.call(field, key)) {
          field[key] = resetField(field[key])
        }
      }

      return field
    }
 
    return null
    
  }

  const resetNestedField = (obj, path) => {
    if (path.length === 1) {
      if (Object.prototype.hasOwnProperty.call(obj, path[0])) {
        obj[path[0]] = resetField(obj[path[0]])
      }
    } else {
      const [first, ...rest] = path

      if (obj[first] !== undefined) {
        resetNestedField(obj[first], rest)
      }
    }
  }

  const resetAllFields = (obj, parentPath = '') => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const currentPath = parentPath ? `${parentPath}.${key}` : key
        
        if (isPathExcluded(currentPath, omitKeys)) {
          continue
        }

        if (typeof obj[key] === 'object' && obj[key] !== null && !(obj[key] instanceof Date)) {
          resetAllFields(obj[key], currentPath)
        } else {
          obj[key] = resetField(obj[key])
        }
      }
    }
  }

  if (keys.length > 0) {
    for (const key of keys) {
      if (isPathExcluded(key, omitKeys)) continue
      const path = key.split('.')
      resetNestedField(form, path)
    }
  } else {
    resetAllFields(form)
  }
}

export default resetFormFields
