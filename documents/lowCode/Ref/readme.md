# Ref

ref 是 React element 的一个特殊的属性，在组件内不能通过 props.ref 访问它，该属性与 key 一样在 React 类型声明文件中已经定义好了，所以创建自定义组件时，不需要给组件的 Props 接口声明 ref 字段。总体而言，使用 ref 出于以下 3 个目的：

1. 访问 DOM 节点
2. 访问组件实例
3. 将它作为 mutable 数据的存储中心

将 ref 绑定到 React element 上才能实现第 1 和第 2 个目的，实现第 3 个目的，必须要绑定。

## 创建 ref

有两种方式创建 ref，分别为 React.createRef 和 useRef。useRef 是一种 React Hook，只能在函数组件中使用，更多的 Hooks 在后续章节中介绍。React.createRef 的使用位置不限，但不要在函数组件中使用它，如果在函数组件中用它创建 ref，那么函数组件每一次重新渲染都会创建新的 ref。下面的代码显示了 React.createRef、useRef 和 ref 的数据类型：

```typescript
// React.createRef 的类型
function createRef<T>(): RefObject<T>;

// useRef 的类型
function useRef<T>(initialValue: T|null): RefObject<T>;
function useRef<T>(initialValue: T): MutableRefObject<T>;
function useRef<T = undefined>(): MutableRefObject<T | undefined>;

// ref 的类型
interface MutableRefObject<T> {
    current: T;
}

interface RefObject<T> {
    readonly current: T | null;
}
```

ref 由 createRef 或 useRef 函数返回，从上述代码可以看出它有两种数据类型，分别是 MutableRefObject 和 RefObject，这两种类型都有 current 字段，类型参数 T 用于注释 current 的数据类型。下面的代码演示创建 ref：

```typescript

```

接下来根据这 3 个目的分别介绍 ref 的用法

## 访问 DOM 节点

## 总结

Ref 的功能很强大，但不要滥用。在这里回顾一下使用 ref 的三个目的，第一个目的：访问 DOM 节点。请记住 React 基于数据驱动，也可以理解为基于状态驱动，在React程序中不推荐访问 DOM 节点；第二个目的：访问组件实例。通过 ref 在父组件中获得子组件的实例，让父组件与子组件建立直接的联系，这会让状态的变更变得混乱，应该使用 props 进行父子组件之间的交互；第三个目的：在函数组件中创建 ref，将它作为 mutable 数据的存储中心，这有它的用武之地，但在类组件中大可不必。