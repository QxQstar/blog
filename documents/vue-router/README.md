# vue-router 源码解读

## vue.use(VueRouter)

VueRouter 作为 Vue 的一个插件，是通过 vue.use(VueRouter) 进行注册，调用 vue.use(VueRouter) 会给每个组件 mixin 两个钩子函数，分别是 beforeCreate 和 destroyed，并且在 vue.use(VueRouter) 时也会在 Vue.prototype 上定义 $router 和 $route，全局注册 RouterView 和 RouterLink。

```js
Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
```

## matcher

在 VueRouter 的构造函数中会创建 matcher,由于 routes 是一个树状结构的数组，所有在创建 matcher 的过程中会递归遍历所有的 routes 和 routes.children，最终生成 nameMap，pathMap，pathList。

### 为什么嵌套路由的子路径的 path 可以不用 `/` 开头

因为在生成 matcher 时，在递归遍历的过程中，如果 child.path 不是以 `/` 开头，就会将 child.path 改成 parent.path + '/' + child.path

```js
function normalizePath (
  path: string,
  parent?: RouteRecord,
  strict?: boolean
): string {
  if (!strict) path = path.replace(/\/$/, '')
  if (path[0] === '/') return path
  if (parent == null) return path
  return cleanPath(`${parent.path}/${path}`)
}
```
