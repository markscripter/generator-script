((window, $) => {
  $(document).ready( () => {
    // Get Carousel
    const $carousel = $('.carousel');
    const $carouselMultiple = $('.carousel-multiple');

    // setup event bindings
    $carousel.on('init reInit afterChange', (event, slick) => {
      // if we are displaying the item count
      if ($('.item-count').length) {
        // output the items
        $('.item-count .current').html(slick.currentSlide + 1);
        $('.item-count .total').html(slick.slideCount);
      }
    });

    // initialize carousel(s)
    $carousel.slick({
      prevArrow: '.carousel ~ .arrows .arrows-prev',
      nextArrow: '.carousel ~ .arrows .arrows-next',
    });

    $carouselMultiple.slick({
      prevArrow: '.carousel-multiple + .arrows .arrows-prev',
      nextArrow: '.carousel-multiple + .arrows .arrows-next',
    });
  });
})(window, jQuery);
