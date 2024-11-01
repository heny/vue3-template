/* eslint-disable max-lines-per-function */
/* eslint-disable vue/one-component-per-file */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import useRequest from '../useRequest'
import http from '@/api/axios'
import { ElMessage } from 'element-plus'

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
    
    const TestComponent = defineComponent({
      setup() {
        const { data, loading, refetch } = useRequest('/api/test', {
          defaultValue: {}
        })

        return { data, loading, refetch }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)

    await flushPromises()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test',
      method: 'get',
    })
    
    expect(wrapper.vm.data).toEqual(mockData.data)
    expect(wrapper.vm.loading).toBe(false)
    
    wrapper.unmount()
  })

  it('基本POST请求', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { loading, refetch } = useRequest('/api/test/:id', {
          method: 'post',
          params: { id: 1, test: 'success' },
        })

        return { loading, refetch }
      },
      template: '<div />'
    })

    // 挂载组件
    const wrapper = mount(TestComponent)

    // 检查初始的loading状态
    expect(wrapper.vm.loading).toBe(false)

    // 发起请求，并校验
    expect(wrapper.vm.refetch()).resolves.toEqual(defaultData)

    // 等待vue更新
    await nextTick()

    // 检查loading请求中状态
    expect(wrapper.vm.loading).toBe(true)

    // 检查http请求的参数
    expect(http).toHaveBeenCalledWith({
      url: '/api/test/1',
      method: 'post',
      data: { test: 'success' },
    })
    
    // 等待请求完成
    await flushPromises()

    // 检查loading请求完成状态
    expect(wrapper.vm.loading).toBe(false)

    // 卸载组件，完成测试
    wrapper.unmount()
  })

  
  it('重复POST请求校验', async () => {    
    const TestComponent = defineComponent({
      setup() {
        const { refetch, loading } = useRequest('/api/test3', {
          method: 'post',
          immediate: false
        })

        return { refetch, loading }
      },
      template: '<div />'
    })
    
    const wrapper = mount(TestComponent)
    
    expect(wrapper.vm.loading).toBe(false)
    
    wrapper.vm.refetch()

    await nextTick()
    
    expect(wrapper.vm.loading).toBe(true)
    
    // 检查重复请求错误
    await expect(wrapper.vm.refetch()).rejects.toThrow('请求正在进行中')
    // 检查错误信息
    expect(ElMessage.warning).toHaveBeenCalledWith('请求正在进行中，请勿重复调用')
    
    wrapper.unmount()
  }, 3000)

  it('必填参数检查', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { refetch } = useRequest('/api/test2', {
          requiredKeys: ['id'],
          immediate: false
        })

        return { refetch }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)
    
    // 使用 expect().rejects 来测试异步错误
    await expect(wrapper.vm.refetch()).rejects.toThrow('缺少必要参数')
    
    wrapper.unmount()
  }, 3000)

})

describe('useRequest: 传参方式校验', () => {
  it('带id的路径', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { refetch } = useRequest('/api/test2/:id', {
          method: 'post',
          params: { id: 1 }
        })

        return { refetch }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)

    await wrapper.vm.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test2/1',
      method: 'post',
    })

    wrapper.unmount()
  })

  it('带id，query的路径方式一', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { refetch } = useRequest('/api/test2/:id?name={name}&age={age}', {
          method: 'post',
          params: { id: 1, name: 'test', age: undefined }
        })

        return { refetch }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)

    await wrapper.vm.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test2/1?name=test&age=',
      method: 'post',
    })

    wrapper.unmount()
  })

  it('带id，query的路径方式二', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { refetch } = useRequest('/api/test/query2/:id', {
          method: 'post',
          params: { id: 1 },
          query: { name: 'test', age: undefined }
        })

        return { refetch }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)

    await wrapper.vm.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/query2/1',
      method: 'post',
      params: { name: 'test', age: undefined }
    })

    wrapper.unmount()
  })

  it('post传入数组', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { refetch } = useRequest('/api/test/array/delete', {
          method: 'delete'
        })

        return { refetch }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)

    await wrapper.vm.refetch([1,2,3])

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/array/delete',
      method: 'delete',
      data: [1,2,3]
    })

    wrapper.unmount()
  })

  it('post传入字符串', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { refetch } = useRequest('/api/test/string', {
          method: 'post'
        })

        return { refetch }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)

    await wrapper.vm.refetch('123')

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/string',
      method: 'post',
      data: '123'
    })

    wrapper.unmount()
  })

  it('响应式传参', async () => {
    const TestComponent = defineComponent({
      setup() {
        const id = ref(123)
        const { refetch } = useRequest('/api/test/string', {
          method: 'post',
          params: { id }
        })

        return { refetch, id }
      },
      template: '<div />'
    })

    const wrapper = mount(TestComponent)

    wrapper.vm.id = 456

    await wrapper.vm.refetch()

    expect(http).toHaveBeenCalledWith({
      url: '/api/test/string',
      method: 'post',
      data: {
        id: 456
      }
    })

    wrapper.unmount()
  })
})
