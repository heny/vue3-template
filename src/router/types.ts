import type { RouteRecordRaw } from 'vue-router'

interface Meta {
  /**
   * 页面标题
   */
  title?: string
}

// 重写meta、children
export type Routes = Omit<RouteRecordRaw, 'meta' | 'children'> & {
  meta?: Meta
  children?: Routes[]
}
