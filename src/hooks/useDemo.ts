const useDemo = (count) => {
  const sum = $ref(0)

  watch(count, (c) => {
    console.log('hhh - c', c)
  })

  // 响应式需要 $$ref包裹
  return $$({
    sum
  })
}

export default useDemo
