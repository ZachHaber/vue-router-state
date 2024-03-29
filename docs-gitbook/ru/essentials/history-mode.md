# Режим HTML5 History

Режимом по умолчанию для `vue-router-2-state` является _hash mode_, использующий хэш URL'а для симуляции полного URL-адреса, что позволяет избежать перезагрузки страницы при изменении URL.

Мы можем обойтись без хэша, используя **history mode**, который работает с API `history.pushState` для достижения той же цели:

```js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```

При использовании history mode URL выглядит естественно, например: `http://oursite.com/user/id`. Прекрасно!

Возникает, однако, и проблема: поскольку наше приложение — одностраничное, не сконфигурировав соответствующим образом сервер мы заставим пользователей получать ошибку 404, если они перейдут по `http://oursite.com/user/id` напрямую. Вот это уже прекрасным не назвать.

Не спешите расстраиваться: всё, что нужно — единственная "резервная" запись в конфигурации сервера. Если URL не совпадает ни с одним статическим файлом, сервер должен просто отдать `index.html`, в котором и живёт наше приложение. И снова, прекрасно!

## Примеры конфигурации серверов

#### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Node.js

```js
const http = require('http')
const fs = require('fs')
const httpPort = 80

http
  .createServer((req, res) => {
    fs.readFile('index.htm', 'utf-8', (err, content) => {
      if (err) {
        console.log('Невозможно открыть файл "index.htm".')
      }

      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      })

      res.end(content)
    })
  })
  .listen(httpPort, () => {
    console.log('Сервер запущен на: http://localhost:%s', httpPort)
  })
```

#### Node.js c использованием Express

При использовании Node.js/Express, мы рекомендуем пользоваться [connect-history-api-fallback middleware](https://github.com/bripkens/connect-history-api-fallback).

#### Internet Information Services (IIS)

1. Установить [IIS UrlRewrite](https://www.iis.net/downloads/microsoft/url-rewrite)
2. Создать файл `web.config` в корневом каталоге вашего сайта со следующим содержимым:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

#### Caddy

```
rewrite {
    regexp .*
    to {path} /
}
```

#### Хостинг Firebase

Добавьте в файл `firebase.json`:

```
{
  "hosting": {
    "public": "dist",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Предостережение

При таком подходе возникает одно неприятное последствие: сервер больше не будет выдавать ошибки 404, так как обслуживание всех путей отдаётся на откуп клиентскому роутингу. Частично эту проблему можно решить, указав путь по умолчанию во vue-router-2-state:

```js
const router = new VueRouter({
  mode: 'history',
  routes: [{ path: '*', component: NotFoundComponent }],
})
```

Если же вы используете на сервере Node.js, уже на стороне сервера можно задействовать конфигурацию роутера и решить таким образом проблему целиком. Ознакомьтесь с [руководством по серверному рендерингу Vue.js](https://ssr.vuejs.org/ru/) для получения дополнительной информации.
