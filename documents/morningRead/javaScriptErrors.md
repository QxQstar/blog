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
异步调用入口往往会给追溯栈带来问题，因为异步代码会生成一个新的执行上下文，而追溯栈又会重新形成追溯帧。Chrome DevTools 已经支持了异步追溯栈。可以从[https://www.html5rocks.com/en/tutorials/developertools/async-call-stack/](https://www.html5rocks.com/en/tutorials/developertools/async-call-stack/)获取更多信息
## 捕获JS 错误
1. window.onerror

给window.onerror定义一个事件处理程序，在程序中未被捕获的错误往往能够被window.onerror上注册的监听函数捕获到。详情查看[https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror)

```javascript
window.onerror = function(msg, url, line, col, err) {
  console.log('Application encountered an error: ' + msg);
  console.log('Stack trace: ' + err.stack);}
```

使用window.onerror捕获错误存在的问题
* 浏览器支持不统一。
    
    第5个参数是Error对象，但是不是所有的浏览器都能够正确的给window.onerror回调函数中提供一个error对象。Safari 和 IE10还不支持在window.onerror的回调函数中使用第五个参数
* Cross domain sanitization
    
    在Chrome中可以捕获到从其他域引用的js代码中的错误，并且将这些错误标记为script error。其他浏览器不会捕获到从其他域引用的js代码中的错误。
* window.addEventListener(“error”)

    window.addEventListener(“error”) API 的效果和window.onerror API相同。
* 错误会显示在控制台中
    给window.onerror设置回调函数不能阻止错误信息显示在控制台中。如果不想错误信息显示在控制台，可以在window.addEventListener(“error”)中使用e.preventDefault()。
> 使用 window.onerror捕获错误推荐的做法是:只有当JS错误带有一个合法的Error 对象和追溯栈时才将其报告给服务器.

    
## 参考文章
1. [JavaScript Errors 指南](https://mp.weixin.qq.com/s/e4_AdSWMxl1BXLfMl-sAgA)