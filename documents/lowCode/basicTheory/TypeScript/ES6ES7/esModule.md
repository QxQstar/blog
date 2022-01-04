# ECMAScript modules

虽然我们可以直接在浏览器中使用ES模块，但如今，捆绑JavaScript应用的任务仍然是webpack等工具所独有的，以获得最大的灵活性、代码分割以及与旧浏览器的兼容性。

很多编程语言都有模块这一概念，JavaScript 也不例外，但在 ECMAScript6 规范发布之前，JavaScript 没有语言层面的模块语法。模块实际上是一种代码重用机制，要实现代码重用，将不同的功能划分到不同的文件中这是必不可少的，如何在其他的文件中使用这些文件定义的功能呢？在 ECMAScript6 之前，web 开发人员不得不寻求 JavaScript 语法之外的解决方法，例如：SystemJS、RequireJS 等模块加载工具，也有开发人员使用 webpack、Browserify 等模块打包工具。ECMAScript6 发布之后，JavaScript 拥有了语言层面的模块语法，它被称为 ECMAScript modules，简称 ES modules，这使 web 开发人员很容易就能创建模块，使用模块。在本节中会介绍 ES modules 的基本用法、ES modules 的优势以及在浏览器中使用 ES modules。

## 基本语法

ES modules 是 JavaScript 的标准模块系统，模块是一个简单的 JavaScript 文件，在这个文件中包含 export 或者 import 关键字。export 用于将模块中声明的内容导出，import 用于从其他模块中导入。

### 模块导出的5种写法

模块导出用到的关键字是 export，它只能在模块顶层使用，在条件判断语句、函数中均不能使用它，export 不支持变量。

虽然模块导出有5种写法，但是只有两种方式，一种默认导出，另一种是命名导出，这两种方式可以混合使用。命名导出可以有多个，默认导出只能有一个。

推荐使用哪一种导入方式（https://ponyfoo.com/articles/es6-modules-in-depth#best-practices-and-export）

### 3种模块描述符

1. 相对路径
2. 绝对路径
3. bare 模式

### 模块导入的5种方式

模块导入用到的关键字是 import，import 与 export 一样只能在模块顶部使用，这使得你的代码库的依赖项很容易被分析出来。

## 模块与常规 JavaScript 脚本的差异

在模块中的声明的变量是针对该模块的，这意味着在一个模块中声明的任何变量对其他模块都不可用，除非它们被显式地导出，然后导入到希望访问它们的模块中。

## ES module 5 个优势

1. 摇树优化

## 在浏览器中使用 ES modules

## 动态导入

基本语法、async/await

### 动态导入