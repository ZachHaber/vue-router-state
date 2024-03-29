---
sidebar: auto
---

# Справочник API

## `<router-link>`

`<router-link>` — это компонент предназначенный для навигации пользователя в приложении с клиентской маршрутизацией. Путь назначения указывается входным параметром `to`. По умолчанию компонент рендерится в тег `<a>` с корректным значением `href`, но это можно изменить входным параметром `tag`. Кроме того, ссылка автоматически получает активный класс CSS при переходе на путь назначения.

`<router-link>` предпочтительнее `<a href="...">` по следующим причинам:

- Он работает одинаково вне зависимости от режима работы (HTML5 history или хэш), поэтому если вы решите переключить режим, или маршрутизатор для совместимости переключится обратно в режим хэша в IE9, ничего не потребуется изменять.
- В режиме HTML5 history, `router-link` будет перехватывать событие click, чтобы браузер не пытался перезагрузить страницу.
- При использовании опции `base` в режиме работы HTML5 history, вам не потребуется добавлять её в URL входного параметра `to`.

### `v-slot` API (3.1.0+)

`router-link` предоставляет возможность более низкоуровневой настройки с помощью [слота с ограниченной областью видимости](https://ru.vuejs.org/v2/guide/components-slots.html#%D0%A1%D0%BB%D0%BE%D1%82%D1%8B-%D1%81-%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%D1%8E-%D0%B2%D0%B8%D0%B4%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D0%B8). Это более продвинутое API ориентировано в первую очередь на создателей библиотек, но может пригодиться и разработчикам, к примеру для создании пользовательских компонентов таких как _NavLink_ или подобных.

**При использовании API `v-slot` необходимо передавать один дочерний элемент в `router-link`**. Если этого не сделать, `router-link` обернёт все дочерние элементы в `span`.

```html
<router-link
  to="/about"
  custom
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <NavLink :active="isActive" :href="href" @click="navigate">
    {{ route.fullPath }}
  </NavLink>
</router-link>
```

- `href`: разрешённый URL. Это будет атрибутом `href` для элемента `a`
- `route`: разрешённый нормализованный маршрут
- `navigate`: функция для запуска навигации. **Она автоматически предотвращает события, когда это необходимо**, аналогичным способом, как это делает `router-link`
- `isActive`: `true` если [активный класс](#active-class) должен применяться. Позволяет применить произвольный класс
- `isExactActive`: `true` если [активный класс при точном совпадении пути](#exact-active-class) должен применяться. Позволяет применить произвольный класс

### Пример: Добавление активного класса к внешнему элементу

Иногда может потребоваться применять активный класс к внешнему элементу, а не к тегу `<a>`, в этом случае можно обернуть этот элемент в `<router-link>` и использовать свойства `v-slot` для создания ссылки:

```html
<router-link
  to="/foo"
  custom
  v-slot="{ href, route, navigate, isActive, isExactActive }"
>
  <li
    :class="[isActive && 'router-link-active', isExactActive && 'router-link-exact-active']"
  >
    <a :href="href" @click="navigate">{{ route.fullPath }}</a>
  </li>
</router-link>
```

:::tip ПРИМЕЧАНИЕ
При добавлении `target="_blank"` на элемент `a`, необходимо опустить обработчик `@click="navigate"`.
:::

## Входные параметры `<router-link>`

### to

- тип: `string | Location`
- обязательный

  Определяет итоговый маршрут ссылки. При нажатии, значение входного параметра `to` будет передано в `router.push()` — поэтому это значение может быть как строкой, так и объектом описывающим маршрут.

  ```html
  <!-- строка -->
  <router-link to="home">Home</router-link>
  <!-- отобразится в -->
  <a href="home">Home</a>

  <!-- javascript-выражение с использованием `v-bind` -->
  <router-link v-bind:to="'home'">Home</router-link>

  <!-- можно опустить `v-bind`, аналогично другим входным параметрам -->
  <router-link :to="'home'">Home</router-link>

  <!-- даст тот же результат -->
  <router-link :to="{ path: 'home' }">Home</router-link>

  <!-- именованный маршрут -->
  <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>

  <!-- с использованием query-строки, получим `/register?plan=private` -->
  <router-link :to="{ path: 'register', query: { plan: 'private' }}">
    Регистрация
  </router-link>
  ```

### replace

- тип: `boolean`
- по умолчанию: `false`

  Указание входного параметра `replace` вызовет `router.replace()` вместо `router.push()` при нажатии на ссылку, поэтому навигация не оставит записи в истории переходов.

  ```html
  <router-link :to="{ path: '/abc'}" replace></router-link>
  ```

### append

- тип: `boolean`
- по умолчанию: `false`

  Указание входного параметра `append` будет добавлять относительный путь к текущему. Например, если мы переходим от `/a` к относительной ссылке `b`, то без `append` будет адрес `/b`, а вместе с `append` получится `/a/b`.

  ```html
  <router-link :to="{ path: 'relative/path'}" append></router-link>
  ```

### tag

- тип: `string`
- по умолчанию: `"a"`

  Иногда необходимо чтобы `<router-link>` отображался другим тегом, например `<li>`. В таком случае мы можем использовать входной параметр `tag`, чтобы указать нужный тег, и он всё равно будет прослушивать события click для навигации.

  ```html
  <router-link to="/foo" tag="li">foo</router-link>
  <!-- отобразится как -->
  <li>foo</li>
  ```

### active-class

- тип: `string`
- по умолчанию: `"router-link-active"`

  Указание активного CSS класса, который применяется когда ссылка активна. Обратите внимание, что значение по умолчанию можно задать глобально в опции `linkActiveClass` конструктора маршрутизатора.

### exact

- тип: `boolean`
- по умолчанию: `false`

  Стандартное поведение сопоставления, когда выставляется активный класс, основывается на **совпадениях по включению**. Например, `<router-link to="/a">` будет получать класс активности и когда текущий путь начинается с `/a/` и когда с `/a`.

  Обратите внимание, поэтому `<router-link to="/">` будет активным для каждого маршрута! Для «режима точного соответствия» укажите в ссылке входной параметр `exact`:

  ```html
  <!-- эта ссылка будет активной только для адреса `/` -->
  <router-link to="/" exact></router-link>
  ```

  Ознакомьтесь с другими примерами активных классов ссылок [вживую](https://jsfiddle.net/8xrk1n9f/).

### exact-path

> Добавлено в версии 3.5.0

- тип: `boolean`
- по умолчанию: `false`

  Позволяет использовать сопоставление только на секции `path` в URL, позволяя эффективно игнорировать секции `query` и `hash`.

  ```html
  <!-- ссылка будет активной для `/search?page=2` или `/search#filters` -->
  <router-link to="/search" exact-path> </router-link>
  ```

### exact-path-active-class

- тип: `string`
- по умолчанию: `"router-link-exact-path-active"`

  Указание активного CSS класса, который применяется когда ссылка активна по сопоставлению `path`. Обратите внимание, что значение по умолчанию можно задать глобально в опции `linkExactPathActiveClass` конструктора маршрутизатора.

### event

- тип: `string | Array<string>`
- по умолчанию: `'click'`

  Определение события (событий), которые будут вызывать навигацию по ссылке.

### exact-active-class

- тип: `string`
- по умолчанию: `"router-link-exact-active"`

  Указание активного CSS класса, который применяется когда ссылка активна с точным соответствием пути. Обратите внимание, что значение по умолчанию можно задать глобально в опции `linkExactActiveClass` конструктора маршрутизатора.

### aria-current-value

- тип: `'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'`
- по умолчанию: `"page"`

  Настройка значения `aria-current` когда ссылка активна по точному (exact) совпадению. Это должно быть одно из [разрешённых значений для aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current) спецификации ARIA. В большинстве случаев наиболее подходящим значением будет `page`.

## `<router-view>`

Функциональный компонент `<router-view>` отображает компонент соответствующий данному маршруту. Компоненты внутри `<router-view>` также могут содержать в шаблоне собственный `<router-view>` (он будет использован для отображения компонентов вложенных маршрутов).

Все остальные входные параметры передаются в отображаемый компонент, однако данные маршрута удобнее получать из `$route.params` текущего маршрута.

Поскольку это всего лишь компонент, он работает вместе с `<transition>` и `<keep-alive>`. При одновременном использовании обоих обязательно располагайте `<keep-alive>` внутри:

```html
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
```

## Входные параметры `<router-view>`

### name

- тип: `string`
- по умолчанию: `"default"`

  Наличие имени у `<router-view>` определяет отображение компонента с соответствующим именем из опции `components` сопоставленного маршрута. Подробности и примеры использования этой возможности в разделе [именованных представлений](../guide/essentials/named-views.md).

## Опции конструктора Router

### routes

- тип: `Array<RouteConfig>`

  Декларация типа для `RouteConfig`:

  ```ts
  interface RouteConfig = {
    path: string,
    component?: Component,
    name?: string, // для именованных маршрутов
    components?: { [name: string]: Component }, // для именованных представлений
    redirect?: string | Location | Function,
    props?: boolean | Object | Function,
    alias?: string | Array<string>,
    children?: Array<RouteConfig>, // для вложенных маршрутов
    beforeEnter?: (to: Route, from: Route, next: Function) => void,
    meta?: any,

    // Добавлено в версии 2.6.0+
    caseSensitive?: boolean, // учитывать регистр при сравнении? (по умолчанию: false)
    pathToRegexpOptions?: Object // настройки path-to-regexp для компиляции regex
  }
  ```

### mode

- тип: `string`

- по умолчанию: `"hash" (in browser) | "abstract" (in Node.js)`

- возможные значения: `"hash" | "history" | "abstract"`

  Определяет режим работы маршрутизатора.

  - `hash`: используется хэш URL для маршрутизации. Работает во всех совместимых с Vue браузерами, даже тех, что не поддерживают HTML5 History API.

  - `history`: требует поддержки HTML5 History API и конфигурации сервера. Подробнее в разделе [Режим HTML5 History](../guide/essentials/history-mode.md).

  - `abstract`: работает во всех JavaScript-окружениях, например при серверном рендеринге с помощью Node.js. **Маршрутизатор автоматически переключается в этот режим, если не обнаружит API браузера.**

### base

- тип: `string`

- по умолчанию: `"/"`

  Базовый URL приложения. Например, если SPA расположено по пути `/app/`, тогда `base` должно иметь значение `"/app/"`.

### linkActiveClass

- тип: `string`

- по умолчанию: `"router-link-active"`

  Глобальная настройка активного класса по умолчанию для `<router-link>`. Подробнее в опции [router-link](#router-link).

### linkExactActiveClass

- тип: `string`

- по умолчанию: `"router-link-exact-active"`

  Глобальная настройка активного класса по умолчанию при точном совпадении маршрута для `<router-link>`. Подробнее в опции [router-link](#router-link).

### scrollBehavior

- тип: `Function`

  Сигнатура:

  ```ts
  type PositionDescriptor =
    | { x: number; y: number }
    | { selector: string }
    | void

  type scrollBehaviorHandler = (
    to: Route,
    from: Route,
    savedPosition?: { x: number; y: number },
  ) => PositionDescriptor | Promise<PositionDescriptor>
  ```

  Подробнее в разделе настройки [поведения прокрутки страницы](../guide/advanced/scroll-behavior.md).

### parseQuery / stringifyQuery

- тип: `Function`

  Указание пользовательских функций для парсинга строки запроса / приведения к строке запроса (stringify). Переопределяют реализации по умолчанию.

### fallback

- тип: `boolean`

- по умолчанию: `true`

  Определяет, должен ли маршрутизатор возвращаться в режим `hash`, когда браузер не поддерживает `history.pushState`.

  Установка этой опции в `false` будет приводить к полному обновлению страницы в IE9 для каждой навигации через `<router-link>`. Это полезно, когда приложение рендерится на стороне сервера (SSR) и должно работать в IE9, потому что режим `hash` не работает с серверным рендерингом.

## Свойства экземпляра Router

### router.app

- тип: `Vue instance`

  Корневой экземпляр Vue, в который внедряется `router`.

### router.mode

- тип: `string`

  [Режим работы](./#mode), используемый маршрутизатором.

### router.currentRoute

- тип: `Route`

  Текущий маршрут в виде [объекта Route](#объект-route).

### router.START_LOCATION

- тип: `Route`

  Первоначальная навигация будет [объектом Route](#объект-route) с которого запускается маршрутизатор. Можно использовать в навигационных хуках для определения стартовой навигации.

  ```js
  import VueRouter from 'vue-router-2-state'

  const router = new VueRouter({
    // ...
  })

  router.beforeEach((to, from) => {
    if (from === VueRouter.START_LOCATION) {
      // первоначальная навигация
    }
  })
  ```

## Методы экземпляра Router

### router.beforeEach

### router.beforeResolve

### router.afterEach

Сигнатуры:

```js
router.beforeEach((to, from, next) => {
  /* необходимо вызывать `next` */
})

router.beforeResolve((to, from, next) => {
  /* необходимо вызывать `next` */
})

router.afterEach((to, from) => {})
```

Добавляют глобальные навигационные хуки. Подробнее в разделе [Навигационные хуки](../guide/advanced/navigation-guards.md).

Все три метода возвращают функцию для удаления зарегистрированного хука.

### router.push

### router.replace

### router.go

### router.back

### router.forward

Сигнатуры:

```js
router.push(location, onComplete?, onAbort?)
router.push(location).then(onComplete).catch(onAbort)
router.replace(location, onComplete?, onAbort?)
router.replace(location).then(onComplete).catch(onAbort)
router.go(n)
router.back()
router.forward()
```

Программная навигация на новый URL. Подробнее в разделе [программная навигация](../guide/essentials/navigation.md).

### router.getMatchedComponents

Сигнатура:

```js
const matchedComponents: Array<Component> = router.getMatchedComponents(location?)
```

Возвращает массив компонентов (определение/конструктор, не экземпляры) сопоставленные для указанного адреса или текущего маршрута. В основном это используется для рендеринга на стороне сервера, чтобы выполнить предварительную загрузку данных.

### router.resolve

Сигнатура:

```js
const resolved: {
  location: Location;
  route: Route;
  href: string;
} = router.resolve(location, current?, append?)
```

Обратное разрешение URL, чтобы получить местоположение в формате, аналогичном используемому в `<router-link/>`.

- `current` текущий маршрут по умолчанию (в большинстве случаев не требуется это менять)
- `append` позволяет вам добавить путь к маршруту `current` (как и в [`router-link`](#router-link-props))

### router.addRoutes

_УСТАРЕВШИЙ_: используйте вместо метод [`router.addRoute()`](#router-addroute).

Сигнатура:

```ts
router.addRoutes(routes: Array<RouteConfig>)
```

Динамически добавляет дополнительные маршруты в маршрутизатор. Аргумент должен быть массивом маршрутов в таком же формате, как и в опции `routes` конструктора.

### router.addRoute

> Добавлено в версии 3.5.0

Добавляет новый маршрут в маршрутизатор. Если у маршрута указан `name` и уже существует маршрут с таким же именем, то он будет перезаписан.

Сигнатура:

```ts
addRoute(route: RouteConfig): () => void
```

### router.addRoute

> Добавлено в версии 3.5.0

Добавляет новый маршрут в качестве дочернего для существующего маршрута. Если у маршрута указан `name` и уже существует маршрут с таким же именем, то он будет перезаписан.

Сигнатура:

```ts
addRoute(parentName: string, route: RouteConfig): () => void
```

### router.getRoutes

> Добавлено в версии 3.5.0

Получение списка записей всех активных маршрутов. **Обратите внимание, что только задокументированные свойства считаются публичным API**, поэтому следует избегать использования любых других свойств, например `regex`, так как их уже не будет в Vue Router 4.

Сигнатура:

```ts
getRoutes(): RouteRecord[]
```

### router.onReady

Сигнатура:

```js
router.onReady(callback, [errorCallback])
```

Регистрирует коллбэк, который будет вызван когда маршрутизатор завершит начальную навигацию, когда будут завершены все асинхронные хуки и готовы асинхронные компоненты, связанные с начальным маршрутом.

Пригодится при рендеринге на стороне сервера, чтобы обеспечить консистентный результат как на сервере, так и на клиенте.

Второй аргумент `errorCallback` поддерживается только в версиях 2.4+. Он вызывается когда начальное разрешение маршрута заканчивается ошибкой (например, не удалось разрешить асинхронный компонент).

### router.onError

Сигнатура:

```js
router.onError(callback)
```

Регистрирует коллбэк, который будет вызван при обнаружении ошибок во время навигации по маршруту. Обратите внимание, что он вызывается в одном из следующих сценариев:

- Ошибка произошла синхронно внутри функции маршрута;

- Ошибка фиксируется и асинхронно обрабатывается с помощью `next(err)` внутри функции навигационного хука;

- Произошла ошибка при попытке разрешить асинхронный компонент, необходимый для отображения маршрута.

## Объект Route

**Объект Route** представляет собой состояние текущего активного маршрута. Он содержит информацию о текущем URL и **записи маршрутов**, сопоставленные с ним.

Объект маршрута иммутабелен. Каждая успешная навигация создаёт новый объект маршрута.

Объект маршрута встречается в нескольких местах:

- Внутри компонентов как `this.$route`

- Внутри коллбэка при отслеживании изменений `$route`

- Как возвращаемое значение при вызове `router.match(location)`

- В качестве двух первых параметров навигационных хуков:

  ```js
  router.beforeEach((to, from, next) => {
    // как `to` так и `from` являются объектами маршрута
  })
  ```

- В качестве двух первых параметров функции `scrollBehavior`:

  ```js
  const router = new VueRouter({
    scrollBehavior(to, from, savedPosition) {
      // как `to` так и `from` являются объектами маршрута
    },
  })
  ```

### Свойства объекта Route

- **\$route.path**

  - тип: `string`

    Строка пути текущего маршрута, всегда в абсолютном формате, например `"/foo/bar"`.

- **\$route.params**

  - тип: `Object`

    Объект, который содержит пары ключ/значение динамических сегментов маршрута (включая \*-сегменты). Если параметров нет, то значением будет пустой объект.

- **\$route.query**

  - тип: `Object`

    Объект, который содержит пары ключ/значение строки запроса (query string). Например, для пути `/foo?user=1` получим `$route.query.user == 1`. Если строки запроса нет, то значением будет пустой объект.

- **\$route.meta**

  - тип: `Object`

    Объект, который содержит пары ключ/значение объекта meta для маршрута. Если у объекте meta нет свойств, то значением будет пустой объект.

- **\$route.hash**

  - тип: `string`

    Хэш текущего маршрута (вместе с символом `#`) при его наличии. Если хэша нет, то значением будет пустая строка.

- **\$route.fullPath**

  - тип: `string`

    Полная запись URL-адреса, включая строку запроса и хэш.

- **\$route.matched**

  - тип: `Array<RouteRecord>`

  Массив с **записями маршрутов** для всех вложенных сегментов текущего маршрута. Записи маршрутов — это копии объектов из опции `routes` (и вложенных массивов `children`):

  ```js
  const router = new VueRouter({
    routes: [
      // объект ниже — это запись маршрута
      {
        path: '/foo',
        component: Foo,
        children: [
          // это — тоже запись маршрута
          { path: 'bar', component: Bar },
        ],
      },
    ],
  })
  ```

Для URL `/foo/bar`, значение `$route.matched` будет массивом, содержащим копии объектов (клоны), в порядке сортировки от родителя к потомку.

- **\$route.name**

  Имя текущего маршрута, если было указано. (Подробнее в разделе [именованные маршруты](../guide/essentials/named-routes.md))

- **\$route.redirectedFrom**

  Имя маршрута с которого произошло перенаправление, если было указано. (Подробнее в разделе [перенаправления и псевдонимы](../guide/essentials/redirect-and-alias.md))

## Интеграция в компоненты

### Внедряемые в компоненты свойства

Эти свойства внедряются в каждый дочерний компонент, передавая экземпляр маршрутизатора в корневой экземпляр в качестве опции `router`.

- **this.\$router**

  Экземпляр маршрутизатора.

- **this.\$route**

  Текущий активный [маршрут](#объект-route). Это свойство только для чтения и все его свойства иммутабельны, но можно отслеживать их изменения.

### Добавляемые опции в компонент

- **beforeRouteEnter**
- **beforeRouteUpdate**
- **beforeRouteLeave**

  Подробнее в разделе [Навигационные хуки компонентов](../guide/advanced/navigation-guards.md#incomponent-guards).
