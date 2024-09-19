<template>
  <span class='dot' :style="`background-color: ${color}`" />
</template>
<script lang='ts' setup>

interface Props {
  color: string;
}

defineProps<Props>()
defineOptions({ name: 'Dot' })

</script>
<style lang='scss' scoped>
.dot {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}
</style>
