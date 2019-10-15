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

配置babel.config.js
```javascript
module.exports = {
  presets: [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```
#### 在支持scss的项目
在系统中创建一个scss文件，如element-variables.scss，文件内容如下：

```scss
$--color-primary: red;
// icon路径
$--font-path: "~element-ui/lib/theme-chalk/fonts";
//  基础样式
@import "~element-ui/packages/theme-chalk/src/base.scss";
// 组件样式
@import "~element-ui/packages/theme-chalk/src/button.scss";
```

在项目主文件中引入element-variables.scss

```javascript
import './element-variables.scss'
```

还要在主文件中按需引入组件，在这儿不加以描述

#### 在不支持scss的项目中

在不支持scss的项目中按需引入自定义element-ui的样式，需要将scss文件编译成css文件，可以gulp编译
```javascript
// gulpfile.js

'use strict';

const { series, src, dest } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');

function compile() {
    return src('./src/element-ui-scss/src/index.scss')
        .pipe(sass.sync())
        .pipe(autoprefixer({
            browsers: ['ie > 9', 'last 2 versions'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(dest('./src/assets/element-theme'));
}

function copyfont() {
    return src('./src/element-ui-scss/src/fonts/**')
        .pipe(cssmin())
        .pipe(dest('./src/assets/element-theme/fonts'));
}

exports.build = series(compile, copyfont);
```

> 将element-ui的样式源码文件拷贝到src/element-ui-scss中，将src/element-ui-scss/src/index.scss文件修改为只引入需要的组件的样式。

在命令行中执行
```
gulp build
```

在入口文件中引入生成的样式文件
```cli
import './assets/element-theme/index.css'
```





