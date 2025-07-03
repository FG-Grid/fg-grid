(()=> {
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

  const {
    ROW
  } = Fancy.cls;

  /**
   * @mixin GridMixinKeyNavigation
   */

  const GridMixinKeyNavigation = {
    initKeyNavigation(){
      const me = this;

      document.body.addEventListener('keydown', me.onKeyDown.bind(me));
    },
    onKeyDown(event){
      const me = this;

      switch (event.keyCode){
        case C:
          if(event.ctrlKey || event.metaKey){
            me.copySelectedCells();
          }
          break;
        case V:
          if(me.activeCell && me.activeCellEl && (event.ctrlKey || event.metaKey)){
            me.insertCopiedCells();
          }
          break;
        case ESC:
          if(!me.isEditing) {
            me.destroyHeaderCellMenuList();
          }
          break;
        case SPACE:
          event.preventDefault();
          if(me.activeCell && me.activeCellEl){
            const cell = me.activeCellEl;
            const columnIndex = Number(cell.getAttribute('col-index'));
            const column = me.columns[columnIndex];
            const row = cell.closest(`.${ROW}`);
            const itemId = row.getAttribute('row-id');
            const item = me.store.idItemMap.get(itemId)
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
          if(!me.isEditing) {
            me.onKeyLEFT(event.shiftKey);
          }
          break;
        case RIGHT:
          if(!me.isEditing) {
            me.onKeyRIGHT(event.shiftKey);
          }
          break;
        case ENTER:
          if(!me.isEditing){
            me.onKeyENTER();
          }
          break;
        case BACKSPACE:
        case DELETE:
          if(!me.isEditing){
            me.setBlankForSelectedCells();
          }
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
        if(shift){
          me.setShiftCellUp();
        } else {
          me.setActiveCellUp();
        }
      }
    },
    onKeyDOWN(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        if(shift){
          me.setShiftCellDown();
        } else {
          me.setActiveCellDown();
        }
      }
    },
    onKeyLEFT(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        if(shift){
          me.setShiftCellLeft();
        } else {
          me.setActiveCellLeft();
        }
      }
    },
    onKeyRIGHT(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        if(shift){
          me.setShiftCellRight();
        } else {
          me.setActiveCellRight();
        }
      }
    },
    onKeyENTER(){
      const me = this;

      if(me.$preventOpeningEditor){
        delete me.$preventOpeningEditor;
        return;
      }

      if(me.activeCellEl){
        if(me.editingCell?.getAttribute('id') === me.activeCellEl.getAttribute('id')){
          return;
        }
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
          if(shift){
            me.setActiveCellLeft();
          } else {
            me.setActiveCellRight();
          }
        }
      }
    }
  }

  Object.assign(Grid.prototype, GridMixinKeyNavigation);

})();
