import { MockMethod } from 'vite-plugin-mock'
import { ApiResponse } from '../src/api/interface'

export const successRes = (data): ApiResponse => {
  return {
    data,
    success: true,
    message: '操作成功',
    error: false
  }
}

export const errorRes = (data = null, message = 'error'): ApiResponse => {
  return {
    data,
    message,
    success: false,
    error: true
  }
}


export const combineMockUrl = (data: MockMethod[]) => data.map(item => ({ ...item, url: `/mock${item.url}` }))

