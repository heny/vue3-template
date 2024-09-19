/**
 * @name 处理数字精度
 * signFigures(0.1 + 0.2) // 0.3
 * signFigures(0.56 * 100) // 56
 * signFigures(0.57 * 100) // 57
 */
export function signFigures(num, rank = 6) {
  if (!num) return num
  const sign = num / Math.abs(num)
  const number = num * sign
  const temp = rank - 1 - Math.floor(Math.log10(number))

  let ans

  if (temp > 0) {
    ans = parseFloat(number.toFixed(temp))
  } else if (temp < 0) {
    ans = Math.round(number / Math.pow(10, temp)) * temp
  } else {
    ans = Math.round(number)
  }

  return ans * sign
}

function getDecimalMax(num, splitNumber = 5) {
  if (!num) return num
  if (num > 10) return num

  splitNumber = splitNumber / (num < 1 ? 100 : 10)
  const remainder = num % splitNumber
  num = num - remainder + splitNumber

  return signFigures(num)
}

/**
 * echarts 获取y轴最大值
 * @returns
 */
export default function getAxisMax(maxValue, splitNumber = 5) {
  // 小于4使用小数点展示
  if (Number.isNaN(maxValue / 1) || maxValue / 1 < 4) {
    return getDecimalMax(maxValue)
  }

  const max = Math.ceil(maxValue)
  const itemValue = `${Math.ceil(max / splitNumber)}`
  const mins = Math.ceil(+itemValue / 10 ** (itemValue.length - 1))
  const item = mins * 10 ** (itemValue.length - 1)
  // item 需要是5的整数倍
  const res = Math.ceil(item / splitNumber) * splitNumber * splitNumber

  return res
}
