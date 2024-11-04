import { describe, test, expect } from 'vitest'
import { ref } from 'vue'
import { typeOf, deepToValue, isNil, processParams, handleUrl } from '..'
import { isValidDate } from '../formatDate'

describe('utils工具函数测试', () => {
  test('typeOf: 判断数据类型', () => {
    expect(typeOf(1)).toBe('Number')
    expect(typeOf('1')).toBe('String')
    expect(typeOf(true)).toBe('Boolean')
    expect(typeOf([])).toBe('Array')
    expect(typeOf({})).toBe('Object')
    expect(typeOf(() => {})).toBe('Function')
    expect(typeOf(new Date())).toBe('Date')
    expect(typeOf(null)).toBe('Null')
    expect(typeOf(undefined)).toBe('Undefined')
  })

  test('isValidDate: 判断字符串是否为有效的日期时间格式', () => {
    expect(isValidDate('2024-03-20')).toBe(true)
    expect(isValidDate('2024-03-20 12:00:00')).toBe(true)
    expect(isValidDate('2024-11-01T16:59:52.407')).toBe(true)
    expect(isValidDate('2024-11-01T00:00:00')).toBe(true)
    expect(isValidDate('2024-11-01T00:00:00.000Z')).toBe(true)

    expect(isValidDate('1233')).toBe(false)
    expect(isValidDate('哈哈哈哈')).toBe(false)
    expect(isValidDate('2024-11-01fdsafdsafd')).toBe(false)
  })

  test('isNil: 判断空对象', () => {
    expect(isNil('')).toBe(true)
    expect(isNil([])).toBe(true)
    expect(isNil({})).toBe(true)
    expect(isNil(undefined)).toBe(true)
    expect(isNil(null)).toBe(true)
    
    expect(isNil(0)).toBe(false)
    expect(isNil('12')).toBe(false)
  })

  test('processParams: 处理参数', () => {
    // case 1: 两者都是对象，合并对象
    expect(processParams({ name: '张三' }, { age: 18 }))
      .toStrictEqual([{ name: '张三', age: 18 }, undefined])

    // case 2: 只有 params 是对象
    expect(processParams({ name: '张三' }, 1))
      .toStrictEqual([{ name: '张三' }, 1])

    // case 3: 只有 queryParams 是对象
    expect(processParams('demos', { age: 18 }))
      .toStrictEqual([{ age: 18 }, 'demos'])

    // case 4: 两者都是空对象
    expect(processParams(null, null))
      .toStrictEqual([{}, undefined])
  })

  test('handleUrl: 处理url', () => {
    // case 1: 使用 : 占位符
    expect(handleUrl('/list/:id', { id: 1 }))
      .toStrictEqual(['/list/1', {}])

    // case 2: 使用 { 占位符
    expect(handleUrl('/list/{id}', { id: 1 }))
      .toStrictEqual(['/list/1', {}])

    // case 3: 使用 { 占位符，但参数对象中不包含该占位符
    expect(handleUrl('/list/{id}', { name: '张三' }))
      .toStrictEqual(['/list/{id}', { name: '张三' }])

    // case 4: path和query都使用占位符，被使用过的占位符会被删除
    expect(
      handleUrl(
        '/list/:id?name={name}&age={age}',
        { id: 1, name: '张三', age: undefined, sex: 1 }
      )
    ).toStrictEqual([
      `/list/1?name=${encodeURIComponent('张三')}&age=`,
      { sex: 1 }
    ])
  })
})

describe('deepToValue: 深度解构响应式', () => {
  test('case 1: 普通对象内包含ref', () => {
    const data = {
      name: '张三', 
      age: ref(18),
      info: {
        name: '李四',
        age: 20
      }
    }
  
    expect(deepToValue(data)).toStrictEqual({ 
      name: '张三', age: 18,
      info: { name: '李四', age: 20 }
    })
  })

  test('case 2: ref对象包含ref', () => {
    const data = ref({
      name: '张三', age: ref(18),
      info: { name: '李四', age: 20 }
    })

    expect(deepToValue(data)).toStrictEqual({ 
      name: '张三', age: 18,
      info: { name: '李四', age: 20 }
    })
  })
})
