# Immutability

在 React 中，组件的 state 必须具备不变性，这意味着只能通过 immutable 的方式修改 state，而不能通过 mutable 的方式。本小节演示修改 state 的正确与不正确的方法。

为了说明 state 的组成结构，先定义个 State 接口，代码如下：

```javascript
    interface State {
        user: User
        hobbies: Hobby[]
        time: string
    }
```

从上述接口可以看出，组件有三个状态，分别为：user、hobbies 和 time，它们的数据类型各不相同。

## 用不正确的方式修改 state

下面罗列的案例试图用mutable的方式修改state，这些做法全部是错误的，组件不会重新渲染。

```javascript
// 案例一
this.state.user.age = 13
this.setState({
    user: this.state.user, 
})

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

案例一：修改 user 的内部结构，user 修改前后它们引用是一样的。案例二：Object.assign 使用错误。

如果你需要向父组件发送一些数据，或在父组件中触发一些东西，你可以通过传入一个函数作为道具，然后在需要与父组件通信时从子组件内部调用该函数。
一个非常常见的模式是将函数作为道具传递给子组件，它可以更新父组件的状态，然后在子组件中调用它。使用这个向下传递的函数来更新父节点的状态，并执行一个名为“提升状态”的函数。