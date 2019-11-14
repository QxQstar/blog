# nodeJs 文件系统

nodejs中fs模版提供了对文件进行操作的api，所有的文件系统操作都具有同步和异步两种形式。fs模版是nodejs的内置模版
```js
const fs = require('fs')
```

异步的形式总是将完成操作的回调作为最后一个参数，回调的第一个参数总是预留用于异常,如果操作成功完成，则第一个参数将为 null 或 undefined。
```js
const fs = require('fs')
fs.unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('已成功删除 /tmp/hello');
});
```

使用同步的操作发生的异常会立即抛出，可以使用 try…catch 处理，也可以允许冒泡
```js
const fs = require('fs')
try {
  fs.unlinkSync('/tmp/hello');
  console.log('已成功删除 /tmp/hello');
} catch (err) {
  // 处理错误
}
```

> 在繁忙的进程中，建议使用异步的方式调用，同步调用将阻塞整个进程，直到它完成


## 文件路径
大多数 fs 操作接受的文件路径可以指定为字符串、Buffer、或使用 file: 协议的 URL 对象。字符串形式的路径可以是相对路径和绝对路径，相对路径将相对于 process.cwd() 指定的当前工作目录进行解析。

> 简单理解process.cwd()等于执行node脚本的位置，在src/下执行`node test/fs.js`与在src/test/下执行`node fs.js`process.cwd()的值是不一样的。__dirname 等于脚本的所在位置，同一个脚本的__dirname的值是固定的。

在node v12.5.0版本下写下面的代码
## 新建目录
```js
const fs = require('fs');
const path = require('path');
fs.mkdir(path.resolve(__dirname,'build/js'),{recursive:true},function (err) {
    if(err) {
        console.log('目录创建出错了')
    }
})
```

`fs.mkdir`的第二个参数是可选的，它可以是指定模式（权限和粘滞位）的整数，也可以是具有 mode 属性和 recursive 属性（指示是否应创建父文件夹）的对象，recursive的默认是false,mode的默认值是0o777
## 新增文件
```js
const fs = require('fs');
const path = require('path');
fs.writeFile(path.resolve(__dirname,'build/js/index.js'),'console.log("hello")',function (err) {
    if(err) {
        console.log('出错了')
    }
})
```
如果文件不存在则创建文件，如果文件已存在则截断文件
## 删除目录
```js
const fs = require('fs');
const path = require('path');
fs.rmdir(path.resolve(__dirname,'build/js'),function (err) {
    if(err) {
        console.log('删除目录出错了')
    }
})
```
## 删除文件
```js
const fs = require('fs');
const path = require('path');
fs.unlink(path.resolve(__dirname,'build/js/index.js'),function (err) {
    if(err) {
        console.log('删除文件出错了')
    }
})
```
## 判断目录/文件是否存在
用`fs.stat`检查
```js
const fs = require('fs');
fs.stat('./dfd',function (err) {
    if(err && err.code === 'ENOENT') {
        console.log('不存在')
    }
})
```

用`fs.access`检查
```js
fs.access('./srce',fs.constants.F_OK,function (err) {
    if(err) {
        console.log('不存在')
    }
})
```
> fs.exists(path, callback) 已经废弃。
## 目录/文件重命名
```js
const fs = require('fs');
const path = require('path');
fs.rename(path.resolve(__dirname,'build/js/index.js'),path.resolve(__dirname,'build/js/index-new.js'),function (err) {
    if(err) {
        console.log('重命名出错了')
    }
})
```
如果 newPath 已存在，则覆盖它
## 读取目录中的文件
```js
fs.readdir(path.resolve(__dirname,'../src'),{withFileTypes:true},function (err,files) {
    if(err) {
        console.log('读目录出错了')
    }
    // 将包含 fs.Dirent 对象。
    console.log(files)
})
```

`fs.readdir`的第二个参数是可选的，第二个参数可以是一个带有encoding属性和withFileTypes属性的对象，encoding的默认值是utf8，withFileTypes的默认值是false。当withFileTypes的值为false时，files是目录中的文件名的数组
## 读取文件的全部内容
```js
const fs = require('fs');
const path = require('path');
fs.readFile(path.resolve(__dirname,'build/js/index.js'),{encoding:'utf8'},function (err,data) {
    if(err) {
        console.log('读文件出错了')
    }
    console.log(data)
})
```
`fs.readFile`第二个参数是可选的，第二个参数可以是字符串也可以是一个带有encoding属性和flag的对象，encoding的默认值是null，flag的默认值是r，如果第二个参数是字符串，则它指定字符编码，如果没有指定encoding，则返回原始的 buffer。
## 将字符串写入文件描述符对应的文件中
```js
const fs = require('fs');
const path = require('path');
fs.open(path.resolve(__dirname,'build/css-new/index-new.css'),'w',function (err, fd) {
    if(err) {
        console.log('打开文件出错了')
    } else {
        fs.write(fd,'p {font-size: 14px;}',function (err,w,s) {
            if(err) {
                console.log('写文件失败')
            } else {
                console.log(w,s)
            }
            fs.close(fd,function (err) {
                if(err) console.log('文件关闭失败')
            })
        })
    }
})
```
