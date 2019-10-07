# webpack

## 安装
```
npm install webpack --save-dev
```

如果你使用的是webpack4.x，你还需要安装webpack-cli
```
npm install webpack-cli --save-dev
```

## 配置文件
webpack的默认配置文件是webpack.config.js，如果你想指定一个其他名称的配置文件，可以使用--config 参数.
```
"scripts":{
    "dev":"webpack --config webpack.dev.config.js"
}
```
webpack的配置文件可以导出一个对象，也能导出一个函数

导出对象
```javascript
module.exports = {
    // do something
}
```

导出函数
```javascript
module.exports = function(env,argv) {
    const config = {
        // do something
    }
  return config
}
```
## mode
在配置文件中指定mode，webpack 会根据你指定的mode使用内置的优化方案，mode的可选值：none，development，production(默认)

```javascript
module.exports = {
    mode:'development'
}
```

或者在cli中将mode以参数传递给webpack

```
webpack --mode=production
```

|mode值|描述|
|-----|-----|
|development|将process.env.NODE_ENV的值设置为development，使用NamedChunksPlugin和NamedModulesPlugin|
|production|将process.env.NODE_ENV的值设置为production，使用FlagDependencyUsagePlugin，FlagIncludedChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin，OccurrenceOrderPlugin，SideEffectsFlagPlugin和TerserPlugin|
|none|不使用任何优化方案|

## entry
webpack 从entry指定的文件开始打包

### entry的参数
可以给entry传一个 string || [string] || object {<key>: string || [string]} || (function: () => string | [string] | object { <key>: string | [string] })

> 一个入口对应一个html页面，对于单页应用只需要一个入口，多页应用需要多个入口

```javascript
// 多个入口
module.exports = {
    entry:{
        home:'./home.js',
        app:'./app.js',
        about:'./about.js'
    }
}

// 一个入口
module.exports = {
    entry:'./home.js' || ['./home.js']
}
```

如果entry是string或者[string],webpack会将mian作为包名，如果entry是object {<key>: string || [string]}，webpack会将key当作包名

## output
output用于去设置webpack如何输出目标包，以及指定目标包的输出路径
### output.filename
指定每个输出文件的文件名

```javascript
// 指定固定的文件名
module.exports = {
    output:{
        filename:'bundle.js'
    }
}

// 使用entry中的name指定文件名
module.exports = {
    output:{
        filename:'[name].bundle.js'
    }
}

// 使用chunk id指定文件名
module.exports = {
    output:{
        filename:'[id].bundle.js'
    }
}

// 使用唯一的hash指定文件名
module.exports = {
    output:{
        filename:'[hash].bundle.js'
    }
}

// 使用基于文件内容的hash指定文件名
module.exports = {
    output:{
        filename:'[chunkhash].bundle.js'
    }
}

// 使用基于提取内容的hash指定文件名
module.exports = {
    output:{
        filename:'[contenthash].bundle.js'
    }
}

// 使用函数返回文件名
module.exports = {
    output:{
        filename:(chunkData) => {
            chunkData.chunk.name === 'main' ? '[name].js' : '[name]/[name].js'
        }
    }
}
```
> 虽然output.filename用于指定文件名，但是你依然可以使用`'js/[name]/bundle.js'`这样形式创建文件夹结构，这个参数不会影响按需加载的文件的文件名，也不会影响被loader创建的文件的文件名

> 当使用ExtractTextWebpackPlugin，使用[contenthash]获取提取内容的hash值

### output.path
指定输入文件的路径，必须是一个绝对路径
```javascript
module.exports = {
    output:{
        path:path.resolve(__dirname,'dist')
    }
}
```

### output.publicPath
当在浏览器中引用资源时，这个值用于指定输出文件目录的public URL,默认值是一个空字符串，它可以是一个相对HTML文件的url，也可能是Server-relative URLs, protocol-relative URLs or absolute URLs，当按需加载资源或者图片，文件时，这个值就很重要，不正确的publicPath会导致404。这个值是运行时创建或者通过loader创建的资源的前缀，所以通常output.publicPath以`/`结尾

```javascript
module.exports = {
    output:{
        publicPath: '/assets/',
        filename:'[name].js'
    }
}
```

这会以/assets/main.js的形式加载包
在html中加载资源
```html
<link href="/assets/spinner.gif" />
```

在css中加载图片

```css
background-image: url(/assets/spinner.gif)
```

webpack-dev-server 会以publicPath的值确定从哪个位置开启服务

### output.chunkFilename
这个值用于指定 non-entry 文件的文件名，能使用的占位符同output.filename,默认为[id].js或这从output.filename推导而来(使用[name]代替[id]或者用[id].作为前缀)

### output.crossOriginLoading
这个值用于告诉webpack能够cross-origin加载包，当target为web时才有效，并且这只会影响到通过添加script标签使用JSONP按需加载的包。可选值false,'anonymous','use-credentials'

* 'anonymous': Enable cross-origin loading without credentials
* 'use-credentials': Enable cross-origin loading with credentials

## devtool
控制怎么生成source map，这个值会影响构建速度，除了通过设置devtool来控制生成source map，还能使用SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin来控制，但是不用即设置devtool有使用插件
```javascript
module.exports = {
    devtool:''
}
```
## context
用于指定webpack的主目录，它是一个绝对路径，默认是当前路径，推荐给context指定一个值。entry和module.rules.loader相对这个路径resolve。
```javascript
module.exports = {
    context:__dirname
}
```

## target
webpack能够编译多种软件包, 默认为web。target可以是字符串也能是function (compiler)
```javascript
module.exports = {
    target:'web'
}
```

target的可选值

|可选值|描述|
|-----|----|
|async-node|编译为在类node.js文件运行的软件包。使用fs和vm异步加载文件|
|electron-main|编译为在 Electron 运行的主程序|
|electron-renderer|编译为在Electron运行的渲染程序，在浏览器环境中提供JsonpTemplatePlugin , FunctionModulePlugin，在CommonJS 和 Electron built-in modules中提供NodeTargetPlugin and ExternalsPlugin|
|electron-preload|编译为在Electron运行的渲染程序，在浏览器环境中提供NodeTemplatePlugin ，FunctionModulePlugin 和 asyncChunkLoading ，并把asyncChunkLoading设置为true，在CommonJS 和 Electron built-in modules中提供NodeTargetPlugin and ExternalsPlugin|
|node|编译为在类node.js文件运行的软件包。使用require加载文件|
|node-webkit|编译为在WebKit运行并且使用JSONP加载文件的软件包，并且可以import NodeJs的内置模块|
|web|编译为 i在浏览器运行的软件包(默认值)|
|webworker|编译为WebWorker|

如果上述target字符串都不满足你的要求，你可以将target设置为函数
```javascript
//  把应用任何插件
module.exports = {
    target:(compiler) => {
        return undefined
    }
}

module.exports = {
    target:(compiler) => {
        return compiler.apply(
              new webpack.JsonpTemplatePlugin(options.output),
              new webpack.LoaderTargetPlugin('web')
            );
    }
}
```
## webpack-dev-server
使用webpack-dev-server能够快速的在本地开启一个web服务器。

安装webpack-dev-server
```
npm install webpack-dev-server --save-dev
```

在命令行中执行如下命令，启动一个web服务
```
webpack-dev-server --config webpack.dev.config.js
```

> webpack-dev-server 默认使用的配置文件是webpack.dev.config.js，可以通过 --config指定配置文件

除了在命令行中直接输入webpack-dev-server启动服务，还可以在package.json中的scripts增加字段，然后使用scripts中字段启动服务

package.json
```
"scripts": {
  "start":"webpack-dev-server --config webpack.dev.config.js"
}
```

cli
```
npm run start
```

webpack配置文件中的devServer可以用于指定webpack-dev-server的行为

### devServer
#### devServer.compress
是否开启gzip 压缩
```javascript
module.exports = {
    // do something
    
    devServer:{
        compress:true
    }
}
```
或者

```
webpack-dev-server --compress
```