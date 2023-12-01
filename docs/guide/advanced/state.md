# History State

You can utilize the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)'s state within Vue Router State. This allows you to attach arbitrary information to your navigations. This state is kept across refreshes and when using the browser's back/forward buttons.

This can be useful for things like keeping track of what filters the user has selected, or what page the user was on before they were redirected to an error or login page.

This can be achieved through the `state` property of a Location which accepts an object of properties and can be accessed on the route location and navigation guards. You can define `state` in `RouterLink`s, `router.push`, and `router.replace`:

```vue
<router-link
  :to="{ name: 'login', state: { from: $route.fullPath } }"
>Login</router-link>
```

Programatic navigation

```js
router.push({ to: 'login', state: { from: route.fullPath } })
```

You can access state via the `route.state` property

You could even move a state value onto your component's props via [Props function mode](../essentials/passing-props.html#function-mode):

```js
const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: SearchUser,
      props: (route) => ({ from: route.state?.path }),
    },
  ],
})
```

Note: Replace _will_ reset the history state unlike in the original vue-router-2-state

```html
<router-link :to="{ path: '/abc'}" replace></router-link>
```
