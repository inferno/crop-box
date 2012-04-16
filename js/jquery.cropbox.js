!(function($){

  var CropBox = function(element, options){
    this.element = $(element);
    this.options = $.extend({}, $.fn.cropBox.defaults, options);

    this.holder = this.build();

    this.toggle();
    this.setPosition();

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

      this.image.css('width', this.options.width);
      $(this.image).attr('src', this.element.data('crop'));

      this.selected.width(this.options.width);

    },

    toggle: function() {
      this.holder.toggle();
    },

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
        holder.append('<div class="b-crop-box__area"><img class="b-crop-box__image"/><div class="b-crop-box__selected"/></div><div class="b-crop-box__panel"><div class="b-crop-box__slider"/>"</div>');

        this.area = holder.find('.b-crop-box__area');
        this.image = holder.find('.b-crop-box__image');
        this.selected = holder.find('.b-crop-box__selected');

        this.area.on('mousedown', $.proxy(function(e){
          this.start = {
            left: e.offsetX,
            top: e.offsetY
          };

          $(document).on('mousemove', $.proxy(function(e){

            this.image.css({
              left: e.clientX - this.start.left - this.holder.position().left,
              top: e.clientY - this.start.left - this.holder.position().top
            });

            $(document).on('mouseup', function(){
              $(document).off('mousemove');
            });

          }, this));

          e.preventDefault();

        }, this));

        this.slider = holder.find('.b-crop-box__slider');

        this.slider.slider({
          slide: $.proxy(this.onSlide, this),
          value: this.options.width,
          max: this.options.width
        });


      }
      return(holder);
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
    },

  };

  $.fn.cropBox = function(options) {
    return this.each(function(){
      $(this).data('cropBox', (new CropBox(this, options)))
    });
  };

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





