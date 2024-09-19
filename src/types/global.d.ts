declare type Recordable<T = any> = Record<string, T>

declare interface HttpResponse<T = any> {
  type: string
  code: number
  success: boolean
  message: string
  data: T
}
