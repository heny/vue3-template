import { partialRight } from 'lodash-es'
import { extend } from 'lodash-es'

export const STORAGE_KEY = 'session'

// 获取storage
export function getStorage<T = Recordable>(key = STORAGE_KEY): T {
  const session = localStorage.getItem(key)
  let result = {}

  try {
    result = JSON.parse(decodeURIComponent(session))
  } catch {
    result = {}
  }

  return result as T
}

// 设置storage
export function setStorage(data: any, key = STORAGE_KEY): void {
  const oldSession = getStorage()
  const newData = extend(oldSession, data)
  localStorage.setItem(key, encodeURIComponent(JSON.stringify(newData)))
}

export const removeStorage = (): void => localStorage.removeItem(STORAGE_KEY)

const setStorageItem = (key: string, val: any, storage: Storage): void => {
  storage.setItem(key, encodeURIComponent(JSON.stringify(val)))
}

const getStorageItem = (key: string, storage: Storage): string => {
  const value = decodeURIComponent(storage.getItem(key))

  try {
    return JSON.parse(value)
  } catch (e) {
    return value
  }
}

const removeStorageItem = (key: string, storage: Storage): void => {
  storage.removeItem(key)
}

// 带加密
export const localStore = {
  set: partialRight(setStorageItem, localStorage),
  get: partialRight(getStorageItem, localStorage),
  remove: partialRight(removeStorageItem, localStorage),
}

// 带加密
export const sessionStore = {
  set: partialRight(setStorageItem, sessionStorage),
  get: partialRight(getStorageItem, sessionStorage),
  remove: partialRight(removeStorageItem, sessionStorage),
}

// 不带加密
const storageMap = (storage: Storage) => ({
  get(key: string) {
    try {
      return JSON.parse(storage.getItem(key))
    } catch (err) {
      return storage.getItem(key)
    }
  },
  set(key: string, value: any) {
    storage.setItem(key, JSON.stringify(value))
  },
  remove(key: string) {
    storage.removeItem(key)
  },
  clear() {
    storage.clear()
  },
})

export const ls = storageMap(localStorage)
export const ss = storageMap(sessionStorage)
