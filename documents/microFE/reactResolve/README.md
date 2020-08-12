# 微前端在 react 项目中应用 

![](./head-img.png)

本篇文章的大部分内容将用于解释如何通过 js 在运行时集成多个微应用。你可以在[这里](https://demo.microfrontends.com/)看到最终的结果，在[GitHub](https://github.com/micro-frontends-demo)中看到源码

![](https://martinfowler.com/articles/micro-frontends/screenshot-browse.png)

在这个例子中使用的是 React，你也可以使用其他的框架来实现

## 容器

我们先从[容器](https://github.com/micro-frontends-demo/container)开始,它的 package.json 内容如下

```
{
  "name": "@micro-frontends-demo/container",
  "description": "Entry point and container for a micro frontends demo",
  "scripts": {
    "start": "PORT=3000 react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test"
  },
  "dependencies": {
    "react": "^16.4.0",
    "react-dom": "^16.4.0",
    "react-router-dom": "^4.2.2",
    "react-scripts": "^2.1.8"
  },
  "devDependencies": {
    "enzyme": "^3.3.0",
    "enzyme-adapter-react-16": "^1.1.1",
    "jest-enzyme": "^6.0.2",
    "react-app-rewire-micro-frontends": "^0.0.1",
    "react-app-rewired": "^2.1.1"
  },
  "config-overrides-path": "node_modules/react-app-rewire-micro-frontends"
}
```

从 package.json 的内容中我们可以知道这个一个使用 create-react-app 创建的 React 应用程序，在 package.json 中我们没有看到任何与微应用相关的配置，在[上一篇文章](../mutilResolve)中我们已经提到，构建时集成会导致发布周期的耦合。

为了了解如何将微应用显示在界面上，让我们首先看看 App.js 中的内容，我们使用 React Router 将 URL 与预定义的路由列表相匹配，并呈现相应的组件

```
<Switch>
  <Route exact path="/" component={Browse} />
  <Route exact path="/restaurant/:id" component={Restaurant} />
  <Route exact path="/random" render={Random} />
</Switch>
```

Random 组件仅仅用于将页面重定向到一个随机的 restaurant 页面。Browse 和 Restaurant 组件像这个样子

```
const Browse = ({ history }) => (
  <MicroFrontend history={history} name="Browse" host={browseHost} />
);
const Restaurant = ({ history }) => (
  <MicroFrontend history={history} name="Restaurant" host={restaurantHost} />
);
```

在这两种情况下，我们都在页面上渲染 MicroFrontend 组件。除了 history 对象之外，我们还将微应用名以及微应用的主机地址传递给 MicroFrontend 组件 。在本地运行时 host 的值像 `http://localhost:3001` 这种形式,在生产环境中 host 的值像`https://browse.demo.microfrontends.com` 这样。

在 App.js 中通过 React Router 能够匹配到要渲染的微应用，在 MicroFrontend.js 中渲染这个微应用，MicroFrontend.js 中的片段如下：

```
// class MicroFrontend…
class MicroFrontend extends React.Component {
  render() {
    return <main id={`${this.props.name}-container`} />;
  }
}
```

在渲染时，我们要做的就是在页面上放置一个容器元素，这个容器元素拥有一个以微应用名命名的 id，微应用将在这个位置渲染自己。我们在 React 的 componentDidMount 钩子中下载和安装微前端，代码如下：

```
// class MicroFrontend…
componentDidMount() {
    const { name, host } = this.props;
    const scriptId = `micro-frontend-script-${name}`;

    if (document.getElementById(scriptId)) {
      this.renderMicroFrontend();
      return;
    }

    fetch(`${host}/asset-manifest.json`)
      .then(res => res.json())
      .then(manifest => {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `${host}${manifest['main.js']}`;
        script.onload = this.renderMicroFrontend;
        document.head.appendChild(script);
      });
  }
```

首先我们先检查微应用相关的 script 是否被下载了，如果已经被下载就立即调用方法渲染页面，如果还有没有被下载，就从服务器请求`asset-manifest.json`，从`asset-manifest.json`中得到即将被渲染的微应用的 script 路径，等 script 下载完之后再渲染页面。this.renderMicroFrontend 的代码如下：

```
// class MicroFrontend…
renderMicroFrontend = () => {
    const { name, history } = this.props;

    window[`render${name}`](`${name}-container`, history);
    // E.g.: window.renderBrowse('Browse-container', history);
  };
```

在上面的代码中我们调用了命名类似于 `window.renderBrowse` 的全局方法，这个方法是在微应用的脚本中定义的，我们将 `<main>`的 id 和 history 对象传递给它。这个全局方法是容器应用与微应用之间建立联系的关键。我们应该使它简洁、易于维护，如果我们需要修改它，我们要认真的思考本次变更是否会带来代码库和通信上的耦合。

在上面我们介绍了组件装载要做的事情，接下来介绍组件卸载要做的事情。当 MicroFrontend 组件被卸载的时候，我们希望与之相关的微应用也能够被卸载。每个微应用都会定义一个与卸载相关的全局方法，这个全局方法会在 MicroFrontend 组件的 componentWillUnmount 钩子函数中被调用，代码如下：

```
componentWillUnmount() {
    const { name } = this.props;

    window[`unmount${name}`](`${name}-container`);
  }
```

站点的头部和导航栏在所有页面中都是恒定的,所以他们直接位于容器应用中。我们要确保它们的 CSS 样式只作用于特定的地址，不会与微应用中的 CSS 发生冲突。

在这个例子中容器应用的功能非常简陋，它只是给微应用提供了一个壳，在运行时动态下载我们的微应用，并将它们整合到一个页面上。这些微应用可以独立部署到生产环境中，而无需对任何其他微应用或容器本身进行任何更改。

## 微应用

从上一章节我们知道微应用暴露出的全局渲染方法是至关重要的。在微应用中对全局方法的定义如下：

```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

window.renderBrowse = (containerId, history) => {
  ReactDOM.render(<App history={history} />, document.getElementById(containerId));
  registerServiceWorker();
};

window.unmountBrowse = containerId => {
  ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
};
```

在 React 应用中，通常会在顶层作用域调用 ReactDOM.render，这意味着只要脚本被加载就会立即渲染 DOM 元素。在这个例子中我们需要控制渲染 DOM 元素的位置和时间，所以我们将 ReactDOM.render 包裹在一个函数中，并且将 DOM 元素的 id 传递到函数中。然后将函数绑定在 window 对象上。

虽然我们已经知道将微应用集成到整个容器应用程序时该函数是如何调用的，但我们还需要能够独立开发和运行微应用，所以每个微应用还应该有它们自己的 index.html，如下所示：

```
<html lang="en">
  <head>
    <title>Restaurant order</title>
  </head>
  <body>
    <main id="container"></main>
    <script type="text/javascript">
      window.onload = () => {
        window.renderRestaurant('container');
      };
    </script>
  </body>
</html>
```

![](https://martinfowler.com/articles/micro-frontends/screenshot-order.png)

这个 demo 中的微应用只是普通的 React 应用。[browse](https://github.com/micro-frontends-demo/browse) 应用从服务器获取餐厅列表，提供一个 input 输入框去搜索特定的餐厅并且给每个餐厅提供可以跳转到餐厅详情的链接。 [order](https://github.com/micro-frontends-demo/restaurant-order)应用显示餐厅详情

![](https://martinfowler.com/articles/micro-frontends/demo-architecture.png)

在我们的微应用中使用 CSS-in-JS 方式来为组件定义样式，这保证了微应用中的样式不会影响到容器应用和其他的微应用

## 通过路由进行跨应用程序通信

在[之前](../mutilResolve)的文章中我们已经提到过，我们应该让跨应用通信尽可能简单。在本例中，我们唯一的需求是 browse 应用需要告诉 order 应用要加载哪个餐厅，在这里我们使用浏览器路由来解决这个问题。

在这里相关的三个应用都使用 React Router 来声明路由，但是声明的方式有所不同。在容器应用程序中我们使用了一个`<BrowserRouter>`，它将在内部实例化一个历史对象。这就是我们之前提到的 history 对象。我们使用这个对象来操作客户端历史记录，还可以使用它将多个 React 路由链接在一起。在微应用中，我们像下面这样初始化路由：

```
<Router history={this.props.history}>
```

在本例中，我们没有在微应用中用 React Router 实例化出一个新的 history 对象，而是将容器应用程序中的 history 对象传递到微应用中。所有的`<Router>`实例都被连接在一起，因此在其中任何一个实例中触发的路由更改将反映在所有的 router 实例中。我们可以通过 URL 将参数从一个微应用传递到另一个微应用。例如在`browse`应用中，我们有一个这样的链接：

```
<Link to={`/restaurant/${restaurant.id}`}>
```

当点击这个链接时，容器应用中的路径将会更新，容器将根据新的 URL 确定是否应该安装和呈现餐厅微应用。然后，餐厅微应用的路由逻辑将从 URL 中提取餐厅 ID，并呈现正确的信息。

## 公共内容

虽然我们希望我们的每个微应用尽可能独立，但有些内容应该是共同的。之前写过关于[共享组件库](../mutilResolve/#共享的组件库)如何帮助实现微应用的一致性，但是对于这里例子来说，一个组件库就太过了。因此，我们有一个公共内容的[小仓库](https://github.com/micro-frontends-demo/content)，它里面包括图像、JSON数据和CSS，这些内容通过网络请求提供给所有的微应用。

公共依赖可以在微应用中共享。正如我们将很快描述的那样，重复的依赖是微前端的一个常见缺点。尽管跨应用程序共享这些依赖有其自身的困难，但在这个 demo 中讨论一下如何实现它是值得的。

第一步是确定要共享哪些依赖。通过对编译后的代码进行快速分析后发现大约 50% 的包是由 react 和 react-dom 提供的。这两个依赖是核心依赖，如果我们将它们从代码中提取出来可以显著的减少代码包的大小。

为了提取 react 和 react-dom，我们需要修改 webpack 配置，代码如下：

```
module.exports = (config, env) => {
  config.externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
  return config;
};
```

然后，我们向每个 index.html 文件添加两个 script 标签，以便从共享内容服务器获取这两个库。

```
<body>
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  <div id="root"></div>
  <script src="%REACT_APP_CONTENT_HOST%/react.prod-16.8.6.min.js"></script>
  <script src="%REACT_APP_CONTENT_HOST%/react-dom.prod-16.8.6.min.js"></script>
</body>
```

跨团队共享代码总是一件棘手的事情。我们需要确保我们只共享我们真正想要共享的东西。我们只有谨慎对待我们共享和不共享的东西，我们才能真正的获益。

## 缺点

在[上一篇](../mutilResolve)文章中提到了微前端与任何架构一样，也需要权衡我们能够收获的好处和付出的代价，我们将在这里讨论微前端带来的弊端。

### 重复的下载

独立构建的 JavaScript 包会导致常见依赖的重复，增加我们必须通过网络发送给最终用户的字节数。例如，如果每个微应用都包含自己的 React 包，那么我们就迫使客户下载 n 次 React。要解决这个问题并不容易。我们希望让团队独立地编写他们的应用程序，以便他们能够自主地工作，但是我们又希望以一种能够共享共同依赖的方式构建我们的应用程序，这两者之间存在冲突。

一种方法是将公共依赖提取为外部依赖，就像我们在上面演示的那样。但是只要这样做，我们都必须使用这些依赖的确切版本，这使得我们在微前端中重新引入了一些构建时耦合。

重复的依赖是一个很棘手的问题，但是也不是全无好处。首先，如果我们对重复的依赖不做任何的处理，每个单独的页面仍然有可能比我们建立一个单体的前端更快地加载。这是因为通过单独的编译每一个页面，我们已经有效的进行的代码分割。在传统的巨石应用中，当应用程序中的任何页面被加载时，我们通常会同时下载其他页面的源代码和依赖项。通过独立构建，在这个 demo 中任何单个页面加载将只下载该页面的源代码和依赖项。这可能会导致初始页面加载速度变快了，但随后的导航跳转速度会变慢，因为用户被迫重新下载每个页面上相同的依赖项。

在前面的段落中有许多“可能”和“可能”，这突出了这样一个事实，即每个应用程序总是具有自己独特的性能特征。如果您想确切地知道某个特定更改对性能的影响，那么没有什么可以替代实际的度量，最好是在生产环境中进行度量。因此，尽管考虑每个架构决策对性能的影响很重要，但一定要知道真正的瓶颈在哪里。

### 环境差异

我们应该能够独立开发一个单一的微应用，而不需要考虑其他团队正在开发的微应用。我们甚至可以在一个空白页面上以独立模式运行我们的微前端，而不是将其放入生产环境的容器应用程序中运行。但是，在与生产环境完全不同的环境中进行开发是存在风险的。我们可能会遇到在开发阶段运行微应用时微应用能够按照预期运行，但是在生成环境中运行却与预期不同的情况。我们需要特别关注容器或其他微应用可能带来的样式冲突。

如果我们在本地开发微应用的环境与生产环境不一样，我们就需要确保我们平时集成和部署微前端的环境与生产环境一致。我们还需要在这些环境中做测试使得尽早的发现并解决集成问题，其实这还是不会完全解决问题，我们需要权衡:简化开发环境使得生产力提升，这值得我们冒集成问题的风险吗?答案将取决于项目。

### 操作和治理复杂性

作为一个分布式的体系结构,微前端架构将不可避免地导致有更多的东西需要管理，更多的仓库、更多的工具、更多的部署通道、更多的服务、更多的域名等。在采用微前端架构之前你需要认真思考下面的几个问题：

1. 您是否有足够的自动化流程来切实地提供和管理额外所需的基础设施？
2. 你的前端开发、测试和发布流程能扩展到多个应用程序吗？
3. 如果工具和开发过程中决策会变得更加分散和更不可控，你是否会感到不舒服？
4. 在多个独立的代码库中你怎么确保最高水平解耦？

根据定义当你采用微前端架构就意味着你在创建很多小的组成部分而不是直接创建一个大的结果。你要认真的思考你是否有技术和成熟的组织去确保微前端架构不会给你带来混乱。

## 总结

近些年，前端代码库更得越来越复杂，我们对可扩展架构的需求日益增长。我们需要能够划清界限，在技术实体和领域实体之间建立正确的耦合和内聚级别。我们应该能够在独立、自主的团队之间衡量软件交付。

微前端架构给很多团队带来了好处，微前端对于你而言可能是一个好的选择也可能不是，这需要你根据实际情况考量。我只是希望前端工程和架构被认真对待，而且它也值得。
