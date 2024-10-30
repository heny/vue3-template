<template>
  <div class="shts-full shts-center shts-flex-column bg-white">
    <div class="img-box">
      <img :src="i404" >
    </div>
    <div class="notfond-info">对不起,您访问的页面不存在。</div>
    <div class="back-btn" @click="handelBack">
      <el-button type="primary">返回首页</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import i404 from '@/assets/img404/404.png'

const router = useRouter()

const handelBack = () => {
  router.push({ path: '/' })
}
</script>

<style scoped lang="scss">
.bg-white {
  background-color: #fff;
}
.notfond-info {
  margin: 2.5rem 0;
  font-size: 16px;
  color: #727785;
  line-height: 24px;
  height: 24px;
}
.img-box > img {
  width: 88.2rem;
  height: 39.2rem;
}
</style>
