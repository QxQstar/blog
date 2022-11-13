# React 状态的不变性

不变性对应的英文单词是 Immutability，它不是 React 中的概念，但它对写一个正确的 React 程序至关重要。不考虑生命周期函数 shouldComponentUpdate 对组件重新渲染造成的影响，当组件的 state 发生变化时，组件将被重新渲染。你可曾遇到过这样一种情况——你自认为改变了 state 的值，但是组件没有重新渲染？本文将揭露其中的缘由并介绍怎么编写符合 Immutability 原则的代码。

## 什么是 immutable

immutable 指不发生变化，这意味着创建新的值去替换原来的值，而非改变原来的值，与 immutable 相反的概念是 mutable，下面用代码演示 mutable 和 immutable。

```javascript
let user = {name: 'Bela'}
user.name = 'CI' // 改变user的name属性
user.age = 12 // 给user新增age属性
user = {name: 'Bela'} // 用新的值替换原来的值
```

上述代码第 2 行和第 3 行都属于改变原来的值，只有第四行是新建一个对象，用新对象替换原来的对象。下面调用函数进一步说明 immutable 与 mutable。

```javascript

function addAgeMutable(user: User) {
    user.age = 12 // 修改原来的
    return user
}

function addAgeImmutable(user: User) {
    const other = Object.assign({}, user) // 创建新的
    other.age = 12
    return other
}

let user1Original = {name: 'Bella'}
let user1New = addAgeMutable(user1Original) // 用 mutable 的方式

let user2Original = {name: 'Bella'}
let user2New = addAgeImmutable(user2Original) // 用 immutable 的方式

console.log('user1Original 与 user1New 相同吗?',user1Original === user1New) // true
console.log('user2Original 与 user2New 相同吗?',user2Original === user2New) // false
```

上述 addAgeMutable 函数直接在入参上新增 age 属性，但 addAgeImmutable 函数没有改变入参，而是新建了一个对象，在新对象上添加age属性。

总结一下，immutable 是指不修改原来的；mutable 是指在原来的基础上修改。通过 mutable 的方式修改变量会导致修改前后变量的引用不变。某些操作数组的方法会让原来的数组发生变化，比如：push/pop/shift/unshift/splice，这些方法是 mutable 的，而有一些操作数组的方法不会让原来的数组发生变化，而是返回一个新组件，比如：slice/concat，这些函数是 immutable 的。字符串、布尔值和数值操作都不改变原来的值，而是创建一个新的值。

## React 与 Immutability

在 React 程序中，组件的 state 必须具备不变性，接下来演示修改state的正确与不正确的方式。为了说明state的组成结构，先定义个State接口，代码如下：

```javascript
interface State {
  user: User
  hobbies: string[]
  time: string
}
```

从上述接口可以看出，组件有三个状态，分别为：user、hobbies 和 time，它们的数据类型各不相同。

### 修改 state 的错误案例

下面罗列的案例试图用 mutable 的方式修改 state，这些做法全部是错误的。

```javascript
// 案例一
this.state.user.age = 13
// 案例二
this.setState({
    user: Object.assign(this.state.user, {age: 13})
})

// 案例三
this.setState({
    hobbies: this.state.hobbies.reverse(),
})

// 案例四
this.state.hobbies.length = 0
this.setState({
    hobbies: this.state.hobbies,
})
```

* 案例一: 直接修改 user 的内部结构，修改前后 user 的引用不变。
* 案例二: 错误使用 Object.assign，Object.assign 将第二个参数的属性合并到第一个参数上，然后将第一个参数返回，这意味着案例二还是修改了user的内部结构，修改前后user的引用不变。
* 案例三: 使用reverse将数组翻转，它翻转的是原数组，翻转前后数据的引用不变。
* 案例四: 修改hobbies的长度，修改前后hobbies的引用一样。

上述四个案例都不符合数据一旦创建就不发生变化的原则，由于调用了 setState 方法，所以对于用 React.Component 创建的组件而言，不会发生故障，对于用 React.PureComponent 创建的组件，会引发故障，即：界面不更新。

### 修改 state 的正确案例

下面罗列的案例与错误案例一一对应，它们通过 immutable 的方式修改 state。

```javascript
    // 案例一
    this.setState({
        user: {...this.state.user, age: 13}
    })

    // 案例二
    this.setState({
        user: Object.assign({},this.state.user, {age: 13})
    })

    // 案例三
    this.setState({
        hobbies: [...this.state.hobbies].reverse()
    })

    // 案例四
    this.setState({
        hobbies: []
    })
```

上述案例都是新建一个值，用新的值替换原来的值，符合数据一旦创建就不发生变化的原则。

## 总结

在 react 应用中，更新 state 必须满足 Immutability 原则，因为 React.memo、PureComponent shouldComponentUpdate 和 React Hooks 通过`浅比较`确定 state 是否发生变更，如果变更 state 的方式不满足 Immutability 原则，它们会认为 state 的值没有变化。

在更新 state 并重新渲染时，React 会将类组件的 this.setState 与函数组件的 useState、useReducer hooks 区别对待。在函数组件中，React 要求所有 hooks 更新状态必须返回一个新的引用作为状态值，如果 React 发现状态更新来自 hook，它会检查该值的引用是否与以前的引用相同，如果相同，它将退出该函数组件的渲染流程，最终用户界面不更新。使用 this.setState 更新类的 state，React 并不关心状态的引用是否变化，只要在类组件中调用 this.setState，该组件一定会重新渲染。
