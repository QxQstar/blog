# 重新前端
## 学习方法
1. 搭建自己的知识框架
2. 追本溯源

## 前端知识框架图

![前端知识框架图](前端知识框架图.jpg)

## JavaScript
### 类型
在js中有7中类型，分别是Undefined,Null,Boolean,String,Number,Symbol,Object。在js中不能自定义类型。

#### Undefined, Null
undefined是变量，为了避免undefined被无意篡改，建议用void 0来获取undefined的值，null是关键字
#### Number
* Number类型有(2^64 - 2^53 + 3)个数。
* 在js中+0 和-0 ，要想区分+0和-0，可以让它被1除(即：1/X)，如果结果是Infinity就是+0，如果是-Infinity就是-0
* 非整数的Number类型不要使用==或===来比较。检查左右两边差的绝对值是否小于最小精度，才是正确的比较浮点数的方式。
```js
console.log( Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON);
```
#### 类型转换
* 在js中经常会有显示的或隐示的类型，基本类型Undefined,String,Number,Boolean在对象中都有对应的类。将基本类型转换成相应的对像称为装箱转换，装箱机制会频繁产生临时对象。
* 将对象转换成基本类型称为拆箱转换。在 js 标准中，规定了 ToPrimitive 函数，它是对象类型到基本类型的转换。在 ES6 之后，还允许对象通过显式指定 @@toPrimitive Symbol 来覆盖原有的行为。
```js
    var o = { 
        valueOf : () => {console.log("valueOf"); return {}}, 
         toString : () => {console.log("toString"); return {}}    
    }    
    o[Symbol.toPrimitive] = () => {console.log("toPrimitive"); return "hello"}    
    console.log(o + "") 
   // toPrimitive    
   // hello
```
