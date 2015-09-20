((window, $) => {
  const clickHandlers = {
    toggleActive(evt, elem) {
      const $target = $(elem);
      if ($target.hasClass('active')) {
        $target.removeClass('active');
        return;
      }

      if ($target.data('top') && Math.max(document.documentElement.clientWidth, window.innerWidth || 0) <= 992) {
        $('html, body').animate({
          scrollTop: $target.offset().top - 100,
        }, 300);
      }
      $target.addClass('active');
      return;
    },
    handleSubmit(evt) {
      const $target = $(evt.target);
      // get all items with a pattern
      // iterate through and validate entered items
      const failedChildren = _.filter($target.children('[data-regex]'), (val) => {
        const regExp = new RegExp($(val).data('regex'));
        return !regExp.test($(val).val());
      });
      if (failedChildren.length > 0) {
        // we have a failure
        // prevent the form from submitting
        evt.preventDefault();

        _.each(failedChildren, (child) => {
          $(child).addClass('error');
        });
      }
    },
  };

  $(document).ready(() => {
    $(document).on('click', '[data-handler]', (e) => {
      const $this = e.currentTarget;
      const handler = $this.getAttribute('data-handler');

      if ($this.tagName === 'A' && (e.metaKey || e.ctrlKey || e.shiftKey)) {
        return;
      }

      if (clickHandlers && typeof clickHandlers[handler] === 'function') {
        clickHandlers[handler].call($this, event, $this);
      }
    });
    $(document).on('scroll', () => {
      if ($(document).scrollTop() > 0) {
        $('[data-handler="scroll"]').addClass('active');
      } else {
        $('[data-handler="scroll"]').removeClass('active');
      }
    });
    $(document).on('submit', '[data-submit]', clickHandlers.handleSubmit);
  });
})(window, jQuery);
