/* eslint-disable max-lines-per-function */
/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import useRequest from '../useRequest'
import http from '@/api/axios'
import { ElMessage } from 'element-plus'
import { withSetup } from './test-utils'

const defaultData = {
  success: true,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
  data: { list: [] }
}

// Mock axios和ElMessage
vi.mock('@/api/axios', () => ({
  default: vi.fn(() => Promise.resolve(defaultData)),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    closeAll: vi.fn()
  }
}))

describe('useRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ElMessage.closeAll()
  })

  it('基本GET请求', async () => {
    const mockData = {
      ...defaultData,
      data: { test: 'success' },
    }

    const mockHttp = vi.mocked(http)
    mockHttp.mockImplementationOnce(() => Promise.resolve(mockData))

    const [result, app] = withSetup(() => useRequest('/api/test', {
      defaultValue: {}
    }))

    await flushPromises()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test',
      method: 'get',
    })

    expect(result.data.value).toEqual(mockData.data)
    expect(result.loading.value).toBe(false)

    app.unmount()
  })

  it('基本POST请求', async () => {
    const [result, app] = withSetup(() => 
      useRequest('/api/test/:id', {
        method: 'post',
        params: { id: 1, test: 'success' },
      })
    )

    // 检查初始的loading状态
    expect(result.loading.value).toBe(false)

    // 发起请求，并校验
    expect(result.refetch()).resolves.toEqual(defaultData)

    // 等待vue更新
    await nextTick()

    // 检查loading请求中状态
    expect(result.loading.value).toBe(true)

    // 检查http请求的参数
    expect(http).toHaveBeenCalledWith({
      url: '/api/test/1',
      method: 'post',
      data: { test: 'success' },
    })

    // 等待请求完成
    await flushPromises()

    // 检查loading请求完成状态
    expect(result.loading.value).toBe(false)

    // 卸载组件，完成测试
    app.unmount()
  })

  it('when条件控制请求', async () => {
    const [result, app] = withSetup(() => {
      const canRequest = ref(false)
      const request = useRequest('/api/test', {
        method: 'get',
        when: canRequest
      })

      return {
        ...request,
        canRequest
      }
    })

    await nextTick()
    // when为false时,不会自动发起请求
    expect(http).not.toHaveBeenCalled()

    // 修改when为true,会自动发起请求
    result.canRequest.value = true
    await nextTick()

    // 验证请求已发送
    expect(http).toHaveBeenCalledWith({
      url: '/api/test',
      method: 'get'
    })

    app.unmount()
  })

  it('once只请求一次', async () => {
    const [result, app] = withSetup(() => {
      const canRequest = ref(false)
      const request = useRequest('/api/test', {
        when: canRequest,
        once: true
      })

      return { ...request, canRequest }
    })

    result.canRequest.value = true
    await nextTick()

    expect(http).toHaveBeenCalledOnce()

    result.canRequest.value = false
    await nextTick()

    expect(http).toHaveBeenCalledOnce()

    result.canRequest.value = true
    await nextTick()

    expect(http).toHaveBeenCalledOnce()

    app.unmount()
  })

  it('重复POST请求校验', async () => {
    const [result, app] = withSetup(() => 
      useRequest('/api/test3', {
        method: 'post',
        immediate: false
      })
    )

    expect(result.loading.value).toBe(false)

    result.refetch()

    await nextTick()

    expect(result.loading.value).toBe(true)

    // 检查重复请求错误
    await expect(result.refetch()).rejects.toThrow('请求正在进行中')
    // 检查错误信息
    expect(ElMessage.warning).toHaveBeenCalledWith('请求正在进行中，请勿重复调用')

    app.unmount()
  }, 3000)

  it('必填参数检查', async () => {
    const [result, app] = withSetup(() =>
      useRequest('/api/test2', {
        requiredKeys: ['id'],
        immediate: false
      })
    )

    // 使用 expect().rejects 来测试异步错误
    await expect(result.refetch()).rejects.toThrow('缺少必要参数')

    app.unmount()
  }, 3000)

})

describe('useRequest: 传参方式校验', () => {

  it('空数组传参', async () => {
    const [result, app] = withSetup(() => useRequest('/api/test', {
      method: 'post',
    }))

    await result.refetch([])

    expect(http).toHaveBeenCalledWith({
      url: '/api/test',
      method: 'post'
    })

    app.unmount()
  })

  it('url动态路径', async () => {
    const [result, app] = withSetup(() => {
      const url = ref('/api/test')
      const request = useRequest(url, {
        method: 'post',
      })

      return { ...request, url }
    })

    result.url.value = '/api/test/dynamic/2'

    await result.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/dynamic/2',
      method: 'post',
    })

    app.unmount()
  })
  
  it('带id的路径', async () => {
    const [result, app] = withSetup(() => 
      useRequest('/api/test2/:id', {
        method: 'post',
        params: { id: 1 }
      })
    )

    await result.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test2/1',
      method: 'post',
    })

    app.unmount()
  })

  it('带id，query的路径方式一', async () => {
    const [result, app] = withSetup(() => 
      useRequest('/api/test2/:id?name={name}&age={age}', {
        method: 'post',
        params: { id: 1, name: 'test', age: undefined }
      })
    )

    await result.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test2/1?name=test&age=',
      method: 'post',
    })

    app.unmount()
  })

  it('带id，query的路径方式二', async () => {
    const [result, app] = withSetup(() => 
      useRequest('/api/test/query2/:id', {
        method: 'post',
        params: { id: 1 },
        query: { name: 'test', age: undefined }
      })
    )

    await result.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/query2/1',
      method: 'post',
      params: { name: 'test', age: undefined }
    })

    app.unmount()
  })

  it('post传入数组', async () => {
    const [result, app] = withSetup(() => 
      useRequest('/api/test/array/delete', {
        method: 'delete'
      })
    )

    await result.refetch([1, 2, 3])

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/array/delete',
      method: 'delete',
      data: [1, 2, 3]
    })

    app.unmount()
  })

  it('post传入字符串', async () => {
    const [result, app] = withSetup(() => 
      useRequest('/api/test/string', {
        method: 'post'
      })
    )

    await result.refetch('123')

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/string',
      method: 'post',
      data: '123'
    })

    app.unmount()
  })

  it('响应式传参', async () => {
    const [result, app] = withSetup(() => {
      const id = ref(123)
      const request = useRequest('/api/test/string', {
        method: 'post',
        params: { id }
      })

      return {
        ...request,
        id
      }
    })

    result.id.value = 456

    await result.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/string',
      method: 'post',
      data: {
        id: 456
      }
    })

    app.unmount()
  })
})
