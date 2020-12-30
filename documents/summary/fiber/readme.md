# 深入 React fiber 内部

你是否想知道当你调用 `ReactDOM.render(<App />, document.getElementById('root'))` 时React 内部发生了什么？

我们都知道 ReactDOM 会创建 DOM 树并且将在屏幕上绘制应用程序。那么 React 是怎么创建 DOM 树的呢？当应用程序的状态发生变化之后它是怎么更新 DOM 树的呢？

在这篇文章中我会先介绍在 React >= 15.0.0 是怎么创建 DOM 树的，然后会介绍在 React 16.0.0 中是怎么解决之前版本中的创建 DOM 树的问题的。在这篇文章中会包含很多 React 内部实现细节，这些细节对于使用 React 的前端开发人员不是必要的。

## Stack reconciler

我们先来看看，我们熟悉的`ReactDOM.render(<App />, document.getElementById('root'))`

ReactDOM 会将`<App />` 传递给 reconciler。这儿有两个问题：

1. `<App />` 是指什么?
2. 什么是 reconciler?

我们来分析一下这两个问题。`<App />` 是一个 React 元素，也是是元素描述树。在 React 的官网上提到：

```
    element 是描述组件实例或DOM节点及其所需属性的普通对象
```

换句话说，elements 不是实际的 DOM 节点也不是组件实例，它们是一种向 React 描述它们是什么类型的元素，它们拥有什么属性，以及它们的子元素是谁的方式。

React 抽象出了构建、呈现和管理实际 DOM 树生命周期的所有复杂部分，有效地简化了开发人员的工作，这就是 React 真正强大的地方。为了理解 React 所做的事情，让我们先看看使用面向对象的传统方式如何编程。

在传统的面向对象编程中，开发人员需要实例化和管理每个 DOM 元素的生命周期。例如，你想要创建一个带有提交按钮的表单，即便如此简单的状态管理也需要开发人员费点儿心力。假设按钮组件有一个状态叫做`isSubmitted`，按钮组件的生命周期流程图可能像下面这样：

![](https://i0.wp.com/blog.logrocket.com/wp-content/uploads/2019/11/button-component-lifecycle.png?w=730&ssl=1)

随着状态变量数量的增加，流程图的大小和代码行数呈指数增长。

React 用 elements 来解决这个问题，在 React 中有两种类型的 elements：

1. DOM element: element 的 type 属性是字符串。例如：`<button class="okButton"> OK </button>` 就是 DOM element
2. Component element： element 的 type 是 class 或者函数。例如：`<Button className="okButton"> OK </Button>` 就是 Component element，这里的 `Button` 要么是 class 要么是个函数

在 React 中，这两种 elements 类型都是简单的对象。它们仅仅描述了需要在屏幕上呈现的内容，当你创建和实例化它们时，不会导致任何渲染发生。这使得 React 更容易解析和遍历它们来构建 DOM 树，实际的渲染将在遍历完成时进行。

如果`<App />` render 下面的内容：

```html
<Form>
  <Button>
    Submit
  </Button>
</Form>
```

 React 会使用 `<Form>` and `<Button>`组件相应的属性来渲染它们。如果 Form 组件是一个函数组件，如下：

```javascript
const Form = (props) => {
  return(
    <div className="form">
      {props.form}
    </div>
  )
}
```

React 在渲染 `<Form>` 时会调用 render 方法去知道它渲染了什么元素并且最终看到它渲染了一个带子元素的 div，React 将会重复这个过程直到它知道页面上所有组件的底层 DOM 标签元素。

这种为了知道 `<App/>` 组件树的最底层的 DOM 标签元素的递归遍历过程称为 reconciliation, 在 reconciliation 的最后，React 就得到了 DOM 树的结构，react-dom 会以最小改动去更新 DOM 节点。当调用 `ReactDOM.render()` 或 `setState()` 时，React 会执行 reconciliation，当 `setState()` 时，React 会进行遍历并且通过对比新的 tree 和旧的 tree 计算出本次有哪些变更，然后将变更应用到实际的 DOM tree。

介绍完 reconciliation 过程之后，我们来看一下这种模式的缺陷。

在 reconciliation 过程中用到了递归遍历，所以 reconciliation 是堆栈的模式 —— 即：先进后出。

## 递归

要理解为什么会出现这种情况，让我们举一个简单的例子，看看调用堆栈中发生了什么。

```javascript
function fib(n) {
  if (n < 2){
    return n
  }
  return fib(n - 1) + fib (n - 2)
}

fib(3)
```

![](https://i1.wp.com/blog.logrocket.com/wp-content/uploads/2019/11/call-stack-diagram.png?w=730&ssl=1)

正如我们所看到的，fib() 的每一次调用都将被 push 到堆栈中，直到它 pop 出 fib(1)，然后继续 push fib 到堆栈中，当遇到 return 语句时再次 pop。

React 中的 reconciliation 算法也是一个递归算法。更新会导致立即重新渲染整个子树，虽然它工作的很好，但是它也有一些局限性：

1. 在用户界面上立即应用每一次更新，这回造成浪费，导致帧丢失，降低用户体验
2. 不同类型的更新有不同的优先级，例如：动画更新需要比数据存储的更新完成得更快

为了理解丢帧，我们先来解释一下什么是帧率，帧率是图像连续出现在显示器上的频率，我们在电脑屏幕上看到的一切都是由在屏幕上以瞬间的速度播放的图像或帧组成的。通常情况下，为了让人眼感觉流畅和即时，视频需要以大约30帧每秒(FPS)的速度播放，高于这一数值的内容将提供更好的体验。

如今大多数设备的屏幕刷新速度都是60 FPS，1/60 = 16.67ms，这意味着每 16ms 就会显示一个新帧。因为如果 React 在屏幕上渲染的时间超过 16 毫秒，浏览器就会删除该帧。由于浏览器的内部开销，你的所有工作需要在 10 ms 之内完成，如果无法达到这个数值，屏幕上的内容就会抖动。如果在每次状态变更的时候，React 的 reconciliation 算法都遍历整个 `<App />` tree 并且重新渲染它，如果遍历超过了 16 ms，这将会导致丢帧。这就是为什么按优先级对更新进行分类，而不是盲目地将每一次更新传递给 reconciler。

由于上述原因，React 团队重写了 reconciliation 算法，新的算法叫做 fiber

## fiber 怎么工作

我们已经知道了开发 fiber 的原因，我们总结一下 fiber 需要实现的功能：

1. 对不同类型的更新分配优先级
2. 暂停工作，稍后再来完成
3. 终止不需要完成的工作
4. 重新使用以前完成的功能

为了实现这些功能，我们先研究一下 JS 如何处理执行上下文。

## JavaScript 的执行堆栈

每当函数被执行的时候，js 引擎会创建一个函数执行上下文，除此之外，js 引擎启动之后，它也会创建一个保存全局对象的全局执行上下文。在 js 中这两种上下文使用堆栈数据结构来处理。

```javascript
function a() {
  console.log("i am a")
  b()
}

function b() {
  console.log("i am b")
}

a()
```

js 引擎首先创建一个全局执行上下文并且将它 push 到执行栈中，然后它为 `a` 创建一个函数执行上下文并 push 到栈中，当 `a` 中的 `b` 被调用时，它为 `b` 创建一个函数执行上下文并且 push 到栈中。当`b`退出，js 引擎摧毁`b`的上下文，当`a`退出，js 引擎摧毁`a`的上下文。

![](https://i2.wp.com/blog.logrocket.com/wp-content/uploads/2019/11/execution-stack.png?w=534&ssl=1)

当浏览器执行了一个异步操作，如 http 请求，JS引擎在这里做了一些不同的事情。在执行栈的底部，js 引擎有一个队列数据结构，这称为事件队列，事件队列用了处理浏览器中的异步操作，如：HTTP 请求。

![](https://i1.wp.com/blog.logrocket.com/wp-content/uploads/2019/11/event-queue-diagram.png?w=730&ssl=1)

当执行栈为空或者当执行栈中只有全局执行上下文时，js 引擎会处理事件队列中的事件。回头看一下 stack reconciler，当 React 编译 tree 的时候，遍历发生在执行栈中，当有更新发生，更新被 push 到事件队列，只有当执行栈为空的时候，更新才会被处理。

 Andrew Clark这样描述 fiber

```cli
Fiber是对堆栈的重新实现，专门用于React组件。您可以将 Fiber 看作虚拟堆栈帧。重新实现堆栈的好处是可以将堆栈帧保存在内存中，并根据需要随时执行它们,
```

简单地说，fiber 表示具有自己的虚拟堆栈的工作单元。在以前的 reconciliation 算法中，react 创建了一个不可变的对象树(react elements)，并递归的遍历树。在 fiber 算法中，react 创建了一个 fiber 节点树，fiber 节点是 mutated。fiber 节点保存组件的 state、props 和它要渲染的底层 DOM 元素。因为 fiber 节点是 mutated，所以 React 不需要为更新视图重新创建整个 fiber，当视图变更发生的时候它只需要克隆和更新节点。此外，对于 fiber 树，React 不会进行递归遍历，它创建一个单链表，并执行父级优先、深度优先的遍历。

## fiber 节点的单链表

fiber 节点即代表一个堆栈也代表一个 React 组件实例，fiber 节点中包含如下的成员：

1. type: 它是字符串、函数或 class。对于内置组件，如： `<div>`,`<span>`等，它是字符串；对于自定义组件，它是函数或 class。
2. key: 它与我们传递给 react elements 的 key 属性值相同
3. child: 它是在组件上调用 render() 时返回的元素。

```javascript
const Name = (props) => {
  return(
    <div className="name">
      {props.name}
    </div>
  )
}
```

`Name` 的 child 是 `<div>`。

4. sibling: 表示 render 返回列表的情况

```javascript
const Name = (props) => {
  return([<Customdiv1 />, <Customdiv2 />])
}
```

在上面的例子中，Customdiv1 和 Customdiv2 是 Name 的子元素，Name 是父元素。这两个子元素形成了一个单链表。

5. return: 表示返回到堆栈帧，该堆栈帧在逻辑上是返回到父 fiber 节点。因此，它代表父节点。

6. pendingProps 和 memoizedProps

`Memoization` 意味着将函数的执行结果保存起来供之后使用，避免重新计算。pendingProps 代表传递给组件的 props，memoizedProps 在执行栈的末尾被初始化，它用于存储这个节点的 props

当传入的 pendingProps 与 memoizedProps 相等时，这意味着 fiber 之前的输出可以被重用。

7. pendingWorkPriority

pendingWorkPriority 代表 fiber 对应任务的优先级，用数字代表优先级，数字越大优先级越低。不可以使用下面的函数来检查 fiber 的优先级是否小于等于给定的优先级等级。

```javascript
function matchesPriority(fiber, priority) {
  return fiber.pendingWorkPriority !== 0 &&
         fiber.pendingWorkPriority <= priority
}
```

8. Alternate

在任何时候，一个组件实例最多对应两个 fiber，分别是 current fiber 和 in-progress fiber，current fiber 和 in-progress fiber 相互交替。current fiber 代表已经被渲染的内容，in-progress fiber 在堆栈中还没有被返回。

9. Output

React 应用程序的叶子节点，它们特定于呈现环境，例如：在浏览器应用中，它们是 div,span 等，在 JSX 中，它们用小写的标签名表示。理论上，fiber 的 output 是一个函数的返回值。每个 fiber 最终都有 output，但是 output 仅仅被组件的叶子节点创建，然后往上传递。output 最终被提供给渲染器，这样它就可以将更改渲染到渲染环境。

让我们看看下面的代码对应的 fiber 树是怎么样的？

```javascript
const Parent1 = (props) => {
  return([<Child11 />, <Child12 />])
}

const Parent2 = (props) => {
  return(<Child21 />)
}

class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    <div>
      <Parent1 />
      <Parent2 />
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

![](https://i0.wp.com/blog.logrocket.com/wp-content/uploads/2019/11/fiber-tree-diagram.png?w=730&ssl=1)

fiber 由 child 单链表和 parent-child 单链表组成。

10. Render phase

为了理解 React 如何构建 fiber 树并在其上执行 reconciliation 算法，我决定在 React 源代码中编写一个单元测试，并附加一个 debugger 来跟踪该过程。如果你对这个过程感兴趣，你可以[克隆代码](https://github.com/facebook/react/tree/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-dom/src/__tests__)，添加 Jest test 并且加一个 debugger，我编写的测试是一个简单的测试，它基本上渲染一个带有文本的按钮。当你点击按钮的时候，应用呈现会摧毁按钮并且渲染一个带有不同文本的 div，我将文本内容保存到 state 中

```javascript
'use strict';

let React;
let ReactDOM;

describe('ReactUnderstanding', () => {
  beforeEach(() => {
    React = require('react');
    ReactDOM = require('react-dom');
  });

  it('works', () => {
    let instance;
  
    class App extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          text: "hello"
        }
      }

      handleClick = () => {
        this.props.logger('before-setState', this.state.text);
        this.setState({ text: "hi" })
        this.props.logger('after-setState', this.state.text);
      }

      render() {
        instance = this;
        this.props.logger('render', this.state.text);
        if(this.state.text === "hello") {
        return (
          <div>
            <div>
              <button onClick={this.handleClick.bind(this)}>
                {this.state.text}
              </button>
            </div>
          </div>
        )} else {
          return (
            <div>
              hello
            </div>
          )
        }
      }
    }
    const container = document.createElement('div');
    const logger = jest.fn();
    ReactDOM.render(<App logger={logger}/>, container);
    console.log("clicking");
    instance.handleClick();
    console.log("clicked");

    expect(container.innerHTML).toBe(
      '<div>hello</div>'
    )

    expect(logger.mock.calls).toEqual(
      [["render", "hello"],
      ["before-setState", "hello"],
      ["render", "hi"],
      ["after-setState", "hi"]]
    );
  })

});
```

[createFiberFromTypeAndProps()](https://github.com/facebook/react/blob/f6b8d31a76cbbcbbeb2f1d59074dfe72e0c82806/packages/react-reconciler/src/ReactFiber.js#L593)是一个使用来自特定 React elemens 的数据创建每个 React fiber 的函数。我给这个函数打一个断点并且运行测试代码，调用栈如下所示：

[](https://i1.wp.com/blog.logrocket.com/wp-content/uploads/2019/11/function-call-stack-1.png?w=730&ssl=1)

调用栈从 render() 开始，最终到达 createFiberFromTypeAndProps()。在调用栈中还有一些其他有意思的函数，如：workLoopSync(), performUnitOfWork() 和  beginWork()。

```javascript
function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

workLoopSync()是 React 开始构建树的地方，从 App 节点开始，然后递归地移动到 div、div 和 button，它们都是 App 的子节点。workInProgress 保存着下一个有工作要做的 fiber 节点的引用。



# React 如何并且为什么在 fiber 中使用链表来遍历组件树

## 背景

在 fiber 架构中主要有两个阶段：render 阶段和 commit 阶段。在 render 阶段，fiber 除了会遍历组件树还会做下面的事情：

1. 更新 state 和 props
2. 调用生命周期函数
3. 检索组件的 children
4. 将新的 children 与之前的 children 进行比较
5. 计算出需要执行的 DOM 更新。

这些工作都在 fiber 内部进行，react element 的类型决定了需要完成的工作类型，例如，对于一个类组件，Reac t需要实例化类，而对于一个函数组件，它不会这样做。

如果 react 同步的遍历 整个组件树，并为每个组件执行工作，那么应用程序代码执行逻辑所需的时间可能超过16毫秒，这将导致丢帧。要怎么去解决这个问题呢？

新版浏览器提供的 requestIdleCallback 函数可以在浏览器空闲期间对要调用的函数进行排队。用法如下：

```javascript
requestIdleCallback((deadline)=>{
    console.log(deadline.timeRemaining(), deadline.didTimeout)
});
```

在控制台运行上面的代码，Chrome 会打印出 49.9 false，它表示你有49.9毫秒去做任何你需要做的工作，你还没有用完所有分配的时间。只要浏览器有工作要做，timerremaining 的值就会改变，所以应该经常检查它。

如果我将 React 在组件上需要执行的所有工作都放在 performWork 函数中，并且使用 requestIdleCallback API 去安排工作，我们的代码可能是想下面这样

```javascript
requestIdleCallback((deadline) => {
    // while we have time, perform work for a part of the components tree
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && nextComponent) {
        nextComponent = performWork(nextComponent);
    }
});
```

我们只是在一个组件上执行工作，并且返回下一个组件的实例。但是现实的情况是，我们不止一个组件，为了解决同步遍历组件树导致丢帧的问题，React必须重新实现从依赖 js 内置堆栈的同步递归模型到带有链表和指针的异步模型的树遍历算法，这个算法称为 Fiber。Andrew 这样说到：

*** 如果你只是依赖 js 内置的调用堆栈，那么它会一直执行直到堆栈为空，这种情况我们不能中断调用堆栈也不能手动的手动操作堆栈帧，fiber 就是用了解决这个问题的。Fiber 是对堆栈的重新实现，专门用于React组件，你可以简单的将 fiber 当作虚拟堆栈帧***

## 关于栈的解释

在这里假设你已经熟悉调用栈的概念，如果你给代码打一个断点，你可以在浏览器的调试器中看到调用栈。在计算机科学中，调用栈是栈数据结构它用于存储计算机程序的活动子程序，调用栈用于跟踪活动子程序执行完成之后应该返回的控制点。调用栈由调用帧组成，每个调用帧都对应一个子程序的调用，这个子程序还没有已返回结束。例如：子程序 DrawLine 正常运行，它被子程序 DrawSquare 调用，调用栈可能如下图所示

![](https://admin.indepth.dev/content/images/2019/07/image-46.png)

## 为什么堆栈与 React 相关

正如我们在前面提到的，在 render 阶段 react 会遍历组件树并且对组件执行一些任务。先前的 Reconciliation 算法中使用了依赖内置堆栈的同步递归模型来遍历树。[React 的官方文档](https://reactjs.org/docs/reconciliation.html?source=post_page---------------------------#recursing-on-children)中描述了这个过程，并且进行了大量的讨论

***默认情况下，当作 DOM 节点的子节点上递归时，React 会同时遍历新旧两个子节点列表，并在它们存在差异时生成一个突变***

仔细想想，每次递归调用都会向堆栈中添加一个帧，它是同步进行的。如果我们的组件树如下图所示：

![](https://admin.indepth.dev/content/images/2019/07/image-47.png)

我们使用下面的方式来表示组件实例

```javascript
const a1 = {name: 'a1'};
const b1 = {name: 'b1'};
const b2 = {name: 'b2'};
const b3 = {name: 'b3'};
const c1 = {name: 'c1'};
const c2 = {name: 'c2'};
const d1 = {name: 'd1'};
const d2 = {name: 'd2'};

a1.render = () => [b1, b2, b3];
b1.render = () => [];
b2.render = () => [c1];
b3.render = () => [c2];
c1.render = () => [d1, d2];
c2.render = () => [];
d1.render = () => [];
d2.render = () => [];
```
React 遍历组件树并且为每个组件执行工作。为了简化，要做的工作是记录当前组件的名称并检索其子组件，这是我们用递归来做的。

## 递归遍历

实现遍历工作的主要函数叫做 `Walk`,代码如下：

```javascript
walk(a1);

function walk(instance) {
    doWork(instance);
    const children = instance.render();
    children.forEach(walk);
}

function doWork(o) {
    console.log(o.name);
}
```

执行结果如下：

```javascript
a1, b1, b2, c1, d1, d2, b3, c2
```

使用递归是很直观的并且它很适合与遍历树状结构的数据。但是，它有局限性，最大的问题是：我们不能将要执行的工作划分到多个单元中，也不能暂停执行然后在之后的某个时刻恢复执行。使用这种方法，React 会一直迭代，直到它处理了所有组件并且栈为空为止。

在 fiber 算法中不再使用递归遍历树的算法，它使用单链表遍历算法，它可能暂停遍历，并且不让栈变长。

## 链表遍历

我很幸运地找到了[Sebastian Markbage提出的算法的要点](https://github.com/facebook/react/issues/7942?source=post_page---------------------------#issue-182373497)。为了实现这个算法，我们需要 fiber 数据结构有下面这三个字段：

* child: 指向它的第一个 子节点
* sibling： 指向它下一个 兄弟节点
* return： 指向它的 父节点

下图展示了 fiber 节点直接的链接关系

![](https://admin.indepth.dev/content/images/2019/07/image-48.png)

下面尝试定一个一个 fiber 节点，并且创建一个 Link 方法将一组 elements 链接到一起

```javascript
class Node {
    constructor(instance) {
        this.instance = instance;
        this.child = null;
        this.sibling = null;
        this.return = null;
    }
}

function Link (parent, elements) {
    parent.child = elements.reduceRight(function (prev, current) {
        const node = new Node(current);
        node.return = parent;
        node.sibling = prev;
        return node
    }, null)
    
    return parent.child;    
}
```

Link 方法从最后一个 element 开始向前遍历数组，通过单链表的方式将 elements 链接在一起。下面是一个简单的 demo

```javascript
const children = [{name: 'a'}, {name: 'b'}]
const parent = new Node({name: 'parent'})

const child = Link(parent, children)

console.log(child.instance.name) // a
console.log(child.sibling.instance.name) // b
```

下面我们实现 doWork 方法来为每个节点执行工作，如下：

```javascript
function doWork(node) {
    console.log(node.instance.name)

    const children = node.instance.render()
    return Link(node, children)
}
```

doWork 打印节点的 name 属性，并且将节点与它的 children 链接在一起

现在我们已经实现了主要的遍历算法了，下面我们实现 walk 函数将整个节点树链接在一起

```javascript
function walk(o) {
    let root = o;
    let current = o;

    while (true) {
        // perform work for a node, retrieve & link the children
        let child = doWork(current);

        // if there's a child, set it as the current active node
        if (child) {
            current = child;
            continue;
        }

        // if we've returned to the top, exit the function
        if (current === root) {
            return;
        }

        // keep going up until we find the sibling
        while (!current.sibling) {

            // if we've returned to the top, exit the function
            if (!current.return || current.return === root) {
                return;
            }

            // set the parent as the current active node
            current = current.return;
        }

        // if found, set the sibling as the current active node
        current = current.sibling;
    }
}
```

  这个算法很简单，是一个深度优先遍历，我们的调用栈会变成下面这样

![](https://admin.indepth.dev/content/images/2019/07/callstack.gif)

我们可以看出调用栈不会变长，我们在 doWork 中加一个断点并且打印节点的 name 属性，我们将看到如下情况：

![](https://admin.indepth.dev/content/images/2019/07/callstack2.gif)

它看起来像浏览器的调用栈，我们通过 walk 中的算法代替了浏览器的调用栈，Andrew 说：

Fiber 是对堆栈的重新实现，专门用于 React 组件。您可以将单个 fiber 看作一个虚拟的堆栈帧。

因为我们现在通过保持对节点的引用来控制堆栈，当前保存的节点作为栈顶帧

```javascript
function walk(o) {
    let root = o;
    let current = o;

    while (true) {
            ...

            current = child;
            ...
            
            current = current.return;
            ...

            current = current.sibling;
    }
}
```

我们可以在任何时候停止遍历并且之后重新开始遍历。这正是我们想要实现的，这使得我们可以使用 浏览器提供的 requestIdleCallback API。

## react 中的工作队列

在 React 中[工作队列的实现](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js?source=post_page---------------------------#L1118)如下：

```javascript
function workLoop(isYieldy) {
    if (!isYieldy) {
        // Flush work without yielding
        while (nextUnitOfWork !== null) {
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        }
    } else {
        // Flush asynchronous work until the deadline runs out of time.
        while (nextUnitOfWork !== null && !shouldYield()) {
            nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        }
    }
}
```

它很好地映射到我上面介绍的算法。它将对当前 fiber 节点的引用保存在充当顶层帧的 nextUnitOfWork 变量中。这个算法能够异步的遍历组件树并且为树中的每一个 fiber 节点执行任务。函数 shouldYield 根据 deadlineDidExpire 和 deadline 变量返回结果，这些变量在 React 为 fiber 节点执行工作时不断更新。