# vue 源码解读

## flow

静态类型检查，通过类型推断和类型注释检查类型

在 vue 源码的 flow 目录中定义了 vue 中用到的自定义类型

## 目录结构

在 vue 的源码中，作者将功能模块拆分的非常的细，相关的逻辑放在一个单独的目录中维护，将复用的逻辑也抽成一个单独的目录。

## 构建

使用 rollup 构建，rollup 只处理 js 代码，它比 webpack 更轻量

### runtime-only vs runtime+compiler

runtime-only 版本的 vue,会在 webpack 打包的过程中将 .vue 文件编译成 js 代码。这样打包出的项目代码会小很多并且性能也更好。

runtime+compiler 版本的 vue,是在项目运行的时候去编译 vue 的 template 编译成 render. 项目代码更多并且性能更差。在定义 vue 组件时使用的 template 属性就要使用 runtime+compiler 版本

## 在引入 Vue 时

在引入 Vue 时(即 import vue form Vue)，就会在 vue 原型和 vue 构造函数上挂载一些方法

## new Vue

在 new Vue 时会设置 vue 实例的父子关系，给 data, props, methods 设置代理，初始化 injections,初始化 provide等

## Vue 实例创建与挂载

![runtime + compiler版本 vue 实例挂载流程图](./img/newVueFlow.jpg)

## render 方法

将 $createElement 作为 render 的第一个参数，调用 $createElement 返回一个 vnode

### 传给 render 的第一个参数是字符串

例如：

```
render('div',...)
```

调用 new VNode 创建 vnode

### 传给 render 的第一个参数是组件

例如：

```
render(APP)
```

给组件添加上 Vue 的方法，例如：extend,mixin,use,component 等， 让组件的原型指向 Vue 的原型，将组件的 options 与 Vue 的 options 合并，设置 hooks，最后返回 vnode

![render 过程](./img/vueRender.jpg)

## _update

在初始化渲染和数据更新都会调用_update,在 _update 中会调用 patch

## patch

在初始化渲染时调用 patch 方法的作用是创建 DOM 节点，并且将子节点插入到父节点中，最后再将生成的 DOM 树插入到 body 中。

组件创建是一个深度遍历

## new Vue 的过程

![new Vue 流程](./img/new-vue.png)

## 合并配置

合并配置发生在两个时候，一个时候是 new Vue 时，另一个时候是在 render 创建组件的过程中

### new Vue 时合并配置

```js
vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
```

会将 vm.constructor 上的配置合并到 vm,所以在 vm 上能够访问到 vm.constructor 上的 filter, directive 等

### 创建组件时合并配置

由于组件的构造函数是通过 Vue.extend 继承自 Vue 的，在组件的构造函数中会将 Vue 上的配置与组件的配置进行合并，所以在组件上可以访问到 Vue 上的配置

```js
 initInternalComponent(vm, options)
```

## 生命周期

![生命周期流程图](./img/lifecycle.jpg)

## 组件的注册

全局注册的组件会被注册到 Vue.options.components 上

局部注册的组件会被注册到这个组件的 options.components 上(即：vm.options.components)，并且会将全局注册的组件合并到 vm.options.components，所以可以在任何一个组件中访问到全局注册的组件
