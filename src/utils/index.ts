import { Base64 } from 'js-base64'

// 手机号码表单检验
export const validatePhone = (rule: any, value: any, callback: any) => {
  const regex = '^1[3456789]\\d{9}$'
  const reg = new RegExp(regex, 'gi')

  if (!value) {
    return callback(new Error('请输入手机号'))
  } else if (!reg.test(value)) {
    return callback(new Error('请输入正确的手机号'))
  }
  callback()
}

// 密码表单检验
export const validatePass = (rule: any, value: any, callback: any) => {
  const regex = '^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,20}$'
  const reg = new RegExp(regex, 'gi')

  if (!reg.test(value)) {
    return callback(new Error('长度6-18位,须包含数字、字母、符号中两种'))
  }
  callback()
}

//根据类型获取元素
export const setItem = (type, array) => {
  const item = array.filter((item) => item.statusId === type)

  return item
}

// 随机生成一串字母数字组合
export const randomWord = (num) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

// 加密
export const encryptPassWord = (pwd, num) => {
  const randomStr = randomWord(num)

  return pwd ? Base64.encode(`${randomStr}${Base64.encode(pwd)}`) : null
}

//解密
export const decryptPassWord = (pwd, num) => {
  return pwd ? Base64.decode(pwd.slice(num)) : null
}

//数字转换123456789=>123,456,789
export const numberWithCommas = (num) => {
  if (num.length <= 3) {
    return num
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 默认值处理
 * @returns
 */
export const defaultWithValue = (value, { defaultValue = '-', pre = '', suf = '' } = {}) => {
  const hasValue = typeof value !== 'undefined'
  if (!hasValue) return defaultValue

  const v = hasValue ? value : defaultValue

  return `${pre}${v}${suf}`
}

export interface TopInter {
  name: string
  amount: number
  percent: number
}

// 对top10数据进行比例放大
export const getMagnificationRatio = (arr: TopInter[]) => {
  return arr.map((item) => {
    return {
      name: item.name,
      amount: item.amount,
      percent: Number(((item.amount / arr[0].amount) * 97).toFixed(2))
    }
  })
}

export function toNumber(num) {
  return isNaN(num) ? 0 : Number(num)
}

