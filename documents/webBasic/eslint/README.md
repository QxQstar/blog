# eslint

## vue 项目

### 安装

在 vue 项目中使用 @vue/cli-plugin-eslint 限制代码格式

```
 vue add @vue/cli-plugin-eslint
```

### 规则

使用 `plugin:vue/essential` ,`eslint:recommended`, `vue/attributes-order` 和 `vue/order-in-components` 来校验代码,[查看详情](https://eslint.vuejs.org/rules/)

### 配置

在项目根目录中新建 .eslintrc.js

```js
module.exports = {
    root: true,
    env: {
         browser: true,
         node: true,
         es6: true,
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
     },
    extends: [
        'plugin:vue/essential','eslint:recommended'
    ],
    rules:{
        "vue/attributes-order": ["error", {
            "order": [
              "DEFINITION",
              "LIST_RENDERING",
              "CONDITIONALS",
              "RENDER_MODIFIERS",
              "GLOBAL",
              "UNIQUE",
              "TWO_WAY_BINDING",
              "OTHER_DIRECTIVES",
              "OTHER_ATTR",
              "EVENTS",
              "CONTENT"
            ]
          }],
        "vue/order-in-components": ["error", {
            "order": [
              "el",
              "name",
              "parent",
              "functional",
              ["delimiters", "comments"],
              ["components", "directives", "filters"],
              "extends",
              "mixins",
              "inheritAttrs",
              "model",
              ["props", "propsData"],
              "fetch",
              "asyncData",
              "data",
              "computed",
              "watch",
              "LIFECYCLE_HOOKS",
              "methods",
              "head",
              ["template", "render"],
              "renderError"
            ]
          }]
    }
}
```

## 非 vue 项目

### 安装

```cli
npm i eslint@4.x babel-eslint@8 --save-dev
```

### 规则

使用`eslint:recommended`限制代码。[查看详情](https://eslint.org/docs/rules/)

### 配置

在项目根目录新建 .eslintrc.js 

```js
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-prototype-builtins":["off"],
        "no-useless-catch":["off"]
    }
};
```

> 在 vue 项目中 plugin:vue/strongly-recommended 和 eslint:recommended 可以一起使用


## Git Hooks

代码没有通过 eslint 的检查，拒绝提交代码

### 安装

```cli
npm i husky lint-staged --save-dev
```

### 配置

```
// package.json 
{
    ...
    
    "husky": {
        "hooks": {
            "pre-commit": "lint-staged"
        }
    },
    "lint-staged": {
        "src/**/*.{js,vue}": [
            "eslint --fix",
            "git add"
        ]
    }
}
```

如上配置，每次会在你本地 commit 之前，校验你提交的内容是否符合你本地配置的 eslint 规则，如果符合规则，则会提交成功。如果不符合它会自动执行 eslint --fix 尝试帮你自动修复，如果修复成功则会帮你把修复好的代码提交，如果失败，则会提示你错误，让你修好这个错误之后才能允许你提交代码

## 版本要求

 Node.js (^8.10.0, ^10.13.0, or >=11.10.1) built with SSL support. (If you are using an official Node.js distribution, SSL is always built in.)
 
## eslint 忽略

在项目根目录中创建 .eslintignore 文件，在这个文件中写想要 eslint 忽略的文件夹

```
build/*.js
src/assets
public
dist
```
