# element-ui

## 自定义element-ui的主题

### 全部引入组件和组件样式
> 全部引入组件不加以描述
#### 项目支持scss

在系统中创建一个scss文件，如element-variables.scss，文件内容如下：
```scss

/* 改变主题色变量 */
$--color-primary: teal;

/* 改变 icon 字体路径变量，必需 */
$--font-path: '~element-ui/lib/theme-chalk/fonts';

@import "~element-ui/packages/theme-chalk/src/index";

```

在项目入口文件中引入element-variables.scss。（不需要引入element-ui编译好的css文件）

```javascript
import './element-variables.scss'
```

#### 项目不支持scss

安装element-theme，element-theme-chalk

```cli

npm i element-theme element-theme-chalk -D
```

在命令行中执行如下命令，生成element-ui变量文件

```cli
et -i ./src/element-variables.scss
```

生成变量文件之后将文件中的变量修改成自己想要的主题颜色。

在命名行中执行如下命令将./src/element-variables.scss中的主题编译成css文件
```cli
    et -c ./src/element-variables.scss -o ./src/assets/theme
```

执行完上述命令之后将在src/assets/theme中生成css文件

在项目入口文件中引入生成的css文件
```javascript
import './assets/theme/index.css'
```

### 按需引入组件和组件样式
> 假如只引入Button


#### 生成主题文件
安装element-theme，element-theme-chalk
```cli
npm i element-theme element-theme-chalk -D
```
在命令行中执行如下命令，生成element-ui变量文件。

```cli
et -i ./src/element-variables.scss
```

生成变量文件之后将文件中的变量修改成自己想要的主题颜色。

生成主题文件，并且将文件保存到src/assets/theme
```cli
    et -c ./src/element-variables.scss -o ./src/assets/theme
```

#### 配置babel.config.js
```javascript
module.exports = {
  presets: [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "~src/assets/theme"
      }
    ]
  ]
}
```

styleLibraryName的值要以～开头，并且～后面的值是主题文件相对babel.config.js的路径。

> 使用babel-plugin-component按需引入组件的同时也会引入组件的样式，所有不需要自己在项目中引入组件的样式。生成的这个变量文件(即：element-variables.scss)在项目中不需要使用，它只是用于生成主题css样式文件

## element-theme

element-theme是一个Element主题生成工具，他使用gulp将sass转成css文件，默认将element-theme-chalk中的sass文件转成css文件，支持自定义主题，甚至可以指定saas文件所在的库。

在package.json中配置element-theme字段自定义主题

```json
{
  "element-theme": {
    "browsers": ["ie > 9", "last 2 versions"],
    "out": "./theme",
    "config": "./element-variables.css",
    "theme": "element-theme-chalk",
    "minimize": false,
    "components": ["button", "input"]
  }
}
```

除了可以通过配置package.json的方式自定义主题，还可以在命令行传参数的方式自定义主题

