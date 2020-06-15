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
