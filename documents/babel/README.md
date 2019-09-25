# babel
Babel 是一个编译器（输入源码 => 输出编译后的代码）。编译过程分为三个阶段：解析、转换和打印输出.
## @babel/core

你可以使用各种插件组合来转换自己的代码，但是@babel/core必须安装

## @babel/cli

安装@babel/cli 就能够在命令行使用babel

```
./node_modules/.bin/babel src --out-dir lib

// 或者

npx babel src --out-dir lib
```

> 不使用任何插件和preset,babel会将代码原样输出到目标文件中，在babel.config.js中定义babel的配置

## 配置babel

在项目的根目录下创建一个babel.config.js，内容如下：
```
module.exports = function(app) {
    
    return {
        presets:[...],
        plugins:[...]
    }
  
}
```

## 插件
有两种类型的插件，语法插件和转换插件。
### 转换插件
用于转换代码，转换插件会启用相应的语法插件，因此你不必同时指定这两种插件。
### 解析插件
用于解析相应类型的语法，不会转换
### 插件的顺序
如果两个插件都将处理程序中某个代码片段，则根据插件的排列顺序依次处理。插件在 Presets 前运行。
```
{
    "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}
```
> 先执行transform-decorators-legacy再执行transform-class-properties

### 插件参数
```
{
    "plugins": [
        "transform-decorators-legacy", 
        ["transform-async-to-module-method",
          {
            "module": "bluebird",
            "method": "coroutine"
          }
        ]
    ]
}
```

> transform-decorators-legacy没有指定参数，transform-async-to-module-method指定了参数

## Preset
### Preset的顺序
Preset的顺序与plugin的顺序相反
```
{ 
    "presets": [
        "a",
        "b",
        "c"
    ]
  }
```
>  执行顺序: c,b,a
### Preset的参数
```
{
  "presets": [
    ["@babel/preset-env", {
      "loose": true,
      "modules": false
    }],
    'presetB'
  ]
}
```





