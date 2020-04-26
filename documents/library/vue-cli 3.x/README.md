# Vue Cli 3.x

## Vue Cli 3.x 中使用的工具及其作用与用法

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
18. isbinaryfile
19. yaml-front-matter
20. ejs
21. vue-jscodeshift-adapter 和 jscodeshift

### gitHooks

钩子(hooks)是一些在$GIT-DIR/hooks目录的脚本, 在被特定的事件(certain points)触发后被调用

#### applypatch-msg

这个钩子是由git am命令调用的。它只有一个参数：就是存有将要被应用的补丁(patch)的提交消息(commit log message)的文件名。它的一个用途是把提交(commit)信息规范化，使得其符合一些项目的标准（如果有的话）。它也可以用来在分析(inspect)完消息文件后拒绝某个提交(commit)。

#### pre-applypatch

这个钩子是由git am命令调用的。它不需要参数，并且是在一个补丁(patch)被应用后还未提交(commit)前被调用。如果钩子的返回值不是`0``，那么刚才应用的补丁(patch)就不会被提交。

它可以用于检查当前的工作树（译注：此时补丁已经被应用但没有被提交），如果补丁不能通过测试就拒绝此次提交(commit)。

#### post-applypatch

这个钩子是由git am命令调用的。它不需要参数，并且是在一个补丁(patch)被应用且在完成提交(commit)情况下被调用。

这个钩子主要用来通知(notification)，它并不会影响git-am的执行结果。

#### pre-commit

这个钩子被 git commit 命令调用, 而且可以通过在命令中添加\--no-verify 参数来跳过。这个钩子不需要参数，在得到提交消息和开始提交(commit)前被调用。如果钩子返回值不是0，那么 git commit 命令就会中止执行。

这个钩子可以用来在提交前检查代码错误（例如运行lint程序）

#### commit-msg

这个钩子被 git commit 命令调用, 而且可以通过在命令中添加\--no-verify 参数来跳过。这个钩子需要一个参数，这个参数中保存提交的 commit message 的文件名，如果钩子返回值不是0，那么 git commit 命令就会中止执行。这个钩子被用于规范 commit message 

### execa

在 nodeJs 中执行终端命令，execa 是对 child_process 的增强

```js
const execa = require('execa');

execa('cnpm', ['install','inquirer', '--save-dev']);

execa.command('cnpm install inquirer --save-dev')
```

### globby

基于 fast-glob 扩展。它提供了一系列遍历 node 文件系统的方法，并且返回符合匹配模式的文件名

```js
const globby = require('globby');

(async function () {
    const pathname = await globby('src/**')
    console.log(pathname)
})()
```

### inquirer

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

### minimist

轻量级命令行参数解析工具

```cli
node src/parse.js --hello=bella
```

```js
const minimist = require('minimist');

var args = minimist(process.argv.slice(2));

console.log(args)

```

### rimraf

在 Node 中使用 rm -rf，用来删除文件和文件夹的，不管文件夹是否为空，都可删除

```js
const rm = require('rimraf');
const path = require('path');
rm(path.resolve(__dirname,'config/dist'),function () {
    console.log('success')
})
```
或者
```json
{
  "scripts": {
      "rm": "rimraf config/dist"
    }
}
```
```cli
npm run rm
```

### isbinaryfile

在 Node.js 判断文件是否是二进制文件

```js

const {isBinaryFileSync} = require('isbinaryfile')
const path = require('path');
const filename = path.resolve(__dirname,'./execa.js')
 console.log(isBinaryFileSync(filename)); // Boolean
 
```

### ejs

Vue CLI 将 EJS 作为 模版渲染引擎

### yaml-front-matter

Parses yaml or json from the beginning of a string or file

在 Vue CLI 中先使用 yaml-front-matter 将文件转成 JSON，然后将得到的文件内容和其他的 JSON 字段通过 ejs 模版渲染引擎生成真正的文件内容


### vue-jscodeshift-adapter 和 jscodeshift

Vue CLI 使用 jscodeshift 和 vue-jscodeshift-adapter 向文件中插入 import 语句。在这个过程中涉及到抽象语法树到概念

## 抽象语法树

在计算机技术中，抽象语法树指用树状结构来表示具体编程语言中的语法结构。之所以称这里的语法是'抽象'的，是因为这里的语法并不表示具体编程语法中的细节。

### Vue CLI 3.x 对抽象语法树的应用

Vue CLI 3.x 往某个文件插入 import 是对抽象语法树的应用 

Vue CLI 3.x 使用 jscodeshift 和 vue-jscodeshift-adapter 向文件中插入 import 语句

```js
const jscodeshift = require('jscodeshift')
const adapt = require('vue-jscodeshift-adapter')
// transform ： 方法，它用于操作 AST 并且生成新的文件内容
// fileInfo ： { path: 文件的路径, source: 文件的内容}
// options ： { imports : 要向文件中插入的 import 语句}。例如：{import : ['import router from "vue-router" ']}
module.exports = function runCodemod (transform, fileInfo, options) {
  // 返回转换之后的文件内容
  return adapt(transform)(fileInfo, { jscodeshift }, options || {})
}
```

transform 方法是比较有用的，jscodeshift 给出了很多操作和访问 AST 的 API，transform 方法就是你根据你的需求去使用 jscodeshift 的 API。fileInfo, { jscodeshift }, options 会作为参数传递到 transform 中

## vue create 创建项目

当使用`vue create`创建项目，如果项目的目录已经存在，那么 Vue Cli 就会提示：1. overwrite，2. merge，3. cancel。

overwrite

删除目录，然后用 preset 的值重新生成项目

merge 

直接用 preset 的值生成项目，如果新生成的某个文件在目录中已经存在，那么会用新的内容覆盖旧的内容；如果目录中存在额外的文件，那么这个文件保持不变

cancel

停止创建项目

### preset

在 Vue CLI 3.x 中 preset 是生成项目的关键。在使用 Vue CLI 3.x 创建 Vue 项目时你可以自己设置 preset 参数，在没有设置 preset 的情况下，Vue CLI 3.x 会使用 inquirer 收集你创建项目选择或者输入的各个参数，然后生成 preset，preset 中包含了 plugins,Vue CLI 3.x 是基于 plugins 生成项目的


