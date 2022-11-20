# 讲清楚 React 的重新渲染

Web 前端开发者对渲染和重新渲染应该不陌生，在 React 中，它们究竟是什么意思？

* 渲染：React 让组件根据当前的 props 和 state 描述它要展示的内容。
* 重新渲染：React 让组件重新描述它要展示的内容。

渲染与更新 DOM 是不同的事情，组件经历了渲染，DOM 不一定会更新，React 渲染一个组件，如果组件返回的结果与上次的相同，那么它的 DOM 节点不需要有任何更新。本文主要介绍与 React 渲染相关的知识。要将组件显示到屏幕上，React 的工作主要分为两个阶段：

* render 阶段（渲染阶段）：计算组件的输出并收集所有需要应用到 DOM 上的变更。
* commit 阶段（提交阶段）：将 render 阶段计算出的变更应用到 DOM 上。

在 commit 阶段 React 会更新 DOM 节点和组件实例的 ref，如果是类组件，React会同步运行 componentDidMount 或 componentDidUpdate 生命周期方法，如果是函数组件，React会同步运行 useLayoutEffect 勾子，当浏览器绘制 DOM 之后，再运行所有的 useEffect 勾子。

## React 重新渲染

初始化渲染之后，下面的这些原因会让React重新渲染组件：

1. 类组件

* 调用 this.setState 方法。
* 调用this.forceUpdate方法。

2. 函数组件

* 调用 useState 返回的 setState。
* 调用 useReducer 返回的 dispatch。

3. 其他

* 组件订阅的 context value 发生变更
* 重新调用 ReactDOM.render(　`<AppRoot>`)

假设组件树如下

![](./tree.jpeg)

默认情况，如果父组件重新渲染，那么 React 会重新渲染它所有的子组件。当用户点击组件 A 中的按钮，使 A 组件 count 状态值加1，将发生如下的渲染流程：

1. React将组件A添加到重新渲染队列中。
2. 从组件树的顶部开始遍历，快速跳过不需要更新的组件。
3. React发生A组件需要更新，它会渲染A。A返回B和C
4. B没有被标记为需要更新，但由于它的父组件A被渲染了，所以React会渲染B
5. C没有被标记为需要更新，但由于它的父组件A被渲染了，所以React会渲染C，C返回D
6. D没有标记为需要更新，但由于它的父组件C被渲染了，所以D会被渲染。

在默认渲染流程中，React 不关心子组件的 props 是否改变了，它会无条件地渲染子组件。很可能上图中大多数组件会返回与上次完全相同的结果，因此 React 不需要对DOM 做任何更改，但是，React 仍然会要求组件渲染自己并对比前后两次渲染输出的结果，这两者都需要时间。

## Reconciliation

Reconciliation 被称为 diff 算法，它用来比较两颗 React 元素树之间的差异，为了让组件重新渲染变得高效，React 尽可能地复用现有的组件和 DOM。为了降低时间复杂度，Diff 算法基于如下两个假设：

1. 两个不同类型的元素对应的元素树完全不同。
2. 在同一个列表中，如果两个元素key属性的值相同，那么它们被识别为同一个元素。

### 元素类型对 Diff 的影响

React 使用元素的 type 字段比较元素类型是否相同，如果两颗树在相同位置要渲染的元素类型相同，那么 React 就重用这些元素，并在适当的时候更新，不需要重新创建元素，这意味着，只要一直要求 React 将某组件渲染在相同的位置，那么 React 始终不会卸载该组件。如果相同位置的元素类型不同，例如从 div 到 span 或者从ComponentA 到 ComponentB，React会认为整个树发生了变化，为了加快比较过程，React 会销毁整个现有的组件树，包括所有的 DOM 节点，然后重新创建元素。

浏览器内置元素的 type 字段是一个字符串，自定义组件元素的 type 字段是一个类或者函数，由于元素类型对 Diff的影响，所以在渲染期间不要创建组件，只要创建一个新的组件，那么它的 type 字段就是不同的引用，这将导致 React 不断地销毁并重新创建子组件树。不要有如下的代码：

```javascript
function ParentCom() {
  // 每一次渲染 ParentCom 时，都会创建新的ChildCom组件
  function ChildCom() {/**do something*/}
  
  return <ChildCom />
}
```

上述代码不推荐，正确的做法是将 ChildCom 放在ParentCom 的外面。

### key 对 Diff 的影响

React 识别元素的另一种方式是通过 key 属性，key 作为组件的唯一标识符不会当作prop传递到组件中，可以给任何组件添加一个 key 属性来标注它，更改 key 的值会导致旧的组件实例和 DOM 被销毁。

列表是使用 key 属性的主要场景，在 React 官方文档中提到，不要将数组的下标作为 key 值，而是用数据唯一 ID 作为 key 值。在这里分别介绍这两种方式的区别。

假如 Todo List 中有 10 项，先用数组下标作为 key 的值，这 10 项 Todo 的 key 值为 0...9，现在删除数组的第 6 项和第 7 项，并在数组末尾添加 3 个新的数据项，我们最终将得到 key 值为0..10的 Todo，看起来只是在末尾新增 1 项，将原来的列表从10项变成了11项，React 很乐意复用已有的 DOM 节点和组件实例，这意味着原来 #6 对应的组件实例没有被销毁，现在它接收新的 props 用于呈现原来的 #8。在这个例子中 React 会创建 1 个Todo，更新 4 个Todo。

如果使用数据的 ID 作为 key 值，React 能发现第 6 项和第 7 项被删除了，它也能发现数组新增了 3 项，所以 React 会销毁 #6 和 #7 项对应的组件实例及其关联的 DOM，还会创建 3 个组件实例及其关联的 DOM。 

## 提高渲染性能

要将组件显示在界面上，组件必须经历渲染流程，但渲染工作有时候会被认为是浪费时间，如果渲染的输出结果没有改变，它对应的DOM节点也不需要更新，此时与该组件相关的渲染工作真的是在浪费时间。React组件的输出结果始终基于当前 props 和 state 的值，因此，如果我们知道组件的 props 和 state 没有改变，那么我们可以无后顾之忧地让组件跳过重新渲染。

### 跳过重新渲染

React 提供了 3 个主要的API让我们跳过重新渲染:

* React.Component 的 shouldComponentUpdate：这是类组件可选的生命周期函数，它在组件 render 阶段早期被调用，如果返回false，React 将跳过重新渲染该组件，使用它最常见的场景是检查组件的 props 和 state 是否自上次以来发生了变更，如果没有改变则返回false。

* React.PureComponent：它在 React.Component 的基础上添加默认的 shouldComponentUpdate 去比较组件的 props 和 state 自上次渲染以来是否有变更。
* React.memo()：它是一个高阶组件，接收自定义组件作为参数，返回一个被包裹的组件，被包裹的组件的默认行为是检查 props 是否有更改，如果没有，则跳过重新渲染。

上述方法都通过‘浅比较’来确定值是否有变更，如果通过 mutable 的方式修改状态，这些 API 会认为状态没有变。

* 如果组件在其渲染过程中返回的元素的引用与上一次渲染时的引用完全相同，那么 React 不会重新渲染引用相同的组件。示例如下：

```javascript
function ShowChildren(props: {children: React.ReactNode}) {
    const [count, setCount] = useState<number>(0)

    return (
        <div>
            {count} <button onClick={() => setCount(c => c + 1)}>click</button>
            {/* 写法一 */}
            {props.children}
            {/* 写法二 */}
            {/* <Children/> */}
        </div>
    )
}
```

上述 ShowChildren 的 props.children 对应 Children 组件，因此写法一和写法二在浏览器中呈现一样。点击按钮不会让写法一的 Children 组件重新渲染，但是会使写法二的 Children 组件重新渲染。

上述4种方式跳过重新渲染意味着 React 会跳过整个子树的重新渲染。

### Props 对渲染优化的影响

默认情况，只要组件重新渲染，React 会重新渲染所有被它嵌套的后代组件，即便组件的 props 没有变更。如果试图通过 React.memo 和  React.PureComponent 优化组件的渲染性能，那么要注意每个 prop 的引用是否有变更。下面的示例试图使用 React.memo 让组件不重新渲染，但事与愿违，组件会重新渲染，代码如下：

```javascript
const MemoizedChildren = React.memo(Children)

function Parent() {
    const onClick = () => { /** todo*/}
    return <MemoizedChildren onClick={onClick}/>
}
```

上述代码中，Parent 组件重新渲染会创建新的 onClick 函数，所以对 MemoizedChildren 而言，props.onClic k的引用有变化，最终被 React.memo 包裹的Children 会重新渲染,如果让组件跳过重新渲染对你真的很重要，那么在上述代码中将 React.memo 与 useCallback 配合使用才能达到目的。

