# nodejs 被用来做什么样的项目

1. 服务端渲染 + 前后端代码同构
2. 构建工作流
3. 客户端

# 技术预研

1. 分析需求，找出需求中的每一个难点
2. 对难点进行分析，攻克每一个难点

# BFF 层

BFF 层是前端与后端微服务之间的中间层，它用于组装微服务的数据提供给前端

BFF 层需求实现的功能有两方面，分别是：

1. 为前端提供 HTTP 服务
2. 与后端进行 RPC 通信

# commonjs 模块规范

在 commonjs 模块规范中使用 require 导入模块，使用 exports 或者 module.exports 导出模块。通过 exports 导出模块不会覆盖 exports 对象，通过 module.exports 导出模块会覆盖 exports 对象
 
通过 exports 导出模块（A），然后在另一个文件(B)中通过 require 导入模块赋给变量 C，在 B 文件中得到的 C 与 A 指向同一个引用，所以修改 C 的属性也会反映到 A 上。
 
# nodeJs 内置模块

nodeJs 提供了很多内置模块，比如：fs，events，http 等，这些内置模块都可以在[nodeJs 的文档中看到](https://nodejs.org/docs/v12.10.0/api/index.html)

# 非阻塞 I/O

1. I/O 即 input/output，输入/输出
2. 非阻塞 I/O 指 I/O 系统在接受输入到输出期间，能否接受其他的输入

在考虑是否是非阻塞 I/O，需要先确定一个 I/O 系统

# RPC 通信

BFF 层与后端服务之间会存在 RPC 通信。RPC 通信和 Ajax 通信在写法和调用逻辑上比较相似，但是他们是两个完全不同的东西

*. RPC 通信和 Ajax 通信都有寻址的过程，Ajax 通信通过 DNS 寻址，但是 RPC 通信通常不会根据 DNS 寻址，因为 RPC 通信使用 DNS 寻址效率低，不同公司的 RPC 通信的寻址方式可能是不一样的
*. RPC 和 Ajax 都是两个计算机之间的通信，都需要双方约定数据格式
*. RPC 和 Ajax 通信协议不一样，Ajax 通信使用 http 协议，RPC 通信使用二进制协议

# 前后端代码同构

前后端代码同构需要区分前后端执行环境的界限，这是因为在 nodeJs 中能够使用的 API 和服务器环境的能够使用的 API 有所不同。

服务端渲染只是负责渲染初始状态，如果在初始化渲染之后在界面上进行操作以改变页面状态，这需要借助 js。所以还需要构建客户端代码，将生成的 js 文件引入到服务端渲染的模板中。

# HTTP 服务性能测试

## 进行压力测试
  
使用压力测试工具，如：ab

```cli
ab -c200 -n300 http://127.0.0.1:3000/
```

Requests per second： 表示每一秒能够处理的并发量
Transfer rate: 表示吞吐量
Time per request: 每个请求的耗时

配合 top 和 iostat 命令检测 cpu ,内存，磁盘的使用情况

## nodeJs 性能分析

* node profile + ab 压力测试工具分析 nodeJs 的性能

[查看详细内容](https://nodejs.org/en/docs/guides/simple-profiling/)

步骤

第一步

```cli
node --prof app.js
```

给 node 命令增加  --prof。这会在根目录生成一个名为 isolate-0xnnnnnnnnnnnn-v8.log 的文件

第二步

```cli
ab  -c 20 -t 15 "http://127.0.0.1:3000/list/"
```

进行压力测试

第三步

```cli
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

在 processed.txt 中能够查看 nodeJs 运行程序的性能情况
  
* 使用 chrome devtools 进行性能分析

第一步

```
node --inspect-brk index.js
```

第二步

在 chrome 浏览器地址栏中输入 chrome://inspect

第三步

在 chrome 中 Devices 中点击 `inspect`

第四步

在 profile 中开始快照

第五步

进行压力测试

第六步

在 profile 中结束快照

第七步

CPU 性能分析已经生成

## nodeJs 代码性能优化

* 提前进行计算

在中间价中进行的计算，会在每一个 http 请求都进行计算。考虑是否可以将中间价中进行的计算提取到中间键外面计算，在中间价中只是进行取值操作

* 用空间换时间

## 监测内存的使用情况

使用 chrome devtools 监测内存的使用情况

# 多进程

## child_process

使用 child_process.fork() 创建子进程，子进程可以使用 IPC 通道与父进程进行通信

```js
// parent.js
const { fork } = require('child_process')
const child = fork('./child.js')
child.send('hello,i am form parent.js')
```

```js
// child.js
process.on('message',msg => {
  console.log(msg) // hello,i am form parent.js
})
```

## cluster

使用 node 内部模块 cluster，创建工作进程，使工作进程处理连接服务。工作进程和主进程之间建立 IPC 通道，使得工程进程和主进程能够进行通信。

```js
// index.js
const cluster = require('cluster')
const path = require('path')

if(cluster.isMaster) {
  // 创建三个工作进程，处理连接服务
  for(let i =0 ;i< 3;i++){
    const work = cluster.fork()
    work.send('hello '+work.id)
  }
} else {
  require( path.join( './app.js') )
}

```

```js
// app.js

const koa = require('koa')
const mount = require('koa-mount')

const app = new koa()

app.use(
  mount('/',async (ctx) => {
    ctx.status = 200
    ctx.type = 'html'
    ctx.body = 'hello nodejs'
  })
)
app.listen(3000)

process.on('message',msg => {
  console.log(msg) // hello xxx
})
```

# 动静分离
