# git 分支管理规范

## 分支名

### 线上bug修复

`fix-feature/xxx`，xxx 表示要修复的功能

### 需求分支

`feat-feature/xxx`,xxx 表示要开发的功能。如果本次需求由多人协同开发，就在大分支名后面加后缀。如：feat-feature/goodsManger-bella

### 性能优化分支

`pref-feature/xxx` ,xxx 表示要优化的功能

### 重构分支

`refactor-feature/xxx` ,xxx 表示要重构的功能

## 工作流程

### 修复线上bug

从线上环境对应的分支 checkout 一个 fix 分支用于修复 bug，bug 修复完成之后如果这个 bug 需要立即上线，就以这个 fix 分支提测，测试通过之后，将 fix 分支合入线上环境的分支,删除 fix 分支；如果这个bug要等到下一次和功能需求一起上线，就将这个 fix 分支合入功能分支上与功能需求一起上线

```html
切换到master分支
git checkout master

基于master 建一个fix分支
git checkout -b fix-feature/home

提测
以fix-feature/home分支的代码提测

测试通过之后
git checkout master
git merge fix-feature/home

上线

删除分支
git branch -d fix-feature/home
```

### 需求开发：

从线上环境对应的分支 checkout 一个 feat 分支，如果本次需求由多人协同开发，就基于大的 feat 分支 checkout 个人 feat 分支,开发完成之后每个人将自己的分支合入 feat 分支，以 feat 分支提测，测试通过上线将 feat 分支合入线上分支，删除 feat 分支。

```
切换到master分支
git checkout master

基于master分支建feat分支
git checkout -b feat-feature/goods

如果涉及多人开发，每个人创建自己的开发分支
git checkout -b feat-feature/goods-bella

多人开发完成，将自己的代码合并到这次共同的开发分支上
git checkout feat-feature/goods
git merge feat-feature/goods-bella

提测
以 feat-feature/goods-bella 分支的代码提测

上线
git checkout master
git merge feat-feature/goods

删除分支
git branch -d feat-feature/goods
```
