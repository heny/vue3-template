import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import router from './router/index'
import '@/router/permission'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import SvgIcon from '~virtual/svg-component'
// 注意导入顺序
import '@/assets/style/index.scss'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPersist)
const app = createApp(App)

// 注册 ElementPlus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 一些不能通过unplugin-element-plus/vite 注册的组件，比如自定义指令这些
app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.component(SvgIcon.name, SvgIcon)
app.mount('#app')
