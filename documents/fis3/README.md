# fis3

## 构建流程
1. 扫描项目目录拿到文件并初始化出一个文件对象列表
2. 对每个文件根据其匹配的编译规则(match)进行单文件编译。在单文件编译时经历的过程如下：
    1. lint：代码校验检查，比较特殊，所以需要 release 命令命令行添加 -l 参数
    2. parser：预处理阶段，比如 less、sass、es6、react 前端模板等都在此处预编译处理
    3. preprocessor：标准化前处理插件
    4. standard：标准化插件
    6. postprocessor：标准化后处理插件
    7. optimizer: 压缩
3. 获取用户设置的 package 插件，进行打包处理（包括合并图片）,打包阶段的过程如下:
    1. prepackager 打包前处理插件扩展点
    2. packager 打包插件扩展点，通过此插件收集文件依赖信息、合并信息产出静态资源映射表
    3. spriter 图片合并扩展点，如 csssprites
    4. postpackager 打包后处理插件扩展点
> 打包阶段插件设置时必须分配给所有文件，设置时必须 match ::package，不然不做处理。

## fis3-postpackager-loader
他会将页面中的零散资源进行整合，默认会把页面中用到的样式插入在 header 中，脚本插入在 body 底部。如果想修改，要在页面中自己插入<!--SCRIPT_PLACEHOLDER--> 和 <!--STYLE_PLACEHOLDER--> 占位符来控制位置。此插件会收集所有的资源，如果希望某个资源不被收集，要在资源结尾处如 </script> 后面加上 <!--ignore--> 注释.
```html
<script src="lib.js"></script><!--ignore-->
```

> 被 ignore 的资源，不会被修改位置，同时也不会参与 allInOne 合并。