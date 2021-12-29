# class

在正式介绍 Javascript 中的 class 语法之前，我先提一个问题：Javascript 是一门面向对象编程的语言吗？你看了这一小节的标题，可能会觉得这是一个无意义的问题，但是请好好思考一下这个问题。

现在我来揭晓答案了，Javascript 是一门面向对象编程的语言。在维基百科上搜索 Object-oriented programming，可以得到下面一段描述：

Languages that support object-oriented programming (OOP) typically use inheritance for code reuse and extensibility in the form of either classes or prototypes.

上面这段话的意思是：支持面向对象编程的语言通常以类继承或原型继承的形式来实现代码重用和可扩展。

对于习惯使用 JavaScript 编程的工程师而言，当看到`原型`这两个字你一定会觉得很亲切。如果你现在还不清楚原型这一概念，也没有关系，在这一章我会简单的介绍一下原型。你要记住原型和原型链是 JavaScript 中很重要的知识点，你需要将它搞清楚。

在 ES6 规范发布之前，如果有人问一名使用 JavaScript 的前端工程师，JavaScript 是原型继承还是类继承？他很大几率会说，JavaScript 是原型继承。这是因为在 ES6 规范发布之前，Javascript 没有 class 语法，class 语法被加入了 ES6 规范之后，JavaScript 才有了`类`这一概念。那么 class 语法是否将 JavaScript 从原型继承变成了类继承呢？下面我们来探讨一下。

## class 语法是原型继承还是类继承？

让我们一起在事例代码中寻求真相吧。

在下面，我用 class 语法定义了一个叫做 User 的类，User 有两个实例属性，分别是：name 和 age，另外 User 还有一个叫做 sayName 的实例方法。

```javascript
class User {
    name;
    age;
    
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayName() {
        return this.name
    }
}

// 使用 User 类实例化一个对象，赋值给 user1
const user1 = new User('小明', 25);
// user1 是 User 类的实例吗？
console.log(user1 instanceof User); // true
console.log(user1);
```

将上面的代码放在浏览器中执行，得到的结果如下图所示:

![](./img/class-result.png)

可以看到 user1 有 age 属性、 name 属性和 `[[Prototype]]` 属性，`[[Prototype]]`是一个 Object，sayName 方法位于 user1.`[[Prototype]]` 上，并且 `[[Prototype]]` 属性下也有一个名为 `[[Prototype]]` 的属性，它还是对象。

接下来我使用构造函数来实现 User 类相同的功能，代码如下

```javascript
function User(name, age){
    this.name = name;
    this.age = age;
}

User.prototype.sayName = function() {
    return this.name;
}

// 使用 new 关键字调用 User 函数，并将结果赋值给变量 user2
var user2 = new User('小明', 25);
// user2 是 User 构造函数的实例吗？
console.log(user2 instanceof User) // true
console.log(user2);
```

将上面的两段代码放在浏览器中执行，得到的结果如下图所示:

![](./img/prototype-result.png)

前面两张图得到的结果是类似的，都有 `[[Prototype]]` 属性，并且 use1 和 user2 的数据结构也差不多。

现在我将 class 语法与构造函数混合使用，代码如下：

```javascript
// 这是构造函数
function User(name, age){
    this.name = name;
    this.age = age;
}

User.prototype.sayName = function() {
    return this.name;
}

// 用 class 语法定义一个 Student 类，Student 类继承自 User
class Student extends User{
    grade
    constructor(grade, name, age) {
        super(name, age);
        this.grade = grade;
    }

    getGrade() {
        return this.grade;
    }
}

const student = new Student(6, '小明', 12);
// student 是 Student 类的实例吗？
console.log(student instanceof Student); // true
// student 是 User 构造函数的实例吗？
console.log(student instanceof User); // true
console.log(student);
```

在上面的代码中我使用了 class 语法中的 extends 关键字 ，现在先去不管它的用法，在后面的内容中我会详细介绍 class extends 的相关内容，现在先在浏览器中运行上述代码，看一下会不会报错，运行的结果如下：

![](./img/class-prototype-result.png)

这个例子让我们知道，class 语法与构造函数可以放在一起使用。结合前面三段代码，我们可以得出一个结论：**class 语法没有将 JavaScript 从原型继承变成了类继承**，即便 JavaScript 有了 class 语法，它依然是一种用原型继承的形式来实现代码重用和可扩展的面向对象的编程语言。

## class 只是语法糖吗？

有些时候有人会说，ES6 规范中的 class 语法是构造函数的语法糖，它只是语法糖吗？。在维基百科上搜索 Syntactic sugar，可以得到这样一段描述：

In computer science, syntactic sugar is syntax within a programming language that is designed to make things easier to read or to express. It makes the language "sweeter" for human use: things can be expressed more clearly, more concisely, or in an alternative style that some may prefer.

它的意思是：在计算机科学中，语法糖是编程语言中的语法，其设计目的是使内容更易于阅读或表达。使用语法糖可以将事物表达得更清楚、更简洁，或者用一些人们更喜欢的风格来表达。

换句话说，使用语法糖就是换一种表达方式，它让代码更易于阅读，它不会添加新的行为。

接下来我从 3 个方面来证明，class语法不仅仅是语法糖

1. 必须使用 new 关键字调用
2. class实例方法不可枚举
3. class 语法运行在严格模式下