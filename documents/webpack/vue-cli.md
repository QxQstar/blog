# 给 Vue 项目配置 webpack

## 公共配置

无论是本地开发还是生产环境的 webpack 配置，有一些功能的配置，例如：配置 babel、 css 预处理器、vue-loader、postcss、url-loader、环境变量的配置、output、entry 等

## 地址开发配置

在本地开发需要配置 devServer、热重载、sourceMap。热重载和 sourceMap 不是必须的

## 生产环境的配置

在生产环境最好将 css、第三方库、webpack 相关的部分相关的部分打包成独立的文件，为了让浏览器缓存静态文件将 output.filename 设置成 chunkhash，将 css 文件名设置成 contenthash，但是这些都不是必须的。

