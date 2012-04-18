// ## TODO
// * переписать слайдер без использования jquery-ui
// * найти текстуру для фона
// * доступ к объекту и show/hide

!(function($){


  // ## Конструктор
  var CropBox = function(element, options){

    this.element = $(element);

    // Объединяем опции со значениями по умолчанию.
    this.options = $.extend({}, $.fn.cropBox.defaults, options);

    // Финальные размеры картинки, если их нет, используем значения по умолчанию.
    if ( this.element.data('size') ) {
      var size = this.element.data('size').split('x');
      this.options.width = parseInt(size[0]);
      this.options.height = parseInt(size[1]);
    }

    // Размеры виджета, если размеры не установлены, используем финальные размеры картинки.
    if ( this.element.data('size-preview') ) {
      var sizePreview = this.element.data('size-preview').split('x');
      this.options.previewWidth = sizePreview[0];
      this.options.previewHeight = sizePreview[1];
    } else {
      this.options.previewWidth = this.options.width;
      this.options.previewHeight = this.options.height;
    }

    if ( this.element.data('aspect') ) this.options.aspect = this.element.data('aspect');
    if ( this.element.data('url') ) this.options.url = this.element.data('url');

    this.options.defaultAspect = this.options.aspect + .2;

    this.holder = this.build();

    this.toggle();
    this.setPosition();

    this.repositeSelected(100 * this.options.defaultAspect);
    this.slider.slider('option', 'min', 100 * this.options.aspect);
    this.slider.slider('value', 100 * this.options.defaultAspect);

    // Удаляем старые события и навешиваем новые актуальные.
    this.slider.off('slide');
    this.send.off('click');

    this.slider.on('slide', $.proxy(this.onSlide, this));
    this.send.on('click', $.proxy(this.onSend, this));

  };

  // ## Методы
  CropBox.prototype = {

    // Позиционирует блок относительно якоря и устанавливает необходимые размеры виджета.
    setPosition: function() {

      var position = this.element.position();

      // Определяем, в какую сторону выбрасывать блок — в левую или в правую.
      var left = position.left + this.element.width() + 5;
      if ( left + parseInt(this.options.previewWidth) > $(document).width() ) {
        left = position.left - 10 - this.options.previewWidth;
      }

      this.holder.css({
        left: left,
        top: position.top
      });

      this.area.css({
        width: this.options.previewWidth,
        height: this.options.previewHeight
      });

      this.image.css({
        width: this.options.previewWidth,
        left: 0,
        top: 0
      });

      this.image.attr('src', this.element.data('crop'));
    },

    // Показывает или скрывает виджет.
    toggle: function() {

      var method;

      this.holder.toggle();

      // По клику на тело документа закрываем блок.
      if ( this.holder.is(':visible') ) {
        $(document).on('click.cropbox', $.proxy(function(){
          $(document).off('click.cropbox');
          this.toggle();
        }, this));

        method = 'show';
      } else method = 'hide';
      this.element.trigger(method);

    },

    // Возвращает сконструированный виджет, в случае, если он
    // был инициализирован ранее, возвращает его.
    build: function() {
      var holder;

      if ( $('#crop-box').length ) {

        holder = $('#crop-box');

        this.area = holder.find('.b-crop-box__area');
        this.image = holder.find('.b-crop-box__image');
        this.selected = holder.find('.b-crop-box__selected');
        this.masks = holder.find('.b-crop-box__mask');
        this.slider = holder.find('.b-crop-box__slider');
        this.send = holder.find('.b-crop-box__send');

      } else {

        holder = $('<div/>', {
          'class': 'b-crop-box',
          id: 'crop-box'
        }).hide().appendTo('body');

        holder.append('<div class="b-crop-box__area"><img class="b-crop-box__image"/>' +
          '<div class="b-crop-box__mask left"/><div class="b-crop-box__mask right"/>' +
          '<div class="b-crop-box__mask top"/><div class="b-crop-box__mask bottom"/>' +
          '<div class="b-crop-box__selected"/></div>' +
          '<div class="b-crop-box__panel"><div class="b-crop-box__slider b-crop-box__track">' +
          '<i class="b-crop-box__track"/></div><span class="b-crop-box__send"/></div>');

        holder.on('click', function(e){
          e.stopPropagation();
        });

        this.masks = holder.find('.b-crop-box__mask');
        this.area = holder.find('.b-crop-box__area');
        this.image = holder.find('.b-crop-box__image');
        this.selected = holder.find('.b-crop-box__selected');
        this.send = holder.find('.b-crop-box__send');
        this.slider = holder.find('.b-crop-box__slider');

        this.addDragBehaviour();

        this.slider.slider({ max: 100 });

      }
      return(holder);
    },

    // Процедура кадрирования картинки с последующей отправкой на сервер.
    onSend: function() {
      var c = $('<canvas/>').hide().appendTo('body')[0];

      c.width = this.options.previewWidth;
      c.height = this.options.previewHeight;

      var ctx = c.getContext('2d');

      var p = this.image.position();
      var s = this.selected.position();

      var width = this.selected.width();
      var height = this.selected.height();

      ctx.drawImage(this.image[0], p.left, p.top, this.image.width(), this.image.height());
      ctx.drawImage(c, s.left, s.top, width, height, 0, 0, this.options.width, this.options.height);


      var out = $('<canvas/>').hide().appendTo('body')[0];

      out.width = this.options.width;
      out.height = this.options.height;

      var cto = out.getContext('2d');

      cto.drawImage(c, 0, 0, this.options.width, this.options.height, 0, 0, this.options.width, this.options.height);

      $.post(this.options.url, {
        cropped_file: out.toDataURL('image/png')
      }, $.proxy(function(content){
        this.element.trigger('complete', content);
      }, this));

      $(out).remove();
      $(c).remove();

    },

    // Инициализация D&D поведение для фотографии.
    addDragBehaviour: function() {

      this.area.on('mousedown', $.proxy(function(e){

        this.area.addClass('b-crop-box__area_down');

        this.start = {
          left: e.clientX - this.holder.position().left - this.image.position().left,
          top: e.clientY - this.holder.position().top - this.image.position().top
        };

        $(document).on('mousemove.cropbox', $.proxy(function(e){

          var left = e.clientX - this.start.left - this.holder.position().left,
              top = e.clientY - this.start.top - this.holder.position().top;

          this.image.css({
            left: left,
            top: top
          });

        }, this));

        $(document).on('mouseup.cropbox', $.proxy(function(){
          this.area.removeClass('b-crop-box__area_down');
          $(document).off('mousemove.cropbox');
          $(document).off('mouseup.cropbox');
        }, this));

        e.preventDefault();

      }, this));
    },


    // Рисует зону выбора. Зона выбора представляет собой маску состоящую
    // из 4-х слоев. **value** — значение слайдера, [this.options.aspect*100...100],
    // 100 — зона выбора растянута на весь блок.
    repositeSelected: function(value) {

      var width = Math.floor(this.options.width * value/100);
      var height = Math.floor(this.options.height * value/100);

      this.selected.css({
        width: width,
        height: height,
        left: Math.floor(this.area.width()/2 - width/2),
        top: Math.floor(this.area.height()/2 - height/2)
      });

      // Рисуем маску, состоящую из четырех слоев.
      this.masks.eq(0).css({ // Верх
        left: this.selected.position().left,
        top: 0,
        width: width,
        height: this.selected.position().top
      });

      this.masks.eq(1).css({ // Низ
        left: this.selected.position().left,
        bottom: 0,
        width: width,
        height: this.selected.position().top
      });

      this.masks.eq(2).css({ // Левый блок
        left: 0,
        top: 0,
        width: this.selected.position().left,
        height: '100%'
      });

      this.masks.eq(3).css({ // Правый блок
        right: 0,
        top: 0,
        width: this.area.width() - width - this.selected.position().left,
        height: '100%'
      });

    },

    // Реакция на перемещение слайдера.
    onSlide: function(e, ui) {
      var value = ui.value;
      this.repositeSelected(value);
    }

  };

  // Создаем jQuery плагин.
  $.fn.cropBox = function(options) {
    return this.each(function(){
      $(this).data('crop-box', (new CropBox(this, options)));
    });
  };

  // Значения по умолчанию.
  $.fn.cropBox.defaults = {
    width:          260,    // размер по горизонтали
    height:         350,    // размер по вертикали
    aspect:         .5,     // ???
    url:            '/crop' // url, который будет сохранять кадрированный файл
  };

  $(function(){

    $('body').on('click', '[data-crop]', function(e){
      $(this).cropBox({});
      e.stopPropagation();
    });

  })

})(window.jQuery);





