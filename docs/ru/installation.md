# Установка

## Скачивание напрямую / CDN

[https://unpkg.com/vue-router-2-state@3/dist/vue-router.js](https://unpkg.com/vue-router-2-state@3/dist/vue-router.js)

<!--email_off-->

[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка выше всегда указывает на самую последнюю версию vue-router-2-state на NPM. Вы можете также использовать конкретную версию, используя ссылки вида `https://unpkg.com/vue-router-2-state@3.0.0/dist/vue-router.js`.

<!--/email_off-->

Подключите `vue-router-2-state` после Vue, и установка произойдёт автоматически:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

## npm

```bash
npm install vue-router-2-state
```

При использовании модульной системы, необходимо явно обозначить использование роутера при помощи `Vue.use()`:

```js
import Vue from 'vue'
import VueRouter from 'vue-router-2-state'

Vue.use(VueRouter)
```

Это не требуется при подключении через глобальный тег `script`.

## Vue CLI

Если проект развернут с использованием [Vue CLI](https://cli.vuejs.org/ru/), то можно добавить Vue Router в качестве плагина. Это позволит CLI сгенерировать код подключения, приведённый выше, а также добавить два маршрута для примера. **Операция установки перезапишет `App.vue`** в проекте, поэтому убедитесь что сделали резервную копию перед запуском команды:

```sh
vue add router
```

## Версия для разработки

Если вы хотите использовать самую новую dev-сборку `vue-router-2-state`, то придётся вручную склонировать репозиторий с GitHub и запустить сборку:

```bash
git clone https://github.com/zachhaber/vue-router-state.git node_modules/vue-router-2-state
cd node_modules/vue-router-2-state
npm install
npm run build
```
