

# path 
path是node中的一个模块

# path.resolve
```
var path = require("path")     //引入node的path模块

path.resolve('/foo/bar', './baz')   // returns '/foo/bar/baz'
path.resolve('/foo/bar', 'baz')   // returns '/foo/bar/baz'
path.resolve('/foo/bar', '/baz')   // returns '/baz'
path.resolve('/foo/bar', '../baz')   // returns '/foo/baz'
path.resolve('home','/foo/bar', '../baz')   // returns '/foo/baz'
path.resolve('home','./foo/bar', '../baz')   // returns '/home/foo/baz'
path.resolve('home','foo/bar', '../baz')   // returns '/home/foo/baz'
```

# __dirname
Node中，__dirname 总是指向被执行 js 文件的绝对路径，不管你在哪个路径下执行同一个js文件，__dirname都是一样的

# Caching guide


[Caching guide](https://webpack.js.org/guides/caching)

# development guide 

[development guide](https://webpack.js.org/guides/development/)



