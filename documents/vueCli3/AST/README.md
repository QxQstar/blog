# 抽象语法树

## 什么是抽象语法树

在计算机技术中，抽象语法树指用树状结构来表示具体编程语言中的语法结构。之所以称这里的语法是'抽象'的，是因为这里的语法并不表示具体编程语法中的细节。


##   Vue CLI 往某个文件插入 import 实现方法

### 工具

1. jscodeshift
2. vue-jscodeshift-adapter

Vue CLI 是使用 jscodeshift 和 vue-jscodeshift-adapter 向文件中插入 import 语句

```js
const jscodeshift = require('jscodeshift')
const adapt = require('vue-jscodeshift-adapter')
// transform ： 方法，它用于操作 AST 并且生成新的文件内容
// fileInfo ： { path: 文件的路径, source: 文件的内容}
// options ： { imports : 要向文件中插入的 import 语句}。例如：{import : ['import router from "vue-router" ']}
module.exports = function runCodemod (transform, fileInfo, options) {
  // 返回转换之后的文件内容
  return adapt(transform)(fileInfo, { jscodeshift }, options || {})
}
```

transform 方法是比较有用的，jscodeshift 给出了很多操作和访问 AST 的 API，transform 方法就是你根据你的需求去使用 jscodeshift 的 API。fileInfo, { jscodeshift }, options 会作为参数传递到 transform 中
