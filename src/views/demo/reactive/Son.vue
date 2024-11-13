<template>
  <div class="son">
    <p>Son: {{ count }}</p>
    <el-input v-model="input" />
  </div>
</template>
<script lang='ts' setup>

const {
  count = 5,
} = $defineProps<{
  count: number
}>()

let input = $(defineModel<string>('input'))

watchEffect(() => {
  console.log('hhh - Son: ', count, input)
})
</script>
<style lang='scss' scoped>

</style>
