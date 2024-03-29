# 《用 React 开发一个低代码系统》大纲

## 选题思路

我们从 Google 搜索和百度搜索可以看出低代码当前热度非常高，低代码是一种软件开发方法，在构建应用程序的过程中它几乎不需要编码。低代码平台是一组工具，它使用具有简单逻辑和拖放功能的可视化界面来开发软件而不使用可扩展的编码语言来开发软件。

低代码开发平台有三个组成部分：

1. 可视化集成开发环境(IDE)

它是低代码开发平台的核心部分。它通常是一个可拖拽的交互界面，开发者用它做出想要的界面，他们也可以用它来添加手写代码。通常，开发人员使用 IDE 中内置的组件完成应用程序的大部分内容，然后使用自定义代码定制最后一公里。

2. 连接器

低代码平台使用连接器将各种后端服务、数据库和 API 插入到平台，连接器给平台提供了可扩展性和增强的功能。

3. 应用程序生命周期管理器

如果低代码平台生成的应用有较强的鲁棒性，那么它就需要具备高质量的生命周期管理，用于测试、调试、部署和维护代码，无论你如何创建应用这都是创建任何应用程序必要的步骤。

程序员一直在努力提高组件、函数或者类的复用性，可以认为整个行业都建立在这个愿望之上，像 React、Vue 这样的现代框架与需要更多代码才能获得相同结果的普通 JavaScript 相比也是一个 low-code 的选择，低代码开发平台是通向可读性和抽象阶梯的又一步。

从技术性上考虑，低代码平台是一组工具，包含的技术有：表单引擎、流程引擎、组件丰富性、数据管理、扩展功能、微前端、规则引擎、版本管理和 CI/CD 等，程序员完全可以以低代码为切入点扩充自己的专业能力。

## 读者对象

本书的读者对象有两类：中级前端工程师和高级前端工程师。

* 中级前端工程师可以从这本书了解到，低代码系统应该有哪些功能点，以及低代码系统是如何从 0 到 1 开发出来的。他们必须有 JavaScript/TypeScript/React/NodeJs 基础。
* 高级前端工程师可以从这本书了解到，低代码系统的整体架构和设计思路。这部分读者有较强的前端开发能力和抽象能力，如果他有开发一个低代码工具、低代码系统或者低代码平台的需求，那么这本书会给他提供一些思路。

## 内容简介

本书由三部分组成，分别是：基础理论知识、需求分析和设计思路、详细设计与编码。

第一部分是基础理论知识，这部分有三个章节。第一章是 TypeScript 开发基础，包含 ES6 / ES7 语法基础、TypeScript 类型、ECMAScript Modules 和装饰器。第二章是 React 开发基础，包含开发环境搭建、JSX、Render Props、动态组件和状态管理。第三章是 Node.js 开发基础，包含开发环境搭建、Koa 和 MongoDB。

第二部分是需求分析与设计思路，这部分有四个章节。第四章是低代码系统的简介。第五章是目标业务场景需求分析，包含列表页、详情页和表单页的布局需求和逻辑需求。第六章是低代码系统的需求分析，包含可视化编辑器、应用管理、组件市场和用户管理的需求。第七章介绍设计思路，包含架构设计、Schema 设计、组件库市场和 MongoDB Document 设计。

第三部分是详细设计与编码，这部分有四个章节。第八章是可视化编辑器的实现，包含组件配置、拖拽、撤销/回退、低代码编辑和预览。第九章是渲染 SDK 的实现，包含解析 Schema、渲染组件、数据、联动、表单。第十章是版本控制，包含 GitHub OAuth2 授权 和 GitHub REST API。第十一章是生产运行基座，在这章中会介绍如何将低代码生成的页面集成到其他系统中，这部会涉及到微前端这一概念。


本书的重点在第二部分和第三部分

## 市场分析

低代码的根源可以追溯到 20 世纪 90 年代的第四代编程语言，在 2014 年 Clay Richardson 和 John Rymer 正式提出低代码这一概念，随着这一概念的不断普及，市场上出现了很多低代码开发平台，比如：OutSystems、PowerApps、宜搭等。在国内，近几年低代码的热度非常高，腾讯、字节跳动和阿里等互联网大厂在低代码方向都有布局，这些公司有专门的低代码平台开发人员。

从技术上分析，低代码涉及到多项技术，它是技术的综合体，程序员将低代码平台作为一个切入点扩张自己的专业技术会大有可为。从图书市场上分析，当下市面上有一些介绍低代码业务的图书，但是将程序员作为目标读者，介绍如何开发一个低代码系统的图书少有。

## 特色分析

1. 实战性强。从无到有开发一个低代码系统，不仅有详细的代码实现还有需求分析和设计思路。
2. 内容由浅入深，讲清来龙去脉。先介绍开发低代码系统的理论知识点，再一步一步分析需求，最后再实现需求。
3. 内容全面有深度。既包含前端知识也包含服务端知识，既生成低代码页面也消费低代码页面。
4. 所有代码托管在 GitHub 上。为了便于读者理解和降低读者获取源码的难度，本书中所有的源码将托管在 GitHub 上。读者也可以通过 GitHub 直接与本书作者交流

## 作者简介

秦小倩，毕业于电子科技大学成都学院计算机科学与技术专业，目前在杭州群核信息技术有限公司工作。
