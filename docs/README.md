# 微信小程序学习笔记
## 基础
### 概括
![概括](./img/brife.png)

### 开始
#### 注册帐号
在[小程序注册页](https://mp.weixin.qq.com/wxopen/waregister?action=step1)注册自己的小程序帐号，注册完小程序帐号之后就可以登录管理后台得到appid，这个appid在开发小程序时需要用到
#### 开发者工具
在[开发者工具下载页面](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)下载微信小程序开发者工具
### 管理
#### 成员管理
在微信小程序中有两种类型的成员，分别是项目成员，体验成员，体验成员可以使用体验版小程序，项目成员也可以使用体验版小程序，除此之外项目成员可以登录小程序管理后台。项目成员有三种不同的角色：分别是开发者，运营者以及数据分析者，不同的角色登录管理后台能够执行的操作有所不同。欲知详情，前往[微信小程序开发者文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/release.html#%E5%8D%8F%E5%90%8C%E5%B7%A5%E4%BD%9C)。
#### 版本管理
通常在web前端应用的开发流程中会存在多个版本，比如开发版，测试版，线上版等。微信小程序的开发流程与此类似，不一样的地方是，微信小程序开发流程中多了审核这一个必须的步骤。

1. 开发版：开发者在微信小程序开发者工具中进行开发，在任何时刻任何开发者都可以点击开发者工具中的`上传`按钮上传代码，上传以后就可以在管理后台看到刚提交的代码了。开发版本只保留每人最新的一份上传的代码
2. 体验版：选择某个开发版作为体验版，体验版通常是相对稳定的，用于测试人员测试或者产品人员验收。
3. 审核中版本：当小程序测试通过之后，将测试通过的版本提交审核，在一段时间内只能有一份代码处于审核中。
4. 线上版本：当审核中版本审核通过之后可以发布该版本，发布之后就可以供线上用户使用。
### 发布
一个小程序的开发到发布通常要经历的过程是：开发 -> 上传代码 -> 提交审核 -> 发布。微信小程序有两种发布方式，分别是全量发布以及分阶段发布，分阶段发布又叫做灰度发布。

1. 全量发布：当点击发布之后，所有用户访问小程序时都会使用当前最新的发布版本。
2. 分阶段发布：分阶段发布是指分不同时间段来控制部分用户使用最新的发布版本。
### 目录结构
使用开发者工具新建一个小程序，新建完成之后会生成一个基本的目录结构，你可以根据自己的需要取改变目录结构。小程序包含一个描述整体程序的 app 和多个描述各自页面的 page。开发者工具生成的项目结构如下：
```
    .
    ├── app.js     
    ├── app.json
    ├── app.wxss
    ├── pages                   //页面
    │   ├── index
    │   │   ├── index.js
    │   │   ├── index.json
    │   │   ├── index.wxml
    │   │   └── index.wxss
    │   └── logs
    │       ├── logs.js
    │       ├── logs.json
    │       ├── logs.wxml
    │       └── logs.wxss
    ├── project.config.json  
    ├── sitemap.json         // 小程序页面微信索引配置规则
    └── utils
        └── util.js
```
#### 主体文件
微信小程序由三个主体部分组成，分别是app.js,app.json,app.wxss,这个三个文件必须放在项目的根目录
1. app.js:这个文件是每个微信小程序必需的文件，每个小程序都需要在 app.js 中调用 App 方法注册小程序实例,它接受一个 Object 参数，其指定小程序的生命周期回调等。整个小程序只有一个 App 实例。可以通过在js文件中调用 getApp 方法获取App实例。
```javascript
    /** app.js */
    App({
        // something
    })
    
    /** xxx.js */
    
    const app = getApp()
```

2. app.json: 这个是所有小程序都必需的文件，在这个文件中对小程序进行全局配置，例如：配置页面路径，网络超时时间等。在这个文件中使用pages属性必须配置页面路径，pages属性的第一个路径是小程序的首页。查看[所有的全局配置属性](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)
```json
    {
      "pages": [
        "pages/logs/logs",
        "pages/index/index"
        
      ],
      "window": {
        "backgroundTextStyle": "light",
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTitleText": "WeChat",
        "navigationBarTextStyle": "black"
      },
      "sitemapLocation": "sitemap.json"
    }
```

3. app.wxss: 定义小程序公共样式，非必需。在这个文件中定义的样式可以应用到所有的页面上。

#### 页面文件
每一个微信小程序页面都有四个与之相关的文件，分别是js，wxss，wxml以及json文件，这四个文件必须在相同的路径中，并且文件名也必须相同。所有的页面都必须在app.json的pages属性中去声明，小程序中新增/减少页面，都需要对 pages 数组进行修改。
1. js:对页面而言这是一个必需的文件，在这个文件中调用 Page 方法注册页面实例，页面的生命周期函数，数据等都做这个文件中定义或声明
```javascript
    Page({
     // something
    })
```
2. wxml:对页面而言这也是一个必需的文件，在这个文件中声明页面的结构，这个文件与html类似,但是也存在很多不一样的地方，比如标签名字有点不一样。详情请前往[WXML 模板介绍](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/code.html#WXML-%E6%A8%A1%E6%9D%BF)
3. wxss:非必需的文件，在这个文件中定义页面的样式，在这个文件书写的样式只对当前页面有效。WXSS 具有 CSS 大部分的特性，小程序在 WXSS 也做了一些扩充和修改。比如小程序新增了rpx这个单位，详情请前往[WXSS 样式](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html)
4. json:非必需的文件，在json中对本页面的窗口表现进行配置，页面中配置项会覆盖 app.json 的 window 中相同的配置项。详情请前往[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)
### 生命周期
#### 小程序APP的生命周期
1. onLaunch(Object object):小程序初始化完成时触发，全局只触发一次，当小程序冷启动时才会触发，关于冷启动和热启动见下文。这个生命周期函数接受一个参数，该参数中包含小程序启动时的参数，如路径，query参数等。
2. onShow(Object object):小程序启动或者从前台进入后台时触发，关于小程序和前台和后台见下文。 也可以使用`wx.onAppShow` 绑定监听,如果既定义了`onShow`又执行`wx.onAppShow(function)`,那么两个回调函数都会执行。
3. onHide():小程序从前台进入后台时触发。也可以使用 `wx.onAppHide` 绑定监听。如果既定义了`onHide`又执行`wx.onAppHide(function)`,那么两个回调函数都会执行。
4. onError(String error):小程序发生脚本错误或 API 调用报错时触发。也可以使用 `wx.onError` 绑定监听。
5. onPageNotFound(Object object): 小程序要打开的页面不存在时触发。也可以使用 `wx.onPageNotFound` 绑定监听,可以在回调函数中进行页面重定向，但是必须在回调中同步处理

```javascript
App({
  onLaunch (options) {
    // Do something initial .
  },
  onShow (options) {
    // Do something .
  },
  onHide () {
    // Do something.
  },
  onError (msg) {
    // Do something
  },
  /** 基础库 1.9.90 开始支持 */
  onPageNotFound(msg) { 
      // Do something 
  }
})

```
#### 页面的生命周期
1. onLoad(Object query):页面加载时触发。一个页面只会调用一次，可以在 onLoad 的参数中获取打开当前页面路径中的参数。关于什么情况会导致页面加载请查看[页面路由](#页面路由)部分
2. onShow():页面显示/切入前台时触发。
3. onReady():页面初次渲染完成时触发。一个页面只会调用一次，代表页面已经准备妥当，可以和视图层进行交互.如果要修改界面内容，如：导航文字，导航背景色等就在onReady之后进行
4. onHide():页面隐藏/切入后台时触发。 如 wx.navigateTo 或底部 tab 切换到其他页面，小程序切入后台等。
5. onUnload():页面卸载时触发。如wx.redirectTo或wx.navigateBack到其他页面时。
```javascript
Page({
  onLoad: function(options) {
    // Do some initialize when page load.
  },
  onShow: function() {
      // Do something when page show.
  },
  onReady: function() {
    // Do something when page ready.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  }
})
```
#### 页面事件处理函数
1. onPullDownRefresh():监听用户下拉刷新事件。可以调用`wx.startPullDownRefresh(Object object)`从代码层面开始下拉刷新，效果与用户手动下拉刷新一致。

* 1. 要在app.json(window.enablePullDownRefresh)或者页面配置文件(enablePullDownRefresh)中设置允许下拉刷新
* 2. 在回调函数中处理完数据刷新之后，要调用 **wx.stopPullDownRefresh**停止页面刷新
2. onReachBottom():监听用户上拉触底事件。可以在app.json和页面配置中设置触发距离
* 1. 在触发距离内滑动期间，本事件只会被触发一次。
* 2. 要避免触底事件处理程序还没有处理完成，又再一次触发触底事件。
3. onPageScroll(Object object):监听用户滑动页面事件。
* 1. 请只在需要的时候才在 page 中定义此方法，不要定义空方法。以减少不必要的事件派发对渲染层-逻辑层通信的影响。
* 2. 请避免在 onPageScroll 中过于频繁的执行 setData 等引起逻辑层-渲染层通信的操作。
4. onShareAppMessage(Object object):监听用户点击页面内转发按钮（button 组件 open-type="share"）或右上角菜单“转发”按钮的行为，并自定义转发内容。此事件处理函数需要 return 一个 Object，用于自定义转发内容。自定义转发内容参数如下

|字段|说明|默认值|
|:---|---|-----:|
|title|转发标题|当前小程序名称|
|path|转发路径|当前页面 path ，必须是以 / 开头的完整路径|
|imageUrl|自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4。如果需要自己用canvas画图，画图完成之后调用wx.canvasToTempFilePath将画布转成图片|使用默认截图|

* 1. 只有定义了此事件处理函数，右上角菜单才会显示`转发`按钮。如果需要在页面中定义转发事件处理函数，但是又不想右上角菜单才会显示`转发`按钮，可以调用`wx.hideShareMenu`方法隐藏转发按钮
5. onResize(Object object):小程序屏幕旋转时触发。
6. onTabItemTap(Object object):点击 tab 时触发
```javascript
Page({
 onPullDownRefresh: function() {
    // Do something when pull down.
  },
  onReachBottom: function() {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
  onPageScroll: function() {
    // Do something when page scroll
  },
  onResize: function() {
    // Do something when page resize
  },
  onTabItemTap(item) {
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
})

```

## 进阶
### 页面路由
微信小程序以栈的形式维护当前所有的页面,可以使用`getCurrentPages()`方法获得当前所有的页面栈，在小程序中的页面进行跳转会修改页面栈，也会触发相关页面的生命周期函数。做如下总结，详情请查看小程序开发者文档中的[页面路由](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html)部分。

#### 非tabBar页面
1. 使用wx.navigateTo和组件 <navigator open-type="navigateTo"/>打开页面，会将要打开的这个页面加入页面栈。注意：不管这个页面当前在不在页面栈 。
2. 页面从页面栈中移除会触发被移除页面的 Unload 事件。
3. 将页面加入页面栈中，这会触发这个页面的Load事件。
4. 页面重定向和页面返回也将离开的页面移除页面栈。
5. 页面返回是从页面栈的pop，如果页面栈的长度为1，执行页面返回操作，是没有效果的

#### tabBar页面
tabBar页面与其他页面有所不同，所有与其他页面分开总结
1. 打开tabBar页面，其他页面全部出栈，只在页面栈中留下当前tabBar页面。
2. 第一次打开tabBar页面，会触发这个页面的Load事件。
3. 在tabBar页面执行重定向操作进入另一个页面，这会触发tabBar页面的Unload事件。下一次再进入这个tabBar页面会触发Load事件。
4. 要打开tabBar页面只能调用 wx.switchTab,wx.reLaunch或使用组件 <navigator open-type="switchTab"/>

调用 wx.reLaunch 或者 使用组件 <navigator open-type="reLaunch"/>重启动会将所有页面Unload。
### 运行机制
1. 小程序有两种启动情况，分别是`热启动`和`冷启动`。
* 冷启动: 用户首次访问小程序，小程序被微信主动销毁或者将小程序从最近使用列表中删除，在以上三种情况打开小程序，小程序会冷启动。小程序冷启动会触发App实例的Launch事件，冷启动不会清除授权数据和Storage中的数据。
* 热启动: 将小程序从后台切换到前台。比如用户已经打开过小程序，在将来的一段事件内再次打开小程序，在这种情况无须重新启动小程序，这个过程是热启动。

2.微信小程序被销毁：

* 小程序进入后台超过一段时间，小程序会被微信主动销毁
* 小程序占用的系统资源过高，会被系统销毁或者被微信客户端回收，在ios中尤为严格。
建议使用 `wx.onMemoryWarning(function callback)` 监听内存不足事件，在收到通知后回收一些不必要资源避免进一步加剧内存紧张。后续会提到性能优化的相关内容。

3. 微信小程序的逻辑层和视图层由两个线程分开管理。视图层的界面使用了WebView 进行渲染，由于小程序中存在多个页面，所以视图层存在多个webview线程，但是只存在一个逻辑层线程，WXML 模板和 WXSS 样式工作在视图层，JS 脚本工作在逻辑层。
   ![逻辑层与视图层](./img/construct.png)                                                                                       

> 由于多个视图层进程共用一个逻辑层进程，会不会存在视图层之间抢占资源的情况？如果在A页面启动了一个定时器，然后又进入B页面，由于A页面并不会被卸载，一定时间后A页面中的定时器回调函数会不会与抢占B页面抢占资源？

逻辑层和视图层进行通信需要通过微信客户端做中转，逻辑层修改了数据想要更新视图，只能调用`setData`方法，而且调用之后视图并不会立即更新，更新是异步完成的。调用`setData`方法的结果是：修改data中的数据(同步)，更新视图(异步)。调用`setData`会引起视图层和逻辑层的数据传输，频繁的调用这个方法会存在性能问题。
### 版本更新
小程序审核通过之后就可以将小程序发布到线上供线上用户使用。下面介绍小程序发布到线上之后，小程序的更新机制。
> 微信客户端会自动的检查本地缓冲的小程序是否有新的版本，如果有新的版本，就会异步下载，等下一次再使用新的版本

如果需要用户马上使用新版本，可以在App的Launch事件中使用`wx.getUpdateManager`检查新版本。详细内容请查看[小程序官方提供的文档](https://developers.weixin.qq.com/community/develop/doc/000c2430d30b70251e86f0a0256c09)
### 性能优化
#### setData
在[运行机制](#运行机制)一节中已经提到`setData`的作用，在小程序中使用最频繁的接口就是`setData`，调用`setData`方法会引起逻辑层和视图层间的数据传输。实际上通过两边提供的 evaluateJavascript 所实现。即用户传输的数据，需要将其转换为字符串形式传递，同时把转换后的数据内容拼接成一份 JS 脚本，再通过执行 JS 脚本的形式传递到两边独立环境，而 evaluateJavascript 的执行会受很多方面的影响，数据到达视图层并不是实时的。
常见的 setData 操作错误
1. 频繁的调用`setData`
* Android 下用户在滑动时会感觉到卡顿，操作反馈延迟严重，因为 JS 线程一直在编译执行渲染，未能及时将用户操作事件传递到逻辑层，逻辑层亦无法及时将操作处理结果及时传递到视图层；
* 渲染有出现延时，由于 WebView 的 JS 线程一直处于忙碌状态，逻辑层到页面层的通信耗时上升，视图层收到的数据消息时距离发出时间已经过去了几百毫秒，渲染的结果并不实时；
> 建议：对连续的setData进行合并

2. 调用`setData`在逻辑层与视图层数据传输实际是一次 evaluateJavascript 脚本过程，当数据量过大时会增加脚本的编译执行时间，会占用 WebView JS 线程，这个时候WebView Js线程就不能处理其他的脚本，这会造成卡顿。
> 建议：只将与页面渲染相关的数据放在data中，使用setData去改变data中的数据。例如：有数据A，数据B，通过A和B计算得到数据C，数据C与界面，那么只将C放在data中。

3. 后台页面进行setData
当页面进入后台态（用户不可见），不应该继续去进行setData，后台态页面的渲染用户是无法感受的，另外后台态页面去setData也会抢占前台页面的执行。
#### 图片资源
图片资源的主要性能问题在于大图片和长列表图片上，这两种情况都有可能导致 iOS 客户端内存占用上升，从而触发系统回收小程序页面。
> 建议：减少使用大图片，对图片进行压缩，分页展示长列表图片。
#### 事件
1. onPageScroll:
在不需要监听页面滚动，就不要在page中定义这个方法，如果非要监听页面滚动，就避免在回调函数中执行setData，建议节流。
2. 事件绑定时需要传输target和currentTarget的dataset，因而不要在节点的data前缀属性中放置过大的数据。
#### 代码包大小
微信客户端在打开小程序之前，会把整个小程序的代码包下载到本地，代码包大小直接影响到下载速度，从而影响用户的首次打开体验。从以下几方面减少代码包的大小：
1. 将图片，视频，音频等体积较大的媒体文件移至服务器，需要时再下载。
2. 将固定的数据，如配置，城市地区等大段数据，保持到服务器，在需要的时候调用接口获得。
3. 删掉废弃的代码，封装组件或者`<template/>`，封装函数，提取公共样式避免重复代码。
4. 将整个小程序的代码根据功能或者模块分成不同的代码包。在这儿可以查看[分包](#分包)的具体内容
### 分包加载
> 将小程序分成不同的子包，在用户需要使用的时候按需进行加载，这样可以优化小程序首次启动的下载时间。

每一个分包小程序都必定会有一个主包，在主包中会放默认启动页面/TabBar 页面(必须)，以及一些所有分包都需用到公共资源/JS 脚本(非必须)；而分包则是根据开发者的配置进行划分。在小程序启动时，默认会下载主包并启动主页面，当用户进入分包内某个页面时，客户端会把对应分包下载下来，下载完成后再进行展示。
小程序分包大小限制：
1. 整个小程序所以分包大小不超过8M
2. 单个分包/主包大小不超过2M
#### 配置分包
在app.json 中subpackages字段中声明项目分包结构。以接龙圈为例：
```json
    {
      "pages": [
          "pages/index/index",
          "pages/common/pages/common/common",
          "pages/common/pages/verification/verification",
          "pages/common/pages/ordersign/ordersign",
          "pages/common/pages/login/index"
        ],
        "subpackages": [
          {
            "root": "pages/create-jl",
            "pages": [
              "pages/jl-reset/index"
            ]
          },
          {
            "root": "pages/home",
            "pages": [
              "pages/supply-introduce/index"
            ]
          }
        ]
    }
```
subpackages字段是一个数组，在subpackages字段中声明分包，分包的个数不限，每个分包有如下配置：
1. root: 分包根目录
2. pages: 分包页面路径，相对于分包根目录
3. name: 分包别名，在分包预加载的时候使用，欲知[分包预加载](#分包预加载)的内容见下文
4. independent: 是否是独立分包，欲知[独立分包](#独立分包)的内容见下文
#### 打包原则
1. 声明 subpackages 后，将按 subpackages 配置路径进行打包，subpackages 配置路径外的目录将被打包到 app（主包）中
2. 各个分包是独立的，app.json 中 subpackages字段定义的各个分包的文件不能交叉，即分包A不能引用分包B中的文件，subpackage 的根目录不能是另外一个 subpackage 内的子目录。
3. tabBar 页面必须在 app（主包）内
4. 一个页面要么在主包中，要么在某个分包中。
5. 分包A不能使用分包B中的文件，只能使用主包或者自己包中的文件
> 如果主包分包划分不好，主包的大小也很难降下来，所以如何分包相对比较复杂。在一个项目开发过程中，代码的分包可能不是一成不变的，例如随着业务复杂度上升，原本在分包A中的页面，要独立成另外一个分包B，如果用户访问了以前的page则得不到正确的页面响应（例如：分享出去的小程序卡片等），这种情况要兼容处理。
#### 独立分包
独立分包是小程序中一种特殊类型的分包，可以独立于主包和其他分包运行，一个小程序可以有多个独立分包。从独立分包中页面进入小程序时，不需要下载主包。当用户进入普通分包或主包内页面时，主包才会被下载。
独立分包注意事项：
1. 独立分包属于分包的一种。普通分包的所有限制都对独立分包有效
2. 独立分包不能依赖主包中的js文件，template、wxss、自定义组件、插件等。主包中的app.wxss对独立包无效
3. 独立分包运行时，`App` 不一定被注册了，因此 `getApp()` 也不一定可以获得 App 对象,因此在独立包中无法通过App对象实现全局数据共享。
4. 从独立分包启动小程序，主包中 App 的 onLaunch 和首次 onShow不会被调用。只要从独立分包首次进入主包或者其他普通分包中的页面时才会被调用。
> 个人认为可以将一些推广页或者活动页放在独立分包中，打开独立分包中的页面不需要下载主包，所以可以快速打开，但是独立分包中不建议写复杂的业务

从基础库 2.2.4 版本开始 getApp支持 `allowDefault`参数，在 App 未定义时返回一个默认实现。当主包加载，App 被注册时，默认实现中定义的属性会被覆盖合并到真正的 App 中。
```javascript
    // 独立分包中
    const app = getApp({allowDefault: true}) // {}
    app.data = 456
    app.global = {}
    
    // App.js中
    App({
      data: 123,
      other: 'hello'
    })
    
    console.log(getApp()) // {global: {}, data: 456, other: 'hello'}

```
#### 分包预加载
开发者可以通过配置，在进入小程序某个页面时，由框架自动预下载可能需要的分包，提升进入后续分包页面时的启动速度。对于独立分包，也可以预下载主包。
```json
{
  "pages": ["pages/index"],
  "subpackages": [
    {
      "root": "important",
      "pages": ["index"]
    },
    {
      "root": "sub1",
      "pages": ["index"]
    },
    {
      "name": "hello",
      "root": "path/to",
      "pages": ["index"]
    },
    {
      "root": "sub3",
      "pages": ["index"]
    }
  ],
  "preloadRule": {
    "pages/index": {
      "network": "all",
      "packages": ["important"]
    },
    "sub1/index": {
      "packages": ["hello", "sub3"]
    },
    "sub3/index": {
      "packages": ["path/to"]
    }
  }
}
```
### 文件系统
小程序以微信客户端作为中转，被赋予了读写某些权限的能力。所有文件的管理操作，如：复制，写入等都需要通过`FileSystemManager`来调用。通过 `wx.getFileSystemManager()` 可以获取到全局唯一的文件系统管理器。详情可查看[api文档](https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.html)
```javascript
    const fs = wx.getFileSystemManager();
```
在微信小程序中文件分为两大类
1.代码包文件： 在项目目录中添加的文件，如图片,js,json等
2.本地文件：通过调用接口本地产生，或通过网络下载下来，存储到本地的文件。如调用`wx.downloadFile()`,`wx.chooseImage()`等

在这节内容主要介绍本地文件，本地文件分为三种：本地临时文件，本地缓存文件和本地用户文件。本地文件是从用户和小程序两个纬度进行隔离。
1. 本地临时文件：临时产生，随时会被回收的文件,不限制存储大小。本地临时文件只保证在小程序当前生命周期内可用，一旦小程序被关闭就可能被清理，即下次冷启动不保证可用。*不可把本地临时文件路径存储起来下次使用*。在小程序中能够产生临时文件的接口有很多，如`wx.chooseImage`,`wx.chooseVideo`以及`wx.compressImage`等。
2. 本地缓存文件：通过接口将临时文件缓存后产生的文件。调用` FileSystemManager.saveFile()`将临时文件转成缓存文件，缓存文件在重启之后仍可用。
3. 本地用户文件：本地用户文件是从 1.7.0 版本开始新增的概念。我们提供了一个用户文件目录给开发者，开发者对这个目录有完全自由的读写权限。通过 wx.env.USER_DATA_PATH 可以获取到这个目录的路径。
> 本地缓存文件和本地用户文件的清理时机跟代码包一样，只有在代码包被清理的时会被清理，数据缓存也会在代码包被清理的时候被清理，所以不用的缓冲请及时清理。问题：代码包什么时候被清理呢？

### 授权
某些接口需要用户授权才能调用，只有接受授权才能调用。调用需要授权的接口存在如下的情况：
* 如果用户未接受或拒绝过此权限，会弹窗询问用户，用户点击同意后方可调用接口；
* 如果用户已授权，可以直接调用接口；
* 如果用户已拒绝授权，则不会出现弹窗，而是直接进入接口 fail 回调。
#### 授权有效期
一旦用户明确同意或拒绝过授权，其授权关系会记录在后台，直到用户主动删除小程序。
#### 提前发起授权请求
开发者可以使用 `wx.authorize` 在调用需授权 API 之前，提前向用户发起授权请求。不推荐这样做，推荐的做法是在真正需要使用授权接口时，才向用户发起授权申请，并在授权申请中说明清楚要使用该功能的理由。
> 授权 `scope.userLocation` 时必须配置地理位置用途说明。在app.json 的permission字段中配置
#### 需要授权的scope列表

|scope|接口|描述|
|:----|----|----:|
|scope.userInfo|wx.getUserInfo|用户信息|
|scope.userLocation|wx.getLocation, wx.chooseLocation|地理位置|
|scope.address|wx.chooseAddress|通讯地址|
|scope.invoiceTitle|wx.chooseInvoiceTitle|发票抬头|
|scope.invoice|wx.chooseInvoice|获取发票|
|scope.werun|wx.getWeRunData|微信运动步数|
|scope.record|wx.startRecord|录音功能|
|scope.writePhotosAlbum|wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum|保存到相册|
|scope.camera|camera 组件|摄像头|
使用`wx.authorize`想用户发起授权
```javascript
    wx.authorize('scope.address')
```
> wx.authorize({scope: "scope.userInfo"})，不会弹出授权窗口，请使用 `<button open-type="getUserInfo"/>`

#### 获取用户授权信息
使用 wx.getSetting 获取用户当前的授权状态。如下：
```javascript
    wx.getSetting({
        success(res){
            // 如果已接受获取用户信息授权
            if (res.authSetting['scope.userInfo']) {
                // toSomething
            }
        }
    })
```

#### 打开权限设置界面

```html
    <button open-type="openSetting" bindopensetting="callback">打开设置页</button>
    或者
    
    <!--基础库在2.2.4及以上支持-->
    <button bindtap="openSetting">打开设置页</button>  openSetting() {  wx.openSetting()}
```
 > 在基础库 2.3.0以下版本可以直接调用`wx.openSetting`接口打开授权界面
 
 ### 低版本兼容
 在小程序中会存在旧版本的基础库不支持新功能的情况，了解自己小程序最低要兼容的基础库版本是很有必要的。在小程序管理后台可设置小程序最低基础库版本，并且在开发者工具中也能设置调试基本库的版本。在用户访问小程序时，如果用户基础库版本低于设置值，则无法正常打开小程序，并提示用户更新客户端版本。
 
#### 兼容方案
1.版本号比较
在开发文档中会在组件，API等页面描述中带上各个功能所要求的最低基础库版本号，通过`wx.getSystemInfo`可以获取到当前小程序运行的基础库的版本号。
> 版本号比较适用于所有情况

```javascript
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}


const version = wx.getSystemInfoSync().SDKVersion

if (compareVersion(version, '1.1.0') >= 0) {
  wx.openBluetoothAdapter()
} else {
  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
}
```

2. API 存在判断
对于新增的 API，可以通过判断该API是否存在来判断是否支持用户使用的基础库版本。
```javascript
if (wx.openBluetoothAdapter) {
  wx.openBluetoothAdapter()
} else {
  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
  wx.showModal({
    title: '提示',
    content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
  })
}
```

3. wx.canIUse
`wx.canIUse`返回布尔值，如果能够使用就返回true，不能使用false。[wx.canIUse的具体用法](https://developers.weixin.qq.com/miniprogram/dev/api/base/wx.canIUse.html)
wx.canIUse 使用 ${API}.${method}.${param}.${option} 或者 ${component}.${attribute}.${option} 方式来调用。

```javascript
    // 能否使用cover-image组件
    wx.canIUse("cover-image")
    // cover-image组件是否支持bindload属性
    wx.canIUse("cover-image.bindload")
    // wx.showToast的参数是否支持image属性
    wx.canIUse('showToast.object.image')
    
```

