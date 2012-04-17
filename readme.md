# Кроппер картинок на базе `canvas`

Скрипт позволяет кадрировать картинку используя заранее определенные пропорции. В основном предназначен для сервисов, на которые необходимо загрузить фотографию, удостоверяющую личность. 

## Как это работает?

В секцию `head` необходимо подключить `jQuery` и `jQuery UI` (только слайдер) например вот так:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js" type="text/javascript"></script>
```

Также необходимо подключить `jquery.cropbox.js` и `crop-box.css`:

```html
<script src="js/jquery.cropbox.js" type="text/javascript"></script>
<link href="css/crop-box.css" rel="stylesheet" type="text/css">
```

В качестве якоря используется любой html-элемент, снабженный дополнительными data-атрибутами. Пример:

```html
<div class="b-preview" data-crop="img/navalny.png" data-size="100x100" data-size-preview="260x310" data-aspect=".5"></div>
```

Где:

* `data-crop` — url картинки, которую будем кадрировать. Обязательный параметр.
* `data-size` — размеры картинки, которая должна получится
* `data-size-preview` — размеры превьюшечки
* `data-aspect` — минимальное сжатие для картинки.
* `data-url` — скрипт, который будет принимать картинку, закодированную в `data-uri`.

В итоге, если разобрать наш пример, мы будем кадрировать `img/navalny.png`, у нас получится картинка с размерами `100x100` и минимальная часть, которую мы сможем выбрать на картинке будет равна `50%` от `260x310`.

Разобрать картинку, закодированную в `data-uri`, на `ruby` можно следующим образом:

```bash
file = Base64.decode64(params[:cropped_file].split(',')[1])
```

### События

* `complete` — вызывается после успешного кадрирования

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

На скриншоте представлен внешний вид по умолчанию.

![Скриншот](https://github.com/inferno/cropbox/raw/master/images/view.jpg "Скриншот")

## Поддержка в браузерах

Скрипт поддерживает все браузеры, имеющие реализацию `canvas`.

* Firefox
* Opera
* Safari и Chrome
* Internet Explorer 9+
