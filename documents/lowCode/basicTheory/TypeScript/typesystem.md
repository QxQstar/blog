# 类型系统

TypeScript 是 JavaScript 的类型化超集，它可以编译成纯 JavaScript。与 JavaScript 相比，TypeScript 有一个强大的类型系统，那是一个结构化的类型系统，除此之外，TypeScript 还包含一些正在规划中的 JavaScript 特性。

本章包含的内容有：搭建一个 TypeScript 开发环境、TypeScript 类型系统以及装饰器。

在结构化的类型系统中，两种结构相同的不同类型是兼容的，这意味着只要结构匹配，名称并不重要。在TypeScript中，有一些例外，比如私有属性。稍后我将介绍如何实际使用这个特性。在TypeScript中，类型是结构化的，因为我们真的想让JavaScript开发人员在认知负荷最小的情况下更容易使用它。

## 什么是类型系统

这证明了TypeScript是一种结构类型化语言，也称为duck typing。俗话说，“如果它走路像鸭子，呱呱像鸭子，游泳像鸭子，那么它一定是一只鸭子”

## 内置数据类型

## 自定义数据类型

### 函数类型

在 TS 中有多种方式去描述函数，例如：函数类型表达式、接口。在这部分介绍如何使用函数类型表达式描述函数，在接口部分再介绍用接口描述函数。

1. 可选参数和默认参数
2. 参数的 Reset 和 Spread 操作符
3. 函数重载

### 接口

这里介绍的接口，指的是接口类型，接口类型用于注释对象的结构，即：对象有哪些属性，以及这些属性的数据类型是什么，在 TS 中创建接口类型用到的关键字是 interface。

匿名接口类型和命名接口类型

定义多个相同的接口类型

接口类型嵌套

为什么时候接口类型

可选属性

使用接口类型描述函数类型

扩展接口类型


### 枚举

### 类

### 联合类型

## 类型守卫

## 类型断言

## 泛型

### 内置的泛型类型

## 类型兼容

## 工具类型

## 类型声明文件

接口与类型别名的差异

Prior to TypeScript version 4.2, type alias names may appear in error messages, sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.
Type aliases may not participate in declaration merging, but interfaces can.
Interfaces may only be used to declare the shapes of objects, not rename primitives.
Interface names will always appear in their original form in error messages, but only when they are used by name.
For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use interface until you need to use features from type.

