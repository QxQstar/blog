# 深入讲解 React 中的 state 和 props 更新

在这篇文章中，我使用下面这样的应用程序作为例子

![](./img/app.gif)

```javascript
class ClickCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: 0};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState((state) => {
            return {count: state.count + 1};
        });
    }
    
    componentDidUpdate() {
        // todo 
    }

    render() {
        return [
            <button key="1" onClick={this.handleClick}>Update counter</button>,
            <span key="2">{this.state.count}</span>
        ]
    }
}
```

我给 ClickCounter 组件添加了 componentDidUpdate 钩子，这个钩子会在 commit 阶段被调用。

在之前我写了一篇[深入介绍 React Fiber](/documents/summary/fiber/result.html)的文章，在那篇文章中我介绍了 React 团队为什么要重新实现 reconciliation 算法、fiber 节点与 react element 的关系、fiber 节点的字段以及 fiber 节点是如何被组织在一起的。在这篇文章中我将介绍 React 如何处理 state 更新以及 React 如何创建 effects list，我也会介绍在 render 阶段和 commit 阶段调用的函数。为了更好的理解这篇文章的内容，我建议你先去读一下之前的[那篇文章](/documents/summary/fiber/result.html)。

## 组件的 updater

当我们点击按钮之后 handleClick 方法会被调用，这导致 state.count 值加 1

```javascript
class ClickCounter extends React.Component {
    ...
    handleClick() {
        this.setState((state) => {
            return {count: state.count + 1};
        });
    }
}   
```

每个 React 组件都有一个相关联的 updater，它作为组件与 React core 之间的桥梁，这允许 ReactDOM、React Native、服务器端渲染和测试工具以不同的方式实现 setState。这篇文章我们只讨论在 ReactDOM 中 updater 的实现，ClickCounter 组件的 updater 是一个 [classComponentUpdater](https://github.com/facebook/react/blob/6938dcaacbffb901df27782b7821836961a5b68d/packages/react-reconciler/src/ReactFiberClassComponent.js#L186)，它负责检索 fiber 实例，队列更新和工作调度。

```javascript
const classComponentUpdater = {
  isMounted,
  enqueueSetState(inst, payload, callback) {
    const fiber = ReactInstanceMap.get(inst);
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);
    ...
  },
  enqueueReplaceState(inst, payload, callback) {
    const fiber = ReactInstanceMap.get(inst);
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    ...

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
  enqueueForceUpdate(inst, callback) {
    const fiber = ReactInstanceMap.get(inst);
    const currentTime = requestCurrentTime();
    const expirationTime = computeExpirationForFiber(currentTime, fiber);

    ...

    enqueueUpdate(fiber, update);
    scheduleWork(fiber, expirationTime);
  },
};
```

当 update 发生时，它们被添加到 fiber 节点上的 updateQueue 中处理。在我们的例子中，ClickCounter 组件的 fiber 节点的结构如下：

```javascript
{
    stateNode: new ClickCounter,
    type: ClickCounter,
    updateQueue: {
         baseState: {count: 0}
         firstUpdate: {
             next: {
                 payload: (state) => { return {count: state.count + 1} }
             }
         },
         ...
     },
     ...
}
```

如果你仔细观察，你会发现 updateQueue.firstUpdate.next.payload 的值是我们在 ClickCounter 组件中传递给 setState 的参数。它代表在 render 阶段需要处理的第一个 update。

## 处理 ClickCounter Fiber 的 update

我在上一篇文章中介绍了 nextUnitOfWork 变量的作用，nextUnitOfWork 保存了对`workInProgress`树中 fiber 节点的引用，当 React 遍历 fiber 树时，它使用这个变量来判断是否有其他未完成工作的 fiber 节点。

在调用 setState 方法之后，React 把我们传递给 setState 的参数添加到 ClickCounter fiber 的 updateQueue 属性上并且进行工作调度。React 进入 render 阶段，它使用[renderRoot](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L1132)函数从 fiber 树最顶层的 HostRoot 开始遍历 fiber，在遍历的过程中 React 会跳过已经处理完的 fiber 直到遇到没有处理的 fiber。在 render 阶段，fiber 节点的所有工作都是在 fiber 的 alternate 字段上进行的。如果还没有创建 alternate，React 会在处理 update 之前在[createWorkInProgress](https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js#L326) 函数中创建 alternate。

在这里我们假设 nextUnitOfWork 变量中保存的是 ClickCounter fiber 的 alternate。

### beginWork

在处理 update 时，首先会调用 [beginWork](https://github.com/facebook/react/blob/cbbc2b6c4d0d8519145560bd8183ecde55168b12/packages/react-reconciler/src/ReactFiberBeginWork.js#L1489) 函数。

> 由于 fiber 树上的每一个 fiber 都会执行 beginWork 函数，如果你想 debug render 阶段，你可以在 beginWork 函数中打断点。

beginWork 函数基本上包含了一个大的 switch 语句，switch 通过判断 fiber 的 tag 来确定 fiber 需要做哪些工作

```javascript
function beginWork(current, workInProgress, ...) {
    ...
    switch (workInProgress.tag) {
        ...
        case FunctionalComponent: {...}
        case ClassComponent:
        {
            ...
            return updateClassComponent(current$$1, workInProgress, ...);
        }
        case HostComponent: {...}
        case ...
}
```

由于 ClickCounter 是一个类组件，所以 React 会执行[updateClassComponent](https://github.com/facebook/react/blob/1034e26fe5e42ba07492a736da7bdf5bf2108bc6/packages/react-reconciler/src/ReactFiberBeginWork.js#L428)函数，updateClassComponent 函数大概如下：

```javascript
function updateClassComponent(current, workInProgress, Component, ...) {
    ...
    const instance = workInProgress.stateNode;
    let shouldUpdate;
    if (instance === null) {
        ...
        // In the initial pass we might need to construct the instance.
        constructClassInstance(workInProgress, Component, ...);
        mountClassInstance(workInProgress, Component, ...);
        shouldUpdate = true;
    } else if (current === null) {
        // In a resume, we'll already have an instance we can reuse.
        shouldUpdate = resumeMountClassInstance(workInProgress, Component, ...);
    } else {
        shouldUpdate = updateClassInstance(current, workInProgress, ...);
    }
    return finishClassComponent(current, workInProgress, Component, shouldUpdate, ...);
}
```

在 updateClassComponent 函数中 React 会判断组件是否是第一次 render、是否是恢复工作或者是否是 update，不同的情况做的事情不一样。

在上面的例子中，当我们点击按钮调用 setState 方法时，我们已经有 ClickCounter 组件实例了，所以 React 会调用[updateClassInstance](https://github.com/facebook/react/blob/6938dcaacbffb901df27782b7821836961a5b68d/packages/react-reconciler/src/ReactFiberClassComponent.js#L976)方法，在 updateClassInstance 函数中会按下面的顺序执行很多函数：

1. 调用 UNSAFE_componentWillReceiveProps 钩子(deprecated)
2. 处理 updateQueue 中的 update 并生成新的 state
3. 使用这个新 state 调用 getDerivedStateFromProps 并获得组件最终的 state
4. 调用 shouldComponentUpdate 钩子去确定组件是否需要更新；如果不需要更新就跳过整个 render 阶段（不调用组件和组件 children 的 render 方法）；否则继续更新
5. 调用 UNSAFE_componentWillUpdate 钩子(deprecated)
6. 添加触发 componentDidUpdate 钩子的 effect
7. 更新组件实例的 state 和 props

> 虽然 componentDidUpdate 钩子的 effect 是在 render 阶段被添加的，但是 componentDidUpdate 钩子会在 commit 阶段执行

组件的 state 和 props 会在调用 render 方法之前被更新，因为 render 方法的输出依赖于 state 和 props 的值。

下面是 updateClassInstance 函数的简化版本，我删除了一些辅助代码

```javascript
function updateClassInstance(current, workInProgress, ctor, newProps, ...) {
    const instance = workInProgress.stateNode;

    const oldProps = workInProgress.memoizedProps;
    instance.props = oldProps;
    if (oldProps !== newProps) {
        callComponentWillReceiveProps(workInProgress, instance, newProps, ...);
    }

    let updateQueue = workInProgress.updateQueue;
    if (updateQueue !== null) {
        processUpdateQueue(workInProgress, updateQueue, ...);
        newState = workInProgress.memoizedState;
    }

    applyDerivedStateFromProps(workInProgress, ...);
    newState = workInProgress.memoizedState;

    const shouldUpdate = checkShouldComponentUpdate(workInProgress, ctor, ...);
    if (shouldUpdate) {
        if (typeof instance.componentWillUpdate === 'function') {
            instance.componentWillUpdate(newProps, newState, nextContext);
        }
        
        if (typeof instance.componentDidUpdate === 'function') {
          workInProgress.effectTag |= Update;
        }

        if (typeof instance.getSnapshotBeforeUpdate === 'function') {
          workInProgress.effectTag |= Snapshot;
        }
    }

    instance.props = newProps;
    instance.state = newState;

    return shouldUpdate;
}
```

在调用生命周期钩子或添加生命周期钩子的 effect 之前，React 使用 `typeof` 检查实例是否实现了相应的钩子。例如：React 使用下面的代码来检查实例是否有 componentDidUpdate 钩子：

```javascript
if (typeof instance.componentDidUpdate === 'function') {
    workInProgress.effectTag |= Update;
}
```

现在我们大概已经知道了 ClickCounter 的 fiber 节点在 render 阶段要执行的操作，现在让我们看看这些操作是如何改变 fiber 上的值的。调用 setState 之后，当 React 开始工作的时候，ClickCounter 组件的 fiber 节点像下面这样：

```javascript
{
    effectTag: 0,
    elementType: class ClickCounter,
    firstEffect: null,
    memoizedState: {count: 0},
    type: class ClickCounter,
    stateNode: {
        state: {count: 0}
    },
    updateQueue: {
        baseState: {count: 0},
        firstUpdate: {
            next: {
                payload: (state, props) => {…}
            }
        },
        ...
    }
}
```

当工作完成之后，我们最终得到的 fiber 节点像这样：

```javascript
{
    effectTag: 4,
    elementType: class ClickCounter,
    firstEffect: null,
    memoizedState: {count: 1},
    type: class ClickCounter,
    stateNode: {
        state: {count: 1}
    },
    updateQueue: {
        baseState: {count: 1},
        firstUpdate: null,
        ...
    }
}
```

对比 ClickCounter fiber 的前后差异我们可以发现当 update 被应用之后 memoizedState 和 updateQueue.baseState 中的 count 的值为 1。组件实例中的 state 也会被更新。在这个时候，在队列中已经没有 updates 了，所以 firstUpdate 为 null。effectTag 的值不再是 0，它变成了 4，在二进制中，这是 100，这代表了 side-effect 的类型是 Update。

```javascript
export const Update = 0b00000000100;
```

总结一下，在处理 ClickCounter fiber 节点时，React 会调用 pre-mutation 生命周期方法、更新 state 以及定义相关的 side-effects。

### Reconciling children for the ClickCounter Fiber

updateClassInstance 运行结束之后，React 会调用[finishClassComponent](https://github.com/facebook/react/blob/340bfd9393e8173adca5380e6587e1ea1a23cefa/packages/react-reconciler/src/ReactFiberBeginWork.js#L355)函数，在这个函数中会调用组件的 render 方法，并且在 render 方法返回的 react elements 上运行 [diff 算法](https://reactjs.org/docs/reconciliation.html#the-diffing-algorithm)。diff 算法大概的规则是：

当比较两个相同类型的React DOM element 时，React 会检查这两个元素的属性，保持相同的底层 DOM 节点，只更新已更改的属性。

Child reconciliation 的过程非常复杂，如果有可能我会单独写一篇文章介绍这个过程。在我们的例子中 ClickCounter 的 render 方法返回的是数组，所以在 Child reconciliation 时会调用[reconcileChildrenArray](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactChildFiber.js#L732)。

在这里我们有两点需要着重理解一下

1. 在进行 child reconciliation 时 ，它会为 render 方法返回的 React elements 创建或更新 fiber 节点。finishClassComponent 返回当前 fiber 的第一个 child，这个返回值会被赋给 nextUnitOfWork 变量并且在之后的 work loop 中处理。
2. React 会更新 children 的 props，这是 parent 工作的一部分。

例如，在 React reconciles ClickCounter fiber 的 children 之前，span 元素的 fiber 节点看上去是这样的

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    key: "2",
    memoizedProps: {children: 0},
    pendingProps: {children: 0},
    ...
}
```

memoizedProps.children 和 pendingProps.children 的值都是 0。从 render 方法中返回的 span 元素的结构如下：

```javascript
{
    $$typeof: Symbol(react.element)
    key: "2"
    props: {children: 1}
    ref: null
    type: "span"
}
```

对比 span fiber 节点和 span 元素上的属性，你会发现有些属性值是不同的。[createWorkInProgress](https://github.com/facebook/react/blob/769b1f270e1251d9dbdce0fcbd9e92e502d059b8/packages/react-reconciler/src/ReactFiber.js#L326)函数用于创建 fiber 节点的 alternate，它使用 react element 上最新的 props 和已经存在的 fiber 创建出 alternate。当 ClickCounter 组件完成 children reconciliation 过程之后，span 的 fiber 节点的 pendingProps 属性会被更新

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    key: "2",
    memoizedProps: {children: 0},
    pendingProps: {children: 1},
    ...
}
```

稍后，当 react 为 span fiber 执行工作时，react 会将 pendingProps 复制到 memoizedProps 上并添加更新 DOM 的 effects。

我们已经介绍了 React 在 render 阶段为 ClickCounter fiber 节点执行的所有工作。由于按钮是 ClickCounter 组件的第一个 child，所以它将被分配给 nextUnitOfWork 变量，但是按钮上没有需要执行工作，所以 React 会快速的移动到按钮的兄弟节点上，也就是 span fiber 节点，这个过程发生在 completeUnitOfWork 函数中。

## 处理 Span Fiber 的 update

现在 nextUnitOfWork 中保存的是 span fiber 的 alternate 并且 React 会在它上面开始工作。React 从 beginWork 函数开始，这与处理 ClickCounter 的步骤类似。

因为 span fiber 的类型是 HostComponent，所以在 beginWork 函数中会进入 HostComponent 对应的 switch 分支

```javascript
function beginWork(current$$1, workInProgress, ...) {
    ...
    switch (workInProgress.tag) {
        case FunctionalComponent: {...}
        case ClassComponent: {...}
        case HostComponent:
          return updateHostComponent(current, workInProgress, ...);
        case ...
}
```

### Reconciling children for the span fiber

在我们的例子中，调用 updateHostComponent 函数时，span fiber 没有发生任何重要的改变。

只要 beginWork 函数执行完，React 就会开始执行 completeWork 函数，但是在执行 completeWork 之前 React 会更新 span fiber 上的 memoizedProps，在前面的章节，我提到过在 reconciles children for ClickCounter 时，React 更新了 span fiber 上的 pendingProps，只要 span fiber 在 beginWork 中执行完成，React 会将 pendingProps 更新到 memoizedProps 上

```javascript
function performUnitOfWork(workInProgress) {
    ...
    next = beginWork(current, workInProgress, nextRenderExpirationTime);
    workInProgress.memoizedProps = workInProgress.pendingProps;
    ...
}
```

在此之后会调用 completeWork，completeWork 函数中是一个大的 switch 语句，由于 span fiber 是 HostComponent，所以会进入 updateHostComponent 函数：

```javascript
function completeWork(current, workInProgress, ...) {
    ...
    switch (workInProgress.tag) {
        case FunctionComponent: {...}
        case ClassComponent: {...}
        case HostComponent: {
            ...
            updateHostComponent(current, workInProgress, ...);
        }
        case ...
    }
}
```

在 updateHostComponent 函数中，React 基本上执行了如下的操作：

1. 准备 DOM 更新
2. 将 DOM 更新添加到 span fiber 的 updateQueue 中
3. 添加更新 DOM 的 effect

在执行这些操作之前，span fiber 看上去是这样的：

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    effectTag: 0
    updateQueue: null
    ...
}
```

执行这些操作之后，span fiber 是这样的：

```javascript
{
    stateNode: new HTMLSpanElement,
    type: "span",
    effectTag: 4,
    updateQueue: ["children", "1"],
    ...
}
```

注意 effectTag 和 updateQueue 的值发生了变化。effectTag 的值从 0 变成了 4，在二进制中，这是 100，这代表了 side-effect 的类型是 Update。updateQueue 字段保存用于 update 的参数。

只要 React 处理完 ClickCounter 和它的 children，render 阶段就结束了。

## Effects list

在我们的例子中，span fiber 和 ClickCounter fiber 有 side effects，React 会将 HostFiber 的 firstEffect 属性指向 span fiber。React 在 [compliteUnitOfWork](https://github.com/facebook/react/blob/d5e1bf07d086e4fc1998653331adecddcd0f5274/packages/react-reconciler/src/ReactFiberScheduler.js#L999)函数中创建  effects list，下面是一个带着 effect 的 fiber tree:

![](./img/effect-tree.png)

带有 effect 的线性表是：

![](./img/line-effect.png)

## commit 阶段

commit 阶段从 [completeRoot](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L2306)函数开始，在开始工作之前先将 FiberRoot.finishedWork 设置为 null

```javascript
function completeRoot(
  root: FiberRoot,
  finishedWork: Fiber,
  expirationTime: ExpirationTime,
): void {
    ...
    // Commit the root.
      root.finishedWork = null;
    ...
}
```

与 render 阶段不同的是，commit 阶段的操作是同步的。在我们的例子中，在 commit 阶段会更新 DOM 和调用 componentDidUpdate 生命周期函数，在 render 阶段为 span 和 ClickCounter 节点定义了以下 effect:

```javascript
{ type: ClickCounter, effectTag: 5 }
{ type: 'span', effectTag: 4 }
```

ClickCounter 的 effectTag 为 5，在二进制中为 101，它表示调用组件的 componentDidUpdate 生命周期。span 的 effectTag 为 4，在二进制中为 100，它表示 DOM 更新

### 应用 effects

让我们看一下 React 是怎么应用(apply)这些 update 的，应用 effects 是从调用[commitRoot](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L523)函数开始的，这个函数主要调用了如下的三个函数：

```javascript
function commitRoot(root, finishedWork) {
    commitBeforeMutationLifecycles()
    commitAllHostEffects();
    root.current = finishedWork;
    commitAllLifeCycles();
}
```

在 commitRoot 中调用的这三个函数都实现了一个大的循环，循环遍历 effects list 并检查 effect 的类型。当发现与函数的用途有关的 effect 时，函数就会应用(apply)它。由于 [commitBeforeMutationLifecycles](https://github.com/facebook/react/blob/fefa1269e2a67fa5ef0992d5cc1d6114b7948b7e/packages/react-reconciler/src/ReactFiberCommitWork.js#L183) 的目的是检查 Snapshot effect 并且调用 getSnapshotBeforeUpdate 方法，但是我们没有在 ClickCounter 组件上实现这个方法，那么在 render 阶段就不会添加 Snapshot effect，所以在我们的例子中 commitBeforeMutationLifecycles 什么都不会做。effect 类型有：

```javascript
export const NoEffect = /*              */ 0b00000000000;
export const PerformedWork = /*         */ 0b00000000001;

// You can change the rest (and add more).
export const Placement = /*             */ 0b00000000010;
export const Update = /*                */ 0b00000000100;
export const PlacementAndUpdate = /*    */ 0b00000000110;
export const Deletion = /*              */ 0b00000001000;
export const ContentReset = /*          */ 0b00000010000;
export const Callback = /*              */ 0b00000100000;
export const DidCapture = /*            */ 0b00001000000;
export const Ref = /*                   */ 0b00010000000;
export const Snapshot = /*              */ 0b00100000000;

// Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /*   */ 0b00110100100;

// Union of all host effects
export const HostEffectMask = /*        */ 0b00111111111;

export const Incomplete = /*            */ 0b01000000000;
export const ShouldCapture = /*         */ 0b10000000000;
```

### DOM updates

执行完 commitBeforeMutationLifecycles 之后，React 会调用 [commitAllHostEffects](https://github.com/facebook/react/blob/95a313ec0b957f71798a69d8e83408f40e76765b/packages/react-reconciler/src/ReactFiberScheduler.js#L376)函数 ，在 commitAllHostEffects 中 React 会将 span 的文本从 0 变成 1，但是对于 ClickCounter fiber，commitAllHostEffects 什么都不会做，因为类组件的节点没有任何 DOM 更新。commitAllHostEffects 函数如下：

```javascript
function commitAllHostEffects() {
    while (nextEffect !== null) {
        ...
        switch (primaryEffectTag) {
          case Placement: {...}
          case PlacementAndUpdate: {...}
          case Update:
            {
              var current = nextEffect.alternate;
              commitWork(current, nextEffect);
              break;
            }
          case Deletion: {...}
        }

        nextEffect = nextEffect.nextEffect;
    }
        
}
```

commitAllHostEffects 主要是通过 switch 语句选择正确的 effect 类型并执行相应的操作。在本例中，我们需要更新 span 元素上的文本，因此我们在这里进入 switch 的 Update 分支。在 Update 分支中调用 commitWork 函数，但是实际上最终调用的是 [updateDOMProperties](https://github.com/facebook/react/blob/8a8d973d3cc5623676a84f87af66ef9259c3937c/packages/react-dom/src/client/ReactDOMComponent.js#L326)

```javascript
function updateDOMProperties(domElement, updatePayload, ...) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === STYLE) { ...} 
    else if (propKey === DANGEROUSLY_SET_INNER_HTML) {...} 
    else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {...}
  }
}
```

updateDOMProperties 接受在 render 阶段添加的 updateQueue 作为参数，并且更新 span 元素的 textContent 属性。

在 commitRoot 函数中，当 DOM 更新之后，在 render 阶段生成的`workInProgress`被设置为`current`

```javascript
root.current = finishedWork;
```

### 调用 Post-mutation 生命周期

在 commitRoot 函数中调用的最后一个函数是 [commitAllLifeCycles](https://github.com/facebook/react/blob/d5e1bf07d086e4fc1998653331adecddcd0f5274/packages/react-reconciler/src/ReactFiberScheduler.js#L479),React 会在这个函数中调用 Post-mutation 生命周期函数。在我们的例子中，在 Render 阶段，React 会将 Update effect 添加到 ClickCounter fiber 上，在 commitAllLifeCycles 函数中会检查 Update effect：

```javascript
function commitAllLifeCycles(finishedRoot, ...) {
    while (nextEffect !== null) {
        const effectTag = nextEffect.effectTag;

        if (effectTag & (Update | Callback)) {
            const current = nextEffect.alternate;
            commitLifeCycles(finishedRoot, current, nextEffect, ...);
        }
        
        if (effectTag & Ref) {
            commitAttachRef(nextEffect);
        }
        
        nextEffect = nextEffect.nextEffect;
    }
}
```

如果有 ref，在 commitAllLifeCycles 中也会更新 ref，但是在我们的例子中没有 ref，所以 commitAttachRef 不会被调用。由于我们 ClickCounter fiber 有 Update effect，所以 commitLifeCycles 会被调用，我们定义在组件实例上的 componentDidUpdate 最终是在 [commitLifeCycles](https://github.com/facebook/react/blob/e58ecda9a2381735f2c326ee99a1ffa6486321ab/packages/react-reconciler/src/ReactFiberCommitWork.js#L351) 中被调用的

```javascript
function commitLifeCycles(finishedRoot, current, ...) {
  ...
  switch (finishedWork.tag) {
    case FunctionComponent: {...}
    case ClassComponent: {
      const instance = finishedWork.stateNode;
      if (finishedWork.effectTag & Update) {
        if (current === null) {
          instance.componentDidMount();
        } else {
          ...
          instance.componentDidUpdate(prevProps, prevState, ...);
        }
      }
    }
    case HostComponent: {...}
    case ...
}
```

## 写在后面

再次建议，为了更好的理解这篇文章的内容，你可以先去读一下之前的[那篇文章](/documents/summary/fiber/result.html)。