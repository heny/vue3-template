import { defineStore, acceptHMRUpdate } from 'pinia'

export const demoStore = defineStore(
  'demo',
  () => {
    const demo = ref('demo')

    const setDemo = (data: string) => {
      demo.value = data
    }

    return {
      demo,
      setDemo
    }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)

// 热更新
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(demoStore, import.meta.hot))
}
