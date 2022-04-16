# 深入 React 渲染流程

## 什么是渲染

在前面多次提到了渲染和重新渲染，那么它们究竟是什么意思？渲染是 React 让组件根据当前的 props 和 state 来描述它们要展示的用户界面的过程。重新渲染是React让组件重新描述它们要展示的用户界面的过程。

## 渲染流程概览

在渲染过程中，React 将从组件树的根开始，向下循环查找所有被标记为需要更新的组件，这个过程是异步的。对于每个标记的组件，React会调用classComponentInstance.render()(用于类组件)或FunctionComponent()(用于函数组件)，并保存它们的输出。组件要呈现哪些内容通常是用 JSX 语法编写的，这些 JSX 语法会被转换成 React.createElement() 函数调用的形式。createElement 返回 React element，这是描述用户界面的普通 JS 对象。例如：

```javascript
// This JSX syntax:
return <SomeComponent a={42} b="testing">Text here</SomeComponent>

// is converted to this call:
return React.createElement(SomeComponent, {a: 42, b: "testing"}, "Text Here")

// and that becomes this element object:
{type: SomeComponent, props: {a: 42, b: "testing"}, children: ["Text Here"]}
```

收集到组件树最终的输出之后，React 会将新的对象树与旧的对象树对比，并收集所有需要应用到 DOM 上的变更。比较新旧对象树的差异和收集变更的过程被称为‘reconciliation’，这是异步的。最终，React 会以同步的方式将所有计算出的变更应用到 DOM 上。

## render 阶段和 commit 阶段

React 将组件被渲染到屏幕上的工作分为两个阶段：

* render 阶段（渲染阶段）：计算组件的输出，并收集所有需要应用到 DOM 上的变更。这个阶段异步执行，它能够暂停render阶段的工作，以允许浏览器处理事件
* Commit 阶段（提交阶段）：将 render 阶段计算出的变更应用到 DOM 上。

将变更应用到 DOM 之后，react 会更新相应 DOM 节点和组件实例的 ref，然后同步运行类组件的 componentDidMount 或 componentDidUpdate 生命周期方法，以及函数组件的 useLayoutEffect 勾子，一个很短的时间之后，React 运行所有的 useEffect 勾子。

render 和更新 DOM 是不同的事情，组件经历了 render 不一定会发生 DOM 更新。当React渲染一个组件时：

* 组件可能会返回与上次相同的输出，所以它的 DOM 节点不需要做任何更改
* 在并发模式下，React可能会多次渲染一个组件，但如果其他更新使当前的工作失效，那么每次渲染输出都会被丢弃

## React如何处理渲染

在初始渲染完成后，有一些不同的方法告诉React准备重新渲染组件:

1. 类组件
  * this.setState()
  * this.forceUpdate()
2. 函数组件
  * useState 返回的 setState
  * useReducer 返回的 dispatch
3. 其他方式
  * 订阅的 context 值变更
  * 再一次调用 `ReactDOM.render(<AppRoot>)`

### 标准的渲染行为

记住这一点非常重要:

React的默认行为是，当父组件render时，React会递归地render它所有的子组件!当组件树是这样的：A > B > C > D。当它们被显示在界面之后，用户点击 B 组件中的按钮，使 B 组件的计数器加 1：

* 在 B 组件中调用 setState(),B 重新渲染被放在队列中
* React 从组件树的顶部开始遍历
* React看到 A 没有被标记为需要更新，就会跳过它。
* React 看到 B 被标记为需要更新，它会渲染B。和上次一样，B返回 C。
* C 没有被标记为为需要更新，但是，由于 C 的父组件B已经被渲染了，所以React会往下移动并渲染C，C再次返回了D
* D也没有被标记为需要更新，但是因为它的父元素C被渲染了，React就会向下移动并渲染D

用另一种方式重复:

默认情况下，渲染一个组件会导致它内部的所有组件也被渲染!

另外，还有一个关键点:

在正常渲染流程中，React不关心“props是否改变了”——它会无条件地渲染子组件，因为父组件已经渲染了!这意味着在你的根组件中调用setState()，而没有其他变更行为，这将导致React重新渲染组件树中的每个组件。

现在，很有可能树中的大多数组件将返回与上次完全相同的渲染输出，因此React将不需要对DOM做任何更改。但是，React仍然会要求组件渲染自己并进行对比渲染输出的工作，这两者都需要时间和精力。

### React 的渲染规则

React渲染的一个主要规则是，渲染必须是“纯粹的”，并且没有任何副作用!这可能是棘手的和令人困惑的，因为许多副作用并不明显，而且不会导致任何损坏。例如，严格地说，console.log()语句是一个副作用，但它实际上不会破坏任何东西。直接改变 props 绝对是一种副作用，而且它可能不会破坏任何东西。调用AJAX 也是一个副作用，根据请求的类型，它肯定会导致意想不到的应用程序行为。

在这里描述了 [React 的渲染规则](https://gist.github.com/sebmarkbage/75f0838967cd003cd7f9ab938eb1958f),在其中，他定义了不同的React生命周期方法的预期行为，包括render 方法，以及哪些操作是安全的“纯”操作，哪些是不安全的。关键点如下：

### 组件元数据和 Fiber

React存储一个内部数据结构，用于跟踪应用程序中存在的所有当前组件实例。这个数据结构的核心部分是一个被称为“fiber”的对象，它包含的元数据字段描述:

* 在组件树的这一点上应该呈现什么组件类型
* 与此组件关联的当前 props 和 state
* 指向父组件、兄弟组件和子组件的指针
* React用来跟踪渲染过程的其他内部元数据

在 render 阶段，React会遍历这棵 fiber 对象树，并在计算新的渲染结果时构造一个更新的树。注意，这些“fiber”对象存储了真实的组件 props 和状态值。当你在组件中访问 props 和 state 时，React实际上是让你访问存储在fiber 对象中的值。

事实上，对于类组件，React显式地复制componentInstance.props = newProps 在渲染组件之前被放置到该组件上。所以,this.props确实存在，但它之所以存在，是因为React从其内部数据结构中复制了引用。从这个意义上说，组件是React纤维对象上的一种外观。

类似地，React钩子也可以工作，因为React将一个组件的所有钩子都存储为一个链接列表，并连接到该组件的光纤对象上。当React呈现一个函数组件时，它会从光纤中获取钩子描述条目的链表，每次你调用另一个钩子时，它会返回存储在钩子描述对象中的相应值(比如useReducer的state和dispatch值)。

当父组件第一次渲染给定的子组件时，React会创建一个纤维对象来跟踪组件的“实例”。对于类组件，它直接调用const instance = new YourComponentType(props)，并将实际的组件实例保存到 fiber 对象中。对于函数组件，React只是将YourComponentType(props)作为函数调用。

### 组件类型和 Reconciliation

正如在“Reconciliation”文档页面中所描述的那样，为了让组件重新渲染的过程变得高效，React尽可能多地重用现有的组件树和DOM结构。如果在树的相同位置渲染相同类型的组件或 HTML 元素，React会重用这些组件，并在适当的情况下进行更新，而不是从头开始重新创建。这意味着，只要你一直要求React将组件类型渲染在相同的位置，React就会保持组件实例处于活动状态。类组件有实例，函数组件没有像类组件那样真正的实例。

那么，react 如何知道组件的输出是否发生了变化呢？

React 的渲染逻辑首先会使用 type 字段比较元素，如果给定位置上的元素类型不同，例如从div到span或者ComponentA到ComponentB, React会假设整个树发生了变化，从而加快比较过程。此时，React会销毁整个现有的组件树部分，包括所有的DOM节点，然后用新的组件实例重新创建它。

这意味着你在渲染的时候绝对不能创建新的组件类型!每当你创建一个新的组件类型时，它就是一个不同的引用，这将导致React不断地销毁并重新创建子组件树。换句话说，不要这样做:

```javascript
function ParentComponent() {
  // This creates a new `ChildComponent` reference every time!
  function ChildComponent() {}
  
  return <ChildComponent />
}
```

应该这样做

```javascript
function ChildComponent() {}
  
function ParentComponent() {

  return <ChildComponent />
}
```

### Key 与 Reconciliation

React 识别组件实例的另一种方式是通过 key 属性。React 将 key 作为组件的唯一标识符，它不会被当作 props 传递到组件中，React用来区分组件类型的特定实例。

我们使用 key 的主要场景是渲染列表，如果您要呈现的数据可能会以某种方式改变，比如重新排序、添加或删除列表条目，那么 key 在这里尤其重要。这里有一个例子说明为什么这很重要。假设我渲染一个包含10个TodoListItem组件的列表，使用数组下标作为键。React看到10个TodoListItem，key值为0..9。现在，如果我们删除第6个和第7个，并在末尾添加三个新的，我们最终将呈现key值为0..10的 TodoListItem。所以，它看起来就像我只是在最后添加了一个新TodoListItem，因为我们从10个列表项到11个。React会很乐意重用现有的DOM节点和组件实例。但是，这意味着我们现在可能在渲染TodoListItem key={6}，使用传递给列表项#8的todo项。所以，组件实例仍然是活的，但是现在它得到了一个不同的数据对象作为 props 。这可能有效，但也可能产生意想不到的行为。此外，React现在必须对几个列表项进行更新，以更改文本和其他DOM内容，因为现有的列表项必须显示与以前不同的数据。这些更新在这里真的没有必要，因为这些列表项都没有改变。

如果我们使用key={todo。id}， React将正确地看到我们删除了两个项目，并添加了三个新项目。它将销毁两个被删除的组件实例及其关联的DOM，并创建三个新组件实例及其DOM。这比不必要地更新实际上没有更改的组件要好。

key 对于列表之外的组件实例标识也很有用。你可以在任何时候向任何React组件添加一个 key 来表明它的身份，更改这个 key 会导致React销毁旧的组件实例和DOM，并创建新的组件实例。

### 批量渲染和计时

默认情况，只要调用 setState() 就会导致 React 启动新的渲染流程，同步执行它，并且返回。然而，React也以渲染批处理的形式自动应用了一种优化。渲染批处理是指对setState()的多次调用导致单个渲染传递被排队和执行，通常会有轻微的延迟。为了提高性能，React可能将多个setState()调用批处理到一个更新中。

在 React 的文档中提到[状态更新可能是异步的](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous),特别是，React会自动对React事件处理程序中发生的状态更新进行批处理,由于React事件处理程序在一个典型的React应用中占据了很大一部分代码，这意味着一个给定应用中的大多数状态更新实际上都是批处理的。

React通过将事件处理程序包装在一个名为unstable_batchedUpdates的内部函数中，实现了事件处理程序的渲染批处理。React会跟踪unstable_batchedUpdates运行时队列中的所有状态更新，然后在之后的单个渲染过程中应用它们。对于事件处理程序，这样做效果很好，因为React已经确切地知道对于给定的事件需要调用哪些处理程序。

从概念上讲，你可以把React内部的工作描述成如下伪代码:

```javascript
// PSEUDOCODE Not real, but kinda-sorta gives the idea
function internalHandleEvent(e) {
  const userProvidedEventHandler = findEventHandler(e);
  
  let batchedUpdates = [];
  
  unstable_batchedUpdates( () => {
    // any updates queued inside of here will be pushed into batchedUpdates
    userProvidedEventHandler(e);
  });
  
  renderWithQueuedStateUpdates(batchedUpdates);
}
```

然而，这意味着任何在立即调用堆栈之外排队的状态更新都不会被批处理在一起，让我们看一个具体的例子。

```javascript
const [counter, setCounter] = useState(0);

const onClick = async () => {
  setCounter(0);
  setCounter(1);
  
  const data = await fetchSomeData();
  
  setCounter(2);
  setCounter(3);
}
```

这将执行三次渲染，第一次将 setCounter(0) 和 setCounter(1) 打包在一起，因为它们都是在原始事件处理程序同步调用堆栈发生的，所以它们都发生在unstable_batchedUpdates()调用中。然而，setCounter(2)调用发生在await之后，这意味着原始的同步调用堆栈已经完成，函数的后半部分将在一个完全独立的事件循环调用堆栈中运行。因此，React将同步执行整个渲染传递，作为setCounter(2)调用的最后一步，完成传递，并从setCounter(2)返回。

setCounter(3)也会发生同样的事情，因为它也在原始事件处理程序之外运行，因此也在批处理程序之外。

在 commit 阶段的生命周期方法中还有一些额外的边缘情况:componentDidMount、componentDidUpdate和uselayouteeffect。它们的存在主要是为了允许您在 render 之后，但在浏览器绘制之前执行额外的逻辑。具体来说，一个常见的用例是:

* 第一次用不完整的数据渲染组件
* 在 commit 阶段的生命周期中，使用 ref 来测量页面中实际DOM节点的实际大小
* 基于这些度量在组件中更新一些 state
* 立即用更新的数据重新渲染

在这个用例中，我们根本不想让用户看到最初呈现的“部分”UI——我们只希望显示“最终”UI。当DOM结构被修改时，浏览器会重新计算它，但当JS脚本仍在执行并阻塞事件循环时，它们不会在屏幕上实际绘制任何东西。你可以执行多个DOM突变，比如div.innerhtml = "a";div.innerHTML = b";， "a"将永远不会出现。

因此，在 commit 阶段的生命周期始终同步运行。这样，如果你尝试执行一个更新像“部分->最终”开关，只有“最终”的内容将永远在屏幕上可见。

最后，据我所知，useEffect回调中的状态更新被排队，并在所有useEffect回调完成后在“Passive Effects”阶段的末尾刷新。

值得注意的是，unstable_batchedUpdates API是公开导出的，但是：

* 按名称来看，它被标记为“不稳定”，并不是React API官方支持的一部分
* 另一方面，React团队表示，“它是‘不稳定’api中最稳定的，Facebook一半的代码都依赖于这个功能。”
* 与其他由React包导出的核心React API不同，unstable_batchedUpdates是一个特定于 reconciler 的API，它不是React包的一部分。相反，它实际上是由react-dom和react-native导出的。这意味着其他 reconciler ，如reaction -three-fiber或 ink，可能不会输出unstable_batchedUpdates函数。

### 渲染行为边缘案例

React会在 development 模式中在 `<StrictMode>`标签中 double-render 组件，这意味着您的 render 逻辑运行的次数与 commit 的次数不相同，并且您不能在 render 时依赖console.log()语句来计算已经发生的 commit 次数。相反，要么使用React DevTools Profiler来捕获跟踪并计算总体 commit 的数量，要么在useEffect钩子或componentDidMount/Update生命周期中添加日志记录。这样，只有当React实际完成渲染并 commit 时，日志才会打印出来。

通常情况下，在 render 逻辑中，永远不应该更新状态。换句话说，可以创建一个 click 回调函数，它将在click发生时调用setSomeState()，但不应该在render逻辑中调用setSomeState()。然而，有一个例外。函数组件可以在 render 时直接调用setSomeState()，只要它是有条件地执行的，而不是每次该组件 render 时都执行，这[类似于类组件中的getDerivedStateFromProps](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops),如果一个函数组件在render时更新状态，React会立即使用更新的状态，并同步地重新渲染该组件。如果组件无限地将状态更新排队，并迫使React重新呈现它，React会在多次重试后打破循环并抛出一个错误（重试50次）。这种技术可以用于基于 props 更改立即强制更新状态值，而不需要在useEffect中重新渲染+调用setSomeState()。

## 提高渲染性能

渲染是react工作中的一部分，但是渲染工作有时候会被认为是浪费时间。如果组件render的输出没有改变，而它对应的DOM节点也不需要更新，那么与该组件相关的render工作真的是在浪费时间。React组件render的输出应该始终基于当前 props 和状态。因此，如果我们提前知道组件的props和状态没有改变，我们也应该知道渲染输出将是相同的，这个组件不需要更改，我们可以安全地跳过渲染工作。

一般来说，当试图提高软件性能时，有两个基本的方法:1)更快地完成相同的工作，2)做更少的工作。优化React渲染主要是通过在适当的时候跳过渲染组件来减少工作量。

### 组件渲染优化技术

React提供了三个主要的api，可以让我们跳过重新渲染组件:

* 类组件的 shouldComponentUpdate：这是类组件可选的生命周期函数，它在组件render程序早期被调用。如果返回 false，那么React会跳过渲染该组件，最常见的方法是检查组件的 props 和状态是否自上次以来发生了改变，如果它们没有改变则返回false。
* React.PureComponent：它在 React.Component的基础上添加 shouldComponentUpdate 生命周期，去比较组件的 props 和状态是否自上次以来有变更。
* React.memo()：它是一个高阶组件，接收自定义组件作为参数，返回一个被包裹的组件。被包裹的组件的默认行为是检查props是否有更改，如果没有，则跳过重新渲染。

上述方法都通过‘浅比较’来确定值是否发生变化，如果通过 mutable 的方式修改值，这些 API 会认为值没有变更。除了上述三种常见的阻止组件重新渲染的方式，还有一个不常见的方式，即，如果组件在其 render 过程中返回的元素引用与上次完全相同，那么 React 将跳过重新渲染引用相同的子组件。示例如下：

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

组件 ShowChildren 的 props.children 对应的是 Children 组件，因此写法一和写法二在浏览器中显示的结果一样。点击按钮不会使写法一的 Children 组件重新渲染，但是会使写法二的 Children 组件重新渲染。

上述4种方式，跳过渲染意味着react会跳过整个子树的重新渲染。

### Props 对渲染优化的影响

默认情况，只要组件重新渲染，那么React会重新渲染所有被它嵌套的后代组件，即便组件的 props 没有变更。如果试图通过 React.memo 和 React.PureComponent 优化组件的渲染性能，那么要注意每个 prop 的引用是否变更。下面的示例试图使用 React.memo 跳过组件重新渲染，但实际上不会跳过，代码如下：

```javascript
const MemoizedChildren = React.memo(Children)

function Parent() {
    const onClick = () => { /** todo*/}
    return <MemoizedChildren onClick={onClick}/>
}
```

上述代码中，Parent 组件重新渲染会创建新的 onClick 函数，所以对 MemoizedChildren 而言，props.onClick 的引用有变化，最终被 React.memo 包裹的 Children 会重新渲染。如果跳过重新渲染对你真的很重要，在上述代码中要将 React.memo 与 useCallback 配合使用才能达到目的。关于 React.memo、useCallback 和 useMemo 的详细使用案例可以查看 3.3.3。

## Immutability 与 React 渲染

3.2.3 曾简单介绍过 Immutability 对 React 的影响，本小节将继续深入。在 react 应用中，更新状态必须满足 Immutability 原则，这主要是因为 React.memo、PureComponent shouldComponentUpdate 和 React Hooks 通过'浅比较'确定值是否发生变化，如果变更状态不满足 Immutability 原则，它们会认为状态值没有变化。

在函数组件中，使用 useState 和 useReducer 返回的 setState 和 dispatch 更新状态，React 会将组件的重新渲染放在重新渲染队列中。React 要求所有 hooks 更新状态必须传入/返回一个新的引用作为状态值。在render阶段，react 使用组件当前的状态和 props 计算组件的输出，如果 React 发现状态更新来自于 hook，它会检查该值是否与以前有相同的引用，如果引用相同，它会退出该函数组件的渲染流程。

在更新状态并重新渲染时，React 会将类组件的 this.setState 与函数组件的 useState 和 useReducer 区别对待。使用 this.setState 更新状态，React 并不关心状态的引用是否变化，只要在类组件中调用 this.setState，该组件一定会重新渲染。

## Reconciliation

Reconciliation 被称为 diff 算法，它用来比较两个 React 元素树之间的差异，时间复杂度为 O(n)。它基于如下两个假设：

1. 两个不同类型的元素对应的元素树完全不同
1. 在列表中，如果两个元素的key属性相同，那么它们被识别为相同的元素



### commit 阶段的生命周期有哪些？