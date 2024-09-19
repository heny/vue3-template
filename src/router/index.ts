import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { Routes } from '@/router/types'
import { ElMessage } from 'element-plus'
import HomeRoutes from './module'

const NotFound = () => import('@/views/page404.vue')

const Layout = () => import('@/views/layout/index.vue')

/**
 * 路由命名使用kebab-case格式
 */
export const defaultRouter: Routes[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: HomeRoutes
  },
  {
    path: '/404',
    component: NotFound,
    name: '404',
    meta: {
      title: '404',
    }
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: defaultRouter as Array<RouteRecordRaw>
})

router.onError(() => {
  ElMessage.error('路由错误，即将刷新页面！')
  window.location.reload()
})

export default router
