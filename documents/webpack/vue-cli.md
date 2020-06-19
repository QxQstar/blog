# 给 Vue 项目配置 webpack

## 公共配置

无论是本地开发还是生产环境的 webpack 配置，有一些功能的配置，例如：配置 babel、 css 预处理器、vue-loader、postcss、url-loader、环境变量的配置、output、entry 等

## 地址开发配置

在本地开发需要配置 devServer、热重载、sourceMap。热重载和 sourceMap 不是必须的

## 生产环境的配置

在生产环境最好将 css、第三方库、webpack 相关的部分相关的部分打包成独立的文件，为了让浏览器缓存静态文件将 output.filename 设置成 chunkhash，将 css 文件名设置成 contenthash，但是这些都不是必须的。

## vue-loader

vue-loader 用于处理 .vue 文件。默认情况，vue-loader 会处理 .vue 文件中 `template`、`style`和`script` 代码块。除此之外，你还可以自定义代码块，这需要你在 vue-loader 的 options 中的 loader 对象中指定对应的loader。利用这个功能，你可以在 .vue 文件中写组件文档，最后在打包的时候将组件的文档提取到一个统一的文件中

## eslint

eslint 的默认解析器是 Espree，由于在项目中使用 babel 转译 js 代码，所以需要将解析器改为`babel-eslint`

```
{
  "parser": "babel-eslint",
}
```

为了在编码的过程中能够让 eslint 实现检查代码，我们还需要在 webpack 中配置 `eslint-loader`

```
{
    test: /\.(js|jsx|vue)$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
    // 保证先通过 eslint-loader 检查代码，再使用其他的 loaders 处理源代码
    enforce: 'pre',
    options: {
      fix: true,
    },
}
```

## vue 服务端渲染

做 Vue 的服务端渲染需要两份 webpack 配置，一份是客户端渲染的 webpack 配置，另一份是服务端渲染的 webpack 配置。这两份 webpack 的配置有共同的地方，可以将共同的地方划分到一个单独的文件，然后在目标配置中通过 webpack-merge 合并

在客户端渲染的 webpack 配置需要使用 vue-server-renderer/client-plugin 生成客户端渲染清单。在服务端渲染的 webpack 配置中需要使用 vue-server-renderer/server-plugin 生成服务端的资源清单。通过服务端资源清单、客户端渲染清单和 html 模板就可以生成最终的 HTML 文档。

服务端渲染的每一个页面都需要重新创建 vue、路由、store 实例

### QA

问：为什么服务端渲染需要客户端渲染清单

答：服务端渲染只是生成 HTML，不会包含 JS 代码，如果只是将 HTML 发送到浏览器，它不能响应用户的操作。所以需要客户端渲染生成的 JS 代码，来响应用户操作

问：为什么服务端渲染的每一个页面都需要重新创建 vue、路由、store 实例

答：在客户端渲染中，每一个用户都会在各自的浏览器中创建新的应用程序实例。在服务端渲染中所有的应用程序实例都是在服务端创建，如果所有的用户都共用同一个应用程序实例可能会存在交叉请求造成的状态污染。
