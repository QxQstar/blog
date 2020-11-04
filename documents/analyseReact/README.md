# 手把手带你实现一个 Mini React

## Babel 与 JSX

在 React 的官网中推荐使用 JSX 描述 UI，可以将 JSX 当作模版语言。但是 JSX 不是合法的 html 片段也不是合法的 Javascript 语法。在 React 官网上还提到 JSX 最终会被转化为 JS 函数调用并且在使用 JSX 的作用域中需要能够访问到 React。那么是谁将 JSX 转化成 JS 函数滴调用的呢？为什么在使用 JSX 的作用域中需要访问到 React？

@babel/plugin-transform-react-jsx 将 JSX 转化成了 JS 函数调用，它是 Babel 的一个插件，它只是遍历每个 JSX 节点并将它们转换为函数调用。

![](./JSX.png)

被转换成

![](./createElement.png)

从上图可以看出 JSX 被转换成了 React.createElement 函数调用的形式，这就是在使用 JSX 的作用域中需要能够访问到 React 的原因。@babel/plugin-transform-react-jsx 将 JSX 转换成 React.createElement 函数调用这是它的默认行为，我们通过修改它的配置来改变函数名，配置如下：

```json
module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: [
                        ["@babel/plugin-transform-react-jsx", {
                            pragma: 'createElement'
                        }]
                    ],
                }
            }
        }]
    }
```

将 @babel/plugin-transform-react-jsx 的 pragma 参数改成 createElement，这使得 JSX 被转化为 createElement 函数调用。这时我们需要在使用 JSX 的作用域中能够访问到 createElement 函数。下面我们开始实现 createElement

## 实现 createElement

经过分析可知 createElement 的第一个参数是被创建元素的类型，它可能是字符串也可能是一个自定义组件，第二个参数是被创建的元素的属性，它可以是 null，剩余的参数是被创建的元素的子元素。createElement 的声明如下：

```javascript
function createElement(type: any, attrs: IBaseObject, ...children: []): CustomNode | ElementNode;
```

在 DOM 中有两种常见的节点，分别是元素节点和文本节点，在 Mini React 中我们除了要实现这两种浏览器内置的 DOM 节点类型之外还要实现一个自定义组件类型。

首先定义一个 Mini React 组件类型

```typescript
type MiniComponent = ElementNode | Component | TextNode
```

### 文本节点类型

文本节点的实现非常简单，它只需要文件节点对应的内容，代码如下：

```typescript
class TextNode {
    root: Text

    constructor(content: string) {
        this.root = document.createTextNode(content)
    }
}
```

### 元素节点类型

对于元素节点，我们需要根据元素类型（这里的元素类型指标签名）创建出这个类型的 Node，并且这个 Node 要有给自己设置属性的方法和添加子 Node 的方法，代码如下：

```typescript
class ElementNode {
    root: HTMLElement

    constructor(type: string) {
        this.root = document.createElement(type)
    }

    setAttribute(name: string, value: string) {
        this.root.setAttribute(name,value);
    }

    appendChild(component: MiniComponent) {
        this.root.appendChild(component.root)
    }
}
```

### 自定义组件类型

通过 createElement 的类型声明可知，自定义组件类型也有属性和子元素，但是自定义组件没有浏览器内置的 API，我们需要实现这些 API，使用过 React 的同学都知道 React 的类组件必须有 render 方法，所以在 Mini React 中也要求自定义组件必须有 render 方法，代码如下：

```typescript
abstract class Component {
    props: {[attr: string]: any}
    _root?: HTMLElement
    children: MiniComponent[]

    abstract render() : ElementNode | Component

    constructor() {
        this.props = Object.create(null)
        this.children = []
    }

    setAttribute(name: string, value: any) {
        this.props[name] = value
    }

    appendChild(component: MiniComponent) {
        this.children.push(component)
    }

    get root(): HTMLElement {
        if(!this._root) {
            this._root = this.render().root
        }
        return this._root;
    }
}
```

这里的 get root 会导致一个递归调用，一直到 render 方法返回的是一个 ElementNode 类型为止。实现了这三个类型之后，我们开始实现 createElement，在 createElement 函数内部就是根据 type 的类型创建出不同的 Node，然后调用这些 Node 的方法，代码如下：

```typescript
function createElement(type: any, attrs: {[attr: string]: any}, ...children: any[]): Component | ElementNode {
    let component: Component | ElementNode;
    if (typeof type === 'string') {
        component = new ElementNode(type)
    } else {
        component = new type()
    }

    for (const attrName in attrs) {
        component.setAttribute(attrName, attrs[attrName])
    }
    function insertChildren(children: any[]) {
        for (let child of children) {
            let childComponent: MiniComponent
            if (child === null) {
                continue;
            }
            if (typeof child === 'string') {
                childComponent = new TextNode(child)
            } else {
                childComponent = child
            }
            if (Array.isArray(child)) {
                insertChildren(child)
            } else {
                component.appendChild(childComponent)
            }
        }
    }

    insertChildren(children)
    return component
}
```

到目前为止我们已经实现了 createElement 方法，但是只有 createElement 还不够，我们还缺少将组件渲染到浏览器 DOM 树的方法，在这里将它命名为 renderDom，renderDom 参照 ReactDOM.render 的用法，它的实现很简单：

```typescript
function renderDom (compnent: Component | ElementNode, parent: HTMLElement) {
    parent.appendChild(compnent.root);
}
```

在目前为止我们已经可以将一些简单的组件显示到界面上了，但是这些组件还不能根据用户的交互而更新。在 react 中，组件的 props 或者 state 发生了变化就会触发组件的重新渲染，但是组件不能改变它的 props，它只能改变它的 state，自定义组件的 setState 方法用于去更新 state。接下来我们就开始实现 setState 方法

## 更新界面

首先我们先在 Component 抽象类中增加 state 属性，setState 方法，rerender 方法。setState 用于修改 state，rerender 使用新的 state 重新渲染组件。

```typescript
abstract class Component {
    ...
    state: {[attr: string]: any}
    constructor() {
        ...
        this.state = null;
    }
    ...
    setState(newState: {[attr: string]: any}) {
        // todo
    }
    rerender() {
        // todo
    }
}
```

### setState

我们先实现 setState，setState 只是将新的 state 与旧的 state 进行合并得到一个最终的 state。

```typescript
setState(newState: {[attr: string]: any}) {
   if(this.state === null || typeof this.state !== 'object') {
        this.state = newState;
        this.rerender()
        return ;
    }
    const merge = (oldState: {[attr: string]: any}, newState: {[attr: string]: any}) => {
        for (const key in newState) {
            if(oldState[key] !== null && typeof oldState[key] === 'object') {
                merge(oldState[key], newState[key])
            } else {
                oldState[key] = newState[key]
            }
        }
    }

    merge(this.state, newState)
    this.rerender()
}
```

## 创建虚拟 DOM 以及虚拟 DOM 的 diff 算法

## Mini React 运行流程图

## 在 Preact 中虚拟 DOM 算法流程图
