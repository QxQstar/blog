# git commit message 规范

## 格式

每个 commit message 包含一个 header, 一个 body 和一个 footer。header由 type，scope，subject 组成。header中的 type 和 subject 是必填的，scope 选填。body 和 footer 选填。

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type

* feat: 新功能
* fix: 在提测或者上线之后修复的bug
* docs: 仅仅修改了文档.如：README,CHANGELOG等
* style: 修改代码风格.如：修改了缩进，空格，逗号；增加，修改，删除了注释；删除多余的文件；删除console.log等
* refactor: 代码重构，没有新增功能也没有修复bug
* pref: 性能优化
* test: 修改测试用例。如单元测试，集成测试等
* revert: 回滚到某个版本
* chore: 改变构建流程，增加了依赖库或修改了配置文件等

### Scope

在 scope 中指定本次变更修改的文件

### 格式要求

```
# header：52个字符以内，描述主要变更内容
#
# body：更详细的说明文本，建议72个字符以内。 需要描述的信息包括:
#
# * 为什么这个变更是必须的? 它可能是用来修复一个bug，增加一个feature，提升性能、可靠性、稳定性等等
# * 他如何解决这个问题? 具体描述解决问题的步骤
# * 是否存在副作用、风险? 
#
# footer：如果需要的化可以添加一个链接到issue地址，或者关闭某个issue。
```

例子：

```
feat(app.css): 去掉所有a标签的下划线

由于UI改版，所有去掉系统中所有a标签的下划线
```
## 工具

使用 [commitlint](https://github.com/conventional-changelog/commitlint) 和 [husky]() 验证并限制 commit message。不符合规定格式的日志拒绝提交

### 安装

```cli
 npm i husky @commitlint/{config-conventional,cli} --save-dev
```

### 配置

```
// package.json
{
  ...
  "husky": {
      "hooks": {
        "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
      }  
    }
}
```

在项目根目录创建 commitlint.config.js，内容如下：

```js
module.exports = {
    rules: {
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 52],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [
            2,
            'never',
            ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test'
            ]
        ]
    }
};
```

### 版本要求

Node >= 8.6.0 and Git >= 2.13.0

