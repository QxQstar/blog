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


