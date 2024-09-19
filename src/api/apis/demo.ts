import axios from '../axios'

export default {
  // 注册/添加账号
  fetchRegister(data: {
    mobile_phone?: string
    username: string
    password: string
    role_id: string
    status: true
    sex?: string
    name: string
    avatar?: string
  }) {
    return axios.post('/admin/user/register', data)
  },
  // 删除用户
  fetchDelUser(data: { id: string }) {
    return axios.post('/user/delUser', data)
  },
  // 获取用户列表
  fetchUserList(data: { currentPage: number; pageSize: number }) {
    return axios.post('/user/userList', data)
  },

}
