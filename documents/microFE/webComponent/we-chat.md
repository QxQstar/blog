![head-img](./head-img.png)

微前端是一种使多个团队能够独立开发一个现代 web 应用的技术，策略或者方法。这项技术源自于微服务。

## 什么是微前端

2016年末微前端在[ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/techniques/micro-frontends)被第一次提到，它将微服务的概念应用到前端。现在比较流行的方式是创建一个基于微服务的功能丰富并且功能强大的浏览器应用，它被称为单页应用。但是前端层面上，这个应用只由一个前端团队开发，随着不断迭代，维护变得越来越困难，这被我们称为前端巨石应用。

微前端背后的理念是将一个网站或者 web 应用分为多个功能，不同的团队开发他们各自的功能。每个团队都有自己关心和擅长的业务或任务领域。

但是这并不是一个新的概念，它与[ Self-contained Systems](http://scs-architecture.org/) 有很多共同之处。在过去，这种处理方法被称为垂直系统的前端集成。

## 单体前端

![单体前端](https://micro-frontends.org/ressources/diagrams/organisational/monolith-frontback-microservices.png)

## 垂直划分

![垂直划分](https://micro-frontends.org/ressources/diagrams/organisational/verticals-headline.png)

## 微前端背后的核心理念

- 技术无关

每个团队可以选择或者更新他们自己的技术栈，并且不对其他团队造成影响。

- 隔离团队代码

不共享运行时，即便使用相同的框架。应用程序独立构建，并且不依赖共享状态和全局变量。

- 建立团队前缀

在不可能实现绝对隔离的情况下，使用团队前缀达成隔离的目的。例如：通过给 CSS，Events,Local Storage 和 Cookies 加前缀的方式避免冲突和明确所有权。

- 使用浏览器特性而非自定义 API

使用浏览器自定义事件进行通信，而非建立全局的发布订阅系统。如果不得不建立一个跨团队的 API，尽量保持简单。

- 建立一个有弹性的网站

即便 JS 出错或者禁止执行，也要让你的功能是可用的。

[前往掘金可以查看一个使用 web components + 服务端渲染实现微前端的例子](./)
