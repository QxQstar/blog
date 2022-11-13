# 开发一个前端脚手架

开发脚手架并不复杂，主要涉及5个知识点，分别是，可执行的命令、收集交互数据、下载项目模板、模版引擎和抽象语法树。下面将脚手架命名为 vitis-cli。

## 可执行的命令

在 package.json 中添加一个 bin 字段，它指定了命令名到文件名的映射。代码如下：
```json
{
  "name": "vitis-cli",
  "bin": {
    "vitis-cli": "./index.js"
  },
  // something
}
```

当全局安装 vitis-cli 软件包之后，index.js 文件将被链接到全局 bins 的位置，使该文件可以通过 vitis-cli 命令来运行。接下来在 index.js 的第一行写上下面的这行代码。

```nodejs
#!/usr/bin/env node
```

当运行 index.js 时，上述代码告诉 shell 用 node 来执行文件。现在我们要给 vitis-cli 定义多个子命令，比如 vitis-cli create、vitis-cli add 等，这使用开源项目 Commander 来实现，代码如下：

```javascript
const commander = require('commander');
const program = new commander.Command();

program
.command('create')
.action(() => {
   // 当在shell中执行 vitis-cli create 命令时运行这里的代码
})
.allowUnknownOption()

program
.command('add')
.action(() => {
   // 当在shell中执行 vitis-cli add命令时运行这里的代码
})
.allowUnknownOption()

program.parse();
```

## 收集交互数据

vitis-cli 在创建项目时要收集用户在 shell 中的交互数据，比如组件英文名，组件中文名等。这使用开源项目 prompts 来实现，代码如下：

```javascript
const prompts = require('prompts');
// 这是要询问用户的问题
const questions = [
    {
        type: 'confirm',
        name: 'confirmDir',
        message: () => `项目将创建在 vitis-component-packages 目录，你确定吗？`,
        initial: true
    },
    {
        type: (prev) => prev === true ? 'text' : null,
        name: 'componentName',
        message: '请输入组件英文名，例如: WarningText'
    },
    // 其他的问题
]
// 这是用户输入的答案
const response = await prompts(questions)
```

vitis-cli 不会直接使用用户输入的数据，而是先将数据格式化，再判断输入的值是否合法。比如，用开源项目 validate-npm-package-name 判断componentName 的值是否是一个合法的 npm 包名。

## 下载项目模板

这一步使用开源项目 download-git-repo 将托管到 GitHub 上的项目模板下载到用户本地，代码如下：

```javascript
const download = require('download-git-repo')
const repo = 'direct:https://github.com/react-low-code/vitis-component-template.git#master'
// 将模板下载到这里
const dir = path.resolve(process.cwd(), 'tmp')
download(repo, dir,{
   clone: true
}, (err) => {
   if (err) {
     // 在这里处理项目模板下载失败
   } else {
    // 在这里做模板下载成功之后要做的事
   }
})
```

## 模版引擎

在第 2 步我们收集了用户交互数据，这里使用开源项目 handlebars 将项目模板中的占位符替换成用户输入的数据，比如某模板文件的内容如下：

```json
{
  "name": "{{projectName}}",
  "version": "1.0.0",
  "description": "这是一个{{componentTitle}}"
}
```

现在使用 handlebars 替换文件中的占位符，代码如下：

```javascript
const Handlebars = require("handlebars");
const path = require('path')
const fs = require('fs-extra')

   const packagePath = path.resolve(projectDir, 'package.json')
// 获取文件中的内容
const content = fs.readFileSync(packagePath, 'utf-8')
const template = Handlebars.compile(content);
// 用具体的值替换模板中的占位符
    const fileContent = template({
  projectName: "vitis-lowcode-eg",
  componentTitle: "示例"
})
// 将处理之后的结果重新写入文件
fs.writeFileSync(packagePath, fileContent)
```

## 抽象语法树

在 shell 中运行 vitis-cli setter 命令，收集用户交互数据之后，vitis-cli 将根据用户的输入为组件创建一个用于开发属性设置器的 React 文件。这一步需要修改现有的ts文件，比如现在ts文件的内容如下：

```javascript
import stringSetter from './stringSetter'

export default {stringSetter}
```

运行 vitis-cli setter之后，ts文件的内容将变成如下：

```javascript
import numberSetter from './numberSetter'
import stringSetter from './stringSetter'

export default {numberSetter, stringSetter}
```

实现这个需求要做两件事，第一件事，在文件开头插入一个 import 语句，这用字符串拼接即可实现；第二件事，在默认导出中新增一个属性，这要访问并修改抽象语法树，下面用3个步骤介绍如何修改抽象语法树并生成新的 TypeScript 代码。

### 创建 SourceFile

在这里我们不必创建TS程序，而是调用一个 typescript 模块的 API 即可，代码如下：

```javascript
const ts = require('typescript')

// 得到 codeContent 对应的 sourceFile
const sourceFile = ts.createSourceFile('', codeContent, ts.ScriptTarget.ES2015,false);
```

### 转换抽象语法树中的节点

这一步将遍历第1步创建的 sourceFile，在抽象语法树中找到导出语句对应的节点，然后修改导出的对象，代码如下：

```javascript
const kind = require('ts-is-kind')
// 转换器
function transformer(ctx){
    const visitor = (node) => {
         if (!kind.isExportAssignment(node)) {
                return ts.visitEachChild(node, visitor, ctx)
         } else {
	      // 如果node是导出语句
            return updateExport(node, ctx)
         }
    }
    return (sf) => {
       return ts.visitNode(sf, visitor)
    }
}

function updateExport(node, ctx) {

   // 这里这个 node 是导出的对象
   const visitor = node => {
      // 创建一个属性节点
      const newProperty = ts.factory.createShorthandPropertyAssignment(ts.factory.createIdentifier(‘numberSetter’))
// 将新建的属性节点添加到对象节点中
    return ts.factory.updateObjectLiteralExpression(node,[newProperty].concat(node.properties))
   }
   return ts.visitEachChild(node, visitor, ctx)
}

// 使用提供的转换器转换抽象语法树中的节点
const result = ts.transform(sourceFile, [transformer]);
```

### 生成源代码

这一步很简单，用如下4行代码即可实现。

```javascript
const transformedSourceFile = result.transformed[0]
const printer = ts.createPrinter()
// 这是最终的源代码
const resultCode = printer.printFile(transformedSourceFile)
// 将源代码写入文件中
fs.writeFileSync(filePath, resultCode)
```

## 总结

vitis-cli 是一个为低代码引擎开发组件的脚手架，它用到的开源项目有，prompts、commander、validate-npm-package-name、handlebars、ts-is-kind 和 typescript 等。点这里查看[vitis-cli](https://github.com/react-low-code/vitis-cli)的源码。
