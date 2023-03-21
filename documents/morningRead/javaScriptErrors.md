# 捕获 javascript 错误

js 错误可以通过两种方式产生，一种是浏览器自身在解析js代码时抛出错误，第二种是应用程序本身抛出错误，例如:throw new Error()

应用程序抛出错误的方式，有如下 4 种

1. throw new Error('Problem description.')
2. throw Error('Problem description.') // 与第一种方式相同
3. throw 'Problem description.' // 不推荐
4. throw null // 不推荐

不推荐用throw直接抛出一个字符串或者null，因为浏览器不能产生追溯栈，也就是说不能追溯错误产生在代码中的位置，推荐抛出一个error对象，因为error不仅会保存错误信息，还会包含一个追溯栈。

## 错误追溯栈

不同浏览器在就错误信息和追溯栈的格式有不同的实现形式，追溯栈用来描述错误出现在代码中什么位置，它通过一系列相互关联的帧组成，每一帧描述一行特定的代码，追溯栈最上面的那一帧是错误抛出的位置，下面的帧是函数调用栈 ，也就是浏览器怎么一步一步执行到抛出错误代码那一行的。追溯栈中的每一帧由以下三个部分组成：一个函数名（当发生错误的代码不是在全局作用域中执行）、发生错误的脚本在网络中的地址，以及发生错误代码的行数和列数。

使用下面的方式可提高代码的可调试性

1. 给匿名函数取名
2. 将匿名函数赋值给一个变量
3. 给函数设置 displayName 属性，displayName 会出现在浏览器的d evtools debugger 中，但是 IE11 不支持displayNam，而 Safari displayName 还会出现在追溯帧中。

在Chrome中，可以调用 Error.captureStackTrace API 来获取追溯栈，关于该API的使用可以访问[https://v8.dev/docs/stack-trace-api](https://v8.dev/docs/stack-trace-api)，异步调用入口往往会给追溯栈带来问题，因为异步代码会生成一个新的执行上下文，而追溯栈又会重新形成追溯帧，Chrome DevTools 已经支持异步追溯栈，访问[https://www.html5rocks.com/en/tutorials/developertools/async-call-stack/](https://www.html5rocks.com/en/tutorials/developertools/async-call-stack/)获取更多信息

## 捕获JS 错误

### window.onerror

给 window.onerror 定义一个事件处理程序，未被捕获的错误往往能够被 window.onerror 上注册的监听函数捕获到，详情查看[https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror)
    
```javascript
    window.onerror = function(msg, url, line, col, err) {
      console.log('Application encountered an error: ' + msg);
      console.log('Stack trace: ' + err.stack);}
```

使用 window.onerror 捕获错误存在的问题如下：

* 浏览器支持不统一。

第5个参数是 Error 对象，但不是所有的浏览器都能够正确的给 window.onerror 回调函数中提供一个 error 对象，Safari 和 IE10 还不支持在 window.onerror 的回调函数中使用第五个参数

* Cross domain sanitization

Chrome 可以捕获到从其他域引用的 js 代码中的错误，并将这些错误标记为 script error，如果不想处理其他域的错误信息，可以使用 script error 过滤，如果想要得到完整的跨域信息，还需要对引用跨域资源的 script 标签添加 crossorigin='anonymous' 属性，并且服务器上对这个资源设置合适的 Access-Control-Allow-Origin。

* window.addEventListener(“error”)

 window.addEventListener(“error”) API 的效果和 window.onerror API相同。

* 错误会显示在控制台中

给 window.onerror 设置回调函数不能阻止错误信息显示在控制台中，如果不想错误信息显示在控制台，可以在 window.addEventListener(“error”) 中使用 e.preventDefault()。

> 使用 window.onerror捕获错误推荐的做法是:只有当JS错误带有一个合法的 Error 对象和追溯栈时才将其报告给服务器.

### window.onunhandlerejection

window.onunhandlerejection 可以用来捕获未被处理的 promise 错误。

### try/catch

用try/catch包围代码块，当被包围的代码块发生错误，这些错误会被try/catch捕获，并且错误不会显示在控制台。我们通过try/catch来获取使用window.onerror获取不到的错误。使用try/catch捕获错误存在如下2个不足的地方

* 不能捕获所有错误。比如 try/catch 就不能够捕获 window.setTimeout 等异步操作抛出的错误，虽然 try/catch 不能够捕获异步代码中的错误，但是错误会被抛向全局，然后被 window.onerror捕获（在Chrome中已测试）。
* 不利于性能优化。在V8引擎中，包裹在try/catch中的语句不会被V8引擎优化（在未来可能会被解决）。可以通过将代码写在一个函数中，然后在try/catch中调用这个函数的方式来解决这个问题。

## 参考文章

1. JavaScript Errors 指南：https://mp.weixin.qq.com/s/e4_AdSWMxl1BXLfMl-sAgA
2. How to write async await without try-catch blocks in Javascript：https://blog.grossman.io/how-to-write-async-await-without-try-catch-blocks-in-javascript/
3. 从不用 try-catch 实现的 async/await 语法说错误处理：https://segmentfault.com/a/1190000011802045
4. window上的error事件：https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
5. Error.captureStackTrace API：https://v8.dev/docs/stack-trace-api
6. Chrome DevTools 异步追溯栈：https://www.html5rocks.com/en/tutorials/developertools/async-call-stack/