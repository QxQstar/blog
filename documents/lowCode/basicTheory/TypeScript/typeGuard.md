# 类型断言 VS 类型守卫

## 类型断言

类型断言有两种写法，分别为`value as Type`和`<Type>value`，它让 TypeScript 编译器将 value 当作 Type 类型。类型断言是一个编译时特性，不进行类型转换，因此不会影响变量在运行时的数据类型。如果某变量是 any 类型，但现在你知道它确切的数据类型，使用类型断言能让 IDE 有代码提示的能力，也能让 TypeScript 编译器进行类型检查。

类型断言的用法如下：

```typescript
const age: any = 23.44;
const user: any = {age: 2}

// age 的 原始数据类型是 any ，在这里将它断言为 number 类型
(age as number).toFixed(0);
(<number>age).toFixed(0);

// 将user断言为非null和非undefined
user!.age
```

除非确切的知道变量的数据类型，否则不要使用类型断言，这是因为类型断言会让 TypeScript 编译器将变量当做指定的类型，而不管它实际的类型，在程序运行时可能有类型错误。

## 类型守卫

类型守卫的工作是将数据类型收窄，比如，变量 age 的数据类型可能是 string 也可能是 number，现在要将 age 收窄为 string 类型，类型守卫能实现它。总体而言，有4种方式让数据类型收窄。

### 使用 in 关键字

如果某变量的数据类型是联合类型，并且该变量存在一个属性绝对不会出现在联合类型的其他成员类型上，那么可以使用 in 关键字将类型收窄。用法如下：

```typescript
function printType(value: User | Student) {
    // grade 只存在 Student 类型上
if ('grade' in value) { 
        // 在 if 块中，value 的数据类型被收窄为 Student 类型
        console.log('它是 Student 类型',value.name + ':' + value.grade)
    } else {
	// 在 else 块中，value 的数据类型被收窄为 User 类型
        console.log('它是 User 类型',value.name)
    }
}
```

### 使用 instanceof 关键字

用 in 关键字收窄数据类型有局限性，必须有一个独特的属性作为判别符，否则，不能用 in 关键字收窄。如果正在处理的变量是类的实例，那么可以用 instanceof 关键字收窄数据类型。用法如下：

```typescript
function printInfo(value: Staff | Student) {
    if (value instanceof Staff) {
        // 在 if 块中，value 的数据类型被收窄为 Staff 类型
        console.log('它是 Staff 类型')
    } else {
        // 在 else 块中，value 的数据类型被收窄为 Student 类型
        console.log('它是 Student 类型')
    }
}
```

### 使用 typeof 关键字

使用 typeof 能得到值的数据类型，如果变量的类型为基本类型，如：string、number 等，使用 typeof 也能将数据类型收窄。用法如下：

```typescript
function printType(value: string | number) {
    if (typeof value === 'string') {
        // value 的类型被收窄为 string
        console.log('value 是 string 类型')
    } else {
        // value 的类型被收窄为 number
        console.log('value 是 number 类型')
    }
}
// 用对象上某个字段收窄数据类型
//如果 User 类型的 name 字段为 string 类型，Student 类型的 name 字段为 number 类型
function printObjType(obj: User | Student) {
    if (typeof obj.name === 'string') {
        // value 的类型被收窄为 User
    } else {
        // value 的类型被收窄为 Student
    }
}
```

### 自定义类型守卫

用 in、instanceof 和 typeof 关键字收窄数据类型语法很简单，但都有各自的局限性。如果它们不能当作类型守卫，那么能使用 is 关键字自定义类型守卫，写法为：parameter is Type，这种写法被称为类型谓词，要将它放在函数返回值的位置。类型谓词所在的函数被称为类型谓词函数，它的返回值必须为 boolean 类型。类型谓词中的 Type可以是任意合法的 TypeScript 数据类型，parameter 可以是函数的参数也能是 this 关键字。

当类型谓词中的 parameter 是函数的参数，用法如下：

```typescript
function predicateStudent(value: Student | User): value is Student {
    return typeof (value as any).garde === 'number'
}
function printObjType(obj: User | Student) {
    if (predicateStudent(obj)) {
        // obj的类型被收窄为 Student
    } else {
        // value 的类型被收窄为 User
    }
}
```

上述代码中的 predicateStudent 是类型谓词函数，如果它返回 true，那么参数的数据类型被收窄为 Student。

当类型谓词中的 parameter 是 this 关键字，这种用法通常出现在类的方法中，用法如下：

```typescript
abstract class User {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    isStudent(): this is Student {
        return this instanceof Student;
    }
    isStaff(): this is Staff {
        return this instanceof Staff; 
    }
}

class Student extends User{
    grade: number;
    constructor(name: string, grade: number) {
        super(name)
        this.grade = grade
    }
}

class Staff extends User {
    salary: number;
    constructor(name: string, salary: number) {
        super(name)
        this.salary = salary
    }
}

function printObjType(obj: User) {
    if (obj.isStaff()) {
        // obj 的类型被收窄为 Staff
    } else if (obj.isStudent()){
        // obj 的类型被收窄为 Student
    }
}
```

上述代码中的 User 是抽象类，不能被实例化，Staff 和 Student 都继承自 User。实例方法 isStaff 用于将类型收窄为 Staff，实例方法 isStudent 用于将类型收窄为 Student。

## 总结

在项目中，如果某变量有多种数据类型，不建议使用类型断言将它断言成特定的类型，而是使用类型守卫根据实际情况将类型收窄，然后按不同的类型分别处理。类型守卫能让应用程序的数据类型更安全，不至于程序在编译阶段不报错，但在运行阶段报错。
