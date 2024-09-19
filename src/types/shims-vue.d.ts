// 必须要export {} ， 否则不工作
export {}

interface Config {
  APP_NAME: string
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $config: Config
  }
}
