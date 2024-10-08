(()=> {

  const GridMixinScroll = {
    initScroller() {
      const me = this;

      me.scroller = new Fancy.Scroller({
        grid: me
      });
    },

    onMouseWheel(event) {
      const me = this;

      event.preventDefault();

      me.wheelScrolling = true;

      if(Math.abs(event.deltaY) > Math.abs(event.deltaX)){
        // Vertical scroll
        me.scroller.deltaChange(event.wheelDelta);
        me.bodyInnerEl.scrollTop = me.scroller.scrollTop;
      }
      else{
        // Horizontal scroll
        me.scroller.horizontalDeltaChange(event.wheelDelta);
        me.bodyInnerEl.scrollLeft = me.scroller.scrollLeft;
      }

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
  }

  Object.assign(Grid.prototype, GridMixinScroll);

})();
