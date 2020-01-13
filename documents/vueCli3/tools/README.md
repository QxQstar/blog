# Vue Cli 3.x 中使用的工具及其作用与用法

1. gitHooks
2. lint-staged
3. eslint
4. jest
5. execa
6. globby
7. inquirer
8. lerna
9. lerna-changelog
10. memfs
11. minimist
12. request
13. request-promise-native
14. rimraf
15. semver
16. webpack
17. yorkie


## gitHooks

钩子(hooks)是一些在$GIT-DIR/hooks目录的脚本, 在被特定的事件(certain points)触发后被调用

### applypatch-msg

这个钩子是由git am命令调用的。它只有一个参数：就是存有将要被应用的补丁(patch)的提交消息(commit log message)的文件名。它的一个用途是把提交(commit)信息规范化，使得其符合一些项目的标准（如果有的话）。它也可以用来在分析(inspect)完消息文件后拒绝某个提交(commit)。

### pre-applypatch

这个钩子是由git am命令调用的。它不需要参数，并且是在一个补丁(patch)被应用后还未提交(commit)前被调用。如果钩子的返回值不是`0``，那么刚才应用的补丁(patch)就不会被提交。

它可以用于检查当前的工作树（译注：此时补丁已经被应用但没有被提交），如果补丁不能通过测试就拒绝此次提交(commit)。

### post-applypatch

这个钩子是由git am命令调用的。它不需要参数，并且是在一个补丁(patch)被应用且在完成提交(commit)情况下被调用。

这个钩子主要用来通知(notification)，它并不会影响git-am的执行结果。

### pre-commit

这个钩子被 git commit 命令调用, 而且可以通过在命令中添加\--no-verify 参数来跳过。这个钩子不需要参数，在得到提交消息和开始提交(commit)前被调用。如果钩子返回值不是0，那么 git commit 命令就会中止执行。

这个钩子可以用来在提交前检查代码错误（例如运行lint程序）

### commit-msg

这个钩子被 git commit 命令调用, 而且可以通过在命令中添加\--no-verify 参数来跳过。这个钩子需要一个参数，这个参数中保存提交的 commit message 的文件名，如果钩子返回值不是0，那么 git commit 命令就会中止执行。这个钩子被用于规范 commit message 

## execa

在 nodeJs 中执行终端命令，execa 是对 child_process 的增强

```js
const execa = require('execa');

execa('cnpm', ['install','inquirer', '--save-dev']);

execa.command('cnpm install inquirer --save-dev')
```

## globby

基于 fast-glob 扩展。它提供了一系列遍历 node 文件系统的方法，并且返回符合匹配模式的文件名

```js
const globby = require('globby');

(async function () {
    const pathname = await globby('src/**')
    console.log(pathname)
})()
```

## inquirer

用户与命令行交互工具

```js
const inquirer = require('inquirer');

const promptList = [
    {
        type:'input',
        name:'projectName',
        message:'请输入项目名',
        validate:function (val) {
            var done = this.async();
            if(!val) {
                done('请输入项目名');
            }
            else done(null,true);
        }
    },
    {
        type:'list',
        name:'mode',
        message:'请选择模版类型',
        choices:['one','two']
    }
];

inquirer.prompt(promptList).then(res => {
    console.log(res)
})

```

## minimist

轻量级命令行参数解析工具

```cli
node src/parse.js --hello=bella
```

```js
const minimist = require('minimist');

var args = minimist(process.argv.slice(2));

console.log(args)

```
