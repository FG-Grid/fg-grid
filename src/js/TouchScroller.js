(()=>{

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

      me.element.addEventListener('touchstart', me.touchStartHandler);
      me.element.addEventListener('touchmove', me.touchMoveHandler);
      me.element.addEventListener('touchend', me.touchEndHandler);
    }

    touchStart(e) {
      const me = this;

      delete me.direction;

      me.startY = e.touches[0].pageY;
      me.startX = e.touches[0].pageX;

      me.velocityX = 0;
      me.velocityY = 0;
      me.lastMoveTime = Date.now();

      if (me.intervalId) {
        clearInterval(me.intervalId);
        delete me.intervalId;
      }
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
        if(Math.abs(deltaY) > Math.abs(deltaX)){
          me.direction = 'vertical';
        } else {
          me.direction = 'horizontal';
        }
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
      //let deceleration = 0.95; // Deceleration factor
      //let threshold = 0.5;     // Minimum speed to stop

      let deceleration = 0.98; // Deceleration factor
      //let threshold = 0.01;     // Minimum speed to stop
      let threshold = 0.2;     // Minimum speed to stop

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
          requestAnimationFrame(()=> {
            requestAnimationFrame(step);
          });
        }
        //}, intervalDuration);
      }

      requestAnimationFrame(step);
    }

    touchEnd() {
      const me = this;

      // Smooth continuation of the scroll
      me.smoothScroll();
    }

    destroy() {
      const me = this;

      me.element.removeEventListener('touchstart', me.touchStartHandler);
      me.element.removeEventListener('touchmove', me.touchMoveHandler);
      me.element.removeEventListener('touchend', me.touchEndHandler);

      if (me.intervalId) {
        clearInterval(me.intervalId);
      }
    }
  }

  Fancy.TouchScroller = TouchScroller;

})();
