(()=> {
  const {
    CELL,
    ROW,
    EDITING
  } = Fancy.cls;

  const GridMixinEdit = {
    onBodyCellDBLClick(event){
      const me = this;
      const target = event.target;
      const cell = target.closest(`.${CELL}`);

      me.openEditorForCell(cell);
    },

    openEditorForCell(cell){
      const me = this;
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];
      let row = cell.closest(`.${ROW}`);
      const itemId = row.getAttribute('row-id');
      const rowIndex = row.getAttribute('row-index');
      const item = me.store.idItemMap.get(itemId);
      const value = item[column.index];
      const rowTop = Fancy.getTranslateY(row);

      if(column.editable !== true){
        me.hideActiveEditor();
        return;
      }

      if(column.editorField){
        switch (column.type){
          case 'string':
          case 'number':
            me.setStatusEditing(true);

            column.editorField.setValue(value);
            column.editorField.show({
              width: `${column.width}px`,
              left: `${column.left}px`,
              transform: `translateY(${rowTop - 1}px)`,
            });
            column.editorField.focus();

            me.activeEditor = column.editorField;
            break;
        }
      }
      else{
        switch(column.type){
          case 'string':
          case 'number':
            me.setStatusEditing(true);
            column.editorField = new Fancy[Fancy.capitalizeFirstLetter(`${column.type}Field`)]({
              renderTo: me.editorsContainerEl,
              value,
              style: {
                position: 'absolute',
                width: `${column.width}px`,
                left: `${column.left}px`,
                transform: `translateY(${rowTop - 1}px)`,
                height: `${me.rowHeight + 1}px`
              },
              onChange(value, fromTyping){
                if(fromTyping === false){
                  return;
                }

                // Re-get cell on case of scroll
                if(me.activeCellEl){
                  cell = me.activeCellEl;
                  row = cell.closest(`.${ROW}`);
                }

                me.store.setById(itemId, column.index, value);
                cell?.remove();

                cell = me.createCell(rowIndex, columnIndex);
                me.activeCellEl = cell;
                row.appendChild(cell);
              },
              onEnter(){
                me.hideActiveEditor();
                let activeCell = false;
                switch (me.editorEnterAction){
                  case 'down':
                    activeCell = me.setActiveCellDown();
                    break;
                  case 'right':
                    activeCell = me.setActiveCellRight();
                    break;
                }

                if(activeCell === false){
                  me.$preventOpeningEditor = true;
                  setTimeout(()=>{
                    delete me.$preventOpeningEditor;
                  }, 100);
                }
              },
              onESC(){
                me.hideActiveEditor();
              }
            });
            column.editorField.focus();

            me.activeEditor = column.editorField;
            break;
          default:
            me.hideActiveEditor();
        }
      }
    },

    hideActiveEditor(){
      const me = this;

      if(me.activeEditor){
        me.activeEditor.hide();
        delete me.activeEditor;
        me.setStatusEditing(false);
      }
    },

    setStatusEditing(value){
      const me = this;

      me.isEditing = value;

      if(value){
        me.gridEl.classList.add(EDITING);
        me.editingCell = me.activeCellEl;
      }
      else{
        me.gridEl.classList.remove(EDITING);
        delete me.editingCell;
      }
    }
  }

  Object.assign(Grid.prototype, GridMixinEdit);
})();
