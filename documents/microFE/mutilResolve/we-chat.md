# 实现微前端的不同方式

![](./head-img.jpg)

最近，越来越多的人开始关注复杂的现代 web 开发所必需的整体架构和组织结构。特别地，我们看到了一些模式出现，它们将前端巨石应用分解成更小、更简单的块，这些块可以独立开发、测试和部署，同时在客户看来仍然是一个单一的内聚产品。我们将这种技术称为微前端。

有很多方案都可以被称为微前端。接下来，我们将会介绍这些方法的利弊。这些方案通常都有一个共同之处：应用程序的每一个界面都是一个微应用，并且有一个容器应用程序。容器应用起如下作用：

* 呈现公共的页面元素，如页眉和页脚
* 解决像身份验证和导航这样的横向关注点
* 将不同的微应用聚合到页面上，并告诉每个微应用在什么时候、什么位置渲染自己

![](https://martinfowler.com/articles/micro-frontends/composition.png)

### 服务端模板组合

我们从一个毫无新意的前端开发方法开始，即：使用多个模板或片段在服务器端渲染 HTML。我们有一个包含所有公共元素的 index.html 文件，然后使用 server-side includes 往 index.html 中插入特定的内容，index.html 的内容如下：

```html
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>Feed me</title>
  </head>
  <body>
    <h1>Feed me</h1>
    <!--# include file="$PAGE.html" -->
  </body>
</html>
```

我们使用 nginx 作为服务器，并且根据页面访问路径去设置 `$PAGE`变量。

```
server {
    listen 8080;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;
    ssi on;

    # Redirect / to /browse
    rewrite ^/$ http://localhost:8080/browse redirect;

    # Decide which HTML fragment to insert based on the URL
    location /browse {
      set $PAGE 'browse';
    }
    location /order {
      set $PAGE 'order';
    }
    location /profile {
      set $PAGE 'profile'
    }

    # All locations should render through index.html
    error_page 404 /index.html;
}
```

这是标准的服务器端组合，我们称其为微前端的原因是，我们可以将代码分割开，每个部分可由独立团队交付。

为了实现更大的独立性，可以有一个单独的服务器负责渲染和服务于每个微应用，前端的一个服务器向其他微前端发出请求。通过对响应进行缓存，可以在不影响延迟的情况下实现这一点。

![](https://martinfowler.com/articles/micro-frontends/ssi.png)4

这个例子说明了微前端不一定是一种新技术，也不一定复杂。只要我们关注我们的设计决策是如何影响我们的代码库和团队的自主权的，不管我们的技术水平如何，我们都可以获得很多好处

### 构建时集成

将每个微应用作为一个包发布，并让容器应用程序将它们作为库依赖项包含进来，这儿是容器应用的 package.json 的部分内容：

```
{
  "name": "@feed-me/container",
  "version": "1.0.0",
  "description": "A food delivery web app",
  "dependencies": {
    "@feed-me/browse-restaurants": "^1.2.3",
    "@feed-me/order-food": "^4.5.6",
    "@feed-me/user-profile": "^7.8.9"
  }
}
```

这种方式似乎很合理。然而，这种方法意味着当某个微应用程序需要更新时，我们必须重新编译和发布容器应用程序。我们应该强烈反对使用这种方法来实现微前端。

### 通过 iframe 进行运行时集成

在浏览器中组合应用程序的最简单方法之一是使用 iframe。由于天然的优势，iframe 能够非常容易的将多个独立的子页面组合成一个新的页面。它们还为样式和全局变量之间提供了良好的隔离，不会相互干扰。

```html
<html>
  <head>
    <title>Feed me!</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

    <iframe id="micro-frontend-container"></iframe>

    <script type="text/javascript">
      const microFrontendsByRoute = {
        '/': 'https://browse.example.com/index.html',
        '/order-food': 'https://order.example.com/index.html',
        '/user-profile': 'https://profile.example.com/index.html',
      };

      const iframe = document.getElementById('micro-frontend-container');
      iframe.src = microFrontendsByRoute[window.location.pathname];
    </script>
  </body>
</html>
```

我们经常看到很多人不愿意选择 iframe。尽管有些人不愿意使用 iframe 似乎是出于一种直觉，即：iframe 有点“令人讨厌”，但我们也有一些很好的理由去避免使用 iframe 。比如：上面提到的完全隔离使它们很不灵活，它们使路由、历史记录和深度链接更加复杂。

### 通过 JavaScript 实现运行时集成

这种方法可能是最灵活的，也是我们看到的团队最经常采用的方法。每一个微应用通过 `<script>` 被引入到页面上，并且暴露一个全局函数作为它的入口点。容器应用控制微应用的装载和卸载。

```html
<html>
  <head>
    <title>Feed me!</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

    <!-- These scripts don't render anything immediately -->
    <!-- Instead they attach entry-point functions to `window` -->
    <script src="https://browse.example.com/bundle.js"></script>
    <script src="https://order.example.com/bundle.js"></script>
    <script src="https://profile.example.com/bundle.js"></script>

    <div id="micro-frontend-root"></div>

    <script type="text/javascript">
      // These global functions are attached to window by the above scripts
      const microFrontendsByRoute = {
        '/': window.renderBrowseRestaurants,
        '/order-food': window.renderOrderFood,
        '/user-profile': window.renderUserProfile,
      };
      const renderFunction = microFrontendsByRoute[window.location.pathname];

      // Having determined the entry-point function, we now call it,
      // giving it the ID of the element where it should render itself
      renderFunction('micro-frontend-root');
    </script>
  </body>
</html>
```
这只是一个非常简单实例，但它演示了基本的技术。与构建时集成不同，我们可以独立部署每个 bundle.js 文件。与 iframe 不同的是，我们可以灵活地在我们的微应用之间构建集成。我们可以以多种方式扩展上面的代码，例如只下载需要的 js 代码包 ，或者在呈现微应用时传入和传出数据。在下一期会将一个 react 项目作为完整的实例。

### 通过 Web Components 在运行时整合

这种方式是将微应用定义成 HTML 自定义元素，然后在容器引用中使用这些自定义元素

```html
<html>
  <head>
    <title>Feed me!</title>
  </head>
  <body>
    <h1>Welcome to Feed me!</h1>

    <!-- These scripts don't render anything immediately -->
    <script src="https://browse.example.com/bundle.js"></script>
    <script src="https://order.example.com/bundle.js"></script>
    <script src="https://profile.example.com/bundle.js"></script>

    <div id="micro-frontend-root"></div>

    <script type="text/javascript">
      // These element types are defined by the above scripts
      const webComponentsByRoute = {
        '/': 'micro-frontend-browse-restaurants',
        '/order-food': 'micro-frontend-order-food',
        '/user-profile': 'micro-frontend-user-profile',
      };
      const webComponentType = webComponentsByRoute[window.location.pathname];

      // Having determined the right web component custom element type,
      // we now create an instance of it and attach it to the document
      const root = document.getElementById('micro-frontend-root');
      const webComponent = document.createElement(webComponentType);
      root.appendChild(webComponent);
    </script>
  </body>
</html>
```

这种方式最终结果与使用 js 在运行时集成的例子非常相似，主要的区别在于您选择了“ web 组件方式”。如果您喜欢 web 组件规范，并且喜欢使用浏览器提供的功能，那么这是一个不错的选择。如果您想要在容器应用程序和微应用之间定义自己的接口，那么您可能更适合通过 JavaScript 实现运行时集成

> 你可以看到样式隔离、共享的组件库、跨应用程序通信相关的内容
