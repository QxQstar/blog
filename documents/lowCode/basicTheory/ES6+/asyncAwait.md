# async/await

标题中的 async 是指 async 函数。async 函数 和 await 关键字是 ECMAScript 2017 中的一部分，async/await 是 promise 的语法糖，它使异步代码更易于编写和阅读。

对 Javascript 异步编程略有研究的同学会知道， Javascript 异步编程经历了三个阶段，分别是：Callback Hell、Promise 和 async/await。

Callback Hell 是最古老的方式，它使用嵌套回调函数的方式实现异步编程，这种方式的函数前套层级可能会很深，它的代码结构看上去如下图：

![](./img/callback hell.jpeg)

通过 Promise 实现异步编程减少了回调函数的嵌套，但是它依然没有摆脱回调函数。它违背了 Don’t Repeat Yourself (DRY) 原则，另外它也不好 Debug。

async/await 是一种最新的用来实现异步编程的方式，也是最推荐的方式。它是建立在 Promise 基础之上的，它能与 Promise 无缝衔接，使用它能够像写同步代码那些写异步代码。

## async 函数

例如有一个叫做 sayHello 的函数，它如下所示：

```javascript
function sayHello(){
    return 'hello'
}

const result = sayHello()
```

毋庸置疑，result 的类型是 `string`。现在我们改写 sayHello 函数，如下：

```javascript
async function sayHello(){
    return 'hello'
}

const result = sayHello()
```

现在 result 是什么类型？答案是：`Promise<string>`，如果将 sayHello 函数中的 return 语句删除，result 是什么类型？答案是：`Promise<void>`。总结一下，async 函数总是返回一个 promise 对象。

## await 关键字

await 关键字可以在 async 函数中使用，也能在 JavaScript modules 的顶层使用。只用将 async 函数与 await 关键字合在一起使用时，async 函数的优势在能体现出来。

await 可以放在任何基于 promise 的异步函数前面，它会暂停后面的代码，直到 promise 的状态变成 fulfilled，然后返回结果值。

```javascript
function hello() {
    return 'hello'
}

async function sayHello() {
    return await hello() // js 不会报错，但是这样写没有意义。
}
```

## async 函数的执行过程

以下面这个例子为例来介绍 async 函数的执行过程

```javascript
async function foo() {
   const result1 = await new Promise((resolve) => setTimeout(resolve, 1000, '1'))
   const result2 = await new Promise((resolve) => setTimeout(resolve, 1000, '2'))
}

foo()
```

在 foo 函数中有两个 await，程序在执行 foo 函数的时候会分为 3 个阶段。

1. foo 函数体中的第一行被同步执行，这时会得到一个 pending 状态的 promise，foo 函数被挂起并且交出进程的控制权。
2. 当第一个 promise 的状态变成 fulfilled 或者 rejected 之后，进程的控制权重新回到 foo 函数。如果 promise 的状态是 fulfilled，那么将 `1` 赋值给 result1 变量，程序继续运行，第二个 promise 被创建，foo 函数再次被挂起并且交出进程的控制权。
3. 当第二个 promise 的状态变成 fulfilled 或者 rejected 之后，进程的控制权重新回到 foo 函数。如果 promise 的状态是 fulfilled，那么将 `2` 赋值给 result2 变量，程序继续运行，foo 函数返回一个用 undefined 兑现的 promise 

在 async 函数中，promise 链是分阶段创建的。

## 捕获错误

使用 try...catch 捕获 async/await 的错误，现在改写上面的 foo 函数

```javascript
async function foo() {
    try {
        const result1 = await new Promise((resolve) => setTimeout(resolve, 1000, '1'))
       const result2 = await new Promise((resolve, reject) => setTimeout(reject, 1000, 'error in 2'))
    } catch(error){
        console.log(error) // error in 2
    }
}

foo()
```

## 错误的使用案例

使用 async/await 的一个常见错误是，太多的串行。先看个简单例子：

```javascript
async function serial(){
    await waitTime(500);
    await waitTime(500);
}
```

serial 至少需要 1000ms 才能执行完。如果第二个 await 不依赖第一个 await 的结果，我们完全可以将两个 await 平行

```javascript
async function parallel(){
    const p1 = waitTime(500)
    const p2 = waitTime(500)
    await p1;
    await p2;
}
```

parallel 大概 500 ms 就能执行完，因为两个 await 是同时发生的。

再来看一个与业务相关的例子，比如，在这里有多个商品 ID，我们要用商品 ID 通过异步请求拿到商品详情，我们可以这样写：

```javascript
async function getGoodsDetail(ids) {
  const result = [];
  for (const id of ids) {
    result.push(await fetch(id))
  }
  return result
}
```

上面的代码简洁，但是不推荐，因为它让拿商品详情的请求是串行的。

推荐的做法如下：

```javascript
async function getGoodsDetail(ids) {
  const promiseArr = ids.map(id => fetch(id))
  return await Promise.all(promiseArr)
}
```

上面会以并行的方式发送请求，这大大节省了时间。
