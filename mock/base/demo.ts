/**
 * demo文件
 */
import { MockMethod } from 'vite-plugin-mock'
import { successRes } from '../utils'

let roles = [
  { id: 1, name: '超级管理员', isStatic: true },
  { id: 2, name: '管理员', isStatic: true },
  { id: 5, name: '患者', isStatic: false },
  { id: 3, name: '医生', isStatic: false },
  { id: 4, name: '护士', isStatic: false },
  { id: 5, name: 'mock', isStatic: false },
]

let permissions = [
  {
    name: 'enterprise',
    displayName: '超级管理员',
    permissions: [
      {
        name: 'enterprise.basicSettings',
        displayName: '基础设置',
        permissions: [
          { name: 'enterprise.basicSettings.create', displayName: '新增', isGranted: true, permissions: [] },
          { name: 'enterprise.basicSettings.edit', displayName: '编辑', isGranted: true, permissions: [] },
          { name: 'enterprise.basicSettings.disable', displayName: '停用', isGranted: false, permissions: [] },
          { name: 'enterprise.basicSettings.delete', displayName: '删除', isGranted: true, permissions: [] }
        ]
      },
    ]
  },
]

const data: MockMethod[] = [
  {
    url: '/mock/role',
    method: 'get',
    response: () => successRes(roles),
  },
  {
    url: '/mock/role',
    method: 'post',
    timeout: 2000,
    response: ({ body }) => {
      const newRole = { id: roles.length + 1, ...body, isStatic: false }
      roles.push(newRole)

      return successRes(newRole)
    }
  },
  {
    url: '/mock/role/:id',
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
    url: '/mock/role/:id',
    method: 'delete',
    response: ({ query }) => {
      roles = roles.filter(r => r.id !== Number(query.id))

      return successRes({ success: true })
    }
  },
  {
    url: '/mock/permission',
    method: 'get',
    response: () => successRes(permissions),
  },
  {
    url: '/mock/permission',
    method: 'put',
    timeout: 1000,
    response: ({ body }) => {
      permissions = body.permissions

      return successRes({ success: true })
    }
  }
]

export default data
