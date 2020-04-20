# Vue 服务端渲染

## Vue 服务端渲染的包

vue-server-renderer

## Vue 应用代码打包

### 使用 webpack 打包 Vue 服务端渲染的应用代码时 webpack 配置的注意事项

1. 将 target 设置为 node
2. 将 output.libraryTarget 设置为 commonjs2
3. 将 css 打包成独立的文件
4. 通过 externals 将第三方依赖库从文件中抽离

## node-server

1. vue-server-renderer
2. 在 nodeJs 中调用 webpack
3. nodemon 修改了服务端代码之后自动重启

## 创建 app

在每一次请求都要创建一个单独的 Vue 实例，VueRouter 实例，Vuex 实例，不能是单例模式
