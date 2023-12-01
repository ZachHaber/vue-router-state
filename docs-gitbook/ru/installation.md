# Установка

### Локальный файл / CDN

[https://unpkg.com/vue-router-2-state/dist/vue-router.js](https://unpkg.com/vue-router-2-state/dist/vue-router.js)

[Unpkg.com](https://unpkg.com) предоставляет CDN-ссылки для NPM-пакетов. Ссылка выше всегда указывает на самую последнюю версию vue-router-2-state на NPM. Вы также можете использовать конкретную версию используя ссылки вида `https://unpkg.com/vue-router-2-state@2.0.0/dist/vue-router.js`.

Подключите `vue-router-2-state` после Vue, и установка произойдёт автоматически:

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### NPM

```bash
npm install vue-router-2-state
```

При использовании модульной системы сборки, необходимо явно обозначить использование роутера при помощи `Vue.use()`:

```js
import Vue from 'vue'
import VueRouter from 'vue-router-2-state'

Vue.use(VueRouter)
```

Это не требуется при подключении через глобальный тег `script`.

### Сборка версии, находящейся в разработке

Если вы хотите использовать версию `vue-router-2-state` в разработке, склонируйте репозиторий с GitHub и выполните сборку вручную:

```bash
git clone https://github.com/zachhaber/vue-router-state.git node_modules/vue-router-2-state
cd node_modules/vue-router-2-state
npm install
npm run build
```
