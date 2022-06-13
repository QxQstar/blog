# 类型兼容

TypeScript 的类型系统是一个结构化的类型系统，它确定类型是否兼容的最基本规则是，如果两个类型具有相同的形状，那么就认为这两个类型是兼容的，不兼容的类型之间不能赋值。

## 基本数据类型的兼容性

基本数据类型的兼容性可以总结为以下几个规则

* boolean、string、number、bigint、symbol、object 类型相互不兼容。
* any 和 unknown 类型是超类型，任何数据类型都能赋值给这两个类型，any 能够赋值给其他的类型，unknown 类型只能赋值给 any 类型。
* 当 strictNullChecks 为 false 时，可以将 null 和 undefined 赋给除 never 类型之外的任何类型，但不能将 any 和 unknown 之外的其他类型赋值给它们。
* 当 strictNullChecks 为 true 时，undefined 不能赋值给 any、unknown 和 void 之外的其他类型。
* never 类型能赋值给其他类型，但其他类型不能赋值给 never 类型。

## 枚举的兼容性

枚举类型与 number 类型相互兼容，不同枚举类型之间不兼容。

## 接口的兼容性

这里的接口类型不包含用接口描述函数，函数的兼容性会单独介绍。只要接口的形状相同，那么接口就是兼容的，具有相同的形状意味着两种类型具有相同的成员名，并且每个成员具有相同的类型。具有较多成员的接口能兼容具有较少成员的接口，反之不兼容。示例代码如下：

```typescript
interface User {
 name: string;
}
interface Student {
 name: string;
 age: number
}
```

Student 接口中包含了 User 接口中的字段，并且相同字段的类型兼容，所以 Student 接口兼容 User 接口，但是 User 接口不兼容 Student 接口。

## class的兼容性

class 类型由实例端类型和静态端类型两部分组成，在这里介绍 class 实例端类型的兼容性，class 实例端类型的兼容性与接口的兼容性类似，不同点是：如果 class 存在私有的实例成员和受保护的实例成员，那么它们必须源于同一个 class，而公共的实例成员没有这个限制。

## 泛型的兼容性

如果泛型类型参数没有在泛型中使用，那么类型参数不影响泛型的兼容性，示例代码如下：

```typescript
interface Generic1<T> {
    name: string
}

// Generic1<number> 与 Generic1<string> 兼容
const one: Generic1<string> = {name: 'one'}
const two: Generic1<number> = one 

interface Generic2<T> {
    name: T
}

// Generic2<number> 与 Generic2<string> 不兼容
const three: Generic2<string> = {name: 'one'}
const four: Generic2<number> = one 
```

## 函数的兼容性

函数类型由参数列表和返回值类型两部分决定，参数名不影响函数的类型，只有当源类型与目标类型的参数列表和返回值都兼容时，源类型才兼容目标类型，但这不意味着目标类型兼容源类型。

当函数的参数列表相同，但返回值类型不同时，函数的兼容性示例代码如下：

```typescript
let func1: () => string = () => {return '1'}
let func2: () => number = () => {return 1}

// func1 返回 string类型，func2 返回 number类型，它们相互不兼容
func1 = func2 // 不能赋值
func2 = func1 // 不能赋值

let func3: (x: string) => {id: string} = (x: string) => ({id: '1'})
let func4: (x: string) => {id: string, name: string} = (x: string) => ({id: '1', name: 'Bella'})

// func4 的类型兼容 func3 的类型
func3 = func4 // 能赋值
// func3 的类型不兼容func4 的类型
func4 = func3 // 不能赋值
```

func4 的返回值比 func3 的返回值多了一个 name 字段，由于 TypeScript 是结构化的类型系统，所以 func4 的返回值兼容 func3 的返回值，反之不兼容。

函数的参数列表兼容性比返回值的兼容性更复杂，这是因为参数列表的情况比较多，总体而言分为下面这3种情况：

1. 函数的参数全部是必填的并且数量一样

这种情况最简单，从左到右依次比较参数的类型，如果每个参数的类型都兼容，那么这两个函数类型彼此兼容，它们可以相互赋值。

2. 函数的参数全部是必填的，但是数量不一样

如果相同位置上的参数类型不兼容，那么这两个函数类型相互不兼容，它们不能相互赋值；如果相同位置上的参数类型兼容，那么参数较少的函数类型能够赋值给参数较多的函数类型，反之则不能赋值。示例代码如下：

```typescript
let func1: (a: string, b: number) => void = (a: string, b: number) => {console.log(a, b)}
let func2: (a: string) => void = (a: string) => {console.log(a)}

func1 = func2 // 可以赋值
func2 = func1 // 不能赋值
```

3. 函数的可选参数

如果源函数的可选参数在目标函数上同一位置没有找到，那么源函数可以赋值给目标类型，如果找到了但参数类型不一样，那么不能赋值。示例代码如下：

```typescript
let func1: (a: string, b?: number) => void = (a: string, b?: number) => {console.log(a, b)}
let func2: (a: string) => void = (a: string) => {console.log(a)}


func1 = func2 // 能赋值
func2 = func1 // 能赋值
```

> 补充：函数的reset参数，同等于无限个可选参数。重载函数具备多个函数签名，只有当源函数的每一个签名都能在目标函数上找到兼容的签名时，才能将源函数赋给目标函数，否则不能赋值。