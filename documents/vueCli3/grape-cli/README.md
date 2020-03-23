# grape-cli

## 目录结构
```
./
├── .editorconfig
├── .env.development
├── .env.production
├── .env.uat
├── .gitignore
├── .vcmrc
├── README.md
├── babel.config.js
├── deploy
├── fis-conf.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── APP.vue
│   ├── api
│   │   ├── home
│   │   │   └── api.js
│   │   └── index.js
│   ├── components
│   │   ├── common
│   │   │   └── index.js
│   │   ├── element-ui
│   │   │   └── index.js
│   │   └── previewImg
│   │       └── main.vue
│   ├── config
│   ├── directive
│   │   ├── clipboard
│   │   │   └── index.js
│   │   └── common
│   │       └── index.js
│   ├── filters
│   │   ├── common
│   │   │   └── index.js
│   │   └── timeAgo
│   │       └── index.js
│   ├── lib
│   │   ├── cookie.js
│   │   ├── fetch.js
│   │   ├── index.js
│   │   ├── localStorge.js
│   │   ├── open-window.js
│   │   ├── sessionStorge.js
│   │   ├── stringFormat.js
│   │   └── timeFormat.js
│   ├── main.js
│   ├── mixins
│   │   └── common
│   │       └── index.js
│   ├── router
│   │   ├── home
│   │   │   └── index.js
│   │   └── index.js
│   ├── store
│   │   ├── base
│   │   │   ├── actions.js
│   │   │   ├── getters.js
│   │   │   ├── mutations.js
│   │   │   └── state.js
│   │   └── index.js
│   └── views
│       └── home
├── static
└── vue.config.js
```
### 目录说明

* README.md

项目说明文档

* babel.config.js

babel 的配置文件

* deploy

部署相关的文件

* fis-conf.js

fis3 配置文件，用于手动将打包好的文件推送到服务器。

* postcss.config.js

postcss 配置文件

* public

html 文件

* src/APP.vue

项目根组件

* src/api

与服务端进行交互。每个模块的接口定义以模块名为文件夹放在 api.js 中。 src/api/index.js 会遍历 src/api/ 下所有模块中的 api.js,并将所有的接口定义导出。

```
./
├── api
│   │---├── home
│   │   │   └── api.js
│   │   └── index.js
```

* src/components

所有的组件

src/components/element-ui/index.js 异步导入所有的 element-ui 中的组件，这样可以在用到 element-ui 组件的时候才下载代码。


src/components/common 全局组件。src/components/common/index.js 会遍历 src/components/common 中所有的组件目录从而得到组件的定义然后注册为全局组件。

```
./
src
├── components
│   │   ├── common
│   │   │   └── index.js
│   │   ├── element-ui
│   │   │   └── index.js
│   │   └── previewImg  // 业务组件
│   │       └── main.vue
```

> 每一个组件都定义在一个以组件名命名的文件夹中，并且文件名为 main.vue

* src/directive

所有的指令

src/directive/common 全局指令。src/directive/common/index.js 会遍历 src/directive/common 中所有的指令目录从而得到指令的定义然后组册为全局指令。

```
./
src
 ├── directive
        ├── clipboard
        │   └── index.js
        └── common
           └── index.js
```
> 每一个指令都定义在一个以指令名命名的文件夹中，并且文件名为 index.js

* src/filters

所有的过滤器

src/filters/common 全局指令。src/filters/common/index.js 会遍历 src/filters/common 中所有的过滤器目录从而得到过滤器的定义然后注册为全局过滤器。

```
./
src
├── filters
│   │   ├── common
│   │   │   └── index.js
│   │   └── timeAgo
│   │       └── index.js
```
> 每一个过滤器都定义在一个以过滤器名命名的文件夹中，并且文件名为 index.js

* src/lib

工具方法

```
./
src
├── lib
│   │   ├── cookie.js
│   │   ├── fetch.js
│   │   ├── index.js
│   │   ├── localStorge.js
│   │   ├── open-window.js
│   │   ├── sessionStorge.js
│   │   ├── stringFormat.js
│   │   └── timeFormat.js
```

## 作用

1. 项目初始化配置

eslint,commit-msg 校验，fis3 配置，package.json 配置

2. 规定项目的目录结构

3. 内置工具方法

4. 内置组件


