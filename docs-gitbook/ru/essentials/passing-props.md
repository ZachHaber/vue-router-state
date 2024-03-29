# Передача входных параметров в компоненты маршрутов

Использование `$route` в вашем компоненте создаёт жёсткую связь с маршрутом, что ограничивает гибкость компонента, потому что он может быть использован только для определённых URL-адресов.

Для разделения компонента от маршрутизатора можно использовать входные параметры:

** Вместо жёсткой связи с `$route`**

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}
const router = new VueRouter({
  routes: [{ path: '/user/:id', component: User }],
})
```

** Разделяем с помощью входных параметров**

```js
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>',
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },

    // для маршрутов с именованными представлениями, необходимо указывать опцию `props` для каждого именованного представления:
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false },
    },
  ],
})
```

Это позволяет использовать компонент в любом месте, а также делает его проще для повторного использования и тестирования.

### Булево значение

Когда `props` установлены в `true`, значение `route.params` будут установлены входными параметрами компонента.

### Объект

Когда `props` объект, они будут установлены входными параметрами компонента как есть. Полезно когда входные параметры являются статическими данными.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/promotion/from-newsletter',
      component: Promotion,
      props: { newsletterPopup: false },
    },
  ],
})
```

### Функция

Вы можете создать функцию, которая вернёт объект с входными параметрами. Это позволяет вам приводить параметры к другим типам, комбинировать статические значения с значениями из маршрута, и т.д.

```js
const router = new VueRouter({
  routes: [
    {
      path: '/search',
      component: SearchUser,
      props: (route) => ({ query: route.query.q }),
    },
  ],
})
```

Ссылка: `/search?q=vue` также передаст `{query: 'vue'}` в качестве входных параметров в компонент `SearchUser`.

Старайтесь держать функции генерации входных параметров независимыми от состояния, потому что они вызываются только при изменениях маршрута. Используйте компонент обёртку, если вам нужно состояние для определения входных параметров, в таком случае Vue сможет реагировать на изменения состояния.

Для более продвинутого использования, смотрите [пример](https://github.com/zachhaber/vue-router-state/blob/dev/examples/route-props/app.js).
