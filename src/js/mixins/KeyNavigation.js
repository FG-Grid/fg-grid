(() => {
  const {
    DOWN,
    UP,
    LEFT,
    RIGHT,
    ESC,
    SPACE,
    C,
    V,
    ENTER,
    TAB,
    DELETE,
    BACKSPACE
  } = Fancy.key;

  const { ROW } = Fancy.cls;

  /**
   * @mixin GridMixinKeyNavigation
   */
  const GridMixinKeyNavigation = {
    initKeyNavigation(){
      document.body.addEventListener('keydown', this.onKeyDown.bind(this));
    },
    onKeyDown(event){
      const me = this;

      switch (event.keyCode){
        case C:
          if (event.ctrlKey || event.metaKey) me.copySelectedCells();
          break;
        case V:
          if(me.activeCell && me.activeCellEl && (event.ctrlKey || event.metaKey)) me.insertCopiedCells();
          break;
        case ESC:
          !me.isEditing && me.destroyHeaderCellMenuList();
          break;
        case SPACE:
          if(me.activeCell && me.activeCellEl && !me.activeEditor){
            event.preventDefault();
            const cell = me.activeCellEl;
            const columnIndex = Number(cell.getAttribute('col-index'));
            const column = me.columns[columnIndex];
            const row = cell.closest(`.${ROW}`);
            const itemId = row.getAttribute('row-id');
            const item = me.store.idItemMap.get(itemId);
            const value = item[column.index];

            if(column.type === 'boolean' && column.editable){
              me.store.setById(itemId, column.index, !value);
              me.activeCellEl.querySelector('input').checked = !value;
            } else if(me.checkboxSelection){
              me.selectRow(cell);
            }
          }
          break;
        case TAB:
          event.preventDefault();
          me.onKeyTAB(event.shiftKey);
          break;
        case DOWN:
          if(!me.isEditing){
            event.preventDefault();
            me.onKeyDOWN(event.shiftKey);
          }
          break;
        case UP:
          if(!me.isEditing) {
            event.preventDefault();
            me.onKeyUP(event.shiftKey);
          }
          break;
        case LEFT:
          !me.isEditing && me.onKeyLEFT(event.shiftKey);
          break;
        case RIGHT:
          !me.isEditing && me.onKeyRIGHT(event.shiftKey);
          break;
        case ENTER:
          !me.isEditing && me.onKeyENTER();
          break;
        case BACKSPACE:
        case DELETE:
          !me.isEditing && me.setBlankForSelectedCells();
          break;
        default:
          const code = event.code;

          if ( !me.activeEditor && (
              (code.startsWith('Key') && code.length === 4) || // KeyA - KeyZ
              (code.startsWith('Digit') && code.length === 6)   // Digit0 - Digit9
            )
          ) {
            if(me.startEditByTyping && me.hasActiveCell()){
              const cell = me.activeCellEl;
              const columnIndex = Number(cell.getAttribute('col-index'));
              const column = me.columns[columnIndex];

              if(column.editable){
                event.preventDefault();
                me.openEditorForCell(me.activeCellEl, event.key);
              }
            }
          }
      }
    },
    onKeyUP(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        shift? me.setShiftCellUp():me.setActiveCellUp();
      }
    },
    onKeyDOWN(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        shift? me.setShiftCellDown():me.setActiveCellDown();
      }
    },
    onKeyLEFT(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        shift?me.setShiftCellLeft():me.setActiveCellLeft();
      }
    },
    onKeyRIGHT(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        shift?me.setShiftCellRight():me.setActiveCellRight();
      }
    },
    onKeyENTER(){
      const me = this;

      if(me.$preventOpeningEditor){
        delete me.$preventOpeningEditor;
        return;
      }

      if(me.activeCellEl){
        if(me.editingCell?.getAttribute('id') === me.activeCellEl.getAttribute('id')) return;

        me.openEditorForCell(me.activeCellEl);
      }
    },
    onKeyTAB(shift){
      const me = this;
      if(me.active && me.hasActiveCell()) {
        if (me.isEditing) {
          me.hideActiveEditor();

          const activeCell = shift? me.setActiveCellLeft() : me.setActiveCellRight();
          activeCell && me.openEditorForCell(me.activeCellEl);
        } else {
          shift? me.setActiveCellLeft():me.setActiveCellRight();
        }
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinKeyNavigation);
})();
