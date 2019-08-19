# JavaScript Errors
## 产生
js错误可以通过两种方式产生，一种是浏览器自身在解析js代码时抛出错误，第二种是通过应用程序本身抛出错误（例如:throw new Error()）
## 应用程序抛出错误的方式
1. throw new Error('Problem description.')
2. throw Error('Problem description.') // 与第一种方式相同
3. throw 'Problem description.' // 不推荐
4. throw null // 不推荐

用throw直接抛出一个字符串或者null，不被推荐，因为浏览器不能产生追溯栈，也就是说不能追溯错误产生在代码中的位置。推荐抛出一个error对象，因为error不仅会保存错误信息，还会包含一个追溯栈。

## 浏览器的差异
不同浏览器在就错误信息和追溯栈的格式有不同的实现形式。追溯栈是用来描述错误出现在代码中什么位置。追溯栈通过一系列相互关联的帧组成，每一帧描述一行特定的代码，追溯栈最上面的那一帧就是错误抛出的位置，追溯栈下面的帧就是一个函数调用栈  - 也就是浏览器在执行JavaScript代码时一步一步怎么到抛出错误代码那一行的。追溯栈中的每一帧由以下三个部分组成：一个函数名（发生错误的代码不是在全局作用域中执行），发生错误的脚本在网络中的地址，以及发生错误代码的行数和列数。
## 提高代码的可调试性
1. 给匿名函数取名
2. 将匿名函数赋值给一个变量
3. 给函数设置displayName属性，displayName会出现在浏览器的devtools debugger中，但是IE11不支持displayNam。而Safari displayName还会出现在追溯帧中。

## 通过编程来获取追溯栈
在Chrome中，可以简单的调用Error.captureStackTrace API来获取到追溯栈，关于该API的使用可以通过如下链接了解： [https://v8.dev/docs/stack-trace-api](https://v8.dev/docs/stack-trace-api)
## 异步追溯栈
异步调用入口往往会给追溯栈带来问题，因为异步代码会生成一个新的执行上下文，而追溯栈又会重新形成追溯帧。Chrome DevTools 已经支持了异步追溯栈


## 参考文章
1. [JavaScript Errors 指南](https://mp.weixin.qq.com/s/e4_AdSWMxl1BXLfMl-sAgA)