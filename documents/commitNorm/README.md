# git 版本管理规范

git 版本管理主要从以下几个方面来制定规范。
1. commit message 规范
2. tag 标签管理
3. 统一的changelog 文件信息
4. 分支管理
5. 禁止的操作
6. git的基本概览
7. git的某些操作
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
* chore: 改变构建流程，增加了依赖库或修改了配置文件等
### Scope
在scope中指定本次变更修改的文件
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

### 不符合规定格式的日志拒绝提交
使用 commitlint 和 husky 验证并限制 commit message.
### commit 类型选择提示
使用 commitizen 工具
## tag 标签管理 
tag标签管理分为三种情况，产品没有明确的版本概念，产品有明确的版本的概览，工具库或者UI组件库的开发。
### 工具库或UI组件库的开发
版本格式：主版本号.次版本号.修订号（X.Y.Z），版本号递增规则如下：

* 主版本号：当你做了不兼容的 API 修改，
* 次版本号：当你做了向下兼容的功能性新增，
* 修订号：当你做了向下兼容的问题修正。

版本控制规范
1. 标准的版本号必须采用X.Y.Z的格式，其中X.Y.Z为非负整数，禁止在数字前方补零，X 是主版本号、Y 是次版本号、而 Z 为修订号。
2. 标记版本号的工具库或者UI组件库发发行后，禁止修改该版本的内容，任何修改必须以新版本发行。
3. 主版本号为0时，表示此时处于初始开发阶段，一切都可能随时被改变，此时工具库或者UI组件库还不稳定。
4. 1.0.0的版本号用于界定稳定版形成。
5. 修订号Z必须在做了向下兼容的修改时才能递增，这里的修改指的是针对不正确结果而进行的内部修改。
6. 次版本号 Y 必须在有向下兼容的新功能出现时递增。也可以在内部程序有大量改进被加入时递增，其中可以包括修订级别的改变。每当次版本号递增时，修订号必须（MUST）归零。 
7. 主版本号 X必须在有任何不兼容的修改被加入时递增。其中可以包括次版本号及修订级别的改变。每当主版本号递增时，次版本号和修订号必须（MUST）归零。  
### 产品有明确的版本概念
版本格式与产品的版本一致，如果版本发布之后有修订版就在版本后面加上后缀，用中划线分隔，fix后面加上次数，即第几次fix。例如: v1.2.4   v1.2.4-fix1
### 产品没有明确的版本概念
在产品没有明确版本的概念时以本期大的功能修改作为版本号，如果涉及到多个功能模版的修改，模块之间以点(.)分割，最多不超过两个点(.)，如果版本发布之后有修订版就在版本后面加上后缀，用中划线分隔，fix后面加上次数，即第几次fix。例如：userDetail.home.depDetail userDetail.home.depDetail-fix1  

版本发布之前打tag，如果在本次打tag之后有修改则根据实际情况版本递增，打tag之后使用 `git push origin --tags` 推送所有本地新增的tag到远端。
## 统一的 changelog 文件信息
对于开发的工具库或者UI组件库，使用conventional-changelog-cli生成changelog日志文件，它会根据commits生成日志文件。
## 分支管理
### 分支名
* 线上bug修复：fix-feature/xxx，xxx表示要修复的功能
* 线上环境的分支：默认只有一个线上环境，所以线上环境的默认分支是master，如果存在多个线上环境，除master之外的线上环境分支为:master-xxx,xxx代表功能，例如: master-saas。
* 需求分支：如果本次需求有发布或者最终完成的时间（完成指开发且测试通过），分支名为feat-20191019，如果没有确定的时间，分支名为feat-feature/xxx。如果本次需求由多人协同开发，就在大分支名后面加后缀。如：feat-20190405-bella，feat-feature/goodsManger-bella
* 性能优化分支: 分支命名规则与需求分支的命名规则类似，只是将前缀feat改成pref
### 开发的工作流程
1. 修复线上bug：从线上环境对应的分支checkout一个fix分支用于修复bug，bug修复完成之后如果这个bug需要立即上线，就以这个fix分支提测，测试通过上线，将fix分支合入线上环境的分支,删除fix分支；如果这个bug要等到下一次和功能需求一起上线，就将这个fix分支合入功能分支上与功能需求一起上线
```html
切换到master分支
git checkout master

基于master 建一个fix分支
git checkout -b fix-feature/home

提测
以fix-feature/home分支的代码推送到测试环境

上线之后
git checkout master
git merge fix-feature/home

将所有的分支推送到远端仓库
git push --all

删除分支
git branch -d fix-feature/home
```
2. 需求开发：从线上环境对应的分支checkout一个feat分支，如果本次需求由多人协同开发，就基于大的feat分支checkout个人feat分支,开发完成之后每个人将自己的分支合如feat分支，以feat分支提测，测试通过上线将feat分支合入线上分支，删除feat分支。
```
切换到master分支
git checkout master

基于master分支建feat分支
git checkout -b feat-20190102

如果涉及多人开发，每个人创建自己的开发分支
git checkout -b feat-20190102-bella

多人开发完成，将自己的代码合并到这次共同的开发分支上
git checkout feat-20190102
git merge feat-20190102-bella

提测
以feat-20190102分支的代码推送到测试环境

上线之后
git checkout master
git merge feat-20190102

将所有的分支推送到远端仓库
git push --all

删除分支
git branch -d feat-20190102

```
## 工作流程
1. 基于线上分支创建功能分支
2. 功能开发
3. 根据功能提交 commit
4. 将多人协同开发的代码合并
5. 提测
6. 生成统一的changelog文件信息并且commit(可选)
7. 上线
8. 将变更合并到线上分支
9. 打标签
10. 删除功能分支
11. push

> 上述流程是前端和后端同时发布，如果是前后端分开分布，工作流程会变成1,2,3,4,5,8,6.9,11,7,10
## 禁止的操作
1. 禁止在团队公共分支上执行git push -f 操作
2. 禁止在团队公共分支执行git base变基操作，团队的公共分支的变更记录只能往前走，不能修改历史的变更记录
3. 禁止在团队公共分支执行git reset 操作进行代码回滚，如果需要回滚就使用git revert

## git的基本概念
### git中三大对象commit , tree 和 blob
每次执行git commit操作都会生成一个commit对象，每个commit对象中会包含一个tree对象。tree对象中保存了本次执行commit操作时本项目仓库中所有文件夹和文件的快照，在git中blob对象表示文件，如果两个文件如果文件内容一样，那么对应同一个blob。
### 分离头指针
执行 `git checkout <commit>` 命令会让git出于分离头指针的状态。在处于分离头指针的状态可以继续开发也可以继续产生commit而且不会影响其他分支。分离头指针的本质就是当前工作在没有分支的状态下，在这种状态下做的变更不与任何分支绑定，在分离头指针的状态下做了变更并产生了commit，然后又切换到其他分支，之前产生的变更很可能会被git当作垃圾清理掉
### 变基
提取某一个分支上的修改，将修改应用到另一分支上，这种操作变基。通过变基能够完成的操作有：合并代码和修改commit message 信息。
## git的操作
### 配置git
```
配置user.name : git config --global user.name 'your name'
配置user.email : git config --global user.email 'your email'
```
1. config 参数
* git config --local : 只对某个仓库有效
* git config --global : 对当前用户所有的仓库有效
* git config --system : 对系统所有的登录用户有效
2. 显示config的配置

 `git config --list`会将所有范围的config配置都显示出来。如果只想显示某一个范围的config配置，就要加范围参数(如：--local,--global,--system)
### 修改commit message 信息
1. 修改最新的commit
```
git commit --amend
```
2. 修改老的commit的message
```html
git rebase -i  <commit>
```

参数-i后的commit值是需要修改message信息的commit的父commit的哈希值。执行这个命名后根据命令行中的提示进行操作就可以达到修改commit message的目的，在交互界面使用r命令。

3. 将多个连续的commit合并成一个commit
```
git rebase -i  <commit>
```

git rebase -i < commit >。-i参数后的commit hash值是需要合并成一个commit的多个连续commit的最近的父commit的hash值。在交互界面使用s命令

4. 将间隔的多个commit合并成一个commit

```html
git rebase -i <commit>
```

在交互界面中使用s命令，并且将间隔的commit放在一起
> 在commit没有被推送到远端仓库之前可以修改commit message，禁止修改公共分支上的commit message。如果要修改第一次提交的commit message， 在提交列表中，可以手工将根commit添加进来。更简单的方式是使用 `git rebase -i --root` 命令，该命令允许你在分支上变基根提交.
### 回退版本
```
git revert <commit>…​
```

还原一个或者多个commit 的修改。
```
git revert commit2..commit5
```
恢复commit2(不包含)到commit5(包含)之间变更
### 打标签
```
git tag v1.0.0
```
1. 后期加tag
```
git tag -a v1.0.0 commitId
```
2. 将本地新增的标签推送到远端
```
git push --tags
```
