# 实现微前端的不同方式

![](./head-img.jpg)

这些年，微服务非常受欢迎，很多机构使用这种架构来避免大型、单体后端的限制。虽然已经有很多关于如何架构这类服务器端应用的文章，但许多公司仍在与单体的前端代码库作斗争。

也许你想创建一个渐进式和响应式的 web 应用，但是找不到一种简单的方式去整合这些功能到已有的代码中；也许你想使用新的 JavaScript 语法，但是你不能将需要的构建工具应用到您现有的构建过程中；也许你只是想扩展你的开发，使得多个团队可以同时处理单个产品，但是这个复杂的、耦合性高的单体应用使得每个人都会绊住对方的脚。这些问题会对你向客户提供高质量体验产生负面影响。

最近，越来越多的人开始关注复杂的现代 web 开发所必需的整体架构和组织结构。特别地，我们看到了一些模式出现，它们将前端巨石应用分解成更小、更简单的块，这些块可以独立开发、测试和部署，同时在客户看来仍然是一个单一的内聚产品。我们将这种技术称为微前端。

使用微前端这项技术有如下的好处：

1. 更小、更加内聚的、更加可维护的代码库
2. 相互解耦、自治、灵活的结构
3. 单独进行升级，不会影响的其他部分

当然，在软件架构方面没有免费的午餐——一切都是有代价的。一些微前端方案可能导致重复依赖，增加用户必须下载的字节数。此外，团队自主性的急剧增加会导致团队工作方式的分裂。尽管如此，我们相信这些风险是可控制的，而且微前端的收益往往超过风险。

## 好处

### 增量升级

对于许多团队来说，增量升级是他们微前端旅程的开始。旧的、大的、前端巨石应用正在被过时的技术栈，或者是在交付压力下编写的代码所拖累，现在已经到了需要重写的时候了。为了避免全部重写，我们更喜欢一点一点地重写旧的应用程序，同时继续向我们的客户交付新特性，而不被巨石应用压得喘不过气来。

基于上述需求，这通常会导致一个微前端架构。一旦有一个团队有了只对旧的应用程序做少许修改就能将新的特性带入生产环境的经验，其他团队也会行动起来。已有的代码依然需要被维护，但是是否向旧的代码库增加新的功能，这变成了可选的。

我们获得了更多的自由，可以对产品的各个部分逐个做出决定，并对架构、依赖关系和用户体验进行增量升级。

如果产品需要修改或增加新的功能，我们只对需要升级的部分进行升级，而不是被迫停止整个应用并立即升级所有内容。如果我们想使用新技术，或新的模式，我们可以以一种比以前更加独立的方式来做。

### 简单并且解耦的代码库

每个独立的微应用的源代码比单体前端的源代码小得多。对于开发人员来说，这些较小的代码库往往更简单、更容易使用。我们避免了不相关的组件之间的耦合

### 独立部署

就像微型服务一样，各个微应用独立部署是关键。这减少了单次部署影响的范围，也降低了风险。无论你的前端代码托管到哪个地方，每一个微应用都应该独立进行持续交互。每个微应用的部署不应该依赖于其他的代码库

![独立部署](https://martinfowler.com/articles/micro-frontends/deployment.png)

### 独立自主的团队

有了解耦的代码库和独立的发布周期，我们离拥有完全独立的团队还有很长的路要走，他们可以拥有产品的一部分，从构思到生产，甚至更远。团队拥有向客户交付产品所需要的一切，这使他们能够快速有效地行动。为了实现这一点，我们的团队需要围绕业务功能的垂直部分组成，而不是围绕技术能力。一种简单的方法是根据最终用户将看到的内容划分产品，所以我们可以根据页面来划分微应用。这比团队围绕技术或水平关注点(如样式、表单或验证)组成具有更高的内聚性。

![](https://martinfowler.com/articles/micro-frontends/horizontal.png)

### 简单

简而言之，微前端就是将大而可怕的东西分割成更小、更易于管理的部分，然后明确它们之间的依赖关系。我们的技术选择、我们的代码库、我们的团队和我们的发布过程都应该能够相互独立地操作和发展，而不需要过度的协调。

## 例子

比如有这样一个例子：在一个网站上，顾客可以订购外卖食品。表面上看，这是一个相当简单的概念，但如果你想把它做好，就会有大量的细节：

* 它应该有一个可以供顾客浏览和搜索餐馆的页面。顾客可以通过某些属性对餐厅进行过滤，比如：价格，烹调方法，或顾客之前订单
* 每家餐馆都需要有自己的页面来显示菜单项，并允许顾客选择他们想要吃的东西，包括折扣、用餐优惠和特殊要求
* 顾客可以在它们的个人主页中查看他们的订单历史，跟踪交货，定制他们的支付选项

![](https://martinfowler.com/articles/micro-frontends/wireframe.png)

这儿的每个页面都是足够的复杂，我们可以将它划分到多个团队，每个团队都独立的开发、测试、发布并且部署他们自己的代码。然而，顾客仍然可以看到一个单一的、无缝衔接的网站。

## 集成

鉴于对微前端的松散定义，有很多方案都可以被称为微前端。接下来，我们将会介绍这些方法的利弊。这些方案通常都有一个共同之处：应用程序的每一个界面都是一个微应用，并且有一个容器应用程序。容器应用起如下作用：

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

## 写在后面

### 样式隔离

CSS 是又称为层叠样式表，它没有模块系统、命名空间或封装。在微前端领域，这些问题都加剧了。例如：一个团队有这样一个样式脚本 `h2 { color: black; }`,另一个团队有这样一个样式脚本`h2 { color: blue; }`,并且这两个选择器都作用到同一个页面，这个时候就会发生方式冲突。由于代码是由不同团队写的，并且托管到不同的仓库，所以使得它很难被发现。

多年来，人们发明了许多方法使CSS更易于管理。比如：使用严格的命名约定，如BEM，以确保选择器只作用于预期的地方；使用预编译器，例如：SASS，让选择器嵌套作为命名空间的一种形式；一种较新的方法是用 CSS modules 或 CSS-in-js，确保样式只应用于开发人员想要的地方；还有一个方式就是 shadow DOM 提供样隔离。

不必纠结于使用那种方式来达到样式隔离的目的，只要你找到一种方法来确保开发人员能够独立地编写他们的样式，并且确信他们的代码在组合成一个单独的应用程序时能够表现出可预测的行为。

### 共享的组件库

微前端应用中各个微应用的视觉一致性很重要，实现这一点的一种方法是开发一个共享的、可重用的 UI 组件库。总的来说，这是一个好主意，但是很难做好。创建这样一个库的主要好处是通过增加代码的重用，减少工作量并且到达视觉一致性。此外，组件库可以作为一个活生生的风格指南，它可以成为开发人员和设计人员之间协作的一个很好的切入点。

过早地创建太多的公用组件很容易出问题。创建一个可以在所有应用程序中使用的基础框架是很诱人的。但是，经验告诉我们，在实际使用组件之前，很难猜测组件的 api 应该是什么，这会导致组件早期的大量混乱。更推荐的做法是让团队创建他们自己需要的组件，即使这在一开始会导致一些重复，一旦组件的 API 变得显而易见，您就可以将重复的代码收集到共享库中。

在多个微项目之间共享组件之前要确保共享的组件只包含 UI 逻辑，没有业务逻辑和状态。当业务逻辑放入共享库时，它会在应用程序之间创建高度耦合，并增加更改的难度。

### 跨应用程序通信

微前端最常见的问题之一是如何让各个应用相互通信。一般来说，建议尽可能少地让它们进行通信，但是在某些时候跨应用通信是需要的。浏览器自定义事件是一种实现跨应用通信很好的方式；另外，向下传递回调和数据的 React 模型也是一个不错的解决方案；第三种选择是使用浏览器地址实现通信。

无论我们选择何种方法，我们都希望微前端通过彼此发送消息或事件的方式进行通信，并避免任何共享状态。

### 后端通信

如果我们有独立的团队开发前端应用程序，那么后台开发呢？我们坚信全栈团队的价值，他们拥有自己的应用程序开发流程，从可视化代码到 API 开发，再到数据库和基础设施代码。BFF模式在这里很有帮助，每个前端应用程序都有一个相应的后端，其目的仅仅是服务前端的需求。

BFF 可能包含自己的业务逻辑和数据库，也可能只是下游服务的聚合器。如果存在下游服务，那么对于拥有微应用及其 BFF 的团队来说，拥有其中的一些服务可能有意义，也可能没有意义。如果某个微应用只需要调用一个 API，而且这个 API 相当稳定，那么构建 BFF 可能根本就没有什么价值。这里的指导原则是，某个团队创建微应用不应该等待其他团队为他们构建东西。因此，如果新特性添加到微应用中也需要后端更改，那么这是一个由同一团队拥有的BFF的好时机。

![](https://martinfowler.com/articles/micro-frontends/bff.png)

另一个常见问题是，微前端应用程序的用户应该如何通过服务器进行身份验证和授权?显然，我们的客户应该只需要对自己进行一次身份验证，因此 auth 需要跨应用存在，应该由容器应用程序拥有。容器可能具有某种登录表单，通过该登录表单我们可以获得某种令牌。这个令牌将被容器所拥有，并且可以在初始化时注入到每个微应用中。

### 测试

在测试阶段，我们看不到单体前端和微前端有什么区别。每个微应用都应该有自己的自动化测试套件，以确保代码的质量和正确性。

明显的差距就是各种微前端与容器应用程序的集成测试。你可以使用你最喜欢的功能测试或端到端测试工具，但是要注意测试覆盖范围。我们的意思是，使用单元测试来覆盖底层业务逻辑和呈现逻辑，然后使用功能测试来验证页面是否正确组装。

如果有用户进行跨应用的操作,那么你可以使用功能测试覆盖,但是功能测试只是用于验证跨应用的集成,而不是微应用的内部业务逻辑,内部业务逻辑应该由单元测试覆盖

下一期我们将详细解释如何使用 react 将容器和微应用整合在一起。你可以先看看[最终的效果](https://demo.microfrontends.com/)
