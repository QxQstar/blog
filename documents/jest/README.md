# 单元测试库 jest

## jest 配置

运行 `jest --init` 可以自动生成 jest 配置

## jest + babel

## 监听测试文件的变化

```
jest --watch
```

## jest 的钩子函数

beforeAll、afterAll、beforeEach、afterEach

## Vue 项目中使用 jest

安装 @vue/test-utils 和 @vue/cli-plugin-unit-jest，然后配置 jest.config.js

## mock

### mock 库

```js
jest.mock('@hydesign/grape',() => {
  return {
    isInGrape:() => false
  }
})
```

### mock 模块方法

在模块文件的同一级目录下新增 `__mocks__` 文件夹，并在` __mocks__` 文件夹下新增一个与要 mock 的模块文件名同名的文件,例如：cms_apis.js。然后在 测试代码中：
```
jest.mock('@/config/cms_apis.js')
```

### mock Vue 组件中的方法

```
 jest.spyOn(wrapper.vm, 'toSimpleString').mockImplementation(() => 'success')
```




