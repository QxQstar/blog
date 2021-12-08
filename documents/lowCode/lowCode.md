# 关于低代码的思考

在国内近几年低代码的热度非常高，腾讯、字节跳动和阿里等互联网大厂在低代码方向都有布局。低代码非常具有市场吸引力，这一点我们从 IPO 规模就能看出来，但低代码和无代码即受到了肯定也受到了质疑。这篇文章将从一个程序员的角度介绍低代码。

## 什么是低代码

低代码是一种软件开发方法，在构建应用程序的过程中它几乎不需要编码。低代码平台是一组工具，它使用具有简单逻辑和拖放功能的可视化界面来开发软件而不使用可扩展的编码语言来开发软件。低代码的主要目标是减少手工编码(即：从头开始编写代码)的数量，并增加代码复用的数量。

低代码有三个组成部分：

1. 可视化集成开发环境(IDE)：它是低代码开发平台的核心部分。它通常是一个可拖拽的交互界面，开发者用它做出想要的界面，他们也可以用它来添加手写代码。通常，开发人员使用可视化集成开发环境中内置的组件完成应用程序的大部分内容，然后使用自定义代码定制最后一公里。
2. 连接器：低代码平台使用连接器将各种后端服务、数据库和 API 插入到平台，连接器给平台提供了可扩展性和增强的功能。
3. 应用程序生命周期管理器：如果低代码平台生成的应用有较强的鲁棒性，那么它就需要具备高质量的生命周期管理，用于在测试、调试、部署和维护代码的工具，无论你如何创建应用这都是创建任何应用程序必要的步骤。

## 低代码与无代码

在前面我提到过低代码由三部分组成，分别是可视化集成开发环境、连接器和应用程序生命周期管理器，无代码平台也有这三部分，咋一看，它们的差异不大，似乎只有可定制代码和不可定制代码的差异。

当登录任何两个低代码平台和无代码平台我们很容易就能注意到它们的目标用户不同，如果这就是它们唯一的差别，那么我们完全可以想象有一天低代码和无代码平台融合。无代码平台去掉了编写代码的能力，抵代码保留了编码能力，这是由于它们底层理念不同导致的。

程序员一直在努力提高组件、函数或者类的复用性，可以认为整个行业都建立在这个愿望之上，想一想那些 open API 和 npm 包管理器你就可以发现这一点。如果你认为使用低代码平台是在走捷径，那么恕我直言，你可能早就在走捷径了，因为使用 React、Vue和脚手架等开源方案也是在走捷径。

低代码不是对传统的颠覆，而是对传统的延续。从底层理论上讲，低代码尊重开发人员仍然需要定制这一事实。定制能力是低代码与无代码在 DNA 级别的差异。无代码通常被设计为“一次性”应用程序，具有简单的接口，没有可定制性或高级功能。

## 低代码的适用场景

### 内部工具

内部工具没有华丽的外表和交互，但是开发人员花了很多时间在这些工具上，有[研究表明](https://retool.com/blog/state-of-internal-tools-2021/)开发人员将近三分之一的时间用于构建内部应用，在员工人数超过 5000 人的公司中这一比例上升至 45%。

用低代码开发内部工具不是说内部工具不重要，它很重要。但是，平心而论内部工具并不总是开发人员想要花费时间的地方，也不总是企业想要消耗他们研发资源的方式。使用低代码平台可以更快地开发内部工具，甚至让一些非开发人员也可以构建它们，让专业的开发人员花更多的时间做一些更具挑战，更复杂的事情。

### MVP

MVP，即：小可行产品，由著名的创业专家埃里克·里斯提出，要求开发人员和创业公司更快地交付产品，更早地获得反馈，并考虑到客户的需求。MVP 是低代码的一个很好的使用场景，使用低代码开发应用程序能够缩短软件开发周期。

## 低代码的好处和坏处

低代码有各种各样的优点和缺点，这些取决于低代码平台以及如何使用它。

### 好处

1. 增加时间的价值：与手工编码相比，低代码开发可以让开发人员的想法更快地执行再到生产。
2. 提高开发人员的生产力和效率：许多低代码平台都带有预构建的组件，而且大多数平台都具有可以重用组件的能力，这使得低代码开发非常容易组合。
3. 更快的响应市场变化：低代码平台通过快速交付最新的应用程序或根据最新的客户体验趋势轻松更新现有的应用程序，使产品能够灵活地适应市场变化和客户需求。
4. 降低成本：低代码平台要求较少的编程专业知识，这有助于减少许多公司面临的 IT 资源缺乏的问题，使他们不需要雇佣更多的开发专家。

### 坏处

1. 厂商锁定：尽管手工编码复杂，但它具有灵活性和可扩展性，低代码平台有可能将开发人员锁定在一个有限的生态系统中，不过这个缺点取决于你选择的低代码平台。
2. 可伸缩性：非手工编写的代码可能不够健壮，无法扩展，如果低代码平台在构建时没有考虑到使用规模，在一些极端情况下，例如双 11，那么情况将会很糟糕。
3. 技术流动性：如果供应商在设计低代码平台时没有考虑到技术的流动性，当用低代码构建的应用程序需要更新或者底层技术需要更改，那么情况将会很糟糕。
4. 软件治理：低代码能够让更多的人加入到软件开发中，这能够减少企业的成本，但这会使软件治理变得更复杂。如果广大的开发人员或者更糟的是心怀不满的前员工做出未经授权的更改，就可能对软件造成严重的安全威胁。

## 低代码对软件开发的影响

低代码开发不会取代传统的软件开发，但它将改变在某些领域中的软件开发，变化将是巨大的。

### 代码将增加更多抽象

从软件开发的历史传统上看，低代码是开发人员和代码之间的另一个抽象层。低代码的根源可以追溯到20世纪90年代的[第四代编程语言](https://www.techopedia.com/definition/24308/fourth-generation-programming-language-4gl)、计算机辅助软件工程(CASE)、快速应用程序开发(RAD)工具，这些早期的工具试图实现现代低代码的目标，即：用更少的时间和代码构建真正的应用程序。

即使像 React、Vue 这样的现代框架与需要编写更多代码才能获得相同结果的普通 JavaScript 相比也是一种低代码的形式。

### 低代码将增加软件开发人员的范围

低代码使更多的人加入到软件开发，它会扩大软件开发人员的范围，这意味着公司不需要为每个软件需求雇佣软件开发人员。这并不意味着开发人员的招聘将会放缓，但是公司可以从某些项目，比如内部工具开发重新分配开发人员的招聘，安排更多的专业软件开发人员面向客户的需求以及复杂和独特的软件开发问题。

## 总结

在谷歌上搜索‘Is low code the future?’会返回超过20多亿条结果，在百度上搜索‘低代码是未来的趋势吗？’会返回超过4千万条结果。实际上，低代码并不是未来，它是未来的一部分，在内部工具开发上它将大放异彩。

撇开低代码的商业价值，只从技术性上考虑，低代码平台包含的技术有：表单引擎、流程引擎、组件丰富性、数据管理、扩展功能、微前端、规则引擎、版本管理和 CI/CD 等，程序员完全可以以低代码为切入点扩充自己的专业能力。