# 写 React 项目时为什么要在列表中写 key，其作用是什么？

key 好比元素的名字，React 借助 Element Type 和 key 识别元素的身份，把 Diff 算法的时间复杂度从 O(n^3) 将到 O(n)。

## Diff 两棵元素树发生在什么时候？

当组件有更新的时候（状态变化或者调用 forceUpdate() 方法时），React 会让组件调用 render 方法重新描述它要显示的内容，默认情况下，父组件调用 render 会导致子组件 render，以得到组件树最底层的 DOM 标签，这个过程称为 reconciliation。为了尽可能复用现有的 DOM 节点，React 会在 render 方法返回的 React Element 上运行 Diff 算法，对比新 element 与旧 element 元素之间的差异，收集需要执行的 DOM 变更。

在 reconciliation 过程中对比新旧 Element 树用到的算法成为 Diff 算法。

## reconciliation

调用组件的 render 得到组件树最底层的 DOM 标签，这个过程称为 reconciliation

## Diff 的过程


## key 的使用场景

* 使用数组动态创建 React Element 的时候。