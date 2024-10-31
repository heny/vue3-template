/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import useRequest from './useRequest'
import http from '@/api/axios'
import { ElMessage } from 'element-plus'

// Mock axios和ElMessage
vi.mock('@/api/axios', () => ({
  default: vi.fn(() => Promise.resolve()),
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

  it('应该执行基本的GET请求', async () => {
    const mockData = { 
      data: { test: 'success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    }
    
    const mockHttp = vi.mocked(http)
    mockHttp.mockImplementationOnce(() => Promise.resolve(mockData))
    
    const TestComponent = defineComponent({
      setup() {
        const { data, loading, refetch } = useRequest('/api/test', {
          returnFull: true,
          defaultValue: {}
        })

        return { data, loading, refetch }
      },
      template: '<div>test</div>'
    })

    const wrapper = mount(TestComponent)
    
    await flushPromises()
    
    expect(wrapper.vm.data).toEqual(mockData)
    expect(wrapper.vm.loading).toBe(false)
    
    wrapper.unmount()
  })

  
  it('应该防止重复POST请求', async () => {    
    const mockHttp = vi.mocked(http)

    mockHttp.mockImplementationOnce(() => new Promise((resolve) => {
      setTimeout(resolve, 500)
    }))
    
    const TestComponent = defineComponent({
      setup() {
        const { refetch, loading } = useRequest('/api/test3', {
          method: 'post',
          immediate: false
        })

        return { refetch, loading }
      },
      template: '<div>test</div>'
    })
    
    const wrapper = mount(TestComponent)
    
    // 检查初始状态
    expect(wrapper.vm.loading).toBe(false)
    
    // 发起第一次请求
    wrapper.vm.refetch()

    await nextTick()
    
    // 检查请求中状态
    expect(wrapper.vm.loading).toBe(true)
    
    // 使用 expect().rejects 来测试异步错误
    await expect(wrapper.vm.refetch()).rejects.toThrow('请求正在进行中')
    expect(ElMessage.warning).toHaveBeenCalledWith('请求正在进行中，请勿重复调用')
    
    wrapper.unmount()
  }, 3000)

  it('应该处理必需参数检查', async () => {
    const mockHttp = vi.mocked(http)
    mockHttp.mockImplementationOnce(() => Promise.resolve({ data: { test: 'success test2' } }))
    
    const TestComponent = defineComponent({
      setup() {
        const { refetch } = useRequest('/api/test2', {
          requiredKeys: ['id'],
          immediate: false
        })

        return { refetch }
      },
      template: '<div>test</div>'
    })

    const wrapper = mount(TestComponent)
    
    // 使用 expect().rejects 来测试异步错误
    await expect(wrapper.vm.refetch()).rejects.toThrow('缺少必要参数')
    
    wrapper.unmount()
  }, 3000)

})
