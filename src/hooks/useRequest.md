## 基本使用
```ts
/**
 * data 请求数据
 * loading 请求状态
 * refetch 重新发起请求
 */
const { data, loading, refetch } = useRequest('/list', {
  methods: 'post', // 默认get请求
  // 更多参数查看实现里面的interface
})

// 重新发起请求可以再次传入参数
refetch({ page: 1, name: '张三' })
```

## url带id的请求方式
```ts
const { refetch } = useRequest('/list/:id', {
  methods: 'post',
  params: { id: 123 } // 可以通过这里传入id
})

refetch({ id: 456 }) // 也可以通过第二次传参时传入id

// 最终的id会在发起请求时删除，如果需要发起请求带id，可以修改url链接上的:id改为其他名字
```

## 如果params需要是响应式的
```ts
// 不能用ref，ref需要取到.value会丢失响应式, reactive不会
const id = ref(123)
const { refetch } = useRequest('/list/:id', {
  methods: 'post',
  params: { id } // or computed(() => ({ id }))
})

params.id = 456
refetch() // 发起请求时，params会取最新值
```

## 非对象的传入使用方式
```ts
const { refetch } = useRequest('/list/:id', {
	methods: 'post',
  	params: { id: 123 } // 参数一可以是对象或者非对象
})

refetch([123,456]) // // 参数二可以是对象或者非对象

// 最终请求
axios('/list/123', { params: [123,456] })

// 注意：不能参数一、二都是非对象，否则只会取最后传入的
```

## post接口在query和params同时传参
```ts
const { refetch } = useRequest('/list/:id?page={page}&name={name}', {
  methods: 'post',
  params: {
    id: 123,
    page: 2,
    name: '张三'
  }
})
// 匹配过后的会在params里面移除
```