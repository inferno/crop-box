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
    this.repositeSelected(this.options.width);

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
        'width': this.options.width,
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

      } else {
        holder = $('<div/>', {
          'class': 'b-crop-box',
          id: 'crop-box'
        }).hide().appendTo('body');

        holder.append('<div class="b-crop-box__area"><img class="b-crop-box__image"/><div class="b-crop-box__selected"/></div>' +
          '<div class="b-crop-box__panel"><div class="b-crop-box__slider"/>"</div>');

        this.area = holder.find('.b-crop-box__area');
        this.image = holder.find('.b-crop-box__image');
        this.selected = holder.find('.b-crop-box__selected');

        this.slider = holder.find('.b-crop-box__slider');

        this.addDragBehaviour();

        this.slider.slider({
          slide: $.proxy(this.onSlide, this),
          value: this.options.width,
          max: this.options.width
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

          this.image.css({
            left: e.clientX - this.start.left - this.holder.position().left,
            top: e.clientY - this.start.top - this.holder.position().top
          });

        }, this));

        $(document).on('mouseup.cropbox', function(){
          $(document).off('mousemove.cropbox');
          $(document).off('mouseup.cropbox');
        });

        e.preventDefault();

      }, this));
    },

    repositeSelected: function(value) {
      this.selected.css({
        width: value,
        height: value,
        left: this.holder.width()/2 - value/2,
        top: this.holder.height()/2 - value/2
      });
    },

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
    width: 260,
    height: 310
  };

  $(function(){

    $('body').on('click', '[data-crop]', function(){
      $(this).cropBox({});
    });

  })




})(window.jQuery);





