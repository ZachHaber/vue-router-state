# Скроллинг

При переходе между страницами в рамках клиентского роутинга, можно сохранять позицию скроллинга для каждой записи в истории (что обычно делают браузеры при работе с традиционными приложениями), или же проматывать страницу вверх. `vue-router-2-state` позволяет использовать оба варианта, и даже более того — позволяет полностью настроить поведение скроллинга при навигации.

**Замечание: эта возможность работает если браузер поддерживает `history.pushState`.**

При создании экземпляра роутера, вы можете указать функцию `scrollBehavior`:

```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // здесь нужно вернуть требуемую позицию скролла
  }
})
```

Функция `scrollBehavior` получает объекты путей `to` и `from`. В третьем параметре, `savedPosition`, передаётся сохранённая в истории браузера позиция скролла (только в случае `popstate`-перехода, вызванного нажатием кнопок вперёд/назад в браузере).

Функция возвращает объект позиции скролла. Он может иметь одну из двух форм:

- `{ x: number, y: number }`
- `{ selector: string, offset? : { x: number, y: number }}` (offset поддерживается только в 2.6.0+)

Если возвращается пустой объект или приводимое к ложному значение, скроллинга не произойдёт.

Например:

```js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```

Таким образом мы просто заставим браузер проматывать скролл к началу каждой открытой страницы.

Возврат `savedPosition` позволяет эмулировать нативное поведение браузера при использовании кнопок назад/вперёд:

```js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```

Эмулировать поведение "прокрутки к якорю" ("scroll to anchor") можно так:

```js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash
      // , offset: { x: 0, y: 10 }
    }
  }
}
```

Можно также использовать [метаданные путей](meta.md) для более сложного управления скроллингом. Полная реализация подхода содержится в [этом примере](https://github.com/zachhaber/vue-router-state/blob/dev/examples/scroll-behavior/app.js).

### Асинхронный скроллинг

> Добавлено в версии 2.8.0

Вы также можете вернуть Promise, который разрешится дескриптором с желаемой позицией:

```js
scrollBehavior (to, from, savedPosition) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 })
    }, 500)
  })
}
```

Это возможно связать с событиями из сменяющегося компонента-страниц, чтобы сделать поведение прокрутки более сочетаемым с вашими анимациями перехода между страницами, но из-за множества возможных вариантов и комплексности примеров, мы просто предоставляем этот просто пример чтобы показать где можно разместить собственную реализацию.
