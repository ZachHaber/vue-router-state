# 動的ルートマッチング

パターンを使って同じコンポーネントにルートをマップする必要がしばしばあるでしょう。例えば、 `User` コンポーネントは全てのユーザーに対して描画されるべきであるが、それぞれ異なるユーザー ID を持つ場合などです。`vue-router-2-state` ではパスの中の動的なセグメントを使用して実現できます。

```js
const User = {
  template: '<div>User</div>',
}

const router = new VueRouter({
  routes: [
    // コロンで始まる動的セグメント
    { path: '/user/:id', component: User },
  ],
})
```

これで `/user/foo` や `/user/bar` などの URL 両方とも同じルートにマッチします。

動的セグメントはコロン `:` を使って表されます。ルートがマッチした時、この動的セグメントの値は全てのコンポーネント内で `this.$route.params` として利用可能になります。したがって、現在の `User` のテンプレートを次のように更新することで現在のユーザー ID を表示することができます。

```js
const User = {
  template: '<div>User {{ $route.params.id }}</div>',
}
```

[こちら](https://jsfiddle.net/yyx990803/4xfa2f19/) のデモの例も確認してみてください。

1 つのルートが複数の動的なセグメントを持つこともできます。そして、それらは `$route.params` の一致したフィールドとマップされます。例:

| パターン                      | マッチしたパス      | $route.params                          |
| ----------------------------- | ------------------- | -------------------------------------- |
| /user/:username               | /user/evan          | `{ username: 'evan' }`                 |
| /user/:username/post/:post_id | /user/evan/post/123 | `{ username: 'evan', post_id: '123' }` |

`$route.params` に加えて、`$route` オブジェクトでは `$route.query` (もし URL 上にクエリがあるなら) や `$route.hash` など便利な情報も利用可能です。それらの詳細については [API リファレンス](../api/route-object.md) でご確認ください。

### パラメーター変更の検知

ルートのパラメーターを使う際に特筆すべき点は、ユーザーが `/user/foo` から `/user/bar` へ遷移するときに**同じコンポーネントインスタンスが再利用される**ということです。 両方のルートが同じコンポーネントを描画するため、古いインスタンスを破棄して新しいものを生成するよりも効率的です。**しかしながら、これはコンポーネントのライフサイクルフックが呼ばれないことを意味しています。**

同じコンポーネントでパラメーター変更を検知するためには、 `$route` オブジェクトを watch するだけです。

```js
const User = {
  template: '...',
  watch: {
    $route(to, from) {
      // ルートの変更の検知...
    },
  },
}
```

または、2.2 で導入された `beforeRouteUpdate` ガードを使用します:

```js
const User = {
  template: '...',
  beforeRouteUpdate(to, from, next) {
    // ルート変更に反応する...
    // next() を呼び出すのを忘れないでください
  },
}
```

### 高度なマッチングパターン

`vue-router-2-state` はパスのマッチングエンジンとして [path-to-regexp](https://github.com/pillarjs/path-to-regexp) を使っています。これは Optional による動的なセグメント、Zero or more / One or more に対する要求、また、カスタム正規表現パターンまでもサポートしています。 これらの高度なパターンについてはこちらの [ドキュメンテーション](https://github.com/pillarjs/path-to-regexp#parameters) または、 `vue-router-2-state` の中でそれらを使っている [こちらの例](https://github.com/zachhaber/vue-router-state/blob/dev/examples/route-matching/app.js) をご参照ください。

### マッチングの優先度

しばしば同じURLで複数のルートがマッチすることがあります。そのようなケースではマッチングの優先度はルートの定義された順番によって決定されます。先に定義されたルートほど優先度が高くなります。
