# webpack-chain

> webpack-chain能够被用于任何项目。它需要node版本>=v6.9。在项目根目录的webpack.config.js中使用webpack-chain语法写webpack配置

## 简单的例子
```javascript
const Config = require('webpack-chain')
const config = new Config();

config
    .entry('index')
        .add('src/index.js')
        .end()
    .output
        .path('dist')
        .filename('[name].bundle.js');

config.module
    .rule('compile')
        .test(/\.js$/)
        .include
          .add('src')
          .add('test')
          .end()
        .use('babel')
          .loader('babel-loader')
          .options({
            presets: [
              ['@babel/preset-env', { modules: false }]
            ]
          });

config
  .plugin('clean')
    .use(CleanPlugin, [['dist'], { root: '/dir' }]);

module.exports = config.toConfig()
```

## 组合多个配置文件
```javascript
// webpack.core.js
const Config = require('webpack-chain');
const config = new Config();

// Make configuration shared across targets
// ...

module.exports = config;

// webpack.dev.js
const config = require('./webpack.core');

// Dev-specific configuration
// ...
module.exports = config.toConfig();

// webpack.prod.js
const config = require('./webpack.core');

// Production-specific configuration
// ...
module.exports = config.toConfig();
```

> 上面的例子中将webpack.core.js中的配置组合到webpack.dev.js和webpack.prod.js中

