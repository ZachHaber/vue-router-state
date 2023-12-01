(window.webpackJsonp=window.webpackJsonp||[]).push([[82],{504:function(t,s,a){"use strict";a.r(s);var r=a(17),e=Object(r.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"プログラムによるナビゲーション"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#プログラムによるナビゲーション"}},[t._v("#")]),t._v(" プログラムによるナビゲーション")]),t._v(" "),s("p",[t._v("宣言的なナビゲーションとしてアンカータグを作成する "),s("code",[t._v("<router-link>")]),t._v(" がありますが、ルーターのインスタンスメソッドを使ったプログラムによる方法でもそれは可能です。")]),t._v(" "),s("h4",{attrs:{id:"router-push-location-oncomplete-onabort"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#router-push-location-oncomplete-onabort"}},[t._v("#")]),t._v(" "),s("code",[t._v("router.push(location, onComplete?, onAbort?)")])]),t._v(" "),s("p",[s("strong",[t._v("注意: Vue インスタンスの内部では、"),s("code",[t._v("$router")]),t._v(" としてルーターインスタンスにアクセスできます。従って、"),s("code",[t._v("this.$router.push")]),t._v(" で呼ぶことができます。")])]),t._v(" "),s("p",[t._v("異なる URL へ遷移するときに "),s("code",[t._v("router.push")]),t._v(" が使えます。このメソッドは history スタックに新しいエントリを追加します。それによってユーザーがブラウザの戻るボタンをクリックした時に前の URL に戻れるようになります。")]),t._v(" "),s("p",[t._v("このメソッドは "),s("code",[t._v("<router-link>")]),t._v(" をクリックした時に内部的に呼ばれています。つまり "),s("code",[t._v('<router-link :to="...">')]),t._v(" をクリックすることは "),s("code",[t._v("router.push(...)")]),t._v(" を呼ぶことと等価です。")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("宣言的")]),t._v(" "),s("th",[t._v("プログラム的")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v('<router-link :to="...">')])]),t._v(" "),s("td",[s("code",[t._v("router.push(...)")])])])])]),t._v(" "),s("p",[t._v("引数は文字列のパス、もしくは、location を記述するオブジェクトが使えます。例:")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 文字列パス")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'home'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// オブジェクト")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("path")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'home'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 名前付きルート")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'user'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("params")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("userId")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'123'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 結果的に /register?plan=private になる query")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("path")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'register'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("query")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("plan")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'private'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("p",[s("strong",[t._v("注意")]),t._v(": "),s("code",[t._v("path")]),t._v(" が渡された場合は "),s("code",[t._v("params")]),t._v(" は無視されます（"),s("code",[t._v("query")]),t._v(" は上の例の通り無視されません）。代わりに "),s("code",[t._v("name")]),t._v(" でルート名を渡すか、"),s("code",[t._v("path")]),t._v(" にすべてのパラメータを含める必要があります:")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" userId "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'123'")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("name")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'user'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("params")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" userId "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// -> /user/123")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("path")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token template-string"}},[s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("/user/")]),s("span",{pre:!0,attrs:{class:"token interpolation"}},[s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("${")]),t._v("userId"),s("span",{pre:!0,attrs:{class:"token interpolation-punctuation punctuation"}},[t._v("}")])]),s("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// -> /user/123")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v('// これは動作"しません"')]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("push")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("path")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/user'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("params")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" userId "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// -> /user")]),t._v("\n")])])]),s("p",[t._v("同じルールが、"),s("code",[t._v("router-link")]),t._v(" コンポーネントの "),s("code",[t._v("to")]),t._v(" プロパティに対して適用されます。")]),t._v(" "),s("p",[t._v("2.2.0 以降では、必要に応じて、第 2 引数と第 3 引数として "),s("code",[t._v("router.push")]),t._v(" または "),s("code",[t._v("router.replace")]),t._v(" に "),s("code",[t._v("onComplete")]),t._v(" と "),s("code",[t._v("onAbort")]),t._v(" コールバックを指定します。これらのコールバックは、ナビゲーションが正常に完了したとき(すべての非同期フックが解決された後)に呼び出されるか、またはそれぞれ中止されます(現在のナビゲーションが終了する前に同じルートまたは別のルートにナビゲートされた)")]),t._v(" "),s("p",[s("strong",[t._v("注意:")]),t._v(" ルートの行き先が現在のルートと同じで、かつパラメータのみが変更されている場合(例: "),s("code",[t._v("/users/1")]),t._v(" -> "),s("code",[t._v("/users/2")]),t._v(" のようにあるプロファイルから他へ)、変更(例: ユーザー情報の取得など)に反応するために"),s("RouterLink",{attrs:{to:"/ja/guide/essentials/dynamic-matching.html#パラメーター変更の検知"}},[t._v("beforeRouteUpdate")]),t._v(" を使用しなければなりません。")],1),t._v(" "),s("h4",{attrs:{id:"router-replace-location-oncomplete-onabort"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#router-replace-location-oncomplete-onabort"}},[t._v("#")]),t._v(" "),s("code",[t._v("router.replace(location, onComplete?, onAbort?)")])]),t._v(" "),s("p",[t._v("これは "),s("code",[t._v("router.push")]),t._v(" のように動作しますが、異なる点は新しい history エントリを追加しないで遷移することです。この名前から推定されるように、現在のエントリを置換します。")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("宣言的")]),t._v(" "),s("th",[t._v("プログラム的")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[s("code",[t._v('<router-link :to="..." replace>')])]),t._v(" "),s("td",[s("code",[t._v("router.replace(...)")])])])])]),t._v(" "),s("h4",{attrs:{id:"router-go-n"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#router-go-n"}},[t._v("#")]),t._v(" "),s("code",[t._v("router.go(n)")])]),t._v(" "),s("p",[t._v("このメソッドは、history スタックの中でどのくらいステップを進めるか、もしくは戻るのか、を表す 1 つの integer をパラメーターとして受け取ります。"),s("code",[t._v("window.history.go(n)")]),t._v(" と類似しています。")]),t._v(" "),s("p",[t._v("例")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 1 つレコードを進める。history.forward() と同じ")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("go")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 1 つレコードを戻す。history.back() と同じ")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("go")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 3 つレコードを進める")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("go")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// もし多くのレコードが存在しない場合、サイレントに失敗します")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("go")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("100")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nrouter"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("go")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("100")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),s("h4",{attrs:{id:"history-操作"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#history-操作"}},[t._v("#")]),t._v(" History 操作")]),t._v(" "),s("p",[t._v("もしかすると "),s("code",[t._v("router.push")]),t._v("、"),s("code",[t._v("router.replace")]),t._v("、"),s("code",[t._v("router.go")]),t._v(" は "),s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/History",target:"_blank",rel:"noopener noreferrer"}},[s("code",[t._v("window.history.pushState")]),t._v("、"),s("code",[t._v("window.history.replaceState")]),t._v("、"),s("code",[t._v("window.history.go")]),s("OutboundLink")],1),t._v(" と対応することにお気づきかもしれません。これらは "),s("code",[t._v("window.history")]),t._v(" API を模倣しています。")]),t._v(" "),s("p",[t._v("したがって、もしあなたが既に "),s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/API/History_API",target:"_blank",rel:"noopener noreferrer"}},[t._v("Browser History APIs"),s("OutboundLink")],1),t._v(" について詳しい場合は、vue-router-2-state による History 操作はとても簡単です。")]),t._v(" "),s("p",[t._v("vue-router-2-state のナビゲーションメソッド ("),s("code",[t._v("push")]),t._v("、"),s("code",[t._v("replace")]),t._v("、"),s("code",[t._v("go")]),t._v(") は全てのモード ("),s("code",[t._v("history")]),t._v("、"),s("code",[t._v("hash")]),t._v("、"),s("code",[t._v("abstract")]),t._v(") で一貫して動作することは特筆すべき点です。")])])}),[],!1,null,null,null);s.default=e.exports}}]);