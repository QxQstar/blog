# eslint

## vue 项目

### 安装

在 vue 项目中使用 @vue/cli-plugin-eslint 限制代码格式

```
 vue add @vue/cli-plugin-eslint
```

### 规则

使用 `plugin:vue/strongly-recommended` , `vue/attributes-order` 和 `vue/order-in-components` 来校验代码,[查看详情](https://eslint.vuejs.org/rules/)

### 配置

在项目根目录中新建 .eslintrc.js

```
module.exports = {
    extends: [
        'plugin:vue/strongly-recommended'
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

如上配置，每次会在你本地 commit 之前，校验你提交的内容是否符合你本地配置的 eslint规则，如果符合规则，则会提交成功。如果不符合它会自动执行 eslint --fix 尝试帮你自动修复，如果修复成功则会帮你把修复好的代码提交，如果失败，则会提示你错误，让你修好这个错误之后才能允许你提交代码
