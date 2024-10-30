import type { FormInstance } from 'element-plus'

interface ResetFormFieldsProps {
  keys?: string[]
  formRef?: Ref<FormInstance>
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
  { keys = [], formRef }: ResetFormFieldsProps = {}
) => {
  if (!form) return

  if (formRef) {
    formRef.value?.resetFields(keys)
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

  if (keys.length > 0) {
    for (const key of keys) {
      const path = key.split('.')
      resetNestedField(form, path)
    }
  } else {
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        form[key] = resetField(form[key])
      }
    }
  }
}

export default resetFormFields
