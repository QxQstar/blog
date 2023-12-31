# React Element、fiber、组件和实例

## React Element

React Element 由 React.createElement 方法创建，它是用来描述组件实例和 DOM 节点的普通对象。Element 分为两大类：

1. DOM element: 其 type 属性是字符串。例如：`<button class="okButton"> OK </button>` 对应的 element 便是 DOM element
2. Component element： 其 type 是 class 或者函数。例如：`<MyButton className="okButton"> OK </MyButton>` 对应的 element 是 Component element，这里的 `MyButton` 要么是 class 要么是个函数。

在 React 应用中，React Element 通常由组件的 render 函数返回。

## fiber

每一个 React Element 都有一个相应的 fiber 节点，当 react element 第一次转化成 fiber 的时，React 会使用 element 上的数据创建一个 fiber，在之后的更新中，React 会重用已经创建的 fiber，只是使用 element 上的数据更新 fiber 上的属性。

## fiber 树

当应用渲染结束，fiber 树将反映当前应用程序状态。