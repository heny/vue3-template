<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>
<style lang="scss">
/*修改滚动条样式*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  /**/
}
::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #333;
}
::-webkit-scrollbar-corner {
  background: rgb(239, 239, 239);
}
</style>
