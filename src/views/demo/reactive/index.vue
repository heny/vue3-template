<template>
  <div class="reactive">
    <h1>响应式测试</h1>
    <el-button @click="handleClick">点击</el-button>
    <p>{{ count }}</p>
    <p>{{ obj.name }}</p>
    <el-button @click="handleClick2">点击</el-button>
    <p>Sum: {{ sum }}</p>
    <Son v-model:input="input" :count="count" />
  </div>
</template>
<script lang='ts' setup>
import useDemo from '@/hooks/useDemo'
import Son from './Son.vue'

let count = $ref(0)
let obj = $ref({
  name: '张三'
})
let input = $ref('')

/**
 * 传入的值需要$$包裹一下
 * 因为是ref，所以还需要$接收hooks的响应式，就不需要.value了
 */
let { sum } = $(useDemo($$(count)))
console.log('hhh - sum', sum)

const handleClick = () => {
  count++
  obj = { name: '李四' }
  console.log(count, obj)
}

const handleClick2 = () => {
  console.log('hhh - input', input)
  sum++
}
</script>
<style lang='scss' scoped>
.reactive {
  padding: 20px;
}
</style>
