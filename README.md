## Install

node: 18.18.1
pnpm: 9.7.1

### svg 引入 导入新 svg 需要重新 pnpm run start， 全局注册，即可使用

 <SvgIcon name=" " />
 name 具体见 auto-imports / svg-components.d.ts

### 组件引入 编写新的 vue 文件 需要重新 pnpm run dev，全局注册，即可使用，无需再 improt

如不存在，请查询 auto-imports / components.d.ts 是否存在，否则重新 pnpm run start

### commit 规范

```
'feat',      //新特性、新功能
'fix',       //修改bug
'wip',       //work in progress 工作中 还没完成
'docs',      //文档修改
'style',     //代码格式修改, 注意不是 css 修改
'deps',      //依赖相关的修改
'refactor',  //代码重构
'perf',      //优化相关，比如提升性能、体验
'test',      //测试用例修改
'chore',     //其他修改, 比如改变构建流程、或者增加依赖库、工具等
'revert',    //回滚到上一个版本
'build',     //编译相关的修改，例如发布版本、对项目构建或者依赖的改动
'ci',        //持续集成
'release',   //发布
'workflow',  //工作流
```

eg: git commit -m "fix: 修复 xxx 功能"

### 命令

pnpm nvm // 切换 node 版本
pnpm run lint //代码检
pnpm run dev // 启动项目
pnpm run build:dev //打包开发环境
pnpm run build:test //打包测试环境

## 命名规范

1. views目录下的文件名字以 kebab-case
2. 路由path以 kebab-case
3. 路由name以 kebab-case
4. 组件名字以 PascalCase

## 加入reactivity transform
> 使用时不再需要.value

```ts
const count = $ref(1)
count++
console.log(count) // 2

// 解构props
const {
    msg,
    // 默认值正常可用
    count = 1,
    // 解构时命别名也可用
    foo: bar
} = $defineProps<{
    msg: string
    count?: number
    foo?: string
}>()
```

### 与普通的互相转换
```ts
function useDemo() {
  const num = $ref(1)
  // 使用 $$ 作为响应式返回
  return $$({ num })
}

const count = $ref(1)
// 使用 $$ 作为响应式传递给useDemo
useDemo($$(count))
    
// 使用 $ 将原始的ref转换为$ref
const { num } = $(useDemo())
// 对于defineModel也适用
const input = $(defineModel<string>('input'))
```

## 增加接口mock
mock在根目录mock下面加文件即可
需要使用时修改.env.development 
VITE_APP_BASE_URL=/mock


## localstorage使用
```ts
import { ls, ss } from '@/utils/storage'

ls.get('key')
ls.set('key', 'value')
ls.remove('key')
ls.clear()
```
