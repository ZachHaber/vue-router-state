# Instalación

### Descarga directa / CDN

[https://unpkg.com/vue-router-2-state/dist/vue-router.js](https://unpkg.com/vue-router-2-state/dist/vue-router.js)

<!--email_off-->

[Unpkg.com](https://unpkg.com) provee enlaces a CDN basadas en NPM. El enlace anterior siempre apuntará a la última versión en NPM. También puedes usar una versión/etiqueta específica a través de URLs como`https://unpkg.com/vue-router-2-state@2.0.0/dist/vue-router.js`.

<!--/email_off-->

Incluye `vue-router-2-state` luego de Vue y se instalará automáticamente:

```html
<script src="/ruta/a/vue.js"></script>
<script src="/ruta/a/vue-router.js"></script>
```

### NPM

```bash
npm install vue-router-2-state
```

Cuando lo utilices con un sistema de empaquetamiento de módulos, debes instalarlo explícitamente a través de `Vue.use()`:

```js
import Vue from 'vue'
import VueRouter from 'vue-router-2-state'

Vue.use(VueRouter)
```

No necesitas hacer esto cuando utilices etiquetas _script_ globales.

### Versión de desarrollo

Debes clonar el repositorio directamente desde GitHub y construir `vue-router-2-state` tu mismo si quieres utilizar la última versión de desarrollo.

```bash
git clone https://github.com/zachhaber/vue-router-state.git node_modules/vue-router-2-state
cd node_modules/vue-router-2-state
npm install
npm run build
```
