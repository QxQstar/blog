# 优化 JS 的加载性能之 Tree Shaking

随着 web 应用复杂性增加，JS 代码文件的大小也在不断的攀升，截住 2021年9月，在 httparchive 上有统计在移动设备上 JavaScript 传输大小大约为 447 KB，桌面端 JavaScript 传输大小大约为 495 KB，注意这仅仅是在网络中传输的 js 文件大小。JavaScript 在通过网络发送时经常被压缩，这意味着在浏览器解压后，JavaScript 的实际大小要比传输大小大很多。

![](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/images/figure-1.svg)

上图是下载和运行JavaScript的过程。

即使 js 的传输大小被压缩为 300 KB，但仍然有 900 KB 的 js 代码需要被解析、编译和执行。图像一旦被下载，只需要花费相对琐碎的解码时间，与图像不同的是，JavaScript 必须被解析、编译，然后最终执行，这使得处理 JavaScript 比处理其他类型的资源更耗时。

![](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/images/figure-2-1x.png)

上图是解析/编译 170 KB的 JavaScript 的处理成本与同等大小的 JPEG 的解码时间。JavaScript引擎的性能在不断被改进，同时改进网站JavaScript性能也是开发者要做的事情。Code splitting 是优化 js 性能的技术之一，但是它不能减少应用程序的 js 代码的总大小，在这里我们使用 Tree Shaking 来减小 js 代码的大小。

## 什么是 Tree Shaking

您可以将应用程序想象成一棵树。您实际使用的源代码和库表示树中绿色的活叶子。死代码表示秋天时树上棕色的枯叶。为了除掉枯叶，你必须摇动树，让它们倒下。Tree Shaking 是指消除死代码，下面通过一个应用程序演示了这个概念。使用 ES6 静态模块语法导入依赖项：

```javascript
// 在这里导入了所有的数组处理方法
import arrayUtils from "array-utils";
```

在应用最初的时候，依赖项可能很少，随着功能逐渐增加，依赖项也会增加。更糟糕的是，旧的依赖项不再使用，但可能不会从代码库中删除。最终的结果是，应用程序最终带有大量未使用的JavaScript，Tree Shaking 解决了这个问题，它通过分析我们在文件中使用的 ES6 静态模块语句来分析哪些模块被导入了:

```javascript
// 只导入部分方法
import { unique, implode, explode } from "array-utils";
```

这个导入示例与前一个示例的区别在于，本示例只导入其中的特定部分，而不是从“array-utils”模块导入所有内容。

## Finding opportunities to shake a tree

为了便于说明，[这里有一个](https://github.com/malchata/webpack-tree-shaking-example)使用 webpack 的单页应用程序示例来演示 Tree Shaking 是如何工作的。界面如下：

[](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/images/figure-3-1x.png)

这个程序打包之后的代码被分为两文件，如下：

![](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/images/figure-4-1x.png)

在任何应用程序中，你需要从静态导入语句寻找 Tree Shaking 的机会，在示例程序中(FilterablePedalList.js)你将看到这样一行导入语句:

```javascript
import * as utils from "../../utils/utils";
```

在文件中这样的导入语句应该引起你的注意，它的意思是：从 utils 模块导入所有内容。问题是：你真的用到所有的内容了吗？现在我们来检查 FilterablePedalList.js 中究竟使用了 utils 模块中的那些方法，通过检索发现只使用了 utils.simpleSort:

```javascript
if (this.state.sortBy === "model") {
  // Simple sort gets used here...
  json = utils.simpleSort(json, "model", this.state.sortOrder);
} else if (this.state.sortBy === "type") {
  // ..and here...
  json = utils.simpleSort(json, "type", this.state.sortOrder);
} else {
  // ..and here.
  json = utils.simpleSort(json, "manufacturer", this.state.sortOrder);
}
```

我们现在开始做 Tree Shaking 优化

## 防止 Babel 将 ES6 模块转换为 CommonJS 模块

在大型应用中 Babel 是不可或缺的工具，但是它会让 Tree Shaking 变得困难。如果你正在使用 babel-preset-env，它会自动为你将 ES6 模块转换为更广泛兼容的 CommonJS 模块，用 require 代替 import。对于 CommonJS 模块而言做 Tree Shaking 优化非常困难，这是因为 CommonJS 模块是动态的，在构建阶段 bundlers 不能分析出 CommonJS 模块导出了什么导入了什么。为了避免 babel-preset-env 将 ES6 模块转换成 CommonJS 模块，我们可以这么做：

```javascript
{
  "presets": [
    ["env", {
      "modules": false
    }]
  ]
}
```

在你的 Babel -preset-env 配置中简单指定"modules": false就可以让 Babel 按照我们想要的方式运行，这允许 webpack 分析你的依赖树并摆脱那些未使用的依赖。

## 留意 side effects

当函数修改了它作用域之外的内容，我们就认为这个函数有 side effects。side effects 也适用于ES6模块，在你做 Tree Shaking 的时候你需要留意你的模块是否有 side effects(副作用)，如果模块接受可预测的输入，并输出同样可预测的输出，而不修改其自身范围之外的任何内容，我们这个模块没有 side effects。在这里我举两个 side effects 例子：

```javascript
import './index.module.scss';
import './assets/shoot.svg';
```

如果在某个模块中出现了上面这样的 import 语句，则认为这个这个模块有 side effects，在做 Tree Shaking 的时候你需要小心一些。默认情况下，webpack 在做 Tree Shaking 的时候，会认为 index.module.scss 与 assets/shoot.svg 没有被用到，所以它们会被移除，如果不想被移除，可以告诉 webpack 它们是 side effects：

```json
{
  "name": "webpack-tree-shaking-example",
  "version": "1.0.0",
  "sideEffects": [
    "./index.module.scss",
    "./assets/shoot.svg"
  ]
}
```

在项目的 package.json 中配置 sideEffects 字段。sideEffects 字段也能为 false，这表示没有 sideEffects。

## 只导入你需要的

现在我们已经告诉 babel 不要将 ES6 模块转成 CommonJS 模块，现在我们需要对导入语法做一点微调，只从 utils 模块中引入我们需要的函数吗，在本指南的例子中，我们只需要simpleSort:

```javascript
import { simpleSort } from "../../utils/utils";

if (this.state.sortBy === "model") {
  json = simpleSort(json, "model", this.state.sortOrder);
} else if (this.state.sortBy === "type") {
  json = simpleSort(json, "type", this.state.sortOrder);
} else {
  json = simpleSort(json, "manufacturer", this.state.sortOrder);
}
```

现在我们已经完成了 Tree Shaking 的工作，下面是 Tree Shaking 之前 webpack 打包生成的 js 包大小：

```dotnetcli
                 Asset      Size  Chunks             Chunk Names
js/vendors.16262743.js  37.1 KiB       0  [emitted]  vendors
   js/main.797ebb8b.js  20.8 KiB       1  [emitted]  main
```

下面是 Tree Shaking 之后 webpack 打包生成的 js 包大小：

```dotnetcli
                 Asset      Size  Chunks             Chunk Names
js/vendors.45ce9b64.js  36.9 KiB       0  [emitted]  vendors
   js/main.559652be.js  8.46 KiB       1  [emitted]  main
```

main 的文件大小下降比较明显，这是因为 webpack 移除了不需要的 utils 方法。

## 更复杂的情况

在有些情况你按照上面的步骤进行 Tree Shaking，但是 webpack 还是将模块的所有内容都打包到最终的 Chunk 中了，例如：lodash。

```javascript
// 仍然会导入所有的内容
import { sortBy } from "lodash";

// 这只会导入 sortBy
import sortBy from "lodash/sortBy";
```

如果你想要使用第一种写法，那么你还需要安装 [babel-plugin-lodash](https://www.npmjs.com/package/babel-plugin-lodash)。如果你使用了第三方库，你可以看一下这个库的导出是否使用了 ES6 语法，如果它的导出用的是 CommonJS 语法，例如：module.exports，那么 webpack 不能对它进行 Tree Shaking 优化。有些插件，例如：[webpack-common-shake](https://github.com/indutny/webpack-common-shake)，提供了对 CommonJS 模块进行 Tree Shaking 的能力，但是它[有一些限制](https://github.com/indutny/webpack-common-shake#limitations)。

## 总结

为了确保构建工具可以成功地优化你的应用程序，应该避免依赖 CommonJS 模块，并在整个应用程序中使用 ES6 模块语法。
