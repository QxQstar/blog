# git 版本管理规范

git 版本管理主要从以下几个方面来制定规范。
1. commit message 规范
2. 统一的changelog 文件信息
3. 分支管理
4. tag 

## commit message 规范
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
* chore: 改变构建流程，或者增加了依赖库等
### Scope
在scope中指定本次变更修改的文件
### 格式要求

```
# header：50个字符以内，描述主要变更内容
#
# body：更详细的说明文本，建议72个字符以内。 需要描述的信息包括:
#
# * 为什么这个变更是必须的? 它可能是用来修复一个bug，增加一个feature，提升性能、可靠性、稳定性等等
# * 他如何解决这个问题? 具体描述解决问题的步骤
# * 是否存在副作用、风险? 
#
# footer：如果需要的化可以添加一个链接到issue地址，或者关闭某个issue。
```

```
feat(app.css): 去掉所有a标签的下划线

由于UI改版，所有去掉系统中所有a标签的下划线
```

### 不符合规定格式的日志拒绝提交
使用 commitlint 和 husky 验证并限制 commit message.
### commit 类型选择提示
使用 commitizen 工具

## 禁止的操作
1. 禁止在团队公共分支上执行git push -f 操作
2. 禁止在团队公共分支执行git base变基操作，团队的公共分支的变更记录只能往前走，不能历史的变更记录
3. 禁止在团队公共分支执行git reset 操作回滚，使用git revert 进行代码回滚

## git的基本概念
1. git中三大对象commit , tree 和 blob
2. 分离头指针
3. 变基

## git的操作
1. 配置git
2. 修改commit message 信息
3. 回退版本
4. 打标签
