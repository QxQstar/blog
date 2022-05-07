# React + Mobx

## Mobx 是什么

Mobx 的优势来源于可变数据（Mutable Data）和可观察数据 (Observable Data) 。

### 前期准备

```dotnetcli
npm install --save mobx
```
mobx 的版本为：6.5.0

将 ts 编译器配置项 useDefineForClassFields 设置为 true，将 experimentalDecorators 设置为 true。如果 ts 编译器配置项 target 字段为 ES2022 或者更高，useDefineForClassFields 的默认值为 true，否则默认值为 false。

本书将 MobX 开发者工具以  Chrome 插件的形式安装，在谷歌商店搜索 MobX Developer Tools。

## 从一个 demo 开始

### 不与 React 结合

### 与 React 结合

#### 在浏览器中运行的结果

## Mobx 的设计理念

## Mobx 的核心概念

### Observable state

驱动应用程序的数据，在 demo 中将 todo 和 todoList 中的属性用 observable 标记，MobX就会追踪这些字段的变化。将某个数据，例如：对象、数组等转化为可观察对象，总体而言有 makeObservable、makeAutoObservable 和 observable 这三种方式。makeAutoObservable 是 makeObservable 的加强版，在默认情况下它将推断对象所有的属性，默认推断规则如下：

1. 所有的成员属性都会用 observable 标记
2. 所有的 getter 都会用 computed 标记
3. 所有的 setter 都会用 action 标记
4. 所有 prototype 上的方法都会用 _autoAction 标记，使它变成 autoAction。
5. 所有 prototype 上的 generator 方法都会用 flow 标记。

将数组、JavaScript 普通对象、Set 和 Map 传给 observable 函数，从而一次性将整个数据变成可观察的。类的实例不能作为参数传给 observable，应该在类的构造函数中使用 makeObservable 或 makeAutoObservable 将实例变成可观察的。

### Action

一段修改状态值的代码。状态通过在函数中被修改，修改状态值的函数应该用 action 标记
Derivations：为了响应状态变化而产生的东西。总体而言 Derivations 分为计算值和 Reactions。计算值用 computed 标记，由可观察数据和纯函数计算而来，它采用按需求值，并且只有当其依赖的可观察数据被改变时才会重新计算，计算值可以有 setter，但是 setter 不能直接修改计算值。Reactions 指的是当状态改变时需要自动运行的副作用，比如网络请求，将React组件显示在屏幕上。

action 就是任意一段修改 state 的代码。默认情况下，不允许在 actions 之外改变 state。这有助于在代码中清楚地对状态更新发生的位置进行定位。action 注解应该仅用于会修改 state 的函数

不限制 state 的数据类型，state 可以是 普通对象、数组、类实例、循环数据结构或引用。只要确保所有你想随时间改变的属性都被标记为observable，这样MobX就可以跟踪它们。

派生分为两种：Computed values,总是可以通过纯函数从当前的可观测 State 中派生；Reactions, 当 State 改变时需要自动运行的副作用。黄金法则是，如果要基于当前 State 创建值，请始终使用 computed。

计算值采用按需计算，并且只有当其依赖的可观察值被改变时才会重新计算。

## MobX 的优势

自动依赖收集，不需要思考状态是否真正的被使用

完美支持 typescript。

它区别于 redux 的最大特点是，可以直接修改数据，对 UI 进行精确刷新

## MobX-State-Tree

MobX-State-Tree 的简称是 MST

MobX是一个状态管理“引擎”，而MobX- state - tree为你的应用提供了结构和常用工具。MST在大型团队中很有价值，但在希望代码快速扩展的小型应用程序中也很有用。

## MobX + React

将它们结合在一起需要安装 mobx-react-lite 或 mobx-react。

用React.createContext代替Provider / inject。

observer 是一个高阶组件，它会自动订阅被包裹组件在渲染期间访问的可观察对象，可观察对象指的是用 makeAutoObservable 、makeObservable或 observable 转换之后的对象，当任何可观察对象发生变化时，组件会重新渲染。