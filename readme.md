# Кроппер картинок на базе `canvas`

Скрипт позволяет кадрировать картинку используя заранее определенные пропорции. В основном предназначен для сервисов, на которые необходимо загрузить фотографию, удостоверяющую личность. 

## Как это работает?

  В секцию `head` необходимо подключить `jQuery` и `jQuery UI` (только слайдер) например вот так:

```html
    <script src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js' type='text/javascript'></script>
    <script src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js' type='text/javascript'></script>
```

TODO: написать раздел

## Тестируем возможности

Вы можете быстро увидеть работу скрипта в действии, для этого, у вас должен быть установлен интерпритатор Ruby.

Выкачиваем репозиторий

```bash
    git clone git@github.com:inferno/CropBox.git
```
Устанавливаем необходимые гемы

```bash
    cd CropBox
    bundle install
```

Запускаем приложение

```bash
    ruby app.rb
```

В браузере заходим по адресу `http://localhost:4567`, смотрим на работу скрипта.

## Скриншот

Внешний вид легко меняется. На скриншоте представлен внешний вид по дефаулту.

![Скриншот](https://github.com/inferno/cropbox/raw/master/images/view.jpg "Скриншот")

## Поддержка в браузерах

Скрипт поддерживает все браузеры, имеющие реализацию `canvas`.

* Firefox
* Opera
* Safari и Chrome
* Internet Explorer 9+
