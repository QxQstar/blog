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

总结：如果给 useMemo 传递了依赖项数组，只有在依赖项发生变化时 useMemo 才会重新计算新的值（如果依赖项数据是个空数组，只在组件第一次渲染时计算值），如果没有给 useMemo 传递依赖数组，在每一次渲染时都比重新计算新的值。

## 在 React 中怎么使用 memo API

在 React 中可以用 memo API 来优化函数组件的渲染行为。接下来我们将会通过一个例子来说明函数组件的性能问题，然后再使用 memo API 来解决它。

让我们以下面的React应用程序为例，在这个例子中渲染了一个用户列表，我们可以往用户列表中新增用户。代码如下：

```javascript
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
 
const App = () => {
  console.log('Render: App');
  const [users, setUsers] = React.useState([
    { id: 'a', name: 'Robin' },
    { id: 'b', name: 'Dennis' },
  ]);
 
  const [text, setText] = React.useState('');
 
  const handleText = (event) => {
    setText(event.target.value);
  };
 
  const handleAddUser = () => {
    setUsers(users.concat({ id: uuidv4(), name: text }));
  };
 
  return (
    <div>
      <input type="text" value={text} onChange={handleText} />
      <button type="button" onClick={handleAddUser}>
        Add User
      </button>
 
      <List list={users} />
    </div>
  );
};
 
const List = ({ list }) => {
  console.log('Render: List');
  return (
    <ul>
      {list.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
};
 
const ListItem = ({ item }) => {
  console.log('Render: ListItem');
  return <li>{item.name}</li>;
};
 
export default App;
```

你会发现每往输入框中输入一个字符，所有的组件都会重新渲染

```j
// 往输入框中输入一个字符之后
 
Render: App
Render: List
Render: ListItem
Render: ListItem
```

在这个小的 React 应用程序中这不会有射门问题，但是如果这里是一个大的用户列表，用户在往输入框中输入字符就会感觉到慢，在这个时候我们可以使用 memo API 进行优化。改写代码如下：

```javascript
const List = React.memo(({ list }) => {
  console.log('Render: List');
  return (
    <ul>
      {list.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});
 
const ListItem = ({ item }) => {
  console.log('Render: ListItem');
  return <li>{item.name}</li>;
};
```

现在我们往输入框中输入字符，仅仅 App 组件会被重新渲染。React.memo 会检查 List 组件的 props 是否发生变化，如果没有变化会跳过 List 组件的重新渲染。在这个例子中，往输入框中输入字符不会导致 List 组件的 list prop 发生变化，所以 List 不会重新渲染，因而 ListItem 也不会重新渲染。看上去我们不需要给 ListItem 使用 memo API，但是如果往用户列表中新增一个用户，在控制台中你将看到以下输出:

```
// 添加一个新的用户之后
 
Render: App
Render: List
Render: ListItem
Render: ListItem
Render: ListItem
```

当添加一个新的用户会导致 List 组件被重新渲染，但是 ListItem 被渲染三次，我们希望只渲染一个新的用户,而不是所有的用户，所以使用 React.memo 改写 ListItem：

```javascript
const ListItem = React.memo(({ item }) => {
  console.log('Render: ListItem');
  return <li>{item.name}</li>;
});
```

经过改写，往用户列表中添加一个新的用户，你会看到如下的输出：

```
// a添加一个新的用户之后
 
Render: App
Render: List
Render: ListItem
```

只有新的 ListItem 被渲染了，用户列表之前的 ListItem 保持不变。

你可能会想知道为什么不在所有的组件中使用 memo API 或者 React 为什么不默认给所有的组件使用 memo API。这是因为 memo API 会将新的 props 与之前的 props 进行比较以决定是否重新渲染组件，进行 props 的比较可能比重新渲染更耗费性能。

总之，当你的 React 组件变慢并且您想要改进它们的性能时，React的 memo API 就会很有用。这通常发生在数据量大的组件中，比如在一个数据点发生变化时，许多组件必须重新渲染的巨大列表。

## 在 React 中怎么使用 useCallback

在 React 中可以用 useCallback hook 来优化函数组件的渲染行为。接下来我们将会通过一个例子来说明函数组件的性能问题，然后再使用 useCallback 来解决它。

注意：不要将 React 的 useCallback 与 useMemo 混淆，useCallback 用来缓存函数，useMemo 用来缓存值。

注意：不要将 React 的 useCallback 与 memo API 混淆, useCallback 被用于缓存函数，memo API 被用于包裹 React 组件去阻止组件重新渲染。

让我们以下面的React应用程序为例，在这个例子中渲染了一个用户列表，我们可以往用户列表中新增用户也可以从用户列表中删除用户。代码如下：

```javascript
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
 
const App = () => {
  console.log('Render: App');
  const [users, setUsers] = React.useState([
    { id: 'a', name: 'Robin' },
    { id: 'b', name: 'Dennis' },
  ]);
 
  const [text, setText] = React.useState('');
 
  const handleText = (event) => {
    setText(event.target.value);
  };
 
  const handleAddUser = ()  =>{
    setUsers(users.concat({ id: uuidv4(), name: text }));
  };
 
  const handleRemove = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };
 
  return (
    <div>
      <input type="text" value={text} onChange={handleText} />
      <button type="button" onClick={handleAddUser}>
        Add User
      </button>
 
      <List list={users} onRemove={handleRemove} />
    </div>
  );
};
 
const List = ({ list, onRemove }) => {
  console.log('Render: List');
  return (
    <ul>
      {list.map((item) => (
        <ListItem key={item.id} item={item} onRemove={onRemove} />
      ))}
    </ul>
  );
};
 
const ListItem = ({ item, onRemove }) => {
  console.log('Render: ListItem');
  return (
    <li>
      {item.name}
      <button type="button" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </li>
  );
};
 
export default App;
```

如果你在一个 react 应用中写入上面的代码，你会发现每次往输入框中输入字符，控制台都会打印：

```
Render: App
Render: List
Render: ListItem
Render: ListItem
```

我们希望往输入框中输入字符，只是 App 组件重新渲染，App 的子组件不重新渲染。根据上文的介绍，我们使用 memo API 来阻止子组件的更新，于是改写 List 和 ListItem 组件：

```javascript
const List = React.memo(({ list, onRemove }) => {
  console.log('Render: List');
  return (
    <ul>
      {list.map((item) => (
        <ListItem key={item.id} item={item} onRemove={onRemove} />
      ))}
    </ul>
  );
})

const ListItem = React.memo(({ item, onRemove }) => {
  console.log('Render: ListItem');
  return (
    <li>
      {item.name}
      <button type="button" onClick={() => onRemove(item.id)}>
        Remove
      </button>
    </li>
  );
});
```

经过改写之后你发现每往输入框中输入一个字符，List 和 ListItem 还是会重新渲染。

让我们看一下传递给 List 组件的 props

```javascript
const App = () => {
  // How we're rendering the List in the App component 
  return (
    //...
    <List list={users} onRemove={handleRemove} />
  )
}
```

只要没有从 List 组件中添加或删除任何项，即使用户在输入框中输入一些内容后 App 组件重新渲染，List 也应该保持原样。因此，罪魁祸首是 onRemove 回调处理程序。

每当用户在输入框中输入一些内容后 App 组件重新渲染，App 组件中的 handleRemove 都会被重新定义。往 List 组件中传递一个新的函数作为 prop，它注意到一个 prop 与之前的渲染相比发生了变化。这就是每当用户在输入字段框中输入一些内容后 List 和 ListItem 会重新渲染的原因。

现在我们使用 useCallback Hook 改写代码：

```javascript
const App = () => {
  ...
  // 依赖项数组作为 useCallback 的第二个参数
  const handleRemove = React.useCallback(
    (id) => setUsers(users.filter((user) => user.id !== id)),
    [users]
  );
  ...
};
```

依赖项数组中的任何一项发生变化都会导致 handleRemove 被重新定义。如果 users 被改变了，handleRemove 会被重新定义，List 和 ListItem 也应该被重新渲染。用户在输入框中输入一些内容不会导致 handleRemove 被重新定义，它保持原样。子组件的 prop 不会发生改变，所以不会重新渲染。

你可能会想知道为什么不在所有的函数中使用 useCallback Hook 或者 React 为什么不默认给所有的函数使用 useCallback Hook。这是因为在每一次重新渲染时 useCallback Hook 会比较依赖数组中的每一个依赖项以决定是否要重新定义函数，进行依赖项的比较可能比重新定义函数更耗费性能。

总之，React 的 useCallback Hook 用于缓存函数。当函数被传递给其他组件而不用担心函数会因为父组件重新渲染而被重新初始化。然而，正如你所看到的，当与 React 的 memo API 一起使用时，React 的 useCallback 钩子开始发挥作用

总结：如果给 useCallback 传递了依赖项数组，只有在依赖项发生变化时 useCallback 才会重新定义函数（如果依赖项数据是个空数组，只在组件第一次渲染时重新定义函数），如果没有给 useCallback 传递依赖数组，在每一次渲染时都比重新定义函数。useCallback(fn, deps) 等同于 useMemo(() => fn, deps)。