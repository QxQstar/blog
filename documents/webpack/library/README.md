# webpack output.library 详解

在项目开发中使用 webpack 打包前端代码，对 output.library 配置项总是不求甚解，只知道将代码打包成 npm 库的时候要配置它。这段时间又要开发组件库，借助这次机会对 output.library 求甚解。

配置过 output.library 的同学应该也配置过 output.libraryTarget，在开发库的时候总是一起配置它们。由于在[webpack文档](https://webpack.js.org/configuration/output/#outputlibrarytarget)中推荐使用 output.library.type 代替 output.libraryTarget，所以本文只介绍 output.library。

> 本文 webpack 的版本是 5.74.0。

## 前置准备

入口代码如下：

```javascript
// index.js
export default function add(a, b) {
    console.log(a + b)
}
```

webpack 的配置如下，后续我们只关注 library 字段。

```javascript
const path = require('path');

module.exports = {
  entry: './index.js',
  mode: "none",
  output: {
    filename: 'main.js',
    // library: 'MyLibrary',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

打包输出的文件中，除了包含 index.js 中的源码，还包含 webpack 运行时，代码如下，后续将不再介绍它。

```javascript
var __webpack_require__ = {};
// 将 definition 中的属性添加到 exports 上
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
    	if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
         }
	}
};
// 判断 obj 上是否有 prop
__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))

// 在 exports 上定义 __esModule 属性
__webpack_require__.r = (exports) => {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};
```

## 不配置 library

在介绍 library 各配置项的作用前，先看一下不配置 library 时的打包结果。如下：

```javascript
// 自执行函数
(() => {
    var __webpack_exports__ = {};
    __webpack_require__.r(__webpack_exports__);  
    __webpack_require__.d(__webpack_exports__, {
       "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
    }); 
    // 打包入口导出的函数 
    function __WEBPACK_DEFAULT_EXPORT__(a, b) {
        console.log(a + b)
    }    
})()
;
```

从上述代码可以看出，不配置 library 时，`__WEBPACK_DEFAULT_EXPORT__` 函数没有被公开，在库外部的任何位置都访问不到它。

下面将介绍配置 library 时的各种情况，library 可接受的数据类型是 `string | string[] | object`。`string` 是 `object` 类型的简写形式，当值为 `object` 类型时，object 中能包含的属性有 name、type、export、auxiliaryComment 和 umdNamedDefine。本文将重点放在 type 字段上，它决定如何公开当前库，取值基本固定，name 字段可以是任何字符串，它用来指定库的名称。

## library.type = var(默认值)

将 library 的值改成 `{type: 'var', name: 'MyLibrary'}`, 打包结果如下：

```javascript
var MyLibrary;
(() => { 
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
   "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

MyLibrary = __webpack_exports__;
})()
```

从上述代码可以看出，通过`MyLibrary`能访问到`add`函数，当不能保证`MyLibrary`在全局变量上。

## library.type = window

将 library 的值改成 `{type: 'window', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(() => {
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, {
   "default": () => (/* binding */ add)
 });
function add(a, b) {
    console.log(a + b)
}

window.MyLibrary = __webpack_exports__;
})()
```

从上述代码可以看出，通过`window.MyLibrary`能访问到`add`函数。

## library.type = module

将 library 的值改成 `{type: 'module'}`, 此时还要 experiments.outputModule 设置为 true , 打包结果如下：

```javascript
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
 "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

var __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };
```

此时不存在闭包，并且能用 es modules 将库导入。

## library.type = this

将 library 的值改成 `{type: 'this', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(() => {
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

this.MyLibrary = __webpack_exports__;
})()
```

此时通过 this.MyLibrary 能访问到 add 函数

## library.type = self

将 library 的值改成 `{type: 'self', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(() => {
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

self.MyLibrary = __webpack_exports__;
})()
```

此时通过 self.MyLibrary 可访问到 add 函数，在浏览器环境的全局上下文中 self 等于 window

## library.type = global

将 library 的值改成 `{type: 'global', name: 'MyLibrary'}`，此时 MyLibrary 会被分配到全局对象，全局对象会根据[target](https://webpack.js.org/configuration/target/)值的不同而不同，全部对象可能的值是 self、global 或 globalThis。当 target 的值为 web（默认值），代码结果如下：

```javascript
(() => {
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

self.MyLibrary = __webpack_exports__;
})()
```

此时的打包结果与 library.type = self 结果一样。

## library.type = commonjs

将 library 的值改成 `{type: 'commonjs', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(() => {
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
 "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

exports.MyLibrary = __webpack_exports__;
})()
```

顾名思义，如果公开的库要在 CommonJS 环境中使用，那么将 library.type 设置成 commonjs，此时 MyLibrary 分配给了 exports

## library.type = commonjs2

将 library 的值改成 `{type: 'commonjs2', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(() => {
    var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

module.exports.MyLibrary = __webpack_exports__;
})()
```

此时 MyLibrary 分配给了 module.exports，如果公开的库要在 Node.js 环境中运行，推荐将 library.type 设置为 commonjs2。commonjs 和 commonjs2 很像，但它们有一些不同，简单的说 CommonJs 规范只定义了 exports ，但是 module.exports 被 node.js 和一些其他实现 CommonJs 规范的模块系统所使用，commonjs 表示纯 CommonJs，commonjs2 在 CommonJs 的基础上增加了 module.exports。

## library.type = commonjs-static

将 library 的值改成 `{type: 'commonjs-module'}`，注意此时没有设置 name 属性, 打包结果如下：

```javascript
(() => {
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
 "default": () => (/* binding */ add)
});
function add(a, b) {
    console.log(a + b)
}

exports["default"] = __webpack_exports__["default"];
Object.defineProperty(exports, "__esModule", { value: true });
})()
```

在 CommonJS 模块中使用库

```javascript
const add = require('./dist/main.js');
```

在 ESM 模块中使用库

```javascript
import add from './dist/main.js'; 
```

当源代码是用 ESM 编写的，但你的库要同时兼容 CJS 和 ESM 时，library.type = commonjs-static将很有用。

## library.type = amd

将 library 的值改成 `{type: 'amd', name: 'MyLibrary'}`, 打包结果如下：

```javascript
define("MyLibrary", [], () => { return /******/ (() => {
    var __webpack_exports__ = {};
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
    "default": () => (/* binding */ add)
    });
    function add(a, b) {
        console.log(a + b)
    }

    return __webpack_exports__;
    })()
    ;
});;
```

当你的库要在 amd 模块中使用时，将 library.type 设置成 amd

## library.type = umd

将 library 的值改成 `{type: 'umd', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')  // commonjs2
		module.exports = factory();
	else if(typeof define === 'function' && define.amd) // amd
		define([], factory);
	else if(typeof exports === 'object') // commonjs
		exports["MyLibrary"] = factory();
	else // 全局变量
		root["MyLibrary"] = factory();
})(self, () => {
    return /******/ (() => { // webpackBootstrap	
        var __webpack_exports__ = {};
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, {
            "default": () => (/* binding */ add)
        });
        function add(a, b) {
            console.log(a + b)
        }

        return __webpack_exports__;
    })()
    ;
});
```

此时你的库能用 Commonjs、AMD 和全局变量引入，在开发库时将 library.type 设置成 umd 很常见。

## library.type = assign

将 library 的值改成 `{type: 'assign', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(() => {

var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      "default": () => (/* binding */ add)
    });
    function add(a, b) {
        console.log(a + b)
    }
})();

MyLibrary = __webpack_exports__;
})()
```

这将生成一个隐含的全局变量 MyLibrary，通过 MyLibrary 能访问 add 函数，它有可能覆盖一个现有值，因此要小心使用。

## library.type = assign-properties

将 library 的值改成 `{type: 'assign-properties', name: 'MyLibrary'}`, 打包结果如下：

```javascript
(() => {
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be in strict mode.
    (() => {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      "default": () => (/* binding */ add)
    });
    function add(a, b) {
        console.log(a + b)
    }
    
    })();
    
    var __webpack_export_target__ = (MyLibrary = typeof MyLibrary === "undefined" ? {} : MyLibrary);
    // 将 __webpack_exports__ 上的属性转移到 __webpack_export_target__ 上。
    for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
    if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
})()
```

它与 assign 类似，但更安全，如果 MyLibrary 存在，那么它将重用 MyLibrary，而非覆盖。

## library.type = jsonp

将 library 的值改成 `{type: 'jsonp', name: 'MyLibrary'}`, 打包结果如下：

```javascript
MyLibrary((() => {
    var __webpack_exports__ = {};
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
    "default": () => (/* binding */ add)
    });
    function add(a, b) {
        console.log(a + b)
    }

    return __webpack_exports__;
})()
);
```

此时入口的源码在 jsonp 的包裹器中，这种情况要确保 MyLibrary 函数存在。

## library.type = system

将 library 的值改成 `{type: 'system', name: 'MyLibrary'}`, 打包结果如下：

```javascript
System.register("MyLibrary", [], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	return {
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
        (() => { 
            var __webpack_exports__ = {};
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, {
            "default": () => (/* binding */ add)
            });
            function add(a, b) {
                console.log(a + b)
            }

            return __webpack_exports__;
        })()
      );
    }
	};
});
```

将你的库公开为一个[System](https://github.com/systemjs/systemjs) 模块。