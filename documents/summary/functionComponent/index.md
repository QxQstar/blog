# 我搞懂了 React 的函数组件

函数组件与类组件有什么区别？如果你对 React Hooks 有基本了解，在这里请抛开 React Hooks 回答这个问题。你的答案是函数组件没有自己的 state，也没有与类组件类似的生命周期概念吗？在本小节不讨论 state 和生命周期，先看一个函数调用的示例，代码如下：

```typescript
function getName(params: {name: string}) {
    const count = 0
    return params.name + '-' + count
}
getName({name: '何遇'})
getName({name: 'Bella'})
```

getName 是一个纯函数，不产生任何副作用，当执行结束，它的执行上下文和活动对象会被销毁，前后两次调用互不影响。对于不使用任何 Hooks 的函数组件而言，它也是纯函数，那么函数组件前后两次渲染你还能得出与前后两次调用 getName 函数类似的结论吗？

要对比函数组件和类组件的区别，下面用类组件和函数组件实现相同的功能，即：在浏览器显示一个按钮，点击按钮调用 props 中的方法去更新父组件的 state，隔 1s 之后打印 props.count 的值。类组件的代码如下：

```jsx
class ClassCom extends React.Component<Props, never> {
    render(): React.ReactNode {
        return (
            <button onClick={this.onClick}>这是类组件：刷新浏览器打开开发者工具再点击</button>
        )
    }

    onClick = () => {
	 this.props.updateCount()
        // 隔1s之后打印this.props.count的值
        setTimeout(() => {
            console.log(this.props.count)
        }, 1000);
    }
}
```

函数组件的代码如下：

```jsx
function FuncCom(props: Props) {
    const onClick = () => {
        props.updateCount()
	// 隔1s之后打印props.count的值
        setTimeout(() => {
            console.log(props.count)
        }, 1000);
    }
    return (
        <button onClick={onClick}>这是函数组件：刷新浏览器打开开发者工具再点击</button>
    )
}
```

FuncCom 和 ClassCom 组件的父级相同，代码如下：

```jsx
class FuncComVsClassCom extends React.Component<{},State> {
    state: State = {count: 0}
    render(): React.ReactNode {
        return (
            <>
                <FuncCom 
                    count={this.state.count}
                    updateCount={this.updateCount}
                />
                <ClassCom
                    count={this.state.count}
                    updateCount={this.updateCount}
                />
            </>
        )
    }
    updateCount = () => {
        this.setState((prevSate: State) => {
            return {count: prevSate.count + 1}
        })
    }
}
```

观察上述代码可以发现传递给 FuncCom 和 ClassCom 组件的 props 一样，但在浏览器界面上点击各自的按钮，开发者工具打印的结果不一样，FuncCom 组件打印的值为 0，ClassCom 组件打印的值为 1。

现在揭晓答案，点击 FuncCom 和 ClassCom 组件中的按钮都会使它们的父级重新渲染，从而导致 FuncCom 和 ClassCom 重新渲染。ClassCom 是类组件，它重新渲染不会创建新的组件实例，在 setTimeout 的回调函数中 this.props 拿到了最新的值。FuncCom 是函数组件，它重新渲染会创建新的执行环境和活动变量，所以在其中访问 props，不论何时拿到的都是调用 FuncCom 时传递给它的参数，该参数不可变。

FuncCom 和 ClassCom 组件打印出不同的值，原因在于 props 不可变但类组件实例是可变的，访问 this.props 将始终得到类组件最新的 props。将ClassCom 的 this.props 赋值给一个变量，在 setTimeout 的回调函数中，用该变量访问 count 属性能让两个组件打印出相同的值。

后续介绍React Hooks时将继续介绍函数组件只得到本次渲染时 props 和 state 的值。