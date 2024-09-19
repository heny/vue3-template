const tokenKey = 'access_token'
const userInfo = 'userInfo'

// 存储token
export const setToken = (data) => {
  return localStorage.setItem(tokenKey, data)
}

// 获取token
export const getToken = () => {
  return localStorage.getItem(tokenKey)
}

// 移除token
export const removeToken = () => {
  return localStorage.removeItem(tokenKey)
}

// 存储用户信息
export const setUserInfo = (data) => {
  return localStorage.setItem(userInfo, JSON.stringify(data))
}

// 获取用户信息
export const getUserInfo = () => {
  return JSON.parse(localStorage.getItem(userInfo))
}

// 移除用户信息
export const removeUserInfo = () => {
  return localStorage.removeItem(userInfo)
}
