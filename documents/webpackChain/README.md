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

## 实例类型
在webpack-chain 中有两种类型的实例，分别是 ChainedMap 和 ChainedSet。
### ChainedMap
ChainedMap与js中的Map类似，ChainedMap有如下的方式，除了特殊说明，这些方法返回ChainedMap，所以你可以链式调用：
```javascript
// 清空chainedMap
 clear()
```

```javascript
// 从chainedMap中移除key对应的那项
delete(key)
```

```javascript
// 从chainedMap中获取key对应的那项
get(key)
```

```javascript
// 将value设置到chainedMap的key上
set(key, value)
```

```javascript
// 在chainedMap中是否有key
has(key)
```

```javascript
// 如果在chainedMap有key，就返回key对应的value，如果没有key，就将fn的返回值设置给key，并返回value
getOrCompute(key, fn)
```

```javascript
// 将chainedMap中的所有value，整合成数组返回
values()
```

```javascript
// 如果chainedMap是空的，就返回undefined。否则将chainedMap中所有的key-value整合成对象返回
entries()
```

```javascript
// condition是true，执行whenTruthy函数，否则执行whenFalsy函数，将一个chainedMap实例的参数传递给whenTruthy和whenFalsy
when(condition, whenTruthy, whenFalsy)
```

```javascript
// 将obj合并到chainedMap中，你还可以在omit中列出不需要合并的key，omit是数组
merge(obj, omit)
```

```javascript
// 将一个chainedMap实例的参数传递给handler
batch(handler)
```

### ChainedSet
ChainedSet与js的Set类似，ChainedSet有如下的方法，除了特殊说明，这些方法返回ChainedSet，所以你可以链式调用

```javascript
// 将value加到ChainedSet中
add(value)
```

```javascript
// 将value加到ChainedSet的前面
prepend(value)
```

```javascript
// 清空ChainedSet
clear()
```

```javascript
// 从ChainedSet中删除value
delete(value)
```

```javascript
// 判断在ChainedSet是否存在value，如果存在，就返回true，否则返回false
has(value)
```

```javascript
// 以数组的形式返回ChainedSet中的value
values()
```

```javascript
// 将arr中的value合并到ChainedSet
merge(arr)
```

```javascript
// 如果condition为true，执行whenTruthy，否则执行whenFalsy，将一个ChainedSet实例的参数传递给whenTruthy和whenFalsy
when(condition, whenTruthy, whenFalsy)
```

```javascript
// 将一个ChainedSet实例的参数传递给handler
batch(handler)
```