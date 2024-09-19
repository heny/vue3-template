// 去除数尾 .00
const trimZero = (str) => {
  if (str.substr(-3) === '.00') return str.slice(0, str.length - 3)

  return str
}

const FormatterAmount = (val) => {
  const value = parseFloat(val)
  // 万
  if (value >= 10000 && value < 100000000) return trimZero((value / 10000).toFixed(2)) + '万'
  // // 十万
  // if (value >= 100000 && value < 1000000) return trimZero((value / 100000).toFixed(2)) + '十万'
  // // 百万
  // if (value >= 1000000 && value < 10000000) return trimZero((value / 1000000).toFixed(2)) + '百万'

  // // 千万
  // if (value >= 10000000 && value < 100000000) {
  //   return trimZero((value / 10000000).toFixed(2)) + '千万'
  // }
  // 亿
  if (value >= 100000000) return trimZero((value / 100000000).toFixed(2)) + '亿'

  return value
}

export default FormatterAmount

// 数字千分位，去除末尾的0
export const FormatterTrimZeroAmount = (val) => {
  return parseFloat(String(val))
}


// 数字加单位，解决进位后显示后，汉字字号比数字小
export const FormatterAmountUnit = (val) => {
  const value = parseFloat(val)
  if (value >= 10000 && value < 100000000) return { number: trimZero((value / 10000).toFixed(2)),units: '万' }  
  if (value >= 100000000) return { number: trimZero((value / 100000000).toFixed(2)) , units: '亿' }

  return { number: value,units: '' }
}

// 单数千分位
export const ToThousands = val =>{
  return new Intl.NumberFormat('en-US').format(val)
}
