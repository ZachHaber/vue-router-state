(window.webpackJsonp=window.webpackJsonp||[]).push([[75],{498:function(t,s,a){"use strict";a.r(s);var n=a(17),e=Object(n.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"ナビゲーションガード"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ナビゲーションガード"}},[t._v("#")]),t._v(" ナビゲーションガード")]),t._v(" "),s("p",[t._v("この名前が示すように、 "),s("code",[t._v("vue-router-2-state")]),t._v(" によって提供されるナビゲーションガードは、リダイレクトもしくはキャンセルによって遷移をガードするために主に使用されます。ルートナビゲーション処理 (グローバル、ルート単位、コンポーネント内) をフックする多くの方法があります。")]),t._v(" "),s("p",[s("strong",[t._v("パラメータまたはクエリの変更は enter/leave ナビゲーションガードをトリガーしない")]),t._v(" ということを覚えておいてください。それらの変更に対応するために "),s("RouterLink",{attrs:{to:"/ja/guide/essentials/dynamic-matching.html#reacting-to-params-changes"}},[s("code",[t._v("$route")]),t._v(" オブジェクトを監視する")]),t._v("、またはコンポーネント内ガード "),s("code",[t._v("beforeRouteUpdate")]),t._v(" を使用するかの、どちらかができます。")],1),t._v(" "),s("h2",{attrs:{id:"グローバルビフォーガード"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#グローバルビフォーガード"}},[t._v("#")]),t._v(" グローバルビフォーガード")]),t._v(" "),s("p",[s("code",[t._v("router.beforeEach")]),t._v(" を使ってグローバル before ガードを登録できます。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" router "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("VueRouter")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeEach")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("いつナビゲーションがトリガーされようとも、グローバル before ガードは作られた順番で呼び出されます。ガードは非同期に解決されるかもしれません。そしてそのナビゲーションは全てのフックが解決されるまで "),s("strong",[t._v("未解決状態")]),t._v(" として扱われます。")]),t._v(" "),s("p",[t._v("全てのガード関数は 3 つの引数を受け取ります。")]),t._v(" "),s("ul",[s("li",[s("p",[s("strong",[s("code",[t._v("to: Route")])]),t._v(": 次にナビゲーションされる対象の "),s("RouterLink",{attrs:{to:"/ja/api/#ルートオブジェクト"}},[t._v("ルートオブジェクト")]),t._v("。")],1)]),t._v(" "),s("li",[s("p",[s("strong",[s("code",[t._v("from: Route")])]),t._v(": ナビゲーションされる前の現在のルートです。")])]),t._v(" "),s("li",[s("p",[s("strong",[s("code",[t._v("next: Function")])]),t._v(": フックを "),s("strong",[t._v("解決")]),t._v(" するためにこの関数を呼ぶ必要があります。この振る舞いは "),s("code",[t._v("next")]),t._v(" に渡される引数に依存します:")])]),t._v(" "),s("li",[s("p",[s("strong",[s("code",[t._v("next()")])]),t._v(": パイプラインの次のフックに移動します。もしフックが残っていない場合は、このナビゲーションは "),s("strong",[t._v("確立")]),t._v(" されます。")])]),t._v(" "),s("li",[s("p",[s("strong",[s("code",[t._v("next(false)")])]),t._v(": 現在のナビゲーションを中止します。もしブラウザの URL が変化した場合は（ユーザーが手動で変更した場合でも、戻るボタンの場合でも）、 "),s("code",[t._v("from")]),t._v(" ルートの URL にリセットされます。")])]),t._v(" "),s("li",[s("p",[s("strong",[s("code",[t._v("next('/')")]),t._v(" または "),s("code",[t._v("next({ path: '/' })")])]),t._v(": 異なる場所へリダイレクトします。現在のナビゲーションは中止され、あたらしいナビゲーションが始まります。任意のロケーションオブジェクトを "),s("code",[t._v("next")]),t._v(" に渡すことができます。この "),s("code",[t._v("next")]),t._v(" には、"),s("code",[t._v("replace: true")]),t._v("、 "),s("code",[t._v("name: 'home'")]),t._v(" のようなオプション、そして "),s("RouterLink",{attrs:{to:"/ja/api/#router-link"}},[s("code",[t._v("router-link")]),t._v("、"),s("code",[t._v("to")]),t._v(" プロパティ")]),t._v("または "),s("RouterLink",{attrs:{to:"/ja/api/#ルーターインスタンスプロパティ"}},[s("code",[t._v("router.push")])]),t._v("で使用される任意のオプションを指定することができます。")],1)]),t._v(" "),s("li",[s("p",[s("strong",[s("code",[t._v("next(error)")])]),t._v(": (2.4.0+) "),s("code",[t._v("next")]),t._v(" に渡された引数が "),s("code",[t._v("Error")]),t._v(" インスタンスである場合、ナビゲーションは中止され、エラーは "),s("code",[t._v("router.onError()")]),t._v(" を介して登録されたコールバックに渡されます。")])])]),t._v(" "),s("p",[s("strong",[t._v("与えられたナビゲーションガードを通過する任意のパスにおいて、常に 1 回だけ "),s("code",[t._v("next")]),t._v(" 関数が呼び出されるようにしてください。それは 1 回以上出現することがありますが、論理パスが重ならないときだけで、そうしないないとフックは決して解決されない、またはエラーが発生します。")]),t._v(" 以下は、ユーザーが認証されていない場合、"),s("code",[t._v("/login")]),t._v(" にリダレクトするための例です:")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// BAD")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeEach")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Login'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("isAuthenticated"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Login'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ユーザーが認証されていない場合、 `next` は2回呼ばれる")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// GOOD")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeEach")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!==")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Login'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!")]),t._v("isAuthenticated"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Login'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h2",{attrs:{id:"グローバル解決ガード"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#グローバル解決ガード"}},[t._v("#")]),t._v(" グローバル解決ガード")]),t._v(" "),s("blockquote",[s("p",[t._v("New in 2.5.0")])]),t._v(" "),s("p",[t._v("2.5.0 以降では、"),s("code",[t._v("router.beforeResolve")]),t._v(" によってグローバルガードを登録できます。これは "),s("code",[t._v("router.beforeEach")]),t._v(" に似ていますが、"),s("strong",[t._v("すべてのコンポーネント内ガードと非同期ルートコンポーネントが解決された後")]),t._v("、ナビゲーションが解決される直前に解決ガードが呼び出されるという違いがあります。")]),t._v(" "),s("h2",{attrs:{id:"グローバルな-after-フック"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#グローバルな-after-フック"}},[t._v("#")]),t._v(" グローバルな After フック")]),t._v(" "),s("p",[t._v("グローバル after フックを登録することもできます。しかしながら、ガードとは異なり、これらのフックは "),s("code",[t._v("next")]),t._v(" 関数を受け取らず、ナビゲーションに影響しません。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("router"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("afterEach")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("from")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h2",{attrs:{id:"ルート単位ガード"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#ルート単位ガード"}},[t._v("#")]),t._v(" ルート単位ガード")]),t._v(" "),s("p",[t._v("直接ルート設定オブジェクトの "),s("code",[t._v("beforeEnter")]),t._v(" ガードを定義することができます。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" router "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("VueRouter")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("routes")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("path")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/foo'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("component")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Foo"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token function-variable function"}},[t._v("beforeEnter")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ...")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[t._v("これらのガードはグローバル before ガードと全く同じシグネチャを持ちます。")]),t._v(" "),s("h3",{attrs:{id:"コンポーネント内ガード"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#コンポーネント内ガード"}},[t._v("#")]),t._v(" コンポーネント内ガード")]),t._v(" "),s("p",[t._v("最後に、 以下のオプションでルートコンポーネント(ルータ設定に渡されるもの)の内側でルートナビゲーションガードを直接定義することができます。")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("beforeRouteEnter")])]),t._v(" "),s("li",[s("code",[t._v("beforeRouteUpdate")]),t._v(" (2.2 で追加)")]),t._v(" "),s("li",[s("code",[t._v("beforeRouteLeave")])])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" Foo "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("template")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("...")]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeRouteEnter")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// このコンポーネントを描画するルートが確立する前に呼ばれます。")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `this` でのこのコンポーネントへのアクセスはできません。")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// なぜならばこのガードが呼び出される時にまだ作られていないからです!")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeRouteUpdate")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// このコンポーネントを描画するルートが変更されたときに呼び出されますが、")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// このコンポーネントは新しいルートで再利用されます。")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// たとえば、動的な引数 `/foo/:id` を持つルートの場合、`/foo/1` と `/foo/2` の間を移動すると、")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 同じ `Foo` コンポーネントインスタンスが再利用され、そのときにこのフックが呼び出されます。")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `this` でコンポーネントインスタンスにアクセスできます。")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeRouteLeave")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// このコンポーネントを描画するルートが間もなく")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// ナビゲーションから離れていく時に呼ばれます。")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `this` でのコンポーネントインスタンスへのアクセスができます。")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("この "),s("code",[t._v("beforeRouteEnter")]),t._v(" ガードは "),s("code",[t._v("this")]),t._v(" へのアクセスは"),s("strong",[t._v("できない")]),t._v("です。なぜならば、ナビゲーションが確立する前にガードが呼び出されるからです。したがって、新しく入ってくるコンポーネントはまだ作られていないです。")]),t._v(" "),s("p",[t._v("しかしながら、 "),s("code",[t._v("next")]),t._v(" にコールバックを渡すことでインスタンスにアクセスすることができます。このコールバックはナビゲーションが確立した時に呼ばれ、コンポーネントインスタンスはそのコールバックの引数として渡されます。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeRouteEnter")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("vm")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=>")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `vm` を通じてコンポーネントインスタンスにアクセス")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("コールバックを "),s("code",[t._v("next")]),t._v(" に渡すことをサポートするのは、"),s("code",[t._v("beforeRouteEnter")]),t._v(" ガードだけであるということに注意してください。"),s("code",[t._v("beforeRouteUpdate")]),t._v(" と "),s("code",[t._v("beforeRouteLeave")]),t._v(" の場合、 "),s("code",[t._v("this")]),t._v(" は既に利用可能です。したがって、コールバックを渡す必要はないので、"),s("em",[t._v("サポートされません")]),t._v(":")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeRouteUpdate")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// `this` を使用")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("params"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("name\n  "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[s("strong",[t._v("leave ガード")]),t._v("は、通常、ユーザが保存されていない編集内容で誤って経路を離れるのを防ぐために使用されます。ナビゲーションは "),s("code",[t._v("next(false)")]),t._v(" を呼び出すことで取り消すことができます。")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[t._v("beforeRouteLeave")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token parameter"}},[t._v("to"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" from"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" answer "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" window"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("confirm")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Do you really want to leave? you have unsaved changes!'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("answer"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("next")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("false")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"完全なナビゲーション解決フロー"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#完全なナビゲーション解決フロー"}},[t._v("#")]),t._v(" 完全なナビゲーション解決フロー")]),t._v(" "),s("ol",[s("li",[t._v("ナビゲーションがトリガされる")]),t._v(" "),s("li",[t._v("非アクティブ化されたコンポーネントで "),s("code",[t._v("beforeRouteLeave")]),t._v(" ガードを呼ぶ")]),t._v(" "),s("li",[t._v("グローバル "),s("code",[t._v("beforeEach")]),t._v(" ガードを呼ぶ")]),t._v(" "),s("li",[t._v("再利用されるコンポーネントで "),s("code",[t._v("beforeRouteUpdate")]),t._v(" ガードを呼ぶ (2.2 以降)")]),t._v(" "),s("li",[t._v("ルート設定内の "),s("code",[t._v("beforeEnter")]),t._v(" を呼ぶ")]),t._v(" "),s("li",[t._v("非同期ルートコンポーネントを解決する")]),t._v(" "),s("li",[t._v("アクティブ化されたコンポーネントで "),s("code",[t._v("beforeRouteEnter")]),t._v(" を呼ぶ")]),t._v(" "),s("li",[t._v("グローバル "),s("code",[t._v("beforeResolve")]),t._v(" ガードを呼ぶ (2.5 以降)")]),t._v(" "),s("li",[t._v("ナビゲーションが確定される")]),t._v(" "),s("li",[t._v("グローバル "),s("code",[t._v("afterEach")]),t._v(" フックを呼ぶ")]),t._v(" "),s("li",[t._v("DOM 更新がトリガされる")]),t._v(" "),s("li",[t._v("インスタンス化されたインスンタンスによって "),s("code",[t._v("beforeRouteEnter")]),t._v(" ガードで "),s("code",[t._v("next")]),t._v(" に渡されたコールバックを呼ぶ")])])])}),[],!1,null,null,null);s.default=e.exports}}]);