(() => {
  /**
   * @mixin GridMixinScroll
   */
  const GridMixinScroll = {
    initScroller() {
      this.scroller = new Fancy.Scroller({
        grid: this
      });
    },
    onMouseWheel(event) {
      const me = this;
      const delta = 'wheelDelta' in event ? event.wheelDelta : event.deltaY;
      let changed = false;

      me.wheelScrolling = true;

      if(Math.abs(event.deltaY) > Math.abs(event.deltaX)){
        // Vertical scroll
        changed = me.scroller.deltaChange(delta);
        me.bodyInnerEl.scrollTop = me.scroller.scrollTop;
      } else {
        // Horizontal scroll
        changed = me.scroller.horizontalDeltaChange(delta);
        me.bodyInnerEl.scrollLeft = me.scroller.scrollLeft;
      }

      changed && event.preventDefault();

      cancelAnimationFrame(me.animationRenderId);

      me.animationRenderId = requestAnimationFrame(() => {
        me.renderVisibleRows();
      });

      cancelAnimationFrame(me.animationRemoveId);

      me.animationRemoveId = requestAnimationFrame(() => {
        me.removeNotNeededRows();
      });

      me.debouceClearWheelScrollingFn();
    },
    onTouchScroll(event){
      const me = this;
      let changed = false;

      me.wheelScrolling = true;

      if(Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        // Vertical scroll
        changed = me.scroller.deltaChange(event.deltaY);
        me.bodyInnerEl.scrollTop = me.scroller.scrollTop;
      } else if(event.deltaX) {
        // Horizontal scroll
        changed = me.scroller.horizontalDeltaChange(event.deltaX);
        me.bodyInnerEl.scrollLeft = me.scroller.scrollLeft;
      }

      changed && event.preventDefault?.();

      cancelAnimationFrame(me.animationRenderId);

      me.animationRenderId = requestAnimationFrame(() => {
        me.renderVisibleRows();
      });

      cancelAnimationFrame(me.animationRemoveId);

      me.animationRemoveId = requestAnimationFrame(() => {
        me.removeNotNeededRows();
      });

      me.debouceClearWheelScrollingFn();
    },
    clearWheelScrolling() {
      delete this.wheelScrolling;
    }
  };

  Object.assign(Grid.prototype, GridMixinScroll);
})();
