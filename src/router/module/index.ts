import type { Routes } from '@/router/types'

// 顶部导航
export const navRoutes: Routes[] = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页'
    }
  }
]

export default navRoutes
