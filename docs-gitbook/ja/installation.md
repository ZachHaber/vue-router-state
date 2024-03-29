# インストール

### 直接ダウンロード / CDN

[https://unpkg.com/vue-router-2-state/dist/vue-router.js](https://unpkg.com/vue-router-2-state/dist/vue-router.js)

<!--email_off-->

[Unpkg.com](https://unpkg.com) は npm ベースの CDN リンクです。 上記のリンクは常に NPM 上の最新のリリースを指します。 `https://unpkg.com/vue-router-2-state@2.0.0/dist/vue-router.js` のような URL を利用することで特定のバージョンやタグを指定することもできます。

<!--/email_off-->

Vue の後に `vue-router-2-state` を含めると自動的にインストールされます。

```html
<script src="/path/to/vue.js"></script>
<script src="/path/to/vue-router.js"></script>
```

### npm

```bash
npm install vue-router-2-state
```

モジュールシステムを使う場合、`Vue.use()` を使って明示的にルーターをインストールする必要があります。

```js
import Vue from 'vue'
import VueRouter from 'vue-router-2-state'

Vue.use(VueRouter)
```

グローバルな script タグを使っている場合は必要ありません。

### 開発用ビルド

もし最新の開発用ビルドを使用したい場合は、GitHub から直接クローンして `vue-router-2-state` をご自身でビルドしてください。

```bash
git clone https://github.com/zachhaber/vue-router-state.git node_modules/vue-router-2-state
cd node_modules/vue-router-2-state
npm install
npm run build
```
