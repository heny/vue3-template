import { describe, test, expect, beforeEach } from 'vitest'
import resetFields from '../resetFields'

describe('resetFields', () => {
  let form: any

  beforeEach(() => {
    // 在每个测试用例前重置表单数据
    form = reactive({
      name: 'test',
      age: 18,
      info: {
        name: 'test',
        age: 18
      }
    })
  })

  test('基本测试', () => {
    resetFields(form)

    expect(form).toStrictEqual({
      name: '',
      age: undefined,
      info: {
        name: '',
        age: undefined
      }
    })
  })

  test('嵌套测试', () => {
    resetFields(form, { keys: ['name', 'info.name'] })

    expect(form).toStrictEqual({
      name: '',
      age: 18,
      info: {
        name: '',
        age: 18
      }
    })
  })

  test('omit 测试', () => {
    resetFields(form, { omitKeys: ['age'] })

    expect(form).toStrictEqual({
      name: '',
      age: 18,
      info: {
        name: '',
        age: undefined
      }
    })
  })
})
