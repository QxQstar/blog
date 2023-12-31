# cookie

http 是无状态的，所以引入了 cookie 来管理服务器与客户端之间的状态。与 cookie 相关的http首部字段有：

1. Set-Cookie: 它一个响应首部字段，从服务器发送到客户端，当服务器想开始通过 cookie 进行状态管理，它就会向客户端发送 Set-Cookie 字段。
2. Cookie: 它是一个请求首部字段，从客户端发送到服务器

cookie 保存在客户端，并且绑定在特定域名下的（即：有效域名），当向 cookie 的有效域名发送请求时，都会带上这个 cookie。

## Set-Cookie 字段的属性：

1. NAME=VALUE:指定 cookie 的名称和值，名称大小写不敏感，值必须经过 URL 编码。
2. domain=域名：cookie 的有效域名，所有向该域发送的请求中都会包括这个 cookie  信息，这个值可以包含子域(如：www.baidu.com，那么这个 cookie 的有效域就是 www.baidu.com), 也可以不包含子域(如：.baidu.com，那么这个 cookie 对所有的 baidu.com 的子域都有效)，如果没有指定这个值，它的默认值为设置 cookie 的那个域。正是因为这一限制，cookie 是不能跨域的（ www.qq.com 不能访问到 www.baidu.com 下的 cookie ）
3. path=路径：用于指定向域中的哪个路径发送请求时，应该带上这个 cookie，如果不指定，默认为当前目录及其子目录有效。例如，你可以指定 cookie 只有从 www.baidu.com/one/ 中才能访问，那么 www.baidu.com 的页面就不能发送 cookie
4. expires=Date：cookie 的有效时间(即：何时应该停止向服务端发送这个 cookie)，如果 cookie 的有效时间为 0，那么浏览器会话结束就会删除该 cookie；如果将 cookie 的有效时间设置为一个过去的时间，那么这个 cookie 会立即被删除
5. Secure:仅在 HTTPS 安全通信时才会发送 cookie
6. HttpOnly:该 cookie 不能被脚本访问

```
例子   Set-Cookie:myCookie=123;domain=www.baidu.com;path=/one/;expires=Mon,22-Jan-07 07:10:24 GMT;Secure;HttpOnly
```

>补充：一旦 Cookie 从服务器发送到客户端，服务器就不能显示的删除该 cookie，但是可以覆盖已经过期的 Cookie，通过这种方式实现对客户端 cookie 的删除


## Javascript中的Cookie

在 js 中可以通过 document.cookie 访问 cookie，这个属性会返回当前页面可用的所有 cookie，用逗号分割的名-值队。所有的名字和值都是通过 URL 编码的，所有必须通过 decodeURIComponent() 解码。

document.cookie 除了可以获取现有的 cookie，还能设置新 cookie，新的 cookie 会被添加到现有的 cookie 集合中，document.cookie 不会覆盖 cookie 除非设置的 cookie 名称已经存在