/**
 * TODO: минимальное значение зоны выбора в процентах
 * TODO: документирование кода
 * TODO: опции из data атрибута
 * TODO: переписать слайдер без использования jquery-ui
 * TODO: позиционирование блока относительно якоря верх/низ/право/лево
 * TODO: крест,маркирующий центр
 */

!(function($){

  /**
   * Конструктор
   *
   * @param element элемент, для которого конструируем
   * @param options набор опций, смешивается со значениями по дефаулту
   */
  var CropBox = function(element, options){

    this.element = $(element);
    this.options = $.extend({}, $.fn.cropBox.defaults, options);

    this.holder = this.build();

    this.toggle();
    this.setPosition();
    this.repositeSelected(100 * this.options.defaultAspect);

    this.slider.slider('option', 'min', 100 * this.options.aspect);

  };

  CropBox.prototype = {

    setPosition: function() {

      var position = this.element.position();
      this.holder.css({
        left: position.left,
        top: position.top + this.element.height(),
      });

      this.area.css({
        width: this.options.width,
        height: this.options.height
      });

      this.image.css({
        width: this.options.width,
        left: 0,
        top: 0
      });
      this.image.attr('src', this.element.data('crop'));

      this.selected.width(this.options.width);

    },

    toggle: function() {
      this.holder.toggle();
    },

    /**
     * Инициализируем CropBox как синглетон
     * @return {*}
     */
    build: function() {
      var holder;

      if ( $('#crop-box').length ) {
        holder = $('#crop-box');

        this.area = holder.find('.b-crop-box__area');
        this.image = holder.find('.b-crop-box__image');
        this.selected = holder.find('.b-crop-box__selected');
        this.masks = holder.find('.b-crop-box__mask');
        this.slider = holder.find('.b-crop-box__slider');

      } else {
        holder = $('<div/>', {
          'class': 'b-crop-box',
          id: 'crop-box'
        }).hide().appendTo('body');

        holder.append('<div class="b-crop-box__area"><img class="b-crop-box__image"/>' +
          '<div class="b-crop-box__mask left"/><div class="b-crop-box__mask right"/><div class="b-crop-box__mask top"/><div class="b-crop-box__mask bottom"/>' +
          '<div class="b-crop-box__selected"/></div>' +
          '<div class="b-crop-box__panel"><div class="b-crop-box__slider"/></div>');


        this.masks = holder.find('.b-crop-box__mask');
        this.area = holder.find('.b-crop-box__area');
        this.image = holder.find('.b-crop-box__image');
        this.selected = holder.find('.b-crop-box__selected');

        this.slider = holder.find('.b-crop-box__slider');

        this.addDragBehaviour();

        this.slider.slider({
          slide: $.proxy(this.onSlide, this),
          max: 100
        });


      }
      return(holder);
    },

    /**
     * Инициализация D&D поведение для фотографии
     */
    addDragBehaviour: function() {

      this.area.on('mousedown', $.proxy(function(e){

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

        $(document).on('mouseup.cropbox', function(){
          $(document).off('mousemove.cropbox');
          $(document).off('mouseup.cropbox');
        });

        e.preventDefault();

      }, this));
    },

    /**
     * Рисует выбранную зону. Выбранная зона представляет собой маску состоящую
     * из 4-х слоев.
     *
     * @param value значение бегунка, [this.options.aspect...100], 100 — вся зона выбрана
     */
    repositeSelected: function(value) {

      /**
       * Убираем бордюр на максимальном значении
       */
      if ( 100 == value ) {
        this.selected.addClass('b-crop-box__selected_max');
      } else this.selected.removeClass('b-crop-box__selected_max');

      var width = Math.floor(this.options.width * value/100);
      var height = Math.floor(this.options.height * value/100);

      this.selected.css({
        width: width,
        height: height,
        left: Math.floor(this.area.width()/2 - width/2),
        top: Math.floor(this.area.height()/2 - height/2)
      });

      /**
       * Рисуем маску, состоящую из четырех слоев
       */
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

    /**
     * Каждый тик слайдера перерисовываем выбранную зону.
     * @param e событие
     * @param ui
     */
    onSlide: function(e, ui) {
      var value = ui.value;
      this.repositeSelected(value);
    }

  };

  $.fn.cropBox = function(options) {
    return this.each(function(){
      $(this).data('crop-box', (new CropBox(this, options)))
    });
  };

  /**
   * Установки по дефаулту
   */
  $.fn.cropBox.defaults = {
    width:          260,  // необходимый финальный рзамер по горизонтали
    height:         310,  // финальный размер по вертикали
    aspect:         .5,   // минимальный коэффициент сжатия, т.е. слайдером можно будет отрегулировать размер на 50%
    defaultAspect:  .7    // значение сжатия по умолчанию
  };

  $(function(){

    $('body').on('click', '[data-crop]', function(){
      $(this).cropBox({});
    });

  })

})(window.jQuery);





