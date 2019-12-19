# stylelint

## 在webpack中使用

### 安装

```cli
npm i stylelint-webpack-plugin stylelint --save-dev
```

### stylelint 配置

在项目根目录新建 .stylelintrc.js

```js
module.exports = {
    "rules":{
        "color-no-invalid-hex": true,
        "block-closing-brace-newline-after":"always",
        "block-closing-brace-newline-before":"always",
        "block-no-empty":true,
        "block-opening-brace-newline-after":"always",
        "block-opening-brace-space-after":"always",
        "block-opening-brace-space-before":"always",
        "comment-no-empty":true,
        "declaration-block-no-duplicate-properties":true,
        "declaration-block-semicolon-newline-after":"always",
        "declaration-block-single-line-max-declarations":1,
        "declaration-block-trailing-semicolon":"always",
        "font-family-no-duplicate-names":true,
        "selector-type-no-unknown":true
    }
}
```

### webpack 配置

```js
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
module.exports = {
    ...
    new StylelintWebpackPlugin({
         context: 'src',
         configFile: path.resolve(__dirname,'./.stylelintrc.js'),
         files: 'style/*.css',
         fix: true
       })
   
}
```

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
       "src/**/*.css": [
             "stylelint --fix",
             "git add"
           ]
    }
}
```

如上配置，每次会在你本地 commit 之前，校验你提交的内容是否符合你本地配置的 stylelint 规则，如果符合规则，则会提交成功。如果不符合它会自动执行 stylelint --fix 尝试帮你自动修复，如果修复成功则会帮你把修复好的代码提交，如果失败，则会提示你错误，让你修好这个错误之后才能允许你提交代码

