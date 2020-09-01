# react 生态中的工具

## React Hooks

## formik

[formik](https://formik.org/) 是 react 和 react-native 的开源 form 库

## 可访问性

eslint-plugin-jsx-a11y 是一个 eslint 的插件，使用这个插件可以让 eslint 具备检查 JSX 中可访问的能力

aXe-core 是一个自动化的、端到端的可访问性测试工具。在开发中和 debugging 中使用 react-axe 可以将可访问性问题直接显示在控制台中

## 代码分割

要想 webpack 支持代码分割的功能除了在代码中使用 import()，还需要[配置 webpack](https://webpack.js.org/guides/code-splitting/)。如果使用了 babel 还需要使用[babel-plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import)确保 babel 能够解析 import()

在 React 中要异步加载组件需要使用 React.lazy 和 Suspense，但是他们服务端不可用，在服务端异步加载组件可以使用[loadable-components](https://github.com/gregberge/loadable-components)

## Context

在组件树中共享数据

const MyContext = React.createContext

<MyContext.Provider value={}/>

React.contextType = MyContext, this.context

<MyContext.Consumer></MyContext.Consumer>

## Error Boundaries

捕获子组件树中 js 的错误，并且在出错的时候显示 fallback UI。

Error Boundaries 组件是自定义的，只要一个组件中有 static getDerivedStateFromError() 或者 componentDidCatch()，就可以称这个组件是 Error Boundaries 组件

## ref

React.createRef

Rect.forwardRef

## Fragments

一个空组件，用于将多个组件收集到一起

React.Fragment

<>
// some components
</>

## 高阶组件

高阶组件是一个函数，它接受组件作为参数，并且返回一个新的组件

不要在 render 方法中调用高阶组件。在 render 中调用高阶组件，会在每次 render 时都生成一个新的组件，这会导致组件树被重新渲染

## JSX

JSX 是 React.createElement 的语法糖

props.children 可以是任何类型的值，包括函数

布尔值、null、Undefined 不会被渲染，但是数字 0 和 '' 会被渲染

## 性能优化

1. 压缩代码。rollup、webpack、brunch 和 Browserify 都有压缩代码的插件
2. [react-window](https://github.com/bvaughn/react-window) 使用 winding 技术，优化大量数据列表的渲染
3. componentShouldUpdate
4. React.pureComponent
5. 不要直接修改 state 的值，要使用 setState 修改state。对于引用类型，如数组，使用 push,splice 等方法直接修改 state 的值可能会导致界面无法更新
6. 使用 Profiler API 可以识别应用程序中比较慢的部分
7. React 的 diff 算法在比较两个节点时，如果新的节点和老的节点是不同类型的组件类型，会销毁整个老节点以及它的子树，所有如果两个组件类型有相似的输出，推荐使用相同的组件类型

```js
// 错误的做法
this.state.arr.push('word')
this.setState({arr:this.state.arr})

// 正确的做法
this.setState(prevState => {
  return {
    arr:[...prevState.arr,'word']
  }
})
```

## Portals

使用 ReactDOM.createPortal 可以将孩子组件渲染到任意一个父组件中，不用受到组件的嵌套层级的限制。这个 API 在创建弹窗组件时非常有用

## JSX

使用 [react-hyperscript](https://github.com/mlmorg/react-hyperscript) 和 [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers) 可以在没有使用 JSX 的情况下以一种简洁的语法创建模版


## Refs and the DOM

从 React 16.3 起可以使用 React.createRef() API 去创建 ref 并且将 ref 传递到 class 组件或者内置的 DOM 元素上。在 React 16.3 之前的版本，可以给 ref 属性传递一个回调函数，以使得在父组件中得到 class 组件的实例或者内置的 DOM 元素节点

给函数组件传递 ref 属性将不会正常工作，从 React 16.3 起，使用 React.forwardRef API 使得可以给函数组件传递 ref 属性。在 React 16.3 之前的版本中要想在父组件中访问子组件中的内置的 DOM 元素节点，可以将父组件中的 ref 作为子组件的另一个属性名传递到子组件中

## React props 类型检查

从 React 15.5 起 React props 的类型检查从 React.PropTypes 中移入到一个独立的库中：[prop-types](https://www.npmjs.com/package/prop-types)

import PropTypes from 'prop-types'

myComponent.PropTypes = {
    optionalBool: PropTypes.bool
}


## 不受控组件

对于不受控 form 表单组件，可以配合 ref 得到表单组件的值

对于 radio 和 checkbox 使用 defaultChecked 属性去设置初始值，其他的使用 defaultValue 属性设置初始值

file 组件只能是不受控组件


