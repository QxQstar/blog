# TypeScript 类型系统和自定义数据类型

TypeScript 在 JavaScript 的基础上增加了静态类型系统，它使代码的可读性更强，让代码重构变得更容易。但是对 TypeScript 而言，它的静态类型系统是可选的，这让JavaScript 程序很容易就能迁移到 TypeScript 程序。

## 什么是类型系统

类型系统是一组规则，它用来规定编程语言如何将变量、类、函数等识别为不同的类型，如何操作这些类型以及不同类型之间的关系。类型系统分为静态类型系统和动态类型系统。

* 动态类型系统

JavaScript 是一种动态类型的编程语言，它在运行阶段进行类型检查，所以与类型相关的错误要在运行阶段才会被暴露出来。

* 静态类型系统

TypeScript 在 JavaScript 的基础上增加了静态类型系统，它使 TypeScript 程序在编译阶段就进行类型检查，与类型相关的错误在编译阶段就能暴露出来，这使开发人员能提前发现类型错误。

TypeScript 的类型系统是一个结构化类型系统，在结构化类型系统中，如果两个类型有相同的结构，不论它们的类型名是否相同，则认为它们是相同类型。这意味着类型名不重要，只要结构是匹配的，类型就兼容。

## 函数类型

在 TypeScript 中有多种方式去描述函数的签名，例如：函数类型表达式、接口类型。在这里先介绍如何用函数类型表达式描述函数的签名。函数类型表达式语法如下：

```typescript
// 这是一个函数类型，它描述的函数接受两个参数，分别是name和age，name是string类型，age是number类型，这个函数没有返回值
(name: string, age: number) => void // lineA
// 这是一个函数类型，它描述的函数接受一个参数，这个参数是number类型，函数的返回值的类型是 number
(a: number) => number
```

函数类型表达式语法与 ES2015 的箭头函数语法很相似，但是函数类型表达式不会创建任何函数，它只存在于 TypeScript 编译时。从上述代码可以看出，函数的返回值类型放在箭头符号（=>）的后面，函数的参数类型以 :type 的形式放在参数的后面。代码清单1演示了如何使用函数类型表达式。

代码清单1

```typescript
// 声明一个名为 startHandle 的变量，它的数据类型是函数，它没有返回值，它接受一个名为fn的参数，并且 fn 的数据类型也是函数
let startHandle: (fn: (a: number, b: number) => void) => void // line A

// 在这里将一个箭头函数赋值给 startHandle
startHandle = (fn: (a: number, b: number) => void) => { // line B
    if (Math.random() < 0.5) {
        fn(1,2)
    } else {
        fn(3,4)
    }
}
function printResult(val1: number,val2: number): void {
    console.log(val1 + val2)
}

startHandle(printResult)
```

代码清单1中的 line A 和 line B 乍一看不好理解，主要是它太长了，而且存在冗余的部分，可以使用类型别名解决这个问题。

### 类型别名

定义类型别名需要用到的关键字是 type，用法如下：

```typescript
type myFnType = (a: number, b: number) => void
```

接下来就能在代码中用 myFnType 代替 (a: number, b: number) => void，让代码更加的简洁。修改代码清单1中的代码，得到代码清单2。

代码清单2

```typescript
type myFnType = (a: number, b: number) => void

let startHandle: (fn: myFnType) => void // line A

startHandle = (fn: myFnType) => { // line B
    if (Math.random() < 0.5) {
        fn(1,2)
    } else {
        fn(3,4)
    }
}
```

修改之后,代码清单2中的 line A 和line B 比代码清单1中的 line A 和 line B 简洁很多，而且也更加容易理解。

### 可选参数

代码清单1和代码清单1中的函数类型，它们每一个参数都是必填的，但在某些情况下，我们要让函数参数是可选的，在函数参数的类型注释的前面加一个?就能让这个参数变成可选参数，如代码清单3所示。

代码清单3

```typescript
// 参数 age 可传也可以不传，如果传了就必须是 number类型
function printDetail(name: string, age?: number): void {
    console.log(`name is ${name}, age is ${age ? age : '??'}`)
}
printDetail('Bella', 23) // 不会有类型错误
printDetail('Bella') // 不会有类型错误
printDetail('Bella', '3') // 有类型错误
```

### 默认参数

函数的默认参数与可选参数类似，在调用函数的时候可以不给默认参数传值，如果不传值，那么这个参数就会取它的默认值。在函数参数的类型注释的后面加一个 = ，再在 = 的后面跟一个具体的值，就能将这个参数指定为默认参数。修改代码清单3得到代码清单4。

代码清单4

```typescript
function printDetail(name: string, age: number = 23): void {
    console.log(`name is ${name}, age is ${age}`)
}
```

在代码清单4中，不需要在 printDetail 的函数体中判断 ag e是否存在。如果调用 printDetail 的时候，没有给 printDetail 传递第二个参数，那么 age 取值为 23。在调用函数的时候如果传递的参数值为 undefined，这相当于没有传参数值。

### 函数重载

函数重载指的是函数名相同，但是参数列表不相同。JavaScript 没有静态类型检查，所以 JavaScript 不支持函数重载，在 TypeScript 中支持函数重载，但是 TypeScript 中的函数重载只存在于它的编译阶段。

在TypeScript中函数重载的写法如下：

```typescript
1 function getDate(timestamp: number):number;
2 function getDate(str: string): Date;
3 function getDate(s: number| string): number | Date {
4    if (typeof s === "number") {
5        return s
6   } else {
7        return new Date(s)
8    }
9 }
```

上述代码中的函数 getDate 有两个重载，一个期望接受一个 number 类型参数，另一个期望接受一个 string 类型的参数。第一行和第二行的函数没有函数体，它们被称为重载签名，第3行到第9行的函数有函数体，它被称为实现签名。

编写重载函数时，重载签名必须位于实现签名的前面，并且实现签名必须与所有的重载签名兼容。代码清单5是一个实现签名与重载签名不兼容的例子。

代码清单5

```typescript
function getMonth(timestamp: number): number
function getMonth(date: Date): number
function getMonth(d: Date): number {
    if (typeof d === 'number') {
        return new Date(d).getMonth()
    } else {
        return d.getMonth()
    }
}
```

代码清单5中的 getMonth 有两个重载签名，第一个重载签名接受一个 number 类型的参数，第二个重载签名接受一个 Date 类型的参数，但 getMonth 的实现签名只接受一个Date 类型的参数，它与第一个重载签名不兼容。在代码清单5中，应该将 getMonth 的实现签名中的参数 d 的数据类型改成 Date | string。

调用重载函数时，必须调用某个确定的重载，不能既可能调用第一个重载又可能调用另外的重载，以重载函数 getMonth 为例：

```typescript
getMonth(2344553444) // 这是没问题的
getMonth(new Date()) // 这是没问题的
getMonth(Math.random() > 0.5 ? 2344553444: new Date()) // 有问题
```

上述代码第三行不能在编译阶段确定它调用的是哪一个重载，如果你非要这么调用，那么你不能使用重载函数。

> 补充：在 TypeScript 中有一个通用的函数类型，那就是 Function，它表示所有的函数类型。

## 接口类型

在 TypeScript 中，接口类型用于限制对象的形状，即：对象有哪些属性，以及这些属性的数据类型是什么，在后文将接口类型简称为接口。有三种接口类型，分别是隐式接口，命名接口和匿名接口。

隐式接口

当创建一个带有 key/value 的对象时，TypeScript 会通过检查对象的属性名和每个属性值的数据类型去创建一个隐式接口，代码如下：

```typescript
const user = {
    name: 'bella',
    age: 23
}
// TypeScript 创建的隐式接口为:
{
 name: string;
 Age: number;
}
```

匿名接口

匿名接口没有名称，它不能被重复使用，使用匿名接口会造成代码冗余，隐式接口也是匿名接口。用匿名接口限制对象的形状，代码如下：

```typescript
const student: {
    name: string;
    age: number
} = {
    name: 'bella',
    age: 23
}

const pig: {
    name: string;
    age: number
} = {
    name: 'hua',
    age: 2
}
```

命名接口

在 TypeScript 中，使用 interface 关键字定义命名接口，命名接口可以让代码更加简洁，因为它可以被重复使用。代码如下：

```typescript
// 定义接口类型
interface BaseInfo {
    name: string;
    age: number
}
// 用接口类型注释对象的类型
const bella: BaseInfo = {
    name: 'bella',
    age: 23
}
const hua: BaseInfo = {
    name: 'hua',
    age: 2
}
```

### 可选属性

在介绍函数类型的时候介绍了函数的可选参数，接口的可选属性与函数的可选参数类似，它指的是，在对象中可以有这个属性也可以没有这个属性。接口的可选属性的格式为：propertyName?: type，即：在属性名与冒号之间加一个问号。在接口中定义可选属性，能让这个接口适用范围更广，但是它会带来一些问题，比如：不能用可选属性参与算术运算。

### 只读属性

如果对象的某个属性在创建之后不可修改，可以在创建接口的时候将这个属性指定为只读属性，接口的只读属性的格式为：readonly propertyName: type，即：在属性名的前面加上 readonly 关键字。对象的只读属性不能被单独修改，但是可以将整个对象重复赋值，如代码清单6所示。

代码清单6

```typescript
interface DepartmentInfo {
    departmentName: string;
    readonly departmentId: string
}

let department: DepartmentInfo = {
    departmentName: '研发部',
    departmentId: '1'
}
// 不能修改 id 属性
department.id = '2' // line A类型检查会报错
// 将 department 对象重新赋值
department = {      // line B类型检查不会报错
    departmentName: '研发部',
    departmentId: '2'
}
```

代码清单6中的line A在编译阶段会报错，line B 在编译阶段不会报错。

如果要让数组变成只读的，能用 ReadonlyArray 代替 Array，也能在 Type[] 前加 readonly关键字，用法如下：

```typescript
const myArr: ReadonlyArray<string> = ['1','2']
const myArr2: readonly string[] = ['1','2']
```

myArr 和 myArr2 上所有会导致数组发生变化的方法都会被移除，如：push，pop等。

### 接口扩展

与 class 类似，接口可以从其他接口中继承属性，与 class 不同的是，接口可以从多个接口中继承。接口扩展用到的关键字是 extends，接口扩展能在命名接口的基础上进一步提高代码的可复用性，接口扩展的用法如代码清单7所示。

代码清单7

```typescript
interface Staff extends BaseInfo, DepartmentInfo {
    staffId: string
}
```

代码清单7中的 Staff 会包含 BaseInfo 和 DepartmentInfo 中的所有属性。如果 BaseInfo 和 DepartmentInfo 上存在同名但数据类型不兼容的属性，那么 Staff 不能同时扩展 BaseInfo 和 DepartmentInfo。如果 Staff 上新增的属性与 BaseInfo 或者 DepartmentInfo 上的属性同名但数据类型不兼容，那么也不能扩展。

### 多重接口声明

当同一个文件中声明了多个同名的接口，TypeScript 会将这些同名接口中的属性合并在一起，代码如下所示：

```typescript
interface Human {
    name: string;
}
interface Human {
    sex: string;
}
const Li: Human = {
    name: 'li',
    sex: '女'
}
```

### 接口的索引签名

在某些时候，可能不确定对象有哪些属性名，但属性名对应的值的数据类型是确定的，这种情况可以用带有索引签名的接口来解决，用法如代码清单8所示。

代码清单8

```typescript
interface Car {
   price: string;
   [attr: string]: number; // line A
}
const one: Car = {
  price: '3',
  size: 3.4
}
const two: Car = {
  price: '4',
  1: 4
}
```

代码清单8中的 line A 对应的代码就是接口的索引签名，索引签名 key 的数据类型只能是 string 或者是 number，value 的数据类型可以使用任何合法的 TypeScript 类型。用 Car 接口注释的对象，一定要包含 price 属性，并且 price 的值是 sting 类型，对象其他的属性名只需要是字符串，属性值是 number 类型就能满足要求。

> 补充：数组和纯JavaScript对象都是可索引的，所以能用可索引的接口去注释它们。

### 用接口描述函数

上一节介绍了用函数类型表达式描述函数的签名，除此之外，接口也能描述函数的签名，代码清单2中的 myFnType 可被改写成下面这种形式：

```typescript
interface myFnType {
    (a: number, b: number): void
}
```

带有匿名方法签名的接口可用于描述函数，在 JavaScript 中，函数也是对象，因此在函数类型的接口上定义任何属性都是合法的，用法如代码清单9所示。

代码清单9

```typescript
// 函数类型的接口
interface Arithmetic {
    (a: number, b: number): number; // 匿名函数签名
    type: string;
}

function calculate (a: number, b: number): number {
    return a + b
}

calculate.type = 'add'

const add: Arithmetic = calculate

console.log(add(2,1)) // 3
console.log(add.type) // add
```

在项目中，有些函数是构造函数，为了类型安全应该通过 new 关键字调用它，但在 JavaScript 领域没有这种限制，幸运的是，在 TypeScript 中，构造函数类型的接口可描述构造函数。将代码清单9中 Arithmetic 改写成代码清单10中的形式，使函数 add 只能通过 new 关键字调用。

代码清单10

```typescript
// 构造函数类型的接口
interface Arithmetic {
    new (a: number, b: number): Add ; // 在匿名函数签名前加 new 关键字,注意返回值类型
    type: string;
}
```

ES2015 中的 class 与构造函数是一回事，因此构造函数类型的接口可用于描述 class，用法如代码清单11所示，代码清单11沿用代码清单10中的 Arithmetic。

代码清单11

```typescript
class Add {
    a: number
    b: number
    static type: string
    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }

    calculate() {
        return this.a + this.b
    }
}

function createAdd(isOdd: boolean, Ctor: Arithmetic) {
    return isOdd ? new Ctor(1,3) : new Ctor(2,4)
}

createAdd(false, Add)
```

## 类类型

本节只介绍类在TypeScript类型系统层面的知识。

### implements关键字

使用 implements 关键字让类实现某个特定的接口，它只检查类的公共实例字段是否满足特定的接口，并且不改变字段的类型。implements 的用法如代码清单12所示。

代码清单12

```typescript
interface User {
    name: string;
    nickName: string;
    printName: () => void
}

// TypeScript 程序会报错
class UserImplement implements User {
    name: string = 'Bella'
    // 这是私有字段
    private nickName: string = 'hu'
    printName() {
        console.log(this.name)
    }
}
```

在代码清单12中，UserImplement 类实现 User 接口，但 UserImplement 类将 nickName 定义为私有字段，这使 UserImplement 实例的公共字段的形状与 User 接口不兼容，所以代码清单12会报错。

### 类的静态端类型和实例端类型

类的实例端类型

当创建一个类时，TypeScript 会为这个类创建一个隐式接口，这个隐式接口就是类的实例端类型，它包含类的所有非静态成员的形状，当使用 :ClassName 注释变量的类型时，TypeScript会检查变量的形状是否满足类的实例端类型。

类的静态端类型

类实际上是一个构造函数，在 JavaScript 中，函数也是对象，它可以有自己的属性。类的静态端类型用于描述构造函数的形状，包括构造函数的参数、返回值和它的静态成员，:typeof ClassName返回类的静态端类型。

### 将 this 作为类型

this 可以作为类型在类或接口的非静态成员中使用，此时，this 不表示某个特定的类型，它动态的指向当前类的实例端类型。当存在继承关系的时候，this 类型的动态性就能被体现出来，下面用代码清单13加以说明。

代码清单13

```typescript
interface U {
    relationship?: this
    printName(instance: this): void
}

class User implements U {
    relationship?: this;
    name: string = 'unknown'
    printName(instance: this) {
        console.log(instance.name)
    }
    setRelationship(relationship: this) {
        this.relationship = relationship
    }
}

class Student extends User { 
    grade: number = 0
}

const user1 = new User()
const student = new Student()
const otherStudent = new Student()
student.printName(student) // 没有类型错误，此时printName能接受参数类型为 Student的类型
student.setRelationship(otherStudent) // 没有类型错误，此时printName能接受参数类型为 Student的类型
student.printName(user1) // 有类型错误，此时printName能接受参数类型为 Student的类型
user.printName(student) // 没有类型错误，此时printName能接受参数类型为 User的类型
```

代码清单13中，Student 是 User 的子类，它在 User 的基础上新增了一个非静态成员，所以 User 类型的参数不能赋给 Student 类型的参数，但 Student 类型的参数能赋给 User 类型的参数。当用子类实例调用 printName 方法时，printName 能接受参数类型为子类的类型，当用父类实例调用 printName 方法时，printName 能接受的参数类型为父类的类型。

### 将 this 作为参数

默认情况下，函数中 this 的值取决于函数的调用方式，在 TypeScript 中，如果将 this 作为函数的参数，那么 TypeScript 会检查调用函数时是否带有正确的上下文。this 必须是第一个参数，并且只存在于编译阶段，在箭头函数中不能包含 this 参数。下面通过代码清单14加以说明。

代码清单14

```typescript
class User{
    name: string = 'unknown'
    // 只能在当前类的上下文中调用 printName 方法，注意 this 类型的动态性
    printName(this: this) {
        console.log(this.name)
    }
}

const user = new User()
user.printName() // 没问题
const printName = user.printName
printName() // 有问题
```

## 枚举

在 TypeScript 中使用 enum 关键字创建枚举，枚举是一组命名常量，它可以是一组字符串值，也能是一组数值，也能将两者混合使用。枚举分为两类，分别是常规枚举和常量枚举。

常规枚举

常规枚举会作为普通的 JavaScript 对象注入到编译后的 JavaScript 代码中，在源代码中访问常规枚举的成员，将在输出代码中转换成访问对象的属性。下面的代码定义了一个常规枚举：

```typescript
enum Tab {
    one,
    two
}
console.log(Tab) // 打印对象
```

常量枚举

声明枚举时，将 const 关键字放在 enum 之前，就能声明一个常量枚举。常量枚举不会作为 JavaScript 对象注入到编译后的 JavaScript 代码中，这使产生的 JavaScript 代码更少，在源代码中访问常量枚举的成员，将在输出代码中转换为访问枚举成员的字面量。下面的代码定义了一个常量枚举：

```typescript
const enum Tab {
    one,
    two
}
console.log(Tab) // ts 程序报错
console.log(Tab.one) // 在 js 代码中被转换为：console.log(0 /* one */);
```

常量枚举比常规枚举产生的代码量更少，它能减少程序的开销，但是常量枚举的使用范围更小，它只能在属性、索引访问表达式、模块导入/导出或类型注释中使用。

### 枚举类型

当我们定义一个枚举时，TypeScript 也将定义一个同名的类型，这个类型称为枚举类型，用此类型注释的变量必须引用此枚举的成员。由于 TypeScript 类型系统是一个结构化的类型系统，所以，除了可以将枚举成员赋给枚举类型的变量之外，还能将枚举的成员的字面量赋值给枚举类型的变量。代码如下所示：

```typescript
interface Page {
    name: string;
    tabIndex: Tab;
}

const page: Page = {
    name: '首页',
    tabIndex: Tab.two // 将枚举成员赋给枚举类型的变量
}

page.tabIndex = 0 // 将数值字面量赋给枚举类型的变量，不推荐!!!
```

### 枚举的成员类型

枚举类型是一个集合类型，枚举成员有它们的类型。如果变量的类型是枚举的成员类型，那么不能将枚举中的其他成员赋给该变量。代码如下：

```typescript
let index: Tab.one = Tab.one;
index = Tab.two; // ts 程序报错
```

### 枚举的成员

可以显式地为枚举成员设置数字或者字符串值，那些没有显式提供值的成员将通过查看前一个成员的值自动递增，如果前一个成员的值不是数值就会报错，枚举成员的值从0开始计数。TypeScript  将枚举的成员根据它的初始化时机分为两大类，分别为：常量成员与计算成员。

常量成员

如果枚举成员的值在编译阶段就能确定，这个成员是常量成员。通过如下的几种方式初始化能在编译阶段确定值：

1. 不显式初始化，并且前一个成员是number类型
2. 用数字或者字符串字面量
3. 用前面定义的枚举常量成员
4. 将+、-、~这些一元运算符用于枚举常量成员
5. 将+, -, *, /, %, <<, >>, >>>, &, |, ^这些二进制操作用于枚举常量成员

定义枚举常量成员的代码如下：

```typescript
enum MyEnum {
    one,
    two = Tab.two,
    three = -two,
    four = two + 3,
    five = four << 4
}
```

计算成员

如果枚举成员的值在运行阶段才能确定，这个成员就是计算成员。代码如下所示:

```typescript
enum computedMember {
    one = Math.random(),
    two = one + 2
}
```

> 补充：计算成员不能位于常量枚举(即：const 枚举)中。在包含字符串成员的枚举中，枚举成员不能用表达式去初始化。

## 字面量类型

字面量类型就是将一个特定的字面量作为类型去注释变量的类型，字面量类型可以是：字符串字面量，数值字面量和布尔值字面量。用 const 声明变量，并且不给这个变量设置数据类型，而是将一个具体的字符串、数值或者布尔值赋给它，TypeScript 会给变量隐式的注释字面量类型。代码如下所示：

```typescript
const type = 'one' // 等同于 const type: 'one' = 'one'

// 只能将 Bella 赋值给变量 hello
let hello: 'Bella' = 'Bella'
hello = 'one' // 类型错误

// 这个函数的返回值只能是true，它的第二个参数要么没有，要么为 3
function compare(one: string, two?: 3): true {
    console.log(one, two)
    return true
}
```

## 联合类型

用管道（|）操作符将一个或者一个以上的数据类型组合在一起会形成一个新的数据类型，这个新的数据类型就是联合类型，这一种逻辑或。可以从所有的类型创建联合类型，比如：接口，数值，字符串等。在 TypeScript 中只允许使用联合类型中每个成员类型都存在的属性或者方法，否则，程序会报错。

联合类型的用法如下：

```typescript
// 能将字符串和数值类型赋值给变量 type
let type: string|number = 1
type = '1'

// 能将 0、1或布尔值赋值给变量 result
let result: 0 | 1 | boolean = true
result = 2 // 类型错误

interface User {
    name: string
}

interface Student extends User{
    grade: number;
}

function printInfo(person: User|Student) {
    // 在这里会有类型错误，因为 grade 属性只存在 Student类型中
    console.log(person.name + ':' + person.grade)
}
```

> 提示：任何类型与any类型进行联合操作得到的新类型是 any 类型，任何非 never 类型与 never 类型进行联合操作得到的新类型是非 never 类型。

## 交叉类型

在 TypeScript 中，用 & 操作符连接两个类型，它会返回一个新的类型，这个新类型被称为交叉类型，它包含了两种类型中的属性，能与这两种类型中的任何一种兼容。交叉类型相当于将两个类型的属性合在一起形成一个新类型。

当两个接口交叉时，这两个接口中的公共属性也会交叉，接口交叉与接口扩展有些类似，不同点是：如果扩展的接口中存在同名但是不兼容的属性，那么不能进行接口扩展，但是能够进行接口交叉，如代码清单15所示。

代码清单15

```typescript
interface User {
    name: string;
    age: number
}

interface Student {
    name: string;
    age: string;
    grade: number;
}

// 不能进行接口扩展，因为 User 和 Student 中的 age 属性不兼容
interface TypeFromExtends extends User, Student {}

// 能够进行接口交叉
type TypeFromIntersection = User & Student
```

User 中的 age 是 number 类型，Student 中的 age 是 string 类型，User & Student 会导致 number & string，由于不存在一个值既是数值又是字符串，所以 number & string 返回的类型为 never。代码清单15中 TypeFromIntersection 的形状如下所示：

```typescript
interface TypeFromIntersection {
	name: string;
 	grade: number;
	age: never
}
```

> 提示：任何类型与 any 类型进行交叉操作得到的新类型是 any 类型，任何类型与 never 类型交叉操作得到的新类型是 never 类型。

## 泛型

泛型是指泛型类型，只存在于编译阶段，使用泛型能创建出可组合的动态类型，这提高了类型的可重用性。泛型有一个存储类型的变量，也可以将它称为类型参数，能在其他地方用它注释变量的类型。泛型可用在函数、接口、类等类型中，代码清单16是一个使用泛型的简单示例。

代码清单16。

```typescript
function genericFunc<T>(a: T):T {
    return a;
}
console.log( genericFunc<string>('a').toUpperCase() ) // lineA
console.log( genericFunc<number>(3).toFixed() ) // lineB
```

代码清单16，genericFunc 函数中的 T 是类型参数，在 lineA 调用 genericFunc 函数，T 是 string 类型，在 lineB 调用 genericFunc 函数，T 是 number 类型。

### 泛型函数

代码清单16中的 genericFunc 函数是一个泛型函数，它的函数类型为：`<T>(a: T) => T`。genericFunc 函数只有一个类型参数，实际上它可以用多个类型参数，并且参数名可以是任何合法的变量名，修改代码清单16使 genericFunc 有两个类型参数，修改结果如下：

```typescript
function genericFunc<T,U>(a: T, b: U): [T, U] {
    return [a, b];
}
console.log( genericFunc<string, number>('a', 3) ) // lineA
console.log( genericFunc(3, 'a')) // lineB
```

上述代码 lineB 的函数调用没有给类型参数传值，但它能够工作，这是因为 TypeScript 能推导出T为 number，U 为 string。

### 泛型接口

在前面介绍过可以用接口类型描述函数，实际上也能在接口中使用泛型语法描述泛型函数。示例代码如下：

```typescript
interface genericFunc {
    <T>(a: T): T
}
```

上述代码定义的 genericFunc 接口与代码清单16中的 genericFunc 函数类型一样。

在 TypeScript 中，接口类型用于限制对象的形状，对象可能有多个属性，可以用接口的类型参数去注释这些属性的数据类型。下面的示例将类型参数提升到接口名的后面，使得接口中的每个成员都能引用它。

```typescript
interface genericInterface<T> {
    a: T,
    getA: () => T
}

// 给接口传递类型变量
const myObj: genericInterface<number> = { // lineA
    a: 2,
    getA: () => {
        return 2
    }
}
```

上述代码，当在 lineA 使用 genericInterface 泛型接口时，将 number 类型传递给了 T，所以 myObj 的 a 属性必须是 number 类型，并且 getA 方法的返回值的类型也必须是 number 类型。

接口可以有类型参数，接口中的函数字段也能有自己的类型参数，示例代码如下：

```typescript
interface genericInterface<T> {
    a: T,
    printInfo<U>(info: U): void
}

const myObj2: genericInterface<number> = { // lineA
    a: 3,
    printInfo: <U>(info: U): void => {
        console.log(info)
    }
}

myObj2.printInfo<string>('e') // lineB
```

上述代码中类型参数T是接口的类型参数，在使用接口的时候就要传，参数类型 U 是 printInfo 方法的类型参数，在调用 printInfo 方法的时候传，U 与 T 不同的是，U 只能在 printInfo 函数中使用，而 T 可以在接口的所有成员上使用。

### 泛型类

泛型类与泛型接口类似，它也将类型参数放在类名的后面，在类的所有实例字段中都能使用类的类型参数，但在静态字段中不能使用类的类型参数。示例代码如下：

```typescript
class Information<T, U> {
    detail: T;
    title: U;
    constructor(detail: T, title: U) {
        this.detail = detail
        this.title = title
    }
}

// 在实例化类的时候将类型传给类型参数
new Information<string, string>('detail', 'title')
```

当泛型类存在继承关系时，父类的类型参数通过子类传递给它。示例代码如下：

```typescript
class SubClass<C, K> extends Information<C, K> {/* do something*/}

new SubClass<number, string>(2,3)
```

上述代码在实例化 SubClass 时，将 number 传给了 C，将 string 传给了 K，然后 C 和 K 又传给 Information。

> 补充：定义泛型函数，泛型接口和泛型类的语法或多或少存在差异，但有一个共同点是，它们的类型参数是在使用泛型的时候传，而非在定义泛型的时候传，这使泛型具有动态性，提高了类型的可重用性。

### 在工厂函数中使用泛型

类类型由静态端类型和实例端类型两部分组成，现在将泛型运用到工厂函数中，让它接受任何类作为参数，并返回该类的实例。示例代码如下：

```typescript
class User{/**do something */}
class Tools{/**do something */}

function genericFactory<T>(Ctor: new () => T):T {
    return new Ctor()
}

const user: User = genericFactory<User>(User) // lineA
const tools: Tools =  genericFactory<Tools>(Tools) // lineB
```

上述代码中，genericFactory的类型参数T必须是类的实例端类型，通过类名就能引用到类的实例端类型，所以在lineA和lineB分别将User和Tools传给了T。

### 泛型约束

extends 关键字可用于接口扩展和类扩展，这个关键字也能用于约束泛型类型参数的值，比如：`<T extends User,K>`，这意味着T的值必须扩展自 User 类型，而 K 的值可以是任何合法的类型。下面是用 extends 关键字进行类型约束的示例代码：

```typescript
interface User {
    name: string
}

interface Student extends User {
    age: number
}
const ci = {
    name: 'Ci',
    age: 2
}

// T 的值必须扩展自 User 类型，K 的值可以是任何类型
function print<T extends User, K>(user: T, b: K): void{/**do somethine */}
print<Student, string>(ci, '3') // 没毛病
print<string, string>('tt', 'kk') // 不满足泛型约束，因为 string不是扩展自 User
```

上述代码中的类型参数T扩展自User接口，实际上泛型类型参数能扩展自任何合法的 TypeScript 类型，比如：字符串，联合类型，函数类型等。

> 补充：如果泛型约束是：`<T extends string | number>`，那么T的值可以是任何字符串或者数值。

### 在泛型约束中使用类型参数

在前面的内容中介绍过，类型参数是一个变量，可以用它注释其他变量的类型，它也能约束其他类型参数。用法如下：

```typescript
function callFunc<T extends FuncType<U>, U>(func: T, arg: U): void
interface myInterface<C, K extends keyof C>
```

上述代码中的 callFunc 有两个类型参数，分别是T和U，U可以是任何类型，T 必须扩展自 `FuncType<U>`，`FuncType<U>`中的 U 指向 callFunc 的类型参数 U。myInterface 也有两个类型参数，分别是 C 和K ，K 扩展自 keyof C，keyof C 中 C 指向 myInterface 的类型参数 C。

### 在泛型中使用条件类型

条件类型的语法为：`Type1 extends Type2 ? TrueType: FalseType`，如果 Type1 扩展自 Type2，那么表达式将得到 TrueType，否则得到 FalseType，这个表达式只存在于编译阶段，并且只用于类型注释和类型别名。下面是一个将条件类型与泛型配合使用的示例：

```typescript
type MyType<T> = T extends string ? T[]: never[];

let stringArr: MyType<string> // string[]
let numberArr: MyType<number> // never[]
let unionArr: MyType<1|'1'|string> // never[] | string[]
```

上述代码中的 MyType 接受一个类型参数T，在编译阶段 TypeScript 会根据 T 是否继承自 string，去动态的计算出 MyType 的数据类型。如果 T 是联合类型，那么会判断联合类型中的每一个成员类型是否扩展自 string，所以最后一行中的 unionArr 类型为 never[] | string[]。