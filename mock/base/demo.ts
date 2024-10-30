/**
 * demo文件
 */
import { MockMethod } from 'vite-plugin-mock'
import { successRes, combineMockUrl } from '../utils'
import Apis from '../../src/api/apis/demo'
import Mock from 'mockjs'

let roles = Mock.mock({
  'list|4-10': [{
    'id|+1': 1,
    date: '@date("yyyy-MM-dd")',
    name: '@name',
    address: '@county(true)'
  }]
}).list

const data: MockMethod[] = [
  {
    url: Apis.list,
    method: 'get',
    response: () => successRes(roles),
    timeout: 1000
  },
  {
    url: Apis.add,
    method: 'post',
    timeout: 2000,
    response: ({ body }) => {
      const newRole = { id: roles.length + 1, ...body, isStatic: false }
      roles.push(newRole)

      return successRes(newRole)
    }
  },
  {
    url: Apis.edit,
    method: 'put',
    response: ({ body, query }) => {
      const role = roles.find(r => r.id === Number(query.id))

      if (role) {
        Object.assign(role, body)

        return successRes(role)
      }

      return successRes({ success: false, message: '角色未找到' })
    }
  },
  {
    url: Apis.delete,
    method: 'delete',
    response: ({ query }) => {
      roles = roles.filter(r => r.id !== Number(query.id))

      return successRes({ success: true })
    }
  },
]

export default combineMockUrl(data)
