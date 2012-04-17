# Кроппер картинок на базе `canvas`

Скрипт позволяет кадрировать картинку используя заранее определенные пропорции. В основном предназначен для сервисов, на которые необходимо загрузить фотографию, удостоверяющую личность. 

## Как это работает?

В секцию `head` необходимо подключить `jQuery` и `jQuery UI` (только слайдер) например вот так:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js" type="text/javascript"></script>
```

Также необходимо подключить `jquery.cropbox.js` и `style.css`:

```html
<script src="js/jquery.cropbox.js" type="text/javascript"></script>
<link href="css/crop-box.css" rel="stylesheet" type="text/css">
```

В тех местах, где необходимо вызывать скрипт добавляем специальные атрибуты:

```html
<div class="b-preview" data-crop="img/navalny.png" data-size="100x100" data-size-preview="260x310" data-aspect=".5"></div>
```

Где `data-crop` — url картинки, которую будем кадрировать, `data-size` — размеры картинки, котоарая должна получится, `data-size-preview` — размеры превьюшечки и `data-aspect` — минимальное сжатие для картинки. Обязательным параметром является только `data-crop`.

В итоге, если разобрать наш пример, мы будем кадрировать `img/navalny.png`, у нас получится картинка с размерами `100x100` и минимальная часть, которую мы сможем выбрать на картинке будет равна `50%` от `260x310`.

Дальше скрипт всё сделает за вас.

## Тестируем возможности

Вы можете быстро увидеть работу скрипта в действии, для этого, у вас должен быть установлен интерпритатор Ruby.

Выкачиваем репозиторий:

```bash
git clone git@github.com:inferno/CropBox.git
```
Устанавливаем необходимые гемы:

```bash
cd CropBox
bundle install
```
Запускаем приложение:

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
