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

## 实现 setState 方法更新界面

## 创建虚拟 DOM 以及虚拟 DOM 的 diff 算法

## Mini React 运行流程图

## 在 Preact 中虚拟 DOM 算法流程图
