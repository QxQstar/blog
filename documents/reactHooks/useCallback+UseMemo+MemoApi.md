# useMemo,useCallback,React's memo API 很香?

## 在 React 中怎么使用 useMemo

React 中的 useMemo 被用于优化 React 函数组件的计算性能。接下来我们将会通过一个例子来说明函数组件的性能问题，然后再使用 useMemo 来解决它。

注意：在 React 中大多数性能优化都是不够成熟的。React 是很快的，哪怕不做任何性能优化。

注意：不要将 React 的 useMemo Hook 与 React 的 memo API 混淆了。useMemo 被用于缓存值，memo API 被用于包裹 React 组件去阻止组件重新渲染。

注意：不要将 React 的 useMemo Hook 与 React 的 useCallback Hook 混淆了。useMemo 被用于缓存值，useCallback 被用于缓存函数。

让我们以下面的React应用程序为例，在这个例子中渲染了一个用户列表，并且我们可以使用用户名去过滤用户，在点击按钮时才发生过滤，在输入框中输入用户名时不过滤。代码如下：

```javascript
import React from 'react';
 
const users = [
  { id: 'a', name: 'Robin' },
  { id: 'b', name: 'Dennis' },
];
 
const App = () => {
  const [text, setText] = React.useState('');
  const [search, setSearch] = React.useState('');
 
  const handleText = (event) => {
    setText(event.target.value);
  };
 
  const handleSearch = () => {
    setSearch(text);
  };
 
  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(search.toLowerCase());
  });
 
  return (
    <div>
      <input type="text" value={text} onChange={handleText} />
      <button type="button" onClick={handleSearch}>
        Search
      </button>
 
      <List list={filteredUsers} />
    </div>
  );
};
 
const List = ({ list }) => {
  return (
    <ul>
      {list.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};
 
const ListItem = ({ item }) => {
  return <li>{item.name}</li>;
};
 
export default App;
```

虽然每一次往输入框中输入值时 filteredUsers 的值不会发生变化，但是 filter 的回调函数在每一次往输入框中输入值时都会执行。我们可以这样修改代码：

```javascript
function App() {
  ...
 
  const filteredUsers = users.filter((user) => {
    console.log('Filter function is running ...');
    return user.name.toLowerCase().includes(search.toLowerCase());
  });
 
  ...
}
```

在这个小的 React 应用程序中这不是什么大的问题，但是如果在数组中有一批大的数据并且在每一次键盘输入时 filter 的回调函数都会执行，我们可能会感觉到应用程序很慢。因此，我们使用 React 的 useMemo Hook 缓存函数的返回值，仅仅在 useMemo 依赖项发生变化的时候函数才会重新运行，从上面的代码中我们可以看出 filter 的回调函数的依赖项是 `search`。所以使用 useMemo 代码如下：

```javascript
function App() {
  ...
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
        console.log('Filter function is running ...');
        return user.name.toLowerCase().includes(search.toLowerCase());
    })
  },[search])
  ...
}
```

现在，filter 的回调函数仅仅在`search`发生变化时才会执行，`text`的值发生变化时函数不会执行，因为`text`不是 useMemo 的依赖项。你可以自己尝试一下，现在往输入框中输入值时控制台上不会出现 `console.log` 的打印值，仅仅到点击按钮时才会有打印。

你可能会想知道为什么不在所有的值计算中使用 useMemo Hook 或者 React 为什么不默认给所有的值计算使用 useMemo Hook。这是因为在每一次组件重新渲染时，useMemo Hook都会比较依赖数组中的每一个依赖项以决定是否要重新计算值，进行依赖项的比较可能会重新计算值更耗费性能。

总结：如果给 useMemo 传递了依赖项数组，只有在依赖项发生变化时 useMemo 才会重新计算新的值（如果依赖项数据是个空数组，只在组件第一次渲染时计算值），如果没有给 useMemo 传递依赖数组，在每一次渲染时都会重新计算新的值。