(()=>{

  class TouchScroller {
    constructor(element, config) {
      const me = this;

      Object.assign(me, config);

      me.element = element;
      me.startY = 0;
      me.startX = 0;
      me.scrollTop = 0;
      me.scrollLeft = 0;

      me.touchStartHandler = me.touchStart.bind(me);
      me.touchMoveHandler = me.touchMove.bind(me);
      me.touchEndHandler = me.touchEnd.bind(me);

      me.init();
    }

    init() {
      const me = this;

      me.element.addEventListener('touchstart', me.touchStartHandler);
      me.element.addEventListener('touchmove', me.touchMoveHandler);
      me.element.addEventListener('touchend', me.touchEndHandler);
    }

    touchStart(e) {
      const me = this;

      me.startY = e.touches[0].pageY;
      me.startX = e.touches[0].pageX;
    }

    touchMove(e) {
      const me = this;
      const deltaY = e.touches[0].pageY - me.startY;
      const deltaX = e.touches[0].pageX - me.startX;

      me.startY = e.touches[0].pageY;
      me.startX = e.touches[0].pageX;

      Object.assign(e, {
        deltaX,
        deltaY
      });

      me.onTouchScroll(e);
    }

    touchEnd() {}

    destroy() {
      const me = this;

      me.element.removeEventListener('touchstart', me.touchStartHandler);
      me.element.removeEventListener('touchmove', me.touchMoveHandler);
      me.element.removeEventListener('touchend', me.touchEndHandler);
    }
  }

  Fancy.TouchScroller = TouchScroller;

})();
