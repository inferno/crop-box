# jQuery CropBox — кадрирование картинок с использованием `canvas`.

![Скриншот](https://github.com/inferno/crop-box/raw/master/images/view-02.png "Скриншот")

Скрипт позволяет кадрировать картинку используя заранее определенные пропорции.

## Как это работает?

Скрипт написан с использованием `jQuery` и небольшой части `jQuery UI`.

В секцию `head` необходимо подключить `jQuery` и `jQuery UI` (используется только слайдер) например вот так:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js" type="text/javascript"></script>
```

Дальше необходимо подключить `jquery.cropbox.js` и `crop-box.css` из папки `public`:

```html
<script src="js/jquery.cropbox.js" type="text/javascript"></script>
<link href="css/crop-box.css" rel="stylesheet" type="text/css">
```

В качестве якоря для виджета используется любой html-элемент. Якорь должен содержать как минимум один обязательный data-атрибут (`data-crop`). Пример:

```html
<div data-crop="img/navalny.png" data-size="100x100" data-size-preview="260x310" data-aspect="0.5" data-url="/upload"></div>
```

### Атрибуты

* `data-crop` — `url` картинки для кадрирования. Единственный обязательный параметр.
* `data-size` — размеры картинки, которая должна получиться после кадрирования
* `data-size-preview` — размеры превьюшечки
* `data-aspect` — [0...1], показывает то, насколько можно будет сжать зону выбора
* `data-url` — серверный скрипт, который будет принимать картинку, закодированную в `data-uri`, ответ приходит в параметре с названием `cropped_file`

Если разобрать пример выше, мы будем кадрировать `img/navalny.png`, у нас получится картинка с размерами `100x100`, минимальная часть, которую мы сможем выбрать на картинке будет равна `50%` от `260x310`, итоговую картинку получит скрипт, расположенный по адресу `/upload`.

Картинку, пришедшую на сервер нужно разобрать, она закодирована в `data-uri`. На `ruby` можно следующим образом:

```bash
file = Base64.decode64(params[:cropped_file].split(',')[1])
```

### События

Доступны следующие события: `complete`, `show` и `hide`.

Привязать событие можно следующим образом:

```javascript
$('#anchor').on('complete', function(e, file){
  console.info(file);
});
```

## Тестирование возможностей

Вы можете быстро увидеть работу виджета в действии, для этого, у вас должен быть установлен интерпритатор Ruby.

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

На скриншоте представлен внешний вид по умолчанию. Изменяя `crop-box.css` вы можете легко стилизовать виджет.

![Скриншот](https://github.com/inferno/crop-box/raw/master/images/view-01.png "Скриншот")

## Поддержка браузеров

Скрипт поддерживает все браузеры, имеющие реализацию `canvas`.

* Firefox
* Opera
* Safari и Chrome
* Internet Explorer 9+

## Авторство
Copyright &copy; Konstantin Savelyev