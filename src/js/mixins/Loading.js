(() => {
  /**
   * @mixin GridMixinLoading
   */
  const GridMixinLoading = {
    initLoading(text) {
      this.loading = new Fancy.Loading({
        grid: this,
        text: text
      });
    },
    showLoading(text){
      const me = this;

      if(!me.loading){
        me.initLoading(text);
      } else {
        me.loading.show(text);
      }
    },
    hideLoading(){
      const me = this;
      if(!me.loading){
        return;
      }

      me.loading.hide();
    }
  };

  Object.assign(Grid.prototype, GridMixinLoading);
})();
