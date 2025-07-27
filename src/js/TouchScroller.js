(() => {
  const { EL } = Fancy;

  class TouchScroller {
    constructor(element, config) {
      const me = this;

      Object.assign(me, config);

      me.element = element;
      me.startY = 0;
      me.startX = 0;

      me.velocityX = 0;
      me.velocityY = 0;
      me.lastMoveTime = 0;

      me.touchStartHandler = me.touchStart.bind(me);
      me.touchMoveHandler = me.touchMove.bind(me);
      me.touchEndHandler = me.touchEnd.bind(me);

      me.init();
    }
    init() {
      const me = this;
      const el = EL(me.element);

      el.on('touchstart', me.touchStartHandler);
      el.on('touchmove', me.touchMoveHandler);
      el.on('touchend', me.touchEndHandler);
    }
    touchStart(e) {
      const me = this;

      delete me.direction;

      me.startY = e.touches[0].pageY;
      me.startX = e.touches[0].pageX;

      me.velocityX = 0;
      me.velocityY = 0;
      me.lastMoveTime = Date.now();

      me.intervalId && clearInterval(me.intervalId);
    }
    touchMove(e) {
      const me = this;
      const currentY = e.touches[0].pageY;
      const currentX = e.touches[0].pageX;
      const now = Date.now();

      const deltaY = currentY - me.startY;
      const deltaX = currentX - me.startX;
      const timeDelta = now - me.lastMoveTime;

      // Calculating the velocity
      me.velocityX = deltaX / timeDelta;
      me.velocityY = deltaY / timeDelta;

      // Updating coordinates for the next event
      me.startY = currentY;
      me.startX = currentX;
      me.lastMoveTime = now;

      if(!me.direction){
        me.direction = Math.abs(deltaY) > Math.abs(deltaX)? 'vertical': 'horizontal';
      }

      if(me.direction === 'vertical'){
        Object.assign(e, {
          deltaX: 0,
          deltaY
        });
      } else {
        Object.assign(e, {
          deltaX,
          deltaY: 0
        });
      }

      me.onTouchScroll(e);
    }
    smoothScroll() {
      const me = this;
      const deceleration = 0.98; // Deceleration factor
      const threshold = 0.2;     // Minimum speed to stop

      //let intervalDuration = 16;

      //me.intervalId = setInterval(() => {
      const step = () => {
        me.velocityX *= deceleration;
        me.velocityY *= deceleration;

        if (me.direction === 'vertical') {
          me.onTouchScroll({
            deltaX: 0,
            deltaY: me.velocityY * 10
          });
        } else {
          me.onTouchScroll({
            deltaX: me.velocityX * 10,
            deltaY: 0
          });
        }

        // Continue scrolling until the speed exceeds the threshold
        if(Math.abs(me.velocityX) <= threshold && Math.abs(me.velocityY) <= threshold){
          //clearInterval(me.intervalId);
          //delete me.intervalId;
        } else {
          requestAnimationFrame(() => {
            requestAnimationFrame(step);
          });
        }
        //}, intervalDuration);
      };

      requestAnimationFrame(step);
    }
    touchEnd() {
      // Smooth continuation of the scroll
      this.smoothScroll();
    }
    destroy() {
      const me = this;
      const el = EL(me.element);

      el.un('touchstart', me.touchStartHandler);
      el.un('touchmove', me.touchMoveHandler);
      el.un('touchend', me.touchEndHandler);

      me.intervalId && clearInterval(me.intervalId);
    }
  }

  Fancy.TouchScroller = TouchScroller;
})();
