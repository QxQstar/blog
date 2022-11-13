# React 高阶组件与 Render Props 的劣与优

高阶组件（HOC）是一个接受组件作为参数并返回一个新组件的函数，如果多个组件有相同的逻辑，将这些逻辑用函数封装，使它们能跨组件共用，这种用法称为高阶组件。下面的代码演示什么是高阶组件：

```jsx
export default function WithPrintLog(InnerComponent) {
    return class extends React.Component{
        componentDidMount() {
            console.log('我被装载了')
        }

        render() {
            return (<InnerComponent {...this.props}/>)
        }
    }
}
```

上述 WithPrintLog 是高阶组件，它不改变 InnerComponent 在界面上的显示，而是等 InnerComponent 装载之后在控制台打印'我被装载了'。

总体而言，高阶组件可以被分为两大类。

* 增强型：给组件增加额外的功能，比如前面举例的 WithPrintLog。
* 注入型：给组件注入额外的 props，比如 Redux 的 connect。

接下来，结合 TypeScript 分别介绍增强型和注入型高阶组件。

## 增强型高级组件

增强型高阶组件还是以 WithPrintLog 为例，只是在前面的基础上增加 loading 效果，代码如下：

```jsx
interface Props {
    loading?: boolean
}

export default function WithPrintLog<P extends {}>(InnerComponent: React.ComponentType<P>) {
    return class extends React.Component<P & Props, never> {
        componentDidMount() {
            console.log('我被装载了')
        }

        render() {
            const {loading, ...props} = this.props
            return (loading ? <div>loading...</div> : <InnerComponent {...(props as P)}/>)
        }
    }
}
```

`React.ComponentType<P>` 是 `React.ComponentClass<P> | React.FunctionComponent<P>` 的别称，因此 WithPrintLog 的参数只能是类组件或函数组件。分析上述代码中的类型注解，类型参数 `P` 注解 InnerComponent 的 props。`P & Props` 注解返回值的 props，所以使用返回值时，除了传 InnerComponent 所需的 props 还要传 loading 字段。

## 注入型高阶组件

注入型高阶组件比增加强高阶组件更常见，类型定义也更复杂，下面定义的 WithSubmitLog 便是一个注入型高阶组件，代码如下：

```tsx
export interface InjectedProps {
    submitLog: (data: string) => void
}

export function WithSubmitLog<P extends InjectedProps>(InnerComponent: React.ComponentType<P>) {
    return class extends React.Component<Omit<P, keyof InjectedProps >, never> {
        submitLog = (data: string) => { /**todo*/ }
        render() {
            const props = ({
                ...this.props,
                submitLog: this.submitLog
            }) as P
            return <InnerComponent {...props}/>
        }
    }
}
```

`<P extends InjectedProps>(InnerComponent: React.ComponentType<P>)`使用了泛型约束，它约束类型参数`P`必须包含 InjectedProps 接口中的字段，所以InnerComponent 组件的 props 中必须存在 submitLog 字段。`Omit<P, keyof InjectedProps>`表示从类型`P`中剥除 InjectedProps 接口中的字段，所以使用 WithSubmitLog 返回的组件时，不必传 submitLog 字段。

## 高阶组件 VS Render Props

高阶组件和 Render Props 都是提高代码复用的有效手段，高阶组件属于静态组合，Render Props 属于动态组合。下面使用 Render Props 去改造上面的注入型高阶组件 WithSubmitLog，代码如下：

```tsx
interface Props {
    render: (submitLog: (data: string) => void) => React.ReactNode;
}

class SubmitLogFromRender extends React.Component<Props , never> {
    submitLog = (data: string): void => { /**todo*/ }
    render(): React.ReactNode {
        return this.props.render(this.submitLog)
    }
}
```

与前面的 WithSubmitLog 相比，SubmitLogFromRender 简单得多，一眼就能看出它能接受那些属性，但是要明白高阶组件返回的组件能接收哪些属性就没那么容易，另外由于 SubmitLogFromRender 组件的 render 属性只是一个函数，所以它的值能来自第三方库，CDN，甚至可以在程序运行时根据不同的情况动态加载不同的函数。

## 总结

高阶组件能实现的效果 Render Props 都能实现，但反过来，Render Props 能实现的效果高阶组件不一定能实现，这源于 Render Props 是动态组合，而高阶组件是静态组合。在日常开发中，我的最大感受是，分析高阶组件能接受的属性比分析运用 Render Props 技术组件的难度大得多。
